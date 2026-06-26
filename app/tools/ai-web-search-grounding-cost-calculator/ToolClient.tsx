"use client";

import { useEffect, useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type SearchPlan = {
  id: string;
  provider: string;
  model: string;
  modelInputPricePerMillion: number;
  modelOutputPricePerMillion: number;
  searchPricePerThousand: number;
  freeGroundedPromptsPerMonth: number;
  retrievedContextBilledAsInput: boolean;
  note: string;
};

type ComparisonRow = SearchPlan & {
  groundedPrompts: number;
  billedSearchQueries: number;
  modelInputTokens: number;
  modelOutputTokens: number;
  searchToolCost: number;
  modelInputCost: number;
  modelOutputCost: number;
  totalMonthlyCost: number;
  firstYearCost: number;
  costPerAllPrompt: number;
  costPerGroundedPrompt: number;
};

const SEARCH_PLANS: SearchPlan[] = [
  {
    id: "openai-gpt-5-4-mini",
    provider: "OpenAI",
    model: "GPT-5.4 mini + Web search",
    modelInputPricePerMillion: 0.75,
    modelOutputPricePerMillion: 4.5,
    searchPricePerThousand: 10,
    freeGroundedPromptsPerMonth: 0,
    retrievedContextBilledAsInput: false,
    note: "Search-content tokens are free",
  },
  {
    id: "anthropic-claude-sonnet-4-6",
    provider: "Anthropic",
    model: "Claude Sonnet 4.6 + Web search",
    modelInputPricePerMillion: 3,
    modelOutputPricePerMillion: 15,
    searchPricePerThousand: 10,
    freeGroundedPromptsPerMonth: 0,
    retrievedContextBilledAsInput: true,
    note: "Retrieved search content is billed as input",
  },
  {
    id: "google-gemini-3-1-flash-lite",
    provider: "Google",
    model: "Gemini 3.1 Flash-Lite + Google Search",
    modelInputPricePerMillion: 0.25,
    modelOutputPricePerMillion: 1.5,
    searchPricePerThousand: 14,
    freeGroundedPromptsPerMonth: 5000,
    retrievedContextBilledAsInput: false,
    note: "5,000 grounded prompts free across Gemini 3",
  },
];

const defaultPlanId = "openai-gpt-5-4-mini";

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function clampPercent(value: string) {
  return Math.min(100, Math.max(0, toNumber(value)));
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "$0.00";

  if (value > 0 && value < 0.01) {
    return `$${value.toFixed(6)}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

function formatVisibleMoney(value: number) {
  return formatMoney(value).replace(/,/g, ",\u200B");
}

function formatVisibleNumber(value: number) {
  return formatNumber(value).replace(/,/g, ",\u200B");
}

function formatVisibleInteger(value: number) {
  return formatInteger(value).replace(/,/g, ",\u200B");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function calculatePlan({
  plan,
  prompts,
  searchShare,
  searchesPerGroundedPrompt,
  retryMultiplier,
  baseInputTokens,
  retrievedContextTokens,
  outputTokens,
}: {
  plan: SearchPlan;
  prompts: number;
  searchShare: number;
  searchesPerGroundedPrompt: number;
  retryMultiplier: number;
  baseInputTokens: number;
  retrievedContextTokens: number;
  outputTokens: number;
}): ComparisonRow {
  const groundedPrompts = prompts * searchShare * retryMultiplier;
  const nonGroundedPrompts =
    prompts * (1 - searchShare) * retryMultiplier;

  const billableGroundedPrompts = Math.max(
    0,
    groundedPrompts - plan.freeGroundedPromptsPerMonth,
  );

  const billedSearchQueries =
    billableGroundedPrompts * searchesPerGroundedPrompt;

  const modelInputTokens =
    (groundedPrompts + nonGroundedPrompts) * baseInputTokens +
    (plan.retrievedContextBilledAsInput
      ? groundedPrompts * retrievedContextTokens
      : 0);

  const modelOutputTokens =
    (groundedPrompts + nonGroundedPrompts) * outputTokens;

  const searchToolCost =
    (billedSearchQueries / 1000) * plan.searchPricePerThousand;

  const modelInputCost =
    (modelInputTokens / 1_000_000) *
    plan.modelInputPricePerMillion;

  const modelOutputCost =
    (modelOutputTokens / 1_000_000) *
    plan.modelOutputPricePerMillion;

  const totalMonthlyCost =
    searchToolCost + modelInputCost + modelOutputCost;

  return {
    ...plan,
    groundedPrompts,
    billedSearchQueries,
    modelInputTokens,
    modelOutputTokens,
    searchToolCost,
    modelInputCost,
    modelOutputCost,
    totalMonthlyCost,
    firstYearCost: totalMonthlyCost * 12,
    costPerAllPrompt:
      prompts > 0 ? totalMonthlyCost / prompts : 0,
    costPerGroundedPrompt:
      groundedPrompts > 0 ? totalMonthlyCost / groundedPrompts : 0,
  };
}

export default function ToolClient() {
  const [selectedPlanId, setSelectedPlanId] =
    useState(defaultPlanId);

  const [monthlyPrompts, setMonthlyPrompts] = useState("100000");
  const [searchTriggerPercent, setSearchTriggerPercent] =
    useState("40");
  const [searchesPerGroundedPrompt, setSearchesPerGroundedPrompt] =
    useState("1.5");
  const [baseInputTokensPerPrompt, setBaseInputTokensPerPrompt] =
    useState("600");
  const [retrievedContextTokensPerPrompt, setRetrievedContextTokensPerPrompt] =
    useState("2500");
  const [outputTokensPerPrompt, setOutputTokensPerPrompt] =
    useState("500");
  const [retryOverheadPercent, setRetryOverheadPercent] =
    useState("3");
  const [monthlyBudget, setMonthlyBudget] = useState("1000");

  const [includeCustom, setIncludeCustom] = useState(false);
  const [customProviderName, setCustomProviderName] =
    useState("Custom Provider");
  const [customModelName, setCustomModelName] =
    useState("Custom Search Model");
  const [customInputPrice, setCustomInputPrice] = useState("");
  const [customOutputPrice, setCustomOutputPrice] = useState("");
  const [customSearchPrice, setCustomSearchPrice] = useState("");
  const [customFreeGroundedPrompts, setCustomFreeGroundedPrompts] =
    useState("0");
  const [customContextBilled, setCustomContextBilled] =
    useState(false);

  const customPlan = useMemo<SearchPlan | null>(() => {
    const ready =
      customInputPrice.trim() !== "" &&
      customOutputPrice.trim() !== "" &&
      customSearchPrice.trim() !== "";

    if (!includeCustom || !ready) {
      return null;
    }

    return {
      id: "custom-provider",
      provider: customProviderName.trim() || "Custom Provider",
      model: customModelName.trim() || "Custom Search Model",
      modelInputPricePerMillion: toNumber(customInputPrice),
      modelOutputPricePerMillion: toNumber(customOutputPrice),
      searchPricePerThousand: toNumber(customSearchPrice),
      freeGroundedPromptsPerMonth: toNumber(
        customFreeGroundedPrompts,
      ),
      retrievedContextBilledAsInput: customContextBilled,
      note: "User-entered current pricing",
    };
  }, [
    customContextBilled,
    customFreeGroundedPrompts,
    customInputPrice,
    customModelName,
    customOutputPrice,
    customProviderName,
    customSearchPrice,
    includeCustom,
  ]);

  const availablePlans = useMemo(
    () => (customPlan ? [...SEARCH_PLANS, customPlan] : SEARCH_PLANS),
    [customPlan],
  );

  const planOptions = useMemo(
    () =>
      availablePlans.map((plan) => ({
        value: plan.id,
        label: `${plan.provider} — ${plan.model}`,
      })),
    [availablePlans],
  );

  useEffect(() => {
    if (
      selectedPlanId === "custom-provider" &&
      !availablePlans.some((plan) => plan.id === "custom-provider")
    ) {
      setSelectedPlanId(defaultPlanId);
    }
  }, [availablePlans, selectedPlanId]);

  const result = useMemo(() => {
    const prompts = toNumber(monthlyPrompts);
    const searchShare = clampPercent(searchTriggerPercent) / 100;
    const searches = toNumber(searchesPerGroundedPrompt);
    const retryMultiplier =
      1 + clampPercent(retryOverheadPercent) / 100;
    const baseInput = toNumber(baseInputTokensPerPrompt);
    const retrievedContext = toNumber(
      retrievedContextTokensPerPrompt,
    );
    const output = toNumber(outputTokensPerPrompt);

    const rows = availablePlans
      .map((plan) =>
        calculatePlan({
          plan,
          prompts,
          searchShare,
          searchesPerGroundedPrompt: searches,
          retryMultiplier,
          baseInputTokens: baseInput,
          retrievedContextTokens: retrievedContext,
          outputTokens: output,
        }),
      )
      .sort((a, b) => a.totalMonthlyCost - b.totalMonthlyCost);

    const selected =
      rows.find((row) => row.id === selectedPlanId) ??
      rows.find((row) => row.id === defaultPlanId) ??
      rows[0];

    const cheapest = rows[0];
    const budget = toNumber(monthlyBudget);

    const groundedPromptsBeforeRetry = prompts * searchShare;
    const searchQueriesBeforeFreeAllowance =
      groundedPromptsBeforeRetry * retryMultiplier * searches;

    return {
      prompts,
      searchSharePercent: searchShare * 100,
      groundedPromptsBeforeRetry,
      nonGroundedPromptsBeforeRetry:
        prompts - groundedPromptsBeforeRetry,
      searchQueriesBeforeFreeAllowance,
      retryPercent: (retryMultiplier - 1) * 100,
      rows,
      selected,
      cheapest,
      monthlySavingVsSelected:
        selected && cheapest
          ? selected.totalMonthlyCost - cheapest.totalMonthlyCost
          : 0,
      firstYearSavingVsSelected:
        selected && cheapest
          ? selected.firstYearCost - cheapest.firstYearCost
          : 0,
      budget,
      budgetDifference: selected
        ? budget - selected.totalMonthlyCost
        : budget,
    };
  }, [
    availablePlans,
    baseInputTokensPerPrompt,
    monthlyBudget,
    monthlyPrompts,
    outputTokensPerPrompt,
    retrievedContextTokensPerPrompt,
    retryOverheadPercent,
    searchesPerGroundedPrompt,
    searchTriggerPercent,
    selectedPlanId,
  ]);

  const reset = () => {
    setSelectedPlanId(defaultPlanId);
    setMonthlyPrompts("100000");
    setSearchTriggerPercent("40");
    setSearchesPerGroundedPrompt("1.5");
    setBaseInputTokensPerPrompt("600");
    setRetrievedContextTokensPerPrompt("2500");
    setOutputTokensPerPrompt("500");
    setRetryOverheadPercent("3");
    setMonthlyBudget("1000");
    setIncludeCustom(false);
    setCustomProviderName("Custom Provider");
    setCustomModelName("Custom Search Model");
    setCustomInputPrice("");
    setCustomOutputPrice("");
    setCustomSearchPrice("");
    setCustomFreeGroundedPrompts("0");
    setCustomContextBilled(false);
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Web-Grounded AI Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Compare search-tool fees and model tokens for the same monthly
            prompt volume.
          </p>
        </div>

        <div className="mt-7 grid min-w-0 gap-5 md:grid-cols-2 md:items-end [&>*]:min-w-0">
          <div className="md:col-span-2">
            <BeeijaSelect
              label="Selected provider and model"
              value={selectedPlanId}
              onChange={(event) =>
                setSelectedPlanId(event.target.value)
              }
              options={planOptions}
            />
          </div>

          <BeeijaNumberField
            label="AI prompts per month"
            value={monthlyPrompts}
            onChange={setMonthlyPrompts}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Prompts that trigger web search"
            value={searchTriggerPercent}
            onChange={setSearchTriggerPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Average search queries per grounded prompt"
            value={searchesPerGroundedPrompt}
            onChange={setSearchesPerGroundedPrompt}
            min="0"
            step="0.1"
          />

          <BeeijaNumberField
            label="Base input tokens per prompt"
            value={baseInputTokensPerPrompt}
            onChange={setBaseInputTokensPerPrompt}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Retrieved web-context tokens per grounded prompt"
            value={retrievedContextTokensPerPrompt}
            onChange={setRetrievedContextTokensPerPrompt}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Output tokens per prompt"
            value={outputTokensPerPrompt}
            onChange={setOutputTokensPerPrompt}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Retry and repeated-call overhead"
            value={retryOverheadPercent}
            onChange={setRetryOverheadPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Target monthly budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <input
            type="checkbox"
            checked={includeCustom}
            onChange={(event) => setIncludeCustom(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--green)]"
          />

          <span>
            <span className="block font-medium text-gray-900">
              Add a custom web-search provider
            </span>

            <span className="mt-1 block text-sm leading-relaxed text-gray-600">
              Compare another model, search API, cloud platform, or private
              agreement.
            </span>
          </span>
        </label>

        {includeCustom ? (
          <div className="mt-5 grid min-w-0 gap-5 md:grid-cols-2 md:items-end [&>*]:min-w-0">
            <TextField
              label="Provider name"
              value={customProviderName}
              onChange={setCustomProviderName}
            />

            <TextField
              label="Model or plan name"
              value={customModelName}
              onChange={setCustomModelName}
            />

            <BeeijaNumberField
              label="Current model input price per 1M tokens"
              value={customInputPrice}
              onChange={setCustomInputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            <BeeijaNumberField
              label="Current model output price per 1M tokens"
              value={customOutputPrice}
              onChange={setCustomOutputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            <BeeijaNumberField
              label="Current search price per 1,000 queries"
              value={customSearchPrice}
              onChange={setCustomSearchPrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            <BeeijaNumberField
              label="Free grounded prompts per month"
              value={customFreeGroundedPrompts}
              onChange={setCustomFreeGroundedPrompts}
              min="0"
              step="1"
            />

            <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 md:col-span-2">
              <input
                type="checkbox"
                checked={customContextBilled}
                onChange={(event) =>
                  setCustomContextBilled(event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-[var(--green)]"
              />

              <span>
                <span className="block font-medium text-gray-900">
                  Retrieved web context is billed as model input
                </span>

                <span className="mt-1 block text-sm leading-relaxed text-gray-600">
                  Enable this when search-result content enters the billed input
                  token count.
                </span>
              </span>
            </label>
          </div>
        ) : null}

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Grounding workload used for comparison
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              Grounded prompts before retries:{" "}
              {formatVisibleInteger(result.groundedPromptsBeforeRetry)}
            </p>

            <p>
              Non-grounded prompts before retries:{" "}
              {formatVisibleInteger(result.nonGroundedPromptsBeforeRetry)}
            </p>

            <p>
              Search queries before free allowances:{" "}
              {formatVisibleInteger(result.searchQueriesBeforeFreeAllowance)}
            </p>

            <p>
              Retry overhead: {formatVisibleNumber(result.retryPercent)}%
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={reset}
          className="beeija-btn-outline mt-6"
        >
          Reset values
        </button>
      </section>

      <BeeijaCalculatorResultPanel
        title="Web Search Grounding Cost Comparison"
        description="The selected option is shown first, followed by a ranked comparison for the same workload."
        primaryLabel="Selected monthly cost"
        primaryValue={
          result.selected
            ? formatVisibleMoney(result.selected.totalMonthlyCost)
            : "$0.00"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Search-tool cost"
              value={
                result.selected
                  ? formatVisibleMoney(result.selected.searchToolCost)
                  : "$0.00"
              }
            />

            <ResultStat
              label="Per grounded prompt"
              value={
                result.selected
                  ? formatVisibleMoney(result.selected.costPerGroundedPrompt)
                  : "$0.00"
              }
            />

            <ResultStat
              label="First-year cost"
              value={
                result.selected
                  ? formatVisibleMoney(result.selected.firstYearCost)
                  : "$0.00"
              }
            />
          </div>
        }
        breakdown={
          <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="hidden grid-cols-[minmax(0,1.65fr)_repeat(4,minmax(0,1fr))] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 2xl:grid">
              <span>Provider and model</span>
              <span>Billed searches</span>
              <span>Search fee</span>
              <span>Model tokens</span>
              <span>Monthly total</span>
            </div>

            <div className="max-h-[44rem] divide-y divide-gray-200 overflow-y-auto overscroll-contain">
              {result.rows.map((row, index) => (
                <div
                  key={row.id}
                  className={`grid min-w-0 gap-4 px-4 py-4 2xl:grid-cols-[minmax(0,1.65fr)_repeat(4,minmax(0,1fr))] 2xl:items-start ${
                    row.id === result.selected?.id ? "bg-[#F5FAF7]" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="break-words font-medium text-gray-900 [overflow-wrap:anywhere]">
                      {index === 0 ? "Lowest cost · " : ""}
                      {row.provider}
                    </p>

                    <p className="mt-1 break-words text-sm text-gray-600 [overflow-wrap:anywhere]">
                      {row.model}
                    </p>

                    <p className="mt-1 break-words text-xs text-gray-500 [overflow-wrap:anywhere]">
                      {row.note}
                    </p>
                  </div>

                  <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:contents">
                    <ComparisonValue
                      label="Billed searches"
                      value={formatVisibleInteger(row.billedSearchQueries)}
                    />

                    <ComparisonValue
                      label="Search fee"
                      value={formatVisibleMoney(row.searchToolCost)}
                    />

                    <ComparisonValue
                      label="Model tokens"
                      value={formatVisibleMoney(
                        row.modelInputCost + row.modelOutputCost,
                      )}
                    />

                    <ComparisonValue
                      label="Monthly total"
                      value={formatVisibleMoney(row.totalMonthlyCost)}
                      emphasis
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
        totals={
          <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
            <p>
              Selected option:{" "}
              <span className="font-medium text-gray-900">
                {result.selected
                  ? `${result.selected.provider} — ${result.selected.model}`
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Selected model input cost:{" "}
              <span className="font-medium text-gray-900">
                {result.selected
                  ? formatVisibleMoney(result.selected.modelInputCost)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Selected model output cost:{" "}
              <span className="font-medium text-gray-900">
                {result.selected
                  ? formatVisibleMoney(result.selected.modelOutputCost)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Lowest calculated option:{" "}
              <span className="font-medium text-gray-900">
                {result.cheapest
                  ? `${result.cheapest.provider} — ${result.cheapest.model}`
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Possible monthly saving against selected option:{" "}
              <span className="font-medium text-gray-900">
                {formatVisibleMoney(result.monthlySavingVsSelected)}
              </span>
            </p>

            <p className="mt-2">
              Possible first-year saving:{" "}
              <span className="font-medium text-gray-900">
                {formatVisibleMoney(result.firstYearSavingVsSelected)}
              </span>
            </p>

            <p className="mt-2">
              Cost per all prompts:{" "}
              <span className="font-medium text-gray-900">
                {result.selected
                  ? formatVisibleMoney(result.selected.costPerAllPrompt)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Budget status:{" "}
              <span
                className={`font-semibold ${
                  result.budgetDifference >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {result.budgetDifference >= 0
                  ? `${formatVisibleMoney(result.budgetDifference)} remaining`
                  : `${formatVisibleMoney(
                      Math.abs(result.budgetDifference),
                    )} over budget`}
              </span>
            </p>
          </div>
        }
        provider="OpenAI web search, Anthropic Claude web search, and Google Gemini Grounding with Google Search"
        pricingCheckedDate="June 20, 2026"
        excludedCosts="regional and data-residency premiums, priority or batch processing, caching, orchestration, storage, citations, taxes, negotiated discounts, quality differences, and searches beyond the entered average"
      />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block break-words text-sm font-medium text-gray-700 [overflow-wrap:anywhere]">
        {label}
      </span>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition hover:border-gray-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
      />
    </label>
  );
}

function ComparisonValue({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-gray-50 px-3 py-3 2xl:rounded-none 2xl:bg-transparent 2xl:px-0 2xl:py-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 2xl:hidden">
        {label}
      </p>

      <p
        className={`mt-1 break-words [overflow-wrap:anywhere] 2xl:mt-0 ${
          emphasis
            ? "font-semibold text-gray-950"
            : "font-medium text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ResultStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="break-words text-xs font-medium uppercase tracking-wide text-gray-500 [overflow-wrap:anywhere]">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

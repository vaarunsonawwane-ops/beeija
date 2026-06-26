"use client";

import { useEffect, useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type EmbeddingPlan = {
  id: string;
  provider: string;
  model: string;
  pricePerMillionTokens: number;
  note: string;
};

type ComparisonRow = EmbeddingPlan & {
  initialCost: number;
  monthlyCost: number;
  firstYearCost: number;
  costPerMillionDocuments: number;
};

const EMBEDDING_PLANS: EmbeddingPlan[] = [
  {
    id: "openai-text-embedding-3-small",
    provider: "OpenAI",
    model: "text-embedding-3-small",
    pricePerMillionTokens: 0.02,
    note: "Paid list price",
  },
  {
    id: "openai-text-embedding-3-large",
    provider: "OpenAI",
    model: "text-embedding-3-large",
    pricePerMillionTokens: 0.13,
    note: "Paid list price",
  },
  {
    id: "google-gemini-embedding-001-standard",
    provider: "Google",
    model: "gemini-embedding-001 · Standard",
    pricePerMillionTokens: 0.15,
    note: "Text-only standard paid tier",
  },
  {
    id: "google-gemini-embedding-001-batch",
    provider: "Google",
    model: "gemini-embedding-001 · Batch",
    pricePerMillionTokens: 0.075,
    note: "Text-only batch paid tier",
  },
  {
    id: "google-gemini-embedding-2-standard",
    provider: "Google",
    model: "gemini-embedding-2 · Text · Standard",
    pricePerMillionTokens: 0.2,
    note: "Multimodal model using text input",
  },
  {
    id: "google-gemini-embedding-2-batch",
    provider: "Google",
    model: "gemini-embedding-2 · Text · Batch",
    pricePerMillionTokens: 0.1,
    note: "Multimodal model using text input",
  },
  {
    id: "mistral-embed",
    provider: "Mistral",
    model: "mistral-embed",
    pricePerMillionTokens: 0.1,
    note: "Paid list price",
  },
  {
    id: "voyage-4-lite",
    provider: "Voyage AI",
    model: "voyage-4-lite",
    pricePerMillionTokens: 0.02,
    note: "Paid usage after any free allowance",
  },
  {
    id: "voyage-4",
    provider: "Voyage AI",
    model: "voyage-4",
    pricePerMillionTokens: 0.06,
    note: "Paid usage after any free allowance",
  },
  {
    id: "voyage-4-large",
    provider: "Voyage AI",
    model: "voyage-4-large",
    pricePerMillionTokens: 0.12,
    note: "Paid usage after any free allowance",
  },
  {
    id: "voyage-context-3",
    provider: "Voyage AI",
    model: "voyage-context-3",
    pricePerMillionTokens: 0.18,
    note: "Contextualized chunk embeddings",
  },
  {
    id: "voyage-code-3",
    provider: "Voyage AI",
    model: "voyage-code-3",
    pricePerMillionTokens: 0.18,
    note: "Code retrieval embeddings",
  },
];

const defaultPlanId = "openai-text-embedding-3-small";

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

export default function ToolClient() {
  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlanId);

  const [documents, setDocuments] = useState("100000");
  const [averageTokensPerDocument, setAverageTokensPerDocument] =
    useState("800");
  const [chunkOverlapPercent, setChunkOverlapPercent] = useState("15");
  const [monthlyRefreshPercent, setMonthlyRefreshPercent] = useState("10");
  const [monthlyQueries, setMonthlyQueries] = useState("500000");
  const [averageQueryTokens, setAverageQueryTokens] = useState("20");
  const [monthlyBudget, setMonthlyBudget] = useState("100");

  const [includeCustom, setIncludeCustom] = useState(false);
  const [customProviderName, setCustomProviderName] =
    useState("Custom Provider");
  const [customModelName, setCustomModelName] =
    useState("Custom Embedding Model");
  const [customPricePerMillion, setCustomPricePerMillion] = useState("");

  const customPlan = useMemo<EmbeddingPlan | null>(() => {
    if (!includeCustom || customPricePerMillion.trim() === "") {
      return null;
    }

    return {
      id: "custom-provider",
      provider: customProviderName.trim() || "Custom Provider",
      model: customModelName.trim() || "Custom Embedding Model",
      pricePerMillionTokens: toNumber(customPricePerMillion),
      note: "User-entered paid price",
    };
  }, [
    customModelName,
    customPricePerMillion,
    customProviderName,
    includeCustom,
  ]);

  const availablePlans = useMemo(
    () => (customPlan ? [...EMBEDDING_PLANS, customPlan] : EMBEDDING_PLANS),
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
    const documentCount = toNumber(documents);
    const tokensPerDocument = toNumber(averageTokensPerDocument);
    const overlapMultiplier = 1 + clampPercent(chunkOverlapPercent) / 100;
    const refreshShare = clampPercent(monthlyRefreshPercent) / 100;
    const queries = toNumber(monthlyQueries);
    const queryTokens = toNumber(averageQueryTokens);
    const budget = toNumber(monthlyBudget);

    const initialDocumentTokens =
      documentCount * tokensPerDocument * overlapMultiplier;

    const monthlyRefreshTokens = initialDocumentTokens * refreshShare;
    const monthlyQueryTokens = queries * queryTokens;
    const monthlyRecurringTokens = monthlyRefreshTokens + monthlyQueryTokens;
    const firstYearTokens =
      initialDocumentTokens + monthlyRecurringTokens * 12;

    const rows: ComparisonRow[] = availablePlans
      .map((plan) => {
        const initialCost =
          (initialDocumentTokens / 1_000_000) *
          plan.pricePerMillionTokens;

        const monthlyCost =
          (monthlyRecurringTokens / 1_000_000) *
          plan.pricePerMillionTokens;

        const firstYearCost =
          initialCost + monthlyCost * 12;

        const oneMillionDocumentsTokens =
          1_000_000 * tokensPerDocument * overlapMultiplier;

        const costPerMillionDocuments =
          (oneMillionDocumentsTokens / 1_000_000) *
          plan.pricePerMillionTokens;

        return {
          ...plan,
          initialCost,
          monthlyCost,
          firstYearCost,
          costPerMillionDocuments,
        };
      })
      .sort((a, b) => a.firstYearCost - b.firstYearCost);

    const selected =
      rows.find((row) => row.id === selectedPlanId) ??
      rows.find((row) => row.id === defaultPlanId) ??
      rows[0];

    const cheapest = rows[0];
    const mostExpensive = rows[rows.length - 1];

    return {
      documentCount,
      initialDocumentTokens,
      monthlyRefreshTokens,
      monthlyQueryTokens,
      monthlyRecurringTokens,
      firstYearTokens,
      queries,
      rows,
      selected,
      cheapest,
      mostExpensive,
      budget,
      budgetDifference: selected ? budget - selected.monthlyCost : budget,
      monthlySavingVsSelected:
        selected && cheapest
          ? selected.monthlyCost - cheapest.monthlyCost
          : 0,
      firstYearSavingVsSelected:
        selected && cheapest
          ? selected.firstYearCost - cheapest.firstYearCost
          : 0,
    };
  }, [
    averageQueryTokens,
    averageTokensPerDocument,
    availablePlans,
    chunkOverlapPercent,
    documents,
    monthlyBudget,
    monthlyQueries,
    monthlyRefreshPercent,
    selectedPlanId,
  ]);

  const reset = () => {
    setSelectedPlanId(defaultPlanId);
    setDocuments("100000");
    setAverageTokensPerDocument("800");
    setChunkOverlapPercent("15");
    setMonthlyRefreshPercent("10");
    setMonthlyQueries("500000");
    setAverageQueryTokens("20");
    setMonthlyBudget("100");
    setIncludeCustom(false);
    setCustomProviderName("Custom Provider");
    setCustomModelName("Custom Embedding Model");
    setCustomPricePerMillion("");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Embedding Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Compare initial indexing and continuing monthly embedding usage.
          </p>
        </div>

        <div className="mt-7 grid min-w-0 gap-5 md:grid-cols-2 [&>*]:min-w-0">
          <div className="md:col-span-2">
            <BeeijaSelect
              label="Selected provider and model"
              value={selectedPlanId}
              onChange={(event) => setSelectedPlanId(event.target.value)}
              options={planOptions}
            />
          </div>

          <BeeijaNumberField
            label="Source documents"
            value={documents}
            onChange={setDocuments}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average tokens per document"
            value={averageTokensPerDocument}
            onChange={setAverageTokensPerDocument}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Chunk overlap"
            value={chunkOverlapPercent}
            onChange={setChunkOverlapPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Knowledge base refreshed monthly"
            value={monthlyRefreshPercent}
            onChange={setMonthlyRefreshPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Search queries per month"
            value={monthlyQueries}
            onChange={setMonthlyQueries}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average tokens per query"
            value={averageQueryTokens}
            onChange={setAverageQueryTokens}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Target monthly embedding budget"
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
              Add a custom embedding provider
            </span>

            <span className="mt-1 block text-sm leading-relaxed text-gray-600">
              Compare another API, negotiated rate, or private quote.
            </span>
          </span>
        </label>

        {includeCustom ? (
          <div className="mt-5 grid min-w-0 gap-5 md:grid-cols-2 [&>*]:min-w-0">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Provider name
              </span>

              <input
                type="text"
                value={customProviderName}
                onChange={(event) =>
                  setCustomProviderName(event.target.value)
                }
                className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition hover:border-gray-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Model or plan name
              </span>

              <input
                type="text"
                value={customModelName}
                onChange={(event) => setCustomModelName(event.target.value)}
                className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition hover:border-gray-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
              />
            </label>

            <BeeijaNumberField
              label="Current price per 1M tokens"
              value={customPricePerMillion}
              onChange={setCustomPricePerMillion}
              min="0"
              step="0.001"
              prefix="$"
            />
          </div>
        ) : null}

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Embedding usage used for comparison
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              Initial document tokens:{" "}
              {formatVisibleInteger(result.initialDocumentTokens)}
            </p>

            <p>
              Monthly refresh tokens:{" "}
              {formatVisibleInteger(result.monthlyRefreshTokens)}
            </p>

            <p>
              Monthly query tokens:{" "}
              {formatVisibleInteger(result.monthlyQueryTokens)}
            </p>

            <p>
              Monthly recurring tokens:{" "}
              {formatVisibleInteger(result.monthlyRecurringTokens)}
            </p>

            <p>
              First-year embedded tokens:{" "}
              {formatVisibleInteger(result.firstYearTokens)}
            </p>

            <p>
              Search queries: {formatVisibleInteger(result.queries)} per month
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
        title="Embedding Cost Comparison"
        description="The selected model is shown first, followed by a paid list-price comparison for the same workload."
        primaryLabel="Selected model first-year cost"
        primaryValue={
          result.selected ? formatVisibleMoney(result.selected.firstYearCost) : "$0.00"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Initial indexing"
              value={
                result.selected
                  ? formatVisibleMoney(result.selected.initialCost)
                  : "$0.00"
              }
            />

            <ResultStat
              label="Monthly recurring"
              value={
                result.selected
                  ? formatVisibleMoney(result.selected.monthlyCost)
                  : "$0.00"
              }
            />

            <ResultStat
              label="Per 1M documents"
              value={
                result.selected
                  ? formatVisibleMoney(result.selected.costPerMillionDocuments)
                  : "$0.00"
              }
            />
          </div>
        }
        breakdown={
          <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="hidden grid-cols-[minmax(0,1.65fr)_repeat(4,minmax(0,1fr))] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 2xl:grid">
              <span>Provider and model</span>
              <span>Per 1M tokens</span>
              <span>Initial</span>
              <span>Monthly</span>
              <span>First year</span>
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
                      label="Per 1M tokens"
                      value={formatVisibleMoney(row.pricePerMillionTokens)}
                    />

                    <ComparisonValue
                      label="Initial"
                      value={formatVisibleMoney(row.initialCost)}
                    />

                    <ComparisonValue
                      label="Monthly"
                      value={formatVisibleMoney(row.monthlyCost)}
                    />

                    <ComparisonValue
                      label="First year"
                      value={formatVisibleMoney(row.firstYearCost)}
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
              Selected model:{" "}
              <span className="font-medium text-gray-900">
                {result.selected
                  ? `${result.selected.provider} — ${result.selected.model}`
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Lowest paid list-price option:{" "}
              <span className="font-medium text-gray-900">
                {result.cheapest
                  ? `${result.cheapest.provider} — ${result.cheapest.model}`
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Possible first-year saving against selected model:{" "}
              <span className="font-medium text-gray-900">
                {formatVisibleMoney(result.firstYearSavingVsSelected)}
              </span>
            </p>

            <p className="mt-2">
              Possible monthly saving against selected model:{" "}
              <span className="font-medium text-gray-900">
                {formatVisibleMoney(result.monthlySavingVsSelected)}
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
        provider="OpenAI, Google Gemini, Mistral, and Voyage AI embedding"
        pricingCheckedDate="June 19, 2026"
        excludedCosts="free-tier eligibility, promotional credits, vector storage, vector reads and writes, reranking, LLM generation, subscriptions, taxes, discounts, and implementation work"
      />
    </div>
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

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

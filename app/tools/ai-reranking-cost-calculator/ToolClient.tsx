"use client";

import { useEffect, useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type BillingUnit = "per-million-tokens" | "per-thousand-requests";

type RerankerPlan = {
  id: string;
  provider: string;
  model: string;
  billingUnit: BillingUnit;
  price: number;
  note: string;
};

type ComparisonRow = RerankerPlan & {
  monthlyCost: number;
  yearlyCost: number;
  costPerSuccessfulQuery: number;
  costPerThousandSuccessfulQueries: number;
};

const RERANKER_PLANS: RerankerPlan[] = [
  {
    id: "voyage-rerank-2-5-lite",
    provider: "Voyage AI",
    model: "rerank-2.5-lite",
    billingUnit: "per-million-tokens",
    price: 0.02,
    note: "Paid usage after any account allowance",
  },
  {
    id: "voyage-rerank-2-5",
    provider: "Voyage AI",
    model: "rerank-2.5",
    billingUnit: "per-million-tokens",
    price: 0.05,
    note: "Paid usage after any account allowance",
  },
  {
    id: "pinecone-bge-reranker-v2-m3",
    provider: "Pinecone",
    model: "bge-reranker-v2-m3",
    billingUnit: "per-thousand-requests",
    price: 2,
    note: "Hosted inference paid list price",
  },
  {
    id: "pinecone-rerank-v0",
    provider: "Pinecone",
    model: "pinecone-rerank-v0",
    billingUnit: "per-thousand-requests",
    price: 2,
    note: "Hosted inference paid list price",
  },
  {
    id: "pinecone-cohere-rerank-v3-5",
    provider: "Pinecone",
    model: "cohere-rerank-v3.5",
    billingUnit: "per-thousand-requests",
    price: 2,
    note: "Cohere model hosted by Pinecone",
  },
];

const defaultPlanId = "voyage-rerank-2-5-lite";

const billingOptions = [
  {
    value: "per-million-tokens",
    label: "Price per 1M processed tokens",
  },
  {
    value: "per-thousand-requests",
    label: "Price per 1,000 rerank requests",
  },
];

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

function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function calculatePlanCost(
  plan: RerankerPlan,
  billedRequests: number,
  processedTokens: number,
) {
  if (plan.billingUnit === "per-million-tokens") {
    return (processedTokens / 1_000_000) * plan.price;
  }

  return (billedRequests / 1_000) * plan.price;
}

export default function ToolClient() {
  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlanId);

  const [monthlyQueries, setMonthlyQueries] = useState("100000");
  const [candidateDocuments, setCandidateDocuments] = useState("50");
  const [documentsAfterRerank, setDocumentsAfterRerank] = useState("5");
  const [averageQueryTokens, setAverageQueryTokens] = useState("20");
  const [averageDocumentTokens, setAverageDocumentTokens] = useState("400");
  const [retryOverheadPercent, setRetryOverheadPercent] = useState("5");
  const [llmInputPricePerMillion, setLlmInputPricePerMillion] =
    useState("");
  const [monthlyRerankerBudget, setMonthlyRerankerBudget] = useState("250");

  const [includeCustom, setIncludeCustom] = useState(false);
  const [customProviderName, setCustomProviderName] =
    useState("Custom Provider");
  const [customModelName, setCustomModelName] =
    useState("Custom Reranker");
  const [customBillingUnit, setCustomBillingUnit] =
    useState<BillingUnit>("per-thousand-requests");
  const [customPrice, setCustomPrice] = useState("");

  const customPlan = useMemo<RerankerPlan | null>(() => {
    if (!includeCustom || customPrice.trim() === "") {
      return null;
    }

    return {
      id: "custom-provider",
      provider: customProviderName.trim() || "Custom Provider",
      model: customModelName.trim() || "Custom Reranker",
      billingUnit: customBillingUnit,
      price: toNumber(customPrice),
      note: "User-entered current price",
    };
  }, [
    customBillingUnit,
    customModelName,
    customPrice,
    customProviderName,
    includeCustom,
  ]);

  const availablePlans = useMemo(
    () => (customPlan ? [...RERANKER_PLANS, customPlan] : RERANKER_PLANS),
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
    const successfulQueries = toNumber(monthlyQueries);
    const retryShare = clampPercent(retryOverheadPercent) / 100;
    const billedRequests = successfulQueries * (1 + retryShare);

    const candidates = Math.max(1, toNumber(candidateDocuments));
    const finalDocuments = Math.min(
      candidates,
      Math.max(0, toNumber(documentsAfterRerank)),
    );

    const queryTokens = toNumber(averageQueryTokens);
    const documentTokens = toNumber(averageDocumentTokens);

    const processedTokensPerRequest =
      queryTokens * candidates + documentTokens * candidates;

    const monthlyProcessedTokens =
      processedTokensPerRequest * billedRequests;

    const rows: ComparisonRow[] = availablePlans
      .map((plan) => {
        const monthlyCost = calculatePlanCost(
          plan,
          billedRequests,
          monthlyProcessedTokens,
        );

        return {
          ...plan,
          monthlyCost,
          yearlyCost: monthlyCost * 12,
          costPerSuccessfulQuery:
            successfulQueries > 0 ? monthlyCost / successfulQueries : 0,
          costPerThousandSuccessfulQueries:
            successfulQueries > 0
              ? (monthlyCost / successfulQueries) * 1_000
              : 0,
        };
      })
      .sort((a, b) => a.monthlyCost - b.monthlyCost);

    const selected =
      rows.find((row) => row.id === selectedPlanId) ??
      rows.find((row) => row.id === defaultPlanId) ??
      rows[0];

    const cheapest = rows[0];

    const contextTokensBefore =
      successfulQueries * candidates * documentTokens;
    const contextTokensAfter =
      successfulQueries * finalDocuments * documentTokens;
    const contextTokensRemoved = Math.max(
      0,
      contextTokensBefore - contextTokensAfter,
    );

    const hasLlmPrice = llmInputPricePerMillion.trim() !== "";
    const llmInputSavings =
      (contextTokensRemoved / 1_000_000) *
      toNumber(llmInputPricePerMillion);

    const netMonthlyImpact = selected
      ? llmInputSavings - selected.monthlyCost
      : llmInputSavings;

    const rerankerBudget = toNumber(monthlyRerankerBudget);

    return {
      successfulQueries,
      billedRequests,
      processedTokensPerRequest,
      monthlyProcessedTokens,
      rows,
      selected,
      cheapest,
      contextTokensBefore,
      contextTokensAfter,
      contextTokensRemoved,
      hasLlmPrice,
      llmInputSavings,
      netMonthlyImpact,
      rerankerBudget,
      budgetDifference: selected
        ? rerankerBudget - selected.monthlyCost
        : rerankerBudget,
      monthlySavingVsSelected:
        selected && cheapest
          ? selected.monthlyCost - cheapest.monthlyCost
          : 0,
    };
  }, [
    availablePlans,
    averageDocumentTokens,
    averageQueryTokens,
    candidateDocuments,
    documentsAfterRerank,
    llmInputPricePerMillion,
    monthlyQueries,
    monthlyRerankerBudget,
    retryOverheadPercent,
    selectedPlanId,
  ]);

  const reset = () => {
    setSelectedPlanId(defaultPlanId);
    setMonthlyQueries("100000");
    setCandidateDocuments("50");
    setDocumentsAfterRerank("5");
    setAverageQueryTokens("20");
    setAverageDocumentTokens("400");
    setRetryOverheadPercent("5");
    setLlmInputPricePerMillion("");
    setMonthlyRerankerBudget("250");
    setIncludeCustom(false);
    setCustomProviderName("Custom Provider");
    setCustomModelName("Custom Reranker");
    setCustomBillingUnit("per-thousand-requests");
    setCustomPrice("");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Reranking Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Compare provider billing and estimate the context cost removed
            before the LLM request.
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
            label="Successful searches per month"
            value={monthlyQueries}
            onChange={setMonthlyQueries}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Candidate documents per search"
            value={candidateDocuments}
            onChange={setCandidateDocuments}
            min="1"
            step="1"
          />

          <BeeijaNumberField
            label="Documents sent to LLM after reranking"
            value={documentsAfterRerank}
            onChange={setDocumentsAfterRerank}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average query tokens"
            value={averageQueryTokens}
            onChange={setAverageQueryTokens}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average tokens per candidate document"
            value={averageDocumentTokens}
            onChange={setAverageDocumentTokens}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Retry and failed-request overhead"
            value={retryOverheadPercent}
            onChange={setRetryOverheadPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Current downstream LLM input price per 1M tokens"
            value={llmInputPricePerMillion}
            onChange={setLlmInputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Target monthly reranker budget"
            value={monthlyRerankerBudget}
            onChange={setMonthlyRerankerBudget}
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
              Add a custom reranker
            </span>

            <span className="mt-1 block text-sm leading-relaxed text-gray-600">
              Compare Cohere direct, another API, or a private provider quote.
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

            <BeeijaSelect
              label="Custom billing unit"
              value={customBillingUnit}
              onChange={(event) =>
                setCustomBillingUnit(event.target.value as BillingUnit)
              }
              options={billingOptions}
            />

            <BeeijaNumberField
              label={
                customBillingUnit === "per-million-tokens"
                  ? "Current price per 1M processed tokens"
                  : "Current price per 1,000 requests"
              }
              value={customPrice}
              onChange={setCustomPrice}
              min="0"
              step="0.001"
              prefix="$"
            />
          </div>
        ) : null}

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Workload used for comparison
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              Successful searches: {formatVisibleInteger(result.successfulQueries)}
            </p>
            <p>
              Billable rerank requests: {formatVisibleInteger(result.billedRequests)}
            </p>
            <p>
              Processed tokens per request:{" "}
              {formatVisibleInteger(result.processedTokensPerRequest)}
            </p>
            <p>
              Monthly processed tokens:{" "}
              {formatVisibleInteger(result.monthlyProcessedTokens)}
            </p>
            <p>
              Context tokens before reranking:{" "}
              {formatVisibleInteger(result.contextTokensBefore)}
            </p>
            <p>
              Context tokens after reranking:{" "}
              {formatVisibleInteger(result.contextTokensAfter)}
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
        title="Reranking Cost and LLM Savings"
        description="The selected reranker is shown first, followed by a ranked paid list-price comparison."
        primaryLabel="Selected reranker monthly cost"
        primaryValue={
          result.selected ? formatVisibleMoney(result.selected.monthlyCost) : "$0.00"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per successful search"
              value={
                result.selected
                  ? formatVisibleMoney(result.selected.costPerSuccessfulQuery)
                  : "$0.00"
              }
            />
            <ResultStat
              label="Per 1,000 searches"
              value={
                result.selected
                  ? formatVisibleMoney(
                      result.selected.costPerThousandSuccessfulQueries,
                    )
                  : "$0.00"
              }
            />
            <ResultStat
              label="Per year"
              value={
                result.selected
                  ? formatVisibleMoney(result.selected.yearlyCost)
                  : "$0.00"
              }
            />
          </div>
        }
        breakdown={
          <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="hidden grid-cols-[minmax(0,1.7fr)_repeat(3,minmax(0,1fr))] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 2xl:grid">
              <span>Provider and model</span>
              <span>Billing rate</span>
              <span>Per 1K searches</span>
              <span>Monthly</span>
            </div>

            <div className="max-h-[44rem] divide-y divide-gray-200 overflow-y-auto overscroll-contain">
              {result.rows.map((row, index) => (
                <div
                  key={row.id}
                  className={`grid min-w-0 gap-4 px-4 py-4 2xl:grid-cols-[minmax(0,1.7fr)_repeat(3,minmax(0,1fr))] 2xl:items-start ${
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

                  <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 2xl:contents">
                    <ComparisonValue
                      label="Billing rate"
                      value={`${formatVisibleMoney(row.price)} ${
                        row.billingUnit === "per-million-tokens"
                          ? "/1M tokens"
                          : "/1K requests"
                      }`}
                    />

                    <ComparisonValue
                      label="Per 1K searches"
                      value={formatVisibleMoney(
                        row.costPerThousandSuccessfulQueries,
                      )}
                    />

                    <ComparisonValue
                      label="Monthly"
                      value={formatVisibleMoney(row.monthlyCost)}
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
              Context tokens removed before the LLM:{" "}
              <span className="font-medium text-gray-900">
                {formatVisibleInteger(result.contextTokensRemoved)}
              </span>
            </p>

            <p className="mt-2">
              Estimated monthly LLM input saving:{" "}
              <span className="font-medium text-gray-900">
                {result.hasLlmPrice
                  ? formatVisibleMoney(result.llmInputSavings)
                  : "Enter the LLM input price"}
              </span>
            </p>

            <p className="mt-2">
              Net monthly impact after reranker cost:{" "}
              <span
                className={`font-semibold ${
                  !result.hasLlmPrice || result.netMonthlyImpact >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasLlmPrice
                  ? "Enter the LLM input price"
                  : result.netMonthlyImpact >= 0
                    ? `${formatVisibleMoney(result.netMonthlyImpact)} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.netMonthlyImpact),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              Possible monthly reranker saving against selected model:{" "}
              <span className="font-medium text-gray-900">
                {formatVisibleMoney(result.monthlySavingVsSelected)}
              </span>
            </p>

            <p className="mt-2">
              Reranker budget status:{" "}
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
        provider="Voyage AI and Pinecone hosted reranking"
        pricingCheckedDate="June 20, 2026"
        excludedCosts="free allowances, embeddings, vector database charges, LLM output tokens, caching, hosting, engineering, taxes, discounts, and the business value of retrieval-quality changes"
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

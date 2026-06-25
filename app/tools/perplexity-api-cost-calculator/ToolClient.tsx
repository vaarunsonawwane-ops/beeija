"use client";

import { useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type ModelKey =
  | "sonar"
  | "sonar-pro"
  | "sonar-reasoning-pro"
  | "sonar-deep-research";

type ContextSize = "low" | "medium" | "high";

type ModelPrice = {
  label: string;
  input: number;
  output: number;
  citation?: number;
  searchQueries?: number;
  reasoning?: number;
  requestFees?: Record<ContextSize, number>;
};

const MODEL_PRICES: Record<ModelKey, ModelPrice> = {
  sonar: {
    label: "Sonar",
    input: 1,
    output: 1,
    requestFees: {
      low: 5,
      medium: 8,
      high: 12,
    },
  },
  "sonar-pro": {
    label: "Sonar Pro",
    input: 3,
    output: 15,
    requestFees: {
      low: 6,
      medium: 10,
      high: 14,
    },
  },
  "sonar-reasoning-pro": {
    label: "Sonar Reasoning Pro",
    input: 2,
    output: 8,
    requestFees: {
      low: 6,
      medium: 10,
      high: 14,
    },
  },
  "sonar-deep-research": {
    label: "Sonar Deep Research",
    input: 2,
    output: 8,
    citation: 2,
    searchQueries: 5,
    reasoning: 3,
  },
};

const modelOptions = Object.entries(MODEL_PRICES).map(([value, model]) => ({
  value,
  label: model.label,
}));

const contextOptions = [
  { value: "low", label: "Low search context" },
  { value: "medium", label: "Medium search context" },
  { value: "high", label: "High search context" },
];

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "$0.00";
  if (value > 0 && value < 0.01) return `$${value.toFixed(6)}`;

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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ToolClient() {
  const [model, setModel] = useState<ModelKey>("sonar-pro");
  const [contextSize, setContextSize] = useState<ContextSize>("medium");
  const [requestsPerMonth, setRequestsPerMonth] = useState("25000");
  const [inputTokensPerRequest, setInputTokensPerRequest] = useState("900");
  const [outputTokensPerRequest, setOutputTokensPerRequest] = useState("500");

  const [citationTokensPerRequest, setCitationTokensPerRequest] =
    useState("250");
  const [reasoningTokensPerRequest, setReasoningTokensPerRequest] =
    useState("800");
  const [searchQueriesPerRequest, setSearchQueriesPerRequest] =
    useState("5");

  const [customPricing, setCustomPricing] = useState(false);
  const [customInputPrice, setCustomInputPrice] = useState("3");
  const [customOutputPrice, setCustomOutputPrice] = useState("15");
  const [customRequestFee, setCustomRequestFee] = useState("10");
  const [customCitationPrice, setCustomCitationPrice] = useState("2");
  const [customSearchQueryPrice, setCustomSearchQueryPrice] = useState("5");
  const [customReasoningPrice, setCustomReasoningPrice] = useState("3");

  const selectedModel = MODEL_PRICES[model];
  const isDeepResearch = model === "sonar-deep-research";

  const effectivePrices = useMemo(() => {
    if (customPricing) {
      return {
        input: toNumber(customInputPrice),
        output: toNumber(customOutputPrice),
        requestFee: toNumber(customRequestFee),
        citation: toNumber(customCitationPrice),
        searchQueries: toNumber(customSearchQueryPrice),
        reasoning: toNumber(customReasoningPrice),
      };
    }

    return {
      input: selectedModel.input,
      output: selectedModel.output,
      requestFee: selectedModel.requestFees?.[contextSize] ?? 0,
      citation: selectedModel.citation ?? 0,
      searchQueries: selectedModel.searchQueries ?? 0,
      reasoning: selectedModel.reasoning ?? 0,
    };
  }, [
    contextSize,
    customCitationPrice,
    customInputPrice,
    customOutputPrice,
    customPricing,
    customReasoningPrice,
    customRequestFee,
    customSearchQueryPrice,
    selectedModel,
  ]);

  const result = useMemo(() => {
    const requests = toNumber(requestsPerMonth);
    const inputPerRequest = toNumber(inputTokensPerRequest);
    const outputPerRequest = toNumber(outputTokensPerRequest);
    const citationPerRequest = isDeepResearch
      ? toNumber(citationTokensPerRequest)
      : 0;
    const reasoningPerRequest = isDeepResearch
      ? toNumber(reasoningTokensPerRequest)
      : 0;
    const searchesPerRequest = isDeepResearch
      ? toNumber(searchQueriesPerRequest)
      : 0;

    const totalInputTokens = requests * inputPerRequest;
    const totalOutputTokens = requests * outputPerRequest;
    const totalCitationTokens = requests * citationPerRequest;
    const totalReasoningTokens = requests * reasoningPerRequest;
    const totalSearchQueries = requests * searchesPerRequest;

    const inputCost =
      (totalInputTokens / 1_000_000) * effectivePrices.input;
    const outputCost =
      (totalOutputTokens / 1_000_000) * effectivePrices.output;
    const requestFeeCost = isDeepResearch
      ? 0
      : (requests / 1_000) * effectivePrices.requestFee;
    const citationCost =
      (totalCitationTokens / 1_000_000) * effectivePrices.citation;
    const reasoningCost =
      (totalReasoningTokens / 1_000_000) * effectivePrices.reasoning;
    const searchQueryCost =
      (totalSearchQueries / 1_000) * effectivePrices.searchQueries;

    const monthlyCost =
      inputCost +
      outputCost +
      requestFeeCost +
      citationCost +
      reasoningCost +
      searchQueryCost;

    return {
      requests,
      totalInputTokens,
      totalOutputTokens,
      totalCitationTokens,
      totalReasoningTokens,
      totalSearchQueries,
      inputCost,
      outputCost,
      requestFeeCost,
      citationCost,
      reasoningCost,
      searchQueryCost,
      monthlyCost,
      costPerRequest: requests > 0 ? monthlyCost / requests : 0,
      dailyCost: monthlyCost / 30,
      yearlyCost: monthlyCost * 12,
    };
  }, [
    citationTokensPerRequest,
    effectivePrices,
    inputTokensPerRequest,
    isDeepResearch,
    outputTokensPerRequest,
    reasoningTokensPerRequest,
    requestsPerMonth,
    searchQueriesPerRequest,
  ]);

  const updateModel = (value: string) => {
    const nextModel = value as ModelKey;
    const prices = MODEL_PRICES[nextModel];

    setModel(nextModel);

    if (!customPricing) {
      setCustomInputPrice(String(prices.input));
      setCustomOutputPrice(String(prices.output));
      setCustomRequestFee(
        String(prices.requestFees?.[contextSize] ?? 0),
      );
      setCustomCitationPrice(String(prices.citation ?? 0));
      setCustomSearchQueryPrice(String(prices.searchQueries ?? 0));
      setCustomReasoningPrice(String(prices.reasoning ?? 0));
    }
  };

  const updateContext = (value: string) => {
    const nextContext = value as ContextSize;
    setContextSize(nextContext);

    if (!customPricing) {
      setCustomRequestFee(
        String(MODEL_PRICES[model].requestFees?.[nextContext] ?? 0),
      );
    }
  };

  const reset = () => {
    setModel("sonar-pro");
    setContextSize("medium");
    setRequestsPerMonth("25000");
    setInputTokensPerRequest("900");
    setOutputTokensPerRequest("500");
    setCitationTokensPerRequest("250");
    setReasoningTokensPerRequest("800");
    setSearchQueriesPerRequest("5");
    setCustomPricing(false);
    setCustomInputPrice("3");
    setCustomOutputPrice("15");
    setCustomRequestFee("10");
    setCustomCitationPrice("2");
    setCustomSearchQueryPrice("5");
    setCustomReasoningPrice("3");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Perplexity API Usage
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Use average values for one request, then enter the expected number
            of requests in one month.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <BeeijaSelect
            label="Perplexity model"
            value={model}
            onChange={(event) => updateModel(event.target.value)}
            options={modelOptions}
          />

          <BeeijaSelect
            label="Search context size"
            value={contextSize}
            onChange={(event) => updateContext(event.target.value)}
            options={contextOptions}
            disabled={isDeepResearch}
          />

          <BeeijaNumberField
            label="Requests per month"
            value={requestsPerMonth}
            onChange={setRequestsPerMonth}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average input tokens per request"
            value={inputTokensPerRequest}
            onChange={setInputTokensPerRequest}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average output tokens per request"
            value={outputTokensPerRequest}
            onChange={setOutputTokensPerRequest}
            min="0"
            step="1"
          />

          {isDeepResearch ? (
            <>
              <BeeijaNumberField
                label="Citation tokens per request"
                value={citationTokensPerRequest}
                onChange={setCitationTokensPerRequest}
                min="0"
                step="1"
              />

              <BeeijaNumberField
                label="Reasoning tokens per request"
                value={reasoningTokensPerRequest}
                onChange={setReasoningTokensPerRequest}
                min="0"
                step="1"
              />

              <BeeijaNumberField
                label="Search queries per request"
                value={searchQueriesPerRequest}
                onChange={setSearchQueriesPerRequest}
                min="0"
                step="1"
              />
            </>
          ) : null}
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <input
            type="checkbox"
            checked={customPricing}
            onChange={(event) => setCustomPricing(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--green)]"
          />

          <span>
            <span className="block font-medium text-gray-900">
              Use custom prices
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-gray-600">
              Enter your own rates for the selected pricing items.
            </span>
          </span>
        </label>

        {customPricing ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <BeeijaNumberField
              label="Input price per 1M tokens"
              value={customInputPrice}
              onChange={setCustomInputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            <BeeijaNumberField
              label="Output price per 1M tokens"
              value={customOutputPrice}
              onChange={setCustomOutputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            {isDeepResearch ? (
              <>
                <BeeijaNumberField
                  label="Citation price per 1M tokens"
                  value={customCitationPrice}
                  onChange={setCustomCitationPrice}
                  min="0"
                  step="0.001"
                  prefix="$"
                />

                <BeeijaNumberField
                  label="Reasoning price per 1M tokens"
                  value={customReasoningPrice}
                  onChange={setCustomReasoningPrice}
                  min="0"
                  step="0.001"
                  prefix="$"
                />

                <BeeijaNumberField
                  label="Search price per 1K queries"
                  value={customSearchQueryPrice}
                  onChange={setCustomSearchQueryPrice}
                  min="0"
                  step="0.001"
                  prefix="$"
                />
              </>
            ) : (
              <BeeijaNumberField
                label="Request fee per 1K requests"
                value={customRequestFee}
                onChange={setCustomRequestFee}
                min="0"
                step="0.001"
                prefix="$"
              />
            )}
          </div>
        ) : null}

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Price used for this estimate
          </p>

          <div className="mt-3 grid min-w-0 gap-3 text-sm text-gray-700 sm:grid-cols-2">
            <PriceSummaryItem
              label="Input"
              value={`${formatVisibleMoney(effectivePrices.input)} / 1M`}
            />

            <PriceSummaryItem
              label="Output"
              value={`${formatVisibleMoney(effectivePrices.output)} / 1M`}
            />

            {isDeepResearch ? (
              <>
                <PriceSummaryItem
                  label="Citations"
                  value={`${formatVisibleMoney(effectivePrices.citation)} / 1M`}
                />

                <PriceSummaryItem
                  label="Reasoning"
                  value={`${formatVisibleMoney(effectivePrices.reasoning)} / 1M`}
                />

                <PriceSummaryItem
                  label="Search queries"
                  value={`${formatVisibleMoney(effectivePrices.searchQueries)} / 1K`}
                />
              </>
            ) : (
              <PriceSummaryItem
                label="Request fee"
                value={`${formatVisibleMoney(effectivePrices.requestFee)} / 1K`}
              />
            )}
          </div>
        </div>

        <button type="button" onClick={reset} className="beeija-btn-outline mt-6">
          Reset values
        </button>
      </section>

      <BeeijaCalculatorResultPanel
        title="Estimated Perplexity API Cost"
        description="This estimate includes the pricing items entered above."
        primaryLabel="Estimated monthly cost"
        primaryValue={formatVisibleMoney(result.monthlyCost)}
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per request"
              value={formatVisibleMoney(result.costPerRequest)}
            />
            <ResultStat
              label="Per day"
              value={formatVisibleMoney(result.dailyCost)}
            />
            <ResultStat
              label="Per year"
              value={formatVisibleMoney(result.yearlyCost)}
            />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            <CostRow
              label="Input token cost"
              detail={`${formatNumber(result.totalInputTokens)} tokens`}
              value={formatVisibleMoney(result.inputCost)}
            />

            <CostRow
              label="Output token cost"
              detail={`${formatNumber(result.totalOutputTokens)} tokens`}
              value={formatVisibleMoney(result.outputCost)}
            />

            {isDeepResearch ? (
              <>
                <CostRow
                  label="Citation token cost"
                  detail={`${formatNumber(result.totalCitationTokens)} tokens`}
                  value={formatVisibleMoney(result.citationCost)}
                />

                <CostRow
                  label="Reasoning token cost"
                  detail={`${formatNumber(result.totalReasoningTokens)} tokens`}
                  value={formatVisibleMoney(result.reasoningCost)}
                />

                <CostRow
                  label="Search query cost"
                  detail={`${formatNumber(result.totalSearchQueries)} queries`}
                  value={formatVisibleMoney(result.searchQueryCost)}
                />
              </>
            ) : (
              <CostRow
                label="Search request fee"
                detail={`${formatNumber(result.requests)} requests`}
                value={formatVisibleMoney(result.requestFeeCost)}
              />
            )}
          </div>
        }
        totals={
          <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
            <p>
              Requests:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(result.requests)}
              </span>
            </p>

            <p className="mt-2">
              Total input tokens:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(result.totalInputTokens)}
              </span>
            </p>

            <p className="mt-2">
              Total output tokens:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(result.totalOutputTokens)}
              </span>
            </p>
          </div>
        }
        provider="Perplexity"
        pricingCheckedDate="June 18, 2026"
        excludedCosts="Agent API tools, Search API calls, embeddings, sandbox sessions, taxes, discounts, retries, and other services"
      />
    </div>
  );
}

function PriceSummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <p className="min-w-0">
      <span className="block">{label}:</span>
      <span className="mt-1 block min-w-0 break-words font-medium text-gray-900 [overflow-wrap:anywhere]">
        {value}
      </span>
    </p>
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

function CostRow({
  label,
  detail,
  value,
}: {
  label: string;
  detail: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 break-words text-sm text-gray-500 [overflow-wrap:anywhere]">
          {detail}
        </p>
      </div>

      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

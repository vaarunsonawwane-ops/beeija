"use client";

import { useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type ModelKey =
  | "gpt-6-astra"
  | "gpt-5.6-sol"
  | "gpt-5.6-terra"
  | "gpt-5.6-luna";

type ModelPrice = {
  label: string;
  input: number;
  cachedInput: number;
  cacheWrite: number;
  output: number;
  longContextPricing: boolean;
};

const LONG_CONTEXT_THRESHOLD = 272_000;

const MODEL_PRICES: Record<ModelKey, ModelPrice> = {
  "gpt-6-astra": {
    label: "GPT-6 Astra",
    input: 10,
    cachedInput: 1,
    cacheWrite: 12.5,
    output: 50,
    longContextPricing: true,
  },
  "gpt-5.6-sol": {
    label: "GPT-5.6 Sol",
    input: 4,
    cachedInput: 0.4,
    cacheWrite: 5,
    output: 20,
    longContextPricing: true,
  },
  "gpt-5.6-terra": {
    label: "GPT-5.6 Terra",
    input: 2,
    cachedInput: 0.2,
    cacheWrite: 2.5,
    output: 12,
    longContextPricing: true,
  },
  "gpt-5.6-luna": {
    label: "GPT-5.6 Luna",
    input: 0.2,
    cachedInput: 0.02,
    cacheWrite: 0.25,
    output: 1.2,
    longContextPricing: true,
  },
};

const modelOptions = Object.entries(MODEL_PRICES).map(([value, model]) => ({
  value,
  label: model.label,
}));

const pricingModeOptions = [
  { value: "standard", label: "Standard API" },
  { value: "batch", label: "Batch API (50% lower)" },
];

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function isValidNonNegativeInteger(value: string) {
  const trimmed = value.trim();

  if (!/^\d+$/.test(trimmed)) {
    return false;
  }

  const parsed = Number(trimmed);

  return Number.isSafeInteger(parsed) && parsed >= 0;
}

function isValidNonNegativeDecimal(value: string) {
  const trimmed = value.trim();

  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(trimmed)) {
    return false;
  }

  const parsed = Number(trimmed);

  return (
    Number.isFinite(parsed) &&
    parsed >= 0 &&
    parsed <= Number.MAX_SAFE_INTEGER
  );
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ToolClient() {
  const [model, setModel] = useState<ModelKey>("gpt-6-astra");
  const [pricingMode, setPricingMode] = useState("standard");
  const [requestsPerMonth, setRequestsPerMonth] = useState("50000");
  const [uncachedInputPerRequest, setUncachedInputPerRequest] = useState("800");
  const [cachedInputPerRequest, setCachedInputPerRequest] = useState("200");
  const [cacheWritePerRequest, setCacheWritePerRequest] = useState("0");
  const [outputTokensPerRequest, setOutputTokensPerRequest] = useState("300");
  const [customPricing, setCustomPricing] = useState(false);
  const [customInputPrice, setCustomInputPrice] = useState(
    String(MODEL_PRICES["gpt-6-astra"].input),
  );
  const [customCachedPrice, setCustomCachedPrice] = useState(
    String(MODEL_PRICES["gpt-6-astra"].cachedInput),
  );
  const [customCacheWritePrice, setCustomCacheWritePrice] = useState(
    String(MODEL_PRICES["gpt-6-astra"].cacheWrite),
  );
  const [customOutputPrice, setCustomOutputPrice] = useState(
    String(MODEL_PRICES["gpt-6-astra"].output),
  );

  const selectedModel = MODEL_PRICES[model];

  const hasInvalidInput = useMemo(() => {
    const usageValues = [
    requestsPerMonth,
    uncachedInputPerRequest,
    cachedInputPerRequest,
    cacheWritePerRequest,
    outputTokensPerRequest,
  ];

    if (
      usageValues.some(
        (value) => !isValidNonNegativeInteger(value),
      )
    ) {
      return true;
    }

    if (!customPricing) {
      return false;
    }

    const customValues = [
    customInputPrice,
    customCachedPrice,
    customCacheWritePrice,
    customOutputPrice,
  ];

    return customValues.some(
      (value) => !isValidNonNegativeDecimal(value),
    );
  }, [
  cacheWritePerRequest,
  cachedInputPerRequest,
  customCacheWritePrice,
  customCachedPrice,
  customInputPrice,
  customOutputPrice,
  customPricing,
  outputTokensPerRequest,
  requestsPerMonth,
  uncachedInputPerRequest,
]);

  const basePrices = useMemo(() => {
    if (!customPricing) return selectedModel;

    return {
      ...selectedModel,
      input: toNumber(customInputPrice),
      cachedInput: toNumber(customCachedPrice),
      cacheWrite: toNumber(customCacheWritePrice),
      output: toNumber(customOutputPrice),
    };
  }, [
    customCacheWritePrice,
    customCachedPrice,
    customInputPrice,
    customOutputPrice,
    customPricing,
    selectedModel,
  ]);

  const result = useMemo(() => {
    const requests = toNumber(requestsPerMonth);
    const uncachedPerRequest = toNumber(uncachedInputPerRequest);
    const cachedPerRequest = toNumber(cachedInputPerRequest);
    const cacheWritePerRequestValue = toNumber(cacheWritePerRequest);
    const outputPerRequest = toNumber(outputTokensPerRequest);

    const totalInputPerRequest =
      uncachedPerRequest + cachedPerRequest + cacheWritePerRequestValue;

    const longContextApplies =
      basePrices.longContextPricing &&
      totalInputPerRequest > LONG_CONTEXT_THRESHOLD;

    const processingMultiplier = pricingMode === "batch" ? 0.5 : 1;
    const inputMultiplier = longContextApplies ? 2 : 1;
    const outputMultiplier = longContextApplies ? 1.5 : 1;

    const effectivePrices = {
      input: basePrices.input * processingMultiplier * inputMultiplier,
      cachedInput:
        basePrices.cachedInput * processingMultiplier * inputMultiplier,
      cacheWrite:
        basePrices.cacheWrite * processingMultiplier * inputMultiplier,
      output: basePrices.output * processingMultiplier * outputMultiplier,
    };

    const totalUncachedInputTokens = requests * uncachedPerRequest;
    const totalCachedInputTokens = requests * cachedPerRequest;
    const totalCacheWriteTokens = requests * cacheWritePerRequestValue;
    const totalInputTokens =
      totalUncachedInputTokens + totalCachedInputTokens + totalCacheWriteTokens;
    const totalOutputTokens = requests * outputPerRequest;

    const uncachedInputCost =
      (totalUncachedInputTokens / 1_000_000) * effectivePrices.input;
    const cachedInputCost =
      (totalCachedInputTokens / 1_000_000) * effectivePrices.cachedInput;
    const cacheWriteCost =
      (totalCacheWriteTokens / 1_000_000) * effectivePrices.cacheWrite;
    const outputCost =
      (totalOutputTokens / 1_000_000) * effectivePrices.output;

    const monthlyCost =
      uncachedInputCost + cachedInputCost + cacheWriteCost + outputCost;
    const costPerRequest = requests > 0 ? monthlyCost / requests : 0;
    const dailyAverage = monthlyCost / 30;
    const yearlyCost = monthlyCost * 12;

    return {
      requests,
      totalInputPerRequest,
      totalUncachedInputTokens,
      totalCachedInputTokens,
      totalCacheWriteTokens,
      totalInputTokens,
      totalOutputTokens,
      uncachedInputCost,
      cachedInputCost,
      cacheWriteCost,
      outputCost,
      monthlyCost,
      costPerRequest,
      dailyAverage,
      yearlyCost,
      longContextApplies,
      effectivePrices,
    };
  }, [
    basePrices,
    cacheWritePerRequest,
    cachedInputPerRequest,
    outputTokensPerRequest,
    pricingMode,
    requestsPerMonth,
    uncachedInputPerRequest,
  ]);

  const hasUnsafeResult = useMemo(() => {
    const values = [
      result.totalInputPerRequest,
      result.totalUncachedInputTokens,
      result.totalCachedInputTokens,
      result.totalCacheWriteTokens,
      result.totalInputTokens,
      result.totalOutputTokens,
      result.uncachedInputCost,
      result.cachedInputCost,
      result.cacheWriteCost,
      result.outputCost,
      result.monthlyCost,
      result.costPerRequest,
      result.dailyAverage,
      result.yearlyCost,
    ];

    return values.some(
      (value) =>
        !Number.isFinite(value) ||
        Math.abs(value) > Number.MAX_SAFE_INTEGER,
    );
  }, [result]);

  const hasDisplayError = hasInvalidInput || hasUnsafeResult;

  const updateModel = (value: string) => {
    const nextModel = value as ModelKey;
    const prices = MODEL_PRICES[nextModel];

    setModel(nextModel);

    if (!customPricing) {
      setCustomInputPrice(String(prices.input));
      setCustomCachedPrice(String(prices.cachedInput));
      setCustomCacheWritePrice(String(prices.cacheWrite));
      setCustomOutputPrice(String(prices.output));
    }
  };

  const reset = () => {
    const defaultModel = MODEL_PRICES["gpt-6-astra"];

    setModel("gpt-6-astra");
    setPricingMode("standard");
    setRequestsPerMonth("50000");
    setUncachedInputPerRequest("800");
    setCachedInputPerRequest("200");
    setCacheWritePerRequest("0");
    setOutputTokensPerRequest("300");
    setCustomPricing(false);
    setCustomInputPrice(String(defaultModel.input));
    setCustomCachedPrice(String(defaultModel.cachedInput));
    setCustomCacheWritePrice(String(defaultModel.cacheWrite));
    setCustomOutputPrice(String(defaultModel.output));
  };

  const visibleMoney = (value: number) =>
    hasDisplayError ? "—" : formatMoney(value);

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your OpenAI API Usage
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Enter average token usage for one request, then add the number of
            requests you expect in a month.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <BeeijaSelect
            label="OpenAI model"
            value={model}
            onChange={(event) => updateModel(event.target.value)}
            options={modelOptions}
          />

          <BeeijaSelect
            label="Processing mode"
            value={pricingMode}
            onChange={(event) => setPricingMode(event.target.value)}
            options={pricingModeOptions}
          />

          <BeeijaNumberField
            label="Requests per month"
            value={requestsPerMonth}
            onChange={setRequestsPerMonth}
            min="0"
            step="1"
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Uncached input tokens per request"
            value={uncachedInputPerRequest}
            onChange={setUncachedInputPerRequest}
            min="0"
            step="1"
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Cached input tokens per request"
            value={cachedInputPerRequest}
            onChange={setCachedInputPerRequest}
            min="0"
            step="1"
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Cache-write tokens per request"
            value={cacheWritePerRequest}
            onChange={setCacheWritePerRequest}
            min="0"
            step="1"
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Output tokens per request"
            value={outputTokensPerRequest}
            onChange={setOutputTokensPerRequest}
            min="0"
            step="1"
            sanitizeDecimal
          />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          Cached input means tokens read from an existing prompt cache. Cache
          writes are tokens newly written to cache on GPT-5.6 and later models.
        </p>

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
              Replace the selected model&apos;s standard per-million-token rates.
            </span>
          </span>
        </label>

        {customPricing ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <BeeijaNumberField
              label="Uncached input price"
              value={customInputPrice}
              onChange={setCustomInputPrice}
              min="0"
              step="0.001"
              prefix="$"
              sanitizeDecimal
            />

            <BeeijaNumberField
              label="Cached input price"
              value={customCachedPrice}
              onChange={setCustomCachedPrice}
              min="0"
              step="0.001"
              prefix="$"
              sanitizeDecimal
            />

            <BeeijaNumberField
              label="Cache-write price"
              value={customCacheWritePrice}
              onChange={setCustomCacheWritePrice}
              min="0"
              step="0.001"
              prefix="$"
              sanitizeDecimal
            />

            <BeeijaNumberField
              label="Output price"
              value={customOutputPrice}
              onChange={setCustomOutputPrice}
              min="0"
              step="0.001"
              prefix="$"
              sanitizeDecimal
            />
          </div>
        ) : null}

        {hasInvalidInput ? (
          <div className="mt-6 border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-800">
            Use non-negative whole numbers for requests and token counts, and
            ordinary decimal numbers for custom prices. Scientific notation is
            not accepted.
          </div>
        ) : null}

        {!hasInvalidInput && hasUnsafeResult ? (
          <div className="mt-6 border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-800">
            The entered workload is too large to calculate reliably in the
            browser. Use smaller whole-number values before relying on the
            estimate.
          </div>
        ) : null}

        {!hasDisplayError && result.longContextApplies ? (
          <div className="mt-6 border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4 text-sm leading-relaxed text-gray-700">
            This request is above 272,000 input tokens. The calculator applies
            OpenAI&apos;s current long-context multiplier: 2× input and cache
            rates, and 1.5× output rates for the full request.
          </div>
        ) : null}

        <div className="mt-7 border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <p className="font-medium text-gray-900">
              Rates used per 1 million tokens
            </p>
            <p className="text-sm text-gray-500">
              {pricingMode === "batch" ? "Batch" : "Standard"}
              {!hasDisplayError && result.longContextApplies ? " · long-context rate" : ""}
            </p>
          </div>

          <div className="mt-3 grid min-w-0 gap-3 text-sm text-gray-700 sm:grid-cols-2 xl:grid-cols-4">
            <RateStat
              label="Uncached input"
              value={
                hasDisplayError
                  ? "—"
                  : formatVisibleMoney(result.effectivePrices.input)
              }
            />
            <RateStat
              label="Cached input"
              value={
                hasDisplayError
                  ? "—"
                  : formatVisibleMoney(result.effectivePrices.cachedInput)
              }
            />
            <RateStat
              label="Cache write"
              value={
                hasDisplayError
                  ? "—"
                  : formatVisibleMoney(result.effectivePrices.cacheWrite)
              }
            />
            <RateStat
              label="Output"
              value={
                hasDisplayError
                  ? "—"
                  : formatVisibleMoney(result.effectivePrices.output)
              }
            />
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
        title="Estimated OpenAI API Cost"
        description="Text-token estimate only; tool calls and other paid services are separate."
        primaryLabel="Estimated monthly cost"
        primaryValue={visibleMoney(result.monthlyCost)}
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per request"
              value={visibleMoney(result.costPerRequest)}
            />
            <ResultStat
              label="Daily avg. (30d)"
              value={visibleMoney(result.dailyAverage)}
            />
            <ResultStat
              label="Per year"
              value={visibleMoney(result.yearlyCost)}
            />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            <CostRow
              label="Uncached input"
              detail={
                hasDisplayError
                  ? "Check inputs"
                  : `${formatNumber(result.totalUncachedInputTokens)} tokens`
              }
              value={visibleMoney(result.uncachedInputCost)}
            />

            <CostRow
              label="Cached input"
              detail={
                hasDisplayError
                  ? "Check inputs"
                  : `${formatNumber(result.totalCachedInputTokens)} tokens`
              }
              value={visibleMoney(result.cachedInputCost)}
            />

            <CostRow
              label="Cache writes"
              detail={
                hasDisplayError
                  ? "Check inputs"
                  : `${formatNumber(result.totalCacheWriteTokens)} tokens`
              }
              value={visibleMoney(result.cacheWriteCost)}
            />

            <CostRow
              label="Output"
              detail={
                hasDisplayError
                  ? "Check inputs"
                  : `${formatNumber(result.totalOutputTokens)} tokens`
              }
              value={visibleMoney(result.outputCost)}
            />
          </div>
        }
        totals={
          <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
            <p>
              Requests: {" "}
              <span className="font-medium text-gray-900">
                {hasDisplayError ? "—" : formatNumber(result.requests)}
              </span>
            </p>

            <p className="mt-2">
              Input tokens per request: {" "}
              <span className="font-medium text-gray-900">
                {hasDisplayError
                  ? "—"
                  : formatNumber(result.totalInputPerRequest)}
              </span>
            </p>

            <p className="mt-2">
              Total input tokens: {" "}
              <span className="font-medium text-gray-900">
                {hasDisplayError ? "—" : formatNumber(result.totalInputTokens)}
              </span>
            </p>

            <p className="mt-2">
              Total output tokens: {" "}
              <span className="font-medium text-gray-900">
                {hasDisplayError ? "—" : formatNumber(result.totalOutputTokens)}
              </span>
            </p>
          </div>
        }
        noticeText="Built-in rates checked September 16, 2026. Final OpenAI charges can also include tool calls, media, storage, regional processing, taxes, discounts, or usage not entered here."
      />
    </div>
  );
}

function RateStat({ label, value }: { label: string; value: string }) {
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
        <p className="mt-1 text-sm text-gray-500">{detail}</p>
      </div>

      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

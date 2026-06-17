"use client";

import { useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaNotice from "@/app/components/BeeijaNotice";

type ModelKey =
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite";

type PromptTier = "short" | "long";
type PricingMode = "standard" | "batch";

type RateSet = {
  input: number;
  cachedInput: number;
  output: number;
};

type ModelPrice = {
  label: string;
  standardShort: RateSet;
  standardLong?: RateSet;
  batchShort: RateSet;
  batchLong?: RateSet;
};

const MODEL_PRICES: Record<ModelKey, ModelPrice> = {
  "gemini-2.5-pro": {
    label: "Gemini 2.5 Pro",
    standardShort: {
      input: 1.25,
      cachedInput: 0.125,
      output: 10,
    },
    standardLong: {
      input: 2.5,
      cachedInput: 0.25,
      output: 15,
    },
    batchShort: {
      input: 0.625,
      cachedInput: 0.125,
      output: 5,
    },
    batchLong: {
      input: 1.25,
      cachedInput: 0.25,
      output: 7.5,
    },
  },
  "gemini-2.5-flash": {
    label: "Gemini 2.5 Flash",
    standardShort: {
      input: 0.3,
      cachedInput: 0.03,
      output: 2.5,
    },
    batchShort: {
      input: 0.15,
      cachedInput: 0.03,
      output: 1.25,
    },
  },
  "gemini-2.5-flash-lite": {
    label: "Gemini 2.5 Flash-Lite",
    standardShort: {
      input: 0.1,
      cachedInput: 0.01,
      output: 0.4,
    },
    batchShort: {
      input: 0.05,
      cachedInput: 0.01,
      output: 0.2,
    },
  },
};

const modelOptions = Object.entries(MODEL_PRICES).map(([value, model]) => ({
  value,
  label: model.label,
}));

const promptTierOptions = [
  { value: "short", label: "Prompt up to 200K tokens" },
  { value: "long", label: "Prompt above 200K tokens" },
];

const pricingModeOptions = [
  { value: "standard", label: "Standard API" },
  { value: "batch", label: "Batch API" },
];

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ToolClient() {
  const [model, setModel] = useState<ModelKey>("gemini-2.5-flash");
  const [promptTier, setPromptTier] = useState<PromptTier>("short");
  const [pricingMode, setPricingMode] =
    useState<PricingMode>("standard");

  const [requestsPerMonth, setRequestsPerMonth] = useState("60000");
  const [inputTokensPerRequest, setInputTokensPerRequest] = useState("1200");
  const [outputTokensPerRequest, setOutputTokensPerRequest] = useState("400");
  const [cachedInputPercent, setCachedInputPercent] = useState("25");

  const [customPricing, setCustomPricing] = useState(false);
  const [customInputPrice, setCustomInputPrice] = useState("0.3");
  const [customCachedPrice, setCustomCachedPrice] = useState("0.03");
  const [customOutputPrice, setCustomOutputPrice] = useState("2.5");

  const selectedModel = MODEL_PRICES[model];
  const supportsLongPrompt = Boolean(selectedModel.standardLong);

  const builtInPrices = useMemo(() => {
    const isLong = supportsLongPrompt && promptTier === "long";

    if (pricingMode === "batch") {
      return isLong && selectedModel.batchLong
        ? selectedModel.batchLong
        : selectedModel.batchShort;
    }

    return isLong && selectedModel.standardLong
      ? selectedModel.standardLong
      : selectedModel.standardShort;
  }, [pricingMode, promptTier, selectedModel, supportsLongPrompt]);

  const effectivePrices = useMemo(
    () =>
      customPricing
        ? {
            input: toNumber(customInputPrice),
            cachedInput: toNumber(customCachedPrice),
            output: toNumber(customOutputPrice),
          }
        : builtInPrices,
    [
      builtInPrices,
      customCachedPrice,
      customInputPrice,
      customOutputPrice,
      customPricing,
    ],
  );

  const result = useMemo(() => {
    const requests = toNumber(requestsPerMonth);
    const inputPerRequest = toNumber(inputTokensPerRequest);
    const outputPerRequest = toNumber(outputTokensPerRequest);
    const cachePercent = Math.min(
      100,
      Math.max(0, toNumber(cachedInputPercent)),
    );

    const totalInputTokens = requests * inputPerRequest;
    const cachedInputTokens = totalInputTokens * (cachePercent / 100);
    const uncachedInputTokens = totalInputTokens - cachedInputTokens;
    const totalOutputTokens = requests * outputPerRequest;

    const inputCost =
      (uncachedInputTokens / 1_000_000) * effectivePrices.input;
    const cachedInputCost =
      (cachedInputTokens / 1_000_000) * effectivePrices.cachedInput;
    const outputCost =
      (totalOutputTokens / 1_000_000) * effectivePrices.output;

    const monthlyCost = inputCost + cachedInputCost + outputCost;
    const costPerRequest = requests > 0 ? monthlyCost / requests : 0;
    const dailyCost = monthlyCost / 30;
    const yearlyCost = monthlyCost * 12;

    return {
      requests,
      totalInputTokens,
      cachedInputTokens,
      uncachedInputTokens,
      totalOutputTokens,
      inputCost,
      cachedInputCost,
      outputCost,
      monthlyCost,
      costPerRequest,
      dailyCost,
      yearlyCost,
    };
  }, [
    cachedInputPercent,
    effectivePrices,
    inputTokensPerRequest,
    outputTokensPerRequest,
    requestsPerMonth,
  ]);

  const applyBuiltInPrices = (
    nextModel: ModelKey,
    nextTier: PromptTier,
    nextMode: PricingMode,
  ) => {
    const modelPrice = MODEL_PRICES[nextModel];
    const longAllowed = Boolean(modelPrice.standardLong);
    const useLong = longAllowed && nextTier === "long";

    const rate =
      nextMode === "batch"
        ? useLong && modelPrice.batchLong
          ? modelPrice.batchLong
          : modelPrice.batchShort
        : useLong && modelPrice.standardLong
          ? modelPrice.standardLong
          : modelPrice.standardShort;

    setCustomInputPrice(String(rate.input));
    setCustomCachedPrice(String(rate.cachedInput));
    setCustomOutputPrice(String(rate.output));
  };

  const updateModel = (value: string) => {
    const nextModel = value as ModelKey;
    const nextTier =
      MODEL_PRICES[nextModel].standardLong ? promptTier : "short";

    setModel(nextModel);
    setPromptTier(nextTier);

    if (!customPricing) {
      applyBuiltInPrices(nextModel, nextTier, pricingMode);
    }
  };

  const updatePromptTier = (value: string) => {
    const nextTier = value as PromptTier;
    setPromptTier(nextTier);

    if (!customPricing) {
      applyBuiltInPrices(model, nextTier, pricingMode);
    }
  };

  const updatePricingMode = (value: string) => {
    const nextMode = value as PricingMode;
    setPricingMode(nextMode);

    if (!customPricing) {
      applyBuiltInPrices(model, promptTier, nextMode);
    }
  };

  const reset = () => {
    setModel("gemini-2.5-flash");
    setPromptTier("short");
    setPricingMode("standard");
    setRequestsPerMonth("60000");
    setInputTokensPerRequest("1200");
    setOutputTokensPerRequest("400");
    setCachedInputPercent("25");
    setCustomPricing(false);
    setCustomInputPrice("0.3");
    setCustomCachedPrice("0.03");
    setCustomOutputPrice("2.5");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Gemini API Usage
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Use average token values for one request, then enter the expected
            number of requests in one month.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <BeeijaSelect
            label="Gemini model"
            value={model}
            onChange={(event) => updateModel(event.target.value)}
            options={modelOptions}
          />

          <BeeijaSelect
            label="Pricing mode"
            value={pricingMode}
            onChange={(event) => updatePricingMode(event.target.value)}
            options={pricingModeOptions}
          />

          <BeeijaSelect
            label="Prompt size"
            value={promptTier}
            onChange={(event) => updatePromptTier(event.target.value)}
            options={promptTierOptions}
            disabled={!supportsLongPrompt}
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

          <BeeijaNumberField
            label="Cached input percentage"
            value={cachedInputPercent}
            onChange={setCachedInputPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
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
              Enter your own price per 1 million tokens.
            </span>
          </span>
        </label>

        {customPricing ? (
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <BeeijaNumberField
              label="Input price"
              value={customInputPrice}
              onChange={setCustomInputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            <BeeijaNumberField
              label="Cached input price"
              value={customCachedPrice}
              onChange={setCustomCachedPrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            <BeeijaNumberField
              label="Output price"
              value={customOutputPrice}
              onChange={setCustomOutputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />
          </div>
        ) : null}

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Price used per 1 million tokens
          </p>

          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-3">
            <p>Input: {formatMoney(effectivePrices.input)}</p>
            <p>Cached: {formatMoney(effectivePrices.cachedInput)}</p>
            <p>Output: {formatMoney(effectivePrices.output)}</p>
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

      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-950">
          Estimated Gemini API Cost
        </h2>

        <p className="mt-3 leading-relaxed text-gray-600">
          This estimate covers the token charges entered above.
        </p>

        <div className="mt-7 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Estimated monthly cost
          </p>

          <p className="mt-2 break-words text-4xl font-bold tracking-tight text-[var(--green)]">
            {formatMoney(result.monthlyCost)}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per request"
              value={formatMoney(result.costPerRequest)}
            />
            <ResultStat
              label="Per day"
              value={formatMoney(result.dailyCost)}
            />
            <ResultStat
              label="Per year"
              value={formatMoney(result.yearlyCost)}
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <CostRow
            label="Uncached input cost"
            detail={`${formatNumber(result.uncachedInputTokens)} tokens`}
            value={formatMoney(result.inputCost)}
          />

          <CostRow
            label="Cached input cost"
            detail={`${formatNumber(result.cachedInputTokens)} tokens`}
            value={formatMoney(result.cachedInputCost)}
          />

          <CostRow
            label="Output cost"
            detail={`${formatNumber(result.totalOutputTokens)} tokens`}
            value={formatMoney(result.outputCost)}
          />
        </div>

        <div className="mt-6 border-t border-gray-200 pt-5 text-sm leading-relaxed text-gray-600">
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

        <BeeijaNotice>
          Built-in Google Gemini rates were checked on June 18, 2026. Cache
          storage, grounding, media, taxes, discounts, and other services are
          not included.
        </BeeijaNotice>
      </section>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-gray-950">{value}</p>
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
    <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 text-sm text-gray-500">{detail}</p>
      </div>

      <p className="font-semibold text-gray-950">{value}</p>
    </div>
  );
}

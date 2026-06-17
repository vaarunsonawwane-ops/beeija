"use client";

import { useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaNotice from "@/app/components/BeeijaNotice";

type ModelKey = "claude-opus-4.8" | "claude-sonnet-4.6" | "claude-haiku-4.5";
type CacheMode = "none" | "5m" | "1h";

type ModelPrice = {
  label: string;
  input: number;
  cacheWrite5m: number;
  cacheWrite1h: number;
  cacheRead: number;
  output: number;
};

const MODEL_PRICES: Record<ModelKey, ModelPrice> = {
  "claude-opus-4.8": {
    label: "Claude Opus 4.8",
    input: 5,
    cacheWrite5m: 6.25,
    cacheWrite1h: 10,
    cacheRead: 0.5,
    output: 25,
  },
  "claude-sonnet-4.6": {
    label: "Claude Sonnet 4.6",
    input: 3,
    cacheWrite5m: 3.75,
    cacheWrite1h: 6,
    cacheRead: 0.3,
    output: 15,
  },
  "claude-haiku-4.5": {
    label: "Claude Haiku 4.5",
    input: 1,
    cacheWrite5m: 1.25,
    cacheWrite1h: 2,
    cacheRead: 0.1,
    output: 5,
  },
};

const modelOptions = Object.entries(MODEL_PRICES).map(([value, model]) => ({
  value,
  label: model.label,
}));

const cacheOptions = [
  { value: "none", label: "No cache write" },
  { value: "5m", label: "5-minute cache write" },
  { value: "1h", label: "1-hour cache write" },
];

const pricingModeOptions = [
  { value: "standard", label: "Standard API" },
  { value: "batch", label: "Batch API estimate (50% lower)" },
];

const geographyOptions = [
  { value: "global", label: "Global routing" },
  { value: "us", label: "US-only inference (1.1x)" },
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
  const [model, setModel] = useState<ModelKey>("claude-sonnet-4.6");
  const [cacheMode, setCacheMode] = useState<CacheMode>("5m");
  const [pricingMode, setPricingMode] = useState("standard");
  const [geography, setGeography] = useState("global");

  const [requestsPerMonth, setRequestsPerMonth] = useState("40000");
  const [baseInputTokens, setBaseInputTokens] = useState("900");
  const [cacheWriteTokens, setCacheWriteTokens] = useState("0");
  const [cacheReadTokens, setCacheReadTokens] = useState("2000");
  const [outputTokens, setOutputTokens] = useState("350");

  const [customPricing, setCustomPricing] = useState(false);
  const [customInputPrice, setCustomInputPrice] = useState("3");
  const [customCacheWritePrice, setCustomCacheWritePrice] = useState("3.75");
  const [customCacheReadPrice, setCustomCacheReadPrice] = useState("0.3");
  const [customOutputPrice, setCustomOutputPrice] = useState("15");

  const selectedModel = MODEL_PRICES[model];

  const selectedCacheWritePrice =
    cacheMode === "1h"
      ? selectedModel.cacheWrite1h
      : selectedModel.cacheWrite5m;

  const effectivePrices = useMemo(() => {
    const base = customPricing
      ? {
          input: toNumber(customInputPrice),
          cacheWrite: toNumber(customCacheWritePrice),
          cacheRead: toNumber(customCacheReadPrice),
          output: toNumber(customOutputPrice),
        }
      : {
          input: selectedModel.input,
          cacheWrite: cacheMode === "none" ? 0 : selectedCacheWritePrice,
          cacheRead: selectedModel.cacheRead,
          output: selectedModel.output,
        };

    const batchMultiplier = pricingMode === "batch" ? 0.5 : 1;
    const geographyMultiplier = geography === "us" ? 1.1 : 1;

    return {
      input: base.input * batchMultiplier * geographyMultiplier,
      cacheWrite: base.cacheWrite * batchMultiplier * geographyMultiplier,
      cacheRead: base.cacheRead * batchMultiplier * geographyMultiplier,
      output: base.output * batchMultiplier * geographyMultiplier,
    };
  }, [
    cacheMode,
    customCacheReadPrice,
    customCacheWritePrice,
    customInputPrice,
    customOutputPrice,
    customPricing,
    geography,
    pricingMode,
    selectedCacheWritePrice,
    selectedModel,
  ]);

  const result = useMemo(() => {
    const requests = toNumber(requestsPerMonth);
    const inputPerRequest = toNumber(baseInputTokens);
    const writePerRequest =
      cacheMode === "none" ? 0 : toNumber(cacheWriteTokens);
    const readPerRequest = toNumber(cacheReadTokens);
    const outputPerRequest = toNumber(outputTokens);

    const totalInput = requests * inputPerRequest;
    const totalCacheWrite = requests * writePerRequest;
    const totalCacheRead = requests * readPerRequest;
    const totalOutput = requests * outputPerRequest;

    const inputCost = (totalInput / 1_000_000) * effectivePrices.input;
    const cacheWriteCost =
      (totalCacheWrite / 1_000_000) * effectivePrices.cacheWrite;
    const cacheReadCost =
      (totalCacheRead / 1_000_000) * effectivePrices.cacheRead;
    const outputCost = (totalOutput / 1_000_000) * effectivePrices.output;

    const monthlyCost =
      inputCost + cacheWriteCost + cacheReadCost + outputCost;
    const costPerRequest = requests > 0 ? monthlyCost / requests : 0;
    const dailyCost = monthlyCost / 30;
    const yearlyCost = monthlyCost * 12;

    return {
      requests,
      totalInput,
      totalCacheWrite,
      totalCacheRead,
      totalOutput,
      inputCost,
      cacheWriteCost,
      cacheReadCost,
      outputCost,
      monthlyCost,
      costPerRequest,
      dailyCost,
      yearlyCost,
    };
  }, [
    baseInputTokens,
    cacheMode,
    cacheReadTokens,
    cacheWriteTokens,
    effectivePrices,
    outputTokens,
    requestsPerMonth,
  ]);

  const updateModel = (value: string) => {
    const nextModel = value as ModelKey;
    const prices = MODEL_PRICES[nextModel];

    setModel(nextModel);

    if (!customPricing) {
      setCustomInputPrice(String(prices.input));
      setCustomCacheWritePrice(
        String(cacheMode === "1h" ? prices.cacheWrite1h : prices.cacheWrite5m),
      );
      setCustomCacheReadPrice(String(prices.cacheRead));
      setCustomOutputPrice(String(prices.output));
    }
  };

  const updateCacheMode = (value: string) => {
    const nextMode = value as CacheMode;
    setCacheMode(nextMode);

    if (!customPricing) {
      const price =
        nextMode === "none"
          ? 0
          : nextMode === "1h"
            ? selectedModel.cacheWrite1h
            : selectedModel.cacheWrite5m;

      setCustomCacheWritePrice(String(price));
    }
  };

  const reset = () => {
    setModel("claude-sonnet-4.6");
    setCacheMode("5m");
    setPricingMode("standard");
    setGeography("global");
    setRequestsPerMonth("40000");
    setBaseInputTokens("900");
    setCacheWriteTokens("0");
    setCacheReadTokens("2000");
    setOutputTokens("350");
    setCustomPricing(false);
    setCustomInputPrice("3");
    setCustomCacheWritePrice("3.75");
    setCustomCacheReadPrice("0.3");
    setCustomOutputPrice("15");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Claude API Usage
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Use average token values for one request, then enter the expected
            number of requests in one month.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <BeeijaSelect
            label="Claude model"
            value={model}
            onChange={(event) => updateModel(event.target.value)}
            options={modelOptions}
          />

          <BeeijaSelect
            label="Cache write type"
            value={cacheMode}
            onChange={(event) => updateCacheMode(event.target.value)}
            options={cacheOptions}
          />

          <BeeijaSelect
            label="Pricing mode"
            value={pricingMode}
            onChange={(event) => setPricingMode(event.target.value)}
            options={pricingModeOptions}
          />

          <BeeijaSelect
            label="Inference region"
            value={geography}
            onChange={(event) => setGeography(event.target.value)}
            options={geographyOptions}
          />

          <BeeijaNumberField
            label="Requests per month"
            value={requestsPerMonth}
            onChange={setRequestsPerMonth}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Base input tokens per request"
            value={baseInputTokens}
            onChange={setBaseInputTokens}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Cache write tokens per request"
            value={cacheWriteTokens}
            onChange={setCacheWriteTokens}
            min="0"
            step="1"
            disabled={cacheMode === "none"}
          />

          <BeeijaNumberField
            label="Cache read tokens per request"
            value={cacheReadTokens}
            onChange={setCacheReadTokens}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Output tokens per request"
            value={outputTokens}
            onChange={setOutputTokens}
            min="0"
            step="1"
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
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <BeeijaNumberField
              label="Base input price"
              value={customInputPrice}
              onChange={setCustomInputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            <BeeijaNumberField
              label="Cache write price"
              value={customCacheWritePrice}
              onChange={setCustomCacheWritePrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            <BeeijaNumberField
              label="Cache read price"
              value={customCacheReadPrice}
              onChange={setCustomCacheReadPrice}
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

          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>Base input: {formatMoney(effectivePrices.input)}</p>
            <p>Cache write: {formatMoney(effectivePrices.cacheWrite)}</p>
            <p>Cache read: {formatMoney(effectivePrices.cacheRead)}</p>
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
          Estimated Claude API Cost
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
            label="Base input cost"
            detail={`${formatNumber(result.totalInput)} tokens`}
            value={formatMoney(result.inputCost)}
          />

          <CostRow
            label="Cache write cost"
            detail={`${formatNumber(result.totalCacheWrite)} tokens`}
            value={formatMoney(result.cacheWriteCost)}
          />

          <CostRow
            label="Cache read cost"
            detail={`${formatNumber(result.totalCacheRead)} tokens`}
            value={formatMoney(result.cacheReadCost)}
          />

          <CostRow
            label="Output cost"
            detail={`${formatNumber(result.totalOutput)} tokens`}
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
            Total input-related tokens:{" "}
            <span className="font-medium text-gray-900">
              {formatNumber(
                result.totalInput +
                  result.totalCacheWrite +
                  result.totalCacheRead,
              )}
            </span>
          </p>

          <p className="mt-2">
            Total output tokens:{" "}
            <span className="font-medium text-gray-900">
              {formatNumber(result.totalOutput)}
            </span>
          </p>
        </div>

        <BeeijaNotice>
          Built-in Anthropic rates were checked on June 18, 2026. Final charges
          may include other Anthropic services, taxes, discounts, retries, or
          usage not entered here.
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

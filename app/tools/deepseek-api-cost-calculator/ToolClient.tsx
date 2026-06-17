"use client";

import { useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type ModelKey = "deepseek-v4-flash" | "deepseek-v4-pro";

type ModelPrice = {
  label: string;
  cacheHitInput: number;
  cacheMissInput: number;
  output: number;
};

const MODEL_PRICES: Record<ModelKey, ModelPrice> = {
  "deepseek-v4-flash": {
    label: "DeepSeek V4 Flash",
    cacheHitInput: 0.0028,
    cacheMissInput: 0.14,
    output: 0.28,
  },
  "deepseek-v4-pro": {
    label: "DeepSeek V4 Pro",
    cacheHitInput: 0.003625,
    cacheMissInput: 0.435,
    output: 0.87,
  },
};

const modelOptions = Object.entries(MODEL_PRICES).map(([value, model]) => ({
  value,
  label: model.label,
}));

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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ToolClient() {
  const [model, setModel] = useState<ModelKey>("deepseek-v4-flash");
  const [requestsPerMonth, setRequestsPerMonth] = useState("80000");
  const [inputTokensPerRequest, setInputTokensPerRequest] = useState("1500");
  const [outputTokensPerRequest, setOutputTokensPerRequest] = useState("450");
  const [cacheHitPercent, setCacheHitPercent] = useState("30");

  const [customPricing, setCustomPricing] = useState(false);
  const [customCacheHitPrice, setCustomCacheHitPrice] = useState("0.0028");
  const [customCacheMissPrice, setCustomCacheMissPrice] = useState("0.14");
  const [customOutputPrice, setCustomOutputPrice] = useState("0.28");

  const selectedModel = MODEL_PRICES[model];

  const effectivePrices = useMemo(
    () =>
      customPricing
        ? {
            cacheHitInput: toNumber(customCacheHitPrice),
            cacheMissInput: toNumber(customCacheMissPrice),
            output: toNumber(customOutputPrice),
          }
        : selectedModel,
    [
      customCacheHitPrice,
      customCacheMissPrice,
      customOutputPrice,
      customPricing,
      selectedModel,
    ],
  );

  const result = useMemo(() => {
    const requests = toNumber(requestsPerMonth);
    const inputPerRequest = toNumber(inputTokensPerRequest);
    const outputPerRequest = toNumber(outputTokensPerRequest);
    const cachePercent = Math.min(100, Math.max(0, toNumber(cacheHitPercent)));

    const totalInputTokens = requests * inputPerRequest;
    const cacheHitTokens = totalInputTokens * (cachePercent / 100);
    const cacheMissTokens = totalInputTokens - cacheHitTokens;
    const totalOutputTokens = requests * outputPerRequest;

    const cacheHitCost =
      (cacheHitTokens / 1_000_000) * effectivePrices.cacheHitInput;
    const cacheMissCost =
      (cacheMissTokens / 1_000_000) * effectivePrices.cacheMissInput;
    const outputCost =
      (totalOutputTokens / 1_000_000) * effectivePrices.output;

    const monthlyCost = cacheHitCost + cacheMissCost + outputCost;

    return {
      requests,
      totalInputTokens,
      cacheHitTokens,
      cacheMissTokens,
      totalOutputTokens,
      cacheHitCost,
      cacheMissCost,
      outputCost,
      monthlyCost,
      costPerRequest: requests > 0 ? monthlyCost / requests : 0,
      dailyCost: monthlyCost / 30,
      yearlyCost: monthlyCost * 12,
    };
  }, [
    cacheHitPercent,
    effectivePrices,
    inputTokensPerRequest,
    outputTokensPerRequest,
    requestsPerMonth,
  ]);

  const updateModel = (value: string) => {
    const nextModel = value as ModelKey;
    const prices = MODEL_PRICES[nextModel];
    setModel(nextModel);

    if (!customPricing) {
      setCustomCacheHitPrice(String(prices.cacheHitInput));
      setCustomCacheMissPrice(String(prices.cacheMissInput));
      setCustomOutputPrice(String(prices.output));
    }
  };

  const reset = () => {
    setModel("deepseek-v4-flash");
    setRequestsPerMonth("80000");
    setInputTokensPerRequest("1500");
    setOutputTokensPerRequest("450");
    setCacheHitPercent("30");
    setCustomPricing(false);
    setCustomCacheHitPrice("0.0028");
    setCustomCacheMissPrice("0.14");
    setCustomOutputPrice("0.28");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your DeepSeek API Usage
          </h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            Use average token values for one request, then enter the expected
            number of requests in one month.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <BeeijaSelect
            label="DeepSeek model"
            value={model}
            onChange={(event) => updateModel(event.target.value)}
            options={modelOptions}
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
            label="Cache-hit input percentage"
            value={cacheHitPercent}
            onChange={setCacheHitPercent}
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
              label="Cache-hit input price"
              value={customCacheHitPrice}
              onChange={setCustomCacheHitPrice}
              min="0"
              step="0.000001"
              prefix="$"
            />
            <BeeijaNumberField
              label="Cache-miss input price"
              value={customCacheMissPrice}
              onChange={setCustomCacheMissPrice}
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
            <p>Cache hit: {formatMoney(effectivePrices.cacheHitInput)}</p>
            <p>Cache miss: {formatMoney(effectivePrices.cacheMissInput)}</p>
            <p>Output: {formatMoney(effectivePrices.output)}</p>
          </div>
        </div>

        <button type="button" onClick={reset} className="beeija-btn-outline mt-6">
          Reset values
        </button>
      </section>

      <BeeijaCalculatorResultPanel
        title="Estimated DeepSeek API Cost"
        description="This estimate covers the token charges entered above."
        primaryLabel="Estimated monthly cost"
        primaryValue={formatMoney(result.monthlyCost)}
        stats={
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultStat label="Per request" value={formatMoney(result.costPerRequest)} />
            <ResultStat label="Per day" value={formatMoney(result.dailyCost)} />
            <ResultStat label="Per year" value={formatMoney(result.yearlyCost)} />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            <CostRow
              label="Cache-hit input cost"
              detail={`${formatNumber(result.cacheHitTokens)} tokens`}
              value={formatMoney(result.cacheHitCost)}
            />
            <CostRow
              label="Cache-miss input cost"
              detail={`${formatNumber(result.cacheMissTokens)} tokens`}
              value={formatMoney(result.cacheMissCost)}
            />
            <CostRow
              label="Output cost"
              detail={`${formatNumber(result.totalOutputTokens)} tokens`}
              value={formatMoney(result.outputCost)}
            />
          </div>
        }
        totals={
          <div className="text-sm leading-relaxed text-gray-600">
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
        provider="DeepSeek"
        pricingCheckedDate="June 18, 2026"
        excludedCosts="taxes, discounts, retries, price changes, and other services not entered here"
      />
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

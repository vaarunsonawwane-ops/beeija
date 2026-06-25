"use client";

import { useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type ModelKey = "gpt-5.5" | "gpt-5.4" | "gpt-5.4-mini";

type ModelPrice = {
  label: string;
  input: number;
  cachedInput: number;
  output: number;
};

const MODEL_PRICES: Record<ModelKey, ModelPrice> = {
  "gpt-5.5": {
    label: "GPT-5.5",
    input: 5,
    cachedInput: 0.5,
    output: 30,
  },
  "gpt-5.4": {
    label: "GPT-5.4",
    input: 2.5,
    cachedInput: 0.25,
    output: 15,
  },
  "gpt-5.4-mini": {
    label: "GPT-5.4 mini",
    input: 0.75,
    cachedInput: 0.075,
    output: 4.5,
  },
};

const modelOptions = Object.entries(MODEL_PRICES).map(([value, model]) => ({
  value,
  label: model.label,
}));

const pricingModeOptions = [
  { value: "standard", label: "Standard API" },
  { value: "batch", label: "Batch API estimate (50% lower)" },
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

function formatVisibleMoney(value: number) {
  return formatMoney(value).replace(/,/g, ",\u200B");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ToolClient() {
  const [model, setModel] = useState<ModelKey>("gpt-5.4-mini");
  const [pricingMode, setPricingMode] = useState("standard");
  const [requestsPerMonth, setRequestsPerMonth] = useState("50000");
  const [inputTokensPerRequest, setInputTokensPerRequest] = useState("1000");
  const [outputTokensPerRequest, setOutputTokensPerRequest] = useState("300");
  const [cachedInputPercent, setCachedInputPercent] = useState("20");
  const [customPricing, setCustomPricing] = useState(false);
  const [customInputPrice, setCustomInputPrice] = useState(
    String(MODEL_PRICES["gpt-5.4-mini"].input),
  );
  const [customCachedPrice, setCustomCachedPrice] = useState(
    String(MODEL_PRICES["gpt-5.4-mini"].cachedInput),
  );
  const [customOutputPrice, setCustomOutputPrice] = useState(
    String(MODEL_PRICES["gpt-5.4-mini"].output),
  );

  const selectedModel = MODEL_PRICES[model];

  const effectivePrices = useMemo(() => {
    const base = customPricing
      ? {
          input: toNumber(customInputPrice),
          cachedInput: toNumber(customCachedPrice),
          output: toNumber(customOutputPrice),
        }
      : selectedModel;

    const modeMultiplier = pricingMode === "batch" ? 0.5 : 1;

    return {
      input: base.input * modeMultiplier,
      cachedInput: base.cachedInput * modeMultiplier,
      output: base.output * modeMultiplier,
    };
  }, [
    customCachedPrice,
    customInputPrice,
    customOutputPrice,
    customPricing,
    pricingMode,
    selectedModel,
  ]);

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

  const updateModel = (value: string) => {
    const nextModel = value as ModelKey;
    const prices = MODEL_PRICES[nextModel];

    setModel(nextModel);

    if (!customPricing) {
      setCustomInputPrice(String(prices.input));
      setCustomCachedPrice(String(prices.cachedInput));
      setCustomOutputPrice(String(prices.output));
    }
  };

  const reset = () => {
    const defaultModel = MODEL_PRICES["gpt-5.4-mini"];

    setModel("gpt-5.4-mini");
    setPricingMode("standard");
    setRequestsPerMonth("50000");
    setInputTokensPerRequest("1000");
    setOutputTokensPerRequest("300");
    setCachedInputPercent("20");
    setCustomPricing(false);
    setCustomInputPrice(String(defaultModel.input));
    setCustomCachedPrice(String(defaultModel.cachedInput));
    setCustomOutputPrice(String(defaultModel.output));
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your OpenAI API Usage
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Use average values for one request, then enter the expected number
            of requests in a month.
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
            label="Pricing mode"
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

          <div className="mt-3 grid min-w-0 gap-3 text-sm text-gray-700 sm:grid-cols-3">
            <p className="min-w-0">
              <span className="block">Input:</span>
              <span className="mt-1 block min-w-0 break-words font-medium text-gray-900 [overflow-wrap:anywhere]">
                {formatVisibleMoney(effectivePrices.input)}
              </span>
            </p>

            <p className="min-w-0">
              <span className="block">Cached:</span>
              <span className="mt-1 block min-w-0 break-words font-medium text-gray-900 [overflow-wrap:anywhere]">
                {formatVisibleMoney(effectivePrices.cachedInput)}
              </span>
            </p>

            <p className="min-w-0">
              <span className="block">Output:</span>
              <span className="mt-1 block min-w-0 break-words font-medium text-gray-900 [overflow-wrap:anywhere]">
                {formatVisibleMoney(effectivePrices.output)}
              </span>
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
        title="Estimated OpenAI API Cost"
        description="This estimate covers text token charges only."
        primaryLabel="Estimated monthly cost"
        primaryValue={formatMoney(result.monthlyCost)}
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
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
        }
        breakdown={
          <div className="space-y-4">
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
        noticeText="Built-in rates checked June 19, 2026. Final charges may include other OpenAI services, taxes, discounts, retries, or usage not entered here."
      />
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

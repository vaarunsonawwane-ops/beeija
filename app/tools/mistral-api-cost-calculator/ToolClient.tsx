"use client";

import { useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type ModelKey = "mistral-large-3" | "mistral-medium-3.5" | "codestral";
type PricingMode = "standard" | "batch";

type ModelPrice = {
  label: string;
  input: number;
  output: number;
};

const MODEL_PRICES: Record<ModelKey, ModelPrice> = {
  "mistral-large-3": {
    label: "Mistral Large 3",
    input: 0.5,
    output: 1.5,
  },
  "mistral-medium-3.5": {
    label: "Mistral Medium 3.5",
    input: 1.5,
    output: 7.5,
  },
  codestral: {
    label: "Codestral",
    input: 0.3,
    output: 0.9,
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
  const [model, setModel] = useState<ModelKey>("mistral-large-3");
  const [pricingMode, setPricingMode] = useState<PricingMode>("standard");
  const [requestsPerMonth, setRequestsPerMonth] = useState("60000");
  const [inputTokensPerRequest, setInputTokensPerRequest] = useState("1100");
  const [outputTokensPerRequest, setOutputTokensPerRequest] = useState("350");
  const [customPricing, setCustomPricing] = useState(false);
  const [customInputPrice, setCustomInputPrice] = useState("0.5");
  const [customOutputPrice, setCustomOutputPrice] = useState("1.5");

  const selectedModel = MODEL_PRICES[model];

  const effectivePrices = useMemo(() => {
    const base = customPricing
      ? {
          input: toNumber(customInputPrice),
          output: toNumber(customOutputPrice),
        }
      : selectedModel;

    const multiplier = pricingMode === "batch" ? 0.5 : 1;

    return {
      input: base.input * multiplier,
      output: base.output * multiplier,
    };
  }, [
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

    const totalInputTokens = requests * inputPerRequest;
    const totalOutputTokens = requests * outputPerRequest;
    const inputCost =
      (totalInputTokens / 1_000_000) * effectivePrices.input;
    const outputCost =
      (totalOutputTokens / 1_000_000) * effectivePrices.output;
    const monthlyCost = inputCost + outputCost;

    return {
      requests,
      totalInputTokens,
      totalOutputTokens,
      inputCost,
      outputCost,
      monthlyCost,
      costPerRequest: requests > 0 ? monthlyCost / requests : 0,
      dailyCost: monthlyCost / 30,
      yearlyCost: monthlyCost * 12,
    };
  }, [
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
      setCustomOutputPrice(String(prices.output));
    }
  };

  const reset = () => {
    setModel("mistral-large-3");
    setPricingMode("standard");
    setRequestsPerMonth("60000");
    setInputTokensPerRequest("1100");
    setOutputTokensPerRequest("350");
    setCustomPricing(false);
    setCustomInputPrice("0.5");
    setCustomOutputPrice("1.5");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Mistral API Usage
          </h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            Use average token values for one request, then enter the expected
            number of requests in one month.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <BeeijaSelect
            label="Mistral model"
            value={model}
            onChange={(event) => updateModel(event.target.value)}
            options={modelOptions}
          />

          <BeeijaSelect
            label="Pricing mode"
            value={pricingMode}
            onChange={(event) =>
              setPricingMode(event.target.value as PricingMode)
            }
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
              label="Input price"
              value={customInputPrice}
              onChange={setCustomInputPrice}
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
            <p>Input: {formatMoney(effectivePrices.input)}</p>
            <p>Output: {formatMoney(effectivePrices.output)}</p>
          </div>
        </div>

        <button type="button" onClick={reset} className="beeija-btn-outline mt-6">
          Reset values
        </button>
      </section>

      <BeeijaCalculatorResultPanel
        title="Estimated Mistral API Cost"
        description="This estimate covers the text token charges entered above."
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
              label="Input cost"
              detail={`${formatNumber(result.totalInputTokens)} tokens`}
              value={formatMoney(result.inputCost)}
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
        provider="Mistral"
        pricingCheckedDate="June 18, 2026"
        excludedCosts="OCR, transcription, speech, fine-tuning, agents, tools, storage, taxes, discounts, retries, and other services"
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

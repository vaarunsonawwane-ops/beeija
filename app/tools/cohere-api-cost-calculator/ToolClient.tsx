"use client";

import { useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type ModelKey =
  | "command-a"
  | "command-r-plus"
  | "command-r"
  | "command-r7b";

type ModelPrice = {
  label: string;
  input: number;
  output: number;
};

const MODEL_PRICES: Record<ModelKey, ModelPrice> = {
  "command-a": {
    label: "Command A (command-a-03-2025)",
    input: 2.5,
    output: 10,
  },
  "command-r-plus": {
    label: "Command R+ (command-r-plus-08-2024)",
    input: 2.5,
    output: 10,
  },
  "command-r": {
    label: "Command R (command-r-08-2024)",
    input: 0.15,
    output: 0.6,
  },
  "command-r7b": {
    label: "Command R7B (command-r7b-12-2024)",
    input: 0.0375,
    output: 0.15,
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
  const [model, setModel] = useState<ModelKey>("command-r");
  const [requestsPerMonth, setRequestsPerMonth] = useState("40000");
  const [inputTokensPerRequest, setInputTokensPerRequest] = useState("1600");
  const [outputTokensPerRequest, setOutputTokensPerRequest] = useState("350");

  const [customPricing, setCustomPricing] = useState(false);
  const [customInputPrice, setCustomInputPrice] = useState("0.15");
  const [customOutputPrice, setCustomOutputPrice] = useState("0.6");

  const selectedModel = MODEL_PRICES[model];

  const effectivePrices = useMemo(
    () =>
      customPricing
        ? {
            input: toNumber(customInputPrice),
            output: toNumber(customOutputPrice),
          }
        : selectedModel,
    [
      customInputPrice,
      customOutputPrice,
      customPricing,
      selectedModel,
    ],
  );

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
    setModel("command-r");
    setRequestsPerMonth("40000");
    setInputTokensPerRequest("1600");
    setOutputTokensPerRequest("350");
    setCustomPricing(false);
    setCustomInputPrice("0.15");
    setCustomOutputPrice("0.6");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Cohere API Usage
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Use average billed token values for one request, then enter the
            expected number of requests in one month.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <BeeijaSelect
            label="Cohere model"
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
            label="Billed input tokens per request"
            value={inputTokensPerRequest}
            onChange={setInputTokensPerRequest}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Billed output tokens per request"
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

        <button
          type="button"
          onClick={reset}
          className="beeija-btn-outline mt-6"
        >
          Reset values
        </button>
      </section>

      <BeeijaCalculatorResultPanel
        title="Estimated Cohere API Cost"
        description="This estimate covers the text-generation token charges entered above."
        primaryLabel="Estimated monthly cost"
        primaryValue={formatMoney(result.monthlyCost)}
        stats={
          <div className="grid gap-4 sm:grid-cols-3">
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
              label="Input cost"
              detail={`${formatNumber(result.totalInputTokens)} billed tokens`}
              value={formatMoney(result.inputCost)}
            />

            <CostRow
              label="Output cost"
              detail={`${formatNumber(result.totalOutputTokens)} billed tokens`}
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
              Total billed input tokens:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(result.totalInputTokens)}
              </span>
            </p>

            <p className="mt-2">
              Total billed output tokens:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(result.totalOutputTokens)}
              </span>
            </p>
          </div>
        }
        provider="Cohere"
        pricingCheckedDate="June 18, 2026"
        excludedCosts="Embed, Rerank, transcription, private deployment, cloud platform fees, taxes, discounts, retries, and other services"
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

"use client";

import { useMemo, useState } from "react";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

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
  const [requestsPerMonth, setRequestsPerMonth] = useState("100000");
  const [inputTokensPerRequest, setInputTokensPerRequest] = useState("1000");
  const [outputTokensPerRequest, setOutputTokensPerRequest] = useState("300");
  const [cachedInputPercent, setCachedInputPercent] = useState("0");

  const [inputPrice, setInputPrice] = useState("1");
  const [cachedInputPrice, setCachedInputPrice] = useState("0.1");
  const [outputPrice, setOutputPrice] = useState("5");

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

    const uncachedInputCost =
      (uncachedInputTokens / 1_000_000) * toNumber(inputPrice);
    const cachedInputCost =
      (cachedInputTokens / 1_000_000) * toNumber(cachedInputPrice);
    const outputCost =
      (totalOutputTokens / 1_000_000) * toNumber(outputPrice);

    const monthlyCost =
      uncachedInputCost + cachedInputCost + outputCost;

    return {
      requests,
      totalInputTokens,
      cachedInputTokens,
      uncachedInputTokens,
      totalOutputTokens,
      uncachedInputCost,
      cachedInputCost,
      outputCost,
      monthlyCost,
      costPerRequest: requests > 0 ? monthlyCost / requests : 0,
      dailyCost: monthlyCost / 30,
      yearlyCost: monthlyCost * 12,
    };
  }, [
    cachedInputPercent,
    cachedInputPrice,
    inputPrice,
    inputTokensPerRequest,
    outputPrice,
    outputTokensPerRequest,
    requestsPerMonth,
  ]);

  const reset = () => {
    setRequestsPerMonth("100000");
    setInputTokensPerRequest("1000");
    setOutputTokensPerRequest("300");
    setCachedInputPercent("0");
    setInputPrice("1");
    setCachedInputPrice("0.1");
    setOutputPrice("5");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your AI Token Usage
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Add your expected requests, average tokens, and provider prices.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
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

        <div className="mt-7">
          <h3 className="text-lg font-semibold text-gray-950">
            Price per 1 Million Tokens
          </h3>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <BeeijaNumberField
              label="Input price"
              value={inputPrice}
              onChange={setInputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            <BeeijaNumberField
              label="Cached input price"
              value={cachedInputPrice}
              onChange={setCachedInputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            <BeeijaNumberField
              label="Output price"
              value={outputPrice}
              onChange={setOutputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />
          </div>
        </div>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Prices used for this estimate
          </p>

          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-3">
            <p>Input: {formatMoney(toNumber(inputPrice))}</p>
            <p>Cached: {formatMoney(toNumber(cachedInputPrice))}</p>
            <p>Output: {formatMoney(toNumber(outputPrice))}</p>
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
        title="Estimated AI Token Cost"
        description="This estimate covers the token prices entered above."
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
              label="Uncached input cost"
              detail={`${formatNumber(result.uncachedInputTokens)} tokens`}
              value={formatMoney(result.uncachedInputCost)}
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
        noticeText="This tool uses only the prices entered by you. Check the provider’s official pricing page before relying on the estimate. Final charges may also include tools, images, audio, storage, web search, taxes, discounts, retries, and other services."
        provider="AI provider"
        pricingCheckedDate="the date you checked the provider's pricing"
        excludedCosts="tools, images, audio, storage, web search, taxes, discounts, retries, and other services"
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

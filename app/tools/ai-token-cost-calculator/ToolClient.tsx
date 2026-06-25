"use client";

import { useMemo, useState } from "react";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaNotice from "@/app/components/BeeijaNotice";
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

function formatVisibleMoney(value: number) {
  return formatMoney(value).replace(/,/g, ",\u200B");
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

  const [inputPrice, setInputPrice] = useState("");
  const [cachedInputPrice, setCachedInputPrice] = useState("");
  const [outputPrice, setOutputPrice] = useState("");

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
      hasAnyPrice:
        inputPrice.trim() !== "" ||
        cachedInputPrice.trim() !== "" ||
        outputPrice.trim() !== "",
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
    setInputPrice("");
    setCachedInputPrice("");
    setOutputPrice("");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your AI Token Usage
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Add your expected requests, average tokens, and provider prices.
          </p>
        </div>

        <BeeijaNotice>
          Price fields are blank by design. Enter the current input, cached
          input, and output prices from the official page for the exact model
          and processing mode you plan to use.
        </BeeijaNotice>

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

          <div className="mt-3 grid min-w-0 gap-3 text-sm text-gray-700 sm:grid-cols-3">
            <PriceSummaryItem
              label="Input"
              value={
                inputPrice.trim() !== ""
                  ? formatVisibleMoney(toNumber(inputPrice))
                  : "Not entered"
              }
            />

            <PriceSummaryItem
              label="Cached"
              value={
                cachedInputPrice.trim() !== ""
                  ? formatVisibleMoney(toNumber(cachedInputPrice))
                  : "Not entered"
              }
            />

            <PriceSummaryItem
              label="Output"
              value={
                outputPrice.trim() !== ""
                  ? formatVisibleMoney(toNumber(outputPrice))
                  : "Not entered"
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
        title="Estimated AI Token Cost"
        description="This estimate covers the token prices entered above."
        primaryLabel="Estimated monthly cost"
        primaryValue={result.hasAnyPrice ? formatVisibleMoney(result.monthlyCost) : "Enter prices"}
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per request"
              value={result.hasAnyPrice ? formatVisibleMoney(result.costPerRequest) : "—"}
            />

            <ResultStat
              label="Per day"
              value={result.hasAnyPrice ? formatVisibleMoney(result.dailyCost) : "—"}
            />

            <ResultStat
              label="Per year"
              value={result.hasAnyPrice ? formatVisibleMoney(result.yearlyCost) : "—"}
            />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            <CostRow
              label="Uncached input cost"
              detail={`${formatNumber(result.uncachedInputTokens)} tokens`}
              value={inputPrice.trim() !== "" ? formatVisibleMoney(result.uncachedInputCost) : "—"}
            />

            <CostRow
              label="Cached input cost"
              detail={`${formatNumber(result.cachedInputTokens)} tokens`}
              value={cachedInputPrice.trim() !== "" ? formatVisibleMoney(result.cachedInputCost) : "—"}
            />

            <CostRow
              label="Output cost"
              detail={`${formatNumber(result.totalOutputTokens)} tokens`}
              value={outputPrice.trim() !== "" ? formatVisibleMoney(result.outputCost) : "—"}
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
        noticeText="Beeija stores no built-in provider rate in this calculator. Verify every price on the official provider page before relying on the result. Costs not entered are treated as zero."
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

"use client";

import { useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type BatchProvider =
  | "openai"
  | "anthropic"
  | "google"
  | "mistral"
  | "custom";

type ProviderOption = {
  value: BatchProvider;
  label: string;
  discountPercent: number;
  note: string;
};

const providerOptions: ProviderOption[] = [
  {
    value: "openai",
    label: "OpenAI Batch API · 50% token discount",
    discountPercent: 50,
    note: "Asynchronous processing with a 24-hour completion window",
  },
  {
    value: "anthropic",
    label: "Claude Message Batches · 50% token discount",
    discountPercent: 50,
    note: "Asynchronous Claude message processing",
  },
  {
    value: "google",
    label: "Google Gemini Batch API · 50% token discount",
    discountPercent: 50,
    note: "Asynchronous processing at half the interactive API price",
  },
  {
    value: "mistral",
    label: "Mistral Batch Processing · 50% token discount",
    discountPercent: 50,
    note: "Asynchronous inference for large workloads",
  },
  {
    value: "custom",
    label: "Custom provider or private agreement",
    discountPercent: 0,
    note: "Enter the current discount offered by the provider",
  },
];

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function clampPercent(value: string) {
  return Math.min(100, Math.max(0, toNumber(value)));
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

function formatVisibleNumber(value: number) {
  return formatNumber(value).replace(/,/g, ",\u200B");
}

function formatVisibleInteger(value: number) {
  return formatInteger(value).replace(/,/g, ",\u200B");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ToolClient() {
  const [provider, setProvider] = useState<BatchProvider>("openai");

  const [monthlyRequests, setMonthlyRequests] = useState("100000");
  const [inputTokensPerRequest, setInputTokensPerRequest] =
    useState("2500");
  const [outputTokensPerRequest, setOutputTokensPerRequest] =
    useState("500");
  const [batchEligiblePercent, setBatchEligiblePercent] = useState("70");
  const [repeatProcessingPercent, setRepeatProcessingPercent] =
    useState("3");

  const [standardInputPrice, setStandardInputPrice] = useState("");
  const [standardOutputPrice, setStandardOutputPrice] = useState("");
  const [customDiscountPercent, setCustomDiscountPercent] = useState("");

  const [fixedMonthlyBatchCost, setFixedMonthlyBatchCost] = useState("");
  const [oneTimeImplementationCost, setOneTimeImplementationCost] =
    useState("");
  const [amortizationMonths, setAmortizationMonths] = useState("12");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const selectedProvider =
      providerOptions.find((option) => option.value === provider) ??
      providerOptions[0];

    const requests = toNumber(monthlyRequests);
    const inputTokens = toNumber(inputTokensPerRequest);
    const outputTokens = toNumber(outputTokensPerRequest);
    const eligibleShare = clampPercent(batchEligiblePercent) / 100;
    const repeatShare = clampPercent(repeatProcessingPercent) / 100;

    const inputPrice = toNumber(standardInputPrice);
    const outputPrice = toNumber(standardOutputPrice);

    const discountPercent =
      provider === "custom"
        ? clampPercent(customDiscountPercent)
        : selectedProvider.discountPercent;

    const batchMultiplier = 1 - discountPercent / 100;

    const baselineInputTokens = requests * inputTokens;
    const baselineOutputTokens = requests * outputTokens;

    const baselineInputCost =
      (baselineInputTokens / 1_000_000) * inputPrice;
    const baselineOutputCost =
      (baselineOutputTokens / 1_000_000) * outputPrice;
    const standardOnlyCost = baselineInputCost + baselineOutputCost;

    const realtimeRequests = requests * (1 - eligibleShare);
    const batchBaseRequests = requests * eligibleShare;
    const batchProcessedRequests = batchBaseRequests * (1 + repeatShare);

    const realtimeInputCost =
      ((realtimeRequests * inputTokens) / 1_000_000) * inputPrice;
    const realtimeOutputCost =
      ((realtimeRequests * outputTokens) / 1_000_000) * outputPrice;

    const batchInputCost =
      ((batchProcessedRequests * inputTokens) / 1_000_000) *
      inputPrice *
      batchMultiplier;

    const batchOutputCost =
      ((batchProcessedRequests * outputTokens) / 1_000_000) *
      outputPrice *
      batchMultiplier;

    const fixedMonthlyCost = toNumber(fixedMonthlyBatchCost);
    const implementationCost = toNumber(oneTimeImplementationCost);
    const months = Math.max(1, toNumber(amortizationMonths));
    const amortizedImplementationCost = implementationCost / months;

    const mixedOperatingCost =
      realtimeInputCost +
      realtimeOutputCost +
      batchInputCost +
      batchOutputCost +
      fixedMonthlyCost;

    const mixedPlanningCost =
      mixedOperatingCost + amortizedImplementationCost;

    const grossMonthlyTokenSavings =
      standardOnlyCost -
      (realtimeInputCost +
        realtimeOutputCost +
        batchInputCost +
        batchOutputCost);

    const netMonthlyOperatingSavings =
      standardOnlyCost - mixedOperatingCost;

    const netMonthlyPlanningSavings =
      standardOnlyCost - mixedPlanningCost;

    const steadyStateYearlySavings = netMonthlyOperatingSavings * 12;
    const firstYearSavings =
      standardOnlyCost * 12 -
      (mixedOperatingCost * 12 + implementationCost);

    const implementationPaybackMonths =
      implementationCost > 0 && netMonthlyOperatingSavings > 0
        ? implementationCost / netMonthlyOperatingSavings
        : null;

    let breakEvenEligiblePercent: number | null = null;

    for (let step = 0; step <= 1000; step += 1) {
      const candidateEligibleShare = step / 1000;
      const candidateRealtimeRequests =
        requests * (1 - candidateEligibleShare);
      const candidateBatchBaseRequests =
        requests * candidateEligibleShare;
      const candidateBatchProcessedRequests =
        candidateBatchBaseRequests * (1 + repeatShare);

      const candidateRealtimeCost =
        ((candidateRealtimeRequests * inputTokens) / 1_000_000) *
          inputPrice +
        ((candidateRealtimeRequests * outputTokens) / 1_000_000) *
          outputPrice;

      const candidateBatchCost =
        ((candidateBatchProcessedRequests * inputTokens) / 1_000_000) *
          inputPrice *
          batchMultiplier +
        ((candidateBatchProcessedRequests * outputTokens) / 1_000_000) *
          outputPrice *
          batchMultiplier;

      const candidatePlanningCost =
        candidateRealtimeCost +
        candidateBatchCost +
        fixedMonthlyCost +
        amortizedImplementationCost;

      if (candidatePlanningCost <= standardOnlyCost) {
        breakEvenEligiblePercent = candidateEligibleShare * 100;
        break;
      }
    }

    const hasModelPrices =
      standardInputPrice.trim() !== "" &&
      standardOutputPrice.trim() !== "";

    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      selectedProvider,
      discountPercent,
      requests,
      realtimeRequests,
      batchBaseRequests,
      batchProcessedRequests,
      baselineInputTokens,
      baselineOutputTokens,
      standardOnlyCost,
      baselineInputCost,
      baselineOutputCost,
      realtimeInputCost,
      realtimeOutputCost,
      batchInputCost,
      batchOutputCost,
      fixedMonthlyCost,
      implementationCost,
      amortizedImplementationCost,
      mixedOperatingCost,
      mixedPlanningCost,
      grossMonthlyTokenSavings,
      netMonthlyOperatingSavings,
      netMonthlyPlanningSavings,
      steadyStateYearlySavings,
      firstYearSavings,
      implementationPaybackMonths,
      breakEvenEligiblePercent,
      costPerRequestStandard:
        requests > 0 ? standardOnlyCost / requests : 0,
      costPerRequestMixed:
        requests > 0 ? mixedOperatingCost / requests : 0,
      hasModelPrices,
      hasBudget,
      budget,
      budgetDifference: budget - mixedPlanningCost,
    };
  }, [
    amortizationMonths,
    batchEligiblePercent,
    customDiscountPercent,
    fixedMonthlyBatchCost,
    inputTokensPerRequest,
    monthlyBudget,
    monthlyRequests,
    oneTimeImplementationCost,
    outputTokensPerRequest,
    provider,
    repeatProcessingPercent,
    standardInputPrice,
    standardOutputPrice,
  ]);

  const reset = () => {
    setProvider("openai");
    setMonthlyRequests("100000");
    setInputTokensPerRequest("2500");
    setOutputTokensPerRequest("500");
    setBatchEligiblePercent("70");
    setRepeatProcessingPercent("3");
    setStandardInputPrice("");
    setStandardOutputPrice("");
    setCustomDiscountPercent("");
    setFixedMonthlyBatchCost("");
    setOneTimeImplementationCost("");
    setAmortizationMonths("12");
    setMonthlyBudget("");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Batch Processing Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Use the current standard token prices for the exact model being
            evaluated.
          </p>
        </div>

        <div className="mt-7 grid min-w-0 gap-5 md:grid-cols-2 [&>*]:min-w-0">
          <div className="md:col-span-2">
            <BeeijaSelect
              label="Batch provider"
              value={provider}
              onChange={(event) =>
                setProvider(event.target.value as BatchProvider)
              }
              options={providerOptions.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
            />
          </div>

          <BeeijaNumberField
            label="API requests per month"
            value={monthlyRequests}
            onChange={setMonthlyRequests}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Batch-eligible workload"
            value={batchEligiblePercent}
            onChange={setBatchEligiblePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Input tokens per request"
            value={inputTokensPerRequest}
            onChange={setInputTokensPerRequest}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Output tokens per request"
            value={outputTokensPerRequest}
            onChange={setOutputTokensPerRequest}
            min="0"
            step="1"
          />

          <div className="grid min-w-0 gap-5 md:col-span-2 md:grid-cols-2">
            <BeeijaNumberField
              label="Repeat-processing allowance for batch work"
              value={repeatProcessingPercent}
              onChange={setRepeatProcessingPercent}
              min="0"
              max="100"
              step="1"
              suffix="%"
            />

            <div className="min-w-0 md:pt-5">
              {provider === "custom" ? (
                <BeeijaNumberField
                  label="Current batch discount"
                  value={customDiscountPercent}
                  onChange={setCustomDiscountPercent}
                  min="0"
                  max="100"
                  step="1"
                  suffix="%"
                />
              ) : (
                <div className="min-w-0">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Verified batch discount
                  </p>

                  <div className="flex h-11 min-w-0 items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
                    <p className="break-words text-sm font-semibold text-gray-950 [overflow-wrap:anywhere]">
                      {formatVisibleNumber(result.discountPercent)}%
                    </p>
                  </div>

                  <p className="mt-2 break-words text-xs leading-relaxed text-gray-500 [overflow-wrap:anywhere]">
                    {result.selectedProvider.note}
                  </p>
                </div>
              )}
            </div>
          </div>

          <BeeijaNumberField
            label="Current standard input price per 1M tokens"
            value={standardInputPrice}
            onChange={setStandardInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Current standard output price per 1M tokens"
            value={standardOutputPrice}
            onChange={setStandardOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <div className="grid min-w-0 gap-5 md:col-span-2 md:grid-cols-2 md:items-end">
            <BeeijaNumberField
              label="Other fixed monthly batch workflow cost"
              value={fixedMonthlyBatchCost}
              onChange={setFixedMonthlyBatchCost}
              min="0"
              step="1"
              prefix="$"
            />

            <BeeijaNumberField
              label="One-time batch implementation cost"
              value={oneTimeImplementationCost}
              onChange={setOneTimeImplementationCost}
              min="0"
              step="1"
              prefix="$"
            />
          </div>

          <BeeijaNumberField
            label="Implementation amortisation period"
            value={amortizationMonths}
            onChange={setAmortizationMonths}
            min="1"
            step="1"
            suffix="mo"
          />

          <BeeijaNumberField
            label="Target monthly AI budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </div>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Workload split used for this estimate
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              Real-time requests: {formatVisibleInteger(result.realtimeRequests)}
            </p>

            <p>
              Batch-eligible requests:{" "}
              {formatVisibleInteger(result.batchBaseRequests)}
            </p>

            <p>
              Batch requests after repeat allowance:{" "}
              {formatVisibleInteger(result.batchProcessedRequests)}
            </p>

            <p>
              Standard input tokens:{" "}
              {formatVisibleInteger(result.baselineInputTokens)}
            </p>

            <p>
              Standard output tokens:{" "}
              {formatVisibleInteger(result.baselineOutputTokens)}
            </p>

            <p>
              Applied batch discount:{" "}
              {formatNumber(result.discountPercent)}%
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
        title="Batch API Cost and Savings"
        description="The result compares an all-standard baseline with a mixed standard-and-batch workflow."
        primaryLabel="Estimated monthly planning cost"
        primaryValue={
          result.hasModelPrices
            ? formatVisibleMoney(result.mixedPlanningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Standard-only cost"
              value={
                result.hasModelPrices
                  ? formatVisibleMoney(result.standardOnlyCost)
                  : "—"
              }
            />

            <ResultStat
              label="Net monthly saving"
              value={
                result.hasModelPrices
                  ? formatVisibleMoney(result.netMonthlyPlanningSavings)
                  : "—"
              }
            />

            <ResultStat
              label="First-year saving"
              value={
                result.hasModelPrices
                  ? formatVisibleMoney(result.firstYearSavings)
                  : "—"
              }
            />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            <BreakdownRow
              label="Real-time input"
              detail="Requests that remain on standard processing"
              value={result.realtimeInputCost}
              showValue={result.hasModelPrices}
            />

            <BreakdownRow
              label="Real-time output"
              detail="Output tokens from standard-processing requests"
              value={result.realtimeOutputCost}
              showValue={result.hasModelPrices}
            />

            <BreakdownRow
              label="Batch input"
              detail="Eligible input tokens after repeat-processing allowance"
              value={result.batchInputCost}
              showValue={result.hasModelPrices}
            />

            <BreakdownRow
              label="Batch output"
              detail="Eligible output tokens after repeat-processing allowance"
              value={result.batchOutputCost}
              showValue={result.hasModelPrices}
            />

            <BreakdownRow
              label="Fixed monthly workflow cost"
              detail="Storage, queues, monitoring, validation, or orchestration"
              value={result.fixedMonthlyCost}
              showValue={fixedMonthlyBatchCost.trim() !== ""}
            />

            <BreakdownRow
              label="Amortised implementation cost"
              detail={`${formatVisibleMoney(
                result.implementationCost,
              )} spread across ${formatNumber(
                toNumber(amortizationMonths),
              )} months`}
              value={result.amortizedImplementationCost}
              showValue={oneTimeImplementationCost.trim() !== ""}
            />
          </div>
        }
        totals={
          <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
            <p>
              Gross monthly token saving:{" "}
              <span className="font-medium text-gray-900">
                {result.hasModelPrices
                  ? formatVisibleMoney(result.grossMonthlyTokenSavings)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Net monthly operating saving:{" "}
              <span className="font-medium text-gray-900">
                {result.hasModelPrices
                  ? formatVisibleMoney(result.netMonthlyOperatingSavings)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Steady-state yearly saving:{" "}
              <span className="font-medium text-gray-900">
                {result.hasModelPrices
                  ? formatVisibleMoney(result.steadyStateYearlySavings)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Standard cost per request:{" "}
              <span className="font-medium text-gray-900">
                {result.hasModelPrices
                  ? formatVisibleMoney(result.costPerRequestStandard)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Mixed workflow cost per request:{" "}
              <span className="font-medium text-gray-900">
                {result.hasModelPrices
                  ? formatVisibleMoney(result.costPerRequestMixed)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Approximate batch-share break-even:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasModelPrices
                  ? "Enter prices"
                  : result.breakEvenEligiblePercent === null
                    ? "Not reached"
                    : `${formatNumber(
                        result.breakEvenEligiblePercent,
                      )}% of requests`}
              </span>
            </p>

            <p className="mt-2">
              Implementation payback:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasModelPrices
                  ? "Enter prices"
                  : result.implementationCost === 0
                    ? "No implementation cost entered"
                    : result.implementationPaybackMonths === null
                      ? "No positive operating payback"
                      : `${formatNumber(
                          result.implementationPaybackMonths,
                        )} months`}
              </span>
            </p>

            <p className="mt-2">
              Budget status:{" "}
              <span
                className={`font-semibold ${
                  result.hasBudget &&
                  result.hasModelPrices &&
                  result.budgetDifference < 0
                    ? "text-red-700"
                    : "text-[var(--green)]"
                }`}
              >
                {!result.hasBudget
                  ? "Add a budget to compare"
                  : !result.hasModelPrices
                    ? "Enter current model prices"
                    : result.budgetDifference >= 0
                      ? `${formatVisibleMoney(result.budgetDifference)} remaining`
                      : `${formatVisibleMoney(
                          Math.abs(result.budgetDifference),
                        )} over budget`}
              </span>
            </p>
          </div>
        }
        noticeText="The provider discount is built in from official documentation, but the model price fields are intentionally blank. Enter the current standard input and output rates for the exact model and context tier you plan to use. The estimate does not guarantee batch capacity, completion time, or successful processing."
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

function BreakdownRow({
  label,
  detail,
  value,
  showValue,
}: {
  label: string;
  detail: string;
  value: number;
  showValue: boolean;
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
        {showValue ? formatVisibleMoney(value) : "—"}
      </p>
    </div>
  );
}

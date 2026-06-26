"use client";

import { useMemo, useState, type ReactNode } from "react";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type CostRow = {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
};

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
  const [monthlyRuns, setMonthlyRuns] = useState("10000");
  const [successfulCompletionRate, setSuccessfulCompletionRate] =
    useState("90");
  const [stepsPerRun, setStepsPerRun] = useState("6");
  const [plannerCallsPerRun, setPlannerCallsPerRun] = useState("1");
  const [workerCallsPerStep, setWorkerCallsPerStep] = useState("1");

  const [plannerInputTokensPerCall, setPlannerInputTokensPerCall] =
    useState("4000");
  const [plannerOutputTokensPerCall, setPlannerOutputTokensPerCall] =
    useState("1000");
  const [workerBaseInputTokensPerCall, setWorkerBaseInputTokensPerCall] =
    useState("1500");
  const [workerContextGrowthTokensPerStep, setWorkerContextGrowthTokensPerStep] =
    useState("500");
  const [workerOutputTokensPerCall, setWorkerOutputTokensPerCall] =
    useState("500");

  const [retryOverheadPercent, setRetryOverheadPercent] = useState("10");
  const [toolCallsPerStep, setToolCallsPerStep] = useState("1.5");
  const [memoryOperationsPerRun, setMemoryOperationsPerRun] = useState("2");

  const [plannerInputPricePerMillion, setPlannerInputPricePerMillion] =
    useState("");
  const [plannerOutputPricePerMillion, setPlannerOutputPricePerMillion] =
    useState("");
  const [workerInputPricePerMillion, setWorkerInputPricePerMillion] =
    useState("");
  const [workerOutputPricePerMillion, setWorkerOutputPricePerMillion] =
    useState("");
  const [toolPricePerThousandCalls, setToolPricePerThousandCalls] =
    useState("");
  const [memoryPricePerThousandOperations, setMemoryPricePerThousandOperations] =
    useState("");

  const [humanReviewPercent, setHumanReviewPercent] = useState("5");
  const [minutesPerReview, setMinutesPerReview] = useState("3");
  const [humanHourlyRate, setHumanHourlyRate] = useState("");

  const [fixedMonthlyInfrastructure, setFixedMonthlyInfrastructure] =
    useState("");
  const [oneTimeImplementationCost, setOneTimeImplementationCost] =
    useState("");
  const [amortizationMonths, setAmortizationMonths] = useState("12");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const [pricePerSuccessfulRun, setPricePerSuccessfulRun] = useState("");
  const [targetGrossMarginPercent, setTargetGrossMarginPercent] =
    useState("70");

  const result = useMemo(() => {
    const runs = toNumber(monthlyRuns);
    const completionRate = clampPercent(successfulCompletionRate) / 100;
    const successfulRuns = runs * completionRate;

    const steps = Math.max(1, toNumber(stepsPerRun));
    const plannerCalls = runs * toNumber(plannerCallsPerRun);
    const workerCallsEachStep = toNumber(workerCallsPerStep);
    const retryMultiplier = 1 + clampPercent(retryOverheadPercent) / 100;

    const plannerCallsWithRetries = plannerCalls * retryMultiplier;
    const workerCallsWithoutRetries = runs * steps * workerCallsEachStep;
    const workerCallsWithRetries = workerCallsWithoutRetries * retryMultiplier;

    const plannerInputTokens =
      plannerCallsWithRetries * toNumber(plannerInputTokensPerCall);
    const plannerOutputTokens =
      plannerCallsWithRetries * toNumber(plannerOutputTokensPerCall);

    const workerBaseInput = toNumber(workerBaseInputTokensPerCall);
    const contextGrowth = toNumber(workerContextGrowthTokensPerStep);
    const totalWorkerInputTokensPerRun =
      workerCallsEachStep *
      (steps * workerBaseInput +
        (contextGrowth * (steps - 1) * steps) / 2);

    const workerInputTokens =
      runs * totalWorkerInputTokensPerRun * retryMultiplier;
    const workerOutputTokens =
      workerCallsWithRetries * toNumber(workerOutputTokensPerCall);

    const toolCalls =
      runs * steps * toNumber(toolCallsPerStep) * retryMultiplier;
    const memoryOperations = runs * toNumber(memoryOperationsPerRun);

    const humanReviews =
      runs * (clampPercent(humanReviewPercent) / 100);
    const humanReviewHours =
      (humanReviews * toNumber(minutesPerReview)) / 60;

    const plannerInputCost =
      (plannerInputTokens / 1_000_000) *
      toNumber(plannerInputPricePerMillion);
    const plannerOutputCost =
      (plannerOutputTokens / 1_000_000) *
      toNumber(plannerOutputPricePerMillion);
    const workerInputCost =
      (workerInputTokens / 1_000_000) *
      toNumber(workerInputPricePerMillion);
    const workerOutputCost =
      (workerOutputTokens / 1_000_000) *
      toNumber(workerOutputPricePerMillion);
    const toolCost =
      (toolCalls / 1_000) * toNumber(toolPricePerThousandCalls);
    const memoryCost =
      (memoryOperations / 1_000) *
      toNumber(memoryPricePerThousandOperations);
    const humanReviewCost =
      humanReviewHours * toNumber(humanHourlyRate);
    const infrastructureCost = toNumber(fixedMonthlyInfrastructure);

    const implementationCost = toNumber(oneTimeImplementationCost);
    const amortizationPeriod = Math.max(1, toNumber(amortizationMonths));
    const amortizedImplementationCost =
      implementationCost / amortizationPeriod;

    const monthlyOperatingCost =
      plannerInputCost +
      plannerOutputCost +
      workerInputCost +
      workerOutputCost +
      toolCost +
      memoryCost +
      humanReviewCost +
      infrastructureCost;

    const monthlyPlanningCost =
      monthlyOperatingCost + amortizedImplementationCost;

    const operatingCostPerRun = runs > 0 ? monthlyOperatingCost / runs : 0;
    const planningCostPerRun = runs > 0 ? monthlyPlanningCost / runs : 0;
    const operatingCostPerSuccessfulRun =
      successfulRuns > 0 ? monthlyOperatingCost / successfulRuns : 0;
    const planningCostPerSuccessfulRun =
      successfulRuns > 0 ? monthlyPlanningCost / successfulRuns : 0;

    const chargedPrice = toNumber(pricePerSuccessfulRun);
    const monthlyRevenue = successfulRuns * chargedPrice;
    const monthlyGrossProfit = monthlyRevenue - monthlyOperatingCost;
    const grossMarginPercent =
      monthlyRevenue > 0 ? (monthlyGrossProfit / monthlyRevenue) * 100 : 0;

    const targetMargin =
      Math.min(99.9, clampPercent(targetGrossMarginPercent)) / 100;
    const requiredPriceForTargetMargin =
      1 - targetMargin > 0
        ? planningCostPerSuccessfulRun / (1 - targetMargin)
        : 0;

    const rows: CostRow[] = [
      {
        label: "Planner model input",
        detail: `${formatInteger(plannerInputTokens)} tokens across ${formatInteger(
          plannerCallsWithRetries,
        )} calls`,
        value: plannerInputCost,
        entered: plannerInputPricePerMillion.trim() !== "",
      },
      {
        label: "Planner model output",
        detail: `${formatInteger(plannerOutputTokens)} output tokens`,
        value: plannerOutputCost,
        entered: plannerOutputPricePerMillion.trim() !== "",
      },
      {
        label: "Worker model input",
        detail: `${formatInteger(
          workerInputTokens,
        )} tokens including context growth`,
        value: workerInputCost,
        entered: workerInputPricePerMillion.trim() !== "",
      },
      {
        label: "Worker model output",
        detail: `${formatInteger(workerOutputTokens)} tokens across ${formatInteger(
          workerCallsWithRetries,
        )} calls`,
        value: workerOutputCost,
        entered: workerOutputPricePerMillion.trim() !== "",
      },
      {
        label: "Paid tool calls",
        detail: `${formatInteger(toolCalls)} calls after retry overhead`,
        value: toolCost,
        entered: toolPricePerThousandCalls.trim() !== "",
      },
      {
        label: "Memory operations",
        detail: `${formatInteger(memoryOperations)} reads and writes`,
        value: memoryCost,
        entered: memoryPricePerThousandOperations.trim() !== "",
      },
      {
        label: "Human review",
        detail: `${formatInteger(humanReviews)} reviews · ${formatNumber(
          humanReviewHours,
        )} hours`,
        value: humanReviewCost,
        entered: humanHourlyRate.trim() !== "",
      },
      {
        label: "Fixed infrastructure",
        detail: "Hosting, queues, monitoring, databases, or agent platform",
        value: infrastructureCost,
        entered: fixedMonthlyInfrastructure.trim() !== "",
      },
      {
        label: "Amortized implementation",
        detail: `${formatMoney(
          implementationCost,
        )} spread across ${formatInteger(amortizationPeriod)} months`,
        value: amortizedImplementationCost,
        entered: oneTimeImplementationCost.trim() !== "",
      },
    ];

    const enteredPriceCount = [
      plannerInputPricePerMillion,
      plannerOutputPricePerMillion,
      workerInputPricePerMillion,
      workerOutputPricePerMillion,
      toolPricePerThousandCalls,
      memoryPricePerThousandOperations,
      humanHourlyRate,
      fixedMonthlyInfrastructure,
      oneTimeImplementationCost,
    ].filter((value) => value.trim() !== "").length;

    const hasAnyPrice = enteredPriceCount > 0;
    const hasRevenuePrice = pricePerSuccessfulRun.trim() !== "";
    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      runs,
      successfulRuns,
      plannerCallsWithRetries,
      workerCallsWithRetries,
      toolCalls,
      memoryOperations,
      humanReviews,
      humanReviewHours,
      plannerInputTokens,
      plannerOutputTokens,
      workerInputTokens,
      workerOutputTokens,
      rows,
      monthlyOperatingCost,
      monthlyPlanningCost,
      firstYearCost: monthlyOperatingCost * 12 + implementationCost,
      operatingCostPerRun,
      planningCostPerRun,
      operatingCostPerSuccessfulRun,
      planningCostPerSuccessfulRun,
      monthlyRevenue,
      monthlyGrossProfit,
      grossMarginPercent,
      breakEvenPrice: planningCostPerSuccessfulRun,
      requiredPriceForTargetMargin,
      enteredPriceCount,
      hasAnyPrice,
      hasRevenuePrice,
      hasBudget,
      budget,
      budgetDifference: budget - monthlyPlanningCost,
    };
  }, [
    amortizationMonths,
    fixedMonthlyInfrastructure,
    humanHourlyRate,
    humanReviewPercent,
    memoryOperationsPerRun,
    memoryPricePerThousandOperations,
    minutesPerReview,
    monthlyBudget,
    monthlyRuns,
    oneTimeImplementationCost,
    plannerCallsPerRun,
    plannerInputPricePerMillion,
    plannerInputTokensPerCall,
    plannerOutputPricePerMillion,
    plannerOutputTokensPerCall,
    pricePerSuccessfulRun,
    retryOverheadPercent,
    stepsPerRun,
    successfulCompletionRate,
    targetGrossMarginPercent,
    toolCallsPerStep,
    toolPricePerThousandCalls,
    workerBaseInputTokensPerCall,
    workerCallsPerStep,
    workerContextGrowthTokensPerStep,
    workerInputPricePerMillion,
    workerOutputPricePerMillion,
    workerOutputTokensPerCall,
  ]);

  const reset = () => {
    setMonthlyRuns("10000");
    setSuccessfulCompletionRate("90");
    setStepsPerRun("6");
    setPlannerCallsPerRun("1");
    setWorkerCallsPerStep("1");
    setPlannerInputTokensPerCall("4000");
    setPlannerOutputTokensPerCall("1000");
    setWorkerBaseInputTokensPerCall("1500");
    setWorkerContextGrowthTokensPerStep("500");
    setWorkerOutputTokensPerCall("500");
    setRetryOverheadPercent("10");
    setToolCallsPerStep("1.5");
    setMemoryOperationsPerRun("2");
    setPlannerInputPricePerMillion("");
    setPlannerOutputPricePerMillion("");
    setWorkerInputPricePerMillion("");
    setWorkerOutputPricePerMillion("");
    setToolPricePerThousandCalls("");
    setMemoryPricePerThousandOperations("");
    setHumanReviewPercent("5");
    setMinutesPerReview("3");
    setHumanHourlyRate("");
    setFixedMonthlyInfrastructure("");
    setOneTimeImplementationCost("");
    setAmortizationMonths("12");
    setMonthlyBudget("");
    setPricePerSuccessfulRun("");
    setTargetGrossMarginPercent("70");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Agent Workflow
          </h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            Model the planner, workers, growing context, retries, paid tools,
            memory, review, and product economics.
          </p>
        </div>

        <FieldSection title="Monthly Runs and Agent Structure">
          <BeeijaNumberField
            label="Agent runs per month"
            value={monthlyRuns}
            onChange={setMonthlyRuns}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Successful completion rate"
            value={successfulCompletionRate}
            onChange={setSuccessfulCompletionRate}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
          <BeeijaNumberField
            label="Worker steps per run"
            value={stepsPerRun}
            onChange={setStepsPerRun}
            min="1"
            step="1"
          />
          <BeeijaNumberField
            label="Planner calls per run"
            value={plannerCallsPerRun}
            onChange={setPlannerCallsPerRun}
            min="0"
            step="0.1"
          />
          <BeeijaNumberField
            label="Worker model calls per step"
            value={workerCallsPerStep}
            onChange={setWorkerCallsPerStep}
            min="0"
            step="0.1"
          />
          <BeeijaNumberField
            label="Retry and loop overhead"
            value={retryOverheadPercent}
            onChange={setRetryOverheadPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Planner and Worker Tokens">
          <BeeijaNumberField
            label="Planner input tokens per call"
            value={plannerInputTokensPerCall}
            onChange={setPlannerInputTokensPerCall}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Planner output tokens per call"
            value={plannerOutputTokensPerCall}
            onChange={setPlannerOutputTokensPerCall}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Worker base input tokens per call"
            value={workerBaseInputTokensPerCall}
            onChange={setWorkerBaseInputTokensPerCall}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Extra context tokens added each step"
            value={workerContextGrowthTokensPerStep}
            onChange={setWorkerContextGrowthTokensPerStep}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Worker output tokens per call"
            value={workerOutputTokensPerCall}
            onChange={setWorkerOutputTokensPerCall}
            min="0"
            step="1"
          />
        </FieldSection>

        <FieldSection title="Tools, Memory, and Human Review">
          <BeeijaNumberField
            label="Paid tool calls per worker step"
            value={toolCallsPerStep}
            onChange={setToolCallsPerStep}
            min="0"
            step="0.1"
          />
          <BeeijaNumberField
            label="Memory operations per run"
            value={memoryOperationsPerRun}
            onChange={setMemoryOperationsPerRun}
            min="0"
            step="0.1"
          />
          <BeeijaNumberField
            label="Runs sent to human review"
            value={humanReviewPercent}
            onChange={setHumanReviewPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
          <BeeijaNumberField
            label="Minutes per human review"
            value={minutesPerReview}
            onChange={setMinutesPerReview}
            min="0"
            step="0.1"
            suffix="min"
          />
        </FieldSection>

        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="font-medium text-gray-900">
            Enter current prices for your exact stack
          </p>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            Monetary fields are blank by design. Blank fields are treated as
            zero, so a partial estimate only includes the rates entered.
          </p>
        </div>

        <FieldSection title="Current Model and Service Prices">
          <BeeijaNumberField
            label="Planner input price per 1M tokens"
            value={plannerInputPricePerMillion}
            onChange={setPlannerInputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />
          <BeeijaNumberField
            label="Planner output price per 1M tokens"
            value={plannerOutputPricePerMillion}
            onChange={setPlannerOutputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />
          <BeeijaNumberField
            label="Worker input price per 1M tokens"
            value={workerInputPricePerMillion}
            onChange={setWorkerInputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />
          <BeeijaNumberField
            label="Worker output price per 1M tokens"
            value={workerOutputPricePerMillion}
            onChange={setWorkerOutputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />
          <BeeijaNumberField
            label="Paid tools per 1,000 calls"
            value={toolPricePerThousandCalls}
            onChange={setToolPricePerThousandCalls}
            min="0"
            step="0.001"
            prefix="$"
          />
          <BeeijaNumberField
            label="Memory per 1,000 operations"
            value={memoryPricePerThousandOperations}
            onChange={setMemoryPricePerThousandOperations}
            min="0"
            step="0.001"
            prefix="$"
          />
          <BeeijaNumberField
            label="Human review hourly rate"
            value={humanHourlyRate}
            onChange={setHumanHourlyRate}
            min="0"
            step="0.01"
            prefix="$"
          />
          <BeeijaNumberField
            label="Fixed monthly infrastructure"
            value={fixedMonthlyInfrastructure}
            onChange={setFixedMonthlyInfrastructure}
            min="0"
            step="1"
            prefix="$"
          />
          <BeeijaNumberField
            label="One-time implementation cost"
            value={oneTimeImplementationCost}
            onChange={setOneTimeImplementationCost}
            min="0"
            step="1"
            prefix="$"
          />
          <BeeijaNumberField
            label="Implementation amortization period"
            value={amortizationMonths}
            onChange={setAmortizationMonths}
            min="1"
            step="1"
            suffix="mo"
          />
          <BeeijaNumberField
            label="Target monthly budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Product Pricing and Margin">
          <BeeijaNumberField
            label="Price charged per successful run"
            value={pricePerSuccessfulRun}
            onChange={setPricePerSuccessfulRun}
            min="0"
            step="0.01"
            prefix="$"
          />
          <BeeijaNumberField
            label="Target gross margin"
            value={targetGrossMarginPercent}
            onChange={setTargetGrossMarginPercent}
            min="0"
            max="99.9"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated monthly workflow volume
          </p>
          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>Successful runs: {formatVisibleInteger(result.successfulRuns)}</p>
            <p>Planner calls: {formatVisibleInteger(result.plannerCallsWithRetries)}</p>
            <p>Worker calls: {formatVisibleInteger(result.workerCallsWithRetries)}</p>
            <p>Paid tool calls: {formatVisibleInteger(result.toolCalls)}</p>
            <p>Memory operations: {formatVisibleInteger(result.memoryOperations)}</p>
            <p>Human reviews: {formatVisibleInteger(result.humanReviews)}</p>
          </div>
        </div>

        <button type="button" onClick={reset} className="beeija-btn-outline mt-6">
          Reset values
        </button>
      </section>

      <BeeijaCalculatorResultPanel
        title="AI Agent Cost and Unit Economics"
        description="The estimate separates monthly operating cost from implementation cost spread across the selected planning period."
        primaryLabel="Monthly planning cost"
        primaryValue={
          result.hasAnyPrice ? formatVisibleMoney(result.monthlyPlanningCost) : "Enter prices"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per attempted run"
              value={result.hasAnyPrice ? formatVisibleMoney(result.planningCostPerRun) : "—"}
            />
            <ResultStat
              label="Per successful run"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.planningCostPerSuccessfulRun)
                  : "—"
              }
            />
            <ResultStat
              label="First-year cost"
              value={result.hasAnyPrice ? formatVisibleMoney(result.firstYearCost) : "—"}
            />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            {result.rows.map((row) => (
              <BreakdownRow
                key={row.label}
                label={row.label}
                detail={row.detail}
                value={row.value}
                entered={row.entered}
                total={result.monthlyPlanningCost}
              />
            ))}
          </div>
        }
        totals={
          <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
            <p>
              Monthly operating cost:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyPrice ? formatVisibleMoney(result.monthlyOperatingCost) : "—"}
              </span>
            </p>
            <p className="mt-2">
              Operating cost per successful run:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyPrice
                  ? formatVisibleMoney(result.operatingCostPerSuccessfulRun)
                  : "—"}
              </span>
            </p>
            <p className="mt-2">
              Break-even price per successful run:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyPrice ? formatVisibleMoney(result.breakEvenPrice) : "—"}
              </span>
            </p>
            <p className="mt-2">
              Price needed for {formatVisibleNumber(toNumber(targetGrossMarginPercent))}% margin:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyPrice
                  ? formatVisibleMoney(result.requiredPriceForTargetMargin)
                  : "—"}
              </span>
            </p>
            <p className="mt-2">
              Monthly revenue:{" "}
              <span className="font-medium text-gray-900">
                {result.hasRevenuePrice ? formatVisibleMoney(result.monthlyRevenue) : "Add a selling price"}
              </span>
            </p>
            <p className="mt-2">
              Monthly gross profit:{" "}
              <span
                className={`font-semibold ${
                  !result.hasRevenuePrice || result.monthlyGrossProfit >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {result.hasRevenuePrice ? formatVisibleMoney(result.monthlyGrossProfit) : "Add a selling price"}
              </span>
            </p>
            <p className="mt-2">
              Gross margin:{" "}
              <span className="font-medium text-gray-900">
                {result.hasRevenuePrice ? `${formatVisibleNumber(result.grossMarginPercent)}%` : "Add a selling price"}
              </span>
            </p>
            <p className="mt-2">
              Price inputs entered:{" "}
              <span className="font-medium text-gray-900">
                {result.enteredPriceCount} of 9
              </span>
            </p>
            <p className="mt-2">
              Budget status:{" "}
              <span
                className={`font-semibold ${
                  result.hasBudget && result.hasAnyPrice && result.budgetDifference < 0
                    ? "text-red-700"
                    : "text-[var(--green)]"
                }`}
              >
                {!result.hasBudget
                  ? "Add a budget to compare"
                  : !result.hasAnyPrice
                    ? "Enter current prices"
                    : result.budgetDifference >= 0
                      ? `${formatVisibleMoney(result.budgetDifference)} remaining`
                      : `${formatVisibleMoney(Math.abs(result.budgetDifference))} over budget`}
              </span>
            </p>
          </div>
        }
        noticeText="This calculator stores no built-in model, tool, memory, or labour prices. Enter current official rates for the exact stack being planned. Blank monetary fields are treated as zero, so a partial estimate includes only the prices entered. Average values may not represent expensive long-tail agent runs."
      />
    </div>
  );
}

function FieldSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-950">{title}</h3>
      <div className="mt-5 grid min-w-0 gap-5 md:grid-cols-2 [&>*]:min-w-0">{children}</div>
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
  entered,
  total,
}: {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
  total: number;
}) {
  const share = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 break-words text-sm text-gray-500 [overflow-wrap:anywhere]">
          {detail}
        </p>
        <p className="mt-1 break-words text-xs text-gray-500 [overflow-wrap:anywhere]">
          {entered
            ? `${formatVisibleNumber(share)}% of monthly planning cost`
            : "Rate not entered"}
        </p>
      </div>

      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {entered ? formatVisibleMoney(value) : "—"}
      </p>
    </div>
  );
}

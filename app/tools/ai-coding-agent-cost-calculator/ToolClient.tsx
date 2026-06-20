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
  const [monthlyTasks, setMonthlyTasks] = useState("500");
  const [successfulCompletionRate, setSuccessfulCompletionRate] =
    useState("82");
  const [plannerCallsPerTask, setPlannerCallsPerTask] = useState("1");
  const [codingIterationsPerTask, setCodingIterationsPerTask] =
    useState("4");
  const [repairAttemptsPerTask, setRepairAttemptsPerTask] =
    useState("1.5");
  const [reviewCallsPerTask, setReviewCallsPerTask] = useState("1");
  const [retryOverheadPercent, setRetryOverheadPercent] =
    useState("8");

  const [plannerInputTokensPerCall, setPlannerInputTokensPerCall] =
    useState("9000");
  const [plannerOutputTokensPerCall, setPlannerOutputTokensPerCall] =
    useState("1500");
  const [codingInputTokensPerCall, setCodingInputTokensPerCall] =
    useState("14000");
  const [codingOutputTokensPerCall, setCodingOutputTokensPerCall] =
    useState("2800");
  const [reviewInputTokensPerCall, setReviewInputTokensPerCall] =
    useState("7000");
  const [reviewOutputTokensPerCall, setReviewOutputTokensPerCall] =
    useState("700");

  const [plannerInputPrice, setPlannerInputPrice] = useState("");
  const [plannerOutputPrice, setPlannerOutputPrice] = useState("");
  const [codingInputPrice, setCodingInputPrice] = useState("");
  const [codingOutputPrice, setCodingOutputPrice] = useState("");
  const [reviewInputPrice, setReviewInputPrice] = useState("");
  const [reviewOutputPrice, setReviewOutputPrice] = useState("");

  const [sandboxRunsPerTask, setSandboxRunsPerTask] = useState("5");
  const [sandboxPricePerThousandRuns, setSandboxPricePerThousandRuns] =
    useState("");

  const [humanReviewPercent, setHumanReviewPercent] = useState("25");
  const [minutesPerHumanReview, setMinutesPerHumanReview] =
    useState("12");
  const [developerHourlyRate, setDeveloperHourlyRate] = useState("");

  const [fixedMonthlyPlatformCost, setFixedMonthlyPlatformCost] =
    useState("");
  const [oneTimeImplementationCost, setOneTimeImplementationCost] =
    useState("");
  const [amortizationMonths, setAmortizationMonths] = useState("12");

  const [manualHoursPerTask, setManualHoursPerTask] = useState("3");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const tasks = toNumber(monthlyTasks);
    const successRate = clampPercent(successfulCompletionRate) / 100;
    const successfulTasks = tasks * successRate;

    const retryMultiplier =
      1 + clampPercent(retryOverheadPercent) / 100;

    const plannerCalls =
      tasks * toNumber(plannerCallsPerTask) * retryMultiplier;

    const codingCalls =
      tasks *
      (toNumber(codingIterationsPerTask) +
        toNumber(repairAttemptsPerTask)) *
      retryMultiplier;

    const reviewCalls =
      tasks * toNumber(reviewCallsPerTask) * retryMultiplier;

    const plannerInputTokens =
      plannerCalls * toNumber(plannerInputTokensPerCall);
    const plannerOutputTokens =
      plannerCalls * toNumber(plannerOutputTokensPerCall);
    const codingInputTokens =
      codingCalls * toNumber(codingInputTokensPerCall);
    const codingOutputTokens =
      codingCalls * toNumber(codingOutputTokensPerCall);
    const reviewInputTokens =
      reviewCalls * toNumber(reviewInputTokensPerCall);
    const reviewOutputTokens =
      reviewCalls * toNumber(reviewOutputTokensPerCall);

    const plannerInputCost =
      (plannerInputTokens / 1_000_000) *
      toNumber(plannerInputPrice);
    const plannerOutputCost =
      (plannerOutputTokens / 1_000_000) *
      toNumber(plannerOutputPrice);
    const codingInputCost =
      (codingInputTokens / 1_000_000) *
      toNumber(codingInputPrice);
    const codingOutputCost =
      (codingOutputTokens / 1_000_000) *
      toNumber(codingOutputPrice);
    const reviewInputCost =
      (reviewInputTokens / 1_000_000) *
      toNumber(reviewInputPrice);
    const reviewOutputCost =
      (reviewOutputTokens / 1_000_000) *
      toNumber(reviewOutputPrice);

    const sandboxRuns =
      tasks * toNumber(sandboxRunsPerTask) * retryMultiplier;
    const sandboxCost =
      (sandboxRuns / 1000) *
      toNumber(sandboxPricePerThousandRuns);

    const reviewedTasks =
      tasks * (clampPercent(humanReviewPercent) / 100);
    const humanReviewHours =
      (reviewedTasks * toNumber(minutesPerHumanReview)) / 60;
    const humanReviewCost =
      humanReviewHours * toNumber(developerHourlyRate);

    const fixedMonthlyCost = toNumber(fixedMonthlyPlatformCost);
    const implementationCost = toNumber(oneTimeImplementationCost);
    const months = Math.max(1, toNumber(amortizationMonths));
    const amortizedImplementationCost =
      implementationCost / months;

    const monthlyOperatingCost =
      plannerInputCost +
      plannerOutputCost +
      codingInputCost +
      codingOutputCost +
      reviewInputCost +
      reviewOutputCost +
      sandboxCost +
      humanReviewCost +
      fixedMonthlyCost;

    const monthlyPlanningCost =
      monthlyOperatingCost + amortizedImplementationCost;

    const manualHours =
      tasks * toNumber(manualHoursPerTask);
    const manualOnlyCost =
      manualHours * toNumber(developerHourlyRate);

    const operatingSavings =
      manualOnlyCost - monthlyOperatingCost;
    const planningSavings =
      manualOnlyCost - monthlyPlanningCost;

    const firstYearAutomationCost =
      monthlyOperatingCost * 12 + implementationCost;
    const firstYearManualCost = manualOnlyCost * 12;
    const firstYearSavings =
      firstYearManualCost - firstYearAutomationCost;

    const costPerTask =
      tasks > 0 ? monthlyPlanningCost / tasks : 0;
    const costPerSuccessfulTask =
      successfulTasks > 0
        ? monthlyPlanningCost / successfulTasks
        : 0;

    const manualCostPerTask =
      tasks > 0 ? manualOnlyCost / tasks : 0;

    const variableAutomationCost =
      plannerInputCost +
      plannerOutputCost +
      codingInputCost +
      codingOutputCost +
      reviewInputCost +
      reviewOutputCost +
      sandboxCost +
      humanReviewCost;

    const variableAutomationCostPerTask =
      tasks > 0 ? variableAutomationCost / tasks : 0;

    const recurringFixedAndAmortized =
      fixedMonthlyCost + amortizedImplementationCost;

    const savingPerTaskBeforeFixed =
      manualCostPerTask - variableAutomationCostPerTask;

    const breakEvenMonthlyTasks =
      savingPerTaskBeforeFixed > 0
        ? recurringFixedAndAmortized /
          savingPerTaskBeforeFixed
        : null;

    const implementationPaybackMonths =
      implementationCost > 0 && operatingSavings > 0
        ? implementationCost / operatingSavings
        : null;

    const rows: CostRow[] = [
      {
        label: "Planner-model input",
        detail: `${formatInteger(
          plannerInputTokens,
        )} input tokens across ${formatInteger(plannerCalls)} calls`,
        value: plannerInputCost,
        entered: plannerInputPrice.trim() !== "",
      },
      {
        label: "Planner-model output",
        detail: `${formatInteger(plannerOutputTokens)} output tokens`,
        value: plannerOutputCost,
        entered: plannerOutputPrice.trim() !== "",
      },
      {
        label: "Coding-model input",
        detail: `${formatInteger(
          codingInputTokens,
        )} input tokens across ${formatInteger(codingCalls)} calls`,
        value: codingInputCost,
        entered: codingInputPrice.trim() !== "",
      },
      {
        label: "Coding-model output",
        detail: `${formatInteger(codingOutputTokens)} output tokens`,
        value: codingOutputCost,
        entered: codingOutputPrice.trim() !== "",
      },
      {
        label: "Review-model input",
        detail: `${formatInteger(
          reviewInputTokens,
        )} input tokens across ${formatInteger(reviewCalls)} calls`,
        value: reviewInputCost,
        entered: reviewInputPrice.trim() !== "",
      },
      {
        label: "Review-model output",
        detail: `${formatInteger(reviewOutputTokens)} output tokens`,
        value: reviewOutputCost,
        entered: reviewOutputPrice.trim() !== "",
      },
      {
        label: "Sandbox and CI execution",
        detail: `${formatInteger(sandboxRuns)} runs including retry overhead`,
        value: sandboxCost,
        entered: sandboxPricePerThousandRuns.trim() !== "",
      },
      {
        label: "Human code review",
        detail: `${formatInteger(
          reviewedTasks,
        )} reviewed tasks · ${formatNumber(humanReviewHours)} hours`,
        value: humanReviewCost,
        entered: developerHourlyRate.trim() !== "",
      },
      {
        label: "Fixed monthly platform cost",
        detail: "Agent platform, repositories, observability, or orchestration",
        value: fixedMonthlyCost,
        entered: fixedMonthlyPlatformCost.trim() !== "",
      },
      {
        label: "Amortised implementation",
        detail: `${formatMoney(
          implementationCost,
        )} spread across ${formatInteger(months)} months`,
        value: amortizedImplementationCost,
        entered: oneTimeImplementationCost.trim() !== "",
      },
    ];

    const enteredPriceCount = [
      plannerInputPrice,
      plannerOutputPrice,
      codingInputPrice,
      codingOutputPrice,
      reviewInputPrice,
      reviewOutputPrice,
      sandboxPricePerThousandRuns,
      developerHourlyRate,
      fixedMonthlyPlatformCost,
      oneTimeImplementationCost,
    ].filter((value) => value.trim() !== "").length;

    const hasAnyPrice = enteredPriceCount > 0;
    const hasDeveloperRate = developerHourlyRate.trim() !== "";
    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      tasks,
      successfulTasks,
      plannerCalls,
      codingCalls,
      reviewCalls,
      sandboxRuns,
      reviewedTasks,
      humanReviewHours,
      plannerInputTokens,
      plannerOutputTokens,
      codingInputTokens,
      codingOutputTokens,
      reviewInputTokens,
      reviewOutputTokens,
      monthlyOperatingCost,
      monthlyPlanningCost,
      manualHours,
      manualOnlyCost,
      operatingSavings,
      planningSavings,
      firstYearAutomationCost,
      firstYearManualCost,
      firstYearSavings,
      costPerTask,
      costPerSuccessfulTask,
      breakEvenMonthlyTasks,
      implementationPaybackMonths,
      rows,
      enteredPriceCount,
      hasAnyPrice,
      hasDeveloperRate,
      hasBudget,
      budget,
      budgetDifference: budget - monthlyPlanningCost,
    };
  }, [
    amortizationMonths,
    codingInputPrice,
    codingInputTokensPerCall,
    codingIterationsPerTask,
    codingOutputPrice,
    codingOutputTokensPerCall,
    developerHourlyRate,
    fixedMonthlyPlatformCost,
    humanReviewPercent,
    manualHoursPerTask,
    minutesPerHumanReview,
    monthlyBudget,
    monthlyTasks,
    oneTimeImplementationCost,
    plannerCallsPerTask,
    plannerInputPrice,
    plannerInputTokensPerCall,
    plannerOutputPrice,
    plannerOutputTokensPerCall,
    repairAttemptsPerTask,
    retryOverheadPercent,
    reviewCallsPerTask,
    reviewInputPrice,
    reviewInputTokensPerCall,
    reviewOutputPrice,
    reviewOutputTokensPerCall,
    sandboxPricePerThousandRuns,
    sandboxRunsPerTask,
    successfulCompletionRate,
  ]);

  const reset = () => {
    setMonthlyTasks("500");
    setSuccessfulCompletionRate("82");
    setPlannerCallsPerTask("1");
    setCodingIterationsPerTask("4");
    setRepairAttemptsPerTask("1.5");
    setReviewCallsPerTask("1");
    setRetryOverheadPercent("8");
    setPlannerInputTokensPerCall("9000");
    setPlannerOutputTokensPerCall("1500");
    setCodingInputTokensPerCall("14000");
    setCodingOutputTokensPerCall("2800");
    setReviewInputTokensPerCall("7000");
    setReviewOutputTokensPerCall("700");
    setPlannerInputPrice("");
    setPlannerOutputPrice("");
    setCodingInputPrice("");
    setCodingOutputPrice("");
    setReviewInputPrice("");
    setReviewOutputPrice("");
    setSandboxRunsPerTask("5");
    setSandboxPricePerThousandRuns("");
    setHumanReviewPercent("25");
    setMinutesPerHumanReview("12");
    setDeveloperHourlyRate("");
    setFixedMonthlyPlatformCost("");
    setOneTimeImplementationCost("");
    setAmortizationMonths("12");
    setManualHoursPerTask("3");
    setMonthlyBudget("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Coding-Agent Workflow
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Model planning, implementation, repair, review, execution, and
            human approval.
          </p>
        </div>

        <FieldSection title="Monthly Tasks and Iterations">
          <BeeijaNumberField
            label="Coding tasks per month"
            value={monthlyTasks}
            onChange={setMonthlyTasks}
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
            label="Planner calls per task"
            value={plannerCallsPerTask}
            onChange={setPlannerCallsPerTask}
            min="0"
            step="0.1"
          />

          <BeeijaNumberField
            label="Coding iterations per task"
            value={codingIterationsPerTask}
            onChange={setCodingIterationsPerTask}
            min="0"
            step="0.1"
          />

          <BeeijaNumberField
            label="Test-repair attempts per task"
            value={repairAttemptsPerTask}
            onChange={setRepairAttemptsPerTask}
            min="0"
            step="0.1"
          />

          <BeeijaNumberField
            label="Review-model calls per task"
            value={reviewCallsPerTask}
            onChange={setReviewCallsPerTask}
            min="0"
            step="0.1"
          />

          <BeeijaNumberField
            label="Retry and repeated-call overhead"
            value={retryOverheadPercent}
            onChange={setRetryOverheadPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Planner Model Tokens and Prices">
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
            label="Planner input price per 1M tokens"
            value={plannerInputPrice}
            onChange={setPlannerInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Planner output price per 1M tokens"
            value={plannerOutputPrice}
            onChange={setPlannerOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Coding Model Tokens and Prices">
          <BeeijaNumberField
            label="Coding input tokens per call"
            value={codingInputTokensPerCall}
            onChange={setCodingInputTokensPerCall}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Coding output tokens per call"
            value={codingOutputTokensPerCall}
            onChange={setCodingOutputTokensPerCall}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Coding input price per 1M tokens"
            value={codingInputPrice}
            onChange={setCodingInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Coding output price per 1M tokens"
            value={codingOutputPrice}
            onChange={setCodingOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Review Model Tokens and Prices">
          <BeeijaNumberField
            label="Review input tokens per call"
            value={reviewInputTokensPerCall}
            onChange={setReviewInputTokensPerCall}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Review output tokens per call"
            value={reviewOutputTokensPerCall}
            onChange={setReviewOutputTokensPerCall}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Review input price per 1M tokens"
            value={reviewInputPrice}
            onChange={setReviewInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Review output price per 1M tokens"
            value={reviewOutputPrice}
            onChange={setReviewOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Execution, Human Review, and Setup">
          <BeeijaNumberField
            label="Sandbox or CI runs per task"
            value={sandboxRunsPerTask}
            onChange={setSandboxRunsPerTask}
            min="0"
            step="0.1"
          />

          <BeeijaNumberField
            label="Sandbox or CI price per 1,000 runs"
            value={sandboxPricePerThousandRuns}
            onChange={setSandboxPricePerThousandRuns}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Tasks receiving human review"
            value={humanReviewPercent}
            onChange={setHumanReviewPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Minutes per human review"
            value={minutesPerHumanReview}
            onChange={setMinutesPerHumanReview}
            min="0"
            step="0.1"
            suffix="min"
          />

          <BeeijaNumberField
            label="Developer hourly rate"
            value={developerHourlyRate}
            onChange={setDeveloperHourlyRate}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="Fixed platform cost per month"
            value={fixedMonthlyPlatformCost}
            onChange={setFixedMonthlyPlatformCost}
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
            label="Implementation amortisation period"
            value={amortizationMonths}
            onChange={setAmortizationMonths}
            min="1"
            step="1"
            suffix="mo"
          />
        </FieldSection>

        <FieldSection title="Manual Baseline and Budget">
          <BeeijaNumberField
            label="Manual developer hours per task"
            value={manualHoursPerTask}
            onChange={setManualHoursPerTask}
            min="0"
            step="0.1"
            suffix="hr"
          />

          <BeeijaNumberField
            label="Target monthly coding-agent budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated monthly coding-agent workload
          </p>

          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>
              Planner calls: {formatInteger(result.plannerCalls)}
            </p>

            <p>
              Coding and repair calls:{" "}
              {formatInteger(result.codingCalls)}
            </p>

            <p>
              Review-model calls: {formatInteger(result.reviewCalls)}
            </p>

            <p>
              Sandbox and CI runs: {formatInteger(result.sandboxRuns)}
            </p>

            <p>
              Human-reviewed tasks:{" "}
              {formatInteger(result.reviewedTasks)}
            </p>

            <p>
              Successful tasks: {formatInteger(result.successfulTasks)}
            </p>

            <p>
              Total model input tokens:{" "}
              {formatInteger(
                result.plannerInputTokens +
                  result.codingInputTokens +
                  result.reviewInputTokens,
              )}
            </p>

            <p>
              Total model output tokens:{" "}
              {formatInteger(
                result.plannerOutputTokens +
                  result.codingOutputTokens +
                  result.reviewOutputTokens,
              )}
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
        title="Coding-Agent Cost and Savings"
        description="The result separates planner, coding, review, execution, human approval, fixed platform, and setup costs."
        primaryLabel="Monthly coding-agent planning cost"
        primaryValue={
          result.hasAnyPrice
            ? formatMoney(result.monthlyPlanningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per attempted task"
              value={
                result.hasAnyPrice
                  ? formatMoney(result.costPerTask)
                  : "—"
              }
            />

            <ResultStat
              label="Per successful task"
              value={
                result.hasAnyPrice
                  ? formatMoney(result.costPerSuccessfulTask)
                  : "—"
              }
            />

            <ResultStat
              label="First-year automation"
              value={
                result.hasAnyPrice
                  ? formatMoney(result.firstYearAutomationCost)
                  : "—"
              }
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
              />
            ))}
          </div>
        }
        totals={
          <div className="text-sm leading-relaxed text-gray-600">
            <p>
              Monthly operating cost:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyPrice
                  ? formatMoney(result.monthlyOperatingCost)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Manual-only monthly baseline:{" "}
              <span className="font-medium text-gray-900">
                {result.hasDeveloperRate
                  ? formatMoney(result.manualOnlyCost)
                  : "Enter the developer hourly rate"}
              </span>
            </p>

            <p className="mt-2">
              Monthly operating comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasDeveloperRate ||
                  result.operatingSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasDeveloperRate
                  ? "Enter the developer hourly rate"
                  : result.operatingSavings >= 0
                    ? `${formatMoney(
                        result.operatingSavings,
                      )} estimated saving`
                    : `${formatMoney(
                        Math.abs(result.operatingSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              Monthly planning comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasDeveloperRate ||
                  result.planningSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasDeveloperRate
                  ? "Enter the developer hourly rate"
                  : result.planningSavings >= 0
                    ? `${formatMoney(
                        result.planningSavings,
                      )} estimated saving`
                    : `${formatMoney(
                        Math.abs(result.planningSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              First-year comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasDeveloperRate ||
                  result.firstYearSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasDeveloperRate
                  ? "Enter the developer hourly rate"
                  : result.firstYearSavings >= 0
                    ? `${formatMoney(
                        result.firstYearSavings,
                      )} estimated saving`
                    : `${formatMoney(
                        Math.abs(result.firstYearSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              Approximate break-even volume:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasDeveloperRate
                  ? "Enter the developer hourly rate"
                  : result.breakEvenMonthlyTasks === null
                    ? "No positive saving per task"
                    : `${formatInteger(
                        result.breakEvenMonthlyTasks,
                      )} tasks per month`}
              </span>
            </p>

            <p className="mt-2">
              Implementation payback:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasDeveloperRate
                  ? "Enter the developer hourly rate"
                  : toNumber(oneTimeImplementationCost) === 0
                    ? "No implementation cost entered"
                    : result.implementationPaybackMonths === null
                      ? "No positive operating payback"
                      : `${formatNumber(
                          result.implementationPaybackMonths,
                        )} months`}
              </span>
            </p>

            <p className="mt-2">
              Price inputs entered:{" "}
              <span className="font-medium text-gray-900">
                {result.enteredPriceCount} of 10
              </span>
            </p>

            <p className="mt-2">
              Budget status:{" "}
              <span
                className={`font-semibold ${
                  result.hasBudget &&
                  result.hasAnyPrice &&
                  result.budgetDifference < 0
                    ? "text-red-700"
                    : "text-[var(--green)]"
                }`}
              >
                {!result.hasBudget
                  ? "Add a budget to compare"
                  : !result.hasAnyPrice
                    ? "Enter current prices"
                    : result.budgetDifference >= 0
                      ? `${formatMoney(result.budgetDifference)} remaining`
                      : `${formatMoney(
                          Math.abs(result.budgetDifference),
                        )} over budget`}
              </span>
            </p>
          </div>
        }
        noticeText="This calculator stores no model, coding-agent, sandbox, CI, labour, or platform price. Enter the current effective rates for the exact services being considered. Blank optional price fields are treated as zero. Task difficulty, repository size, context caching, failed deployments, taxes, storage, and security review can change the final cost."
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
      <div className="mt-5 grid gap-5 md:grid-cols-2">{children}</div>
    </div>
  );
}

function ResultStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-950">{value}</p>
    </div>
  );
}

function BreakdownRow({
  label,
  detail,
  value,
  entered,
}: {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 text-sm text-gray-500">{detail}</p>
      </div>

      <p className="font-semibold text-gray-950">
        {entered ? formatMoney(value) : "—"}
      </p>
    </div>
  );
}

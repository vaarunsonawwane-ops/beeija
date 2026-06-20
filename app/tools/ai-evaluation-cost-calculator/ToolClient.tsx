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
  const [evaluationItems, setEvaluationItems] = useState("1000");
  const [candidatesPerItem, setCandidatesPerItem] = useState("3");
  const [evaluationRunsPerMonth, setEvaluationRunsPerMonth] =
    useState("4");
  const [candidateInputTokens, setCandidateInputTokens] =
    useState("1200");
  const [candidateOutputTokens, setCandidateOutputTokens] =
    useState("400");
  const [repeatOverheadPercent, setRepeatOverheadPercent] =
    useState("5");

  const [candidateInputPrice, setCandidateInputPrice] = useState("");
  const [candidateOutputPrice, setCandidateOutputPrice] =
    useState("");

  const [modelGradersPerCandidate, setModelGradersPerCandidate] =
    useState("2");
  const [graderInputTokens, setGraderInputTokens] = useState("1800");
  const [graderOutputTokens, setGraderOutputTokens] =
    useState("150");
  const [graderInputPrice, setGraderInputPrice] = useState("");
  const [graderOutputPrice, setGraderOutputPrice] =
    useState("");

  const [humanReviewPercent, setHumanReviewPercent] = useState("10");
  const [minutesPerHumanReview, setMinutesPerHumanReview] =
    useState("2");
  const [humanHourlyRate, setHumanHourlyRate] = useState("");

  const [fixedMonthlyPlatformCost, setFixedMonthlyPlatformCost] =
    useState("");
  const [datasetPreparationHours, setDatasetPreparationHours] =
    useState("40");
  const [datasetPreparationHourlyRate, setDatasetPreparationHourlyRate] =
    useState("");
  const [otherOneTimeSetupCost, setOtherOneTimeSetupCost] =
    useState("");
  const [setupAmortizationMonths, setSetupAmortizationMonths] =
    useState("12");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const items = toNumber(evaluationItems);
    const candidates = Math.max(1, toNumber(candidatesPerItem));
    const monthlyRuns = Math.max(1, toNumber(evaluationRunsPerMonth));
    const repeatMultiplier =
      1 + clampPercent(repeatOverheadPercent) / 100;

    const candidateOutputsBeforeOverhead =
      items * candidates * monthlyRuns;
    const candidateOutputs =
      candidateOutputsBeforeOverhead * repeatMultiplier;

    const candidateInputTokenVolume =
      candidateOutputs * toNumber(candidateInputTokens);
    const candidateOutputTokenVolume =
      candidateOutputs * toNumber(candidateOutputTokens);

    const candidateInputCost =
      (candidateInputTokenVolume / 1_000_000) *
      toNumber(candidateInputPrice);

    const candidateOutputCost =
      (candidateOutputTokenVolume / 1_000_000) *
      toNumber(candidateOutputPrice);

    const graderCount = toNumber(modelGradersPerCandidate);
    const graderCalls = candidateOutputs * graderCount;

    const graderInputTokenVolume =
      graderCalls * toNumber(graderInputTokens);
    const graderOutputTokenVolume =
      graderCalls * toNumber(graderOutputTokens);

    const graderInputCost =
      (graderInputTokenVolume / 1_000_000) *
      toNumber(graderInputPrice);

    const graderOutputCost =
      (graderOutputTokenVolume / 1_000_000) *
      toNumber(graderOutputPrice);

    const reviewShare = clampPercent(humanReviewPercent) / 100;
    const selectiveHumanReviews = candidateOutputs * reviewShare;
    const fullHumanReviews = candidateOutputs;

    const reviewHours =
      (selectiveHumanReviews * toNumber(minutesPerHumanReview)) / 60;
    const fullReviewHours =
      (fullHumanReviews * toNumber(minutesPerHumanReview)) / 60;

    const selectiveHumanReviewCost =
      reviewHours * toNumber(humanHourlyRate);
    const fullHumanReviewCost =
      fullReviewHours * toNumber(humanHourlyRate);
    const selectiveReviewLabourSaving =
      fullHumanReviewCost - selectiveHumanReviewCost;

    const platformCost = toNumber(fixedMonthlyPlatformCost);

    const datasetPreparationCost =
      toNumber(datasetPreparationHours) *
      toNumber(datasetPreparationHourlyRate);

    const otherSetupCost = toNumber(otherOneTimeSetupCost);
    const initialSetupCost =
      datasetPreparationCost + otherSetupCost;

    const amortizationMonths = Math.max(
      1,
      toNumber(setupAmortizationMonths),
    );
    const amortizedSetupCost =
      initialSetupCost / amortizationMonths;

    const monthlyOperatingCost =
      candidateInputCost +
      candidateOutputCost +
      graderInputCost +
      graderOutputCost +
      selectiveHumanReviewCost +
      platformCost;

    const monthlyPlanningCost =
      monthlyOperatingCost + amortizedSetupCost;

    const firstYearCost =
      initialSetupCost + monthlyOperatingCost * 12;

    const costPerEvaluationItem =
      items * monthlyRuns > 0
        ? monthlyPlanningCost / (items * monthlyRuns)
        : 0;

    const costPerCandidateOutput =
      candidateOutputs > 0
        ? monthlyPlanningCost / candidateOutputs
        : 0;

    const costPerEvaluationRun =
      monthlyRuns > 0
        ? monthlyPlanningCost / monthlyRuns
        : 0;

    const modelCost =
      candidateInputCost +
      candidateOutputCost +
      graderInputCost +
      graderOutputCost;

    const humanShareOfOperatingCost =
      monthlyOperatingCost > 0
        ? (selectiveHumanReviewCost / monthlyOperatingCost) * 100
        : 0;

    const rows: CostRow[] = [
      {
        label: "Candidate-model input",
        detail: `${formatInteger(
          candidateInputTokenVolume,
        )} monthly input tokens`,
        value: candidateInputCost,
        entered: candidateInputPrice.trim() !== "",
      },
      {
        label: "Candidate-model output",
        detail: `${formatInteger(
          candidateOutputTokenVolume,
        )} monthly output tokens`,
        value: candidateOutputCost,
        entered: candidateOutputPrice.trim() !== "",
      },
      {
        label: "Judge-model input",
        detail: `${formatInteger(
          graderInputTokenVolume,
        )} monthly grader input tokens`,
        value: graderInputCost,
        entered: graderInputPrice.trim() !== "",
      },
      {
        label: "Judge-model output",
        detail: `${formatInteger(
          graderOutputTokenVolume,
        )} monthly grader output tokens`,
        value: graderOutputCost,
        entered: graderOutputPrice.trim() !== "",
      },
      {
        label: "Selective human review",
        detail: `${formatInteger(
          selectiveHumanReviews,
        )} outputs · ${formatNumber(reviewHours)} hours`,
        value: selectiveHumanReviewCost,
        entered: humanHourlyRate.trim() !== "",
      },
      {
        label: "Fixed evaluation platform cost",
        detail: "Storage, annotation, observability, or evaluation platform",
        value: platformCost,
        entered: fixedMonthlyPlatformCost.trim() !== "",
      },
      {
        label: "Amortised evaluation setup",
        detail: `${formatMoney(
          initialSetupCost,
        )} spread across ${formatInteger(amortizationMonths)} months`,
        value: amortizedSetupCost,
        entered:
          datasetPreparationHourlyRate.trim() !== "" ||
          otherOneTimeSetupCost.trim() !== "",
      },
    ];

    const enteredPriceCount = [
      candidateInputPrice,
      candidateOutputPrice,
      graderInputPrice,
      graderOutputPrice,
      humanHourlyRate,
      fixedMonthlyPlatformCost,
      datasetPreparationHourlyRate,
      otherOneTimeSetupCost,
    ].filter((value) => value.trim() !== "").length;

    const hasAnyPrice = enteredPriceCount > 0;
    const hasModelPrices =
      candidateInputPrice.trim() !== "" &&
      candidateOutputPrice.trim() !== "" &&
      graderInputPrice.trim() !== "" &&
      graderOutputPrice.trim() !== "";
    const hasHumanRate = humanHourlyRate.trim() !== "";
    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      items,
      candidates,
      monthlyRuns,
      candidateOutputsBeforeOverhead,
      candidateOutputs,
      graderCalls,
      candidateInputTokenVolume,
      candidateOutputTokenVolume,
      graderInputTokenVolume,
      graderOutputTokenVolume,
      selectiveHumanReviews,
      fullHumanReviews,
      reviewHours,
      fullReviewHours,
      candidateInputCost,
      candidateOutputCost,
      graderInputCost,
      graderOutputCost,
      modelCost,
      selectiveHumanReviewCost,
      fullHumanReviewCost,
      selectiveReviewLabourSaving,
      platformCost,
      datasetPreparationCost,
      otherSetupCost,
      initialSetupCost,
      amortizedSetupCost,
      monthlyOperatingCost,
      monthlyPlanningCost,
      firstYearCost,
      costPerEvaluationItem,
      costPerCandidateOutput,
      costPerEvaluationRun,
      humanShareOfOperatingCost,
      rows,
      enteredPriceCount,
      hasAnyPrice,
      hasModelPrices,
      hasHumanRate,
      hasBudget,
      budget,
      budgetDifference: budget - monthlyPlanningCost,
    };
  }, [
    candidateInputPrice,
    candidateInputTokens,
    candidateOutputPrice,
    candidateOutputTokens,
    candidatesPerItem,
    datasetPreparationHourlyRate,
    datasetPreparationHours,
    evaluationItems,
    evaluationRunsPerMonth,
    fixedMonthlyPlatformCost,
    graderInputPrice,
    graderInputTokens,
    graderOutputPrice,
    graderOutputTokens,
    humanHourlyRate,
    humanReviewPercent,
    minutesPerHumanReview,
    modelGradersPerCandidate,
    monthlyBudget,
    otherOneTimeSetupCost,
    repeatOverheadPercent,
    setupAmortizationMonths,
  ]);

  const reset = () => {
    setEvaluationItems("1000");
    setCandidatesPerItem("3");
    setEvaluationRunsPerMonth("4");
    setCandidateInputTokens("1200");
    setCandidateOutputTokens("400");
    setRepeatOverheadPercent("5");
    setCandidateInputPrice("");
    setCandidateOutputPrice("");
    setModelGradersPerCandidate("2");
    setGraderInputTokens("1800");
    setGraderOutputTokens("150");
    setGraderInputPrice("");
    setGraderOutputPrice("");
    setHumanReviewPercent("10");
    setMinutesPerHumanReview("2");
    setHumanHourlyRate("");
    setFixedMonthlyPlatformCost("");
    setDatasetPreparationHours("40");
    setDatasetPreparationHourlyRate("");
    setOtherOneTimeSetupCost("");
    setSetupAmortizationMonths("12");
    setMonthlyBudget("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Evaluation Plan
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Model candidate inference, automated graders, repeated runs, and
            human review in one estimate.
          </p>
        </div>

        <FieldSection title="Evaluation Dataset and Runs">
          <BeeijaNumberField
            label="Evaluation items per run"
            value={evaluationItems}
            onChange={setEvaluationItems}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Candidate outputs per item"
            value={candidatesPerItem}
            onChange={setCandidatesPerItem}
            min="1"
            step="1"
          />

          <BeeijaNumberField
            label="Evaluation runs per month"
            value={evaluationRunsPerMonth}
            onChange={setEvaluationRunsPerMonth}
            min="1"
            step="1"
          />

          <BeeijaNumberField
            label="Repeat and failed-item overhead"
            value={repeatOverheadPercent}
            onChange={setRepeatOverheadPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Candidate Model Usage">
          <BeeijaNumberField
            label="Candidate input tokens per output"
            value={candidateInputTokens}
            onChange={setCandidateInputTokens}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Candidate output tokens per output"
            value={candidateOutputTokens}
            onChange={setCandidateOutputTokens}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Candidate input price per 1M tokens"
            value={candidateInputPrice}
            onChange={setCandidateInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Candidate output price per 1M tokens"
            value={candidateOutputPrice}
            onChange={setCandidateOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Model Graders">
          <BeeijaNumberField
            label="Model graders per candidate output"
            value={modelGradersPerCandidate}
            onChange={setModelGradersPerCandidate}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Grader input tokens per grade"
            value={graderInputTokens}
            onChange={setGraderInputTokens}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Grader output tokens per grade"
            value={graderOutputTokens}
            onChange={setGraderOutputTokens}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Grader input price per 1M tokens"
            value={graderInputPrice}
            onChange={setGraderInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Grader output price per 1M tokens"
            value={graderOutputPrice}
            onChange={setGraderOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Human Review">
          <BeeijaNumberField
            label="Candidate outputs reviewed by humans"
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
            label="Human reviewer hourly rate"
            value={humanHourlyRate}
            onChange={setHumanHourlyRate}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Platform, Setup, and Budget">
          <BeeijaNumberField
            label="Fixed evaluation platform cost per month"
            value={fixedMonthlyPlatformCost}
            onChange={setFixedMonthlyPlatformCost}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="Dataset preparation hours"
            value={datasetPreparationHours}
            onChange={setDatasetPreparationHours}
            min="0"
            step="1"
            suffix="hr"
          />

          <BeeijaNumberField
            label="Dataset preparation hourly rate"
            value={datasetPreparationHourlyRate}
            onChange={setDatasetPreparationHourlyRate}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="Other one-time evaluation setup cost"
            value={otherOneTimeSetupCost}
            onChange={setOtherOneTimeSetupCost}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="Setup amortisation period"
            value={setupAmortizationMonths}
            onChange={setSetupAmortizationMonths}
            min="1"
            step="1"
            suffix="mo"
          />

          <BeeijaNumberField
            label="Target monthly evaluation budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated monthly evaluation workload
          </p>

          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>
              Candidate outputs before overhead:{" "}
              {formatInteger(result.candidateOutputsBeforeOverhead)}
            </p>

            <p>
              Candidate outputs billed:{" "}
              {formatInteger(result.candidateOutputs)}
            </p>

            <p>
              Model-grader calls: {formatInteger(result.graderCalls)}
            </p>

            <p>
              Human reviews:{" "}
              {formatInteger(result.selectiveHumanReviews)}
            </p>

            <p>
              Human-review hours: {formatNumber(result.reviewHours)}
            </p>

            <p>
              Full-review hours: {formatNumber(result.fullReviewHours)}
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
        title="Evaluation Cost Estimate"
        description="The result separates candidate inference, model grading, human review, platform costs, and amortised setup."
        primaryLabel="Monthly evaluation planning cost"
        primaryValue={
          result.hasAnyPrice
            ? formatMoney(result.monthlyPlanningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per evaluation item"
              value={
                result.hasAnyPrice
                  ? formatMoney(result.costPerEvaluationItem)
                  : "—"
              }
            />

            <ResultStat
              label="Per candidate output"
              value={
                result.hasAnyPrice
                  ? formatMoney(result.costPerCandidateOutput)
                  : "—"
              }
            />

            <ResultStat
              label="First-year cost"
              value={
                result.hasAnyPrice
                  ? formatMoney(result.firstYearCost)
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
              Cost per evaluation run:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyPrice
                  ? formatMoney(result.costPerEvaluationRun)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Candidate and judge-model cost:{" "}
              <span className="font-medium text-gray-900">
                {result.hasModelPrices
                  ? formatMoney(result.modelCost)
                  : "Enter candidate and grader prices"}
              </span>
            </p>

            <p className="mt-2">
              Full human-review baseline:{" "}
              <span className="font-medium text-gray-900">
                {result.hasHumanRate
                  ? formatMoney(result.fullHumanReviewCost)
                  : "Enter the reviewer rate"}
              </span>
            </p>

            <p className="mt-2">
              Labour saving from selective review:{" "}
              <span className="font-medium text-gray-900">
                {result.hasHumanRate
                  ? formatMoney(result.selectiveReviewLabourSaving)
                  : "Enter the reviewer rate"}
              </span>
            </p>

            <p className="mt-2">
              Human review share of operating cost:{" "}
              <span className="font-medium text-gray-900">
                {result.hasHumanRate && result.hasAnyPrice
                  ? `${formatNumber(
                      result.humanShareOfOperatingCost,
                    )}%`
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Price inputs entered:{" "}
              <span className="font-medium text-gray-900">
                {result.enteredPriceCount} of 8
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
        noticeText="This calculator stores no model, labour, or platform price. Enter the current official rates for the exact candidate models, judge models, evaluation platform, and review team. Blank optional price fields are treated as zero. Dataset quality, grader reliability, taxes, storage, data transfer, and private platform fees can change the final cost."
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

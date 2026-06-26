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
  const [targetAcceptedRecords, setTargetAcceptedRecords] =
    useState("50000");
  const [acceptanceRatePercent, setAcceptanceRatePercent] =
    useState("80");
  const [retryOverheadPercent, setRetryOverheadPercent] =
    useState("5");

  const [generationInputTokensPerCandidate, setGenerationInputTokensPerCandidate] =
    useState("450");
  const [generationOutputTokensPerCandidate, setGenerationOutputTokensPerCandidate] =
    useState("300");
  const [generationInputPrice, setGenerationInputPrice] =
    useState("");
  const [generationOutputPrice, setGenerationOutputPrice] =
    useState("");

  const [validationCoveragePercent, setValidationCoveragePercent] =
    useState("100");
  const [validatorInputTokensPerCandidate, setValidatorInputTokensPerCandidate] =
    useState("500");
  const [validatorOutputTokensPerCandidate, setValidatorOutputTokensPerCandidate] =
    useState("80");
  const [validatorInputPrice, setValidatorInputPrice] =
    useState("");
  const [validatorOutputPrice, setValidatorOutputPrice] =
    useState("");

  const [embeddingCoveragePercent, setEmbeddingCoveragePercent] =
    useState("100");
  const [embeddingTokensPerCandidate, setEmbeddingTokensPerCandidate] =
    useState("300");
  const [embeddingPricePerMillion, setEmbeddingPricePerMillion] =
    useState("");

  const [humanReviewPercent, setHumanReviewPercent] =
    useState("10");
  const [minutesPerHumanReview, setMinutesPerHumanReview] =
    useState("1.5");
  const [reviewerHourlyRate, setReviewerHourlyRate] =
    useState("");

  const [fixedMonthlyPlatformCost, setFixedMonthlyPlatformCost] =
    useState("");
  const [oneTimeImplementationCost, setOneTimeImplementationCost] =
    useState("");
  const [amortizationMonths, setAmortizationMonths] =
    useState("12");

  const [manualCostPerAcceptedRecord, setManualCostPerAcceptedRecord] =
    useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const acceptedTarget = toNumber(targetAcceptedRecords);
    const acceptanceRate = Math.max(
      0.0001,
      clampPercent(acceptanceRatePercent) / 100,
    );
    const retryMultiplier =
      1 + clampPercent(retryOverheadPercent) / 100;

    const requiredCandidates = acceptedTarget / acceptanceRate;
    const generationAttempts = requiredCandidates * retryMultiplier;
    const rejectedCandidates = Math.max(
      0,
      requiredCandidates - acceptedTarget,
    );

    const generationInputTokens =
      generationAttempts *
      toNumber(generationInputTokensPerCandidate);
    const generationOutputTokens =
      generationAttempts *
      toNumber(generationOutputTokensPerCandidate);

    const generationInputCost =
      (generationInputTokens / 1_000_000) *
      toNumber(generationInputPrice);
    const generationOutputCost =
      (generationOutputTokens / 1_000_000) *
      toNumber(generationOutputPrice);

    const validationCandidates =
      requiredCandidates *
      (clampPercent(validationCoveragePercent) / 100);

    const validatorInputTokens =
      validationCandidates *
      toNumber(validatorInputTokensPerCandidate);
    const validatorOutputTokens =
      validationCandidates *
      toNumber(validatorOutputTokensPerCandidate);

    const validatorInputCost =
      (validatorInputTokens / 1_000_000) *
      toNumber(validatorInputPrice);
    const validatorOutputCost =
      (validatorOutputTokens / 1_000_000) *
      toNumber(validatorOutputPrice);

    const embeddedCandidates =
      requiredCandidates *
      (clampPercent(embeddingCoveragePercent) / 100);
    const embeddingTokens =
      embeddedCandidates *
      toNumber(embeddingTokensPerCandidate);
    const embeddingCost =
      (embeddingTokens / 1_000_000) *
      toNumber(embeddingPricePerMillion);

    const reviewedCandidates =
      requiredCandidates *
      (clampPercent(humanReviewPercent) / 100);
    const humanReviewHours =
      (reviewedCandidates * toNumber(minutesPerHumanReview)) / 60;
    const humanReviewCost =
      humanReviewHours * toNumber(reviewerHourlyRate);

    const fixedMonthlyCost = toNumber(fixedMonthlyPlatformCost);
    const implementationCost = toNumber(oneTimeImplementationCost);
    const months = Math.max(1, toNumber(amortizationMonths));
    const amortizedImplementationCost = implementationCost / months;

    const monthlyOperatingCost =
      generationInputCost +
      generationOutputCost +
      validatorInputCost +
      validatorOutputCost +
      embeddingCost +
      humanReviewCost +
      fixedMonthlyCost;

    const monthlyPlanningCost =
      monthlyOperatingCost + amortizedImplementationCost;

    const manualOnlyCost =
      acceptedTarget * toNumber(manualCostPerAcceptedRecord);

    const operatingSavings = manualOnlyCost - monthlyOperatingCost;
    const planningSavings = manualOnlyCost - monthlyPlanningCost;

    const firstYearAutomationCost =
      monthlyOperatingCost * 12 + implementationCost;
    const firstYearManualCost = manualOnlyCost * 12;
    const firstYearSavings =
      firstYearManualCost - firstYearAutomationCost;

    const costPerCandidate =
      requiredCandidates > 0
        ? monthlyPlanningCost / requiredCandidates
        : 0;

    const costPerAcceptedRecord =
      acceptedTarget > 0
        ? monthlyPlanningCost / acceptedTarget
        : 0;

    const variableAutomationCost =
      generationInputCost +
      generationOutputCost +
      validatorInputCost +
      validatorOutputCost +
      embeddingCost +
      humanReviewCost;

    const variableAutomationCostPerAcceptedRecord =
      acceptedTarget > 0
        ? variableAutomationCost / acceptedTarget
        : 0;

    const savingPerAcceptedRecordBeforeFixed =
      toNumber(manualCostPerAcceptedRecord) -
      variableAutomationCostPerAcceptedRecord;

    const recurringFixedAndAmortized =
      fixedMonthlyCost + amortizedImplementationCost;

    const breakEvenAcceptedRecords =
      savingPerAcceptedRecordBeforeFixed > 0
        ? recurringFixedAndAmortized /
          savingPerAcceptedRecordBeforeFixed
        : null;

    const implementationPaybackMonths =
      implementationCost > 0 && operatingSavings > 0
        ? implementationCost / operatingSavings
        : null;

    const rows: CostRow[] = [
      {
        label: "Generation-model input",
        detail: `${formatInteger(
          generationInputTokens,
        )} input tokens across ${formatInteger(generationAttempts)} attempts`,
        value: generationInputCost,
        entered: generationInputPrice.trim() !== "",
      },
      {
        label: "Generation-model output",
        detail: `${formatInteger(generationOutputTokens)} output tokens`,
        value: generationOutputCost,
        entered: generationOutputPrice.trim() !== "",
      },
      {
        label: "Validator-model input",
        detail: `${formatInteger(
          validatorInputTokens,
        )} input tokens across ${formatInteger(validationCandidates)} candidates`,
        value: validatorInputCost,
        entered: validatorInputPrice.trim() !== "",
      },
      {
        label: "Validator-model output",
        detail: `${formatInteger(validatorOutputTokens)} output tokens`,
        value: validatorOutputCost,
        entered: validatorOutputPrice.trim() !== "",
      },
      {
        label: "Embedding duplicate checks",
        detail: `${formatInteger(
          embeddingTokens,
        )} embedding tokens across ${formatInteger(embeddedCandidates)} candidates`,
        value: embeddingCost,
        entered: embeddingPricePerMillion.trim() !== "",
      },
      {
        label: "Human review",
        detail: `${formatInteger(
          reviewedCandidates,
        )} reviewed candidates · ${formatNumber(humanReviewHours)} hours`,
        value: humanReviewCost,
        entered: reviewerHourlyRate.trim() !== "",
      },
      {
        label: "Fixed monthly platform cost",
        detail: "Storage, pipeline, filtering, monitoring, or data platform",
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
      generationInputPrice,
      generationOutputPrice,
      validatorInputPrice,
      validatorOutputPrice,
      embeddingPricePerMillion,
      reviewerHourlyRate,
      fixedMonthlyPlatformCost,
      oneTimeImplementationCost,
      manualCostPerAcceptedRecord,
    ].filter((value) => value.trim() !== "").length;

    const hasAnyPrice = enteredPriceCount > 0;
    const hasManualBaseline =
      manualCostPerAcceptedRecord.trim() !== "";
    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      acceptedTarget,
      requiredCandidates,
      generationAttempts,
      rejectedCandidates,
      validationCandidates,
      embeddedCandidates,
      reviewedCandidates,
      humanReviewHours,
      generationInputTokens,
      generationOutputTokens,
      validatorInputTokens,
      validatorOutputTokens,
      embeddingTokens,
      monthlyOperatingCost,
      monthlyPlanningCost,
      manualOnlyCost,
      operatingSavings,
      planningSavings,
      firstYearAutomationCost,
      firstYearManualCost,
      firstYearSavings,
      costPerCandidate,
      costPerAcceptedRecord,
      breakEvenAcceptedRecords,
      implementationPaybackMonths,
      rows,
      enteredPriceCount,
      hasAnyPrice,
      hasManualBaseline,
      hasBudget,
      budget,
      budgetDifference: budget - monthlyPlanningCost,
    };
  }, [
    acceptanceRatePercent,
    amortizationMonths,
    embeddingCoveragePercent,
    embeddingPricePerMillion,
    embeddingTokensPerCandidate,
    fixedMonthlyPlatformCost,
    generationInputPrice,
    generationInputTokensPerCandidate,
    generationOutputPrice,
    generationOutputTokensPerCandidate,
    humanReviewPercent,
    manualCostPerAcceptedRecord,
    minutesPerHumanReview,
    monthlyBudget,
    oneTimeImplementationCost,
    retryOverheadPercent,
    reviewerHourlyRate,
    targetAcceptedRecords,
    validationCoveragePercent,
    validatorInputPrice,
    validatorInputTokensPerCandidate,
    validatorOutputPrice,
    validatorOutputTokensPerCandidate,
  ]);

  const reset = () => {
    setTargetAcceptedRecords("50000");
    setAcceptanceRatePercent("80");
    setRetryOverheadPercent("5");
    setGenerationInputTokensPerCandidate("450");
    setGenerationOutputTokensPerCandidate("300");
    setGenerationInputPrice("");
    setGenerationOutputPrice("");
    setValidationCoveragePercent("100");
    setValidatorInputTokensPerCandidate("500");
    setValidatorOutputTokensPerCandidate("80");
    setValidatorInputPrice("");
    setValidatorOutputPrice("");
    setEmbeddingCoveragePercent("100");
    setEmbeddingTokensPerCandidate("300");
    setEmbeddingPricePerMillion("");
    setHumanReviewPercent("10");
    setMinutesPerHumanReview("1.5");
    setReviewerHourlyRate("");
    setFixedMonthlyPlatformCost("");
    setOneTimeImplementationCost("");
    setAmortizationMonths("12");
    setManualCostPerAcceptedRecord("");
    setMonthlyBudget("");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Synthetic Data Plan
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Model candidate generation, validation, deduplication, review, and setup.
          </p>
        </div>

        <FieldSection title="Dataset Target and Quality">
          <BeeijaNumberField
            label="Accepted records needed per month"
            value={targetAcceptedRecords}
            onChange={setTargetAcceptedRecords}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Candidate acceptance rate"
            value={acceptanceRatePercent}
            onChange={setAcceptanceRatePercent}
            min="0.1"
            max="100"
            step="0.1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Retry and failed-call overhead"
            value={retryOverheadPercent}
            onChange={setRetryOverheadPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Generation Model">
          <BeeijaNumberField
            label="Generation input tokens per candidate"
            value={generationInputTokensPerCandidate}
            onChange={setGenerationInputTokensPerCandidate}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Generation output tokens per candidate"
            value={generationOutputTokensPerCandidate}
            onChange={setGenerationOutputTokensPerCandidate}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Generation input price per 1M tokens"
            value={generationInputPrice}
            onChange={setGenerationInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Generation output price per 1M tokens"
            value={generationOutputPrice}
            onChange={setGenerationOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Automated Validation">
          <BeeijaNumberField
            label="Candidates checked by validator model"
            value={validationCoveragePercent}
            onChange={setValidationCoveragePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Validator input tokens per candidate"
            value={validatorInputTokensPerCandidate}
            onChange={setValidatorInputTokensPerCandidate}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Validator output tokens per candidate"
            value={validatorOutputTokensPerCandidate}
            onChange={setValidatorOutputTokensPerCandidate}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Validator input price per 1M tokens"
            value={validatorInputPrice}
            onChange={setValidatorInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Validator output price per 1M tokens"
            value={validatorOutputPrice}
            onChange={setValidatorOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Deduplication and Human Review">
          <BeeijaNumberField
            label="Candidates checked with embeddings"
            value={embeddingCoveragePercent}
            onChange={setEmbeddingCoveragePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Embedding tokens per candidate"
            value={embeddingTokensPerCandidate}
            onChange={setEmbeddingTokensPerCandidate}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Embedding price per 1M tokens"
            value={embeddingPricePerMillion}
            onChange={setEmbeddingPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Candidates reviewed by humans"
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
            label="Reviewer hourly rate"
            value={reviewerHourlyRate}
            onChange={setReviewerHourlyRate}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Platform, Setup, Baseline, and Budget">
          <BeeijaNumberField
            label="Fixed synthetic-data platform cost per month"
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

          <BeeijaNumberField
            label="Manual cost per accepted record"
            value={manualCostPerAcceptedRecord}
            onChange={setManualCostPerAcceptedRecord}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Target monthly synthetic-data budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated monthly dataset flow
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              Required candidate records:{" "}
              {formatVisibleInteger(result.requiredCandidates)}
            </p>

            <p>
              Generation attempts after retries:{" "}
              {formatVisibleInteger(result.generationAttempts)}
            </p>

            <p>
              Accepted records: {formatVisibleInteger(result.acceptedTarget)}
            </p>

            <p>
              Rejected candidates:{" "}
              {formatVisibleInteger(result.rejectedCandidates)}
            </p>

            <p>
              Validator checks:{" "}
              {formatVisibleInteger(result.validationCandidates)}
            </p>

            <p>
              Embedding checks:{" "}
              {formatVisibleInteger(result.embeddedCandidates)}
            </p>

            <p>
              Human-reviewed candidates:{" "}
              {formatVisibleInteger(result.reviewedCandidates)}
            </p>

            <p>
              Human-review hours:{" "}
              {formatVisibleNumber(result.humanReviewHours)}
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
        title="Synthetic Data Cost and Savings"
        description="The result separates generation, validation, deduplication, human review, fixed platform, and amortised setup costs."
        primaryLabel="Monthly synthetic-data planning cost"
        primaryValue={
          result.hasAnyPrice
            ? formatVisibleMoney(result.monthlyPlanningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per candidate"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.costPerCandidate)
                  : "—"
              }
            />

            <ResultStat
              label="Per accepted record"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.costPerAcceptedRecord)
                  : "—"
              }
            />

            <ResultStat
              label="First-year automation"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.firstYearAutomationCost)
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
          <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
            <p>
              Monthly operating cost:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyPrice
                  ? formatVisibleMoney(result.monthlyOperatingCost)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Manual-only monthly baseline:{" "}
              <span className="font-medium text-gray-900">
                {result.hasManualBaseline
                  ? formatVisibleMoney(result.manualOnlyCost)
                  : "Enter the manual record cost"}
              </span>
            </p>

            <ComparisonLine
              label="Monthly operating comparison"
              ready={result.hasManualBaseline}
              value={result.operatingSavings}
            />

            <ComparisonLine
              label="Monthly planning comparison"
              ready={result.hasManualBaseline}
              value={result.planningSavings}
            />

            <ComparisonLine
              label="First-year comparison"
              ready={result.hasManualBaseline}
              value={result.firstYearSavings}
            />

            <p className="mt-2">
              Approximate break-even volume:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasManualBaseline
                  ? "Enter the manual record cost"
                  : result.breakEvenAcceptedRecords === null
                    ? "No positive saving per accepted record"
                    : `${formatVisibleInteger(
                        result.breakEvenAcceptedRecords,
                      )} accepted records per month`}
              </span>
            </p>

            <p className="mt-2">
              Implementation payback:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasManualBaseline
                  ? "Enter the manual record cost"
                  : toNumber(oneTimeImplementationCost) === 0
                    ? "No implementation cost entered"
                    : result.implementationPaybackMonths === null
                      ? "No positive operating payback"
                      : `${formatVisibleNumber(
                          result.implementationPaybackMonths,
                        )} months`}
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
                      ? `${formatVisibleMoney(result.budgetDifference)} remaining`
                      : `${formatVisibleMoney(
                          Math.abs(result.budgetDifference),
                        )} over budget`}
              </span>
            </p>
          </div>
        }
        noticeText="This calculator stores no generation-model, validator-model, embedding, labour, or platform price. Enter the current effective rates for the exact services being considered. Blank optional price fields are treated as zero. Dataset quality, bias, privacy review, storage, training cost, taxes, and the downstream value of accepted records can change the final result."
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
      <div className="mt-5 grid min-w-0 gap-5 md:grid-cols-2 md:items-end [&>*]:min-w-0">{children}</div>
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
    <div className="min-w-0">
      <p className="break-words text-xs font-medium uppercase tracking-wide text-gray-500 [overflow-wrap:anywhere]">
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
}: {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="min-w-0 flex-1">
        <p className="break-words font-medium text-gray-900 [overflow-wrap:anywhere]">
          {label}
        </p>
        <p className="mt-1 break-words text-sm text-gray-500 [overflow-wrap:anywhere]">
          {detail}
        </p>
      </div>
      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {entered ? formatVisibleMoney(value) : "—"}
      </p>
    </div>
  );
}

function ComparisonLine({
  label,
  ready,
  value,
}: {
  label: string;
  ready: boolean;
  value: number;
}) {
  return (
    <p className="mt-2">
      {label}:{" "}
      <span
        className={`font-semibold ${
          !ready || value >= 0
            ? "text-[var(--green)]"
            : "text-red-700"
        }`}
      >
        {!ready
          ? "Enter the manual record cost"
          : value >= 0
            ? `${formatVisibleMoney(value)} estimated saving`
            : `${formatVisibleMoney(Math.abs(value))} additional cost`}
      </span>
    </p>
  );
}

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
  const [monthlyDocuments, setMonthlyDocuments] = useState("10000");
  const [pagesPerDocument, setPagesPerDocument] = useState("3");
  const [imageHeavyPagePercent, setImageHeavyPagePercent] =
    useState("25");
  const [retryOverheadPercent, setRetryOverheadPercent] =
    useState("5");
  const [successfulCompletionRate, setSuccessfulCompletionRate] =
    useState("96");

  const [ocrPricePerThousandPages, setOcrPricePerThousandPages] =
    useState("");
  const [visionPricePerThousandImages, setVisionPricePerThousandImages] =
    useState("");

  const [llmValidationPercent, setLlmValidationPercent] =
    useState("40");
  const [llmInputTokensPerDocument, setLlmInputTokensPerDocument] =
    useState("1800");
  const [llmOutputTokensPerDocument, setLlmOutputTokensPerDocument] =
    useState("250");
  const [llmInputPricePerMillion, setLlmInputPricePerMillion] =
    useState("");
  const [llmOutputPricePerMillion, setLlmOutputPricePerMillion] =
    useState("");

  const [humanReviewPercent, setHumanReviewPercent] = useState("12");
  const [minutesPerHumanReview, setMinutesPerHumanReview] =
    useState("4");
  const [humanHourlyRate, setHumanHourlyRate] = useState("");

  const [fixedMonthlyPlatformCost, setFixedMonthlyPlatformCost] =
    useState("");
  const [oneTimeImplementationCost, setOneTimeImplementationCost] =
    useState("");
  const [amortizationMonths, setAmortizationMonths] = useState("12");

  const [manualMinutesPerDocument, setManualMinutesPerDocument] =
    useState("8");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const documents = toNumber(monthlyDocuments);
    const pages = Math.max(1, toNumber(pagesPerDocument));
    const retryMultiplier =
      1 + clampPercent(retryOverheadPercent) / 100;
    const completionRate =
      clampPercent(successfulCompletionRate) / 100;

    const basePages = documents * pages;
    const processedPages = basePages * retryMultiplier;
    const imageHeavyPages =
      processedPages *
      (clampPercent(imageHeavyPagePercent) / 100);

    const successfulDocuments = documents * completionRate;
    const failedDocuments = documents - successfulDocuments;

    const ocrCost =
      (processedPages / 1000) *
      toNumber(ocrPricePerThousandPages);

    const visionCost =
      (imageHeavyPages / 1000) *
      toNumber(visionPricePerThousandImages);

    const llmShare = clampPercent(llmValidationPercent) / 100;
    const llmDocuments =
      documents * llmShare * retryMultiplier;

    const llmInputTokens =
      llmDocuments * toNumber(llmInputTokensPerDocument);
    const llmOutputTokens =
      llmDocuments * toNumber(llmOutputTokensPerDocument);

    const llmInputCost =
      (llmInputTokens / 1_000_000) *
      toNumber(llmInputPricePerMillion);
    const llmOutputCost =
      (llmOutputTokens / 1_000_000) *
      toNumber(llmOutputPricePerMillion);

    const reviewShare = clampPercent(humanReviewPercent) / 100;
    const reviewedDocuments = documents * reviewShare;
    const humanReviewHours =
      (reviewedDocuments * toNumber(minutesPerHumanReview)) / 60;
    const humanReviewCost =
      humanReviewHours * toNumber(humanHourlyRate);

    const fixedMonthlyCost = toNumber(fixedMonthlyPlatformCost);
    const implementationCost = toNumber(oneTimeImplementationCost);
    const months = Math.max(1, toNumber(amortizationMonths));
    const amortizedImplementationCost =
      implementationCost / months;

    const monthlyOperatingCost =
      ocrCost +
      visionCost +
      llmInputCost +
      llmOutputCost +
      humanReviewCost +
      fixedMonthlyCost;

    const monthlyPlanningCost =
      monthlyOperatingCost + amortizedImplementationCost;

    const manualHours =
      (documents * toNumber(manualMinutesPerDocument)) / 60;
    const manualOnlyCost =
      manualHours * toNumber(humanHourlyRate);

    const operatingSavings =
      manualOnlyCost - monthlyOperatingCost;
    const planningSavings =
      manualOnlyCost - monthlyPlanningCost;

    const firstYearAutomationCost =
      implementationCost + monthlyOperatingCost * 12;
    const firstYearManualCost = manualOnlyCost * 12;
    const firstYearSavings =
      firstYearManualCost - firstYearAutomationCost;

    const costPerDocument =
      documents > 0 ? monthlyPlanningCost / documents : 0;
    const costPerPage =
      basePages > 0 ? monthlyPlanningCost / basePages : 0;
    const costPerSuccessfulDocument =
      successfulDocuments > 0
        ? monthlyPlanningCost / successfulDocuments
        : 0;

    const manualCostPerDocument =
      documents > 0 ? manualOnlyCost / documents : 0;

    const variableAutomationCost =
      ocrCost +
      visionCost +
      llmInputCost +
      llmOutputCost +
      humanReviewCost;

    const variableAutomationCostPerDocument =
      documents > 0 ? variableAutomationCost / documents : 0;

    const recurringFixedAndAmortized =
      fixedMonthlyCost + amortizedImplementationCost;

    const savingPerDocumentBeforeFixed =
      manualCostPerDocument -
      variableAutomationCostPerDocument;

    const breakEvenMonthlyDocuments =
      savingPerDocumentBeforeFixed > 0
        ? recurringFixedAndAmortized /
          savingPerDocumentBeforeFixed
        : null;

    const implementationPaybackMonths =
      implementationCost > 0 && operatingSavings > 0
        ? implementationCost / operatingSavings
        : null;

    const rows: CostRow[] = [
      {
        label: "OCR and document extraction",
        detail: `${formatInteger(
          processedPages,
        )} processed pages including retry overhead`,
        value: ocrCost,
        entered: ocrPricePerThousandPages.trim() !== "",
      },
      {
        label: "Vision or image processing",
        detail: `${formatInteger(
          imageHeavyPages,
        )} image-heavy pages`,
        value: visionCost,
        entered: visionPricePerThousandImages.trim() !== "",
      },
      {
        label: "LLM validation input",
        detail: `${formatInteger(
          llmInputTokens,
        )} input tokens across ${formatInteger(
          llmDocuments,
        )} document validations`,
        value: llmInputCost,
        entered: llmInputPricePerMillion.trim() !== "",
      },
      {
        label: "LLM validation output",
        detail: `${formatInteger(llmOutputTokens)} output tokens`,
        value: llmOutputCost,
        entered: llmOutputPricePerMillion.trim() !== "",
      },
      {
        label: "Human review",
        detail: `${formatInteger(
          reviewedDocuments,
        )} reviewed documents · ${formatNumber(
          humanReviewHours,
        )} hours`,
        value: humanReviewCost,
        entered: humanHourlyRate.trim() !== "",
      },
      {
        label: "Fixed monthly platform cost",
        detail: "Workflow, monitoring, storage, database, or platform fee",
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
      ocrPricePerThousandPages,
      visionPricePerThousandImages,
      llmInputPricePerMillion,
      llmOutputPricePerMillion,
      humanHourlyRate,
      fixedMonthlyPlatformCost,
      oneTimeImplementationCost,
    ].filter((value) => value.trim() !== "").length;

    const hasAnyPrice = enteredPriceCount > 0;
    const hasHumanRate = humanHourlyRate.trim() !== "";
    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      documents,
      pages,
      basePages,
      processedPages,
      imageHeavyPages,
      successfulDocuments,
      failedDocuments,
      llmDocuments,
      llmInputTokens,
      llmOutputTokens,
      reviewedDocuments,
      humanReviewHours,
      ocrCost,
      visionCost,
      llmInputCost,
      llmOutputCost,
      humanReviewCost,
      fixedMonthlyCost,
      implementationCost,
      amortizedImplementationCost,
      monthlyOperatingCost,
      monthlyPlanningCost,
      manualHours,
      manualOnlyCost,
      operatingSavings,
      planningSavings,
      firstYearAutomationCost,
      firstYearManualCost,
      firstYearSavings,
      costPerDocument,
      costPerPage,
      costPerSuccessfulDocument,
      manualCostPerDocument,
      breakEvenMonthlyDocuments,
      implementationPaybackMonths,
      rows,
      enteredPriceCount,
      hasAnyPrice,
      hasHumanRate,
      hasBudget,
      budget,
      budgetDifference: budget - monthlyPlanningCost,
    };
  }, [
    amortizationMonths,
    fixedMonthlyPlatformCost,
    humanHourlyRate,
    humanReviewPercent,
    imageHeavyPagePercent,
    llmInputPricePerMillion,
    llmInputTokensPerDocument,
    llmOutputPricePerMillion,
    llmOutputTokensPerDocument,
    llmValidationPercent,
    manualMinutesPerDocument,
    minutesPerHumanReview,
    monthlyBudget,
    monthlyDocuments,
    ocrPricePerThousandPages,
    oneTimeImplementationCost,
    pagesPerDocument,
    retryOverheadPercent,
    successfulCompletionRate,
    visionPricePerThousandImages,
  ]);

  const reset = () => {
    setMonthlyDocuments("10000");
    setPagesPerDocument("3");
    setImageHeavyPagePercent("25");
    setRetryOverheadPercent("5");
    setSuccessfulCompletionRate("96");
    setOcrPricePerThousandPages("");
    setVisionPricePerThousandImages("");
    setLlmValidationPercent("40");
    setLlmInputTokensPerDocument("1800");
    setLlmOutputTokensPerDocument("250");
    setLlmInputPricePerMillion("");
    setLlmOutputPricePerMillion("");
    setHumanReviewPercent("12");
    setMinutesPerHumanReview("4");
    setHumanHourlyRate("");
    setFixedMonthlyPlatformCost("");
    setOneTimeImplementationCost("");
    setAmortizationMonths("12");
    setManualMinutesPerDocument("8");
    setMonthlyBudget("");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Document Processing Plan
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Model OCR, vision, LLM validation, human review, and implementation
            in one estimate.
          </p>
        </div>

        <FieldSection title="Monthly Document Workload">
          <BeeijaNumberField
            label="Documents per month"
            value={monthlyDocuments}
            onChange={setMonthlyDocuments}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average pages per document"
            value={pagesPerDocument}
            onChange={setPagesPerDocument}
            min="1"
            step="0.1"
          />

          <BeeijaNumberField
            label="Pages needing image or vision processing"
            value={imageHeavyPagePercent}
            onChange={setImageHeavyPagePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Retry and resubmission overhead"
            value={retryOverheadPercent}
            onChange={setRetryOverheadPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Successful document completion rate"
            value={successfulCompletionRate}
            onChange={setSuccessfulCompletionRate}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="OCR, Extraction, and Vision Prices">
          <BeeijaNumberField
            label="OCR or extraction price per 1,000 pages"
            value={ocrPricePerThousandPages}
            onChange={setOcrPricePerThousandPages}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Vision processing price per 1,000 images"
            value={visionPricePerThousandImages}
            onChange={setVisionPricePerThousandImages}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="LLM Validation or Structured Output">
          <BeeijaNumberField
            label="Documents sent to the LLM"
            value={llmValidationPercent}
            onChange={setLlmValidationPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="LLM input tokens per validated document"
            value={llmInputTokensPerDocument}
            onChange={setLlmInputTokensPerDocument}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="LLM output tokens per validated document"
            value={llmOutputTokensPerDocument}
            onChange={setLlmOutputTokensPerDocument}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="LLM input price per 1M tokens"
            value={llmInputPricePerMillion}
            onChange={setLlmInputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="LLM output price per 1M tokens"
            value={llmOutputPricePerMillion}
            onChange={setLlmOutputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Human Review, Platform, and Setup">
          <BeeijaNumberField
            label="Documents needing human review"
            value={humanReviewPercent}
            onChange={setHumanReviewPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Minutes per reviewed document"
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
            label="Manual minutes per document"
            value={manualMinutesPerDocument}
            onChange={setManualMinutesPerDocument}
            min="0"
            step="0.1"
            suffix="min"
          />

          <BeeijaNumberField
            label="Target monthly automation budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated monthly processing workload
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              Base pages: {formatVisibleInteger(result.basePages)}
            </p>

            <p>
              Processed pages after retries:{" "}
              {formatVisibleInteger(result.processedPages)}
            </p>

            <p>
              Image-heavy pages:{" "}
              {formatVisibleInteger(result.imageHeavyPages)}
            </p>

            <p>
              LLM-validated documents:{" "}
              {formatVisibleInteger(result.llmDocuments)}
            </p>

            <p>
              Human-reviewed documents:{" "}
              {formatVisibleInteger(result.reviewedDocuments)}
            </p>

            <p>
              Successful documents:{" "}
              {formatVisibleInteger(result.successfulDocuments)}
            </p>

            <p>
              Failed or incomplete documents:{" "}
              {formatVisibleInteger(result.failedDocuments)}
            </p>

            <p>
              Manual-only labour hours:{" "}
              {formatVisibleNumber(result.manualHours)}
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
        title="Document Processing Cost and Savings"
        description="The result separates variable processing, human review, fixed platform cost, and amortised implementation."
        primaryLabel="Monthly automation planning cost"
        primaryValue={
          result.hasAnyPrice
            ? formatVisibleMoney(result.monthlyPlanningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per document"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.costPerDocument)
                  : "—"
              }
            />

            <ResultStat
              label="Per page"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.costPerPage)
                  : "—"
              }
            />

            <ResultStat
              label="Per successful document"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.costPerSuccessfulDocument)
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
                {result.hasHumanRate
                  ? formatVisibleMoney(result.manualOnlyCost)
                  : "Enter the hourly labour rate"}
              </span>
            </p>

            <p className="mt-2">
              Monthly operating comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasHumanRate ||
                  result.operatingSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasHumanRate
                  ? "Enter the hourly labour rate"
                  : result.operatingSavings >= 0
                    ? `${formatVisibleMoney(
                        result.operatingSavings,
                      )} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.operatingSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              Monthly planning comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasHumanRate ||
                  result.planningSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasHumanRate
                  ? "Enter the hourly labour rate"
                  : result.planningSavings >= 0
                    ? `${formatVisibleMoney(
                        result.planningSavings,
                      )} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.planningSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              First-year automation cost:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyPrice
                  ? formatVisibleMoney(result.firstYearAutomationCost)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              First-year comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasHumanRate ||
                  result.firstYearSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasHumanRate
                  ? "Enter the hourly labour rate"
                  : result.firstYearSavings >= 0
                    ? `${formatVisibleMoney(
                        result.firstYearSavings,
                      )} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.firstYearSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              Approximate break-even volume:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasHumanRate
                  ? "Enter the hourly labour rate"
                  : result.breakEvenMonthlyDocuments === null
                    ? "No positive saving per document"
                    : `${formatVisibleInteger(
                        result.breakEvenMonthlyDocuments,
                      )} documents per month`}
              </span>
            </p>

            <p className="mt-2">
              Implementation payback:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasHumanRate
                  ? "Enter the hourly labour rate"
                  : result.implementationCost === 0
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
                {result.enteredPriceCount} of 7
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
        noticeText="This calculator stores no OCR, document AI, vision, model, labour, or platform price. Enter the current effective rates for the exact services and region being considered. Blank optional price fields are treated as zero. Page definitions, scan quality, handwriting, tables, retries, taxes, storage, data transfer, and provider minimum charges can change the final cost."
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

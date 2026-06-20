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
  const [monthlyMeetings, setMonthlyMeetings] = useState("500");
  const [averageMeetingMinutes, setAverageMeetingMinutes] =
    useState("45");
  const [averageParticipants, setAverageParticipants] = useState("6");
  const [successfulCompletionRate, setSuccessfulCompletionRate] =
    useState("98");
  const [retryOverheadPercent, setRetryOverheadPercent] =
    useState("3");

  const [transcriptionPricePerMinute, setTranscriptionPricePerMinute] =
    useState("");
  const [diarizationPricePerMinute, setDiarizationPricePerMinute] =
    useState("");

  const [summaryCoveragePercent, setSummaryCoveragePercent] =
    useState("100");
  const [summaryInputTokensPerMeeting, setSummaryInputTokensPerMeeting] =
    useState("12000");
  const [summaryOutputTokensPerMeeting, setSummaryOutputTokensPerMeeting] =
    useState("700");

  const [actionItemCoveragePercent, setActionItemCoveragePercent] =
    useState("80");
  const [actionInputTokensPerMeeting, setActionInputTokensPerMeeting] =
    useState("12000");
  const [actionOutputTokensPerMeeting, setActionOutputTokensPerMeeting] =
    useState("250");

  const [modelInputPricePerMillion, setModelInputPricePerMillion] =
    useState("");
  const [modelOutputPricePerMillion, setModelOutputPricePerMillion] =
    useState("");

  const [storageGbPerMeeting, setStorageGbPerMeeting] = useState("0.05");
  const [retentionMonths, setRetentionMonths] = useState("12");
  const [storagePricePerGbMonth, setStoragePricePerGbMonth] =
    useState("");

  const [integrationCallsPerMeeting, setIntegrationCallsPerMeeting] =
    useState("3");
  const [integrationPricePerThousandCalls, setIntegrationPricePerThousandCalls] =
    useState("");

  const [humanReviewPercent, setHumanReviewPercent] = useState("10");
  const [minutesPerHumanReview, setMinutesPerHumanReview] =
    useState("5");
  const [reviewerHourlyRate, setReviewerHourlyRate] = useState("");

  const [fixedMonthlyPlatformCost, setFixedMonthlyPlatformCost] =
    useState("");
  const [oneTimeImplementationCost, setOneTimeImplementationCost] =
    useState("");
  const [amortizationMonths, setAmortizationMonths] = useState("12");

  const [manualNoteMinutesPerMeeting, setManualNoteMinutesPerMeeting] =
    useState("15");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const meetings = toNumber(monthlyMeetings);
    const meetingMinutes = toNumber(averageMeetingMinutes);
    const participants = Math.max(1, toNumber(averageParticipants));
    const completionRate =
      clampPercent(successfulCompletionRate) / 100;
    const retryMultiplier =
      1 + clampPercent(retryOverheadPercent) / 100;

    const baseAudioMinutes = meetings * meetingMinutes;
    const processedAudioMinutes = baseAudioMinutes * retryMultiplier;
    const meetingHours = baseAudioMinutes / 60;
    const participantHours = meetingHours * participants;
    const successfulMeetings = meetings * completionRate;
    const incompleteMeetings = meetings - successfulMeetings;

    const transcriptionCost =
      processedAudioMinutes * toNumber(transcriptionPricePerMinute);

    const diarizationCost =
      processedAudioMinutes * toNumber(diarizationPricePerMinute);

    const summaryMeetings =
      meetings *
      (clampPercent(summaryCoveragePercent) / 100) *
      retryMultiplier;

    const summaryInputTokens =
      summaryMeetings * toNumber(summaryInputTokensPerMeeting);
    const summaryOutputTokens =
      summaryMeetings * toNumber(summaryOutputTokensPerMeeting);

    const actionMeetings =
      meetings *
      (clampPercent(actionItemCoveragePercent) / 100) *
      retryMultiplier;

    const actionInputTokens =
      actionMeetings * toNumber(actionInputTokensPerMeeting);
    const actionOutputTokens =
      actionMeetings * toNumber(actionOutputTokensPerMeeting);

    const totalModelInputTokens =
      summaryInputTokens + actionInputTokens;
    const totalModelOutputTokens =
      summaryOutputTokens + actionOutputTokens;

    const modelInputCost =
      (totalModelInputTokens / 1_000_000) *
      toNumber(modelInputPricePerMillion);

    const modelOutputCost =
      (totalModelOutputTokens / 1_000_000) *
      toNumber(modelOutputPricePerMillion);

    const retainedMonths = Math.max(1, toNumber(retentionMonths));
    const storedGb =
      meetings * toNumber(storageGbPerMeeting) * retainedMonths;

    const storageCost =
      storedGb * toNumber(storagePricePerGbMonth);

    const integrationCalls =
      meetings * toNumber(integrationCallsPerMeeting);

    const integrationCost =
      (integrationCalls / 1000) *
      toNumber(integrationPricePerThousandCalls);

    const reviewedMeetings =
      meetings * (clampPercent(humanReviewPercent) / 100);

    const humanReviewHours =
      (reviewedMeetings * toNumber(minutesPerHumanReview)) / 60;

    const humanReviewCost =
      humanReviewHours * toNumber(reviewerHourlyRate);

    const fixedMonthlyCost = toNumber(fixedMonthlyPlatformCost);
    const implementationCost = toNumber(oneTimeImplementationCost);
    const months = Math.max(1, toNumber(amortizationMonths));
    const amortizedImplementationCost = implementationCost / months;

    const monthlyOperatingCost =
      transcriptionCost +
      diarizationCost +
      modelInputCost +
      modelOutputCost +
      storageCost +
      integrationCost +
      humanReviewCost +
      fixedMonthlyCost;

    const monthlyPlanningCost =
      monthlyOperatingCost + amortizedImplementationCost;

    const manualNoteHours =
      (meetings * toNumber(manualNoteMinutesPerMeeting)) / 60;

    const manualOnlyCost =
      manualNoteHours * toNumber(reviewerHourlyRate);

    const operatingSavings =
      manualOnlyCost - monthlyOperatingCost;

    const planningSavings =
      manualOnlyCost - monthlyPlanningCost;

    const firstYearAutomationCost =
      monthlyOperatingCost * 12 + implementationCost;

    const firstYearManualCost = manualOnlyCost * 12;

    const firstYearSavings =
      firstYearManualCost - firstYearAutomationCost;

    const costPerMeeting =
      meetings > 0 ? monthlyPlanningCost / meetings : 0;

    const costPerMeetingHour =
      meetingHours > 0 ? monthlyPlanningCost / meetingHours : 0;

    const costPerParticipantHour =
      participantHours > 0
        ? monthlyPlanningCost / participantHours
        : 0;

    const costPerSuccessfulMeeting =
      successfulMeetings > 0
        ? monthlyPlanningCost / successfulMeetings
        : 0;

    const manualCostPerMeeting =
      meetings > 0 ? manualOnlyCost / meetings : 0;

    const variableAutomationCost =
      transcriptionCost +
      diarizationCost +
      modelInputCost +
      modelOutputCost +
      storageCost +
      integrationCost +
      humanReviewCost;

    const variableAutomationCostPerMeeting =
      meetings > 0 ? variableAutomationCost / meetings : 0;

    const savingPerMeetingBeforeFixed =
      manualCostPerMeeting - variableAutomationCostPerMeeting;

    const recurringFixedAndAmortized =
      fixedMonthlyCost + amortizedImplementationCost;

    const breakEvenMonthlyMeetings =
      savingPerMeetingBeforeFixed > 0
        ? recurringFixedAndAmortized /
          savingPerMeetingBeforeFixed
        : null;

    const implementationPaybackMonths =
      implementationCost > 0 && operatingSavings > 0
        ? implementationCost / operatingSavings
        : null;

    const rows: CostRow[] = [
      {
        label: "Audio transcription",
        detail: `${formatInteger(
          processedAudioMinutes,
        )} processed audio minutes including retry overhead`,
        value: transcriptionCost,
        entered: transcriptionPricePerMinute.trim() !== "",
      },
      {
        label: "Speaker diarization",
        detail: `${formatInteger(
          processedAudioMinutes,
        )} speaker-labelled audio minutes`,
        value: diarizationCost,
        entered: diarizationPricePerMinute.trim() !== "",
      },
      {
        label: "Summary and action-item model input",
        detail: `${formatInteger(
          totalModelInputTokens,
        )} model input tokens`,
        value: modelInputCost,
        entered: modelInputPricePerMillion.trim() !== "",
      },
      {
        label: "Summary and action-item model output",
        detail: `${formatInteger(
          totalModelOutputTokens,
        )} model output tokens`,
        value: modelOutputCost,
        entered: modelOutputPricePerMillion.trim() !== "",
      },
      {
        label: "Meeting record storage",
        detail: `${formatNumber(
          storedGb,
        )} GB-months at steady-state retention`,
        value: storageCost,
        entered: storagePricePerGbMonth.trim() !== "",
      },
      {
        label: "Calendar and workflow integrations",
        detail: `${formatInteger(integrationCalls)} integration calls`,
        value: integrationCost,
        entered: integrationPricePerThousandCalls.trim() !== "",
      },
      {
        label: "Human review",
        detail: `${formatInteger(
          reviewedMeetings,
        )} reviewed meetings · ${formatNumber(
          humanReviewHours,
        )} hours`,
        value: humanReviewCost,
        entered: reviewerHourlyRate.trim() !== "",
      },
      {
        label: "Fixed monthly platform cost",
        detail: "Meeting platform, analytics, monitoring, or administration",
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
      transcriptionPricePerMinute,
      diarizationPricePerMinute,
      modelInputPricePerMillion,
      modelOutputPricePerMillion,
      storagePricePerGbMonth,
      integrationPricePerThousandCalls,
      reviewerHourlyRate,
      fixedMonthlyPlatformCost,
      oneTimeImplementationCost,
    ].filter((value) => value.trim() !== "").length;

    const hasAnyPrice = enteredPriceCount > 0;
    const hasLabourRate = reviewerHourlyRate.trim() !== "";
    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      meetings,
      baseAudioMinutes,
      processedAudioMinutes,
      meetingHours,
      participantHours,
      successfulMeetings,
      incompleteMeetings,
      summaryMeetings,
      actionMeetings,
      summaryInputTokens,
      summaryOutputTokens,
      actionInputTokens,
      actionOutputTokens,
      totalModelInputTokens,
      totalModelOutputTokens,
      storedGb,
      integrationCalls,
      reviewedMeetings,
      humanReviewHours,
      manualNoteHours,
      monthlyOperatingCost,
      monthlyPlanningCost,
      manualOnlyCost,
      operatingSavings,
      planningSavings,
      firstYearAutomationCost,
      firstYearManualCost,
      firstYearSavings,
      costPerMeeting,
      costPerMeetingHour,
      costPerParticipantHour,
      costPerSuccessfulMeeting,
      breakEvenMonthlyMeetings,
      implementationPaybackMonths,
      rows,
      enteredPriceCount,
      hasAnyPrice,
      hasLabourRate,
      hasBudget,
      budget,
      budgetDifference: budget - monthlyPlanningCost,
    };
  }, [
    actionInputTokensPerMeeting,
    actionItemCoveragePercent,
    actionOutputTokensPerMeeting,
    amortizationMonths,
    averageMeetingMinutes,
    averageParticipants,
    diarizationPricePerMinute,
    fixedMonthlyPlatformCost,
    humanReviewPercent,
    integrationCallsPerMeeting,
    integrationPricePerThousandCalls,
    manualNoteMinutesPerMeeting,
    minutesPerHumanReview,
    modelInputPricePerMillion,
    modelOutputPricePerMillion,
    monthlyBudget,
    monthlyMeetings,
    oneTimeImplementationCost,
    retentionMonths,
    retryOverheadPercent,
    reviewerHourlyRate,
    storageGbPerMeeting,
    storagePricePerGbMonth,
    successfulCompletionRate,
    summaryCoveragePercent,
    summaryInputTokensPerMeeting,
    summaryOutputTokensPerMeeting,
    transcriptionPricePerMinute,
  ]);

  const reset = () => {
    setMonthlyMeetings("500");
    setAverageMeetingMinutes("45");
    setAverageParticipants("6");
    setSuccessfulCompletionRate("98");
    setRetryOverheadPercent("3");
    setTranscriptionPricePerMinute("");
    setDiarizationPricePerMinute("");
    setSummaryCoveragePercent("100");
    setSummaryInputTokensPerMeeting("12000");
    setSummaryOutputTokensPerMeeting("700");
    setActionItemCoveragePercent("80");
    setActionInputTokensPerMeeting("12000");
    setActionOutputTokensPerMeeting("250");
    setModelInputPricePerMillion("");
    setModelOutputPricePerMillion("");
    setStorageGbPerMeeting("0.05");
    setRetentionMonths("12");
    setStoragePricePerGbMonth("");
    setIntegrationCallsPerMeeting("3");
    setIntegrationPricePerThousandCalls("");
    setHumanReviewPercent("10");
    setMinutesPerHumanReview("5");
    setReviewerHourlyRate("");
    setFixedMonthlyPlatformCost("");
    setOneTimeImplementationCost("");
    setAmortizationMonths("12");
    setManualNoteMinutesPerMeeting("15");
    setMonthlyBudget("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Meeting Assistant Plan
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Model transcription, speaker labels, summaries, action items,
            storage, integrations, and review.
          </p>
        </div>

        <FieldSection title="Monthly Meeting Workload">
          <BeeijaNumberField
            label="Meetings per month"
            value={monthlyMeetings}
            onChange={setMonthlyMeetings}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average meeting duration"
            value={averageMeetingMinutes}
            onChange={setAverageMeetingMinutes}
            min="0"
            step="1"
            suffix="min"
          />

          <BeeijaNumberField
            label="Average participants per meeting"
            value={averageParticipants}
            onChange={setAverageParticipants}
            min="1"
            step="1"
          />

          <BeeijaNumberField
            label="Successful processing rate"
            value={successfulCompletionRate}
            onChange={setSuccessfulCompletionRate}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Retry and repeated-processing overhead"
            value={retryOverheadPercent}
            onChange={setRetryOverheadPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Transcription and Speaker Labels">
          <BeeijaNumberField
            label="Transcription price per audio minute"
            value={transcriptionPricePerMinute}
            onChange={setTranscriptionPricePerMinute}
            min="0"
            step="0.0001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Diarization price per audio minute"
            value={diarizationPricePerMinute}
            onChange={setDiarizationPricePerMinute}
            min="0"
            step="0.0001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Meeting Summary">
          <BeeijaNumberField
            label="Meetings receiving a summary"
            value={summaryCoveragePercent}
            onChange={setSummaryCoveragePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Summary input tokens per meeting"
            value={summaryInputTokensPerMeeting}
            onChange={setSummaryInputTokensPerMeeting}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Summary output tokens per meeting"
            value={summaryOutputTokensPerMeeting}
            onChange={setSummaryOutputTokensPerMeeting}
            min="0"
            step="1"
          />
        </FieldSection>

        <FieldSection title="Action Items and Decisions">
          <BeeijaNumberField
            label="Meetings receiving action-item extraction"
            value={actionItemCoveragePercent}
            onChange={setActionItemCoveragePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Action-item input tokens per meeting"
            value={actionInputTokensPerMeeting}
            onChange={setActionInputTokensPerMeeting}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Action-item output tokens per meeting"
            value={actionOutputTokensPerMeeting}
            onChange={setActionOutputTokensPerMeeting}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Language-model input price per 1M tokens"
            value={modelInputPricePerMillion}
            onChange={setModelInputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Language-model output price per 1M tokens"
            value={modelOutputPricePerMillion}
            onChange={setModelOutputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Storage and Integrations">
          <BeeijaNumberField
            label="Stored data per meeting"
            value={storageGbPerMeeting}
            onChange={setStorageGbPerMeeting}
            min="0"
            step="0.001"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Meeting record retention"
            value={retentionMonths}
            onChange={setRetentionMonths}
            min="1"
            step="1"
            suffix="mo"
          />

          <BeeijaNumberField
            label="Storage price per GB-month"
            value={storagePricePerGbMonth}
            onChange={setStoragePricePerGbMonth}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Calendar and workflow calls per meeting"
            value={integrationCallsPerMeeting}
            onChange={setIntegrationCallsPerMeeting}
            min="0"
            step="0.1"
          />

          <BeeijaNumberField
            label="Integration price per 1,000 calls"
            value={integrationPricePerThousandCalls}
            onChange={setIntegrationPricePerThousandCalls}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Human Review, Platform, and Setup">
          <BeeijaNumberField
            label="Meetings reviewed by humans"
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

          <BeeijaNumberField
            label="Fixed meeting-assistant platform cost per month"
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
            label="Manual note and follow-up minutes per meeting"
            value={manualNoteMinutesPerMeeting}
            onChange={setManualNoteMinutesPerMeeting}
            min="0"
            step="0.1"
            suffix="min"
          />

          <BeeijaNumberField
            label="Target monthly meeting-assistant budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated monthly meeting workload
          </p>

          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>
              Base audio minutes: {formatInteger(result.baseAudioMinutes)}
            </p>

            <p>
              Processed audio minutes:{" "}
              {formatInteger(result.processedAudioMinutes)}
            </p>

            <p>
              Meeting hours: {formatNumber(result.meetingHours)}
            </p>

            <p>
              Participant hours: {formatNumber(result.participantHours)}
            </p>

            <p>
              Summary jobs: {formatInteger(result.summaryMeetings)}
            </p>

            <p>
              Action-item jobs: {formatInteger(result.actionMeetings)}
            </p>

            <p>
              Human-reviewed meetings:{" "}
              {formatInteger(result.reviewedMeetings)}
            </p>

            <p>
              Successful meeting records:{" "}
              {formatInteger(result.successfulMeetings)}
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
        title="Meeting Assistant Cost and Savings"
        description="The result separates audio processing, model summaries, action items, storage, integrations, review, fixed platform, and setup costs."
        primaryLabel="Monthly meeting-assistant planning cost"
        primaryValue={
          result.hasAnyPrice
            ? formatMoney(result.monthlyPlanningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per meeting"
              value={
                result.hasAnyPrice
                  ? formatMoney(result.costPerMeeting)
                  : "—"
              }
            />

            <ResultStat
              label="Per participant hour"
              value={
                result.hasAnyPrice
                  ? formatMoney(result.costPerParticipantHour)
                  : "—"
              }
            />

            <ResultStat
              label="Per successful meeting"
              value={
                result.hasAnyPrice
                  ? formatMoney(result.costPerSuccessfulMeeting)
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
              Cost per meeting hour:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyPrice
                  ? formatMoney(result.costPerMeetingHour)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Manual note-taking baseline:{" "}
              <span className="font-medium text-gray-900">
                {result.hasLabourRate
                  ? formatMoney(result.manualOnlyCost)
                  : "Enter the reviewer hourly rate"}
              </span>
            </p>

            <ComparisonLine
              label="Monthly operating comparison"
              ready={result.hasLabourRate}
              value={result.operatingSavings}
            />

            <ComparisonLine
              label="Monthly planning comparison"
              ready={result.hasLabourRate}
              value={result.planningSavings}
            />

            <ComparisonLine
              label="First-year comparison"
              ready={result.hasLabourRate}
              value={result.firstYearSavings}
            />

            <p className="mt-2">
              Approximate break-even volume:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasLabourRate
                  ? "Enter the reviewer hourly rate"
                  : result.breakEvenMonthlyMeetings === null
                    ? "No positive saving per meeting"
                    : `${formatInteger(
                        result.breakEvenMonthlyMeetings,
                      )} meetings per month`}
              </span>
            </p>

            <p className="mt-2">
              Implementation payback:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasLabourRate
                  ? "Enter the reviewer hourly rate"
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
                      ? `${formatMoney(result.budgetDifference)} remaining`
                      : `${formatMoney(
                          Math.abs(result.budgetDifference),
                        )} over budget`}
              </span>
            </p>
          </div>
        }
        noticeText="This calculator stores no transcription, diarization, language-model, storage, integration, labour, or platform price. Enter the current effective rates for the exact services and region being considered. Blank optional price fields are treated as zero. Audio quality, languages, speaker overlap, retention policy, consent requirements, taxes, and the business cost of inaccurate notes can change the final result."
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
          ? "Enter the reviewer hourly rate"
          : value >= 0
            ? `${formatMoney(value)} estimated saving`
            : `${formatMoney(Math.abs(value))} additional cost`}
      </span>
    </p>
  );
}

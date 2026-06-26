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
  const [monthlyConversations, setMonthlyConversations] =
    useState("20000");
  const [aiHandlingPercent, setAiHandlingPercent] = useState("70");
  const [aiResolutionPercent, setAiResolutionPercent] = useState("75");
  const [aiResponsesPerConversation, setAiResponsesPerConversation] =
    useState("4");
  const [retryOverheadPercent, setRetryOverheadPercent] =
    useState("5");

  const [inputTokensPerResponse, setInputTokensPerResponse] =
    useState("1200");
  const [outputTokensPerResponse, setOutputTokensPerResponse] =
    useState("250");
  const [modelInputPricePerMillion, setModelInputPricePerMillion] =
    useState("");
  const [modelOutputPricePerMillion, setModelOutputPricePerMillion] =
    useState("");

  const [retrievalCallsPerConversation, setRetrievalCallsPerConversation] =
    useState("2");
  const [retrievalPricePerThousand, setRetrievalPricePerThousand] =
    useState("");

  const [manualHandleMinutes, setManualHandleMinutes] = useState("10");
  const [escalatedHandleMinutes, setEscalatedHandleMinutes] =
    useState("7");
  const [agentHourlyRate, setAgentHourlyRate] = useState("");

  const [qaReviewPercent, setQaReviewPercent] = useState("8");
  const [qaMinutesPerReview, setQaMinutesPerReview] = useState("3");

  const [fixedMonthlyPlatformCost, setFixedMonthlyPlatformCost] =
    useState("");
  const [oneTimeImplementationCost, setOneTimeImplementationCost] =
    useState("");
  const [amortizationMonths, setAmortizationMonths] = useState("12");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const conversations = toNumber(monthlyConversations);
    const aiShare = clampPercent(aiHandlingPercent) / 100;
    const resolutionRate = clampPercent(aiResolutionPercent) / 100;
    const retryMultiplier =
      1 + clampPercent(retryOverheadPercent) / 100;

    const aiHandled = conversations * aiShare;
    const directHuman = conversations - aiHandled;
    const aiResolved = aiHandled * resolutionRate;
    const escalated = aiHandled - aiResolved;
    const totalHumanHandled = directHuman + escalated;

    const aiResponses =
      aiHandled *
      toNumber(aiResponsesPerConversation) *
      retryMultiplier;

    const inputTokens =
      aiResponses * toNumber(inputTokensPerResponse);
    const outputTokens =
      aiResponses * toNumber(outputTokensPerResponse);

    const modelInputCost =
      (inputTokens / 1_000_000) *
      toNumber(modelInputPricePerMillion);

    const modelOutputCost =
      (outputTokens / 1_000_000) *
      toNumber(modelOutputPricePerMillion);

    const retrievalCalls =
      aiHandled *
      toNumber(retrievalCallsPerConversation) *
      retryMultiplier;

    const retrievalCost =
      (retrievalCalls / 1000) *
      toNumber(retrievalPricePerThousand);

    const directHumanHours =
      (directHuman * toNumber(manualHandleMinutes)) / 60;

    const escalationHours =
      (escalated * toNumber(escalatedHandleMinutes)) / 60;

    const qaReviewed =
      aiResolved * (clampPercent(qaReviewPercent) / 100);

    const qaHours =
      (qaReviewed * toNumber(qaMinutesPerReview)) / 60;

    const hourlyRate = toNumber(agentHourlyRate);
    const directHumanCost = directHumanHours * hourlyRate;
    const escalationCost = escalationHours * hourlyRate;
    const qaCost = qaHours * hourlyRate;

    const fixedMonthlyCost = toNumber(fixedMonthlyPlatformCost);
    const implementationCost = toNumber(oneTimeImplementationCost);
    const months = Math.max(1, toNumber(amortizationMonths));
    const amortizedImplementationCost = implementationCost / months;

    const monthlyOperatingCost =
      modelInputCost +
      modelOutputCost +
      retrievalCost +
      directHumanCost +
      escalationCost +
      qaCost +
      fixedMonthlyCost;

    const monthlyPlanningCost =
      monthlyOperatingCost + amortizedImplementationCost;

    const allHumanHours =
      (conversations * toNumber(manualHandleMinutes)) / 60;

    const allHumanCost = allHumanHours * hourlyRate;

    const operatingSavings = allHumanCost - monthlyOperatingCost;
    const planningSavings = allHumanCost - monthlyPlanningCost;

    const firstYearAutomationCost =
      monthlyOperatingCost * 12 + implementationCost;

    const firstYearHumanCost = allHumanCost * 12;
    const firstYearSavings =
      firstYearHumanCost - firstYearAutomationCost;

    const costPerConversation =
      conversations > 0 ? monthlyPlanningCost / conversations : 0;

    const costPerResolvedConversation =
      conversations > 0
        ? monthlyPlanningCost / conversations
        : 0;

    const effectiveAutomationRate =
      conversations > 0 ? (aiResolved / conversations) * 100 : 0;

    const manualCostPerConversation =
      conversations > 0 ? allHumanCost / conversations : 0;

    const variableAutomationCost =
      modelInputCost +
      modelOutputCost +
      retrievalCost +
      directHumanCost +
      escalationCost +
      qaCost;

    const variableAutomationCostPerConversation =
      conversations > 0
        ? variableAutomationCost / conversations
        : 0;

    const savingPerConversationBeforeFixed =
      manualCostPerConversation -
      variableAutomationCostPerConversation;

    const recurringFixedAndAmortized =
      fixedMonthlyCost + amortizedImplementationCost;

    const breakEvenMonthlyConversations =
      savingPerConversationBeforeFixed > 0
        ? recurringFixedAndAmortized /
          savingPerConversationBeforeFixed
        : null;

    let breakEvenAiHandlingPercent: number | null = null;

    for (let step = 0; step <= 1000; step += 1) {
      const candidateShare = step / 1000;
      const candidateAiHandled = conversations * candidateShare;
      const candidateDirectHuman = conversations - candidateAiHandled;
      const candidateAiResolved = candidateAiHandled * resolutionRate;
      const candidateEscalated =
        candidateAiHandled - candidateAiResolved;

      const candidateResponses =
        candidateAiHandled *
        toNumber(aiResponsesPerConversation) *
        retryMultiplier;

      const candidateInputCost =
        ((candidateResponses * toNumber(inputTokensPerResponse)) /
          1_000_000) *
        toNumber(modelInputPricePerMillion);

      const candidateOutputCost =
        ((candidateResponses * toNumber(outputTokensPerResponse)) /
          1_000_000) *
        toNumber(modelOutputPricePerMillion);

      const candidateRetrievalCost =
        ((candidateAiHandled *
          toNumber(retrievalCallsPerConversation) *
          retryMultiplier) /
          1000) *
        toNumber(retrievalPricePerThousand);

      const candidateHumanCost =
        ((candidateDirectHuman * toNumber(manualHandleMinutes)) / 60) *
          hourlyRate +
        ((candidateEscalated * toNumber(escalatedHandleMinutes)) / 60) *
          hourlyRate +
        ((candidateAiResolved *
          (clampPercent(qaReviewPercent) / 100) *
          toNumber(qaMinutesPerReview)) /
          60) *
          hourlyRate;

      const candidatePlanningCost =
        candidateInputCost +
        candidateOutputCost +
        candidateRetrievalCost +
        candidateHumanCost +
        fixedMonthlyCost +
        amortizedImplementationCost;

      if (candidatePlanningCost <= allHumanCost) {
        breakEvenAiHandlingPercent = candidateShare * 100;
        break;
      }
    }

    const implementationPaybackMonths =
      implementationCost > 0 && operatingSavings > 0
        ? implementationCost / operatingSavings
        : null;

    const rows: CostRow[] = [
      {
        label: "Model input",
        detail: `${formatInteger(inputTokens)} monthly input tokens`,
        value: modelInputCost,
        entered: modelInputPricePerMillion.trim() !== "",
      },
      {
        label: "Model output",
        detail: `${formatInteger(outputTokens)} monthly output tokens`,
        value: modelOutputCost,
        entered: modelOutputPricePerMillion.trim() !== "",
      },
      {
        label: "Knowledge retrieval",
        detail: `${formatInteger(retrievalCalls)} retrieval calls`,
        value: retrievalCost,
        entered: retrievalPricePerThousand.trim() !== "",
      },
      {
        label: "Direct human support",
        detail: `${formatInteger(
          directHuman,
        )} conversations · ${formatNumber(directHumanHours)} hours`,
        value: directHumanCost,
        entered: agentHourlyRate.trim() !== "",
      },
      {
        label: "Escalated AI conversations",
        detail: `${formatInteger(
          escalated,
        )} handoffs · ${formatNumber(escalationHours)} hours`,
        value: escalationCost,
        entered: agentHourlyRate.trim() !== "",
      },
      {
        label: "QA review",
        detail: `${formatInteger(
          qaReviewed,
        )} reviews · ${formatNumber(qaHours)} hours`,
        value: qaCost,
        entered: agentHourlyRate.trim() !== "",
      },
      {
        label: "Fixed monthly platform cost",
        detail: "Helpdesk, orchestration, analytics, monitoring, or platform",
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
      modelInputPricePerMillion,
      modelOutputPricePerMillion,
      retrievalPricePerThousand,
      agentHourlyRate,
      fixedMonthlyPlatformCost,
      oneTimeImplementationCost,
    ].filter((value) => value.trim() !== "").length;

    const hasAnyPrice = enteredPriceCount > 0;
    const hasAgentRate = agentHourlyRate.trim() !== "";
    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      conversations,
      aiHandled,
      directHuman,
      aiResolved,
      escalated,
      totalHumanHandled,
      aiResponses,
      inputTokens,
      outputTokens,
      retrievalCalls,
      directHumanHours,
      escalationHours,
      qaReviewed,
      qaHours,
      allHumanHours,
      allHumanCost,
      monthlyOperatingCost,
      monthlyPlanningCost,
      operatingSavings,
      planningSavings,
      firstYearAutomationCost,
      firstYearHumanCost,
      firstYearSavings,
      costPerConversation,
      costPerResolvedConversation,
      effectiveAutomationRate,
      breakEvenMonthlyConversations,
      breakEvenAiHandlingPercent,
      implementationPaybackMonths,
      rows,
      enteredPriceCount,
      hasAnyPrice,
      hasAgentRate,
      hasBudget,
      budget,
      budgetDifference: budget - monthlyPlanningCost,
    };
  }, [
    agentHourlyRate,
    aiHandlingPercent,
    aiResolutionPercent,
    aiResponsesPerConversation,
    amortizationMonths,
    escalatedHandleMinutes,
    fixedMonthlyPlatformCost,
    inputTokensPerResponse,
    manualHandleMinutes,
    modelInputPricePerMillion,
    modelOutputPricePerMillion,
    monthlyBudget,
    monthlyConversations,
    oneTimeImplementationCost,
    outputTokensPerResponse,
    qaMinutesPerReview,
    qaReviewPercent,
    retrievalCallsPerConversation,
    retrievalPricePerThousand,
    retryOverheadPercent,
  ]);

  const reset = () => {
    setMonthlyConversations("20000");
    setAiHandlingPercent("70");
    setAiResolutionPercent("75");
    setAiResponsesPerConversation("4");
    setRetryOverheadPercent("5");
    setInputTokensPerResponse("1200");
    setOutputTokensPerResponse("250");
    setModelInputPricePerMillion("");
    setModelOutputPricePerMillion("");
    setRetrievalCallsPerConversation("2");
    setRetrievalPricePerThousand("");
    setManualHandleMinutes("10");
    setEscalatedHandleMinutes("7");
    setAgentHourlyRate("");
    setQaReviewPercent("8");
    setQaMinutesPerReview("3");
    setFixedMonthlyPlatformCost("");
    setOneTimeImplementationCost("");
    setAmortizationMonths("12");
    setMonthlyBudget("");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Support Automation Plan
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Model AI conversations, escalations, retrieval, QA, human labour,
            and setup.
          </p>
        </div>

        <FieldSection title="Monthly Support Workload">
          <BeeijaNumberField
            label="Support conversations per month"
            value={monthlyConversations}
            onChange={setMonthlyConversations}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Conversations sent to AI"
            value={aiHandlingPercent}
            onChange={setAiHandlingPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="AI-handled conversations resolved without escalation"
            value={aiResolutionPercent}
            onChange={setAiResolutionPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="AI responses per AI conversation"
            value={aiResponsesPerConversation}
            onChange={setAiResponsesPerConversation}
            min="0"
            step="0.1"
          />

          <BeeijaNumberField
            label="Retry and repeated-response overhead"
            value={retryOverheadPercent}
            onChange={setRetryOverheadPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Model Usage and Prices">
          <BeeijaNumberField
            label="Input tokens per AI response"
            value={inputTokensPerResponse}
            onChange={setInputTokensPerResponse}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Output tokens per AI response"
            value={outputTokensPerResponse}
            onChange={setOutputTokensPerResponse}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Model input price per 1M tokens"
            value={modelInputPricePerMillion}
            onChange={setModelInputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Model output price per 1M tokens"
            value={modelOutputPricePerMillion}
            onChange={setModelOutputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Knowledge Retrieval">
          <BeeijaNumberField
            label="Retrieval calls per AI conversation"
            value={retrievalCallsPerConversation}
            onChange={setRetrievalCallsPerConversation}
            min="0"
            step="0.1"
          />

          <BeeijaNumberField
            label="Retrieval price per 1,000 calls"
            value={retrievalPricePerThousand}
            onChange={setRetrievalPricePerThousand}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Human Support and QA">
          <BeeijaNumberField
            label="Manual handle time per normal conversation"
            value={manualHandleMinutes}
            onChange={setManualHandleMinutes}
            min="0"
            step="0.1"
            suffix="min"
          />

          <BeeijaNumberField
            label="Human handle time after AI escalation"
            value={escalatedHandleMinutes}
            onChange={setEscalatedHandleMinutes}
            min="0"
            step="0.1"
            suffix="min"
          />

          <BeeijaNumberField
            label="Support agent hourly rate"
            value={agentHourlyRate}
            onChange={setAgentHourlyRate}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="AI-resolved conversations reviewed by QA"
            value={qaReviewPercent}
            onChange={setQaReviewPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Minutes per QA review"
            value={qaMinutesPerReview}
            onChange={setQaMinutesPerReview}
            min="0"
            step="0.1"
            suffix="min"
          />
        </FieldSection>

        <FieldSection title="Platform, Setup, and Budget">
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

          <BeeijaNumberField
            label="Target monthly support budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated monthly support flow
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              AI-handled conversations: {formatVisibleInteger(result.aiHandled)}
            </p>
            <p>
              AI-resolved conversations: {formatVisibleInteger(result.aiResolved)}
            </p>
            <p>
              Direct human conversations: {formatVisibleInteger(result.directHuman)}
            </p>
            <p>
              AI escalations: {formatVisibleInteger(result.escalated)}
            </p>
            <p>
              AI responses billed: {formatVisibleInteger(result.aiResponses)}
            </p>
            <p>
              Retrieval calls: {formatVisibleInteger(result.retrievalCalls)}
            </p>
            <p>
              QA reviews: {formatVisibleInteger(result.qaReviewed)}
            </p>
            <p>
              Effective automation rate:{" "}
              {formatVisibleNumber(result.effectiveAutomationRate)}%
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
        title="Support Automation Cost and Savings"
        description="The result compares AI-assisted support with an all-human baseline using the same monthly conversation volume."
        primaryLabel="Monthly support planning cost"
        primaryValue={
          result.hasAnyPrice
            ? formatVisibleMoney(result.monthlyPlanningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per conversation"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.costPerConversation)
                  : "—"
              }
            />
            <ResultStat
              label="All-human baseline"
              value={
                result.hasAgentRate
                  ? formatVisibleMoney(result.allHumanCost)
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
              Monthly operating comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasAgentRate || result.operatingSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasAgentRate
                  ? "Enter the support agent rate"
                  : result.operatingSavings >= 0
                    ? `${formatVisibleMoney(result.operatingSavings)} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.operatingSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              Monthly planning comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasAgentRate || result.planningSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasAgentRate
                  ? "Enter the support agent rate"
                  : result.planningSavings >= 0
                    ? `${formatVisibleMoney(result.planningSavings)} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.planningSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              First-year comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasAgentRate || result.firstYearSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasAgentRate
                  ? "Enter the support agent rate"
                  : result.firstYearSavings >= 0
                    ? `${formatVisibleMoney(result.firstYearSavings)} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.firstYearSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              Approximate break-even automation share:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasAgentRate
                  ? "Enter the support agent rate"
                  : result.breakEvenAiHandlingPercent === null
                    ? "Not reached"
                    : `${formatVisibleNumber(
                        result.breakEvenAiHandlingPercent,
                      )}% of conversations`}
              </span>
            </p>

            <p className="mt-2">
              Approximate break-even volume:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasAgentRate
                  ? "Enter the support agent rate"
                  : result.breakEvenMonthlyConversations === null
                    ? "No positive saving per conversation"
                    : `${formatVisibleInteger(
                        result.breakEvenMonthlyConversations,
                      )} conversations per month`}
              </span>
            </p>

            <p className="mt-2">
              Implementation payback:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasAgentRate
                  ? "Enter the support agent rate"
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
                {result.enteredPriceCount} of 6
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
        noticeText="This calculator stores no model, retrieval, helpdesk, labour, or platform price. Enter the current effective rates for the exact services being considered. Blank optional price fields are treated as zero. Resolution rate, escalation time, QA effort, taxes, CRM licences, telephony, translation, and the business cost of incorrect answers can change the final result."
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

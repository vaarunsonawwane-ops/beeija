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

type ScenarioInput = {
  requests: number;
  inputTokensPerRequest: number;
  outputTokensPerRequest: number;
  inputBlockRate: number;
  outputFailRate: number;
  regenerationCoverage: number;
  regenerationAttemptsPerCase: number;
  regenerationSuccessRate: number;
  modelInputPrice: number;
  modelOutputPrice: number;
  inputCheckPricePerThousand: number;
  outputCheckPricePerThousand: number;
  policyJudgeCoverage: number;
  policyJudgeInputTokens: number;
  policyJudgeOutputTokens: number;
  policyJudgeInputPrice: number;
  policyJudgeOutputPrice: number;
  humanEscalationRate: number;
  minutesPerHumanReview: number;
  humanHourlyRate: number;
  fixedMonthlyCost: number;
  amortisedSetupCost: number;
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

function calculateScenario(input: ScenarioInput) {
  const blockedBeforeGeneration =
    input.requests * input.inputBlockRate;

  const initialGenerationRequests =
    input.requests - blockedBeforeGeneration;

  const initialOutputFailures =
    initialGenerationRequests * input.outputFailRate;

  const regenerationCases =
    initialOutputFailures * input.regenerationCoverage;

  const regenerationCalls =
    regenerationCases * input.regenerationAttemptsPerCase;

  const successfulRegenerations =
    regenerationCases * input.regenerationSuccessRate;

  const unresolvedOutputFailures = Math.max(
    0,
    initialOutputFailures - successfulRegenerations,
  );

  const deliveredResponses = Math.max(
    0,
    initialGenerationRequests - unresolvedOutputFailures,
  );

  const totalGenerationCalls =
    initialGenerationRequests + regenerationCalls;

  const inputCheckCalls = input.requests;
  const outputCheckCalls =
    initialGenerationRequests + regenerationCalls;

  const totalGuardrailChecks = inputCheckCalls + outputCheckCalls;

  const policyJudgeCalls =
    totalGuardrailChecks * input.policyJudgeCoverage;

  const flaggedEvents =
    blockedBeforeGeneration + initialOutputFailures;

  const humanReviews =
    flaggedEvents * input.humanEscalationRate;

  const humanReviewHours =
    (humanReviews * input.minutesPerHumanReview) / 60;

  const baselineModelInputTokens =
    input.requests * input.inputTokensPerRequest;
  const baselineModelOutputTokens =
    input.requests * input.outputTokensPerRequest;

  const baselineModelCost =
    (baselineModelInputTokens / 1_000_000) *
      input.modelInputPrice +
    (baselineModelOutputTokens / 1_000_000) *
      input.modelOutputPrice;

  const guardedModelInputTokens =
    totalGenerationCalls * input.inputTokensPerRequest;
  const guardedModelOutputTokens =
    totalGenerationCalls * input.outputTokensPerRequest;

  const guardedModelCost =
    (guardedModelInputTokens / 1_000_000) *
      input.modelInputPrice +
    (guardedModelOutputTokens / 1_000_000) *
      input.modelOutputPrice;

  const modelCostPerGeneration =
    (input.inputTokensPerRequest / 1_000_000) *
      input.modelInputPrice +
    (input.outputTokensPerRequest / 1_000_000) *
      input.modelOutputPrice;

  const avoidedGenerationCost =
    blockedBeforeGeneration * modelCostPerGeneration;

  const regenerationModelCost =
    regenerationCalls * modelCostPerGeneration;

  const inputCheckCost =
    (inputCheckCalls / 1_000) *
    input.inputCheckPricePerThousand;

  const outputCheckCost =
    (outputCheckCalls / 1_000) *
    input.outputCheckPricePerThousand;

  const policyJudgeInputTokens =
    policyJudgeCalls * input.policyJudgeInputTokens;
  const policyJudgeOutputTokens =
    policyJudgeCalls * input.policyJudgeOutputTokens;

  const policyJudgeInputCost =
    (policyJudgeInputTokens / 1_000_000) *
    input.policyJudgeInputPrice;

  const policyJudgeOutputCost =
    (policyJudgeOutputTokens / 1_000_000) *
    input.policyJudgeOutputPrice;

  const humanReviewCost =
    humanReviewHours * input.humanHourlyRate;

  const guardrailOperatingCost =
    inputCheckCost +
    outputCheckCost +
    policyJudgeInputCost +
    policyJudgeOutputCost +
    humanReviewCost +
    input.fixedMonthlyCost;

  const guardrailPlanningCost =
    guardrailOperatingCost + input.amortisedSetupCost;

  const totalGuardedOperatingCost =
    guardedModelCost + guardrailOperatingCost;

  const totalGuardedPlanningCost =
    totalGuardedOperatingCost + input.amortisedSetupCost;

  const netOperatingImpact =
    totalGuardedOperatingCost - baselineModelCost;

  const netPlanningImpact =
    totalGuardedPlanningCost - baselineModelCost;

  return {
    blockedBeforeGeneration,
    initialGenerationRequests,
    initialOutputFailures,
    regenerationCases,
    regenerationCalls,
    successfulRegenerations,
    unresolvedOutputFailures,
    deliveredResponses,
    totalGenerationCalls,
    inputCheckCalls,
    outputCheckCalls,
    totalGuardrailChecks,
    policyJudgeCalls,
    flaggedEvents,
    humanReviews,
    humanReviewHours,
    baselineModelInputTokens,
    baselineModelOutputTokens,
    baselineModelCost,
    guardedModelInputTokens,
    guardedModelOutputTokens,
    guardedModelCost,
    modelCostPerGeneration,
    avoidedGenerationCost,
    regenerationModelCost,
    inputCheckCost,
    outputCheckCost,
    policyJudgeInputTokens,
    policyJudgeOutputTokens,
    policyJudgeInputCost,
    policyJudgeOutputCost,
    humanReviewCost,
    guardrailOperatingCost,
    guardrailPlanningCost,
    totalGuardedOperatingCost,
    totalGuardedPlanningCost,
    netOperatingImpact,
    netPlanningImpact,
    costPerIncomingRequest:
      input.requests > 0
        ? totalGuardedPlanningCost / input.requests
        : 0,
    costPerDeliveredResponse:
      deliveredResponses > 0
        ? totalGuardedPlanningCost / deliveredResponses
        : 0,
    deliveryRate:
      input.requests > 0
        ? (deliveredResponses / input.requests) * 100
        : 0,
  };
}

export default function ToolClient() {
  const [monthlyRequests, setMonthlyRequests] = useState("100000");
  const [modelInputTokensPerRequest, setModelInputTokensPerRequest] =
    useState("1200");
  const [modelOutputTokensPerRequest, setModelOutputTokensPerRequest] =
    useState("400");
  const [modelInputPricePerMillion, setModelInputPricePerMillion] =
    useState("");
  const [modelOutputPricePerMillion, setModelOutputPricePerMillion] =
    useState("");

  const [inputBlockRatePercent, setInputBlockRatePercent] =
    useState("4");
  const [outputFailureRatePercent, setOutputFailureRatePercent] =
    useState("2");
  const [regenerationCoveragePercent, setRegenerationCoveragePercent] =
    useState("80");
  const [regenerationAttemptsPerCase, setRegenerationAttemptsPerCase] =
    useState("1");
  const [regenerationSuccessRatePercent, setRegenerationSuccessRatePercent] =
    useState("75");

  const [inputCheckPricePerThousand, setInputCheckPricePerThousand] =
    useState("");
  const [outputCheckPricePerThousand, setOutputCheckPricePerThousand] =
    useState("");

  const [policyJudgeCoveragePercent, setPolicyJudgeCoveragePercent] =
    useState("0");
  const [policyJudgeInputTokensPerCheck, setPolicyJudgeInputTokensPerCheck] =
    useState("600");
  const [policyJudgeOutputTokensPerCheck, setPolicyJudgeOutputTokensPerCheck] =
    useState("80");
  const [policyJudgeInputPricePerMillion, setPolicyJudgeInputPricePerMillion] =
    useState("");
  const [policyJudgeOutputPricePerMillion, setPolicyJudgeOutputPricePerMillion] =
    useState("");

  const [humanEscalationPercent, setHumanEscalationPercent] =
    useState("10");
  const [minutesPerHumanReview, setMinutesPerHumanReview] =
    useState("3");
  const [humanHourlyRate, setHumanHourlyRate] = useState("");

  const [fixedMonthlyGuardrailCost, setFixedMonthlyGuardrailCost] =
    useState("");
  const [oneTimeImplementationCost, setOneTimeImplementationCost] =
    useState("");
  const [amortizationMonths, setAmortizationMonths] = useState("12");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const requests = toNumber(monthlyRequests);
    const implementationCost = toNumber(oneTimeImplementationCost);
    const months = Math.max(1, toNumber(amortizationMonths));
    const amortisedSetupCost = implementationCost / months;

    const scenarioInput: ScenarioInput = {
      requests,
      inputTokensPerRequest: toNumber(modelInputTokensPerRequest),
      outputTokensPerRequest: toNumber(modelOutputTokensPerRequest),
      inputBlockRate:
        clampPercent(inputBlockRatePercent) / 100,
      outputFailRate:
        clampPercent(outputFailureRatePercent) / 100,
      regenerationCoverage:
        clampPercent(regenerationCoveragePercent) / 100,
      regenerationAttemptsPerCase: toNumber(
        regenerationAttemptsPerCase,
      ),
      regenerationSuccessRate:
        clampPercent(regenerationSuccessRatePercent) / 100,
      modelInputPrice: toNumber(modelInputPricePerMillion),
      modelOutputPrice: toNumber(modelOutputPricePerMillion),
      inputCheckPricePerThousand: toNumber(
        inputCheckPricePerThousand,
      ),
      outputCheckPricePerThousand: toNumber(
        outputCheckPricePerThousand,
      ),
      policyJudgeCoverage:
        clampPercent(policyJudgeCoveragePercent) / 100,
      policyJudgeInputTokens: toNumber(
        policyJudgeInputTokensPerCheck,
      ),
      policyJudgeOutputTokens: toNumber(
        policyJudgeOutputTokensPerCheck,
      ),
      policyJudgeInputPrice: toNumber(
        policyJudgeInputPricePerMillion,
      ),
      policyJudgeOutputPrice: toNumber(
        policyJudgeOutputPricePerMillion,
      ),
      humanEscalationRate:
        clampPercent(humanEscalationPercent) / 100,
      minutesPerHumanReview: toNumber(minutesPerHumanReview),
      humanHourlyRate: toNumber(humanHourlyRate),
      fixedMonthlyCost: toNumber(fixedMonthlyGuardrailCost),
      amortisedSetupCost,
    };

    const scenario = calculateScenario(scenarioInput);

    let breakEvenInputBlockRate: number | null = null;

    for (let step = 0; step <= 1000; step += 1) {
      const candidate = calculateScenario({
        ...scenarioInput,
        inputBlockRate: step / 1000,
      });

      if (
        candidate.totalGuardedPlanningCost <=
        candidate.baselineModelCost
      ) {
        breakEvenInputBlockRate = (step / 1000) * 100;
        break;
      }
    }

    const implementationPaybackMonths =
      implementationCost > 0 &&
      scenario.netOperatingImpact < 0
        ? implementationCost /
          Math.abs(scenario.netOperatingImpact)
        : null;

    const rows: CostRow[] = [
      {
        label: "Input safety checks",
        detail: `${formatInteger(
          scenario.inputCheckCalls,
        )} pre-generation checks`,
        value: scenario.inputCheckCost,
        entered: inputCheckPricePerThousand.trim() !== "",
      },
      {
        label: "Output safety checks",
        detail: `${formatInteger(
          scenario.outputCheckCalls,
        )} generated-response checks`,
        value: scenario.outputCheckCost,
        entered: outputCheckPricePerThousand.trim() !== "",
      },
      {
        label: "Policy-model input",
        detail: `${formatInteger(
          scenario.policyJudgeInputTokens,
        )} policy-grader input tokens`,
        value: scenario.policyJudgeInputCost,
        entered:
          policyJudgeCoveragePercent !== "0" &&
          policyJudgeInputPricePerMillion.trim() !== "",
      },
      {
        label: "Policy-model output",
        detail: `${formatInteger(
          scenario.policyJudgeOutputTokens,
        )} policy-grader output tokens`,
        value: scenario.policyJudgeOutputCost,
        entered:
          policyJudgeCoveragePercent !== "0" &&
          policyJudgeOutputPricePerMillion.trim() !== "",
      },
      {
        label: "Human escalation",
        detail: `${formatInteger(
          scenario.humanReviews,
        )} reviews · ${formatNumber(
          scenario.humanReviewHours,
        )} hours`,
        value: scenario.humanReviewCost,
        entered: humanHourlyRate.trim() !== "",
      },
      {
        label: "Fixed guardrail platform cost",
        detail: "Monitoring, policy management, logs, or managed service",
        value: toNumber(fixedMonthlyGuardrailCost),
        entered: fixedMonthlyGuardrailCost.trim() !== "",
      },
      {
        label: "Amortised implementation",
        detail: `${formatMoney(
          implementationCost,
        )} spread across ${formatInteger(months)} months`,
        value: amortisedSetupCost,
        entered: oneTimeImplementationCost.trim() !== "",
      },
    ];

    const hasModelPrices =
      modelInputPricePerMillion.trim() !== "" &&
      modelOutputPricePerMillion.trim() !== "";

    const enteredGuardrailPriceCount = [
      inputCheckPricePerThousand,
      outputCheckPricePerThousand,
      policyJudgeInputPricePerMillion,
      policyJudgeOutputPricePerMillion,
      humanHourlyRate,
      fixedMonthlyGuardrailCost,
      oneTimeImplementationCost,
    ].filter((value) => value.trim() !== "").length;

    const hasAnyGuardrailCost =
      enteredGuardrailPriceCount > 0;

    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      ...scenario,
      implementationCost,
      amortisedSetupCost,
      breakEvenInputBlockRate,
      implementationPaybackMonths,
      rows,
      hasModelPrices,
      hasAnyGuardrailCost,
      enteredGuardrailPriceCount,
      hasBudget,
      budget,
      budgetDifference:
        budget - scenario.totalGuardedPlanningCost,
      firstYearGuardedCost:
        scenario.totalGuardedOperatingCost * 12 +
        implementationCost,
      firstYearBaselineCost:
        scenario.baselineModelCost * 12,
      firstYearNetImpact:
        scenario.totalGuardedOperatingCost * 12 +
        implementationCost -
        scenario.baselineModelCost * 12,
    };
  }, [
    amortizationMonths,
    fixedMonthlyGuardrailCost,
    humanEscalationPercent,
    humanHourlyRate,
    inputBlockRatePercent,
    inputCheckPricePerThousand,
    minutesPerHumanReview,
    modelInputPricePerMillion,
    modelInputTokensPerRequest,
    modelOutputPricePerMillion,
    modelOutputTokensPerRequest,
    monthlyBudget,
    monthlyRequests,
    oneTimeImplementationCost,
    outputCheckPricePerThousand,
    outputFailureRatePercent,
    policyJudgeCoveragePercent,
    policyJudgeInputPricePerMillion,
    policyJudgeInputTokensPerCheck,
    policyJudgeOutputPricePerMillion,
    policyJudgeOutputTokensPerCheck,
    regenerationAttemptsPerCase,
    regenerationCoveragePercent,
    regenerationSuccessRatePercent,
  ]);

  const reset = () => {
    setMonthlyRequests("100000");
    setModelInputTokensPerRequest("1200");
    setModelOutputTokensPerRequest("400");
    setModelInputPricePerMillion("");
    setModelOutputPricePerMillion("");
    setInputBlockRatePercent("4");
    setOutputFailureRatePercent("2");
    setRegenerationCoveragePercent("80");
    setRegenerationAttemptsPerCase("1");
    setRegenerationSuccessRatePercent("75");
    setInputCheckPricePerThousand("");
    setOutputCheckPricePerThousand("");
    setPolicyJudgeCoveragePercent("0");
    setPolicyJudgeInputTokensPerCheck("600");
    setPolicyJudgeOutputTokensPerCheck("80");
    setPolicyJudgeInputPricePerMillion("");
    setPolicyJudgeOutputPricePerMillion("");
    setHumanEscalationPercent("10");
    setMinutesPerHumanReview("3");
    setHumanHourlyRate("");
    setFixedMonthlyGuardrailCost("");
    setOneTimeImplementationCost("");
    setAmortizationMonths("12");
    setMonthlyBudget("");
  };

  const hasCompleteEstimate =
    result.hasModelPrices || result.hasAnyGuardrailCost;

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Guardrail Workflow
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Model input checks, output checks, regeneration, policy grading,
            and human escalation.
          </p>
        </div>

        <FieldSection title="Main AI Workload">
          <BeeijaNumberField
            label="Incoming requests per month"
            value={monthlyRequests}
            onChange={setMonthlyRequests}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Main-model input tokens per generation"
            value={modelInputTokensPerRequest}
            onChange={setModelInputTokensPerRequest}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Main-model output tokens per generation"
            value={modelOutputTokensPerRequest}
            onChange={setModelOutputTokensPerRequest}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Main-model input price per 1M tokens"
            value={modelInputPricePerMillion}
            onChange={setModelInputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Main-model output price per 1M tokens"
            value={modelOutputPricePerMillion}
            onChange={setModelOutputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Policy Triggers and Regeneration">
          <BeeijaNumberField
            label="Requests blocked before generation"
            value={inputBlockRatePercent}
            onChange={setInputBlockRatePercent}
            min="0"
            max="100"
            step="0.1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Initial outputs failing post-check"
            value={outputFailureRatePercent}
            onChange={setOutputFailureRatePercent}
            min="0"
            max="100"
            step="0.1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Failed outputs sent for regeneration"
            value={regenerationCoveragePercent}
            onChange={setRegenerationCoveragePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Average regeneration attempts per case"
            value={regenerationAttemptsPerCase}
            onChange={setRegenerationAttemptsPerCase}
            min="0"
            step="0.1"
          />

          <BeeijaNumberField
            label="Regeneration success rate"
            value={regenerationSuccessRatePercent}
            onChange={setRegenerationSuccessRatePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Moderation and Guardrail Prices">
          <BeeijaNumberField
            label="Input-check service price per 1,000 checks"
            value={inputCheckPricePerThousand}
            onChange={setInputCheckPricePerThousand}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Output-check service price per 1,000 checks"
            value={outputCheckPricePerThousand}
            onChange={setOutputCheckPricePerThousand}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Checks also sent to a policy model"
            value={policyJudgeCoveragePercent}
            onChange={setPolicyJudgeCoveragePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Policy-model input tokens per check"
            value={policyJudgeInputTokensPerCheck}
            onChange={setPolicyJudgeInputTokensPerCheck}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Policy-model output tokens per check"
            value={policyJudgeOutputTokensPerCheck}
            onChange={setPolicyJudgeOutputTokensPerCheck}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Policy-model input price per 1M tokens"
            value={policyJudgeInputPricePerMillion}
            onChange={setPolicyJudgeInputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Policy-model output price per 1M tokens"
            value={policyJudgeOutputPricePerMillion}
            onChange={setPolicyJudgeOutputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Human Review, Platform, and Setup">
          <BeeijaNumberField
            label="Flagged decisions escalated to humans"
            value={humanEscalationPercent}
            onChange={setHumanEscalationPercent}
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

          <BeeijaNumberField
            label="Fixed guardrail platform cost per month"
            value={fixedMonthlyGuardrailCost}
            onChange={setFixedMonthlyGuardrailCost}
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
            label="Target monthly guarded-workflow budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated monthly safety flow
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              Blocked before generation:{" "}
              {formatVisibleInteger(result.blockedBeforeGeneration)}
            </p>

            <p>
              Initial model generations:{" "}
              {formatVisibleInteger(result.initialGenerationRequests)}
            </p>

            <p>
              Regeneration calls:{" "}
              {formatVisibleInteger(result.regenerationCalls)}
            </p>

            <p>
              Total output checks:{" "}
              {formatVisibleInteger(result.outputCheckCalls)}
            </p>

            <p>
              Human reviews: {formatVisibleInteger(result.humanReviews)}
            </p>

            <p>
              Delivered responses:{" "}
              {formatVisibleInteger(result.deliveredResponses)}
            </p>

            <p>
              Estimated delivery rate:{" "}
              {formatVisibleNumber(result.deliveryRate)}%
            </p>

            <p>
              Unresolved output failures:{" "}
              {formatVisibleInteger(result.unresolvedOutputFailures)}
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
        title="Guardrail Cost and Model Impact"
        description="The result compares the guarded workflow with a baseline where every request reaches the main model once."
        primaryLabel="Guarded monthly planning cost"
        primaryValue={
          hasCompleteEstimate
            ? formatVisibleMoney(result.totalGuardedPlanningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Baseline model cost"
              value={
                result.hasModelPrices
                  ? formatVisibleMoney(result.baselineModelCost)
                  : "—"
              }
            />

            <ResultStat
              label="Guardrail-only planning cost"
              value={
                result.hasAnyGuardrailCost
                  ? formatVisibleMoney(result.guardrailPlanningCost)
                  : "—"
              }
            />

            <ResultStat
              label="Per delivered response"
              value={
                hasCompleteEstimate
                  ? formatVisibleMoney(result.costPerDeliveredResponse)
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
              Guarded main-model cost:{" "}
              <span className="font-medium text-gray-900">
                {result.hasModelPrices
                  ? formatVisibleMoney(result.guardedModelCost)
                  : "Enter main-model prices"}
              </span>
            </p>

            <p className="mt-2">
              Model spend avoided by input blocking:{" "}
              <span className="font-medium text-gray-900">
                {result.hasModelPrices
                  ? formatVisibleMoney(result.avoidedGenerationCost)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Additional model spend from regeneration:{" "}
              <span className="font-medium text-gray-900">
                {result.hasModelPrices
                  ? formatVisibleMoney(result.regenerationModelCost)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Net monthly planning impact versus baseline:{" "}
              <span
                className={`font-semibold ${
                  !hasCompleteEstimate ||
                  result.netPlanningImpact <= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!hasCompleteEstimate
                  ? "Enter current prices"
                  : result.netPlanningImpact <= 0
                    ? `${formatVisibleMoney(
                        Math.abs(result.netPlanningImpact),
                      )} lower than baseline`
                    : `${formatVisibleMoney(
                        result.netPlanningImpact,
                      )} above baseline`}
              </span>
            </p>

            <p className="mt-2">
              First-year guarded workflow:{" "}
              <span className="font-medium text-gray-900">
                {hasCompleteEstimate
                  ? formatVisibleMoney(result.firstYearGuardedCost)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              First-year impact versus baseline:{" "}
              <span
                className={`font-semibold ${
                  !hasCompleteEstimate ||
                  result.firstYearNetImpact <= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!hasCompleteEstimate
                  ? "Enter current prices"
                  : result.firstYearNetImpact <= 0
                    ? `${formatVisibleMoney(
                        Math.abs(result.firstYearNetImpact),
                      )} lower than baseline`
                    : `${formatVisibleMoney(
                        result.firstYearNetImpact,
                      )} above baseline`}
              </span>
            </p>

            <p className="mt-2">
              Approximate input-block break-even:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasModelPrices
                  ? "Enter main-model prices"
                  : result.breakEvenInputBlockRate === null
                    ? "Not reached"
                    : `${formatVisibleNumber(
                        result.breakEvenInputBlockRate,
                      )}% of incoming requests`}
              </span>
            </p>

            <p className="mt-2">
              Implementation payback from operating savings:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasModelPrices
                  ? "Enter main-model prices"
                  : result.implementationCost === 0
                    ? "No implementation cost entered"
                    : result.implementationPaybackMonths === null
                      ? "No operating-cost payback"
                      : `${formatVisibleNumber(
                          result.implementationPaybackMonths,
                        )} months`}
              </span>
            </p>

            <p className="mt-2">
              Guardrail price inputs entered:{" "}
              <span className="font-medium text-gray-900">
                {result.enteredGuardrailPriceCount} of 7
              </span>
            </p>

            <p className="mt-2">
              Budget status:{" "}
              <span
                className={`font-semibold ${
                  result.hasBudget &&
                  hasCompleteEstimate &&
                  result.budgetDifference < 0
                    ? "text-red-700"
                    : "text-[var(--green)]"
                }`}
              >
                {!result.hasBudget
                  ? "Add a budget to compare"
                  : !hasCompleteEstimate
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
        noticeText="This calculator stores no provider, model, moderation, labour, or guardrail price. Enter the current effective rates for the exact services being considered. Trigger rates, escalation rates, regeneration outcomes, and false-positive behaviour should come from evaluations or production data. Blank optional price fields are treated as zero."
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

function ResultStat({ label, value }: { label: string; value: string }) {
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

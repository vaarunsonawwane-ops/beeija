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

function clampPercent(value: string, maximum = 100) {
  return Math.min(maximum, Math.max(0, toNumber(value)));
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
  const [trainingExamples, setTrainingExamples] = useState("25000");
  const [averageInputTokens, setAverageInputTokens] = useState("800");
  const [averageOutputTokens, setAverageOutputTokens] = useState("200");
  const [trainingSplitPercent, setTrainingSplitPercent] = useState("90");
  const [datasetExpansionPercent, setDatasetExpansionPercent] =
    useState("10");
  const [epochs, setEpochs] = useState("3");
  const [trainingExperiments, setTrainingExperiments] = useState("3");

  const [trainingPricePerMillion, setTrainingPricePerMillion] =
    useState("");
  const [dataPreparationHours, setDataPreparationHours] = useState("80");
  const [dataPreparationHourlyRate, setDataPreparationHourlyRate] =
    useState("");
  const [evaluationAndTestingCost, setEvaluationAndTestingCost] =
    useState("");
  const [otherOneTimeSetupCost, setOtherOneTimeSetupCost] = useState("");

  const [monthlyRequests, setMonthlyRequests] = useState("100000");
  const [baseInputTokensPerRequest, setBaseInputTokensPerRequest] =
    useState("1500");
  const [baseOutputTokensPerRequest, setBaseOutputTokensPerRequest] =
    useState("300");
  const [inputTokenReductionPercent, setInputTokenReductionPercent] =
    useState("30");
  const [outputTokenReductionPercent, setOutputTokenReductionPercent] =
    useState("10");
  const [successfulCompletionRate, setSuccessfulCompletionRate] =
    useState("95");

  const [baseInputPricePerMillion, setBaseInputPricePerMillion] =
    useState("");
  const [baseOutputPricePerMillion, setBaseOutputPricePerMillion] =
    useState("");
  const [tunedInputPricePerMillion, setTunedInputPricePerMillion] =
    useState("");
  const [tunedOutputPricePerMillion, setTunedOutputPricePerMillion] =
    useState("");

  const [hostedEndpointMonthlyCost, setHostedEndpointMonthlyCost] =
    useState("");
  const [monitoringMonthlyCost, setMonitoringMonthlyCost] = useState("");
  const [retrainingRunsPerYear, setRetrainingRunsPerYear] = useState("2");
  const [setupAmortizationMonths, setSetupAmortizationMonths] =
    useState("12");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const examples = toNumber(trainingExamples);
    const inputTokens = toNumber(averageInputTokens);
    const outputTokens = toNumber(averageOutputTokens);
    const split = clampPercent(trainingSplitPercent) / 100;
    const expansionMultiplier =
      1 + clampPercent(datasetExpansionPercent, 1000) / 100;
    const epochCount = Math.max(1, toNumber(epochs));
    const experimentCount = Math.max(1, toNumber(trainingExperiments));

    const tokensPerExample = inputTokens + outputTokens;
    const expandedExamples = examples * expansionMultiplier;
    const trainingExamplesUsed = expandedExamples * split;
    const datasetTokensPerEpoch = trainingExamplesUsed * tokensPerExample;
    const trainingTokensPerExperiment =
      datasetTokensPerEpoch * epochCount;
    const totalTrainingTokens =
      trainingTokensPerExperiment * experimentCount;

    const trainingCost =
      (totalTrainingTokens / 1_000_000) *
      toNumber(trainingPricePerMillion);

    const dataPreparationCost =
      toNumber(dataPreparationHours) *
      toNumber(dataPreparationHourlyRate);

    const evaluationCost = toNumber(evaluationAndTestingCost);
    const otherSetupCost = toNumber(otherOneTimeSetupCost);

    const initialProjectCost =
      trainingCost +
      dataPreparationCost +
      evaluationCost +
      otherSetupCost;

    const requests = toNumber(monthlyRequests);
    const completionRate =
      clampPercent(successfulCompletionRate) / 100;
    const successfulRequests = requests * completionRate;

    const baseInputPerRequest = toNumber(baseInputTokensPerRequest);
    const baseOutputPerRequest = toNumber(baseOutputTokensPerRequest);

    const tunedInputPerRequest =
      baseInputPerRequest *
      (1 - clampPercent(inputTokenReductionPercent) / 100);

    const tunedOutputPerRequest =
      baseOutputPerRequest *
      (1 - clampPercent(outputTokenReductionPercent) / 100);

    const baseMonthlyInputTokens = requests * baseInputPerRequest;
    const baseMonthlyOutputTokens = requests * baseOutputPerRequest;
    const tunedMonthlyInputTokens = requests * tunedInputPerRequest;
    const tunedMonthlyOutputTokens = requests * tunedOutputPerRequest;

    const baseMonthlyInputCost =
      (baseMonthlyInputTokens / 1_000_000) *
      toNumber(baseInputPricePerMillion);

    const baseMonthlyOutputCost =
      (baseMonthlyOutputTokens / 1_000_000) *
      toNumber(baseOutputPricePerMillion);

    const baseMonthlyCost =
      baseMonthlyInputCost + baseMonthlyOutputCost;

    const tunedMonthlyInputCost =
      (tunedMonthlyInputTokens / 1_000_000) *
      toNumber(tunedInputPricePerMillion);

    const tunedMonthlyOutputCost =
      (tunedMonthlyOutputTokens / 1_000_000) *
      toNumber(tunedOutputPricePerMillion);

    const endpointCost = toNumber(hostedEndpointMonthlyCost);
    const monitoringCost = toNumber(monitoringMonthlyCost);

    const annualRetrainingRuns = toNumber(retrainingRunsPerYear);
    const monthlyRetrainingReserve =
      (trainingCost * annualRetrainingRuns) / 12;

    const tunedMonthlyOperatingCost =
      tunedMonthlyInputCost +
      tunedMonthlyOutputCost +
      endpointCost +
      monitoringCost +
      monthlyRetrainingReserve;

    const amortisationMonths = Math.max(
      1,
      toNumber(setupAmortizationMonths),
    );

    const amortisedInitialCost =
      initialProjectCost / amortisationMonths;

    const tunedMonthlyPlanningCost =
      tunedMonthlyOperatingCost + amortisedInitialCost;

    const operatingMonthlySaving =
      baseMonthlyCost - tunedMonthlyOperatingCost;

    const planningMonthlySaving =
      baseMonthlyCost - tunedMonthlyPlanningCost;

    const baseFirstYearCost = baseMonthlyCost * 12;
    const tunedFirstYearCost =
      initialProjectCost + tunedMonthlyOperatingCost * 12;
    const firstYearSaving =
      baseFirstYearCost - tunedFirstYearCost;

    const baseVariableCostPerRequest =
      requests > 0
        ? baseMonthlyCost / requests
        : 0;

    const tunedVariableCostPerRequest =
      requests > 0
        ? (tunedMonthlyInputCost + tunedMonthlyOutputCost) / requests
        : 0;

    const variableSavingPerRequest =
      baseVariableCostPerRequest - tunedVariableCostPerRequest;

    const recurringFixedTunedCost =
      endpointCost + monitoringCost + monthlyRetrainingReserve;

    const breakEvenMonthlyRequests =
      variableSavingPerRequest > 0
        ? recurringFixedTunedCost / variableSavingPerRequest
        : null;

    const projectPaybackMonths =
      initialProjectCost > 0 && operatingMonthlySaving > 0
        ? initialProjectCost / operatingMonthlySaving
        : null;

    const tunedOperatingCostPerRequest =
      requests > 0
        ? tunedMonthlyOperatingCost / requests
        : 0;

    const tunedPlanningCostPerSuccessfulRequest =
      successfulRequests > 0
        ? tunedMonthlyPlanningCost / successfulRequests
        : 0;

    const rows: CostRow[] = [
      {
        label: "Tuned-model input",
        detail: `${formatInteger(
          tunedMonthlyInputTokens,
        )} monthly input tokens`,
        value: tunedMonthlyInputCost,
        entered: tunedInputPricePerMillion.trim() !== "",
      },
      {
        label: "Tuned-model output",
        detail: `${formatInteger(
          tunedMonthlyOutputTokens,
        )} monthly output tokens`,
        value: tunedMonthlyOutputCost,
        entered: tunedOutputPricePerMillion.trim() !== "",
      },
      {
        label: "Hosted endpoint or platform",
        detail: "Reserved endpoint, model hosting, storage, or platform fee",
        value: endpointCost,
        entered: hostedEndpointMonthlyCost.trim() !== "",
      },
      {
        label: "Monitoring and review",
        detail: "Quality checks, drift monitoring, evaluation, or review",
        value: monitoringCost,
        entered: monitoringMonthlyCost.trim() !== "",
      },
      {
        label: "Monthly retraining reserve",
        detail: `${formatNumber(
          annualRetrainingRuns,
        )} planned training runs per year`,
        value: monthlyRetrainingReserve,
        entered:
          trainingPricePerMillion.trim() !== "" &&
          retrainingRunsPerYear.trim() !== "",
      },
      {
        label: "Amortised initial project cost",
        detail: `${formatMoney(
          initialProjectCost,
        )} spread across ${formatInteger(amortisationMonths)} months`,
        value: amortisedInitialCost,
        entered:
          trainingPricePerMillion.trim() !== "" ||
          dataPreparationHourlyRate.trim() !== "" ||
          evaluationAndTestingCost.trim() !== "" ||
          otherOneTimeSetupCost.trim() !== "",
      },
    ];

    const enteredPriceCount = [
      trainingPricePerMillion,
      dataPreparationHourlyRate,
      evaluationAndTestingCost,
      otherOneTimeSetupCost,
      baseInputPricePerMillion,
      baseOutputPricePerMillion,
      tunedInputPricePerMillion,
      tunedOutputPricePerMillion,
      hostedEndpointMonthlyCost,
      monitoringMonthlyCost,
    ].filter((value) => value.trim() !== "").length;

    const hasAnyPrice = enteredPriceCount > 0;
    const hasBasePrices =
      baseInputPricePerMillion.trim() !== "" &&
      baseOutputPricePerMillion.trim() !== "";
    const hasTunedPrices =
      tunedInputPricePerMillion.trim() !== "" &&
      tunedOutputPricePerMillion.trim() !== "";
    const hasComparison = hasBasePrices && hasTunedPrices;
    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      expandedExamples,
      trainingExamplesUsed,
      tokensPerExample,
      datasetTokensPerEpoch,
      trainingTokensPerExperiment,
      totalTrainingTokens,
      trainingCost,
      dataPreparationCost,
      evaluationCost,
      otherSetupCost,
      initialProjectCost,
      requests,
      successfulRequests,
      baseMonthlyInputTokens,
      baseMonthlyOutputTokens,
      tunedMonthlyInputTokens,
      tunedMonthlyOutputTokens,
      baseMonthlyInputCost,
      baseMonthlyOutputCost,
      baseMonthlyCost,
      tunedMonthlyInputCost,
      tunedMonthlyOutputCost,
      tunedMonthlyOperatingCost,
      amortisedInitialCost,
      tunedMonthlyPlanningCost,
      operatingMonthlySaving,
      planningMonthlySaving,
      baseFirstYearCost,
      tunedFirstYearCost,
      firstYearSaving,
      baseVariableCostPerRequest,
      tunedVariableCostPerRequest,
      tunedOperatingCostPerRequest,
      tunedPlanningCostPerSuccessfulRequest,
      variableSavingPerRequest,
      breakEvenMonthlyRequests,
      projectPaybackMonths,
      rows,
      enteredPriceCount,
      hasAnyPrice,
      hasBasePrices,
      hasTunedPrices,
      hasComparison,
      hasBudget,
      budget,
      budgetDifference: budget - tunedMonthlyPlanningCost,
    };
  }, [
    averageInputTokens,
    averageOutputTokens,
    baseInputPricePerMillion,
    baseInputTokensPerRequest,
    baseOutputPricePerMillion,
    baseOutputTokensPerRequest,
    dataPreparationHourlyRate,
    dataPreparationHours,
    datasetExpansionPercent,
    epochs,
    evaluationAndTestingCost,
    hostedEndpointMonthlyCost,
    inputTokenReductionPercent,
    monitoringMonthlyCost,
    monthlyBudget,
    monthlyRequests,
    otherOneTimeSetupCost,
    outputTokenReductionPercent,
    retrainingRunsPerYear,
    setupAmortizationMonths,
    successfulCompletionRate,
    trainingExamples,
    trainingExperiments,
    trainingPricePerMillion,
    trainingSplitPercent,
    tunedInputPricePerMillion,
    tunedOutputPricePerMillion,
  ]);

  const reset = () => {
    setTrainingExamples("25000");
    setAverageInputTokens("800");
    setAverageOutputTokens("200");
    setTrainingSplitPercent("90");
    setDatasetExpansionPercent("10");
    setEpochs("3");
    setTrainingExperiments("3");
    setTrainingPricePerMillion("");
    setDataPreparationHours("80");
    setDataPreparationHourlyRate("");
    setEvaluationAndTestingCost("");
    setOtherOneTimeSetupCost("");
    setMonthlyRequests("100000");
    setBaseInputTokensPerRequest("1500");
    setBaseOutputTokensPerRequest("300");
    setInputTokenReductionPercent("30");
    setOutputTokenReductionPercent("10");
    setSuccessfulCompletionRate("95");
    setBaseInputPricePerMillion("");
    setBaseOutputPricePerMillion("");
    setTunedInputPricePerMillion("");
    setTunedOutputPricePerMillion("");
    setHostedEndpointMonthlyCost("");
    setMonitoringMonthlyCost("");
    setRetrainingRunsPerYear("2");
    setSetupAmortizationMonths("12");
    setMonthlyBudget("");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Fine-Tuning Plan
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Model the dataset, training experiments, deployment, and ongoing
            inference in one estimate.
          </p>
        </div>

        <FieldSection title="Training Dataset and Experiments">
          <BeeijaNumberField
            label="Training examples"
            value={trainingExamples}
            onChange={setTrainingExamples}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average input tokens per example"
            value={averageInputTokens}
            onChange={setAverageInputTokens}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average output tokens per example"
            value={averageOutputTokens}
            onChange={setAverageOutputTokens}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Examples used for training"
            value={trainingSplitPercent}
            onChange={setTrainingSplitPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Dataset expansion or augmentation"
            value={datasetExpansionPercent}
            onChange={setDatasetExpansionPercent}
            min="0"
            max="1000"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Training epochs"
            value={epochs}
            onChange={setEpochs}
            min="1"
            step="1"
          />

          <BeeijaNumberField
            label="Experimental training runs"
            value={trainingExperiments}
            onChange={setTrainingExperiments}
            min="1"
            step="1"
          />

          <BeeijaNumberField
            label="Current training price per 1M tokens"
            value={trainingPricePerMillion}
            onChange={setTrainingPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Initial Project Work">
          <BeeijaNumberField
            label="Dataset preparation hours"
            value={dataPreparationHours}
            onChange={setDataPreparationHours}
            min="0"
            step="1"
            suffix="hr"
          />

          <BeeijaNumberField
            label="Dataset preparation hourly rate"
            value={dataPreparationHourlyRate}
            onChange={setDataPreparationHourlyRate}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="Evaluation and testing cost"
            value={evaluationAndTestingCost}
            onChange={setEvaluationAndTestingCost}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="Other one-time setup cost"
            value={otherOneTimeSetupCost}
            onChange={setOtherOneTimeSetupCost}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Monthly Inference Workload">
          <BeeijaNumberField
            label="Inference requests per month"
            value={monthlyRequests}
            onChange={setMonthlyRequests}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Base input tokens per request"
            value={baseInputTokensPerRequest}
            onChange={setBaseInputTokensPerRequest}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Base output tokens per request"
            value={baseOutputTokensPerRequest}
            onChange={setBaseOutputTokensPerRequest}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Expected input-token reduction"
            value={inputTokenReductionPercent}
            onChange={setInputTokenReductionPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Expected output-token reduction"
            value={outputTokenReductionPercent}
            onChange={setOutputTokenReductionPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
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
        </FieldSection>

        <FieldSection title="Current Model and Operating Prices">
          <BeeijaNumberField
            label="Base-model input price per 1M tokens"
            value={baseInputPricePerMillion}
            onChange={setBaseInputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Base-model output price per 1M tokens"
            value={baseOutputPricePerMillion}
            onChange={setBaseOutputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Tuned-model input price per 1M tokens"
            value={tunedInputPricePerMillion}
            onChange={setTunedInputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Tuned-model output price per 1M tokens"
            value={tunedOutputPricePerMillion}
            onChange={setTunedOutputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Hosted endpoint or platform per month"
            value={hostedEndpointMonthlyCost}
            onChange={setHostedEndpointMonthlyCost}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="Monitoring and review per month"
            value={monitoringMonthlyCost}
            onChange={setMonitoringMonthlyCost}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="Planned retraining runs per year"
            value={retrainingRunsPerYear}
            onChange={setRetrainingRunsPerYear}
            min="0"
            step="0.1"
          />

          <BeeijaNumberField
            label="Initial-cost amortisation period"
            value={setupAmortizationMonths}
            onChange={setSetupAmortizationMonths}
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

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated training and inference workload
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              Expanded examples: {formatVisibleInteger(result.expandedExamples)}
            </p>
            <p>
              Training examples used:{" "}
              {formatVisibleInteger(result.trainingExamplesUsed)}
            </p>
            <p>
              Tokens per example: {formatVisibleInteger(result.tokensPerExample)}
            </p>
            <p>
              Dataset tokens per epoch:{" "}
              {formatVisibleInteger(result.datasetTokensPerEpoch)}
            </p>
            <p>
              Training tokens per experiment:{" "}
              {formatVisibleInteger(result.trainingTokensPerExperiment)}
            </p>
            <p>
              Total training tokens:{" "}
              {formatVisibleInteger(result.totalTrainingTokens)}
            </p>
            <p>
              Tuned monthly input tokens:{" "}
              {formatVisibleInteger(result.tunedMonthlyInputTokens)}
            </p>
            <p>
              Tuned monthly output tokens:{" "}
              {formatVisibleInteger(result.tunedMonthlyOutputTokens)}
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
        title="Fine-Tuning Cost and Payback"
        description="The result separates initial project cost, tuned-model operating cost, and the amortised monthly planning cost."
        primaryLabel="Tuned workflow monthly planning cost"
        primaryValue={
          result.hasAnyPrice
            ? formatVisibleMoney(result.tunedMonthlyPlanningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Initial project"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.initialProjectCost)
                  : "—"
              }
            />

            <ResultStat
              label="Operating per request"
              value={
                result.hasTunedPrices
                  ? formatVisibleMoney(result.tunedOperatingCostPerRequest)
                  : "—"
              }
            />

            <ResultStat
              label="Planning per successful request"
              value={
                result.hasTunedPrices
                  ? formatVisibleMoney(
                      result.tunedPlanningCostPerSuccessfulRequest,
                    )
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
              Base-model monthly cost:{" "}
              <span className="font-medium text-gray-900">
                {result.hasBasePrices
                  ? formatVisibleMoney(result.baseMonthlyCost)
                  : "Enter base-model prices"}
              </span>
            </p>

            <p className="mt-2">
              Tuned-model monthly operating cost:{" "}
              <span className="font-medium text-gray-900">
                {result.hasTunedPrices
                  ? formatVisibleMoney(result.tunedMonthlyOperatingCost)
                  : "Enter tuned-model prices"}
              </span>
            </p>

            <p className="mt-2">
              Monthly operating saving:{" "}
              <span
                className={`font-semibold ${
                  !result.hasComparison ||
                  result.operatingMonthlySaving >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasComparison
                  ? "Enter base and tuned prices"
                  : result.operatingMonthlySaving >= 0
                    ? `${formatVisibleMoney(
                        result.operatingMonthlySaving,
                      )} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.operatingMonthlySaving),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              Monthly planning saving:{" "}
              <span
                className={`font-semibold ${
                  !result.hasComparison ||
                  result.planningMonthlySaving >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasComparison
                  ? "Enter base and tuned prices"
                  : result.planningMonthlySaving >= 0
                    ? `${formatVisibleMoney(
                        result.planningMonthlySaving,
                      )} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.planningMonthlySaving),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              First-year comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasComparison ||
                  result.firstYearSaving >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasComparison
                  ? "Enter base and tuned prices"
                  : result.firstYearSaving >= 0
                    ? `${formatVisibleMoney(
                        result.firstYearSaving,
                      )} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.firstYearSaving),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              Initial-project payback:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasComparison
                  ? "Enter base and tuned prices"
                  : result.initialProjectCost === 0
                    ? "No initial project cost entered"
                    : result.projectPaybackMonths === null
                      ? "No positive operating payback"
                      : `${formatVisibleNumber(
                          result.projectPaybackMonths,
                        )} months`}
              </span>
            </p>

            <p className="mt-2">
              Approximate operating break-even volume:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasComparison
                  ? "Enter base and tuned prices"
                  : result.breakEvenMonthlyRequests === null
                    ? "No variable saving per request"
                    : `${formatVisibleInteger(
                        result.breakEvenMonthlyRequests,
                      )} requests per month`}
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
                      ? `${formatVisibleMoney(result.budgetDifference)} remaining`
                      : `${formatVisibleMoney(
                          Math.abs(result.budgetDifference),
                        )} over budget`}
              </span>
            </p>
          </div>
        }
        noticeText="This calculator stores no built-in fine-tuning or model price. Enter the current official rates for the exact provider, model, region, training method, and account. Blank price fields are treated as zero. Quality improvement, failed jobs, taxes, discounts, storage, data transfer, and provider-specific minimum charges may change the final cost."
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
}: {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
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
        {entered ? formatVisibleMoney(value) : "—"}
      </p>
    </div>
  );
}

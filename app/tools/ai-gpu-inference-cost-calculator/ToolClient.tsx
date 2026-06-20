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
  const [monthlyRequests, setMonthlyRequests] = useState("1000000");
  const [inputTokensPerRequest, setInputTokensPerRequest] =
    useState("1200");
  const [outputTokensPerRequest, setOutputTokensPerRequest] =
    useState("300");
  const [retryOverheadPercent, setRetryOverheadPercent] =
    useState("3");

  const [modelRuntimeMemoryGb, setModelRuntimeMemoryGb] =
    useState("120");
  const [usableMemoryPerGpuGb, setUsableMemoryPerGpuGb] =
    useState("72");
  const [promptTokensPerSecond, setPromptTokensPerSecond] =
    useState("2500");
  const [generationTokensPerSecond, setGenerationTokensPerSecond] =
    useState("180");
  const [batchingThroughputUpliftPercent, setBatchingThroughputUpliftPercent] =
    useState("25");

  const [targetUtilizationPercent, setTargetUtilizationPercent] =
    useState("65");
  const [capacityReservePercent, setCapacityReservePercent] =
    useState("20");
  const [minimumReplicas, setMinimumReplicas] = useState("1");
  const [billableHoursPerMonth, setBillableHoursPerMonth] =
    useState("730");

  const [gpuPricePerHour, setGpuPricePerHour] = useState("");
  const [hostPricePerReplicaHour, setHostPricePerReplicaHour] =
    useState("");
  const [storageCostPerMonth, setStorageCostPerMonth] =
    useState("");
  const [networkCostPerMonth, setNetworkCostPerMonth] =
    useState("");
  const [monitoringCostPerMonth, setMonitoringCostPerMonth] =
    useState("");

  const [oneTimeImplementationCost, setOneTimeImplementationCost] =
    useState("");
  const [amortizationMonths, setAmortizationMonths] =
    useState("12");

  const [apiInputPricePerMillion, setApiInputPricePerMillion] =
    useState("");
  const [apiOutputPricePerMillion, setApiOutputPricePerMillion] =
    useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const requests = toNumber(monthlyRequests);
    const inputTokens = toNumber(inputTokensPerRequest);
    const outputTokens = toNumber(outputTokensPerRequest);
    const retryMultiplier =
      1 + clampPercent(retryOverheadPercent) / 100;

    const memoryRequired = toNumber(modelRuntimeMemoryGb);
    const usableGpuMemory = Math.max(
      0.0001,
      toNumber(usableMemoryPerGpuGb),
    );
    const gpusPerReplica = Math.max(
      1,
      Math.ceil(memoryRequired / usableGpuMemory),
    );
    const allocatedGpuMemory = gpusPerReplica * usableGpuMemory;
    const memoryHeadroom = allocatedGpuMemory - memoryRequired;

    const promptThroughput = Math.max(
      0.0001,
      toNumber(promptTokensPerSecond),
    );
    const generationThroughput = Math.max(
      0.0001,
      toNumber(generationTokensPerSecond),
    );
    const batchingMultiplier =
      1 + clampPercent(batchingThroughputUpliftPercent) / 100;

    const promptSecondsPerRequest = inputTokens / promptThroughput;
    const generationSecondsPerRequest =
      outputTokens / generationThroughput;
    const unbatchedSecondsPerRequest =
      promptSecondsPerRequest + generationSecondsPerRequest;
    const effectiveSecondsPerRequest =
      unbatchedSecondsPerRequest / batchingMultiplier;

    const attemptedRequests = requests * retryMultiplier;
    const busyReplicaHours =
      (attemptedRequests * effectiveSecondsPerRequest) / 3600;

    const targetUtilization = Math.max(
      0.0001,
      clampPercent(targetUtilizationPercent) / 100,
    );
    const reserveMultiplier =
      1 + clampPercent(capacityReservePercent) / 100;

    const capacityReplicaHours =
      (busyReplicaHours / targetUtilization) * reserveMultiplier;

    const hoursPerMonth = Math.max(
      1,
      toNumber(billableHoursPerMonth),
    );
    const minReplicas = Math.max(
      0,
      toNumber(minimumReplicas),
    );
    const minimumReplicaHours = minReplicas * hoursPerMonth;

    const billableReplicaHours = Math.max(
      capacityReplicaHours,
      minimumReplicaHours,
    );
    const billableGpuHours =
      billableReplicaHours * gpusPerReplica;

    const idleReplicaHours = Math.max(
      0,
      billableReplicaHours - busyReplicaHours,
    );
    const minimumFloorExtraHours = Math.max(
      0,
      minimumReplicaHours - capacityReplicaHours,
    );

    const averageRunningReplicas =
      billableReplicaHours / hoursPerMonth;
    const effectiveUtilization =
      billableReplicaHours > 0
        ? (busyReplicaHours / billableReplicaHours) * 100
        : 0;

    const gpuHourlyPrice = toNumber(gpuPricePerHour);
    const hostHourlyPrice = toNumber(hostPricePerReplicaHour);

    const gpuCost = billableGpuHours * gpuHourlyPrice;
    const hostCost =
      billableReplicaHours * hostHourlyPrice;
    const storageCost = toNumber(storageCostPerMonth);
    const networkCost = toNumber(networkCostPerMonth);
    const monitoringCost = toNumber(monitoringCostPerMonth);

    const implementationCost = toNumber(oneTimeImplementationCost);
    const months = Math.max(1, toNumber(amortizationMonths));
    const amortizedImplementationCost =
      implementationCost / months;

    const monthlyOperatingCost =
      gpuCost +
      hostCost +
      storageCost +
      networkCost +
      monitoringCost;

    const monthlyPlanningCost =
      monthlyOperatingCost + amortizedImplementationCost;

    const totalInputTokens =
      attemptedRequests * inputTokens;
    const totalOutputTokens =
      attemptedRequests * outputTokens;
    const totalTokens = totalInputTokens + totalOutputTokens;

    const apiInputCost =
      (totalInputTokens / 1_000_000) *
      toNumber(apiInputPricePerMillion);
    const apiOutputCost =
      (totalOutputTokens / 1_000_000) *
      toNumber(apiOutputPricePerMillion);
    const managedApiCost = apiInputCost + apiOutputCost;

    const monthlyOperatingDifference =
      managedApiCost - monthlyOperatingCost;
    const monthlyPlanningDifference =
      managedApiCost - monthlyPlanningCost;

    const firstYearSelfHostedCost =
      monthlyOperatingCost * 12 + implementationCost;
    const firstYearApiCost = managedApiCost * 12;
    const firstYearDifference =
      firstYearApiCost - firstYearSelfHostedCost;

    const costPerRequest =
      requests > 0 ? monthlyPlanningCost / requests : 0;

    const costPerMillionTokens =
      totalTokens > 0
        ? monthlyPlanningCost / (totalTokens / 1_000_000)
        : 0;

    const estimatedMonthlyCapacity =
      effectiveSecondsPerRequest > 0
        ? (billableReplicaHours *
            3600 *
            targetUtilization) /
          (effectiveSecondsPerRequest *
            reserveMultiplier *
            retryMultiplier)
        : 0;

    const replicaStackHourlyCost =
      gpusPerReplica * gpuHourlyPrice + hostHourlyPrice;

    const minimumFloorExtraCost =
      minimumFloorExtraHours * replicaStackHourlyCost;

    const minimumFloorCostShare =
      monthlyPlanningCost > 0
        ? (minimumFloorExtraCost / monthlyPlanningCost) * 100
        : 0;

    const implementationPaybackMonths =
      implementationCost > 0 &&
      monthlyOperatingDifference > 0
        ? implementationCost / monthlyOperatingDifference
        : null;

    const apiPerRequest =
      retryMultiplier *
      ((inputTokens / 1_000_000) *
        toNumber(apiInputPricePerMillion) +
        (outputTokens / 1_000_000) *
          toNumber(apiOutputPricePerMillion));

    const capacityHoursPerRequest =
      ((retryMultiplier * effectiveSecondsPerRequest) /
        3600 /
        targetUtilization) *
      reserveMultiplier;

    const selfVariablePerRequest =
      capacityHoursPerRequest * replicaStackHourlyCost;

    const fixedPlanningCost =
      storageCost +
      networkCost +
      monitoringCost +
      amortizedImplementationCost;

    const floorComputeCost =
      minimumReplicaHours * replicaStackHourlyCost;

    const floorBoundaryRequests =
      capacityHoursPerRequest > 0
        ? minimumReplicaHours / capacityHoursPerRequest
        : null;

    let breakEvenRequests: number | null = null;

    if (apiPerRequest > 0) {
      const floorCandidate =
        (floorComputeCost + fixedPlanningCost) / apiPerRequest;

      if (
        floorBoundaryRequests === null ||
        floorCandidate <= floorBoundaryRequests
      ) {
        breakEvenRequests = floorCandidate;
      } else if (apiPerRequest > selfVariablePerRequest) {
        const variableCandidate =
          fixedPlanningCost /
          (apiPerRequest - selfVariablePerRequest);

        if (
          floorBoundaryRequests === null ||
          variableCandidate >= floorBoundaryRequests
        ) {
          breakEvenRequests = variableCandidate;
        }
      }
    }

    const rows: CostRow[] = [
      {
        label: "GPU compute",
        detail: `${formatNumber(
          billableGpuHours,
        )} GPU-hours · ${gpusPerReplica} GPU${
          gpusPerReplica === 1 ? "" : "s"
        } per replica`,
        value: gpuCost,
        entered: gpuPricePerHour.trim() !== "",
      },
      {
        label: "Host, CPU, and memory",
        detail: `${formatNumber(
          billableReplicaHours,
        )} billable replica-hours`,
        value: hostCost,
        entered: hostPricePerReplicaHour.trim() !== "",
      },
      {
        label: "Storage",
        detail: "Model files, container images, logs, and cached assets",
        value: storageCost,
        entered: storageCostPerMonth.trim() !== "",
      },
      {
        label: "Network and data transfer",
        detail: "Ingress, egress, load balancing, and private networking",
        value: networkCost,
        entered: networkCostPerMonth.trim() !== "",
      },
      {
        label: "Monitoring and serving platform",
        detail: "Metrics, tracing, orchestration, and endpoint management",
        value: monitoringCost,
        entered: monitoringCostPerMonth.trim() !== "",
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

    const enteredSelfHostedPriceCount = [
      gpuPricePerHour,
      hostPricePerReplicaHour,
      storageCostPerMonth,
      networkCostPerMonth,
      monitoringCostPerMonth,
      oneTimeImplementationCost,
    ].filter((value) => value.trim() !== "").length;

    const hasSelfHostedPrices =
      gpuPricePerHour.trim() !== "" ||
      enteredSelfHostedPriceCount > 0;

    const hasApiPrices =
      apiInputPricePerMillion.trim() !== "" &&
      apiOutputPricePerMillion.trim() !== "";

    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      requests,
      attemptedRequests,
      gpusPerReplica,
      allocatedGpuMemory,
      memoryHeadroom,
      promptSecondsPerRequest,
      generationSecondsPerRequest,
      unbatchedSecondsPerRequest,
      effectiveSecondsPerRequest,
      busyReplicaHours,
      capacityReplicaHours,
      minimumReplicaHours,
      billableReplicaHours,
      billableGpuHours,
      idleReplicaHours,
      minimumFloorExtraHours,
      minimumFloorExtraCost,
      minimumFloorCostShare,
      averageRunningReplicas,
      effectiveUtilization,
      totalInputTokens,
      totalOutputTokens,
      totalTokens,
      monthlyOperatingCost,
      monthlyPlanningCost,
      managedApiCost,
      apiInputCost,
      apiOutputCost,
      monthlyOperatingDifference,
      monthlyPlanningDifference,
      firstYearSelfHostedCost,
      firstYearApiCost,
      firstYearDifference,
      costPerRequest,
      costPerMillionTokens,
      estimatedMonthlyCapacity,
      implementationPaybackMonths,
      implementationCost,
      breakEvenRequests,
      rows,
      enteredSelfHostedPriceCount,
      hasSelfHostedPrices,
      hasApiPrices,
      hasBudget,
      budget,
      budgetDifference: budget - monthlyPlanningCost,
    };
  }, [
    amortizationMonths,
    apiInputPricePerMillion,
    apiOutputPricePerMillion,
    batchingThroughputUpliftPercent,
    billableHoursPerMonth,
    capacityReservePercent,
    generationTokensPerSecond,
    gpuPricePerHour,
    hostPricePerReplicaHour,
    inputTokensPerRequest,
    minimumReplicas,
    modelRuntimeMemoryGb,
    monitoringCostPerMonth,
    monthlyBudget,
    monthlyRequests,
    networkCostPerMonth,
    oneTimeImplementationCost,
    outputTokensPerRequest,
    promptTokensPerSecond,
    retryOverheadPercent,
    storageCostPerMonth,
    targetUtilizationPercent,
    usableMemoryPerGpuGb,
  ]);

  const reset = () => {
    setMonthlyRequests("1000000");
    setInputTokensPerRequest("1200");
    setOutputTokensPerRequest("300");
    setRetryOverheadPercent("3");
    setModelRuntimeMemoryGb("120");
    setUsableMemoryPerGpuGb("72");
    setPromptTokensPerSecond("2500");
    setGenerationTokensPerSecond("180");
    setBatchingThroughputUpliftPercent("25");
    setTargetUtilizationPercent("65");
    setCapacityReservePercent("20");
    setMinimumReplicas("1");
    setBillableHoursPerMonth("730");
    setGpuPricePerHour("");
    setHostPricePerReplicaHour("");
    setStorageCostPerMonth("");
    setNetworkCostPerMonth("");
    setMonitoringCostPerMonth("");
    setOneTimeImplementationCost("");
    setAmortizationMonths("12");
    setApiInputPricePerMillion("");
    setApiOutputPricePerMillion("");
    setMonthlyBudget("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your GPU Inference Plan
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Use measured throughput from the same model, quantization, GPU
            count, and serving configuration planned for production.
          </p>
        </div>

        <FieldSection title="Monthly Inference Workload">
          <BeeijaNumberField
            label="Inference requests per month"
            value={monthlyRequests}
            onChange={setMonthlyRequests}
            min="0"
            step="1"
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

          <BeeijaNumberField
            label="Retry and failed-request overhead"
            value={retryOverheadPercent}
            onChange={setRetryOverheadPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Model Memory and Measured Throughput">
          <BeeijaNumberField
            label="Model and runtime memory per replica"
            value={modelRuntimeMemoryGb}
            onChange={setModelRuntimeMemoryGb}
            min="0"
            step="0.1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Usable memory per GPU"
            value={usableMemoryPerGpuGb}
            onChange={setUsableMemoryPerGpuGb}
            min="0.1"
            step="0.1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Measured prompt throughput per replica"
            value={promptTokensPerSecond}
            onChange={setPromptTokensPerSecond}
            min="0.1"
            step="1"
            suffix="tok/s"
          />

          <BeeijaNumberField
            label="Measured generation throughput per replica"
            value={generationTokensPerSecond}
            onChange={setGenerationTokensPerSecond}
            min="0.1"
            step="1"
            suffix="tok/s"
          />

          <BeeijaNumberField
            label="Measured batching throughput uplift"
            value={batchingThroughputUpliftPercent}
            onChange={setBatchingThroughputUpliftPercent}
            min="0"
            max="500"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Capacity and Availability">
          <BeeijaNumberField
            label="Target replica utilization"
            value={targetUtilizationPercent}
            onChange={setTargetUtilizationPercent}
            min="1"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Additional capacity reserve"
            value={capacityReservePercent}
            onChange={setCapacityReservePercent}
            min="0"
            max="500"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Minimum always-available replicas"
            value={minimumReplicas}
            onChange={setMinimumReplicas}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Billable hours per month"
            value={billableHoursPerMonth}
            onChange={setBillableHoursPerMonth}
            min="1"
            step="1"
            suffix="hr"
          />
        </FieldSection>

        <FieldSection title="Self-Hosted Infrastructure Prices">
          <BeeijaNumberField
            label="GPU price per GPU-hour"
            value={gpuPricePerHour}
            onChange={setGpuPricePerHour}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Host, CPU, and memory per replica-hour"
            value={hostPricePerReplicaHour}
            onChange={setHostPricePerReplicaHour}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Storage cost per month"
            value={storageCostPerMonth}
            onChange={setStorageCostPerMonth}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="Network and data-transfer cost per month"
            value={networkCostPerMonth}
            onChange={setNetworkCostPerMonth}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="Monitoring and serving platform per month"
            value={monitoringCostPerMonth}
            onChange={setMonitoringCostPerMonth}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Implementation, API Baseline, and Budget">
          <BeeijaNumberField
            label="One-time inference implementation cost"
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
            label="Managed API input price per 1M tokens"
            value={apiInputPricePerMillion}
            onChange={setApiInputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Managed API output price per 1M tokens"
            value={apiOutputPricePerMillion}
            onChange={setApiOutputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Target monthly self-hosted budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated inference deployment shape
          </p>

          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>
              GPUs required per replica: {result.gpusPerReplica}
            </p>

            <p>
              Allocated usable GPU memory:{" "}
              {formatNumber(result.allocatedGpuMemory)} GB
            </p>

            <p>
              Memory headroom: {formatNumber(result.memoryHeadroom)} GB
            </p>

            <p>
              Effective compute time per request:{" "}
              {formatNumber(result.effectiveSecondsPerRequest)} seconds
            </p>

            <p>
              Busy replica-hours:{" "}
              {formatNumber(result.busyReplicaHours)}
            </p>

            <p>
              Billable replica-hours:{" "}
              {formatNumber(result.billableReplicaHours)}
            </p>

            <p>
              Billable GPU-hours:{" "}
              {formatNumber(result.billableGpuHours)}
            </p>

            <p>
              Average running replicas:{" "}
              {formatNumber(result.averageRunningReplicas)}
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
        title="GPU Inference Cost and Capacity"
        description="The estimate applies measured throughput, batching, utilization, reserve capacity, minimum replicas, and infrastructure prices."
        primaryLabel="Monthly self-hosted planning cost"
        primaryValue={
          result.hasSelfHostedPrices
            ? formatMoney(result.monthlyPlanningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultStat
              label="Cost per request"
              value={
                result.hasSelfHostedPrices
                  ? formatMoney(result.costPerRequest)
                  : "—"
              }
            />

            <ResultStat
              label="Cost per 1M tokens"
              value={
                result.hasSelfHostedPrices
                  ? formatMoney(result.costPerMillionTokens)
                  : "—"
              }
            />

            <ResultStat
              label="Effective utilization"
              value={`${formatNumber(result.effectiveUtilization)}%`}
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
                {result.hasSelfHostedPrices
                  ? formatMoney(result.monthlyOperatingCost)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Idle replica-hours:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(result.idleReplicaHours)}
              </span>
            </p>

            <p className="mt-2">
              Extra cost from minimum replica floor:{" "}
              <span className="font-medium text-gray-900">
                {result.hasSelfHostedPrices
                  ? `${formatMoney(
                      result.minimumFloorExtraCost,
                    )} (${formatNumber(
                      result.minimumFloorCostShare,
                    )}% of planning cost)`
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Estimated request capacity at entered settings:{" "}
              <span className="font-medium text-gray-900">
                {formatInteger(result.estimatedMonthlyCapacity)} per month
              </span>
            </p>

            <p className="mt-2">
              Managed API monthly baseline:{" "}
              <span className="font-medium text-gray-900">
                {result.hasApiPrices
                  ? formatMoney(result.managedApiCost)
                  : "Enter both API token prices"}
              </span>
            </p>

            <ComparisonLine
              label="Monthly planning comparison"
              ready={
                result.hasSelfHostedPrices && result.hasApiPrices
              }
              value={result.monthlyPlanningDifference}
            />

            <ComparisonLine
              label="First-year comparison"
              ready={
                result.hasSelfHostedPrices && result.hasApiPrices
              }
              value={result.firstYearDifference}
            />

            <p className="mt-2">
              Approximate API break-even volume:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasApiPrices
                  ? "Enter both API token prices"
                  : result.breakEvenRequests === null
                    ? "No break-even under these assumptions"
                    : `${formatInteger(
                        result.breakEvenRequests,
                      )} requests per month`}
              </span>
            </p>

            <p className="mt-2">
              Implementation payback:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasApiPrices
                  ? "Enter both API token prices"
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
              Self-hosted price inputs entered:{" "}
              <span className="font-medium text-gray-900">
                {result.enteredSelfHostedPriceCount} of 6
              </span>
            </p>

            <p className="mt-2">
              Budget status:{" "}
              <span
                className={`font-semibold ${
                  result.hasBudget &&
                  result.hasSelfHostedPrices &&
                  result.budgetDifference < 0
                    ? "text-red-700"
                    : "text-[var(--green)]"
                }`}
              >
                {!result.hasBudget
                  ? "Add a budget to compare"
                  : !result.hasSelfHostedPrices
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
        noticeText="This calculator stores no GPU, host, managed API, storage, network, monitoring, or implementation price. Enter current rates for the exact region and deployment. Throughput must be measured on the same model, quantization, GPU count, serving engine, batch settings, and context profile. Blank optional price fields are treated as zero."
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
          ? "Enter self-hosted and API prices"
          : value >= 0
            ? `${formatMoney(value)} self-hosted saving`
            : `${formatMoney(Math.abs(value))} self-hosted premium`}
      </span>
    </p>
  );
}

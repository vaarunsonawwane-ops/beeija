"use client";

import { useMemo, useState, type ReactNode } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";
import {
  cloudPostgresProviders,
  getAvailabilityOption,
  getCloudPostgresOptionLabel,
  getCloudPostgresProvider,
  type CloudPostgresProvider,
} from "@/app/data/cloudPostgresOptions";

type PlanInput = {
  id: string;
  providerId: string;
  regionId: string;
  customRegion: string;
  availabilityId: string;
  computeTierId: string;
  storageTypeId: string;
  pricingModeId: string;
  combinedNodeHourlyPrice: string;
  vcpuHourlyPrice: string;
  memoryGbHourlyPrice: string;
  commitmentDiscountPercent: string;
  storagePricePerGbMonth: string;
  iopsPricePerIopsMonth: string;
  ioRequestPricePerMillion: string;
  includedBackupStorageGb: string;
  backupPricePerGbMonth: string;
  egressPricePerGb: string;
  publicIpMonthlyCost: string;
  extendedSupportPricePerVcpuHour: string;
  fixedMonthlyCost: string;
  oneTimeMigrationCost: string;
  migrationAmortizationMonths: string;
};

type PlanResult = {
  id: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  displayName: string;
  regionLabel: string;
  availabilityLabel: string;
  availabilityDescription: string;
  computeTierLabel: string;
  storageTypeLabel: string;
  configured: boolean;
  availabilityNodeMultiplier: number;
  highAvailabilityNodes: number;
  readReplicaNodes: number;
  totalNodes: number;
  totalNodeHours: number;
  grossComputeCost: number;
  commitmentSaving: number;
  computeCost: number;
  storageCost: number;
  iopsCost: number;
  ioRequestCost: number;
  billableBackupStorageGb: number;
  backupCost: number;
  egressCost: number;
  publicIpCost: number;
  extendedSupportCost: number;
  fixedMonthlyCost: number;
  oneTimeMigrationCost: number;
  amortizedMigrationCost: number;
  monthlyOperatingCost: number;
  monthlyPlanningCost: number;
  firstYearCost: number;
  currentStoredGb: number;
  endOfYearStoredGb: number;
  costPerNodeHour: number;
  costPerVcpuHour: number;
  costPerStoredTb: number;
  budgetDifference: number;
  enteredPriceCount: number;
};

type CostRow = {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
};

function createPlan(id: string, providerId: string): PlanInput {
  const provider = getCloudPostgresProvider(providerId);

  return {
    id,
    providerId: provider.id,
    regionId: provider.defaults.regionId,
    customRegion: "",
    availabilityId: provider.defaults.availabilityId,
    computeTierId: provider.defaults.computeTierId,
    storageTypeId: provider.defaults.storageTypeId,
    pricingModeId: provider.defaults.pricingModeId,
    combinedNodeHourlyPrice: "",
    vcpuHourlyPrice: "",
    memoryGbHourlyPrice: "",
    commitmentDiscountPercent: "0",
    storagePricePerGbMonth: "",
    iopsPricePerIopsMonth: "",
    ioRequestPricePerMillion: "",
    includedBackupStorageGb: "",
    backupPricePerGbMonth: "",
    egressPricePerGb: "",
    publicIpMonthlyCost: "",
    extendedSupportPricePerVcpuHour: "",
    fixedMonthlyCost: "",
    oneTimeMigrationCost: "",
    migrationAmortizationMonths: "12",
  };
}

const initialPlans: PlanInput[] = [
  createPlan("plan-a", "aws"),
  createPlan("plan-b", "azure"),
  createPlan("plan-c", "gcp"),
];

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

function getRegionLabel(plan: PlanInput, provider: CloudPostgresProvider) {
  if (plan.regionId === "other") {
    return plan.customRegion.trim() || "Other region";
  }

  return getCloudPostgresOptionLabel(provider.regions, plan.regionId);
}

function getDisplayName(plan: PlanInput) {
  const provider = getCloudPostgresProvider(plan.providerId);
  return `${provider.serviceName} — ${getRegionLabel(plan, provider)}`;
}

export default function ToolClient() {
  const [primaryServers, setPrimaryServers] = useState("1");
  const [hoursPerMonth, setHoursPerMonth] = useState("730");
  const [vcpuPerNode, setVcpuPerNode] = useState("4");
  const [memoryGbPerNode, setMemoryGbPerNode] = useState("16");
  const [readReplicasPerPrimary, setReadReplicasPerPrimary] =
    useState("1");

  const [storageGbPerPrimary, setStorageGbPerPrimary] =
    useState("500");
  const [monthlyStorageGrowthGb, setMonthlyStorageGrowthGb] =
    useState("25");
  const [provisionedIopsPerNode, setProvisionedIopsPerNode] =
    useState("3000");
  const [monthlyIoRequestsMillions, setMonthlyIoRequestsMillions] =
    useState("100");
  const [totalBackupStorageGb, setTotalBackupStorageGb] =
    useState("600");
  const [outboundDataGb, setOutboundDataGb] = useState("500");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const [plans, setPlans] = useState<PlanInput[]>(initialPlans);
  const [selectedPlanId, setSelectedPlanId] = useState("plan-a");
  const [activeEditorPlanId, setActiveEditorPlanId] =
    useState("plan-a");

  const updatePlan = (
    planId: string,
    field: keyof PlanInput,
    value: string,
  ) => {
    setPlans((current) =>
      current.map((plan) =>
        plan.id === planId ? { ...plan, [field]: value } : plan,
      ),
    );
  };

  const changeProvider = (planId: string, providerId: string) => {
    const provider = getCloudPostgresProvider(providerId);

    setPlans((current) =>
      current.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              providerId: provider.id,
              regionId: provider.defaults.regionId,
              customRegion: "",
              availabilityId: provider.defaults.availabilityId,
              computeTierId: provider.defaults.computeTierId,
              storageTypeId: provider.defaults.storageTypeId,
              pricingModeId: provider.defaults.pricingModeId,
              combinedNodeHourlyPrice: "",
              vcpuHourlyPrice: "",
              memoryGbHourlyPrice: "",
            }
          : plan,
      ),
    );
  };

  const result = useMemo(() => {
    const primaries = toNumber(primaryServers);
    const hours = toNumber(hoursPerMonth);
    const vcpu = toNumber(vcpuPerNode);
    const memoryGb = toNumber(memoryGbPerNode);
    const replicasPerPrimary = toNumber(readReplicasPerPrimary);
    const storagePerPrimary = toNumber(storageGbPerPrimary);
    const storageGrowthPerMonth = toNumber(monthlyStorageGrowthGb);
    const iopsPerNode = toNumber(provisionedIopsPerNode);
    const ioRequestsMillions = toNumber(monthlyIoRequestsMillions);
    const backupStorageGb = toNumber(totalBackupStorageGb);
    const egressGb = toNumber(outboundDataGb);
    const budget = toNumber(monthlyBudget);

    const rows: PlanResult[] = plans.map((plan) => {
      const provider = getCloudPostgresProvider(plan.providerId);
      const availability = getAvailabilityOption(
        provider,
        plan.availabilityId,
      );

      const highAvailabilityNodes =
        primaries * availability.nodeMultiplier;
      const readReplicaNodes = primaries * replicasPerPrimary;
      const totalNodes = highAvailabilityNodes + readReplicaNodes;
      const totalNodeHours = totalNodes * hours;

      const splitNodeHourlyRate =
        vcpu * toNumber(plan.vcpuHourlyPrice) +
        memoryGb * toNumber(plan.memoryGbHourlyPrice);
      const nodeHourlyRate =
        plan.pricingModeId === "combined"
          ? toNumber(plan.combinedNodeHourlyPrice)
          : splitNodeHourlyRate;

      const grossComputeCost = totalNodeHours * nodeHourlyRate;
      const commitmentSaving =
        grossComputeCost *
        (clampPercent(plan.commitmentDiscountPercent) / 100);
      const computeCost = grossComputeCost - commitmentSaving;

      const currentStoredGb = storagePerPrimary * totalNodes;
      const storageCost =
        currentStoredGb * toNumber(plan.storagePricePerGbMonth);

      const provisionedIops = iopsPerNode * totalNodes;
      const iopsCost =
        provisionedIops * toNumber(plan.iopsPricePerIopsMonth);
      const ioRequestCost =
        ioRequestsMillions * toNumber(plan.ioRequestPricePerMillion);

      const includedBackupStorageGb = toNumber(
        plan.includedBackupStorageGb,
      );
      const billableBackupStorageGb = Math.max(
        0,
        backupStorageGb - includedBackupStorageGb,
      );
      const backupCost =
        billableBackupStorageGb *
        toNumber(plan.backupPricePerGbMonth);

      const egressCost = egressGb * toNumber(plan.egressPricePerGb);
      const publicIpCost = toNumber(plan.publicIpMonthlyCost);
      const extendedSupportCost =
        totalNodeHours *
        vcpu *
        toNumber(plan.extendedSupportPricePerVcpuHour);
      const fixedMonthlyCost = toNumber(plan.fixedMonthlyCost);

      const oneTimeMigrationCost = toNumber(plan.oneTimeMigrationCost);
      const migrationMonths = Math.max(
        1,
        toNumber(plan.migrationAmortizationMonths),
      );
      const amortizedMigrationCost =
        oneTimeMigrationCost / migrationMonths;

      const monthlyOperatingCost =
        computeCost +
        storageCost +
        iopsCost +
        ioRequestCost +
        backupCost +
        egressCost +
        publicIpCost +
        extendedSupportCost +
        fixedMonthlyCost;

      const monthlyPlanningCost =
        monthlyOperatingCost + amortizedMigrationCost;

      let firstYearStorageCost = 0;
      for (let month = 0; month < 12; month += 1) {
        const monthStoragePerPrimary =
          storagePerPrimary + storageGrowthPerMonth * month;
        firstYearStorageCost +=
          monthStoragePerPrimary *
          totalNodes *
          toNumber(plan.storagePricePerGbMonth);
      }

      const recurringWithoutStorage =
        computeCost +
        iopsCost +
        ioRequestCost +
        backupCost +
        egressCost +
        publicIpCost +
        extendedSupportCost +
        fixedMonthlyCost;

      const firstYearCost =
        recurringWithoutStorage * 12 +
        firstYearStorageCost +
        oneTimeMigrationCost;

      const endOfYearStoredGb =
        (storagePerPrimary + storageGrowthPerMonth * 11) * totalNodes;

      const combinedPriceEntered =
        plan.combinedNodeHourlyPrice.trim() !== "";
      const splitPriceEntered =
        plan.vcpuHourlyPrice.trim() !== "" ||
        plan.memoryGbHourlyPrice.trim() !== "";
      const computePriceEntered =
        plan.pricingModeId === "combined"
          ? combinedPriceEntered
          : splitPriceEntered;

      const enteredPriceCount = [
        computePriceEntered ? "entered" : "",
        plan.storagePricePerGbMonth,
        plan.iopsPricePerIopsMonth,
        plan.ioRequestPricePerMillion,
        plan.backupPricePerGbMonth,
        plan.egressPricePerGb,
        plan.publicIpMonthlyCost,
        plan.extendedSupportPricePerVcpuHour,
        plan.fixedMonthlyCost,
        plan.oneTimeMigrationCost,
      ].filter((value) => value.trim() !== "").length;

      const configured =
        computePriceEntered || plan.storagePricePerGbMonth.trim() !== "";

      return {
        id: plan.id,
        providerId: provider.id,
        providerName: provider.providerName,
        serviceName: provider.serviceName,
        displayName: getDisplayName(plan),
        regionLabel: getRegionLabel(plan, provider),
        availabilityLabel: availability.label,
        availabilityDescription: availability.description,
        computeTierLabel: getCloudPostgresOptionLabel(
          provider.computeTiers,
          plan.computeTierId,
        ),
        storageTypeLabel: getCloudPostgresOptionLabel(
          provider.storageTypes,
          plan.storageTypeId,
        ),
        configured,
        availabilityNodeMultiplier: availability.nodeMultiplier,
        highAvailabilityNodes,
        readReplicaNodes,
        totalNodes,
        totalNodeHours,
        grossComputeCost,
        commitmentSaving,
        computeCost,
        storageCost,
        iopsCost,
        ioRequestCost,
        billableBackupStorageGb,
        backupCost,
        egressCost,
        publicIpCost,
        extendedSupportCost,
        fixedMonthlyCost,
        oneTimeMigrationCost,
        amortizedMigrationCost,
        monthlyOperatingCost,
        monthlyPlanningCost,
        firstYearCost,
        currentStoredGb,
        endOfYearStoredGb,
        costPerNodeHour:
          totalNodeHours > 0
            ? monthlyPlanningCost / totalNodeHours
            : 0,
        costPerVcpuHour:
          totalNodeHours > 0 && vcpu > 0
            ? monthlyPlanningCost / (totalNodeHours * vcpu)
            : 0,
        costPerStoredTb:
          currentStoredGb > 0
            ? monthlyPlanningCost / (currentStoredGb / 1024)
            : 0,
        budgetDifference: budget - monthlyPlanningCost,
        enteredPriceCount,
      };
    });

    const configuredRows = rows
      .filter((row) => row.configured)
      .sort(
        (a, b) =>
          a.monthlyPlanningCost - b.monthlyPlanningCost,
      );

    const selected =
      rows.find((row) => row.id === selectedPlanId) ?? rows[0];
    const cheapest = configuredRows[0] ?? null;

    const comparisonRows = [...rows].sort((a, b) => {
      if (a.configured && !b.configured) return -1;
      if (!a.configured && b.configured) return 1;
      return a.monthlyPlanningCost - b.monthlyPlanningCost;
    });

    return {
      primaries,
      hours,
      vcpu,
      memoryGb,
      replicasPerPrimary,
      storagePerPrimary,
      storageGrowthPerMonth,
      iopsPerNode,
      ioRequestsMillions,
      backupStorageGb,
      egressGb,
      rows,
      configuredRows,
      comparisonRows,
      selected,
      cheapest,
      hasBudget: monthlyBudget.trim() !== "",
      monthlySavingVsSelected:
        selected.configured && cheapest
          ? selected.monthlyPlanningCost -
            cheapest.monthlyPlanningCost
          : 0,
      firstYearSavingVsSelected:
        selected.configured && cheapest
          ? selected.firstYearCost - cheapest.firstYearCost
          : 0,
    };
  }, [
    hoursPerMonth,
    memoryGbPerNode,
    monthlyBudget,
    monthlyIoRequestsMillions,
    monthlyStorageGrowthGb,
    outboundDataGb,
    plans,
    primaryServers,
    provisionedIopsPerNode,
    readReplicasPerPrimary,
    selectedPlanId,
    storageGbPerPrimary,
    totalBackupStorageGb,
    vcpuPerNode,
  ]);

  const selectedPlanInput =
    plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const selectedProvider = getCloudPostgresProvider(
    selectedPlanInput.providerId,
  );
  const selectedResult = result.selected;
  const selectedAvailability = getAvailabilityOption(
    selectedProvider,
    selectedPlanInput.availabilityId,
  );
  const selectedCombinedPricing =
    selectedPlanInput.pricingModeId === "combined";

  const selectedRows: CostRow[] = [
    {
      label: "Database compute",
      detail: `${formatNumber(
        selectedResult.totalNodeHours,
      )} node-hours across ${formatNumber(
        selectedResult.totalNodes,
      )} nodes`,
      value: selectedResult.computeCost,
      entered: selectedCombinedPricing
        ? selectedPlanInput.combinedNodeHourlyPrice.trim() !== ""
        : selectedPlanInput.vcpuHourlyPrice.trim() !== "" ||
          selectedPlanInput.memoryGbHourlyPrice.trim() !== "",
    },
    {
      label: "Database storage",
      detail: `${formatNumber(
        selectedResult.currentStoredGb,
      )} GB-months across primary, standby, and replica nodes`,
      value: selectedResult.storageCost,
      entered:
        selectedPlanInput.storagePricePerGbMonth.trim() !== "",
    },
    {
      label: "Provisioned IOPS",
      detail: `${formatInteger(
        result.iopsPerNode * selectedResult.totalNodes,
      )} provisioned IOPS across database nodes`,
      value: selectedResult.iopsCost,
      entered:
        selectedPlanInput.iopsPricePerIopsMonth.trim() !== "",
    },
    {
      label: "Billable I/O requests",
      detail: `${formatNumber(
        result.ioRequestsMillions,
      )} million monthly requests`,
      value: selectedResult.ioRequestCost,
      entered:
        selectedPlanInput.ioRequestPricePerMillion.trim() !== "",
    },
    {
      label: "Backup and snapshot storage",
      detail: `${formatNumber(
        selectedResult.billableBackupStorageGb,
      )} billable GB after the entered allowance`,
      value: selectedResult.backupCost,
      entered:
        selectedPlanInput.backupPricePerGbMonth.trim() !== "",
    },
    {
      label: "Outbound data transfer",
      detail: `${formatNumber(result.egressGb)} GB per month`,
      value: selectedResult.egressCost,
      entered: selectedPlanInput.egressPricePerGb.trim() !== "",
    },
    {
      label: "Public IP or network fixed cost",
      detail: "Optional monthly public endpoint or network charge",
      value: selectedResult.publicIpCost,
      entered: selectedPlanInput.publicIpMonthlyCost.trim() !== "",
    },
    {
      label: "Extended PostgreSQL support",
      detail: `${formatNumber(
        selectedResult.totalNodeHours * result.vcpu,
      )} vCPU-hours`,
      value: selectedResult.extendedSupportCost,
      entered:
        selectedPlanInput.extendedSupportPricePerVcpuHour.trim() !== "",
    },
    {
      label: "Other fixed monthly services",
      detail: "Monitoring, proxy, security, support allocation, or management",
      value: selectedResult.fixedMonthlyCost,
      entered: selectedPlanInput.fixedMonthlyCost.trim() !== "",
    },
    {
      label: "Amortised migration",
      detail: `${formatMoney(
        selectedResult.oneTimeMigrationCost,
      )} spread across ${formatInteger(
        Math.max(
          1,
          toNumber(selectedPlanInput.migrationAmortizationMonths),
        ),
      )} months`,
      value: selectedResult.amortizedMigrationCost,
      entered:
        selectedPlanInput.oneTimeMigrationCost.trim() !== "",
    },
  ];

  const planOptions = plans.map((plan, index) => ({
    value: plan.id,
    label: `Plan ${index + 1}: ${getDisplayName(plan)}`,
  }));

  const activeEditorPlan =
    plans.find((plan) => plan.id === activeEditorPlanId) ?? plans[0];
  const activeEditorPlanNumber =
    plans.findIndex((plan) => plan.id === activeEditorPlan.id) + 1;

  const openPlanEditor = (planId: string) => {
    setActiveEditorPlanId(planId);
    setSelectedPlanId(planId);
  };

  const reset = () => {
    setPrimaryServers("1");
    setHoursPerMonth("730");
    setVcpuPerNode("4");
    setMemoryGbPerNode("16");
    setReadReplicasPerPrimary("1");
    setStorageGbPerPrimary("500");
    setMonthlyStorageGrowthGb("25");
    setProvisionedIopsPerNode("3000");
    setMonthlyIoRequestsMillions("100");
    setTotalBackupStorageGb("600");
    setOutboundDataGb("500");
    setMonthlyBudget("");
    setPlans(initialPlans.map((plan) => ({ ...plan })));
    setSelectedPlanId("plan-a");
    setActiveEditorPlanId("plan-a");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter the Shared PostgreSQL Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Use the same node size, storage, IOPS, backup, and transfer
            workload for every provider plan.
          </p>
        </div>

        <FieldSection title="Database Nodes and Runtime">
          <BeeijaNumberField
            label="Primary database servers"
            value={primaryServers}
            onChange={setPrimaryServers}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Billable hours per node each month"
            value={hoursPerMonth}
            onChange={setHoursPerMonth}
            min="0"
            step="1"
            suffix="hr"
          />

          <BeeijaNumberField
            label="vCPUs per database node"
            value={vcpuPerNode}
            onChange={setVcpuPerNode}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Memory per database node"
            value={memoryGbPerNode}
            onChange={setMemoryGbPerNode}
            min="0"
            step="0.1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Read replicas per primary server"
            value={readReplicasPerPrimary}
            onChange={setReadReplicasPerPrimary}
            min="0"
            step="1"
          />
        </FieldSection>

        <FieldSection title="Storage, I/O, Backup, and Network">
          <BeeijaNumberField
            label="Database storage per primary server"
            value={storageGbPerPrimary}
            onChange={setStorageGbPerPrimary}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Monthly storage growth per primary"
            value={monthlyStorageGrowthGb}
            onChange={setMonthlyStorageGrowthGb}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Provisioned IOPS per database node"
            value={provisionedIopsPerNode}
            onChange={setProvisionedIopsPerNode}
            min="0"
            step="1"
            suffix="IOPS"
          />

          <BeeijaNumberField
            label="Billable I/O requests per month"
            value={monthlyIoRequestsMillions}
            onChange={setMonthlyIoRequestsMillions}
            min="0"
            step="0.1"
            suffix="million"
          />

          <BeeijaNumberField
            label="Total backup and snapshot storage"
            value={totalBackupStorageGb}
            onChange={setTotalBackupStorageGb}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Outbound data transfer per month"
            value={outboundDataGb}
            onChange={setOutboundDataGb}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Target monthly PostgreSQL budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Shared workload before provider availability settings
          </p>

          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>Primary servers: {formatNumber(result.primaries)}</p>
            <p>Read replicas per primary: {formatNumber(result.replicasPerPrimary)}</p>
            <p>Node size: {formatNumber(result.vcpu)} vCPU / {formatNumber(result.memoryGb)} GB</p>
            <p>Hours per node: {formatNumber(result.hours)}</p>
            <p>Storage per primary: {formatNumber(result.storagePerPrimary)} GB</p>
            <p>Monthly storage growth: {formatNumber(result.storageGrowthPerMonth)} GB</p>
            <p>Backup storage: {formatNumber(result.backupStorageGb)} GB</p>
            <p>Outbound data: {formatNumber(result.egressGb)} GB</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-950">
            Select Provider Configurations and Enter Prices
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Choose a provider, region, availability mode, compute tier,
            storage type, and pricing basis. Current price fields remain blank.
          </p>
        </div>

        <div className="mt-6">
          <div
            className="grid gap-2 sm:grid-cols-3"
            role="tablist"
            aria-label="PostgreSQL comparison plans"
          >
            {plans.map((plan, index) => {
              const isActive = plan.id === activeEditorPlanId;
              const provider = getCloudPostgresProvider(plan.providerId);

              return (
                <button
                  key={plan.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => openPlanEditor(plan.id)}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-[var(--green)] bg-[#F5FAF7] shadow-sm"
                      : "border-gray-200 bg-white hover:border-[var(--green)]"
                  }`}
                >
                  <span className="block text-xs font-medium uppercase tracking-wide text-[var(--yellow-dark)]">
                    Plan {index + 1}
                  </span>
                  <span className="mt-1 block font-semibold text-gray-950">
                    {provider.shortLabel}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    {getRegionLabel(plan, provider)}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="mt-5"
            role="tabpanel"
            aria-label={`Comparison plan ${activeEditorPlanNumber}`}
          >
            <PlanEditor
              key={activeEditorPlan.id}
              planNumber={activeEditorPlanNumber}
              plan={activeEditorPlan}
              onChange={(field, value) =>
                updatePlan(activeEditorPlan.id, field, value)
              }
              onProviderChange={(providerId) =>
                changeProvider(activeEditorPlan.id, providerId)
              }
            />
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Select Plan 1, 2, or 3 above to edit it. All three plans remain
            included in the ranked comparison.
          </p>
        </div>

        <button
          type="button"
          onClick={reset}
          className="beeija-btn-outline mt-7"
        >
          Reset values
        </button>
      </section>

      <BeeijaCalculatorResultPanel
        title="Managed PostgreSQL Cost Comparison"
        description="Select a plan for a detailed breakdown. Configured plans are ranked by monthly planning cost."
        primaryLabel="Selected monthly planning cost"
        primaryValue={
          selectedResult.configured
            ? formatMoney(selectedResult.monthlyPlanningCost)
            : "Enter compute or storage prices"
        }
        stats={
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultStat
              label="Cost per node-hour"
              value={
                selectedResult.configured
                  ? formatMoney(selectedResult.costPerNodeHour)
                  : "—"
              }
            />

            <ResultStat
              label="Cost per stored TB"
              value={
                selectedResult.configured
                  ? formatMoney(selectedResult.costPerStoredTb)
                  : "—"
              }
            />

            <ResultStat
              label="First-year cost"
              value={
                selectedResult.configured
                  ? formatMoney(selectedResult.firstYearCost)
                  : "—"
              }
            />
          </div>
        }
        breakdown={
          <div className="space-y-6">
            <BeeijaSelect
              label="Detailed plan"
              value={selectedPlanId}
              onChange={(event) =>
                setSelectedPlanId(event.target.value)
              }
              options={planOptions}
            />

            <div className="rounded-xl border border-gray-200 bg-[#F5FAF7] p-4 text-sm text-gray-700">
              <p className="font-medium text-gray-900">
                {selectedResult.displayName}
              </p>
              <p className="mt-1">
                {selectedResult.availabilityLabel} · {selectedResult.computeTierLabel}
              </p>
              <p className="mt-1">{selectedResult.storageTypeLabel}</p>
              <p className="mt-2 text-xs text-gray-500">
                {selectedAvailability.description}
              </p>
            </div>

            <div className="space-y-4">
              {selectedRows.map((row) => (
                <BreakdownRow
                  key={row.label}
                  label={row.label}
                  detail={row.detail}
                  value={row.value}
                  entered={row.entered}
                />
              ))}
            </div>

            <ComparisonTable rows={result.comparisonRows} />
          </div>
        }
        totals={
          <div className="text-sm leading-relaxed text-gray-600">
            <p>
              Selected plan:{" "}
              <span className="font-medium text-gray-900">
                {selectedResult.displayName}
              </span>
            </p>

            <p className="mt-2">
              Billable database nodes:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(selectedResult.totalNodes)}
              </span>
            </p>

            <p className="mt-2">
              HA and primary nodes:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(selectedResult.highAvailabilityNodes)}
              </span>
            </p>

            <p className="mt-2">
              Read replica nodes:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(selectedResult.readReplicaNodes)}
              </span>
            </p>

            <p className="mt-2">
              Compute saving from entered commitment:{" "}
              <span className="font-semibold text-[var(--green)]">
                {selectedResult.configured
                  ? formatMoney(selectedResult.commitmentSaving)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Current stored data across nodes:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(selectedResult.currentStoredGb)} GB
              </span>
            </p>

            <p className="mt-2">
              End-of-year stored data across nodes:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(selectedResult.endOfYearStoredGb)} GB
              </span>
            </p>

            <p className="mt-2">
              All-in cost per vCPU-hour:{" "}
              <span className="font-medium text-gray-900">
                {selectedResult.configured && result.vcpu > 0
                  ? formatMoney(selectedResult.costPerVcpuHour)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Lowest configured plan:{" "}
              <span className="font-medium text-gray-900">
                {result.cheapest
                  ? `${result.cheapest.displayName} at ${formatMoney(
                      result.cheapest.monthlyPlanningCost,
                    )} per month`
                  : "Enter at least one compute or storage price"}
              </span>
            </p>

            <p className="mt-2">
              Possible monthly saving against selected plan:{" "}
              <span className="font-semibold text-[var(--green)]">
                {selectedResult.configured && result.cheapest
                  ? formatMoney(result.monthlySavingVsSelected)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Possible first-year saving:{" "}
              <span className="font-semibold text-[var(--green)]">
                {selectedResult.configured && result.cheapest
                  ? formatMoney(result.firstYearSavingVsSelected)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Selected plan price inputs entered:{" "}
              <span className="font-medium text-gray-900">
                {selectedResult.enteredPriceCount} of 10
              </span>
            </p>

            <p className="mt-2">
              Budget status:{" "}
              <span
                className={`font-semibold ${
                  result.hasBudget &&
                  selectedResult.configured &&
                  selectedResult.budgetDifference < 0
                    ? "text-red-700"
                    : "text-[var(--green)]"
                }`}
              >
                {!result.hasBudget
                  ? "Add a budget to compare"
                  : !selectedResult.configured
                    ? "Enter current prices"
                    : selectedResult.budgetDifference >= 0
                      ? `${formatMoney(
                          selectedResult.budgetDifference,
                        )} remaining`
                      : `${formatMoney(
                          Math.abs(selectedResult.budgetDifference),
                        )} over budget`}
              </span>
            </p>
          </div>
        }
        provider="Amazon RDS for PostgreSQL, Azure Database for PostgreSQL Flexible Server, and Google Cloud SQL for PostgreSQL"
        excludedCosts="taxes, support plans, private connectivity, NAT gateways, connection proxies, cross-zone application traffic, log ingestion, database administration labour, negotiated credits, and services not entered"
        noticeText="No provider price is hardcoded. Enter current effective prices for the exact region, availability mode, compute tier, storage type, commitment, currency, and billing agreement. Provider configuration options were checked against official documentation in June 2026, but availability can change. Blank optional price fields are treated as zero."
      />
    </div>
  );
}

function PlanEditor({
  planNumber,
  plan,
  onChange,
  onProviderChange,
}: {
  planNumber: number;
  plan: PlanInput;
  onChange: (field: keyof PlanInput, value: string) => void;
  onProviderChange: (providerId: string) => void;
}) {
  const provider = getCloudPostgresProvider(plan.providerId);
  const availability = getAvailabilityOption(
    provider,
    plan.availabilityId,
  );
  const combinedPricing = plan.pricingModeId === "combined";

  const providerOptions = cloudPostgresProviders.map((item) => ({
    value: item.id,
    label: `${item.providerName} — ${item.serviceName}`,
  }));

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--yellow-dark)]">
          Comparison plan {planNumber}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-gray-950">
          {provider.serviceName}
        </h3>
      </div>

      <div className="grid items-start gap-5 md:grid-cols-2 md:[&>div>label:first-child]:flex md:[&>div>label:first-child]:min-h-[2.7rem] md:[&>div>label:first-child]:items-end md:[&>label>span:first-child]:flex md:[&>label>span:first-child]:min-h-[2.7rem] md:[&>label>span:first-child]:items-end">
        <BeeijaSelect
          label="Managed PostgreSQL provider"
          value={plan.providerId}
          onChange={(event) => onProviderChange(event.target.value)}
          options={providerOptions}
        />

        <BeeijaSelect
          label="Region"
          value={plan.regionId}
          onChange={(event) => onChange("regionId", event.target.value)}
          options={provider.regions}
        />

        {plan.regionId === "other" ? (
          <TextField
            label="Enter the exact provider region"
            value={plan.customRegion}
            onChange={(value) => onChange("customRegion", value)}
          />
        ) : null}

        <BeeijaSelect
          label="Availability and standby mode"
          value={plan.availabilityId}
          onChange={(event) =>
            onChange("availabilityId", event.target.value)
          }
          options={provider.availabilityOptions}
        />

        <BeeijaSelect
          label="Compute tier or instance family"
          value={plan.computeTierId}
          onChange={(event) =>
            onChange("computeTierId", event.target.value)
          }
          options={provider.computeTiers}
        />

        <BeeijaSelect
          label="Database storage type"
          value={plan.storageTypeId}
          onChange={(event) =>
            onChange("storageTypeId", event.target.value)
          }
          options={provider.storageTypes}
        />

        <BeeijaSelect
          label="Compute pricing basis"
          value={plan.pricingModeId}
          onChange={(event) =>
            onChange("pricingModeId", event.target.value)
          }
          options={provider.pricingModes}
        />
      </div>

      <div className="mt-5 rounded-xl border-l-4 border-[#F2C94C] bg-[#FFFBEA] px-4 py-3 text-sm text-gray-700">
        {availability.description} The workload adds read replicas separately.
      </div>

      <div className="mt-7">
        <h4 className="font-semibold text-gray-950">
          Enter Current Prices for This Configuration
        </h4>
        <p className="mt-2 text-sm text-gray-600">
          {getRegionLabel(plan, provider)} · {availability.label} ·{" "}
          {getCloudPostgresOptionLabel(
            provider.computeTiers,
            plan.computeTierId,
          )}
        </p>
      </div>

      <div className="mt-5 grid items-start gap-5 md:grid-cols-2 md:[&>label>span:first-child]:flex md:[&>label>span:first-child]:min-h-[2.7rem] md:[&>label>span:first-child]:items-end">
        <BeeijaNumberField
          label="Combined database node price per hour"
          value={plan.combinedNodeHourlyPrice}
          onChange={(value) =>
            onChange("combinedNodeHourlyPrice", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
          disabled={!combinedPricing}
        />

        <BeeijaNumberField
          label="vCPU or vCore price per hour"
          value={plan.vcpuHourlyPrice}
          onChange={(value) => onChange("vcpuHourlyPrice", value)}
          min="0"
          step="0.0001"
          prefix="$"
          disabled={combinedPricing}
        />

        <BeeijaNumberField
          label="Memory price per GB-hour"
          value={plan.memoryGbHourlyPrice}
          onChange={(value) => onChange("memoryGbHourlyPrice", value)}
          min="0"
          step="0.0001"
          prefix="$"
          disabled={combinedPricing}
        />

        <BeeijaNumberField
          label="Compute commitment or reservation discount"
          value={plan.commitmentDiscountPercent}
          onChange={(value) =>
            onChange("commitmentDiscountPercent", value)
          }
          min="0"
          max="100"
          step="0.1"
          suffix="%"
        />

        <BeeijaNumberField
          label="Database storage price per GB-month"
          value={plan.storagePricePerGbMonth}
          onChange={(value) =>
            onChange("storagePricePerGbMonth", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Provisioned IOPS price per IOPS-month"
          value={plan.iopsPricePerIopsMonth}
          onChange={(value) =>
            onChange("iopsPricePerIopsMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Billable I/O request price per million"
          value={plan.ioRequestPricePerMillion}
          onChange={(value) =>
            onChange("ioRequestPricePerMillion", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Included backup storage"
          value={plan.includedBackupStorageGb}
          onChange={(value) =>
            onChange("includedBackupStorageGb", value)
          }
          min="0"
          step="1"
          suffix="GB"
        />

        <BeeijaNumberField
          label="Extra backup storage price per GB-month"
          value={plan.backupPricePerGbMonth}
          onChange={(value) =>
            onChange("backupPricePerGbMonth", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Effective outbound data price per GB"
          value={plan.egressPricePerGb}
          onChange={(value) => onChange("egressPricePerGb", value)}
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Public IP or network fixed cost per month"
          value={plan.publicIpMonthlyCost}
          onChange={(value) =>
            onChange("publicIpMonthlyCost", value)
          }
          min="0"
          step="1"
          prefix="$"
        />

        <BeeijaNumberField
          label="Extended support price per vCPU-hour"
          value={plan.extendedSupportPricePerVcpuHour}
          onChange={(value) =>
            onChange("extendedSupportPricePerVcpuHour", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Other fixed monthly database services"
          value={plan.fixedMonthlyCost}
          onChange={(value) => onChange("fixedMonthlyCost", value)}
          min="0"
          step="1"
          prefix="$"
        />

        <BeeijaNumberField
          label="One-time PostgreSQL migration cost"
          value={plan.oneTimeMigrationCost}
          onChange={(value) =>
            onChange("oneTimeMigrationCost", value)
          }
          min="0"
          step="1"
          prefix="$"
        />

        <BeeijaNumberField
          label="Migration amortisation period"
          value={plan.migrationAmortizationMonths}
          onChange={(value) =>
            onChange("migrationAmortizationMonths", value)
          }
          min="1"
          step="1"
          suffix="mo"
        />
      </div>
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

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition hover:border-gray-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
      />
    </label>
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

function ComparisonTable({ rows }: { rows: PlanResult[] }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-950">
        Ranked provider comparison
      </h3>

      <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Configuration
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Nodes
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Monthly total
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  First year
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td className="min-w-64 px-4 py-4 align-top">
                    <p className="font-medium text-gray-900">
                      {row.configured && index === 0
                        ? "Lowest configured · "
                        : ""}
                      {row.serviceName}
                    </p>
                    <p className="mt-1 text-gray-600">
                      {row.regionLabel}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {row.availabilityLabel}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {row.computeTierLabel} · {row.storageTypeLabel}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      {row.configured
                        ? `${row.enteredPriceCount} price inputs entered`
                        : "Enter a compute or storage price"}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-gray-900">
                    {formatNumber(row.totalNodes)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-950">
                    {row.configured
                      ? formatMoney(row.monthlyPlanningCost)
                      : "—"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-gray-900">
                    {row.configured ? formatMoney(row.firstYearCost) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import BeeijaAdvancedSection from "@/app/components/BeeijaAdvancedSection";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaResultLine from "@/app/components/BeeijaResultLine";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import {
  getAvailabilityOption,
  getCloudPostgresOptionLabel,
  getCloudPostgresProvider,
  type CloudPostgresOption,
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

type ProviderDisplay = {
  providerName: string;
  serviceName: string;
  shortName: string;
};

const providerDisplayById: Record<string, ProviderDisplay> = {
  aws: {
    providerName: "Amazon Web Services",
    serviceName: "Amazon RDS for PostgreSQL",
    shortName: "AWS",
  },
  azure: {
    providerName: "Microsoft Azure",
    serviceName: "Azure Database for PostgreSQL",
    shortName: "Azure",
  },
  gcp: {
    providerName: "Google Cloud",
    serviceName: "Cloud SQL for PostgreSQL",
    shortName: "Google Cloud",
  },
};

function getProviderDisplay(provider: CloudPostgresProvider): ProviderDisplay {
  return (
    providerDisplayById[provider.id] ?? {
      providerName: provider.providerName,
      serviceName: provider.serviceName,
      shortName: provider.providerName,
    }
  );
}

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

function shortenRegionLabel(label: string) {
  return label
    .replace(/\s+—\s+[a-z]{2,}(?:-[a-z]+)*-?\d*$/i, "")
    .replace(/\s+—\s+[a-z]+[a-z0-9-]*$/i, "")
    .trim();
}

function getRegionOptions(provider: CloudPostgresProvider) {
  return provider.regions.map((option) => ({
    ...option,
    label: option.value === "other" ? option.label : shortenRegionLabel(option.label),
  }));
}

function shortenOptionLabel(label: string) {
  const replacements: Record<string, string> = {
    "Multi-AZ deployment — one standby": "Multi-AZ — one standby",
    "Multi-AZ DB cluster — two readable standbys":
      "Multi-AZ cluster — two readable standbys",
    "Same-zone high availability": "Same-zone HA",
    "Zone-redundant high availability": "Zone-redundant HA",
    "Regional high availability": "Regional HA",
    "Burstable instance family": "Burstable",
    "General-purpose instance family": "General purpose",
    "Memory-optimized instance family": "Memory optimized",
    "Other RDS instance family": "Other instance family",
    "Combined database instance hourly rate": "Combined node hourly rate",
    "Separate vCPU and memory hourly rates": "Separate vCPU and memory rates",
    "Separate vCore and memory hourly rates": "Separate vCore and memory rates",
    "Combined server hourly rate": "Combined node hourly rate",
    "Combined instance hourly rate": "Combined node hourly rate",
  };

  return replacements[label] ?? label;
}

function getCompactOptions(options: CloudPostgresOption[]) {
  return options.map((option) => ({
    ...option,
    label: shortenOptionLabel(option.label),
  }));
}

function getRegionLabel(plan: PlanInput, provider: CloudPostgresProvider) {
  if (plan.regionId === "other") {
    return plan.customRegion.trim() || "Other region";
  }

  return getCloudPostgresOptionLabel(getRegionOptions(provider), plan.regionId);
}

function getDisplayName(plan: PlanInput) {
  const provider = getCloudPostgresProvider(plan.providerId);
  return `${getProviderDisplay(provider).serviceName} — ${getRegionLabel(plan, provider)}`;
}

export default function ToolClient() {
  const [primaryServers, setPrimaryServers] = useState("1");
  const [hoursPerMonth, setHoursPerMonth] = useState("730");
  const [vcpuPerNode, setVcpuPerNode] = useState("4");
  const [memoryGbPerNode, setMemoryGbPerNode] = useState("16");
  const [readReplicasPerPrimary, setReadReplicasPerPrimary] = useState("1");
  const [storageGbPerPrimary, setStorageGbPerPrimary] = useState("500");
  const [monthlyStorageGrowthGb, setMonthlyStorageGrowthGb] = useState("25");
  const [provisionedIopsPerNode, setProvisionedIopsPerNode] = useState("3000");
  const [monthlyIoRequestsMillions, setMonthlyIoRequestsMillions] =
    useState("100");
  const [totalBackupStorageGb, setTotalBackupStorageGb] = useState("600");
  const [outboundDataGb, setOutboundDataGb] = useState("500");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [plans, setPlans] = useState<PlanInput[]>(initialPlans);
  const [selectedPlanId, setSelectedPlanId] = useState("plan-a");
  const [activeEditorPlanId, setActiveEditorPlanId] = useState("plan-a");

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
      const availability = getAvailabilityOption(provider, plan.availabilityId);
      const highAvailabilityNodes = primaries * availability.nodeMultiplier;
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
        grossComputeCost * (clampPercent(plan.commitmentDiscountPercent) / 100);
      const computeCost = grossComputeCost - commitmentSaving;

      const currentStoredGb = storagePerPrimary * totalNodes;
      const storageCost =
        currentStoredGb * toNumber(plan.storagePricePerGbMonth);

      const provisionedIops = iopsPerNode * totalNodes;
      const iopsCost =
        provisionedIops * toNumber(plan.iopsPricePerIopsMonth);
      const ioRequestCost =
        ioRequestsMillions * toNumber(plan.ioRequestPricePerMillion);

      const includedBackupStorageGb = toNumber(plan.includedBackupStorageGb);
      const billableBackupStorageGb = Math.max(
        0,
        backupStorageGb - includedBackupStorageGb,
      );
      const backupCost =
        billableBackupStorageGb * toNumber(plan.backupPricePerGbMonth);

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
      const amortizedMigrationCost = oneTimeMigrationCost / migrationMonths;

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
      const monthlyPlanningCost = monthlyOperatingCost + amortizedMigrationCost;

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
      const providerDisplay = getProviderDisplay(provider);

      return {
        id: plan.id,
        providerId: provider.id,
        providerName: providerDisplay.providerName,
        serviceName: providerDisplay.serviceName,
        displayName: getDisplayName(plan),
        regionLabel: getRegionLabel(plan, provider),
        availabilityLabel: shortenOptionLabel(availability.label),
        availabilityDescription: availability.description,
        computeTierLabel: shortenOptionLabel(
          getCloudPostgresOptionLabel(provider.computeTiers, plan.computeTierId),
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
          totalNodeHours > 0 ? monthlyPlanningCost / totalNodeHours : 0,
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
      .sort((a, b) => a.monthlyPlanningCost - b.monthlyPlanningCost);
    const selected = rows.find((row) => row.id === selectedPlanId) ?? rows[0];
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
          ? selected.monthlyPlanningCost - cheapest.monthlyPlanningCost
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
  const selectedProviderDisplay = getProviderDisplay(selectedProvider);
  const selectedResult = result.selected;
  const selectedCombinedPricing =
    selectedPlanInput.pricingModeId === "combined";

  const selectedRows: CostRow[] = [
    {
      label: "Database compute",
      detail: `${formatNumber(selectedResult.totalNodeHours)} node-hours across ${formatNumber(selectedResult.totalNodes)} nodes`,
      value: selectedResult.computeCost,
      entered: selectedCombinedPricing
        ? selectedPlanInput.combinedNodeHourlyPrice.trim() !== ""
        : selectedPlanInput.vcpuHourlyPrice.trim() !== "" ||
          selectedPlanInput.memoryGbHourlyPrice.trim() !== "",
    },
    {
      label: "Database storage",
      detail: `${formatNumber(selectedResult.currentStoredGb)} GB-months`,
      value: selectedResult.storageCost,
      entered: selectedPlanInput.storagePricePerGbMonth.trim() !== "",
    },
    {
      label: "Provisioned IOPS",
      detail: `${formatInteger(result.iopsPerNode * selectedResult.totalNodes)} IOPS across database nodes`,
      value: selectedResult.iopsCost,
      entered: selectedPlanInput.iopsPricePerIopsMonth.trim() !== "",
    },
    {
      label: "Billable I/O requests",
      detail: `${formatNumber(result.ioRequestsMillions)} million monthly requests`,
      value: selectedResult.ioRequestCost,
      entered: selectedPlanInput.ioRequestPricePerMillion.trim() !== "",
    },
    {
      label: "Backup and snapshot storage",
      detail: `${formatNumber(selectedResult.billableBackupStorageGb)} billable GB`,
      value: selectedResult.backupCost,
      entered: selectedPlanInput.backupPricePerGbMonth.trim() !== "",
    },
    {
      label: "Outbound data transfer",
      detail: `${formatNumber(result.egressGb)} GB per month`,
      value: selectedResult.egressCost,
      entered: selectedPlanInput.egressPricePerGb.trim() !== "",
    },
    {
      label: "Public IP or network cost",
      detail: "Optional monthly network charge",
      value: selectedResult.publicIpCost,
      entered: selectedPlanInput.publicIpMonthlyCost.trim() !== "",
    },
    {
      label: "Extended PostgreSQL support",
      detail: `${formatNumber(selectedResult.totalNodeHours * result.vcpu)} vCPU-hours`,
      value: selectedResult.extendedSupportCost,
      entered:
        selectedPlanInput.extendedSupportPricePerVcpuHour.trim() !== "",
    },
    {
      label: "Fixed monthly services",
      detail: "Monitoring, proxy, support, or management",
      value: selectedResult.fixedMonthlyCost,
      entered: selectedPlanInput.fixedMonthlyCost.trim() !== "",
    },
    {
      label: "Amortised migration",
      detail: `${formatMoney(selectedResult.oneTimeMigrationCost)} spread across ${formatInteger(Math.max(1, toNumber(selectedPlanInput.migrationAmortizationMonths)))} months`,
      value: selectedResult.amortizedMigrationCost,
      entered: selectedPlanInput.oneTimeMigrationCost.trim() !== "",
    },
  ];

  const activeEditorPlan =
    plans.find((plan) => plan.id === activeEditorPlanId) ?? plans[0];
  const activeProvider = getCloudPostgresProvider(activeEditorPlan.providerId);
  const activeProviderDisplay = getProviderDisplay(activeProvider);

  const openPlanEditor = (planId: string) => {
    setActiveEditorPlanId(planId);
    setSelectedPlanId(planId);
  };

  const resetActivePlanRates = () => {
    const defaultPlan =
      initialPlans.find((plan) => plan.id === activeEditorPlan.id) ??
      activeEditorPlan;

    setPlans((current) =>
      current.map((plan) =>
        plan.id === activeEditorPlan.id
          ? {
              ...plan,
              combinedNodeHourlyPrice: defaultPlan.combinedNodeHourlyPrice,
              vcpuHourlyPrice: defaultPlan.vcpuHourlyPrice,
              memoryGbHourlyPrice: defaultPlan.memoryGbHourlyPrice,
              commitmentDiscountPercent:
                defaultPlan.commitmentDiscountPercent,
              storagePricePerGbMonth: defaultPlan.storagePricePerGbMonth,
              iopsPricePerIopsMonth: defaultPlan.iopsPricePerIopsMonth,
              ioRequestPricePerMillion: defaultPlan.ioRequestPricePerMillion,
              includedBackupStorageGb: defaultPlan.includedBackupStorageGb,
              backupPricePerGbMonth: defaultPlan.backupPricePerGbMonth,
              egressPricePerGb: defaultPlan.egressPricePerGb,
              publicIpMonthlyCost: defaultPlan.publicIpMonthlyCost,
              extendedSupportPricePerVcpuHour:
                defaultPlan.extendedSupportPricePerVcpuHour,
              fixedMonthlyCost: defaultPlan.fixedMonthlyCost,
              oneTimeMigrationCost: defaultPlan.oneTimeMigrationCost,
              migrationAmortizationMonths:
                defaultPlan.migrationAmortizationMonths,
            }
          : plan,
      ),
    );
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
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--green)]">
              Configure workload
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              Select provider and enter current prices
            </h2>
            <p className="mt-2 text-base leading-7 text-slate-600">
              PostgreSQL pricing depends on node size, availability mode, read
              replicas, storage, IOPS, backups, outbound transfer, support, and
              migration costs. Beeija keeps provider rates editable so you can
              compare the same workload with current pricing.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {plans.map((plan) => {
              const provider = getCloudPostgresProvider(plan.providerId);
              const providerDisplay = getProviderDisplay(provider);
              const selected = plan.id === activeEditorPlanId;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => openPlanEditor(plan.id)}
                  className={`flex min-h-[88px] min-w-0 flex-col justify-center rounded-lg border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                    selected
                      ? "border-[var(--green)] bg-[#f4fbf6] shadow-sm"
                      : "border-slate-200 bg-white hover:border-[var(--green)]"
                  }`}
                >
                  <span className="block truncate text-base font-semibold text-slate-900">
                    {providerDisplay.providerName}
                  </span>
                  <span className="mt-1 block min-h-10 break-words text-sm leading-5 text-slate-600 [overflow-wrap:anywhere]">
                    {providerDisplay.serviceName}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <h3 className="text-base font-semibold text-slate-950">
              Shared PostgreSQL workload
            </h3>
            <p className="mt-1 text-base leading-7 text-slate-600">
              Use the same database workload for every provider so the
              comparison stays fair.
            </p>

            <div className="mt-3 grid items-start gap-3 sm:grid-cols-2">
              <BeeijaNumberField
                label="Primary database servers"
                value={primaryServers}
                onChange={setPrimaryServers}
                helper="Primary writer nodes."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Billable hours per node"
                value={hoursPerMonth}
                onChange={setHoursPerMonth}
                suffix="hours"
                helper="Use 730 for a full month."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="vCPUs per database node"
                value={vcpuPerNode}
                onChange={setVcpuPerNode}
                helper="Compute size per node."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Memory per database node"
                value={memoryGbPerNode}
                onChange={setMemoryGbPerNode}
                suffix="GB"
                helper="Memory size per node."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Read replicas per primary"
                value={readReplicasPerPrimary}
                onChange={setReadReplicasPerPrimary}
                helper="Replicas used for read scaling."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Target monthly PostgreSQL budget"
                value={monthlyBudget}
                onChange={setMonthlyBudget}
                prefix="$"
                helper="Optional monthly budget."
                sanitizeDecimal
              />
            </div>

            <BeeijaAdvancedSection
              className="mt-4"
              title="Storage, I/O, backup, and network assumptions"
              description="Open this for storage, IOPS, I/O requests, backups, storage growth, or outbound transfer."
            >
              <div className="grid items-start gap-3 sm:grid-cols-2">
                <BeeijaNumberField
                  label="Storage per primary server"
                  value={storageGbPerPrimary}
                  onChange={setStorageGbPerPrimary}
                  suffix="GB"
                  helper="Provisioned database storage."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Monthly storage growth"
                  value={monthlyStorageGrowthGb}
                  onChange={setMonthlyStorageGrowthGb}
                  suffix="GB"
                  helper="Expected monthly growth."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Provisioned IOPS per node"
                  value={provisionedIopsPerNode}
                  onChange={setProvisionedIopsPerNode}
                  suffix="IOPS"
                  helper="Use 0 when not billed separately."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Billable I/O requests"
                  value={monthlyIoRequestsMillions}
                  onChange={setMonthlyIoRequestsMillions}
                  suffix="million"
                  helper="Monthly billable requests."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Backup and snapshot storage"
                  value={totalBackupStorageGb}
                  onChange={setTotalBackupStorageGb}
                  suffix="GB"
                  helper="Total retained backup storage."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Outbound data transfer"
                  value={outboundDataGb}
                  onChange={setOutboundDataGb}
                  suffix="GB"
                  helper="Monthly billable outbound data."
                  sanitizeDecimal
                />
              </div>
            </BeeijaAdvancedSection>
          </div>

          <div className="mt-5 rounded-lg border-l-4 border-[#F2C94C] bg-[#FFFBEA] px-4 py-3 text-sm leading-6 text-slate-700">
            <p className="font-semibold text-slate-950">
              Shared workload summary
            </p>
            <div className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-2">
              <p>Primary servers: {formatNumber(result.primaries)}</p>
              <p>Read replicas: {formatNumber(result.replicasPerPrimary)}</p>
              <p>Total database nodes: {formatNumber(selectedResult.totalNodes)}</p>
              <p>
                Node size: {formatNumber(result.vcpu)} vCPU / {formatNumber(result.memoryGb)} GB
              </p>
              <p>Hours per node: {formatNumber(result.hours)}</p>
              <p>Storage per primary: {formatNumber(result.storagePerPrimary)} GB</p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-950">
                  {activeProviderDisplay.shortName} price inputs
                </h3>
              </div>
              <button
                type="button"
                onClick={resetActivePlanRates}
                className="beeija-btn-outline"
              >
                Reset rates
              </button>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use current {activeProviderDisplay.serviceName} rates for the
              exact region and configuration you are checking.
            </p>

            <div className="mt-4">
              <PlanEditor
                key={activeEditorPlan.id}
                plan={activeEditorPlan}
                onChange={(field, value) =>
                  updatePlan(activeEditorPlan.id, field, value)
                }
              />
            </div>
          </div>

          <button type="button" onClick={reset} className="beeija-btn-outline mt-7">
            Reset all values
          </button>
        </section>

        <aside className="min-w-0 space-y-4">
          <section className="min-w-0 rounded-lg border border-slate-200 bg-[#f8fcfa] p-4 shadow-sm sm:p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--green)]">
              Estimate summary
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {selectedProviderDisplay.shortName} monthly planning cost
            </h2>

            <div className="mt-4 rounded-lg border border-[#d7eadf] bg-white p-4">
              <p className="text-base text-slate-500">
                Estimated monthly cost
              </p>
              <p className="mt-2 truncate text-3xl font-semibold tracking-tight text-[var(--green)]">
                {selectedResult.configured
                  ? formatMoney(selectedResult.monthlyPlanningCost)
                  : "Enter database price"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Planning estimate before taxes, support plans, credits,
                currency conversion, negotiated discounts, and provider-specific
                billing rules.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <BeeijaResultLine
                label="Database compute"
                value={
                  selectedResult.configured
                    ? formatMoney(selectedResult.computeCost)
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Database storage"
                value={
                  selectedResult.configured
                    ? formatMoney(selectedResult.storageCost)
                    : "—"
                }
              />
              <BeeijaResultLine
                label="IOPS and I/O requests"
                value={
                  selectedResult.configured
                    ? formatMoney(selectedResult.iopsCost + selectedResult.ioRequestCost)
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Backup storage"
                value={
                  selectedResult.configured
                    ? formatMoney(selectedResult.backupCost)
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Outbound transfer"
                value={
                  selectedResult.configured
                    ? formatMoney(selectedResult.egressCost)
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Support, fixed services, and migration"
                value={
                  selectedResult.configured
                    ? formatMoney(
                        selectedResult.publicIpCost +
                          selectedResult.extendedSupportCost +
                          selectedResult.fixedMonthlyCost +
                          selectedResult.amortizedMigrationCost,
                      )
                    : "—"
                }
              />
            </div>
          </section>

          <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-xl font-semibold text-slate-950">
              Provider comparison
            </h2>
            <p className="mt-1 text-base leading-7 text-slate-600">
              Compare configured PostgreSQL plans using the same workload.
            </p>

            <div className="mt-4 space-y-2">
              {result.rows.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => openPlanEditor(row.id)}
                  className={`grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border px-3 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                    row.id === activeEditorPlanId
                      ? "border-[var(--green)] bg-[#f4fbf6]"
                      : "border-slate-200 bg-white hover:border-[var(--green)]"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-base font-semibold text-slate-900">
                      {row.providerName}
                    </span>
                    <span className="block truncate text-sm text-slate-500">
                      {row.serviceName}
                    </span>
                  </span>
                  <span className="max-w-[7rem] truncate text-right text-base font-semibold tabular-nums text-slate-950 sm:max-w-[10rem]">
                    {row.configured ? formatMoney(row.monthlyPlanningCost) : "—"}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <BeeijaAdvancedSection title="Calculation details" variant="card">
            <div className="space-y-3">
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

            <div className="mt-6">
              <ComparisonTable rows={result.comparisonRows} />
            </div>

            {selectedResult.configured ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ResultStat
                  label="First-year cost"
                  value={formatMoney(selectedResult.firstYearCost)}
                />
                <ResultStat
                  label="Cost per node-hour"
                  value={formatMoney(selectedResult.costPerNodeHour)}
                />
                <ResultStat
                  label="Cost per vCPU-hour"
                  value={formatMoney(selectedResult.costPerVcpuHour)}
                />
                <ResultStat
                  label="Cost per stored TB"
                  value={formatMoney(selectedResult.costPerStoredTb)}
                />
                {result.hasBudget ? (
                  <ResultStat
                    label="Budget difference"
                    value={formatMoney(selectedResult.budgetDifference)}
                  />
                ) : null}
                {result.cheapest ? (
                  <ResultStat
                    label="Monthly saving vs selected"
                    value={formatMoney(result.monthlySavingVsSelected)}
                  />
                ) : null}
              </div>
            ) : null}
          </BeeijaAdvancedSection>

          <section className="min-w-0 rounded-lg border border-[#F2C94C]/60 bg-[#FFFBEA] p-4 text-sm leading-6 text-slate-700 shadow-sm sm:p-5">
            <p className="font-semibold text-slate-950">Important</p>
            <p className="mt-1">
              Provider, region, availability, compute tier, and storage type
              identify the configuration only. Enter current effective rates
              for the exact setup you are checking. Blank optional prices are
              treated as zero.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function PlanEditor({
  plan,
  onChange,
}: {
  plan: PlanInput;
  onChange: (field: keyof PlanInput, value: string) => void;
}) {
  const provider = getCloudPostgresProvider(plan.providerId);
  const providerDisplay = getProviderDisplay(provider);
  const combinedPricing = plan.pricingModeId === "combined";

  return (
    <div className="space-y-3">
      <div className="grid items-start gap-3 sm:grid-cols-2">
        <BeeijaSelect
          label="Region or pricing scope"
          value={plan.regionId}
          onChange={(event) => onChange("regionId", event.target.value)}
          options={getRegionOptions(provider)}
        />

        <div className="block min-w-0">
          <span className="mb-2 block text-sm font-medium text-gray-700">
            Service or plan name
          </span>
          <div className="flex min-h-12 w-full min-w-0 items-center rounded-xl border border-gray-300 bg-slate-50 px-4 py-3 text-base text-gray-900">
            <span className="truncate">{providerDisplay.serviceName}</span>
          </div>
          <span className="mt-1 block text-[11.5px] leading-5 text-slate-500">
            Fixed by the selected provider.
          </span>
        </div>

        {plan.regionId === "other" ? (
          <InlineTextField
            label="Exact provider region"
            value={plan.customRegion}
            onChange={(value) => onChange("customRegion", value)}
            helper="Use the provider pricing-page region."
          />
        ) : null}

        <BeeijaSelect
          label="Availability and standby mode"
          value={plan.availabilityId}
          onChange={(event) =>
            onChange("availabilityId", event.target.value)
          }
          options={getCompactOptions(provider.availabilityOptions)}
        />

        <BeeijaSelect
          label="Compute tier or instance family"
          value={plan.computeTierId}
          onChange={(event) => onChange("computeTierId", event.target.value)}
          options={getCompactOptions(provider.computeTiers)}
        />

        <BeeijaSelect
          label="Database storage type"
          value={plan.storageTypeId}
          onChange={(event) => onChange("storageTypeId", event.target.value)}
          options={getCompactOptions(provider.storageTypes)}
        />

        <BeeijaSelect
          label="Compute pricing basis"
          value={plan.pricingModeId}
          onChange={(event) => onChange("pricingModeId", event.target.value)}
          options={getCompactOptions(provider.pricingModes)}
        />
      </div>

      <div className="grid items-start gap-3 sm:grid-cols-2">
        {combinedPricing ? (
          <BeeijaNumberField
            label="Current database node price per hour"
            value={plan.combinedNodeHourlyPrice}
            onChange={(value) => onChange("combinedNodeHourlyPrice", value)}
            prefix="$"
            helper="Current complete node rate."
            sanitizeDecimal
          />
        ) : (
          <>
            <BeeijaNumberField
              label="vCPU or vCore price per hour"
              value={plan.vcpuHourlyPrice}
              onChange={(value) => onChange("vcpuHourlyPrice", value)}
              prefix="$"
              helper="Current compute rate."
              sanitizeDecimal
            />
            <BeeijaNumberField
              label="Memory price per GB-hour"
              value={plan.memoryGbHourlyPrice}
              onChange={(value) => onChange("memoryGbHourlyPrice", value)}
              prefix="$"
              helper="Current memory rate."
              sanitizeDecimal
            />
          </>
        )}

        <BeeijaNumberField
          label="Database storage price per GB-month"
          value={plan.storagePricePerGbMonth}
          onChange={(value) => onChange("storagePricePerGbMonth", value)}
          prefix="$"
          helper="Selected storage rate."
          sanitizeDecimal
        />
      </div>

      <BeeijaAdvancedSection
        title="Optional IOPS, backup, network, and support rates"
        description="Open this when these items are billed separately."
      >
        <div className="grid items-start gap-3 sm:grid-cols-2">
          <BeeijaNumberField
            label="Commitment or reservation discount"
            value={plan.commitmentDiscountPercent}
            onChange={(value) =>
              onChange("commitmentDiscountPercent", value)
            }
            suffix="%"
            helper="Discount on database compute."
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="Provisioned IOPS price"
            value={plan.iopsPricePerIopsMonth}
            onChange={(value) => onChange("iopsPricePerIopsMonth", value)}
            prefix="$"
            helper="Per IOPS-month."
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="Billable I/O request price"
            value={plan.ioRequestPricePerMillion}
            onChange={(value) => onChange("ioRequestPricePerMillion", value)}
            prefix="$"
            helper="Per million requests."
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="Included backup storage"
            value={plan.includedBackupStorageGb}
            onChange={(value) => onChange("includedBackupStorageGb", value)}
            suffix="GB"
            helper="Backup allowance before charges."
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="Extra backup storage price"
            value={plan.backupPricePerGbMonth}
            onChange={(value) => onChange("backupPricePerGbMonth", value)}
            prefix="$"
            helper="Per GB-month above allowance."
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="Outbound data price"
            value={plan.egressPricePerGb}
            onChange={(value) => onChange("egressPricePerGb", value)}
            prefix="$"
            helper="Per billable GB."
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="Public IP or network fixed cost"
            value={plan.publicIpMonthlyCost}
            onChange={(value) => onChange("publicIpMonthlyCost", value)}
            prefix="$"
            helper="Optional monthly network cost."
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="Extended support price"
            value={plan.extendedSupportPricePerVcpuHour}
            onChange={(value) =>
              onChange("extendedSupportPricePerVcpuHour", value)
            }
            prefix="$"
            helper="Per vCPU-hour when applicable."
            sanitizeDecimal
          />
        </div>
      </BeeijaAdvancedSection>

      <BeeijaAdvancedSection
        title="Fixed services and migration costs"
        description="Open this for fixed monthly services or migration costs."
      >
        <div className="grid items-start gap-3 sm:grid-cols-2">
          <BeeijaNumberField
            label="Other fixed monthly database services"
            value={plan.fixedMonthlyCost}
            onChange={(value) => onChange("fixedMonthlyCost", value)}
            prefix="$"
            helper="Monthly monitoring or support."
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="One-time PostgreSQL migration cost"
            value={plan.oneTimeMigrationCost}
            onChange={(value) => onChange("oneTimeMigrationCost", value)}
            prefix="$"
            helper="One-time migration work."
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="Migration amortisation period"
            value={plan.migrationAmortizationMonths}
            onChange={(value) =>
              onChange("migrationAmortizationMonths", value)
            }
            suffix="months"
            helper="Months used to spread the cost."
            sanitizeDecimal
          />
        </div>
      </BeeijaAdvancedSection>
    </div>
  );
}

function InlineTextField({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex min-h-12 w-full min-w-0 items-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition hover:border-gray-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
      />
      <span className="mt-1 block min-h-5 overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] leading-5 text-slate-500">
        {helper || " "}
      </span>
    </label>
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
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 text-sm text-gray-500">{detail}</p>
      </div>
      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {entered ? formatMoney(value) : "—"}
      </p>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words font-semibold text-slate-950 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

function ComparisonTable({ rows }: { rows: PlanResult[] }) {
  return (
    <div className="min-w-0">
      <h3 className="font-semibold text-gray-950">
        Ranked provider comparison
      </h3>

      <div className="mt-3 min-w-0 overflow-hidden rounded-xl border border-gray-200">
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
                    <p className="mt-1 text-gray-600">{row.regionLabel}</p>
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
                    {row.configured ? formatMoney(row.monthlyPlanningCost) : "—"}
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

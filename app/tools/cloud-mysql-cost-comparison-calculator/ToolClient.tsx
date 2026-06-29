"use client";

import {
  Children,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";
import BeeijaComparisonCalculatorLayout, {
  BeeijaComparisonInputPanel,
  BeeijaComparisonResultColumn,
} from "@/app/components/BeeijaComparisonCalculatorLayout";
import BeeijaWorkloadSummary from "@/app/components/BeeijaWorkloadSummary";
import BeeijaProviderPlanTabs from "@/app/components/BeeijaProviderPlanTabs";

type Option = {
  value: string;
  label: string;
};

type AvailabilityOption = Option & {
  copies: number;
};

type ProviderDefinition = {
  id: string;
  providerName: string;
  serviceName: string;
  regions: Option[];
  editions: Option[];
  availabilityOptions: AvailabilityOption[];
  defaults: {
    regionId: string;
    editionId: string;
    availabilityId: string;
    backupAllowanceMode: BackupAllowanceMode;
  };
};

type BackupAllowanceMode = "none" | "primary" | "custom";

type PlanInput = {
  id: string;
  providerId: string;
  regionId: string;
  customRegion: string;
  editionId: string;
  availabilityId: string;
  machineLabel: string;
  deploymentComputePricePerHour: string;
  replicaComputePricePerHour: string;
  deploymentStoragePricePerGbMonth: string;
  replicaStoragePricePerGbMonth: string;
  backupAllowanceMode: BackupAllowanceMode;
  customIncludedBackupGb: string;
  backupPricePerGbMonth: string;
  deploymentIopsPricePerIopsMonth: string;
  replicaIopsPricePerIopsMonth: string;
  paidIoPricePerMillion: string;
  egressPricePerGb: string;
  extendedSupportPricePerVcpuHour: string;
  computeDiscountPercent: string;
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
  editionLabel: string;
  availabilityLabel: string;
  machineLabel: string;
  configured: boolean;
  databaseCopies: number;
  billableVcpus: number;
  includedBackupGb: number;
  chargeableBackupGb: number;
  computeBeforeDiscount: number;
  computeDiscountAmount: number;
  computeCost: number;
  storageCost: number;
  provisionedIopsCost: number;
  paidIoCost: number;
  backupCost: number;
  egressCost: number;
  extendedSupportCost: number;
  fixedMonthlyCost: number;
  monthlyOperatingCost: number;
  amortizedMigrationCost: number;
  monthlyPlanningCost: number;
  oneTimeMigrationCost: number;
  firstYearCost: number;
  costPerBillableVcpu: number;
  costPerPrimaryStorageGb: number;
  budgetDifference: number;
  enteredPriceCount: number;
};

type CostRow = {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
};

const backupAllowanceOptions: Option[] = [
  {
    value: "none",
    label: "No included backup allowance",
  },
  {
    value: "primary",
    label: "Allowance equals primary storage",
  },
  {
    value: "custom",
    label: "Custom included backup amount",
  },
];

const providers: ProviderDefinition[] = [
  {
    id: "aws",
    providerName: "Amazon Web Services",
    serviceName: "Amazon RDS for MySQL",
    regions: [
      { value: "us-east-1", label: "US East (N. Virginia)" },
      { value: "us-east-2", label: "US East (Ohio)" },
      { value: "us-west-2", label: "US West (Oregon)" },
      { value: "eu-west-1", label: "Europe (Ireland)" },
      { value: "eu-central-1", label: "Europe (Frankfurt)" },
      { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
      { value: "ap-south-2", label: "Asia Pacific (Hyderabad)" },
      { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
      { value: "other", label: "Other AWS region" },
    ],
    editions: [
      { value: "general", label: "General-purpose DB instance" },
      { value: "memory", label: "Memory-optimized DB instance" },
      { value: "burstable", label: "Burstable DB instance" },
      { value: "custom", label: "Other RDS instance family" },
    ],
    availabilityOptions: [
      { value: "single", label: "Single-AZ DB instance", copies: 1 },
      {
        value: "multi-az-instance",
        label: "Multi-AZ DB instance with one standby",
        copies: 2,
      },
      {
        value: "multi-az-cluster",
        label: "Multi-AZ DB cluster with two readable standbys",
        copies: 3,
      },
    ],
    defaults: {
      regionId: "us-east-1",
      editionId: "general",
      availabilityId: "single",
      backupAllowanceMode: "primary",
    },
  },
  {
    id: "azure",
    providerName: "Microsoft Azure",
    serviceName: "Azure Database for MySQL Flexible Server",
    regions: [
      { value: "east-us", label: "East US" },
      { value: "east-us-2", label: "East US 2" },
      { value: "central-us", label: "Central US" },
      { value: "west-us-2", label: "West US 2" },
      { value: "north-europe", label: "North Europe" },
      { value: "west-europe", label: "West Europe" },
      { value: "central-india", label: "Central India" },
      { value: "south-india", label: "South India" },
      { value: "southeast-asia", label: "Southeast Asia" },
      { value: "other", label: "Other Azure region" },
    ],
    editions: [
      { value: "burstable", label: "Burstable" },
      { value: "general", label: "General Purpose" },
      { value: "memory", label: "Memory Optimized" },
      { value: "custom", label: "Other Flexible Server tier" },
    ],
    availabilityOptions: [
      { value: "single", label: "Without high availability", copies: 1 },
      {
        value: "local-ha",
        label: "Local-redundant high availability",
        copies: 2,
      },
      {
        value: "zone-ha",
        label: "Zone-redundant high availability",
        copies: 2,
      },
    ],
    defaults: {
      regionId: "central-india",
      editionId: "general",
      availabilityId: "single",
      backupAllowanceMode: "primary",
    },
  },
  {
    id: "gcp",
    providerName: "Google Cloud",
    serviceName: "Cloud SQL for MySQL",
    regions: [
      { value: "us-central1", label: "Iowa (us-central1)" },
      { value: "us-east1", label: "South Carolina (us-east1)" },
      { value: "us-west1", label: "Oregon (us-west1)" },
      { value: "europe-west1", label: "Belgium (europe-west1)" },
      { value: "europe-west4", label: "Netherlands (europe-west4)" },
      { value: "asia-south1", label: "Mumbai (asia-south1)" },
      { value: "asia-south2", label: "Delhi (asia-south2)" },
      { value: "asia-southeast1", label: "Singapore (asia-southeast1)" },
      { value: "other", label: "Other Google Cloud region" },
    ],
    editions: [
      { value: "enterprise", label: "Cloud SQL Enterprise" },
      { value: "enterprise-plus", label: "Cloud SQL Enterprise Plus" },
      { value: "shared-core", label: "Shared-core or predefined machine" },
      { value: "custom", label: "Other Cloud SQL machine configuration" },
    ],
    availabilityOptions: [
      { value: "zonal", label: "Zonal instance", copies: 1 },
      { value: "regional", label: "Regional high availability", copies: 2 },
    ],
    defaults: {
      regionId: "asia-south1",
      editionId: "enterprise",
      availabilityId: "zonal",
      backupAllowanceMode: "none",
    },
  },
  {
    id: "custom",
    providerName: "Custom Provider",
    serviceName: "Custom Managed MySQL Plan",
    regions: [{ value: "other", label: "Custom region" }],
    editions: [{ value: "custom", label: "Custom service tier" }],
    availabilityOptions: [
      { value: "one-copy", label: "One database copy", copies: 1 },
      { value: "two-copies", label: "Two database copies", copies: 2 },
      { value: "three-copies", label: "Three database copies", copies: 3 },
    ],
    defaults: {
      regionId: "other",
      editionId: "custom",
      availabilityId: "one-copy",
      backupAllowanceMode: "none",
    },
  },
];

function getProvider(providerId: string) {
  return (
    providers.find((provider) => provider.id === providerId) ??
    providers[0]
  );
}

function getOptionLabel(options: Option[], value: string) {
  return (
    options.find((option) => option.value === value)?.label ??
    "Not selected"
  );
}

function getAvailability(
  provider: ProviderDefinition,
  availabilityId: string,
) {
  return (
    provider.availabilityOptions.find(
      (option) => option.value === availabilityId,
    ) ?? provider.availabilityOptions[0]
  );
}

function createPlan(id: string, providerId: string): PlanInput {
  const provider = getProvider(providerId);

  return {
    id,
    providerId: provider.id,
    regionId: provider.defaults.regionId,
    customRegion: "",
    editionId: provider.defaults.editionId,
    availabilityId: provider.defaults.availabilityId,
    machineLabel: "",
    deploymentComputePricePerHour: "",
    replicaComputePricePerHour: "",
    deploymentStoragePricePerGbMonth: "",
    replicaStoragePricePerGbMonth: "",
    backupAllowanceMode: provider.defaults.backupAllowanceMode,
    customIncludedBackupGb: "",
    backupPricePerGbMonth: "",
    deploymentIopsPricePerIopsMonth: "",
    replicaIopsPricePerIopsMonth: "",
    paidIoPricePerMillion: "",
    egressPricePerGb: "",
    extendedSupportPricePerVcpuHour: "",
    computeDiscountPercent: "",
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

// Always show the complete currency value. Zero-width break points after commas
// allow very large amounts to wrap without abbreviating or hiding any digit.
function formatVisibleMoney(value: number) {
  return formatMoney(value).replace(/,/g, ",\u200B");
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

function getRegionLabel(plan: PlanInput, provider: ProviderDefinition) {
  if (plan.regionId === "other") {
    return plan.customRegion.trim() || "Other region";
  }

  return getOptionLabel(provider.regions, plan.regionId);
}

function getDisplayName(plan: PlanInput) {
  const provider = getProvider(plan.providerId);
  return `${provider.serviceName} — ${getRegionLabel(plan, provider)}`;
}

export default function ToolClient() {
  const [runningHours, setRunningHours] = useState("730");
  const [vcpusPerDatabase, setVcpusPerDatabase] = useState("2");
  const [memoryGbPerDatabase, setMemoryGbPerDatabase] = useState("8");
  const [primaryStorageGb, setPrimaryStorageGb] = useState("100");
  const [backupStorageGb, setBackupStorageGb] = useState("100");
  const [provisionedIops, setProvisionedIops] = useState("0");
  const [billableIoMillions, setBillableIoMillions] = useState("0");
  const [internetEgressGb, setInternetEgressGb] = useState("0");
  const [readReplicaCount, setReadReplicaCount] = useState("0");
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
    const provider = getProvider(providerId);

    setPlans((current) =>
      current.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              providerId: provider.id,
              regionId: provider.defaults.regionId,
              customRegion: "",
              editionId: provider.defaults.editionId,
              availabilityId: provider.defaults.availabilityId,
              backupAllowanceMode:
                provider.defaults.backupAllowanceMode,
            }
          : plan,
      ),
    );
  };

  const result = useMemo(() => {
    const hours = toNumber(runningHours);
    const vcpus = toNumber(vcpusPerDatabase);
    const memoryGb = toNumber(memoryGbPerDatabase);
    const primaryGb = toNumber(primaryStorageGb);
    const backupGb = toNumber(backupStorageGb);
    const provisionedIopsValue = toNumber(provisionedIops);
    const ioMillions = toNumber(billableIoMillions);
    const egressGb = toNumber(internetEgressGb);
    const replicas = Math.floor(toNumber(readReplicaCount));
    const budget = toNumber(monthlyBudget);

    const rows: PlanResult[] = plans.map((plan) => {
      const provider = getProvider(plan.providerId);
      const availability = getAvailability(
        provider,
        plan.availabilityId,
      );
      const databaseCopies = availability.copies + replicas;
      const billableVcpus = vcpus * databaseCopies;

      const deploymentComputePrice = toNumber(
        plan.deploymentComputePricePerHour,
      );
      const replicaComputePrice = toNumber(
        plan.replicaComputePricePerHour,
      );
      const deploymentStoragePrice = toNumber(
        plan.deploymentStoragePricePerGbMonth,
      );
      const replicaStoragePrice = toNumber(
        plan.replicaStoragePricePerGbMonth,
      );
      const backupPrice = toNumber(plan.backupPricePerGbMonth);
      const deploymentIopsPrice = toNumber(
        plan.deploymentIopsPricePerIopsMonth,
      );
      const replicaIopsPrice = toNumber(
        plan.replicaIopsPricePerIopsMonth,
      );
      const paidIoPrice = toNumber(plan.paidIoPricePerMillion);
      const egressPrice = toNumber(plan.egressPricePerGb);
      const extendedSupportPrice = toNumber(
        plan.extendedSupportPricePerVcpuHour,
      );
      const discountPercent = clampPercent(
        plan.computeDiscountPercent,
      );
      const fixedMonthlyCost = toNumber(plan.fixedMonthlyCost);
      const oneTimeMigrationCost = toNumber(
        plan.oneTimeMigrationCost,
      );
      const migrationMonths = Math.max(
        1,
        toNumber(plan.migrationAmortizationMonths),
      );

      const includedBackupGb =
        plan.backupAllowanceMode === "primary"
          ? primaryGb
          : plan.backupAllowanceMode === "custom"
            ? toNumber(plan.customIncludedBackupGb)
            : 0;

      const chargeableBackupGb = Math.max(
        0,
        backupGb - includedBackupGb,
      );

      const computeBeforeDiscount =
        deploymentComputePrice * hours +
        replicaComputePrice * hours * replicas;
      const computeDiscountAmount =
        computeBeforeDiscount * (discountPercent / 100);
      const computeCost =
        computeBeforeDiscount - computeDiscountAmount;

      const storageCost =
        deploymentStoragePrice * primaryGb +
        replicaStoragePrice * primaryGb * replicas;
      const provisionedIopsCost =
        deploymentIopsPrice * provisionedIopsValue +
        replicaIopsPrice * provisionedIopsValue * replicas;
      const paidIoCost = paidIoPrice * ioMillions;
      const backupCost = backupPrice * chargeableBackupGb;
      const egressCost = egressPrice * egressGb;
      const extendedSupportCost =
        extendedSupportPrice * billableVcpus * hours;
      const amortizedMigrationCost =
        oneTimeMigrationCost / migrationMonths;

      const monthlyOperatingCost =
        computeCost +
        storageCost +
        provisionedIopsCost +
        paidIoCost +
        backupCost +
        egressCost +
        extendedSupportCost +
        fixedMonthlyCost;

      const monthlyPlanningCost =
        monthlyOperatingCost + amortizedMigrationCost;
      const firstYearCost =
        monthlyOperatingCost * 12 + oneTimeMigrationCost;

      const enteredPriceFields = [
        plan.deploymentComputePricePerHour,
        plan.replicaComputePricePerHour,
        plan.deploymentStoragePricePerGbMonth,
        plan.replicaStoragePricePerGbMonth,
        plan.backupPricePerGbMonth,
        plan.deploymentIopsPricePerIopsMonth,
        plan.replicaIopsPricePerIopsMonth,
        plan.paidIoPricePerMillion,
        plan.egressPricePerGb,
        plan.extendedSupportPricePerVcpuHour,
        plan.fixedMonthlyCost,
        plan.oneTimeMigrationCost,
      ];

      const enteredPriceCount = enteredPriceFields.filter(
        (value) => value.trim() !== "",
      ).length;

      const configured = enteredPriceCount > 0;

      return {
        id: plan.id,
        providerId: plan.providerId,
        providerName: provider.providerName,
        serviceName: provider.serviceName,
        displayName: getDisplayName(plan),
        regionLabel: getRegionLabel(plan, provider),
        editionLabel: getOptionLabel(
          provider.editions,
          plan.editionId,
        ),
        availabilityLabel: availability.label,
        machineLabel:
          plan.machineLabel.trim() || "Machine size not entered",
        configured,
        databaseCopies,
        billableVcpus,
        includedBackupGb,
        chargeableBackupGb,
        computeBeforeDiscount,
        computeDiscountAmount,
        computeCost,
        storageCost,
        provisionedIopsCost,
        paidIoCost,
        backupCost,
        egressCost,
        extendedSupportCost,
        fixedMonthlyCost,
        monthlyOperatingCost,
        amortizedMigrationCost,
        monthlyPlanningCost,
        oneTimeMigrationCost,
        firstYearCost,
        costPerBillableVcpu:
          billableVcpus > 0
            ? monthlyPlanningCost / billableVcpus
            : 0,
        costPerPrimaryStorageGb:
          primaryGb > 0 ? monthlyPlanningCost / primaryGb : 0,
        budgetDifference: budget - monthlyPlanningCost,
        enteredPriceCount,
      };
    });

    const comparisonRows = [...rows].sort((first, second) => {
      if (first.configured && !second.configured) return -1;
      if (!first.configured && second.configured) return 1;
      return first.monthlyPlanningCost - second.monthlyPlanningCost;
    });

    const selected =
      rows.find((row) => row.id === selectedPlanId) ?? rows[0];
    const cheapest =
      comparisonRows.find((row) => row.configured) ?? null;

    const monthlySavingVsSelected =
      selected.configured && cheapest
        ? Math.max(
            0,
            selected.monthlyPlanningCost -
              cheapest.monthlyPlanningCost,
          )
        : 0;

    const firstYearSavingVsSelected =
      selected.configured && cheapest
        ? Math.max(0, selected.firstYearCost - cheapest.firstYearCost)
        : 0;

    return {
      hours,
      vcpus,
      memoryGb,
      primaryGb,
      backupGb,
      provisionedIopsValue,
      ioMillions,
      egressGb,
      replicas,
      budget,
      hasBudget: monthlyBudget.trim() !== "",
      rows,
      comparisonRows,
      selected,
      cheapest,
      monthlySavingVsSelected,
      firstYearSavingVsSelected,
    };
  }, [
    backupStorageGb,
    billableIoMillions,
    internetEgressGb,
    memoryGbPerDatabase,
    monthlyBudget,
    plans,
    primaryStorageGb,
    provisionedIops,
    readReplicaCount,
    runningHours,
    selectedPlanId,
    vcpusPerDatabase,
  ]);

  const selectedPlanInput =
    plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const selectedResult = result.selected;

  const selectedRows: CostRow[] = [
    {
      label: "Database compute",
      detail: `${formatNumber(
        result.hours,
      )} hours for the selected deployment plus ${formatInteger(
        result.replicas,
      )} read replicas before the entered compute discount`,
      value: selectedResult.computeCost,
      entered:
        selectedPlanInput.deploymentComputePricePerHour.trim() !== "" ||
        selectedPlanInput.replicaComputePricePerHour.trim() !== "",
    },
    {
      label: "Database storage",
      detail: `${formatNumber(
        result.primaryGb,
      )} GB for the selected deployment plus ${formatInteger(
        result.replicas,
      )} read replicas`,
      value: selectedResult.storageCost,
      entered:
        selectedPlanInput.deploymentStoragePricePerGbMonth.trim() !== "" ||
        selectedPlanInput.replicaStoragePricePerGbMonth.trim() !== "",
    },
    {
      label: "Provisioned IOPS",
      detail: `${formatInteger(
        result.provisionedIopsValue,
      )} IOPS for the selected deployment plus ${formatInteger(
        result.replicas,
      )} read replicas`,
      value: selectedResult.provisionedIopsCost,
      entered:
        selectedPlanInput.deploymentIopsPricePerIopsMonth.trim() !== "" ||
        selectedPlanInput.replicaIopsPricePerIopsMonth.trim() !== "",
    },
    {
      label: "Paid or request-based I/O",
      detail: `${formatNumber(
        result.ioMillions,
      )} million billable I/O requests across the deployment`,
      value: selectedResult.paidIoCost,
      entered:
        selectedPlanInput.paidIoPricePerMillion.trim() !== "",
    },
    {
      label: "Backup storage",
      detail: `${formatNumber(
        selectedResult.chargeableBackupGb,
      )} GB charged after ${formatNumber(
        selectedResult.includedBackupGb,
      )} GB included`,
      value: selectedResult.backupCost,
      entered: selectedPlanInput.backupPricePerGbMonth.trim() !== "",
    },
    {
      label: "Data transfer out",
      detail: `${formatNumber(result.egressGb)} GB`,
      value: selectedResult.egressCost,
      entered: selectedPlanInput.egressPricePerGb.trim() !== "",
    },
    {
      label: "Extended support",
      detail: `${formatNumber(
        selectedResult.billableVcpus,
      )} billable vCPUs × ${formatNumber(result.hours)} hours`,
      value: selectedResult.extendedSupportCost,
      entered:
        selectedPlanInput.extendedSupportPricePerVcpuHour.trim() !== "",
    },
    {
      label: "Other fixed monthly services",
      detail: "Monitoring, proxy, accelerated logs, IP, or another fixed charge",
      value: selectedResult.fixedMonthlyCost,
      entered: selectedPlanInput.fixedMonthlyCost.trim() !== "",
    },
    {
      label: "Amortized migration cost",
      detail: `${formatMoney(
        selectedResult.oneTimeMigrationCost,
      )} spread across ${formatInteger(
        Math.max(
          1,
          toNumber(selectedPlanInput.migrationAmortizationMonths),
        ),
      )} months`,
      value: selectedResult.amortizedMigrationCost,
      entered: selectedPlanInput.oneTimeMigrationCost.trim() !== "",
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
    setRunningHours("730");
    setVcpusPerDatabase("2");
    setMemoryGbPerDatabase("8");
    setPrimaryStorageGb("100");
    setBackupStorageGb("100");
    setProvisionedIops("0");
    setBillableIoMillions("0");
    setInternetEgressGb("0");
    setReadReplicaCount("0");
    setMonthlyBudget("");
    setPlans(initialPlans.map((plan) => ({ ...plan })));
    setSelectedPlanId("plan-a");
    setActiveEditorPlanId("plan-a");
  };

  return (
    <BeeijaComparisonCalculatorLayout>
      <BeeijaComparisonInputPanel>
              <div>
                <h2 className="text-2xl font-semibold text-gray-950">
                  Enter the Shared MySQL Workload
                </h2>

                <p className="mt-3 leading-relaxed text-gray-600">
                  Use the same database size, storage, I/O, transfer, and
                  replica workload for every provider plan.
                </p>
              </div>

              <FieldSection title="Database Size and Running Time">
                <BeeijaNumberField
                  label="Database running time per month"
                  value={runningHours}
                  onChange={setRunningHours}
                  min="0"
                  max="744"
                  step="1"
                  suffix="hours"
                />

                <BeeijaNumberField
                  label="vCPUs per database copy"
                  value={vcpusPerDatabase}
                  onChange={setVcpusPerDatabase}
                  min="0"
                  step="1"
                  suffix="vCPU"
                />

                <BeeijaNumberField
                  label="Memory per database copy"
                  value={memoryGbPerDatabase}
                  onChange={setMemoryGbPerDatabase}
                  min="0"
                  step="0.5"
                  suffix="GB"
                />

                <BeeijaNumberField
                  label="Read replicas"
                  value={readReplicaCount}
                  onChange={setReadReplicaCount}
                  min="0"
                  step="1"
                />
              </FieldSection>

              <FieldSection title="Storage, IOPS, and Backup">
                <BeeijaNumberField
                  label="Primary database storage"
                  value={primaryStorageGb}
                  onChange={setPrimaryStorageGb}
                  min="0"
                  step="1"
                  suffix="GB"
                />

                <BeeijaNumberField
                  label="Total backup storage used"
                  value={backupStorageGb}
                  onChange={setBackupStorageGb}
                  min="0"
                  step="1"
                  suffix="GB"
                />

                <BeeijaNumberField
                  label="Provisioned IOPS per database copy"
                  value={provisionedIops}
                  onChange={setProvisionedIops}
                  min="0"
                  step="1"
                  suffix="IOPS"
                />

                <BeeijaNumberField
                  label="Total billable I/O across deployment"
                  value={billableIoMillions}
                  onChange={setBillableIoMillions}
                  min="0"
                  step="0.1"
                  suffix="million"
                />
              </FieldSection>

              <FieldSection title="Transfer and Budget">
                <BeeijaNumberField
                  label="Internet or cross-region data transfer out"
                  value={internetEgressGb}
                  onChange={setInternetEgressGb}
                  min="0"
                  step="1"
                  suffix="GB"
                />

                <BeeijaNumberField
                  label="Target monthly managed MySQL budget"
                  value={monthlyBudget}
                  onChange={setMonthlyBudget}
                  min="0"
                  step="1"
                  prefix="$"
                />
              </FieldSection>

              <BeeijaWorkloadSummary title="Shared workload summary">
        <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
          <p>
            Running time: {formatNumber(result.hours)} hours
          </p>

          <p>
            Database size: {formatNumber(result.vcpus)} vCPU and{" "}
            {formatNumber(result.memoryGb)} GB memory
          </p>

          <p>
            Primary storage: {formatNumber(result.primaryGb)} GB
          </p>

          <p>
            Backup usage: {formatNumber(result.backupGb)} GB
          </p>

          <p>
            Provisioned IOPS:{" "}
            {formatInteger(result.provisionedIopsValue)}
          </p>

          <p>
            Billable I/O: {formatNumber(result.ioMillions)} million
          </p>

          <p>
            Data transfer out: {formatNumber(result.egressGb)} GB
          </p>

          <p>Read replicas per plan: {formatInteger(result.replicas)}</p>
        </div>
      </BeeijaWorkloadSummary>

              <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-950">
                  Select Provider Configurations and Enter Prices
                </h2>

                <p className="mt-3 leading-relaxed text-gray-600">
                  Choose the provider, region, service tier, availability
                  setup, and machine size. Current prices remain blank so you
                  can enter the exact effective rates for each selected plan.
                </p>
              </div>

              <div className="mt-6">
                <BeeijaProviderPlanTabs
        plans={plans.map((plan, index) => {
          const provider = getProvider(plan.providerId);

          return {
            id: plan.id,
            label: `Plan ${index + 1}`,
            title: provider.serviceName,
            subtitle: getRegionLabel(plan, provider),
          };
        })}
        activePlanId={activeEditorPlanId}
        onChange={openPlanEditor}
        ariaLabel="Managed MySQL comparison plans"
      />

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
                  Select Plan 1, 2, or 3 above to edit it. All three plans
                  remain included in the ranked comparison.
                </p>
              </div>

              <button
                type="button"
                onClick={reset}
                className="beeija-btn-outline mt-7"
              >
                Reset values
              </button>
            </BeeijaComparisonInputPanel>

      <BeeijaComparisonResultColumn>
        <BeeijaCalculatorResultPanel
                title="Managed MySQL Cost Comparison"
                description="Select a plan for a detailed breakdown. Configured plans are ranked by monthly planning cost."
                primaryLabel="Selected monthly planning cost"
                primaryValue={
                  selectedResult.configured
                    ? formatVisibleMoney(selectedResult.monthlyPlanningCost)
                    : "Enter provider prices"
                }
                stats={
                  <div className="grid gap-4 sm:grid-cols-3">
                    <ResultStat
                      label="Cost per billable vCPU"
                      value={
                        selectedResult.configured
                          ? formatVisibleMoney(selectedResult.costPerBillableVcpu)
                          : "—"
                      }
                    />

                    <ResultStat
                      label="Cost per primary storage GB"
                      value={
                        selectedResult.configured
                          ? formatVisibleMoney(
                              selectedResult.costPerPrimaryStorageGb,
                            )
                          : "—"
                      }
                    />

                    <ResultStat
                      label="First-year cost"
                      value={
                        selectedResult.configured
                          ? formatVisibleMoney(selectedResult.firstYearCost)
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
                        {selectedResult.editionLabel} ·{" "}
                        {selectedResult.machineLabel}
                      </p>
                      <p className="mt-1">
                        {selectedResult.availabilityLabel} ·{" "}
                        {selectedResult.databaseCopies} database copies
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
                  <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
                    <p>
                      Selected plan:{" "}
                      <span className="font-medium text-gray-900">
                        {selectedResult.displayName}
                      </span>
                    </p>

                    <p className="mt-2">
                      Configuration:{" "}
                      <span className="font-medium text-gray-900">
                        {selectedResult.editionLabel} ·{" "}
                        {selectedResult.availabilityLabel}
                      </span>
                    </p>

                    <p className="mt-2">
                      Billable database copies:{" "}
                      <span className="font-medium text-gray-900">
                        {formatInteger(selectedResult.databaseCopies)}
                      </span>
                    </p>

                    <p className="mt-2">
                      Monthly operating cost:{" "}
                      <span className="font-medium text-gray-900">
                        {selectedResult.configured
                          ? formatVisibleMoney(selectedResult.monthlyOperatingCost)
                          : "—"}
                      </span>
                    </p>

                    <p className="mt-2">
                      Monthly migration allocation:{" "}
                      <span className="font-medium text-gray-900">
                        {selectedResult.configured
                          ? formatVisibleMoney(selectedResult.amortizedMigrationCost)
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
                          : "Enter at least one provider price"}
                      </span>
                    </p>

                    <p className="mt-2">
                      Possible monthly saving against selected plan:{" "}
                      <span className="font-semibold text-[var(--green)]">
                        {selectedResult.configured && result.cheapest
                          ? formatVisibleMoney(result.monthlySavingVsSelected)
                          : "—"}
                      </span>
                    </p>

                    <p className="mt-2">
                      Possible first-year saving:{" "}
                      <span className="font-semibold text-[var(--green)]">
                        {selectedResult.configured && result.cheapest
                          ? formatVisibleMoney(result.firstYearSavingVsSelected)
                          : "—"}
                      </span>
                    </p>

                    <p className="mt-2">
                      Selected plan price inputs entered:{" "}
                      <span className="font-medium text-gray-900">
                        {selectedResult.enteredPriceCount} of 12
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
                            ? "Enter the selected provider prices"
                            : selectedResult.budgetDifference >= 0
                              ? `${formatMoney(
                                  selectedResult.budgetDifference,
                                )} remaining`
                              : `${formatVisibleMoney(
                                  Math.abs(selectedResult.budgetDifference),
                                )} over budget`}
                      </span>
                    </p>
                  </div>
                }
                provider="Amazon RDS for MySQL, Microsoft Azure Database for MySQL Flexible Server, Google Cloud SQL for MySQL, and custom managed MySQL plans"
                excludedCosts="taxes, support plans, private connectivity, monitoring, DNS, public IP addresses, cross-region replication, backup exports, encryption key requests, migration labour, negotiated credits, and services not entered"
                noticeText="Provider, region, service-tier, availability, and machine selections identify the configuration only; they do not load or imply a current price. Enter current effective rates for the exact selected setup. Pricing structures and official billing guidance were checked on June 24, 2026. Blank optional price fields are treated as zero."
                />
      </BeeijaComparisonResultColumn>
</BeeijaComparisonCalculatorLayout>
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
  const provider = getProvider(plan.providerId);

  const providerOptions = providers.map((item) => ({
    value: item.id,
    label: item.serviceName,
  }));

  const availabilityOptions = provider.availabilityOptions.map(
    (option) => ({
      value: option.value,
      label: `${option.label} (${option.copies} ${
        option.copies === 1 ? "copy" : "copies"
      })`,
    }),
  );

  const showCustomBackup =
    plan.backupAllowanceMode === "custom";

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#F9FBFA] p-5 md:p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--yellow-dark)]">
          Plan {planNumber}
        </p>
        <h3 className="mt-1 text-xl font-semibold text-gray-950">
          {provider.serviceName}
        </h3>
      </div>

      <FieldSection title="Provider Configuration">
        <BeeijaSelect
          label="Managed MySQL provider"
          value={plan.providerId}
          onChange={(event) =>
            onProviderChange(event.target.value)
          }
          options={providerOptions}
        />

        <BeeijaSelect
          label="Region"
          value={plan.regionId}
          onChange={(event) =>
            onChange("regionId", event.target.value)
          }
          options={provider.regions}
        />

        {plan.regionId === "other" ? (
          <TextField
            label="Custom region name"
            value={plan.customRegion}
            onChange={(value) => onChange("customRegion", value)}
          />
        ) : null}

        <BeeijaSelect
          label="Service tier or edition"
          value={plan.editionId}
          onChange={(event) =>
            onChange("editionId", event.target.value)
          }
          options={provider.editions}
        />

        <BeeijaSelect
          label="Availability configuration"
          value={plan.availabilityId}
          onChange={(event) =>
            onChange("availabilityId", event.target.value)
          }
          options={availabilityOptions}
        />

        <TextField
          label="Machine or instance name"
          value={plan.machineLabel}
          onChange={(value) => onChange("machineLabel", value)}
        />
      </FieldSection>

      <FieldSection title="Compute, Storage, and Backup Prices">
        <BeeijaNumberField
          label="Selected deployment compute price per hour"
          value={plan.deploymentComputePricePerHour}
          onChange={(value) =>
            onChange("deploymentComputePricePerHour", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Read replica compute price per replica per hour"
          value={plan.replicaComputePricePerHour}
          onChange={(value) =>
            onChange("replicaComputePricePerHour", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Selected deployment storage price per primary GB-month"
          value={plan.deploymentStoragePricePerGbMonth}
          onChange={(value) =>
            onChange("deploymentStoragePricePerGbMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Read replica storage price per replica per GB-month"
          value={plan.replicaStoragePricePerGbMonth}
          onChange={(value) =>
            onChange("replicaStoragePricePerGbMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaSelect
          label="Included backup allowance"
          value={plan.backupAllowanceMode}
          onChange={(event) =>
            onChange(
              "backupAllowanceMode",
              event.target.value as BackupAllowanceMode,
            )
          }
          options={backupAllowanceOptions}
        />

        {showCustomBackup ? (
          <BeeijaNumberField
            label="Custom included backup storage"
            value={plan.customIncludedBackupGb}
            onChange={(value) =>
              onChange("customIncludedBackupGb", value)
            }
            min="0"
            step="1"
            suffix="GB"
          />
        ) : null}

        <BeeijaNumberField
          label="Backup storage price per charged GB-month"
          value={plan.backupPricePerGbMonth}
          onChange={(value) =>
            onChange("backupPricePerGbMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Selected deployment IOPS price per IOPS-month"
          value={plan.deploymentIopsPricePerIopsMonth}
          onChange={(value) =>
            onChange("deploymentIopsPricePerIopsMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Read replica IOPS price per replica per IOPS-month"
          value={plan.replicaIopsPricePerIopsMonth}
          onChange={(value) =>
            onChange("replicaIopsPricePerIopsMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Paid I/O price per million requests"
          value={plan.paidIoPricePerMillion}
          onChange={(value) =>
            onChange("paidIoPricePerMillion", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
      </FieldSection>

      <FieldSection title="Transfer, Support, Discounts, and Migration">
        <BeeijaNumberField
          label="Effective data transfer-out price per GB"
          value={plan.egressPricePerGb}
          onChange={(value) => onChange("egressPricePerGb", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Extended-support price per vCPU-hour"
          value={plan.extendedSupportPricePerVcpuHour}
          onChange={(value) =>
            onChange("extendedSupportPricePerVcpuHour", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Effective compute discount"
          value={plan.computeDiscountPercent}
          onChange={(value) =>
            onChange("computeDiscountPercent", value)
          }
          min="0"
          max="100"
          step="0.1"
          suffix="%"
        />

        <BeeijaNumberField
          label="Other fixed monthly database services"
          value={plan.fixedMonthlyCost}
          onChange={(value) =>
            onChange("fixedMonthlyCost", value)
          }
          min="0"
          step="1"
          prefix="$"
        />

        <BeeijaNumberField
          label="One-time migration cost"
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
      </FieldSection>
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
    <div className="mt-8 min-w-0">
      <h3 className="text-lg font-semibold text-gray-950">
        {title}
      </h3>
      <div className="mt-5 grid min-w-0 items-stretch gap-x-5 gap-y-5 md:grid-cols-2">
        {Children.map(children, (child, index) =>
          child ? (
            <div
              key={`field-${index}`}
              className="min-w-0 [&>label]:flex [&>label]:h-full [&>label]:min-w-0 [&>label]:flex-col md:[&>label>span:first-child]:min-h-14"
            >
              {child}
            </div>
          ) : null,
        )}
      </div>
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
    <label className="flex h-full min-w-0 flex-col">
      <span className="mb-2 block text-sm font-medium text-gray-700 md:min-h-14">
        {label}
      </span>

      <input
        type="text"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
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
        <p className="mt-1 text-sm text-gray-500">
          {detail}
        </p>
      </div>

      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {entered ? formatVisibleMoney(value) : "—"}
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
                  Copies
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
                      {row.editionLabel}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {row.availabilityLabel}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      {row.configured
                        ? `${row.enteredPriceCount} price inputs entered`
                        : "Enter at least one provider price"}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-gray-900">
                    {formatInteger(row.databaseCopies)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-950">
                    {row.configured
                      ? formatMoney(row.monthlyPlanningCost)
                      : "—"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-gray-900">
                    {row.configured
                      ? formatMoney(row.firstYearCost)
                      : "—"}
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

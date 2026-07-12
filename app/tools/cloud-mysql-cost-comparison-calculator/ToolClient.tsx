"use client";

import { useMemo, useState } from "react";
import BeeijaAdvancedSection from "@/app/components/BeeijaAdvancedSection";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaResultLine from "@/app/components/BeeijaResultLine";
import BeeijaSelect from "@/app/components/BeeijaSelect";

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


type ProviderDisplay = {
  providerName: string;
  serviceName: string;
  shortName: string;
};

const providerDisplayById: Record<string, ProviderDisplay> = {
  aws: {
    providerName: "Amazon Web Services",
    serviceName: "Amazon RDS for MySQL",
    shortName: "AWS",
  },
  azure: {
    providerName: "Microsoft Azure",
    serviceName: "Azure Database for MySQL",
    shortName: "Azure",
  },
  gcp: {
    providerName: "Google Cloud",
    serviceName: "Cloud SQL for MySQL",
    shortName: "Google Cloud",
  },
  custom: {
    providerName: "Custom provider",
    serviceName: "Custom managed MySQL plan",
    shortName: "Custom",
  },
};

function getProviderDisplay(provider: ProviderDefinition): ProviderDisplay {
  return (
    providerDisplayById[provider.id] ?? {
      providerName: provider.providerName,
      serviceName: provider.serviceName,
      shortName: provider.providerName,
    }
  );
}

function shortenRegionLabel(label: string) {
  return label
    .replace(/\s+\((?:us|eu|asia|australia|northamerica|southamerica|me|africa)-[a-z0-9-]+\)$/i, "")
    .trim();
}

function getRegionOptions(provider: ProviderDefinition) {
  return provider.regions.map((option) => ({
    ...option,
    label:
      option.value === "other"
        ? option.label
        : shortenRegionLabel(option.label),
  }));
}

function shortenOptionLabel(label: string) {
  const replacements: Record<string, string> = {
    "General-purpose DB instance": "General purpose",
    "Memory-optimized DB instance": "Memory optimized",
    "Burstable DB instance": "Burstable",
    "Other RDS instance family": "Other instance family",
    "Other Flexible Server tier": "Other service tier",
    "Cloud SQL Enterprise": "Enterprise",
    "Cloud SQL Enterprise Plus": "Enterprise Plus",
    "Shared-core or predefined machine": "Shared core",
    "Other Cloud SQL machine configuration": "Other configuration",
    "Custom service tier": "Custom tier",
    "Single-AZ DB instance": "Single-AZ instance",
    "Multi-AZ DB instance with one standby": "Multi-AZ — one standby",
    "Multi-AZ DB cluster with two readable standbys":
      "Multi-AZ — two standbys",
    "Without high availability": "No high availability",
    "Local-redundant high availability": "Local-redundant HA",
    "Zone-redundant high availability": "Zone-redundant HA",
    "Regional high availability": "Regional HA",
    "One database copy": "One copy",
    "Two database copies": "Two copies",
    "Three database copies": "Three copies",
    "No included backup allowance": "No included allowance",
    "Allowance equals primary storage": "Primary storage allowance",
    "Custom included backup amount": "Custom allowance",
  };

  return replacements[label] ?? label;
}

function getCompactOptions(options: Option[]) {
  return options.map((option) => ({
    ...option,
    label: shortenOptionLabel(option.label),
  }));
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


  const activeEditorPlan =
    plans.find((plan) => plan.id === activeEditorPlanId) ?? plans[0];
  const activeProvider = getProvider(activeEditorPlan.providerId);
  const activeProviderDisplay = getProviderDisplay(activeProvider);
  const selectedProviderDisplay = getProviderDisplay(
    getProvider(selectedResult.providerId),
  );

  const openPlanEditor = (planId: string) => {
    setActiveEditorPlanId(planId);
    setSelectedPlanId(planId);
  };

  const selectProviderForActivePlan = (providerId: string) => {
    changeProvider(activeEditorPlan.id, providerId);
    setSelectedPlanId(activeEditorPlan.id);
  };

  const resetActivePlanRates = () => {
    setPlans((current) =>
      current.map((plan) =>
        plan.id === activeEditorPlan.id
          ? {
              ...plan,
              customIncludedBackupGb: "",
              deploymentComputePricePerHour: "",
              replicaComputePricePerHour: "",
              deploymentStoragePricePerGbMonth: "",
              replicaStoragePricePerGbMonth: "",
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
            }
          : plan,
      ),
    );
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
              MySQL pricing depends on compute, availability, read replicas,
              storage, IOPS, billable I/O, backups, transfer, support,
              discounts, and migration costs. Beeija keeps provider rates
              editable so you can compare the same workload with current
              pricing.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {providers.map((provider) => {
              const display = getProviderDisplay(provider);
              const selected = provider.id === activeEditorPlan.providerId;

              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => selectProviderForActivePlan(provider.id)}
                  className={`flex min-h-[88px] min-w-0 flex-col justify-center rounded-lg border p-3 text-left transition ${
                    selected
                      ? "border-[#165A31] bg-[#f4fbf6] shadow-sm"
                      : "border-slate-200 bg-white hover:border-[#165A31]"
                  }`}
                >
                  <span className="block truncate text-base font-semibold text-slate-900">
                    {display.providerName}
                  </span>
                  <span className="mt-1 block min-h-10 text-sm leading-5 text-slate-600">
                    {display.serviceName}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <h3 className="text-base font-semibold text-slate-950">
              Shared MySQL workload
            </h3>
            <p className="mt-1 text-base leading-7 text-slate-600">
              Use the same database workload for every provider so the
              comparison stays fair.
            </p>

            <div className="mt-3 grid items-start gap-3 sm:grid-cols-2">
              <BeeijaNumberField
                label="Database running time per month"
                value={runningHours}
                onChange={setRunningHours}
                suffix="hours"
                helper="Use 730 for a full month."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="vCPUs per database copy"
                value={vcpusPerDatabase}
                onChange={setVcpusPerDatabase}
                suffix="vCPU"
                helper="Compute size per database copy."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Memory per database copy"
                value={memoryGbPerDatabase}
                onChange={setMemoryGbPerDatabase}
                suffix="GB"
                helper="Memory size per database copy."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Read replicas"
                value={readReplicaCount}
                onChange={setReadReplicaCount}
                helper="Replicas beyond the primary setup."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Primary database storage"
                value={primaryStorageGb}
                onChange={setPrimaryStorageGb}
                suffix="GB"
                helper="Provisioned primary storage."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Target monthly MySQL budget"
                value={monthlyBudget}
                onChange={setMonthlyBudget}
                prefix="$"
                helper="Optional monthly budget."
                sanitizeDecimal
              />
            </div>

            <BeeijaAdvancedSection
              className="mt-4"
              title="Backup, I/O, IOPS, and network assumptions"
              description="Open this for backup storage, provisioned IOPS, billable I/O, or outbound transfer."
            >
              <div className="grid items-start gap-3 sm:grid-cols-2">
                <BeeijaNumberField
                  label="Total backup storage used"
                  value={backupStorageGb}
                  onChange={setBackupStorageGb}
                  suffix="GB"
                  helper="Total retained backup storage."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Provisioned IOPS per database copy"
                  value={provisionedIops}
                  onChange={setProvisionedIops}
                  suffix="IOPS"
                  helper="Use 0 when not billed separately."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Billable I/O across deployment"
                  value={billableIoMillions}
                  onChange={setBillableIoMillions}
                  suffix="million"
                  helper="Monthly billable I/O requests."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Outbound data transfer"
                  value={internetEgressGb}
                  onChange={setInternetEgressGb}
                  suffix="GB"
                  helper="Monthly billable outbound data."
                  sanitizeDecimal
                />
              </div>
            </BeeijaAdvancedSection>

            <div className="mt-4 rounded-lg border-l-4 border-[var(--yellow)] bg-[#f6fbf7] px-4 py-3">
              <p className="font-semibold text-slate-950">
                Shared workload summary
              </p>
              <div className="mt-2 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <p>Running time: {formatNumber(result.hours)} hours</p>
                <p>
                  Node size: {formatNumber(result.vcpus)} vCPU /{" "}
                  {formatNumber(result.memoryGb)} GB
                </p>
                <p>Primary storage: {formatNumber(result.primaryGb)} GB</p>
                <p>Read replicas: {formatInteger(result.replicas)}</p>
                <p>Backup storage: {formatNumber(result.backupGb)} GB</p>
                <p>Billable I/O: {formatNumber(result.ioMillions)} million</p>
              </div>
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
                key={`${activeEditorPlan.id}-${activeEditorPlan.providerId}`}
                plan={activeEditorPlan}
                onChange={(field, value) =>
                  updatePlan(activeEditorPlan.id, field, value)
                }
              />
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            className="beeija-btn-outline mt-7"
          >
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
                  : "Enter provider prices"}
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
                label="IOPS and paid I/O"
                value={
                  selectedResult.configured
                    ? formatMoney(
                        selectedResult.provisionedIopsCost +
                          selectedResult.paidIoCost,
                      )
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
              Compare configured MySQL plans using the same workload.
            </p>

            <div className="mt-4 space-y-2">
              {result.rows.map((row) => {
                const display = getProviderDisplay(
                  getProvider(row.providerId),
                );

                return (
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
                        {display.providerName}
                      </span>
                      <span className="block truncate text-sm text-slate-500">
                        {display.serviceName}
                      </span>
                    </span>
                    <span className="max-w-[7rem] truncate text-right text-base font-semibold tabular-nums text-slate-950 sm:max-w-[10rem]">
                      {row.configured
                        ? formatMoney(row.monthlyPlanningCost)
                        : "—"}
                    </span>
                  </button>
                );
              })}
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
                  label="Cost per billable vCPU"
                  value={formatMoney(selectedResult.costPerBillableVcpu)}
                />
                <ResultStat
                  label="Cost per primary storage GB"
                  value={formatMoney(selectedResult.costPerPrimaryStorageGb)}
                />
                <ResultStat
                  label="Database copies"
                  value={formatInteger(selectedResult.databaseCopies)}
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
              Provider, region, tier, availability, and machine selections
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
  const provider = getProvider(plan.providerId);
  const providerDisplay = getProviderDisplay(provider);
  const showCustomBackup = plan.backupAllowanceMode === "custom";

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
          label="Service tier or edition"
          value={plan.editionId}
          onChange={(event) => onChange("editionId", event.target.value)}
          options={getCompactOptions(provider.editions)}
        />

        <BeeijaSelect
          label="Availability configuration"
          value={plan.availabilityId}
          onChange={(event) =>
            onChange("availabilityId", event.target.value)
          }
          options={getCompactOptions(provider.availabilityOptions)}
        />

        <InlineTextField
          label="Machine or instance name"
          value={plan.machineLabel}
          onChange={(value) => onChange("machineLabel", value)}
          helper="Optional reference for this setup."
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
          options={getCompactOptions(backupAllowanceOptions)}
        />

        <BeeijaNumberField
          label="Deployment compute price per hour"
          value={plan.deploymentComputePricePerHour}
          onChange={(value) =>
            onChange("deploymentComputePricePerHour", value)
          }
          prefix="$"
          helper="Primary or HA deployment rate."
          sanitizeDecimal
        />

        <BeeijaNumberField
          label="Replica compute price per hour"
          value={plan.replicaComputePricePerHour}
          onChange={(value) =>
            onChange("replicaComputePricePerHour", value)
          }
          prefix="$"
          helper="Rate for each read replica."
          sanitizeDecimal
        />

        <BeeijaNumberField
          label="Primary storage price per GB-month"
          value={plan.deploymentStoragePricePerGbMonth}
          onChange={(value) =>
            onChange("deploymentStoragePricePerGbMonth", value)
          }
          prefix="$"
          helper="Storage rate for the primary setup."
          sanitizeDecimal
        />

        <BeeijaNumberField
          label="Replica storage price per GB-month"
          value={plan.replicaStoragePricePerGbMonth}
          onChange={(value) =>
            onChange("replicaStoragePricePerGbMonth", value)
          }
          prefix="$"
          helper="Storage rate for each replica."
          sanitizeDecimal
        />
      </div>

      <BeeijaAdvancedSection
        title="Optional backup, IOPS, I/O, network, and support rates"
        description="Open this when these items are billed separately."
      >
        <div className="grid items-start gap-3 sm:grid-cols-2">
          {showCustomBackup ? (
            <BeeijaNumberField
              label="Custom included backup storage"
              value={plan.customIncludedBackupGb}
              onChange={(value) =>
                onChange("customIncludedBackupGb", value)
              }
              suffix="GB"
              helper="Used only for a custom allowance."
              sanitizeDecimal
            />
          ) : null}

          <BeeijaNumberField
            label="Backup storage price"
            value={plan.backupPricePerGbMonth}
            onChange={(value) => onChange("backupPricePerGbMonth", value)}
            prefix="$"
            helper="Per charged GB-month."
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="Deployment IOPS price"
            value={plan.deploymentIopsPricePerIopsMonth}
            onChange={(value) =>
              onChange("deploymentIopsPricePerIopsMonth", value)
            }
            prefix="$"
            helper="Per IOPS-month."
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="Replica IOPS price"
            value={plan.replicaIopsPricePerIopsMonth}
            onChange={(value) =>
              onChange("replicaIopsPricePerIopsMonth", value)
            }
            prefix="$"
            helper="Per replica IOPS-month."
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="Paid I/O price"
            value={plan.paidIoPricePerMillion}
            onChange={(value) => onChange("paidIoPricePerMillion", value)}
            prefix="$"
            helper="Per million requests."
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
            label="Extended support price"
            value={plan.extendedSupportPricePerVcpuHour}
            onChange={(value) =>
              onChange("extendedSupportPricePerVcpuHour", value)
            }
            prefix="$"
            helper="Per vCPU-hour when applicable."
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="Effective compute discount"
            value={plan.computeDiscountPercent}
            onChange={(value) =>
              onChange("computeDiscountPercent", value)
            }
            suffix="%"
            helper="Discount applied to compute."
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
            label="One-time migration cost"
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
      <span className="mb-1 block text-[11.5px] font-semibold leading-5 text-slate-800">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[38px] w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13.5px] text-slate-900 outline-none transition hover:border-slate-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
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
              {rows.map((row, index) => {
                const display = getProviderDisplay(
                  getProvider(row.providerId),
                );

                return (
                  <tr key={row.id}>
                    <td className="min-w-64 px-4 py-4 align-top">
                      <p className="font-medium text-gray-900">
                        {row.configured && index === 0
                          ? "Lowest configured · "
                          : ""}
                        {display.serviceName}
                      </p>
                      <p className="mt-1 text-gray-600">{row.regionLabel}</p>
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
                      {row.configured ? formatMoney(row.firstYearCost) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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

type Option = {
  value: string;
  label: string;
};

type BillingModeId =
  | "per-node"
  | "whole-deployment"
  | "serverless"
  | "custom-units";

type BillingModeOption = Option & {
  description: string;
};

type ProviderDefinition = {
  id: string;
  providerName: string;
  serviceName: string;
  regions: Option[];
  products: Option[];
  billingModes: BillingModeOption[];
  defaults: {
    regionId: string;
    productId: string;
    billingModeId: BillingModeId;
  };
};

type PlanInput = {
  id: string;
  providerId: string;
  regionId: string;
  customRegion: string;
  productId: string;
  billingModeId: BillingModeId;
  configurationLabel: string;
  usableMemoryGb: string;
  hourlyBasePrice: string;
  customHourlyUnits: string;
  serverlessStoragePricePerGbHour: string;
  requestPricePerMillion: string;
  backupPricePerGbMonth: string;
  egressPricePerGb: string;
  extendedSupportPricePerNodeHour: string;
  eligibleUsageDiscountPercent: string;
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
  productLabel: string;
  billingModeLabel: string;
  configurationLabel: string;
  configured: boolean;
  totalCacheNodes: number;
  hourlyBillingUnits: number;
  usableMemoryGb: number;
  memoryHeadroomGb: number;
  memoryCoveragePercent: number;
  hourlyBaseCostBeforeDiscount: number;
  serverlessStorageCostBeforeDiscount: number;
  requestCostBeforeDiscount: number;
  eligibleUsageBeforeDiscount: number;
  eligibleUsageDiscountAmount: number;
  eligibleUsageAfterDiscount: number;
  backupCost: number;
  egressCost: number;
  extendedSupportCost: number;
  fixedMonthlyCost: number;
  monthlyOperatingCost: number;
  amortizedMigrationCost: number;
  monthlyPlanningCost: number;
  oneTimeMigrationCost: number;
  firstYearCost: number;
  costPerUsableMemoryGb: number;
  costPerMillionRequests: number;
  budgetDifference: number;
  enteredPriceCount: number;
};

type CostRow = {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
};

const billingModes: BillingModeOption[] = [
  {
    value: "per-node",
    label: "Hourly price per cache node",
    description:
      "The hourly price is multiplied by every primary and replica node in the shared topology.",
  },
  {
    value: "whole-deployment",
    label: "Hourly price for the complete deployment",
    description:
      "One hourly price already covers the selected cache deployment, capacity, and availability configuration.",
  },
  {
    value: "serverless",
    label: "Serverless data and request usage",
    description:
      "Average stored data and monthly processing or request usage are priced separately. An optional hourly base price can also be entered.",
  },
  {
    value: "custom-units",
    label: "Custom number of hourly billing units",
    description:
      "Enter the exact number of identical hourly units used by the provider's pricing model.",
  },
];

const providers: ProviderDefinition[] = [
  {
    id: "aws",
    providerName: "Amazon Web Services",
    serviceName: "Amazon ElastiCache",
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
    products: [
      {
        value: "valkey-node",
        label: "ElastiCache for Valkey — node-based",
      },
      {
        value: "valkey-serverless",
        label: "ElastiCache Serverless for Valkey",
      },
      {
        value: "redis-node",
        label: "ElastiCache for Redis OSS — node-based",
      },
      {
        value: "redis-serverless",
        label: "ElastiCache Serverless for Redis OSS",
      },
    ],
    billingModes,
    defaults: {
      regionId: "ap-south-1",
      productId: "valkey-node",
      billingModeId: "per-node",
    },
  },
  {
    id: "azure",
    providerName: "Microsoft Azure",
    serviceName: "Azure Managed Redis",
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
    products: [
      { value: "memory", label: "Memory Optimized" },
      { value: "balanced", label: "Balanced" },
      { value: "compute", label: "Compute Optimized" },
      { value: "flash", label: "Flash Optimized" },
    ],
    billingModes,
    defaults: {
      regionId: "central-india",
      productId: "balanced",
      billingModeId: "whole-deployment",
    },
  },
  {
    id: "gcp",
    providerName: "Google Cloud",
    serviceName: "Google Cloud Memorystore",
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
    products: [
      { value: "valkey", label: "Memorystore for Valkey" },
      {
        value: "redis-cluster",
        label: "Memorystore for Redis Cluster",
      },
      { value: "redis", label: "Memorystore for Redis" },
    ],
    billingModes,
    defaults: {
      regionId: "asia-south1",
      productId: "valkey",
      billingModeId: "per-node",
    },
  },
  {
    id: "custom",
    providerName: "Custom Provider",
    serviceName: "Custom Managed Redis or Valkey Plan",
    regions: [{ value: "other", label: "Custom region" }],
    products: [{ value: "custom", label: "Custom cache product" }],
    billingModes,
    defaults: {
      regionId: "other",
      productId: "custom",
      billingModeId: "custom-units",
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

function getBillingMode(
  provider: ProviderDefinition,
  billingModeId: BillingModeId,
) {
  return (
    provider.billingModes.find(
      (mode) => mode.value === billingModeId,
    ) ?? provider.billingModes[0]
  );
}

function createPlan(id: string, providerId: string): PlanInput {
  const provider = getProvider(providerId);

  return {
    id,
    providerId: provider.id,
    regionId: provider.defaults.regionId,
    customRegion: "",
    productId: provider.defaults.productId,
    billingModeId: provider.defaults.billingModeId,
    configurationLabel: "",
    usableMemoryGb: "",
    hourlyBasePrice: "",
    customHourlyUnits: "1",
    serverlessStoragePricePerGbHour: "",
    requestPricePerMillion: "",
    backupPricePerGbMonth: "",
    egressPricePerGb: "",
    extendedSupportPricePerNodeHour: "",
    eligibleUsageDiscountPercent: "",
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
  const [datasetGb, setDatasetGb] = useState("10");
  const [memoryOverheadPercent, setMemoryOverheadPercent] =
    useState("25");
  const [primaryShards, setPrimaryShards] = useState("1");
  const [replicasPerShard, setReplicasPerShard] = useState("1");
  const [monthlyRequestsMillions, setMonthlyRequestsMillions] =
    useState("100");
  const [backupStorageGb, setBackupStorageGb] = useState("10");
  const [internetEgressGb, setInternetEgressGb] = useState("0");
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
              productId: provider.defaults.productId,
              billingModeId: provider.defaults.billingModeId,
            }
          : plan,
      ),
    );
  };

  const result = useMemo(() => {
    const hours = toNumber(runningHours);
    const dataGb = toNumber(datasetGb);
    const overheadPercent = clampPercent(memoryOverheadPercent);
    const shards = Math.max(1, Math.floor(toNumber(primaryShards)));
    const replicas = Math.max(
      0,
      Math.floor(toNumber(replicasPerShard)),
    );
    const requestsMillions = toNumber(monthlyRequestsMillions);
    const backupGb = toNumber(backupStorageGb);
    const egressGb = toNumber(internetEgressGb);
    const budget = toNumber(monthlyBudget);

    const requiredMemoryGb = dataGb * (1 + overheadPercent / 100);
    const totalCacheNodes = shards * (1 + replicas);

    const rows: PlanResult[] = plans.map((plan) => {
      const provider = getProvider(plan.providerId);
      const billingMode = getBillingMode(
        provider,
        plan.billingModeId,
      );

      const usableMemoryGb = toNumber(plan.usableMemoryGb);
      const hourlyBasePrice = toNumber(plan.hourlyBasePrice);
      const customHourlyUnits = Math.max(
        0,
        toNumber(plan.customHourlyUnits),
      );
      const storagePrice = toNumber(
        plan.serverlessStoragePricePerGbHour,
      );
      const requestPrice = toNumber(plan.requestPricePerMillion);
      const backupPrice = toNumber(plan.backupPricePerGbMonth);
      const egressPrice = toNumber(plan.egressPricePerGb);
      const extendedSupportPrice = toNumber(
        plan.extendedSupportPricePerNodeHour,
      );
      const discountPercent = clampPercent(
        plan.eligibleUsageDiscountPercent,
      );
      const fixedMonthlyCost = toNumber(plan.fixedMonthlyCost);
      const oneTimeMigrationCost = toNumber(
        plan.oneTimeMigrationCost,
      );
      const migrationMonths = Math.max(
        1,
        toNumber(plan.migrationAmortizationMonths),
      );

      const hourlyBillingUnits =
        plan.billingModeId === "per-node"
          ? totalCacheNodes
          : plan.billingModeId === "custom-units"
            ? customHourlyUnits
            : 1;

      const hourlyBaseCostBeforeDiscount =
        hourlyBasePrice * hours * hourlyBillingUnits;
      const serverlessStorageCostBeforeDiscount =
        storagePrice * dataGb * hours;
      const requestCostBeforeDiscount =
        requestPrice * requestsMillions;

      const eligibleUsageBeforeDiscount =
        hourlyBaseCostBeforeDiscount +
        serverlessStorageCostBeforeDiscount +
        requestCostBeforeDiscount;
      const eligibleUsageDiscountAmount =
        eligibleUsageBeforeDiscount * (discountPercent / 100);
      const eligibleUsageAfterDiscount =
        eligibleUsageBeforeDiscount - eligibleUsageDiscountAmount;

      const backupCost = backupPrice * backupGb;
      const egressCost = egressPrice * egressGb;
      const extendedSupportCost =
        extendedSupportPrice * totalCacheNodes * hours;
      const amortizedMigrationCost =
        oneTimeMigrationCost / migrationMonths;

      const monthlyOperatingCost =
        eligibleUsageAfterDiscount +
        backupCost +
        egressCost +
        extendedSupportCost +
        fixedMonthlyCost;
      const monthlyPlanningCost =
        monthlyOperatingCost + amortizedMigrationCost;
      const firstYearCost =
        monthlyOperatingCost * 12 + oneTimeMigrationCost;

      const enteredPriceFields = [
        plan.hourlyBasePrice,
        plan.serverlessStoragePricePerGbHour,
        plan.requestPricePerMillion,
        plan.backupPricePerGbMonth,
        plan.egressPricePerGb,
        plan.extendedSupportPricePerNodeHour,
        plan.fixedMonthlyCost,
        plan.oneTimeMigrationCost,
      ];

      const enteredPriceCount = enteredPriceFields.filter(
        (value) => value.trim() !== "",
      ).length;
      const configured = enteredPriceCount > 0;
      const memoryHeadroomGb = usableMemoryGb - requiredMemoryGb;
      const memoryCoveragePercent =
        requiredMemoryGb > 0
          ? (usableMemoryGb / requiredMemoryGb) * 100
          : usableMemoryGb > 0
            ? 100
            : 0;

      return {
        id: plan.id,
        providerId: plan.providerId,
        providerName: provider.providerName,
        serviceName: provider.serviceName,
        displayName: getDisplayName(plan),
        regionLabel: getRegionLabel(plan, provider),
        productLabel: getOptionLabel(
          provider.products,
          plan.productId,
        ),
        billingModeLabel: billingMode.label,
        configurationLabel:
          plan.configurationLabel.trim() ||
          "Configuration name not entered",
        configured,
        totalCacheNodes,
        hourlyBillingUnits,
        usableMemoryGb,
        memoryHeadroomGb,
        memoryCoveragePercent,
        hourlyBaseCostBeforeDiscount,
        serverlessStorageCostBeforeDiscount,
        requestCostBeforeDiscount,
        eligibleUsageBeforeDiscount,
        eligibleUsageDiscountAmount,
        eligibleUsageAfterDiscount,
        backupCost,
        egressCost,
        extendedSupportCost,
        fixedMonthlyCost,
        monthlyOperatingCost,
        amortizedMigrationCost,
        monthlyPlanningCost,
        oneTimeMigrationCost,
        firstYearCost,
        costPerUsableMemoryGb:
          usableMemoryGb > 0
            ? monthlyPlanningCost / usableMemoryGb
            : 0,
        costPerMillionRequests:
          requestsMillions > 0
            ? monthlyPlanningCost / requestsMillions
            : 0,
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
        ? Math.max(
            0,
            selected.firstYearCost - cheapest.firstYearCost,
          )
        : 0;

    return {
      hours,
      dataGb,
      overheadPercent,
      requiredMemoryGb,
      shards,
      replicas,
      totalCacheNodes,
      requestsMillions,
      backupGb,
      egressGb,
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
    datasetGb,
    internetEgressGb,
    memoryOverheadPercent,
    monthlyBudget,
    monthlyRequestsMillions,
    plans,
    primaryShards,
    replicasPerShard,
    runningHours,
    selectedPlanId,
  ]);

  const selectedPlanInput =
    plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const selectedResult = result.selected;

  const selectedRows: CostRow[] = [
    {
      label: "Hourly cache or deployment cost",
      detail: `${formatNumber(
        result.hours,
      )} hours × ${formatNumber(
        selectedResult.hourlyBillingUnits,
      )} hourly billing units`,
      value: selectedResult.hourlyBaseCostBeforeDiscount,
      entered: selectedPlanInput.hourlyBasePrice.trim() !== "",
    },
    {
      label: "Serverless data storage",
      detail: `${formatNumber(result.dataGb)} average GB × ${formatNumber(
        result.hours,
      )} hours`,
      value: selectedResult.serverlessStorageCostBeforeDiscount,
      entered:
        selectedPlanInput.serverlessStoragePricePerGbHour.trim() !==
        "",
    },
    {
      label: "Requests or processing units",
      detail: `${formatNumber(
        result.requestsMillions,
      )} million monthly units`,
      value: selectedResult.requestCostBeforeDiscount,
      entered: selectedPlanInput.requestPricePerMillion.trim() !== "",
    },
    {
      label: "Eligible usage discount",
      detail: `${formatNumber(
        clampPercent(selectedPlanInput.eligibleUsageDiscountPercent),
      )}% of eligible node, deployment, storage, and request usage`,
      value: -selectedResult.eligibleUsageDiscountAmount,
      entered:
        selectedPlanInput.eligibleUsageDiscountPercent.trim() !== "",
    },
    {
      label: "Backup or snapshot storage",
      detail: `${formatNumber(result.backupGb)} GB-month`,
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
      label: "Redis OSS extended support",
      detail: `${formatInteger(
        result.totalCacheNodes,
      )} cache nodes × ${formatNumber(result.hours)} hours`,
      value: selectedResult.extendedSupportCost,
      entered:
        selectedPlanInput.extendedSupportPricePerNodeHour.trim() !==
        "",
    },
    {
      label: "Other fixed monthly services",
      detail:
        "Monitoring, persistence, private connectivity, or another fixed charge",
      value: selectedResult.fixedMonthlyCost,
      entered: selectedPlanInput.fixedMonthlyCost.trim() !== "",
    },
    {
      label: "Amortized migration cost",
      detail: `${formatVisibleMoney(
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
    setDatasetGb("10");
    setMemoryOverheadPercent("25");
    setPrimaryShards("1");
    setReplicasPerShard("1");
    setMonthlyRequestsMillions("100");
    setBackupStorageGb("10");
    setInternetEgressGb("0");
    setMonthlyBudget("");
    setPlans(initialPlans.map((plan) => ({ ...plan })));
    setSelectedPlanId("plan-a");
    setActiveEditorPlanId("plan-a");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter the Shared Redis or Valkey Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Use the same data size, memory headroom, topology, requests,
            transfer, and backup workload for every provider plan.
          </p>
        </div>

        <FieldSection title="Runtime, Data, and Memory">
          <BeeijaNumberField
            label="Cache running time per month"
            value={runningHours}
            onChange={setRunningHours}
            min="0"
            max="744"
            step="1"
            suffix="hours"
          />

          <BeeijaNumberField
            label="Average dataset stored in cache"
            value={datasetGb}
            onChange={setDatasetGb}
            min="0"
            step="0.1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Memory overhead and growth allowance"
            value={memoryOverheadPercent}
            onChange={setMemoryOverheadPercent}
            min="0"
            max="500"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Target monthly managed cache budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Shards, Replicas, and Usage">
          <BeeijaNumberField
            label="Primary shards"
            value={primaryShards}
            onChange={setPrimaryShards}
            min="1"
            step="1"
          />

          <BeeijaNumberField
            label="Replicas per primary shard"
            value={replicasPerShard}
            onChange={setReplicasPerShard}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Monthly requests or processing units"
            value={monthlyRequestsMillions}
            onChange={setMonthlyRequestsMillions}
            min="0"
            step="0.1"
            suffix="million"
          />

          <BeeijaNumberField
            label="Backup or snapshot storage"
            value={backupStorageGb}
            onChange={setBackupStorageGb}
            min="0"
            step="0.1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Internet or cross-region data transfer out"
            value={internetEgressGb}
            onChange={setInternetEgressGb}
            min="0"
            step="1"
            suffix="GB"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Shared workload summary
          </p>

          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>
              Required memory: {formatNumber(result.requiredMemoryGb)} GB
            </p>
            <p>
              Dataset: {formatNumber(result.dataGb)} GB plus {formatNumber(
                result.overheadPercent,
              )}% overhead
            </p>
            <p>Primary shards: {formatInteger(result.shards)}</p>
            <p>Replicas per shard: {formatInteger(result.replicas)}</p>
            <p>Total cache nodes: {formatInteger(result.totalCacheNodes)}</p>
            <p>
              Monthly usage: {formatNumber(result.requestsMillions)} million
            </p>
            <p>Backup storage: {formatNumber(result.backupGb)} GB</p>
            <p>Transfer out: {formatNumber(result.egressGb)} GB</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-950">
            Select Provider Configurations and Enter Prices
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Choose the provider, region, product, billing model, and capacity.
            Current prices remain blank so you can enter the exact effective
            rates for each selected plan.
          </p>
        </div>

        <div className="mt-6">
          <div
            className="grid gap-2 sm:grid-cols-3"
            role="tablist"
            aria-label="Managed Redis and Valkey comparison plans"
          >
            {plans.map((plan, index) => {
              const isActive = plan.id === activeEditorPlanId;
              const provider = getProvider(plan.providerId);

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
                    {provider.serviceName}
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

      <div className="min-w-0 overflow-hidden">
        <BeeijaCalculatorResultPanel
          title="Managed Redis and Valkey Cost Comparison"
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
                label="Cost per usable memory GB"
                value={
                  selectedResult.configured &&
                  selectedResult.usableMemoryGb > 0
                    ? formatVisibleMoney(
                        selectedResult.costPerUsableMemoryGb,
                      )
                    : "—"
                }
              />

              <ResultStat
                label="Cost per million requests"
                value={
                  selectedResult.configured &&
                  result.requestsMillions > 0
                    ? formatVisibleMoney(
                        selectedResult.costPerMillionRequests,
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
                  {selectedResult.productLabel} · {selectedResult.configurationLabel}
                </p>
                <p className="mt-1">
                  {selectedResult.billingModeLabel} · {formatNumber(
                    selectedResult.hourlyBillingUnits,
                  )} hourly units
                </p>
                <p className="mt-1">
                  Usable memory: {formatNumber(selectedResult.usableMemoryGb)} GB
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

              <ComparisonTable
                rows={result.comparisonRows}
                requiredMemoryGb={result.requiredMemoryGb}
              />
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
                Product and billing model:{" "}
                <span className="font-medium text-gray-900">
                  {selectedResult.productLabel} · {selectedResult.billingModeLabel}
                </span>
              </p>

              <p className="mt-2">
                Cache topology:{" "}
                <span className="font-medium text-gray-900">
                  {formatInteger(result.shards)} primary shards, {formatInteger(
                    result.replicas,
                  )} replicas per shard, {formatInteger(
                    result.totalCacheNodes,
                  )} total nodes
                </span>
              </p>

              <p className="mt-2">
                Memory status:{" "}
                <span
                  className={`font-semibold ${
                    selectedResult.usableMemoryGb > 0 &&
                    selectedResult.memoryHeadroomGb < 0
                      ? "text-red-700"
                      : "text-[var(--green)]"
                  }`}
                >
                  {selectedResult.usableMemoryGb <= 0
                    ? "Enter usable memory"
                    : selectedResult.memoryHeadroomGb >= 0
                      ? `${formatNumber(
                          selectedResult.memoryHeadroomGb,
                        )} GB headroom (${formatNumber(
                          selectedResult.memoryCoveragePercent,
                        )}% coverage)`
                      : `${formatNumber(
                          Math.abs(selectedResult.memoryHeadroomGb),
                        )} GB short (${formatNumber(
                          selectedResult.memoryCoveragePercent,
                        )}% coverage)`}
                </span>
              </p>

              <p className="mt-2">
                Monthly operating cost:{" "}
                <span className="font-medium text-gray-900">
                  {selectedResult.configured
                    ? formatVisibleMoney(
                        selectedResult.monthlyOperatingCost,
                      )
                    : "—"}
                </span>
              </p>

              <p className="mt-2">
                Monthly migration allocation:{" "}
                <span className="font-medium text-gray-900">
                  {selectedResult.configured
                    ? formatVisibleMoney(
                        selectedResult.amortizedMigrationCost,
                      )
                    : "—"}
                </span>
              </p>

              <p className="mt-2">
                Lowest configured plan:{" "}
                <span className="font-medium text-gray-900">
                  {result.cheapest
                    ? `${result.cheapest.displayName} at ${formatVisibleMoney(
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
                  {selectedResult.enteredPriceCount} of 8
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
                        ? `${formatVisibleMoney(
                            selectedResult.budgetDifference,
                          )} remaining`
                        : `${formatVisibleMoney(
                            Math.abs(selectedResult.budgetDifference),
                          )} over budget`}
                </span>
              </p>
            </div>
          }
          provider="Amazon ElastiCache for Valkey or Redis OSS, Microsoft Azure Managed Redis, Google Cloud Memorystore for Valkey or Redis, and custom managed cache plans"
          excludedCosts="taxes, premium support, private connectivity, monitoring, persistence storage, cross-region replication, global databases, backup exports, encryption key requests, public IP addresses, migration labour, negotiated credits, and services not entered"
          noticeText="Provider, region, product, billing-model, and configuration selections identify the plan only; they do not load or imply a current price. Enter current effective rates for the exact selected setup. Product names, pricing structures, and official billing guidance were checked on June 25, 2026. Blank optional price fields are treated as zero."
        />
      </div>
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
  const provider = getProvider(plan.providerId);
  const billingMode = getBillingMode(
    provider,
    plan.billingModeId,
  );

  const providerOptions = providers.map((item) => ({
    value: item.id,
    label: item.serviceName,
  }));

  const showCustomHourlyUnits =
    plan.billingModeId === "custom-units";
  const showServerlessUsage =
    plan.billingModeId === "serverless";

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
          label="Managed Redis or Valkey provider"
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
          label="Provider product or tier"
          value={plan.productId}
          onChange={(event) =>
            onChange("productId", event.target.value)
          }
          options={provider.products}
        />

        <BeeijaSelect
          label="Billing model"
          value={plan.billingModeId}
          onChange={(event) =>
            onChange(
              "billingModeId",
              event.target.value as BillingModeId,
            )
          }
          options={provider.billingModes}
        />

        <TextField
          label="Node type, SKU, or configuration name"
          value={plan.configurationLabel}
          onChange={(value) =>
            onChange("configurationLabel", value)
          }
        />

        <BeeijaNumberField
          label="Usable application memory for this plan"
          value={plan.usableMemoryGb}
          onChange={(value) => onChange("usableMemoryGb", value)}
          min="0"
          step="0.1"
          suffix="GB"
        />
      </FieldSection>

      <div className="mt-5 rounded-xl border-l-4 border-[#F2C94C] bg-[#FFF8E8] px-5 py-4 shadow-sm">
        <p className="text-sm leading-6 text-gray-700">
          {billingMode.description}
        </p>
      </div>

      <FieldSection title="Hourly and Serverless Usage Prices">
        <BeeijaNumberField
          label={
            plan.billingModeId === "per-node"
              ? "Hourly price per cache node"
              : plan.billingModeId === "whole-deployment"
                ? "Hourly price for complete deployment"
                : plan.billingModeId === "serverless"
                  ? "Optional serverless base price per hour"
                  : "Hourly price per custom billing unit"
          }
          value={plan.hourlyBasePrice}
          onChange={(value) => onChange("hourlyBasePrice", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />

        {showCustomHourlyUnits ? (
          <BeeijaNumberField
            label="Custom hourly billing units"
            value={plan.customHourlyUnits}
            onChange={(value) =>
              onChange("customHourlyUnits", value)
            }
            min="0"
            step="0.1"
            suffix="units"
          />
        ) : null}

        <BeeijaNumberField
          label="Data storage price per GB-hour"
          value={plan.serverlessStoragePricePerGbHour}
          onChange={(value) =>
            onChange("serverlessStoragePricePerGbHour", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Request or processing price per million units"
          value={plan.requestPricePerMillion}
          onChange={(value) =>
            onChange("requestPricePerMillion", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
      </FieldSection>

      {!showServerlessUsage ? (
        <p className="mt-3 text-sm text-gray-500">
          Leave serverless storage and request prices blank when the selected
          node or deployment price already includes them.
        </p>
      ) : null}

      <FieldSection title="Backup, Transfer, Support, and Discounts">
        <BeeijaNumberField
          label="Backup or snapshot price per GB-month"
          value={plan.backupPricePerGbMonth}
          onChange={(value) =>
            onChange("backupPricePerGbMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Effective data transfer-out price per GB"
          value={plan.egressPricePerGb}
          onChange={(value) => onChange("egressPricePerGb", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Extended-support price per cache node-hour"
          value={plan.extendedSupportPricePerNodeHour}
          onChange={(value) =>
            onChange("extendedSupportPricePerNodeHour", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Effective discount on eligible usage"
          value={plan.eligibleUsageDiscountPercent}
          onChange={(value) =>
            onChange("eligibleUsageDiscountPercent", value)
          }
          min="0"
          max="100"
          step="0.1"
          suffix="%"
        />

        <BeeijaNumberField
          label="Other fixed monthly cache services"
          value={plan.fixedMonthlyCost}
          onChange={(value) => onChange("fixedMonthlyCost", value)}
          min="0"
          step="1"
          prefix="$"
        />
      </FieldSection>

      <FieldSection title="Migration Cost">
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
        <p className="mt-1 text-sm text-gray-500">{detail}</p>
      </div>
      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {entered ? formatVisibleMoney(value) : "—"}
      </p>
    </div>
  );
}

function ComparisonTable({
  rows,
  requiredMemoryGb,
}: {
  rows: PlanResult[];
  requiredMemoryGb: number;
}) {
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
                  Memory
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
                      {row.productLabel}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {row.billingModeLabel}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      {row.configured
                        ? `${row.enteredPriceCount} price inputs entered`
                        : "Enter at least one provider price"}
                    </p>
                  </td>

                  <td className="min-w-36 px-4 py-4 align-top text-gray-900">
                    <p>{formatNumber(row.usableMemoryGb)} GB usable</p>
                    <p
                      className={`mt-1 text-xs ${
                        row.usableMemoryGb > 0 &&
                        row.usableMemoryGb < requiredMemoryGb
                          ? "text-red-700"
                          : "text-gray-500"
                      }`}
                    >
                      {row.usableMemoryGb <= 0
                        ? "Capacity not entered"
                        : row.memoryHeadroomGb >= 0
                          ? `${formatNumber(
                              row.memoryHeadroomGb,
                            )} GB headroom`
                          : `${formatNumber(
                              Math.abs(row.memoryHeadroomGb),
                            )} GB short`}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-950">
                    {row.configured
                      ? formatVisibleMoney(row.monthlyPlanningCost)
                      : "—"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-gray-900">
                    {row.configured
                      ? formatVisibleMoney(row.firstYearCost)
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

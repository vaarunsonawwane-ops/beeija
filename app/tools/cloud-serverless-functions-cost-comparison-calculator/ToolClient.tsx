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

type BillingModeId = "memory-only" | "cpu-memory" | "monthly-plan";
type FreeGrantScope = "on-demand" | "all-requests" | "none";

type BillingModeOption = Option & {
  description: string;
};

type ProviderDefinition = {
  id: string;
  providerName: string;
  serviceName: string;
  regions: Option[];
  plans: Option[];
  architectures: Option[];
  billingModes: BillingModeOption[];
  defaults: {
    regionId: string;
    planId: string;
    architectureId: string;
    billingModeId: BillingModeId;
    freeGrantScope: FreeGrantScope;
  };
};

type PlanInput = {
  id: string;
  providerId: string;
  regionId: string;
  customRegion: string;
  planId: string;
  architectureId: string;
  billingModeId: BillingModeId;
  configurationLabel: string;
  freeGrantScope: FreeGrantScope;
  onDemandRequestPricePerMillion: string;
  warmRequestPricePerMillion: string;
  freeRequestsPerMonth: string;
  onDemandGbSecondPrice: string;
  warmExecutionGbSecondPrice: string;
  freeGbSecondsPerMonth: string;
  onDemandVcpuSecondPrice: string;
  warmExecutionVcpuSecondPrice: string;
  freeVcpuSecondsPerMonth: string;
  warmBaselineGbSecondPrice: string;
  warmBaselineVcpuSecondPrice: string;
  includedEphemeralStorageGb: string;
  ephemeralStoragePricePerGbSecond: string;
  egressPricePerGb: string;
  loggingPricePerGb: string;
  computeDiscountPercent: string;
  fixedMonthlyCost: string;
  oneTimeMigrationCost: string;
  migrationAmortizationMonths: string;
  completeMonthlyComputePrice: string;
};

type PlanResult = {
  id: string;
  providerName: string;
  serviceName: string;
  displayName: string;
  regionLabel: string;
  planLabel: string;
  architectureLabel: string;
  billingModeLabel: string;
  configurationLabel: string;
  configured: boolean;
  totalRequests: number;
  onDemandRequests: number;
  warmRequests: number;
  billableOnDemandRequests: number;
  requestCost: number;
  totalExecutionSeconds: number;
  onDemandExecutionSeconds: number;
  warmExecutionSeconds: number;
  onDemandGbSeconds: number;
  warmGbSeconds: number;
  billableOnDemandGbSeconds: number;
  onDemandVcpuSeconds: number;
  warmVcpuSeconds: number;
  billableOnDemandVcpuSeconds: number;
  onDemandMemoryCost: number;
  warmMemoryExecutionCost: number;
  onDemandCpuCost: number;
  warmCpuExecutionCost: number;
  completeMonthlyComputeCost: number;
  warmBaselineGbSeconds: number;
  warmBaselineVcpuSeconds: number;
  warmBaselineMemoryCost: number;
  warmBaselineCpuCost: number;
  ephemeralStorageGbSeconds: number;
  ephemeralStorageCost: number;
  computeBeforeDiscount: number;
  computeDiscountAmount: number;
  computeAfterDiscount: number;
  egressCost: number;
  loggingCost: number;
  fixedMonthlyCost: number;
  monthlyOperatingCost: number;
  amortizedMigrationCost: number;
  monthlyPlanningCost: number;
  oneTimeMigrationCost: number;
  firstYearCost: number;
  costPerMillionRequests: number;
  costPerExecution: number;
  budgetDifference: number;
  enteredPriceCount: number;
};

type CostRow = {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
  negative?: boolean;
};

const billingModes: BillingModeOption[] = [
  {
    value: "memory-only",
    label: "Requests plus memory GB-seconds",
    description:
      "Use request charges and memory-based execution measured in GB-seconds.",
  },
  {
    value: "cpu-memory",
    label: "Requests plus vCPU-seconds and GB-seconds",
    description:
      "Use separate request, CPU, and memory execution prices.",
  },
  {
    value: "monthly-plan",
    label: "Complete monthly function compute price",
    description:
      "Use one complete monthly compute amount for a bundled or negotiated plan.",
  },
];

const freeGrantScopeOptions: Option[] = [
  {
    value: "on-demand",
    label: "Apply free grants to on-demand usage only",
  },
  {
    value: "all-requests",
    label: "Apply request grant across all requests",
  },
  {
    value: "none",
    label: "Do not apply free grants",
  },
];

const providers: ProviderDefinition[] = [
  {
    id: "aws",
    providerName: "Amazon Web Services",
    serviceName: "AWS Lambda",
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
    plans: [
      { value: "on-demand", label: "Lambda on-demand" },
      { value: "provisioned", label: "Lambda Provisioned Concurrency" },
      { value: "snapstart", label: "Lambda with SnapStart" },
      { value: "edge", label: "Lambda@Edge" },
      { value: "custom", label: "Other Lambda configuration" },
    ],
    architectures: [
      { value: "x86", label: "x86 architecture" },
      { value: "arm", label: "Arm architecture" },
      { value: "custom", label: "Other architecture" },
    ],
    billingModes,
    defaults: {
      regionId: "ap-south-1",
      planId: "on-demand",
      architectureId: "x86",
      billingModeId: "memory-only",
      freeGrantScope: "on-demand",
    },
  },
  {
    id: "azure",
    providerName: "Microsoft Azure",
    serviceName: "Azure Functions",
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
    plans: [
      { value: "flex", label: "Flex Consumption" },
      { value: "consumption", label: "Consumption plan (legacy)" },
      { value: "premium", label: "Premium plan" },
      { value: "container-apps", label: "Functions on Azure Container Apps" },
      { value: "dedicated", label: "Dedicated App Service plan" },
      { value: "custom", label: "Other Azure Functions plan" },
    ],
    architectures: [
      { value: "linux", label: "Linux code deployment" },
      { value: "windows", label: "Windows code deployment" },
      { value: "container", label: "Linux container deployment" },
      { value: "custom", label: "Other runtime configuration" },
    ],
    billingModes,
    defaults: {
      regionId: "central-india",
      planId: "flex",
      architectureId: "linux",
      billingModeId: "memory-only",
      freeGrantScope: "on-demand",
    },
  },
  {
    id: "gcp",
    providerName: "Google Cloud",
    serviceName: "Cloud Run functions",
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
    plans: [
      { value: "request-based", label: "Cloud Run functions request-based billing" },
      { value: "instance-based", label: "Cloud Run functions instance-based billing" },
      { value: "minimum-instances", label: "Cloud Run functions with minimum instances" },
      { value: "first-gen", label: "Cloud Run functions (1st gen)" },
      { value: "custom", label: "Other Google functions configuration" },
    ],
    architectures: [
      { value: "default", label: "Default Cloud Run CPU platform" },
      { value: "gpu", label: "GPU-enabled Cloud Run configuration" },
      { value: "custom", label: "Other compute configuration" },
    ],
    billingModes,
    defaults: {
      regionId: "asia-south1",
      planId: "request-based",
      architectureId: "default",
      billingModeId: "cpu-memory",
      freeGrantScope: "on-demand",
    },
  },
  {
    id: "custom",
    providerName: "Custom Provider",
    serviceName: "Custom Serverless Functions Plan",
    regions: [{ value: "other", label: "Custom region" }],
    plans: [{ value: "custom", label: "Custom function service plan" }],
    architectures: [{ value: "custom", label: "Custom runtime or architecture" }],
    billingModes,
    defaults: {
      regionId: "other",
      planId: "custom",
      architectureId: "custom",
      billingModeId: "memory-only",
      freeGrantScope: "none",
    },
  },
];

function getProvider(providerId: string) {
  return providers.find((provider) => provider.id === providerId) ?? providers[0];
}

function getOptionLabel(options: Option[], value: string) {
  return options.find((option) => option.value === value)?.label ?? "Not selected";
}

function getBillingMode(
  provider: ProviderDefinition,
  billingModeId: BillingModeId,
) {
  return (
    provider.billingModes.find((mode) => mode.value === billingModeId) ??
    provider.billingModes[0]
  );
}

function createPlan(id: string, providerId: string): PlanInput {
  const provider = getProvider(providerId);

  return {
    id,
    providerId: provider.id,
    regionId: provider.defaults.regionId,
    customRegion: "",
    planId: provider.defaults.planId,
    architectureId: provider.defaults.architectureId,
    billingModeId: provider.defaults.billingModeId,
    configurationLabel: "",
    freeGrantScope: provider.defaults.freeGrantScope,
    onDemandRequestPricePerMillion: "",
    warmRequestPricePerMillion: "",
    freeRequestsPerMonth: "",
    onDemandGbSecondPrice: "",
    warmExecutionGbSecondPrice: "",
    freeGbSecondsPerMonth: "",
    onDemandVcpuSecondPrice: "",
    warmExecutionVcpuSecondPrice: "",
    freeVcpuSecondsPerMonth: "",
    warmBaselineGbSecondPrice: "",
    warmBaselineVcpuSecondPrice: "",
    includedEphemeralStorageGb: "",
    ephemeralStoragePricePerGbSecond: "",
    egressPricePerGb: "",
    loggingPricePerGb: "",
    computeDiscountPercent: "",
    fixedMonthlyCost: "",
    oneTimeMigrationCost: "",
    migrationAmortizationMonths: "12",
    completeMonthlyComputePrice: "",
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

function formatVisibleMoney(value: number) {
  return formatMoney(value).replace(/,/g, ",\u200B");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
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
  const [monthlyRequests, setMonthlyRequests] = useState("1000000");
  const [averageDurationMs, setAverageDurationMs] = useState("250");
  const [memoryGbPerExecution, setMemoryGbPerExecution] = useState("0.5");
  const [vcpuPerExecution, setVcpuPerExecution] = useState("0.25");
  const [ephemeralStorageGbPerExecution, setEphemeralStorageGbPerExecution] =
    useState("0.5");
  const [warmRequestPercent, setWarmRequestPercent] = useState("0");
  const [warmInstances, setWarmInstances] = useState("0");
  const [warmHoursPerMonth, setWarmHoursPerMonth] = useState("730");
  const [warmMemoryGbPerInstance, setWarmMemoryGbPerInstance] =
    useState("0.5");
  const [warmVcpuPerInstance, setWarmVcpuPerInstance] = useState("0.25");
  const [egressGbPerMonth, setEgressGbPerMonth] = useState("0");
  const [loggingGbPerMonth, setLoggingGbPerMonth] = useState("10");
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
              planId: provider.defaults.planId,
              architectureId: provider.defaults.architectureId,
              billingModeId: provider.defaults.billingModeId,
              freeGrantScope: provider.defaults.freeGrantScope,
            }
          : plan,
      ),
    );
  };

  const result = useMemo(() => {
    const requests = toNumber(monthlyRequests);
    const durationSeconds = toNumber(averageDurationMs) / 1000;
    const memoryGb = toNumber(memoryGbPerExecution);
    const vcpu = toNumber(vcpuPerExecution);
    const ephemeralGb = toNumber(ephemeralStorageGbPerExecution);
    const warmPercent = clampPercent(warmRequestPercent) / 100;
    const warmRequests = requests * warmPercent;
    const onDemandRequests = Math.max(0, requests - warmRequests);
    const warmInstanceCount = Math.floor(toNumber(warmInstances));
    const warmHours = toNumber(warmHoursPerMonth);
    const warmMemoryGb = toNumber(warmMemoryGbPerInstance);
    const warmVcpu = toNumber(warmVcpuPerInstance);
    const egressGb = toNumber(egressGbPerMonth);
    const loggingGb = toNumber(loggingGbPerMonth);
    const budget = toNumber(monthlyBudget);
    const totalExecutionSeconds = requests * durationSeconds;
    const onDemandExecutionSeconds = onDemandRequests * durationSeconds;
    const warmExecutionSeconds = warmRequests * durationSeconds;
    const averageRequestsPerSecond =
      requests / Math.max(1, 30.4375 * 24 * 60 * 60);
    const estimatedAverageConcurrency =
      averageRequestsPerSecond * durationSeconds;

    const rows: PlanResult[] = plans.map((plan) => {
      const provider = getProvider(plan.providerId);
      const billingMode = getBillingMode(provider, plan.billingModeId);

      const freeRequests =
        plan.freeGrantScope === "none"
          ? 0
          : toNumber(plan.freeRequestsPerMonth);

      const billableOnDemandRequests =
        plan.freeGrantScope === "all-requests"
          ? Math.max(0, requests - freeRequests)
          : Math.max(0, onDemandRequests - freeRequests);

      const warmRequestPrice =
        plan.warmRequestPricePerMillion.trim() !== ""
          ? toNumber(plan.warmRequestPricePerMillion)
          : toNumber(plan.onDemandRequestPricePerMillion);

      const requestCost =
        (billableOnDemandRequests / 1_000_000) *
          toNumber(plan.onDemandRequestPricePerMillion) +
        (plan.freeGrantScope === "all-requests" ? 0 : warmRequests / 1_000_000) *
          warmRequestPrice;

      const onDemandGbSeconds = onDemandExecutionSeconds * memoryGb;
      const warmGbSeconds = warmExecutionSeconds * memoryGb;
      const billableOnDemandGbSeconds =
        plan.freeGrantScope === "none"
          ? onDemandGbSeconds
          : Math.max(
              0,
              onDemandGbSeconds - toNumber(plan.freeGbSecondsPerMonth),
            );

      const onDemandVcpuSeconds = onDemandExecutionSeconds * vcpu;
      const warmVcpuSeconds = warmExecutionSeconds * vcpu;
      const billableOnDemandVcpuSeconds =
        plan.freeGrantScope === "none"
          ? onDemandVcpuSeconds
          : Math.max(
              0,
              onDemandVcpuSeconds - toNumber(plan.freeVcpuSecondsPerMonth),
            );

      const warmGbPrice =
        plan.warmExecutionGbSecondPrice.trim() !== ""
          ? toNumber(plan.warmExecutionGbSecondPrice)
          : toNumber(plan.onDemandGbSecondPrice);

      const warmVcpuPrice =
        plan.warmExecutionVcpuSecondPrice.trim() !== ""
          ? toNumber(plan.warmExecutionVcpuSecondPrice)
          : toNumber(plan.onDemandVcpuSecondPrice);

      const onDemandMemoryCost =
        plan.billingModeId === "monthly-plan"
          ? 0
          : billableOnDemandGbSeconds *
            toNumber(plan.onDemandGbSecondPrice);

      const warmMemoryExecutionCost =
        plan.billingModeId === "monthly-plan"
          ? 0
          : warmGbSeconds * warmGbPrice;

      const onDemandCpuCost =
        plan.billingModeId === "cpu-memory"
          ? billableOnDemandVcpuSeconds *
            toNumber(plan.onDemandVcpuSecondPrice)
          : 0;

      const warmCpuExecutionCost =
        plan.billingModeId === "cpu-memory"
          ? warmVcpuSeconds * warmVcpuPrice
          : 0;

      const completeMonthlyComputeCost =
        plan.billingModeId === "monthly-plan"
          ? toNumber(plan.completeMonthlyComputePrice)
          : 0;

      const warmBaselineSeconds =
        warmInstanceCount * warmHours * 3600;
      const warmBaselineGbSeconds =
        warmBaselineSeconds * warmMemoryGb;
      const warmBaselineVcpuSeconds =
        warmBaselineSeconds * warmVcpu;

      const warmBaselineMemoryCost =
        warmBaselineGbSeconds *
        toNumber(plan.warmBaselineGbSecondPrice);
      const warmBaselineCpuCost =
        warmBaselineVcpuSeconds *
        toNumber(plan.warmBaselineVcpuSecondPrice);

      const includedEphemeralGb = toNumber(
        plan.includedEphemeralStorageGb,
      );
      const billableEphemeralGb = Math.max(
        0,
        ephemeralGb - includedEphemeralGb,
      );
      const ephemeralStorageGbSeconds =
        totalExecutionSeconds * billableEphemeralGb;
      const ephemeralStorageCost =
        ephemeralStorageGbSeconds *
        toNumber(plan.ephemeralStoragePricePerGbSecond);

      const computeBeforeDiscount =
        onDemandMemoryCost +
        warmMemoryExecutionCost +
        onDemandCpuCost +
        warmCpuExecutionCost +
        completeMonthlyComputeCost +
        warmBaselineMemoryCost +
        warmBaselineCpuCost;

      const computeDiscountAmount =
        computeBeforeDiscount *
        (clampPercent(plan.computeDiscountPercent) / 100);
      const computeAfterDiscount =
        computeBeforeDiscount - computeDiscountAmount;

      const egressCost =
        egressGb * toNumber(plan.egressPricePerGb);
      const loggingCost =
        loggingGb * toNumber(plan.loggingPricePerGb);
      const fixedMonthlyCost = toNumber(plan.fixedMonthlyCost);
      const oneTimeMigrationCost = toNumber(
        plan.oneTimeMigrationCost,
      );
      const migrationMonths = Math.max(
        1,
        toNumber(plan.migrationAmortizationMonths),
      );
      const amortizedMigrationCost =
        oneTimeMigrationCost / migrationMonths;

      const monthlyOperatingCost =
        requestCost +
        computeAfterDiscount +
        ephemeralStorageCost +
        egressCost +
        loggingCost +
        fixedMonthlyCost;

      const monthlyPlanningCost =
        monthlyOperatingCost + amortizedMigrationCost;
      const firstYearCost =
        monthlyOperatingCost * 12 + oneTimeMigrationCost;

      const priceFields = [
        plan.onDemandRequestPricePerMillion,
        plan.warmRequestPricePerMillion,
        plan.onDemandGbSecondPrice,
        plan.warmExecutionGbSecondPrice,
        plan.onDemandVcpuSecondPrice,
        plan.warmExecutionVcpuSecondPrice,
        plan.warmBaselineGbSecondPrice,
        plan.warmBaselineVcpuSecondPrice,
        plan.ephemeralStoragePricePerGbSecond,
        plan.egressPricePerGb,
        plan.loggingPricePerGb,
        plan.fixedMonthlyCost,
        plan.oneTimeMigrationCost,
        plan.completeMonthlyComputePrice,
      ];

      const enteredPriceCount = priceFields.filter(
        (value) => value.trim() !== "",
      ).length;
      const configured = enteredPriceCount > 0;

      return {
        id: plan.id,
        providerName: provider.providerName,
        serviceName: provider.serviceName,
        displayName: getDisplayName(plan),
        regionLabel: getRegionLabel(plan, provider),
        planLabel: getOptionLabel(provider.plans, plan.planId),
        architectureLabel: getOptionLabel(
          provider.architectures,
          plan.architectureId,
        ),
        billingModeLabel: billingMode.label,
        configurationLabel:
          plan.configurationLabel.trim() ||
          "Configuration name not entered",
        configured,
        totalRequests: requests,
        onDemandRequests,
        warmRequests,
        billableOnDemandRequests,
        requestCost,
        totalExecutionSeconds,
        onDemandExecutionSeconds,
        warmExecutionSeconds,
        onDemandGbSeconds,
        warmGbSeconds,
        billableOnDemandGbSeconds,
        onDemandVcpuSeconds,
        warmVcpuSeconds,
        billableOnDemandVcpuSeconds,
        onDemandMemoryCost,
        warmMemoryExecutionCost,
        onDemandCpuCost,
        warmCpuExecutionCost,
        completeMonthlyComputeCost,
        warmBaselineGbSeconds,
        warmBaselineVcpuSeconds,
        warmBaselineMemoryCost,
        warmBaselineCpuCost,
        ephemeralStorageGbSeconds,
        ephemeralStorageCost,
        computeBeforeDiscount,
        computeDiscountAmount,
        computeAfterDiscount,
        egressCost,
        loggingCost,
        fixedMonthlyCost,
        monthlyOperatingCost,
        amortizedMigrationCost,
        monthlyPlanningCost,
        oneTimeMigrationCost,
        firstYearCost,
        costPerMillionRequests:
          requests > 0
            ? monthlyPlanningCost / (requests / 1_000_000)
            : 0,
        costPerExecution:
          requests > 0 ? monthlyPlanningCost / requests : 0,
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

    return {
      requests,
      durationSeconds,
      memoryGb,
      vcpu,
      ephemeralGb,
      warmPercent,
      warmRequests,
      onDemandRequests,
      warmInstanceCount,
      warmHours,
      warmMemoryGb,
      warmVcpu,
      egressGb,
      loggingGb,
      budget,
      hasBudget: monthlyBudget.trim() !== "",
      averageRequestsPerSecond,
      estimatedAverageConcurrency,
      comparisonRows,
      selected,
      cheapest,
      monthlySaving:
        selected.configured && cheapest
          ? Math.max(
              0,
              selected.monthlyPlanningCost -
                cheapest.monthlyPlanningCost,
            )
          : 0,
      firstYearSaving:
        selected.configured && cheapest
          ? Math.max(
              0,
              selected.firstYearCost - cheapest.firstYearCost,
            )
          : 0,
    };
  }, [
    averageDurationMs,
    egressGbPerMonth,
    ephemeralStorageGbPerExecution,
    loggingGbPerMonth,
    memoryGbPerExecution,
    monthlyBudget,
    monthlyRequests,
    plans,
    selectedPlanId,
    vcpuPerExecution,
    warmHoursPerMonth,
    warmInstances,
    warmMemoryGbPerInstance,
    warmRequestPercent,
    warmVcpuPerInstance,
  ]);

  const selectedPlan =
    plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const selectedResult = result.selected;

  const selectedRows: CostRow[] = [
    {
      label: "Request charges",
      detail: `${formatInteger(
        selectedResult.billableOnDemandRequests,
      )} billable on-demand requests and ${formatInteger(
        selectedResult.warmRequests,
      )} warm-capacity requests`,
      value: selectedResult.requestCost,
      entered:
        selectedPlan.onDemandRequestPricePerMillion.trim() !== "" ||
        selectedPlan.warmRequestPricePerMillion.trim() !== "",
    },
    {
      label: "On-demand memory execution",
      detail: `${formatNumber(
        selectedResult.billableOnDemandGbSeconds,
      )} billable GB-seconds`,
      value: selectedResult.onDemandMemoryCost,
      entered:
        selectedPlan.billingModeId !== "monthly-plan" &&
        selectedPlan.onDemandGbSecondPrice.trim() !== "",
    },
    {
      label: "Warm memory execution",
      detail: `${formatNumber(
        selectedResult.warmGbSeconds,
      )} warm-execution GB-seconds`,
      value: selectedResult.warmMemoryExecutionCost,
      entered:
        selectedResult.warmRequests > 0 &&
        (selectedPlan.warmExecutionGbSecondPrice.trim() !== "" ||
          selectedPlan.onDemandGbSecondPrice.trim() !== ""),
    },
    {
      label: "On-demand CPU execution",
      detail: `${formatNumber(
        selectedResult.billableOnDemandVcpuSeconds,
      )} billable vCPU-seconds`,
      value: selectedResult.onDemandCpuCost,
      entered:
        selectedPlan.billingModeId === "cpu-memory" &&
        selectedPlan.onDemandVcpuSecondPrice.trim() !== "",
    },
    {
      label: "Warm CPU execution",
      detail: `${formatNumber(
        selectedResult.warmVcpuSeconds,
      )} warm-execution vCPU-seconds`,
      value: selectedResult.warmCpuExecutionCost,
      entered:
        selectedPlan.billingModeId === "cpu-memory" &&
        selectedResult.warmRequests > 0 &&
        (selectedPlan.warmExecutionVcpuSecondPrice.trim() !== "" ||
          selectedPlan.onDemandVcpuSecondPrice.trim() !== ""),
    },
    {
      label: "Complete monthly compute plan",
      detail: "One complete monthly function-compute amount",
      value: selectedResult.completeMonthlyComputeCost,
      entered:
        selectedPlan.billingModeId === "monthly-plan" &&
        selectedPlan.completeMonthlyComputePrice.trim() !== "",
    },
    {
      label: "Warm baseline memory",
      detail: `${formatNumber(
        selectedResult.warmBaselineGbSeconds,
      )} configured warm GB-seconds`,
      value: selectedResult.warmBaselineMemoryCost,
      entered:
        result.warmInstanceCount > 0 &&
        selectedPlan.warmBaselineGbSecondPrice.trim() !== "",
    },
    {
      label: "Warm baseline CPU",
      detail: `${formatNumber(
        selectedResult.warmBaselineVcpuSeconds,
      )} configured warm vCPU-seconds`,
      value: selectedResult.warmBaselineCpuCost,
      entered:
        result.warmInstanceCount > 0 &&
        selectedPlan.warmBaselineVcpuSecondPrice.trim() !== "",
    },
    {
      label: "Temporary storage",
      detail: `${formatNumber(
        selectedResult.ephemeralStorageGbSeconds,
      )} billable GB-seconds above the entered included amount`,
      value: selectedResult.ephemeralStorageCost,
      entered:
        selectedPlan.ephemeralStoragePricePerGbSecond.trim() !== "",
    },
    {
      label: "Compute discount",
      detail: "Applied to execution, warm baseline, or complete monthly compute charges",
      value: selectedResult.computeDiscountAmount,
      entered:
        selectedPlan.computeDiscountPercent.trim() !== "" &&
        selectedResult.computeBeforeDiscount > 0,
      negative: true,
    },
    {
      label: "Outbound data transfer",
      detail: `${formatNumber(result.egressGb)} GB`,
      value: selectedResult.egressCost,
      entered: selectedPlan.egressPricePerGb.trim() !== "",
    },
    {
      label: "Logging ingestion",
      detail: `${formatNumber(result.loggingGb)} GB`,
      value: selectedResult.loggingCost,
      entered: selectedPlan.loggingPricePerGb.trim() !== "",
    },
    {
      label: "Other fixed monthly services",
      detail: "Gateway, trigger delivery, storage, build, registry, support, or another entered monthly charge",
      value: selectedResult.fixedMonthlyCost,
      entered: selectedPlan.fixedMonthlyCost.trim() !== "",
    },
    {
      label: "Amortized migration cost",
      detail: `${formatVisibleMoney(
        selectedResult.oneTimeMigrationCost,
      )} spread across ${formatInteger(
        Math.max(
          1,
          toNumber(selectedPlan.migrationAmortizationMonths),
        ),
      )} months`,
      value: selectedResult.amortizedMigrationCost,
      entered: selectedPlan.oneTimeMigrationCost.trim() !== "",
    },
  ];

  const planOptions = plans.map((plan, index) => ({
    value: plan.id,
    label: `Plan ${index + 1}: ${getDisplayName(plan)}`,
  }));

  const activePlan =
    plans.find((plan) => plan.id === activeEditorPlanId) ?? plans[0];
  const activePlanNumber =
    plans.findIndex((plan) => plan.id === activePlan.id) + 1;

  const openPlanEditor = (planId: string) => {
    setActiveEditorPlanId(planId);
    setSelectedPlanId(planId);
  };

  const reset = () => {
    setMonthlyRequests("1000000");
    setAverageDurationMs("250");
    setMemoryGbPerExecution("0.5");
    setVcpuPerExecution("0.25");
    setEphemeralStorageGbPerExecution("0.5");
    setWarmRequestPercent("0");
    setWarmInstances("0");
    setWarmHoursPerMonth("730");
    setWarmMemoryGbPerInstance("0.5");
    setWarmVcpuPerInstance("0.25");
    setEgressGbPerMonth("0");
    setLoggingGbPerMonth("10");
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
            Enter the Shared Serverless Function Workload
          </h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            Use the same requests, duration, memory, CPU, warm capacity,
            transfer, and logging workload for every provider plan.
          </p>
        </div>

        <FieldSection title="Requests and Execution Resources">
          <BeeijaNumberField
            label="Function requests per month"
            value={monthlyRequests}
            onChange={setMonthlyRequests}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Average execution duration"
            value={averageDurationMs}
            onChange={setAverageDurationMs}
            min="0"
            step="1"
            suffix="ms"
          />
          <BeeijaNumberField
            label="Allocated memory per execution"
            value={memoryGbPerExecution}
            onChange={setMemoryGbPerExecution}
            min="0"
            step="0.001"
            suffix="GB"
          />
          <BeeijaNumberField
            label="Allocated vCPU per execution"
            value={vcpuPerExecution}
            onChange={setVcpuPerExecution}
            min="0"
            step="0.001"
            suffix="vCPU"
          />
          <BeeijaNumberField
            label="Temporary storage per execution"
            value={ephemeralStorageGbPerExecution}
            onChange={setEphemeralStorageGbPerExecution}
            min="0"
            step="0.001"
            suffix="GB"
          />
        </FieldSection>

        <FieldSection title="Warm Capacity">
          <BeeijaNumberField
            label="Requests handled by warm capacity"
            value={warmRequestPercent}
            onChange={setWarmRequestPercent}
            min="0"
            max="100"
            step="0.1"
            suffix="%"
          />
          <BeeijaNumberField
            label="Provisioned or always-ready instances"
            value={warmInstances}
            onChange={setWarmInstances}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Warm capacity enabled per month"
            value={warmHoursPerMonth}
            onChange={setWarmHoursPerMonth}
            min="0"
            max="744"
            step="1"
            suffix="hours"
          />
          <BeeijaNumberField
            label="Memory per warm instance"
            value={warmMemoryGbPerInstance}
            onChange={setWarmMemoryGbPerInstance}
            min="0"
            step="0.001"
            suffix="GB"
          />
          <BeeijaNumberField
            label="vCPU per warm instance"
            value={warmVcpuPerInstance}
            onChange={setWarmVcpuPerInstance}
            min="0"
            step="0.001"
            suffix="vCPU"
          />
        </FieldSection>

        <FieldSection title="Transfer, Logging, and Budget">
          <BeeijaNumberField
            label="Outbound data transfer per month"
            value={egressGbPerMonth}
            onChange={setEgressGbPerMonth}
            min="0"
            step="0.1"
            suffix="GB"
          />
          <BeeijaNumberField
            label="Logging ingestion per month"
            value={loggingGbPerMonth}
            onChange={setLoggingGbPerMonth}
            min="0"
            step="0.1"
            suffix="GB"
          />
          <BeeijaNumberField
            label="Target monthly serverless budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Shared workload summary
          </p>
          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>Requests: {formatInteger(result.requests)} per month</p>
            <p>Duration: {formatNumber(result.durationSeconds)} seconds</p>
            <p>Memory: {formatNumber(result.memoryGb)} GB</p>
            <p>vCPU: {formatNumber(result.vcpu)}</p>
            <p>
              Warm requests: {formatInteger(result.warmRequests)} (
              {formatNumber(result.warmPercent * 100)}%)
            </p>
            <p>
              On-demand requests:{" "}
              {formatInteger(result.onDemandRequests)}
            </p>
            <p>
              Estimated average requests per second:{" "}
              {formatNumber(result.averageRequestsPerSecond)}
            </p>
            <p>
              Estimated average concurrency:{" "}
              {formatNumber(result.estimatedAverageConcurrency)}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-950">
            Select Function Plans and Enter Prices
          </h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            Choose the provider, region, service plan, architecture, and
            billing model. Prices remain blank so you can enter the exact
            effective rates for each selected plan.
          </p>
        </div>

        <div className="mt-6">
          <div
            className="grid gap-2 sm:grid-cols-3"
            role="tablist"
            aria-label="Serverless function comparison plans"
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
            aria-label={`Comparison plan ${activePlanNumber}`}
          >
            <PlanEditor
              key={activePlan.id}
              planNumber={activePlanNumber}
              plan={activePlan}
              onChange={(field, value) =>
                updatePlan(activePlan.id, field, value)
              }
              onProviderChange={(providerId) =>
                changeProvider(activePlan.id, providerId)
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
          title="Serverless Functions Cost Comparison"
          description="Select a plan for a detailed breakdown. Configured plans are ranked by monthly planning cost."
          primaryLabel="Selected monthly planning cost"
          primaryValue={
            selectedResult.configured
              ? formatVisibleMoney(selectedResult.monthlyPlanningCost)
              : "Enter provider prices"
          }
          stats={
            <div className="grid min-w-0 gap-4 sm:grid-cols-3">
              <ResultStat
                label="Cost per million requests"
                value={
                  selectedResult.configured
                    ? formatVisibleMoney(
                        selectedResult.costPerMillionRequests,
                      )
                    : "—"
                }
              />
              <ResultStat
                label="Cost per execution"
                value={
                  selectedResult.configured
                    ? formatVisibleMoney(selectedResult.costPerExecution)
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
            <div className="min-w-0 space-y-6">
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
                  {selectedResult.planLabel} ·{" "}
                  {selectedResult.architectureLabel}
                </p>
                <p className="mt-1">
                  {selectedResult.billingModeLabel}
                </p>
                <p className="mt-1">
                  {selectedResult.configurationLabel}
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
                    negative={row.negative}
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
                  {selectedResult.planLabel} ·{" "}
                  {selectedResult.architectureLabel} ·{" "}
                  {selectedResult.billingModeLabel}
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
                Possible monthly saving:{" "}
                <span className="font-semibold text-[var(--green)]">
                  {selectedResult.configured && result.cheapest
                    ? formatVisibleMoney(result.monthlySaving)
                    : "—"}
                </span>
              </p>
              <p className="mt-2">
                Possible first-year saving:{" "}
                <span className="font-semibold text-[var(--green)]">
                  {selectedResult.configured && result.cheapest
                    ? formatVisibleMoney(result.firstYearSaving)
                    : "—"}
                </span>
              </p>
              <p className="mt-2">
                Selected plan price inputs entered:{" "}
                <span className="font-medium text-gray-900">
                  {selectedResult.enteredPriceCount} of 14
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
          provider="AWS Lambda, Azure Functions, Google Cloud Run functions, and custom serverless function plans"
          excludedCosts="taxes, premium cloud support, API gateways, Eventarc, Event Grid, queues, storage accounts, Cloud Build, Artifact Registry, private networking, public IPv4 addresses, databases, migration labour, negotiated credits, and services not entered"
          noticeText="Provider, region, service-plan, architecture, free-grant, and billing selections identify the configuration only; they do not load or imply a current price. Enter current effective rates for the exact selected setup. Pricing structures and official billing guidance were checked on June 25, 2026. Blank optional price fields are treated as zero."
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
  const billingMode = getBillingMode(provider, plan.billingModeId);

  const providerOptions = providers.map((item) => ({
    value: item.id,
    label: item.serviceName,
  }));

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
          label="Serverless function provider"
          value={plan.providerId}
          onChange={(event) => onProviderChange(event.target.value)}
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
          label="Function service or hosting plan"
          value={plan.planId}
          onChange={(event) =>
            onChange("planId", event.target.value)
          }
          options={provider.plans}
        />
        <BeeijaSelect
          label="Runtime or processor architecture"
          value={plan.architectureId}
          onChange={(event) =>
            onChange("architectureId", event.target.value)
          }
          options={provider.architectures}
        />
        <BeeijaSelect
          label="Execution billing model"
          value={plan.billingModeId}
          onChange={(event) =>
            onChange(
              "billingModeId",
              event.target.value as BillingModeId,
            )
          }
          options={provider.billingModes}
        />
        <BeeijaSelect
          label="Free-grant scope"
          value={plan.freeGrantScope}
          onChange={(event) =>
            onChange(
              "freeGrantScope",
              event.target.value as FreeGrantScope,
            )
          }
          options={freeGrantScopeOptions}
        />
        <TextField
          label="Function, memory tier, or configuration name"
          value={plan.configurationLabel}
          onChange={(value) =>
            onChange("configurationLabel", value)
          }
        />
      </FieldSection>

      <div className="mt-5 rounded-xl border-l-4 border-[#F2C94C] bg-[#FFF8E8] px-5 py-4">
        <p className="text-sm leading-6 text-gray-700">
          {billingMode.description} Enter the current rates and free
          grants for the selected provider, region, architecture, and
          hosting plan.
        </p>
      </div>

      <FieldSection title="Request Prices and Free Requests">
        <BeeijaNumberField
          label="On-demand request price per million"
          value={plan.onDemandRequestPricePerMillion}
          onChange={(value) =>
            onChange("onDemandRequestPricePerMillion", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Warm-capacity request price per million"
          value={plan.warmRequestPricePerMillion}
          onChange={(value) =>
            onChange("warmRequestPricePerMillion", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Free requests per month"
          value={plan.freeRequestsPerMonth}
          onChange={(value) =>
            onChange("freeRequestsPerMonth", value)
          }
          min="0"
          step="1"
        />
      </FieldSection>

      <FieldSection title="On-Demand and Warm Execution Prices">
        {plan.billingModeId !== "monthly-plan" ? (
          <>
            <BeeijaNumberField
              label="On-demand memory price per GB-second"
              value={plan.onDemandGbSecondPrice}
              onChange={(value) =>
                onChange("onDemandGbSecondPrice", value)
              }
              min="0"
              step="0.000000001"
              prefix="$"
            />
            <BeeijaNumberField
              label="Warm execution memory price per GB-second"
              value={plan.warmExecutionGbSecondPrice}
              onChange={(value) =>
                onChange("warmExecutionGbSecondPrice", value)
              }
              min="0"
              step="0.000000001"
              prefix="$"
            />
            <BeeijaNumberField
              label="Free memory GB-seconds per month"
              value={plan.freeGbSecondsPerMonth}
              onChange={(value) =>
                onChange("freeGbSecondsPerMonth", value)
              }
              min="0"
              step="1"
            />
          </>
        ) : null}

        {plan.billingModeId === "cpu-memory" ? (
          <>
            <BeeijaNumberField
              label="On-demand CPU price per vCPU-second"
              value={plan.onDemandVcpuSecondPrice}
              onChange={(value) =>
                onChange("onDemandVcpuSecondPrice", value)
              }
              min="0"
              step="0.000000001"
              prefix="$"
            />
            <BeeijaNumberField
              label="Warm execution CPU price per vCPU-second"
              value={plan.warmExecutionVcpuSecondPrice}
              onChange={(value) =>
                onChange("warmExecutionVcpuSecondPrice", value)
              }
              min="0"
              step="0.000000001"
              prefix="$"
            />
            <BeeijaNumberField
              label="Free vCPU-seconds per month"
              value={plan.freeVcpuSecondsPerMonth}
              onChange={(value) =>
                onChange("freeVcpuSecondsPerMonth", value)
              }
              min="0"
              step="1"
            />
          </>
        ) : null}

        {plan.billingModeId === "monthly-plan" ? (
          <BeeijaNumberField
            label="Complete monthly function compute price"
            value={plan.completeMonthlyComputePrice}
            onChange={(value) =>
              onChange("completeMonthlyComputePrice", value)
            }
            min="0"
            step="0.01"
            prefix="$"
          />
        ) : null}
      </FieldSection>

      <FieldSection title="Warm Baseline and Temporary Storage Prices">
        <BeeijaNumberField
          label="Warm baseline memory price per GB-second"
          value={plan.warmBaselineGbSecondPrice}
          onChange={(value) =>
            onChange("warmBaselineGbSecondPrice", value)
          }
          min="0"
          step="0.000000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Warm baseline CPU price per vCPU-second"
          value={plan.warmBaselineVcpuSecondPrice}
          onChange={(value) =>
            onChange("warmBaselineVcpuSecondPrice", value)
          }
          min="0"
          step="0.000000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Included temporary storage per execution"
          value={plan.includedEphemeralStorageGb}
          onChange={(value) =>
            onChange("includedEphemeralStorageGb", value)
          }
          min="0"
          step="0.001"
          suffix="GB"
        />
        <BeeijaNumberField
          label="Temporary storage price per GB-second"
          value={plan.ephemeralStoragePricePerGbSecond}
          onChange={(value) =>
            onChange("ephemeralStoragePricePerGbSecond", value)
          }
          min="0"
          step="0.000000001"
          prefix="$"
        />
      </FieldSection>

      <FieldSection title="Transfer, Logging, Discounts, and Migration">
        <BeeijaNumberField
          label="Outbound transfer price per GB"
          value={plan.egressPricePerGb}
          onChange={(value) =>
            onChange("egressPricePerGb", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Logging ingestion price per GB"
          value={plan.loggingPricePerGb}
          onChange={(value) =>
            onChange("loggingPricePerGb", value)
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
          label="Other fixed monthly serverless services"
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
  negative = false,
}: {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
  negative?: boolean;
}) {
  const visibleValue = negative
    ? `-${formatVisibleMoney(value)}`
    : formatVisibleMoney(value);

  return (
    <div className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 text-sm text-gray-500">{detail}</p>
      </div>
      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {entered ? visibleValue : "—"}
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
                  <td className="min-w-72 px-4 py-4 align-top">
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
                      {row.planLabel}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {row.architectureLabel}
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

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

type BillingModeId =
  | "all-in-hourly"
  | "split-hourly"
  | "monthly-deployment";

type BillingModeOption = Option & {
  description: string;
};

type BackupAllowanceMode = "none" | "primary" | "custom";

type AvailabilityOption = Option & {
  description: string;
};

type ProviderDefinition = {
  id: string;
  providerName: string;
  serviceName: string;
  regions: Option[];
  products: Option[];
  licenseOptions: Option[];
  availabilityOptions: AvailabilityOption[];
  billingModes: BillingModeOption[];
  defaults: {
    regionId: string;
    productId: string;
    licenseOptionId: string;
    availabilityId: string;
    billingModeId: BillingModeId;
    backupAllowanceMode: BackupAllowanceMode;
  };
};

type PlanInput = {
  id: string;
  providerId: string;
  regionId: string;
  customRegion: string;
  productId: string;
  licenseOptionId: string;
  availabilityId: string;
  billingModeId: BillingModeId;
  configurationLabel: string;
  allInDeploymentHourlyPrice: string;
  infrastructureHourlyPrice: string;
  sqlLicenseHourlyPrice: string;
  monthlyDeploymentPrice: string;
  additionalInstanceHourlyPrice: string;
  deploymentStoragePricePerGbMonth: string;
  additionalInstanceStoragePricePerGbMonth: string;
  backupAllowanceMode: BackupAllowanceMode;
  customIncludedBackupGb: string;
  backupPricePerGbMonth: string;
  deploymentIopsPricePerIopsMonth: string;
  additionalInstanceIopsPricePerIopsMonth: string;
  paidIoPricePerMillion: string;
  egressPricePerGb: string;
  eligibleHourlyDiscountPercent: string;
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
  licenseOptionLabel: string;
  availabilityLabel: string;
  billingModeLabel: string;
  configurationLabel: string;
  configured: boolean;
  primaryInfrastructureCost: number;
  primaryLicenseCost: number;
  primaryAllInCost: number;
  primaryMonthlyPriceCost: number;
  additionalInstanceCost: number;
  eligibleHourlyBeforeDiscount: number;
  eligibleHourlyDiscountAmount: number;
  eligibleHourlyAfterDiscount: number;
  deploymentStorageCost: number;
  additionalInstanceStorageCost: number;
  deploymentIopsCost: number;
  additionalInstanceIopsCost: number;
  paidIoCost: number;
  includedBackupGb: number;
  chargeableBackupGb: number;
  backupCost: number;
  egressCost: number;
  fixedMonthlyCost: number;
  monthlyOperatingCost: number;
  amortizedMigrationCost: number;
  monthlyPlanningCost: number;
  oneTimeMigrationCost: number;
  firstYearCost: number;
  costPerPrimaryVcpu: number;
  costPerPrimaryStorageGb: number;
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
    value: "all-in-hourly",
    label: "All-in deployment hourly price",
    description:
      "Use one hourly price that already includes the selected deployment infrastructure, Windows, and SQL Server licensing.",
  },
  {
    value: "split-hourly",
    label: "Separate infrastructure and SQL licence prices",
    description:
      "Enter infrastructure and SQL Server licence prices separately when the provider quote shows both components.",
  },
  {
    value: "monthly-deployment",
    label: "Complete monthly deployment price",
    description:
      "Use one monthly amount when the selected managed SQL Server plan is quoted as a complete monthly deployment.",
  },
];

const backupAllowanceOptions: Option[] = [
  { value: "none", label: "No included backup allowance" },
  {
    value: "primary",
    label: "Allowance equals primary provisioned storage",
  },
  { value: "custom", label: "Custom included backup amount" },
];

const providers: ProviderDefinition[] = [
  {
    id: "aws",
    providerName: "Amazon Web Services",
    serviceName: "Amazon RDS for SQL Server",
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
      { value: "rds", label: "Amazon RDS for SQL Server" },
      { value: "rds-custom", label: "Amazon RDS Custom for SQL Server" },
    ],
    licenseOptions: [
      { value: "express-li", label: "Express Edition — licence included" },
      { value: "web-li", label: "Web Edition — licence included" },
      { value: "standard-li", label: "Standard Edition — licence included" },
      { value: "enterprise-li", label: "Enterprise Edition — licence included" },
      { value: "developer-byom", label: "Developer Edition — BYOM, non-production" },
      { value: "standard-byom", label: "Standard Edition — BYOM" },
      { value: "enterprise-byom", label: "Enterprise Edition — BYOM" },
      { value: "custom", label: "Other AWS licensing option" },
    ],
    availabilityOptions: [
      {
        value: "single-az",
        label: "Single-AZ deployment",
        description:
          "Enter the complete Single-AZ database deployment price shown for the selected instance and SQL Server edition.",
      },
      {
        value: "multi-az",
        label: "Multi-AZ deployment",
        description:
          "Enter the complete Multi-AZ price shown by AWS. Do not multiply a bundled Multi-AZ hourly or storage rate again.",
      },
      {
        value: "custom",
        label: "Other AWS availability setup",
        description:
          "Enter the complete effective price for the exact AWS availability and recovery configuration.",
      },
    ],
    billingModes,
    defaults: {
      regionId: "ap-south-1",
      productId: "rds",
      licenseOptionId: "standard-li",
      availabilityId: "single-az",
      billingModeId: "all-in-hourly",
      backupAllowanceMode: "primary",
    },
  },
  {
    id: "azure",
    providerName: "Microsoft Azure",
    serviceName: "Azure SQL Managed Instance",
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
      { value: "general-purpose", label: "General Purpose" },
      { value: "next-gen-gp", label: "Next-gen General Purpose" },
      { value: "business-critical", label: "Business Critical" },
      { value: "instance-pool", label: "SQL Managed Instance pool" },
    ],
    licenseOptions: [
      { value: "license-included", label: "SQL Server licence included" },
      { value: "azure-hybrid-benefit", label: "Azure Hybrid Benefit" },
      { value: "dev-test", label: "Azure Dev/Test pricing" },
      { value: "custom", label: "Other Azure licensing option" },
    ],
    availabilityOptions: [
      {
        value: "managed-instance",
        label: "Single managed instance",
        description:
          "Enter the complete price for the selected SQL Managed Instance service tier and hardware configuration.",
      },
      {
        value: "zone-redundant",
        label: "Zone-redundant configuration",
        description:
          "Enter the full zone-redundant price shown for the selected Azure SQL Managed Instance configuration.",
      },
      {
        value: "failover-group",
        label: "Failover group or geo-secondary plan",
        description:
          "Enter the primary managed-instance price here and add separately billed secondary managed instances under additional instances.",
      },
    ],
    billingModes,
    defaults: {
      regionId: "central-india",
      productId: "general-purpose",
      licenseOptionId: "license-included",
      availabilityId: "managed-instance",
      billingModeId: "split-hourly",
      backupAllowanceMode: "primary",
    },
  },
  {
    id: "gcp",
    providerName: "Google Cloud",
    serviceName: "Cloud SQL for SQL Server",
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
      { value: "enterprise", label: "Cloud SQL Enterprise" },
      { value: "enterprise-plus", label: "Cloud SQL Enterprise Plus" },
    ],
    licenseOptions: [
      { value: "express", label: "SQL Server Express" },
      { value: "web", label: "SQL Server Web" },
      { value: "standard", label: "SQL Server Standard" },
      { value: "enterprise", label: "SQL Server Enterprise" },
      { value: "custom", label: "Other SQL Server licensing option" },
    ],
    availabilityOptions: [
      {
        value: "zonal",
        label: "Zonal instance",
        description:
          "Enter the complete zonal infrastructure, licence, and storage prices for the selected Cloud SQL configuration.",
      },
      {
        value: "regional-ha",
        label: "Regional high availability",
        description:
          "Enter the current HA infrastructure, licence, and storage rates. Google Cloud states that an HA configuration costs twice a standalone instance, including CPU, RAM, and storage.",
      },
    ],
    billingModes,
    defaults: {
      regionId: "asia-south1",
      productId: "enterprise",
      licenseOptionId: "standard",
      availabilityId: "zonal",
      billingModeId: "split-hourly",
      backupAllowanceMode: "none",
    },
  },
  {
    id: "custom",
    providerName: "Custom Provider",
    serviceName: "Custom Managed SQL Server Plan",
    regions: [{ value: "other", label: "Custom region" }],
    products: [{ value: "custom", label: "Custom managed SQL Server service" }],
    licenseOptions: [{ value: "custom", label: "Custom licensing option" }],
    availabilityOptions: [
      {
        value: "custom",
        label: "Custom availability setup",
        description:
          "Enter the complete effective price for the selected custom deployment.",
      },
    ],
    billingModes,
    defaults: {
      regionId: "other",
      productId: "custom",
      licenseOptionId: "custom",
      availabilityId: "custom",
      billingModeId: "all-in-hourly",
      backupAllowanceMode: "none",
    },
  },
];

function getProvider(providerId: string) {
  return providers.find((provider) => provider.id === providerId) ?? providers[0];
}

function getOptionLabel(options: Option[], value: string) {
  return options.find((option) => option.value === value)?.label ?? "Not selected";
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
    productId: provider.defaults.productId,
    licenseOptionId: provider.defaults.licenseOptionId,
    availabilityId: provider.defaults.availabilityId,
    billingModeId: provider.defaults.billingModeId,
    configurationLabel: "",
    allInDeploymentHourlyPrice: "",
    infrastructureHourlyPrice: "",
    sqlLicenseHourlyPrice: "",
    monthlyDeploymentPrice: "",
    additionalInstanceHourlyPrice: "",
    deploymentStoragePricePerGbMonth: "",
    additionalInstanceStoragePricePerGbMonth: "",
    backupAllowanceMode: provider.defaults.backupAllowanceMode,
    customIncludedBackupGb: "",
    backupPricePerGbMonth: "",
    deploymentIopsPricePerIopsMonth: "",
    additionalInstanceIopsPricePerIopsMonth: "",
    paidIoPricePerMillion: "",
    egressPricePerGb: "",
    eligibleHourlyDiscountPercent: "",
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

// Always show every digit. Zero-width break points after commas let large
// amounts wrap without abbreviating them as K, M, B, or T.
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
  const [vcpusPerDatabase, setVcpusPerDatabase] = useState("4");
  const [memoryGbPerDatabase, setMemoryGbPerDatabase] = useState("16");
  const [primaryStorageGb, setPrimaryStorageGb] = useState("500");
  const [backupStorageGb, setBackupStorageGb] = useState("500");
  const [provisionedIops, setProvisionedIops] = useState("0");
  const [billableIoMillions, setBillableIoMillions] = useState("0");
  const [internetEgressGb, setInternetEgressGb] = useState("0");
  const [additionalInstanceCount, setAdditionalInstanceCount] = useState("0");
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
              productId: provider.defaults.productId,
              licenseOptionId: provider.defaults.licenseOptionId,
              availabilityId: provider.defaults.availabilityId,
              billingModeId: provider.defaults.billingModeId,
              backupAllowanceMode: provider.defaults.backupAllowanceMode,
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
    const iops = toNumber(provisionedIops);
    const ioMillions = toNumber(billableIoMillions);
    const egressGb = toNumber(internetEgressGb);
    const additionalInstances = Math.floor(toNumber(additionalInstanceCount));
    const budget = toNumber(monthlyBudget);

    const rows: PlanResult[] = plans.map((plan) => {
      const provider = getProvider(plan.providerId);
      const availability = getAvailability(provider, plan.availabilityId);
      const billingMode = getBillingMode(provider, plan.billingModeId);

      const allInHourly = toNumber(plan.allInDeploymentHourlyPrice);
      const infrastructureHourly = toNumber(plan.infrastructureHourlyPrice);
      const licenseHourly = toNumber(plan.sqlLicenseHourlyPrice);
      const monthlyDeploymentPrice = toNumber(plan.monthlyDeploymentPrice);
      const additionalHourly = toNumber(plan.additionalInstanceHourlyPrice);

      const primaryInfrastructureCost =
        plan.billingModeId === "split-hourly"
          ? infrastructureHourly * hours
          : 0;
      const primaryLicenseCost =
        plan.billingModeId === "split-hourly" ? licenseHourly * hours : 0;
      const primaryAllInCost =
        plan.billingModeId === "all-in-hourly" ? allInHourly * hours : 0;
      const primaryMonthlyPriceCost =
        plan.billingModeId === "monthly-deployment"
          ? monthlyDeploymentPrice
          : 0;

      const additionalInstanceCost =
        additionalHourly * hours * additionalInstances;

      const eligibleHourlyBeforeDiscount =
        primaryInfrastructureCost +
        primaryLicenseCost +
        primaryAllInCost +
        additionalInstanceCost;

      const discountPercent = clampPercent(
        plan.eligibleHourlyDiscountPercent,
      );
      const eligibleHourlyDiscountAmount =
        eligibleHourlyBeforeDiscount * (discountPercent / 100);
      const eligibleHourlyAfterDiscount =
        eligibleHourlyBeforeDiscount - eligibleHourlyDiscountAmount;

      const deploymentStorageCost =
        toNumber(plan.deploymentStoragePricePerGbMonth) * primaryGb;
      const additionalInstanceStorageCost =
        toNumber(plan.additionalInstanceStoragePricePerGbMonth) *
        primaryGb *
        additionalInstances;

      const deploymentIopsCost =
        toNumber(plan.deploymentIopsPricePerIopsMonth) * iops;
      const additionalInstanceIopsCost =
        toNumber(plan.additionalInstanceIopsPricePerIopsMonth) *
        iops *
        additionalInstances;

      const paidIoCost =
        toNumber(plan.paidIoPricePerMillion) * ioMillions;

      const includedBackupGb =
        plan.backupAllowanceMode === "primary"
          ? primaryGb
          : plan.backupAllowanceMode === "custom"
            ? toNumber(plan.customIncludedBackupGb)
            : 0;

      const chargeableBackupGb = Math.max(0, backupGb - includedBackupGb);
      const backupCost =
        toNumber(plan.backupPricePerGbMonth) * chargeableBackupGb;
      const egressCost = toNumber(plan.egressPricePerGb) * egressGb;
      const fixedMonthlyCost = toNumber(plan.fixedMonthlyCost);
      const oneTimeMigrationCost = toNumber(plan.oneTimeMigrationCost);
      const migrationMonths = Math.max(
        1,
        toNumber(plan.migrationAmortizationMonths),
      );
      const amortizedMigrationCost =
        oneTimeMigrationCost / migrationMonths;

      const monthlyOperatingCost =
        eligibleHourlyAfterDiscount +
        primaryMonthlyPriceCost +
        deploymentStorageCost +
        additionalInstanceStorageCost +
        deploymentIopsCost +
        additionalInstanceIopsCost +
        paidIoCost +
        backupCost +
        egressCost +
        fixedMonthlyCost;

      const monthlyPlanningCost =
        monthlyOperatingCost + amortizedMigrationCost;
      const firstYearCost =
        monthlyOperatingCost * 12 + oneTimeMigrationCost;

      const priceFields = [
        plan.allInDeploymentHourlyPrice,
        plan.infrastructureHourlyPrice,
        plan.sqlLicenseHourlyPrice,
        plan.monthlyDeploymentPrice,
        plan.additionalInstanceHourlyPrice,
        plan.deploymentStoragePricePerGbMonth,
        plan.additionalInstanceStoragePricePerGbMonth,
        plan.backupPricePerGbMonth,
        plan.deploymentIopsPricePerIopsMonth,
        plan.additionalInstanceIopsPricePerIopsMonth,
        plan.paidIoPricePerMillion,
        plan.egressPricePerGb,
        plan.fixedMonthlyCost,
        plan.oneTimeMigrationCost,
      ];

      const enteredPriceCount = priceFields.filter(
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
        productLabel: getOptionLabel(provider.products, plan.productId),
        licenseOptionLabel: getOptionLabel(
          provider.licenseOptions,
          plan.licenseOptionId,
        ),
        availabilityLabel: availability.label,
        billingModeLabel: billingMode.label,
        configurationLabel:
          plan.configurationLabel.trim() || "Configuration name not entered",
        configured,
        primaryInfrastructureCost,
        primaryLicenseCost,
        primaryAllInCost,
        primaryMonthlyPriceCost,
        additionalInstanceCost,
        eligibleHourlyBeforeDiscount,
        eligibleHourlyDiscountAmount,
        eligibleHourlyAfterDiscount,
        deploymentStorageCost,
        additionalInstanceStorageCost,
        deploymentIopsCost,
        additionalInstanceIopsCost,
        paidIoCost,
        includedBackupGb,
        chargeableBackupGb,
        backupCost,
        egressCost,
        fixedMonthlyCost,
        monthlyOperatingCost,
        amortizedMigrationCost,
        monthlyPlanningCost,
        oneTimeMigrationCost,
        firstYearCost,
        costPerPrimaryVcpu:
          vcpus > 0 ? monthlyPlanningCost / vcpus : 0,
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

    return {
      hours,
      vcpus,
      memoryGb,
      primaryGb,
      backupGb,
      iops,
      ioMillions,
      egressGb,
      additionalInstances,
      budget,
      hasBudget: monthlyBudget.trim() !== "",
      rows,
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
          ? Math.max(0, selected.firstYearCost - cheapest.firstYearCost)
          : 0,
    };
  }, [
    additionalInstanceCount,
    backupStorageGb,
    billableIoMillions,
    internetEgressGb,
    memoryGbPerDatabase,
    monthlyBudget,
    plans,
    primaryStorageGb,
    provisionedIops,
    runningHours,
    selectedPlanId,
    vcpusPerDatabase,
  ]);

  const selectedPlan =
    plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const selectedResult = result.selected;

  const selectedRows: CostRow[] = [
    {
      label: "Primary deployment all-in hourly cost",
      detail: `${formatNumber(result.hours)} hours`,
      value: selectedResult.primaryAllInCost,
      entered:
        selectedPlan.billingModeId === "all-in-hourly" &&
        selectedPlan.allInDeploymentHourlyPrice.trim() !== "",
    },
    {
      label: "Primary infrastructure",
      detail: `${formatNumber(result.hours)} hours`,
      value: selectedResult.primaryInfrastructureCost,
      entered:
        selectedPlan.billingModeId === "split-hourly" &&
        selectedPlan.infrastructureHourlyPrice.trim() !== "",
    },
    {
      label: "SQL Server licence",
      detail: `${formatNumber(result.hours)} hours`,
      value: selectedResult.primaryLicenseCost,
      entered:
        selectedPlan.billingModeId === "split-hourly" &&
        selectedPlan.sqlLicenseHourlyPrice.trim() !== "",
    },
    {
      label: "Complete monthly deployment price",
      detail: "One monthly amount for the selected primary or HA deployment",
      value: selectedResult.primaryMonthlyPriceCost,
      entered:
        selectedPlan.billingModeId === "monthly-deployment" &&
        selectedPlan.monthlyDeploymentPrice.trim() !== "",
    },
    {
      label: "Additional SQL Server instances",
      detail: `${formatInteger(
        result.additionalInstances,
      )} separately billed instances × ${formatNumber(result.hours)} hours`,
      value: selectedResult.additionalInstanceCost,
      entered:
        result.additionalInstances > 0 &&
        selectedPlan.additionalInstanceHourlyPrice.trim() !== "",
    },
    {
      label: "Eligible hourly discount",
      detail: "Applied to entered hourly deployment and additional-instance charges",
      value: selectedResult.eligibleHourlyDiscountAmount,
      entered:
        selectedPlan.eligibleHourlyDiscountPercent.trim() !== "" &&
        selectedResult.eligibleHourlyBeforeDiscount > 0,
      negative: true,
    },
    {
      label: "Primary or HA deployment storage",
      detail: `${formatNumber(result.primaryGb)} GB`,
      value: selectedResult.deploymentStorageCost,
      entered:
        selectedPlan.deploymentStoragePricePerGbMonth.trim() !== "",
    },
    {
      label: "Additional-instance storage",
      detail: `${formatNumber(result.primaryGb)} GB × ${formatInteger(
        result.additionalInstances,
      )} instances`,
      value: selectedResult.additionalInstanceStorageCost,
      entered:
        result.additionalInstances > 0 &&
        selectedPlan.additionalInstanceStoragePricePerGbMonth.trim() !== "",
    },
    {
      label: "Primary or HA deployment IOPS",
      detail: `${formatInteger(result.iops)} provisioned IOPS`,
      value: selectedResult.deploymentIopsCost,
      entered:
        selectedPlan.deploymentIopsPricePerIopsMonth.trim() !== "",
    },
    {
      label: "Additional-instance IOPS",
      detail: `${formatInteger(result.iops)} IOPS × ${formatInteger(
        result.additionalInstances,
      )} instances`,
      value: selectedResult.additionalInstanceIopsCost,
      entered:
        result.additionalInstances > 0 &&
        selectedPlan.additionalInstanceIopsPricePerIopsMonth.trim() !== "",
    },
    {
      label: "Paid or request-based I/O",
      detail: `${formatNumber(result.ioMillions)} million billable I/O requests`,
      value: selectedResult.paidIoCost,
      entered: selectedPlan.paidIoPricePerMillion.trim() !== "",
    },
    {
      label: "Backup storage",
      detail: `${formatNumber(
        selectedResult.chargeableBackupGb,
      )} GB charged after ${formatNumber(
        selectedResult.includedBackupGb,
      )} GB included`,
      value: selectedResult.backupCost,
      entered: selectedPlan.backupPricePerGbMonth.trim() !== "",
    },
    {
      label: "Data transfer out",
      detail: `${formatNumber(result.egressGb)} GB`,
      value: selectedResult.egressCost,
      entered: selectedPlan.egressPricePerGb.trim() !== "",
    },
    {
      label: "Other fixed monthly services",
      detail: "Monitoring, proxy, private endpoint, logs, or another fixed charge",
      value: selectedResult.fixedMonthlyCost,
      entered: selectedPlan.fixedMonthlyCost.trim() !== "",
    },
    {
      label: "Amortized migration cost",
      detail: `${formatVisibleMoney(
        selectedResult.oneTimeMigrationCost,
      )} spread across ${formatInteger(
        Math.max(1, toNumber(selectedPlan.migrationAmortizationMonths)),
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
    setRunningHours("730");
    setVcpusPerDatabase("4");
    setMemoryGbPerDatabase("16");
    setPrimaryStorageGb("500");
    setBackupStorageGb("500");
    setProvisionedIops("0");
    setBillableIoMillions("0");
    setInternetEgressGb("0");
    setAdditionalInstanceCount("0");
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
                  Enter the Shared SQL Server Workload
                </h2>
                <p className="mt-3 leading-relaxed text-gray-600">
                  Use the same database size, storage, I/O, transfer, and
                  additional-instance workload for every provider plan.
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
                  label="vCPUs in the primary database configuration"
                  value={vcpusPerDatabase}
                  onChange={setVcpusPerDatabase}
                  min="0"
                  step="1"
                  suffix="vCPU"
                />
                <BeeijaNumberField
                  label="Memory in the primary database configuration"
                  value={memoryGbPerDatabase}
                  onChange={setMemoryGbPerDatabase}
                  min="0"
                  step="0.5"
                  suffix="GB"
                />
                <BeeijaNumberField
                  label="Separately billed read, reporting, or DR instances"
                  value={additionalInstanceCount}
                  onChange={setAdditionalInstanceCount}
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
                  label="Provisioned IOPS for each SQL Server instance"
                  value={provisionedIops}
                  onChange={setProvisionedIops}
                  min="0"
                  step="1"
                  suffix="IOPS"
                />
                <BeeijaNumberField
                  label="Total billable I/O across the deployment"
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
                  label="Target monthly managed SQL Server budget"
                  value={monthlyBudget}
                  onChange={setMonthlyBudget}
                  min="0"
                  step="1"
                  prefix="$"
                />
              </FieldSection>

              <BeeijaWorkloadSummary title="Shared workload summary">
        <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
          <p>Running time: {formatNumber(result.hours)} hours</p>
          <p>
            Primary size: {formatNumber(result.vcpus)} vCPU and{" "}
            {formatNumber(result.memoryGb)} GB memory
          </p>
          <p>Primary storage: {formatNumber(result.primaryGb)} GB</p>
          <p>Backup usage: {formatNumber(result.backupGb)} GB</p>
          <p>Provisioned IOPS: {formatInteger(result.iops)}</p>
          <p>Billable I/O: {formatNumber(result.ioMillions)} million</p>
          <p>Data transfer out: {formatNumber(result.egressGb)} GB</p>
          <p>
            Additional instances:{" "}
            {formatInteger(result.additionalInstances)}
          </p>
        </div>
      </BeeijaWorkloadSummary>

              <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-950">
                  Select SQL Server Configurations and Enter Prices
                </h2>
                <p className="mt-3 leading-relaxed text-gray-600">
                  Choose the provider, region, service tier, licensing option,
                  availability setup, and billing model. Prices remain blank so you
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
        ariaLabel="Managed SQL Server comparison plans"
      />

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

              <button type="button" onClick={reset} className="beeija-btn-outline mt-7">
                Reset values
              </button>
            </BeeijaComparisonInputPanel>

      <BeeijaComparisonResultColumn>
        <BeeijaCalculatorResultPanel
                  title="Managed SQL Server Cost Comparison"
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
                        label="Cost per primary vCPU"
                        value={
                          selectedResult.configured
                            ? formatVisibleMoney(selectedResult.costPerPrimaryVcpu)
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
                          {selectedResult.productLabel} ·{" "}
                          {selectedResult.licenseOptionLabel}
                        </p>
                        <p className="mt-1">
                          {selectedResult.availabilityLabel} ·{" "}
                          {selectedResult.billingModeLabel}
                        </p>
                        <p className="mt-1">{selectedResult.configurationLabel}</p>
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
                          {selectedResult.productLabel} ·{" "}
                          {selectedResult.licenseOptionLabel} ·{" "}
                          {selectedResult.availabilityLabel}
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
                  provider="Amazon RDS for SQL Server, Azure SQL Managed Instance, Google Cloud SQL for SQL Server, and custom managed SQL Server plans"
                  excludedCosts="taxes, premium support, private connectivity, monitoring, DNS, public IP addresses, cross-region replication traffic, backup exports, encryption key requests, migration labour, application remediation, negotiated credits, and services not entered"
                  noticeText="Provider, region, service-tier, licensing, availability, and billing selections identify the configuration only; they do not load or imply a current price. Enter current effective rates for the exact selected setup. Pricing structures and official billing guidance were checked on June 25, 2026. Blank optional price fields are treated as zero."
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
  const availability = getAvailability(provider, plan.availabilityId);
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
          label="Managed SQL Server provider"
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
            label="Custom region name"
            value={plan.customRegion}
            onChange={(value) => onChange("customRegion", value)}
          />
        ) : null}
        <BeeijaSelect
          label="Service tier or managed product"
          value={plan.productId}
          onChange={(event) => onChange("productId", event.target.value)}
          options={provider.products}
        />
        <BeeijaSelect
          label="SQL Server licensing option"
          value={plan.licenseOptionId}
          onChange={(event) =>
            onChange("licenseOptionId", event.target.value)
          }
          options={provider.licenseOptions}
        />
        <BeeijaSelect
          label="Availability configuration"
          value={plan.availabilityId}
          onChange={(event) =>
            onChange("availabilityId", event.target.value)
          }
          options={provider.availabilityOptions}
        />
        <BeeijaSelect
          label="Deployment billing method"
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
          label="Machine, instance, hardware, or configuration name"
          value={plan.configurationLabel}
          onChange={(value) => onChange("configurationLabel", value)}
        />
      </FieldSection>

      <div className="mt-5 rounded-xl border-l-4 border-[#F2C94C] bg-[#FFF8E8] px-5 py-4">
        <p className="text-sm leading-6 text-gray-700">
          {availability.description} {billingMode.description}
        </p>
      </div>

      <FieldSection title="Primary or HA Deployment Price">
        {plan.billingModeId === "all-in-hourly" ? (
          <BeeijaNumberField
            label="Complete deployment price per hour"
            value={plan.allInDeploymentHourlyPrice}
            onChange={(value) =>
              onChange("allInDeploymentHourlyPrice", value)
            }
            min="0"
            step="0.000001"
            prefix="$"
          />
        ) : null}

        {plan.billingModeId === "split-hourly" ? (
          <>
            <BeeijaNumberField
              label="Infrastructure price per deployment hour"
              value={plan.infrastructureHourlyPrice}
              onChange={(value) =>
                onChange("infrastructureHourlyPrice", value)
              }
              min="0"
              step="0.000001"
              prefix="$"
            />
            <BeeijaNumberField
              label="SQL Server licence price per deployment hour"
              value={plan.sqlLicenseHourlyPrice}
              onChange={(value) =>
                onChange("sqlLicenseHourlyPrice", value)
              }
              min="0"
              step="0.000001"
              prefix="$"
            />
          </>
        ) : null}

        {plan.billingModeId === "monthly-deployment" ? (
          <BeeijaNumberField
            label="Complete deployment price per month"
            value={plan.monthlyDeploymentPrice}
            onChange={(value) =>
              onChange("monthlyDeploymentPrice", value)
            }
            min="0"
            step="0.01"
            prefix="$"
          />
        ) : null}

        <BeeijaNumberField
          label="Effective discount on eligible hourly charges"
          value={plan.eligibleHourlyDiscountPercent}
          onChange={(value) =>
            onChange("eligibleHourlyDiscountPercent", value)
          }
          min="0"
          max="100"
          step="0.1"
          suffix="%"
        />
      </FieldSection>

      <FieldSection title="Additional Instance and Storage Prices">
        <BeeijaNumberField
          label="Price per additional SQL Server instance-hour"
          value={plan.additionalInstanceHourlyPrice}
          onChange={(value) =>
            onChange("additionalInstanceHourlyPrice", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Primary or HA deployment storage price per GB-month"
          value={plan.deploymentStoragePricePerGbMonth}
          onChange={(value) =>
            onChange("deploymentStoragePricePerGbMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Additional-instance storage price per GB-month"
          value={plan.additionalInstanceStoragePricePerGbMonth}
          onChange={(value) =>
            onChange("additionalInstanceStoragePricePerGbMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Primary or HA deployment IOPS price per IOPS-month"
          value={plan.deploymentIopsPricePerIopsMonth}
          onChange={(value) =>
            onChange("deploymentIopsPricePerIopsMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Additional-instance IOPS price per IOPS-month"
          value={plan.additionalInstanceIopsPricePerIopsMonth}
          onChange={(value) =>
            onChange("additionalInstanceIopsPricePerIopsMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
      </FieldSection>

      <FieldSection title="Backup, I/O, Transfer, and Migration">
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
        {plan.backupAllowanceMode === "custom" ? (
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
          onChange={(value) => onChange("backupPricePerGbMonth", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Paid I/O price per million requests"
          value={plan.paidIoPricePerMillion}
          onChange={(value) => onChange("paidIoPricePerMillion", value)}
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
          label="Other fixed monthly database services"
          value={plan.fixedMonthlyCost}
          onChange={(value) => onChange("fixedMonthlyCost", value)}
          min="0"
          step="1"
          prefix="$"
        />
        <BeeijaNumberField
          label="One-time migration cost"
          value={plan.oneTimeMigrationCost}
          onChange={(value) => onChange("oneTimeMigrationCost", value)}
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
      <h3 className="text-lg font-semibold text-gray-950">{title}</h3>
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
                    <p className="mt-1 text-gray-600">{row.regionLabel}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {row.productLabel}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {row.licenseOptionLabel}
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

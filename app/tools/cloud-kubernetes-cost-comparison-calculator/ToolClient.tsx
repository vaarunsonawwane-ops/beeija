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

type BillingModeId = "node-based" | "requested-resource" | "monthly-plan";

type BillingModeOption = Option & {
  description: string;
};

type ProviderDefinition = {
  id: string;
  providerName: string;
  serviceName: string;
  regions: Option[];
  products: Option[];
  supportTiers: Option[];
  billingModes: BillingModeOption[];
  defaults: {
    regionId: string;
    productId: string;
    supportTierId: string;
    billingModeId: BillingModeId;
  };
};

type PlanInput = {
  id: string;
  providerId: string;
  regionId: string;
  customRegion: string;
  productId: string;
  supportTierId: string;
  billingModeId: BillingModeId;
  configurationLabel: string;
  clusterFeePerHour: string;
  monthlyClusterFeeCredit: string;
  workerNodePricePerHour: string;
  nodeManagementPremiumPerHour: string;
  requestedVcpuPricePerHour: string;
  requestedMemoryPricePerGbHour: string;
  requestedEphemeralStoragePricePerGbHour: string;
  completeMonthlyComputePricePerCluster: string;
  computeDiscountPercent: string;
  persistentStoragePricePerGbMonth: string;
  loadBalancerPricePerHour: string;
  loadBalancerDataPricePerGb: string;
  natGatewayPricePerHour: string;
  natDataPricePerGb: string;
  egressPricePerGb: string;
  loggingPricePerGb: string;
  backupManagementPricePerNamespaceMonth: string;
  backupStoragePricePerGbMonth: string;
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
  supportTierLabel: string;
  billingModeLabel: string;
  configurationLabel: string;
  configured: boolean;
  clusterFeeBeforeCredit: number;
  clusterFeeCredit: number;
  clusterManagementCost: number;
  nodeComputeBeforeDiscount: number;
  requestedResourceBeforeDiscount: number;
  completeMonthlyComputeBeforeDiscount: number;
  computeBeforeDiscount: number;
  computeDiscountAmount: number;
  computeCost: number;
  persistentStorageCost: number;
  loadBalancerHourlyCost: number;
  loadBalancerDataCost: number;
  natGatewayHourlyCost: number;
  natDataCost: number;
  egressCost: number;
  loggingCost: number;
  backupManagementCost: number;
  backupStorageCost: number;
  fixedMonthlyCost: number;
  monthlyOperatingCost: number;
  amortizedMigrationCost: number;
  monthlyPlanningCost: number;
  oneTimeMigrationCost: number;
  firstYearCost: number;
  costPerCluster: number;
  costPerWorkloadVcpu: number;
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
    value: "node-based",
    label: "Worker node-based billing",
    description:
      "Worker compute is calculated from node count, node hourly price, and an optional management premium per node-hour.",
  },
  {
    value: "requested-resource",
    label: "Requested pod-resource billing",
    description:
      "Compute is calculated from requested pod vCPU, memory, and ephemeral storage per cluster.",
  },
  {
    value: "monthly-plan",
    label: "Complete monthly compute price",
    description:
      "Use one complete monthly compute amount per cluster for a bundled or custom quote.",
  },
];

const providers: ProviderDefinition[] = [
  {
    id: "aws",
    providerName: "Amazon Web Services",
    serviceName: "Amazon Elastic Kubernetes Service",
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
      { value: "eks-standard", label: "Amazon EKS with EC2 worker nodes" },
      { value: "eks-auto", label: "Amazon EKS Auto Mode" },
      { value: "eks-fargate", label: "Amazon EKS with AWS Fargate" },
      { value: "eks-hybrid", label: "Amazon EKS Hybrid Nodes" },
      { value: "eks-provisioned", label: "EKS Provisioned Control Plane" },
      { value: "custom", label: "Other Amazon EKS configuration" },
    ],
    supportTiers: [
      { value: "standard", label: "Standard Kubernetes version support" },
      { value: "extended", label: "Extended Kubernetes version support" },
      { value: "provisioned", label: "Provisioned control-plane tier" },
      { value: "custom", label: "Other EKS support or control-plane tier" },
    ],
    billingModes,
    defaults: {
      regionId: "ap-south-1",
      productId: "eks-standard",
      supportTierId: "standard",
      billingModeId: "node-based",
    },
  },
  {
    id: "azure",
    providerName: "Microsoft Azure",
    serviceName: "Azure Kubernetes Service",
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
      { value: "aks-standard", label: "AKS Standard with node pools" },
      { value: "aks-automatic", label: "AKS Automatic" },
      { value: "aks-windows", label: "AKS with Windows node pools" },
      { value: "aks-spot", label: "AKS with Spot node pools" },
      { value: "custom", label: "Other AKS configuration" },
    ],
    supportTiers: [
      { value: "free", label: "Free tier without SLA" },
      { value: "standard", label: "Standard tier with SLA" },
      { value: "premium", label: "Premium tier with LTS" },
      { value: "automatic", label: "AKS Automatic hosted component" },
      { value: "custom", label: "Other AKS support tier" },
    ],
    billingModes,
    defaults: {
      regionId: "central-india",
      productId: "aks-standard",
      supportTierId: "standard",
      billingModeId: "node-based",
    },
  },
  {
    id: "gcp",
    providerName: "Google Cloud",
    serviceName: "Google Kubernetes Engine",
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
      { value: "gke-standard-zonal", label: "GKE Standard zonal cluster" },
      { value: "gke-standard-regional", label: "GKE Standard regional cluster" },
      { value: "gke-autopilot", label: "GKE Autopilot" },
      { value: "gke-autopilot-hardware", label: "GKE Autopilot with selected hardware" },
      { value: "custom", label: "Other GKE configuration" },
    ],
    supportTiers: [
      { value: "standard", label: "Standard support period" },
      { value: "extended", label: "Extended support period" },
      { value: "free-credit", label: "Eligible GKE free-tier credit" },
      { value: "custom", label: "Other GKE support tier" },
    ],
    billingModes,
    defaults: {
      regionId: "asia-south1",
      productId: "gke-standard-zonal",
      supportTierId: "standard",
      billingModeId: "node-based",
    },
  },
  {
    id: "custom",
    providerName: "Custom Provider",
    serviceName: "Custom Managed Kubernetes Plan",
    regions: [{ value: "other", label: "Custom region" }],
    products: [{ value: "custom", label: "Custom Kubernetes service" }],
    supportTiers: [{ value: "custom", label: "Custom support tier" }],
    billingModes,
    defaults: {
      regionId: "other",
      productId: "custom",
      supportTierId: "custom",
      billingModeId: "node-based",
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
    productId: provider.defaults.productId,
    supportTierId: provider.defaults.supportTierId,
    billingModeId: provider.defaults.billingModeId,
    configurationLabel: "",
    clusterFeePerHour: "",
    monthlyClusterFeeCredit: "",
    workerNodePricePerHour: "",
    nodeManagementPremiumPerHour: "",
    requestedVcpuPricePerHour: "",
    requestedMemoryPricePerGbHour: "",
    requestedEphemeralStoragePricePerGbHour: "",
    completeMonthlyComputePricePerCluster: "",
    computeDiscountPercent: "",
    persistentStoragePricePerGbMonth: "",
    loadBalancerPricePerHour: "",
    loadBalancerDataPricePerGb: "",
    natGatewayPricePerHour: "",
    natDataPricePerGb: "",
    egressPricePerGb: "",
    loggingPricePerGb: "",
    backupManagementPricePerNamespaceMonth: "",
    backupStoragePricePerGbMonth: "",
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
  const [clusterCount, setClusterCount] = useState("1");
  const [runningHours, setRunningHours] = useState("730");
  const [workerNodesPerCluster, setWorkerNodesPerCluster] = useState("3");
  const [vcpusPerNode, setVcpusPerNode] = useState("4");
  const [memoryGbPerNode, setMemoryGbPerNode] = useState("16");
  const [requestedVcpusPerCluster, setRequestedVcpusPerCluster] = useState("8");
  const [requestedMemoryGbPerCluster, setRequestedMemoryGbPerCluster] =
    useState("32");
  const [requestedEphemeralStorageGbPerCluster, setRequestedEphemeralStorageGbPerCluster] =
    useState("20");
  const [persistentStorageGbPerCluster, setPersistentStorageGbPerCluster] =
    useState("100");
  const [loadBalancersPerCluster, setLoadBalancersPerCluster] = useState("1");
  const [loadBalancerDataGbPerCluster, setLoadBalancerDataGbPerCluster] =
    useState("100");
  const [natGatewaysPerCluster, setNatGatewaysPerCluster] = useState("1");
  const [natDataGbPerCluster, setNatDataGbPerCluster] = useState("100");
  const [egressGbPerCluster, setEgressGbPerCluster] = useState("100");
  const [loggingGbPerCluster, setLoggingGbPerCluster] = useState("50");
  const [backupNamespacesPerCluster, setBackupNamespacesPerCluster] =
    useState("0");
  const [backupStorageGbPerCluster, setBackupStorageGbPerCluster] =
    useState("0");
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
              supportTierId: provider.defaults.supportTierId,
              billingModeId: provider.defaults.billingModeId,
            }
          : plan,
      ),
    );
  };

  const result = useMemo(() => {
    const clusters = Math.floor(toNumber(clusterCount));
    const hours = toNumber(runningHours);
    const nodesPerCluster = Math.floor(toNumber(workerNodesPerCluster));
    const nodeVcpus = toNumber(vcpusPerNode);
    const nodeMemoryGb = toNumber(memoryGbPerNode);
    const requestedVcpus = toNumber(requestedVcpusPerCluster);
    const requestedMemoryGb = toNumber(requestedMemoryGbPerCluster);
    const requestedEphemeralGb = toNumber(
      requestedEphemeralStorageGbPerCluster,
    );
    const persistentGb = toNumber(persistentStorageGbPerCluster);
    const loadBalancers = Math.floor(toNumber(loadBalancersPerCluster));
    const loadBalancerDataGb = toNumber(loadBalancerDataGbPerCluster);
    const natGateways = Math.floor(toNumber(natGatewaysPerCluster));
    const natDataGb = toNumber(natDataGbPerCluster);
    const egressGb = toNumber(egressGbPerCluster);
    const loggingGb = toNumber(loggingGbPerCluster);
    const backupNamespaces = Math.floor(
      toNumber(backupNamespacesPerCluster),
    );
    const backupStorageGb = toNumber(backupStorageGbPerCluster);
    const budget = toNumber(monthlyBudget);

    const rows: PlanResult[] = plans.map((plan) => {
      const provider = getProvider(plan.providerId);
      const billingMode = getBillingMode(provider, plan.billingModeId);

      const clusterFeeBeforeCredit =
        toNumber(plan.clusterFeePerHour) * clusters * hours;
      const clusterFeeCredit = Math.min(
        clusterFeeBeforeCredit,
        toNumber(plan.monthlyClusterFeeCredit),
      );
      const clusterManagementCost =
        clusterFeeBeforeCredit - clusterFeeCredit;

      const nodeComputeBeforeDiscount =
        plan.billingModeId === "node-based"
          ? (toNumber(plan.workerNodePricePerHour) +
              toNumber(plan.nodeManagementPremiumPerHour)) *
            nodesPerCluster *
            clusters *
            hours
          : 0;

      const requestedResourceBeforeDiscount =
        plan.billingModeId === "requested-resource"
          ? (toNumber(plan.requestedVcpuPricePerHour) * requestedVcpus +
              toNumber(plan.requestedMemoryPricePerGbHour) *
                requestedMemoryGb +
              toNumber(plan.requestedEphemeralStoragePricePerGbHour) *
                requestedEphemeralGb) *
            clusters *
            hours
          : 0;

      const completeMonthlyComputeBeforeDiscount =
        plan.billingModeId === "monthly-plan"
          ? toNumber(plan.completeMonthlyComputePricePerCluster) * clusters
          : 0;

      const computeBeforeDiscount =
        nodeComputeBeforeDiscount +
        requestedResourceBeforeDiscount +
        completeMonthlyComputeBeforeDiscount;
      const computeDiscountAmount =
        computeBeforeDiscount *
        (clampPercent(plan.computeDiscountPercent) / 100);
      const computeCost =
        computeBeforeDiscount - computeDiscountAmount;

      const persistentStorageCost =
        toNumber(plan.persistentStoragePricePerGbMonth) *
        persistentGb *
        clusters;

      const loadBalancerHourlyCost =
        toNumber(plan.loadBalancerPricePerHour) *
        loadBalancers *
        clusters *
        hours;
      const loadBalancerDataCost =
        toNumber(plan.loadBalancerDataPricePerGb) *
        loadBalancerDataGb *
        clusters;

      const natGatewayHourlyCost =
        toNumber(plan.natGatewayPricePerHour) *
        natGateways *
        clusters *
        hours;
      const natDataCost =
        toNumber(plan.natDataPricePerGb) * natDataGb * clusters;

      const egressCost =
        toNumber(plan.egressPricePerGb) * egressGb * clusters;
      const loggingCost =
        toNumber(plan.loggingPricePerGb) * loggingGb * clusters;
      const backupManagementCost =
        toNumber(plan.backupManagementPricePerNamespaceMonth) *
        backupNamespaces *
        clusters;
      const backupStorageCost =
        toNumber(plan.backupStoragePricePerGbMonth) *
        backupStorageGb *
        clusters;
      const fixedMonthlyCost = toNumber(plan.fixedMonthlyCost);
      const oneTimeMigrationCost = toNumber(plan.oneTimeMigrationCost);
      const migrationMonths = Math.max(
        1,
        toNumber(plan.migrationAmortizationMonths),
      );
      const amortizedMigrationCost =
        oneTimeMigrationCost / migrationMonths;

      const monthlyOperatingCost =
        clusterManagementCost +
        computeCost +
        persistentStorageCost +
        loadBalancerHourlyCost +
        loadBalancerDataCost +
        natGatewayHourlyCost +
        natDataCost +
        egressCost +
        loggingCost +
        backupManagementCost +
        backupStorageCost +
        fixedMonthlyCost;

      const monthlyPlanningCost =
        monthlyOperatingCost + amortizedMigrationCost;
      const firstYearCost =
        monthlyOperatingCost * 12 + oneTimeMigrationCost;

      const workloadVcpus =
        plan.billingModeId === "requested-resource"
          ? requestedVcpus * clusters
          : nodeVcpus * nodesPerCluster * clusters;

      const priceFields = [
        plan.clusterFeePerHour,
        plan.monthlyClusterFeeCredit,
        plan.workerNodePricePerHour,
        plan.nodeManagementPremiumPerHour,
        plan.requestedVcpuPricePerHour,
        plan.requestedMemoryPricePerGbHour,
        plan.requestedEphemeralStoragePricePerGbHour,
        plan.completeMonthlyComputePricePerCluster,
        plan.persistentStoragePricePerGbMonth,
        plan.loadBalancerPricePerHour,
        plan.loadBalancerDataPricePerGb,
        plan.natGatewayPricePerHour,
        plan.natDataPricePerGb,
        plan.egressPricePerGb,
        plan.loggingPricePerGb,
        plan.backupManagementPricePerNamespaceMonth,
        plan.backupStoragePricePerGbMonth,
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
        supportTierLabel: getOptionLabel(
          provider.supportTiers,
          plan.supportTierId,
        ),
        billingModeLabel: billingMode.label,
        configurationLabel:
          plan.configurationLabel.trim() || "Configuration name not entered",
        configured,
        clusterFeeBeforeCredit,
        clusterFeeCredit,
        clusterManagementCost,
        nodeComputeBeforeDiscount,
        requestedResourceBeforeDiscount,
        completeMonthlyComputeBeforeDiscount,
        computeBeforeDiscount,
        computeDiscountAmount,
        computeCost,
        persistentStorageCost,
        loadBalancerHourlyCost,
        loadBalancerDataCost,
        natGatewayHourlyCost,
        natDataCost,
        egressCost,
        loggingCost,
        backupManagementCost,
        backupStorageCost,
        fixedMonthlyCost,
        monthlyOperatingCost,
        amortizedMigrationCost,
        monthlyPlanningCost,
        oneTimeMigrationCost,
        firstYearCost,
        costPerCluster:
          clusters > 0 ? monthlyPlanningCost / clusters : 0,
        costPerWorkloadVcpu:
          workloadVcpus > 0 ? monthlyPlanningCost / workloadVcpus : 0,
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
      clusters,
      hours,
      nodesPerCluster,
      nodeVcpus,
      nodeMemoryGb,
      requestedVcpus,
      requestedMemoryGb,
      requestedEphemeralGb,
      persistentGb,
      loadBalancers,
      loadBalancerDataGb,
      natGateways,
      natDataGb,
      egressGb,
      loggingGb,
      backupNamespaces,
      backupStorageGb,
      budget,
      hasBudget: monthlyBudget.trim() !== "",
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
    backupNamespacesPerCluster,
    backupStorageGbPerCluster,
    clusterCount,
    egressGbPerCluster,
    loadBalancerDataGbPerCluster,
    loadBalancersPerCluster,
    loggingGbPerCluster,
    memoryGbPerNode,
    monthlyBudget,
    natDataGbPerCluster,
    natGatewaysPerCluster,
    persistentStorageGbPerCluster,
    plans,
    requestedEphemeralStorageGbPerCluster,
    requestedMemoryGbPerCluster,
    requestedVcpusPerCluster,
    runningHours,
    selectedPlanId,
    vcpusPerNode,
    workerNodesPerCluster,
  ]);

  const selectedPlan =
    plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const selectedResult = result.selected;

  const selectedRows: CostRow[] = [
    {
      label: "Cluster management",
      detail: `${formatInteger(result.clusters)} clusters × ${formatNumber(
        result.hours,
      )} hours after entered cluster-fee credit`,
      value: selectedResult.clusterManagementCost,
      entered: selectedPlan.clusterFeePerHour.trim() !== "",
    },
    {
      label: "Cluster-fee credit",
      detail: "Monthly free-tier or account-level cluster-management credit",
      value: selectedResult.clusterFeeCredit,
      entered:
        selectedPlan.monthlyClusterFeeCredit.trim() !== "" &&
        selectedResult.clusterFeeCredit > 0,
      negative: true,
    },
    {
      label: "Worker or requested-resource compute",
      detail: selectedResult.billingModeLabel,
      value: selectedResult.computeCost,
      entered:
        selectedPlan.workerNodePricePerHour.trim() !== "" ||
        selectedPlan.nodeManagementPremiumPerHour.trim() !== "" ||
        selectedPlan.requestedVcpuPricePerHour.trim() !== "" ||
        selectedPlan.requestedMemoryPricePerGbHour.trim() !== "" ||
        selectedPlan.requestedEphemeralStoragePricePerGbHour.trim() !== "" ||
        selectedPlan.completeMonthlyComputePricePerCluster.trim() !== "",
    },
    {
      label: "Compute discount",
      detail: "Applied only to the selected worker or requested-resource compute model",
      value: selectedResult.computeDiscountAmount,
      entered:
        selectedPlan.computeDiscountPercent.trim() !== "" &&
        selectedResult.computeBeforeDiscount > 0,
      negative: true,
    },
    {
      label: "Persistent storage",
      detail: `${formatNumber(
        result.persistentGb,
      )} GB per cluster × ${formatInteger(result.clusters)} clusters`,
      value: selectedResult.persistentStorageCost,
      entered:
        selectedPlan.persistentStoragePricePerGbMonth.trim() !== "",
    },
    {
      label: "Load balancer infrastructure",
      detail: `${formatInteger(
        result.loadBalancers,
      )} per cluster × ${formatNumber(result.hours)} hours`,
      value: selectedResult.loadBalancerHourlyCost,
      entered: selectedPlan.loadBalancerPricePerHour.trim() !== "",
    },
    {
      label: "Load balancer data processing",
      detail: `${formatNumber(
        result.loadBalancerDataGb,
      )} GB per cluster`,
      value: selectedResult.loadBalancerDataCost,
      entered: selectedPlan.loadBalancerDataPricePerGb.trim() !== "",
    },
    {
      label: "NAT gateway infrastructure",
      detail: `${formatInteger(
        result.natGateways,
      )} per cluster × ${formatNumber(result.hours)} hours`,
      value: selectedResult.natGatewayHourlyCost,
      entered: selectedPlan.natGatewayPricePerHour.trim() !== "",
    },
    {
      label: "NAT data processing",
      detail: `${formatNumber(result.natDataGb)} GB per cluster`,
      value: selectedResult.natDataCost,
      entered: selectedPlan.natDataPricePerGb.trim() !== "",
    },
    {
      label: "Internet or cross-region transfer",
      detail: `${formatNumber(result.egressGb)} GB per cluster`,
      value: selectedResult.egressCost,
      entered: selectedPlan.egressPricePerGb.trim() !== "",
    },
    {
      label: "Observability ingestion",
      detail: `${formatNumber(result.loggingGb)} GB per cluster`,
      value: selectedResult.loggingCost,
      entered: selectedPlan.loggingPricePerGb.trim() !== "",
    },
    {
      label: "Backup management",
      detail: `${formatInteger(
        result.backupNamespaces,
      )} namespaces per cluster`,
      value: selectedResult.backupManagementCost,
      entered:
        selectedPlan.backupManagementPricePerNamespaceMonth.trim() !== "",
    },
    {
      label: "Backup storage",
      detail: `${formatNumber(result.backupStorageGb)} GB per cluster`,
      value: selectedResult.backupStorageCost,
      entered: selectedPlan.backupStoragePricePerGbMonth.trim() !== "",
    },
    {
      label: "Other fixed monthly services",
      detail: "Security, service mesh, registry, support, or another entered monthly charge",
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
    setClusterCount("1");
    setRunningHours("730");
    setWorkerNodesPerCluster("3");
    setVcpusPerNode("4");
    setMemoryGbPerNode("16");
    setRequestedVcpusPerCluster("8");
    setRequestedMemoryGbPerCluster("32");
    setRequestedEphemeralStorageGbPerCluster("20");
    setPersistentStorageGbPerCluster("100");
    setLoadBalancersPerCluster("1");
    setLoadBalancerDataGbPerCluster("100");
    setNatGatewaysPerCluster("1");
    setNatDataGbPerCluster("100");
    setEgressGbPerCluster("100");
    setLoggingGbPerCluster("50");
    setBackupNamespacesPerCluster("0");
    setBackupStorageGbPerCluster("0");
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
            Enter the Shared Kubernetes Workload
          </h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            Use the same cluster scale, compute demand, storage, networking,
            observability, and backup workload for every provider plan.
          </p>
        </div>

        <FieldSection title="Cluster and Worker Capacity">
          <BeeijaNumberField
            label="Managed Kubernetes clusters"
            value={clusterCount}
            onChange={setClusterCount}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Running time per month"
            value={runningHours}
            onChange={setRunningHours}
            min="0"
            max="744"
            step="1"
            suffix="hours"
          />
          <BeeijaNumberField
            label="Worker nodes per cluster"
            value={workerNodesPerCluster}
            onChange={setWorkerNodesPerCluster}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="vCPUs per worker node"
            value={vcpusPerNode}
            onChange={setVcpusPerNode}
            min="0"
            step="0.25"
            suffix="vCPU"
          />
          <BeeijaNumberField
            label="Memory per worker node"
            value={memoryGbPerNode}
            onChange={setMemoryGbPerNode}
            min="0"
            step="0.5"
            suffix="GB"
          />
        </FieldSection>

        <FieldSection title="Requested Pod Resources per Cluster">
          <BeeijaNumberField
            label="Requested pod vCPU"
            value={requestedVcpusPerCluster}
            onChange={setRequestedVcpusPerCluster}
            min="0"
            step="0.25"
            suffix="vCPU"
          />
          <BeeijaNumberField
            label="Requested pod memory"
            value={requestedMemoryGbPerCluster}
            onChange={setRequestedMemoryGbPerCluster}
            min="0"
            step="0.5"
            suffix="GB"
          />
          <BeeijaNumberField
            label="Requested ephemeral storage"
            value={requestedEphemeralStorageGbPerCluster}
            onChange={setRequestedEphemeralStorageGbPerCluster}
            min="0"
            step="1"
            suffix="GB"
          />
        </FieldSection>

        <FieldSection title="Storage, Networking, and Observability">
          <BeeijaNumberField
            label="Persistent storage per cluster"
            value={persistentStorageGbPerCluster}
            onChange={setPersistentStorageGbPerCluster}
            min="0"
            step="1"
            suffix="GB"
          />
          <BeeijaNumberField
            label="Load balancers per cluster"
            value={loadBalancersPerCluster}
            onChange={setLoadBalancersPerCluster}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Load balancer processed data per cluster"
            value={loadBalancerDataGbPerCluster}
            onChange={setLoadBalancerDataGbPerCluster}
            min="0"
            step="1"
            suffix="GB"
          />
          <BeeijaNumberField
            label="NAT gateways per cluster"
            value={natGatewaysPerCluster}
            onChange={setNatGatewaysPerCluster}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="NAT processed data per cluster"
            value={natDataGbPerCluster}
            onChange={setNatDataGbPerCluster}
            min="0"
            step="1"
            suffix="GB"
          />
          <BeeijaNumberField
            label="Internet or cross-region transfer per cluster"
            value={egressGbPerCluster}
            onChange={setEgressGbPerCluster}
            min="0"
            step="1"
            suffix="GB"
          />
          <BeeijaNumberField
            label="Logging and metrics ingestion per cluster"
            value={loggingGbPerCluster}
            onChange={setLoggingGbPerCluster}
            min="0"
            step="1"
            suffix="GB"
          />
        </FieldSection>

        <FieldSection title="Backup and Budget">
          <BeeijaNumberField
            label="Protected namespaces per cluster"
            value={backupNamespacesPerCluster}
            onChange={setBackupNamespacesPerCluster}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Backup storage per cluster"
            value={backupStorageGbPerCluster}
            onChange={setBackupStorageGbPerCluster}
            min="0"
            step="1"
            suffix="GB"
          />
          <BeeijaNumberField
            label="Target monthly Kubernetes budget"
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
            <p>Clusters: {formatInteger(result.clusters)}</p>
            <p>Running time: {formatNumber(result.hours)} hours</p>
            <p>Worker nodes per cluster: {formatInteger(result.nodesPerCluster)}</p>
            <p>
              Node size: {formatNumber(result.nodeVcpus)} vCPU and{" "}
              {formatNumber(result.nodeMemoryGb)} GB
            </p>
            <p>Requested pod vCPU: {formatNumber(result.requestedVcpus)}</p>
            <p>Requested pod memory: {formatNumber(result.requestedMemoryGb)} GB</p>
            <p>Persistent storage: {formatNumber(result.persistentGb)} GB per cluster</p>
            <p>Load balancers: {formatInteger(result.loadBalancers)} per cluster</p>
            <p>NAT gateways: {formatInteger(result.natGateways)} per cluster</p>
            <p>Logging ingestion: {formatNumber(result.loggingGb)} GB per cluster</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-950">
            Select Kubernetes Configurations and Enter Prices
          </h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            Choose the provider, region, service mode, support tier, and billing
            model. Prices remain blank so you can enter the exact effective
            rates for each selected plan.
          </p>
        </div>

        <div className="mt-6">
          <div
            className="grid gap-2 sm:grid-cols-3"
            role="tablist"
            aria-label="Managed Kubernetes comparison plans"
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

        <button type="button" onClick={reset} className="beeija-btn-outline mt-7">
          Reset values
        </button>
      </section>

      <div className="min-w-0 overflow-hidden">
        <BeeijaCalculatorResultPanel
          title="Managed Kubernetes Cost Comparison"
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
                label="Monthly cost per cluster"
                value={
                  selectedResult.configured
                    ? formatVisibleMoney(selectedResult.costPerCluster)
                    : "—"
                }
              />
              <ResultStat
                label="Cost per workload vCPU"
                value={
                  selectedResult.configured
                    ? formatVisibleMoney(selectedResult.costPerWorkloadVcpu)
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
                  {selectedResult.supportTierLabel}
                </p>
                <p className="mt-1">{selectedResult.billingModeLabel}</p>
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
                  {selectedResult.supportTierLabel} ·{" "}
                  {selectedResult.billingModeLabel}
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
                  {selectedResult.enteredPriceCount} of 19
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
          provider="Amazon Elastic Kubernetes Service, Azure Kubernetes Service, Google Kubernetes Engine, and custom managed Kubernetes plans"
          excludedCosts="taxes, premium cloud support, public IPv4 addresses, private connectivity, service mesh, security products, container registry, artifact storage, DNS, secrets, certificates, cross-zone traffic, migration labour, negotiated credits, and services not entered"
          noticeText="Provider, region, product, support-tier, and billing selections identify the configuration only; they do not load or imply a current price. Enter current effective rates for the exact selected setup. Pricing structures and official billing guidance were checked on June 25, 2026. Blank optional price fields are treated as zero."
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
          label="Managed Kubernetes provider"
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
          label="Kubernetes service or operating mode"
          value={plan.productId}
          onChange={(event) => onChange("productId", event.target.value)}
          options={provider.products}
        />
        <BeeijaSelect
          label="Version-support or cluster tier"
          value={plan.supportTierId}
          onChange={(event) =>
            onChange("supportTierId", event.target.value)
          }
          options={provider.supportTiers}
        />
        <BeeijaSelect
          label="Worker compute billing model"
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
          label="Worker machine, compute class, or configuration name"
          value={plan.configurationLabel}
          onChange={(value) => onChange("configurationLabel", value)}
        />
      </FieldSection>

      <div className="mt-5 rounded-xl border-l-4 border-[#F2C94C] bg-[#FFF8E8] px-5 py-4">
        <p className="text-sm leading-6 text-gray-700">
          {billingMode.description} Enter the full effective rates for the
          selected provider, region, support tier, and purchase option.
        </p>
      </div>

      <FieldSection title="Cluster Management and Compute Prices">
        <BeeijaNumberField
          label="Cluster-management price per cluster-hour"
          value={plan.clusterFeePerHour}
          onChange={(value) => onChange("clusterFeePerHour", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Monthly cluster-management credit"
          value={plan.monthlyClusterFeeCredit}
          onChange={(value) =>
            onChange("monthlyClusterFeeCredit", value)
          }
          min="0"
          step="0.01"
          prefix="$"
        />

        {plan.billingModeId === "node-based" ? (
          <>
            <BeeijaNumberField
              label="Worker node compute price per node-hour"
              value={plan.workerNodePricePerHour}
              onChange={(value) =>
                onChange("workerNodePricePerHour", value)
              }
              min="0"
              step="0.000001"
              prefix="$"
            />
            <BeeijaNumberField
              label="Additional node-management premium per node-hour"
              value={plan.nodeManagementPremiumPerHour}
              onChange={(value) =>
                onChange("nodeManagementPremiumPerHour", value)
              }
              min="0"
              step="0.000001"
              prefix="$"
            />
          </>
        ) : null}

        {plan.billingModeId === "requested-resource" ? (
          <>
            <BeeijaNumberField
              label="Requested vCPU price per vCPU-hour"
              value={plan.requestedVcpuPricePerHour}
              onChange={(value) =>
                onChange("requestedVcpuPricePerHour", value)
              }
              min="0"
              step="0.000001"
              prefix="$"
            />
            <BeeijaNumberField
              label="Requested memory price per GB-hour"
              value={plan.requestedMemoryPricePerGbHour}
              onChange={(value) =>
                onChange("requestedMemoryPricePerGbHour", value)
              }
              min="0"
              step="0.000001"
              prefix="$"
            />
            <BeeijaNumberField
              label="Requested ephemeral storage price per GB-hour"
              value={plan.requestedEphemeralStoragePricePerGbHour}
              onChange={(value) =>
                onChange(
                  "requestedEphemeralStoragePricePerGbHour",
                  value,
                )
              }
              min="0"
              step="0.000001"
              prefix="$"
            />
          </>
        ) : null}

        {plan.billingModeId === "monthly-plan" ? (
          <BeeijaNumberField
            label="Complete monthly compute price per cluster"
            value={plan.completeMonthlyComputePricePerCluster}
            onChange={(value) =>
              onChange("completeMonthlyComputePricePerCluster", value)
            }
            min="0"
            step="0.01"
            prefix="$"
          />
        ) : null}

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
      </FieldSection>

      <FieldSection title="Storage and Network Prices">
        <BeeijaNumberField
          label="Persistent storage price per GB-month"
          value={plan.persistentStoragePricePerGbMonth}
          onChange={(value) =>
            onChange("persistentStoragePricePerGbMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Load balancer price per hour"
          value={plan.loadBalancerPricePerHour}
          onChange={(value) =>
            onChange("loadBalancerPricePerHour", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Load balancer data-processing price per GB"
          value={plan.loadBalancerDataPricePerGb}
          onChange={(value) =>
            onChange("loadBalancerDataPricePerGb", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="NAT gateway price per hour"
          value={plan.natGatewayPricePerHour}
          onChange={(value) =>
            onChange("natGatewayPricePerHour", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="NAT data-processing price per GB"
          value={plan.natDataPricePerGb}
          onChange={(value) => onChange("natDataPricePerGb", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Internet or cross-region transfer price per GB"
          value={plan.egressPricePerGb}
          onChange={(value) => onChange("egressPricePerGb", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />
      </FieldSection>

      <FieldSection title="Observability, Backup, and Migration Prices">
        <BeeijaNumberField
          label="Logging and metrics ingestion price per GB"
          value={plan.loggingPricePerGb}
          onChange={(value) => onChange("loggingPricePerGb", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Backup management price per namespace-month"
          value={plan.backupManagementPricePerNamespaceMonth}
          onChange={(value) =>
            onChange("backupManagementPricePerNamespaceMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Backup storage price per GB-month"
          value={plan.backupStoragePricePerGbMonth}
          onChange={(value) =>
            onChange("backupStoragePricePerGbMonth", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Other fixed monthly Kubernetes services"
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
                      {row.supportTierLabel}
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

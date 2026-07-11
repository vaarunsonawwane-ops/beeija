"use client";

import { useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaAdvancedSection from "@/app/components/BeeijaAdvancedSection";
import BeeijaResultLine from "@/app/components/BeeijaResultLine";
import {
  getObjectStorageOptionLabel,
  getObjectStorageProvider,
  objectStorageProviders,
  type ObjectStorageProvider,
} from "@/app/data/objectStorageOptions";

type PlanInput = {
  id: string;
  providerId: string;
  regionId: string;
  customRegion: string;
  resilienceId: string;
  hotClassId: string;
  coolClassId: string;
  archiveClassId: string;
  standardStoragePrice: string;
  coolStoragePrice: string;
  archiveStoragePrice: string;
  writePricePerTenThousand: string;
  readPricePerTenThousand: string;
  listPricePerTenThousand: string;
  transitionPricePerTenThousand: string;
  coolRetrievalPricePerGb: string;
  archiveRetrievalPricePerGb: string;
  egressPricePerGb: string;
  replicationTransferPricePerGb: string;
  managementPricePerMillionObjects: string;
  earlyDeletionPricePerGb: string;
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
  resilienceLabel: string;
  classSummary: string;
  configured: boolean;
  standardStorageCost: number;
  coolStorageCost: number;
  archiveStorageCost: number;
  totalStorageCost: number;
  writeRequestCost: number;
  readRequestCost: number;
  listRequestCost: number;
  transitionRequestCost: number;
  totalRequestCost: number;
  coolRetrievalCost: number;
  archiveRetrievalCost: number;
  totalRetrievalCost: number;
  egressCost: number;
  replicationTransferCost: number;
  managementCost: number;
  earlyDeletionCost: number;
  fixedMonthlyCost: number;
  amortizedMigrationCost: number;
  oneTimeMigrationCost: number;
  monthlyOperatingCost: number;
  monthlyPlanningCost: number;
  firstYearCost: number;
  costPerStoredTb: number;
  requestCostPerMillion: number;
  retrievalCostPerGb: number;
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
  const provider = getObjectStorageProvider(providerId);

  return {
    id,
    providerId: provider.id,
    regionId: provider.defaults.regionId,
    customRegion: "",
    resilienceId: provider.defaults.resilienceId,
    hotClassId: provider.defaults.hotClassId,
    coolClassId: provider.defaults.coolClassId,
    archiveClassId: provider.defaults.archiveClassId,
    standardStoragePrice: "",
    coolStoragePrice: "",
    archiveStoragePrice: "",
    writePricePerTenThousand: "",
    readPricePerTenThousand: "",
    listPricePerTenThousand: "",
    transitionPricePerTenThousand: "",
    coolRetrievalPricePerGb: "",
    archiveRetrievalPricePerGb: "",
    egressPricePerGb: "",
    replicationTransferPricePerGb: "",
    managementPricePerMillionObjects: "",
    earlyDeletionPricePerGb: "",
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


type ProviderDisplay = {
  providerName: string;
  serviceName: string;
  shortName: string;
};

const providerDisplayById: Record<string, ProviderDisplay> = {
  aws: {
    providerName: "Amazon Web Services",
    serviceName: "Amazon S3",
    shortName: "AWS",
  },
  azure: {
    providerName: "Microsoft Azure",
    serviceName: "Azure Blob Storage",
    shortName: "Azure",
  },
  gcp: {
    providerName: "Google Cloud",
    serviceName: "Cloud Storage",
    shortName: "Google Cloud",
  },
  custom: {
    providerName: "Custom provider",
    serviceName: "Custom object storage service",
    shortName: "Custom",
  },
};

function getProviderDisplay(provider: ObjectStorageProvider): ProviderDisplay {
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
    .replace(/\s+—\s+[a-z]{2,}(?:-[a-z]+)*-\d+$/i, "")
    .replace(/\s+—\s+[a-z]+[a-z0-9-]*$/i, "")
    .replace(/\s+\(([^)]*)\s+—\s+[^)]*\)/i, " ($1)")
    .trim();
}

function getRegionOptions(provider: ObjectStorageProvider) {
  return provider.regions.map((option) => ({
    ...option,
    label: option.value === "other" ? option.label : shortenRegionLabel(option.label),
  }));
}

function shortenStorageClassLabel(label: string) {
  return label
    .replace("S3 Glacier Instant Retrieval", "S3 Glacier Instant")
    .replace("S3 Glacier Flexible Retrieval", "S3 Glacier Flexible")
    .replace("S3 Intelligent-Tiering — Frequent Access", "S3 Intelligent Frequent")
    .replace("S3 Intelligent-Tiering — Infrequent Access", "S3 Intelligent Infrequent")
    .replace("S3 Intelligent-Tiering — Archive Access", "S3 Intelligent Archive")
    .replace("S3 Intelligent-Tiering — Deep Archive Access", "S3 Intelligent Deep Archive")
    .replace("Locally redundant storage (LRS)", "LRS — Locally redundant")
    .replace("Zone-redundant storage (ZRS)", "ZRS — Zone redundant")
    .replace("Geo-redundant storage (GRS)", "GRS — Geo redundant")
    .replace("Read-access geo-redundant storage (RA-GRS)", "RA-GRS — Read-access geo redundant")
    .replace("Geo-zone-redundant storage (GZRS)", "GZRS — Geo-zone redundant")
    .replace("Read-access geo-zone-redundant storage (RA-GZRS)", "RA-GZRS — Read-access geo-zone")
    .trim();
}

function getCompactOptions(options: { value: string; label: string }[]) {
  return options.map((option) => ({
    ...option,
    label: shortenStorageClassLabel(option.label),
  }));
}

function getProviderShortName(provider: ObjectStorageProvider) {
  return getProviderDisplay(provider).shortName;
}

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

function getRegionLabel(plan: PlanInput, provider: ObjectStorageProvider) {
  if (plan.regionId === "other") {
    return plan.customRegion.trim() || "Other region";
  }

  return getObjectStorageOptionLabel(getRegionOptions(provider), plan.regionId);
}

function getClassLabels(plan: PlanInput, provider: ObjectStorageProvider) {
  return {
    hot: getObjectStorageOptionLabel(
      provider.hotClasses,
      plan.hotClassId,
    ),
    cool: getObjectStorageOptionLabel(
      provider.coolClasses,
      plan.coolClassId,
    ),
    archive: getObjectStorageOptionLabel(
      provider.archiveClasses,
      plan.archiveClassId,
    ),
  };
}

function getDisplayName(plan: PlanInput) {
  const provider = getObjectStorageProvider(plan.providerId);
  return `${getProviderDisplay(provider).serviceName} — ${getRegionLabel(plan, provider)}`;
}

function getClassSummary(plan: PlanInput) {
  const provider = getObjectStorageProvider(plan.providerId);
  const classes = getClassLabels(plan, provider);

  return [classes.hot, classes.cool, classes.archive]
    .filter((label) => label !== "Not used")
    .join(" / ");
}

function isAzureArchiveUnsupported(plan: PlanInput) {
  return (
    plan.providerId === "azure" &&
    ["zrs", "gzrs", "ra-gzrs"].includes(plan.resilienceId)
  );
}

export default function ToolClient() {
  const [averageStoredDataGb, setAverageStoredDataGb] =
    useState("10240");
  const [monthlyNewDataGb, setMonthlyNewDataGb] = useState("1000");

  const [standardSharePercent, setStandardSharePercent] =
    useState("60");
  const [coolSharePercent, setCoolSharePercent] = useState("30");
  const [archiveSharePercent, setArchiveSharePercent] =
    useState("10");

  const [replicatedSharePercent, setReplicatedSharePercent] =
    useState("20");
  const [writeRequests, setWriteRequests] = useState("5000000");
  const [readRequests, setReadRequests] = useState("30000000");
  const [listRequests, setListRequests] = useState("1000000");
  const [lifecycleTransitions, setLifecycleTransitions] =
    useState("500000");

  const [coolRetrievedGb, setCoolRetrievedGb] = useState("500");
  const [archiveRetrievedGb, setArchiveRetrievedGb] =
    useState("100");
  const [internetEgressGb, setInternetEgressGb] =
    useState("2000");
  const [objectCountMillions, setObjectCountMillions] =
    useState("10");
  const [earlyDeletedDataGb, setEarlyDeletedDataGb] =
    useState("100");
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

  const changeResilience = (planId: string, resilienceId: string) => {
    setPlans((current) =>
      current.map((plan) => {
        if (plan.id !== planId) return plan;

        const nextPlan = {
          ...plan,
          resilienceId,
        };

        return isAzureArchiveUnsupported(nextPlan)
          ? { ...nextPlan, archiveClassId: "not-used" }
          : nextPlan;
      }),
    );
  };

  const result = useMemo(() => {
    const primaryStoredGb = toNumber(averageStoredDataGb);
    const newDataGb = toNumber(monthlyNewDataGb);
    const replicatedShare =
      clampPercent(replicatedSharePercent) / 100;

    const replicatedStoredGb = primaryStoredGb * replicatedShare;
    const replicatedNewGb = newDataGb * replicatedShare;
    const totalStoredGb = primaryStoredGb + replicatedStoredGb;

    const enteredStandardShare = clampPercent(standardSharePercent);
    const enteredCoolShare = clampPercent(coolSharePercent);
    const enteredArchiveShare = clampPercent(archiveSharePercent);
    const enteredShareTotal =
      enteredStandardShare + enteredCoolShare + enteredArchiveShare;

    const standardShare =
      enteredShareTotal > 0
        ? enteredStandardShare / enteredShareTotal
        : 0;
    const coolShare =
      enteredShareTotal > 0
        ? enteredCoolShare / enteredShareTotal
        : 0;
    const archiveShare =
      enteredShareTotal > 0
        ? enteredArchiveShare / enteredShareTotal
        : 0;

    const standardStoredGb = totalStoredGb * standardShare;
    const coolStoredGb = totalStoredGb * coolShare;
    const archiveStoredGb = totalStoredGb * archiveShare;

    const writes = toNumber(writeRequests);
    const reads = toNumber(readRequests);
    const lists = toNumber(listRequests);
    const transitions = toNumber(lifecycleTransitions);
    const totalRequests = writes + reads + lists + transitions;

    const coolRetrievalGb = toNumber(coolRetrievedGb);
    const archiveRetrievalGb = toNumber(archiveRetrievedGb);
    const totalRetrievedGb = coolRetrievalGb + archiveRetrievalGb;
    const egressGb = toNumber(internetEgressGb);
    const objectsInMillions = toNumber(objectCountMillions);
    const earlyDeletedGb = toNumber(earlyDeletedDataGb);
    const budget = toNumber(monthlyBudget);

    const rows: PlanResult[] = plans.map((plan) => {
      const provider = getObjectStorageProvider(plan.providerId);
      const classes = getClassLabels(plan, provider);
      const coolEnabled = plan.coolClassId !== "not-used";
      const archiveEnabled = plan.archiveClassId !== "not-used";

      const standardStorageCost =
        standardStoredGb * toNumber(plan.standardStoragePrice);
      const coolStorageCost = coolEnabled
        ? coolStoredGb * toNumber(plan.coolStoragePrice)
        : 0;
      const archiveStorageCost = archiveEnabled
        ? archiveStoredGb * toNumber(plan.archiveStoragePrice)
        : 0;
      const totalStorageCost =
        standardStorageCost + coolStorageCost + archiveStorageCost;

      const writeRequestCost =
        (writes / 10_000) *
        toNumber(plan.writePricePerTenThousand);
      const readRequestCost =
        (reads / 10_000) *
        toNumber(plan.readPricePerTenThousand);
      const listRequestCost =
        (lists / 10_000) *
        toNumber(plan.listPricePerTenThousand);
      const transitionRequestCost =
        (transitions / 10_000) *
        toNumber(plan.transitionPricePerTenThousand);
      const totalRequestCost =
        writeRequestCost +
        readRequestCost +
        listRequestCost +
        transitionRequestCost;

      const coolRetrievalCost = coolEnabled
        ? coolRetrievalGb *
          toNumber(plan.coolRetrievalPricePerGb)
        : 0;
      const archiveRetrievalCost = archiveEnabled
        ? archiveRetrievalGb *
          toNumber(plan.archiveRetrievalPricePerGb)
        : 0;
      const totalRetrievalCost =
        coolRetrievalCost + archiveRetrievalCost;

      const egressCost =
        egressGb * toNumber(plan.egressPricePerGb);
      const replicationTransferCost =
        replicatedNewGb *
        toNumber(plan.replicationTransferPricePerGb);
      const managementCost =
        objectsInMillions *
        toNumber(plan.managementPricePerMillionObjects);
      const earlyDeletionCost =
        earlyDeletedGb * toNumber(plan.earlyDeletionPricePerGb);
      const fixedMonthlyCost = toNumber(plan.fixedMonthlyCost);

      const oneTimeMigrationCost =
        toNumber(plan.oneTimeMigrationCost);
      const amortizationMonths = Math.max(
        1,
        toNumber(plan.migrationAmortizationMonths),
      );
      const amortizedMigrationCost =
        oneTimeMigrationCost / amortizationMonths;

      const monthlyOperatingCost =
        totalStorageCost +
        totalRequestCost +
        totalRetrievalCost +
        egressCost +
        replicationTransferCost +
        managementCost +
        earlyDeletionCost +
        fixedMonthlyCost;

      const monthlyPlanningCost =
        monthlyOperatingCost + amortizedMigrationCost;
      const firstYearCost =
        monthlyOperatingCost * 12 + oneTimeMigrationCost;

      const enteredPriceCount = [
        plan.standardStoragePrice,
        coolEnabled ? plan.coolStoragePrice : "",
        archiveEnabled ? plan.archiveStoragePrice : "",
        plan.writePricePerTenThousand,
        plan.readPricePerTenThousand,
        plan.listPricePerTenThousand,
        plan.transitionPricePerTenThousand,
        coolEnabled ? plan.coolRetrievalPricePerGb : "",
        archiveEnabled ? plan.archiveRetrievalPricePerGb : "",
        plan.egressPricePerGb,
        plan.replicationTransferPricePerGb,
        plan.managementPricePerMillionObjects,
        plan.earlyDeletionPricePerGb,
        plan.fixedMonthlyCost,
        plan.oneTimeMigrationCost,
      ].filter((value) => value.trim() !== "").length;

      const configured =
        plan.standardStoragePrice.trim() !== "" ||
        (coolEnabled && plan.coolStoragePrice.trim() !== "") ||
        (archiveEnabled &&
          plan.archiveStoragePrice.trim() !== "");

      return {
        id: plan.id,
        providerId: provider.id,
        providerName: getProviderDisplay(provider).providerName,
        serviceName: getProviderDisplay(provider).serviceName,
        displayName: getDisplayName(plan),
        regionLabel: getRegionLabel(plan, provider),
        resilienceLabel: getObjectStorageOptionLabel(
          provider.resilienceOptions,
          plan.resilienceId,
        ),
        classSummary: [classes.hot, classes.cool, classes.archive]
          .filter((label) => label !== "Not used")
          .join(" / "),
        configured,
        standardStorageCost,
        coolStorageCost,
        archiveStorageCost,
        totalStorageCost,
        writeRequestCost,
        readRequestCost,
        listRequestCost,
        transitionRequestCost,
        totalRequestCost,
        coolRetrievalCost,
        archiveRetrievalCost,
        totalRetrievalCost,
        egressCost,
        replicationTransferCost,
        managementCost,
        earlyDeletionCost,
        fixedMonthlyCost,
        amortizedMigrationCost,
        oneTimeMigrationCost,
        monthlyOperatingCost,
        monthlyPlanningCost,
        firstYearCost,
        costPerStoredTb:
          totalStoredGb > 0
            ? monthlyPlanningCost / (totalStoredGb / 1024)
            : 0,
        requestCostPerMillion:
          totalRequests > 0
            ? totalRequestCost / (totalRequests / 1_000_000)
            : 0,
        retrievalCostPerGb:
          totalRetrievedGb > 0
            ? totalRetrievalCost / totalRetrievedGb
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
      primaryStoredGb,
      newDataGb,
      replicatedStoredGb,
      replicatedNewGb,
      totalStoredGb,
      enteredShareTotal,
      standardSharePercent: standardShare * 100,
      coolSharePercent: coolShare * 100,
      archiveSharePercent: archiveShare * 100,
      standardStoredGb,
      coolStoredGb,
      archiveStoredGb,
      totalRequests,
      totalRetrievedGb,
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
    archiveRetrievedGb,
    archiveSharePercent,
    averageStoredDataGb,
    coolRetrievedGb,
    coolSharePercent,
    earlyDeletedDataGb,
    internetEgressGb,
    lifecycleTransitions,
    listRequests,
    monthlyBudget,
    monthlyNewDataGb,
    objectCountMillions,
    plans,
    readRequests,
    replicatedSharePercent,
    selectedPlanId,
    standardSharePercent,
    writeRequests,
  ]);

  const selectedPlanInput =
    plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const selectedProvider = getObjectStorageProvider(
    selectedPlanInput.providerId,
  );
  const selectedClasses = getClassLabels(
    selectedPlanInput,
    selectedProvider,
  );
  const selectedResult = result.selected;
  const selectedCoolEnabled =
    selectedPlanInput.coolClassId !== "not-used";
  const selectedArchiveEnabled =
    selectedPlanInput.archiveClassId !== "not-used";

  const selectedRows: CostRow[] = [
    {
      label: selectedClasses.hot,
      detail: `${formatNumber(result.standardStoredGb)} GB-months`,
      value: selectedResult.standardStorageCost,
      entered:
        selectedPlanInput.standardStoragePrice.trim() !== "",
    },
    {
      label: selectedClasses.cool,
      detail: selectedCoolEnabled
        ? `${formatNumber(result.coolStoredGb)} GB-months`
        : "Cool or infrequent-access tier is not used",
      value: selectedResult.coolStorageCost,
      entered:
        selectedCoolEnabled &&
        selectedPlanInput.coolStoragePrice.trim() !== "",
    },
    {
      label: selectedClasses.archive,
      detail: selectedArchiveEnabled
        ? `${formatNumber(result.archiveStoredGb)} GB-months`
        : "Archive tier is not used",
      value: selectedResult.archiveStorageCost,
      entered:
        selectedArchiveEnabled &&
        selectedPlanInput.archiveStoragePrice.trim() !== "",
    },
    {
      label: "Write, read, list, and transition requests",
      detail: `${formatInteger(result.totalRequests)} monthly operations`,
      value: selectedResult.totalRequestCost,
      entered:
        selectedPlanInput.writePricePerTenThousand.trim() !== "" ||
        selectedPlanInput.readPricePerTenThousand.trim() !== "" ||
        selectedPlanInput.listPricePerTenThousand.trim() !== "" ||
        selectedPlanInput.transitionPricePerTenThousand.trim() !== "",
    },
    {
      label: "Cool and archive retrieval",
      detail: `${formatNumber(result.totalRetrievedGb)} GB retrieved`,
      value: selectedResult.totalRetrievalCost,
      entered:
        (selectedCoolEnabled &&
          selectedPlanInput.coolRetrievalPricePerGb.trim() !== "") ||
        (selectedArchiveEnabled &&
          selectedPlanInput.archiveRetrievalPricePerGb.trim() !== ""),
    },
    {
      label: "Internet or cross-region egress",
      detail: `${formatNumber(toNumber(internetEgressGb))} GB`,
      value: selectedResult.egressCost,
      entered:
        selectedPlanInput.egressPricePerGb.trim() !== "",
    },
    {
      label: "Replication transfer",
      detail: `${formatNumber(result.replicatedNewGb)} GB of new data copied`,
      value: selectedResult.replicationTransferCost,
      entered:
        selectedPlanInput.replicationTransferPricePerGb.trim() !== "",
    },
    {
      label: "Object management",
      detail: `${formatNumber(
        toNumber(objectCountMillions),
      )} million managed objects`,
      value: selectedResult.managementCost,
      entered:
        selectedPlanInput.managementPricePerMillionObjects.trim() !== "",
    },
    {
      label: "Early deletion or minimum-duration charge",
      detail: `${formatNumber(
        toNumber(earlyDeletedDataGb),
      )} GB affected`,
      value: selectedResult.earlyDeletionCost,
      entered:
        selectedPlanInput.earlyDeletionPricePerGb.trim() !== "",
    },
    {
      label: "Fixed monthly services",
      detail:
        "Inventory, analytics, monitoring, support, or other fixed charges",
      value: selectedResult.fixedMonthlyCost,
      entered:
        selectedPlanInput.fixedMonthlyCost.trim() !== "",
    },
    {
      label: "Amortised migration",
      detail: `${formatMoney(
        selectedResult.oneTimeMigrationCost,
      )} spread across ${formatInteger(
        Math.max(
          1,
          toNumber(
            selectedPlanInput.migrationAmortizationMonths,
          ),
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
    plans.find((plan) => plan.id === activeEditorPlanId) ??
    plans[0];
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
              standardStoragePrice: defaultPlan.standardStoragePrice,
              coolStoragePrice: defaultPlan.coolStoragePrice,
              archiveStoragePrice: defaultPlan.archiveStoragePrice,
              writePricePerTenThousand:
                defaultPlan.writePricePerTenThousand,
              readPricePerTenThousand:
                defaultPlan.readPricePerTenThousand,
              listPricePerTenThousand:
                defaultPlan.listPricePerTenThousand,
              transitionPricePerTenThousand:
                defaultPlan.transitionPricePerTenThousand,
              coolRetrievalPricePerGb:
                defaultPlan.coolRetrievalPricePerGb,
              archiveRetrievalPricePerGb:
                defaultPlan.archiveRetrievalPricePerGb,
              egressPricePerGb: defaultPlan.egressPricePerGb,
              replicationTransferPricePerGb:
                defaultPlan.replicationTransferPricePerGb,
              managementPricePerMillionObjects:
                defaultPlan.managementPricePerMillionObjects,
              earlyDeletionPricePerGb:
                defaultPlan.earlyDeletionPricePerGb,
              fixedMonthlyCost: defaultPlan.fixedMonthlyCost,
              oneTimeMigrationCost:
                defaultPlan.oneTimeMigrationCost,
              migrationAmortizationMonths:
                defaultPlan.migrationAmortizationMonths,
            }
          : plan,
      ),
    );
  };

  const reset = () => {
    setAverageStoredDataGb("10240");
    setMonthlyNewDataGb("1000");
    setStandardSharePercent("60");
    setCoolSharePercent("30");
    setArchiveSharePercent("10");
    setReplicatedSharePercent("20");
    setWriteRequests("5000000");
    setReadRequests("30000000");
    setListRequests("1000000");
    setLifecycleTransitions("500000");
    setCoolRetrievedGb("500");
    setArchiveRetrievedGb("100");
    setInternetEgressGb("2000");
    setObjectCountMillions("10");
    setEarlyDeletedDataGb("100");
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
              Object storage pricing depends on stored data, region, redundancy,
              storage class, requests, retrieval, transfer, replication, and
              lifecycle rules. Beeija keeps provider prices editable so you can
              compare the same workload with current pricing.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {plans.map((plan) => {
              const provider = getObjectStorageProvider(plan.providerId);
              const selected = plan.id === activeEditorPlanId;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => openPlanEditor(plan.id)}
                  className={`min-w-0 rounded-lg border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                    selected
                      ? "border-[var(--green)] bg-[#f4fbf6] shadow-sm"
                      : "border-slate-200 bg-white hover:border-[var(--green)]"
                  }`}
                >
                  <span className="block truncate text-base font-semibold text-slate-900">
                    {getProviderDisplay(provider).providerName}
                  </span>
                  <span className="mt-1 block truncate text-sm leading-5 text-slate-600">
                    {getProviderDisplay(provider).serviceName}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <h3 className="text-base font-semibold text-slate-950">
              Shared object storage workload assumptions
            </h3>
            <p className="mt-1 text-base leading-7 text-slate-600">
              Use the same storage volume, tier mix, requests, retrieval, and
              transfer assumptions for every provider so the comparison stays fair.
            </p>

            <div className="mt-3 grid items-start gap-3 sm:grid-cols-2">
              <BeeijaNumberField
                label="Average primary data stored"
                value={averageStoredDataGb}
                onChange={setAverageStoredDataGb}
                suffix="GB"
                helper="Primary data kept during the month."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="New or changed data per month"
                value={monthlyNewDataGb}
                onChange={setMonthlyNewDataGb}
                suffix="GB"
                helper="New data that may be replicated or moved."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Standard or hot storage share"
                value={standardSharePercent}
                onChange={setStandardSharePercent}
                suffix="%"
                helper="Frequently accessed storage share."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Cool or infrequent-access share"
                value={coolSharePercent}
                onChange={setCoolSharePercent}
                suffix="%"
                helper="Lower-access tier share."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Archive storage share"
                value={archiveSharePercent}
                onChange={setArchiveSharePercent}
                suffix="%"
                helper="Long-term archive tier share."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Target monthly storage budget"
                value={monthlyBudget}
                onChange={setMonthlyBudget}
                prefix="$"
                helper="Optional budget comparison."
                sanitizeDecimal
              />
            </div>

            <BeeijaAdvancedSection
              className="mt-4"
              title="Advanced request, retrieval, and transfer assumptions"
              description="Open this when your estimate must include replication, request volume, retrieval, outbound transfer, object-management, or early-deletion assumptions. These inputs stay shared across every provider."
            >
              <div className="grid items-start gap-3 sm:grid-cols-2">
                <BeeijaNumberField
                  label="Data with one additional replicated copy"
                  value={replicatedSharePercent}
                  onChange={setReplicatedSharePercent}
                  suffix="%"
                  helper="Share copied to another location or region."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Write, create, or update requests"
                  value={writeRequests}
                  onChange={setWriteRequests}
                  helper="Monthly write-style operations."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Read or GET requests"
                  value={readRequests}
                  onChange={setReadRequests}
                  helper="Monthly read-style operations."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="List and metadata requests"
                  value={listRequests}
                  onChange={setListRequests}
                  helper="List, inventory, or metadata calls."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Lifecycle transition requests"
                  value={lifecycleTransitions}
                  onChange={setLifecycleTransitions}
                  helper="Objects moved between storage classes."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Data retrieved from cool storage"
                  value={coolRetrievedGb}
                  onChange={setCoolRetrievedGb}
                  suffix="GB"
                  helper="Billable retrieval from lower-access tiers."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Data retrieved or restored from archive"
                  value={archiveRetrievedGb}
                  onChange={setArchiveRetrievedGb}
                  suffix="GB"
                  helper="Archive restore or retrieval volume."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Internet or cross-region data transfer"
                  value={internetEgressGb}
                  onChange={setInternetEgressGb}
                  suffix="GB"
                  helper="Billable outbound or cross-region transfer."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Managed object count"
                  value={objectCountMillions}
                  onChange={setObjectCountMillions}
                  suffix="million"
                  helper="Objects counted for inventory or management."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Data deleted before minimum duration"
                  value={earlyDeletedDataGb}
                  onChange={setEarlyDeletedDataGb}
                  suffix="GB"
                  helper="Data affected by early-deletion rules."
                  sanitizeDecimal
                />
              </div>
            </BeeijaAdvancedSection>
          </div>

          <div className="mt-5 rounded-lg border-l-4 border-[#F2C94C] bg-[#FFFBEA] px-4 py-3 text-sm leading-6 text-slate-700">
            <p className="font-semibold text-slate-950">
              Normalized monthly storage workload
            </p>
            <div className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-2">
              <p>Total stored with replication: {formatNumber(result.totalStoredGb)} GB</p>
              <p>Additional replicated storage: {formatNumber(result.replicatedStoredGb)} GB</p>
              <p>Standard share: {formatNumber(result.standardSharePercent)}%</p>
              <p>Cool share: {formatNumber(result.coolSharePercent)}%</p>
              <p>Archive share: {formatNumber(result.archiveSharePercent)}%</p>
              <p>Entered tier total: {formatNumber(result.enteredShareTotal)}%</p>
            </div>
          </div>

          <div
            className="mt-6 border-t border-slate-200 pt-5"
            aria-label={`${getProviderShortName(selectedProvider)} object storage price inputs`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-950">
                  {getProviderShortName(selectedProvider)} price inputs
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
              Good for {getProviderDisplay(selectedProvider).serviceName} planning with storage
              class rates, request charges, retrieval, transfer, replication,
              and lifecycle cost inputs.
            </p>

            <div className="mt-4">
              <PlanEditor
                key={activeEditorPlan.id}
                plan={activeEditorPlan}
                onChange={(field, value) =>
                  updatePlan(activeEditorPlan.id, field, value)
                }
                onResilienceChange={(resilienceId) =>
                  changeResilience(activeEditorPlan.id, resilienceId)
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
              {getProviderShortName(selectedProvider)} monthly planning cost
            </h2>

            <div className="mt-4 rounded-lg border border-[#d7eadf] bg-white p-4">
              <p className="text-base text-slate-500">
                Estimated monthly cost
              </p>
              <p className="mt-2 truncate text-3xl font-semibold tracking-tight text-[var(--green)]">
                {selectedResult.configured
                  ? formatMoney(selectedResult.monthlyPlanningCost)
                  : "Enter storage prices"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This is a planning estimate before tax, support plans, credits,
                negotiated discounts, minimum billing rules, restore-speed
                premiums, and provider-specific billing adjustments.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <BeeijaResultLine
                label="Storage by class"
                value={
                  selectedResult.configured
                    ? formatMoney(selectedResult.totalStorageCost)
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Requests and lifecycle transitions"
                value={
                  selectedResult.configured
                    ? formatMoney(selectedResult.totalRequestCost)
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Retrieval and restore"
                value={
                  selectedResult.configured
                    ? formatMoney(selectedResult.totalRetrievalCost)
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Transfer and replication"
                value={
                  selectedResult.configured
                    ? formatMoney(
                        selectedResult.egressCost +
                          selectedResult.replicationTransferCost,
                      )
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Management and early deletion"
                value={
                  selectedResult.configured
                    ? formatMoney(
                        selectedResult.managementCost +
                          selectedResult.earlyDeletionCost,
                      )
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Fixed services and migration"
                value={
                  selectedResult.configured
                    ? formatMoney(
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
              Compare configured object storage plans using the same workload assumptions.
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
                    {row.configured
                      ? formatMoney(row.monthlyPlanningCost)
                      : "—"}
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
          </BeeijaAdvancedSection>

          <section className="min-w-0 rounded-lg border border-[#F2C94C]/60 bg-[#FFFBEA] p-4 text-sm leading-6 text-slate-700 shadow-sm sm:p-5">
            <p className="font-semibold text-slate-950">Important</p>
            <p className="mt-1">
              Provider, region, redundancy, and storage-class selections identify
              the configuration only; they do not load or imply a current price.
              Enter current effective rates for the exact selected setup. Blank
              optional price fields are treated as zero.
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
  onResilienceChange,
}: {
  plan: PlanInput;
  onChange: (field: keyof PlanInput, value: string) => void;
  onResilienceChange: (resilienceId: string) => void;
}) {
  const provider = getObjectStorageProvider(plan.providerId);
  const classes = getClassLabels(plan, provider);
  const coolEnabled = plan.coolClassId !== "not-used";
  const archiveEnabled = plan.archiveClassId !== "not-used";

  return (
    <div className="space-y-3">
      <div className="grid items-start gap-3 sm:grid-cols-2">
        <BeeijaSelect
          label="Region or pricing scope"
          value={plan.regionId}
          onChange={(event) =>
            onChange("regionId", event.target.value)
          }
          options={getRegionOptions(provider)}
        />

        <div className="block min-w-0">
          <span className="mb-2 block text-sm font-medium text-gray-700">
            Service or plan name
          </span>
          <div className="flex min-h-12 w-full min-w-0 items-center rounded-xl border border-gray-300 bg-slate-50 px-4 py-3 text-base text-gray-900">
            <span className="truncate">{getProviderDisplay(provider).serviceName}</span>
          </div>
          <span className="mt-1 block text-[11.5px] leading-5 text-slate-500">
            Fixed by the selected provider plan. Edit only the pricing rates below.
          </span>
        </div>

        {plan.regionId === "other" ? (
          <InlineTextField
            label="Exact provider region or location"
            value={plan.customRegion}
            onChange={(value) => onChange("customRegion", value)}
            helper="Use the region name from the provider pricing page."
          />
        ) : null}

        <BeeijaSelect
          label="Location or redundancy setup"
          value={plan.resilienceId}
          onChange={(event) =>
            onResilienceChange(event.target.value)
          }
          options={getCompactOptions(provider.resilienceOptions)}
        />

        <BeeijaSelect
          label="Frequent-access storage class"
          value={plan.hotClassId}
          onChange={(event) =>
            onChange("hotClassId", event.target.value)
          }
          options={getCompactOptions(provider.hotClasses)}
        />

        <BeeijaSelect
          label="Infrequent-access storage class"
          value={plan.coolClassId}
          onChange={(event) =>
            onChange("coolClassId", event.target.value)
          }
          options={getCompactOptions(provider.coolClasses)}
        />

        <BeeijaSelect
          label="Archive storage class"
          value={plan.archiveClassId}
          onChange={(event) =>
            onChange("archiveClassId", event.target.value)
          }
          options={getCompactOptions(
            isAzureArchiveUnsupported(plan)
              ? provider.archiveClasses.filter(
                  (option) => option.value === "not-used",
                )
              : provider.archiveClasses,
          )}
        />
      </div>

      {isAzureArchiveUnsupported(plan) ? (
        <div className="rounded-lg border-l-4 border-[#F2C94C] bg-[#FFFBEA] px-4 py-3 text-sm leading-6 text-gray-700">
          Azure Archive is not available with the selected zone-redundant setup,
          so Archive has been set to Not used.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <BeeijaNumberField
          label="Standard storage price"
          value={plan.standardStoragePrice}
          onChange={(value) =>
            onChange("standardStoragePrice", value)
          }
          prefix="$"
          suffix="/GB-month"
          helper={`${shortenStorageClassLabel(classes.hot)} class.`}
          sanitizeDecimal
        />

        <BeeijaNumberField
          label="Infrequent-access storage price"
          value={plan.coolStoragePrice}
          onChange={(value) =>
            onChange("coolStoragePrice", value)
          }
          prefix="$"
          suffix="/GB-month"
          disabled={!coolEnabled}
          helper={
            coolEnabled
              ? `${shortenStorageClassLabel(classes.cool)} class.`
              : "Set blank or 0 when this tier is not used."
          }
          sanitizeDecimal
        />

        <BeeijaNumberField
          label="Archive storage price"
          value={plan.archiveStoragePrice}
          onChange={(value) =>
            onChange("archiveStoragePrice", value)
          }
          prefix="$"
          suffix="/GB-month"
          disabled={!archiveEnabled}
          helper={
            archiveEnabled
              ? `${shortenStorageClassLabel(classes.archive)} class.`
              : "Set blank or 0 when archive is not used."
          }
          sanitizeDecimal
        />
      </div>

      <BeeijaAdvancedSection
        title="Advanced request, retrieval, and transfer rates"
        description="Open this only when request charges, retrieval, restore, transfer, replication, management, or early-deletion costs apply."
      >
        <div className="grid items-start gap-3 sm:grid-cols-2">
          <BeeijaNumberField
            label="Write operation price"
            value={plan.writePricePerTenThousand}
            onChange={(value) =>
              onChange("writePricePerTenThousand", value)
            }
            prefix="$"
            helper="Per 10,000 write requests."
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Read operation price"
            value={plan.readPricePerTenThousand}
            onChange={(value) =>
              onChange("readPricePerTenThousand", value)
            }
            prefix="$"
            helper="Per 10,000 read requests."
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="List or metadata price"
            value={plan.listPricePerTenThousand}
            onChange={(value) =>
              onChange("listPricePerTenThousand", value)
            }
            prefix="$"
            helper="Per 10,000 list or metadata requests."
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Lifecycle transition price"
            value={plan.transitionPricePerTenThousand}
            onChange={(value) =>
              onChange("transitionPricePerTenThousand", value)
            }
            prefix="$"
            helper="Per 10,000 lifecycle transitions."
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Cool retrieval price"
            value={plan.coolRetrievalPricePerGb}
            onChange={(value) =>
              onChange("coolRetrievalPricePerGb", value)
            }
            prefix="$"
            disabled={!coolEnabled}
            helper="Per GB retrieved from IA or cool storage."
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Archive restore price"
            value={plan.archiveRetrievalPricePerGb}
            onChange={(value) =>
              onChange("archiveRetrievalPricePerGb", value)
            }
            prefix="$"
            disabled={!archiveEnabled}
            helper="Per GB restored or retrieved from archive."
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Egress transfer price"
            value={plan.egressPricePerGb}
            onChange={(value) => onChange("egressPricePerGb", value)}
            prefix="$"
            helper="Per GB of outbound transfer."
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Replication transfer price"
            value={plan.replicationTransferPricePerGb}
            onChange={(value) =>
              onChange("replicationTransferPricePerGb", value)
            }
            prefix="$"
            helper="Per GB copied between regions."
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Object management price"
            value={plan.managementPricePerMillionObjects}
            onChange={(value) =>
              onChange("managementPricePerMillionObjects", value)
            }
            prefix="$"
            helper="Per million managed objects."
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Early deletion charge"
            value={plan.earlyDeletionPricePerGb}
            onChange={(value) =>
              onChange("earlyDeletionPricePerGb", value)
            }
            prefix="$"
            helper="Per GB charged for early deletion."
            sanitizeDecimal
          />
        </div>
      </BeeijaAdvancedSection>

      <BeeijaAdvancedSection
        title="Fixed, migration, and amortized planning costs"
        description="Open only for fixed monthly or one-time migration costs."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <BeeijaNumberField
            label="Fixed monthly services"
            value={plan.fixedMonthlyCost}
            onChange={(value) => onChange("fixedMonthlyCost", value)}
            prefix="$"
            suffix="/month"
            helper="Monthly storage-related services."
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="One-time migration cost"
            value={plan.oneTimeMigrationCost}
            onChange={(value) =>
              onChange("oneTimeMigrationCost", value)
            }
            prefix="$"
            helper="One-time migration cost."
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Migration amortization period"
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
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 text-sm text-gray-500">
          {detail}
        </p>
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
                  Storage
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
                      {row.resilienceLabel}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {row.classSummary}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      {row.configured
                        ? `${row.enteredPriceCount} price inputs entered`
                        : "Enter at least one storage-tier price"}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-gray-900">
                    {row.configured
                      ? formatMoney(row.totalStorageCost)
                      : "—"}
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

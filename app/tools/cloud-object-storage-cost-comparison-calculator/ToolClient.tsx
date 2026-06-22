"use client";

import { useMemo, useState, type ReactNode } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";
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

  return getObjectStorageOptionLabel(provider.regions, plan.regionId);
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
  return `${provider.serviceName} — ${getRegionLabel(plan, provider)}`;
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
    const provider = getObjectStorageProvider(providerId);

    setPlans((current) =>
      current.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              providerId: provider.id,
              regionId: provider.defaults.regionId,
              customRegion: "",
              resilienceId: provider.defaults.resilienceId,
              hotClassId: provider.defaults.hotClassId,
              coolClassId: provider.defaults.coolClassId,
              archiveClassId: provider.defaults.archiveClassId,
            }
          : plan,
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
        providerName: provider.providerName,
        serviceName: provider.serviceName,
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
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter the Shared Object Storage Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Use the same storage, request, retrieval, and transfer workload
            for every provider plan.
          </p>
        </div>

        <FieldSection title="Stored Data and Tier Mix">
          <BeeijaNumberField
            label="Average primary data stored"
            value={averageStoredDataGb}
            onChange={setAverageStoredDataGb}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="New or changed data per month"
            value={monthlyNewDataGb}
            onChange={setMonthlyNewDataGb}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Standard or hot storage share"
            value={standardSharePercent}
            onChange={setStandardSharePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Cool or infrequent-access share"
            value={coolSharePercent}
            onChange={setCoolSharePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Archive storage share"
            value={archiveSharePercent}
            onChange={setArchiveSharePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Data with one additional replicated copy"
            value={replicatedSharePercent}
            onChange={setReplicatedSharePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Requests and Lifecycle Activity">
          <BeeijaNumberField
            label="Write, create, or update requests"
            value={writeRequests}
            onChange={setWriteRequests}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Read or GET requests"
            value={readRequests}
            onChange={setReadRequests}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="List and metadata requests"
            value={listRequests}
            onChange={setListRequests}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Lifecycle transition requests"
            value={lifecycleTransitions}
            onChange={setLifecycleTransitions}
            min="0"
            step="1"
          />
        </FieldSection>

        <FieldSection title="Retrieval, Transfer, and Management">
          <BeeijaNumberField
            label="Data retrieved from cool storage"
            value={coolRetrievedGb}
            onChange={setCoolRetrievedGb}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Data retrieved or restored from archive"
            value={archiveRetrievedGb}
            onChange={setArchiveRetrievedGb}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Internet or cross-region data transfer"
            value={internetEgressGb}
            onChange={setInternetEgressGb}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Managed object count"
            value={objectCountMillions}
            onChange={setObjectCountMillions}
            min="0"
            step="0.1"
            suffix="million"
          />

          <BeeijaNumberField
            label="Data deleted before minimum duration"
            value={earlyDeletedDataGb}
            onChange={setEarlyDeletedDataGb}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Target monthly object storage budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Normalized monthly storage workload
          </p>

          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>
              Total stored with replication:{" "}
              {formatNumber(result.totalStoredGb)} GB
            </p>

            <p>
              Additional replicated storage:{" "}
              {formatNumber(result.replicatedStoredGb)} GB
            </p>

            <p>
              Standard share:{" "}
              {formatNumber(result.standardSharePercent)}%
            </p>

            <p>
              Cool share: {formatNumber(result.coolSharePercent)}%
            </p>

            <p>
              Archive share:{" "}
              {formatNumber(result.archiveSharePercent)}%
            </p>

            <p>
              Entered tier total:{" "}
              {formatNumber(result.enteredShareTotal)}%
            </p>

            <p>
              Monthly operations:{" "}
              {formatInteger(result.totalRequests)}
            </p>

            <p>
              Cool and archive retrieval:{" "}
              {formatNumber(result.totalRetrievedGb)} GB
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-950">
            Select Provider Configurations and Enter Prices
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Choose the provider, region, resilience setup, and storage
            classes. Current prices remain blank so you can enter the exact
            rates for the selected configuration.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {plans.map((plan, index) => (
            <PlanEditor
              key={plan.id}
              planNumber={index + 1}
              plan={plan}
              onChange={(field, value) =>
                updatePlan(plan.id, field, value)
              }
              onProviderChange={(providerId) =>
                changeProvider(plan.id, providerId)
              }
              onResilienceChange={(resilienceId) =>
                changeResilience(plan.id, resilienceId)
              }
            />
          ))}
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
        title="Object Storage Cost Comparison"
        description="Select a plan for a detailed breakdown. Configured plans are ranked by monthly planning cost."
        primaryLabel="Selected monthly planning cost"
        primaryValue={
          selectedResult.configured
            ? formatMoney(selectedResult.monthlyPlanningCost)
            : "Enter storage prices"
        }
        stats={
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultStat
              label="Cost per stored TB"
              value={
                selectedResult.configured
                  ? formatMoney(selectedResult.costPerStoredTb)
                  : "—"
              }
            />

            <ResultStat
              label="Request cost per 1M"
              value={
                selectedResult.configured
                  ? formatMoney(
                      selectedResult.requestCostPerMillion,
                    )
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
                {selectedResult.resilienceLabel}
              </p>
              <p className="mt-1">
                {selectedResult.classSummary}
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
              Configuration:{" "}
              <span className="font-medium text-gray-900">
                {selectedResult.resilienceLabel} ·{" "}
                {selectedResult.classSummary}
              </span>
            </p>

            <p className="mt-2">
              Monthly operating cost:{" "}
              <span className="font-medium text-gray-900">
                {selectedResult.configured
                  ? formatMoney(
                      selectedResult.monthlyOperatingCost,
                    )
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Storage portion:{" "}
              <span className="font-medium text-gray-900">
                {selectedResult.configured
                  ? formatMoney(selectedResult.totalStorageCost)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Retrieval cost per retrieved GB:{" "}
              <span className="font-medium text-gray-900">
                {selectedResult.configured &&
                result.totalRetrievedGb > 0
                  ? formatMoney(
                      selectedResult.retrievalCostPerGb,
                    )
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
                  : "Enter at least one storage-tier price"}
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
                {selectedResult.enteredPriceCount} of 15
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
                    ? "Enter the selected storage prices"
                    : selectedResult.budgetDifference >= 0
                      ? `${formatMoney(
                          selectedResult.budgetDifference,
                        )} remaining`
                      : `${formatMoney(
                          Math.abs(
                            selectedResult.budgetDifference,
                          ),
                        )} over budget`}
              </span>
            </p>
          </div>
        }
        provider="Amazon S3, Microsoft Azure Blob Storage, and Google Cloud Storage"
        excludedCosts="taxes, support, CDN delivery, private connectivity, accelerated transfer, restore-speed premiums, encryption key requests, analytics, legal retention, negotiated credits, and services not entered"
        noticeText="Provider, region, resilience, and storage-class selections identify the configuration only; they do not load or imply a current price. Enter current effective rates for the exact selected setup. The region lists contain commonly used locations plus an Other option and are not intended to replace the providers' authoritative location lists. Blank optional price fields are treated as zero."
      />
    </div>
  );
}

function PlanEditor({
  planNumber,
  plan,
  onChange,
  onProviderChange,
  onResilienceChange,
}: {
  planNumber: number;
  plan: PlanInput;
  onChange: (field: keyof PlanInput, value: string) => void;
  onProviderChange: (providerId: string) => void;
  onResilienceChange: (resilienceId: string) => void;
}) {
  const provider = getObjectStorageProvider(plan.providerId);
  const classes = getClassLabels(plan, provider);
  const coolEnabled = plan.coolClassId !== "not-used";
  const archiveEnabled = plan.archiveClassId !== "not-used";

  const providerOptions = objectStorageProviders.map((item) => ({
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
          label="Object storage provider"
          value={plan.providerId}
          onChange={(event) =>
            onProviderChange(event.target.value)
          }
          options={providerOptions}
        />

        <BeeijaSelect
          label="Region or bucket location"
          value={plan.regionId}
          onChange={(event) =>
            onChange("regionId", event.target.value)
          }
          options={provider.regions}
        />

        {plan.regionId === "other" ? (
          <TextField
            label="Enter the exact provider region or location"
            value={plan.customRegion}
            onChange={(value) => onChange("customRegion", value)}
          />
        ) : null}

        <BeeijaSelect
          label="Location or redundancy setup"
          value={plan.resilienceId}
          onChange={(event) =>
            onResilienceChange(event.target.value)
          }
          options={provider.resilienceOptions}
        />

        <BeeijaSelect
          label="Frequent-access storage class"
          value={plan.hotClassId}
          onChange={(event) =>
            onChange("hotClassId", event.target.value)
          }
          options={provider.hotClasses}
        />

        <BeeijaSelect
          label="Infrequent-access storage class"
          value={plan.coolClassId}
          onChange={(event) =>
            onChange("coolClassId", event.target.value)
          }
          options={provider.coolClasses}
        />

        <BeeijaSelect
          label="Archive storage class"
          value={plan.archiveClassId}
          onChange={(event) =>
            onChange("archiveClassId", event.target.value)
          }
          options={
            isAzureArchiveUnsupported(plan)
              ? provider.archiveClasses.filter(
                  (option) => option.value === "not-used",
                )
              : provider.archiveClasses
          }
        />
      </div>

      {isAzureArchiveUnsupported(plan) ? (
        <div className="mt-5 rounded-xl border-l-4 border-[#F2C94C] bg-[#FFFBEA] px-4 py-3 text-sm text-gray-700">
          Azure Archive is not available with the selected
          zone-redundant setup, so Archive has been set to Not used.
        </div>
      ) : null}

      <div className="mt-7">
        <h4 className="font-semibold text-gray-950">
          Enter Current Prices for This Configuration
        </h4>

        <p className="mt-2 text-sm text-gray-600">
          {getRegionLabel(plan, provider)} ·{" "}
          {getObjectStorageOptionLabel(
            provider.resilienceOptions,
            plan.resilienceId,
          )}
        </p>
      </div>

      <div className="mt-5 grid items-start gap-5 md:grid-cols-2 md:[&>label>span:first-child]:flex md:[&>label>span:first-child]:min-h-[2.7rem] md:[&>label>span:first-child]:items-end">
        <BeeijaNumberField
          label={`${classes.hot} price per GB-month`}
          value={plan.standardStoragePrice}
          onChange={(value) =>
            onChange("standardStoragePrice", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label={
            coolEnabled
              ? `${classes.cool} price per GB-month`
              : "Infrequent-access storage price"
          }
          value={plan.coolStoragePrice}
          onChange={(value) =>
            onChange("coolStoragePrice", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
          disabled={!coolEnabled}
        />

        <BeeijaNumberField
          label={
            archiveEnabled
              ? `${classes.archive} price per GB-month`
              : "Archive storage price"
          }
          value={plan.archiveStoragePrice}
          onChange={(value) =>
            onChange("archiveStoragePrice", value)
          }
          min="0"
          step="0.000001"
          prefix="$"
          disabled={!archiveEnabled}
        />

        <BeeijaNumberField
          label="Write operations per 10,000"
          value={plan.writePricePerTenThousand}
          onChange={(value) =>
            onChange("writePricePerTenThousand", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Read operations per 10,000"
          value={plan.readPricePerTenThousand}
          onChange={(value) =>
            onChange("readPricePerTenThousand", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="List or metadata operations per 10,000"
          value={plan.listPricePerTenThousand}
          onChange={(value) =>
            onChange("listPricePerTenThousand", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Lifecycle transitions per 10,000"
          value={plan.transitionPricePerTenThousand}
          onChange={(value) =>
            onChange("transitionPricePerTenThousand", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label={
            coolEnabled
              ? `${classes.cool} retrieval price per GB`
              : "Cool-tier retrieval price per GB"
          }
          value={plan.coolRetrievalPricePerGb}
          onChange={(value) =>
            onChange("coolRetrievalPricePerGb", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
          disabled={!coolEnabled}
        />

        <BeeijaNumberField
          label={
            archiveEnabled
              ? `${classes.archive} retrieval or restore per GB`
              : "Archive retrieval or restore per GB"
          }
          value={plan.archiveRetrievalPricePerGb}
          onChange={(value) =>
            onChange("archiveRetrievalPricePerGb", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
          disabled={!archiveEnabled}
        />

        <BeeijaNumberField
          label="Effective egress price per GB"
          value={plan.egressPricePerGb}
          onChange={(value) =>
            onChange("egressPricePerGb", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Replication transfer price per GB"
          value={plan.replicationTransferPricePerGb}
          onChange={(value) =>
            onChange("replicationTransferPricePerGb", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Management price per million objects"
          value={plan.managementPricePerMillionObjects}
          onChange={(value) =>
            onChange("managementPricePerMillionObjects", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Early-deletion charge per affected GB"
          value={plan.earlyDeletionPricePerGb}
          onChange={(value) =>
            onChange("earlyDeletionPricePerGb", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Other fixed monthly storage services"
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
      <h3 className="text-lg font-semibold text-gray-950">
        {title}
      </h3>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {children}
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
      <p className="mt-1 font-semibold text-gray-950">
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

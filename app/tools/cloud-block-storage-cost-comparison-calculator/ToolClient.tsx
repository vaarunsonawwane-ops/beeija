"use client";

import {
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

type PlanInput = {
  id: string;
  providerName: string;
  serviceName: string;
  regionLabel: string;
  capacityPricePerGibMonth: string;
  includedIopsPerVolume: string;
  extraIopsPricePerMonth: string;
  includedThroughputPerVolume: string;
  extraThroughputPricePerMonth: string;
  snapshotPricePerGibMonth: string;
  fixedMonthlyCost: string;
  oneTimeMigrationCost: string;
  migrationAmortizationMonths: string;
};

type PlanResult = {
  id: string;
  providerName: string;
  serviceName: string;
  regionLabel: string;
  configured: boolean;
  totalProvisionedCapacityGib: number;
  billableCapacityGibMonths: number;
  totalProvisionedIops: number;
  billableExtraIopsMonths: number;
  totalProvisionedThroughput: number;
  billableExtraThroughputMonths: number;
  billableSnapshotGibMonths: number;
  storageCost: number;
  iopsCost: number;
  throughputCost: number;
  snapshotCost: number;
  fixedMonthlyCost: number;
  monthlyOperatingCost: number;
  amortizedMigrationCost: number;
  monthlyPlanningCost: number;
  oneTimeMigrationCost: number;
  firstYearCost: number;
  costPerVolume: number;
  costPerProvisionedGib: number;
  budgetDifference: number;
  enteredPriceCount: number;
};

type CostRow = {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
};

const HOURS_IN_BILLING_MONTH = 730;

const initialPlans: PlanInput[] = [
  {
    id: "aws-gp3",
    providerName: "Amazon Web Services",
    serviceName: "Amazon EBS gp3",
    regionLabel: "US East (N. Virginia)",
    capacityPricePerGibMonth: "0.08",
    includedIopsPerVolume: "3000",
    extraIopsPricePerMonth: "0.005",
    includedThroughputPerVolume: "125",
    extraThroughputPricePerMonth: "0.06",
    snapshotPricePerGibMonth: "0.05",
    fixedMonthlyCost: "0",
    oneTimeMigrationCost: "0",
    migrationAmortizationMonths: "12",
  },
  {
    id: "azure-premium-v2",
    providerName: "Microsoft Azure",
    serviceName: "Premium SSD v2",
    regionLabel: "East US",
    capacityPricePerGibMonth: "0.081",
    includedIopsPerVolume: "3000",
    extraIopsPricePerMonth: "0.0052",
    includedThroughputPerVolume: "125",
    extraThroughputPricePerMonth: "0.041",
    snapshotPricePerGibMonth: "0.05",
    fixedMonthlyCost: "0",
    oneTimeMigrationCost: "0",
    migrationAmortizationMonths: "12",
  },
  {
    id: "gcp-hyperdisk-balanced",
    providerName: "Google Cloud",
    serviceName: "Hyperdisk Balanced",
    regionLabel: "Iowa (us-central1)",
    capacityPricePerGibMonth: "0.08",
    includedIopsPerVolume: "3000",
    extraIopsPricePerMonth: "0.005",
    includedThroughputPerVolume: "140",
    extraThroughputPricePerMonth: "0.04",
    snapshotPricePerGibMonth: "0.05",
    fixedMonthlyCost: "0",
    oneTimeMigrationCost: "0",
    migrationAmortizationMonths: "12",
  },
  {
    id: "custom",
    providerName: "Custom provider",
    serviceName: "Custom block storage",
    regionLabel: "Your region",
    capacityPricePerGibMonth: "",
    includedIopsPerVolume: "0",
    extraIopsPricePerMonth: "",
    includedThroughputPerVolume: "0",
    extraThroughputPricePerMonth: "",
    snapshotPricePerGibMonth: "",
    fixedMonthlyCost: "0",
    oneTimeMigrationCost: "0",
    migrationAmortizationMonths: "12",
  },
];

function toNumber(value: string) {
  const parsed = Number.parseFloat(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatVisibleMoney(value: number) {
  return formatMoney(value).replace(/,/g, ",\u200B");
}

function formatVisibleNumber(value: number) {
  return formatNumber(value).replace(/,/g, ",\u200B");
}

function formatVisibleInteger(value: number) {
  return formatInteger(value).replace(/,/g, ",\u200B");
}

function countEnteredPrices(plan: PlanInput) {
  return [
    plan.capacityPricePerGibMonth,
    plan.extraIopsPricePerMonth,
    plan.extraThroughputPricePerMonth,
    plan.snapshotPricePerGibMonth,
  ].filter((value) => value.trim() !== "").length;
}

export default function ToolClient() {
  const [volumeCount, setVolumeCount] = useState("4");
  const [capacityPerVolumeGib, setCapacityPerVolumeGib] =
    useState("500");
  const [iopsPerVolume, setIopsPerVolume] = useState("6000");
  const [throughputPerVolume, setThroughputPerVolume] =
    useState("250");
  const [diskHoursPerMonth, setDiskHoursPerMonth] =
    useState("730");
  const [capacityOverheadPercent, setCapacityOverheadPercent] =
    useState("10");
  const [snapshotStoredGib, setSnapshotStoredGib] =
    useState("1000");
  const [snapshotHoursPerMonth, setSnapshotHoursPerMonth] =
    useState("730");
  const [monthlyBudget, setMonthlyBudget] = useState("500");
  const [selectedPlanId, setSelectedPlanId] =
    useState("aws-gp3");
  const [plans, setPlans] = useState<PlanInput[]>(initialPlans);

  const result = useMemo(() => {
    const parsedVolumeCount = Math.max(
      0,
      Math.floor(toNumber(volumeCount)),
    );
    const parsedCapacityPerVolumeGib = toNumber(
      capacityPerVolumeGib,
    );
    const parsedIopsPerVolume = toNumber(iopsPerVolume);
    const parsedThroughputPerVolume = toNumber(
      throughputPerVolume,
    );
    const parsedDiskHours = Math.min(
      HOURS_IN_BILLING_MONTH,
      toNumber(diskHoursPerMonth),
    );
    const parsedSnapshotHours = Math.min(
      HOURS_IN_BILLING_MONTH,
      toNumber(snapshotHoursPerMonth),
    );
    const parsedOverhead =
      toNumber(capacityOverheadPercent) / 100;
    const parsedSnapshotGib = toNumber(snapshotStoredGib);
    const parsedBudget = toNumber(monthlyBudget);

    const totalProvisionedCapacityGib =
      parsedVolumeCount *
      parsedCapacityPerVolumeGib *
      (1 + parsedOverhead);

    const billableCapacityGibMonths =
      totalProvisionedCapacityGib *
      (parsedDiskHours / HOURS_IN_BILLING_MONTH);

    const totalProvisionedIops =
      parsedVolumeCount * parsedIopsPerVolume;

    const totalProvisionedThroughput =
      parsedVolumeCount * parsedThroughputPerVolume;

    const billableSnapshotGibMonths =
      parsedSnapshotGib *
      (parsedSnapshotHours / HOURS_IN_BILLING_MONTH);

    const planResults: PlanResult[] = plans.map((plan) => {
      const capacityRate = toNumber(
        plan.capacityPricePerGibMonth,
      );
      const includedIops = toNumber(
        plan.includedIopsPerVolume,
      );
      const extraIopsRate = toNumber(
        plan.extraIopsPricePerMonth,
      );
      const includedThroughput = toNumber(
        plan.includedThroughputPerVolume,
      );
      const extraThroughputRate = toNumber(
        plan.extraThroughputPricePerMonth,
      );
      const snapshotRate = toNumber(
        plan.snapshotPricePerGibMonth,
      );
      const fixedMonthlyCost = toNumber(
        plan.fixedMonthlyCost,
      );
      const oneTimeMigrationCost = toNumber(
        plan.oneTimeMigrationCost,
      );
      const amortizationMonths = Math.max(
        1,
        toNumber(plan.migrationAmortizationMonths),
      );

      const extraIopsPerVolume = Math.max(
        0,
        parsedIopsPerVolume - includedIops,
      );

      const billableExtraIopsMonths =
        parsedVolumeCount *
        extraIopsPerVolume *
        (parsedDiskHours / HOURS_IN_BILLING_MONTH);

      const extraThroughputPerVolume = Math.max(
        0,
        parsedThroughputPerVolume - includedThroughput,
      );

      const billableExtraThroughputMonths =
        parsedVolumeCount *
        extraThroughputPerVolume *
        (parsedDiskHours / HOURS_IN_BILLING_MONTH);

      const storageCost =
        billableCapacityGibMonths * capacityRate;

      const iopsCost =
        billableExtraIopsMonths * extraIopsRate;

      const throughputCost =
        billableExtraThroughputMonths *
        extraThroughputRate;

      const snapshotCost =
        billableSnapshotGibMonths * snapshotRate;

      const monthlyOperatingCost =
        storageCost +
        iopsCost +
        throughputCost +
        snapshotCost +
        fixedMonthlyCost;

      const amortizedMigrationCost =
        oneTimeMigrationCost / amortizationMonths;

      const monthlyPlanningCost =
        monthlyOperatingCost + amortizedMigrationCost;

      const firstYearCost =
        monthlyOperatingCost * 12 + oneTimeMigrationCost;

      const configured =
        countEnteredPrices(plan) > 0 &&
        plan.capacityPricePerGibMonth.trim() !== "";

      return {
        id: plan.id,
        providerName: plan.providerName,
        serviceName: plan.serviceName,
        regionLabel: plan.regionLabel,
        configured,
        totalProvisionedCapacityGib,
        billableCapacityGibMonths,
        totalProvisionedIops,
        billableExtraIopsMonths,
        totalProvisionedThroughput,
        billableExtraThroughputMonths,
        billableSnapshotGibMonths,
        storageCost,
        iopsCost,
        throughputCost,
        snapshotCost,
        fixedMonthlyCost,
        monthlyOperatingCost,
        amortizedMigrationCost,
        monthlyPlanningCost,
        oneTimeMigrationCost,
        firstYearCost,
        costPerVolume:
          parsedVolumeCount > 0
            ? monthlyOperatingCost / parsedVolumeCount
            : 0,
        costPerProvisionedGib:
          totalProvisionedCapacityGib > 0
            ? monthlyOperatingCost /
              totalProvisionedCapacityGib
            : 0,
        budgetDifference:
          parsedBudget - monthlyPlanningCost,
        enteredPriceCount: countEnteredPrices(plan),
      };
    });

    const configuredPlans = planResults.filter(
      (plan) => plan.configured,
    );

    const rankedPlans = [...configuredPlans].sort(
      (left, right) =>
        left.monthlyPlanningCost -
          right.monthlyPlanningCost ||
        plans.findIndex((plan) => plan.id === left.id) -
          plans.findIndex((plan) => plan.id === right.id),
    );

    const selectedResult =
      planResults.find(
        (plan) => plan.id === selectedPlanId,
      ) ??
      rankedPlans[0] ??
      planResults[0];

    const cheapest = rankedPlans[0] ?? selectedResult;

    return {
      parsedVolumeCount,
      parsedCapacityPerVolumeGib,
      parsedIopsPerVolume,
      parsedThroughputPerVolume,
      parsedDiskHours,
      parsedSnapshotHours,
      parsedOverhead,
      parsedSnapshotGib,
      parsedBudget,
      totalProvisionedCapacityGib,
      billableCapacityGibMonths,
      totalProvisionedIops,
      totalProvisionedThroughput,
      billableSnapshotGibMonths,
      planResults,
      rankedPlans,
      selectedResult,
      cheapest,
      monthlySavingVsSelected: Math.max(
        0,
        selectedResult.monthlyPlanningCost -
          cheapest.monthlyPlanningCost,
      ),
      firstYearSavingVsSelected: Math.max(
        0,
        selectedResult.firstYearCost -
          cheapest.firstYearCost,
      ),
    };
  }, [
    volumeCount,
    capacityPerVolumeGib,
    iopsPerVolume,
    throughputPerVolume,
    diskHoursPerMonth,
    capacityOverheadPercent,
    snapshotStoredGib,
    snapshotHoursPerMonth,
    monthlyBudget,
    selectedPlanId,
    plans,
  ]);

  const selectedPlanOptions: Option[] = plans.map((plan) => ({
    value: plan.id,
    label: `${plan.providerName} — ${plan.serviceName}`,
  }));

  const updatePlan = (
    planId: string,
    field: keyof PlanInput,
    value: string,
  ) => {
    setPlans((currentPlans) =>
      currentPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              [field]: value,
            }
          : plan,
      ),
    );
  };

  const reset = () => {
    setVolumeCount("4");
    setCapacityPerVolumeGib("500");
    setIopsPerVolume("6000");
    setThroughputPerVolume("250");
    setDiskHoursPerMonth("730");
    setCapacityOverheadPercent("10");
    setSnapshotStoredGib("1000");
    setSnapshotHoursPerMonth("730");
    setMonthlyBudget("500");
    setSelectedPlanId("aws-gp3");
    setPlans(initialPlans);
  };

  const selectedResult = result.selectedResult;

  const selectedRows: CostRow[] = [
    {
      label: "Provisioned storage",
      detail: `${formatVisibleNumber(
        selectedResult.billableCapacityGibMonths,
      )} GiB-months`,
      value: selectedResult.storageCost,
      entered:
        plans.find((plan) => plan.id === selectedResult.id)
          ?.capacityPricePerGibMonth.trim() !== "",
    },
    {
      label: "Additional IOPS",
      detail: `${formatVisibleNumber(
        selectedResult.billableExtraIopsMonths,
      )} billable IOPS-months`,
      value: selectedResult.iopsCost,
      entered:
        plans.find((plan) => plan.id === selectedResult.id)
          ?.extraIopsPricePerMonth.trim() !== "",
    },
    {
      label: "Additional throughput",
      detail: `${formatVisibleNumber(
        selectedResult.billableExtraThroughputMonths,
      )} billable MB/s-months`,
      value: selectedResult.throughputCost,
      entered:
        plans.find((plan) => plan.id === selectedResult.id)
          ?.extraThroughputPricePerMonth.trim() !== "",
    },
    {
      label: "Snapshot storage",
      detail: `${formatVisibleNumber(
        selectedResult.billableSnapshotGibMonths,
      )} GiB-months`,
      value: selectedResult.snapshotCost,
      entered:
        plans.find((plan) => plan.id === selectedResult.id)
          ?.snapshotPricePerGibMonth.trim() !== "",
    },
    {
      label: "Other fixed monthly cost",
      detail:
        "Monitoring, backup tooling, support allocation, or other recurring charges",
      value: selectedResult.fixedMonthlyCost,
      entered: true,
    },
  ];

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-semibold text-gray-950">
          Block storage workload
        </h2>

        <p className="mt-3 leading-relaxed text-gray-600">
          Enter one shared storage requirement, then adjust the
          regional rates for each provider plan.
        </p>

        <FieldSection title="Volume capacity and performance">
          <BeeijaNumberField
            label="Number of block storage volumes"
            value={volumeCount}
            onChange={setVolumeCount}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Provisioned capacity per volume"
            value={capacityPerVolumeGib}
            onChange={setCapacityPerVolumeGib}
            min="0"
            step="1"
            suffix="GiB"
          />

          <BeeijaNumberField
            label="Provisioned IOPS per volume"
            value={iopsPerVolume}
            onChange={setIopsPerVolume}
            min="0"
            step="1"
            suffix="IOPS"
          />

          <BeeijaNumberField
            label="Provisioned throughput per volume"
            value={throughputPerVolume}
            onChange={setThroughputPerVolume}
            min="0"
            step="1"
            suffix="MB/s"
          />

          <BeeijaNumberField
            label="Billable disk hours per month"
            value={diskHoursPerMonth}
            onChange={setDiskHoursPerMonth}
            min="0"
            max="730"
            step="1"
            suffix="hours"
          />

          <BeeijaNumberField
            label="Capacity overhead"
            value={capacityOverheadPercent}
            onChange={setCapacityOverheadPercent}
            min="0"
            step="0.1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Snapshots and planning">
          <BeeijaNumberField
            label="Average stored snapshot data"
            value={snapshotStoredGib}
            onChange={setSnapshotStoredGib}
            min="0"
            step="1"
            suffix="GiB"
          />

          <BeeijaNumberField
            label="Billable snapshot hours per month"
            value={snapshotHoursPerMonth}
            onChange={setSnapshotHoursPerMonth}
            min="0"
            max="730"
            step="1"
            suffix="hours"
          />

          <BeeijaNumberField
            label="Monthly planning budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="0.01"
            prefix="$"
          />

          <BeeijaSelect
            label="Plan shown in the main result"
            value={selectedPlanId}
            onChange={(event) =>
              setSelectedPlanId(event.target.value)
            }
            options={selectedPlanOptions}
          />
        </FieldSection>

        <div className="mt-8 rounded-xl border-l-4 border-[var(--yellow)] bg-gray-50 p-5">
          <h3 className="font-semibold text-gray-950">
            Shared workload summary
          </h3>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              Total provisioned capacity:{" "}
              <strong>
                {formatVisibleNumber(
                  result.totalProvisionedCapacityGib,
                )}{" "}
                GiB
              </strong>
            </p>

            <p>
              Billable capacity:{" "}
              <strong>
                {formatVisibleNumber(
                  result.billableCapacityGibMonths,
                )}{" "}
                GiB-months
              </strong>
            </p>

            <p>
              Total provisioned IOPS:{" "}
              <strong>
                {formatVisibleInteger(
                  result.totalProvisionedIops,
                )}
              </strong>
            </p>

            <p>
              Total provisioned throughput:{" "}
              <strong>
                {formatVisibleNumber(
                  result.totalProvisionedThroughput,
                )}{" "}
                MB/s
              </strong>
            </p>

            <p>
              Snapshot storage:{" "}
              <strong>
                {formatVisibleNumber(
                  result.billableSnapshotGibMonths,
                )}{" "}
                GiB-months
              </strong>
            </p>

            <p>
              Disk utilisation period:{" "}
              <strong>
                {formatVisibleNumber(
                  result.parsedDiskHours,
                )}{" "}
                of 730 hours
              </strong>
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {plans.map((plan) => (
            <ProviderPlanCard
              key={plan.id}
              plan={plan}
              onChange={(field, value) =>
                updatePlan(plan.id, field, value)
              }
            />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="beeija-btn-outline"
          >
            Reset values
          </button>
        </div>
      </section>

      <div className="min-w-0">
        <BeeijaCalculatorResultPanel
          title="Block Storage Cost Result"
          description={`${selectedResult.providerName} · ${selectedResult.serviceName} · ${selectedResult.regionLabel}`}
          primaryLabel="Estimated monthly planning cost"
          primaryValue={
            selectedResult.configured
              ? formatVisibleMoney(
                  selectedResult.monthlyPlanningCost,
                )
              : "Enter provider prices"
          }
          provider="AWS EBS gp3, Azure Premium SSD v2, and Google Hyperdisk Balanced representative US-region"
          pricingCheckedDate="29 June 2026"
          excludedCosts="taxes, currency conversion, negotiated discounts, cross-region snapshot transfer, restore operations, burst transactions, replication, encryption add-ons, and services not entered here"
          stats={
            <div className="grid min-w-0 gap-4 sm:grid-cols-3">
              <ResultStat
                label="Monthly operating cost"
                value={
                  selectedResult.configured
                    ? formatVisibleMoney(
                        selectedResult.monthlyOperatingCost,
                      )
                    : "—"
                }
              />

              <ResultStat
                label="Cost per volume"
                value={
                  selectedResult.configured
                    ? formatVisibleMoney(
                        selectedResult.costPerVolume,
                      )
                    : "—"
                }
              />

              <ResultStat
                label="First-year cost"
                value={
                  selectedResult.configured
                    ? formatVisibleMoney(
                        selectedResult.firstYearCost,
                      )
                    : "—"
                }
              />
            </div>
          }
          breakdown={
            <div>
              <h3 className="font-semibold text-gray-950">
                Selected plan breakdown
              </h3>

              <div className="mt-3 space-y-3">
                {selectedRows.map((row) => (
                  <BreakdownRow
                    key={row.label}
                    {...row}
                  />
                ))}
              </div>
            </div>
          }
          totals={
            <div className="space-y-4 text-sm leading-relaxed text-gray-600">
              <ComparisonLine
                label="Lowest configured monthly plan"
                value={`${result.cheapest.providerName} · ${
                  result.cheapest.serviceName
                } · ${formatVisibleMoney(
                  result.cheapest.monthlyPlanningCost,
                )}`}
                ready={result.rankedPlans.length > 0}
              />

              <ComparisonLine
                label="Monthly saving available"
                value={formatVisibleMoney(
                  result.monthlySavingVsSelected,
                )}
                ready={
                  result.rankedPlans.length > 0 &&
                  selectedResult.configured
                }
              />

              <ComparisonLine
                label="First-year saving available"
                value={formatVisibleMoney(
                  result.firstYearSavingVsSelected,
                )}
                ready={
                  result.rankedPlans.length > 0 &&
                  selectedResult.configured
                }
              />

              <ComparisonLine
                label="Monthly budget position"
                value={
                  selectedResult.budgetDifference >= 0
                    ? `${formatVisibleMoney(
                        selectedResult.budgetDifference,
                      )} under budget`
                    : `${formatVisibleMoney(
                        Math.abs(
                          selectedResult.budgetDifference,
                        ),
                      )} over budget`
                }
                ready={
                  selectedResult.configured &&
                  result.parsedBudget > 0
                }
              />
            </div>
          }
        >
          <ComparisonTable rows={result.rankedPlans} />
        </BeeijaCalculatorResultPanel>
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
      <h3 className="font-semibold text-gray-950">
        {title}
      </h3>

      <div className="mt-5 grid min-w-0 gap-5 md:grid-cols-2 md:items-end [&>*]:min-w-0">
        {children}
      </div>
    </div>
  );
}

function ProviderPlanCard({
  plan,
  onChange,
}: {
  plan: PlanInput;
  onChange: (
    field: keyof PlanInput,
    value: string,
  ) => void;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-5">
      <div className="min-w-0">
        <h3 className="break-words font-semibold text-gray-950 [overflow-wrap:anywhere]">
          {plan.providerName}
        </h3>

        <p className="mt-1 break-words text-sm text-gray-600 [overflow-wrap:anywhere]">
          {plan.serviceName}
        </p>
      </div>

      <div className="mt-5 grid min-w-0 gap-5 md:grid-cols-2 md:items-end [&>*]:min-w-0">
        <TextField
          label="Region or pricing scope"
          value={plan.regionLabel}
          onChange={(value) =>
            onChange("regionLabel", value)
          }
        />

        <TextField
          label="Service or storage class"
          value={plan.serviceName}
          onChange={(value) =>
            onChange("serviceName", value)
          }
        />

        <BeeijaNumberField
          label="Storage price per GiB-month"
          value={plan.capacityPricePerGibMonth}
          onChange={(value) =>
            onChange(
              "capacityPricePerGibMonth",
              value,
            )
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Snapshot price per GiB-month"
          value={plan.snapshotPricePerGibMonth}
          onChange={(value) =>
            onChange(
              "snapshotPricePerGibMonth",
              value,
            )
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Included IOPS per volume"
          value={plan.includedIopsPerVolume}
          onChange={(value) =>
            onChange(
              "includedIopsPerVolume",
              value,
            )
          }
          min="0"
          step="1"
          suffix="IOPS"
        />

        <BeeijaNumberField
          label="Additional IOPS price per IOPS-month"
          value={plan.extraIopsPricePerMonth}
          onChange={(value) =>
            onChange(
              "extraIopsPricePerMonth",
              value,
            )
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Included throughput per volume"
          value={
            plan.includedThroughputPerVolume
          }
          onChange={(value) =>
            onChange(
              "includedThroughputPerVolume",
              value,
            )
          }
          min="0"
          step="1"
          suffix="MB/s"
        />

        <BeeijaNumberField
          label="Additional throughput price per MB/s-month"
          value={plan.extraThroughputPricePerMonth}
          onChange={(value) =>
            onChange(
              "extraThroughputPricePerMonth",
              value,
            )
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Other fixed monthly cost"
          value={plan.fixedMonthlyCost}
          onChange={(value) =>
            onChange("fixedMonthlyCost", value)
          }
          min="0"
          step="0.01"
          prefix="$"
        />

        <BeeijaNumberField
          label="One-time migration or setup cost"
          value={plan.oneTimeMigrationCost}
          onChange={(value) =>
            onChange(
              "oneTimeMigrationCost",
              value,
            )
          }
          min="0"
          step="0.01"
          prefix="$"
        />

        <BeeijaNumberField
          label="Migration cost amortisation period"
          value={plan.migrationAmortizationMonths}
          onChange={(value) =>
            onChange(
              "migrationAmortizationMonths",
              value,
            )
          }
          min="1"
          step="1"
          suffix="months"
        />
      </div>
    </section>
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
    <label className="block min-w-0">
      <span className="mb-2 block break-words text-sm font-medium text-gray-700 [overflow-wrap:anywhere]">
        {label}
      </span>

      <input
        type="text"
        value={value}
        onChange={(
          event: ChangeEvent<HTMLInputElement>,
        ) => onChange(event.target.value)}
        className="min-h-12 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition hover:border-gray-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
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
      <p className="break-words text-xs font-medium uppercase tracking-wide text-gray-500 [overflow-wrap:anywhere]">
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
}: CostRow) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="min-w-0 flex-1">
        <p className="break-words font-medium text-gray-900 [overflow-wrap:anywhere]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm text-gray-500 [overflow-wrap:anywhere]">
          {detail}
        </p>
      </div>

      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {entered ? formatVisibleMoney(value) : "—"}
      </p>
    </div>
  );
}

function ComparisonLine({
  label,
  value,
  ready,
}: {
  label: string;
  value: string;
  ready: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4">
      <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
        {label}
      </span>

      <strong className="max-w-[56%] shrink-0 break-words text-right text-gray-950 [overflow-wrap:anywhere]">
        {ready ? value : "Enter provider prices"}
      </strong>
    </div>
  );
}

function ComparisonValue({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-gray-50 px-3 py-3 xl:rounded-none xl:bg-transparent xl:px-0 xl:py-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 xl:hidden">
        {label}
      </p>

      <p
        className={`mt-1 break-words [overflow-wrap:anywhere] xl:mt-0 ${
          emphasis
            ? "font-semibold text-gray-950"
            : "font-medium text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ComparisonTable({
  rows,
}: {
  rows: PlanResult[];
}) {
  return (
    <div className="min-w-0">
      <h3 className="font-semibold text-gray-950">
        Ranked provider comparison
      </h3>

      <div className="mt-3 min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="hidden grid-cols-[minmax(0,1.65fr)_repeat(3,minmax(0,1fr))] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 xl:grid">
          <span>Plan</span>
          <span>Storage</span>
          <span>Monthly total</span>
          <span>First year</span>
        </div>

        <div className="max-h-[36rem] divide-y divide-gray-200 overflow-y-auto overscroll-contain">
          {rows.map((row, index) => (
            <div
              key={row.id}
              className="grid min-w-0 gap-4 px-4 py-4 xl:grid-cols-[minmax(0,1.65fr)_repeat(3,minmax(0,1fr))] xl:items-start"
            >
              <div className="min-w-0">
                <p className="break-words font-medium text-gray-900 [overflow-wrap:anywhere]">
                  {index === 0
                    ? "Lowest configured · "
                    : ""}
                  {row.providerName}
                </p>

                <p className="mt-1 break-words text-gray-600 [overflow-wrap:anywhere]">
                  {row.serviceName}
                </p>

                <p className="mt-1 break-words text-xs text-gray-500 [overflow-wrap:anywhere]">
                  {row.regionLabel} ·{" "}
                  {row.enteredPriceCount} price inputs
                  entered
                </p>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 xl:contents">
                <ComparisonValue
                  label="Storage"
                  value={formatVisibleMoney(
                    row.storageCost,
                  )}
                />

                <ComparisonValue
                  label="Monthly total"
                  value={formatVisibleMoney(
                    row.monthlyPlanningCost,
                  )}
                  emphasis
                />

                <ComparisonValue
                  label="First year"
                  value={formatVisibleMoney(
                    row.firstYearCost,
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

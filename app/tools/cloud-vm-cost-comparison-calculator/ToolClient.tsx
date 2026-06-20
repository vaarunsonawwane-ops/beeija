"use client";

import { useMemo, useState, type ReactNode } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type PlanInput = {
  id: string;
  provider: string;
  planName: string;
  vcpuPerVm: string;
  memoryGbPerVm: string;
  vmHourlyPrice: string;
  commitmentDiscountPercent: string;
  spotSharePercent: string;
  spotDiscountPercent: string;
  osLicenseHourlyPrice: string;
  storagePricePerGbMonth: string;
  snapshotPricePerGbMonth: string;
  egressPricePerGb: string;
  publicIpHourlyPrice: string;
  loadBalancerHourlyPrice: string;
  loadBalancerDataPricePerGb: string;
  fixedMonthlyCost: string;
  upfrontCommitmentCost: string;
  commitmentAmortizationMonths: string;
};

type PlanResult = {
  id: string;
  provider: string;
  planName: string;
  displayName: string;
  configured: boolean;
  vcpuPerVm: number;
  memoryGbPerVm: number;
  totalInstanceHours: number;
  onDemandHours: number;
  spotHours: number;
  onDemandComputeCost: number;
  spotComputeCost: number;
  osLicenseCost: number;
  computeCost: number;
  pureOnDemandComputeCost: number;
  computeSavings: number;
  storageCost: number;
  snapshotCost: number;
  egressCost: number;
  publicIpCost: number;
  loadBalancerHourlyCost: number;
  loadBalancerDataCost: number;
  fixedMonthlyCost: number;
  amortizedCommitmentCost: number;
  upfrontCommitmentCost: number;
  monthlyOperatingCost: number;
  monthlyPlanningCost: number;
  firstYearCost: number;
  costPerInstanceHour: number;
  allInCostPerVcpuHour: number;
  allInCostPerMemoryGbHour: number;
  budgetDifference: number;
  enteredPriceCount: number;
};

type CostRow = {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
};

const initialPlans: PlanInput[] = [
  {
    id: "plan-a",
    provider: "AWS",
    planName: "Amazon EC2 plan",
    vcpuPerVm: "4",
    memoryGbPerVm: "16",
    vmHourlyPrice: "",
    commitmentDiscountPercent: "0",
    spotSharePercent: "0",
    spotDiscountPercent: "0",
    osLicenseHourlyPrice: "",
    storagePricePerGbMonth: "",
    snapshotPricePerGbMonth: "",
    egressPricePerGb: "",
    publicIpHourlyPrice: "",
    loadBalancerHourlyPrice: "",
    loadBalancerDataPricePerGb: "",
    fixedMonthlyCost: "",
    upfrontCommitmentCost: "",
    commitmentAmortizationMonths: "12",
  },
  {
    id: "plan-b",
    provider: "Microsoft Azure",
    planName: "Azure Virtual Machines plan",
    vcpuPerVm: "4",
    memoryGbPerVm: "16",
    vmHourlyPrice: "",
    commitmentDiscountPercent: "0",
    spotSharePercent: "0",
    spotDiscountPercent: "0",
    osLicenseHourlyPrice: "",
    storagePricePerGbMonth: "",
    snapshotPricePerGbMonth: "",
    egressPricePerGb: "",
    publicIpHourlyPrice: "",
    loadBalancerHourlyPrice: "",
    loadBalancerDataPricePerGb: "",
    fixedMonthlyCost: "",
    upfrontCommitmentCost: "",
    commitmentAmortizationMonths: "12",
  },
  {
    id: "plan-c",
    provider: "Google Cloud",
    planName: "Compute Engine plan",
    vcpuPerVm: "4",
    memoryGbPerVm: "16",
    vmHourlyPrice: "",
    commitmentDiscountPercent: "0",
    spotSharePercent: "0",
    spotDiscountPercent: "0",
    osLicenseHourlyPrice: "",
    storagePricePerGbMonth: "",
    snapshotPricePerGbMonth: "",
    egressPricePerGb: "",
    publicIpHourlyPrice: "",
    loadBalancerHourlyPrice: "",
    loadBalancerDataPricePerGb: "",
    fixedMonthlyCost: "",
    upfrontCommitmentCost: "",
    commitmentAmortizationMonths: "12",
  },
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

function displayPlanName(plan: Pick<PlanInput, "provider" | "planName">) {
  const provider = plan.provider.trim() || "Cloud provider";
  const planName = plan.planName.trim() || "VM plan";
  return `${provider} — ${planName}`;
}

export default function ToolClient() {
  const [baseInstances, setBaseInstances] = useState("4");
  const [baseHoursPerDay, setBaseHoursPerDay] = useState("24");
  const [additionalPeakInstances, setAdditionalPeakInstances] =
    useState("4");
  const [peakHoursPerDay, setPeakHoursPerDay] = useState("6");
  const [activeDaysPerMonth, setActiveDaysPerMonth] = useState("30");
  const [capacityOverheadPercent, setCapacityOverheadPercent] =
    useState("10");

  const [persistentStorageGb, setPersistentStorageGb] =
    useState("1000");
  const [snapshotStorageGb, setSnapshotStorageGb] = useState("500");
  const [outboundDataGb, setOutboundDataGb] = useState("2000");
  const [publicIpCount, setPublicIpCount] = useState("4");
  const [loadBalancerCount, setLoadBalancerCount] = useState("1");
  const [loadBalancerDataGb, setLoadBalancerDataGb] =
    useState("2000");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const [plans, setPlans] = useState<PlanInput[]>(initialPlans);
  const [selectedPlanId, setSelectedPlanId] = useState("plan-a");

  const updatePlan = (
    planId: string,
    field: keyof PlanInput,
    value: string,
  ) => {
    setPlans((currentPlans) =>
      currentPlans.map((plan) =>
        plan.id === planId ? { ...plan, [field]: value } : plan,
      ),
    );
  };

  const result = useMemo(() => {
    const baseCount = toNumber(baseInstances);
    const peakCount = toNumber(additionalPeakInstances);
    const baseHours = Math.min(24, toNumber(baseHoursPerDay));
    const peakHours = Math.min(24, toNumber(peakHoursPerDay));
    const activeDays = Math.min(31, toNumber(activeDaysPerMonth));
    const overheadMultiplier =
      1 + clampPercent(capacityOverheadPercent) / 100;

    const rawBaseInstanceHours =
      baseCount * baseHours * activeDays;
    const rawPeakInstanceHours =
      peakCount * peakHours * activeDays;
    const rawInstanceHours =
      rawBaseInstanceHours + rawPeakInstanceHours;
    const totalInstanceHours =
      rawInstanceHours * overheadMultiplier;

    const fullMonthHours = 24 * activeDays;
    const averageRunningInstances =
      fullMonthHours > 0
        ? totalInstanceHours / fullMonthHours
        : 0;

    const persistentGb = toNumber(persistentStorageGb);
    const snapshotGb = toNumber(snapshotStorageGb);
    const egressGb = toNumber(outboundDataGb);
    const ipCount = toNumber(publicIpCount);
    const loadBalancers = toNumber(loadBalancerCount);
    const lbDataGb = toNumber(loadBalancerDataGb);
    const budget = toNumber(monthlyBudget);

    const rows: PlanResult[] = plans.map((plan) => {
      const vmRate = toNumber(plan.vmHourlyPrice);
      const osRate = toNumber(plan.osLicenseHourlyPrice);
      const commitmentDiscount =
        clampPercent(plan.commitmentDiscountPercent) / 100;
      const spotShare =
        clampPercent(plan.spotSharePercent) / 100;
      const spotDiscount =
        clampPercent(plan.spotDiscountPercent) / 100;

      const spotHours = totalInstanceHours * spotShare;
      const onDemandHours = totalInstanceHours - spotHours;

      const onDemandComputeCost =
        onDemandHours * vmRate * (1 - commitmentDiscount);
      const spotComputeCost =
        spotHours * vmRate * (1 - spotDiscount);
      const osLicenseCost = totalInstanceHours * osRate;
      const computeCost =
        onDemandComputeCost + spotComputeCost + osLicenseCost;

      const pureOnDemandComputeCost =
        totalInstanceHours * (vmRate + osRate);
      const computeSavings =
        pureOnDemandComputeCost - computeCost;

      const storageCost =
        persistentGb * toNumber(plan.storagePricePerGbMonth);
      const snapshotCost =
        snapshotGb * toNumber(plan.snapshotPricePerGbMonth);
      const egressCost =
        egressGb * toNumber(plan.egressPricePerGb);

      const publicIpHours = ipCount * fullMonthHours;
      const publicIpCost =
        publicIpHours * toNumber(plan.publicIpHourlyPrice);

      const loadBalancerHours =
        loadBalancers * fullMonthHours;
      const loadBalancerHourlyCost =
        loadBalancerHours *
        toNumber(plan.loadBalancerHourlyPrice);
      const loadBalancerDataCost =
        lbDataGb * toNumber(plan.loadBalancerDataPricePerGb);

      const fixedMonthlyCost = toNumber(plan.fixedMonthlyCost);
      const upfrontCommitmentCost =
        toNumber(plan.upfrontCommitmentCost);
      const amortizationMonths = Math.max(
        1,
        toNumber(plan.commitmentAmortizationMonths),
      );
      const amortizedCommitmentCost =
        upfrontCommitmentCost / amortizationMonths;

      const monthlyOperatingCost =
        computeCost +
        storageCost +
        snapshotCost +
        egressCost +
        publicIpCost +
        loadBalancerHourlyCost +
        loadBalancerDataCost +
        fixedMonthlyCost;

      const monthlyPlanningCost =
        monthlyOperatingCost + amortizedCommitmentCost;

      const firstYearCost =
        monthlyOperatingCost * 12 + upfrontCommitmentCost;

      const vcpu = Math.max(0, toNumber(plan.vcpuPerVm));
      const memoryGb = Math.max(0, toNumber(plan.memoryGbPerVm));

      const enteredPriceCount = [
        plan.vmHourlyPrice,
        plan.osLicenseHourlyPrice,
        plan.storagePricePerGbMonth,
        plan.snapshotPricePerGbMonth,
        plan.egressPricePerGb,
        plan.publicIpHourlyPrice,
        plan.loadBalancerHourlyPrice,
        plan.loadBalancerDataPricePerGb,
        plan.fixedMonthlyCost,
        plan.upfrontCommitmentCost,
      ].filter((value) => value.trim() !== "").length;

      return {
        id: plan.id,
        provider: plan.provider,
        planName: plan.planName,
        displayName: displayPlanName(plan),
        configured: plan.vmHourlyPrice.trim() !== "",
        vcpuPerVm: vcpu,
        memoryGbPerVm: memoryGb,
        totalInstanceHours,
        onDemandHours,
        spotHours,
        onDemandComputeCost,
        spotComputeCost,
        osLicenseCost,
        computeCost,
        pureOnDemandComputeCost,
        computeSavings,
        storageCost,
        snapshotCost,
        egressCost,
        publicIpCost,
        loadBalancerHourlyCost,
        loadBalancerDataCost,
        fixedMonthlyCost,
        amortizedCommitmentCost,
        upfrontCommitmentCost,
        monthlyOperatingCost,
        monthlyPlanningCost,
        firstYearCost,
        costPerInstanceHour:
          totalInstanceHours > 0
            ? monthlyPlanningCost / totalInstanceHours
            : 0,
        allInCostPerVcpuHour:
          totalInstanceHours > 0 && vcpu > 0
            ? monthlyPlanningCost /
              (totalInstanceHours * vcpu)
            : 0,
        allInCostPerMemoryGbHour:
          totalInstanceHours > 0 && memoryGb > 0
            ? monthlyPlanningCost /
              (totalInstanceHours * memoryGb)
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
      rawBaseInstanceHours,
      rawPeakInstanceHours,
      rawInstanceHours,
      totalInstanceHours,
      fullMonthHours,
      averageRunningInstances,
      publicIpHours: ipCount * fullMonthHours,
      loadBalancerHours: loadBalancers * fullMonthHours,
      rows,
      comparisonRows,
      configuredRows,
      selected,
      cheapest,
      hasConfiguredPlan: configuredRows.length > 0,
      monthlySavingVsSelected:
        selected.configured && cheapest
          ? selected.monthlyPlanningCost -
            cheapest.monthlyPlanningCost
          : 0,
      firstYearSavingVsSelected:
        selected.configured && cheapest
          ? selected.firstYearCost - cheapest.firstYearCost
          : 0,
      hasBudget: monthlyBudget.trim() !== "",
      budget,
    };
  }, [
    activeDaysPerMonth,
    additionalPeakInstances,
    baseHoursPerDay,
    baseInstances,
    capacityOverheadPercent,
    loadBalancerCount,
    loadBalancerDataGb,
    monthlyBudget,
    outboundDataGb,
    peakHoursPerDay,
    persistentStorageGb,
    plans,
    publicIpCount,
    selectedPlanId,
    snapshotStorageGb,
  ]);

  const selectedPlanInput =
    plans.find((plan) => plan.id === selectedPlanId) ??
    plans[0];

  const selectedResult = result.selected;

  const selectedRows: CostRow[] = [
    {
      label: "VM compute",
      detail: `${formatNumber(
        selectedResult.onDemandHours,
      )} commitment/on-demand hours + ${formatNumber(
        selectedResult.spotHours,
      )} Spot hours`,
      value: selectedResult.computeCost,
      entered: selectedPlanInput.vmHourlyPrice.trim() !== "",
    },
    {
      label: "Persistent storage",
      detail: `${formatInteger(
        toNumber(persistentStorageGb),
      )} GB-months`,
      value: selectedResult.storageCost,
      entered:
        selectedPlanInput.storagePricePerGbMonth.trim() !== "",
    },
    {
      label: "Snapshot storage",
      detail: `${formatInteger(
        toNumber(snapshotStorageGb),
      )} GB-months`,
      value: selectedResult.snapshotCost,
      entered:
        selectedPlanInput.snapshotPricePerGbMonth.trim() !== "",
    },
    {
      label: "Outbound data transfer",
      detail: `${formatInteger(toNumber(outboundDataGb))} GB`,
      value: selectedResult.egressCost,
      entered: selectedPlanInput.egressPricePerGb.trim() !== "",
    },
    {
      label: "Public IPv4 addresses",
      detail: `${formatInteger(result.publicIpHours)} address-hours`,
      value: selectedResult.publicIpCost,
      entered:
        selectedPlanInput.publicIpHourlyPrice.trim() !== "",
    },
    {
      label: "Load balancer hourly charge",
      detail: `${formatInteger(
        result.loadBalancerHours,
      )} load-balancer hours`,
      value: selectedResult.loadBalancerHourlyCost,
      entered:
        selectedPlanInput.loadBalancerHourlyPrice.trim() !== "",
    },
    {
      label: "Load balancer data processing",
      detail: `${formatInteger(
        toNumber(loadBalancerDataGb),
      )} GB processed`,
      value: selectedResult.loadBalancerDataCost,
      entered:
        selectedPlanInput.loadBalancerDataPricePerGb.trim() !== "",
    },
    {
      label: "Fixed monthly services",
      detail: "Monitoring, backup, security, management, or support allocation",
      value: selectedResult.fixedMonthlyCost,
      entered: selectedPlanInput.fixedMonthlyCost.trim() !== "",
    },
    {
      label: "Amortised upfront commitment",
      detail: `${formatMoney(
        selectedResult.upfrontCommitmentCost,
      )} spread across ${formatInteger(
        Math.max(
          1,
          toNumber(selectedPlanInput.commitmentAmortizationMonths),
        ),
      )} months`,
      value: selectedResult.amortizedCommitmentCost,
      entered:
        selectedPlanInput.upfrontCommitmentCost.trim() !== "",
    },
  ];

  const planOptions = plans.map((plan) => ({
    value: plan.id,
    label: displayPlanName(plan),
  }));

  const reset = () => {
    setBaseInstances("4");
    setBaseHoursPerDay("24");
    setAdditionalPeakInstances("4");
    setPeakHoursPerDay("6");
    setActiveDaysPerMonth("30");
    setCapacityOverheadPercent("10");
    setPersistentStorageGb("1000");
    setSnapshotStorageGb("500");
    setOutboundDataGb("2000");
    setPublicIpCount("4");
    setLoadBalancerCount("1");
    setLoadBalancerDataGb("2000");
    setMonthlyBudget("");
    setPlans(initialPlans);
    setSelectedPlanId("plan-a");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter the Shared VM Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Use the same workload for every plan, then enter current regional
            rates for each provider.
          </p>
        </div>

        <FieldSection title="Compute Runtime">
          <BeeijaNumberField
            label="Base VM count"
            value={baseInstances}
            onChange={setBaseInstances}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Base VM hours per day"
            value={baseHoursPerDay}
            onChange={setBaseHoursPerDay}
            min="0"
            max="24"
            step="0.1"
            suffix="hr"
          />

          <BeeijaNumberField
            label="Additional peak VM count"
            value={additionalPeakInstances}
            onChange={setAdditionalPeakInstances}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Peak VM hours per day"
            value={peakHoursPerDay}
            onChange={setPeakHoursPerDay}
            min="0"
            max="24"
            step="0.1"
            suffix="hr"
          />

          <BeeijaNumberField
            label="Active days per month"
            value={activeDaysPerMonth}
            onChange={setActiveDaysPerMonth}
            min="0"
            max="31"
            step="1"
            suffix="days"
          />

          <BeeijaNumberField
            label="Capacity and deployment overhead"
            value={capacityOverheadPercent}
            onChange={setCapacityOverheadPercent}
            min="0"
            max="500"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Shared Storage and Network Usage">
          <BeeijaNumberField
            label="Total persistent storage"
            value={persistentStorageGb}
            onChange={setPersistentStorageGb}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Total snapshot storage"
            value={snapshotStorageGb}
            onChange={setSnapshotStorageGb}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Outbound data transfer"
            value={outboundDataGb}
            onChange={setOutboundDataGb}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Public IPv4 address count"
            value={publicIpCount}
            onChange={setPublicIpCount}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Load balancer count"
            value={loadBalancerCount}
            onChange={setLoadBalancerCount}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Load balancer data processed"
            value={loadBalancerDataGb}
            onChange={setLoadBalancerDataGb}
            min="0"
            step="1"
            suffix="GB"
          />

          <BeeijaNumberField
            label="Target monthly VM budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Shared monthly workload
          </p>

          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>
              Base instance-hours:{" "}
              {formatNumber(result.rawBaseInstanceHours)}
            </p>

            <p>
              Peak instance-hours:{" "}
              {formatNumber(result.rawPeakInstanceHours)}
            </p>

            <p>
              Instance-hours after overhead:{" "}
              {formatNumber(result.totalInstanceHours)}
            </p>

            <p>
              Average running VM count:{" "}
              {formatNumber(result.averageRunningInstances)}
            </p>

            <p>
              Public IPv4 address-hours:{" "}
              {formatInteger(result.publicIpHours)}
            </p>

            <p>
              Load balancer hours:{" "}
              {formatInteger(result.loadBalancerHours)}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Provider Plan Prices
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            A VM hourly rate is required for a plan to enter the ranked
            comparison. Other price fields are optional.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {plans.map((plan) => (
            <PlanEditor
              key={plan.id}
              plan={plan}
              onChange={(field, value) =>
                updatePlan(plan.id, field, value)
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
        title="Cloud VM Cost Comparison"
        description="Select a plan for the detailed breakdown. Configured plans are ranked by monthly planning cost."
        primaryLabel="Selected monthly planning cost"
        primaryValue={
          selectedResult.configured
            ? formatMoney(selectedResult.monthlyPlanningCost)
            : "Enter VM price"
        }
        stats={
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultStat
              label="Compute cost"
              value={
                selectedResult.configured
                  ? formatMoney(selectedResult.computeCost)
                  : "—"
              }
            />

            <ResultStat
              label="All-in per instance-hour"
              value={
                selectedResult.configured
                  ? formatMoney(selectedResult.costPerInstanceHour)
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
              Pure on-demand compute before entered discounts:{" "}
              <span className="font-medium text-gray-900">
                {selectedResult.configured
                  ? formatMoney(
                      selectedResult.pureOnDemandComputeCost,
                    )
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Estimated compute saving from commitment and Spot mix:{" "}
              <span
                className={`font-semibold ${
                  selectedResult.computeSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {selectedResult.configured
                  ? formatMoney(selectedResult.computeSavings)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              All-in cost per vCPU-hour:{" "}
              <span className="font-medium text-gray-900">
                {selectedResult.configured &&
                selectedResult.vcpuPerVm > 0
                  ? formatMoney(
                      selectedResult.allInCostPerVcpuHour,
                    )
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              All-in cost per memory GB-hour:{" "}
              <span className="font-medium text-gray-900">
                {selectedResult.configured &&
                selectedResult.memoryGbPerVm > 0
                  ? formatMoney(
                      selectedResult.allInCostPerMemoryGbHour,
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
                  : "Enter at least one VM hourly price"}
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
                {selectedResult.enteredPriceCount} of 10
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
                    ? "Enter the selected VM price"
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
        provider="AWS EC2, Microsoft Azure Virtual Machines, Google Compute Engine, or custom cloud VM plans"
        excludedCosts="taxes, support plans, NAT gateways, private connectivity, managed databases, Kubernetes control planes, tiered free allowances, negotiated credits, migration labour, and services not entered"
        noticeText="No provider price is hardcoded. Enter current effective prices for the exact region, machine, operating system, purchase option, currency, and account agreement. Blank optional price fields are treated as zero. Commitment and Spot availability, interruption risk, minimum billing rules, tiered network rates, and provider discounts can change the final bill."
      />
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
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          label="Provider name"
          value={plan.provider}
          onChange={(value) => onChange("provider", value)}
        />

        <TextField
          label="Plan, region, or VM name"
          value={plan.planName}
          onChange={(value) => onChange("planName", value)}
        />

        <BeeijaNumberField
          label="vCPUs per VM"
          value={plan.vcpuPerVm}
          onChange={(value) => onChange("vcpuPerVm", value)}
          min="0"
          step="1"
        />

        <BeeijaNumberField
          label="Memory per VM"
          value={plan.memoryGbPerVm}
          onChange={(value) => onChange("memoryGbPerVm", value)}
          min="0"
          step="0.1"
          suffix="GB"
        />

        <BeeijaNumberField
          label="Current VM compute price per hour"
          value={plan.vmHourlyPrice}
          onChange={(value) => onChange("vmHourlyPrice", value)}
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Commitment or reservation discount"
          value={plan.commitmentDiscountPercent}
          onChange={(value) =>
            onChange("commitmentDiscountPercent", value)
          }
          min="0"
          max="100"
          step="0.1"
          suffix="%"
        />

        <BeeijaNumberField
          label="Instance-hours using Spot capacity"
          value={plan.spotSharePercent}
          onChange={(value) =>
            onChange("spotSharePercent", value)
          }
          min="0"
          max="100"
          step="1"
          suffix="%"
        />

        <BeeijaNumberField
          label="Spot discount from VM base rate"
          value={plan.spotDiscountPercent}
          onChange={(value) =>
            onChange("spotDiscountPercent", value)
          }
          min="0"
          max="100"
          step="0.1"
          suffix="%"
        />

        <BeeijaNumberField
          label="OS or software licence per VM-hour"
          value={plan.osLicenseHourlyPrice}
          onChange={(value) =>
            onChange("osLicenseHourlyPrice", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Persistent storage price per GB-month"
          value={plan.storagePricePerGbMonth}
          onChange={(value) =>
            onChange("storagePricePerGbMonth", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Snapshot price per GB-month"
          value={plan.snapshotPricePerGbMonth}
          onChange={(value) =>
            onChange("snapshotPricePerGbMonth", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Effective outbound data price per GB"
          value={plan.egressPricePerGb}
          onChange={(value) => onChange("egressPricePerGb", value)}
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Public IPv4 price per address-hour"
          value={plan.publicIpHourlyPrice}
          onChange={(value) =>
            onChange("publicIpHourlyPrice", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Load balancer price per hour"
          value={plan.loadBalancerHourlyPrice}
          onChange={(value) =>
            onChange("loadBalancerHourlyPrice", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Load balancer data price per GB"
          value={plan.loadBalancerDataPricePerGb}
          onChange={(value) =>
            onChange("loadBalancerDataPricePerGb", value)
          }
          min="0"
          step="0.0001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Other fixed monthly services"
          value={plan.fixedMonthlyCost}
          onChange={(value) => onChange("fixedMonthlyCost", value)}
          min="0"
          step="1"
          prefix="$"
        />

        <BeeijaNumberField
          label="Upfront commitment or reservation cost"
          value={plan.upfrontCommitmentCost}
          onChange={(value) =>
            onChange("upfrontCommitmentCost", value)
          }
          min="0"
          step="1"
          prefix="$"
        />

        <BeeijaNumberField
          label="Upfront-cost amortisation period"
          value={plan.commitmentAmortizationMonths}
          onChange={(value) =>
            onChange("commitmentAmortizationMonths", value)
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
                  Plan
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Compute
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
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium text-gray-900">
                      {row.configured && index === 0
                        ? "Lowest configured · "
                        : ""}
                      {row.provider || "Cloud provider"}
                    </p>

                    <p className="mt-1 text-gray-600">
                      {row.planName || "VM plan"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {row.configured
                        ? `${row.enteredPriceCount} price inputs entered`
                        : "Enter a VM hourly price"}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-gray-900">
                    {row.configured
                      ? formatMoney(row.computeCost)
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

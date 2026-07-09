"use client";

import { useMemo, useState } from "react";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaResultLine from "@/app/components/BeeijaResultLine";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import {
  formatBeeijaCurrency,
  formatBeeijaNumber,
  parseBeeijaNumber,
} from "@/app/components/BeeijaFormat";

type ProviderId = "aws" | "azure" | "google" | "custom";

type PlanInput = {
  id: ProviderId;
  providerName: string;
  shortName: string;
  serviceName: string;
  regionLabel: string;
  note: string;
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

type WorkloadFields = {
  baseInstances: string;
  baseHoursPerDay: string;
  additionalPeakInstances: string;
  peakHoursPerDay: string;
  activeDaysPerMonth: string;
  capacityOverheadPercent: string;
  persistentStorageGb: string;
  snapshotStorageGb: string;
  outboundDataGb: string;
  publicIpCount: string;
  loadBalancerCount: string;
  loadBalancerDataGb: string;
  monthlyBudget: string;
};

type PlanResult = {
  id: ProviderId;
  providerName: string;
  shortName: string;
  serviceName: string;
  regionLabel: string;
  configured: boolean;
  vcpuPerVm: number;
  memoryGbPerVm: number;
  totalInstanceHours: number;
  onDemandHours: number;
  spotHours: number;
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

type CostSummary = {
  rawBaseInstanceHours: number;
  rawPeakInstanceHours: number;
  totalInstanceHours: number;
  averageRunningInstances: number;
  publicIpHours: number;
  loadBalancerHours: number;
  budget: number;
  hasBudget: boolean;
  rows: PlanResult[];
  activeResult: PlanResult;
  cheapest: PlanResult | null;
};

const HOURS_IN_DAY = 24;
const MAX_DAYS_IN_MONTH = 31;

const defaultWorkload: WorkloadFields = {
  baseInstances: "4",
  baseHoursPerDay: "24",
  additionalPeakInstances: "4",
  peakHoursPerDay: "6",
  activeDaysPerMonth: "30",
  capacityOverheadPercent: "10",
  persistentStorageGb: "1000",
  snapshotStorageGb: "500",
  outboundDataGb: "2000",
  publicIpCount: "4",
  loadBalancerCount: "1",
  loadBalancerDataGb: "2000",
  monthlyBudget: "",
};


const regionOptionsByProvider: Record<ProviderId, string[]> = {
  aws: [
    "US East (N. Virginia)",
    "US East (Ohio)",
    "US West (Oregon)",
    "Europe (Ireland)",
    "Asia Pacific (Mumbai)",
    "Asia Pacific (Singapore)",
  ],
  azure: [
    "East US",
    "West US 2",
    "North Europe",
    "UK South",
    "Central India",
    "Southeast Asia",
  ],
  google: [
    "us-central1",
    "us-east1",
    "europe-west1",
    "asia-south1",
    "asia-southeast1",
    "asia-east1",
  ],
  custom: [
    "Private quote",
    "Custom region",
    "Marketplace quote",
    "Internal chargeback",
    "Your pricing page",
  ],
};

const initialPlans: PlanInput[] = [
  {
    id: "aws",
    providerName: "Amazon Web Services",
    shortName: "AWS",
    serviceName: "Amazon EC2",
    regionLabel: "US East (N. Virginia)",
    note: "Good for EC2 planning with On-Demand, Savings Plans, Spot, EBS, data transfer, public IPv4, and load balancer inputs.",
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
    fixedMonthlyCost: "0",
    upfrontCommitmentCost: "0",
    commitmentAmortizationMonths: "12",
  },
  {
    id: "azure",
    providerName: "Microsoft Azure",
    shortName: "Azure",
    serviceName: "Azure Virtual Machines",
    regionLabel: "East US",
    note: "Good for Azure VM planning with pay-as-you-go, reservations, savings plans, managed disks, bandwidth, IP, and load balancer inputs.",
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
    fixedMonthlyCost: "0",
    upfrontCommitmentCost: "0",
    commitmentAmortizationMonths: "12",
  },
  {
    id: "google",
    providerName: "Google Cloud",
    shortName: "Google",
    serviceName: "Compute Engine",
    regionLabel: "us-central1",
    note: "Good for Compute Engine planning with on-demand, committed-use, Spot VMs, persistent disks, transfer, IP, and load balancer inputs.",
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
    fixedMonthlyCost: "0",
    upfrontCommitmentCost: "0",
    commitmentAmortizationMonths: "12",
  },
  {
    id: "custom",
    providerName: "Custom provider",
    shortName: "Custom",
    serviceName: "Custom cloud VM plan",
    regionLabel: "Your region",
    note: "Good for private quotes, marketplace VM plans, regional resellers, or internal cloud chargeback models.",
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
    fixedMonthlyCost: "0",
    upfrontCommitmentCost: "0",
    commitmentAmortizationMonths: "12",
  },
];

function clampPercent(value: string) {
  return Math.min(100, Math.max(0, parseBeeijaNumber(value)));
}

function hasVmPrice(plan: PlanInput) {
  return plan.vmHourlyPrice.trim() !== "";
}

function countEnteredPrices(plan: PlanInput) {
  return [
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
}

function calculatePlan(
  plan: PlanInput,
  workload: WorkloadFields,
  shared: {
    totalInstanceHours: number;
    publicIpHours: number;
    loadBalancerHours: number;
    persistentStorageGb: number;
    snapshotStorageGb: number;
    outboundDataGb: number;
    loadBalancerDataGb: number;
    budget: number;
  },
): PlanResult {
  const vcpuPerVm = parseBeeijaNumber(plan.vcpuPerVm);
  const memoryGbPerVm = parseBeeijaNumber(plan.memoryGbPerVm);
  const vmHourlyPrice = parseBeeijaNumber(plan.vmHourlyPrice);
  const osLicenseHourlyPrice = parseBeeijaNumber(plan.osLicenseHourlyPrice);
  const commitmentDiscount = clampPercent(plan.commitmentDiscountPercent) / 100;
  const spotShare = clampPercent(plan.spotSharePercent) / 100;
  const spotDiscount = clampPercent(plan.spotDiscountPercent) / 100;
  const spotHours = shared.totalInstanceHours * spotShare;
  const onDemandHours = shared.totalInstanceHours - spotHours;

  const onDemandComputeCost =
    onDemandHours * vmHourlyPrice * (1 - commitmentDiscount);
  const spotComputeCost = spotHours * vmHourlyPrice * (1 - spotDiscount);
  const osLicenseCost = shared.totalInstanceHours * osLicenseHourlyPrice;
  const computeCost = onDemandComputeCost + spotComputeCost + osLicenseCost;
  const pureOnDemandComputeCost =
    shared.totalInstanceHours * (vmHourlyPrice + osLicenseHourlyPrice);
  const computeSavings = pureOnDemandComputeCost - computeCost;
  const storageCost =
    shared.persistentStorageGb * parseBeeijaNumber(plan.storagePricePerGbMonth);
  const snapshotCost =
    shared.snapshotStorageGb * parseBeeijaNumber(plan.snapshotPricePerGbMonth);
  const egressCost =
    shared.outboundDataGb * parseBeeijaNumber(plan.egressPricePerGb);
  const publicIpCost =
    shared.publicIpHours * parseBeeijaNumber(plan.publicIpHourlyPrice);
  const loadBalancerHourlyCost =
    shared.loadBalancerHours * parseBeeijaNumber(plan.loadBalancerHourlyPrice);
  const loadBalancerDataCost =
    shared.loadBalancerDataGb * parseBeeijaNumber(plan.loadBalancerDataPricePerGb);
  const fixedMonthlyCost = parseBeeijaNumber(plan.fixedMonthlyCost);
  const upfrontCommitmentCost = parseBeeijaNumber(plan.upfrontCommitmentCost);
  const commitmentAmortizationMonths = Math.max(
    1,
    parseBeeijaNumber(plan.commitmentAmortizationMonths),
  );
  const amortizedCommitmentCost =
    upfrontCommitmentCost / commitmentAmortizationMonths;
  const monthlyOperatingCost =
    computeCost +
    storageCost +
    snapshotCost +
    egressCost +
    publicIpCost +
    loadBalancerHourlyCost +
    loadBalancerDataCost +
    fixedMonthlyCost;
  const monthlyPlanningCost = monthlyOperatingCost + amortizedCommitmentCost;
  const firstYearCost = monthlyOperatingCost * 12 + upfrontCommitmentCost;

  return {
    id: plan.id,
    providerName: plan.providerName,
    shortName: plan.shortName,
    serviceName: plan.serviceName,
    regionLabel: plan.regionLabel,
    configured: hasVmPrice(plan),
    vcpuPerVm,
    memoryGbPerVm,
    totalInstanceHours: shared.totalInstanceHours,
    onDemandHours,
    spotHours,
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
      shared.totalInstanceHours > 0
        ? monthlyPlanningCost / shared.totalInstanceHours
        : 0,
    allInCostPerVcpuHour:
      shared.totalInstanceHours > 0 && vcpuPerVm > 0
        ? monthlyPlanningCost / (shared.totalInstanceHours * vcpuPerVm)
        : 0,
    allInCostPerMemoryGbHour:
      shared.totalInstanceHours > 0 && memoryGbPerVm > 0
        ? monthlyPlanningCost /
          (shared.totalInstanceHours * memoryGbPerVm)
        : 0,
    budgetDifference: shared.budget - monthlyPlanningCost,
    enteredPriceCount: countEnteredPrices(plan),
  };
}

export default function ToolClient() {
  const [workload, setWorkload] = useState<WorkloadFields>(defaultWorkload);
  const [plans, setPlans] = useState<PlanInput[]>(initialPlans);
  const [activePlanId, setActivePlanId] = useState<ProviderId>("aws");

  const activePlan = plans.find((plan) => plan.id === activePlanId) ?? plans[0];

  const updateWorkload = (field: keyof WorkloadFields, value: string) => {
    setWorkload((current) => ({ ...current, [field]: value }));
  };

  const updatePlan = (field: keyof PlanInput, value: string) => {
    setPlans((current) =>
      current.map((plan) =>
        plan.id === activePlanId ? { ...plan, [field]: value } : plan,
      ),
    );
  };

  const result: CostSummary = useMemo(() => {
    const baseInstances = Math.max(
      0,
      Math.floor(parseBeeijaNumber(workload.baseInstances)),
    );
    const peakInstances = Math.max(
      0,
      Math.floor(parseBeeijaNumber(workload.additionalPeakInstances)),
    );
    const baseHours = Math.min(
      HOURS_IN_DAY,
      parseBeeijaNumber(workload.baseHoursPerDay),
    );
    const peakHours = Math.min(
      HOURS_IN_DAY,
      parseBeeijaNumber(workload.peakHoursPerDay),
    );
    const activeDays = Math.min(
      MAX_DAYS_IN_MONTH,
      parseBeeijaNumber(workload.activeDaysPerMonth),
    );
    const overheadMultiplier =
      1 + clampPercent(workload.capacityOverheadPercent) / 100;

    const rawBaseInstanceHours = baseInstances * baseHours * activeDays;
    const rawPeakInstanceHours = peakInstances * peakHours * activeDays;
    const totalInstanceHours =
      (rawBaseInstanceHours + rawPeakInstanceHours) * overheadMultiplier;
    const fullMonthHours = HOURS_IN_DAY * activeDays;
    const averageRunningInstances =
      fullMonthHours > 0 ? totalInstanceHours / fullMonthHours : 0;
    const publicIpHours =
      Math.max(0, Math.floor(parseBeeijaNumber(workload.publicIpCount))) *
      fullMonthHours;
    const loadBalancerHours =
      Math.max(0, Math.floor(parseBeeijaNumber(workload.loadBalancerCount))) *
      fullMonthHours;
    const budget = parseBeeijaNumber(workload.monthlyBudget);

    const shared = {
      totalInstanceHours,
      publicIpHours,
      loadBalancerHours,
      persistentStorageGb: parseBeeijaNumber(workload.persistentStorageGb),
      snapshotStorageGb: parseBeeijaNumber(workload.snapshotStorageGb),
      outboundDataGb: parseBeeijaNumber(workload.outboundDataGb),
      loadBalancerDataGb: parseBeeijaNumber(workload.loadBalancerDataGb),
      budget,
    };

    const rows = plans.map((plan) => calculatePlan(plan, workload, shared));
    const activeResult =
      rows.find((row) => row.id === activePlanId) ?? rows[0];
    const cheapest =
      [...rows]
        .filter((row) => row.configured)
        .sort((a, b) => a.monthlyPlanningCost - b.monthlyPlanningCost)[0] ??
      null;

    return {
      rawBaseInstanceHours,
      rawPeakInstanceHours,
      totalInstanceHours,
      averageRunningInstances,
      publicIpHours,
      loadBalancerHours,
      budget,
      hasBudget: workload.monthlyBudget.trim() !== "",
      rows,
      activeResult,
      cheapest,
    };
  }, [activePlanId, plans, workload]);

  const activeResult = result.activeResult;
  const activeConfigured = activeResult.configured;
  const resetActivePlanRates = () => {
    setPlans((current) =>
      current.map((plan) => {
        if (plan.id !== activePlanId) return plan;
        const defaultPlan =
          initialPlans.find((initialPlan) => initialPlan.id === activePlanId) ??
          plan;

        return {
          ...plan,
          vmHourlyPrice: defaultPlan.vmHourlyPrice,
          commitmentDiscountPercent: defaultPlan.commitmentDiscountPercent,
          spotSharePercent: defaultPlan.spotSharePercent,
          spotDiscountPercent: defaultPlan.spotDiscountPercent,
          osLicenseHourlyPrice: defaultPlan.osLicenseHourlyPrice,
          storagePricePerGbMonth: defaultPlan.storagePricePerGbMonth,
          snapshotPricePerGbMonth: defaultPlan.snapshotPricePerGbMonth,
          egressPricePerGb: defaultPlan.egressPricePerGb,
          publicIpHourlyPrice: defaultPlan.publicIpHourlyPrice,
          loadBalancerHourlyPrice: defaultPlan.loadBalancerHourlyPrice,
          loadBalancerDataPricePerGb: defaultPlan.loadBalancerDataPricePerGb,
          fixedMonthlyCost: defaultPlan.fixedMonthlyCost,
          upfrontCommitmentCost: defaultPlan.upfrontCommitmentCost,
          commitmentAmortizationMonths:
            defaultPlan.commitmentAmortizationMonths,
        };
      }),
    );
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
              VM pricing depends on region, machine family, operating system,
              purchase option, storage, network traffic, public IPs, and load
              balancer usage. Beeija keeps rates editable so you can copy the
              current numbers from official pricing pages.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {plans.map((plan) => {
              const selected = plan.id === activePlanId;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setActivePlanId(plan.id)}
                  className={`min-w-0 rounded-lg border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                    selected
                      ? "border-[var(--green)] bg-[#f4fbf6] shadow-sm"
                      : "border-slate-200 bg-white hover:border-[var(--green)]"
                  }`}
                >
                  <span className="block truncate text-base font-semibold text-slate-900">
                    {plan.providerName}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-slate-600">
                    {plan.serviceName}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <h3 className="text-base font-semibold text-slate-950">
              Shared VM workload assumptions
            </h3>
            <p className="mt-1 text-base leading-7 text-slate-600">
              Use the same workload for every provider so the comparison stays
              fair.
            </p>
            <div className="mt-3 grid items-start gap-3 sm:grid-cols-2">
              <BeeijaNumberField
                label="Base VM count"
                value={workload.baseInstances}
                onChange={(value) => updateWorkload("baseInstances", value)}
                helper="Always-on or regular instances."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Base VM hours per day"
                value={workload.baseHoursPerDay}
                onChange={(value) => updateWorkload("baseHoursPerDay", value)}
                suffix="hours"
                helper="Use 24 for always-on VMs."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Additional peak VM count"
                value={workload.additionalPeakInstances}
                onChange={(value) =>
                  updateWorkload("additionalPeakInstances", value)
                }
                helper="Extra instances for peak load."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Peak VM hours per day"
                value={workload.peakHoursPerDay}
                onChange={(value) => updateWorkload("peakHoursPerDay", value)}
                suffix="hours"
                helper="Daily peak/autoscaling window."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Active days per month"
                value={workload.activeDaysPerMonth}
                onChange={(value) => updateWorkload("activeDaysPerMonth", value)}
                suffix="days"
                helper="Use 30 for monthly planning."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Capacity and deployment overhead"
                value={workload.capacityOverheadPercent}
                onChange={(value) =>
                  updateWorkload("capacityOverheadPercent", value)
                }
                suffix="%"
                helper="Headroom for scaling and deployment overlap."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Target monthly VM budget"
                value={workload.monthlyBudget}
                onChange={(value) => updateWorkload("monthlyBudget", value)}
                prefix="$"
                helper="Optional budget comparison."
                sanitizeDecimal
              />
            </div>

            <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <summary className="cursor-pointer text-sm font-semibold text-slate-950">
                Storage, network, and optional service assumptions
              </summary>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Open this when your VM estimate must include storage,
                snapshots, outbound transfer, public IPv4, or load balancer
                usage. These inputs stay shared across every provider.
              </p>
              <div className="mt-3 grid items-start gap-3 sm:grid-cols-2">
                <BeeijaNumberField
                  label="Persistent storage"
                  value={workload.persistentStorageGb}
                  onChange={(value) =>
                    updateWorkload("persistentStorageGb", value)
                  }
                  suffix="GB"
                  helper="Total provisioned disk capacity."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Snapshot storage"
                  value={workload.snapshotStorageGb}
                  onChange={(value) => updateWorkload("snapshotStorageGb", value)}
                  suffix="GB"
                  helper="Backup/snapshot storage retained."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Outbound data transfer"
                  value={workload.outboundDataGb}
                  onChange={(value) => updateWorkload("outboundDataGb", value)}
                  suffix="GB"
                  helper="Internet egress or billable outbound transfer."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Public IPv4 address count"
                  value={workload.publicIpCount}
                  onChange={(value) => updateWorkload("publicIpCount", value)}
                  helper="Billable public IPv4 addresses."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Load balancer count"
                  value={workload.loadBalancerCount}
                  onChange={(value) => updateWorkload("loadBalancerCount", value)}
                  helper="Optional load balancers for the VM workload."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Load balancer data processed"
                  value={workload.loadBalancerDataGb}
                  onChange={(value) => updateWorkload("loadBalancerDataGb", value)}
                  suffix="GB"
                  helper="Traffic processed by load balancers."
                  sanitizeDecimal
                />
              </div>
            </details>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-950">
                  {activePlan.shortName} price inputs
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
              {activePlan.note}
            </p>

            <div className="mt-4">
              <BeeijaSelect
                label="Region or pricing page scope"
                name="regionLabel"
                value={activePlan.regionLabel}
                onChange={(event) => updatePlan("regionLabel", event.target.value)}
                options={regionOptionsByProvider[activePlan.id].map((region) => ({
                  label: region,
                  value: region,
                }))}
              />
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Select the same region or pricing scope you are checking on the
                official provider calculator. Prices are still entered manually
                below.
              </p>
            </div>

            <div className="mt-4 grid items-start gap-3 sm:grid-cols-2">
              <BeeijaNumberField
                label="vCPUs per VM"
                value={activePlan.vcpuPerVm}
                onChange={(value) => updatePlan("vcpuPerVm", value)}
                helper="Used for all-in vCPU-hour result."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Memory per VM"
                value={activePlan.memoryGbPerVm}
                onChange={(value) => updatePlan("memoryGbPerVm", value)}
                suffix="GB"
                helper="Used for memory GB-hour result."
                sanitizeDecimal
              />
              <BeeijaNumberField
                label="Current VM compute price per hour"
                value={activePlan.vmHourlyPrice}
                onChange={(value) => updatePlan("vmHourlyPrice", value)}
                prefix="$"
                helper="Required for this provider to show a real estimate."
                sanitizeDecimal
              />
            </div>

            <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <summary className="cursor-pointer text-sm font-semibold text-slate-950">
                Optional discounts, storage, network, and commitment rates
              </summary>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Open this when your estimate needs commitment discounts, Spot
                capacity, OS licence cost, storage, public IPs, load balancers,
                fixed monthly services, or upfront reservation cost.
              </p>
              <div className="mt-3 grid items-start gap-3 sm:grid-cols-2">
                <BeeijaNumberField
                  label="Commitment or reservation discount"
                  value={activePlan.commitmentDiscountPercent}
                  onChange={(value) =>
                    updatePlan("commitmentDiscountPercent", value)
                  }
                  suffix="%"
                  helper="Applies to non-Spot compute share."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Instance-hours using Spot capacity"
                  value={activePlan.spotSharePercent}
                  onChange={(value) => updatePlan("spotSharePercent", value)}
                  suffix="%"
                  helper="Share of instance-hours planned as Spot/preemptible."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Spot discount from VM base rate"
                  value={activePlan.spotDiscountPercent}
                  onChange={(value) => updatePlan("spotDiscountPercent", value)}
                  suffix="%"
                  helper="Use your effective Spot/preemptible discount."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="OS or software licence per VM-hour"
                  value={activePlan.osLicenseHourlyPrice}
                  onChange={(value) => updatePlan("osLicenseHourlyPrice", value)}
                  prefix="$"
                  helper="Set 0 if included or not applicable."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Persistent storage price per GB-month"
                  value={activePlan.storagePricePerGbMonth}
                  onChange={(value) =>
                    updatePlan("storagePricePerGbMonth", value)
                  }
                  prefix="$"
                  helper="Disk/storage price for the selected class."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Snapshot price per GB-month"
                  value={activePlan.snapshotPricePerGbMonth}
                  onChange={(value) =>
                    updatePlan("snapshotPricePerGbMonth", value)
                  }
                  prefix="$"
                  helper="Backup or snapshot storage price."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Outbound data price per GB"
                  value={activePlan.egressPricePerGb}
                  onChange={(value) => updatePlan("egressPricePerGb", value)}
                  prefix="$"
                  helper="Internet egress or effective outbound transfer rate."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Public IPv4 price per address-hour"
                  value={activePlan.publicIpHourlyPrice}
                  onChange={(value) => updatePlan("publicIpHourlyPrice", value)}
                  prefix="$"
                  helper="Set 0 if not billed separately."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Load balancer price per hour"
                  value={activePlan.loadBalancerHourlyPrice}
                  onChange={(value) =>
                    updatePlan("loadBalancerHourlyPrice", value)
                  }
                  prefix="$"
                  helper="Optional if the workload uses load balancers."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Load balancer data price per GB"
                  value={activePlan.loadBalancerDataPricePerGb}
                  onChange={(value) =>
                    updatePlan("loadBalancerDataPricePerGb", value)
                  }
                  prefix="$"
                  helper="Set 0 if included or not applicable."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Other fixed monthly services"
                  value={activePlan.fixedMonthlyCost}
                  onChange={(value) => updatePlan("fixedMonthlyCost", value)}
                  prefix="$"
                  helper="Monitoring, backup, security, support allocation."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Upfront commitment or reservation cost"
                  value={activePlan.upfrontCommitmentCost}
                  onChange={(value) =>
                    updatePlan("upfrontCommitmentCost", value)
                  }
                  prefix="$"
                  helper="Optional upfront cost to spread across months."
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Upfront-cost amortisation period"
                  value={activePlan.commitmentAmortizationMonths}
                  onChange={(value) =>
                    updatePlan("commitmentAmortizationMonths", value)
                  }
                  suffix="months"
                  helper="Used only when upfront cost is entered."
                  sanitizeDecimal
                />
              </div>
            </details>
          </div>
        </section>

        <aside className="min-w-0 space-y-4">
          <section className="min-w-0 rounded-lg border border-slate-200 bg-[#f8fcfa] p-4 shadow-sm sm:p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--green)]">
              Estimate summary
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {activePlan.shortName} monthly planning cost
            </h2>

            <div className="mt-4 rounded-lg border border-[#d7eadf] bg-white p-4">
              <p className="text-base text-slate-500">
                Estimated monthly cost
              </p>
              <p className="mt-2 truncate text-3xl font-semibold tracking-tight text-[var(--green)]">
                {activeConfigured
                  ? formatBeeijaCurrency(activeResult.monthlyPlanningCost)
                  : "Enter VM price"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This is a planning estimate before tax, support plans, credits,
                committed-use rules, currency conversion, account agreements,
                and provider-specific billing rules.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <BeeijaResultLine
                label="Compute and OS licence"
                value={
                  activeConfigured
                    ? formatBeeijaCurrency(activeResult.computeCost)
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Storage and snapshots"
                value={
                  activeConfigured
                    ? formatBeeijaCurrency(
                        activeResult.storageCost + activeResult.snapshotCost,
                      )
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Outbound transfer"
                value={
                  activeConfigured
                    ? formatBeeijaCurrency(activeResult.egressCost)
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Public IPv4 addresses"
                value={
                  activeConfigured
                    ? formatBeeijaCurrency(activeResult.publicIpCost)
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Load balancer usage"
                value={
                  activeConfigured
                    ? formatBeeijaCurrency(
                        activeResult.loadBalancerHourlyCost +
                          activeResult.loadBalancerDataCost,
                      )
                    : "—"
                }
              />
              <BeeijaResultLine
                label="Fixed services and commitments"
                value={
                  activeConfigured
                    ? formatBeeijaCurrency(
                        activeResult.fixedMonthlyCost +
                          activeResult.amortizedCommitmentCost,
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
              Enter VM hourly rates for each provider, then compare totals using
              the same workload assumptions.
            </p>

            <div className="mt-4 space-y-2">
              {result.rows.map((row) => {
                const selected = row.id === activePlanId;

                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setActivePlanId(row.id)}
                    className={`grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border px-3 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                      selected
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
                        ? formatBeeijaCurrency(row.monthlyPlanningCost)
                        : "—"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <details className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <summary className="cursor-pointer text-base font-semibold text-slate-950">
              Calculation details
            </summary>
            <div className="mt-4 space-y-2">
              <BeeijaResultLine
                label="Base instance-hours"
                value={formatBeeijaNumber(result.rawBaseInstanceHours)}
                muted
              />
              <BeeijaResultLine
                label="Peak instance-hours"
                value={formatBeeijaNumber(result.rawPeakInstanceHours)}
                muted
              />
              <BeeijaResultLine
                label="Instance-hours after overhead"
                value={formatBeeijaNumber(result.totalInstanceHours)}
                muted
              />
              <BeeijaResultLine
                label="Average running VM count"
                value={formatBeeijaNumber(result.averageRunningInstances)}
                muted
              />
              <BeeijaResultLine
                label="Cost per instance-hour"
                value={
                  activeConfigured
                    ? formatBeeijaCurrency(activeResult.costPerInstanceHour)
                    : "—"
                }
                muted
              />
              <BeeijaResultLine
                label="All-in cost per vCPU-hour"
                value={
                  activeConfigured && activeResult.vcpuPerVm > 0
                    ? formatBeeijaCurrency(activeResult.allInCostPerVcpuHour)
                    : "—"
                }
                muted
              />
              <BeeijaResultLine
                label="All-in cost per memory GB-hour"
                value={
                  activeConfigured && activeResult.memoryGbPerVm > 0
                    ? formatBeeijaCurrency(
                        activeResult.allInCostPerMemoryGbHour,
                      )
                    : "—"
                }
                muted
              />
              <BeeijaResultLine
                label="First-year planning cost"
                value={
                  activeConfigured
                    ? formatBeeijaCurrency(activeResult.firstYearCost)
                    : "—"
                }
                muted
              />
              <BeeijaResultLine
                label="Estimated compute saving"
                value={
                  activeConfigured
                    ? formatBeeijaCurrency(activeResult.computeSavings)
                    : "—"
                }
                muted
              />
              <BeeijaResultLine
                label="Budget status"
                value={
                  !result.hasBudget
                    ? "Add budget"
                    : !activeConfigured
                      ? "Enter VM price"
                      : activeResult.budgetDifference >= 0
                        ? `${formatBeeijaCurrency(
                            activeResult.budgetDifference,
                          )} remaining`
                        : `${formatBeeijaCurrency(
                            Math.abs(activeResult.budgetDifference),
                          )} over budget`
                }
                muted
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Beeija keeps detailed calculations collapsed so the main estimate
              stays readable. For purchase decisions, compare the same inputs in
              the official provider calculator for your exact region, OS, and
              account terms.
            </p>
          </details>

          <div className="rounded-lg border border-[var(--yellow)] bg-[#fffdf3] p-4 text-base leading-7 text-amber-900">
            <strong>* Important:</strong> Current VM prices can vary by region,
            instance family, operating system, CPU architecture, storage class,
            transfer tier, commitment term, tax, discounts, credits, and account
            agreement. Use this as a planning estimate, not a final bill or
            official quote.
          </div>
        </aside>
      </div>
    </div>
  );
}

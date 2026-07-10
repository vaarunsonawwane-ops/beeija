"use client";

import { useMemo, useState } from "react";
import BeeijaAdvancedSection from "@/app/components/BeeijaAdvancedSection";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaResultLine from "@/app/components/BeeijaResultLine";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import {
  formatBeeijaCurrency,
  formatBeeijaNumber,
  parseBeeijaNumber,
} from "@/app/components/BeeijaFormat";

type GatewayPricingMode = "per-gateway" | "per-instance-capped";
type PlanId = "aws-nat-gateway" | "azure-nat-gateway" | "google-cloud-nat" | "custom";

type PlanInput = {
  id: PlanId;
  providerName: string;
  shortName: string;
  serviceName: string;
  regionLabel: string;
  note: string;
  gatewayPricingMode: GatewayPricingMode;
  gatewayHourlyRate: string;
  perInstanceHourlyRate: string;
  instanceThresholdPerGateway: string;
  cappedGatewayHourlyRate: string;
  dataProcessingRatePerGib: string;
  publicIpHourlyRate: string;
  internetEgressRatePerGib: string;
  crossZoneTransferRatePerGib: string;
  flowLogsMonthlyCost: string;
  fixedMonthlyCost: string;
  oneTimeMigrationCost: string;
  migrationAmortizationMonths: string;
};

type WorkloadFields = {
  gatewayCount: string;
  activeHoursPerMonth: string;
  protectedInstanceCount: string;
  publicIpCount: string;
  outboundProcessedGib: string;
  returnProcessedGib: string;
  internetEgressGib: string;
  crossZoneTransferGib: string;
  includeFlowLogs: "no" | "yes";
  monthlyBudget: string;
};

type PlanResult = {
  id: PlanId;
  providerName: string;
  shortName: string;
  serviceName: string;
  regionLabel: string;
  configured: boolean;
  gatewayHours: number;
  processedTrafficGib: number;
  publicIpHours: number;
  gatewayCost: number;
  dataProcessingCost: number;
  publicIpCost: number;
  internetEgressCost: number;
  crossZoneTransferCost: number;
  flowLogsCost: number;
  fixedMonthlyCost: number;
  monthlyOperatingCost: number;
  amortizedMigrationCost: number;
  monthlyPlanningCost: number;
  firstYearCost: number;
  costPerGateway: number;
  costPerProcessedGib: number;
  budgetDifference: number;
};

const HOURS_IN_PLANNING_MONTH = 730;

const defaultWorkload: WorkloadFields = {
  gatewayCount: "2",
  activeHoursPerMonth: "730",
  protectedInstanceCount: "24",
  publicIpCount: "2",
  outboundProcessedGib: "1000",
  returnProcessedGib: "300",
  internetEgressGib: "700",
  crossZoneTransferGib: "0",
  includeFlowLogs: "no",
  monthlyBudget: "250",
};

const initialPlans: PlanInput[] = [
  {
    id: "aws-nat-gateway",
    providerName: "Amazon Web Services",
    shortName: "AWS",
    serviceName: "AWS NAT Gateway",
    regionLabel: "US East (Ohio)",
    note: "Good for AWS NAT Gateway planning with hourly gateway runtime, data processing, public IPv4, transfer, and flow-log inputs.",
    gatewayPricingMode: "per-gateway",
    gatewayHourlyRate: "0.045",
    perInstanceHourlyRate: "0",
    instanceThresholdPerGateway: "0",
    cappedGatewayHourlyRate: "0",
    dataProcessingRatePerGib: "0.045",
    publicIpHourlyRate: "0.005",
    internetEgressRatePerGib: "",
    crossZoneTransferRatePerGib: "",
    flowLogsMonthlyCost: "0",
    fixedMonthlyCost: "0",
    oneTimeMigrationCost: "0",
    migrationAmortizationMonths: "12",
  },
  {
    id: "azure-nat-gateway",
    providerName: "Microsoft Azure",
    shortName: "Azure",
    serviceName: "Azure NAT Gateway StandardV2",
    regionLabel: "East US",
    note: "Good for Azure NAT Gateway planning with gateway runtime, processed data, public IP pricing, outbound transfer, and logging assumptions.",
    gatewayPricingMode: "per-gateway",
    gatewayHourlyRate: "0.045",
    perInstanceHourlyRate: "0",
    instanceThresholdPerGateway: "0",
    cappedGatewayHourlyRate: "0",
    dataProcessingRatePerGib: "0.045",
    publicIpHourlyRate: "0.005",
    internetEgressRatePerGib: "",
    crossZoneTransferRatePerGib: "",
    flowLogsMonthlyCost: "4",
    fixedMonthlyCost: "0",
    oneTimeMigrationCost: "0",
    migrationAmortizationMonths: "12",
  },
  {
    id: "google-cloud-nat",
    providerName: "Google Cloud",
    shortName: "Google",
    serviceName: "Cloud NAT Public NAT",
    regionLabel: "Iowa (us-central1)",
    note: "Good for Google Cloud NAT planning with instance-based pricing, capped gateway pricing, processed data, and transfer assumptions.",
    gatewayPricingMode: "per-instance-capped",
    gatewayHourlyRate: "0",
    perInstanceHourlyRate: "0.0014",
    instanceThresholdPerGateway: "32",
    cappedGatewayHourlyRate: "0.044",
    dataProcessingRatePerGib: "0.045",
    publicIpHourlyRate: "0.005",
    internetEgressRatePerGib: "",
    crossZoneTransferRatePerGib: "",
    flowLogsMonthlyCost: "0",
    fixedMonthlyCost: "0",
    oneTimeMigrationCost: "0",
    migrationAmortizationMonths: "12",
  },
  {
    id: "custom",
    providerName: "Custom provider",
    shortName: "Custom",
    serviceName: "Custom managed NAT service",
    regionLabel: "Your region",
    note: "Good when your provider, account agreement, marketplace service, or private quote uses custom NAT pricing.",
    gatewayPricingMode: "per-gateway",
    gatewayHourlyRate: "",
    perInstanceHourlyRate: "0",
    instanceThresholdPerGateway: "0",
    cappedGatewayHourlyRate: "0",
    dataProcessingRatePerGib: "",
    publicIpHourlyRate: "",
    internetEgressRatePerGib: "",
    crossZoneTransferRatePerGib: "",
    flowLogsMonthlyCost: "0",
    fixedMonthlyCost: "0",
    oneTimeMigrationCost: "0",
    migrationAmortizationMonths: "12",
  },
];

const pricingModeOptions: {
  value: GatewayPricingMode;
  label: string;
  description: string;
}[] = [
  {
    value: "per-gateway",
    label: "Direct gateway hourly price",
    description: "Use when the provider bills each NAT gateway by hour.",
  },
  {
    value: "per-instance-capped",
    label: "Instance-based with cap",
    description: "Use for Google-style instance pricing with a gateway cap.",
  },
];

const regionOptionsByPlan: Record<PlanId, { label: string; value: string }[]> = {
  "aws-nat-gateway": [
    { label: "US East (Ohio)", value: "US East (Ohio)" },
    { label: "US East (N. Virginia)", value: "US East (N. Virginia)" },
    { label: "US West (Oregon)", value: "US West (Oregon)" },
    { label: "Asia Pacific (Mumbai)", value: "Asia Pacific (Mumbai)" },
    { label: "Europe (Ireland)", value: "Europe (Ireland)" },
  ],
  "azure-nat-gateway": [
    { label: "East US", value: "East US" },
    { label: "East US 2", value: "East US 2" },
    { label: "West US 2", value: "West US 2" },
    { label: "Central India", value: "Central India" },
    { label: "West Europe", value: "West Europe" },
  ],
  "google-cloud-nat": [
    { label: "Iowa (us-central1)", value: "Iowa (us-central1)" },
    { label: "Oregon (us-west1)", value: "Oregon (us-west1)" },
    { label: "N. Virginia (us-east4)", value: "N. Virginia (us-east4)" },
    { label: "Mumbai (asia-south1)", value: "Mumbai (asia-south1)" },
    { label: "Belgium (europe-west1)", value: "Belgium (europe-west1)" },
  ],
  custom: [
    { label: "Your region", value: "Your region" },
    { label: "Custom quote or your provider region", value: "Custom quote or your provider region" },
    { label: "Your private pricing scope", value: "Your private pricing scope" },
    { label: "Marketplace or reseller quote", value: "Marketplace or reseller quote" },
  ],
};

function formatRate(value: number) {
  return formatBeeijaCurrency(value);
}

function isPlanConfigured(plan: PlanInput) {
  if (plan.dataProcessingRatePerGib.trim() === "") return false;

  if (plan.gatewayPricingMode === "per-instance-capped") {
    return (
      plan.perInstanceHourlyRate.trim() !== "" &&
      plan.cappedGatewayHourlyRate.trim() !== ""
    );
  }

  return plan.gatewayHourlyRate.trim() !== "";
}

function calculatePlan(plan: PlanInput, workload: WorkloadFields): PlanResult {
  const gatewayCount = Math.max(0, Math.floor(parseBeeijaNumber(workload.gatewayCount)));
  const activeHours = Math.min(
    HOURS_IN_PLANNING_MONTH,
    parseBeeijaNumber(workload.activeHoursPerMonth),
  );
  const protectedInstances = Math.max(
    0,
    Math.floor(parseBeeijaNumber(workload.protectedInstanceCount)),
  );
  const publicIpCount = Math.max(0, Math.floor(parseBeeijaNumber(workload.publicIpCount)));
  const outboundProcessedGib = parseBeeijaNumber(workload.outboundProcessedGib);
  const returnProcessedGib = parseBeeijaNumber(workload.returnProcessedGib);
  const internetEgressGib = parseBeeijaNumber(workload.internetEgressGib);
  const crossZoneTransferGib = parseBeeijaNumber(workload.crossZoneTransferGib);
  const monthlyBudget = parseBeeijaNumber(workload.monthlyBudget);

  const gatewayHours = gatewayCount * activeHours;
  const processedTrafficGib = outboundProcessedGib + returnProcessedGib;
  const publicIpHours = publicIpCount * activeHours;

  let gatewayCost = 0;

  if (plan.gatewayPricingMode === "per-instance-capped") {
    const instanceThreshold = Math.max(1, parseBeeijaNumber(plan.instanceThresholdPerGateway));
    const perInstanceHourlyRate = parseBeeijaNumber(plan.perInstanceHourlyRate);
    const cappedGatewayHourlyRate = parseBeeijaNumber(plan.cappedGatewayHourlyRate);
    const totalInstanceThreshold = gatewayCount * instanceThreshold;

    gatewayCost =
      protectedInstances <= totalInstanceThreshold
        ? protectedInstances * activeHours * perInstanceHourlyRate
        : gatewayHours * cappedGatewayHourlyRate;
  } else {
    gatewayCost = gatewayHours * parseBeeijaNumber(plan.gatewayHourlyRate);
  }

  const dataProcessingCost =
    processedTrafficGib * parseBeeijaNumber(plan.dataProcessingRatePerGib);
  const publicIpCost = publicIpHours * parseBeeijaNumber(plan.publicIpHourlyRate);
  const internetEgressCost =
    internetEgressGib * parseBeeijaNumber(plan.internetEgressRatePerGib);
  const crossZoneTransferCost =
    crossZoneTransferGib * parseBeeijaNumber(plan.crossZoneTransferRatePerGib);
  const flowLogsCost =
    workload.includeFlowLogs === "yes" ? parseBeeijaNumber(plan.flowLogsMonthlyCost) : 0;
  const fixedMonthlyCost = parseBeeijaNumber(plan.fixedMonthlyCost);
  const migrationMonths = Math.max(1, parseBeeijaNumber(plan.migrationAmortizationMonths));
  const amortizedMigrationCost =
    parseBeeijaNumber(plan.oneTimeMigrationCost) / migrationMonths;
  const monthlyOperatingCost =
    gatewayCost +
    dataProcessingCost +
    publicIpCost +
    internetEgressCost +
    crossZoneTransferCost +
    flowLogsCost +
    fixedMonthlyCost;
  const monthlyPlanningCost = monthlyOperatingCost + amortizedMigrationCost;

  return {
    id: plan.id,
    providerName: plan.providerName,
    shortName: plan.shortName,
    serviceName: plan.serviceName,
    regionLabel: plan.regionLabel,
    configured: isPlanConfigured(plan),
    gatewayHours,
    processedTrafficGib,
    publicIpHours,
    gatewayCost,
    dataProcessingCost,
    publicIpCost,
    internetEgressCost,
    crossZoneTransferCost,
    flowLogsCost,
    fixedMonthlyCost,
    monthlyOperatingCost,
    amortizedMigrationCost,
    monthlyPlanningCost,
    firstYearCost: monthlyOperatingCost * 12 + parseBeeijaNumber(plan.oneTimeMigrationCost),
    costPerGateway: gatewayCount > 0 ? monthlyOperatingCost / gatewayCount : 0,
    costPerProcessedGib:
      processedTrafficGib > 0 ? monthlyOperatingCost / processedTrafficGib : 0,
    budgetDifference: monthlyBudget - monthlyPlanningCost,
  };
}

function orderResults(results: PlanResult[]) {
  return [...results].sort((left, right) => {
    if (left.configured !== right.configured) return left.configured ? -1 : 1;
    if (!left.configured && !right.configured) return 0;
    return left.monthlyPlanningCost - right.monthlyPlanningCost;
  });
}

type NumberInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  prefix?: string;
  suffix?: string;
};

function NumberInput({ label, value, onChange, helper, prefix, suffix }: NumberInputProps) {
  return (
    <BeeijaNumberField
      label={label}
      value={value}
      onChange={onChange}
      helper={helper}
      prefix={prefix}
      suffix={suffix}
      sanitizeDecimal
    />
  );
}

function ChoiceCards<TValue extends string>({
  label,
  value,
  onChange,
  options,
  helper,
}: {
  label: string;
  value: TValue;
  onChange: (value: TValue) => void;
  options: { value: TValue; label: string; description?: string }[];
  helper?: string;
}) {
  return (
    <div className="block min-w-0">
      <p className="mb-1 block text-[11.5px] font-semibold leading-5 text-slate-800">
        {label}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`min-w-0 rounded-lg border px-3 py-2 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                selected
                  ? "border-[#165A31] bg-[#f4fbf6]"
                  : "border-slate-200 bg-white hover:border-[#165A31]"
              }`}
            >
              <span className="block text-[13.5px] font-semibold leading-5 text-slate-900">
                {option.label}
              </span>
              {option.description ? (
                <span className="mt-1 block text-[11.5px] leading-5 text-slate-500">
                  {option.description}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {helper ? (
        <span className="mt-1 block text-[11.5px] leading-5 text-slate-500">
          {helper}
        </span>
      ) : null}
    </div>
  );
}

function ProviderCard({
  plan,
  selected,
  onSelect,
}: {
  plan: PlanInput;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`min-w-0 rounded-lg border p-3 text-left transition ${
        selected
          ? "border-[#165A31] bg-[#f4fbf6] shadow-sm"
          : "border-slate-200 bg-white hover:border-[#165A31]"
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
}

export default function ToolClient() {
  const [workload, setWorkload] = useState<WorkloadFields>(defaultWorkload);
  const [plans, setPlans] = useState<PlanInput[]>(initialPlans);
  const [activePlanId, setActivePlanId] = useState<PlanId>("aws-nat-gateway");

  const activePlan =
    plans.find((plan) => plan.id === activePlanId) ?? plans[0];
  const activeRegionOptions = regionOptionsByPlan[activePlan.id];

  const results = useMemo(
    () => orderResults(plans.map((plan) => calculatePlan(plan, workload))),
    [plans, workload],
  );

  const activeResult = useMemo(
    () => calculatePlan(activePlan, workload),
    [activePlan, workload],
  );

  const updateWorkload = (field: keyof WorkloadFields, value: string) => {
    setWorkload((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updatePlan = (field: keyof PlanInput, value: string) => {
    setPlans((currentPlans) =>
      currentPlans.map((plan) =>
        plan.id === activePlan.id
          ? {
              ...plan,
              [field]: value,
            }
          : plan,
      ),
    );
  };

  const resetActivePlanRates = () => {
    const original = initialPlans.find((plan) => plan.id === activePlan.id);
    if (!original) return;

    setPlans((currentPlans) =>
      currentPlans.map((plan) => (plan.id === activePlan.id ? { ...original } : plan)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#165A31]">
              Configure workload
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              Select provider and enter current prices
            </h2>
            <p className="mt-2 text-base leading-7 text-slate-600">
              NAT gateway pricing depends on gateway runtime, protected instances,
              processed traffic, public IP addresses, transfer paths, logging, and
              account-specific rates. Beeija keeps the provider prices editable so
              you can compare the same workload with current pricing.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {plans.map((plan) => (
              <ProviderCard
                key={plan.id}
                plan={plan}
                selected={plan.id === activePlan.id}
                onSelect={() => setActivePlanId(plan.id)}
              />
            ))}
          </div>

          <div className="mt-5">
            <h3 className="text-base font-semibold text-slate-950">
              Shared workload assumptions
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <NumberInput
                label="Number of NAT gateways"
                value={workload.gatewayCount}
                onChange={(value) => updateWorkload("gatewayCount", value)}
                helper="Use one or more gateways for production planning."
              />
              <NumberInput
                label="Monthly running hours"
                value={workload.activeHoursPerMonth}
                onChange={(value) => updateWorkload("activeHoursPerMonth", value)}
                helper="Use 730 for a full month."
                suffix="hours"
              />
              <NumberInput
                label="Protected instances or nodes"
                value={workload.protectedInstanceCount}
                onChange={(value) => updateWorkload("protectedInstanceCount", value)}
                helper="VMs, nodes, or workloads using this NAT path."
              />
              <NumberInput
                label="Outbound traffic processed by NAT"
                value={workload.outboundProcessedGib}
                onChange={(value) => updateWorkload("outboundProcessedGib", value)}
                helper="Traffic going out through the NAT gateway."
                suffix="GiB"
              />
              <NumberInput
                label="Return traffic processed by NAT"
                value={workload.returnProcessedGib}
                onChange={(value) => updateWorkload("returnProcessedGib", value)}
                helper="Return traffic that may be counted by the provider."
                suffix="GiB"
              />
              <NumberInput
                label="Monthly planning budget"
                value={workload.monthlyBudget}
                onChange={(value) => updateWorkload("monthlyBudget", value)}
                helper="Optional budget check for this NAT setup."
                prefix="$"
              />
            </div>

            <div className="mt-4">
              <BeeijaAdvancedSection
                title="Optional transfer, IP, and logging assumptions"
                description="Use these only when public IPs, internet egress, regional transfer, or flow logs are part of this NAT estimate."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <NumberInput
                    label="Public IPv4 addresses"
                    value={workload.publicIpCount}
                    onChange={(value) => updateWorkload("publicIpCount", value)}
                    helper="Public IPs attached to NAT gateways."
                  />
                  <NumberInput
                    label="Internet data transfer out"
                    value={workload.internetEgressGib}
                    onChange={(value) => updateWorkload("internetEgressGib", value)}
                    helper="Internet egress, if billed separately."
                    suffix="GiB"
                  />
                  <NumberInput
                    label="Cross-zone or regional transfer"
                    value={workload.crossZoneTransferGib}
                    onChange={(value) => updateWorkload("crossZoneTransferGib", value)}
                    helper="Regional or cross-zone network transfer."
                    suffix="GiB"
                  />
                  <ChoiceCards<"no" | "yes">
                    label="Include flow-log cost"
                    value={workload.includeFlowLogs}
                    onChange={(value) =>
                      setWorkload((current) => ({ ...current, includeFlowLogs: value }))
                    }
                    options={[
                      { value: "no", label: "No", description: "Do not add flow-log cost." },
                      { value: "yes", label: "Yes", description: "Add monthly flow-log cost." },
                    ]}
                    helper="Add logging cost only when you plan to use it."
                  />
                </div>
              </BeeijaAdvancedSection>
            </div>
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

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <BeeijaSelect
                label="Region or pricing scope"
                value={activePlan.regionLabel}
                onChange={(event) => updatePlan("regionLabel", event.target.value)}
                options={activeRegionOptions}
              />
              <div className="block min-w-0">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Service or plan name
                </span>
                <div className="flex min-h-12 w-full min-w-0 items-center rounded-xl border border-gray-300 bg-slate-50 px-4 py-3 text-base text-gray-900">
                  <span className="truncate">{activePlan.serviceName}</span>
                </div>
                <span className="mt-1 block text-[11.5px] leading-5 text-slate-500">
                  Fixed by the selected provider plan. Edit only the pricing rates below.
                </span>
              </div>
              <div className="sm:col-span-2">
                <ChoiceCards<GatewayPricingMode>
                  label="Gateway runtime pricing method"
                  value={activePlan.gatewayPricingMode}
                  onChange={(value) => updatePlan("gatewayPricingMode", value)}
                  options={pricingModeOptions}
                  helper="Choose the pricing structure that matches the provider page you are using."
                />
              </div>

              {activePlan.gatewayPricingMode === "per-gateway" ? (
                <NumberInput
                  label="Gateway price per hour"
                  value={activePlan.gatewayHourlyRate}
                  onChange={(value) => updatePlan("gatewayHourlyRate", value)}
                  prefix="$"
                  suffix="/hour"
                />
              ) : (
                <NumberInput
                  label="Assigned instance price per hour"
                  value={activePlan.perInstanceHourlyRate}
                  onChange={(value) => updatePlan("perInstanceHourlyRate", value)}
                  prefix="$"
                  suffix="/instance-hour"
                />
              )}

              {activePlan.gatewayPricingMode === "per-instance-capped" ? (
                <>
                  <NumberInput
                    label="Instance threshold per gateway"
                    value={activePlan.instanceThresholdPerGateway}
                    onChange={(value) => updatePlan("instanceThresholdPerGateway", value)}
                    helper="Used before gateway-level capped pricing applies."
                    suffix="instances"
                  />
                  <NumberInput
                    label="Gateway hourly price above threshold"
                    value={activePlan.cappedGatewayHourlyRate}
                    onChange={(value) => updatePlan("cappedGatewayHourlyRate", value)}
                    prefix="$"
                    suffix="/hour"
                  />
                </>
              ) : null}

              <NumberInput
                label="NAT data processing price"
                value={activePlan.dataProcessingRatePerGib}
                onChange={(value) => updatePlan("dataProcessingRatePerGib", value)}
                helper="Processed traffic rate."
                prefix="$"
                suffix="/GiB"
              />
              <NumberInput
                label="Public IPv4 price"
                value={activePlan.publicIpHourlyRate}
                onChange={(value) => updatePlan("publicIpHourlyRate", value)}
                helper="Public IP charge, if billed separately."
                prefix="$"
                suffix="/IP-hour"
              />
            </div>

            <div className="mt-4">
              <BeeijaAdvancedSection
                title="Optional transfer, logging, and setup rates"
                description="Open this only when internet transfer, regional transfer, flow logs, fixed charges, or migration costs apply."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <NumberInput
                    label="Internet transfer-out price"
                    value={activePlan.internetEgressRatePerGib}
                    onChange={(value) => updatePlan("internetEgressRatePerGib", value)}
                    helper="Set blank or 0 if checked elsewhere."
                    prefix="$"
                    suffix="/GiB"
                  />
                  <NumberInput
                    label="Cross-zone or regional transfer price"
                    value={activePlan.crossZoneTransferRatePerGib}
                    onChange={(value) => updatePlan("crossZoneTransferRatePerGib", value)}
                    helper="Used when regional transfer applies."
                    prefix="$"
                    suffix="/GiB"
                  />
                  <NumberInput
                    label="Estimated monthly flow-log cost"
                    value={activePlan.flowLogsMonthlyCost}
                    onChange={(value) => updatePlan("flowLogsMonthlyCost", value)}
                    prefix="$"
                    suffix="/month"
                  />
                  <NumberInput
                    label="Other fixed monthly cost"
                    value={activePlan.fixedMonthlyCost}
                    onChange={(value) => updatePlan("fixedMonthlyCost", value)}
                    helper="Monitoring, support allocation, or extra services."
                    prefix="$"
                    suffix="/month"
                  />
                  <NumberInput
                    label="One-time migration or setup cost"
                    value={activePlan.oneTimeMigrationCost}
                    onChange={(value) => updatePlan("oneTimeMigrationCost", value)}
                    prefix="$"
                  />
                  <NumberInput
                    label="Spread one-time cost over"
                    value={activePlan.migrationAmortizationMonths}
                    onChange={(value) => updatePlan("migrationAmortizationMonths", value)}
                    helper="Used for migration planning."
                    suffix="months"
                  />
                </div>
              </BeeijaAdvancedSection>
            </div>
          </div>
        </section>

        <aside className="min-w-0 space-y-4">
          <section className="min-w-0 rounded-lg border border-slate-200 bg-[#f8fcfa] p-4 shadow-sm sm:p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#165A31]">
              Estimate summary
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {activePlan.shortName} monthly planning cost
            </h2>
            <div className="mt-4 rounded-lg border border-[#d7eadf] bg-white p-4">
              <p className="text-base text-slate-500">Estimated monthly cost</p>
              <p className="mt-2 truncate text-3xl font-semibold tracking-tight text-[#165A31]">
                {activeResult.configured
                  ? formatBeeijaCurrency(activeResult.monthlyPlanningCost)
                  : "Enter provider prices"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This is a planning estimate before tax, discounts, credits, support
                plans, currency conversion, account agreements, and provider-specific
                billing rules.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <BeeijaResultLine
                label="Gateway runtime"
                value={formatRate(activeResult.gatewayCost)}
              />
              <BeeijaResultLine
                label="NAT data processing"
                value={formatRate(activeResult.dataProcessingCost)}
              />
              <BeeijaResultLine
                label="Public IPv4 addresses"
                value={formatRate(activeResult.publicIpCost)}
              />
              <BeeijaResultLine
                label="Internet and regional transfer"
                value={formatRate(
                  activeResult.internetEgressCost + activeResult.crossZoneTransferCost,
                )}
              />
              <BeeijaResultLine
                label="Flow logs and fixed cost"
                value={formatRate(activeResult.flowLogsCost + activeResult.fixedMonthlyCost)}
              />
              <BeeijaResultLine
                label="Migration allocation"
                value={formatRate(activeResult.amortizedMigrationCost)}
              />
            </div>
          </section>

          <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-xl font-semibold text-slate-950">
              Provider comparison
            </h2>
            <p className="mt-1 text-base leading-7 text-slate-600">
              Compare configured NAT plans using the same workload assumptions.
            </p>
            <div className="mt-4 space-y-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => setActivePlanId(result.id)}
                  className={`grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border px-3 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                    result.id === activePlan.id
                      ? "border-[#165A31] bg-[#f4fbf6]"
                      : "border-slate-200 bg-white hover:border-[#165A31]"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-base font-semibold text-slate-900">
                      {result.providerName}
                    </span>
                    <span className="block truncate text-sm text-slate-500">
                      {result.serviceName}
                    </span>
                  </span>
                  <span className="max-w-[7rem] truncate text-right text-base font-semibold tabular-nums text-slate-950 sm:max-w-[10rem]">
                    {result.configured
                      ? formatBeeijaCurrency(result.monthlyPlanningCost)
                      : "—"}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <BeeijaAdvancedSection title="Calculation details" variant="card">
            <div className="space-y-2">
              <BeeijaResultLine
                label="Gateway runtime"
                value={`${formatBeeijaNumber(activeResult.gatewayHours)} gateway-hours`}
                muted
              />
              <BeeijaResultLine
                label="Processed NAT traffic"
                value={`${formatBeeijaNumber(activeResult.processedTrafficGib)} GiB`}
                muted
              />
              <BeeijaResultLine
                label="Public IP runtime"
                value={`${formatBeeijaNumber(activeResult.publicIpHours)} IP-hours`}
                muted
              />
              <BeeijaResultLine
                label="Cost per processed GiB"
                value={formatBeeijaCurrency(activeResult.costPerProcessedGib)}
                muted
              />
              <BeeijaResultLine
                label="First-year planning cost"
                value={formatBeeijaCurrency(activeResult.firstYearCost)}
                muted
              />
              <BeeijaResultLine
                label="Budget status"
                value={
                  parseBeeijaNumber(workload.monthlyBudget) <= 0
                    ? "Add budget"
                    : activeResult.budgetDifference >= 0
                      ? `${formatBeeijaCurrency(activeResult.budgetDifference)} remaining`
                      : `${formatBeeijaCurrency(Math.abs(activeResult.budgetDifference))} over budget`
                }
                muted
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              NAT billing can change by traffic path, public IP pricing, regional
              transfer, logging volume, discounts, and provider-specific rules.
              Verify the final estimate in the provider calculator before purchase.
            </p>
          </BeeijaAdvancedSection>

          <div className="rounded-lg border border-[#F2C94C] bg-[#fffdf3] p-4 text-base leading-7 text-slate-700">
            <strong>* Important:</strong> Current NAT gateway prices can vary by
            region, product type, traffic route, account agreement, tax, currency,
            and discounts. Use this result as a planning estimate, not a final bill
            or official quote.
          </div>
        </aside>
      </div>
    </div>
  );
}

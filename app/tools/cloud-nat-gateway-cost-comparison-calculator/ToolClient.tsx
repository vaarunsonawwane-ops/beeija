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
import BeeijaComparisonCalculatorLayout, {
  BeeijaComparisonInputPanel,
  BeeijaComparisonResultColumn,
} from "@/app/components/BeeijaComparisonCalculatorLayout";
import BeeijaWorkloadSummary from "@/app/components/BeeijaWorkloadSummary";
import BeeijaProviderPlanTabs from "@/app/components/BeeijaProviderPlanTabs";

type GatewayPricingMode =
  | "per-gateway"
  | "per-instance-capped";

type Option = {
  value: string;
  label: string;
};

type PlanInput = {
  id: string;
  providerName: string;
  serviceName: string;
  regionLabel: string;
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

type PlanResult = {
  id: string;
  providerName: string;
  serviceName: string;
  regionLabel: string;
  configured: boolean;
  gatewayPricingMode: GatewayPricingMode;
  gatewayHours: number;
  instancesPerGateway: number;
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
  enteredPriceCount: number;
};

type BreakdownItem = {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
};

const HOURS_IN_PLANNING_MONTH = 730;

const yesNoOptions: Option[] = [
  {
    value: "no",
    label: "No",
  },
  {
    value: "yes",
    label: "Yes",
  },
];

const initialPlans: PlanInput[] = [
  {
    id: "aws-nat-gateway",
    providerName: "Amazon Web Services",
    serviceName: "AWS NAT Gateway",
    regionLabel: "US East (Ohio)",
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
    serviceName: "Azure NAT Gateway StandardV2",
    regionLabel: "East US",
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
    serviceName: "Cloud NAT Public NAT",
    regionLabel: "Iowa (us-central1)",
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
    serviceName: "Custom managed NAT service",
    regionLabel: "Your region",
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
    plan.gatewayHourlyRate,
    plan.perInstanceHourlyRate,
    plan.cappedGatewayHourlyRate,
    plan.dataProcessingRatePerGib,
    plan.publicIpHourlyRate,
    plan.internetEgressRatePerGib,
    plan.crossZoneTransferRatePerGib,
    plan.flowLogsMonthlyCost,
    plan.fixedMonthlyCost,
  ].filter((value) => value.trim() !== "").length;
}

function isPlanConfigured(plan: PlanInput) {
  if (plan.dataProcessingRatePerGib.trim() === "") {
    return false;
  }

  if (plan.gatewayPricingMode === "per-instance-capped") {
    return (
      plan.perInstanceHourlyRate.trim() !== "" &&
      plan.cappedGatewayHourlyRate.trim() !== ""
    );
  }

  return plan.gatewayHourlyRate.trim() !== "";
}

export default function ToolClient() {
  const [gatewayCount, setGatewayCount] = useState("2");
  const [activeHoursPerMonth, setActiveHoursPerMonth] =
    useState("730");
  const [protectedInstanceCount, setProtectedInstanceCount] =
    useState("24");
  const [publicIpCount, setPublicIpCount] = useState("2");
  const [outboundProcessedGib, setOutboundProcessedGib] =
    useState("1000");
  const [returnProcessedGib, setReturnProcessedGib] =
    useState("300");
  const [internetEgressGib, setInternetEgressGib] =
    useState("700");
  const [crossZoneTransferGib, setCrossZoneTransferGib] =
    useState("0");
  const [includeFlowLogs, setIncludeFlowLogs] =
    useState("no");
  const [monthlyBudget, setMonthlyBudget] =
    useState("250");
  const [selectedPlanId, setSelectedPlanId] =
    useState("aws-nat-gateway");
  const [activeEditorPlanId, setActiveEditorPlanId] =
    useState("aws-nat-gateway");
  const [plans, setPlans] =
    useState<PlanInput[]>(initialPlans);

  const result = useMemo(() => {
    const parsedGatewayCount = Math.max(
      0,
      Math.floor(toNumber(gatewayCount)),
    );

    const parsedActiveHours = Math.min(
      HOURS_IN_PLANNING_MONTH,
      toNumber(activeHoursPerMonth),
    );

    const parsedProtectedInstances = Math.max(
      0,
      Math.floor(toNumber(protectedInstanceCount)),
    );

    const parsedPublicIpCount = Math.max(
      0,
      Math.floor(toNumber(publicIpCount)),
    );

    const parsedOutboundProcessedGib = toNumber(
      outboundProcessedGib,
    );

    const parsedReturnProcessedGib = toNumber(
      returnProcessedGib,
    );

    const parsedInternetEgressGib = toNumber(
      internetEgressGib,
    );

    const parsedCrossZoneTransferGib = toNumber(
      crossZoneTransferGib,
    );

    const parsedBudget = toNumber(monthlyBudget);

    const gatewayHours =
      parsedGatewayCount * parsedActiveHours;

    const processedTrafficGib =
      parsedOutboundProcessedGib +
      parsedReturnProcessedGib;

    const publicIpHours =
      parsedPublicIpCount * parsedActiveHours;

    const instancesPerGateway =
      parsedGatewayCount > 0
        ? parsedProtectedInstances /
          parsedGatewayCount
        : 0;

    const planResults: PlanResult[] = plans.map(
      (plan) => {
        const gatewayHourlyRate = toNumber(
          plan.gatewayHourlyRate,
        );

        const perInstanceHourlyRate = toNumber(
          plan.perInstanceHourlyRate,
        );

        const instanceThreshold = Math.max(
          1,
          toNumber(
            plan.instanceThresholdPerGateway,
          ),
        );

        const cappedGatewayHourlyRate = toNumber(
          plan.cappedGatewayHourlyRate,
        );

        const dataProcessingRate = toNumber(
          plan.dataProcessingRatePerGib,
        );

        const publicIpHourlyRate = toNumber(
          plan.publicIpHourlyRate,
        );

        const internetEgressRate = toNumber(
          plan.internetEgressRatePerGib,
        );

        const crossZoneTransferRate = toNumber(
          plan.crossZoneTransferRatePerGib,
        );

        const flowLogsMonthlyCost = toNumber(
          plan.flowLogsMonthlyCost,
        );

        const fixedMonthlyCost = toNumber(
          plan.fixedMonthlyCost,
        );

        const oneTimeMigrationCost = toNumber(
          plan.oneTimeMigrationCost,
        );

        const migrationAmortizationMonths =
          Math.max(
            1,
            toNumber(
              plan.migrationAmortizationMonths,
            ),
          );

        let gatewayCost = 0;

        if (
          plan.gatewayPricingMode ===
          "per-instance-capped"
        ) {
          const totalInstanceThreshold =
            parsedGatewayCount *
            instanceThreshold;

          gatewayCost =
            parsedProtectedInstances <=
            totalInstanceThreshold
              ? parsedProtectedInstances *
                parsedActiveHours *
                perInstanceHourlyRate
              : gatewayHours *
                cappedGatewayHourlyRate;
        } else {
          gatewayCost =
            gatewayHours * gatewayHourlyRate;
        }

        const dataProcessingCost =
          processedTrafficGib *
          dataProcessingRate;

        const publicIpCost =
          publicIpHours *
          publicIpHourlyRate;

        const internetEgressCost =
          parsedInternetEgressGib *
          internetEgressRate;

        const crossZoneTransferCost =
          parsedCrossZoneTransferGib *
          crossZoneTransferRate;

        const flowLogsCost =
          includeFlowLogs === "yes"
            ? flowLogsMonthlyCost
            : 0;

        const monthlyOperatingCost =
          gatewayCost +
          dataProcessingCost +
          publicIpCost +
          internetEgressCost +
          crossZoneTransferCost +
          flowLogsCost +
          fixedMonthlyCost;

        const amortizedMigrationCost =
          oneTimeMigrationCost /
          migrationAmortizationMonths;

        const monthlyPlanningCost =
          monthlyOperatingCost +
          amortizedMigrationCost;

        const firstYearCost =
          monthlyOperatingCost * 12 +
          oneTimeMigrationCost;

        return {
          id: plan.id,
          providerName: plan.providerName,
          serviceName: plan.serviceName,
          regionLabel: plan.regionLabel,
          configured: isPlanConfigured(plan),
          gatewayPricingMode:
            plan.gatewayPricingMode,
          gatewayHours,
          instancesPerGateway,
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
          firstYearCost,
          costPerGateway:
            parsedGatewayCount > 0
              ? monthlyOperatingCost /
                parsedGatewayCount
              : 0,
          costPerProcessedGib:
            processedTrafficGib > 0
              ? monthlyOperatingCost /
                processedTrafficGib
              : 0,
          budgetDifference:
            parsedBudget -
            monthlyPlanningCost,
          enteredPriceCount:
            countEnteredPrices(plan),
        };
      },
    );

    const configuredPlans = planResults.filter(
      (plan) => plan.configured,
    );

    const rankedPlans = [
      ...configuredPlans,
    ].sort(
      (left, right) =>
        left.monthlyPlanningCost -
          right.monthlyPlanningCost ||
        plans.findIndex(
          (plan) => plan.id === left.id,
        ) -
          plans.findIndex(
            (plan) => plan.id === right.id,
          ),
    );

    const selectedResult =
      planResults.find(
        (plan) =>
          plan.id === selectedPlanId,
      ) ??
      rankedPlans[0] ??
      planResults[0];

    const cheapest =
      rankedPlans[0] ?? selectedResult;

    return {
      parsedGatewayCount,
      parsedActiveHours,
      parsedProtectedInstances,
      parsedPublicIpCount,
      parsedOutboundProcessedGib,
      parsedReturnProcessedGib,
      parsedInternetEgressGib,
      parsedCrossZoneTransferGib,
      parsedBudget,
      gatewayHours,
      processedTrafficGib,
      publicIpHours,
      instancesPerGateway,
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
    gatewayCount,
    activeHoursPerMonth,
    protectedInstanceCount,
    publicIpCount,
    outboundProcessedGib,
    returnProcessedGib,
    internetEgressGib,
    crossZoneTransferGib,
    includeFlowLogs,
    monthlyBudget,
    selectedPlanId,
    plans,
  ]);

  const planOptions: Option[] = plans.map(
    (plan) => ({
      value: plan.id,
      label: `${plan.providerName} — ${plan.serviceName}`,
    }),
  );

  const activeEditorPlan =
    plans.find(
      (plan) => plan.id === activeEditorPlanId,
    ) ?? plans[0];

  const activeEditorPlanNumber =
    Math.max(
      0,
      plans.findIndex(
        (plan) => plan.id === activeEditorPlan.id,
      ),
    ) + 1;

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
    setGatewayCount("2");
    setActiveHoursPerMonth("730");
    setProtectedInstanceCount("24");
    setPublicIpCount("2");
    setOutboundProcessedGib("1000");
    setReturnProcessedGib("300");
    setInternetEgressGib("700");
    setCrossZoneTransferGib("0");
    setIncludeFlowLogs("no");
    setMonthlyBudget("250");
    setSelectedPlanId("aws-nat-gateway");
    setActiveEditorPlanId("aws-nat-gateway");
    setPlans(initialPlans);
  };

  const selectedResult =
    result.selectedResult;

  const selectedPlan =
    plans.find(
      (plan) =>
        plan.id === selectedResult.id,
    ) ?? plans[0];

  const breakdownItems: BreakdownItem[] = [
    {
      label: "NAT gateway runtime",
      detail:
        selectedResult.gatewayPricingMode ===
        "per-instance-capped"
          ? `${formatVisibleNumber(
              result.instancesPerGateway,
            )} assigned instances per gateway on average`
          : `${formatVisibleNumber(
              result.gatewayHours,
            )} gateway-hours`,
      value: selectedResult.gatewayCost,
      entered:
        selectedPlan.gatewayPricingMode ===
        "per-instance-capped"
          ? selectedPlan.perInstanceHourlyRate.trim() !==
              "" &&
            selectedPlan.cappedGatewayHourlyRate.trim() !==
              ""
          : selectedPlan.gatewayHourlyRate.trim() !== "",
    },
    {
      label: "NAT data processing",
      detail: `${formatVisibleNumber(
        result.processedTrafficGib,
      )} GiB of outbound and return traffic`,
      value:
        selectedResult.dataProcessingCost,
      entered:
        selectedPlan.dataProcessingRatePerGib.trim() !==
        "",
    },
    {
      label: "Public IPv4 addresses",
      detail: `${formatVisibleNumber(
        result.publicIpHours,
      )} public IP-hours`,
      value: selectedResult.publicIpCost,
      entered:
        selectedPlan.publicIpHourlyRate.trim() !== "",
    },
    {
      label: "Internet data transfer out",
      detail: `${formatVisibleNumber(
        result.parsedInternetEgressGib,
      )} GiB`,
      value:
        selectedResult.internetEgressCost,
      entered:
        selectedPlan.internetEgressRatePerGib.trim() !==
        "",
    },
    {
      label: "Cross-zone or regional transfer",
      detail: `${formatVisibleNumber(
        result.parsedCrossZoneTransferGib,
      )} GiB`,
      value:
        selectedResult.crossZoneTransferCost,
      entered:
        selectedPlan.crossZoneTransferRatePerGib.trim() !==
        "",
    },
    {
      label: "Flow logs",
      detail:
        includeFlowLogs === "yes"
          ? "Estimated monthly logging charge included"
          : "Not included",
      value: selectedResult.flowLogsCost,
      entered: includeFlowLogs === "yes",
    },
    {
      label: "Other fixed monthly cost",
      detail:
        "Monitoring, support allocation, routing, or other recurring charges",
      value:
        selectedResult.fixedMonthlyCost,
      entered: true,
    },
  ];

  return (
    <BeeijaComparisonCalculatorLayout>
      <BeeijaComparisonInputPanel>
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter the Shared NAT Gateway Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Use the same gateway runtime, protected instances, traffic,
            public IP, logging, transfer, and budget workload for every
            provider plan.
          </p>
        </div>

        <FieldSection title="Gateway deployment">
          <BeeijaNumberField
            label="Number of NAT gateways"
            value={gatewayCount}
            onChange={setGatewayCount}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Active gateway hours per month"
            value={activeHoursPerMonth}
            onChange={setActiveHoursPerMonth}
            min="0"
            max="730"
            step="1"
            suffix="hours"
          />

          <BeeijaNumberField
            label="Protected VM instances or nodes"
            value={protectedInstanceCount}
            onChange={setProtectedInstanceCount}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Public IPv4 addresses used"
            value={publicIpCount}
            onChange={setPublicIpCount}
            min="0"
            step="1"
          />
        </FieldSection>

        <FieldSection title="Traffic">
          <BeeijaNumberField
            label="Outbound traffic processed by NAT"
            value={outboundProcessedGib}
            onChange={setOutboundProcessedGib}
            min="0"
            step="0.01"
            suffix="GiB"
          />

          <BeeijaNumberField
            label="Return traffic processed by NAT"
            value={returnProcessedGib}
            onChange={setReturnProcessedGib}
            min="0"
            step="0.01"
            suffix="GiB"
          />

          <BeeijaNumberField
            label="Internet data transfer out"
            value={internetEgressGib}
            onChange={setInternetEgressGib}
            min="0"
            step="0.01"
            suffix="GiB"
          />

          <BeeijaNumberField
            label="Cross-zone or regional transfer"
            value={crossZoneTransferGib}
            onChange={setCrossZoneTransferGib}
            min="0"
            step="0.01"
            suffix="GiB"
          />
        </FieldSection>

        <FieldSection title="Logging and budget">
          <BeeijaSelect
            label="Include estimated flow-log cost"
            value={includeFlowLogs}
            onChange={(event) =>
              setIncludeFlowLogs(
                event.target.value,
              )
            }
            options={yesNoOptions}
          />

          <BeeijaNumberField
            label="Monthly planning budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="0.01"
            prefix="$"
          />


        </FieldSection>

        <BeeijaWorkloadSummary>
          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              Gateway runtime:{" "}
              <strong>
                {formatVisibleNumber(
                  result.gatewayHours,
                )}{" "}
                gateway-hours
              </strong>
            </p>

            <p>
              Assigned instances:{" "}
              <strong>
                {formatVisibleInteger(
                  result.parsedProtectedInstances,
                )}
              </strong>
            </p>

            <p>
              Average instances per gateway:{" "}
              <strong>
                {formatVisibleNumber(
                  result.instancesPerGateway,
                )}
              </strong>
            </p>

            <p>
              Processed NAT traffic:{" "}
              <strong>
                {formatVisibleNumber(
                  result.processedTrafficGib,
                )}{" "}
                GiB
              </strong>
            </p>

            <p>
              Public IP runtime:{" "}
              <strong>
                {formatVisibleNumber(
                  result.publicIpHours,
                )}{" "}
                IP-hours
              </strong>
            </p>

            <p>
              Internet transfer out:{" "}
              <strong>
                {formatVisibleNumber(
                  result.parsedInternetEgressGib,
                )}{" "}
                GiB
              </strong>
            </p>
          </div>

        </BeeijaWorkloadSummary>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-950">
            Select Provider Configurations and Enter Prices
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Choose the provider plan to edit. Representative regional prices
            are prefilled and remain editable for the exact service, region,
            agreement, or invoice you are comparing.
          </p>
        </div>

        <div className="mt-6">
          <BeeijaProviderPlanTabs
            plans={plans.map((plan, index) => ({
              id: plan.id,
              label: `Plan ${index + 1}`,
              title: plan.providerName,
              subtitle: plan.regionLabel,
            }))}
            activePlanId={activeEditorPlanId}
            onChange={setActiveEditorPlanId}
            ariaLabel="NAT gateway comparison plans"
          />

          <div
            className="mt-5"
            role="tabpanel"
            aria-label={`NAT gateway comparison plan ${activeEditorPlanNumber}`}
          >
            <ProviderPlanCard
              key={activeEditorPlan.id}
              planNumber={activeEditorPlanNumber}
              plan={activeEditorPlan}
              onChange={(field, value) =>
                updatePlan(
                  activeEditorPlan.id,
                  field,
                  value,
                )
              }
            />
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Select Plan 1, 2, 3, or 4 above to edit it. All four plans remain
            included in the ranked comparison.
          </p>
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
      </BeeijaComparisonInputPanel>

      <BeeijaComparisonResultColumn>
        <BeeijaCalculatorResultPanel
          title="NAT Gateway Cost Comparison"
          description="Select a plan for a detailed breakdown. Configured plans are ranked by monthly planning cost."
          primaryLabel="Estimated monthly planning cost"
          primaryValue={
            selectedResult.configured
              ? formatVisibleMoney(
                  selectedResult.monthlyPlanningCost,
                )
              : "Enter provider prices"
          }
          provider="AWS NAT Gateway, Azure NAT Gateway StandardV2, and Google Cloud Public NAT representative US-region pricing"
          pricingCheckedDate="29 June 2026"
          excludedCosts="taxes, currency conversion, negotiated discounts, services accessed through private endpoints, traffic classes not entered here, firewall or transit gateway charges, DNS, monitoring beyond the entered estimate, and provider-specific transfer charges not entered"
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
                label="Cost per processed GiB"
                value={
                  selectedResult.configured
                    ? formatVisibleMoney(
                        selectedResult.costPerProcessedGib,
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
                  {selectedResult.providerName} · {selectedResult.regionLabel}
                </p>
                <p className="mt-1">{selectedResult.serviceName}</p>
                <p className="mt-1">
                  {formatVisibleNumber(
                    selectedResult.gatewayHours,
                  )} gateway-hours · {formatVisibleNumber(
                    selectedResult.processedTrafficGib,
                  )} processed GiB · {formatVisibleNumber(
                    selectedResult.publicIpHours,
                  )} public IP-hours
                </p>
              </div>

              <div className="space-y-3">
                {breakdownItems.map((item) => (
                  <BreakdownRow
                    key={item.label}
                    {...item}
                  />
                ))}
              </div>

              <ComparisonTable rows={result.rankedPlans} />
            </div>
          }
          totals={
            <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
              <p>
                Selected plan:{" "}
                <span className="font-medium text-gray-900">
                  {selectedResult.providerName} · {selectedResult.serviceName}
                </span>
              </p>

              <p className="mt-2">
                Region or pricing scope:{" "}
                <span className="font-medium text-gray-900">
                  {selectedResult.regionLabel}
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
                  {result.rankedPlans.length > 0
                    ? `${result.cheapest.providerName} · ${
                        result.cheapest.serviceName
                      } at ${formatVisibleMoney(
                        result.cheapest.monthlyPlanningCost,
                      )} per month`
                    : "Enter provider prices"}
                </span>
              </p>

              <p className="mt-2">
                Possible monthly saving:{" "}
                <span className="font-semibold text-[var(--green)]">
                  {selectedResult.configured &&
                  result.rankedPlans.length > 0
                    ? formatVisibleMoney(
                        result.monthlySavingVsSelected,
                      )
                    : "—"}
                </span>
              </p>

              <p className="mt-2">
                Possible first-year saving:{" "}
                <span className="font-semibold text-[var(--green)]">
                  {selectedResult.configured &&
                  result.rankedPlans.length > 0
                    ? formatVisibleMoney(
                        result.firstYearSavingVsSelected,
                      )
                    : "—"}
                </span>
              </p>

              <p className="mt-2">
                Selected plan price inputs entered:{" "}
                <span className="font-medium text-gray-900">
                  {selectedResult.enteredPriceCount}
                </span>
              </p>

              <p className="mt-2">
                Budget status:{" "}
                <span
                  className={`font-semibold ${
                    selectedResult.configured &&
                    result.parsedBudget > 0 &&
                    selectedResult.budgetDifference < 0
                      ? "text-red-700"
                      : "text-[var(--green)]"
                  }`}
                >
                  {result.parsedBudget <= 0
                    ? "Add a budget to compare"
                    : !selectedResult.configured
                      ? "Enter the selected provider prices"
                      : selectedResult.budgetDifference >= 0
                        ? `${formatVisibleMoney(
                            selectedResult.budgetDifference,
                          )} remaining`
                        : `${formatVisibleMoney(
                            Math.abs(
                              selectedResult.budgetDifference,
                            ),
                          )} over budget`}
                </span>
              </p>
            </div>
          }
        />
      </BeeijaComparisonResultColumn>
    </BeeijaComparisonCalculatorLayout>
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
  planNumber,
  plan,
  onChange,
}: {
  planNumber: number;
  plan: PlanInput;
  onChange: (
    field: keyof PlanInput,
    value: string,
  ) => void;
}) {
  const pricingModeOptions: Option[] = [
    {
      value: "per-gateway",
      label: "Direct hourly price per gateway",
    },
    {
      value: "per-instance-capped",
      label:
        "Per assigned instance, then capped per gateway",
    },
  ];

  return (
    <section className="min-w-0 rounded-2xl border border-gray-200 bg-[#F9FBFA] p-5 md:p-6">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--yellow-dark)]">
          Plan {planNumber}
        </p>

        <h3 className="mt-1 break-words text-xl font-semibold text-gray-950 [overflow-wrap:anywhere]">
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
            onChange(
              "regionLabel",
              value,
            )
          }
        />

        <TextField
          label="Service or plan name"
          value={plan.serviceName}
          onChange={(value) =>
            onChange(
              "serviceName",
              value,
            )
          }
        />

        <BeeijaSelect
          label="Gateway runtime pricing method"
          value={plan.gatewayPricingMode}
          onChange={(event) =>
            onChange(
              "gatewayPricingMode",
              event.target.value,
            )
          }
          options={pricingModeOptions}
        />

        {plan.gatewayPricingMode ===
        "per-gateway" ? (
          <BeeijaNumberField
            label="Gateway price per hour"
            value={plan.gatewayHourlyRate}
            onChange={(value) =>
              onChange(
                "gatewayHourlyRate",
                value,
              )
            }
            min="0"
            step="0.000001"
            prefix="$"
          />
        ) : (
          <BeeijaNumberField
            label="Assigned instance price per hour"
            value={
              plan.perInstanceHourlyRate
            }
            onChange={(value) =>
              onChange(
                "perInstanceHourlyRate",
                value,
              )
            }
            min="0"
            step="0.000001"
            prefix="$"
          />
        )}

        {plan.gatewayPricingMode ===
          "per-instance-capped" && (
          <>
            <BeeijaNumberField
              label="Instance threshold per gateway"
              value={
                plan.instanceThresholdPerGateway
              }
              onChange={(value) =>
                onChange(
                  "instanceThresholdPerGateway",
                  value,
                )
              }
              min="1"
              step="1"
              suffix="instances"
            />

            <BeeijaNumberField
              label="Gateway hourly price above threshold"
              value={
                plan.cappedGatewayHourlyRate
              }
              onChange={(value) =>
                onChange(
                  "cappedGatewayHourlyRate",
                  value,
                )
              }
              min="0"
              step="0.000001"
              prefix="$"
            />
          </>
        )}

        <BeeijaNumberField
          label="NAT data processing price per GiB"
          value={
            plan.dataProcessingRatePerGib
          }
          onChange={(value) =>
            onChange(
              "dataProcessingRatePerGib",
              value,
            )
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Public IPv4 price per IP-hour"
          value={plan.publicIpHourlyRate}
          onChange={(value) =>
            onChange(
              "publicIpHourlyRate",
              value,
            )
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Internet transfer-out price per GiB"
          value={
            plan.internetEgressRatePerGib
          }
          onChange={(value) =>
            onChange(
              "internetEgressRatePerGib",
              value,
            )
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Cross-zone or regional transfer price per GiB"
          value={
            plan.crossZoneTransferRatePerGib
          }
          onChange={(value) =>
            onChange(
              "crossZoneTransferRatePerGib",
              value,
            )
          }
          min="0"
          step="0.000001"
          prefix="$"
        />

        <BeeijaNumberField
          label="Estimated monthly flow-log cost"
          value={plan.flowLogsMonthlyCost}
          onChange={(value) =>
            onChange(
              "flowLogsMonthlyCost",
              value,
            )
          }
          min="0"
          step="0.01"
          prefix="$"
        />

        <BeeijaNumberField
          label="Other fixed monthly cost"
          value={plan.fixedMonthlyCost}
          onChange={(value) =>
            onChange(
              "fixedMonthlyCost",
              value,
            )
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
          value={
            plan.migrationAmortizationMonths
          }
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
        ) =>
          onChange(event.target.value)
        }
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
}: BreakdownItem) {
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
        {entered
          ? formatVisibleMoney(value)
          : "—"}
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
    <p className="min-w-0 break-words [overflow-wrap:anywhere]">
      {label}:{" "}
      <span className="font-semibold text-[var(--green)]">
        {ready
          ? value
          : "Enter provider prices"}
      </span>
    </p>
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
          <span>Gateway</span>
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
                  {row.enteredPriceCount} price
                  inputs entered
                </p>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 xl:contents">
                <ComparisonValue
                  label="Gateway"
                  value={formatVisibleMoney(
                    row.gatewayCost,
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

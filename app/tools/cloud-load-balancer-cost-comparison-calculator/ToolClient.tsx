"use client";

import {
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";
import BeeijaComparisonCalculatorLayout, {
  BeeijaComparisonInputPanel,
  BeeijaComparisonResultColumn,
} from "@/app/components/BeeijaComparisonCalculatorLayout";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaProviderPlanTabs from "@/app/components/BeeijaProviderPlanTabs";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaWorkloadSummary from "@/app/components/BeeijaWorkloadSummary";

type PricingMode = "aws-alb-lcu" | "azure-capacity-unit" | "gcp-forwarding-data" | "custom";

type Option = {
  value: string;
  label: string;
};

type PlanInput = {
  id: string;
  providerName: string;
  serviceName: string;
  regionLabel: string;
  pricingMode: PricingMode;
  baseHourlyRate: string;
  usageUnitHourlyRate: string;
  dataProcessingRatePerGib: string;
  forwardingRuleBaseHourlyRate: string;
  additionalForwardingRuleHourlyRate: string;
  includedForwardingRules: string;
  internetEgressRatePerGib: string;
  wafMonthlyCost: string;
  loggingMonthlyCost: string;
  fixedMonthlyCost: string;
  oneTimeMigrationCost: string;
  migrationAmortizationMonths: string;
};

type PlanResult = {
  id: string;
  providerName: string;
  serviceName: string;
  regionLabel: string;
  pricingMode: PricingMode;
  configured: boolean;
  loadBalancerHours: number;
  processedTrafficGib: number;
  awsLcuCount: number;
  usageUnitCount: number;
  forwardingRuleHours: number;
  baseRuntimeCost: number;
  usageUnitCost: number;
  dataProcessingCost: number;
  forwardingRuleCost: number;
  internetEgressCost: number;
  wafCost: number;
  loggingCost: number;
  fixedMonthlyCost: number;
  monthlyOperatingCost: number;
  amortizedMigrationCost: number;
  monthlyPlanningCost: number;
  firstYearCost: number;
  costPerProcessedGib: number;
  costPerLoadBalancer: number;
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
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
];

const pricingModeOptions: Option[] = [
  { value: "aws-alb-lcu", label: "AWS ALB hours + LCU estimate" },
  { value: "azure-capacity-unit", label: "Gateway hours + capacity units" },
  { value: "gcp-forwarding-data", label: "Forwarding rules + processed data" },
  { value: "custom", label: "Custom hourly and traffic model" },
];

const initialPlans: PlanInput[] = [
  {
    id: "aws-application-load-balancer",
    providerName: "Amazon Web Services",
    serviceName: "AWS Application Load Balancer",
    regionLabel: "US East (N. Virginia)",
    pricingMode: "aws-alb-lcu",
    baseHourlyRate: "0.0225",
    usageUnitHourlyRate: "0.008",
    dataProcessingRatePerGib: "0",
    forwardingRuleBaseHourlyRate: "0",
    additionalForwardingRuleHourlyRate: "0",
    includedForwardingRules: "0",
    internetEgressRatePerGib: "",
    wafMonthlyCost: "0",
    loggingMonthlyCost: "0",
    fixedMonthlyCost: "0",
    oneTimeMigrationCost: "0",
    migrationAmortizationMonths: "12",
  },
  {
    id: "azure-application-gateway",
    providerName: "Microsoft Azure",
    serviceName: "Azure Application Gateway Standard v2",
    regionLabel: "East US",
    pricingMode: "azure-capacity-unit",
    baseHourlyRate: "0.246",
    usageUnitHourlyRate: "0.0091",
    dataProcessingRatePerGib: "0",
    forwardingRuleBaseHourlyRate: "0",
    additionalForwardingRuleHourlyRate: "0",
    includedForwardingRules: "0",
    internetEgressRatePerGib: "",
    wafMonthlyCost: "0",
    loggingMonthlyCost: "0",
    fixedMonthlyCost: "0",
    oneTimeMigrationCost: "0",
    migrationAmortizationMonths: "12",
  },
  {
    id: "google-cloud-load-balancing",
    providerName: "Google Cloud",
    serviceName: "External Application Load Balancer",
    regionLabel: "Iowa (us-central1)",
    pricingMode: "gcp-forwarding-data",
    baseHourlyRate: "0",
    usageUnitHourlyRate: "0",
    dataProcessingRatePerGib: "0.008",
    forwardingRuleBaseHourlyRate: "0.025",
    additionalForwardingRuleHourlyRate: "0.01",
    includedForwardingRules: "5",
    internetEgressRatePerGib: "",
    wafMonthlyCost: "0",
    loggingMonthlyCost: "0",
    fixedMonthlyCost: "0",
    oneTimeMigrationCost: "0",
    migrationAmortizationMonths: "12",
  },
  {
    id: "custom-load-balancer",
    providerName: "Custom provider",
    serviceName: "Custom load balancer or self-managed proxy",
    regionLabel: "Your region or design",
    pricingMode: "custom",
    baseHourlyRate: "",
    usageUnitHourlyRate: "",
    dataProcessingRatePerGib: "",
    forwardingRuleBaseHourlyRate: "0",
    additionalForwardingRuleHourlyRate: "0",
    includedForwardingRules: "0",
    internetEgressRatePerGib: "",
    wafMonthlyCost: "0",
    loggingMonthlyCost: "0",
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
    plan.baseHourlyRate,
    plan.usageUnitHourlyRate,
    plan.dataProcessingRatePerGib,
    plan.forwardingRuleBaseHourlyRate,
    plan.additionalForwardingRuleHourlyRate,
    plan.internetEgressRatePerGib,
    plan.wafMonthlyCost,
    plan.loggingMonthlyCost,
    plan.fixedMonthlyCost,
  ].filter((value) => value.trim() !== "").length;
}

function isPlanConfigured(plan: PlanInput) {
  if (plan.pricingMode === "aws-alb-lcu") {
    return (
      plan.baseHourlyRate.trim() !== "" &&
      plan.usageUnitHourlyRate.trim() !== ""
    );
  }

  if (plan.pricingMode === "azure-capacity-unit") {
    return (
      plan.baseHourlyRate.trim() !== "" &&
      plan.usageUnitHourlyRate.trim() !== ""
    );
  }

  if (plan.pricingMode === "gcp-forwarding-data") {
    return (
      plan.forwardingRuleBaseHourlyRate.trim() !== "" &&
      plan.additionalForwardingRuleHourlyRate.trim() !== "" &&
      plan.dataProcessingRatePerGib.trim() !== ""
    );
  }

  return (
    plan.baseHourlyRate.trim() !== "" ||
    plan.usageUnitHourlyRate.trim() !== "" ||
    plan.dataProcessingRatePerGib.trim() !== "" ||
    plan.forwardingRuleBaseHourlyRate.trim() !== "" ||
    plan.internetEgressRatePerGib.trim() !== "" ||
    plan.fixedMonthlyCost.trim() !== ""
  );
}

export default function ToolClient() {
  const [loadBalancerCount, setLoadBalancerCount] = useState("1");
  const [activeHoursPerMonth, setActiveHoursPerMonth] = useState("730");
  const [newConnectionsPerSecond, setNewConnectionsPerSecond] = useState("20");
  const [activeConnectionsPerMinute, setActiveConnectionsPerMinute] =
    useState("1000");
  const [requestsPerSecond, setRequestsPerSecond] = useState("50");
  const [rulesEvaluatedPerRequest, setRulesEvaluatedPerRequest] = useState("5");
  const [inboundProcessedGib, setInboundProcessedGib] = useState("500");
  const [outboundProcessedGib, setOutboundProcessedGib] = useState("500");
  const [averageCapacityUnits, setAverageCapacityUnits] = useState("3");
  const [forwardingRuleCount, setForwardingRuleCount] = useState("2");
  const [internetEgressGib, setInternetEgressGib] = useState("400");
  const [includeWaf, setIncludeWaf] = useState("no");
  const [includeLogging, setIncludeLogging] = useState("no");
  const [monthlyBudget, setMonthlyBudget] = useState("100");
  const [selectedPlanId, setSelectedPlanId] = useState(
    "aws-application-load-balancer",
  );
  const [activeEditorPlanId, setActiveEditorPlanId] = useState(
    "aws-application-load-balancer",
  );
  const [plans, setPlans] = useState(initialPlans);

  const result = useMemo(() => {
    const parsedLoadBalancerCount = Math.max(
      0,
      Math.floor(toNumber(loadBalancerCount)),
    );
    const parsedActiveHours = Math.min(
      HOURS_IN_PLANNING_MONTH,
      toNumber(activeHoursPerMonth),
    );
    const parsedNewConnectionsPerSecond = toNumber(newConnectionsPerSecond);
    const parsedActiveConnectionsPerMinute = toNumber(activeConnectionsPerMinute);
    const parsedRequestsPerSecond = toNumber(requestsPerSecond);
    const parsedRulesEvaluatedPerRequest = toNumber(rulesEvaluatedPerRequest);
    const parsedInboundProcessedGib = toNumber(inboundProcessedGib);
    const parsedOutboundProcessedGib = toNumber(outboundProcessedGib);
    const parsedAverageCapacityUnits = toNumber(averageCapacityUnits);
    const parsedForwardingRuleCount = Math.max(
      0,
      Math.floor(toNumber(forwardingRuleCount)),
    );
    const parsedInternetEgressGib = toNumber(internetEgressGib);
    const parsedBudget = toNumber(monthlyBudget);

    const loadBalancerHours = parsedLoadBalancerCount * parsedActiveHours;
    const processedTrafficGib =
      parsedInboundProcessedGib + parsedOutboundProcessedGib;
    const processedGibPerHour =
      parsedActiveHours > 0 ? processedTrafficGib / parsedActiveHours : 0;
    const freeRuleEvaluationsPerRequest = 10;
    const billableRuleEvaluationsPerSecond =
      parsedRequestsPerSecond *
      Math.max(0, parsedRulesEvaluatedPerRequest - freeRuleEvaluationsPerRequest);

    const awsNewConnectionLcu = parsedNewConnectionsPerSecond / 25;
    const awsActiveConnectionLcu = parsedActiveConnectionsPerMinute / 3000;
    const awsProcessedBytesLcu = processedGibPerHour;
    const awsRuleEvaluationLcu = billableRuleEvaluationsPerSecond / 1000;
    const awsLcuCount = Math.max(
      awsNewConnectionLcu,
      awsActiveConnectionLcu,
      awsProcessedBytesLcu,
      awsRuleEvaluationLcu,
    );

    const planResults: PlanResult[] = plans.map((plan) => {
      const baseHourlyRate = toNumber(plan.baseHourlyRate);
      const usageUnitHourlyRate = toNumber(plan.usageUnitHourlyRate);
      const dataProcessingRate = toNumber(plan.dataProcessingRatePerGib);
      const forwardingRuleBaseHourlyRate = toNumber(
        plan.forwardingRuleBaseHourlyRate,
      );
      const additionalForwardingRuleHourlyRate = toNumber(
        plan.additionalForwardingRuleHourlyRate,
      );
      const includedForwardingRules = Math.max(
        0,
        Math.floor(toNumber(plan.includedForwardingRules)),
      );
      const internetEgressRate = toNumber(plan.internetEgressRatePerGib);
      const wafMonthlyCost = toNumber(plan.wafMonthlyCost);
      const loggingMonthlyCost = toNumber(plan.loggingMonthlyCost);
      const fixedMonthlyCost = toNumber(plan.fixedMonthlyCost);
      const oneTimeMigrationCost = toNumber(plan.oneTimeMigrationCost);
      const migrationAmortizationMonths = Math.max(
        1,
        toNumber(plan.migrationAmortizationMonths),
      );

      let usageUnitCount = 0;
      let baseRuntimeCost = loadBalancerHours * baseHourlyRate;
      let usageUnitCost = 0;
      let dataProcessingCost = 0;
      let forwardingRuleCost = 0;

      if (plan.pricingMode === "aws-alb-lcu") {
        usageUnitCount = awsLcuCount * parsedLoadBalancerCount;
        usageUnitCost = usageUnitCount * parsedActiveHours * usageUnitHourlyRate;
      } else if (plan.pricingMode === "azure-capacity-unit") {
        usageUnitCount = parsedAverageCapacityUnits * parsedLoadBalancerCount;
        usageUnitCost = usageUnitCount * parsedActiveHours * usageUnitHourlyRate;
      } else if (plan.pricingMode === "gcp-forwarding-data") {
        baseRuntimeCost = 0;
        usageUnitCount = parsedForwardingRuleCount;
        const additionalRules = Math.max(
          0,
          parsedForwardingRuleCount - includedForwardingRules,
        );
        forwardingRuleCost =
          parsedForwardingRuleCount > 0
            ? (forwardingRuleBaseHourlyRate +
                additionalRules * additionalForwardingRuleHourlyRate) *
              parsedActiveHours
            : 0;
        dataProcessingCost = processedTrafficGib * dataProcessingRate;
      } else {
        usageUnitCount = parsedAverageCapacityUnits * parsedLoadBalancerCount;
        usageUnitCost = usageUnitCount * parsedActiveHours * usageUnitHourlyRate;
        dataProcessingCost = processedTrafficGib * dataProcessingRate;
        forwardingRuleCost =
          parsedForwardingRuleCount * forwardingRuleBaseHourlyRate * parsedActiveHours;
      }

      const internetEgressCost = parsedInternetEgressGib * internetEgressRate;
      const wafCost = includeWaf === "yes" ? wafMonthlyCost : 0;
      const loggingCost = includeLogging === "yes" ? loggingMonthlyCost : 0;
      const monthlyOperatingCost =
        baseRuntimeCost +
        usageUnitCost +
        dataProcessingCost +
        forwardingRuleCost +
        internetEgressCost +
        wafCost +
        loggingCost +
        fixedMonthlyCost;
      const amortizedMigrationCost =
        oneTimeMigrationCost / migrationAmortizationMonths;
      const monthlyPlanningCost = monthlyOperatingCost + amortizedMigrationCost;
      const firstYearCost = monthlyOperatingCost * 12 + oneTimeMigrationCost;

      return {
        id: plan.id,
        providerName: plan.providerName,
        serviceName: plan.serviceName,
        regionLabel: plan.regionLabel,
        pricingMode: plan.pricingMode,
        configured: isPlanConfigured(plan),
        loadBalancerHours,
        processedTrafficGib,
        awsLcuCount,
        usageUnitCount,
        forwardingRuleHours: parsedForwardingRuleCount * parsedActiveHours,
        baseRuntimeCost,
        usageUnitCost,
        dataProcessingCost,
        forwardingRuleCost,
        internetEgressCost,
        wafCost,
        loggingCost,
        fixedMonthlyCost,
        monthlyOperatingCost,
        amortizedMigrationCost,
        monthlyPlanningCost,
        firstYearCost,
        costPerProcessedGib:
          processedTrafficGib > 0 ? monthlyOperatingCost / processedTrafficGib : 0,
        costPerLoadBalancer:
          parsedLoadBalancerCount > 0
            ? monthlyOperatingCost / parsedLoadBalancerCount
            : 0,
        budgetDifference: parsedBudget - monthlyPlanningCost,
        enteredPriceCount: countEnteredPrices(plan),
      };
    });

    const configuredPlans = planResults.filter((plan) => plan.configured);
    const rankedPlans = [...configuredPlans].sort(
      (left, right) =>
        left.monthlyPlanningCost - right.monthlyPlanningCost ||
        plans.findIndex((plan) => plan.id === left.id) -
          plans.findIndex((plan) => plan.id === right.id),
    );
    const selectedResult =
      planResults.find((plan) => plan.id === selectedPlanId) ??
      rankedPlans[0] ??
      planResults[0];
    const cheapest = rankedPlans[0] ?? selectedResult;

    return {
      parsedLoadBalancerCount,
      parsedActiveHours,
      parsedNewConnectionsPerSecond,
      parsedActiveConnectionsPerMinute,
      parsedRequestsPerSecond,
      parsedRulesEvaluatedPerRequest,
      parsedInboundProcessedGib,
      parsedOutboundProcessedGib,
      parsedAverageCapacityUnits,
      parsedForwardingRuleCount,
      parsedInternetEgressGib,
      parsedBudget,
      loadBalancerHours,
      processedTrafficGib,
      processedGibPerHour,
      billableRuleEvaluationsPerSecond,
      awsNewConnectionLcu,
      awsActiveConnectionLcu,
      awsProcessedBytesLcu,
      awsRuleEvaluationLcu,
      awsLcuCount,
      planResults,
      rankedPlans,
      selectedResult,
      cheapest,
      monthlySavingVsSelected: Math.max(
        0,
        selectedResult.monthlyPlanningCost - cheapest.monthlyPlanningCost,
      ),
      firstYearSavingVsSelected: Math.max(
        0,
        selectedResult.firstYearCost - cheapest.firstYearCost,
      ),
    };
  }, [
    loadBalancerCount,
    activeHoursPerMonth,
    newConnectionsPerSecond,
    activeConnectionsPerMinute,
    requestsPerSecond,
    rulesEvaluatedPerRequest,
    inboundProcessedGib,
    outboundProcessedGib,
    averageCapacityUnits,
    forwardingRuleCount,
    internetEgressGib,
    includeWaf,
    includeLogging,
    monthlyBudget,
    selectedPlanId,
    plans,
  ]);

  const planOptions: Option[] = plans.map((plan) => ({
    value: plan.id,
    label: `${plan.providerName} — ${plan.serviceName}`,
  }));

  const activeEditorPlan =
    plans.find((plan) => plan.id === activeEditorPlanId) ?? plans[0];
  const activeEditorPlanNumber =
    Math.max(
      0,
      plans.findIndex((plan) => plan.id === activeEditorPlan.id),
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
    setLoadBalancerCount("1");
    setActiveHoursPerMonth("730");
    setNewConnectionsPerSecond("20");
    setActiveConnectionsPerMinute("1000");
    setRequestsPerSecond("50");
    setRulesEvaluatedPerRequest("5");
    setInboundProcessedGib("500");
    setOutboundProcessedGib("500");
    setAverageCapacityUnits("3");
    setForwardingRuleCount("2");
    setInternetEgressGib("400");
    setIncludeWaf("no");
    setIncludeLogging("no");
    setMonthlyBudget("100");
    setSelectedPlanId("aws-application-load-balancer");
    setActiveEditorPlanId("aws-application-load-balancer");
    setPlans(initialPlans);
  };

  const selectedResult = result.selectedResult;
  const selectedPlan =
    plans.find((plan) => plan.id === selectedResult.id) ?? plans[0];

  const breakdownItems: BreakdownItem[] = [
    {
      label: "Base load balancer runtime",
      detail: `${formatVisibleNumber(result.loadBalancerHours)} load balancer-hours`,
      value: selectedResult.baseRuntimeCost,
      entered: selectedPlan.baseHourlyRate.trim() !== "",
    },
    {
      label: "Capacity, LCU, or usage units",
      detail: getUsageUnitDetail(selectedResult, result),
      value: selectedResult.usageUnitCost,
      entered: selectedPlan.usageUnitHourlyRate.trim() !== "",
    },
    {
      label: "Forwarding rules",
      detail: `${formatVisibleInteger(result.parsedForwardingRuleCount)} rules across ${formatVisibleNumber(result.parsedActiveHours)} hours`,
      value: selectedResult.forwardingRuleCost,
      entered:
        selectedPlan.forwardingRuleBaseHourlyRate.trim() !== "" ||
        selectedPlan.additionalForwardingRuleHourlyRate.trim() !== "",
    },
    {
      label: "Load balancer data processing",
      detail: `${formatVisibleNumber(result.processedTrafficGib)} GiB entered`,
      value: selectedResult.dataProcessingCost,
      entered: selectedPlan.dataProcessingRatePerGib.trim() !== "",
    },
    {
      label: "Internet transfer out",
      detail: `${formatVisibleNumber(result.parsedInternetEgressGib)} GiB`,
      value: selectedResult.internetEgressCost,
      entered: selectedPlan.internetEgressRatePerGib.trim() !== "",
    },
    {
      label: "WAF",
      detail: includeWaf === "yes" ? "Monthly WAF estimate included" : "Not included",
      value: selectedResult.wafCost,
      entered: includeWaf === "yes",
    },
    {
      label: "Logging and monitoring",
      detail:
        includeLogging === "yes"
          ? "Monthly logging estimate included"
          : "Not included",
      value: selectedResult.loggingCost,
      entered: includeLogging === "yes",
    },
    {
      label: "Other fixed monthly cost",
      detail: "Support allocation, certificates, routing, or other recurring items",
      value: selectedResult.fixedMonthlyCost,
      entered: true,
    },
  ];

  return (
    <BeeijaComparisonCalculatorLayout>
      <BeeijaComparisonInputPanel>
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-950">
              Enter the Shared Load Balancer Workload
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Use the same runtime, traffic shape, forwarding rules, WAF,
              logging, and transfer assumptions for every provider plan.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <BeeijaNumberField
              label="Load balancers"
              value={loadBalancerCount}
              onChange={setLoadBalancerCount}
              min="0"
              step="1"
            />
            <BeeijaNumberField
              label="Active hours per month"
              value={activeHoursPerMonth}
              onChange={setActiveHoursPerMonth}
              min="0"
              max="730"
              step="1"
              suffix="hours"
            />
            <BeeijaNumberField
              label="New connections per second"
              value={newConnectionsPerSecond}
              onChange={setNewConnectionsPerSecond}
              min="0"
              step="1"
            />
            <BeeijaNumberField
              label="Active connections per minute"
              value={activeConnectionsPerMinute}
              onChange={setActiveConnectionsPerMinute}
              min="0"
              step="1"
            />
            <BeeijaNumberField
              label="Requests per second"
              value={requestsPerSecond}
              onChange={setRequestsPerSecond}
              min="0"
              step="1"
            />
            <BeeijaNumberField
              label="Rules evaluated per request"
              value={rulesEvaluatedPerRequest}
              onChange={setRulesEvaluatedPerRequest}
              min="0"
              step="1"
            />
            <BeeijaNumberField
              label="Inbound data processed"
              value={inboundProcessedGib}
              onChange={setInboundProcessedGib}
              min="0"
              step="1"
              suffix="GiB/month"
            />
            <BeeijaNumberField
              label="Outbound data processed"
              value={outboundProcessedGib}
              onChange={setOutboundProcessedGib}
              min="0"
              step="1"
              suffix="GiB/month"
            />
            <BeeijaNumberField
              label="Average Azure-style capacity units"
              value={averageCapacityUnits}
              onChange={setAverageCapacityUnits}
              min="0"
              step="0.01"
              suffix="CU"
            />
            <BeeijaNumberField
              label="Google-style forwarding rules"
              value={forwardingRuleCount}
              onChange={setForwardingRuleCount}
              min="0"
              step="1"
            />
            <BeeijaNumberField
              label="Internet transfer out"
              value={internetEgressGib}
              onChange={setInternetEgressGib}
              min="0"
              step="1"
              suffix="GiB/month"
            />
            <BeeijaNumberField
              label="Monthly budget"
              value={monthlyBudget}
              onChange={setMonthlyBudget}
              min="0"
              step="0.01"
              prefix="$"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <BeeijaSelect
              label="Include WAF cost"
              value={includeWaf}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                setIncludeWaf(event.target.value)
              }
              options={yesNoOptions}
            />
            <BeeijaSelect
              label="Include logging cost"
              value={includeLogging}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                setIncludeLogging(event.target.value)
              }
              options={yesNoOptions}
            />
          </div>

          <BeeijaWorkloadSummary>
            <ComparisonLine
              label="Runtime"
              value={`${formatVisibleNumber(result.loadBalancerHours)} load balancer-hours`}
            />
            <ComparisonLine
              label="Processed traffic"
              value={`${formatVisibleNumber(result.processedTrafficGib)} GiB total`}
            />
            <ComparisonLine
              label="AWS simplified LCU estimate"
              value={`${formatVisibleNumber(result.awsLcuCount)} LCU/hour before multiplying by load balancers`}
            />
            <ComparisonLine
              label="Forwarding rules"
              value={`${formatVisibleInteger(result.parsedForwardingRuleCount)} rules`}
            />
            <ComparisonLine
              label="Internet transfer"
              value={`${formatVisibleNumber(result.parsedInternetEgressGib)} GiB`}
            />
          </BeeijaWorkloadSummary>
        </section>

        <section className="space-y-5 border-t border-gray-200 pt-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-950">
              Select Provider Configurations and Enter Prices
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Choose the provider plan to edit. Defaults are examples for a
              common public application load-balancing comparison and remain
              editable for the exact region, SKU, account, or contract.
            </p>
          </div>

          <BeeijaProviderPlanTabs
            plans={plans.map((plan, index) => ({
              id: plan.id,
              label: `Plan ${index + 1}`,
              title: plan.providerName,
              subtitle: plan.regionLabel,
            }))}
            activePlanId={activeEditorPlanId}
            onChange={setActiveEditorPlanId}
            ariaLabel="Load balancer comparison plans"
          />

          <ProviderPlanCard
            planNumber={activeEditorPlanNumber}
            plan={activeEditorPlan}
            onChange={(field, value) =>
              updatePlan(activeEditorPlan.id, field, value)
            }
          />

          <p className="text-xs leading-5 text-gray-500">
            Select Plan 1, 2, 3, or 4 above to edit it. All four plans remain
            included in the ranked comparison.
          </p>

          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-[var(--green)] px-5 py-2 text-sm font-medium text-[var(--green)] transition hover:bg-[#F5FAF7]"
          >
            Reset values
          </button>
        </section>
      </BeeijaComparisonInputPanel>

      <BeeijaComparisonResultColumn>
        <BeeijaCalculatorResultPanel
          title="Load Balancer Cost Estimate"
          description="Monthly planning cost for the selected provider, based on the shared traffic workload and editable provider prices."
          primaryLabel="Selected plan monthly estimate"
          primaryValue={
            selectedResult.configured
              ? formatVisibleMoney(selectedResult.monthlyPlanningCost)
              : "Enter provider prices"
          }
          stats={
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultStat
                label="Monthly operating cost"
                value={
                  selectedResult.configured
                    ? formatVisibleMoney(selectedResult.monthlyOperatingCost)
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
              <ResultStat
                label="Cost per processed GiB"
                value={
                  selectedResult.configured
                    ? formatVisibleMoney(selectedResult.costPerProcessedGib)
                    : "—"
                }
              />
              <ResultStat
                label="Cost per load balancer"
                value={
                  selectedResult.configured
                    ? formatVisibleMoney(selectedResult.costPerLoadBalancer)
                    : "—"
                }
              />
            </div>
          }
          breakdown={
            <div className="space-y-3">
              <BeeijaSelect
                label="Result plan"
                value={selectedPlanId}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedPlanId(event.target.value)
                }
                options={planOptions}
              />

              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {selectedResult.providerName} · {selectedResult.regionLabel}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-950">
                  {selectedResult.serviceName}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-600">
                  {formatVisibleNumber(selectedResult.loadBalancerHours)} hours ·{" "}
                  {formatVisibleNumber(selectedResult.processedTrafficGib)} processed
                  GiB · {formatVisibleInteger(result.parsedForwardingRuleCount)}
                  forwarding rules
                </p>
              </div>

              {breakdownItems.map((item) => (
                <BreakdownRow key={item.label} {...item} />
              ))}
            </div>
          }
          totals={
            <div className="space-y-3">
              <ComparisonValue
                label="Selected plan"
                value={`${selectedResult.providerName} · ${selectedResult.serviceName}`}
              />
              <ComparisonValue
                label="Region or pricing scope"
                value={selectedResult.regionLabel}
              />
              <ComparisonValue
                label="Monthly migration allocation"
                value={
                  selectedResult.configured
                    ? formatVisibleMoney(selectedResult.amortizedMigrationCost)
                    : "—"
                }
              />
              <ComparisonValue
                label="Lowest configured plan"
                value={
                  result.rankedPlans.length > 0
                    ? `${result.cheapest.providerName} at ${formatVisibleMoney(
                        result.cheapest.monthlyPlanningCost,
                      )} per month`
                    : "Enter provider prices"
                }
              />
              <ComparisonValue
                label="Possible monthly saving"
                value={
                  selectedResult.configured && result.rankedPlans.length > 0
                    ? formatVisibleMoney(result.monthlySavingVsSelected)
                    : "—"
                }
              />
              <ComparisonValue
                label="Possible first-year saving"
                value={
                  selectedResult.configured && result.rankedPlans.length > 0
                    ? formatVisibleMoney(result.firstYearSavingVsSelected)
                    : "—"
                }
              />
              <ComparisonValue
                label="Selected plan price inputs entered"
                value={formatVisibleInteger(selectedResult.enteredPriceCount)}
              />
              <div className="rounded-xl bg-[#FFFBEA] p-3 text-sm leading-6 text-gray-800">
                Budget status:{" "}
                <span
                  className={`font-semibold ${
                    selectedResult.configured && selectedResult.budgetDifference < 0
                      ? "text-red-700"
                      : "text-[var(--green)]"
                  }`}
                >
                  {result.parsedBudget <= 0
                    ? "Add a budget to compare"
                    : !selectedResult.configured
                      ? "Enter the selected provider prices"
                      : selectedResult.budgetDifference >= 0
                        ? `${formatVisibleMoney(selectedResult.budgetDifference)} remaining`
                        : `${formatVisibleMoney(
                            Math.abs(selectedResult.budgetDifference),
                          )} over budget`}
                </span>
              </div>
            </div>
          }
          provider="cloud load balancer"
          pricingCheckedDate="7 July 2026"
          excludedCosts="backend compute, CDN, DNS, certificates, taxes, negotiated discounts, private connectivity, provider-specific billing rules, and traffic paths not entered in this calculator"
        />

        <ComparisonTable rows={result.rankedPlans} />
      </BeeijaComparisonResultColumn>
    </BeeijaComparisonCalculatorLayout>
  );
}

function getUsageUnitDetail(
  selectedResult: PlanResult,
  result: {
    awsLcuCount: number;
    parsedAverageCapacityUnits: number;
    parsedActiveHours: number;
  },
) {
  if (selectedResult.pricingMode === "aws-alb-lcu") {
    return `${formatVisibleNumber(result.awsLcuCount)} estimated LCU/hour`;
  }

  if (selectedResult.pricingMode === "azure-capacity-unit") {
    return `${formatVisibleNumber(result.parsedAverageCapacityUnits)} capacity units for ${formatVisibleNumber(result.parsedActiveHours)} hours`;
  }

  if (selectedResult.pricingMode === "custom") {
    return `${formatVisibleNumber(selectedResult.usageUnitCount)} custom usage units`;
  }

  return "Not used by this provider model";
}

function ProviderPlanCard({
  planNumber,
  plan,
  onChange,
}: {
  planNumber: number;
  plan: PlanInput;
  onChange: (field: keyof PlanInput, value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
        Plan {planNumber}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-gray-950">
        {plan.providerName}
      </h3>
      <p className="mt-1 text-sm text-gray-600">{plan.serviceName}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <TextField
          label="Provider name"
          value={plan.providerName}
          onChange={(value: string) => onChange("providerName", value)}
        />
        <TextField
          label="Service or SKU name"
          value={plan.serviceName}
          onChange={(value: string) => onChange("serviceName", value)}
        />
        <TextField
          label="Region or pricing scope"
          value={plan.regionLabel}
          onChange={(value: string) => onChange("regionLabel", value)}
        />
        <BeeijaSelect
          label="Pricing model"
          value={plan.pricingMode}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            onChange("pricingMode", event.target.value)
          }
          options={pricingModeOptions}
        />
        <BeeijaNumberField
          label="Base hourly price"
          value={plan.baseHourlyRate}
          onChange={(value: string) => onChange("baseHourlyRate", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="LCU, capacity unit, or usage unit hourly price"
          value={plan.usageUnitHourlyRate}
          onChange={(value: string) => onChange("usageUnitHourlyRate", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Data processing price per GiB"
          value={plan.dataProcessingRatePerGib}
          onChange={(value: string) => onChange("dataProcessingRatePerGib", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Forwarding-rule base hourly price"
          value={plan.forwardingRuleBaseHourlyRate}
          onChange={(value: string) => onChange("forwardingRuleBaseHourlyRate", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Additional forwarding-rule hourly price"
          value={plan.additionalForwardingRuleHourlyRate}
          onChange={(value: string) => onChange("additionalForwardingRuleHourlyRate", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Included forwarding rules before extra price"
          value={plan.includedForwardingRules}
          onChange={(value: string) => onChange("includedForwardingRules", value)}
          min="0"
          step="1"
        />
        <BeeijaNumberField
          label="Internet transfer-out price per GiB"
          value={plan.internetEgressRatePerGib}
          onChange={(value: string) => onChange("internetEgressRatePerGib", value)}
          min="0"
          step="0.000001"
          prefix="$"
        />
        <BeeijaNumberField
          label="Monthly WAF cost"
          value={plan.wafMonthlyCost}
          onChange={(value: string) => onChange("wafMonthlyCost", value)}
          min="0"
          step="0.01"
          prefix="$"
        />
        <BeeijaNumberField
          label="Monthly logging cost"
          value={plan.loggingMonthlyCost}
          onChange={(value: string) => onChange("loggingMonthlyCost", value)}
          min="0"
          step="0.01"
          prefix="$"
        />
        <BeeijaNumberField
          label="Other fixed monthly cost"
          value={plan.fixedMonthlyCost}
          onChange={(value: string) => onChange("fixedMonthlyCost", value)}
          min="0"
          step="0.01"
          prefix="$"
        />
        <BeeijaNumberField
          label="One-time migration or setup cost"
          value={plan.oneTimeMigrationCost}
          onChange={(value: string) => onChange("oneTimeMigrationCost", value)}
          min="0"
          step="0.01"
          prefix="$"
        />
        <BeeijaNumberField
          label="Migration amortization months"
          value={plan.migrationAmortizationMonths}
          onChange={(value: string) => onChange("migrationAmortizationMonths", value)}
          min="1"
          step="1"
          suffix="months"
        />
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
    <label className="block text-sm font-medium text-gray-800">
      {label}
      <input
        type="text"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition hover:border-gray-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
      />
    </label>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#F5FAF7] p-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-gray-950">
        {value}
      </p>
    </div>
  );
}

function BreakdownRow({ label, detail, value, entered }: BreakdownItem) {
  return (
    <div className="rounded-xl border border-gray-200 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-950">{label}</p>
          <p className="mt-1 text-xs leading-5 text-gray-600">{detail}</p>
        </div>
        <p className="break-words text-sm font-semibold text-gray-950">
          {entered ? formatVisibleMoney(value) : "—"}
        </p>
      </div>
    </div>
  );
}

function ComparisonLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      {label}: <span className="font-semibold text-gray-950">{value}</span>
    </p>
  );
}

function ComparisonValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-3 text-sm leading-6 shadow-sm ring-1 ring-gray-100">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
        {label}
      </p>
      <p className="mt-1 break-words font-semibold text-gray-950">{value}</p>
    </div>
  );
}

function ComparisonTable({ rows }: { rows: PlanResult[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-950">
        Ranked provider comparison
      </h3>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        Only configured plans are ranked. Blank provider price fields are treated
        as costs you still need to enter.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              <th className="py-3 pr-4">Plan</th>
              <th className="py-3 pr-4">Model</th>
              <th className="py-3 pr-4">Monthly</th>
              <th className="py-3 pr-4">First year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="py-3 pr-4 align-top">
                  <p className="font-medium text-gray-950">
                    {index === 0 ? "Lowest configured · " : ""}
                    {row.providerName}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">{row.serviceName}</p>
                </td>
                <td className="py-3 pr-4 align-top text-gray-700">
                  <p>{getPricingModeLabel(row.pricingMode)}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {row.regionLabel} · {row.enteredPriceCount} price inputs
                  </p>
                </td>
                <td className="py-3 pr-4 align-top font-semibold text-gray-950">
                  {formatVisibleMoney(row.monthlyPlanningCost)}
                </td>
                <td className="py-3 pr-4 align-top text-gray-700">
                  {formatVisibleMoney(row.firstYearCost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-xl bg-[#FFFBEA] p-3 text-sm text-gray-700">
          Enter provider prices for at least one plan to see a ranked comparison.
        </p>
      ) : null}
    </div>
  );
}

function getPricingModeLabel(mode: PricingMode) {
  if (mode === "aws-alb-lcu") {
    return "ALB hours + LCU";
  }

  if (mode === "azure-capacity-unit") {
    return "Gateway hours + capacity units";
  }

  if (mode === "gcp-forwarding-data") {
    return "Forwarding rules + processed data";
  }

  return "Custom model";
}

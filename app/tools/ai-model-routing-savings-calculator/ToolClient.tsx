"use client";

import { useMemo, useState, type ReactNode } from "react";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type CostRow = {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
};

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function clampPercent(value: string) {
  return Math.min(100, Math.max(0, toNumber(value)));
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "$0.00";

  if (value > 0 && value < 0.01) {
    return `$${value.toFixed(6)}`;
  }

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

function formatVisibleNumber(value: number) {
  return formatNumber(value).replace(/,/g, ",\u200B");
}

function formatVisibleInteger(value: number) {
  return formatInteger(value).replace(/,/g, ",\u200B");
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

type ScenarioInput = {
  requests: number;
  inputTokensPerRequest: number;
  outputTokensPerRequest: number;
  lowCostRouteShare: number;
  lowCostPassRate: number;
  fallbackCoverage: number;
  retryMultiplier: number;
  premiumInputPrice: number;
  premiumOutputPrice: number;
  lowCostInputPrice: number;
  lowCostOutputPrice: number;
  routerPricePerThousand: number;
  platformFeePercent: number;
  fixedMonthlyCost: number;
  amortisedSetupCost: number;
};

function calculateScenario(input: ScenarioInput) {
  const routedLowCostRequests =
    input.requests * input.lowCostRouteShare;
  const directPremiumRequests =
    input.requests - routedLowCostRequests;

  const lowCostPassedRequests =
    routedLowCostRequests * input.lowCostPassRate;
  const lowCostFailedRequests =
    routedLowCostRequests - lowCostPassedRequests;

  const premiumFallbackRequests =
    lowCostFailedRequests * input.fallbackCoverage;
  const unresolvedRequests =
    lowCostFailedRequests - premiumFallbackRequests;

  const lowCostModelCalls =
    routedLowCostRequests * input.retryMultiplier;
  const directPremiumModelCalls =
    directPremiumRequests * input.retryMultiplier;
  const premiumFallbackModelCalls =
    premiumFallbackRequests * input.retryMultiplier;

  const lowCostInputTokens =
    lowCostModelCalls * input.inputTokensPerRequest;
  const lowCostOutputTokens =
    lowCostModelCalls * input.outputTokensPerRequest;

  const directPremiumInputTokens =
    directPremiumModelCalls * input.inputTokensPerRequest;
  const directPremiumOutputTokens =
    directPremiumModelCalls * input.outputTokensPerRequest;

  const premiumFallbackInputTokens =
    premiumFallbackModelCalls * input.inputTokensPerRequest;
  const premiumFallbackOutputTokens =
    premiumFallbackModelCalls * input.outputTokensPerRequest;

  const lowCostModelCost =
    (lowCostInputTokens / 1_000_000) * input.lowCostInputPrice +
    (lowCostOutputTokens / 1_000_000) * input.lowCostOutputPrice;

  const directPremiumCost =
    (directPremiumInputTokens / 1_000_000) *
      input.premiumInputPrice +
    (directPremiumOutputTokens / 1_000_000) *
      input.premiumOutputPrice;

  const premiumFallbackCost =
    (premiumFallbackInputTokens / 1_000_000) *
      input.premiumInputPrice +
    (premiumFallbackOutputTokens / 1_000_000) *
      input.premiumOutputPrice;

  const modelSpend =
    lowCostModelCost + directPremiumCost + premiumFallbackCost;

  const routerCost =
    (input.requests / 1_000) * input.routerPricePerThousand;

  const platformFee =
    modelSpend * (input.platformFeePercent / 100);

  const operatingCost =
    modelSpend +
    routerCost +
    platformFee +
    input.fixedMonthlyCost;

  const planningCost =
    operatingCost + input.amortisedSetupCost;

  const resolvedRequests =
    input.requests - unresolvedRequests;

  return {
    routedLowCostRequests,
    directPremiumRequests,
    lowCostPassedRequests,
    lowCostFailedRequests,
    premiumFallbackRequests,
    unresolvedRequests,
    resolvedRequests,
    lowCostModelCalls,
    directPremiumModelCalls,
    premiumFallbackModelCalls,
    lowCostInputTokens,
    lowCostOutputTokens,
    directPremiumInputTokens,
    directPremiumOutputTokens,
    premiumFallbackInputTokens,
    premiumFallbackOutputTokens,
    lowCostModelCost,
    directPremiumCost,
    premiumFallbackCost,
    modelSpend,
    routerCost,
    platformFee,
    operatingCost,
    planningCost,
    costPerRequest:
      input.requests > 0 ? planningCost / input.requests : 0,
    costPerResolvedRequest:
      resolvedRequests > 0 ? planningCost / resolvedRequests : 0,
  };
}

export default function ToolClient() {
  const [premiumModelName, setPremiumModelName] =
    useState("Premium Model");
  const [lowCostModelName, setLowCostModelName] =
    useState("Low-Cost Model");

  const [monthlyRequests, setMonthlyRequests] = useState("100000");
  const [inputTokensPerRequest, setInputTokensPerRequest] =
    useState("1800");
  const [outputTokensPerRequest, setOutputTokensPerRequest] =
    useState("400");

  const [lowCostRoutePercent, setLowCostRoutePercent] = useState("70");
  const [lowCostPassRatePercent, setLowCostPassRatePercent] =
    useState("88");
  const [fallbackCoveragePercent, setFallbackCoveragePercent] =
    useState("100");
  const [retryOverheadPercent, setRetryOverheadPercent] =
    useState("4");

  const [premiumInputPrice, setPremiumInputPrice] = useState("");
  const [premiumOutputPrice, setPremiumOutputPrice] = useState("");
  const [lowCostInputPrice, setLowCostInputPrice] = useState("");
  const [lowCostOutputPrice, setLowCostOutputPrice] = useState("");

  const [routerPricePerThousand, setRouterPricePerThousand] =
    useState("");
  const [platformFeePercent, setPlatformFeePercent] = useState("");
  const [fixedMonthlyRoutingCost, setFixedMonthlyRoutingCost] =
    useState("");
  const [oneTimeImplementationCost, setOneTimeImplementationCost] =
    useState("");
  const [amortizationMonths, setAmortizationMonths] = useState("12");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const requests = toNumber(monthlyRequests);
    const inputTokens = toNumber(inputTokensPerRequest);
    const outputTokens = toNumber(outputTokensPerRequest);
    const routeShare = clampPercent(lowCostRoutePercent) / 100;
    const passRate = clampPercent(lowCostPassRatePercent) / 100;
    const fallbackCoverage =
      clampPercent(fallbackCoveragePercent) / 100;
    const retryMultiplier =
      1 + clampPercent(retryOverheadPercent) / 100;

    const premiumInput = toNumber(premiumInputPrice);
    const premiumOutput = toNumber(premiumOutputPrice);
    const lowInput = toNumber(lowCostInputPrice);
    const lowOutput = toNumber(lowCostOutputPrice);

    const routerRate = toNumber(routerPricePerThousand);
    const platformFee = clampPercent(platformFeePercent);
    const fixedMonthly = toNumber(fixedMonthlyRoutingCost);

    const implementationCost = toNumber(oneTimeImplementationCost);
    const months = Math.max(1, toNumber(amortizationMonths));
    const amortisedSetupCost = implementationCost / months;

    const baselinePremiumCalls = requests * retryMultiplier;
    const baselineInputTokens =
      baselinePremiumCalls * inputTokens;
    const baselineOutputTokens =
      baselinePremiumCalls * outputTokens;

    const baselineModelCost =
      (baselineInputTokens / 1_000_000) * premiumInput +
      (baselineOutputTokens / 1_000_000) * premiumOutput;

    const routed = calculateScenario({
      requests,
      inputTokensPerRequest: inputTokens,
      outputTokensPerRequest: outputTokens,
      lowCostRouteShare: routeShare,
      lowCostPassRate: passRate,
      fallbackCoverage,
      retryMultiplier,
      premiumInputPrice: premiumInput,
      premiumOutputPrice: premiumOutput,
      lowCostInputPrice: lowInput,
      lowCostOutputPrice: lowOutput,
      routerPricePerThousand: routerRate,
      platformFeePercent: platformFee,
      fixedMonthlyCost: fixedMonthly,
      amortisedSetupCost,
    });

    const operatingSavings =
      baselineModelCost - routed.operatingCost;
    const planningSavings =
      baselineModelCost - routed.planningCost;
    const yearlyOperatingSavings = operatingSavings * 12;
    const firstYearSavings =
      baselineModelCost * 12 -
      (routed.operatingCost * 12 + implementationCost);

    let breakEvenRoutePercent: number | null = null;

    for (let step = 0; step <= 1000; step += 1) {
      const candidate = calculateScenario({
        requests,
        inputTokensPerRequest: inputTokens,
        outputTokensPerRequest: outputTokens,
        lowCostRouteShare: step / 1000,
        lowCostPassRate: passRate,
        fallbackCoverage,
        retryMultiplier,
        premiumInputPrice: premiumInput,
        premiumOutputPrice: premiumOutput,
        lowCostInputPrice: lowInput,
        lowCostOutputPrice: lowOutput,
        routerPricePerThousand: routerRate,
        platformFeePercent: platformFee,
        fixedMonthlyCost: fixedMonthly,
        amortisedSetupCost,
      });

      if (candidate.planningCost <= baselineModelCost) {
        breakEvenRoutePercent = (step / 1000) * 100;
        break;
      }
    }

    const implementationPaybackMonths =
      implementationCost > 0 && operatingSavings > 0
        ? implementationCost / operatingSavings
        : null;

    const qualityCompletionRate =
      requests > 0 ? (routed.resolvedRequests / requests) * 100 : 0;

    const costRows: CostRow[] = [
      {
        label: `${lowCostModelName || "Low-Cost Model"} usage`,
        detail: `${formatInteger(
          routed.lowCostModelCalls,
        )} calls including retry overhead`,
        value: routed.lowCostModelCost,
        entered:
          lowCostInputPrice.trim() !== "" &&
          lowCostOutputPrice.trim() !== "",
      },
      {
        label: `Direct ${premiumModelName || "Premium Model"} usage`,
        detail: `${formatInteger(
          routed.directPremiumModelCalls,
        )} calls routed directly to the premium path`,
        value: routed.directPremiumCost,
        entered:
          premiumInputPrice.trim() !== "" &&
          premiumOutputPrice.trim() !== "",
      },
      {
        label: `${premiumModelName || "Premium Model"} fallback`,
        detail: `${formatInteger(
          routed.premiumFallbackModelCalls,
        )} fallback calls including retry overhead`,
        value: routed.premiumFallbackCost,
        entered:
          premiumInputPrice.trim() !== "" &&
          premiumOutputPrice.trim() !== "",
      },
      {
        label: "Router or classifier",
        detail: `${formatInteger(requests)} routing decisions`,
        value: routed.routerCost,
        entered: routerPricePerThousand.trim() !== "",
      },
      {
        label: "Routing platform fee",
        detail: `${formatNumber(platformFee)}% of model spend`,
        value: routed.platformFee,
        entered: platformFeePercent.trim() !== "",
      },
      {
        label: "Fixed monthly routing cost",
        detail: "Gateway, observability, evaluation, or routing platform",
        value: fixedMonthly,
        entered: fixedMonthlyRoutingCost.trim() !== "",
      },
      {
        label: "Amortised implementation",
        detail: `${formatMoney(
          implementationCost,
        )} spread across ${formatInteger(months)} months`,
        value: amortisedSetupCost,
        entered: oneTimeImplementationCost.trim() !== "",
      },
    ];

    const hasCorePrices =
      premiumInputPrice.trim() !== "" &&
      premiumOutputPrice.trim() !== "" &&
      lowCostInputPrice.trim() !== "" &&
      lowCostOutputPrice.trim() !== "";

    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      requests,
      inputTokens,
      outputTokens,
      routeSharePercent: routeShare * 100,
      passRatePercent: passRate * 100,
      fallbackCoveragePercent: fallbackCoverage * 100,
      retryPercent: (retryMultiplier - 1) * 100,
      baselinePremiumCalls,
      baselineInputTokens,
      baselineOutputTokens,
      baselineModelCost,
      routed,
      operatingSavings,
      planningSavings,
      yearlyOperatingSavings,
      firstYearSavings,
      breakEvenRoutePercent,
      implementationPaybackMonths,
      qualityCompletionRate,
      costRows,
      hasCorePrices,
      hasBudget,
      budget,
      budgetDifference: budget - routed.planningCost,
    };
  }, [
    amortizationMonths,
    fallbackCoveragePercent,
    fixedMonthlyRoutingCost,
    inputTokensPerRequest,
    lowCostInputPrice,
    lowCostModelName,
    lowCostOutputPrice,
    lowCostPassRatePercent,
    lowCostRoutePercent,
    monthlyBudget,
    monthlyRequests,
    oneTimeImplementationCost,
    outputTokensPerRequest,
    platformFeePercent,
    premiumInputPrice,
    premiumModelName,
    premiumOutputPrice,
    retryOverheadPercent,
    routerPricePerThousand,
  ]);

  const reset = () => {
    setPremiumModelName("Premium Model");
    setLowCostModelName("Low-Cost Model");
    setMonthlyRequests("100000");
    setInputTokensPerRequest("1800");
    setOutputTokensPerRequest("400");
    setLowCostRoutePercent("70");
    setLowCostPassRatePercent("88");
    setFallbackCoveragePercent("100");
    setRetryOverheadPercent("4");
    setPremiumInputPrice("");
    setPremiumOutputPrice("");
    setLowCostInputPrice("");
    setLowCostOutputPrice("");
    setRouterPricePerThousand("");
    setPlatformFeePercent("");
    setFixedMonthlyRoutingCost("");
    setOneTimeImplementationCost("");
    setAmortizationMonths("12");
    setMonthlyBudget("");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Model Routing Plan
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Compare an all-premium baseline with a lower-cost routed workflow.
          </p>
        </div>

        <FieldSection title="Models and Monthly Workload">
          <TextField
            label="Premium model name"
            value={premiumModelName}
            onChange={setPremiumModelName}
          />

          <TextField
            label="Low-cost model name"
            value={lowCostModelName}
            onChange={setLowCostModelName}
          />

          <BeeijaNumberField
            label="Requests per month"
            value={monthlyRequests}
            onChange={setMonthlyRequests}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Input tokens per request"
            value={inputTokensPerRequest}
            onChange={setInputTokensPerRequest}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Output tokens per request"
            value={outputTokensPerRequest}
            onChange={setOutputTokensPerRequest}
            min="0"
            step="1"
          />
        </FieldSection>

        <FieldSection title="Routing, Quality, and Fallback">
          <BeeijaNumberField
            label="Requests routed to low-cost model"
            value={lowCostRoutePercent}
            onChange={setLowCostRoutePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Low-cost model quality pass rate"
            value={lowCostPassRatePercent}
            onChange={setLowCostPassRatePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Failed low-cost requests sent to fallback"
            value={fallbackCoveragePercent}
            onChange={setFallbackCoveragePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Retry and repeated-call overhead"
            value={retryOverheadPercent}
            onChange={setRetryOverheadPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Current Model Prices">
          <BeeijaNumberField
            label={`${premiumModelName || "Premium Model"} input per 1M tokens`}
            value={premiumInputPrice}
            onChange={setPremiumInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label={`${premiumModelName || "Premium Model"} output per 1M tokens`}
            value={premiumOutputPrice}
            onChange={setPremiumOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label={`${lowCostModelName || "Low-Cost Model"} input per 1M tokens`}
            value={lowCostInputPrice}
            onChange={setLowCostInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label={`${lowCostModelName || "Low-Cost Model"} output per 1M tokens`}
            value={lowCostOutputPrice}
            onChange={setLowCostOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Router, Platform, and Setup Costs">
          <BeeijaNumberField
            label="Router or classifier price per 1,000 requests"
            value={routerPricePerThousand}
            onChange={setRouterPricePerThousand}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Routing platform fee on model spend"
            value={platformFeePercent}
            onChange={setPlatformFeePercent}
            min="0"
            max="100"
            step="0.1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Other fixed monthly routing cost"
            value={fixedMonthlyRoutingCost}
            onChange={setFixedMonthlyRoutingCost}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="One-time routing implementation cost"
            value={oneTimeImplementationCost}
            onChange={setOneTimeImplementationCost}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="Implementation amortisation period"
            value={amortizationMonths}
            onChange={setAmortizationMonths}
            min="1"
            step="1"
            suffix="mo"
          />

          <BeeijaNumberField
            label="Target monthly AI budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated routing flow
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              Low-cost routed requests:{" "}
              {formatVisibleInteger(result.routed.routedLowCostRequests)}
            </p>

            <p>
              Direct premium requests:{" "}
              {formatVisibleInteger(result.routed.directPremiumRequests)}
            </p>

            <p>
              Low-cost requests passed:{" "}
              {formatVisibleInteger(result.routed.lowCostPassedRequests)}
            </p>

            <p>
              Premium fallback requests:{" "}
              {formatVisibleInteger(result.routed.premiumFallbackRequests)}
            </p>

            <p>
              Estimated unresolved requests:{" "}
              {formatVisibleInteger(result.routed.unresolvedRequests)}
            </p>

            <p>
              Estimated completion rate:{" "}
              {formatVisibleNumber(result.qualityCompletionRate)}%
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={reset}
          className="beeija-btn-outline mt-6"
        >
          Reset values
        </button>
      </section>

      <BeeijaCalculatorResultPanel
        title="Model Routing Cost and Savings"
        description="The result compares the routed planning cost with an all-premium baseline using the same workload and retry overhead."
        primaryLabel="Routed monthly planning cost"
        primaryValue={
          result.hasCorePrices
            ? formatVisibleMoney(result.routed.planningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="All-premium baseline"
              value={
                result.hasCorePrices
                  ? formatVisibleMoney(result.baselineModelCost)
                  : "—"
              }
            />

            <ResultStat
              label="Monthly planning saving"
              value={
                result.hasCorePrices
                  ? formatVisibleMoney(result.planningSavings)
                  : "—"
              }
            />

            <ResultStat
              label="Cost per resolved request"
              value={
                result.hasCorePrices
                  ? formatVisibleMoney(
                      result.routed.costPerResolvedRequest,
                    )
                  : "—"
              }
            />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            {result.costRows.map((row) => (
              <BreakdownRow
                key={row.label}
                label={row.label}
                detail={row.detail}
                value={row.value}
                entered={row.entered}
              />
            ))}
          </div>
        }
        totals={
          <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
            <p>
              Routed monthly operating cost:{" "}
              <span className="font-medium text-gray-900">
                {result.hasCorePrices
                  ? formatVisibleMoney(result.routed.operatingCost)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Monthly operating saving:{" "}
              <span
                className={`font-semibold ${
                  !result.hasCorePrices ||
                  result.operatingSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasCorePrices
                  ? "Enter current model prices"
                  : result.operatingSavings >= 0
                    ? `${formatVisibleMoney(
                        result.operatingSavings,
                      )} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.operatingSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              First-year comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasCorePrices ||
                  result.firstYearSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasCorePrices
                  ? "Enter current model prices"
                  : result.firstYearSavings >= 0
                    ? `${formatVisibleMoney(
                        result.firstYearSavings,
                      )} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.firstYearSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              Approximate routing-share break-even:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasCorePrices
                  ? "Enter current model prices"
                  : result.breakEvenRoutePercent === null
                    ? "Not reached"
                    : `${formatVisibleNumber(
                        result.breakEvenRoutePercent,
                      )}% routed to the low-cost model`}
              </span>
            </p>

            <p className="mt-2">
              Implementation payback:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasCorePrices
                  ? "Enter current model prices"
                  : toNumber(oneTimeImplementationCost) === 0
                    ? "No implementation cost entered"
                    : result.implementationPaybackMonths === null
                      ? "No positive operating payback"
                      : `${formatVisibleNumber(
                          result.implementationPaybackMonths,
                        )} months`}
              </span>
            </p>

            <p className="mt-2">
              Cost per attempted request:{" "}
              <span className="font-medium text-gray-900">
                {result.hasCorePrices
                  ? formatVisibleMoney(result.routed.costPerRequest)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Estimated unresolved requests:{" "}
              <span
                className={`font-semibold ${
                  result.routed.unresolvedRequests > 0
                    ? "text-red-700"
                    : "text-[var(--green)]"
                }`}
              >
                {formatVisibleInteger(result.routed.unresolvedRequests)}
              </span>
            </p>

            <p className="mt-2">
              Budget status:{" "}
              <span
                className={`font-semibold ${
                  result.hasBudget &&
                  result.hasCorePrices &&
                  result.budgetDifference < 0
                    ? "text-red-700"
                    : "text-[var(--green)]"
                }`}
              >
                {!result.hasBudget
                  ? "Add a budget to compare"
                  : !result.hasCorePrices
                    ? "Enter current model prices"
                    : result.budgetDifference >= 0
                      ? `${formatVisibleMoney(result.budgetDifference)} remaining`
                      : `${formatVisibleMoney(
                          Math.abs(result.budgetDifference),
                        )} over budget`}
              </span>
            </p>
          </div>
        }
        noticeText="This calculator stores no model or gateway price. Enter the current official rates for the exact low-cost model, premium model, router, and platform being considered. The quality pass rate and fallback coverage should come from evaluations or production data. Blank optional cost fields are treated as zero."
      />
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
      <h3 className="text-lg font-semibold text-gray-950">{title}</h3>
      <div className="mt-5 grid min-w-0 gap-5 md:grid-cols-2 md:items-end [&>*]:min-w-0">{children}</div>
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
    <label className="block min-w-0">
      <span className="mb-2 block break-words text-sm font-medium text-gray-700 [overflow-wrap:anywhere]">
        {label}
      </span>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition hover:border-gray-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
      />
    </label>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
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
}: {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
}) {
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

"use client";

import { useMemo, useState, type ReactNode } from "react";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type ScenarioTotals = {
  normalInputTokens: number;
  cachedInputTokens: number;
  assistantOutputTokens: number;
  summaryInputTokens: number;
  summaryOutputTokens: number;
  inputCost: number;
  outputCost: number;
  summaryCost: number;
  fixedCost: number;
  setupCost: number;
  operatingCost: number;
  planningCost: number;
  peakInputTokens: number;
  peakTotalTokens: number;
  overflowTurnsPerSession: number;
  firstOverflowTurn: number | null;
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

export default function ToolClient() {
  const [sessionsPerMonth, setSessionsPerMonth] = useState("10000");
  const [turnsPerSession, setTurnsPerSession] = useState("12");
  const [staticPrefixTokens, setStaticPrefixTokens] = useState("2500");
  const [initialContextTokens, setInitialContextTokens] = useState("1000");
  const [userTokensPerTurn, setUserTokensPerTurn] = useState("150");
  const [assistantTokensPerTurn, setAssistantTokensPerTurn] =
    useState("350");
  const [contextWindowLimit, setContextWindowLimit] = useState("128000");

  const [recentTurnsRetained, setRecentTurnsRetained] = useState("4");
  const [summaryTokens, setSummaryTokens] = useState("800");
  const [summaryRefreshEveryOlderTurns, setSummaryRefreshEveryOlderTurns] =
    useState("4");

  const [cacheableStaticPercent, setCacheableStaticPercent] =
    useState("80");
  const [cacheHitRatePercent, setCacheHitRatePercent] =
    useState("70");

  const [normalInputPrice, setNormalInputPrice] = useState("");
  const [cachedInputPrice, setCachedInputPrice] = useState("");
  const [outputPrice, setOutputPrice] = useState("");
  const [summaryInputPrice, setSummaryInputPrice] = useState("");
  const [summaryOutputPrice, setSummaryOutputPrice] = useState("");

  const [fixedMonthlyContextCost, setFixedMonthlyContextCost] =
    useState("");
  const [oneTimeImplementationCost, setOneTimeImplementationCost] =
    useState("");
  const [amortizationMonths, setAmortizationMonths] = useState("12");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const sessions = toNumber(sessionsPerMonth);
    const turns = Math.max(1, Math.floor(toNumber(turnsPerSession)));
    const staticTokens = toNumber(staticPrefixTokens);
    const initialTokens = toNumber(initialContextTokens);
    const userTokens = toNumber(userTokensPerTurn);
    const assistantTokens = toNumber(assistantTokensPerTurn);
    const historyTokensPerTurn = userTokens + assistantTokens;
    const contextLimit = Math.max(1, toNumber(contextWindowLimit));

    const recentTurns = Math.max(
      0,
      Math.floor(toNumber(recentTurnsRetained)),
    );
    const compactSummaryTokens = toNumber(summaryTokens);
    const refreshEvery = Math.max(
      1,
      Math.floor(toNumber(summaryRefreshEveryOlderTurns)),
    );

    const cacheableShare = clampPercent(cacheableStaticPercent) / 100;
    const cacheHitRate = clampPercent(cacheHitRatePercent) / 100;
    const effectiveCachedStaticShare = cacheableShare * cacheHitRate;

    const normalInputRate = toNumber(normalInputPrice);
    const cachedInputRate =
      cachedInputPrice.trim() === ""
        ? normalInputRate
        : toNumber(cachedInputPrice);
    const outputRate = toNumber(outputPrice);
    const summaryInputRate =
      summaryInputPrice.trim() === ""
        ? normalInputRate
        : toNumber(summaryInputPrice);
    const summaryOutputRate =
      summaryOutputPrice.trim() === ""
        ? outputRate
        : toNumber(summaryOutputPrice);

    const requestsPerMonth = sessions * turns;
    const totalStaticTokens = requestsPerMonth * staticTokens;
    const cachedStaticTokens =
      totalStaticTokens * effectiveCachedStaticShare;
    const normalStaticTokens = totalStaticTokens - cachedStaticTokens;
    const monthlyAssistantOutputTokens =
      requestsPerMonth * assistantTokens;

    let fullHistoryDynamicTokensPerSession = 0;
    let managedDynamicTokensPerSession = 0;
    let fullPeakInput = 0;
    let managedPeakInput = 0;
    let fullOverflowTurns = 0;
    let managedOverflowTurns = 0;
    let fullFirstOverflow: number | null = null;
    let managedFirstOverflow: number | null = null;

    for (let turn = 1; turn <= turns; turn += 1) {
      const priorTurns = turn - 1;

      const fullDynamicInput =
        initialTokens +
        userTokens +
        priorTurns * historyTokensPerTurn;

      const retainedPriorTurns = Math.min(priorTurns, recentTurns);
      const hasOlderHistory = priorTurns > recentTurns;

      const managedDynamicInput =
        initialTokens +
        userTokens +
        retainedPriorTurns * historyTokensPerTurn +
        (hasOlderHistory ? compactSummaryTokens : 0);

      const fullInput = staticTokens + fullDynamicInput;
      const managedInput = staticTokens + managedDynamicInput;

      fullHistoryDynamicTokensPerSession += fullDynamicInput;
      managedDynamicTokensPerSession += managedDynamicInput;
      fullPeakInput = Math.max(fullPeakInput, fullInput);
      managedPeakInput = Math.max(managedPeakInput, managedInput);

      if (fullInput + assistantTokens > contextLimit) {
        fullOverflowTurns += 1;
        if (fullFirstOverflow === null) fullFirstOverflow = turn;
      }

      if (managedInput + assistantTokens > contextLimit) {
        managedOverflowTurns += 1;
        if (managedFirstOverflow === null) managedFirstOverflow = turn;
      }
    }

    const olderTurnsPerSession = Math.max(0, turns - 1 - recentTurns);
    const summaryCallsPerSession =
      olderTurnsPerSession > 0
        ? Math.ceil(olderTurnsPerSession / refreshEvery)
        : 0;

    const averageSummaryInputTokensPerCall =
      compactSummaryTokens + refreshEvery * historyTokensPerTurn;

    const monthlySummaryCalls = sessions * summaryCallsPerSession;
    const monthlySummaryInputTokens =
      monthlySummaryCalls * averageSummaryInputTokensPerCall;
    const monthlySummaryOutputTokens =
      monthlySummaryCalls * compactSummaryTokens;

    const fixedCost = toNumber(fixedMonthlyContextCost);
    const implementationCost = toNumber(oneTimeImplementationCost);
    const months = Math.max(1, toNumber(amortizationMonths));
    const amortizedSetupCost = implementationCost / months;

    const fullNormalInputTokens =
      normalStaticTokens +
      sessions * fullHistoryDynamicTokensPerSession;

    const managedNormalInputTokens =
      normalStaticTokens +
      sessions * managedDynamicTokensPerSession;

    const fullInputCost =
      (fullNormalInputTokens / 1_000_000) * normalInputRate +
      (cachedStaticTokens / 1_000_000) * cachedInputRate;

    const managedInputCost =
      (managedNormalInputTokens / 1_000_000) * normalInputRate +
      (cachedStaticTokens / 1_000_000) * cachedInputRate;

    const assistantOutputCost =
      (monthlyAssistantOutputTokens / 1_000_000) * outputRate;

    const summaryCost =
      (monthlySummaryInputTokens / 1_000_000) * summaryInputRate +
      (monthlySummaryOutputTokens / 1_000_000) * summaryOutputRate;

    const fullScenario: ScenarioTotals = {
      normalInputTokens: fullNormalInputTokens,
      cachedInputTokens: cachedStaticTokens,
      assistantOutputTokens: monthlyAssistantOutputTokens,
      summaryInputTokens: 0,
      summaryOutputTokens: 0,
      inputCost: fullInputCost,
      outputCost: assistantOutputCost,
      summaryCost: 0,
      fixedCost,
      setupCost: amortizedSetupCost,
      operatingCost: fullInputCost + assistantOutputCost + fixedCost,
      planningCost:
        fullInputCost +
        assistantOutputCost +
        fixedCost +
        amortizedSetupCost,
      peakInputTokens: fullPeakInput,
      peakTotalTokens: fullPeakInput + assistantTokens,
      overflowTurnsPerSession: fullOverflowTurns,
      firstOverflowTurn: fullFirstOverflow,
    };

    const managedScenario: ScenarioTotals = {
      normalInputTokens: managedNormalInputTokens,
      cachedInputTokens: cachedStaticTokens,
      assistantOutputTokens: monthlyAssistantOutputTokens,
      summaryInputTokens: monthlySummaryInputTokens,
      summaryOutputTokens: monthlySummaryOutputTokens,
      inputCost: managedInputCost,
      outputCost: assistantOutputCost,
      summaryCost,
      fixedCost,
      setupCost: amortizedSetupCost,
      operatingCost:
        managedInputCost +
        assistantOutputCost +
        summaryCost +
        fixedCost,
      planningCost:
        managedInputCost +
        assistantOutputCost +
        summaryCost +
        fixedCost +
        amortizedSetupCost,
      peakInputTokens: managedPeakInput,
      peakTotalTokens: managedPeakInput + assistantTokens,
      overflowTurnsPerSession: managedOverflowTurns,
      firstOverflowTurn: managedFirstOverflow,
    };

    const monthlyPlanningSavings =
      fullScenario.planningCost - managedScenario.planningCost;
    const firstYearSavings =
      (fullScenario.operatingCost - managedScenario.operatingCost) * 12 -
      implementationCost;

    const fullTotalProcessedTokens =
      fullScenario.normalInputTokens +
      fullScenario.cachedInputTokens +
      fullScenario.assistantOutputTokens;

    const managedTotalProcessedTokens =
      managedScenario.normalInputTokens +
      managedScenario.cachedInputTokens +
      managedScenario.assistantOutputTokens +
      managedScenario.summaryInputTokens +
      managedScenario.summaryOutputTokens;

    const tokenReduction =
      fullTotalProcessedTokens - managedTotalProcessedTokens;

    const tokenReductionPercent =
      fullTotalProcessedTokens > 0
        ? (tokenReduction / fullTotalProcessedTokens) * 100
        : 0;

    const fullContextUse =
      (fullScenario.peakTotalTokens / contextLimit) * 100;
    const managedContextUse =
      (managedScenario.peakTotalTokens / contextLimit) * 100;

    const costPerFullSession =
      sessions > 0 ? fullScenario.planningCost / sessions : 0;
    const costPerManagedSession =
      sessions > 0 ? managedScenario.planningCost / sessions : 0;

    const implementationPaybackMonths =
      implementationCost > 0 &&
      fullScenario.operatingCost > managedScenario.operatingCost
        ? implementationCost /
          (fullScenario.operatingCost - managedScenario.operatingCost)
        : null;

    const hasCorePrices =
      normalInputPrice.trim() !== "" &&
      outputPrice.trim() !== "";

    const enteredPriceCount = [
      normalInputPrice,
      cachedInputPrice,
      outputPrice,
      summaryInputPrice,
      summaryOutputPrice,
      fixedMonthlyContextCost,
      oneTimeImplementationCost,
    ].filter((value) => value.trim() !== "").length;

    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      sessions,
      turns,
      requestsPerMonth,
      historyTokensPerTurn,
      effectiveCachedStaticShare,
      summaryCallsPerSession,
      monthlySummaryCalls,
      averageSummaryInputTokensPerCall,
      fullScenario,
      managedScenario,
      monthlyPlanningSavings,
      firstYearSavings,
      tokenReduction,
      tokenReductionPercent,
      fullContextUse,
      managedContextUse,
      costPerFullSession,
      costPerManagedSession,
      implementationPaybackMonths,
      implementationCost,
      hasCorePrices,
      enteredPriceCount,
      hasBudget,
      budget,
      budgetDifference: budget - managedScenario.planningCost,
    };
  }, [
    amortizationMonths,
    assistantTokensPerTurn,
    cacheHitRatePercent,
    cacheableStaticPercent,
    cachedInputPrice,
    contextWindowLimit,
    fixedMonthlyContextCost,
    initialContextTokens,
    monthlyBudget,
    normalInputPrice,
    oneTimeImplementationCost,
    outputPrice,
    recentTurnsRetained,
    sessionsPerMonth,
    staticPrefixTokens,
    summaryInputPrice,
    summaryOutputPrice,
    summaryRefreshEveryOlderTurns,
    summaryTokens,
    turnsPerSession,
    userTokensPerTurn,
  ]);

  const reset = () => {
    setSessionsPerMonth("10000");
    setTurnsPerSession("12");
    setStaticPrefixTokens("2500");
    setInitialContextTokens("1000");
    setUserTokensPerTurn("150");
    setAssistantTokensPerTurn("350");
    setContextWindowLimit("128000");
    setRecentTurnsRetained("4");
    setSummaryTokens("800");
    setSummaryRefreshEveryOlderTurns("4");
    setCacheableStaticPercent("80");
    setCacheHitRatePercent("70");
    setNormalInputPrice("");
    setCachedInputPrice("");
    setOutputPrice("");
    setSummaryInputPrice("");
    setSummaryOutputPrice("");
    setFixedMonthlyContextCost("");
    setOneTimeImplementationCost("");
    setAmortizationMonths("12");
    setMonthlyBudget("");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Conversation Context Plan
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Compare full conversation history with recent-turn retention and
            summary-based memory.
          </p>
        </div>

        <FieldSection title="Monthly Sessions and Tokens">
          <BeeijaNumberField
            label="Conversation sessions per month"
            value={sessionsPerMonth}
            onChange={setSessionsPerMonth}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average turns per session"
            value={turnsPerSession}
            onChange={setTurnsPerSession}
            min="1"
            step="1"
          />

          <BeeijaNumberField
            label="Static instruction and tool tokens"
            value={staticPrefixTokens}
            onChange={setStaticPrefixTokens}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Initial session context tokens"
            value={initialContextTokens}
            onChange={setInitialContextTokens}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average user tokens per turn"
            value={userTokensPerTurn}
            onChange={setUserTokensPerTurn}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average assistant output tokens per turn"
            value={assistantTokensPerTurn}
            onChange={setAssistantTokensPerTurn}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Model context-window limit"
            value={contextWindowLimit}
            onChange={setContextWindowLimit}
            min="1"
            step="1"
            suffix="tokens"
          />
        </FieldSection>

        <FieldSection title="Managed Context Strategy">
          <BeeijaNumberField
            label="Recent turns kept in full"
            value={recentTurnsRetained}
            onChange={setRecentTurnsRetained}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Compact summary size"
            value={summaryTokens}
            onChange={setSummaryTokens}
            min="0"
            step="1"
            suffix="tokens"
          />

          <BeeijaNumberField
            label="Refresh summary after this many older turns"
            value={summaryRefreshEveryOlderTurns}
            onChange={setSummaryRefreshEveryOlderTurns}
            min="1"
            step="1"
            suffix="turns"
          />
        </FieldSection>

        <FieldSection title="Static Prefix Caching">
          <BeeijaNumberField
            label="Static prefix eligible for caching"
            value={cacheableStaticPercent}
            onChange={setCacheableStaticPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Effective cache-hit rate"
            value={cacheHitRatePercent}
            onChange={setCacheHitRatePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Model and Summary Prices">
          <BeeijaNumberField
            label="Normal input price per 1M tokens"
            value={normalInputPrice}
            onChange={setNormalInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Cached input price per 1M tokens"
            value={cachedInputPrice}
            onChange={setCachedInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Assistant output price per 1M tokens"
            value={outputPrice}
            onChange={setOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Summary-model input price per 1M tokens"
            value={summaryInputPrice}
            onChange={setSummaryInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Summary-model output price per 1M tokens"
            value={summaryOutputPrice}
            onChange={setSummaryOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          Leave either summary price blank to use the matching main-model
          input or output price. Leave cached input blank to use the normal
          input price.
        </p>

        <FieldSection title="Platform, Setup, and Budget">
          <BeeijaNumberField
            label="Fixed context or memory platform cost per month"
            value={fixedMonthlyContextCost}
            onChange={setFixedMonthlyContextCost}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="One-time context-management implementation cost"
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
            label="Target monthly managed-context budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated monthly context workload
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              Model requests: {formatVisibleInteger(result.requestsPerMonth)}
            </p>

            <p>
              History growth per completed turn:{" "}
              {formatVisibleInteger(result.historyTokensPerTurn)} tokens
            </p>

            <p>
              Effective cached share of static prefix:{" "}
              {formatVisibleNumber(result.effectiveCachedStaticShare * 100)}%
            </p>

            <p>
              Summary refreshes per session:{" "}
              {formatVisibleInteger(result.summaryCallsPerSession)}
            </p>

            <p>
              Monthly summary calls:{" "}
              {formatVisibleInteger(result.monthlySummaryCalls)}
            </p>

            <p>
              Average summary input per refresh:{" "}
              {formatVisibleInteger(result.averageSummaryInputTokensPerCall)} tokens
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
        title="Context Cost and Limit Comparison"
        description="The managed estimate includes summary refresh tokens, cached static prefixes, fixed costs, and amortised implementation."
        primaryLabel="Managed monthly planning cost"
        primaryValue={
          result.hasCorePrices
            ? formatVisibleMoney(result.managedScenario.planningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Full-history cost"
              value={
                result.hasCorePrices
                  ? formatVisibleMoney(result.fullScenario.planningCost)
                  : "—"
              }
            />

            <ResultStat
              label="Monthly saving"
              value={
                result.hasCorePrices
                  ? formatVisibleMoney(result.monthlyPlanningSavings)
                  : "—"
              }
            />

            <ResultStat
              label="Managed cost per session"
              value={
                result.hasCorePrices
                  ? formatVisibleMoney(result.costPerManagedSession)
                  : "—"
              }
            />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            <ScenarioCard
              title="Full conversation history"
              scenario={result.fullScenario}
              contextUse={result.fullContextUse}
              costPerSession={result.costPerFullSession}
              ready={result.hasCorePrices}
            />

            <ScenarioCard
              title="Managed recent turns and summary"
              scenario={result.managedScenario}
              contextUse={result.managedContextUse}
              costPerSession={result.costPerManagedSession}
              ready={result.hasCorePrices}
            />
          </div>
        }
        totals={
          <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
            <p>
              Estimated processed-token reduction:{" "}
              <span
                className={`font-semibold ${
                  result.tokenReduction >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {formatVisibleInteger(result.tokenReduction)} tokens (
                {formatVisibleNumber(result.tokenReductionPercent)}%)
              </span>
            </p>

            <p className="mt-2">
              Managed summary overhead:{" "}
              <span className="font-medium text-gray-900">
                {formatVisibleInteger(
                  result.managedScenario.summaryInputTokens +
                    result.managedScenario.summaryOutputTokens,
                )}{" "}
                tokens
              </span>
            </p>

            <p className="mt-2">
              Full-history first overflow turn:{" "}
              <span className="font-medium text-gray-900">
                {result.fullScenario.firstOverflowTurn === null
                  ? "No overflow in the planned session"
                  : `Turn ${result.fullScenario.firstOverflowTurn}`}
              </span>
            </p>

            <p className="mt-2">
              Managed-context first overflow turn:{" "}
              <span className="font-medium text-gray-900">
                {result.managedScenario.firstOverflowTurn === null
                  ? "No overflow in the planned session"
                  : `Turn ${result.managedScenario.firstOverflowTurn}`}
              </span>
            </p>

            <p className="mt-2">
              First-year comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasCorePrices || result.firstYearSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasCorePrices
                  ? "Enter current prices"
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
              Implementation payback:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasCorePrices
                  ? "Enter current prices"
                  : result.implementationCost === 0
                    ? "No implementation cost entered"
                    : result.implementationPaybackMonths === null
                      ? "No positive operating payback"
                      : `${formatVisibleNumber(
                          result.implementationPaybackMonths,
                        )} months`}
              </span>
            </p>

            <p className="mt-2">
              Price inputs entered:{" "}
              <span className="font-medium text-gray-900">
                {result.enteredPriceCount} of 7
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
                    ? "Enter current prices"
                    : result.budgetDifference >= 0
                      ? `${formatVisibleMoney(result.budgetDifference)} remaining`
                      : `${formatVisibleMoney(
                          Math.abs(result.budgetDifference),
                        )} over budget`}
              </span>
            </p>
          </div>
        }
        noticeText="This calculator stores no model, cached-input, summary-model, memory-platform, or implementation price. Enter the current rates for the exact provider and model. Blank summary prices fall back to the main-model rates, and a blank cached-input price falls back to normal input. Reasoning tokens, tool calls, images, audio, retrieval, tokenization differences, taxes, and provider-specific long-context rules can change the final cost."
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

function ScenarioCard({
  title,
  scenario,
  contextUse,
  costPerSession,
  ready,
}: {
  title: string;
  scenario: ScenarioTotals;
  contextUse: number;
  costPerSession: number;
  ready: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="break-words font-semibold text-gray-950 [overflow-wrap:anywhere]">
            {title}
          </p>
          <p className="mt-1 break-words text-sm text-gray-500 [overflow-wrap:anywhere]">
            Peak context use: {formatVisibleNumber(contextUse)}%
          </p>
        </div>

        <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
          {ready ? formatVisibleMoney(scenario.planningCost) : "—"}
        </p>
      </div>

      <div className="mt-4 grid min-w-0 gap-2 text-sm text-gray-600 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
        <p>
          Normal input: {formatVisibleInteger(scenario.normalInputTokens)}
        </p>
        <p>
          Cached input: {formatVisibleInteger(scenario.cachedInputTokens)}
        </p>
        <p>
          Assistant output: {formatVisibleInteger(scenario.assistantOutputTokens)}
        </p>
        <p>
          Summary tokens:{" "}
          {formatVisibleInteger(
            scenario.summaryInputTokens + scenario.summaryOutputTokens,
          )}
        </p>
        <p>
          Peak total context: {formatVisibleInteger(scenario.peakTotalTokens)}
        </p>
        <p>
          Overflow turns per session:{" "}
          {formatVisibleInteger(scenario.overflowTurnsPerSession)}
        </p>
        <p>
          Cost per session: {ready ? formatVisibleMoney(costPerSession) : "—"}
        </p>
        <p>
          Summary cost: {ready ? formatVisibleMoney(scenario.summaryCost) : "—"}
        </p>
      </div>
    </div>
  );
}

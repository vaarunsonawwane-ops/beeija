"use client";

import { useMemo, useState, type ReactNode } from "react";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaNotice from "@/app/components/BeeijaNotice";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type CostRowData = {
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ToolClient() {
  const [monthlyCalls, setMonthlyCalls] = useState("5000");
  const [averageCallMinutes, setAverageCallMinutes] = useState("4");
  const [usageOverheadPercent, setUsageOverheadPercent] = useState("5");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const [sttCostPerMinute, setSttCostPerMinute] = useState("");
  const [platformCostPerMinute, setPlatformCostPerMinute] =
    useState("");
  const [telephonyCostPerMinute, setTelephonyCostPerMinute] =
    useState("");
  const [recordingCostPerMinute, setRecordingCostPerMinute] =
    useState("");

  const [llmInputTokensPerMinute, setLlmInputTokensPerMinute] =
    useState("600");
  const [llmOutputTokensPerMinute, setLlmOutputTokensPerMinute] =
    useState("120");
  const [llmInputPrice, setLlmInputPrice] = useState("");
  const [llmOutputPrice, setLlmOutputPrice] = useState("");

  const [agentSpeakingPercent, setAgentSpeakingPercent] = useState("45");
  const [spokenCharactersPerMinute, setSpokenCharactersPerMinute] =
    useState("900");
  const [ttsPricePerThousandCharacters, setTtsPricePerThousandCharacters] =
    useState("");

  const [fixedMonthlyCosts, setFixedMonthlyCosts] = useState("");
  const [oneTimeSetupCost, setOneTimeSetupCost] = useState("");
  const [setupAmortizationMonths, setSetupAmortizationMonths] =
    useState("12");

  const result = useMemo(() => {
    const calls = toNumber(monthlyCalls);
    const callMinutes = toNumber(averageCallMinutes);
    const overhead = clampPercent(usageOverheadPercent);
    const budget = toNumber(monthlyBudget);

    const plannedMinutes = calls * callMinutes;
    const billableMinutes = plannedMinutes * (1 + overhead / 100);

    const sttCost = billableMinutes * toNumber(sttCostPerMinute);
    const platformCost =
      billableMinutes * toNumber(platformCostPerMinute);
    const telephonyCost =
      billableMinutes * toNumber(telephonyCostPerMinute);
    const recordingCost =
      billableMinutes * toNumber(recordingCostPerMinute);

    const totalInputTokens =
      billableMinutes * toNumber(llmInputTokensPerMinute);
    const totalOutputTokens =
      billableMinutes * toNumber(llmOutputTokensPerMinute);

    const llmInputCost =
      (totalInputTokens / 1_000_000) * toNumber(llmInputPrice);
    const llmOutputCost =
      (totalOutputTokens / 1_000_000) * toNumber(llmOutputPrice);

    const speakingShare = clampPercent(agentSpeakingPercent) / 100;
    const generatedCharacters =
      billableMinutes *
      speakingShare *
      toNumber(spokenCharactersPerMinute);

    const ttsCost =
      (generatedCharacters / 1_000) *
      toNumber(ttsPricePerThousandCharacters);

    const fixedCosts = toNumber(fixedMonthlyCosts);
    const setupCost = toNumber(oneTimeSetupCost);
    const amortizationMonths = Math.max(
      1,
      toNumber(setupAmortizationMonths),
    );
    const amortizedSetupCost = setupCost / amortizationMonths;

    const rows: CostRowData[] = [
      {
        label: "Speech-to-text",
        detail: `${formatNumber(billableMinutes)} billable minutes`,
        value: sttCost,
        entered: sttCostPerMinute.trim() !== "",
      },
      {
        label: "Voice-agent platform",
        detail: `${formatNumber(billableMinutes)} billable minutes`,
        value: platformCost,
        entered: platformCostPerMinute.trim() !== "",
      },
      {
        label: "Telephony",
        detail: `${formatNumber(billableMinutes)} billable minutes`,
        value: telephonyCost,
        entered: telephonyCostPerMinute.trim() !== "",
      },
      {
        label: "Call recording",
        detail: `${formatNumber(billableMinutes)} billable minutes`,
        value: recordingCost,
        entered: recordingCostPerMinute.trim() !== "",
      },
      {
        label: "LLM input",
        detail: `${formatNumber(totalInputTokens)} input tokens`,
        value: llmInputCost,
        entered: llmInputPrice.trim() !== "",
      },
      {
        label: "LLM output",
        detail: `${formatNumber(totalOutputTokens)} output tokens`,
        value: llmOutputCost,
        entered: llmOutputPrice.trim() !== "",
      },
      {
        label: "Text-to-speech",
        detail: `${formatNumber(generatedCharacters)} generated characters`,
        value: ttsCost,
        entered: ttsPricePerThousandCharacters.trim() !== "",
      },
      {
        label: "Fixed monthly costs",
        detail: "Subscriptions, phone numbers, monitoring, or hosting",
        value: fixedCosts,
        entered: fixedMonthlyCosts.trim() !== "",
      },
      {
        label: "Amortized setup cost",
        detail: `${formatMoney(setupCost)} spread across ${formatNumber(
          amortizationMonths,
        )} months`,
        value: amortizedSetupCost,
        entered: oneTimeSetupCost.trim() !== "",
      },
    ];

    const monthlyCost = rows.reduce((sum, row) => sum + row.value, 0);
    const hasAnyEnteredCost = rows.some((row) => row.entered);
    const hasBudget = monthlyBudget.trim() !== "";

    const variableCost =
      sttCost +
      platformCost +
      telephonyCost +
      recordingCost +
      llmInputCost +
      llmOutputCost +
      ttsCost;

    return {
      calls,
      plannedMinutes,
      billableMinutes,
      totalInputTokens,
      generatedCharacters,
      rows,
      monthlyCost,
      yearlyCost: monthlyCost * 12,
      costPerCall: calls > 0 ? monthlyCost / calls : 0,
      costPerBillableMinute:
        billableMinutes > 0 ? monthlyCost / billableMinutes : 0,
      costPerThousandCalls:
        calls > 0 ? (monthlyCost / calls) * 1_000 : 0,
      variableRatePerMinute:
        billableMinutes > 0 ? variableCost / billableMinutes : 0,
      budget,
      budgetDifference: budget - monthlyCost,
      hasAnyEnteredCost,
      hasBudget,
    };
  }, [
    agentSpeakingPercent,
    averageCallMinutes,
    fixedMonthlyCosts,
    llmInputPrice,
    llmInputTokensPerMinute,
    llmOutputPrice,
    llmOutputTokensPerMinute,
    monthlyBudget,
    monthlyCalls,
    oneTimeSetupCost,
    platformCostPerMinute,
    recordingCostPerMinute,
    setupAmortizationMonths,
    spokenCharactersPerMinute,
    sttCostPerMinute,
    telephonyCostPerMinute,
    ttsPricePerThousandCharacters,
    usageOverheadPercent,
  ]);

  const reset = () => {
    setMonthlyCalls("5000");
    setAverageCallMinutes("4");
    setUsageOverheadPercent("5");
    setMonthlyBudget("");
    setSttCostPerMinute("");
    setPlatformCostPerMinute("");
    setTelephonyCostPerMinute("");
    setRecordingCostPerMinute("");
    setLlmInputTokensPerMinute("600");
    setLlmOutputTokensPerMinute("120");
    setLlmInputPrice("");
    setLlmOutputPrice("");
    setAgentSpeakingPercent("45");
    setSpokenCharactersPerMinute("900");
    setTtsPricePerThousandCharacters("");
    setFixedMonthlyCosts("");
    setOneTimeSetupCost("");
    setSetupAmortizationMonths("12");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Voice Agent Workload
          </h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            Use the latest rates from your selected voice-agent stack.
          </p>
        </div>

        <label className="mt-6 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <input
            type="checkbox"
            checked
            readOnly
            aria-label="Custom stack prices are always enabled"
            className="pointer-events-none mt-1 h-4 w-4 accent-[var(--green)]"
          />
          <span>
            <span className="block font-medium text-gray-900">
              Use custom stack prices
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-gray-600">
              This calculator always uses the current provider rates you enter.
            </span>
          </span>
        </label>

        <BeeijaNotice>
          Price fields are blank by design. Copy the current rate for each exact
          provider, model, plan, region, and billing unit from its official
          pricing page before relying on the estimate.
        </BeeijaNotice>

        <FieldSection title="Call Volume">
          <BeeijaNumberField
            label="Calls per month"
            value={monthlyCalls}
            onChange={setMonthlyCalls}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Average call duration"
            value={averageCallMinutes}
            onChange={setAverageCallMinutes}
            min="0"
            step="0.1"
            suffix="min"
          />
          <BeeijaNumberField
            label="Retry and failed-call overhead"
            value={usageOverheadPercent}
            onChange={setUsageOverheadPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
          <BeeijaNumberField
            label="Your target monthly budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Per-Minute Stack Rates">
          <BeeijaNumberField
            label="Current speech-to-text rate per minute"
            value={sttCostPerMinute}
            onChange={setSttCostPerMinute}
            min="0"
            step="0.0001"
            prefix="$"
          />
          <BeeijaNumberField
            label="Current platform or orchestration rate per minute"
            value={platformCostPerMinute}
            onChange={setPlatformCostPerMinute}
            min="0"
            step="0.0001"
            prefix="$"
          />
          <BeeijaNumberField
            label="Current telephony rate per minute"
            value={telephonyCostPerMinute}
            onChange={setTelephonyCostPerMinute}
            min="0"
            step="0.0001"
            prefix="$"
          />
          <BeeijaNumberField
            label="Current call-recording rate per minute"
            value={recordingCostPerMinute}
            onChange={setRecordingCostPerMinute}
            min="0"
            step="0.0001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="LLM Usage and Prices">
          <BeeijaNumberField
            label="Input tokens per call minute"
            value={llmInputTokensPerMinute}
            onChange={setLlmInputTokensPerMinute}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Output tokens per call minute"
            value={llmOutputTokensPerMinute}
            onChange={setLlmOutputTokensPerMinute}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Current LLM input price per 1M tokens"
            value={llmInputPrice}
            onChange={setLlmInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />
          <BeeijaNumberField
            label="Current LLM output price per 1M tokens"
            value={llmOutputPrice}
            onChange={setLlmOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Text-to-Speech Usage">
          <BeeijaNumberField
            label="AI speaking share"
            value={agentSpeakingPercent}
            onChange={setAgentSpeakingPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
          <BeeijaNumberField
            label="Spoken characters per AI minute"
            value={spokenCharactersPerMinute}
            onChange={setSpokenCharactersPerMinute}
            min="0"
            step="1"
          />
          <BeeijaNumberField
            label="Current TTS price per 1K characters"
            value={ttsPricePerThousandCharacters}
            onChange={setTtsPricePerThousandCharacters}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Fixed and Setup Costs">
          <BeeijaNumberField
            label="Other fixed monthly costs"
            value={fixedMonthlyCosts}
            onChange={setFixedMonthlyCosts}
            min="0"
            step="1"
            prefix="$"
          />
          <BeeijaNumberField
            label="One-time setup cost"
            value={oneTimeSetupCost}
            onChange={setOneTimeSetupCost}
            min="0"
            step="1"
            prefix="$"
          />
          <BeeijaNumberField
            label="Setup amortization period"
            value={setupAmortizationMonths}
            onChange={setSetupAmortizationMonths}
            min="1"
            step="1"
            suffix="mo"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Usage used for this estimate
          </p>
          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>Planned minutes: {formatNumber(result.plannedMinutes)}</p>
            <p>Billable minutes: {formatNumber(result.billableMinutes)}</p>
            <p>LLM input tokens: {formatNumber(result.totalInputTokens)}</p>
            <p>
              Generated voice characters:{" "}
              {formatNumber(result.generatedCharacters)}
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
        title="Estimated Voice Agent Cost"
        description="This estimate combines the complete stack and the setup period entered above."
        primaryLabel="Estimated monthly cost"
        primaryValue={result.hasAnyEnteredCost ? formatMoney(result.monthlyCost) : "Enter prices"}
        stats={
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per call"
              value={result.hasAnyEnteredCost ? formatMoney(result.costPerCall) : "—"}
            />
            <ResultStat
              label="Per billable minute"
              value={result.hasAnyEnteredCost ? formatMoney(result.costPerBillableMinute) : "—"}
            />
            <ResultStat
              label="Per 1,000 calls"
              value={result.hasAnyEnteredCost ? formatMoney(result.costPerThousandCalls) : "—"}
            />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            {result.rows.map((row) => (
              <CostRow
                key={row.label}
                label={row.label}
                detail={row.detail}
                value={row.value}
                total={result.monthlyCost}
                entered={row.entered}
              />
            ))}
          </div>
        }
        totals={
          <div className="text-sm leading-relaxed text-gray-600">
            <p>
              Variable stack rate per minute:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyEnteredCost
                  ? formatMoney(result.variableRatePerMinute)
                  : "—"}
              </span>
            </p>
            <p className="mt-2">
              Estimated yearly cost:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyEnteredCost
                  ? formatMoney(result.yearlyCost)
                  : "—"}
              </span>
            </p>
            <p className="mt-2">
              Monthly budget:{" "}
              <span className="font-medium text-gray-900">
                {result.hasBudget ? formatMoney(result.budget) : "Not entered"}
              </span>
            </p>
            <p className="mt-2">
              Budget status:{" "}
              <span
                className={`font-semibold ${
                  result.budgetDifference >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasBudget
                  ? "Add a budget to compare"
                  : !result.hasAnyEnteredCost
                    ? "Enter current prices to compare"
                    : result.budgetDifference >= 0
                      ? `${formatMoney(result.budgetDifference)} remaining`
                      : `${formatMoney(
                          Math.abs(result.budgetDifference),
                        )} over budget`}
              </span>
            </p>
          </div>
        }
        noticeText="Beeija stores no built-in provider price in this calculator. Every monetary rate is entered by you. Verify each rate on the official provider page and avoid entering the same cost twice when a managed platform already includes part of the stack."
        provider="your selected voice-agent stack"
        pricingCheckedDate="the date you checked each provider"
        excludedCosts="taxes, regional pricing, concurrency charges, minimum billing increments, enterprise support, discounts, and services not entered here"
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
      <div className="mt-5 grid gap-5 md:grid-cols-2">{children}</div>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-gray-950">{value}</p>
    </div>
  );
}

function CostRow({
  label,
  detail,
  value,
  total,
  entered,
}: {
  label: string;
  detail: string;
  value: number;
  total: number;
  entered: boolean;
}) {
  const share = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 text-sm text-gray-500">{detail}</p>
        <p className="mt-1 text-xs text-gray-500">
          {entered ? `${formatNumber(share)}% of monthly total` : "Rate not entered"}
        </p>
      </div>
      <p className="font-semibold text-gray-950">
        {entered ? formatMoney(value) : "—"}
      </p>
    </div>
  );
}

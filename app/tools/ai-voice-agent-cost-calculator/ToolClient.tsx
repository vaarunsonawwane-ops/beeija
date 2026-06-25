"use client";

import { useMemo, useState } from "react";
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
  const [platformCostPerMinute, setPlatformCostPerMinute] = useState("");
  const [telephonyCostPerMinute, setTelephonyCostPerMinute] = useState("");
  const [recordingCostPerMinute, setRecordingCostPerMinute] = useState("");

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
    const averageMinutes = toNumber(averageCallMinutes);
    const overhead = clampPercent(usageOverheadPercent);
    const budget = toNumber(monthlyBudget);

    const plannedMinutes = calls * averageMinutes;
    const billableMinutes = plannedMinutes * (1 + overhead / 100);

    const sttCost = billableMinutes * toNumber(sttCostPerMinute);
    const platformCost = billableMinutes * toNumber(platformCostPerMinute);
    const telephonyCost = billableMinutes * toNumber(telephonyCostPerMinute);
    const recordingCost = billableMinutes * toNumber(recordingCostPerMinute);

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
      billableMinutes * speakingShare * toNumber(spokenCharactersPerMinute);
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
        label: "Other fixed monthly costs",
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
      totalOutputTokens,
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
      hasBudget: monthlyBudget.trim() !== "",
      hasAnyEnteredCost: rows.some((row) => row.entered),
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
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Voice Agent Usage
          </h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            Add your workload and the current rates from the providers in your
            voice-agent stack.
          </p>
        </div>

        <BeeijaNotice>
          Price fields are blank by design. Copy the current rate for each exact
          provider, model, region, plan, and billing unit from its official
          pricing page.
        </BeeijaNotice>

        <div className="mt-7">
          <p className="text-sm font-semibold text-gray-900">Call workload</p>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
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
              label="Target monthly budget"
              value={monthlyBudget}
              onChange={setMonthlyBudget}
              min="0"
              step="1"
              prefix="$"
            />
          </div>
        </div>

        <div className="mt-7 border-t border-gray-100 pt-6">
          <p className="text-sm font-semibold text-gray-900">
            Per-minute stack rates
          </p>
          <div className="mt-4 grid min-w-0 gap-5 md:grid-cols-2 [&>*]:min-w-0 [&_input]:min-w-0 [&_input]:w-full [&_input]:overflow-hidden [&_input]:text-ellipsis [&_input]:whitespace-nowrap [&_input]:pr-16">
            <BeeijaNumberField
              label="Speech-to-text rate"
              value={sttCostPerMinute}
              onChange={setSttCostPerMinute}
              min="0"
              step="0.0001"
              prefix="$"
              suffix="/min"
            />
            <BeeijaNumberField
              label="Platform or orchestration rate"
              value={platformCostPerMinute}
              onChange={setPlatformCostPerMinute}
              min="0"
              step="0.0001"
              prefix="$"
              suffix="/min"
            />
            <BeeijaNumberField
              label="Telephony rate"
              value={telephonyCostPerMinute}
              onChange={setTelephonyCostPerMinute}
              min="0"
              step="0.0001"
              prefix="$"
              suffix="/min"
            />
            <BeeijaNumberField
              label="Call-recording rate"
              value={recordingCostPerMinute}
              onChange={setRecordingCostPerMinute}
              min="0"
              step="0.0001"
              prefix="$"
              suffix="/min"
            />
          </div>
        </div>

        <div className="mt-7 border-t border-gray-100 pt-6">
          <p className="text-sm font-semibold text-gray-900">
            LLM usage and prices
          </p>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
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
              label="LLM input price per 1M tokens"
              value={llmInputPrice}
              onChange={setLlmInputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />
            <BeeijaNumberField
              label="LLM output price per 1M tokens"
              value={llmOutputPrice}
              onChange={setLlmOutputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />
          </div>
        </div>

        <div className="mt-7 border-t border-gray-100 pt-6">
          <p className="text-sm font-semibold text-gray-900">
            Voice generation and fixed costs
          </p>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
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
              label="TTS price per 1K characters"
              value={ttsPricePerThousandCharacters}
              onChange={setTtsPricePerThousandCharacters}
              min="0"
              step="0.001"
              prefix="$"
            />
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
          </div>
        </div>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Usage used for this estimate
          </p>
          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p className="min-w-0 break-words [overflow-wrap:anywhere]">
              Planned minutes: {formatNumber(result.plannedMinutes)}
            </p>
            <p className="min-w-0 break-words [overflow-wrap:anywhere]">
              Billable minutes: {formatNumber(result.billableMinutes)}
            </p>
            <p className="min-w-0 break-words [overflow-wrap:anywhere]">
              LLM input tokens: {formatNumber(result.totalInputTokens)}
            </p>
            <p className="min-w-0 break-words [overflow-wrap:anywhere]">
              LLM output tokens: {formatNumber(result.totalOutputTokens)}
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
        description="Costs not entered are treated as zero, so complete every relevant rate before making a purchase decision."
        primaryLabel="Estimated monthly cost"
        primaryValue={
          result.hasAnyEnteredCost ? formatVisibleMoney(result.monthlyCost) : "Enter prices"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per call"
              value={
                result.hasAnyEnteredCost ? formatVisibleMoney(result.costPerCall) : "—"
              }
            />
            <ResultStat
              label="Per billable minute"
              value={
                result.hasAnyEnteredCost
                  ? formatVisibleMoney(result.costPerBillableMinute)
                  : "—"
              }
            />
            <ResultStat
              label="Per 1,000 calls"
              value={
                result.hasAnyEnteredCost
                  ? formatVisibleMoney(result.costPerThousandCalls)
                  : "—"
              }
            />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            {result.rows.map((row) => (
              <CostRow key={row.label} row={row} />
            ))}
          </div>
        }
        totals={
          <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
            <p>
              Variable stack rate per minute:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyEnteredCost
                  ? formatVisibleMoney(result.variableRatePerMinute)
                  : "—"}
              </span>
            </p>
            <p className="mt-2">
              Estimated yearly cost:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyEnteredCost
                  ? formatVisibleMoney(result.yearlyCost)
                  : "—"}
              </span>
            </p>
            <p className="mt-2">
              Budget status:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasBudget
                  ? "Add a budget to compare"
                  : !result.hasAnyEnteredCost
                    ? "Enter current prices to compare"
                    : result.budgetDifference >= 0
                      ? `${formatVisibleMoney(result.budgetDifference)} remaining`
                      : `${formatVisibleMoney(
                          Math.abs(result.budgetDifference),
                        )} over budget`}
              </span>
            </p>
          </div>
        }
        noticeText="Beeija stores no built-in provider rate in this calculator. Verify every speech-to-text, LLM, text-to-speech, telephony, platform, recording, and fixed cost on the relevant official page."
      />
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 break-words font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

function CostRow({ row }: { row: CostRowData }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">{row.label}</p>
        <p className="mt-1 break-words text-sm text-gray-500 [overflow-wrap:anywhere]">
          {row.detail}
        </p>
      </div>
      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {row.entered ? formatVisibleMoney(row.value) : "—"}
      </p>
    </div>
  );
}

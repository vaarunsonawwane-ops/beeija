"use client";

import { useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type ProcessingMode = "pre-recorded" | "real-time";

type BillingBasis = "audio" | "session";

type FlatPlan = {
  id: string;
  provider: string;
  model: string;
  mode: ProcessingMode;
  ratePerMinute: number;
  billingBasis?: BillingBasis;
  note?: string;
};

type ComparisonRow = {
  id: string;
  provider: string;
  model: string;
  monthlyCost: number;
  yearlyCost: number;
  effectiveRatePerHour: number;
  note?: string;
};

const FLAT_PLANS: FlatPlan[] = [
  {
    id: "deepgram-nova-3-mono-prerecorded",
    provider: "Deepgram",
    model: "Nova-3 Monolingual",
    mode: "pre-recorded",
    ratePerMinute: 0.0077,
  },
  {
    id: "deepgram-nova-3-multi-prerecorded",
    provider: "Deepgram",
    model: "Nova-3 Multilingual",
    mode: "pre-recorded",
    ratePerMinute: 0.0092,
  },
  {
    id: "assembly-universal-3-pro-prerecorded",
    provider: "AssemblyAI",
    model: "Universal-3 Pro",
    mode: "pre-recorded",
    ratePerMinute: 0.21 / 60,
  },
  {
    id: "assembly-universal-2-prerecorded",
    provider: "AssemblyAI",
    model: "Universal-2",
    mode: "pre-recorded",
    ratePerMinute: 0.15 / 60,
  },
  {
    id: "google-v2-dynamic-batch",
    provider: "Google Cloud",
    model: "Speech-to-Text V2 Dynamic Batch",
    mode: "pre-recorded",
    ratePerMinute: 0.003,
    note: "Asynchronous dynamic batch recognition",
  },
  {
    id: "openai-realtime-whisper",
    provider: "OpenAI",
    model: "GPT-Realtime-Whisper",
    mode: "real-time",
    ratePerMinute: 0.017,
  },
  {
    id: "deepgram-flux-english-streaming",
    provider: "Deepgram",
    model: "Flux English",
    mode: "real-time",
    ratePerMinute: 0.0065,
    note: "Official streaming promotional rate",
  },
  {
    id: "deepgram-flux-multilingual-streaming",
    provider: "Deepgram",
    model: "Flux Multilingual",
    mode: "real-time",
    ratePerMinute: 0.0078,
    note: "Official streaming promotional rate",
  },
  {
    id: "deepgram-nova-3-mono-streaming",
    provider: "Deepgram",
    model: "Nova-3 Monolingual",
    mode: "real-time",
    ratePerMinute: 0.0048,
    note: "Official streaming promotional rate",
  },
  {
    id: "deepgram-nova-3-multi-streaming",
    provider: "Deepgram",
    model: "Nova-3 Multilingual",
    mode: "real-time",
    ratePerMinute: 0.0058,
    note: "Official streaming promotional rate",
  },
  {
    id: "assembly-universal-3-pro-streaming",
    provider: "AssemblyAI",
    model: "Universal-3 Pro Streaming",
    mode: "real-time",
    ratePerMinute: 0.45 / 60,
    billingBasis: "session",
  },
  {
    id: "assembly-universal-streaming",
    provider: "AssemblyAI",
    model: "Universal-Streaming",
    mode: "real-time",
    ratePerMinute: 0.15 / 60,
    billingBasis: "session",
  },
  {
    id: "assembly-universal-streaming-multilingual",
    provider: "AssemblyAI",
    model: "Universal-Streaming Multilingual",
    mode: "real-time",
    ratePerMinute: 0.15 / 60,
    billingBasis: "session",
  },
];

const modeOptions = [
  { value: "pre-recorded", label: "Pre-recorded audio" },
  { value: "real-time", label: "Real-time or streaming audio" },
];

const billingBasisOptions = [
  { value: "audio", label: "Processed audio duration" },
  { value: "session", label: "Open streaming session duration" },
];

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateGoogleV2StandardCost(totalMinutes: number) {
  let remaining = totalMinutes;
  let cost = 0;

  const tiers = [
    { minutes: 500_000, rate: 0.016 },
    { minutes: 500_000, rate: 0.01 },
    { minutes: 1_000_000, rate: 0.008 },
    { minutes: Number.POSITIVE_INFINITY, rate: 0.004 },
  ];

  for (const tier of tiers) {
    if (remaining <= 0) break;

    const used = Math.min(remaining, tier.minutes);
    cost += used * tier.rate;
    remaining -= used;
  }

  return cost;
}

export default function ToolClient() {
  const [mode, setMode] = useState<ProcessingMode>("pre-recorded");
  const [monthlyAudioHours, setMonthlyAudioHours] = useState("1000");
  const [retryPercent, setRetryPercent] = useState("5");
  const [streamingSessionOverheadPercent, setStreamingSessionOverheadPercent] =
    useState("10");
  const [includeCustom, setIncludeCustom] = useState(false);
  const [customProviderName, setCustomProviderName] =
    useState("Custom Provider");
  const [customRatePerHour, setCustomRatePerHour] = useState("");
  const [customBillingBasis, setCustomBillingBasis] =
    useState<BillingBasis>("audio");

  const results = useMemo(() => {
    const baseHours = toNumber(monthlyAudioHours);
    const retryRate = Math.min(100, Math.max(0, toNumber(retryPercent)));
    const billableAudioHours = baseHours * (1 + retryRate / 100);
    const streamingOverhead = Math.min(
      500,
      Math.max(0, toNumber(streamingSessionOverheadPercent)),
    );
    const billableSessionHours =
      mode === "real-time"
        ? billableAudioHours * (1 + streamingOverhead / 100)
        : billableAudioHours;
    const billableAudioMinutes = billableAudioHours * 60;
    const billableSessionMinutes = billableSessionHours * 60;

    const rows: ComparisonRow[] = FLAT_PLANS.filter(
      (plan) => plan.mode === mode,
    ).map((plan) => {
      const usageMinutes =
        plan.billingBasis === "session"
          ? billableSessionMinutes
          : billableAudioMinutes;
      const monthlyCost = usageMinutes * plan.ratePerMinute;

      return {
        id: plan.id,
        provider: plan.provider,
        model: plan.model,
        monthlyCost,
        yearlyCost: monthlyCost * 12,
        effectiveRatePerHour: plan.ratePerMinute * 60,
        note:
          plan.billingBasis === "session"
            ? "Billed by open streaming session duration"
            : plan.note,
      };
    });

    const googleStandardCost =
      calculateGoogleV2StandardCost(billableAudioMinutes);

    rows.push({
      id: `google-v2-standard-${mode}`,
      provider: "Google Cloud",
      model:
        mode === "pre-recorded"
          ? "Speech-to-Text V2 Standard"
          : "Speech-to-Text V2 Standard Streaming",
      monthlyCost: googleStandardCost,
      yearlyCost: googleStandardCost * 12,
      effectiveRatePerHour:
        billableAudioHours > 0 ? googleStandardCost / billableAudioHours : 0,
      note: "Official progressive monthly volume tiers",
    });

    if (includeCustom && customRatePerHour.trim() !== "") {
      const customHourlyRate = toNumber(customRatePerHour);
      const customUsesSession =
        mode === "real-time" && customBillingBasis === "session";
      const customHours = customUsesSession
        ? billableSessionHours
        : billableAudioHours;
      const customMonthlyCost = customHours * customHourlyRate;

      rows.push({
        id: "custom-provider",
        provider: customProviderName.trim() || "Custom Provider",
        model: "Custom hourly rate",
        monthlyCost: customMonthlyCost,
        yearlyCost: customMonthlyCost * 12,
        effectiveRatePerHour: customHourlyRate,
        note: `User-entered price · ${customUsesSession ? "session duration" : "audio duration"}`,
      });
    }

    const sortedRows = rows.sort(
      (a, b) => a.monthlyCost - b.monthlyCost,
    );

    const cheapest = sortedRows[0];
    const mostExpensive = sortedRows[sortedRows.length - 1];

    return {
      baseHours,
      billableAudioHours,
      billableSessionHours,
      billableAudioMinutes,
      rows: sortedRows,
      cheapest,
      mostExpensive,
      monthlySavings:
        cheapest && mostExpensive
          ? mostExpensive.monthlyCost - cheapest.monthlyCost
          : 0,
      yearlySavings:
        cheapest && mostExpensive
          ? (mostExpensive.monthlyCost - cheapest.monthlyCost) * 12
          : 0,
    };
  }, [
    customProviderName,
    customRatePerHour,
    customBillingBasis,
    includeCustom,
    mode,
    monthlyAudioHours,
    retryPercent,
    streamingSessionOverheadPercent,
  ]);

  const reset = () => {
    setMode("pre-recorded");
    setMonthlyAudioHours("1000");
    setRetryPercent("5");
    setStreamingSessionOverheadPercent("10");
    setIncludeCustom(false);
    setCustomProviderName("Custom Provider");
    setCustomRatePerHour("");
    setCustomBillingBasis("audio");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Transcription Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Compare applicable providers using total billable audio hours.
          </p>
        </div>

        <div className="mt-7 grid gap-5">
          <BeeijaSelect
            label="Processing mode"
            value={mode}
            onChange={(event) =>
              setMode(event.target.value as ProcessingMode)
            }
            options={modeOptions}
          />

          <BeeijaNumberField
            label={
              mode === "real-time"
                ? "Live audio hours per month"
                : "Billable audio hours per month"
            }
            value={monthlyAudioHours}
            onChange={setMonthlyAudioHours}
            min="0"
            step="0.1"
          />

          <BeeijaNumberField
            label="Retry or repeat-processing allowance"
            value={retryPercent}
            onChange={setRetryPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          {mode === "real-time" ? (
            <BeeijaNumberField
              label="Open-session overhead for session-billed providers"
              value={streamingSessionOverheadPercent}
              onChange={setStreamingSessionOverheadPercent}
              min="0"
              max="500"
              step="1"
              suffix="%"
            />
          ) : null}
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <input
            type="checkbox"
            checked={includeCustom}
            onChange={(event) => setIncludeCustom(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--green)]"
          />

          <span>
            <span className="block font-medium text-gray-900">
              Add a custom provider
            </span>

            <span className="mt-1 block text-sm leading-relaxed text-gray-600">
              Compare a private quote or another provider&apos;s hourly rate.
              The price field starts blank.
            </span>
          </span>
        </label>

        {includeCustom ? (
          <div className="mt-5 grid gap-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Provider name
              </span>

              <input
                type="text"
                value={customProviderName}
                onChange={(event) =>
                  setCustomProviderName(event.target.value)
                }
                className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition hover:border-gray-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
              />
            </label>

            {mode === "real-time" ? (
              <BeeijaSelect
                label="Custom provider billing basis"
                value={customBillingBasis}
                onChange={(event) =>
                  setCustomBillingBasis(event.target.value as BillingBasis)
                }
                options={billingBasisOptions}
              />
            ) : null}

            <BeeijaNumberField
              label="Custom price per billable hour"
              value={customRatePerHour}
              onChange={setCustomRatePerHour}
              min="0"
              step="0.001"
              prefix="$"
            />
          </div>
        ) : null}

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Billable usage used for comparison
          </p>

          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>
              Base audio: {formatNumber(results.baseHours)} hours per month
            </p>
            <p>
              After retries: {formatNumber(results.billableAudioHours)} hours per
              month
            </p>
            {mode === "real-time" ? (
              <p>
                Session-billed usage: {formatNumber(results.billableSessionHours)}
                hours per month
              </p>
            ) : null}
            <p>
              Comparison mode:{" "}
              {mode === "pre-recorded" ? "Pre-recorded" : "Real-time"}
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
        title="Transcription Cost Comparison"
        description="Applicable options are ranked from lowest to highest estimated monthly cost."
        primaryLabel="Lowest estimated monthly cost"
        primaryValue={
          results.cheapest
            ? formatVisibleMoney(results.cheapest.monthlyCost)
            : "$0.00"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Lowest-cost option"
              value={
                results.cheapest
                  ? `${results.cheapest.provider} — ${results.cheapest.model}`
                  : "—"
              }
            />

            <ResultStat
              label="Monthly saving"
              value={formatVisibleMoney(results.monthlySavings)}
            />

            <ResultStat
              label="Yearly saving"
              value={formatVisibleMoney(results.yearlySavings)}
            />
          </div>
        }
        breakdown={
          <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="hidden grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 2xl:grid">
              <span>Provider and model</span>
              <span>Per hour</span>
              <span>Monthly</span>
              <span>Yearly</span>
            </div>

            <div className="divide-y divide-gray-200">
              {results.rows.map((row, index) => (
                <div
                  key={row.id}
                  className="grid min-w-0 gap-4 px-4 py-4 2xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] 2xl:items-start"
                >
                  <div className="min-w-0">
                    <p className="break-words font-medium text-gray-900 [overflow-wrap:anywhere]">
                      {index === 0 ? "Best price · " : ""}
                      {row.provider}
                    </p>

                    <p className="mt-1 break-words text-sm text-gray-600 [overflow-wrap:anywhere]">
                      {row.model}
                    </p>

                    {row.note ? (
                      <p className="mt-1 break-words text-xs text-gray-500 [overflow-wrap:anywhere]">
                        {row.note}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 2xl:contents">
                    <ComparisonValue
                      label="Per hour"
                      value={formatVisibleMoney(row.effectiveRatePerHour)}
                    />

                    <ComparisonValue
                      label="Monthly"
                      value={formatVisibleMoney(row.monthlyCost)}
                      emphasis
                    />

                    <ComparisonValue
                      label="Yearly"
                      value={formatVisibleMoney(row.yearlyCost)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
        totals={
          <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
            <p>
              Billable audio:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(results.billableAudioHours)} hours per month
              </span>
            </p>

            <p className="mt-2">
              Billable minutes:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(results.billableAudioMinutes)}
              </span>
            </p>

            <p className="mt-2">
              Highest estimated monthly cost:{" "}
              <span className="font-medium text-gray-900">
                {results.mostExpensive
                  ? formatVisibleMoney(results.mostExpensive.monthlyCost)
                  : "$0.00"}
              </span>
            </p>
          </div>
        }
        provider="OpenAI, Deepgram, AssemblyAI, and Google Cloud"
        pricingCheckedDate="June 19, 2026"
        excludedCosts="speaker diarization, redaction, medical mode, keyterm prompting, storage, network transfer, support plans, compliance fees, taxes, negotiated discounts, and other services"
      />
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
    <div className="min-w-0 rounded-lg bg-gray-50 px-3 py-3 2xl:rounded-none 2xl:bg-transparent 2xl:px-0 2xl:py-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 2xl:hidden">
        {label}
      </p>

      <p
        className={`mt-1 break-words [overflow-wrap:anywhere] 2xl:mt-0 ${
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

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold leading-snug text-gray-950 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

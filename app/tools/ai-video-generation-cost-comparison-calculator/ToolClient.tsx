"use client";

import { useEffect, useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type VideoPlan = {
  id: string;
  provider: string;
  model: string;
  ratePerSecond: number;
  minimumPerGeneration?: number;
  note: string;
};

type ComparisonRow = VideoPlan & {
  costPerGeneratedClip: number;
  costPerUsableClip: number;
  monthlyCost: number;
  yearlyCost: number;
  usableClipsPerHundredDollars: number;
};

const VIDEO_PLANS: VideoPlan[] = [
  {
    id: "google-veo-3-1-lite-720",
    provider: "Google",
    model: "Veo 3.1 Lite · 720p · with audio",
    ratePerSecond: 0.05,
    note: "Gemini API paid tier",
  },
  {
    id: "google-veo-3-1-lite-1080",
    provider: "Google",
    model: "Veo 3.1 Lite · 1080p · with audio",
    ratePerSecond: 0.08,
    note: "Gemini API paid tier",
  },
  {
    id: "google-veo-3-1-fast-720",
    provider: "Google",
    model: "Veo 3.1 Fast · 720p · with audio",
    ratePerSecond: 0.1,
    note: "Gemini API paid tier",
  },
  {
    id: "google-veo-3-1-fast-1080",
    provider: "Google",
    model: "Veo 3.1 Fast · 1080p · with audio",
    ratePerSecond: 0.12,
    note: "Gemini API paid tier",
  },
  {
    id: "google-veo-3-1-fast-4k",
    provider: "Google",
    model: "Veo 3.1 Fast · 4K · with audio",
    ratePerSecond: 0.3,
    note: "Gemini API paid tier",
  },
  {
    id: "google-veo-3-1-standard-720-1080",
    provider: "Google",
    model: "Veo 3.1 Standard · 720p or 1080p · with audio",
    ratePerSecond: 0.4,
    note: "Gemini API paid tier",
  },
  {
    id: "google-veo-3-1-standard-4k",
    provider: "Google",
    model: "Veo 3.1 Standard · 4K · with audio",
    ratePerSecond: 0.6,
    note: "Gemini API paid tier",
  },
  {
    id: "runway-gen-4-turbo",
    provider: "Runway",
    model: "Gen-4 Turbo",
    ratePerSecond: 0.05,
    note: "5 credits per second",
  },
  {
    id: "runway-act-two",
    provider: "Runway",
    model: "Act-Two",
    ratePerSecond: 0.05,
    note: "5 credits per second",
  },
  {
    id: "runway-gen-4-5",
    provider: "Runway",
    model: "Gen-4.5",
    ratePerSecond: 0.12,
    note: "12 credits per second",
  },
  {
    id: "runway-happyhorse-720",
    provider: "Runway",
    model: "HappyHorse 1.0 · 720p",
    ratePerSecond: 0.15,
    note: "15 credits per second",
  },
  {
    id: "runway-happyhorse-1080",
    provider: "Runway",
    model: "HappyHorse 1.0 · 1080p",
    ratePerSecond: 0.3,
    note: "30 credits per second",
  },
  {
    id: "runway-veo-3-1-fast-no-audio",
    provider: "Runway",
    model: "Veo 3.1 Fast · no audio",
    ratePerSecond: 0.1,
    note: "10 credits per second",
  },
  {
    id: "runway-veo-3-1-fast-audio",
    provider: "Runway",
    model: "Veo 3.1 Fast · with audio",
    ratePerSecond: 0.15,
    note: "15 credits per second",
  },
  {
    id: "runway-veo-3-1-no-audio",
    provider: "Runway",
    model: "Veo 3.1 · no audio",
    ratePerSecond: 0.2,
    note: "20 credits per second",
  },
  {
    id: "runway-veo-3-1-audio",
    provider: "Runway",
    model: "Veo 3.1 · with audio",
    ratePerSecond: 0.4,
    note: "40 credits per second",
  },
  {
    id: "runway-veo-3",
    provider: "Runway",
    model: "Veo 3",
    ratePerSecond: 0.4,
    note: "40 credits per second",
  },
  {
    id: "runway-seedance-2-fast-480-720",
    provider: "Runway",
    model: "Seedance 2 Fast · 480p or 720p",
    ratePerSecond: 0.29,
    note: "29 credits per second",
  },
  {
    id: "runway-seedance-2-480-720",
    provider: "Runway",
    model: "Seedance 2 · 480p or 720p",
    ratePerSecond: 0.36,
    note: "36 credits per second",
  },
  {
    id: "runway-seedance-2-1080",
    provider: "Runway",
    model: "Seedance 2 · 1080p",
    ratePerSecond: 0.4,
    note: "40 credits per second",
  },
  {
    id: "runway-aleph-2",
    provider: "Runway",
    model: "Aleph 2",
    ratePerSecond: 0.28,
    minimumPerGeneration: 0.56,
    note: "28 credits per second · 56-credit minimum",
  },
];

const defaultModelId = "google-veo-3-1-lite-720";

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

function formatVisibleNumber(value: number) {
  return formatNumber(value).replace(/,/g, ",\u200B");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateClipCost(plan: VideoPlan, clipSeconds: number) {
  const durationCost = plan.ratePerSecond * clipSeconds;
  return Math.max(durationCost, plan.minimumPerGeneration ?? 0);
}

export default function ToolClient() {
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);
  const [usableClipsPerMonth, setUsableClipsPerMonth] = useState("100");
  const [secondsPerClip, setSecondsPerClip] = useState("8");
  const [attemptsPerUsableClip, setAttemptsPerUsableClip] = useState("3");
  const [monthlyBudget, setMonthlyBudget] = useState("500");

  const [includeCustom, setIncludeCustom] = useState(false);
  const [customProviderName, setCustomProviderName] =
    useState("Custom Provider");
  const [customModelName, setCustomModelName] = useState("Custom Video Model");
  const [customRatePerSecond, setCustomRatePerSecond] = useState("");
  const [customMinimumPerGeneration, setCustomMinimumPerGeneration] =
    useState("");

  const customPlan = useMemo<VideoPlan | null>(() => {
    if (!includeCustom || customRatePerSecond.trim() === "") {
      return null;
    }

    return {
      id: "custom-provider",
      provider: customProviderName.trim() || "Custom Provider",
      model: customModelName.trim() || "Custom Video Model",
      ratePerSecond: toNumber(customRatePerSecond),
      minimumPerGeneration: toNumber(customMinimumPerGeneration),
      note: "User-entered price",
    };
  }, [
    customMinimumPerGeneration,
    customModelName,
    customProviderName,
    customRatePerSecond,
    includeCustom,
  ]);

  const availablePlans = useMemo(
    () => (customPlan ? [...VIDEO_PLANS, customPlan] : VIDEO_PLANS),
    [customPlan],
  );

  const modelOptions = useMemo(
    () =>
      availablePlans.map((plan) => ({
        value: plan.id,
        label: `${plan.provider} — ${plan.model}`,
      })),
    [availablePlans],
  );

  useEffect(() => {
    if (
      selectedModelId === "custom-provider" &&
      !availablePlans.some((plan) => plan.id === "custom-provider")
    ) {
      setSelectedModelId(defaultModelId);
    }
  }, [availablePlans, selectedModelId]);

  const result = useMemo(() => {
    const usableClips = toNumber(usableClipsPerMonth);
    const clipSeconds = toNumber(secondsPerClip);
    const attempts = Math.max(1, toNumber(attemptsPerUsableClip));
    const budget = toNumber(monthlyBudget);

    const totalGenerations = usableClips * attempts;
    const totalGeneratedSeconds = totalGenerations * clipSeconds;

    const rows: ComparisonRow[] = availablePlans
      .map((plan) => {
        const costPerGeneratedClip = calculateClipCost(plan, clipSeconds);
        const costPerUsableClip = costPerGeneratedClip * attempts;
        const monthlyCost = costPerUsableClip * usableClips;

        return {
          ...plan,
          costPerGeneratedClip,
          costPerUsableClip,
          monthlyCost,
          yearlyCost: monthlyCost * 12,
          usableClipsPerHundredDollars:
            costPerUsableClip > 0 ? 100 / costPerUsableClip : 0,
        };
      })
      .sort((a, b) => a.monthlyCost - b.monthlyCost);

    const selected =
      rows.find((row) => row.id === selectedModelId) ??
      rows.find((row) => row.id === defaultModelId) ??
      rows[0];

    const cheapest = rows[0];
    const mostExpensive = rows[rows.length - 1];

    return {
      usableClips,
      clipSeconds,
      attempts,
      totalGenerations,
      totalGeneratedSeconds,
      totalGeneratedMinutes: totalGeneratedSeconds / 60,
      rows,
      selected,
      cheapest,
      mostExpensive,
      budget,
      budgetDifference: selected ? budget - selected.monthlyCost : budget,
      monthlySavingVsSelected:
        selected && cheapest ? selected.monthlyCost - cheapest.monthlyCost : 0,
    };
  }, [
    attemptsPerUsableClip,
    availablePlans,
    monthlyBudget,
    secondsPerClip,
    selectedModelId,
    usableClipsPerMonth,
  ]);

  const reset = () => {
    setSelectedModelId(defaultModelId);
    setUsableClipsPerMonth("100");
    setSecondsPerClip("8");
    setAttemptsPerUsableClip("3");
    setMonthlyBudget("500");
    setIncludeCustom(false);
    setCustomProviderName("Custom Provider");
    setCustomModelName("Custom Video Model");
    setCustomRatePerSecond("");
    setCustomMinimumPerGeneration("");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your AI Video Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Compare the same usable-video target across current provider rates.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <BeeijaSelect
              label="Selected provider and model"
              value={selectedModelId}
              onChange={(event) => setSelectedModelId(event.target.value)}
              options={modelOptions}
            />
          </div>

          <BeeijaNumberField
            label="Usable clips needed per month"
            value={usableClipsPerMonth}
            onChange={setUsableClipsPerMonth}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Seconds per clip"
            value={secondsPerClip}
            onChange={setSecondsPerClip}
            min="0"
            step="1"
            suffix="sec"
          />

          <BeeijaNumberField
            label="Generation attempts per usable clip"
            value={attemptsPerUsableClip}
            onChange={setAttemptsPerUsableClip}
            min="1"
            step="0.1"
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
              Compare another API, negotiated rate, or private quote.
            </span>
          </span>
        </label>

        {includeCustom ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
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
                className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition hover:border-gray-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Model or plan name
              </span>

              <input
                type="text"
                value={customModelName}
                onChange={(event) => setCustomModelName(event.target.value)}
                className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition hover:border-gray-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
              />
            </label>

            <BeeijaNumberField
              label="Current price per generated second"
              value={customRatePerSecond}
              onChange={setCustomRatePerSecond}
              min="0"
              step="0.001"
              prefix="$"
            />

            <BeeijaNumberField
              label="Minimum charge per generation"
              value={customMinimumPerGeneration}
              onChange={setCustomMinimumPerGeneration}
              min="0"
              step="0.01"
              prefix="$"
            />
          </div>
        ) : null}

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Production volume used for comparison
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>Usable clips: {formatVisibleNumber(result.usableClips)}</p>
            <p>Total generations: {formatVisibleNumber(result.totalGenerations)}</p>
            <p>
              Generated seconds: {formatVisibleNumber(result.totalGeneratedSeconds)}
            </p>
            <p>
              Generated minutes: {formatVisibleNumber(result.totalGeneratedMinutes)}
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
        title="AI Video Cost Comparison"
        description="The selected model is shown first, followed by a ranked comparison for the same production target."
        primaryLabel="Selected model monthly cost"
        primaryValue={
          result.selected ? formatVisibleMoney(result.selected.monthlyCost) : "$0.00"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per usable clip"
              value={
                result.selected
                  ? formatVisibleMoney(result.selected.costPerUsableClip)
                  : "$0.00"
              }
            />

            <ResultStat
              label="Per generated clip"
              value={
                result.selected
                  ? formatVisibleMoney(result.selected.costPerGeneratedClip)
                  : "$0.00"
              }
            />

            <ResultStat
              label="Per year"
              value={
                result.selected
                  ? formatVisibleMoney(result.selected.yearlyCost)
                  : "$0.00"
              }
            />
          </div>
        }
        breakdown={
          <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="sticky top-0 z-10 hidden grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 2xl:grid">
              <span>Provider and model</span>
              <span>Per second</span>
              <span>Per usable clip</span>
              <span>Monthly</span>
            </div>

            <div className="max-h-[44rem] divide-y divide-gray-200 overflow-y-auto overscroll-contain">
              {result.rows.map((row, index) => (
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
                      label="Per second"
                      value={formatVisibleMoney(row.ratePerSecond)}
                    />

                    <ComparisonValue
                      label="Per usable clip"
                      value={formatVisibleMoney(row.costPerUsableClip)}
                    />

                    <ComparisonValue
                      label="Monthly"
                      value={formatVisibleMoney(row.monthlyCost)}
                      emphasis
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
              Selected model:{" "}
              <span className="font-medium text-gray-900">
                {result.selected
                  ? `${result.selected.provider} — ${result.selected.model}`
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Lowest-cost option:{" "}
              <span className="font-medium text-gray-900">
                {result.cheapest
                  ? `${result.cheapest.provider} — ${result.cheapest.model}`
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Possible monthly saving against selected model:{" "}
              <span className="font-medium text-gray-900">
                {formatVisibleMoney(result.monthlySavingVsSelected)}
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
                {result.budgetDifference >= 0
                  ? `${formatVisibleMoney(result.budgetDifference)} remaining`
                  : `${formatVisibleMoney(
                      Math.abs(result.budgetDifference),
                    )} over budget`}
              </span>
            </p>
          </div>
        }
        provider="Google Veo 3.1 and Runway API"
        pricingCheckedDate="June 19, 2026"
        excludedCosts="subscriptions, source-image generation, voiceover, music, editing, upscaling, storage, taxes, discounts, failed jobs charged under different provider rules, and other production services"
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

      <p className="mt-1 break-words font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

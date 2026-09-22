"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaResultLine from "@/app/components/BeeijaResultLine";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type ModelKey = "deepseek-flash" | "deepseek-v4-pro";

type RateSet = {
  cacheHitInput: number;
  cacheMissInput: number;
  output: number;
};

type ModelDefinition = {
  label: string;
  apiName: string;
  peak: RateSet;
  offPeak: RateSet;
  contextWindow: number;
  maxOutput: number;
  concurrencyLimit: number;
};

const MODEL_PRICES: Record<ModelKey, ModelDefinition> = {
  "deepseek-flash": {
    label: "DeepSeek V4.1 Flash",
    apiName: "deepseek-flash",
    peak: {
      cacheHitInput: 0.006,
      cacheMissInput: 0.3,
      output: 1.2,
    },
    offPeak: {
      cacheHitInput: 0.003,
      cacheMissInput: 0.15,
      output: 0.6,
    },
    contextWindow: 1_000_000,
    maxOutput: 384_000,
    concurrencyLimit: 2_500,
  },
  "deepseek-v4-pro": {
    label: "DeepSeek V4 Pro",
    apiName: "deepseek-v4-pro",
    peak: {
      cacheHitInput: 0.044,
      cacheMissInput: 1.32,
      output: 3.96,
    },
    offPeak: {
      cacheHitInput: 0.022,
      cacheMissInput: 0.66,
      output: 1.98,
    },
    contextWindow: 1_000_000,
    maxOutput: 384_000,
    concurrencyLimit: 500,
  },
};

const modelOptions = Object.entries(MODEL_PRICES).map(([value, model]) => ({
  value,
  label: model.label,
}));

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function isValidNonNegativeInteger(value: string) {
  const trimmed = value.trim();

  if (!/^\d+$/.test(trimmed)) {
    return false;
  }

  const parsed = Number(trimmed);
  return Number.isSafeInteger(parsed) && parsed >= 0;
}

function isValidPercentage(value: string) {
  const trimmed = value.trim();

  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(trimmed)) {
    return false;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100;
}

function isValidNonNegativeDecimal(value: string) {
  const trimmed = value.trim();

  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(trimmed)) {
    return false;
  }

  const parsed = Number(trimmed);
  return (
    Number.isFinite(parsed) &&
    parsed >= 0 &&
    parsed <= Number.MAX_SAFE_INTEGER
  );
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

function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

function blendRate(peak: number, offPeak: number, offPeakShare: number) {
  const share = offPeakShare / 100;
  return peak * (1 - share) + offPeak * share;
}

export default function ToolClient() {
  const [model, setModel] = useState<ModelKey>("deepseek-flash");
  const [requestsPerMonth, setRequestsPerMonth] = useState("80000");
  const [inputTokensPerRequest, setInputTokensPerRequest] = useState("1500");
  const [outputTokensPerRequest, setOutputTokensPerRequest] = useState("450");
  const [cacheHitPercent, setCacheHitPercent] = useState("30");
  const [offPeakPercent, setOffPeakPercent] = useState("0");

  const [customPricing, setCustomPricing] = useState(false);
  const [peakHitPrice, setPeakHitPrice] = useState("0.006");
  const [peakMissPrice, setPeakMissPrice] = useState("0.3");
  const [peakOutputPrice, setPeakOutputPrice] = useState("1.2");
  const [offPeakHitPrice, setOffPeakHitPrice] = useState("0.003");
  const [offPeakMissPrice, setOffPeakMissPrice] = useState("0.15");
  const [offPeakOutputPrice, setOffPeakOutputPrice] = useState("0.6");

  const selectedModel = MODEL_PRICES[model];

  const hasInvalidInput = useMemo(() => {
    const wholeNumberValues = [
      requestsPerMonth,
      inputTokensPerRequest,
      outputTokensPerRequest,
    ];

    if (
      wholeNumberValues.some((value) => !isValidNonNegativeInteger(value)) ||
      !isValidPercentage(cacheHitPercent) ||
      !isValidPercentage(offPeakPercent)
    ) {
      return true;
    }

    if (!customPricing) {
      return false;
    }

    return [
      peakHitPrice,
      peakMissPrice,
      peakOutputPrice,
      offPeakHitPrice,
      offPeakMissPrice,
      offPeakOutputPrice,
    ].some((value) => !isValidNonNegativeDecimal(value));
  }, [
    cacheHitPercent,
    customPricing,
    inputTokensPerRequest,
    offPeakHitPrice,
    offPeakMissPrice,
    offPeakOutputPrice,
    offPeakPercent,
    outputTokensPerRequest,
    peakHitPrice,
    peakMissPrice,
    peakOutputPrice,
    requestsPerMonth,
  ]);

  const priceSets = useMemo(() => {
    if (!customPricing) {
      return {
        peak: selectedModel.peak,
        offPeak: selectedModel.offPeak,
      };
    }

    return {
      peak: {
        cacheHitInput: toNumber(peakHitPrice),
        cacheMissInput: toNumber(peakMissPrice),
        output: toNumber(peakOutputPrice),
      },
      offPeak: {
        cacheHitInput: toNumber(offPeakHitPrice),
        cacheMissInput: toNumber(offPeakMissPrice),
        output: toNumber(offPeakOutputPrice),
      },
    };
  }, [
    customPricing,
    offPeakHitPrice,
    offPeakMissPrice,
    offPeakOutputPrice,
    peakHitPrice,
    peakMissPrice,
    peakOutputPrice,
    selectedModel.offPeak,
    selectedModel.peak,
  ]);

  const result = useMemo(() => {
    const requests = toNumber(requestsPerMonth);
    const inputPerRequest = toNumber(inputTokensPerRequest);
    const outputPerRequest = toNumber(outputTokensPerRequest);
    const cacheShare = toNumber(cacheHitPercent);
    const offPeakShare = toNumber(offPeakPercent);

    const totalInputTokens = requests * inputPerRequest;
    const cacheHitTokens = totalInputTokens * (cacheShare / 100);
    const cacheMissTokens = totalInputTokens - cacheHitTokens;
    const totalOutputTokens = requests * outputPerRequest;

    const effectiveHitRate = blendRate(
      priceSets.peak.cacheHitInput,
      priceSets.offPeak.cacheHitInput,
      offPeakShare,
    );
    const effectiveMissRate = blendRate(
      priceSets.peak.cacheMissInput,
      priceSets.offPeak.cacheMissInput,
      offPeakShare,
    );
    const effectiveOutputRate = blendRate(
      priceSets.peak.output,
      priceSets.offPeak.output,
      offPeakShare,
    );

    const cacheHitCost = (cacheHitTokens / 1_000_000) * effectiveHitRate;
    const cacheMissCost = (cacheMissTokens / 1_000_000) * effectiveMissRate;
    const outputCost = (totalOutputTokens / 1_000_000) * effectiveOutputRate;
    const monthlyCost = cacheHitCost + cacheMissCost + outputCost;

    return {
      requests,
      inputPerRequest,
      outputPerRequest,
      cacheShare,
      offPeakShare,
      totalInputTokens,
      cacheHitTokens,
      cacheMissTokens,
      totalOutputTokens,
      effectiveHitRate,
      effectiveMissRate,
      effectiveOutputRate,
      cacheHitCost,
      cacheMissCost,
      outputCost,
      monthlyCost,
      costPerRequest: requests > 0 ? monthlyCost / requests : 0,
      dailyCost: monthlyCost / 30,
      annualizedCost: monthlyCost * 12,
    };
  }, [
    cacheHitPercent,
    inputTokensPerRequest,
    offPeakPercent,
    outputTokensPerRequest,
    priceSets,
    requestsPerMonth,
  ]);

  const hasUnsafeResult = useMemo(() => {
    const values = [
      result.totalInputTokens,
      result.cacheHitTokens,
      result.cacheMissTokens,
      result.totalOutputTokens,
      result.cacheHitCost,
      result.cacheMissCost,
      result.outputCost,
      result.monthlyCost,
      result.annualizedCost,
    ];

    return values.some(
      (value) =>
        !Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER,
    );
  }, [result]);

  const contextError =
    !hasInvalidInput && result.inputPerRequest > selectedModel.contextWindow;
  const outputError =
    !hasInvalidInput && result.outputPerRequest > selectedModel.maxOutput;
  const cannotCalculate =
    hasInvalidInput || hasUnsafeResult || contextError || outputError;

  const updateModel = (value: string) => {
    const nextModel = value as ModelKey;
    const next = MODEL_PRICES[nextModel];
    setModel(nextModel);

    if (!customPricing) {
      setPeakHitPrice(String(next.peak.cacheHitInput));
      setPeakMissPrice(String(next.peak.cacheMissInput));
      setPeakOutputPrice(String(next.peak.output));
      setOffPeakHitPrice(String(next.offPeak.cacheHitInput));
      setOffPeakMissPrice(String(next.offPeak.cacheMissInput));
      setOffPeakOutputPrice(String(next.offPeak.output));
    }
  };

  const reset = () => {
    const next = MODEL_PRICES["deepseek-flash"];
    setModel("deepseek-flash");
    setRequestsPerMonth("80000");
    setInputTokensPerRequest("1500");
    setOutputTokensPerRequest("450");
    setCacheHitPercent("30");
    setOffPeakPercent("0");
    setCustomPricing(false);
    setPeakHitPrice(String(next.peak.cacheHitInput));
    setPeakMissPrice(String(next.peak.cacheMissInput));
    setPeakOutputPrice(String(next.peak.output));
    setOffPeakHitPrice(String(next.offPeak.cacheHitInput));
    setOffPeakMissPrice(String(next.offPeak.cacheMissInput));
    setOffPeakOutputPrice(String(next.offPeak.output));
  };

  const errorMessage = hasInvalidInput
    ? "Enter whole numbers for requests and token counts, percentages from 0 to 100, and non-negative decimal prices."
    : hasUnsafeResult
      ? "The entered workload is too large to calculate safely in the browser. Use smaller planning values or split the workload into parts."
      : contextError
        ? `${selectedModel.label} has a published 1,000,000-token context window. The average input entered here is above that limit.`
        : outputError
          ? `${selectedModel.label} has a published maximum output of 384,000 tokens. The average output entered here is above that limit.`
          : "";
  return (
    <div className="min-w-0">
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] xl:items-start">
        <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold text-gray-950">
            Estimate your DeepSeek workload
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-600">
            Choose the model, enter one representative request, then describe
            how much input is served from cache and how much traffic runs
            outside DeepSeek&apos;s weekday peak windows.
          </p>

          <div className="mt-7 max-w-md">
            <BeeijaSelect
              label="DeepSeek model"
              value={model}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                updateModel(event.target.value)
              }
              options={modelOptions}
            />
          </div>

          <div className="mt-6 grid items-start gap-5 md:grid-cols-2">
            <BeeijaNumberField
              label="Requests per month"
              value={requestsPerMonth}
              onChange={setRequestsPerMonth}
              min="0"
              step="1"
              sanitizeDecimal
            />

            <BeeijaNumberField
              label="Cache-hit input share"
              value={cacheHitPercent}
              onChange={setCacheHitPercent}
              min="0"
              max="100"
              step="0.1"
              suffix="%"
              helper="Use measured cache hit/miss tokens when available."
              sanitizeDecimal
            />

            <BeeijaNumberField
              label="Average input tokens per request"
              value={inputTokensPerRequest}
              onChange={setInputTokensPerRequest}
              min="0"
              step="1"
              helper="Use API usage data when available."
              sanitizeDecimal
            />

            <BeeijaNumberField
              label="Average output tokens per request"
              value={outputTokensPerRequest}
              onChange={setOutputTokensPerRequest}
              min="0"
              step="1"
              helper="Include billed reasoning tokens."
              sanitizeDecimal
            />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:items-start">
            <BeeijaNumberField
              label="Off-peak workload share"
              value={offPeakPercent}
              onChange={setOffPeakPercent}
              min="0"
              max="100"
              step="0.1"
              suffix="%"
              helper="0 = all peak; 100 = all off-peak."
              sanitizeDecimal
            />

            <PricingClock />
          </div>

          {errorMessage ? (
            <div className="mt-6 self-start border-l-4 border-red-600 bg-white px-4 py-3 text-sm leading-6 text-gray-700">
              <span className="font-semibold text-red-700">Check the estimate:</span>{" "}
              {errorMessage}
            </div>
          ) : null}

          <button type="button" onClick={reset} className="beeija-btn-outline mt-6">
            Reset values
          </button>
        </section>

        <div className="min-w-0 xl:sticky xl:top-6">
          <BeeijaCalculatorResultPanel
            title="Monthly DeepSeek estimate"
            description="Cache-hit input, cache-miss input, and output are priced separately, then blended using the off-peak share you entered."
            primaryLabel="Estimated monthly cost"
            primaryValue={
              cannotCalculate
                ? "Check entered values"
                : formatVisibleMoney(result.monthlyCost)
            }
            stats={
              cannotCalculate ? undefined : (
                <div className="grid min-w-0 gap-4 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                  <Stat label="Per request" value={formatVisibleMoney(result.costPerRequest)} />
                  <Stat label="Daily average" value={formatVisibleMoney(result.dailyCost)} />
                  <Stat
                    label="12 months at this mix"
                    value={formatVisibleMoney(result.annualizedCost)}
                  />
                </div>
              )
            }
            breakdown={
              cannotCalculate ? undefined : (
                <div className="space-y-2">
                  <BeeijaResultLine
                    label="Cache-hit input"
                    value={formatVisibleMoney(result.cacheHitCost)}
                  />
                  <BeeijaResultLine
                    label="Cache-miss input"
                    value={formatVisibleMoney(result.cacheMissCost)}
                  />
                  <BeeijaResultLine
                    label="Output"
                    value={formatVisibleMoney(result.outputCost)}
                  />
                </div>
              )
            }
            totals={
              cannotCalculate ? undefined : (
                <div className="min-w-0 text-sm leading-7 text-gray-600">
                  <p>
                    Input tokens: {formatNumber(result.totalInputTokens)} · cache hit{" "}
                    {formatNumber(result.cacheHitTokens)} · cache miss{" "}
                    {formatNumber(result.cacheMissTokens)}
                  </p>
                  <p>
                    Output tokens: {formatNumber(result.totalOutputTokens)} · off-peak share{" "}
                    {formatNumber(result.offPeakShare, 1)}%
                  </p>
                  <p>
                    Effective rates / 1M tokens: hit{" "}
                    {formatVisibleMoney(result.effectiveHitRate)}, miss{" "}
                    {formatVisibleMoney(result.effectiveMissRate)}, output{" "}
                    {formatVisibleMoney(result.effectiveOutputRate)}
                  </p>
                  <p>
                    API model: <span className="font-medium text-gray-900">{selectedModel.apiName}</span>{" "}
                    · published account concurrency limit{" "}
                    {formatNumber(selectedModel.concurrencyLimit)}
                  </p>
                </div>
              )
            }
            provider="DeepSeek"
            pricingCheckedDate="September 22, 2026"
            excludedCosts="taxes, credits, retries, tool-side services, account-specific terms, and usage outside the token rates entered here"
          />
        </div>
      </div>

      <section className="mt-8 min-w-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-950">Current token rates</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {selectedModel.label} · USD per 1 million tokens. The estimate blends
              these rates using your off-peak workload share.
            </p>
          </div>
          <span className="text-sm font-medium text-[var(--green)]">
            {selectedModel.apiName}
          </span>
        </div>

        <div className="mt-4 max-w-3xl overflow-x-auto">
          <div className="grid min-w-[28rem] grid-cols-[minmax(0,1fr)_auto_auto] gap-x-8 gap-y-2 text-sm">
            <span className="font-medium text-gray-700">Token path</span>
            <span className="text-right font-medium text-gray-700">Peak</span>
            <span className="text-right font-medium text-gray-700">Off-peak</span>

            <span className="text-gray-600">Cache-hit input</span>
            <span className="text-right font-medium text-gray-950">
              {formatVisibleMoney(priceSets.peak.cacheHitInput)}
            </span>
            <span className="text-right font-medium text-gray-950">
              {formatVisibleMoney(priceSets.offPeak.cacheHitInput)}
            </span>

            <span className="text-gray-600">Cache-miss input</span>
            <span className="text-right font-medium text-gray-950">
              {formatVisibleMoney(priceSets.peak.cacheMissInput)}
            </span>
            <span className="text-right font-medium text-gray-950">
              {formatVisibleMoney(priceSets.offPeak.cacheMissInput)}
            </span>

            <span className="text-gray-600">Output</span>
            <span className="text-right font-medium text-gray-950">
              {formatVisibleMoney(priceSets.peak.output)}
            </span>
            <span className="text-right font-medium text-gray-950">
              {formatVisibleMoney(priceSets.offPeak.output)}
            </span>
          </div>
        </div>

        <label className="mt-5 flex max-w-3xl cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={customPricing}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setCustomPricing(event.target.checked)
            }
            className="mt-1 h-4 w-4 accent-[var(--green)]"
          />
          <span>
            <span className="block font-medium text-gray-900">
              Use custom peak and off-peak prices
            </span>
            <span className="mt-1 block text-sm leading-6 text-gray-600">
              Replace the published rates while keeping the same workload and
              scheduling assumptions.
            </span>
          </span>
        </label>

        {customPricing ? (
          <div className="mt-5 grid max-w-4xl items-start gap-x-8 gap-y-5 md:grid-cols-2">
            <div className="min-w-0">
              <h3 className="mb-3 font-semibold text-gray-950">Peak rates</h3>
              <div className="space-y-4">
                <BeeijaNumberField
                  label="Cache-hit input rate"
                  value={peakHitPrice}
                  onChange={setPeakHitPrice}
                  min="0"
                  step="0.000001"
                  prefix="$"
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Cache-miss input rate"
                  value={peakMissPrice}
                  onChange={setPeakMissPrice}
                  min="0"
                  step="0.000001"
                  prefix="$"
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Output rate"
                  value={peakOutputPrice}
                  onChange={setPeakOutputPrice}
                  min="0"
                  step="0.000001"
                  prefix="$"
                  sanitizeDecimal
                />
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="mb-3 font-semibold text-gray-950">Off-peak rates</h3>
              <div className="space-y-4">
                <BeeijaNumberField
                  label="Cache-hit input rate"
                  value={offPeakHitPrice}
                  onChange={setOffPeakHitPrice}
                  min="0"
                  step="0.000001"
                  prefix="$"
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Cache-miss input rate"
                  value={offPeakMissPrice}
                  onChange={setOffPeakMissPrice}
                  min="0"
                  step="0.000001"
                  prefix="$"
                  sanitizeDecimal
                />
                <BeeijaNumberField
                  label="Output rate"
                  value={offPeakOutputPrice}
                  onChange={setOffPeakOutputPrice}
                  min="0"
                  step="0.000001"
                  prefix="$"
                  sanitizeDecimal
                />
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function PricingClock() {
  return (
    <div className="min-w-0 pt-1">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-gray-700">
        <span>Weekday UTC pricing clock</span>
        <span className="font-medium text-gray-500">Weekends: off-peak all day</span>
      </div>

      <div
        className="mt-2 flex h-3 overflow-hidden rounded-full"
        role="img"
        aria-label="DeepSeek weekday pricing schedule: off-peak from midnight to 01:00 UTC, peak from 01:00 to 04:00, off-peak from 04:00 to 06:00, peak from 06:00 to 10:00, and off-peak from 10:00 to midnight."
      >
        <span className="bg-[var(--green)]" style={{ width: "4.1667%" }} />
        <span className="bg-[var(--yellow)]" style={{ width: "12.5%" }} />
        <span className="bg-[var(--green)]" style={{ width: "8.3333%" }} />
        <span className="bg-[var(--yellow)]" style={{ width: "16.6667%" }} />
        <span className="bg-[var(--green)]" style={{ width: "58.3333%" }} />
      </div>

      <div className="relative mt-1 h-4 text-[10.5px] leading-4 text-gray-500">
        <span className="absolute left-0">00</span>
        <span className="absolute left-[4.1667%] -translate-x-1/2">01</span>
        <span className="absolute left-[16.6667%] -translate-x-1/2">04</span>
        <span className="absolute left-[25%] -translate-x-1/2">06</span>
        <span className="absolute left-[41.6667%] -translate-x-1/2">10</span>
        <span className="absolute right-0">24</span>
      </div>

      <p className="mt-1 text-xs leading-5 text-gray-600">
        Yellow marks DeepSeek&apos;s weekday peak windows; green marks off-peak.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
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

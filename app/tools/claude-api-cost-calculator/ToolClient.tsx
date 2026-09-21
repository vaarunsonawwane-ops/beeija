"use client";

import { useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type ModelKey =
  | "claude-fable-5-1"
  | "claude-opus-5"
  | "claude-sonnet-5"
  | "claude-haiku-4-5";

type CacheMode = "none" | "5m" | "1h";
type ProcessingMode = "standard" | "batch" | "fast";
type Geography = "global" | "us";

type ModelPrice = {
  label: string;
  input: number;
  cacheWrite5m: number;
  cacheWrite1h: number;
  cacheRead: number;
  output: number;
  supportsUsInference: boolean;
  supportsFastMode: boolean;
  contextWindow: number;
  maxOutput: number;
};

const MODEL_PRICES: Record<ModelKey, ModelPrice> = {
  "claude-fable-5-1": {
    label: "Claude Fable 5.1",
    input: 10,
    cacheWrite5m: 12.5,
    cacheWrite1h: 20,
    cacheRead: 0.25,
    output: 50,
    supportsUsInference: true,
    supportsFastMode: false,
    contextWindow: 1_000_000,
    maxOutput: 128_000,
  },
  "claude-opus-5": {
    label: "Claude Opus 5",
    input: 5,
    cacheWrite5m: 6.25,
    cacheWrite1h: 10,
    cacheRead: 0.5,
    output: 25,
    supportsUsInference: true,
    supportsFastMode: true,
    contextWindow: 1_000_000,
    maxOutput: 128_000,
  },
  "claude-sonnet-5": {
    label: "Claude Sonnet 5",
    input: 2,
    cacheWrite5m: 2.5,
    cacheWrite1h: 4,
    cacheRead: 0.2,
    output: 10,
    supportsUsInference: true,
    supportsFastMode: false,
    contextWindow: 1_000_000,
    maxOutput: 128_000,
  },
  "claude-haiku-4-5": {
    label: "Claude Haiku 4.5",
    input: 1,
    cacheWrite5m: 1.25,
    cacheWrite1h: 2,
    cacheRead: 0.1,
    output: 5,
    supportsUsInference: false,
    supportsFastMode: false,
    contextWindow: 200_000,
    maxOutput: 64_000,
  },
};

const modelOptions = Object.entries(MODEL_PRICES).map(([value, model]) => ({
  value,
  label: model.label,
}));

const cacheOptions = [
  { value: "none", label: "No cache write" },
  { value: "5m", label: "5-minute cache write" },
  { value: "1h", label: "1-hour cache write" },
];

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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ToolClient() {
  const [model, setModel] = useState<ModelKey>("claude-sonnet-5");
  const [cacheMode, setCacheMode] = useState<CacheMode>("5m");
  const [processingMode, setProcessingMode] =
    useState<ProcessingMode>("standard");
  const [geography, setGeography] = useState<Geography>("global");

  const [requestsPerMonth, setRequestsPerMonth] = useState("40000");
  const [baseInputTokens, setBaseInputTokens] = useState("900");
  const [cacheWriteTokens, setCacheWriteTokens] = useState("0");
  const [cacheReadTokens, setCacheReadTokens] = useState("2000");
  const [outputTokens, setOutputTokens] = useState("350");

  const [customPricing, setCustomPricing] = useState(false);
  const [customInputPrice, setCustomInputPrice] = useState("2");
  const [customCacheWritePrice, setCustomCacheWritePrice] = useState("2.5");
  const [customCacheReadPrice, setCustomCacheReadPrice] = useState("0.2");
  const [customOutputPrice, setCustomOutputPrice] = useState("10");

  const selectedModel = MODEL_PRICES[model];

  const processingModeOptions = useMemo(() => {
    const options = [
      { value: "standard", label: "Standard API" },
      { value: "batch", label: "Batch API (50% lower)" },
    ];

    if (selectedModel.supportsFastMode) {
      options.push({ value: "fast", label: "Fast mode (research preview)" });
    }

    return options;
  }, [selectedModel.supportsFastMode]);

  const geographyOptions = useMemo(() => {
    if (!selectedModel.supportsUsInference) {
      return [{ value: "global", label: "Global routing" }];
    }

    return [
      { value: "global", label: "Global routing" },
      { value: "us", label: "US-only inference (1.1×)" },
    ];
  }, [selectedModel.supportsUsInference]);

  const selectedCacheWritePrice =
    cacheMode === "1h"
      ? selectedModel.cacheWrite1h
      : selectedModel.cacheWrite5m;

  const hasInvalidInput = useMemo(() => {
    const usageValues = [
      requestsPerMonth,
      baseInputTokens,
      cacheReadTokens,
      outputTokens,
    ];

    if (cacheMode !== "none") {
      usageValues.push(cacheWriteTokens);
    }

    if (usageValues.some((value) => !isValidNonNegativeInteger(value))) {
      return true;
    }

    if (!customPricing) {
      return false;
    }

    const customValues = [
      customInputPrice,
      customCacheReadPrice,
      customOutputPrice,
    ];

    if (cacheMode !== "none") {
      customValues.push(customCacheWritePrice);
    }

    return customValues.some(
      (value) => !isValidNonNegativeDecimal(value),
    );
  }, [
    baseInputTokens,
    cacheMode,
    cacheReadTokens,
    cacheWriteTokens,
    customCacheReadPrice,
    customCacheWritePrice,
    customInputPrice,
    customOutputPrice,
    customPricing,
    outputTokens,
    requestsPerMonth,
  ]);

  const basePrices = useMemo(() => {
    if (customPricing) {
      return {
        input: toNumber(customInputPrice),
        cacheWrite:
          cacheMode === "none" ? 0 : toNumber(customCacheWritePrice),
        cacheRead: toNumber(customCacheReadPrice),
        output: toNumber(customOutputPrice),
      };
    }

    return {
      input: selectedModel.input,
      cacheWrite: cacheMode === "none" ? 0 : selectedCacheWritePrice,
      cacheRead: selectedModel.cacheRead,
      output: selectedModel.output,
    };
  }, [
    cacheMode,
    customCacheReadPrice,
    customCacheWritePrice,
    customInputPrice,
    customOutputPrice,
    customPricing,
    selectedCacheWritePrice,
    selectedModel,
  ]);

  const effectivePrices = useMemo(() => {
    const processingMultiplier =
      processingMode === "batch" ? 0.5 : processingMode === "fast" ? 2 : 1;
    const geographyMultiplier =
      geography === "us" && selectedModel.supportsUsInference ? 1.1 : 1;

    return {
      input: basePrices.input * processingMultiplier * geographyMultiplier,
      cacheWrite:
        basePrices.cacheWrite * processingMultiplier * geographyMultiplier,
      cacheRead:
        basePrices.cacheRead * processingMultiplier * geographyMultiplier,
      output: basePrices.output * processingMultiplier * geographyMultiplier,
    };
  }, [
    basePrices,
    geography,
    processingMode,
    selectedModel.supportsUsInference,
  ]);

  const result = useMemo(() => {
    const requests = toNumber(requestsPerMonth);
    const inputPerRequest = toNumber(baseInputTokens);
    const writePerRequest =
      cacheMode === "none" ? 0 : toNumber(cacheWriteTokens);
    const readPerRequest = toNumber(cacheReadTokens);
    const outputPerRequest = toNumber(outputTokens);

    const totalInputPerRequest =
      inputPerRequest + writePerRequest + readPerRequest;
    const contextLoadPerRequest = totalInputPerRequest + outputPerRequest;

    const totalInput = requests * inputPerRequest;
    const totalCacheWrite = requests * writePerRequest;
    const totalCacheRead = requests * readPerRequest;
    const totalOutput = requests * outputPerRequest;

    const inputCost = (totalInput / 1_000_000) * effectivePrices.input;
    const cacheWriteCost =
      (totalCacheWrite / 1_000_000) * effectivePrices.cacheWrite;
    const cacheReadCost =
      (totalCacheRead / 1_000_000) * effectivePrices.cacheRead;
    const outputCost = (totalOutput / 1_000_000) * effectivePrices.output;

    const monthlyCost =
      inputCost + cacheWriteCost + cacheReadCost + outputCost;
    const costPerRequest = requests > 0 ? monthlyCost / requests : 0;
    const dailyAverage = monthlyCost / 30;
    const yearlyCost = monthlyCost * 12;

    return {
      requests,
      inputPerRequest,
      writePerRequest,
      readPerRequest,
      outputPerRequest,
      totalInputPerRequest,
      contextLoadPerRequest,
      totalInput,
      totalCacheWrite,
      totalCacheRead,
      totalOutput,
      inputCost,
      cacheWriteCost,
      cacheReadCost,
      outputCost,
      monthlyCost,
      costPerRequest,
      dailyAverage,
      yearlyCost,
    };
  }, [
    baseInputTokens,
    cacheMode,
    cacheReadTokens,
    cacheWriteTokens,
    effectivePrices,
    outputTokens,
    requestsPerMonth,
  ]);

  const hasUnsafeResult = useMemo(() => {
    const values = [
      result.requests,
      result.inputPerRequest,
      result.writePerRequest,
      result.readPerRequest,
      result.outputPerRequest,
      result.totalInputPerRequest,
      result.contextLoadPerRequest,
      result.totalInput,
      result.totalCacheWrite,
      result.totalCacheRead,
      result.totalOutput,
      result.inputCost,
      result.cacheWriteCost,
      result.cacheReadCost,
      result.outputCost,
      result.monthlyCost,
      result.costPerRequest,
      result.dailyAverage,
      result.yearlyCost,
    ];

    return values.some(
      (value) =>
        !Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER,
    );
  }, [result]);

  const hasDisplayError = hasInvalidInput || hasUnsafeResult;
  const exceedsInputContextWindow =
    !hasDisplayError &&
    result.totalInputPerRequest > selectedModel.contextWindow;
  const couldHitContextDuringGeneration =
    !hasDisplayError &&
    !exceedsInputContextWindow &&
    result.contextLoadPerRequest > selectedModel.contextWindow;
  const exceedsOutputLimit =
    !hasDisplayError && result.outputPerRequest > selectedModel.maxOutput;

  const updateModel = (value: string) => {
    const nextModel = value as ModelKey;
    const prices = MODEL_PRICES[nextModel];

    setModel(nextModel);

    if (!prices.supportsFastMode && processingMode === "fast") {
      setProcessingMode("standard");
    }

    if (!prices.supportsUsInference && geography === "us") {
      setGeography("global");
    }

    if (!customPricing) {
      setCustomInputPrice(String(prices.input));
      setCustomCacheWritePrice(
        String(cacheMode === "1h" ? prices.cacheWrite1h : prices.cacheWrite5m),
      );
      setCustomCacheReadPrice(String(prices.cacheRead));
      setCustomOutputPrice(String(prices.output));
    }
  };

  const updateCacheMode = (value: string) => {
    const nextMode = value as CacheMode;
    setCacheMode(nextMode);

    if (!customPricing && nextMode !== "none") {
      const price =
        nextMode === "1h"
          ? selectedModel.cacheWrite1h
          : selectedModel.cacheWrite5m;

      setCustomCacheWritePrice(String(price));
    }
  };

  const reset = () => {
    const defaultModel = MODEL_PRICES["claude-sonnet-5"];

    setModel("claude-sonnet-5");
    setCacheMode("5m");
    setProcessingMode("standard");
    setGeography("global");
    setRequestsPerMonth("40000");
    setBaseInputTokens("900");
    setCacheWriteTokens("0");
    setCacheReadTokens("2000");
    setOutputTokens("350");
    setCustomPricing(false);
    setCustomInputPrice(String(defaultModel.input));
    setCustomCacheWritePrice(String(defaultModel.cacheWrite5m));
    setCustomCacheReadPrice(String(defaultModel.cacheRead));
    setCustomOutputPrice(String(defaultModel.output));
  };

  const visibleMoney = (value: number) =>
    hasDisplayError ? "—" : formatVisibleMoney(value);

  const processingLabel =
    processingMode === "batch"
      ? "Batch"
      : processingMode === "fast"
        ? "Fast mode"
        : "Standard";

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Claude API Usage
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Use billed token averages from a real request when you have them,
            then enter the number of requests you expect in one month.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <BeeijaSelect
            label="Claude model"
            value={model}
            onChange={(event) => updateModel(event.target.value)}
            options={modelOptions}
          />

          <BeeijaSelect
            label="Cache write type"
            value={cacheMode}
            onChange={(event) => updateCacheMode(event.target.value)}
            options={cacheOptions}
          />

          <BeeijaSelect
            label="Processing mode"
            value={processingMode}
            onChange={(event) =>
              setProcessingMode(event.target.value as ProcessingMode)
            }
            options={processingModeOptions}
          />

          <BeeijaSelect
            label="Inference geography"
            value={geography}
            onChange={(event) =>
              setGeography(event.target.value as Geography)
            }
            options={geographyOptions}
          />

          <BeeijaNumberField
            label="Requests per month"
            value={requestsPerMonth}
            onChange={setRequestsPerMonth}
            min="0"
            step="1"
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Base input tokens per request"
            value={baseInputTokens}
            onChange={setBaseInputTokens}
            min="0"
            step="1"
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Cache write tokens per request"
            value={cacheWriteTokens}
            onChange={setCacheWriteTokens}
            min="0"
            step="1"
            disabled={cacheMode === "none"}
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Cache read tokens per request"
            value={cacheReadTokens}
            onChange={setCacheReadTokens}
            min="0"
            step="1"
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Output tokens per request"
            value={outputTokens}
            onChange={setOutputTokens}
            min="0"
            step="1"
            sanitizeDecimal
          />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-gray-500">
          Keep base input, cache writes, and cache reads separate. Output should
          use the billed output-token count, including thinking tokens when the
          API reports them.
        </p>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <input
            type="checkbox"
            checked={customPricing}
            onChange={(event) => setCustomPricing(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--green)]"
          />

          <span>
            <span className="block font-medium text-gray-900">
              Use custom standard prices
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-gray-600">
              Replace the selected model&apos;s standard per-million-token rates.
              Batch, fast-mode, and geography modifiers still apply.
            </span>
          </span>
        </label>

        {customPricing ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <BeeijaNumberField
              label="Base input price"
              value={customInputPrice}
              onChange={setCustomInputPrice}
              min="0"
              step="0.001"
              prefix="$"
              sanitizeDecimal
            />

            <BeeijaNumberField
              label="Cache write price"
              value={customCacheWritePrice}
              onChange={setCustomCacheWritePrice}
              min="0"
              step="0.001"
              prefix="$"
              sanitizeDecimal
              disabled={cacheMode === "none"}
            />

            <BeeijaNumberField
              label="Cache read price"
              value={customCacheReadPrice}
              onChange={setCustomCacheReadPrice}
              min="0"
              step="0.001"
              prefix="$"
              sanitizeDecimal
            />

            <BeeijaNumberField
              label="Output price"
              value={customOutputPrice}
              onChange={setCustomOutputPrice}
              min="0"
              step="0.001"
              prefix="$"
              sanitizeDecimal
            />
          </div>
        ) : null}

        {hasInvalidInput ? (
          <div className="mt-6 border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-800">
            Use non-negative whole numbers for requests and token counts, and
            ordinary decimal numbers for custom prices. Scientific notation is
            not accepted.
          </div>
        ) : null}

        {!hasInvalidInput && hasUnsafeResult ? (
          <div className="mt-6 border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-800">
            The entered workload is too large to calculate reliably in the
            browser. Use smaller whole-number values before relying on the
            estimate.
          </div>
        ) : null}

        {!hasDisplayError && exceedsInputContextWindow ? (
          <div className="mt-6 border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-800">
            Input-related tokens alone are above {formatNumber(
              selectedModel.contextWindow,
            )} tokens for {selectedModel.label}. Anthropic documents this as a
            rejected 400 <code>invalid_request_error</code> with “prompt is too
            long.” The arithmetic cost is still visible only as a planning
            comparison.
          </div>
        ) : null}

        {!hasDisplayError && couldHitContextDuringGeneration ? (
          <div className="mt-6 border-l-4 border-[#F2C94C] bg-white px-5 py-4 text-sm leading-relaxed text-gray-700">
            The input fits the {formatNumber(selectedModel.contextWindow)}-token
            context window, but the entered output would push the combined total
            past it. On Claude 4.5 and newer, Anthropic can accept a request whose
            max_tokens extends beyond the remaining context and stop generation
            with <code>model_context_window_exceeded</code> if the boundary is
            reached.
          </div>
        ) : null}

        {!hasDisplayError && exceedsOutputLimit ? (
          <div className="mt-6 border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-800">
            The entered output is above {formatNumber(selectedModel.maxOutput)}
            tokens, the listed maximum output for {selectedModel.label}. That
            output amount cannot be produced by one request on this model, so use
            a value within the documented limit.
          </div>
        ) : null}

        {!hasDisplayError && model === "claude-fable-5-1" ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm leading-relaxed text-gray-700">
            Claude Fable 5.1 has a special cache-read price of $0.25 per million
            tokens, or 0.025× its base input rate. The other current models in
            this list use the standard 0.1× cache-read multiplier.
          </div>
        ) : null}

        {!hasDisplayError && processingMode === "fast" ? (
          <div className="mt-6 border-l-4 border-[#F2C94C] bg-white px-5 py-4 text-sm leading-relaxed text-gray-700">
            Fast mode is a gated Claude API research preview for supported Opus
            models. It uses premium token rates, requires preview access, and
            cannot be combined with the Batch API.
          </div>
        ) : null}

        {!selectedModel.supportsUsInference ? (
          <p className="mt-5 text-sm leading-relaxed text-gray-500">
            {selectedModel.label} does not support the first-party Claude API
            US-only inference setting, so global routing is used here.
          </p>
        ) : null}

        <div className="mt-7 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <p className="font-medium text-gray-900">
              Rates used per 1 million tokens
            </p>
            <p className="text-sm text-gray-500">
              {processingLabel}
              {geography === "us" ? " · US-only" : " · global"}
            </p>
          </div>

          <div className="mt-3 grid min-w-0 gap-3 text-sm text-gray-700 sm:grid-cols-2 xl:grid-cols-4">
            <RateStat
              label="Base input"
              value={
                hasDisplayError
                  ? "—"
                  : formatVisibleMoney(effectivePrices.input)
              }
            />
            <RateStat
              label="Cache write"
              value={
                cacheMode === "none"
                  ? "Not used"
                  : hasDisplayError
                    ? "—"
                    : formatVisibleMoney(effectivePrices.cacheWrite)
              }
            />
            <RateStat
              label="Cache read"
              value={
                hasDisplayError
                  ? "—"
                  : formatVisibleMoney(effectivePrices.cacheRead)
              }
            />
            <RateStat
              label="Output"
              value={
                hasDisplayError
                  ? "—"
                  : formatVisibleMoney(effectivePrices.output)
              }
            />
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
        title="Estimated Claude API Cost"
        description="First-party Claude API token estimate only; paid server tools, marketplace differences, and other services are separate."
        primaryLabel="Estimated monthly cost"
        primaryValue={visibleMoney(result.monthlyCost)}
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per request"
              value={visibleMoney(result.costPerRequest)}
            />
            <ResultStat
              label="Daily avg. (30d)"
              value={visibleMoney(result.dailyAverage)}
            />
            <ResultStat
              label="Per year"
              value={visibleMoney(result.yearlyCost)}
            />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            <CostRow
              label="Base input cost"
              detail={
                hasDisplayError
                  ? "Check inputs"
                  : `${formatNumber(result.totalInput)} tokens`
              }
              value={visibleMoney(result.inputCost)}
            />

            <CostRow
              label="Cache write cost"
              detail={
                hasDisplayError
                  ? "Check inputs"
                  : `${formatNumber(result.totalCacheWrite)} tokens`
              }
              value={visibleMoney(result.cacheWriteCost)}
            />

            <CostRow
              label="Cache read cost"
              detail={
                hasDisplayError
                  ? "Check inputs"
                  : `${formatNumber(result.totalCacheRead)} tokens`
              }
              value={visibleMoney(result.cacheReadCost)}
            />

            <CostRow
              label="Output cost"
              detail={
                hasDisplayError
                  ? "Check inputs"
                  : `${formatNumber(result.totalOutput)} tokens`
              }
              value={visibleMoney(result.outputCost)}
            />
          </div>
        }
        totals={
          <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
            <p>
              Requests: {" "}
              <span className="font-medium text-gray-900">
                {hasDisplayError ? "—" : formatNumber(result.requests)}
              </span>
            </p>

            <p className="mt-2">
              Input-related tokens: {" "}
              <span className="font-medium text-gray-900">
                {hasDisplayError
                  ? "—"
                  : formatNumber(
                      result.totalInput +
                        result.totalCacheWrite +
                        result.totalCacheRead,
                    )}
              </span>
            </p>

            <p className="mt-2">
              Output tokens: {" "}
              <span className="font-medium text-gray-900">
                {hasDisplayError ? "—" : formatNumber(result.totalOutput)}
              </span>
            </p>
          </div>
        }
        noticeText="Built-in first-party Claude API rates checked September 21, 2026. Final charges may include paid server tools, platform-specific pricing, negotiated discounts, taxes, retries, or usage not entered here."
      />
    </div>
  );
}

function RateStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <span className="block">{label}:</span>
      <span className="mt-1 block min-w-0 break-words font-medium text-gray-900 [overflow-wrap:anywhere]">
        {value}
      </span>
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

function CostRow({
  label,
  detail,
  value,
}: {
  label: string;
  detail: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 text-sm text-gray-500">{detail}</p>
      </div>

      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

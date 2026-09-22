"use client";

import { ChangeEvent, useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type ModelKey =
  | "grok-4.7"
  | "grok-4.6"
  | "grok-4.5"
  | "grok-4.3"
  | "grok-4.20-0309-reasoning"
  | "grok-4.20-0309-non-reasoning"
  | "grok-4.20-multi-agent-0309"
  | "grok-build-0.1";

type ServiceMode = "standard" | "priority" | "batch";
type EndpointMode = "global" | "us";
type PriceSet = { input: number; cached: number; output: number };

type ModelPrice = {
  label: string;
  apiName: string;
  contextWindow: number;
  short: PriceSet;
  long: PriceSet;
  batchDiscount: number | null;
  usRegional: boolean;
  multiAgent?: boolean;
};

const LONG_CONTEXT_THRESHOLD = 200_000;

const MODEL_PRICES: Record<ModelKey, ModelPrice> = {
  "grok-4.7": {
    label: "Grok 4.7",
    apiName: "grok-4.7",
    contextWindow: 500_000,
    short: { input: 2, cached: 0.5, output: 6 },
    long: { input: 4, cached: 1, output: 12 },
    batchDiscount: null,
    usRegional: true,
  },
  "grok-4.6": {
    label: "Grok 4.6",
    apiName: "grok-4.6",
    contextWindow: 500_000,
    short: { input: 2, cached: 0.5, output: 6 },
    long: { input: 4, cached: 1, output: 12 },
    batchDiscount: null,
    usRegional: true,
  },
  "grok-4.5": {
    label: "Grok 4.5",
    apiName: "grok-4.5",
    contextWindow: 500_000,
    short: { input: 2, cached: 0.3, output: 6 },
    long: { input: 4, cached: 0.6, output: 12 },
    batchDiscount: null,
    usRegional: false,
  },
  "grok-4.3": {
    label: "Grok 4.3",
    apiName: "grok-4.3",
    contextWindow: 1_000_000,
    short: { input: 1.25, cached: 0.2, output: 2.5 },
    long: { input: 2.5, cached: 0.4, output: 5 },
    batchDiscount: 0.2,
    usRegional: false,
  },
  "grok-4.20-0309-reasoning": {
    label: "Grok 4.20 Reasoning",
    apiName: "grok-4.20-0309-reasoning",
    contextWindow: 1_000_000,
    short: { input: 1.25, cached: 0.2, output: 2.5 },
    long: { input: 2.5, cached: 0.4, output: 5 },
    batchDiscount: 0.2,
    usRegional: false,
  },
  "grok-4.20-0309-non-reasoning": {
    label: "Grok 4.20 Non-Reasoning",
    apiName: "grok-4.20-0309-non-reasoning",
    contextWindow: 1_000_000,
    short: { input: 1.25, cached: 0.2, output: 2.5 },
    long: { input: 2.5, cached: 0.4, output: 5 },
    batchDiscount: 0.2,
    usRegional: false,
  },
  "grok-4.20-multi-agent-0309": {
    label: "Grok 4.20 Multi-Agent",
    apiName: "grok-4.20-multi-agent-0309",
    contextWindow: 1_000_000,
    short: { input: 1.25, cached: 0.2, output: 2.5 },
    long: { input: 2.5, cached: 0.4, output: 5 },
    batchDiscount: 0.2,
    usRegional: false,
    multiAgent: true,
  },
  "grok-build-0.1": {
    label: "Grok Build 0.1",
    apiName: "grok-build-0.1",
    contextWindow: 256_000,
    short: { input: 1, cached: 0.2, output: 2 },
    long: { input: 2, cached: 0.4, output: 4 },
    batchDiscount: null,
    usRegional: false,
  },
};

const modelOptions = Object.entries(MODEL_PRICES).map(([value, model]) => ({
  value,
  label: model.label,
}));

const TOOL_RATES = {
  webSearch: 5,
  codeExecution: 5,
  attachmentSearch: 10,
  collectionsSearch: 2.5,
  xPosts: 5,
  xProfiles: 10,
};

function isValidNonNegativeInteger(value: string) {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return false;
  const parsed = Number(trimmed);
  return Number.isSafeInteger(parsed) && parsed >= 0;
}

function isValidNonNegativeDecimal(value: string) {
  const trimmed = value.trim();
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(trimmed)) return false;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= Number.MAX_SAFE_INTEGER;
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
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
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

export default function ToolClient() {
  const [model, setModel] = useState<ModelKey>("grok-4.7");
  const [serviceMode, setServiceMode] = useState<ServiceMode>("standard");
  const [endpointMode, setEndpointMode] = useState<EndpointMode>("global");

  const [requestsPerMonth, setRequestsPerMonth] = useState("70000");
  const [inputTokensPerRequest, setInputTokensPerRequest] = useState("1200");
  const [outputTokensPerRequest, setOutputTokensPerRequest] = useState("350");
  const [cachedInputPercent, setCachedInputPercent] = useState("20");

  const [includeTools, setIncludeTools] = useState(false);
  const [webSearchCalls, setWebSearchCalls] = useState("0");
  const [codeExecutionCalls, setCodeExecutionCalls] = useState("0");
  const [attachmentSearchCalls, setAttachmentSearchCalls] = useState("0");
  const [collectionsSearchCalls, setCollectionsSearchCalls] = useState("0");
  const [xPostsFetched, setXPostsFetched] = useState("0");
  const [xProfilesFetched, setXProfilesFetched] = useState("0");

  const [customPricing, setCustomPricing] = useState(false);
  const [customShortInput, setCustomShortInput] = useState("2");
  const [customShortCached, setCustomShortCached] = useState("0.5");
  const [customShortOutput, setCustomShortOutput] = useState("6");
  const [customLongInput, setCustomLongInput] = useState("4");
  const [customLongCached, setCustomLongCached] = useState("1");
  const [customLongOutput, setCustomLongOutput] = useState("12");

  const selectedModel = MODEL_PRICES[model];
  const inputTokens = toNumber(inputTokensPerRequest);
  const usesLongContext = inputTokens >= LONG_CONTEXT_THRESHOLD;

  const serviceOptions = useMemo(() => {
    const options = [
      { value: "standard", label: "Standard" },
      { value: "priority", label: "Priority (2× token rates)" },
    ];

    if (selectedModel.batchDiscount !== null) {
      options.push({ value: "batch", label: "Batch (20% lower token rates)" });
    }

    return options;
  }, [selectedModel.batchDiscount]);

  const basePrices = useMemo<PriceSet>(() => {
    if (customPricing) {
      return usesLongContext
        ? {
            input: toNumber(customLongInput),
            cached: toNumber(customLongCached),
            output: toNumber(customLongOutput),
          }
        : {
            input: toNumber(customShortInput),
            cached: toNumber(customShortCached),
            output: toNumber(customShortOutput),
          };
    }

    return usesLongContext ? selectedModel.long : selectedModel.short;
  }, [
    customLongCached,
    customLongInput,
    customLongOutput,
    customPricing,
    customShortCached,
    customShortInput,
    customShortOutput,
    selectedModel,
    usesLongContext,
  ]);

  const tokenMultiplier = useMemo(() => {
    const service = serviceMode === "priority" ? 2 : serviceMode === "batch" ? 0.8 : 1;
    const region = endpointMode === "us" && selectedModel.usRegional ? 1.1 : 1;
    return service * region;
  }, [endpointMode, selectedModel.usRegional, serviceMode]);

  const effectivePrices = useMemo<PriceSet>(
    () => ({
      input: basePrices.input * tokenMultiplier,
      cached: basePrices.cached * tokenMultiplier,
      output: basePrices.output * tokenMultiplier,
    }),
    [basePrices, tokenMultiplier],
  );

  const validation = useMemo(() => {
    const integerFields = [
      ["Requests per month", requestsPerMonth],
      ["Average input tokens per request", inputTokensPerRequest],
      ["Average billed output tokens per request", outputTokensPerRequest],
    ] as const;

    for (const [label, value] of integerFields) {
      if (!isValidNonNegativeInteger(value)) {
        return `${label} must be a whole number of zero or more.`;
      }
    }

    if (!isValidNonNegativeDecimal(cachedInputPercent) || toNumber(cachedInputPercent) > 100) {
      return "Cached input share must be a number from 0 to 100.";
    }

    if (includeTools) {
      const toolFields = [
        ["Web Search calls", webSearchCalls],
        ["Code Execution calls", codeExecutionCalls],
        ["Attachment Search calls", attachmentSearchCalls],
        ["Collections Search calls", collectionsSearchCalls],
        ["X posts fetched", xPostsFetched],
        ["X profiles fetched", xProfilesFetched],
      ] as const;

      for (const [label, value] of toolFields) {
        if (!isValidNonNegativeInteger(value)) {
          return `${label} must be a whole number of zero or more.`;
        }
      }
    }

    if (customPricing) {
      const customFields = [
        ["Short-context input rate", customShortInput],
        ["Short-context cached rate", customShortCached],
        ["Short-context output rate", customShortOutput],
        ["Long-context input rate", customLongInput],
        ["Long-context cached rate", customLongCached],
        ["Long-context output rate", customLongOutput],
      ] as const;

      for (const [label, value] of customFields) {
        if (!isValidNonNegativeDecimal(value)) {
          return `${label} must be zero or a positive decimal number.`;
        }
      }
    }

    if (toNumber(inputTokensPerRequest) > selectedModel.contextWindow) {
      return `Average input tokens per request exceed ${formatNumber(selectedModel.contextWindow)} tokens, the published context window for ${selectedModel.label}.`;
    }

    return "";
  }, [
    attachmentSearchCalls,
    cachedInputPercent,
    codeExecutionCalls,
    collectionsSearchCalls,
    customLongCached,
    customLongInput,
    customLongOutput,
    customPricing,
    customShortCached,
    customShortInput,
    customShortOutput,
    includeTools,
    inputTokensPerRequest,
    outputTokensPerRequest,
    requestsPerMonth,
    selectedModel.contextWindow,
    selectedModel.label,
    webSearchCalls,
    xPostsFetched,
    xProfilesFetched,
  ]);

  const result = useMemo(() => {
    if (validation) return null;

    const requests = toNumber(requestsPerMonth);
    const inputPerRequest = toNumber(inputTokensPerRequest);
    const outputPerRequest = toNumber(outputTokensPerRequest);
    const cacheShare = toNumber(cachedInputPercent) / 100;

    const totalInputTokens = requests * inputPerRequest;
    const cachedInputTokens = totalInputTokens * cacheShare;
    const uncachedInputTokens = totalInputTokens - cachedInputTokens;
    const totalOutputTokens = requests * outputPerRequest;

    const uncachedInputCost = (uncachedInputTokens / 1_000_000) * effectivePrices.input;
    const cachedInputCost = (cachedInputTokens / 1_000_000) * effectivePrices.cached;
    const outputCost = (totalOutputTokens / 1_000_000) * effectivePrices.output;
    const tokenCost = uncachedInputCost + cachedInputCost + outputCost;

    const webCost = includeTools ? (toNumber(webSearchCalls) / 1000) * TOOL_RATES.webSearch : 0;
    const codeCost = includeTools ? (toNumber(codeExecutionCalls) / 1000) * TOOL_RATES.codeExecution : 0;
    const attachmentCost = includeTools ? (toNumber(attachmentSearchCalls) / 1000) * TOOL_RATES.attachmentSearch : 0;
    const collectionsCost = includeTools ? (toNumber(collectionsSearchCalls) / 1000) * TOOL_RATES.collectionsSearch : 0;
    const xPostsCost = includeTools ? (toNumber(xPostsFetched) / 1000) * TOOL_RATES.xPosts : 0;
    const xProfilesCost = includeTools ? (toNumber(xProfilesFetched) / 1000) * TOOL_RATES.xProfiles : 0;
    const toolCost = webCost + codeCost + attachmentCost + collectionsCost + xPostsCost + xProfilesCost;

    const monthlyCost = tokenCost + toolCost;

    const numericValues = [
      totalInputTokens,
      cachedInputTokens,
      uncachedInputTokens,
      totalOutputTokens,
      uncachedInputCost,
      cachedInputCost,
      outputCost,
      tokenCost,
      toolCost,
      monthlyCost,
    ];

    if (numericValues.some((value) => !Number.isFinite(value) || value > Number.MAX_SAFE_INTEGER)) {
      return { unsafe: true } as const;
    }

    return {
      unsafe: false as const,
      requests,
      totalInputTokens,
      cachedInputTokens,
      uncachedInputTokens,
      totalOutputTokens,
      uncachedInputCost,
      cachedInputCost,
      outputCost,
      tokenCost,
      webCost,
      codeCost,
      attachmentCost,
      collectionsCost,
      xPostsCost,
      xProfilesCost,
      toolCost,
      monthlyCost,
      costPerRequest: requests > 0 ? monthlyCost / requests : 0,
      yearlyCost: monthlyCost * 12,
    };
  }, [
    attachmentSearchCalls,
    cachedInputPercent,
    codeExecutionCalls,
    collectionsSearchCalls,
    effectivePrices,
    includeTools,
    inputTokensPerRequest,
    outputTokensPerRequest,
    requestsPerMonth,
    validation,
    webSearchCalls,
    xPostsFetched,
    xProfilesFetched,
  ]);

  const unsafeResult = result && result.unsafe;
  const errorMessage = validation || (unsafeResult ? "The entered workload is too large to calculate safely in the browser. Use smaller planning values or split the workload into parts." : "");

  const updateModel = (value: string) => {
    const nextModel = value as ModelKey;
    const next = MODEL_PRICES[nextModel];
    setModel(nextModel);

    if (serviceMode === "batch" && next.batchDiscount === null) setServiceMode("standard");
    if (endpointMode === "us" && !next.usRegional) setEndpointMode("global");

    if (!customPricing) {
      setCustomShortInput(String(next.short.input));
      setCustomShortCached(String(next.short.cached));
      setCustomShortOutput(String(next.short.output));
      setCustomLongInput(String(next.long.input));
      setCustomLongCached(String(next.long.cached));
      setCustomLongOutput(String(next.long.output));
    }
  };

  const reset = () => {
    setModel("grok-4.7");
    setServiceMode("standard");
    setEndpointMode("global");
    setRequestsPerMonth("70000");
    setInputTokensPerRequest("1200");
    setOutputTokensPerRequest("350");
    setCachedInputPercent("20");
    setIncludeTools(false);
    setWebSearchCalls("0");
    setCodeExecutionCalls("0");
    setAttachmentSearchCalls("0");
    setCollectionsSearchCalls("0");
    setXPostsFetched("0");
    setXProfilesFetched("0");
    setCustomPricing(false);
    setCustomShortInput("2");
    setCustomShortCached("0.5");
    setCustomShortOutput("6");
    setCustomLongInput("4");
    setCustomLongCached("1");
    setCustomLongOutput("12");
  };

  const contextLabel = usesLongContext
    ? `Long-context rates (prompt ≥ ${formatNumber(LONG_CONTEXT_THRESHOLD)} tokens)`
    : `Short-context rates (prompt < ${formatNumber(LONG_CONTEXT_THRESHOLD)} tokens)`;

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 self-start rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-semibold text-gray-950">Shape the Grok request you expect to run</h2>
        <p className="mt-3 leading-relaxed text-gray-600">
          Start with the model and service path, then use average billed token counts from one representative request.
        </p>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <BeeijaSelect
            label="Grok model"
            value={model}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => updateModel(event.target.value)}
            options={modelOptions}
          />

          <BeeijaSelect
            label="Processing mode"
            value={serviceMode}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => setServiceMode(event.target.value as ServiceMode)}
            options={serviceOptions}
          />
        </div>

        {selectedModel.usRegional ? (
          <label className="mt-5 flex cursor-pointer items-start gap-3 self-start">
            <input
              type="checkbox"
              checked={endpointMode === "us"}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setEndpointMode(event.target.checked ? "us" : "global")}
              className="mt-1 h-4 w-4 accent-[var(--green)]"
            />
            <span>
              <span className="block font-medium text-gray-900">Use the US regional endpoint (+10% token pricing)</span>
              <span className="mt-1 block text-sm leading-relaxed text-gray-600">Available for {selectedModel.label}; tool-invocation charges are not multiplied.</span>
            </span>
          </label>
        ) : null}

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <BeeijaNumberField
            label="Requests per month"
            value={requestsPerMonth}
            onChange={setRequestsPerMonth}
            min="0"
            step="1"
            sanitizeDecimal
          />
          <BeeijaNumberField
            label="Average input tokens per request"
            value={inputTokensPerRequest}
            onChange={setInputTokensPerRequest}
            min="0"
            step="1"
            sanitizeDecimal
            helper={`Published context window: ${formatNumber(selectedModel.contextWindow)} tokens.`}
          />
          <BeeijaNumberField
            label="Average output tokens per request"
            value={outputTokensPerRequest}
            onChange={setOutputTokensPerRequest}
            min="0"
            step="1"
            sanitizeDecimal
            helper="Include billed reasoning tokens, not only visible answer text."
          />
          <BeeijaNumberField
            label="Cached input share"
            value={cachedInputPercent}
            onChange={setCachedInputPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
            sanitizeDecimal
            helper="Use cached_tokens from measured API usage when possible."
          />
        </div>

        <div className="mt-6 border-l-4 border-gray-300 pl-4 text-sm leading-relaxed text-gray-600">
          <p className="font-medium text-gray-900">{contextLabel}</p>
          <p className="mt-1">xAI applies the active context band to uncached input, cached input, and output tokens for the request.</p>
        </div>

        {selectedModel.multiAgent ? (
          <div className="mt-5 border-l-4 border-gray-300 pl-4 text-sm leading-relaxed text-gray-600">
            <p className="font-medium text-gray-900">Multi-agent usage needs measured billed tokens</p>
            <p className="mt-1">All leader and sub-agent tokens are billed. Enter the aggregate input and output usage from the API rather than the visible prompt and final answer alone.</p>
          </div>
        ) : null}

        {serviceMode === "priority" ? (
          <div className="mt-5 self-start border-l-4 border-[var(--yellow)] pl-4 text-sm leading-relaxed text-gray-700">
            <p className="font-medium text-gray-950">Priority is billed only when xAI actually serves it</p>
            <p className="mt-1">This estimate uses the 2× priority token rate. In production, check the returned service_tier; fallback responses billed at the default tier use standard pricing.</p>
          </div>
        ) : null}

        {serviceMode === "batch" ? (
          <div className="mt-5 self-start border-l-4 border-[var(--yellow)] pl-4 text-sm leading-relaxed text-gray-700">
            <p className="font-medium text-gray-950">Batch trades latency for the current 20% token discount</p>
            <p className="mt-1">Batch work is asynchronous and normally completes within 24 hours. The discount applies to token types, not the fixed server-side tool invocation charges entered below.</p>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 self-start border-l-4 border-red-500 pl-4 text-sm leading-relaxed text-red-700">
            <p><span className="font-semibold">Check the estimate:</span> {errorMessage}</p>
          </div>
        ) : null}

        <label className="mt-7 flex cursor-pointer items-start gap-3 self-start">
          <input
            type="checkbox"
            checked={includeTools}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setIncludeTools(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--green)]"
          />
          <span>
            <span className="block font-medium text-gray-900">Include xAI server-side tool usage</span>
            <span className="mt-1 block text-sm leading-relaxed text-gray-600">Add successful Web Search, X Search, code, attachment, or collection usage when those costs belong to this workload.</span>
          </span>
        </label>

        {includeTools ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <BeeijaNumberField label="Web Search calls per month" value={webSearchCalls} onChange={setWebSearchCalls} min="0" step="1" sanitizeDecimal helper="$5 per 1,000 successful calls." />
            <BeeijaNumberField label="Code Execution calls per month" value={codeExecutionCalls} onChange={setCodeExecutionCalls} min="0" step="1" sanitizeDecimal helper="$5 per 1,000 successful calls." />
            <BeeijaNumberField label="Attachment Search calls per month" value={attachmentSearchCalls} onChange={setAttachmentSearchCalls} min="0" step="1" sanitizeDecimal helper="$10 per 1,000 successful calls." />
            <BeeijaNumberField label="Collections Search calls per month" value={collectionsSearchCalls} onChange={setCollectionsSearchCalls} min="0" step="1" sanitizeDecimal helper="$2.50 per 1,000 successful calls." />
            <BeeijaNumberField label="X posts fetched per month" value={xPostsFetched} onChange={setXPostsFetched} min="0" step="1" sanitizeDecimal helper="$5 per 1,000 posts fetched." />
            <BeeijaNumberField label="X profiles fetched per month" value={xProfilesFetched} onChange={setXProfilesFetched} min="0" step="1" sanitizeDecimal helper="$10 per 1,000 profiles fetched." />
          </div>
        ) : null}

        <label className="mt-7 flex cursor-pointer items-start gap-3 self-start">
          <input
            type="checkbox"
            checked={customPricing}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setCustomPricing(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--green)]"
          />
          <span>
            <span className="block font-medium text-gray-900">Override xAI token rates</span>
            <span className="mt-1 block text-sm leading-relaxed text-gray-600">Enter custom global Standard rates for both context bands. Priority, Batch, and US-region multipliers still apply.</span>
          </span>
        </label>

        {customPricing ? (
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm font-semibold text-gray-900">Short context</p>
              <div className="mt-3 grid gap-5 md:grid-cols-3">
                <BeeijaNumberField label="Input rate" value={customShortInput} onChange={setCustomShortInput} min="0" step="0.001" prefix="$" sanitizeDecimal />
                <BeeijaNumberField label="Cached rate" value={customShortCached} onChange={setCustomShortCached} min="0" step="0.001" prefix="$" sanitizeDecimal />
                <BeeijaNumberField label="Output rate" value={customShortOutput} onChange={setCustomShortOutput} min="0" step="0.001" prefix="$" sanitizeDecimal />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Long context</p>
              <div className="mt-3 grid gap-5 md:grid-cols-3">
                <BeeijaNumberField label="Input rate" value={customLongInput} onChange={setCustomLongInput} min="0" step="0.001" prefix="$" sanitizeDecimal />
                <BeeijaNumberField label="Cached rate" value={customLongCached} onChange={setCustomLongCached} min="0" step="0.001" prefix="$" sanitizeDecimal />
                <BeeijaNumberField label="Output rate" value={customLongOutput} onChange={setCustomLongOutput} min="0" step="0.001" prefix="$" sanitizeDecimal />
              </div>
            </div>
          </div>
        ) : null}

        <button type="button" onClick={reset} className="beeija-btn-outline mt-7">Reset values</button>
      </section>

      <BeeijaCalculatorResultPanel
        title="Grok cost breakdown"
        description="Token charges and any server-side tool usage are kept separate so you can see what is driving the estimate."
        primaryLabel="Estimated monthly cost"
        primaryValue={errorMessage || !result || result.unsafe ? "Check entered values" : formatVisibleMoney(result.monthlyCost)}
        stats={
          !errorMessage && result && !result.unsafe ? (
            <div className="grid min-w-0 gap-4 sm:grid-cols-3">
              <ResultStat label="Per request" value={formatVisibleMoney(result.costPerRequest)} />
              <ResultStat label="Token charges" value={formatVisibleMoney(result.tokenCost)} />
              <ResultStat label="Tool charges" value={formatVisibleMoney(result.toolCost)} />
            </div>
          ) : undefined
        }
        breakdown={
          !errorMessage && result && !result.unsafe ? (
            <div className="space-y-4">
              <CostRow label="Uncached input" detail={`${formatNumber(result.uncachedInputTokens)} tokens`} value={formatVisibleMoney(result.uncachedInputCost)} />
              <CostRow label="Cached input" detail={`${formatNumber(result.cachedInputTokens)} tokens`} value={formatVisibleMoney(result.cachedInputCost)} />
              <CostRow label="Billed output" detail={`${formatNumber(result.totalOutputTokens)} tokens`} value={formatVisibleMoney(result.outputCost)} />
              {result.toolCost > 0 ? <CostRow label="Server-side tools" detail="Successful billable tool usage entered above" value={formatVisibleMoney(result.toolCost)} /> : null}
            </div>
          ) : undefined
        }
        totals={
          !errorMessage && result && !result.unsafe ? (
            <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
              <p>Model: <span className="font-medium text-gray-900">{selectedModel.apiName}</span></p>
              <p className="mt-2">Pricing band: <span className="font-medium text-gray-900">{usesLongContext ? "long context" : "short context"}</span></p>
              <p className="mt-2">Processing: <span className="font-medium text-gray-900">{serviceMode === "priority" ? "Priority" : serviceMode === "batch" ? "Batch" : "Standard"}</span>{endpointMode === "us" && selectedModel.usRegional ? " · US regional" : " · Global endpoint"}</p>
              <p className="mt-2">Effective / 1M tokens: <span className="font-medium text-gray-900">input {formatVisibleMoney(effectivePrices.input)}, cached {formatVisibleMoney(effectivePrices.cached)}, output {formatVisibleMoney(effectivePrices.output)}</span></p>
              <p className="mt-2">12 months at this monthly workload: <span className="font-medium text-gray-900">{formatVisibleMoney(result.yearlyCost)}</span></p>
            </div>
          ) : undefined
        }
        provider="xAI"
        pricingCheckedDate="September 22, 2026"
        excludedCosts="image and video generation, voice APIs, file or collection storage and downloads, client-side tool costs, taxes, credits, negotiated discounts, retries not represented in the workload, and any usage not entered here"
      />
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-gray-950 [overflow-wrap:anywhere]">{value}</p>
    </div>
  );
}

function CostRow({ label, detail, value }: { label: string; detail: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 text-sm text-gray-500">{detail}</p>
      </div>
      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">{value}</p>
    </div>
  );
}

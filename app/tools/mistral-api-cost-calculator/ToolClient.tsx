"use client";

import { ChangeEvent, useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type ModelKey =
  | "mistral-large-3"
  | "mistral-medium-3-5"
  | "mistral-small-4"
  | "ministral-3-14b"
  | "ministral-3-8b"
  | "ministral-3-3b"
  | "codestral";

type ServiceTier = "standard" | "batch" | "priority";
type InferenceRegion = "global" | "eu" | "us";

type ModelPrice = {
  label: string;
  apiId: string;
  input: number;
  cachedInput: number;
  output: number;
  contextTokens: number;
};

const MODEL_PRICES: Record<ModelKey, ModelPrice> = {
  "mistral-large-3": {
    label: "Mistral Large 3",
    apiId: "mistral-large-latest",
    input: 0.5,
    cachedInput: 0.05,
    output: 1.5,
    contextTokens: 256_000,
  },
  "mistral-medium-3-5": {
    label: "Mistral Medium 3.5",
    apiId: "mistral-medium-latest",
    input: 1.5,
    cachedInput: 0.15,
    output: 7.5,
    contextTokens: 256_000,
  },
  "mistral-small-4": {
    label: "Mistral Small 4",
    apiId: "mistral-small-latest",
    input: 0.15,
    cachedInput: 0.015,
    output: 0.6,
    contextTokens: 256_000,
  },
  "ministral-3-14b": {
    label: "Ministral 3 14B",
    apiId: "ministral-14b-latest",
    input: 0.2,
    cachedInput: 0.02,
    output: 0.2,
    contextTokens: 256_000,
  },
  "ministral-3-8b": {
    label: "Ministral 3 8B",
    apiId: "ministral-8b-latest",
    input: 0.15,
    cachedInput: 0.015,
    output: 0.15,
    contextTokens: 256_000,
  },
  "ministral-3-3b": {
    label: "Ministral 3 3B",
    apiId: "ministral-3b-latest",
    input: 0.1,
    cachedInput: 0.01,
    output: 0.1,
    contextTokens: 256_000,
  },
  codestral: {
    label: "Codestral",
    apiId: "codestral-latest",
    input: 0.3,
    cachedInput: 0.03,
    output: 0.9,
    contextTokens: 128_000,
  },
};

const MODEL_OPTIONS = Object.entries(MODEL_PRICES).map(([value, model]) => ({
  value,
  label: model.label,
}));

const SERVICE_TIER_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "batch", label: "Batch (50% lower)" },
  { value: "priority", label: "Priority (1.75×)" },
];

const ALL_REGION_OPTIONS = [
  { value: "global", label: "Global" },
  { value: "eu", label: "EU regional (+10%)" },
  { value: "us", label: "US regional (+10%)" },
];

const GLOBAL_REGION_OPTION = [{ value: "global", label: "Global" }];

const PRICING_CHECKED_DATE = "September 24, 2026";

function isValidNonNegativeInteger(value: string) {
  return /^\d+$/.test(value) && Number.isSafeInteger(Number(value));
}

function isValidNonNegativeDecimal(value: string) {
  return /^\d+(?:\.\d+)?$/.test(value) && Number.isFinite(Number(value));
}

function isValidPercent(value: string) {
  if (!isValidNonNegativeDecimal(value)) return false;
  const parsed = Number(value);
  return parsed >= 0 && parsed <= 100;
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "—";
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

function hasUnsafeNumber(values: number[]) {
  return values.some(
    (value) =>
      !Number.isFinite(value) ||
      Math.abs(value) > Number.MAX_SAFE_INTEGER,
  );
}

export default function ToolClient() {
  const [model, setModel] = useState<ModelKey>("mistral-small-4");
  const [serviceTier, setServiceTier] =
    useState<ServiceTier>("standard");
  const [region, setRegion] = useState<InferenceRegion>("global");
  const [requestsPerMonth, setRequestsPerMonth] = useState("60000");
  const [inputTokensPerRequest, setInputTokensPerRequest] =
    useState("1100");
  const [outputTokensPerRequest, setOutputTokensPerRequest] =
    useState("350");
  const [cachedInputShare, setCachedInputShare] = useState("20");

  const [customPricing, setCustomPricing] = useState(false);
  const [customInputPrice, setCustomInputPrice] = useState("0.15");
  const [customCachedInputPrice, setCustomCachedInputPrice] =
    useState("0.015");
  const [customOutputPrice, setCustomOutputPrice] = useState("0.6");

  const selectedModel = MODEL_PRICES[model];

  const regionOptions =
    serviceTier === "batch" ? GLOBAL_REGION_OPTION : ALL_REGION_OPTIONS;

  const updateModel = (value: string) => {
    const nextModel = value as ModelKey;
    const prices = MODEL_PRICES[nextModel];
    setModel(nextModel);

    if (!customPricing) {
      setCustomInputPrice(String(prices.input));
      setCustomCachedInputPrice(String(prices.cachedInput));
      setCustomOutputPrice(String(prices.output));
    }
  };

  const updateServiceTier = (value: string) => {
    const nextTier = value as ServiceTier;
    setServiceTier(nextTier);

    if (nextTier === "batch") {
      setRegion("global");
    }
  };

  const updateCustomPricing = (checked: boolean) => {
    if (checked) {
      setCustomInputPrice(String(selectedModel.input));
      setCustomCachedInputPrice(String(selectedModel.cachedInput));
      setCustomOutputPrice(String(selectedModel.output));
    }
    setCustomPricing(checked);
  };

  const validationError = useMemo(() => {
    if (!isValidNonNegativeInteger(requestsPerMonth)) {
      return "Requests per month must be a whole number of zero or more.";
    }

    if (!isValidNonNegativeInteger(inputTokensPerRequest)) {
      return "Average input tokens per request must be a whole number of zero or more.";
    }

    if (!isValidNonNegativeInteger(outputTokensPerRequest)) {
      return "Average output tokens per request must be a whole number of zero or more.";
    }

    if (!isValidPercent(cachedInputShare)) {
      return "Cached input share must be a number from 0 to 100.";
    }

    if (
      customPricing &&
      (!isValidNonNegativeDecimal(customInputPrice) ||
        !isValidNonNegativeDecimal(customCachedInputPrice) ||
        !isValidNonNegativeDecimal(customOutputPrice))
    ) {
      return "Custom token prices must be numbers of zero or more.";
    }

    const requestInput = Number(inputTokensPerRequest);
    const requestOutput = Number(outputTokensPerRequest);

    if (requestInput + requestOutput > selectedModel.contextTokens) {
      return `The representative request entered here exceeds ${selectedModel.label}'s ${formatNumber(
        selectedModel.contextTokens,
      )}-token context limit. Mistral counts input and generated output toward each actual request limit.`;
    }

    return "";
  }, [
    cachedInputShare,
    customCachedInputPrice,
    customInputPrice,
    customOutputPrice,
    customPricing,
    inputTokensPerRequest,
    outputTokensPerRequest,
    requestsPerMonth,
    selectedModel,
  ]);

  const basePrices = useMemo(() => {
    if (customPricing) {
      return {
        input: Number(customInputPrice),
        cachedInput: Number(customCachedInputPrice),
        output: Number(customOutputPrice),
      };
    }

    return {
      input: selectedModel.input,
      cachedInput: selectedModel.cachedInput,
      output: selectedModel.output,
    };
  }, [
    customCachedInputPrice,
    customInputPrice,
    customOutputPrice,
    customPricing,
    selectedModel,
  ]);

  const effectivePrices = useMemo(() => {
    const tierMultiplier =
      serviceTier === "batch"
        ? 0.5
        : serviceTier === "priority"
          ? 1.75
          : 1;
    const regionMultiplier = region === "global" ? 1 : 1.1;
    const multiplier = tierMultiplier * regionMultiplier;

    return {
      input: basePrices.input * multiplier,
      cachedInput: basePrices.cachedInput * multiplier,
      output: basePrices.output * multiplier,
      multiplier,
    };
  }, [basePrices, region, serviceTier]);

  const result = useMemo(() => {
    if (validationError) return null;

    const requests = Number(requestsPerMonth);
    const inputPerRequest = Number(inputTokensPerRequest);
    const outputPerRequest = Number(outputTokensPerRequest);
    const requestedCacheShare = Number(cachedInputShare) / 100;
    const cacheShare = inputPerRequest < 64 ? 0 : requestedCacheShare;

    const totalInputTokens = requests * inputPerRequest;
    const totalOutputTokens = requests * outputPerRequest;
    const cachedInputTokens = totalInputTokens * cacheShare;
    const uncachedInputTokens = totalInputTokens - cachedInputTokens;

    const cachedInputCost =
      (cachedInputTokens / 1_000_000) * effectivePrices.cachedInput;
    const uncachedInputCost =
      (uncachedInputTokens / 1_000_000) * effectivePrices.input;
    const outputCost =
      (totalOutputTokens / 1_000_000) * effectivePrices.output;
    const monthlyCost = cachedInputCost + uncachedInputCost + outputCost;

    const values = [
      requests,
      totalInputTokens,
      totalOutputTokens,
      cachedInputTokens,
      uncachedInputTokens,
      cachedInputCost,
      uncachedInputCost,
      outputCost,
      monthlyCost,
      monthlyCost * 12,
    ];

    if (hasUnsafeNumber(values)) return null;

    return {
      requests,
      totalInputTokens,
      totalOutputTokens,
      cachedInputTokens,
      uncachedInputTokens,
      cachedInputCost,
      uncachedInputCost,
      outputCost,
      monthlyCost,
      dailyCost: monthlyCost / 30,
      yearlyCost: monthlyCost * 12,
      costPerRequest: requests > 0 ? monthlyCost / requests : 0,
    };
  }, [
    cachedInputShare,
    effectivePrices,
    inputTokensPerRequest,
    outputTokensPerRequest,
    requestsPerMonth,
    validationError,
  ]);

  const unsafeResult = !validationError && result === null;

  const reset = () => {
    setModel("mistral-small-4");
    setServiceTier("standard");
    setRegion("global");
    setRequestsPerMonth("60000");
    setInputTokensPerRequest("1100");
    setOutputTokensPerRequest("350");
    setCachedInputShare("20");
    setCustomPricing(false);
    setCustomInputPrice("0.15");
    setCustomCachedInputPrice("0.015");
    setCustomOutputPrice("0.6");
  };

  const routeNote =
    serviceTier === "batch"
      ? "Batch is asynchronous, runs on the global endpoint, and uses the published 50% discount."
      : serviceTier === "priority"
        ? region === "global"
          ? "Priority requires account entitlement. This estimate assumes requests are actually served by Priority rather than falling back to Standard."
          : "Priority can be regional when your account, model, region, and capacity support it. This planner compounds Mistral's published 1.75× Priority and 1.10× regional modifiers as a budgeting assumption because the public docs do not state one combined-rate formula; verify your effective terms before relying on this route."
        : region === "global"
          ? ""
          : "Regional inference adds 10% to token pricing. Model and feature availability varies by region, and Batch is not available on regional endpoints.";

  const shortPromptCacheWarning =
    !validationError &&
    Number(inputTokensPerRequest) < 64 &&
    Number(cachedInputShare) > 0;

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 self-start rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Plan a Mistral inference workload
          </h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            Choose how the request is served, then enter one representative
            request and monthly volume. Cache hits are priced separately from
            ordinary input.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          <BeeijaSelect
            label="Mistral model"
            value={model}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              updateModel(event.target.value)
            }
            options={MODEL_OPTIONS}
          />

          <BeeijaSelect
            label="Service tier"
            value={serviceTier}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              updateServiceTier(event.target.value)
            }
            options={SERVICE_TIER_OPTIONS}
          />

          <BeeijaSelect
            label="Inference location"
            value={region}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setRegion(event.target.value as InferenceRegion)
            }
            options={regionOptions}
          />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
          />

          <BeeijaNumberField
            label="Average output tokens per request"
            value={outputTokensPerRequest}
            onChange={setOutputTokensPerRequest}
            min="0"
            step="1"
            helper="Include generated reasoning usage when reasoning is enabled."
            sanitizeDecimal
          />

          <BeeijaNumberField
            label="Cached input share"
            value={cachedInputShare}
            onChange={setCachedInputShare}
            min="0"
            max="100"
            step="0.1"
            suffix="%"
            helper="Use measured cached-token usage when available."
            sanitizeDecimal
          />
        </div>

        <p className="mt-5 text-sm leading-relaxed text-gray-600">
          {selectedModel.label} is represented by the API alias{" "}
          <code>{selectedModel.apiId}</code> and uses a{" "}
          <span className="font-medium text-gray-900">
            {formatNumber(selectedModel.contextTokens)}-token
          </span>{" "}
          context window here. The limit check applies to the representative
          request entered above; production code still needs to validate each
          actual prompt plus its allowed generation budget.
        </p>

        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          The arithmetic runs in your browser. These planning values are not
          sent to Mistral, and no API key or prompt text is required.
        </p>

        {shortPromptCacheWarning ? (
          <div className="mt-5 self-start border-l-4 border-[var(--yellow)] pl-4">
            <p className="text-sm leading-relaxed text-gray-700">
              Mistral cache blocks contain 64 tokens, so a prompt below 64
              tokens cannot receive a cache hit. This estimate therefore
              treats the entered cached share as 0% for this representative
              request.
            </p>
          </div>
        ) : null}

        {routeNote ? (
          <div className="mt-5 self-start border-l-4 border-[var(--yellow)] pl-4">
            <p className="text-sm leading-relaxed text-gray-700">
              {routeNote}
            </p>
          </div>
        ) : null}

        {validationError ? (
          <div className="mt-5 self-start border-l-4 border-red-500 pl-4">
            <p className="text-sm leading-relaxed text-red-700">
              <span className="font-semibold">Check the estimate:</span>{" "}
              {validationError}
            </p>
          </div>
        ) : unsafeResult ? (
          <div className="mt-5 self-start border-l-4 border-red-500 pl-4">
            <p className="text-sm leading-relaxed text-red-700">
              <span className="font-semibold">Check the estimate:</span>{" "}
              The entered workload is too large to calculate safely in the
              browser. Use smaller planning values or split the workload.
            </p>
          </div>
        ) : null}

        <div className="mt-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={customPricing}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateCustomPricing(event.target.checked)
              }
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--green)]"
            />
            <span>
              <span className="block font-medium text-gray-900">
                Use custom standard/global token prices
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-gray-600">
                Service-tier and regional multipliers are still applied to
                these base rates.
              </span>
            </span>
          </label>
        </div>

        {customPricing ? (
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <BeeijaNumberField
              label="Input price / 1M"
              value={customInputPrice}
              onChange={setCustomInputPrice}
              min="0"
              step="0.001"
              prefix="$"
              sanitizeDecimal
            />
            <BeeijaNumberField
              label="Cached input / 1M"
              value={customCachedInputPrice}
              onChange={setCustomCachedInputPrice}
              min="0"
              step="0.001"
              prefix="$"
              sanitizeDecimal
            />
            <BeeijaNumberField
              label="Output price / 1M"
              value={customOutputPrice}
              onChange={setCustomOutputPrice}
              min="0"
              step="0.001"
              prefix="$"
              sanitizeDecimal
            />
          </div>
        ) : null}

        <div className="mt-6 text-sm leading-relaxed text-gray-600">
          <span className="font-medium text-gray-900">
            Effective rates / 1M tokens:
          </span>{" "}
          input {formatVisibleMoney(effectivePrices.input)} · cached{" "}
          {formatVisibleMoney(effectivePrices.cachedInput)} · output{" "}
          {formatVisibleMoney(effectivePrices.output)}
        </div>

        <button type="button" onClick={reset} className="beeija-btn-outline mt-6">
          Reset values
        </button>
      </section>

      <BeeijaCalculatorResultPanel
        className="self-start"
        title="Mistral cost breakdown"
        description="Uncached input, cached input, and output are kept separate so the effect of prompt caching stays visible."
        primaryLabel="Estimated monthly cost"
        primaryValue={
          validationError || unsafeResult || !result
            ? "Check entered values"
            : formatVisibleMoney(result.monthlyCost)
        }
        stats={
          result ? (
            <div className="grid min-w-0 gap-4 sm:grid-cols-3">
              <ResultStat
                label="Per request"
                value={formatVisibleMoney(result.costPerRequest)}
              />
              <ResultStat
                label="Daily avg. (30d)"
                value={formatVisibleMoney(result.dailyCost)}
              />
              <ResultStat
                label="12-mo projection"
                value={formatVisibleMoney(result.yearlyCost)}
              />
            </div>
          ) : undefined
        }
        breakdown={
          result ? (
            <div className="space-y-3">
              <CostRow
                label="Uncached input"
                detail={`${formatNumber(result.uncachedInputTokens)} tokens`}
                value={formatVisibleMoney(result.uncachedInputCost)}
              />
              <CostRow
                label="Cached input"
                detail={`${formatNumber(result.cachedInputTokens)} tokens`}
                value={formatVisibleMoney(result.cachedInputCost)}
              />
              <CostRow
                label="Output"
                detail={`${formatNumber(result.totalOutputTokens)} tokens`}
                value={formatVisibleMoney(result.outputCost)}
              />
            </div>
          ) : undefined
        }
        totals={
          result ? (
            <div className="min-w-0 text-sm leading-relaxed text-gray-600">
              <p>
                Model:{" "}
                <span className="font-medium text-gray-900">
                  {selectedModel.label}
                </span>{" "}
                · {serviceTier} · {region}
              </p>
              <p className="mt-2">
                Input tokens: {formatNumber(result.totalInputTokens)} · cached{" "}
                {formatNumber(result.cachedInputTokens)}
              </p>
              <p className="mt-2">
                Output tokens: {formatNumber(result.totalOutputTokens)}
              </p>
              <p className="mt-2">
                12-month projection assumes the selected rates stay unchanged.
              </p>
            </div>
          ) : undefined
        }
        provider="Mistral"
        pricingCheckedDate={PRICING_CHECKED_DATE}
        excludedCosts="OCR, transcription, text-to-speech, fine-tuning, agents, built-in tools, files, storage, taxes, credits, negotiated terms, retries, and services billed in units other than text tokens"
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
    <div className="flex min-w-0 items-start justify-between gap-4 border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
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

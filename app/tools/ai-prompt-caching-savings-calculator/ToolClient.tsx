"use client";

import { useEffect, useMemo, useState } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type CacheStrategy = "automatic" | "write-read" | "explicit-storage";

type CachePlan = {
  id: string;
  provider: string;
  model: string;
  strategy: CacheStrategy;
  inputPrice: number;
  cachedReadPrice: number;
  outputPrice: number;
  cacheWritePrice?: number;
  storagePricePerMillionTokenHour?: number;
  note: string;
};

type CostBreakdown = {
  dynamicInput: number;
  reusableHits: number;
  reusableMisses: number;
  output: number;
  storage: number;
  total: number;
};

const CACHE_PLANS: CachePlan[] = [
  {
    id: "openai-gpt-5-5",
    provider: "OpenAI",
    model: "GPT-5.5",
    strategy: "automatic",
    inputPrice: 5,
    cachedReadPrice: 0.5,
    outputPrice: 30,
    note: "Automatic prompt caching",
  },
  {
    id: "openai-gpt-5-4",
    provider: "OpenAI",
    model: "GPT-5.4",
    strategy: "automatic",
    inputPrice: 2.5,
    cachedReadPrice: 0.25,
    outputPrice: 15,
    note: "Automatic prompt caching",
  },
  {
    id: "openai-gpt-5-4-mini",
    provider: "OpenAI",
    model: "GPT-5.4 mini",
    strategy: "automatic",
    inputPrice: 0.75,
    cachedReadPrice: 0.075,
    outputPrice: 4.5,
    note: "Automatic prompt caching",
  },
  {
    id: "claude-opus-4-8-5m",
    provider: "Anthropic",
    model: "Claude Opus 4.8 · 5-minute cache",
    strategy: "write-read",
    inputPrice: 5,
    cachedReadPrice: 0.5,
    cacheWritePrice: 6.25,
    outputPrice: 25,
    note: "5-minute cache write and read pricing",
  },
  {
    id: "claude-opus-4-8-1h",
    provider: "Anthropic",
    model: "Claude Opus 4.8 · 1-hour cache",
    strategy: "write-read",
    inputPrice: 5,
    cachedReadPrice: 0.5,
    cacheWritePrice: 10,
    outputPrice: 25,
    note: "1-hour cache write and read pricing",
  },
  {
    id: "claude-sonnet-4-6-5m",
    provider: "Anthropic",
    model: "Claude Sonnet 4.6 · 5-minute cache",
    strategy: "write-read",
    inputPrice: 3,
    cachedReadPrice: 0.3,
    cacheWritePrice: 3.75,
    outputPrice: 15,
    note: "5-minute cache write and read pricing",
  },
  {
    id: "claude-sonnet-4-6-1h",
    provider: "Anthropic",
    model: "Claude Sonnet 4.6 · 1-hour cache",
    strategy: "write-read",
    inputPrice: 3,
    cachedReadPrice: 0.3,
    cacheWritePrice: 6,
    outputPrice: 15,
    note: "1-hour cache write and read pricing",
  },
  {
    id: "claude-haiku-4-5-5m",
    provider: "Anthropic",
    model: "Claude Haiku 4.5 · 5-minute cache",
    strategy: "write-read",
    inputPrice: 1,
    cachedReadPrice: 0.1,
    cacheWritePrice: 1.25,
    outputPrice: 5,
    note: "5-minute cache write and read pricing",
  },
  {
    id: "claude-haiku-4-5-1h",
    provider: "Anthropic",
    model: "Claude Haiku 4.5 · 1-hour cache",
    strategy: "write-read",
    inputPrice: 1,
    cachedReadPrice: 0.1,
    cacheWritePrice: 2,
    outputPrice: 5,
    note: "1-hour cache write and read pricing",
  },
  {
    id: "gemini-3-5-flash",
    provider: "Google",
    model: "Gemini 3.5 Flash · Standard",
    strategy: "explicit-storage",
    inputPrice: 1.5,
    cachedReadPrice: 0.15,
    outputPrice: 9,
    storagePricePerMillionTokenHour: 1,
    note: "Explicit context caching with storage",
  },
  {
    id: "gemini-3-1-flash-lite",
    provider: "Google",
    model: "Gemini 3.1 Flash-Lite · Standard",
    strategy: "explicit-storage",
    inputPrice: 0.25,
    cachedReadPrice: 0.025,
    outputPrice: 1.5,
    storagePricePerMillionTokenHour: 1,
    note: "Explicit context caching with storage",
  },
  {
    id: "gemini-2-5-flash",
    provider: "Google",
    model: "Gemini 2.5 Flash · Standard",
    strategy: "explicit-storage",
    inputPrice: 0.3,
    cachedReadPrice: 0.03,
    outputPrice: 2.5,
    storagePricePerMillionTokenHour: 1,
    note: "Explicit context caching with storage",
  },
  {
    id: "gemini-2-5-flash-lite",
    provider: "Google",
    model: "Gemini 2.5 Flash-Lite · Standard",
    strategy: "explicit-storage",
    inputPrice: 0.1,
    cachedReadPrice: 0.01,
    outputPrice: 0.4,
    storagePricePerMillionTokenHour: 1,
    note: "Explicit context caching with storage",
  },
];

const strategyOptions = [
  {
    value: "automatic",
    label: "Automatic cache reads · no separate write or storage fee",
  },
  {
    value: "write-read",
    label: "Separate cache-write and cache-read prices",
  },
  {
    value: "explicit-storage",
    label: "Cache-read price plus token-hour storage",
  },
];

const defaultPlanId = "openai-gpt-5-4-mini";

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

function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateCachedCost({
  plan,
  requests,
  reusableTokens,
  dynamicTokens,
  outputTokens,
  hitRate,
  cacheObjects,
  ttlHours,
}: {
  plan: CachePlan;
  requests: number;
  reusableTokens: number;
  dynamicTokens: number;
  outputTokens: number;
  hitRate: number;
  cacheObjects: number;
  ttlHours: number;
}): CostBreakdown {
  const hitRequests = requests * hitRate;
  const missRequests = requests - hitRequests;

  const dynamicInput =
    ((requests * dynamicTokens) / 1_000_000) * plan.inputPrice;

  const reusableHits =
    ((hitRequests * reusableTokens) / 1_000_000) *
    plan.cachedReadPrice;

  const missRate =
    plan.strategy === "write-read"
      ? plan.cacheWritePrice ?? plan.inputPrice
      : plan.inputPrice;

  const reusableMisses =
    ((missRequests * reusableTokens) / 1_000_000) * missRate;

  const output =
    ((requests * outputTokens) / 1_000_000) * plan.outputPrice;

  const storage =
    plan.strategy === "explicit-storage"
      ? ((reusableTokens * cacheObjects * ttlHours) / 1_000_000) *
        (plan.storagePricePerMillionTokenHour ?? 0)
      : 0;

  return {
    dynamicInput,
    reusableHits,
    reusableMisses,
    output,
    storage,
    total:
      dynamicInput +
      reusableHits +
      reusableMisses +
      output +
      storage,
  };
}

export default function ToolClient() {
  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlanId);

  const [monthlyRequests, setMonthlyRequests] = useState("100000");
  const [reusableTokensPerRequest, setReusableTokensPerRequest] =
    useState("20000");
  const [dynamicInputTokensPerRequest, setDynamicInputTokensPerRequest] =
    useState("500");
  const [outputTokensPerRequest, setOutputTokensPerRequest] =
    useState("300");
  const [cacheHitRate, setCacheHitRate] = useState("85");
  const [cacheObjectsPerMonth, setCacheObjectsPerMonth] = useState("30");
  const [cacheTtlHours, setCacheTtlHours] = useState("1");
  const [monthlyBudget, setMonthlyBudget] = useState("1000");

  const [includeCustom, setIncludeCustom] = useState(false);
  const [customProviderName, setCustomProviderName] =
    useState("Custom Provider");
  const [customModelName, setCustomModelName] = useState("Custom Model");
  const [customStrategy, setCustomStrategy] =
    useState<CacheStrategy>("automatic");
  const [customInputPrice, setCustomInputPrice] = useState("");
  const [customCachedReadPrice, setCustomCachedReadPrice] = useState("");
  const [customCacheWritePrice, setCustomCacheWritePrice] = useState("");
  const [customOutputPrice, setCustomOutputPrice] = useState("");
  const [customStoragePrice, setCustomStoragePrice] = useState("");

  const customPlan = useMemo<CachePlan | null>(() => {
    const hasRequiredPrices =
      customInputPrice.trim() !== "" &&
      customCachedReadPrice.trim() !== "" &&
      customOutputPrice.trim() !== "" &&
      (customStrategy !== "write-read" ||
        customCacheWritePrice.trim() !== "") &&
      (customStrategy !== "explicit-storage" ||
        customStoragePrice.trim() !== "");

    if (!includeCustom || !hasRequiredPrices) {
      return null;
    }

    return {
      id: "custom-provider",
      provider: customProviderName.trim() || "Custom Provider",
      model: customModelName.trim() || "Custom Model",
      strategy: customStrategy,
      inputPrice: toNumber(customInputPrice),
      cachedReadPrice: toNumber(customCachedReadPrice),
      cacheWritePrice:
        customStrategy === "write-read"
          ? toNumber(customCacheWritePrice)
          : undefined,
      outputPrice: toNumber(customOutputPrice),
      storagePricePerMillionTokenHour:
        customStrategy === "explicit-storage"
          ? toNumber(customStoragePrice)
          : undefined,
      note: "User-entered current pricing",
    };
  }, [
    customCachedReadPrice,
    customCacheWritePrice,
    customInputPrice,
    customModelName,
    customOutputPrice,
    customProviderName,
    customStoragePrice,
    customStrategy,
    includeCustom,
  ]);

  const availablePlans = useMemo(
    () => (customPlan ? [...CACHE_PLANS, customPlan] : CACHE_PLANS),
    [customPlan],
  );

  const planOptions = useMemo(
    () =>
      availablePlans.map((plan) => ({
        value: plan.id,
        label: `${plan.provider} — ${plan.model}`,
      })),
    [availablePlans],
  );

  useEffect(() => {
    if (
      selectedPlanId === "custom-provider" &&
      !availablePlans.some((plan) => plan.id === "custom-provider")
    ) {
      setSelectedPlanId(defaultPlanId);
    }
  }, [availablePlans, selectedPlanId]);

  const result = useMemo(() => {
    const plan =
      availablePlans.find((item) => item.id === selectedPlanId) ??
      availablePlans.find((item) => item.id === defaultPlanId) ??
      availablePlans[0];

    const requests = toNumber(monthlyRequests);
    const reusableTokens = toNumber(reusableTokensPerRequest);
    const dynamicTokens = toNumber(dynamicInputTokensPerRequest);
    const outputTokens = toNumber(outputTokensPerRequest);
    const hitRate = clampPercent(cacheHitRate) / 100;
    const cacheObjects = toNumber(cacheObjectsPerMonth);
    const ttlHours = toNumber(cacheTtlHours);
    const budget = toNumber(monthlyBudget);

    const noCacheInputTokens =
      requests * (reusableTokens + dynamicTokens);
    const noCacheOutputTokens = requests * outputTokens;

    const noCacheInputCost =
      (noCacheInputTokens / 1_000_000) * plan.inputPrice;
    const noCacheOutputCost =
      (noCacheOutputTokens / 1_000_000) * plan.outputPrice;
    const noCacheTotal = noCacheInputCost + noCacheOutputCost;

    const cached = calculateCachedCost({
      plan,
      requests,
      reusableTokens,
      dynamicTokens,
      outputTokens,
      hitRate,
      cacheObjects,
      ttlHours,
    });

    let breakEvenHitRate: number | null = null;

    for (let step = 0; step <= 1000; step += 1) {
      const candidateHitRate = step / 1000;
      const candidate = calculateCachedCost({
        plan,
        requests,
        reusableTokens,
        dynamicTokens,
        outputTokens,
        hitRate: candidateHitRate,
        cacheObjects,
        ttlHours,
      });

      if (candidate.total <= noCacheTotal) {
        breakEvenHitRate = candidateHitRate * 100;
        break;
      }
    }

    const hitRequests = requests * hitRate;
    const missRequests = requests - hitRequests;
    const savings = noCacheTotal - cached.total;
    const savingsPercent =
      noCacheTotal > 0 ? (savings / noCacheTotal) * 100 : 0;

    return {
      plan,
      requests,
      reusableTokens,
      dynamicTokens,
      outputTokens,
      hitRatePercent: hitRate * 100,
      hitRequests,
      missRequests,
      cachedTokenReads: hitRequests * reusableTokens,
      noCacheInputCost,
      noCacheOutputCost,
      noCacheTotal,
      cached,
      monthlySavings: savings,
      yearlySavings: savings * 12,
      savingsPercent,
      breakEvenHitRate,
      costPerRequestWithoutCache:
        requests > 0 ? noCacheTotal / requests : 0,
      costPerRequestWithCache:
        requests > 0 ? cached.total / requests : 0,
      budget,
      budgetDifference: budget - cached.total,
    };
  }, [
    availablePlans,
    cacheHitRate,
    cacheObjectsPerMonth,
    cacheTtlHours,
    dynamicInputTokensPerRequest,
    monthlyBudget,
    monthlyRequests,
    outputTokensPerRequest,
    reusableTokensPerRequest,
    selectedPlanId,
  ]);

  const reset = () => {
    setSelectedPlanId(defaultPlanId);
    setMonthlyRequests("100000");
    setReusableTokensPerRequest("20000");
    setDynamicInputTokensPerRequest("500");
    setOutputTokensPerRequest("300");
    setCacheHitRate("85");
    setCacheObjectsPerMonth("30");
    setCacheTtlHours("1");
    setMonthlyBudget("1000");
    setIncludeCustom(false);
    setCustomProviderName("Custom Provider");
    setCustomModelName("Custom Model");
    setCustomStrategy("automatic");
    setCustomInputPrice("");
    setCustomCachedReadPrice("");
    setCustomCacheWritePrice("");
    setCustomOutputPrice("");
    setCustomStoragePrice("");
  };

  const usesStorage = result.plan.strategy === "explicit-storage";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Prompt Caching Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Separate reusable prompt tokens from the dynamic part of each
            request.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <BeeijaSelect
              label="Provider, model, and cache type"
              value={selectedPlanId}
              onChange={(event) => setSelectedPlanId(event.target.value)}
              options={planOptions}
            />
          </div>

          <BeeijaNumberField
            label="API requests per month"
            value={monthlyRequests}
            onChange={setMonthlyRequests}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Reusable prompt tokens per request"
            value={reusableTokensPerRequest}
            onChange={setReusableTokensPerRequest}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Dynamic input tokens per request"
            value={dynamicInputTokensPerRequest}
            onChange={setDynamicInputTokensPerRequest}
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

          <BeeijaNumberField
            label="Expected cache hit rate"
            value={cacheHitRate}
            onChange={setCacheHitRate}
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

          {usesStorage ? (
            <>
              <BeeijaNumberField
                label="Cache objects created per month"
                value={cacheObjectsPerMonth}
                onChange={setCacheObjectsPerMonth}
                min="0"
                step="1"
              />

              <BeeijaNumberField
                label="Average cache time-to-live"
                value={cacheTtlHours}
                onChange={setCacheTtlHours}
                min="0"
                step="0.1"
                suffix="hr"
              />
            </>
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
              Add custom prompt caching prices
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-gray-600">
              Model Mistral, another API, a cloud platform, or a private quote.
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

            <div className="md:col-span-2">
              <BeeijaSelect
                label="Custom cache pricing method"
                value={customStrategy}
                onChange={(event) =>
                  setCustomStrategy(event.target.value as CacheStrategy)
                }
                options={strategyOptions}
              />
            </div>

            <BeeijaNumberField
              label="Current normal input price per 1M tokens"
              value={customInputPrice}
              onChange={setCustomInputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            <BeeijaNumberField
              label="Current cache-read price per 1M tokens"
              value={customCachedReadPrice}
              onChange={setCustomCachedReadPrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            {customStrategy === "write-read" ? (
              <BeeijaNumberField
                label="Current cache-write price per 1M tokens"
                value={customCacheWritePrice}
                onChange={setCustomCacheWritePrice}
                min="0"
                step="0.001"
                prefix="$"
              />
            ) : null}

            <BeeijaNumberField
              label="Current output price per 1M tokens"
              value={customOutputPrice}
              onChange={setCustomOutputPrice}
              min="0"
              step="0.001"
              prefix="$"
            />

            {customStrategy === "explicit-storage" ? (
              <BeeijaNumberField
                label="Cache storage per 1M token-hours"
                value={customStoragePrice}
                onChange={setCustomStoragePrice}
                min="0"
                step="0.001"
                prefix="$"
              />
            ) : null}
          </div>
        ) : null}

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Cache workload used for this estimate
          </p>

          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>Cache hits: {formatInteger(result.hitRequests)}</p>
            <p>Cache misses or writes: {formatInteger(result.missRequests)}</p>
            <p>
              Cached tokens read: {formatInteger(result.cachedTokenReads)}
            </p>
            <p>
              Cache hit rate: {formatNumber(result.hitRatePercent)}%
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
        title="Prompt Caching Cost and Savings"
        description="Compare the same request volume with every reusable token billed normally and with the selected cache pricing."
        primaryLabel="Estimated monthly cost with caching"
        primaryValue={formatMoney(result.cached.total)}
        stats={
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultStat
              label="Without caching"
              value={formatMoney(result.noCacheTotal)}
            />
            <ResultStat
              label="Monthly saving"
              value={formatMoney(result.monthlySavings)}
            />
            <ResultStat
              label="Saving rate"
              value={`${formatNumber(result.savingsPercent)}%`}
            />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            <BreakdownRow
              label="Dynamic input tokens"
              detail="Always billed at the normal input rate"
              value={result.cached.dynamicInput}
            />
            <BreakdownRow
              label="Reusable tokens served from cache"
              detail={`${formatInteger(result.hitRequests)} cache-hit requests`}
              value={result.cached.reusableHits}
            />
            <BreakdownRow
              label={
                result.plan.strategy === "write-read"
                  ? "Reusable cache writes"
                  : "Reusable tokens on cache misses"
              }
              detail={`${formatInteger(result.missRequests)} miss or write requests`}
              value={result.cached.reusableMisses}
            />
            <BreakdownRow
              label="Output tokens"
              detail="Output pricing is unchanged by prompt caching"
              value={result.cached.output}
            />
            {result.plan.strategy === "explicit-storage" ? (
              <BreakdownRow
                label="Explicit cache storage"
                detail={`${formatNumber(
                  toNumber(cacheObjectsPerMonth),
                )} cache objects × ${formatNumber(
                  toNumber(cacheTtlHours),
                )} hours`}
                value={result.cached.storage}
              />
            ) : null}
          </div>
        }
        totals={
          <div className="text-sm leading-relaxed text-gray-600">
            <p>
              Selected pricing:{" "}
              <span className="font-medium text-gray-900">
                {result.plan.provider} — {result.plan.model}
              </span>
            </p>
            <p className="mt-2">
              Estimated yearly saving:{" "}
              <span className="font-medium text-gray-900">
                {formatMoney(result.yearlySavings)}
              </span>
            </p>
            <p className="mt-2">
              Cost per request without caching:{" "}
              <span className="font-medium text-gray-900">
                {formatMoney(result.costPerRequestWithoutCache)}
              </span>
            </p>
            <p className="mt-2">
              Cost per request with caching:{" "}
              <span className="font-medium text-gray-900">
                {formatMoney(result.costPerRequestWithCache)}
              </span>
            </p>
            <p className="mt-2">
              Approximate break-even hit rate:{" "}
              <span className="font-medium text-gray-900">
                {result.breakEvenHitRate === null
                  ? "Not reached"
                  : `${formatNumber(result.breakEvenHitRate)}%`}
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
                  ? `${formatMoney(result.budgetDifference)} remaining`
                  : `${formatMoney(
                      Math.abs(result.budgetDifference),
                    )} over budget`}
              </span>
            </p>
          </div>
        }
        provider="OpenAI, Anthropic Claude, and Google Gemini prompt caching"
        pricingCheckedDate="June 20, 2026"
        excludedCosts="batch discounts, data residency, priority or fast processing, tool calls, taxes, negotiated discounts, engineering work, and cache misses caused by provider routing or prompt changes"
      />
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

function BreakdownRow({
  label,
  detail,
  value,
}: {
  label: string;
  detail: string;
  value: number;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 text-sm text-gray-500">{detail}</p>
      </div>
      <p className="font-semibold text-gray-950">{formatMoney(value)}</p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import BeeijaAdvancedSection from "@/app/components/BeeijaAdvancedSection";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type ModelKey =
  | "gemini-3.8-flash"
  | "gemini-3.7-flash"
  | "gemini-3.6-flash"
  | "gemini-3.5-flash"
  | "gemini-3.5-flash-lite"
  | "gemini-3.1-pro-preview"
  | "gemini-3.1-flash-lite"
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite";

type PricingMode = "standard" | "batch" | "flex" | "priority";
type PricingPeriod = "current" | "from-2027";
type InputModality = "general" | "audio";
type PromptTier = "short" | "long";

type RateSet = {
  input: number;
  audioInput?: number;
  cachedInput: number;
  audioCachedInput?: number;
  output: number;
  cacheStorage: number;
  searchGrounding: number;
  mapsGrounding: number | null;
};

type TieredRate = {
  short: RateSet;
  long?: RateSet;
};

type ModelDefinition = {
  label: string;
  inputLimit: number;
  outputLimit: number;
  longPromptPricing: boolean;
  scheduled2027Pricing: boolean;
  audioRateDiffers: boolean;
  implicitCacheMinimum?: number;
  current: Record<PricingMode, TieredRate>;
  from2027?: Record<PricingMode, TieredRate>;
};

const INPUT_LIMIT = 1_048_576;
const OUTPUT_LIMIT = 65_536;
const LONG_PROMPT_THRESHOLD = 200_000;

function rate(
  input: number,
  cachedInput: number,
  output: number,
  cacheStorage: number,
  searchGrounding: number,
  mapsGrounding: number | null,
  audioInput?: number,
  audioCachedInput?: number,
): RateSet {
  return {
    input,
    cachedInput,
    output,
    cacheStorage,
    searchGrounding,
    mapsGrounding,
    audioInput,
    audioCachedInput,
  };
}

function singleTier(short: RateSet): TieredRate {
  return { short };
}

function twoTiers(short: RateSet, long: RateSet): TieredRate {
  return { short, long };
}

const GEMINI_3_SEARCH = 14;
const GEMINI_3_MAPS = 14;
const GEMINI_25_SEARCH = 35;
const GEMINI_25_MAPS = 25;

const INTRO_STANDARD = singleTier(
  rate(0.75, 0.075, 3.75, 0.5, GEMINI_3_SEARCH, GEMINI_3_MAPS),
);
const INTRO_DISCOUNT = singleTier(
  rate(0.375, 0.0375, 1.875, 0.5, GEMINI_3_SEARCH, GEMINI_3_MAPS),
);
const INTRO_PRIORITY = singleTier(
  rate(1.35, 0.135, 6.75, 0.5, GEMINI_3_SEARCH, GEMINI_3_MAPS),
);
const FUTURE_STANDARD = singleTier(
  rate(1.5, 0.15, 7.5, 1, GEMINI_3_SEARCH, GEMINI_3_MAPS),
);
const FUTURE_DISCOUNT = singleTier(
  rate(0.75, 0.075, 3.75, 1, GEMINI_3_SEARCH, GEMINI_3_MAPS),
);
const FUTURE_PRIORITY = singleTier(
  rate(2.7, 0.27, 13.5, 1, GEMINI_3_SEARCH, GEMINI_3_MAPS),
);

const INTRO_FLASH_MODES: Record<PricingMode, TieredRate> = {
  standard: INTRO_STANDARD,
  batch: INTRO_DISCOUNT,
  flex: INTRO_DISCOUNT,
  priority: INTRO_PRIORITY,
};

const FUTURE_FLASH_MODES: Record<PricingMode, TieredRate> = {
  standard: FUTURE_STANDARD,
  batch: FUTURE_DISCOUNT,
  flex: FUTURE_DISCOUNT,
  priority: FUTURE_PRIORITY,
};

const MODEL_PRICES: Record<ModelKey, ModelDefinition> = {
  "gemini-3.8-flash": {
    label: "Gemini 3.8 Flash",
    inputLimit: INPUT_LIMIT,
    outputLimit: OUTPUT_LIMIT,
    longPromptPricing: false,
    scheduled2027Pricing: true,
    audioRateDiffers: false,
    implicitCacheMinimum: 4_096,
    current: INTRO_FLASH_MODES,
    from2027: FUTURE_FLASH_MODES,
  },
  "gemini-3.7-flash": {
    label: "Gemini 3.7 Flash",
    inputLimit: INPUT_LIMIT,
    outputLimit: OUTPUT_LIMIT,
    longPromptPricing: false,
    scheduled2027Pricing: true,
    audioRateDiffers: false,
    implicitCacheMinimum: 4_096,
    current: INTRO_FLASH_MODES,
    from2027: FUTURE_FLASH_MODES,
  },
  "gemini-3.6-flash": {
    label: "Gemini 3.6 Flash",
    inputLimit: INPUT_LIMIT,
    outputLimit: OUTPUT_LIMIT,
    longPromptPricing: false,
    scheduled2027Pricing: true,
    audioRateDiffers: false,
    implicitCacheMinimum: 4_096,
    current: INTRO_FLASH_MODES,
    from2027: FUTURE_FLASH_MODES,
  },
  "gemini-3.5-flash": {
    label: "Gemini 3.5 Flash",
    inputLimit: INPUT_LIMIT,
    outputLimit: OUTPUT_LIMIT,
    longPromptPricing: false,
    scheduled2027Pricing: false,
    audioRateDiffers: false,
    implicitCacheMinimum: 4_096,
    current: {
      standard: singleTier(rate(1.5, 0.15, 9, 1, 14, 14)),
      batch: singleTier(rate(0.75, 0.075, 4.5, 1, 14, 14)),
      flex: singleTier(rate(0.75, 0.08, 4.5, 1, 14, 14)),
      priority: singleTier(rate(2.7, 0.27, 16.2, 1, 14, 14)),
    },
  },
  "gemini-3.5-flash-lite": {
    label: "Gemini 3.5 Flash-Lite",
    inputLimit: INPUT_LIMIT,
    outputLimit: OUTPUT_LIMIT,
    longPromptPricing: false,
    scheduled2027Pricing: false,
    audioRateDiffers: false,
    current: {
      standard: singleTier(rate(0.3, 0.03, 2.5, 1, 14, 14)),
      batch: singleTier(rate(0.15, 0.02, 1.25, 1, 14, 14)),
      flex: singleTier(rate(0.15, 0.02, 1.25, 1, 14, 14)),
      priority: singleTier(rate(0.54, 0.05, 4.5, 1, 14, 14)),
    },
  },
  "gemini-3.1-pro-preview": {
    label: "Gemini 3.1 Pro Preview",
    inputLimit: INPUT_LIMIT,
    outputLimit: OUTPUT_LIMIT,
    longPromptPricing: true,
    scheduled2027Pricing: false,
    audioRateDiffers: false,
    implicitCacheMinimum: 4_096,
    current: {
      standard: twoTiers(
        rate(2, 0.2, 12, 4.5, 14, 14),
        rate(4, 0.4, 18, 4.5, 14, 14),
      ),
      batch: twoTiers(
        rate(1, 0.2, 6, 4.5, 14, 14),
        rate(2, 0.4, 9, 4.5, 14, 14),
      ),
      flex: twoTiers(
        rate(1, 0.2, 6, 4.5, 14, 14),
        rate(2, 0.4, 9, 4.5, 14, 14),
      ),
      priority: twoTiers(
        rate(3.6, 0.36, 21.6, 8.1, 14, 14),
        rate(7.2, 0.72, 32.4, 8.1, 14, 14),
      ),
    },
  },
  "gemini-3.1-flash-lite": {
    label: "Gemini 3.1 Flash-Lite",
    inputLimit: INPUT_LIMIT,
    outputLimit: OUTPUT_LIMIT,
    longPromptPricing: false,
    scheduled2027Pricing: false,
    audioRateDiffers: true,
    current: {
      standard: singleTier(rate(0.25, 0.025, 1.5, 1, 14, 14, 0.5, 0.05)),
      batch: singleTier(
        rate(0.125, 0.0125, 0.75, 0.5, 14, 14, 0.25, 0.025),
      ),
      flex: singleTier(
        rate(0.125, 0.0125, 0.75, 0.5, 14, 14, 0.25, 0.025),
      ),
      priority: singleTier(rate(0.45, 0.045, 2.7, 1.8, 14, 14, 0.9, 0.09)),
    },
  },
  "gemini-2.5-pro": {
    label: "Gemini 2.5 Pro",
    inputLimit: INPUT_LIMIT,
    outputLimit: OUTPUT_LIMIT,
    longPromptPricing: true,
    scheduled2027Pricing: false,
    audioRateDiffers: false,
    implicitCacheMinimum: 2_048,
    current: {
      standard: twoTiers(
        rate(1.25, 0.125, 10, 4.5, GEMINI_25_SEARCH, GEMINI_25_MAPS),
        rate(2.5, 0.25, 15, 4.5, GEMINI_25_SEARCH, GEMINI_25_MAPS),
      ),
      batch: twoTiers(
        rate(0.625, 0.125, 5, 4.5, GEMINI_25_SEARCH, null),
        rate(1.25, 0.25, 7.5, 4.5, GEMINI_25_SEARCH, null),
      ),
      flex: twoTiers(
        rate(0.625, 0.125, 5, 4.5, GEMINI_25_SEARCH, null),
        rate(1.25, 0.25, 7.5, 4.5, GEMINI_25_SEARCH, null),
      ),
      priority: twoTiers(
        rate(2.25, 0.225, 18, 8.1, GEMINI_25_SEARCH, GEMINI_25_MAPS),
        rate(4.5, 0.45, 27, 8.1, GEMINI_25_SEARCH, GEMINI_25_MAPS),
      ),
    },
  },
  "gemini-2.5-flash": {
    label: "Gemini 2.5 Flash",
    inputLimit: INPUT_LIMIT,
    outputLimit: OUTPUT_LIMIT,
    longPromptPricing: false,
    scheduled2027Pricing: false,
    audioRateDiffers: true,
    implicitCacheMinimum: 2_048,
    current: {
      standard: singleTier(
        rate(0.3, 0.03, 2.5, 1, GEMINI_25_SEARCH, GEMINI_25_MAPS, 1, 0.1),
      ),
      batch: singleTier(
        rate(0.15, 0.03, 1.25, 1, GEMINI_25_SEARCH, null, 0.5, 0.1),
      ),
      flex: singleTier(
        rate(0.15, 0.03, 1.25, 1, GEMINI_25_SEARCH, null, 0.5, 0.1),
      ),
      priority: singleTier(
        rate(0.54, 0.054, 4.5, 1.8, GEMINI_25_SEARCH, GEMINI_25_MAPS, 1.8, 0.18),
      ),
    },
  },
  "gemini-2.5-flash-lite": {
    label: "Gemini 2.5 Flash-Lite",
    inputLimit: INPUT_LIMIT,
    outputLimit: OUTPUT_LIMIT,
    longPromptPricing: false,
    scheduled2027Pricing: false,
    audioRateDiffers: true,
    current: {
      standard: singleTier(
        rate(0.1, 0.01, 0.4, 1, GEMINI_25_SEARCH, GEMINI_25_MAPS, 0.3, 0.03),
      ),
      batch: singleTier(
        rate(0.05, 0.01, 0.2, 1, GEMINI_25_SEARCH, null, 0.15, 0.03),
      ),
      flex: singleTier(
        rate(0.05, 0.01, 0.2, 1, GEMINI_25_SEARCH, null, 0.15, 0.03),
      ),
      priority: singleTier(
        rate(0.18, 0.018, 0.72, 1.8, GEMINI_25_SEARCH, GEMINI_25_MAPS, 0.54, 0.054),
      ),
    },
  },
};

const modelOptions = Object.entries(MODEL_PRICES).map(([value, model]) => ({
  value,
  label: model.label,
}));

const pricingModeOptions = [
  { value: "standard", label: "Standard" },
  { value: "batch", label: "Batch" },
  { value: "flex", label: "Flex" },
  { value: "priority", label: "Priority" },
];

const pricingPeriodOptions = [
  { value: "current", label: "Through Dec 31, 2026" },
  { value: "from-2027", label: "From Jan 1, 2027" },
];

const modalityOptions = [
  { value: "general", label: "Text, image, or video" },
  { value: "audio", label: "Audio" },
];

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
  return (
    Number.isFinite(parsed) &&
    parsed >= 0 &&
    parsed <= Number.MAX_SAFE_INTEGER
  );
}

function toNumber(value: string) {
  return Number(value.trim());
}

function getRateForSelection(
  model: ModelDefinition,
  pricingMode: PricingMode,
  pricingPeriod: PricingPeriod,
  promptTier: PromptTier,
) {
  const modeRates =
    model.scheduled2027Pricing && pricingPeriod === "from-2027" && model.from2027
      ? model.from2027
      : model.current;
  const tieredRate = modeRates[pricingMode];

  if (promptTier === "long" && tieredRate.long) {
    return tieredRate.long;
  }

  return tieredRate.short;
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "—";

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
  if (!Number.isFinite(value)) return "—";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function hasUnsafeNumber(values: number[]) {
  return values.some(
    (value) => !Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER,
  );
}

export default function ToolClient() {
  const [model, setModel] = useState<ModelKey>("gemini-3.8-flash");
  const [pricingMode, setPricingMode] = useState<PricingMode>("standard");
  const [pricingPeriod, setPricingPeriod] =
    useState<PricingPeriod>("current");
  const [inputModality, setInputModality] =
    useState<InputModality>("general");

  const [requestsPerMonth, setRequestsPerMonth] = useState("60000");
  const [inputTokensPerRequest, setInputTokensPerRequest] = useState("6000");
  const [outputTokensPerRequest, setOutputTokensPerRequest] = useState("800");
  const [cachedInputPercent, setCachedInputPercent] = useState("25");

  const [cacheStorageMillionTokenHours, setCacheStorageMillionTokenHours] =
    useState("0");
  const [billableSearchUnits, setBillableSearchUnits] = useState("0");
  const [billableMapsUnits, setBillableMapsUnits] = useState("0");

  const [customPricing, setCustomPricing] = useState(false);
  const [customInputPrice, setCustomInputPrice] = useState("0.75");
  const [customCachedPrice, setCustomCachedPrice] = useState("0.075");
  const [customOutputPrice, setCustomOutputPrice] = useState("3.75");
  const [customCacheStoragePrice, setCustomCacheStoragePrice] = useState("0.5");
  const [customSearchPrice, setCustomSearchPrice] = useState("14");
  const [customMapsPrice, setCustomMapsPrice] = useState("14");

  const selectedModel = MODEL_PRICES[model];

  const inputIsValid = isValidNonNegativeInteger(inputTokensPerRequest);
  const inputTokens = inputIsValid ? toNumber(inputTokensPerRequest) : 0;
  const promptTier: PromptTier =
    selectedModel.longPromptPricing && inputTokens > LONG_PROMPT_THRESHOLD
      ? "long"
      : "short";

  const builtInRate = useMemo(
    () =>
      getRateForSelection(
        selectedModel,
        pricingMode,
        pricingPeriod,
        promptTier,
      ),
    [pricingMode, pricingPeriod, promptTier, selectedModel],
  );

  const builtInInputPrice =
    inputModality === "audio" && builtInRate.audioInput !== undefined
      ? builtInRate.audioInput
      : builtInRate.input;
  const builtInCachedPrice =
    inputModality === "audio" && builtInRate.audioCachedInput !== undefined
      ? builtInRate.audioCachedInput
      : builtInRate.cachedInput;

  const effectiveRate = useMemo(
    () =>
      customPricing
        ? {
            input: toNumber(customInputPrice),
            cachedInput: toNumber(customCachedPrice),
            output: toNumber(customOutputPrice),
            cacheStorage: toNumber(customCacheStoragePrice),
            searchGrounding: toNumber(customSearchPrice),
            mapsGrounding:
              builtInRate.mapsGrounding === null
                ? null
                : toNumber(customMapsPrice),
          }
        : {
            input: builtInInputPrice,
            cachedInput: builtInCachedPrice,
            output: builtInRate.output,
            cacheStorage: builtInRate.cacheStorage,
            searchGrounding: builtInRate.searchGrounding,
            mapsGrounding: builtInRate.mapsGrounding,
          },
    [
      builtInCachedPrice,
      builtInInputPrice,
      builtInRate.cacheStorage,
      builtInRate.mapsGrounding,
      builtInRate.output,
      builtInRate.searchGrounding,
      customCacheStoragePrice,
      customCachedPrice,
      customInputPrice,
      customMapsPrice,
      customOutputPrice,
      customPricing,
      customSearchPrice,
    ],
  );

  const result = useMemo(() => {
    const requiredIntegerFields: Array<[string, string]> = [
      ["Requests per month", requestsPerMonth],
      ["Average input tokens per request", inputTokensPerRequest],
      ["Average output tokens per request", outputTokensPerRequest],
      ["Billable Google Search units", billableSearchUnits],
    ];

    if (builtInRate.mapsGrounding !== null) {
      requiredIntegerFields.push([
        "Billable Google Maps units",
        billableMapsUnits,
      ]);
    }

    for (const [label, value] of requiredIntegerFields) {
      if (!isValidNonNegativeInteger(value)) {
        return { error: `${label} must be a whole number of zero or more.` } as const;
      }
    }

    if (
      !isValidNonNegativeDecimal(cachedInputPercent) ||
      toNumber(cachedInputPercent) > 100
    ) {
      return {
        error: "Cached input share must be a number from 0 to 100.",
      } as const;
    }

    if (!isValidNonNegativeDecimal(cacheStorageMillionTokenHours)) {
      return {
        error:
          "Explicit cache storage must be zero or a non-negative number of million token-hours.",
      } as const;
    }

    if (customPricing) {
      const customFields = [
        ["Input price", customInputPrice],
        ["Cached input price", customCachedPrice],
        ["Output price", customOutputPrice],
        ["Explicit cache storage price", customCacheStoragePrice],
        ["Google Search price", customSearchPrice],
      ] as const;

      for (const [label, value] of customFields) {
        if (!isValidNonNegativeDecimal(value)) {
          return { error: `${label} must be zero or a non-negative number.` } as const;
        }
      }

      if (
        builtInRate.mapsGrounding !== null &&
        !isValidNonNegativeDecimal(customMapsPrice)
      ) {
        return {
          error: "Google Maps price must be zero or a non-negative number.",
        } as const;
      }
    }

    const requests = toNumber(requestsPerMonth);
    const inputPerRequest = toNumber(inputTokensPerRequest);
    const outputPerRequest = toNumber(outputTokensPerRequest);
    const cachePercent = toNumber(cachedInputPercent);
    const explicitCacheMillionTokenHours = toNumber(
      cacheStorageMillionTokenHours,
    );
    const searchUnits = toNumber(billableSearchUnits);
    const mapsUnits =
      builtInRate.mapsGrounding === null ? 0 : toNumber(billableMapsUnits);

    if (inputPerRequest > selectedModel.inputLimit) {
      return {
        error: `${selectedModel.label} accepts up to ${formatNumber(
          selectedModel.inputLimit,
        )} input tokens per request.`,
      } as const;
    }

    if (outputPerRequest > selectedModel.outputLimit) {
      return {
        error: `${selectedModel.label} allows up to ${formatNumber(
          selectedModel.outputLimit,
        )} output tokens per request.`,
      } as const;
    }

    const totalInputTokens = requests * inputPerRequest;
    const cachedInputTokens = totalInputTokens * (cachePercent / 100);
    const uncachedInputTokens = totalInputTokens - cachedInputTokens;
    const totalOutputTokens = requests * outputPerRequest;

    if (
      hasUnsafeNumber([
        totalInputTokens,
        cachedInputTokens,
        uncachedInputTokens,
        totalOutputTokens,
      ])
    ) {
      return {
        error:
          "The workload is too large to calculate safely in the browser. Split it into smaller planning periods.",
      } as const;
    }

    const inputCost =
      (uncachedInputTokens / 1_000_000) * effectiveRate.input;
    const cachedInputCost =
      (cachedInputTokens / 1_000_000) * effectiveRate.cachedInput;
    const outputCost =
      (totalOutputTokens / 1_000_000) * effectiveRate.output;
    const cacheStorageCost =
      explicitCacheMillionTokenHours * effectiveRate.cacheStorage;
    const searchGroundingCost =
      (searchUnits / 1_000) * effectiveRate.searchGrounding;
    const mapsGroundingCost =
      effectiveRate.mapsGrounding === null
        ? 0
        : (mapsUnits / 1_000) * effectiveRate.mapsGrounding;

    const monthlyCost =
      inputCost +
      cachedInputCost +
      outputCost +
      cacheStorageCost +
      searchGroundingCost +
      mapsGroundingCost;
    const costPerRequest = requests > 0 ? monthlyCost / requests : 0;
    const dailyCost = monthlyCost / 30;
    const twelveMonthsAtSelectedRate = monthlyCost * 12;

    if (
      hasUnsafeNumber([
        inputCost,
        cachedInputCost,
        outputCost,
        cacheStorageCost,
        searchGroundingCost,
        mapsGroundingCost,
        monthlyCost,
        costPerRequest,
        dailyCost,
        twelveMonthsAtSelectedRate,
      ])
    ) {
      return {
        error:
          "The calculated amount is too large to display safely. Reduce the workload or prices and calculate in smaller parts.",
      } as const;
    }

    return {
      error: "",
      requests,
      inputPerRequest,
      outputPerRequest,
      totalInputTokens,
      cachedInputTokens,
      uncachedInputTokens,
      totalOutputTokens,
      explicitCacheMillionTokenHours,
      searchUnits,
      mapsUnits,
      inputCost,
      cachedInputCost,
      outputCost,
      cacheStorageCost,
      searchGroundingCost,
      mapsGroundingCost,
      monthlyCost,
      costPerRequest,
      dailyCost,
      twelveMonthsAtSelectedRate,
    } as const;
  }, [
    billableMapsUnits,
    billableSearchUnits,
    builtInRate.mapsGrounding,
    cacheStorageMillionTokenHours,
    cachedInputPercent,
    customCacheStoragePrice,
    customCachedPrice,
    customInputPrice,
    customMapsPrice,
    customOutputPrice,
    customPricing,
    customSearchPrice,
    effectiveRate,
    inputTokensPerRequest,
    outputTokensPerRequest,
    requestsPerMonth,
    selectedModel,
  ]);

  const warnings = useMemo(() => {
    const items: string[] = [];

    if (
      selectedModel.scheduled2027Pricing &&
      pricingPeriod === "current" &&
      !customPricing
    ) {
      items.push(
        "Google lists these Gemini 3.8/3.7/3.6 Flash rates through December 31, 2026 and higher built-in rates from January 1, 2027. The 12-month figure below simply repeats the selected rate; it is not a blended forward forecast.",
      );
    }

    if (
      selectedModel.longPromptPricing &&
      !customPricing &&
      inputIsValid &&
      inputTokens >= 180_000 &&
      inputTokens <= 220_000
    ) {
      items.push(
        "This workload sits close to Google's 200,000-token pricing boundary. If real requests fall on both sides of that line, one average request size can hide the true mix of lower- and higher-priced calls.",
      );
    }

    if (
      selectedModel.implicitCacheMinimum !== undefined &&
      inputIsValid &&
      toNumber(cachedInputPercent || "0") > 0 &&
      inputTokens < selectedModel.implicitCacheMinimum
    ) {
      items.push(
        `Google documents a ${formatNumber(
          selectedModel.implicitCacheMinimum,
        )}-token minimum for implicit caching on ${selectedModel.label}. A planned cache-hit share below that request size should not be treated as guaranteed savings.`,
      );
    }

    return items;
  }, [
    cachedInputPercent,
    customPricing,
    inputIsValid,
    inputTokens,
    pricingPeriod,
    selectedModel,
  ]);

  const mapsSupported = builtInRate.mapsGrounding !== null;
  const isGemini3 = model.startsWith("gemini-3");
  const searchUnitName = isGemini3 ? "search queries" : "grounded prompts";
  const mapsUnitName = isGemini3 ? "billing units" : "grounded prompts";

  const copyBuiltInRatesToCustom = () => {
    setCustomInputPrice(String(builtInInputPrice));
    setCustomCachedPrice(String(builtInCachedPrice));
    setCustomOutputPrice(String(builtInRate.output));
    setCustomCacheStoragePrice(String(builtInRate.cacheStorage));
    setCustomSearchPrice(String(builtInRate.searchGrounding));
    setCustomMapsPrice(
      String(builtInRate.mapsGrounding === null ? 0 : builtInRate.mapsGrounding),
    );
  };

  const updateModel = (value: string) => {
    const nextModel = value as ModelKey;
    const nextDefinition = MODEL_PRICES[nextModel];

    setModel(nextModel);
    if (!nextDefinition.scheduled2027Pricing) {
      setPricingPeriod("current");
    }
    if (!nextDefinition.audioRateDiffers) {
      setInputModality("general");
    }
  };

  const updateCustomPricing = (checked: boolean) => {
    if (checked) {
      copyBuiltInRatesToCustom();
    }
    setCustomPricing(checked);
  };

  const reset = () => {
    setModel("gemini-3.8-flash");
    setPricingMode("standard");
    setPricingPeriod("current");
    setInputModality("general");
    setRequestsPerMonth("60000");
    setInputTokensPerRequest("6000");
    setOutputTokensPerRequest("800");
    setCachedInputPercent("25");
    setCacheStorageMillionTokenHours("0");
    setBillableSearchUnits("0");
    setBillableMapsUnits("0");
    setCustomPricing(false);
    setCustomInputPrice("0.75");
    setCustomCachedPrice("0.075");
    setCustomOutputPrice("3.75");
    setCustomCacheStoragePrice("0.5");
    setCustomSearchPrice("14");
    setCustomMapsPrice("14");
  };

  const validResult = result.error === "" ? result : null;

  return (
    <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Build a Gemini workload estimate
          </h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            Start with one representative request and monthly volume. Gemini
            pricing can then change with consumption mode, cache hits, input
            modality, prompt size, grounding, and—for some current Flash
            models—the pricing period.
          </p>
        </div>

        <div className="mt-7 space-y-5">
          <div className="grid items-start gap-5 md:grid-cols-2">
            <BeeijaSelect
              label="Gemini model"
              value={model}
              onChange={(event: { target: { value: string } }) => updateModel(event.target.value)}
              options={modelOptions}
            />

            <BeeijaSelect
              label="Consumption mode"
              value={pricingMode}
              onChange={(event: { target: { value: string } }) =>
                setPricingMode(event.target.value as PricingMode)
              }
              options={pricingModeOptions}
            />

            {selectedModel.scheduled2027Pricing && !customPricing ? (
              <BeeijaSelect
                label="Google pricing period"
                value={pricingPeriod}
                onChange={(event: { target: { value: string } }) =>
                  setPricingPeriod(event.target.value as PricingPeriod)
                }
                options={pricingPeriodOptions}
              />
            ) : null}

            {selectedModel.audioRateDiffers && !customPricing ? (
              <BeeijaSelect
                label="Input price basis"
                value={inputModality}
                onChange={(event: { target: { value: string } }) =>
                  setInputModality(event.target.value as InputModality)
                }
                options={modalityOptions}
              />
            ) : null}
          </div>

          <div className="grid items-start gap-5 md:grid-cols-2">
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
              helper="Include billed thinking tokens, not only visible answer text."
              sanitizeDecimal
            />

            <BeeijaNumberField
              label="Cached input share"
              value={cachedInputPercent}
              onChange={setCachedInputPercent}
              min="0"
              max="100"
              step="0.1"
              suffix="%"
              helper="Use observed cache hits when available; implicit savings are not guaranteed."
              sanitizeDecimal
            />
          </div>
        </div>

        {selectedModel.longPromptPricing && !customPricing ? (
          <div className="mt-5 self-start rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700">
            <span className="font-semibold text-gray-950">Price tier:</span>{" "}
            {promptTier === "long"
              ? "above 200,000 input tokens per request"
              : "up to 200,000 input tokens per request"}
            . The calculator chooses this tier from the input-token value rather
            than asking you to select it separately.
          </div>
        ) : null}

        <BeeijaAdvancedSection
          className="mt-6"
          title="Explicit cache storage and grounded searches"
          description="Open this when you create explicit cache objects or expect billable Google Search or Maps grounding."
        >
          <div className="grid items-start gap-5 md:grid-cols-2">
            <BeeijaNumberField
              label="Explicit cache storage"
              value={cacheStorageMillionTokenHours}
              onChange={setCacheStorageMillionTokenHours}
              min="0"
              step="0.001"
              suffix="M token-hours"
              helper="Aggregate stored tokens × hours, divided by 1,000,000. Leave 0 for implicit-only caching."
              sanitizeDecimal
            />

            <BeeijaNumberField
              label={`Billable Google Search ${searchUnitName}`}
              value={billableSearchUnits}
              onChange={setBillableSearchUnits}
              min="0"
              step="1"
              helper="Enter only units that remain billable after the applicable free/shared allowance."
              sanitizeDecimal
            />

            {mapsSupported ? (
              <BeeijaNumberField
                label={`Billable Google Maps ${mapsUnitName}`}
                value={billableMapsUnits}
                onChange={setBillableMapsUnits}
                min="0"
                step="1"
                helper="Enter only units that remain billable after the applicable allowance."
                sanitizeDecimal
              />
            ) : (
              <div className="self-start rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700">
                Google Maps grounding is not priced as available for the selected
                Gemini 2.5 {pricingMode === "batch" ? "Batch" : "Flex"} mode,
                so it is excluded from this estimate.
              </div>
            )}
          </div>
        </BeeijaAdvancedSection>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <input
            type="checkbox"
            checked={customPricing}
            onChange={(event: { target: { checked: boolean } }) =>
              updateCustomPricing(event.target.checked)
            }
            className="mt-1 h-4 w-4 accent-[var(--green)]"
          />
          <span>
            <span className="block font-medium text-gray-900">
              Override the selected Google rates
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-gray-600">
              Keep the workload and model choices, but calculate with rates from
              your own agreement or a newer pricing page.
            </span>
          </span>
        </label>

        {customPricing ? (
          <div className="mt-5 grid items-start gap-5 md:grid-cols-2">
            <BeeijaNumberField
              label="Selected input price"
              value={customInputPrice}
              onChange={setCustomInputPrice}
              min="0"
              step="0.001"
              prefix="$"
              suffix="/ 1M tokens"
              sanitizeDecimal
            />
            <BeeijaNumberField
              label="Cached input price"
              value={customCachedPrice}
              onChange={setCustomCachedPrice}
              min="0"
              step="0.001"
              prefix="$"
              suffix="/ 1M tokens"
              sanitizeDecimal
            />
            <BeeijaNumberField
              label="Billed output price"
              value={customOutputPrice}
              onChange={setCustomOutputPrice}
              min="0"
              step="0.001"
              prefix="$"
              suffix="/ 1M tokens"
              sanitizeDecimal
            />
            <BeeijaNumberField
              label="Explicit cache storage price"
              value={customCacheStoragePrice}
              onChange={setCustomCacheStoragePrice}
              min="0"
              step="0.001"
              prefix="$"
              suffix="/ M token-hour"
              sanitizeDecimal
            />
            <BeeijaNumberField
              label="Google Search grounding price"
              value={customSearchPrice}
              onChange={setCustomSearchPrice}
              min="0"
              step="0.001"
              prefix="$"
              suffix="/ 1,000"
              sanitizeDecimal
            />
            {mapsSupported ? (
              <BeeijaNumberField
                label="Google Maps grounding price"
                value={customMapsPrice}
                onChange={setCustomMapsPrice}
                min="0"
                step="0.001"
                prefix="$"
                suffix="/ 1,000"
                sanitizeDecimal
              />
            ) : null}
          </div>
        ) : null}

        <div className="mt-7 self-start rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
          <p className="font-medium text-gray-950">Rates used in this estimate</p>
          <div className="mt-3 grid min-w-0 gap-x-4 gap-y-3 text-sm text-gray-700 sm:grid-cols-2">
            <RateItem label="Input" value={effectiveRate.input} suffix="/ 1M tokens" />
            <RateItem
              label="Cached input"
              value={effectiveRate.cachedInput}
              suffix="/ 1M tokens"
            />
            <RateItem
              label="Billed output"
              value={effectiveRate.output}
              suffix="/ 1M tokens"
            />
            <RateItem
              label="Explicit cache storage"
              value={effectiveRate.cacheStorage}
              suffix="/ M token-hour"
            />
            <RateItem
              label={`Search grounding (${searchUnitName})`}
              value={effectiveRate.searchGrounding}
              suffix="/ 1,000"
            />
            <RateItem
              label="Maps grounding"
              value={effectiveRate.mapsGrounding}
              suffix={mapsSupported ? "/ 1,000" : ""}
            />
          </div>
        </div>

        {result.error ? (
          <div className="mt-6 self-start border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-800">
            <span className="font-semibold text-red-900">Check the estimate:</span>{" "}
            {result.error}
          </div>
        ) : null}

        {warnings.length > 0 ? (
          <div className="mt-6 self-start border-l-4 border-[#F2C94C] bg-white px-5 py-4 text-sm leading-relaxed text-gray-700">
            <p className="font-semibold text-gray-950">Worth checking before budgeting</p>
            <ul className="mt-2 space-y-2">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <button type="button" onClick={reset} className="beeija-btn-outline mt-6">
          Reset values
        </button>
      </section>

      <BeeijaCalculatorResultPanel
        title="Gemini cost breakdown"
        description="Token charges, explicit cache storage, and entered grounding usage are kept separate so you can see what is driving the estimate."
        primaryLabel="Estimated monthly cost"
        primaryValue={
          validResult ? formatVisibleMoney(validResult.monthlyCost) : "Check entered values"
        }
        stats={
          validResult ? (
            <div className="grid min-w-0 gap-4 sm:grid-cols-3">
              <ResultStat
                label="Per request"
                value={formatVisibleMoney(validResult.costPerRequest)}
              />
              <ResultStat
                label="Per day"
                value={formatVisibleMoney(validResult.dailyCost)}
              />
              <ResultStat
                label="12 months at selected rate"
                value={formatVisibleMoney(validResult.twelveMonthsAtSelectedRate)}
              />
            </div>
          ) : null
        }
        breakdown={
          validResult ? (
            <div className="space-y-4">
              <CostRow
                label="Uncached input"
                detail={`${formatNumber(validResult.uncachedInputTokens)} tokens`}
                value={formatVisibleMoney(validResult.inputCost)}
              />
              <CostRow
                label="Cached input"
                detail={`${formatNumber(validResult.cachedInputTokens)} tokens`}
                value={formatVisibleMoney(validResult.cachedInputCost)}
              />
              <CostRow
                label="Billed output"
                detail={`${formatNumber(validResult.totalOutputTokens)} tokens, including thinking when billed`}
                value={formatVisibleMoney(validResult.outputCost)}
              />
              {validResult.explicitCacheMillionTokenHours > 0 ? (
                <CostRow
                  label="Explicit cache storage"
                  detail={`${formatNumber(
                    validResult.explicitCacheMillionTokenHours,
                  )} million token-hours`}
                  value={formatVisibleMoney(validResult.cacheStorageCost)}
                />
              ) : null}
              {validResult.searchUnits > 0 ? (
                <CostRow
                  label="Google Search grounding"
                  detail={`${formatNumber(validResult.searchUnits)} billable ${searchUnitName}`}
                  value={formatVisibleMoney(validResult.searchGroundingCost)}
                />
              ) : null}
              {mapsSupported && validResult.mapsUnits > 0 ? (
                <CostRow
                  label="Google Maps grounding"
                  detail={`${formatNumber(validResult.mapsUnits)} billable ${mapsUnitName}`}
                  value={formatVisibleMoney(validResult.mapsGroundingCost)}
                />
              ) : null}
            </div>
          ) : null
        }
        totals={
          validResult ? (
            <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
              <p>
                Requests: <span className="font-medium text-gray-900">{formatNumber(validResult.requests)}</span>
              </p>
              <p className="mt-2">
                Total input tokens: <span className="font-medium text-gray-900">{formatNumber(validResult.totalInputTokens)}</span>
              </p>
              <p className="mt-2">
                Total billed output tokens: <span className="font-medium text-gray-900">{formatNumber(validResult.totalOutputTokens)}</span>
              </p>
              {selectedModel.longPromptPricing ? (
                <p className="mt-2">
                  Applied Pro pricing tier: <span className="font-medium text-gray-900">{promptTier === "long" ? "above 200K input tokens" : "up to 200K input tokens"}</span>
                </p>
              ) : null}
            </div>
          ) : null
        }
        provider="Google Gemini Developer API"
        pricingCheckedDate="September 21, 2026"
        excludedCosts="free-tier allocation interactions, taxes, negotiated discounts, retries beyond the entered request volume, image-generation or Live/TTS pricing, and Google services not entered here"
        noticeText={
          <>
            Built-in Gemini Developer API rates were checked on September 21,
            2026. Entered values are calculated locally in your browser; this
            calculator does not send prompts, workload figures, or API keys to
            Google. Verify current pricing and account-specific billing before
            committing spend.
          </>
        }
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

function RateItem({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number | null;
  suffix: string;
}) {
  return (
    <p className="min-w-0">
      <span className="block text-gray-500">{label}</span>
      <span className="mt-1 block min-w-0 break-words font-medium text-gray-950 [overflow-wrap:anywhere]">
        {value === null ? "Not available" : `${formatVisibleMoney(value)} ${suffix}`}
      </span>
    </p>
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
        <p className="mt-1 text-sm leading-6 text-gray-500">{detail}</p>
      </div>
      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

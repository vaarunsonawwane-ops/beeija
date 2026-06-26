"use client";

import { useMemo, useState, type ReactNode } from "react";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type CostRow = {
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

function formatVisibleNumber(value: number) {
  return formatNumber(value).replace(/,/g, ",\u200B");
}

function formatVisibleInteger(value: number) {
  return formatInteger(value).replace(/,/g, ",\u200B");
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

export default function ToolClient() {
  const [monthlyContentItems, setMonthlyContentItems] = useState("2000");
  const [sourceWordsPerItem, setSourceWordsPerItem] = useState("350");
  const [targetLanguages, setTargetLanguages] = useState("5");
  const [successfulCompletionRate, setSuccessfulCompletionRate] =
    useState("97");
  const [retryOverheadPercent, setRetryOverheadPercent] =
    useState("5");
  const [languageExpansionPercent, setLanguageExpansionPercent] =
    useState("10");

  const [inputTokensPerSourceWord, setInputTokensPerSourceWord] =
    useState("1.5");
  const [outputTokensPerSourceWord, setOutputTokensPerSourceWord] =
    useState("1.4");
  const [translationInputPrice, setTranslationInputPrice] =
    useState("");
  const [translationOutputPrice, setTranslationOutputPrice] =
    useState("");

  const [lookupCallsPerLocalizedItem, setLookupCallsPerLocalizedItem] =
    useState("1");
  const [lookupPricePerThousand, setLookupPricePerThousand] =
    useState("");

  const [qaCoveragePercent, setQaCoveragePercent] = useState("25");
  const [qaInputTokensPerItem, setQaInputTokensPerItem] =
    useState("700");
  const [qaOutputTokensPerItem, setQaOutputTokensPerItem] =
    useState("120");
  const [qaInputPrice, setQaInputPrice] = useState("");
  const [qaOutputPrice, setQaOutputPrice] = useState("");

  const [humanReviewPercent, setHumanReviewPercent] = useState("30");
  const [reviewerWordsPerHour, setReviewerWordsPerHour] =
    useState("900");
  const [reviewerHourlyRate, setReviewerHourlyRate] = useState("");

  const [fixedMonthlyPlatformCost, setFixedMonthlyPlatformCost] =
    useState("");
  const [oneTimeImplementationCost, setOneTimeImplementationCost] =
    useState("");
  const [amortizationMonths, setAmortizationMonths] = useState("12");

  const [humanTranslationPricePerWord, setHumanTranslationPricePerWord] =
    useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const items = toNumber(monthlyContentItems);
    const wordsPerItem = toNumber(sourceWordsPerItem);
    const languages = Math.max(1, toNumber(targetLanguages));
    const successRate =
      clampPercent(successfulCompletionRate) / 100;
    const retryMultiplier =
      1 + clampPercent(retryOverheadPercent) / 100;
    const expansionMultiplier =
      1 + clampPercent(languageExpansionPercent) / 100;

    const sourceWords = items * wordsPerItem;
    const localizedItems = items * languages;
    const processedLocalizedItems =
      localizedItems * retryMultiplier;
    const successfulLocalizedItems =
      localizedItems * successRate;
    const failedLocalizedItems =
      localizedItems - successfulLocalizedItems;

    const translationInputTokens =
      sourceWords *
      languages *
      toNumber(inputTokensPerSourceWord) *
      retryMultiplier;

    const translationOutputTokens =
      sourceWords *
      languages *
      toNumber(outputTokensPerSourceWord) *
      expansionMultiplier *
      retryMultiplier;

    const translationInputCost =
      (translationInputTokens / 1_000_000) *
      toNumber(translationInputPrice);

    const translationOutputCost =
      (translationOutputTokens / 1_000_000) *
      toNumber(translationOutputPrice);

    const lookupCalls =
      localizedItems *
      toNumber(lookupCallsPerLocalizedItem) *
      retryMultiplier;

    const lookupCost =
      (lookupCalls / 1000) *
      toNumber(lookupPricePerThousand);

    const qaShare = clampPercent(qaCoveragePercent) / 100;
    const qaItems = processedLocalizedItems * qaShare;
    const qaInputTokens =
      qaItems * toNumber(qaInputTokensPerItem);
    const qaOutputTokens =
      qaItems * toNumber(qaOutputTokensPerItem);

    const qaInputCost =
      (qaInputTokens / 1_000_000) * toNumber(qaInputPrice);
    const qaOutputCost =
      (qaOutputTokens / 1_000_000) * toNumber(qaOutputPrice);

    const reviewShare =
      clampPercent(humanReviewPercent) / 100;
    const reviewedWords =
      sourceWords * languages * reviewShare;

    const reviewSpeed = Math.max(
      1,
      toNumber(reviewerWordsPerHour),
    );
    const reviewHours = reviewedWords / reviewSpeed;
    const reviewCost =
      reviewHours * toNumber(reviewerHourlyRate);

    const fixedMonthlyCost = toNumber(fixedMonthlyPlatformCost);
    const implementationCost = toNumber(oneTimeImplementationCost);
    const months = Math.max(1, toNumber(amortizationMonths));
    const amortizedImplementationCost = implementationCost / months;

    const monthlyOperatingCost =
      translationInputCost +
      translationOutputCost +
      lookupCost +
      qaInputCost +
      qaOutputCost +
      reviewCost +
      fixedMonthlyCost;

    const monthlyPlanningCost =
      monthlyOperatingCost + amortizedImplementationCost;

    const humanOnlyCost =
      sourceWords *
      languages *
      toNumber(humanTranslationPricePerWord);

    const operatingSavings =
      humanOnlyCost - monthlyOperatingCost;
    const planningSavings =
      humanOnlyCost - monthlyPlanningCost;

    const firstYearAutomationCost =
      monthlyOperatingCost * 12 + implementationCost;
    const firstYearHumanCost = humanOnlyCost * 12;
    const firstYearSavings =
      firstYearHumanCost - firstYearAutomationCost;

    const costPerSourceItem =
      items > 0 ? monthlyPlanningCost / items : 0;

    const costPerTargetLanguage =
      languages > 0 ? monthlyPlanningCost / languages : 0;

    const costPerThousandSourceWords =
      sourceWords > 0
        ? (monthlyPlanningCost / sourceWords) * 1000
        : 0;

    const costPerSuccessfulLocalizedItem =
      successfulLocalizedItems > 0
        ? monthlyPlanningCost / successfulLocalizedItems
        : 0;

    const humanCostPerSourceWord =
      sourceWords > 0 ? humanOnlyCost / sourceWords : 0;

    const variableAutomationCost =
      translationInputCost +
      translationOutputCost +
      lookupCost +
      qaInputCost +
      qaOutputCost +
      reviewCost;

    const variableAutomationCostPerSourceWord =
      sourceWords > 0
        ? variableAutomationCost / sourceWords
        : 0;

    const savingPerSourceWordBeforeFixed =
      humanCostPerSourceWord -
      variableAutomationCostPerSourceWord;

    const recurringFixedAndAmortized =
      fixedMonthlyCost + amortizedImplementationCost;

    const breakEvenMonthlySourceWords =
      savingPerSourceWordBeforeFixed > 0
        ? recurringFixedAndAmortized /
          savingPerSourceWordBeforeFixed
        : null;

    const implementationPaybackMonths =
      implementationCost > 0 && operatingSavings > 0
        ? implementationCost / operatingSavings
        : null;

    const rows: CostRow[] = [
      {
        label: "Translation-model input",
        detail: `${formatInteger(
          translationInputTokens,
        )} input tokens`,
        value: translationInputCost,
        entered: translationInputPrice.trim() !== "",
      },
      {
        label: "Translation-model output",
        detail: `${formatInteger(
          translationOutputTokens,
        )} output tokens including language expansion`,
        value: translationOutputCost,
        entered: translationOutputPrice.trim() !== "",
      },
      {
        label: "Terminology and translation-memory lookup",
        detail: `${formatInteger(lookupCalls)} lookup calls`,
        value: lookupCost,
        entered: lookupPricePerThousand.trim() !== "",
      },
      {
        label: "Automated QA input",
        detail: `${formatInteger(
          qaInputTokens,
        )} QA-model input tokens across ${formatInteger(qaItems)} items`,
        value: qaInputCost,
        entered: qaInputPrice.trim() !== "",
      },
      {
        label: "Automated QA output",
        detail: `${formatInteger(qaOutputTokens)} QA-model output tokens`,
        value: qaOutputCost,
        entered: qaOutputPrice.trim() !== "",
      },
      {
        label: "Human post-editing",
        detail: `${formatInteger(
          reviewedWords,
        )} reviewed words · ${formatNumber(reviewHours)} hours`,
        value: reviewCost,
        entered: reviewerHourlyRate.trim() !== "",
      },
      {
        label: "Fixed monthly localization platform",
        detail: "Workflow, translation memory, storage, monitoring, or platform",
        value: fixedMonthlyCost,
        entered: fixedMonthlyPlatformCost.trim() !== "",
      },
      {
        label: "Amortised implementation",
        detail: `${formatMoney(
          implementationCost,
        )} spread across ${formatInteger(months)} months`,
        value: amortizedImplementationCost,
        entered: oneTimeImplementationCost.trim() !== "",
      },
    ];

    const enteredPriceCount = [
      translationInputPrice,
      translationOutputPrice,
      lookupPricePerThousand,
      qaInputPrice,
      qaOutputPrice,
      reviewerHourlyRate,
      fixedMonthlyPlatformCost,
      oneTimeImplementationCost,
      humanTranslationPricePerWord,
    ].filter((value) => value.trim() !== "").length;

    const hasAnyPrice = enteredPriceCount > 0;
    const hasHumanBaseline =
      humanTranslationPricePerWord.trim() !== "";
    const hasBudget = monthlyBudget.trim() !== "";
    const budget = toNumber(monthlyBudget);

    return {
      items,
      languages,
      sourceWords,
      localizedItems,
      processedLocalizedItems,
      successfulLocalizedItems,
      failedLocalizedItems,
      translationInputTokens,
      translationOutputTokens,
      lookupCalls,
      qaItems,
      qaInputTokens,
      qaOutputTokens,
      reviewedWords,
      reviewHours,
      monthlyOperatingCost,
      monthlyPlanningCost,
      humanOnlyCost,
      operatingSavings,
      planningSavings,
      firstYearAutomationCost,
      firstYearHumanCost,
      firstYearSavings,
      costPerSourceItem,
      costPerTargetLanguage,
      costPerThousandSourceWords,
      costPerSuccessfulLocalizedItem,
      breakEvenMonthlySourceWords,
      implementationPaybackMonths,
      rows,
      enteredPriceCount,
      hasAnyPrice,
      hasHumanBaseline,
      hasBudget,
      budget,
      budgetDifference: budget - monthlyPlanningCost,
    };
  }, [
    amortizationMonths,
    fixedMonthlyPlatformCost,
    humanReviewPercent,
    humanTranslationPricePerWord,
    inputTokensPerSourceWord,
    languageExpansionPercent,
    lookupCallsPerLocalizedItem,
    lookupPricePerThousand,
    monthlyBudget,
    monthlyContentItems,
    oneTimeImplementationCost,
    outputTokensPerSourceWord,
    qaCoveragePercent,
    qaInputPrice,
    qaInputTokensPerItem,
    qaOutputPrice,
    qaOutputTokensPerItem,
    retryOverheadPercent,
    reviewerHourlyRate,
    reviewerWordsPerHour,
    sourceWordsPerItem,
    successfulCompletionRate,
    targetLanguages,
    translationInputPrice,
    translationOutputPrice,
  ]);

  const reset = () => {
    setMonthlyContentItems("2000");
    setSourceWordsPerItem("350");
    setTargetLanguages("5");
    setSuccessfulCompletionRate("97");
    setRetryOverheadPercent("5");
    setLanguageExpansionPercent("10");
    setInputTokensPerSourceWord("1.5");
    setOutputTokensPerSourceWord("1.4");
    setTranslationInputPrice("");
    setTranslationOutputPrice("");
    setLookupCallsPerLocalizedItem("1");
    setLookupPricePerThousand("");
    setQaCoveragePercent("25");
    setQaInputTokensPerItem("700");
    setQaOutputTokensPerItem("120");
    setQaInputPrice("");
    setQaOutputPrice("");
    setHumanReviewPercent("30");
    setReviewerWordsPerHour("900");
    setReviewerHourlyRate("");
    setFixedMonthlyPlatformCost("");
    setOneTimeImplementationCost("");
    setAmortizationMonths("12");
    setHumanTranslationPricePerWord("");
    setMonthlyBudget("");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Localization Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Model translation, terminology lookup, QA, post-editing, and setup.
          </p>
        </div>

        <FieldSection title="Monthly Content and Languages">
          <BeeijaNumberField
            label="Source content items per month"
            value={monthlyContentItems}
            onChange={setMonthlyContentItems}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average source words per item"
            value={sourceWordsPerItem}
            onChange={setSourceWordsPerItem}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Target languages"
            value={targetLanguages}
            onChange={setTargetLanguages}
            min="1"
            step="1"
          />

          <BeeijaNumberField
            label="Successful localization completion rate"
            value={successfulCompletionRate}
            onChange={setSuccessfulCompletionRate}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Retry and repeated-processing overhead"
            value={retryOverheadPercent}
            onChange={setRetryOverheadPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Average translated-text expansion"
            value={languageExpansionPercent}
            onChange={setLanguageExpansionPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Translation Model Tokens and Prices">
          <BeeijaNumberField
            label="Input tokens per source word"
            value={inputTokensPerSourceWord}
            onChange={setInputTokensPerSourceWord}
            min="0"
            step="0.01"
          />

          <BeeijaNumberField
            label="Output tokens per source word"
            value={outputTokensPerSourceWord}
            onChange={setOutputTokensPerSourceWord}
            min="0"
            step="0.01"
          />

          <BeeijaNumberField
            label="Translation input price per 1M tokens"
            value={translationInputPrice}
            onChange={setTranslationInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Translation output price per 1M tokens"
            value={translationOutputPrice}
            onChange={setTranslationOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Terminology and Translation Memory">
          <BeeijaNumberField
            label="Lookup calls per localized item"
            value={lookupCallsPerLocalizedItem}
            onChange={setLookupCallsPerLocalizedItem}
            min="0"
            step="0.1"
          />

          <BeeijaNumberField
            label="Lookup price per 1,000 calls"
            value={lookupPricePerThousand}
            onChange={setLookupPricePerThousand}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Automated Quality Review">
          <BeeijaNumberField
            label="Localized items checked by QA model"
            value={qaCoveragePercent}
            onChange={setQaCoveragePercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="QA input tokens per checked item"
            value={qaInputTokensPerItem}
            onChange={setQaInputTokensPerItem}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="QA output tokens per checked item"
            value={qaOutputTokensPerItem}
            onChange={setQaOutputTokensPerItem}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="QA input price per 1M tokens"
            value={qaInputPrice}
            onChange={setQaInputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="QA output price per 1M tokens"
            value={qaOutputPrice}
            onChange={setQaOutputPrice}
            min="0"
            step="0.001"
            prefix="$"
          />
        </FieldSection>

        <FieldSection title="Human Post-Editing, Platform, and Setup">
          <BeeijaNumberField
            label="Translated words reviewed by humans"
            value={humanReviewPercent}
            onChange={setHumanReviewPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Reviewer productivity"
            value={reviewerWordsPerHour}
            onChange={setReviewerWordsPerHour}
            min="1"
            step="1"
            suffix="words/hr"
          />

          <BeeijaNumberField
            label="Reviewer hourly rate"
            value={reviewerHourlyRate}
            onChange={setReviewerHourlyRate}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="Fixed localization platform cost per month"
            value={fixedMonthlyPlatformCost}
            onChange={setFixedMonthlyPlatformCost}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="One-time implementation cost"
            value={oneTimeImplementationCost}
            onChange={setOneTimeImplementationCost}
            min="0"
            step="1"
            prefix="$"
          />

          <BeeijaNumberField
            label="Implementation amortisation period"
            value={amortizationMonths}
            onChange={setAmortizationMonths}
            min="1"
            step="1"
            suffix="mo"
          />
        </FieldSection>

        <FieldSection title="Human Baseline and Budget">
          <BeeijaNumberField
            label="Human translation price per source word"
            value={humanTranslationPricePerWord}
            onChange={setHumanTranslationPricePerWord}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Target monthly localization budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated monthly localization workload
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>Source words: {formatVisibleInteger(result.sourceWords)}</p>
            <p>
              Localized items: {formatVisibleInteger(result.localizedItems)}
            </p>
            <p>
              Processed items after retries:{" "}
              {formatVisibleInteger(result.processedLocalizedItems)}
            </p>
            <p>
              Successful localized items:{" "}
              {formatVisibleInteger(result.successfulLocalizedItems)}
            </p>
            <p>
              Translation input tokens:{" "}
              {formatVisibleInteger(result.translationInputTokens)}
            </p>
            <p>
              Translation output tokens:{" "}
              {formatVisibleInteger(result.translationOutputTokens)}
            </p>
            <p>QA-checked items: {formatVisibleInteger(result.qaItems)}</p>
            <p>
              Human-reviewed words: {formatVisibleInteger(result.reviewedWords)}
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
        title="Localization Cost and Savings"
        description="The result separates translation, lookup, QA, post-editing, platform, and amortised setup costs."
        primaryLabel="Monthly localization planning cost"
        primaryValue={
          result.hasAnyPrice
            ? formatVisibleMoney(result.monthlyPlanningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per source item"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.costPerSourceItem)
                  : "—"
              }
            />

            <ResultStat
              label="Per 1,000 source words"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.costPerThousandSourceWords)
                  : "—"
              }
            />

            <ResultStat
              label="Per successful localized item"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(
                      result.costPerSuccessfulLocalizedItem,
                    )
                  : "—"
              }
            />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            {result.rows.map((row) => (
              <BreakdownRow
                key={row.label}
                label={row.label}
                detail={row.detail}
                value={row.value}
                entered={row.entered}
              />
            ))}
          </div>
        }
        totals={
          <div className="min-w-0 break-words text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere]">
            <p>
              Monthly operating cost:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyPrice
                  ? formatVisibleMoney(result.monthlyOperatingCost)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Average cost per target language:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyPrice
                  ? formatVisibleMoney(result.costPerTargetLanguage)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              Human-only monthly baseline:{" "}
              <span className="font-medium text-gray-900">
                {result.hasHumanBaseline
                  ? formatVisibleMoney(result.humanOnlyCost)
                  : "Enter the human translation rate"}
              </span>
            </p>

            <p className="mt-2">
              Monthly operating comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasHumanBaseline || result.operatingSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasHumanBaseline
                  ? "Enter the human translation rate"
                  : result.operatingSavings >= 0
                    ? `${formatVisibleMoney(result.operatingSavings)} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.operatingSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              Monthly planning comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasHumanBaseline || result.planningSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasHumanBaseline
                  ? "Enter the human translation rate"
                  : result.planningSavings >= 0
                    ? `${formatVisibleMoney(result.planningSavings)} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.planningSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              First-year comparison:{" "}
              <span
                className={`font-semibold ${
                  !result.hasHumanBaseline || result.firstYearSavings >= 0
                    ? "text-[var(--green)]"
                    : "text-red-700"
                }`}
              >
                {!result.hasHumanBaseline
                  ? "Enter the human translation rate"
                  : result.firstYearSavings >= 0
                    ? `${formatVisibleMoney(result.firstYearSavings)} estimated saving`
                    : `${formatVisibleMoney(
                        Math.abs(result.firstYearSavings),
                      )} additional cost`}
              </span>
            </p>

            <p className="mt-2">
              Approximate break-even volume:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasHumanBaseline
                  ? "Enter the human translation rate"
                  : result.breakEvenMonthlySourceWords === null
                    ? "No positive saving per source word"
                    : `${formatVisibleInteger(
                        result.breakEvenMonthlySourceWords,
                      )} source words per month`}
              </span>
            </p>

            <p className="mt-2">
              Implementation payback:{" "}
              <span className="font-medium text-gray-900">
                {!result.hasHumanBaseline
                  ? "Enter the human translation rate"
                  : toNumber(oneTimeImplementationCost) === 0
                    ? "No implementation cost entered"
                    : result.implementationPaybackMonths === null
                      ? "No positive operating payback"
                      : `${formatVisibleNumber(
                          result.implementationPaybackMonths,
                        )} months`}
              </span>
            </p>

            <p className="mt-2">
              Price inputs entered:{" "}
              <span className="font-medium text-gray-900">
                {result.enteredPriceCount} of 9
              </span>
            </p>

            <p className="mt-2">
              Budget status:{" "}
              <span
                className={`font-semibold ${
                  result.hasBudget &&
                  result.hasAnyPrice &&
                  result.budgetDifference < 0
                    ? "text-red-700"
                    : "text-[var(--green)]"
                }`}
              >
                {!result.hasBudget
                  ? "Add a budget to compare"
                  : !result.hasAnyPrice
                    ? "Enter current prices"
                    : result.budgetDifference >= 0
                      ? `${formatVisibleMoney(result.budgetDifference)} remaining`
                      : `${formatVisibleMoney(
                          Math.abs(result.budgetDifference),
                        )} over budget`}
              </span>
            </p>
          </div>
        }
        noticeText="This calculator stores no translation-model, QA-model, retrieval, labour, or platform price. Enter the current effective rates for the exact services and language workflow being considered. Blank optional price fields are treated as zero. Language pairs, output expansion, terminology density, formatting, legal review, taxes, and transcreation can change the final cost."
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
      <div className="mt-5 grid min-w-0 gap-5 md:grid-cols-2 md:items-end [&>*]:min-w-0">{children}</div>
    </div>
  );
}

function ResultStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="break-words text-xs font-medium uppercase tracking-wide text-gray-500 [overflow-wrap:anywhere]">
        {label}
      </p>
      <p className="mt-1 break-words font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

function BreakdownRow({
  label,
  detail,
  value,
  entered,
}: {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="min-w-0 flex-1">
        <p className="break-words font-medium text-gray-900 [overflow-wrap:anywhere]">
          {label}
        </p>
        <p className="mt-1 break-words text-sm text-gray-500 [overflow-wrap:anywhere]">
          {detail}
        </p>
      </div>
      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {entered ? formatVisibleMoney(value) : "—"}
      </p>
    </div>
  );
}

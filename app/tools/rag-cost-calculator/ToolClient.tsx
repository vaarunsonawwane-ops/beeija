"use client";

import { useMemo, useState, type ReactNode } from "react";
import BeeijaSelect from "@/app/components/BeeijaSelect";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

type CostRow = {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
};

const precisionOptions = [
  { value: "4", label: "Float32 · 4 bytes per dimension" },
  { value: "2", label: "Float16 · 2 bytes per dimension" },
  { value: "1", label: "Int8 · 1 byte per dimension" },
  { value: "0.125", label: "Binary · 1 bit per dimension" },
];

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function clampPercent(value: string, max = 100) {
  return Math.min(max, Math.max(0, toNumber(value)));
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
  const [documents, setDocuments] = useState("10000");
  const [averageTokensPerDocument, setAverageTokensPerDocument] =
    useState("1200");
  const [chunkSize, setChunkSize] = useState("500");
  const [chunkOverlapPercent, setChunkOverlapPercent] = useState("15");
  const [vectorDimensions, setVectorDimensions] = useState("1536");
  const [bytesPerDimension, setBytesPerDimension] = useState("4");
  const [metadataBytesPerVector, setMetadataBytesPerVector] =
    useState("500");
  const [indexOverheadPercent, setIndexOverheadPercent] = useState("30");
  const [monthlyRefreshPercent, setMonthlyRefreshPercent] = useState("10");

  const [monthlyQueries, setMonthlyQueries] = useState("50000");
  const [topK, setTopK] = useState("5");
  const [retrievedTokensPerChunk, setRetrievedTokensPerChunk] =
    useState("350");
  const [baseInputTokensPerQuery, setBaseInputTokensPerQuery] =
    useState("400");
  const [outputTokensPerQuery, setOutputTokensPerQuery] = useState("500");
  const [vectorReadUnitsPerQuery, setVectorReadUnitsPerQuery] =
    useState("1");

  const [embeddingPricePerMillion, setEmbeddingPricePerMillion] =
    useState("");
  const [storagePricePerGbMonth, setStoragePricePerGbMonth] =
    useState("");
  const [readPricePerMillionUnits, setReadPricePerMillionUnits] =
    useState("");
  const [writePricePerMillionVectors, setWritePricePerMillionVectors] =
    useState("");
  const [rerankerPricePerThousandQueries, setRerankerPricePerThousandQueries] =
    useState("");
  const [llmInputPricePerMillion, setLlmInputPricePerMillion] =
    useState("");
  const [llmOutputPricePerMillion, setLlmOutputPricePerMillion] =
    useState("");
  const [fixedMonthlyCosts, setFixedMonthlyCosts] = useState("");
  const [otherOneTimeSetupCost, setOtherOneTimeSetupCost] = useState("");
  const [setupAmortizationMonths, setSetupAmortizationMonths] =
    useState("12");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const result = useMemo(() => {
    const documentCount = toNumber(documents);
    const documentTokens = toNumber(averageTokensPerDocument);
    const chunkTokens = Math.max(1, toNumber(chunkSize));
    const overlapPercent = clampPercent(chunkOverlapPercent, 95);
    const overlapTokens = chunkTokens * (overlapPercent / 100);
    const chunkStep = Math.max(1, chunkTokens - overlapTokens);

    const chunksPerDocument =
      documentTokens <= chunkTokens
        ? 1
        : Math.ceil((documentTokens - chunkTokens) / chunkStep) + 1;

    const embeddedTokensPerDocument =
      documentTokens + overlapTokens * Math.max(0, chunksPerDocument - 1);

    const totalVectors = documentCount * chunksPerDocument;
    const initialEmbeddingTokens =
      documentCount * embeddedTokensPerDocument;

    const dimensions = toNumber(vectorDimensions);
    const bytesPerValue = toNumber(bytesPerDimension);
    const metadataBytes = toNumber(metadataBytesPerVector);
    const indexOverhead = clampPercent(indexOverheadPercent) / 100;

    const rawVectorBytes =
      totalVectors * (dimensions * bytesPerValue + metadataBytes);
    const estimatedStorageBytes = rawVectorBytes * (1 + indexOverhead);
    const estimatedStorageGb = estimatedStorageBytes / 1_000_000_000;

    const refreshShare = clampPercent(monthlyRefreshPercent) / 100;
    const monthlyRefreshedVectors = totalVectors * refreshShare;
    const monthlyRefreshEmbeddingTokens =
      initialEmbeddingTokens * refreshShare;

    const queries = toNumber(monthlyQueries);
    const retrievalDepth = Math.max(0, toNumber(topK));
    const retrievedTokens =
      queries * retrievalDepth * toNumber(retrievedTokensPerChunk);
    const baseInputTokens =
      queries * toNumber(baseInputTokensPerQuery);
    const totalLlmInputTokens = baseInputTokens + retrievedTokens;
    const totalLlmOutputTokens =
      queries * toNumber(outputTokensPerQuery);
    const totalReadUnits =
      queries * toNumber(vectorReadUnitsPerQuery);

    const initialEmbeddingCost =
      (initialEmbeddingTokens / 1_000_000) *
      toNumber(embeddingPricePerMillion);
    const initialVectorWriteCost =
      (totalVectors / 1_000_000) *
      toNumber(writePricePerMillionVectors);
    const otherSetupCost = toNumber(otherOneTimeSetupCost);
    const initialSetupCost =
      initialEmbeddingCost + initialVectorWriteCost + otherSetupCost;

    const monthlyRefreshEmbeddingCost =
      (monthlyRefreshEmbeddingTokens / 1_000_000) *
      toNumber(embeddingPricePerMillion);
    const monthlyVectorWriteCost =
      (monthlyRefreshedVectors / 1_000_000) *
      toNumber(writePricePerMillionVectors);
    const monthlyStorageCost =
      estimatedStorageGb * toNumber(storagePricePerGbMonth);
    const monthlyReadCost =
      (totalReadUnits / 1_000_000) *
      toNumber(readPricePerMillionUnits);
    const monthlyRerankerCost =
      (queries / 1_000) * toNumber(rerankerPricePerThousandQueries);
    const monthlyLlmInputCost =
      (totalLlmInputTokens / 1_000_000) *
      toNumber(llmInputPricePerMillion);
    const monthlyLlmOutputCost =
      (totalLlmOutputTokens / 1_000_000) *
      toNumber(llmOutputPricePerMillion);
    const monthlyFixedCost = toNumber(fixedMonthlyCosts);

    const amortizationMonths = Math.max(
      1,
      toNumber(setupAmortizationMonths),
    );
    const amortizedSetupCost = initialSetupCost / amortizationMonths;

    const rows: CostRow[] = [
      {
        label: "Monthly refresh embeddings",
        detail: `${formatInteger(
          monthlyRefreshEmbeddingTokens,
        )} embedding tokens`,
        value: monthlyRefreshEmbeddingCost,
        entered: embeddingPricePerMillion.trim() !== "",
      },
      {
        label: "Monthly vector writes",
        detail: `${formatInteger(monthlyRefreshedVectors)} refreshed vectors`,
        value: monthlyVectorWriteCost,
        entered: writePricePerMillionVectors.trim() !== "",
      },
      {
        label: "Vector storage",
        detail: `${formatNumber(estimatedStorageGb)} GB estimated storage`,
        value: monthlyStorageCost,
        entered: storagePricePerGbMonth.trim() !== "",
      },
      {
        label: "Vector reads",
        detail: `${formatInteger(totalReadUnits)} billable read units`,
        value: monthlyReadCost,
        entered: readPricePerMillionUnits.trim() !== "",
      },
      {
        label: "Reranking",
        detail: `${formatInteger(queries)} monthly searches`,
        value: monthlyRerankerCost,
        entered: rerankerPricePerThousandQueries.trim() !== "",
      },
      {
        label: "LLM input",
        detail: `${formatInteger(totalLlmInputTokens)} input tokens`,
        value: monthlyLlmInputCost,
        entered: llmInputPricePerMillion.trim() !== "",
      },
      {
        label: "LLM output",
        detail: `${formatInteger(totalLlmOutputTokens)} output tokens`,
        value: monthlyLlmOutputCost,
        entered: llmOutputPricePerMillion.trim() !== "",
      },
      {
        label: "Fixed monthly costs",
        detail: "Subscriptions, hosting, monitoring, or platform fees",
        value: monthlyFixedCost,
        entered: fixedMonthlyCosts.trim() !== "",
      },
      {
        label: "Amortized setup",
        detail: `${formatMoney(
          initialSetupCost,
        )} spread across ${formatInteger(amortizationMonths)} months`,
        value: amortizedSetupCost,
        entered:
          embeddingPricePerMillion.trim() !== "" ||
          writePricePerMillionVectors.trim() !== "" ||
          otherOneTimeSetupCost.trim() !== "",
      },
    ];

    const monthlyOperatingCost =
      monthlyRefreshEmbeddingCost +
      monthlyVectorWriteCost +
      monthlyStorageCost +
      monthlyReadCost +
      monthlyRerankerCost +
      monthlyLlmInputCost +
      monthlyLlmOutputCost +
      monthlyFixedCost;

    const monthlyPlanningCost =
      monthlyOperatingCost + amortizedSetupCost;
    const firstYearTotal = initialSetupCost + monthlyOperatingCost * 12;
    const budget = toNumber(monthlyBudget);

    const enteredPriceCount = [
      embeddingPricePerMillion,
      storagePricePerGbMonth,
      readPricePerMillionUnits,
      writePricePerMillionVectors,
      rerankerPricePerThousandQueries,
      llmInputPricePerMillion,
      llmOutputPricePerMillion,
      fixedMonthlyCosts,
      otherOneTimeSetupCost,
    ].filter((value) => value.trim() !== "").length;

    return {
      documentCount,
      chunksPerDocument,
      totalVectors,
      initialEmbeddingTokens,
      estimatedStorageGb,
      monthlyRefreshedVectors,
      queries,
      totalLlmInputTokens,
      totalLlmOutputTokens,
      rows,
      initialEmbeddingCost,
      initialVectorWriteCost,
      initialSetupCost,
      monthlyOperatingCost,
      amortizedSetupCost,
      monthlyPlanningCost,
      firstYearTotal,
      costPerQuery:
        queries > 0 ? monthlyOperatingCost / queries : 0,
      costPerThousandQueries:
        queries > 0 ? (monthlyOperatingCost / queries) * 1_000 : 0,
      budget,
      hasBudget: monthlyBudget.trim() !== "",
      budgetDifference: budget - monthlyPlanningCost,
      hasAnyPrice: enteredPriceCount > 0,
      enteredPriceCount,
    };
  }, [
    averageTokensPerDocument,
    baseInputTokensPerQuery,
    bytesPerDimension,
    chunkOverlapPercent,
    chunkSize,
    documents,
    embeddingPricePerMillion,
    fixedMonthlyCosts,
    indexOverheadPercent,
    llmInputPricePerMillion,
    llmOutputPricePerMillion,
    metadataBytesPerVector,
    monthlyBudget,
    monthlyQueries,
    monthlyRefreshPercent,
    otherOneTimeSetupCost,
    outputTokensPerQuery,
    readPricePerMillionUnits,
    rerankerPricePerThousandQueries,
    retrievedTokensPerChunk,
    setupAmortizationMonths,
    storagePricePerGbMonth,
    topK,
    vectorDimensions,
    vectorReadUnitsPerQuery,
    writePricePerMillionVectors,
  ]);

  const reset = () => {
    setDocuments("10000");
    setAverageTokensPerDocument("1200");
    setChunkSize("500");
    setChunkOverlapPercent("15");
    setVectorDimensions("1536");
    setBytesPerDimension("4");
    setMetadataBytesPerVector("500");
    setIndexOverheadPercent("30");
    setMonthlyRefreshPercent("10");
    setMonthlyQueries("50000");
    setTopK("5");
    setRetrievedTokensPerChunk("350");
    setBaseInputTokensPerQuery("400");
    setOutputTokensPerQuery("500");
    setVectorReadUnitsPerQuery("1");
    setEmbeddingPricePerMillion("");
    setStoragePricePerGbMonth("");
    setReadPricePerMillionUnits("");
    setWritePricePerMillionVectors("");
    setRerankerPricePerThousandQueries("");
    setLlmInputPricePerMillion("");
    setLlmOutputPricePerMillion("");
    setFixedMonthlyCosts("");
    setOtherOneTimeSetupCost("");
    setSetupAmortizationMonths("12");
    setMonthlyBudget("");
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your RAG Workload
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Model ingestion, storage, retrieval, reranking, LLM usage, and
            setup in one place.
          </p>
        </div>

        <FieldSection title="Knowledge Base and Chunking">
          <BeeijaNumberField
            label="Source documents"
            value={documents}
            onChange={setDocuments}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Average tokens per document"
            value={averageTokensPerDocument}
            onChange={setAverageTokensPerDocument}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Chunk size"
            value={chunkSize}
            onChange={setChunkSize}
            min="1"
            step="1"
            suffix="tokens"
          />

          <BeeijaNumberField
            label="Chunk overlap"
            value={chunkOverlapPercent}
            onChange={setChunkOverlapPercent}
            min="0"
            max="95"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Embedding dimensions"
            value={vectorDimensions}
            onChange={setVectorDimensions}
            min="1"
            step="1"
          />

          <BeeijaSelect
            label="Vector precision"
            value={bytesPerDimension}
            onChange={(event) => setBytesPerDimension(event.target.value)}
            options={precisionOptions}
          />

          <BeeijaNumberField
            label="Metadata per vector"
            value={metadataBytesPerVector}
            onChange={setMetadataBytesPerVector}
            min="0"
            step="1"
            suffix="bytes"
          />

          <BeeijaNumberField
            label="Metadata and index overhead"
            value={indexOverheadPercent}
            onChange={setIndexOverheadPercent}
            min="0"
            max="500"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Knowledge base refreshed monthly"
            value={monthlyRefreshPercent}
            onChange={setMonthlyRefreshPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />
        </FieldSection>

        <FieldSection title="Monthly Retrieval and LLM Usage">
          <BeeijaNumberField
            label="RAG queries per month"
            value={monthlyQueries}
            onChange={setMonthlyQueries}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Chunks retrieved per query"
            value={topK}
            onChange={setTopK}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Retrieved tokens used per chunk"
            value={retrievedTokensPerChunk}
            onChange={setRetrievedTokensPerChunk}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Base input tokens per query"
            value={baseInputTokensPerQuery}
            onChange={setBaseInputTokensPerQuery}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Output tokens per query"
            value={outputTokensPerQuery}
            onChange={setOutputTokensPerQuery}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Billable vector read units per query"
            value={vectorReadUnitsPerQuery}
            onChange={setVectorReadUnitsPerQuery}
            min="0"
            step="0.01"
          />
        </FieldSection>

        <label className="mt-8 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <input
            type="checkbox"
            checked
            readOnly
            aria-label="Current custom stack prices are enabled"
            className="pointer-events-none mt-1 h-4 w-4 accent-[var(--green)]"
          />

          <span>
            <span className="block font-medium text-gray-900">
              Use current custom stack prices
            </span>

            <span className="mt-1 block text-sm leading-relaxed text-gray-600">
              Price fields are blank so you can enter the official rates for
              the exact providers and plans being considered.
            </span>
          </span>
        </label>

        <FieldSection title="Current Provider Prices">
          <BeeijaNumberField
            label="Embedding price per 1M tokens"
            value={embeddingPricePerMillion}
            onChange={setEmbeddingPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Vector storage per GB per month"
            value={storagePricePerGbMonth}
            onChange={setStoragePricePerGbMonth}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Vector reads per 1M billable units"
            value={readPricePerMillionUnits}
            onChange={setReadPricePerMillionUnits}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Vector writes per 1M vectors"
            value={writePricePerMillionVectors}
            onChange={setWritePricePerMillionVectors}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Reranker price per 1K queries"
            value={rerankerPricePerThousandQueries}
            onChange={setRerankerPricePerThousandQueries}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="LLM input price per 1M tokens"
            value={llmInputPricePerMillion}
            onChange={setLlmInputPricePerMillion}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="LLM output price per 1M tokens"
            value={llmOutputPricePerMillion}
            onChange={setLlmOutputPricePerMillion}
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
            label="Other one-time setup cost"
            value={otherOneTimeSetupCost}
            onChange={setOtherOneTimeSetupCost}
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

          <BeeijaNumberField
            label="Target monthly budget"
            value={monthlyBudget}
            onChange={setMonthlyBudget}
            min="0"
            step="1"
            prefix="$"
          />
        </FieldSection>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Estimated RAG workload
          </p>

          <div className="mt-3 grid min-w-0 gap-2 text-sm text-gray-700 sm:grid-cols-2 [&>p]:min-w-0 [&>p]:break-words [&>p]:[overflow-wrap:anywhere]">
            <p>
              Chunks per document: {formatVisibleNumber(result.chunksPerDocument)}
            </p>
            <p>Total vectors: {formatVisibleInteger(result.totalVectors)}</p>
            <p>
              Initial embedding tokens:{" "}
              {formatVisibleInteger(result.initialEmbeddingTokens)}
            </p>
            <p>
              Estimated vector storage:{" "}
              {formatVisibleNumber(result.estimatedStorageGb)} GB
            </p>
            <p>
              Refreshed vectors monthly:{" "}
              {formatVisibleInteger(result.monthlyRefreshedVectors)}
            </p>
            <p>Monthly queries: {formatVisibleInteger(result.queries)}</p>
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
        title="Estimated RAG Cost"
        description="The result separates one-time setup from continuing monthly operating cost."
        primaryLabel="Monthly planning cost"
        primaryValue={
          result.hasAnyPrice
            ? formatVisibleMoney(result.monthlyPlanningCost)
            : "Enter prices"
        }
        stats={
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <ResultStat
              label="Initial setup"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.initialSetupCost)
                  : "—"
              }
            />

            <ResultStat
              label="Operating cost per query"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.costPerQuery)
                  : "—"
              }
            />

            <ResultStat
              label="Per 1,000 queries"
              value={
                result.hasAnyPrice
                  ? formatVisibleMoney(result.costPerThousandQueries)
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
                total={result.monthlyPlanningCost}
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
              Setup added per month:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyPrice
                  ? formatVisibleMoney(result.amortizedSetupCost)
                  : "—"}
              </span>
            </p>

            <p className="mt-2">
              First-year total:{" "}
              <span className="font-medium text-gray-900">
                {result.hasAnyPrice
                  ? formatVisibleMoney(result.firstYearTotal)
                  : "—"}
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
        noticeText="This calculator stores no built-in provider price. Enter the current official rates for your embedding model, vector database, reranker, LLM, and other services. Blank price fields are treated as zero. Storage is an estimate because compression, replicas, indexes, and provider billing rules can differ."
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
      <div className="mt-5 grid min-w-0 gap-5 md:grid-cols-2 [&>*]:min-w-0">{children}</div>
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

function BreakdownRow({
  label,
  detail,
  value,
  entered,
  total,
}: {
  label: string;
  detail: string;
  value: number;
  entered: boolean;
  total: number;
}) {
  const share = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 break-words text-sm text-gray-500 [overflow-wrap:anywhere]">
          {detail}
        </p>
        <p className="mt-1 break-words text-xs text-gray-500 [overflow-wrap:anywhere]">
          {entered
            ? `${formatVisibleNumber(share)}% of monthly planning cost`
            : "Rate not entered"}
        </p>
      </div>

      <p className="max-w-[46%] shrink-0 break-words text-right font-semibold text-gray-950 [overflow-wrap:anywhere]">
        {entered ? formatVisibleMoney(value) : "—"}
      </p>
    </div>
  );
}

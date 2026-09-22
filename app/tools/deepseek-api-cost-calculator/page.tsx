import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

const title = "DeepSeek API Cost Calculator";
const description =
  "Estimate DeepSeek V4.1 Flash and V4 Pro API costs using cache-hit and cache-miss input, output tokens, peak and off-peak pricing, and monthly request volume.";
const canonical = "https://beeija.com/tools/deepseek-api-cost-calculator";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description:
      "Model current DeepSeek API token costs across cache hits, cache misses, output, and peak or off-peak usage.",
  },
  keywords: [
    "DeepSeek API cost calculator",
    "DeepSeek V4.1 Flash pricing",
    "DeepSeek V4 Pro pricing",
    "DeepSeek cache hit pricing",
    "DeepSeek cache miss pricing",
    "DeepSeek off-peak pricing",
    "DeepSeek peak pricing",
    "DeepSeek token cost",
  ],
};

const sources = [
  {
    label: "models and pricing",
    href: "https://api-docs.deepseek.com/quick_start/pricing/",
  },
  {
    label: "context caching",
    href: "https://api-docs.deepseek.com/guides/kv_cache/",
  },
  {
    label: "token usage",
    href: "https://api-docs.deepseek.com/quick_start/token_usage/",
  },
  {
    label: "thinking mode",
    href: "https://api-docs.deepseek.com/guides/thinking_mode/",
  },
  {
    label: "rate limits and isolation",
    href: "https://api-docs.deepseek.com/quick_start/rate_limit/",
  },
];

export default function DeepSeekApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title={title}
      description="Estimate current DeepSeek API spend by combining token usage, cache behavior, and the provider's time-of-day pricing windows."
    >
      <ToolClient />

      <section className="mt-14 max-w-5xl">
        <h2 className="text-2xl font-semibold text-gray-950">
          Off-peak pricing matters only when the workload can actually move
        </h2>
        <div className="mt-4 space-y-4 leading-8 text-gray-600">
          <p>
            DeepSeek&apos;s weekday peak windows are 01:00–04:00 and 06:00–10:00
            UTC. Traffic outside those windows, plus all weekend traffic, uses
            the lower off-peak rates shown in the calculator. The pricing clock
            beside the off-peak field is there to make that schedule visible
            while you are choosing the workload share.
          </p>
          <p>
            Delayed evaluation, indexing, summarization, and other background
            jobs may be movable into cheaper hours. User-facing requests usually
            are not. If the workloads also have very different prompt or output
            sizes, estimate them separately rather than blending unlike traffic
            into one percentage.
          </p>
        </div>
      </section>

      <section className="mt-12 max-w-6xl">
        <h2 className="text-2xl font-semibold text-gray-950">
          Cache savings should come from token usage, not request counts
        </h2>
        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-start">
          <div className="space-y-4 leading-8 text-gray-600">
            <p>
              DeepSeek&apos;s context cache is enabled by default, but a repeated
              request does not mean the whole prompt is billed as a cache hit.
              The matching prefix must already be available to the cache, and
              the cache operates on a best-effort basis.
            </p>
            <p>
              For live traffic, the useful measurements are the token counters
              returned by the API. A request-level hit rate can distort the
              budget when some prompts are much larger than others, so the
              calculator&apos;s cache percentage represents the share of
              <em> input tokens</em> billed at the cache-hit rate.
            </p>
          </div>

          <dl className="space-y-5 text-sm leading-6">
            <div>
              <dt className="font-semibold text-gray-950">
                <code>prompt_cache_hit_tokens</code>
              </dt>
              <dd className="mt-1 text-gray-600">
                Input tokens billed at the cache-hit price.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-950">
                <code>prompt_cache_miss_tokens</code>
              </dt>
              <dd className="mt-1 text-gray-600">
                Input tokens that missed the cache and use the higher input rate.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-950">
                Cache-hit share in the calculator
              </dt>
              <dd className="mt-1 text-gray-600">
                A planning shortcut until measured token totals are available;
                replace it with observed usage when you have it.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-12 max-w-5xl">
        <h2 className="text-2xl font-semibold text-gray-950">
          V4.1 Flash changes the name, while billing still depends on usage
        </h2>
        <div className="mt-4 space-y-4 leading-8 text-gray-600">
          <p>
            The current Flash model is <code>deepseek-flash</code>, which
            DeepSeek identifies as V4.1 Flash. The older
            <code> deepseek-v4-flash</code> alias remains accepted for
            compatibility, but routes to V4.1 Flash and uses the current Flash
            pricing. <code>deepseek-v4-pro</code> remains separately priced.
          </p>
          <p>
            Both models are documented with a 1 million-token context window
            and maximum output of 384,000 tokens. The calculator rejects an
            average request already beyond those published boundaries instead
            of returning a misleading cost for an impossible request shape.
          </p>
        </div>
      </section>

      <section className="mt-12 max-w-5xl">
        <h2 className="text-2xl font-semibold text-gray-950">
          Thinking tokens belong in the output budget
        </h2>
        <div className="mt-4 space-y-4 leading-8 text-gray-600">
          <p>
            Thinking is enabled by default in the current model family unless it
            is disabled. Reasoning can be exposed separately for observability
            while still contributing to billed output usage.
          </p>
          <p>
            For a production estimate, use the API&apos;s returned output-token
            usage rather than estimating cost from the visible answer alone. In
            Responses API usage, reasoning can be broken out through
            <code> output_tokens_details.reasoning_tokens</code>, while total
            output usage remains the billing input that matters here.
          </p>
        </div>
      </section>

      <section className="mt-12 max-w-6xl">
        <h2 className="text-2xl font-semibold text-gray-950">
          Before trusting the monthly total in production
        </h2>
        <div className="mt-5 grid gap-x-10 gap-y-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold text-gray-950">Concurrency</h3>
            <p className="mt-2 leading-7 text-gray-600">
              DeepSeek currently documents account-level concurrency limits of
              2,500 for <code>deepseek-flash</code> and 500 for
              <code> deepseek-v4-pro</code>. Exceeding the applicable limit can
              return HTTP 429 even when the token budget is acceptable.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-950">User isolation</h3>
            <p className="mt-2 leading-7 text-gray-600">
              The optional <code>user_id</code> mechanism affects cache and
              scheduling isolation. DeepSeek says not to place private user
              information in that identifier, so use an internal non-sensitive
              identifier when the feature is needed.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-950">Outside the estimate</h3>
            <p className="mt-2 leading-7 text-gray-600">
              Taxes, granted balance, credits, retries, surrounding services,
              hosting, network costs, account-specific terms, and future price
              changes are outside the token estimate.
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-5xl leading-8 text-gray-600">
          The arithmetic runs locally in your browser. There is no prompt or API
          key field, and changing a workload value does not send it to DeepSeek.
        </p>
      </section>

      <section className="mt-12 max-w-5xl">
        <h2 className="text-2xl font-semibold text-gray-950">
          DeepSeek sources used for this page
        </h2>
        <p className="mt-4 leading-7 text-gray-600">
          <strong>Pricing checked: September 22, 2026.</strong> Current rates,
          model names, cache behavior, token accounting, thinking behavior, and
          request limits were checked against DeepSeek&apos;s own documentation:
          {" "}
          {sources.map((source, index) => (
            <span key={source.href}>
              {index > 0 ? ", " : ""}
              <a
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[var(--green)] underline decoration-[var(--yellow)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--green)]"
              >
                {source.label}
              </a>
            </span>
          ))}
          . Recheck the provider pages before a launch or budget approval because
          pricing and limits can change.
        </p>
      </section>

      <section className="mt-12 max-w-5xl">
        <h2 className="text-2xl font-semibold text-gray-950">
          Explore related AI cost tools
        </h2>
        <div className="mt-4 [&>*]:!mt-0">
          <BeeijaRelatedTools currentHref="/tools/deepseek-api-cost-calculator" />
        </div>
      </section>
    </ToolShell>
  );
}

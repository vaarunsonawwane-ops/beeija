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
    label: "Models and pricing",
    href: "https://api-docs.deepseek.com/quick_start/pricing/",
  },
  {
    label: "Context caching",
    href: "https://api-docs.deepseek.com/guides/kv_cache/",
  },
  {
    label: "Token usage",
    href: "https://api-docs.deepseek.com/quick_start/token_usage/",
  },
  {
    label: "Thinking mode",
    href: "https://api-docs.deepseek.com/guides/thinking_mode/",
  },
  {
    label: "Rate limits and isolation",
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

      <section className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:items-start">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            The clock is part of the DeepSeek price
          </h2>
          <p className="mt-4 leading-8 text-gray-600">
            DeepSeek does not publish one token rate that applies all day. The
            same model has peak and off-peak prices, so a monthly budget depends
            on when traffic actually runs as well as how many tokens it uses.
          </p>
          <p className="mt-4 leading-8 text-gray-600">
            Peak windows are 01:00–04:00 and 06:00–10:00 UTC from Monday through
            Friday. Traffic outside those windows uses the lower off-peak rates.
            The calculator therefore asks for an off-peak workload share rather
            than pretending every request is billed at one schedule.
          </p>

          <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 px-4 py-3 text-sm font-semibold text-gray-950">
              <span>Pricing window</span>
              <span>UTC schedule</span>
            </div>
            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 border-t border-gray-200 px-4 py-3 text-sm leading-6 text-gray-600">
              <span className="font-medium text-gray-900">Peak</span>
              <span>01:00–04:00 and 06:00–10:00, Monday–Friday</span>
            </div>
            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 border-t border-gray-200 px-4 py-3 text-sm leading-6 text-gray-600">
              <span className="font-medium text-gray-900">Off-peak</span>
              <span>Every other time</span>
            </div>
          </div>
        </div>

        <aside className="self-start border-l-4 border-[var(--yellow)] bg-white pl-5 py-1">
          <h3 className="text-lg font-semibold text-gray-950">
            Do not move interactive traffic just to chase the lower rate
          </h3>
          <p className="mt-2 leading-7 text-gray-600">
            Delayed evaluation, indexing, summarization, or other background jobs
            can often be scheduled around off-peak windows. User-facing requests
            still need to be budgeted around the hours in which users actually
            send them.
          </p>
          <p className="mt-3 leading-7 text-gray-600">
            If the off-peak jobs also have much larger prompts or outputs, run
            them as a separate estimate instead of blending two very different
            workloads into one percentage.
          </p>
        </aside>
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
              The matching prefix must already be available to the cache, and the
              cache operates on a best-effort basis.
            </p>
            <p>
              For live traffic, the useful measurements are the token counters
              returned by the API. A request-level hit rate can distort the
              budget when some prompts are much larger than others, so the
              calculator&apos;s cache percentage is intended to represent the
              share of <em>input tokens</em> billed at the cache-hit rate.
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
                Cache-hit share in this calculator
              </dt>
              <dd className="mt-1 text-gray-600">
                A planning shortcut when measured token totals are not available
                yet; replace it with observed usage as soon as you have it.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-12 max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-950">
              What V4.1 Flash changes for an existing integration
            </h2>
            <div className="mt-4 space-y-4 leading-8 text-gray-600">
              <p>
                The current Flash model is <code>deepseek-flash</code>, which
                DeepSeek identifies as V4.1 Flash. The older
                <code> deepseek-v4-flash</code> alias remains accepted for
                compatibility, but routes to V4.1 Flash and uses the current
                Flash pricing.
              </p>
              <p>
                <code>deepseek-v4-pro</code> remains separately priced in the
                current public table. Both models are documented with a 1
                million-token context window and maximum output of 384,000
                tokens, so this calculator rejects an average request that is
                already beyond those published boundaries.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-950">
              Output usage can exceed the text a user sees
            </h2>
            <div className="mt-4 space-y-4 leading-8 text-gray-600">
              <p>
                Thinking is enabled by default in the current model family unless
                it is disabled. Reasoning can be exposed separately for
                observability while still contributing to billed output usage.
              </p>
              <p>
                For a production budget, use the API&apos;s returned output-token
                usage rather than estimating cost from the visible answer alone.
                In Responses API usage, reasoning can be broken out through
                <code> output_tokens_details.reasoning_tokens</code> while the
                total output count remains the number relevant to billing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 max-w-6xl">
        <h2 className="text-2xl font-semibold text-gray-950">
          Three production boundaries worth watching after launch
        </h2>
        <div className="mt-5 grid gap-x-10 gap-y-6 md:grid-cols-3">
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
            <h3 className="font-semibold text-gray-950">What this total omits</h3>
            <p className="mt-2 leading-7 text-gray-600">
              Taxes, granted balance, credits, retries, surrounding tool calls,
              hosting, network costs, account-specific terms, and future price
              changes are outside the token estimate. Custom rates change the
              arithmetic, not the status of the result as a planning estimate.
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-5xl leading-8 text-gray-600">
          The calculator arithmetic runs locally in the browser. There is no
          prompt or API-key field, and changing a workload value does not send it
          to DeepSeek. Opening an official documentation link below is a separate
          browser request to DeepSeek&apos;s site.
        </p>
      </section>

      <section className="mt-12 max-w-5xl">
        <h2 className="text-2xl font-semibold text-gray-950">
          Official DeepSeek documentation
        </h2>
        <p className="mt-4 max-w-4xl leading-7 text-gray-600">
          <strong>Pricing checked: September 22, 2026.</strong> The built-in USD
          rates, current model names, published request limits, cache behavior,
          and operational notes above were checked against DeepSeek&apos;s own API
          documentation. Recheck the provider pages before a launch or budget
          approval because pricing and limits can change.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {sources.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="beeija-btn-outline"
            >
              {source.label}
            </a>
          ))}
        </div>
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

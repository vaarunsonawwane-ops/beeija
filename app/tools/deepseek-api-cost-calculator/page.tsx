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
      description="Price a DeepSeek workload across current models, cache behavior, and the API's peak/off-peak schedule."
    >
      <ToolClient />

      <div className="mt-14 space-y-12 text-gray-700">
        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            DeepSeek pricing changes with the clock
          </h2>
          <div className="mt-5 space-y-4 leading-8 text-gray-600">
            <p>
              DeepSeek currently publishes two token prices for the same model:
              peak and off-peak. Peak hours are 01:00–04:00 and 06:00–10:00 UTC
              from Monday through Friday; every other time is off-peak. The
              off-peak rates are half the peak rates.
            </p>
            <p>
              A monthly estimate based on only one of those rates can be
              misleading when traffic runs all day. The off-peak workload share
              lets the calculator blend the two schedules. If your overnight jobs
              also have much longer prompts than daytime requests, calculate those
              workloads separately rather than relying on one percentage.
            </p>
          </div>

          <div className="mt-6 max-w-4xl self-start border-l-4 border-[var(--yellow)] bg-white px-5 py-2">
            <h3 className="font-semibold text-gray-950">
              Scheduling can change cost without changing the model
            </h3>
            <p className="mt-2 leading-7 text-gray-700">
              Flexible indexing, evaluation, summarization, and other delayed
              jobs can be candidates for off-peak execution. Interactive traffic
              should be budgeted around when users actually send requests rather
              than assuming the discount is always available.
            </p>
          </div>
        </section>

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Cache hits are measured in tokens, not requests
          </h2>
          <div className="mt-5 space-y-4 leading-8 text-gray-600">
            <p>
              DeepSeek&apos;s disk-based context cache is enabled by default. A
              repeated request does not automatically mean the entire prompt is a
              cache hit: the matching prefix must already have been persisted and
              must match a cache prefix unit. The cache also works on a
              best-effort basis.
            </p>
            <p>
              The API reports <code>prompt_cache_hit_tokens</code> and
              <code> prompt_cache_miss_tokens</code>. Those fields are the best
              basis for a production estimate. The percentage input here is a
              planning shortcut when you know the average total prompt size but
              do not yet have enough real traffic to enter measured hit and miss
              counts directly.
            </p>
            <p>
              A high request-level hit rate can still produce a different token
              hit rate if some prompts are much larger than others. When that
              difference matters, derive the percentage from token totals rather
              than counting how many requests hit the cache.
            </p>
          </div>
        </section>

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            V4.1 Flash changed both the model name and the rate
          </h2>
          <div className="mt-5 space-y-4 leading-8 text-gray-600">
            <p>
              The current Flash API model is <code>deepseek-flash</code>, which
              DeepSeek identifies as V4.1 Flash. The older
              <code> deepseek-v4-flash</code> alias is still accepted for
              compatibility, but it is routed to V4.1 Flash and billed at the
              current Flash price.
            </p>
            <p>
              DeepSeek&apos;s current pricing page also continues to list
              <code> deepseek-v4-pro</code> as a separately priced API model.
              That current table is the basis used here. This matters because an
              earlier V4.1 Flash launch notice described a temporary routing plan
              for V4 Pro, while the later/current pricing documentation states
              that V4 Pro service continues with its existing billing method.
            </p>
            <p>
              Both models are documented with a 1 million-token context window
              and a maximum output of 384,000 tokens. The calculator rejects an
              average request that already exceeds those published per-request
              boundaries, but an average below the limit does not prove that
              every individual request in production will fit.
            </p>
          </div>
        </section>

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Thinking can make output usage larger than the visible answer
          </h2>
          <div className="mt-5 space-y-4 leading-8 text-gray-600">
            <p>
              Thinking mode is enabled by default in the current DeepSeek model
              family unless it is disabled. The APIs expose reasoning separately
              for observability, but it still sits inside billed output usage.
              In the Responses API, for example,
              <code> output_tokens_details.reasoning_tokens</code> breaks out the
              reasoning portion while <code>output_tokens</code> remains the
              output total.
            </p>
            <p>
              For a real service, use returned usage data instead of estimating
              output from the final visible answer. DeepSeek also provides token
              usage guidance and an offline tokenizer, but the API&apos;s returned
              usage remains the source of truth for what was processed.
            </p>
          </div>
        </section>

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Cost is not the only production limit
          </h2>
          <div className="mt-5 space-y-4 leading-8 text-gray-600">
            <p>
              DeepSeek currently documents an account-level concurrency limit of
              2,500 for <code>deepseek-flash</code> and 500 for
              <code> deepseek-v4-pro</code>. Going beyond the applicable limit can
              return HTTP 429 even when the token budget itself is acceptable.
              Capacity expansion can be requested separately.
            </p>
            <p>
              The optional <code>user_id</code> mechanism also affects KV-cache
              isolation and scheduling isolation. DeepSeek explicitly says not
              to put private user information in that identifier. That is an
              operational/privacy boundary rather than a token-price input, so it
              belongs in deployment planning but not in the calculator math.
            </p>
            <p>
              Taxes, granted balance, account credits, retries, application-side
              tool costs, network or hosting costs, and future pricing changes
              are outside the result. Custom prices can model different token
              rates, but they do not turn this planning estimate into a provider
              invoice.
            </p>
            <p>
              All arithmetic runs locally in the browser from the numeric values
              entered on this page. There is no API-key or prompt field, and
              changing a workload value does not send it to DeepSeek. Opening one
              of the documentation links below is a separate browser request to
              DeepSeek&apos;s site.
            </p>
          </div>
        </section>

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Official DeepSeek documentation
          </h2>
          <p className="mt-4 max-w-4xl leading-7 text-gray-600">
            <strong>Pricing checked: September 22, 2026.</strong> The calculator
            uses the current public USD rates and current model limits. Recheck
            the provider documentation before a launch or budget approval because
            DeepSeek states that product prices may change.
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

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Explore related AI cost tools
          </h2>
          <div className="mt-4 [&>*]:!mt-0">
            <BeeijaRelatedTools
              currentHref="/tools/deepseek-api-cost-calculator"
            />
          </div>
        </section>
      </div>
    </ToolShell>
  );
}

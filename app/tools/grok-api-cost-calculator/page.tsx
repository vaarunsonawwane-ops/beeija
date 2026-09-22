import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

const title = "Grok API Cost Calculator";
const description =
  "Estimate xAI Grok API costs across current models, long-context pricing, prompt caching, Priority or Batch processing, regional inference, and optional server-side tool usage.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Grok API cost calculator",
    "xAI API pricing calculator",
    "Grok 4.7 pricing",
    "Grok long context pricing",
    "Grok prompt caching cost",
    "xAI Priority Processing cost",
    "Grok Batch API pricing",
    "xAI server-side tools pricing",
  ],
  alternates: {
    canonical: "https://beeija.com/tools/grok-api-cost-calculator",
  },
  openGraph: {
    title,
    description,
    url: "https://beeija.com/tools/grok-api-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const referenceClass =
  "font-medium text-[var(--green)] underline decoration-[var(--yellow)] decoration-2 underline-offset-4";

export default function GrokApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title={title}
      description="Estimate a Grok workload using the xAI pricing rules that actually change the bill: context length, cache hits, service tier, regional processing, and server-side tools."
    >
      <ToolClient />

      <div className="mt-14 space-y-12">
        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            The 200K prompt boundary can double the token rate
          </h2>
          <p className="mt-5 leading-8 text-gray-600">
            xAI publishes separate short- and long-context prices for the current Grok text models. Once a request reaches the 200,000-token prompt threshold, the long-context rate applies to all input, cached input, and output tokens in that request—not only the tokens above the boundary.
          </p>
          <p className="mt-4 leading-8 text-gray-600">
            That makes average prompt size more important than a monthly token total alone. Two workloads can consume the same number of tokens in a month while landing in different pricing bands because one sends many smaller prompts and the other sends fewer very large prompts.
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-950">
              Cached tokens are visible in the API response
            </h2>
            <p className="mt-5 leading-8 text-gray-600">
              xAI automatically caches matching prompt prefixes. A planning percentage is useful before launch, but production budgets should come from the returned <code className="font-mono text-sm text-gray-800">cached_tokens</code> value. If cache hits stay at zero across a continuing conversation, xAI recommends checking the conversation or prompt-cache key and whether earlier messages are changing.
            </p>
            <p className="mt-4 leading-8 text-gray-600">
              Reasoning tokens are different: they are billed at the output-token rate. For reasoning models, use billed output usage rather than estimating cost from visible answer length alone.
            </p>
          </div>

          <div className="border-l-4 border-[var(--yellow)] pl-6 self-start">
            <h3 className="text-lg font-semibold text-gray-950">
              Priority and Batch solve different problems
            </h3>
            <p className="mt-3 leading-8 text-gray-600">
              Priority Processing is for latency-sensitive real-time requests and costs 2× the standard token rates when the response confirms the priority tier. Batch is asynchronous, normally completes within 24 hours, and currently gives a 20% token discount only on Grok 4.3 and the Grok 4.20 variants listed by xAI.
            </p>
          </div>
        </section>

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Agentic Grok requests can spend outside the token line item
          </h2>
          <p className="mt-5 leading-8 text-gray-600">
            Web Search, X Search, code execution, attachment search, and collection search have their own invocation charges. The model can also make more than one server-side tool call while answering a single user request, so request count is not a safe substitute for tool usage. xAI exposes successful billable usage separately; that is the number to use when you have production data.
          </p>
          <p className="mt-4 leading-8 text-gray-600">
            X Search changed on September 21, 2026: posts fetched are billed at $5 per 1,000 and user profiles at $10 per 1,000. The calculator therefore asks for those fetched-item counts rather than pretending X Search still has one flat per-call price.
          </p>
        </section>

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            What this estimate deliberately keeps separate
          </h2>
          <p className="mt-5 leading-8 text-gray-600">
            Image and video generation, voice APIs, xAI file and collection storage, download charges, client-side tools, taxes, credits, negotiated pricing, and retries that are not already represented in the entered workload are outside this estimate. Multi-agent work also needs aggregate billed token usage because leader and sub-agent activity is chargeable even when only the leader's final answer is returned.
          </p>
          <p className="mt-4 leading-8 text-gray-600">
            The arithmetic runs in your browser. Beeija does not send the workload values entered here to xAI. Following an official documentation link opens xAI's site separately.
          </p>
        </section>

        <section className="max-w-6xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            xAI documentation behind the calculation
          </h2>
          <p className="mt-5 leading-8 text-gray-600">
            Built-in rates were checked on <strong>September 22, 2026</strong> against xAI's <a href="https://docs.x.ai/developers/pricing" target="_blank" rel="noreferrer" className={referenceClass}>API pricing</a> and <a href="https://docs.x.ai/developers/models" target="_blank" rel="noreferrer" className={referenceClass}>model reference</a>. Cache accounting follows the <a href="https://docs.x.ai/developers/advanced-api-usage/prompt-caching/usage-and-pricing" target="_blank" rel="noreferrer" className={referenceClass}>prompt-caching usage guide</a>. The processing choices come from the <a href="https://docs.x.ai/developers/advanced-api-usage/priority-processing" target="_blank" rel="noreferrer" className={referenceClass}>Priority Processing</a> and <a href="https://docs.x.ai/developers/advanced-api-usage/batch-api" target="_blank" rel="noreferrer" className={referenceClass}>Batch API</a> documentation, while optional tool costs follow xAI's current <a href="https://docs.x.ai/developers/pricing#tools-pricing" target="_blank" rel="noreferrer" className={referenceClass}>server-side tool pricing</a>.
          </p>
        </section>

        <section className="max-w-6xl">
          <h2 className="text-2xl font-semibold text-gray-950">Explore related AI cost tools</h2>
          <div className="mt-4 [&>*]:!mt-0">
            <BeeijaRelatedTools currentHref="/tools/grok-api-cost-calculator" />
          </div>
        </section>
      </div>
    </ToolShell>
  );
}

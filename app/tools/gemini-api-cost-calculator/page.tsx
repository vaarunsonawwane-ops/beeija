import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

const title = "Gemini API Cost Calculator";
const description =
  "Estimate Gemini Developer API costs across current Flash and Pro models, Standard, Batch, Flex and Priority consumption, context caching, grounding, and scheduled 2027 rates.";
const canonical = "https://beeija.com/tools/gemini-api-cost-calculator";

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
      "Model Gemini API token, caching, grounding, consumption-mode, and scheduled pricing costs with your own workload.",
  },
  keywords: [
    "Gemini API cost calculator",
    "Gemini Developer API pricing",
    "Gemini 3.8 Flash pricing",
    "Gemini Batch API cost",
    "Gemini Flex pricing",
    "Gemini Priority inference pricing",
    "Gemini context caching cost",
    "Gemini grounding cost",
    "Gemini token cost",
  ],
};

const sources = [
  {
    label: "Gemini API Pricing",
    href: "https://ai.google.dev/gemini-api/docs/pricing",
  },
  {
    label: "Gemini Models",
    href: "https://ai.google.dev/gemini-api/docs/models",
  },
  {
    label: "Context Caching",
    href: "https://ai.google.dev/gemini-api/docs/caching",
  },
  {
    label: "Token Counting",
    href: "https://ai.google.dev/gemini-api/docs/tokens",
  },
  {
    label: "Batch API",
    href: "https://ai.google.dev/gemini-api/docs/batch-api",
  },
  {
    label: "Flex Inference",
    href: "https://ai.google.dev/gemini-api/docs/flex-inference",
  },
  {
    label: "Priority Inference",
    href: "https://ai.google.dev/gemini-api/docs/priority-inference",
  },
];

export default function GeminiApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title={title}
      description="Price Gemini API workloads across models, consumption modes, cache usage, grounding, and scheduled rate changes."
    >
      <ToolClient />

      <div className="mt-14 space-y-12 text-gray-700">
        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Gemini pricing has more than one axis
          </h2>
          <div className="mt-5 space-y-4 leading-8 text-gray-600">
            <p>
              A model name alone is not enough to reproduce a Gemini bill. The
              same request can use Standard, Batch, Flex, or Priority
              consumption, and those paths do not always share the same input,
              cached-input, output, or cache-storage rate. Some models also
              charge audio input differently from text, image, and video input.
            </p>
            <p>
              Gemini 3.1 Pro Preview and Gemini 2.5 Pro add another boundary:
              prompts above 200,000 input tokens use the higher published token
              tier. The calculator derives that tier from the entered input
              tokens instead of asking for a second setting that could contradict
              the workload.
            </p>
          </div>

          <div className="mt-7 space-y-7">
            <div>
              <h3 className="text-lg font-semibold text-gray-950">
                Batch and Flex change both price and workflow
              </h3>
              <div className="mt-3 space-y-3 leading-7 text-gray-600">
                <p>
                  Lower-cost processing often reduces input and output prices,
                  but cached-input pricing can follow a different rule. Gemini
                  3.1 Pro and Gemini 2.5 Pro, for example, keep their Standard
                  cache-read rate under Batch and Flex. Gemini 3.5 Flash also has
                  a slightly different cached-input rate for Flex than Batch.
                </p>
                <p>
                  Batch is asynchronous and is designed around a turnaround of
                  up to 24 hours. Flex stays synchronous, but runs on best-effort
                  capacity with a 1–15 minute latency target. Those differences
                  can matter as much as the token rate when deciding which path
                  fits the workload.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-950">
                Priority is not simply a price multiplier
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Google publishes explicit Priority rates. If Priority capacity is
                exceeded, Google documents that requests can be downgraded to
                Standard and billed at the Standard rate. A budget based on
                Priority alone should therefore be compared with observed
                service-tier headers in production.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            The 2026 introductory Flash price has an expiry date
          </h2>
          <div className="mt-5 space-y-4 leading-8 text-gray-600">
            <p>
              Google currently lists introductory paid-tier pricing for Gemini
              3.8 Flash, 3.7 Flash, and 3.6 Flash through December 31, 2026, with
              higher token and explicit-cache-storage rates from January 1,
              2027. A normal “monthly cost × 12” label can therefore be misread
              as a forward-year forecast.
            </p>
            <p>
              The calculator therefore lets you choose the published pricing
              period and labels the annualized number as “12 months at selected
              rate.” It does not blend the remaining 2026 months with 2027
              pricing because no project start month is being requested.
            </p>
          </div>

          <div className="mt-6 max-w-4xl self-start border-l-4 border-[var(--yellow)] bg-white px-5 py-2">
            <h3 className="font-semibold text-gray-950">
              Do not carry the introductory rate into a 2027 budget
            </h3>
            <p className="mt-3 leading-7 text-gray-700">
              For a deployment that will run into 2027, compare both pricing
              periods or build a month-by-month forecast. The current-period
              annualized figure is deliberately not presented as a forecast.
            </p>
          </div>
        </section>

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Cache hits and cache storage are separate charges
          </h2>
          <div className="mt-5 space-y-4 leading-8 text-gray-600">
            <p>
              Gemini supports implicit and explicit context caching. Implicit
              caching is automatic on supported newer models, but Google does
              not guarantee a cache hit. When real usage data is available, the
              cached-token count is a better basis than assuming that a fixed
              percentage of every prompt will receive the discount.
            </p>
            <p>
              Explicit caching adds a second billing dimension: stored tokens
              are charged for the time they remain cached. The optional “million
              token-hours” input represents the aggregate storage footprint
              directly, so a cache that is created, replaced, or held for
              different TTLs can still be represented without pretending every
              cached token stays stored for a full month.
            </p>
            <p>
              The Interactions API and GenerateContent API also differ here:
              Google documents explicit cache objects for GenerateContent, while
              the Interactions API uses implicit caching. Leave explicit cache
              storage at zero when you are only modelling implicit cache hits.
            </p>
          </div>
        </section>

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Grounding is billed in its own units
          </h2>
          <div className="mt-5 space-y-4 leading-8 text-gray-600">
            <p>
              Google Search and Google Maps grounding should not be converted
              into token charges. Gemini 3.x pricing uses a shared monthly
              allowance and then charges for billable search activity; Google
              also notes that one customer request can trigger more than one
              Search query. Gemini 2.5 pricing uses different free allowances
              and per-1,000 charges.
            </p>
            <p>
              Because those allowances can be shared across models or depend on
              daily usage, the calculator does not guess how much free grounding
              remains in your account. Enter only the Search or Maps units that
              you expect to be billable after the applicable allowance.
            </p>
          </div>

          <div className="mt-7 max-w-4xl">
            <h3 className="text-lg font-semibold text-gray-950">
              Maps availability depends on the consumption path
            </h3>
            <p className="mt-3 leading-7 text-gray-600">
              Current Gemini 2.5 pricing does not list Google Maps grounding as
              available under Batch or Flex for the Pro, Flash, and Flash-Lite
              models covered here. The Maps field disappears for those
              combinations instead of calculating a charge for an unavailable
              path.
            </p>
          </div>
        </section>

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Billed output can be larger than the answer on screen
          </h2>
          <div className="mt-5 space-y-4 leading-8 text-gray-600">
            <p>
              Google states that the listed output rate includes thinking
              tokens. With thinking enabled, billing is based on generated
              answer tokens plus thought tokens, even though the full internal
              reasoning is not returned as ordinary response text. Enter billed
              output usage rather than estimating cost from the visible answer
              alone.
            </p>
            <p>
              For measured workloads, Gemini usage metadata exposes input,
              output, cached-content, and thinking token counts. Google&apos;s
              token-counting endpoint can also measure request input before a
              generation call. Those values are safer for production budgets
              than converting words or characters into tokens by hand.
            </p>
          </div>
        </section>

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Boundaries of this estimate
          </h2>
          <div className="mt-5 space-y-4 leading-8 text-gray-600">
            <p>
              The model list is intentionally limited to text-output Gemini
              models that fit this token-based estimator. Live audio models,
              TTS, transcription, native image generation, video generation,
              embeddings, and other products can use different units or output
              pricing and should not be forced into the same calculation.
            </p>
            <p>
              The estimate also cannot know your remaining free-tier or
              grounding allowance, retries that were not included in request
              volume, negotiated terms, taxes, currency conversion, regional or
              account-specific conditions, or future pricing changes beyond the
              rates Google has already published. Custom rates are available for
              cases where your contract or a newer pricing page differs from the
              built-in values.
            </p>
            <p>
              Workload values stay in the browser. No Gemini request is made,
              and there is no reason to paste an API key, prompt text, customer
              data, or cached content into the calculator.
            </p>
          </div>
        </section>

        <section className="max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Official Google sources
          </h2>
          <p className="mt-4 leading-7 text-gray-600">
            Built-in rates and billing behavior were checked on{" "}
            <strong>September 21, 2026</strong>. These are the Google pages used
            to verify the model rates, cache treatment, consumption modes,
            token accounting, and availability rules represented above.
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

        <section>
          <h2 className="text-2xl font-semibold text-gray-950">
            Explore related AI cost tools
          </h2>
          <div className="mt-4 [&>div]:!mt-0 [&>section]:!mt-0">
            <BeeijaRelatedTools currentHref="/tools/gemini-api-cost-calculator" />
          </div>
        </section>
      </div>
    </ToolShell>
  );
}

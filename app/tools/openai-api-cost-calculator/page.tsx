import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "OpenAI API Cost Calculator",

  description:
    "Estimate OpenAI API text-token costs using current model rates, uncached and cached input, cache writes, output tokens, Batch API pricing, and custom rates.",

  alternates: {
    canonical: "https://beeija.com/tools/openai-api-cost-calculator",
  },

  openGraph: {
    title: "OpenAI API Cost Calculator | Beeija",
    description:
      "Estimate OpenAI API text-token costs with current model rates, prompt caching, Batch API pricing, long-context rules, and custom rates.",
    url: "https://beeija.com/tools/openai-api-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "OpenAI API Cost Calculator | Beeija",
    description:
      "Estimate OpenAI API text-token costs with current model rates, caching, Batch API pricing, and custom rates.",
  },
};

export default function OpenAIApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="OpenAI API Cost Calculator"
      description="Estimate text-token costs for current OpenAI models using uncached input, cached input, cache writes, output tokens, Standard or Batch processing, and custom rates."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <>
              <p>
                OpenAI API billing is not just one token rate. The model,
                uncached input, cached reads, cache writes, output length,
                processing mode, and long-context rules can all change the
                result. This calculator keeps those pieces separate so the
                estimate is easier to inspect.
              </p>

              <p>
                It calculates locally in your browser and does not need an API
                key. ChatGPT subscriptions are separate from OpenAI API billing.
              </p>
            </>
          }
          sections={[
            {
              title: "What This Calculator Includes",
              content: (
                <>
                  <p>
                    The built-in model list focuses on OpenAI&apos;s current
                    flagship API models: GPT-6 Astra and the GPT-5.6 Sol, Terra,
                    and Luna family. For each request, enter uncached input,
                    cached input, cache-write tokens, and output tokens
                    separately.
                  </p>

                  <p>
                    The calculator multiplies those token totals by the selected
                    per-million-token rates, then shows estimated cost per
                    request, a 30-day daily average, monthly cost, and yearly
                    cost. Custom pricing lets you replace the built-in base rates
                    without changing the workload.
                  </p>
                </>
              ),
            },
            {
              title: "Prompt Caching: Reads and Writes Are Different",
              content: (
                <>
                  <p>
                    A cached input token is a token read from a reusable prompt
                    prefix and billed at the lower cached-input rate. A cache
                    write is different: it is a token being written into the
                    prompt cache for possible reuse later.
                  </p>

                  <p>
                    OpenAI currently charges cache writes on GPT-5.6 models and
                    later model families at 1.25× the uncached input rate. The
                    API reports cache reads in <code>cached_tokens</code> and
                    writes in <code>cache_write_tokens</code>. Enter the average
                    values you actually observe when possible instead of assuming
                    every repeated prompt will become a cache hit.
                  </p>

                  <p>
                    Prompt caching is automatically available for eligible
                    prompts, but a shared prefix must match for a cache read to
                    occur. Changing content inside the reusable prefix can turn
                    an expected hit into another write or an uncached request.
                  </p>
                </>
              ),
            },
            {
              title: "Batch and Long-Context Pricing",
              content: (
                <>
                  <p>
                    Batch API is intended for asynchronous work that does not
                    need an immediate response. OpenAI documents Batch as 50%
                    lower cost than synchronous APIs, with batches completing
                    within a 24-hour window. Select Batch only when the workload
                    can actually use that processing path.
                  </p>

                  <p>
                    The current GPT-6 Astra and GPT-5.6 family also have a
                    long-context pricing rule. When a request exceeds 272,000
                    input tokens, this calculator automatically applies 2× to
                    input and cache rates and 1.5× to output rates for the full
                    request.
                  </p>

                  <p>
                    The long-context check uses uncached input, cached input,
                    and cache-write tokens together because all are part of the
                    request&apos;s input-token volume.
                  </p>
                </>
              ),
            },
            {
              title: "A Better Way to Build the Workload Estimate",
              content: (
                <>
                  <p>
                    Start from measured or realistic average usage rather than a
                    smallest-case prompt. Include system instructions, user
                    messages, conversation history, retrieved context, tool
                    descriptions, and other text that becomes model input.
                  </p>

                  <p>
                    Keep cache reads and cache writes separate. A mature workload
                    with a stable reusable prefix may have a very different cost
                    profile from a new or frequently changing prompt that keeps
                    writing fresh cache entries.
                  </p>

                  <p>
                    For output, use the answer length you expect in production.
                    A classification task, coding agent, support assistant, and
                    long-form report generator can have very different output
                    token usage even at the same request count.
                  </p>
                </>
              ),
            },
            {
              title: "Worked Example",
              content: (
                <>
                  <p>
                    Suppose an application makes 50,000 requests in a month. An
                    average request has 800 uncached input tokens, 200 cached
                    input tokens, no cache write, and 300 output tokens. Enter
                    those values, choose a model, and the calculator separates
                    each token category before adding the monthly total.
                  </p>

                  <p>
                    To compare models fairly, leave the workload unchanged and
                    change only the model. If you are comparing Standard with
                    Batch, keep the token assumptions the same so the processing
                    mode is the only changing variable.
                  </p>
                </>
              ),
            },
            {
              title: "What the Estimate Does Not Include",
              content: (
                <>
                  <p>
                    This is a text-token estimate. It does not add separate
                    charges for web search, file search, image generation,
                    audio, video, containers, storage, code execution, or other
                    paid tools and services that may be used alongside a model.
                  </p>

                  <p>
                    It also does not add regional-processing or data-residency
                    uplifts, taxes, account-specific discounts, Scale Tier or
                    other contracted capacity, credits, retries that are not
                    included in your request count, or provider changes made
                    after the checked date.
                  </p>

                  <p>
                    GPT-5.6 Sol&apos;s current listed API rate is promotional
                    according to OpenAI and is stated as available at least
                    through November 21, 2026. Re-check that rate before using
                    the result for a budget that extends beyond the promotion.
                  </p>
                </>
              ),
            },
            {
              title: "Pricing Sources and Checked Date",
              content: (
                <>
                  <p>
                    Built-in rates and billing rules were checked against
                    official OpenAI documentation on September 16, 2026. OpenAI
                    can change models, rates, caching rules, service tiers, and
                    other billing behavior after that date.
                  </p>

                  <p>
                    Review the{" "}
                    <a
                      href="https://developers.openai.com/api/docs/models"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--green)] underline-offset-4 hover:underline"
                    >
                      OpenAI model catalog ↗
                    </a>
                    ,{" "}
                    <a
                      href="https://developers.openai.com/api/docs/guides/prompt-caching"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--green)] underline-offset-4 hover:underline"
                    >
                      prompt caching guide ↗
                    </a>
                    , and{" "}
                    <a
                      href="https://developers.openai.com/api/docs/guides/batch"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--green)] underline-offset-4 hover:underline"
                    >
                      Batch API guide ↗
                    </a>{" "}
                    before making a final budget or purchase decision.
                  </p>
                </>
              ),
            },
            {
              title: "Explore Related AI Cost Tools",
              content: (
                <BeeijaRelatedTools
                  currentHref="/tools/openai-api-cost-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

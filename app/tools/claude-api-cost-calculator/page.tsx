import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Claude API Cost Calculator",

  description:
    "Estimate Claude API costs across current Fable, Opus, Sonnet, and Haiku models using prompt caching, Batch API, US-only inference, fast mode, and monthly usage.",

  keywords: [
    "Claude API cost calculator",
    "Anthropic API cost calculator",
    "Claude pricing calculator",
    "Claude token cost calculator",
    "Claude Fable cost calculator",
    "Claude Opus cost calculator",
    "Claude Sonnet cost calculator",
    "Claude Haiku cost calculator",
    "Claude prompt caching cost",
    "Claude Batch API cost",
    "Claude fast mode pricing",
    "Claude US inference pricing",
    "Anthropic pricing calculator",
  ],

  alternates: {
    canonical: "https://beeija.com/tools/claude-api-cost-calculator",
  },

  openGraph: {
    title: "Claude API Cost Calculator",
    description:
      "Estimate first-party Claude API token costs across current models, prompt caching, Batch API, US-only inference, and supported Opus fast mode.",
    url: "https://beeija.com/tools/claude-api-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Claude API Cost Calculator",
    description:
      "Estimate current Claude API token costs using your own workload and pricing assumptions.",
  },
};

const faqs = [
  {
    question: "Why is Claude Fable 5.1 cache-read pricing different?",
    answer:
      "Anthropic lists Fable 5.1 cache hits and refreshes at 0.025 times its base input rate. The other current models in this calculator use the usual 0.1 times cache-read multiplier.",
  },
  {
    question: "Does Batch API also affect prompt-caching charges?",
    answer:
      "Anthropic states that prompt-caching multipliers stack with Batch API pricing. The calculator therefore applies the Batch reduction to base input, cache writes, cache reads, and output when Batch mode is selected.",
  },
  {
    question: "Can Claude Haiku 4.5 use US-only inference?",
    answer:
      "No. Anthropic documents the first-party inference_geo setting for Claude 4.6 and later models. Haiku 4.5 stays on global routing in this calculator instead of applying a 1.1 times US-only multiplier that the API does not support.",
  },
  {
    question: "Is fast mode the same as Batch API?",
    answer:
      "No. Batch is asynchronous processing at discounted token rates. Fast mode is a research-preview option for supported Opus models that uses premium rates for higher output speed. Anthropic does not allow the two modes together.",
  },
  {
    question: "Why can my billed output tokens exceed the visible reply?",
    answer:
      "Claude thinking tokens are billed as output tokens even when the full thinking text is not shown. For a real workload, use the API usage output-token count rather than estimating only from visible response text.",
  },
  {
    question: "Will these numbers match Bedrock or Google Cloud exactly?",
    answer:
      "Not necessarily. The built-in rates model Anthropic's first-party Claude API. Amazon Bedrock, Google Cloud, Microsoft Foundry, marketplace billing, private offers, and negotiated discounts can use different commercial terms or regional pricing.",
  },
];

export default function ClaudeApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="Claude API Cost Calculator"
      description="Estimate first-party Claude API costs across current models, prompt caching, Batch API, US-only inference, and supported Opus fast mode."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Claude pricing looks simple until one request mixes ordinary
              input, cached context, internal thinking, a different processing
              mode, and a residency requirement. This calculator keeps those
              pieces separate so the estimate follows the workload you expect
              to send, rather than a single headline token price.
            </p>
          }
          sections={[
            {
              title: "What This Calculator Is Actually Pricing",
              content: (
                <>
                  <p>
                    The calculator models first-party Claude API token charges.
                    For each request, base input tokens, cache-write tokens,
                    cache-read tokens, and output tokens are priced separately,
                    then multiplied by the monthly request volume you enter.
                  </p>

                  <p>
                    Processing mode and inference geography are applied after
                    the base model rates. That matters because Anthropic allows
                    pricing modifiers to stack: prompt caching can be combined
                    with Batch processing, and supported models can also use the
                    US-only inference multiplier.
                  </p>

                  <p>
                    It is a planning estimate, not an invoice emulator. Paid
                    server tools, marketplace billing, taxes, private offers,
                    retries, and services you do not enter here remain outside
                    the total.
                  </p>
                </>
              ),
            },
            {
              title: "The Current Claude Lineup Changes the Cost Comparison",
              content: (
                <>
                  <p>
                    The built-in list follows Anthropic&apos;s current model
                    overview: Claude Fable 5.1, Claude Opus 5, Claude Sonnet 5,
                    and Claude Haiku 4.5. Their standard input and output rates
                    are not just scaled versions of one another, so switching
                    the model while keeping the workload unchanged is useful
                    for an early cost comparison.
                  </p>

                  <p>
                    There is another practical reason to re-measure instead of
                    copying an old token count. Anthropic says Claude 4.7 and
                    later models use a newer tokenizer that can produce roughly
                    30% more tokens for the same text, with the exact change
                    depending on the workload. A prompt measured on an older
                    model is therefore not a dependable token baseline for a
                    newer one.
                  </p>

                  <p>
                    Fable 5.1 also has a pricing exception worth keeping
                    visible: its cache reads are $0.25 per million tokens,
                    equivalent to 0.025× its base input rate. The other current
                    models in this calculator use the standard 0.1× cache-read
                    multiplier.
                  </p>
                </>
              ),
            },
            {
              title: "Prompt Caching Has Three Different Billable Paths",
              content: (
                <>
                  <p>
                    A cached prompt is not one generic input bucket. Anthropic
                    prices the uncached portion, the tokens written into a cache,
                    and later cache reads separately. A 5-minute write uses a
                    1.25× input-price multiplier; a 1-hour write uses 2×.
                  </p>

                  <p>
                    Cache reads are cheaper, but they only describe tokens that
                    were actually served from an existing cache. Do not enter
                    the same prompt tokens as both base input and cache reads.
                    If your application has a mix of cache hits and misses, use
                    averages from observed API usage or model the two cases
                    separately.
                  </p>

                  <p>
                    Selecting &quot;No cache write&quot; does not force cache reads to
                    zero. A request can read a cache entry created by an earlier
                    request, so the calculator keeps those two fields
                    independent.
                  </p>
                </>
              ),
            },
            {
              title: "Batch, Fast Mode, and US-Only Inference Solve Different Problems",
              content: (
                <>
                  <p>
                    Batch API is for asynchronous work that can wait. Anthropic
                    currently charges Batch usage at 50% of standard API token
                    rates, and its prompt-caching pricing can stack with that
                    discount.
                  </p>

                  <p>
                    Fast mode is different. It is a research preview for
                    supported Opus models on the first-party Claude API. It uses
                    premium rates and is designed for higher output-token speed;
                    it is not available together with Batch API. The calculator
                    exposes fast mode only where the selected built-in model
                    supports it.
                  </p>

                  <p>
                    US-only inference is another independent modifier. For
                    Claude 4.6 and later models, Anthropic applies 1.1× to input,
                    output, cache writes, and cache reads when
                    <code> inference_geo: &quot;us&quot;</code> is used. Haiku 4.5 is
                    older than that support boundary, so this calculator keeps
                    it on global routing instead of applying an invalid premium.
                  </p>
                </>
              ),
            },
            {
              title: "Use Billed Output Tokens, Not Only the Text You Can See",
              content: (
                <>
                  <p>
                    Claude&apos;s billed output can include internal thinking
                    tokens. Anthropic documents <code>output_tokens</code> as the
                    authoritative billed output total, while
                    <code>output_tokens_details.thinking_tokens</code> provides
                    a breakdown for observability.
                  </p>

                  <p>
                    This matters most when you estimate from screenshots or
                    visible response text. A short visible answer can still
                    have a larger billed output count when the model used more
                    internal reasoning. For production planning, capture actual
                    API usage from representative requests whenever possible.
                  </p>
                </>
              ),
            },
            {
              title: "A Practical Way to Build a Monthly Claude Estimate",
              content: (
                <ol className="list-decimal space-y-3 pl-6">
                  <li>
                    Run several requests that resemble the real product flow,
                    including system instructions, tools, retrieved context,
                    and realistic conversation history.
                  </li>
                  <li>
                    Record the average base input, cache creation, cache read,
                    and billed output tokens from the API usage fields.
                  </li>
                  <li>
                    Enter the expected monthly request volume, then choose the
                    processing mode and inference geography that your actual
                    deployment will use.
                  </li>
                  <li>
                    Check a normal month and a busier month rather than relying
                    on one optimistic traffic number.
                  </li>
                  <li>
                    If you have negotiated rates or a private commercial
                    agreement, switch to custom standard prices before applying
                    the workload modifiers.
                  </li>
                </ol>
              ),
            },
            {
              title: "What the Estimate Leaves Out",
              content: (
                <>
                  <p>
                    Server-side tools can add their own charges. Web search, for
                    example, is billed separately from model tokens. Tool
                    schemas and tool-result content can also increase normal
                    input usage, so those tokens should be present in the usage
                    figures you enter if they are part of your workflow.
                  </p>

                  <p>
                    The calculator also does not reproduce rate limits,
                    marketplace billing, enterprise discounts, credits, taxes,
                    minimum commitments, or every product-specific charge. It
                    warns when your entered request shape exceeds the listed
                    context or output limits, but it is not a full API request
                    validator.
                  </p>

                  <p>
                    <strong>Pricing checked: September 17, 2026.</strong> Check
                    Anthropic&apos;s current documentation again before a purchase,
                    launch, or budget approval because models and billing rules
                    can change.
                  </p>
                </>
              ),
            },
            {
              title: "Official Anthropic References",
              content: (
                <div className="grid gap-4 md:grid-cols-2">
                  <ReferenceLink
                    href="https://platform.claude.com/docs/en/about-claude/pricing"
                    title="Claude API pricing"
                    description="Current model, caching, Batch, residency, fast-mode, and tool pricing."
                  />
                  <ReferenceLink
                    href="https://platform.claude.com/docs/en/models/overview"
                    title="Claude models overview"
                    description="Current model lineup, context windows, output limits, and model IDs."
                  />
                  <ReferenceLink
                    href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
                    title="Prompt caching"
                    description="Cache write durations, cache-read behavior, and pricing multipliers."
                  />
                  <ReferenceLink
                    href="https://platform.claude.com/docs/en/build-with-claude/batch-processing"
                    title="Batch processing"
                    description="Batch API behavior and the current discounted token pricing."
                  />
                  <ReferenceLink
                    href="https://platform.claude.com/docs/en/manage-claude/data-residency"
                    title="Data residency"
                    description="Global versus US-only inference support and pricing."
                  />
                  <ReferenceLink
                    href="https://platform.claude.com/docs/en/build-with-claude/fast-mode"
                    title="Fast mode"
                    description="Supported Opus models, availability limits, and premium pricing."
                  />
                </div>
              ),
            },
            {
              title: "Questions That Usually Change the Estimate",
              content: (
                <div className="space-y-6">
                  {faqs.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                      <p className="mt-2">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              title: "Explore Related AI Cost Tools",
              content: (
                <BeeijaRelatedTools
                  currentHref="/tools/claude-api-cost-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

function ReferenceLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--green)] hover:shadow-sm"
    >
      <span className="font-semibold text-gray-900">{title}</span>
      <span className="mt-2 block text-sm leading-relaxed text-gray-600">
        {description}
      </span>
      <span className="mt-3 block text-sm font-medium text-[var(--green)]">
        Open official documentation →
      </span>
    </a>
  );
}

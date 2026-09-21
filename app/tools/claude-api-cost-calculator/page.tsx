import type { Metadata } from "next";
import type { ReactNode } from "react";
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
      "Anthropic lists Fable 5.1 cache hits and refreshes at 0.025 times its base input rate. The other current models listed here use the usual 0.1 times cache-read multiplier.",
  },
  {
    question: "Does Batch API also affect prompt-caching charges?",
    answer:
      "Anthropic states that prompt-caching multipliers stack with Batch API pricing. Batch mode therefore reduces the base input, cache-write, cache-read, and output rates together.",
  },
  {
    question: "Can Claude Haiku 4.5 use US-only inference?",
    answer:
      "No. Anthropic documents the first-party inference_geo setting for Claude 4.6 and later models. Haiku 4.5 only supports global routing, so no 1.1 times US-only multiplier applies.",
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
              mode, and a residency requirement. Keeping those pieces separate
              makes the monthly estimate follow the workload you expect to send
              instead of one headline token price.
            </p>
          }
          sections={[
            {
              title: "Start With the Four Token Buckets Claude Bills Separately",
              content: (
                <>
                  <p>
                    A first-party Claude API request can put usage into four
                    separate billable buckets: base input, cache creation, cache
                    reads, and output. Each bucket has its own rate before the
                    per-request usage is multiplied by monthly request volume.
                  </p>

                  <p>
                    Processing mode and inference geography are applied after
                    the base model rates. That matters because Anthropic allows
                    pricing modifiers to stack: prompt caching can be combined
                    with Batch processing, and supported models can also use the
                    US-only inference multiplier.
                  </p>

                  <p>
                    The result is a planning estimate, not a provider invoice.
                    Paid server tools, marketplace billing, taxes, private offers,
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
                    are not just scaled versions of one another. Keeping the
                    workload unchanged while switching models shows how much
                    model choice alone changes the monthly total.
                  </p>

                  <p>
                    There is another reason to re-measure instead of copying an
                    old token count. Anthropic says Claude 4.7 and
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
                    models listed here use the standard 0.1× cache-read
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
                    it is not available together with Batch API. Fast mode only
                    appears here when the selected built-in model supports it.
                    Anthropic currently requires <code>speed: &quot;fast&quot;</code>, the
                    fast-mode beta header, and preview access through an account
                    manager or waitlist rather than treating it as a universally
                    available API setting.
                  </p>

                  <p>
                    US-only inference is another independent modifier. For
                    Claude 4.6 and later models, Anthropic applies 1.1× to input,
                    output, cache writes, and cache reads when
                    <code> inference_geo: &quot;us&quot;</code> is used. Haiku 4.5 is
                    older than that support boundary, so global routing remains
                    the only valid choice here. Inference geography is also
                    separate from workspace data-storage geography; this estimate
                    prices the inference setting, not every residency control.
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
              title: "Build the Estimate From Real API Usage",
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
              title: "Costs and Boundaries Outside the Token Total",
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
                    Rate limits, marketplace billing, negotiated discounts,
                    credits, taxes, minimum commitments, and every product-specific
                    charge sit outside this token total. Request-shape checks on
                    the page cover the listed context and output limits, not every
                    validation rule enforced by the Messages API.
                  </p>

                  <p>
                    Custom prices replace the standard token rates, while the
                    public Batch, fast-mode, and inference-geography multipliers
                    still apply. If a private agreement changes those multiplier
                    rules too, use the effective contracted rates rather than
                    assuming this public-pricing model will match the invoice.
                  </p>

                  <p>
                    All arithmetic runs in the browser from the numeric usage and
                    price values entered here. There is no prompt or API-key field,
                    and changing a value does not send that value to Anthropic.
                    Opening an official documentation link is a separate browser
                    request to that site.
                  </p>
                </>
              ),
            },
            {
              title: "Official Anthropic References",
              content: (
                <>
                  <p>
                    <strong>Pricing checked: September 21, 2026.</strong> These
                    links cover the rates and API behaviors that materially change
                    the estimate. Recheck them before a launch or budget approval
                    because model availability and billing rules can change.
                  </p>
                  <ul className="mt-5 space-y-4">
                    <ReferenceItem
                      href="https://platform.claude.com/docs/en/about-claude/pricing"
                      title="Claude API pricing"
                    >
                      Model rates, cache pricing, Batch discounts, residency
                      multipliers, fast mode, and separately billed tools.
                    </ReferenceItem>
                    <ReferenceItem
                      href="https://platform.claude.com/docs/en/models/overview"
                      title="Claude models overview"
                    >
                      Current model lineup, model IDs, context windows, and
                      maximum output sizes.
                    </ReferenceItem>
                    <ReferenceItem
                      href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
                      title="Prompt caching"
                    >
                      Cache-write durations, cache reads, breakpoints, and the
                      behavior behind the caching fields above.
                    </ReferenceItem>
                    <ReferenceItem
                      href="https://platform.claude.com/docs/en/build-with-claude/batch-processing"
                      title="Batch processing"
                    >
                      Asynchronous request behavior and the 50% token discount.
                    </ReferenceItem>
                    <ReferenceItem
                      href="https://platform.claude.com/docs/en/manage-claude/data-residency"
                      title="Data residency"
                    >
                      The <code>inference_geo</code> support boundary, US-only
                      multiplier, and distinction from workspace geography.
                    </ReferenceItem>
                    <ReferenceItem
                      href="https://platform.claude.com/docs/en/build-with-claude/fast-mode"
                      title="Fast mode"
                    >
                      Supported Opus models, gated preview access, the required
                      request setting, and Batch incompatibility.
                    </ReferenceItem>
                    <ReferenceItem
                      href="https://platform.claude.com/docs/en/build-with-claude/context-windows"
                      title="Context windows"
                    >
                      Input overflow, output interaction, and
                      <code> model_context_window_exceeded</code> behavior.
                    </ReferenceItem>
                  </ul>
                </>
              ),
            },
            {
              title: "Claude Pricing Questions That Change the Math",
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
                <div className="mt-4">
                  <BeeijaRelatedTools
                    currentHref="/tools/claude-api-cost-calculator"
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

function ReferenceItem({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="border-l-4 border-gray-200 pl-4">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-[var(--green)] underline decoration-1 underline-offset-4 hover:no-underline"
      >
        {title}
      </a>
      <p className="mt-1 leading-relaxed text-gray-600">{children}</p>
    </li>
  );
}

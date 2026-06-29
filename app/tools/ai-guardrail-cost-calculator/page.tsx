import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Guardrail Cost Calculator",
  description:
    "Estimate AI guardrail, moderation, policy-check, regeneration, human-review, setup, and model costs before and after safety controls are added.",
  keywords: [
    "AI guardrail cost calculator",
    "AI moderation cost calculator",
    "content safety cost calculator",
    "LLM guardrail cost",
    "AI safety filter cost calculator",
    "AI human review cost calculator",
    "LLM policy check cost",
    "AI regeneration cost calculator",
    "AI safety workflow cost",
    "content moderation unit economics",
    "AI guardrail ROI calculator",
    "AI moderation budget calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-guardrail-cost-calculator",
  },
  openGraph: {
    title: "AI Guardrail Cost Calculator",
    description:
      "Calculate pre-generation checks, post-generation checks, policy graders, regeneration, human escalation, setup, and net monthly guardrail impact.",
    url: "https://beeija.com/tools/ai-guardrail-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Guardrail Cost Calculator",
    description:
      "Estimate guardrail cost per request, delivered response, month, and first year.",
  },
};

const faqs = [
  {
    question: "What costs should an AI guardrail estimate include?",
    answer:
      "A complete estimate can include input moderation, output moderation, custom policy graders, regeneration attempts, human escalation, fixed platform fees, monitoring, and implementation work.",
  },
  {
    question: "Why can input checks reduce model spend?",
    answer:
      "When a request is blocked before generation, the main model call may be avoided. The calculator subtracts that avoided generation cost when comparing the guarded workflow with an all-generation baseline.",
  },
  {
    question: "Why do output checks sometimes increase model spend?",
    answer:
      "A response that fails a post-generation policy check may be regenerated, rewritten, escalated, or withheld. Regeneration adds another model call and another output check.",
  },
  {
    question: "How should I estimate policy-trigger rates?",
    answer:
      "Use evaluation data or production logs from the exact application. Generic percentages can be misleading because trigger rates depend on the audience, product, policy, prompt, model, and thresholds.",
  },
  {
    question: "Why are all provider prices blank?",
    answer:
      "Guardrail services use different billing units and some provider features may have no direct usage charge. Blank fields prevent example prices from appearing as current official rates. Enter the effective cost for the exact services being considered.",
  },
  {
    question: "What is the break-even input-block rate?",
    answer:
      "It is the approximate percentage of requests that must be stopped before generation for avoided model spend to cover the entered guardrail operating and amortised setup costs.",
  },
];

export default function AiGuardrailCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Guardrail Cost Calculator"
      description="Estimate the complete cost of pre-generation and post-generation safety controls, including moderation checks, policy graders, regeneration, human review, platform fees, and setup."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              AI safety controls can add moderation calls, policy checks,
              regeneration, and human review. They can also avoid some model
              calls by stopping disallowed requests before generation. This
              calculator measures both sides of that cost.
            </p>
          }
          sections={[
            {
              title: "Comparing a Guarded Workflow With the Baseline",
              content: (
                <>
                  <p>
                    Enter monthly requests, average model tokens, and current
                    model prices. The baseline assumes every request reaches the
                    main model once.
                  </p>

                  <p>
                    The guarded workflow first applies input checks. Requests
                    that pass are generated and can then receive output checks.
                    Failed outputs may be regenerated according to the selected
                    retry coverage and success rate.
                  </p>

                  <p>
                    The result compares total guarded cost with the baseline,
                    showing avoided generation spend, regeneration spend,
                    guardrail-only cost, and net monthly impact.
                  </p>
                </>
              ),
            },
            {
              title: "Modelling Input and Output Guardrails",
              content: (
                <>
                  <p>
                    Input guardrails can detect policy violations, prompt
                    attacks, disallowed topics, unsafe requests, or
                    application-specific restrictions before generation.
                  </p>

                  <p>
                    Output guardrails can inspect the generated response for
                    policy, safety, privacy, groundedness, format, or business
                    rules before it is delivered.
                  </p>

                  <p>
                    Enter an effective price per 1,000 input checks and output
                    checks. This lets the calculator support providers that bill
                    by requests, text units, policy units, or an internal
                    service after you convert the charge into an effective
                    per-check rate.
                  </p>
                </>
              ),
            },
            {
              title: "Adding a Custom Policy Model",
              content: (
                <>
                  <p>
                    Some workflows use a language model as an additional policy
                    grader. Enter the percentage of checks sent to that model,
                    its average input and output tokens, and its current token
                    prices.
                  </p>

                  <p>
                    Keep the percentage at zero when the workflow uses only
                    rule-based checks or a dedicated moderation service.
                  </p>
                </>
              ),
            },
            {
              title: "Including Regeneration and Human Escalation",
              content: (
                <>
                  <p>
                    Output failures can create extra model calls. Enter the share
                    of failed outputs that are regenerated, the average number
                    of attempts, and the expected success rate after
                    regeneration.
                  </p>

                  <p>
                    Flagged input or output decisions may also be escalated to a
                    person. Human-review cost is calculated from escalation
                    rate, review time, and hourly labour rate.
                  </p>

                  <p>
                    OpenAI recommends moderation, adversarial testing, and human
                    oversight as safety practices. Azure AI Content Safety and
                    Amazon Bedrock Guardrails are examples of managed services
                    that can support text or multimodal safety controls.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://platform.openai.com/docs/guides/moderation"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenAI Moderation Guide
                    </a>

                    <a
                      href="https://platform.openai.com/docs/guides/safety-best-practices"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenAI Safety Practices
                    </a>

                    <a
                      href="https://learn.microsoft.com/en-us/azure/ai-services/content-safety/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Azure AI Content Safety
                    </a>

                    <a
                      href="https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Amazon Bedrock Guardrails
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate safety-control cost before launch.</li>
                  <li>Compare pre-generation and post-generation checking.</li>
                  <li>Measure model spend avoided by input blocking.</li>
                  <li>Include regeneration caused by failed output checks.</li>
                  <li>Plan model-based policy grading and human escalation.</li>
                  <li>Calculate cost per request and delivered response.</li>
                  <li>Find the approximate input-block rate needed to break even.</li>
                  <li>Check monthly and first-year guardrail budgets.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Risks Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically value reduced safety risk,
                    fewer policy incidents, lower support burden, or improved
                    user trust. It also excludes legal review, compliance,
                    appeals, red-team work, data storage, taxes, and unexpected
                    provider charges unless entered.
                  </p>

                  <p>
                    Trigger rates and thresholds must be tested. A low-cost
                    system with poor recall or too many false positives can
                    still create substantial business risk.
                  </p>
                </>
              ),
            },
            {
              title: "Frequently Asked Questions",
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
                  currentHref="/tools/ai-guardrail-cost-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

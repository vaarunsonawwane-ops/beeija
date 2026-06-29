import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Model Routing Savings Calculator",
  description:
    "Estimate savings from routing easy AI requests to a lower-cost model while sending complex requests and fallbacks to a premium model.",
  keywords: [
    "AI model routing savings calculator",
    "LLM routing cost calculator",
    "AI model router cost",
    "cheap model premium model calculator",
    "LLM fallback cost calculator",
    "AI inference routing savings",
    "model cascade cost calculator",
    "AI gateway cost calculator",
    "LLM cost optimization calculator",
    "AI model routing ROI",
    "multi model inference cost",
    "AI routing break even calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-model-routing-savings-calculator",
  },
  openGraph: {
    title: "AI Model Routing Savings Calculator",
    description:
      "Compare an all-premium baseline with a routed low-cost and premium model workflow, including fallbacks, retries, gateway fees, and setup.",
    url: "https://beeija.com/tools/ai-model-routing-savings-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Model Routing Savings Calculator",
    description:
      "Calculate routed model cost, fallback spend, unresolved requests, monthly savings, and break-even traffic share.",
  },
};

const faqs = [
  {
    question: "What is AI model routing?",
    answer:
      "Model routing sends different requests to different models. Simple or predictable tasks may go to a lower-cost model, while difficult requests, high-risk work, or failed attempts are sent to a stronger premium model.",
  },
  {
    question: "Why does the calculator include a low-cost model pass rate?",
    answer:
      "Not every request routed to a smaller model will meet the required quality level. The pass rate estimates how many routed requests finish successfully without using the premium fallback.",
  },
  {
    question: "What is fallback coverage?",
    answer:
      "Fallback coverage is the share of failed low-cost-model requests that are retried on the premium model. A lower value can save money but may leave more requests unresolved.",
  },
  {
    question: "Why are all model prices blank?",
    answer:
      "Routing can combine any providers or private agreements. Blank fields prevent example rates from looking like current official prices. Enter the exact live rates for the models and gateway being considered.",
  },
  {
    question: "How is the break-even routing share calculated?",
    answer:
      "The tool scans possible low-cost routing shares and finds the smallest share where the routed monthly planning cost is no higher than the all-premium baseline.",
  },
  {
    question: "Does lower cost mean the routing plan is better?",
    answer:
      "No. Quality, latency, safety, regional availability, provider reliability, fallback behaviour, observability, and unresolved requests should be reviewed alongside cost.",
  },
];

export default function AiModelRoutingSavingsCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Model Routing Savings Calculator"
      description="Compare an all-premium AI workflow with a routed low-cost and premium model strategy, including fallbacks, retries, gateway fees, setup, and unresolved requests."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              A model router can send routine requests to a lower-cost model and
              reserve a stronger model for complex work. The saving depends on
              routing share, quality pass rate, fallback behaviour, retries, and
              the cost of running the router itself.
            </p>
          }
          sections={[
            {
              title: "Comparing Routing With an All-Premium Baseline",
              content: (
                <>
                  <p>
                    Enter monthly request volume, token usage, and the current
                    input and output prices for a low-cost model and a premium
                    model. The baseline assumes every request uses the premium
                    model.
                  </p>

                  <p>
                    The routed workflow sends the selected traffic share to the
                    low-cost model. Requests that do not pass the quality check
                    can be escalated to the premium model according to the
                    fallback coverage entered.
                  </p>

                  <p>
                    The result separates low-cost-model spend, direct premium
                    spend, premium fallback spend, gateway charges, fixed costs,
                    and amortised setup.
                  </p>
                </>
              ),
            },
            {
              title: "Including Quality and Fallback Behaviour",
              content: (
                <>
                  <p>
                    A routing plan is not complete without a quality estimate.
                    The low-cost model pass rate should come from evaluations or
                    production logs for the exact tasks being routed.
                  </p>

                  <p>
                    Fallback coverage controls how many failed low-cost attempts
                    are retried on the premium model. Full fallback coverage can
                    protect completion rate but increases premium usage.
                  </p>

                  <p>
                    The calculator shows the estimated unresolved request count
                    when failed low-cost requests are not fully escalated.
                  </p>
                </>
              ),
            },
            {
              title: "Accounting for Router and Gateway Costs",
              content: (
                <>
                  <p>
                    Routing can be implemented with deterministic rules, a
                    classifier, a separate model call, or a managed gateway. Add
                    the combined router cost per 1,000 requests, any percentage
                    platform fee, and fixed monthly gateway cost.
                  </p>

                  <p>
                    One-time implementation and evaluation work can be spread
                    across a chosen number of months. This produces a planning
                    cost that is more realistic than looking only at inference
                    tokens.
                  </p>
                </>
              ),
            },
            {
              title: "Using Routing Safely",
              content: (
                <>
                  <p>
                    Route only task groups that have clear evaluation results.
                    High-risk, ambiguous, regulated, or difficult requests may
                    need to stay on the premium path.
                  </p>

                  <p>
                    Track model choice, cost, latency, fallback rate, accepted
                    output, and unresolved requests. Recheck thresholds when
                    prompts, models, providers, or traffic patterns change.
                  </p>

                  <p>
                    Amazon Bedrock documents intelligent prompt routing as a way
                    to balance response quality and cost within supported model
                    families. OpenRouter also supports model and provider
                    routing, fallbacks, budgets, and spend controls.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-routing.html"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Amazon Bedrock Prompt Routing
                    </a>

                    <a
                      href="https://openrouter.ai/docs/guides/routing/routers"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenRouter Routing
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate savings before building a model router.</li>
                  <li>Compare all-premium and tiered-model inference costs.</li>
                  <li>Measure the premium fallback cost of quality failures.</li>
                  <li>Include gateway, platform, retry, and implementation costs.</li>
                  <li>Estimate unresolved requests under partial fallback.</li>
                  <li>Find the minimum low-cost routing share needed to break even.</li>
                  <li>Calculate cost per request and cost per resolved request.</li>
                  <li>Check the routed workflow against a monthly budget.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Risks Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically value answer quality,
                    latency, safety, customer satisfaction, regulatory risk, or
                    provider reliability. It also excludes taxes, data transfer,
                    observability, support, evaluation labour, and unexpected
                    provider changes unless entered.
                  </p>

                  <p>
                    Average token values can hide expensive long requests.
                    Review percentile-level production data before setting
                    routing thresholds or customer pricing.
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
                  currentHref="/tools/ai-model-routing-savings-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

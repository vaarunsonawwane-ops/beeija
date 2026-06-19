import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Agent Workflow Cost Calculator",
  description:
    "Estimate the real cost of a multi-step AI agent using planner and worker models, context growth, retries, tool calls, memory operations, human review, infrastructure, and revenue.",
  keywords: [
    "AI agent cost calculator",
    "AI agent workflow cost calculator",
    "LLM agent cost calculator",
    "multi step AI workflow cost",
    "agent tool call cost calculator",
    "AI agent unit economics",
    "AI agent pricing calculator",
    "agentic workflow cost",
    "AI automation cost calculator",
    "LLM context growth cost",
    "AI agent margin calculator",
    "AI agent cost per task",
    "AI agent ROI calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-agent-workflow-cost-calculator",
  },
  openGraph: {
    title: "AI Agent Workflow Cost Calculator",
    description:
      "Calculate planner, worker, tool, memory, retry, human-review, infrastructure, and margin costs for multi-step AI agents.",
    url: "https://beeija.com/tools/ai-agent-workflow-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agent Workflow Cost Calculator",
    description:
      "Estimate complete AI agent cost per run, per successful task, per month, and at your target margin.",
  },
};

const faqs = [
  {
    question: "Why is an AI agent more expensive than a single model call?",
    answer:
      "An agent can make several planner and worker calls, carry growing context across steps, call paid tools, retry failed actions, use memory, and send some runs to human review. The calculator includes these layers separately.",
  },
  {
    question: "What does context growth per step mean?",
    answer:
      "Tool results, prior decisions, retrieved data, and intermediate outputs can make later model calls larger than earlier calls. The calculator adds the entered number of input tokens to each later worker step.",
  },
  {
    question: "How should I estimate retry overhead?",
    answer:
      "Use logs when available. Include repeated model calls and tool calls caused by timeouts, invalid output, failed actions, self-correction, or agent loops. A 10% value means the model and tool workload is increased by 10%.",
  },
  {
    question: "Why are provider prices blank?",
    answer:
      "Agent workflows can use different models and paid tools. Blank rates prevent example prices from appearing as verified live prices. Enter current official rates for the exact planner, worker, tool, memory, and labour services being considered.",
  },
  {
    question: "What is the difference between cost per run and cost per successful run?",
    answer:
      "Cost per run divides spend across every attempted run. Cost per successful run divides the same spend only across the runs expected to complete successfully, so it reflects failure and abandonment.",
  },
  {
    question: "How is the price needed for target margin calculated?",
    answer:
      "The calculator divides planning cost per successful run by one minus the target gross-margin percentage. This is a planning price before payment fees, tax, support, sales, and other business costs.",
  },
];

export default function AiAgentWorkflowCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Agent Workflow Cost Calculator"
      description="Estimate complete multi-step AI agent costs across planner and worker models, context growth, retries, tool calls, memory, human review, infrastructure, and product margin."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              An AI agent is rarely one model request. A single task can include
              planning, several worker steps, tool calls, growing context,
              retries, memory operations, and human review. This calculator
              turns those moving parts into a cost per run, successful task,
              month, and year.
            </p>
          }
          sections={[
            {
              title: "Planning the Full Cost of an Agent Run",
              content: (
                <>
                  <p>
                    Start with monthly agent runs, steps per run, planner calls,
                    worker calls, and token usage. The calculator models planner
                    and worker models separately because many systems use a more
                    capable model for planning and a lower-cost model for
                    repeated execution.
                  </p>

                  <p>
                    Add context growth, retry overhead, paid tool calls, memory
                    operations, infrastructure, and human review. The result
                    separates model spend from the wider workflow cost.
                  </p>

                  <p>
                    One-time implementation cost can be spread across a chosen
                    period to produce a monthly planning cost instead of hiding
                    setup work outside the estimate.
                  </p>
                </>
              ),
            },
            {
              title: "Modelling Context Growth Across Steps",
              content: (
                <>
                  <p>
                    Later agent steps often receive more context than the first
                    step. Tool responses, retrieved documents, intermediate
                    plans, and earlier outputs can all be carried forward.
                  </p>

                  <p>
                    Enter the base worker input tokens and the extra input tokens
                    added at each step. The calculator uses an increasing
                    sequence rather than assuming every worker call has the same
                    input size.
                  </p>

                  <p>
                    This is especially useful for research agents, coding
                    agents, browser agents, support workflows, and multi-tool
                    automation.
                  </p>
                </>
              ),
            },
            {
              title: "Including Tools, Memory, and Human Review",
              content: (
                <>
                  <p>
                    Paid search, browsing, data enrichment, code execution,
                    maps, email, documents, databases, and other APIs can add a
                    separate charge to each run.
                  </p>

                  <p>
                    Memory may also create vector reads, writes, database
                    operations, or managed-platform charges. Enter these as a
                    price per 1,000 operations.
                  </p>

                  <p>
                    Human review is calculated from the share of runs reviewed,
                    average review time, and hourly labour rate.
                  </p>
                </>
              ),
            },
            {
              title: "Using the Unit Economics Result",
              content: (
                <>
                  <p>
                    The calculator shows operating cost per attempted run and
                    per successful run. Add the amount charged for each
                    successful task to estimate monthly revenue, gross profit,
                    and gross margin.
                  </p>

                  <p>
                    The break-even price covers the entered planning cost. The
                    target-margin price adds the headroom needed for the selected
                    gross-margin goal.
                  </p>

                  <p>
                    These figures help decide whether to reduce steps, move
                    worker tasks to a lower-cost model, limit retries, shorten
                    context, replace paid tools, or change product pricing.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate the cost of a multi-step agent before launch.</li>
                  <li>Separate planner and worker model economics.</li>
                  <li>Measure the effect of context growth and retry loops.</li>
                  <li>Add paid tools, memory, infrastructure, and human review.</li>
                  <li>Calculate cost per successful task rather than only per run.</li>
                  <li>Find the price needed for a target gross margin.</li>
                  <li>Check monthly budget and first-year spend.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Risks Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include payment fees,
                    taxes, customer support, sales, refunds, free-tier abuse,
                    observability, data transfer, security review, compliance,
                    downtime, or the business cost of incorrect agent actions.
                  </p>

                  <p>
                    Average values can hide expensive long-tail runs. Review
                    median, high-percentile, and worst-case production data when
                    setting limits and pricing.
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
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/tools/ai-token-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Token Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-prompt-caching-savings-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Prompt Caching Savings Calculator
                  </Link>

                  <Link
                    href="/tools/ai-batch-api-savings-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Batch API Savings Calculator
                  </Link>

                  <Link
                    href="/tools/rag-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    RAG Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-reranking-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Reranking Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-voice-agent-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Voice Agent Cost Calculator
                  </Link>

                  <Link
                    href="/categories/ai-cost-calculators"
                    className="beeija-btn-outline"
                  >
                    AI Cost Calculators
                  </Link>
                </div>
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

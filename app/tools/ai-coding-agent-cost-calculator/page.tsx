import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Coding Agent Cost Calculator",
  description:
    "Estimate AI coding-agent cost across planning, code edits, repair loops, review, CI runs, human approval, setup, success rate, and manual developer savings.",
  keywords: [
    "AI coding agent cost calculator",
    "coding agent cost calculator",
    "AI software development cost calculator",
    "LLM coding cost calculator",
    "Claude Code cost calculator",
    "Codex cost calculator",
    "AI developer agent cost",
    "AI code generation cost calculator",
    "coding automation ROI calculator",
    "AI pull request cost calculator",
    "AI coding unit economics",
    "software engineering agent cost",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-coding-agent-cost-calculator",
  },
  openGraph: {
    title: "AI Coding Agent Cost Calculator",
    description:
      "Calculate planning, implementation, repair, review, CI, human approval, setup, and cost per successful coding task.",
    url: "https://beeija.com/tools/ai-coding-agent-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Coding Agent Cost Calculator",
    description:
      "Estimate coding-agent cost per task, successful task, month, and first year.",
  },
};

const faqs = [
  {
    question: "What costs should an AI coding-agent estimate include?",
    answer:
      "A complete estimate can include planning calls, code-edit iterations, test-repair loops, review-model calls, CI or sandbox execution, human approval, fixed platform fees, and implementation work.",
  },
  {
    question: "Why does context size matter so much?",
    answer:
      "Coding agents often send repository files, diffs, test output, issue history, and prior reasoning back to the model. Larger context increases input-token cost across every planning, editing, and review call.",
  },
  {
    question: "What should count as a repair attempt?",
    answer:
      "Include repeated model calls caused by failing tests, lint errors, build failures, incomplete changes, merge conflicts, or code-review feedback.",
  },
  {
    question: "Why are all model prices blank?",
    answer:
      "Coding agents can use different providers, models, gateways, and private agreements. Blank fields prevent example rates from appearing as current official prices. Enter the live rates for the exact planner, coding, and review models being considered.",
  },
  {
    question: "How is the manual-development baseline calculated?",
    answer:
      "The calculator multiplies manual developer hours per task by the developer hourly rate and monthly task volume. This baseline can be compared with the automated workflow.",
  },
  {
    question: "What is the break-even monthly task volume?",
    answer:
      "It is the approximate task volume needed for per-task labour savings to cover recurring platform costs and the amortised share of implementation cost.",
  },
];

export default function AiCodingAgentCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Coding Agent Cost Calculator"
      description="Estimate the full cost of AI-assisted software work across planning, code generation, repair loops, review, CI execution, human approval, setup, and delivery success."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Coding agents rarely finish a task in one model call. A production
              workflow can include repository analysis, planning, several edit
              iterations, test-repair loops, review, sandbox execution, and
              human approval. This calculator combines those costs.
            </p>
          }
          sections={[
            {
              title: "Calculating the Full Coding-Agent Workflow",
              content: (
                <>
                  <p>
                    Enter monthly coding tasks, planning calls, implementation
                    iterations, repair attempts, review calls, and expected
                    success rate. The calculator turns these into total model
                    calls and token usage.
                  </p>

                  <p>
                    Planner, coding, and review models can have different input
                    and output prices. This supports workflows that use a
                    stronger planning model, a lower-cost implementation model,
                    or a separate review model.
                  </p>

                  <p>
                    CI or sandbox runs, fixed platform costs, human approval, and
                    implementation work are included separately from model
                    tokens.
                  </p>
                </>
              ),
            },
            {
              title: "Modelling Repository Context and Iteration",
              content: (
                <>
                  <p>
                    Enter the average repository context sent to planning,
                    coding, and review calls. This can include source files,
                    dependency information, issue text, diffs, logs, and test
                    output.
                  </p>

                  <p>
                    Coding iterations represent planned edit cycles. Repair
                    attempts represent extra cycles caused by failed tests,
                    builds, linting, incomplete output, or review feedback.
                  </p>

                  <p>
                    Retry overhead adds repeated calls caused by timeouts,
                    malformed output, tool errors, or other workflow failures.
                  </p>
                </>
              ),
            },
            {
              title: "Including CI, Sandbox, and Human Approval",
              content: (
                <>
                  <p>
                    Coding agents may run tests, builds, linters, package
                    installs, code execution, or browser checks in a sandbox.
                    Enter the average executions per task and the effective price
                    per 1,000 executions.
                  </p>

                  <p>
                    Human approval is calculated from the share of tasks
                    reviewed, minutes per review, and developer hourly rate.
                    This can represent pull-request review, security review, or
                    final acceptance.
                  </p>
                </>
              ),
            },
            {
              title: "Comparing With Manual Development",
              content: (
                <>
                  <p>
                    Enter the manual developer hours needed for one comparable
                    task. The calculator creates a manual-only labour baseline
                    and compares it with the coding-agent workflow.
                  </p>

                  <p>
                    Results include monthly operating savings, first-year
                    savings, cost per attempted task, cost per successful task,
                    implementation payback, and approximate break-even task
                    volume.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate AI coding-agent cost before rollout.</li>
                  <li>Separate planner, coding, and review-model spend.</li>
                  <li>Measure the cost of repair loops and failed tests.</li>
                  <li>Include CI, sandbox, and execution charges.</li>
                  <li>Estimate human pull-request review labour.</li>
                  <li>Calculate cost per successful coding task.</li>
                  <li>Compare automation with manual developer effort.</li>
                  <li>Find implementation payback and break-even volume.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Risks Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include repository
                    hosting, storage, data transfer, secrets management,
                    security review, observability, support, taxes, failed
                    deployments, or the cost of incorrect code unless entered.
                  </p>

                  <p>
                    Task difficulty varies widely. Review simple fixes, medium
                    changes, and complex work separately instead of relying on
                    one average for every software task.
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
                    href="/tools/ai-agent-workflow-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Agent Workflow Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-token-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Token Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-model-routing-savings-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Model Routing Savings Calculator
                  </Link>

                  <Link
                    href="/tools/ai-prompt-caching-savings-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Prompt Caching Savings Calculator
                  </Link>

                  <Link
                    href="/tools/ai-evaluation-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Evaluation Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-document-processing-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Document Processing Cost Calculator
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

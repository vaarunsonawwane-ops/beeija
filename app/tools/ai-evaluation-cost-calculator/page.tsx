import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Evaluation Cost Calculator",
  description:
    "Estimate the cost of AI model evaluations using candidate inference, model graders, deterministic checks, repeated runs, human review, dataset preparation, and platform costs.",
  keywords: [
    "AI evaluation cost calculator",
    "LLM eval cost calculator",
    "model evaluation cost calculator",
    "AI model judge cost calculator",
    "LLM as a judge cost",
    "agent evaluation cost calculator",
    "AI benchmark cost calculator",
    "OpenAI evals cost calculator",
    "AI testing cost calculator",
    "human review cost calculator",
    "model comparison cost calculator",
    "AI evaluation budget calculator",
    "LLM evaluation unit economics",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-evaluation-cost-calculator",
  },
  openGraph: {
    title: "AI Evaluation Cost Calculator",
    description:
      "Calculate candidate-model inference, judge-model grading, human review, repeated runs, setup, and first-year evaluation costs.",
    url: "https://beeija.com/tools/ai-evaluation-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Evaluation Cost Calculator",
    description:
      "Estimate cost per evaluation item, candidate output, monthly run, and first year.",
  },
};

const faqs = [
  {
    question: "What costs should an AI evaluation include?",
    answer:
      "A complete estimate can include candidate-model inference, model-based graders, repeated runs, failed or retried items, human review, dataset preparation, platform fees, and evaluation maintenance.",
  },
  {
    question: "What is a model grader?",
    answer:
      "A model grader uses another language model to score, classify, compare, or critique a candidate output. It creates its own input and output token usage.",
  },
  {
    question: "Do deterministic graders add model cost?",
    answer:
      "String checks, exact matches, code checks, and similar deterministic graders may not require a judge-model call. Their engineering or platform cost can be entered under fixed monthly or setup costs.",
  },
  {
    question: "Why include repeated evaluation runs?",
    answer:
      "Teams often rerun the same evaluation after prompt changes, model updates, routing changes, fine-tuning, retrieval changes, or releases. The monthly run count captures that continuing work.",
  },
  {
    question: "Why are all monetary prices blank?",
    answer:
      "Evaluation stacks can combine different providers and private agreements. Blank fields prevent example prices from appearing as current official rates. Enter the live prices for the exact candidate and judge models being tested.",
  },
  {
    question: "How is selective human review compared with full review?",
    answer:
      "The calculator estimates the labour cost of reviewing only the selected percentage of outputs and compares it with reviewing every candidate output using the same review time and hourly rate.",
  },
];

export default function AiEvaluationCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Evaluation Cost Calculator"
      description="Estimate the full cost of testing AI models and agents across candidate inference, automated graders, repeated runs, human review, dataset preparation, and platform costs."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Model evaluation has its own operating cost. Every candidate
              output consumes tokens, model-based graders create additional
              calls, repeated runs multiply the workload, and a useful sample
              may still need human review.
            </p>
          }
          sections={[
            {
              title: "Planning the Complete Evaluation Workload",
              content: (
                <>
                  <p>
                    Enter the number of test items, candidates evaluated per
                    item, monthly evaluation runs, and average candidate-model
                    token usage. The calculator estimates how many outputs and
                    model tokens are created each month.
                  </p>

                  <p>
                    Add the number of model graders used for each candidate
                    output and the average grader input and output tokens. This
                    separates candidate inference cost from judge-model cost.
                  </p>

                  <p>
                    Repeat and failed-item overhead can include invalid outputs,
                    timeouts, tool failures, reruns, or intentionally repeated
                    samples used to measure consistency.
                  </p>
                </>
              ),
            },
            {
              title: "Combining Automated and Human Grading",
              content: (
                <>
                  <p>
                    Automated graders can cover every candidate output, while
                    humans review only a selected sample or disputed cases. Enter
                    the review percentage, minutes per review, and hourly labour
                    rate to include that work.
                  </p>

                  <p>
                    The result compares selective human review with the labour
                    cost of reviewing every candidate output. This does not
                    assume automated grading is equally accurate; it only shows
                    the cost difference.
                  </p>

                  <p>
                    Keep a stable human-labelled set for checking judge-model
                    drift, grader bias, and changes in scoring behaviour.
                  </p>
                </>
              ),
            },
            {
              title: "Using Deterministic and Model-Based Graders",
              content: (
                <>
                  <p>
                    Deterministic checks such as exact match, string comparison,
                    schema validation, executable tests, or rule-based checks
                    may avoid judge-model token cost.
                  </p>

                  <p>
                    Model graders are useful when quality depends on meaning,
                    style, reasoning, groundedness, helpfulness, or comparison
                    between outputs. Their prompt often includes the original
                    input, reference answer, rubric, and candidate output.
                  </p>

                  <p>
                    OpenAI Evals currently supports several grader types,
                    including string checks, text-similarity graders, Python
                    graders, label-model graders, and score-model graders.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://platform.openai.com/docs/api-reference/evals"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenAI Evals Reference
                    </a>

                    <a
                      href="https://platform.openai.com/docs/guides/agent-evals"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenAI Agent Evals
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Budgeting Evaluation as Continuing Work",
              content: (
                <>
                  <p>
                    Evaluation is not only a launch activity. Prompt edits,
                    provider changes, model routing, fine-tuning, retrieval
                    updates, agent-tool changes, and new failure cases can all
                    require another run.
                  </p>

                  <p>
                    Add fixed monthly platform or storage costs and spread the
                    initial dataset and implementation cost across a chosen
                    period. This produces a monthly planning cost for ongoing
                    quality work.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate the cost of comparing several candidate models.</li>
                  <li>Plan LLM-as-a-judge token usage.</li>
                  <li>Measure how repeated runs change the monthly bill.</li>
                  <li>Include selective or full human review labour.</li>
                  <li>Estimate cost per test item and candidate output.</li>
                  <li>Budget initial dataset and evaluation setup work.</li>
                  <li>Calculate first-year evaluation-program cost.</li>
                  <li>Check the evaluation plan against a monthly budget.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Quality Risks Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically value better decisions,
                    fewer production failures, lower support cost, or improved
                    safety. It also excludes taxes, data transfer, annotation
                    tools, storage, observability, security review, and private
                    platform fees unless entered.
                  </p>

                  <p>
                    Cost should not replace evaluation design. Dataset quality,
                    coverage, grader reliability, representative traffic, and
                    clear acceptance thresholds remain essential.
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
                    href="/tools/ai-model-routing-savings-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Model Routing Savings Calculator
                  </Link>

                  <Link
                    href="/tools/ai-fine-tuning-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Fine-Tuning Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-token-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Token Cost Calculator
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

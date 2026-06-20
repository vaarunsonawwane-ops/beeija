import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Customer Support Automation Cost Calculator",
  description:
    "Estimate AI customer support cost, ticket deflection, escalations, model tokens, retrieval, QA review, platform fees, setup, savings, and break-even automation volume.",
  keywords: [
    "AI customer support cost calculator",
    "AI support automation calculator",
    "customer service AI cost calculator",
    "support ticket deflection calculator",
    "AI chatbot ROI calculator",
    "customer support automation ROI",
    "AI helpdesk cost calculator",
    "support chatbot cost per conversation",
    "AI ticket resolution cost",
    "customer service automation savings",
    "AI support unit economics",
    "support automation break even calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-customer-support-automation-cost-calculator",
  },
  openGraph: {
    title: "AI Customer Support Automation Cost Calculator",
    description:
      "Calculate AI-handled conversations, human escalations, model and retrieval spend, QA review, setup, savings, and break-even automation share.",
    url: "https://beeija.com/tools/ai-customer-support-automation-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Customer Support Automation Cost Calculator",
    description:
      "Estimate support automation cost per conversation, resolved conversation, month, and first year.",
  },
};

const faqs = [
  {
    question: "What costs should an AI support estimate include?",
    answer:
      "A complete estimate can include model tokens, retrieval or knowledge-base calls, repeated responses, human escalations, QA review, fixed software fees, monitoring, and implementation work.",
  },
  {
    question: "What is the AI handling rate?",
    answer:
      "It is the share of incoming support conversations sent to the AI workflow. The remaining conversations go directly to human agents.",
  },
  {
    question: "What is the AI resolution rate?",
    answer:
      "It is the share of AI-handled conversations completed without human escalation. Use production data or a realistic pilot result rather than a marketing claim.",
  },
  {
    question: "Why are all provider prices blank?",
    answer:
      "Support stacks can combine different models, retrieval systems, ticketing tools, and private agreements. Blank fields prevent example rates from appearing as current official prices.",
  },
  {
    question: "How is the all-human baseline calculated?",
    answer:
      "The calculator multiplies monthly conversations by average manual handle time and the hourly support-agent rate.",
  },
  {
    question: "What is the break-even automation share?",
    answer:
      "It is the approximate share of conversations that must enter the AI workflow for labour savings to cover AI usage, retrieval, QA, fixed platform costs, and amortised implementation.",
  },
];

export default function AiCustomerSupportAutomationCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Customer Support Automation Cost Calculator"
      description="Estimate the full cost of automating customer support across AI responses, knowledge retrieval, escalations, QA review, software fees, setup, and manual-agent savings."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Support automation is not only a chatbot subscription. A real
              workflow can include several model calls, knowledge retrieval,
              failed resolutions, human handoffs, QA review, and fixed platform
              costs. This calculator brings those layers into one estimate.
            </p>
          }
          sections={[
            {
              title: "Calculating AI Support Cost and Ticket Deflection",
              content: (
                <>
                  <p>
                    Enter monthly support conversations, the share sent to AI,
                    average AI responses, token usage, and the expected AI
                    resolution rate.
                  </p>

                  <p>
                    Conversations that are not routed to AI remain fully human.
                    AI conversations that fail to resolve are escalated and use
                    the entered human handoff time.
                  </p>

                  <p>
                    The result shows AI-resolved conversations, direct human
                    conversations, escalations, cost per conversation, cost per
                    resolved conversation, and the effective automation rate.
                  </p>
                </>
              ),
            },
            {
              title: "Including Retrieval and Repeated Responses",
              content: (
                <>
                  <p>
                    Many support assistants search a knowledge base, help centre,
                    vector database, or internal system before responding. Enter
                    the average retrieval calls per AI conversation and the
                    effective price per 1,000 calls.
                  </p>

                  <p>
                    Retry overhead can represent repeated model responses,
                    invalid tool output, timeouts, regeneration, or follow-up
                    attempts caused by workflow errors.
                  </p>
                </>
              ),
            },
            {
              title: "Planning Human Escalation and QA Review",
              content: (
                <>
                  <p>
                    Human cost is separated into direct human conversations,
                    escalated AI conversations, and QA review of AI-resolved
                    conversations.
                  </p>

                  <p>
                    Escalated cases may take less time because the AI has already
                    collected information, or more time because the customer has
                    repeated the issue. Enter a separate escalation handle time
                    instead of assuming it matches a normal ticket.
                  </p>

                  <p>
                    QA review can cover a percentage of AI-resolved
                    conversations for quality, safety, policy, and knowledge-gap
                    checks.
                  </p>
                </>
              ),
            },
            {
              title: "Comparing With an All-Human Support Baseline",
              content: (
                <>
                  <p>
                    The all-human baseline uses the same conversation volume,
                    manual handle time, and agent hourly rate.
                  </p>

                  <p>
                    The calculator compares that baseline with AI model cost,
                    retrieval, remaining human labour, platform fees, and
                    amortised setup.
                  </p>

                  <p>
                    Results include monthly operating savings, first-year
                    savings, implementation payback, and the approximate
                    automation share needed to break even.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate AI support cost before rollout.</li>
                  <li>Measure the value of ticket deflection.</li>
                  <li>Plan model and retrieval usage.</li>
                  <li>Include failed resolutions and human handoffs.</li>
                  <li>Budget selective QA review.</li>
                  <li>Calculate cost per conversation and resolution.</li>
                  <li>Compare automation with an all-human baseline.</li>
                  <li>Find payback and break-even automation share.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Service Risks Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include ticketing-system
                    licences, CRM access, telephony, translation, data transfer,
                    observability, compliance, refunds, customer churn, taxes,
                    or the business cost of incorrect answers.
                  </p>

                  <p>
                    Separate simple, medium, and difficult support categories
                    when their handle time and resolution rate differ
                    significantly.
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
                    href="/tools/ai-voice-agent-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Voice Agent Cost Calculator
                  </Link>

                  <Link
                    href="/tools/rag-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    RAG Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-web-search-grounding-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Web Search Grounding Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-guardrail-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Guardrail Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-evaluation-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Evaluation Cost Calculator
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

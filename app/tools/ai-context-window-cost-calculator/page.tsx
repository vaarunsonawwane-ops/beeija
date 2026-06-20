import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Context Window Cost Calculator",
  description:
    "Compare full conversation history with summarized context using input tokens, cached prefixes, output tokens, context limits, compaction cost, savings, and overflow risk.",
  keywords: [
    "AI context window cost calculator",
    "LLM context cost calculator",
    "conversation token cost calculator",
    "long context cost calculator",
    "AI memory cost calculator",
    "LLM conversation history cost",
    "prompt compaction savings calculator",
    "context summarization cost calculator",
    "cached input cost calculator",
    "context window overflow calculator",
    "multi turn AI cost calculator",
    "LLM token growth calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-context-window-cost-calculator",
  },
  openGraph: {
    title: "AI Context Window Cost Calculator",
    description:
      "Compare full-history and managed-context AI conversations, including cache hits, summaries, context limits, monthly cost, and savings.",
    url: "https://beeija.com/tools/ai-context-window-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Context Window Cost Calculator",
    description:
      "Estimate context growth, overflow turns, cached input, summary overhead, and monthly savings.",
  },
};

const faqs = [
  {
    question: "Why does conversation cost grow over several turns?",
    answer:
      "When earlier messages are sent again with each new request, the model repeatedly processes an expanding history. Later turns therefore use more input tokens than the first turn.",
  },
  {
    question: "What is managed context?",
    answer:
      "Managed context keeps a selected number of recent turns and replaces older history with a shorter summary or compacted representation. This can reduce repeated input tokens while preserving useful state.",
  },
  {
    question: "How does prompt caching affect the estimate?",
    answer:
      "The calculator applies the entered cache-hit rate only to the cacheable share of the static prefix. Dynamic conversation history remains normal input unless the provider reports it as cached.",
  },
  {
    question: "Why include summarization cost?",
    answer:
      "Creating or refreshing a summary can require additional model input and output tokens. A fair comparison should subtract that overhead from the context savings.",
  },
  {
    question: "What does an overflow turn mean?",
    answer:
      "It is a turn where estimated input plus output tokens exceed the entered context-window limit. The application may need truncation, compaction, retrieval, or a model with a larger limit.",
  },
  {
    question: "Why are all prices blank?",
    answer:
      "Models have different normal-input, cached-input, output, and long-context prices. Blank fields prevent example rates from appearing as current official prices. Enter the live rates for the exact model being planned.",
  },
];

export default function AiContextWindowCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Context Window Cost Calculator"
      description="Compare the cost and context-limit risk of sending full conversation history with a managed strategy that retains recent turns and summarizes older messages."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Multi-turn AI cost can rise quickly because earlier messages are
              often sent again on every request. A context strategy can retain
              recent turns, summarize older history, and preserve a cacheable
              prefix. This calculator compares that managed approach with full
              conversation history.
            </p>
          }
          sections={[
            {
              title: "Measuring Token Growth Across Conversation Turns",
              content: (
                <>
                  <p>
                    Enter monthly sessions, average turns, static instructions,
                    initial context, user tokens, and assistant output tokens.
                    The full-history estimate grows the prompt after every turn
                    by retaining all earlier user and assistant messages.
                  </p>

                  <p>
                    Results include monthly input and output tokens, peak tokens
                    on the final turn, context-window use, turns above the
                    entered limit, and cost per session.
                  </p>

                  <p>
                    OpenAI describes the context window as the combined token
                    space used by input, output, and—in some models—reasoning
                    tokens. Very large prompts can cause truncation or
                    incomplete output when the limit is reached.
                  </p>
                </>
              ),
            },
            {
              title: "Comparing Full History With Managed Context",
              content: (
                <>
                  <p>
                    The managed scenario retains the selected number of recent
                    turns. Once older messages exist, it uses the entered
                    summary size instead of sending every old message again.
                  </p>

                  <p>
                    Summary refresh frequency controls how often the compact
                    memory is regenerated. The calculator includes the input and
                    output tokens consumed by those refresh calls.
                  </p>

                  <p>
                    The result compares full-history cost with managed-context
                    cost after summary overhead, rather than treating
                    summarization as free.
                  </p>
                </>
              ),
            },
            {
              title: "Including Cached Static Prefixes",
              content: (
                <>
                  <p>
                    Repeated system instructions, tool definitions, schemas, and
                    examples may form a stable prefix. Enter the share of static
                    tokens that can match exactly and the effective cache-hit
                    rate.
                  </p>

                  <p>
                    Cached-prefix tokens use the entered cached-input price.
                    Static tokens outside that effective hit are charged at the
                    normal input price.
                  </p>

                  <p>
                    OpenAI currently documents automatic prompt caching for
                    sufficiently long prompts and recommends placing repeated
                    content before changing content. Actual cache behaviour,
                    thresholds, retention, and prices depend on the provider and
                    model.
                  </p>
                </>
              ),
            },
            {
              title: "Using Context Limits for Capacity Planning",
              content: (
                <>
                  <p>
                    Enter the model&apos;s total context limit. The calculator
                    checks estimated input plus assistant output for each turn
                    and reports the first overflow turn and the number of
                    planned turns that exceed the limit.
                  </p>

                  <p>
                    A managed strategy can create more headroom, but summary
                    quality and retrieval quality must still be tested. Removing
                    details solely to reduce cost can damage answer quality.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://platform.openai.com/docs/guides/conversation-state"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenAI Conversation State
                    </a>

                    <a
                      href="https://platform.openai.com/docs/guides/prompt-caching"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenAI Prompt Caching
                    </a>

                    <a
                      href="https://ai.google.dev/gemini-api/docs/tokens"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Gemini Token Guide
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate long-running assistant and agent cost.</li>
                  <li>Measure how conversation history grows by turn.</li>
                  <li>Compare full history with recent-turn retention.</li>
                  <li>Include summary refresh and compaction overhead.</li>
                  <li>Estimate savings from cached static prefixes.</li>
                  <li>Find the first turn likely to exceed a context limit.</li>
                  <li>Calculate cost per session and managed-context saving.</li>
                  <li>Check the context plan against a monthly budget.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Risks Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include reasoning tokens,
                    tool calls, retrieval, images, audio, storage, vector search,
                    data transfer, taxes, regional premiums, or provider minimum
                    charges unless represented in the entered token averages or
                    fixed monthly cost.
                  </p>

                  <p>
                    Tokenization varies by model and language. Use provider usage
                    logs or token-counting tools for representative sessions
                    before making a final architecture decision.
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
                    href="/tools/ai-agent-workflow-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Agent Workflow Cost Calculator
                  </Link>

                  <Link
                    href="/tools/rag-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    RAG Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-model-routing-savings-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Model Routing Savings Calculator
                  </Link>

                  <Link
                    href="/tools/ai-coding-agent-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Coding Agent Cost Calculator
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

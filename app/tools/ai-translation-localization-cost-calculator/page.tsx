import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Translation and Localization Cost Calculator",
  description:
    "Estimate AI translation, localization, terminology lookup, quality review, retries, human editing, setup, savings, and break-even multilingual content volume.",
  keywords: [
    "AI translation cost calculator",
    "AI localization cost calculator",
    "LLM translation cost calculator",
    "machine translation cost calculator",
    "localization ROI calculator",
    "multilingual content cost calculator",
    "translation automation savings",
    "AI translation unit economics",
    "human translation vs AI cost",
    "translation review cost calculator",
    "website localization cost calculator",
    "document translation cost calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-translation-localization-cost-calculator",
  },
  openGraph: {
    title: "AI Translation and Localization Cost Calculator",
    description:
      "Calculate model tokens, language variants, terminology lookup, QA, human editing, setup, savings, and break-even localization volume.",
    url: "https://beeija.com/tools/ai-translation-localization-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Translation and Localization Cost Calculator",
    description:
      "Estimate cost per language, content item, translated word, month, and first year.",
  },
};

const faqs = [
  {
    question: "What costs should an AI localization estimate include?",
    answer:
      "A complete estimate can include translation-model tokens, terminology or translation-memory lookup, quality-check calls, retries, human editing, fixed platform fees, setup, and ongoing maintenance.",
  },
  {
    question: "Why does the calculator use both words and tokens?",
    answer:
      "Human translation is often priced per source word, while language models are billed by tokens. The calculator lets you enter average input and output tokens per source word for the exact language pair and prompt structure.",
  },
  {
    question: "What is the language expansion factor?",
    answer:
      "Translated text can be shorter or longer than the source. The factor adjusts output-token volume for average expansion or contraction across the target languages.",
  },
  {
    question: "Why are all provider prices blank?",
    answer:
      "Translation workflows can use different models, platforms, regions, and private agreements. Blank fields prevent example rates from appearing as current official prices. Enter the live rates for the exact services being considered.",
  },
  {
    question: "How is the human-only baseline calculated?",
    answer:
      "The calculator multiplies monthly source words by target languages and the entered human translation price per source word.",
  },
  {
    question: "What is the break-even monthly source-word volume?",
    answer:
      "It is the approximate source-word volume needed for per-word automation savings to cover recurring platform costs and the amortised share of implementation cost.",
  },
];

export default function AiTranslationLocalizationCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Translation and Localization Cost Calculator"
      description="Estimate the complete cost of translating and localizing websites, documents, product content, support material, and app text using AI plus human review."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              AI localization is not only a translation-model call. A practical
              workflow can include terminology lookup, translation-memory
              retrieval, quality checks, retries, human editing, and fixed
              platform costs. This calculator combines those layers.
            </p>
          }
          sections={[
            {
              title: "Calculating Multilingual Content Cost",
              content: (
                <>
                  <p>
                    Enter monthly source content, average words per item, target
                    languages, token usage per source word, and the current model
                    prices.
                  </p>

                  <p>
                    The calculator estimates translation-model input and output
                    tokens across every language. It can also include repeated
                    processing caused by invalid output, formatting errors,
                    terminology corrections, or failed quality checks.
                  </p>

                  <p>
                    Results include cost per source item, per target language,
                    per 1,000 source words, per successful localized item,
                    monthly cost, and first-year cost.
                  </p>
                </>
              ),
            },
            {
              title: "Including Terminology and Translation Memory",
              content: (
                <>
                  <p>
                    Many localization workflows retrieve approved terminology,
                    product names, style rules, or earlier translations before
                    generating text.
                  </p>

                  <p>
                    Enter the average lookup calls per localized item and the
                    effective price per 1,000 calls. This can represent a vector
                    database, translation-memory service, glossary API, or
                    internal database.
                  </p>
                </>
              ),
            },
            {
              title: "Adding Automated QA and Human Editing",
              content: (
                <>
                  <p>
                    A separate model may check meaning, terminology, format,
                    tone, placeholders, or language quality. Enter the percentage
                    of localized items checked, average QA tokens, and the
                    current QA-model rates.
                  </p>

                  <p>
                    Human editing is calculated from the share of translated
                    words reviewed, reviewer productivity, and hourly rate. This
                    supports light post-editing, full review, or selective
                    review of high-risk content.
                  </p>
                </>
              ),
            },
            {
              title: "Comparing AI Localization With Human Translation",
              content: (
                <>
                  <p>
                    Enter the manual translation rate per source word. The
                    calculator creates a human-only baseline across all target
                    languages and compares it with the AI-assisted workflow.
                  </p>

                  <p>
                    Results include monthly operating savings, planning savings,
                    first-year savings, implementation payback, and approximate
                    break-even source-word volume.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate multilingual website and product-content cost.</li>
                  <li>Plan document, help-centre, and app localization.</li>
                  <li>Include terminology and translation-memory retrieval.</li>
                  <li>Measure the cost of QA calls and repeat processing.</li>
                  <li>Budget selective or full human post-editing.</li>
                  <li>Compare AI-assisted and human-only translation.</li>
                  <li>Calculate cost per language and per 1,000 words.</li>
                  <li>Find implementation payback and break-even volume.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Quality Risks Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include desktop
                    publishing, subtitle timing, legal review, cultural
                    adaptation, transcreation, taxes, storage, data transfer,
                    or the business cost of incorrect translations.
                  </p>

                  <p>
                    Language pairs, terminology density, formatting, script,
                    context, and quality expectations can materially change
                    output length and review effort. Test representative content
                    before using one average for every language.
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
                    href="/tools/ai-document-processing-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Document Processing Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-customer-support-automation-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Customer Support Automation Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-evaluation-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Evaluation Cost Calculator
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

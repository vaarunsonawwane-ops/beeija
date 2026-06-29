import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Document Processing Cost Calculator",
  description:
    "Estimate OCR, document extraction, vision, LLM validation, retries, human review, setup, and monthly automation costs for invoices, forms, PDFs, and scanned documents.",
  keywords: [
    "AI document processing cost calculator",
    "document AI cost calculator",
    "OCR cost calculator",
    "invoice extraction cost calculator",
    "PDF extraction cost calculator",
    "document automation cost calculator",
    "document intelligence cost calculator",
    "AI document review cost",
    "document processing ROI calculator",
    "intelligent document processing cost",
    "IDP cost calculator",
    "document extraction unit economics",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-document-processing-cost-calculator",
  },
  openGraph: {
    title: "AI Document Processing Cost Calculator",
    description:
      "Calculate document extraction, vision, LLM validation, review, setup, savings, and break-even volume.",
    url: "https://beeija.com/tools/ai-document-processing-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Document Processing Cost Calculator",
    description:
      "Estimate cost per page, document, successful extraction, month, and first year.",
  },
};

const faqs = [
  {
    question: "What costs should a document-processing estimate include?",
    answer:
      "A complete estimate can include OCR or extraction, page classification, image or vision processing, LLM validation, retries, human review, platform fees, storage, setup, and monitoring.",
  },
  {
    question: "Why are provider prices blank?",
    answer:
      "Document services use different billing units, feature tiers, page definitions, and private agreements. Blank fields prevent example prices from appearing as current official prices. Enter the live rates for the exact services being considered.",
  },
  {
    question: "How should I estimate retry overhead?",
    answer:
      "Use failed-page, low-confidence, and resubmission data when available. Include repeated processing caused by unreadable scans, unsupported layouts, validation failures, timeouts, or workflow errors.",
  },
  {
    question: "What does the human-review percentage represent?",
    answer:
      "It is the share of processed documents that still need a person to verify, correct, approve, or reject the extracted result.",
  },
  {
    question: "How is the manual-only baseline calculated?",
    answer:
      "The calculator multiplies monthly documents by manual minutes per document and the hourly labour rate. This can be compared with the automated workflow to estimate monthly savings and payback.",
  },
  {
    question: "What is the break-even monthly document volume?",
    answer:
      "It is the approximate number of documents needed for labour savings per document to cover recurring automation costs and the amortised share of implementation cost.",
  },
];

export default function AiDocumentProcessingCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Document Processing Cost Calculator"
      description="Estimate the full cost of extracting and validating invoices, forms, PDFs, receipts, and scanned documents using OCR, document AI, vision, LLMs, and human review."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Document automation is rarely one API call. A production workflow
              can include OCR, classification, page extraction, image
              preprocessing, LLM validation, retries, human review, and fixed
              platform costs. This calculator combines those layers.
            </p>
          }
          sections={[
            {
              title: "Calculating the Full Document Workflow Cost",
              content: (
                <>
                  <p>
                    Enter monthly document volume, average pages, image-heavy
                    page share, extraction retries, and the current service
                    prices used by the workflow.
                  </p>

                  <p>
                    The calculator separates OCR or extraction, vision
                    processing, LLM validation, human review, recurring
                    platform charges, and amortised implementation cost.
                  </p>

                  <p>
                    Results include cost per page, cost per document, cost per
                    successful document, monthly operating cost, planning cost,
                    and first-year spend.
                  </p>
                </>
              ),
            },
            {
              title: "Adding LLM Validation and Structured Extraction",
              content: (
                <>
                  <p>
                    A document model may return raw text, fields, tables, or
                    confidence scores. Some workflows use a language model to
                    validate extracted data, convert it into a schema, compare
                    totals, detect missing values, or create a summary.
                  </p>

                  <p>
                    Enter the percentage of documents sent to the LLM, average
                    input and output tokens, and the current model prices. Keep
                    the percentage at zero when no LLM step is used.
                  </p>
                </>
              ),
            },
            {
              title: "Including Human Review and Quality Failures",
              content: (
                <>
                  <p>
                    Low-confidence or high-risk documents may require manual
                    review. Enter the review share, minutes per review, hourly
                    rate, and expected successful completion rate.
                  </p>

                  <p>
                    Cost per successful document is usually more useful than
                    cost per attempted document because unreadable or failed
                    records still consume processing and review resources.
                  </p>
                </>
              ),
            },
            {
              title: "Comparing Automation With Manual Processing",
              content: (
                <>
                  <p>
                    Enter the time needed to process one document manually. The
                    calculator creates a manual-only labour baseline and
                    compares it with the automated workflow.
                  </p>

                  <p>
                    The result shows monthly operating savings, first-year
                    savings, implementation payback, and the approximate
                    document volume required to break even.
                  </p>
                </>
              ),
            },
            {
              title: "Using Current Provider Prices",
              content: (
                <>
                  <p>
                    Managed document platforms can charge by page, feature,
                    processor, or request. Vision and language models may charge
                    by image, token, or other units. Convert the current service
                    rates into the matching calculator fields.
                  </p>

                  <p>
                    The official documentation below can be used to check
                    current service capabilities and pricing for a planned
                    workflow.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://cloud.google.com/document-ai"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Google Document AI
                    </a>

                    <a
                      href="https://azure.microsoft.com/en-us/products/ai-services/ai-document-intelligence"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Azure Document Intelligence
                    </a>

                    <a
                      href="https://aws.amazon.com/textract/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Amazon Textract
                    </a>

                    <a
                      href="https://platform.openai.com/docs/guides/images-vision"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenAI Vision Guide
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate OCR and extraction spend before launch.</li>
                  <li>Plan invoice, form, receipt, and PDF automation.</li>
                  <li>Include image-heavy pages and retry overhead.</li>
                  <li>Add LLM validation and structured-output costs.</li>
                  <li>Estimate selective human-review labour.</li>
                  <li>Compare automated and manual-only processing.</li>
                  <li>Calculate implementation payback and break-even volume.</li>
                  <li>Check monthly and first-year budgets.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Benefits Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include storage, data
                    transfer, workflow orchestration, security review,
                    compliance, taxes, support, annotation tools, or the
                    business value of faster processing and fewer errors.
                  </p>

                  <p>
                    Page complexity, scan quality, table density, handwriting,
                    language, document type, and provider page definitions can
                    materially change real usage.
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
                  currentHref="/tools/ai-document-processing-cost-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

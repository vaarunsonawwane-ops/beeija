import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Mistral API Cost Calculator",
  description:
    "Estimate Mistral API costs for Mistral Small, Large, Medium, and Codestral using input tokens, output tokens, Batch API, requests, and monthly usage.",
  keywords: [
    "Mistral API cost calculator",
    "Mistral AI pricing calculator",
    "Mistral token cost calculator",
    "Mistral Small 4 cost calculator",
    "Mistral Large cost calculator",
    "Mistral Medium cost calculator",
    "Codestral cost calculator",
    "Mistral Batch API cost",
    "Mistral API pricing",
    "Mistral monthly cost calculator",
    "LLM API cost calculator",
  ],
  alternates: {
    canonical: "https://beeija.com/tools/mistral-api-cost-calculator",
  },
  openGraph: {
    title: "Mistral API Cost Calculator",
    description:
      "Estimate Mistral API costs from input tokens, output tokens, Batch API, requests, and monthly usage.",
    url: "https://beeija.com/tools/mistral-api-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mistral API Cost Calculator",
    description:
      "Estimate Mistral Small, Large, Medium, and Codestral API costs using your own token usage.",
  },
};

const faqs = [
  {
    question: "How is Mistral API cost calculated?",
    answer:
      "The calculator multiplies total input and output tokens by the selected model rates. It then shows the estimated cost per request, day, month, and year.",
  },
  {
    question: "Does Mistral Batch API cost less?",
    answer:
      "Yes. Mistral says Batch API processing can cost 50% less than standard synchronous API calls. Choose Batch API in the calculator to apply that reduction.",
  },
  {
    question: "Can I compare Mistral models?",
    answer:
      "Yes. Keep the same request and token values, then switch models to compare their estimated costs.",
  },
  {
    question: "Does this include every Mistral service?",
    answer:
      "No. It covers text token charges only. OCR, transcription, text-to-speech, fine-tuning, agents, tools, storage, and other services may have separate prices.",
  },
  {
    question: "Are the results exact?",
    answer:
      "No. They are planning estimates. Your final bill may change because of price updates, retries, discounts, taxes, or other paid services.",
  },
  {
    question: "Can I enter my own Mistral prices?",
    answer:
      "Yes. Turn on custom pricing and enter your own input and output rates per million tokens.",
  },
];

export default function MistralApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="Mistral API Cost Calculator"
      description="Estimate Mistral API costs using input tokens, output tokens, Batch API, requests, and monthly usage."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Mistral API costs can change with the model, prompt size, answer
              length, request count, and pricing mode. This calculator helps you
              test a small launch, a normal month, and a higher-usage case
              before you build.
            </p>
          }
          sections={[
            {
              title: "How the Mistral API Cost Calculator Works",
              content: (
                <>
                  <p>
                    Choose a Mistral model and enter the expected requests per
                    month. Then add the average input and output tokens used by
                    one request.
                  </p>
                  <p>
                    The calculator separates input and output costs. It also
                    lets you compare standard API pricing with the lower Batch
                    API estimate.
                  </p>
                  <p>
                    The result shows the estimated cost per request, day, month,
                    and year.
                  </p>
                </>
              ),
            },
            {
              title: "What to Enter for a Useful Estimate",
              content: (
                <>
                  <p>
                    Include the system message, prompt, chat history, retrieved
                    text, and other content sent to the model in your input
                    estimate.
                  </p>
                  <p>
                    Use the average answer length expected in real use. Longer
                    answers can increase the monthly bill.
                  </p>
                  <p>
                    Test a normal case and a busy case so you can see how cost
                    may change as users and requests grow.
                  </p>
                </>
              ),
            },
            {
              title: "Common Ways to Use This Calculator",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate the monthly cost of a Mistral chatbot.</li>
                  <li>Compare Mistral Small, Large, Medium, and Codestral.</li>
                  <li>Compare Standard API and Batch API pricing.</li>
                  <li>Estimate cost per request, day, month, and year.</li>
                  <li>Review the effect of longer prompts and answers.</li>
                  <li>Prepare an early Mistral API budget.</li>
                </ul>
              ),
            },
            {
              title: "Simple Mistral API Cost Example",
              content: (
                <>
                  <p>
                    Imagine an AI assistant with 60,000 requests per month. Each
                    request uses 1,100 input tokens and 350 output tokens. Enter
                    those values and choose Mistral Small 4.
                  </p>
                  <p>
                    You can then switch to Mistral Large 3, Mistral Medium 3.5, or Codestral
                    without changing the workload.
                  </p>
                </>
              ),
            },
            {
              title: "Pricing and Estimate Notes",
              content: (
                <>
                  <p>
                    Built-in prices were checked against Mistral&apos;s official
                    pricing and model pages on June 19, 2026.
                  </p>
                  <p>
                    This calculator covers text token charges only. OCR,
                    transcription, speech, fine-tuning, agents, tools, storage,
                    taxes, and other services may add separate costs.
                  </p>
                  <p>
                    Always check the{" "}
                    <a
                      href="https://mistral.ai/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[var(--yellow-dark)]"
                    >
                      official Mistral pricing page
                    </a>{" "}
                    before making a final budget or purchase decision.
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
                  currentHref="/tools/mistral-api-cost-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

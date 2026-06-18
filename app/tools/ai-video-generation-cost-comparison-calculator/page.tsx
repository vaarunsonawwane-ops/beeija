import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Video Generation Cost Comparison Calculator",

  description:
    "Compare Google Veo 3.1 and Runway API video generation costs using clip duration, monthly output, retries, resolution, audio options, budget, and custom pricing.",

  keywords: [
    "AI video generation cost calculator",
    "AI video API pricing comparison",
    "Veo 3.1 cost calculator",
    "Runway API cost calculator",
    "video generation API cost",
    "AI video cost per second",
    "AI video cost per clip",
    "Google Veo pricing calculator",
    "Runway Gen-4.5 cost calculator",
    "Runway Gen-4 Turbo cost calculator",
    "Seedance 2 cost calculator",
    "AI video production cost calculator",
    "text to video API pricing",
    "image to video API pricing",
  ],

  alternates: {
    canonical:
      "https://beeija.com/tools/ai-video-generation-cost-comparison-calculator",
  },

  openGraph: {
    title: "AI Video Generation Cost Comparison Calculator",
    description:
      "Compare current Google Veo 3.1 and Runway API costs using usable clips, duration, retries, budget, and custom pricing.",
    url: "https://beeija.com/tools/ai-video-generation-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Video Generation Cost Comparison Calculator",
    description:
      "Estimate AI video generation cost per clip, minute, month, and year across current provider models.",
  },
};

const faqs = [
  {
    question: "Why does this calculator include attempts per usable clip?",
    answer:
      "AI video workflows often need more than one generation before a clip is usable. The attempts field includes revisions, failed creative directions, unwanted motion, continuity problems, and other repeated generations in the cost estimate.",
  },
  {
    question: "Are all compared models equal in quality and features?",
    answer:
      "No. Price is only one part of the decision. Models can differ in resolution, audio generation, duration limits, speed, prompt control, image-to-video support, consistency, and output quality.",
  },
  {
    question: "How is Runway credit pricing converted to dollars?",
    answer:
      "Runway states that one API credit costs $0.01. The calculator converts each official credit-per-second rate into a dollar-per-second rate.",
  },
  {
    question: "Why does Aleph 2 have a minimum generation charge?",
    answer:
      "Runway lists Aleph 2 at 28 credits per second with a minimum of 56 credits per generation. The calculator applies the larger of the duration-based charge or the official minimum.",
  },
  {
    question: "Can I compare another video provider?",
    answer:
      "Yes. Enable the custom provider and enter its current price per generated second and any minimum charge per generation.",
  },
  {
    question: "Does the estimate include editing and voiceover?",
    answer:
      "No. The comparison focuses on video generation charges. Editing, voiceover, music, source-image generation, storage, upscaling, taxes, subscriptions, and other production work may add separate costs.",
  },
];

export default function AiVideoGenerationCostComparisonCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Video Generation Cost Comparison Calculator"
      description="Compare current Google Veo 3.1 and Runway API video costs using clip duration, usable output, repeated attempts, budget, and custom pricing."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              AI video pricing is usually shown per generated second, but a
              usable production clip may need several attempts. This calculator
              includes the repeated-generation cost and compares current
              provider options using one consistent workload.
            </p>
          }
          sections={[
            {
              title: "Comparing the Real Cost of Usable AI Video",
              content: (
                <>
                  <p>
                    Enter the number of finished clips needed each month, the
                    length of each clip, and the average number of generation
                    attempts needed for one usable result.
                  </p>

                  <p>
                    The calculator converts that plan into total generations
                    and generated seconds. It then shows the cost per generated
                    clip, cost per usable clip, monthly cost, yearly cost, and
                    the lowest-cost option for the same workload.
                  </p>

                  <p>
                    This gives a more useful planning number than multiplying a
                    provider&apos;s advertised rate by the final video length
                    alone.
                  </p>
                </>
              ),
            },
            {
              title: "Choosing Attempts per Usable Clip",
              content: (
                <>
                  <p>
                    Use 1 attempt when the first output is usually accepted. Use
                    2 or 3 when clips often need regeneration for motion,
                    framing, prompt changes, product accuracy, character
                    consistency, or unwanted visual details.
                  </p>

                  <p>
                    A higher attempt count can be appropriate for advertisements,
                    story scenes, product videos, or client work where only a
                    small share of generated clips reaches the final edit.
                  </p>

                  <p>
                    Keep the same attempts value while comparing providers so
                    the cost ranking remains consistent.
                  </p>
                </>
              ),
            },
            {
              title: "What the Built-In Comparison Covers",
              content: (
                <>
                  <p>
                    The built-in list includes current Google Veo 3.1 Standard,
                    Fast, and Lite prices from the Gemini API, plus current
                    non-deprecated video models listed in the Runway API pricing
                    documentation.
                  </p>

                  <p>
                    Resolution and audio details are shown inside the model
                    labels where the official pricing table gives a separate
                    rate. Models with an announced deprecation or shutdown are
                    not included as built-in choices.
                  </p>

                  <p>
                    A custom provider option is available for another API,
                    negotiated rate, or private platform quote.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Choose a video-generation API before integration.</li>
                  <li>Estimate the budget for monthly social or ad clips.</li>
                  <li>See how retries change the real cost per usable clip.</li>
                  <li>Compare 720p, 1080p, 4K, audio, and no-audio prices.</li>
                  <li>Check whether a production plan fits a monthly budget.</li>
                  <li>Compare a public API price with a private provider quote.</li>
                  <li>Estimate annual video-generation spend before scaling.</li>
                </ul>
              ),
            },
            {
              title: "Costs Outside the Video Generation Charge",
              content: (
                <>
                  <p>
                    A complete production budget may also include prompt
                    testing, source images, voiceover, music, editing,
                    upscaling, storage, moderation, subscriptions, API gateway
                    fees, failed jobs, taxes, and human review.
                  </p>

                  <p>
                    Some providers charge only for successful generations while
                    others may use credits, minimum charges, subscriptions, or
                    different rules. Review the exact billing terms before a
                    final purchase decision.
                  </p>
                </>
              ),
            },
            {
              title: "Official Pricing Sources",
              content: (
                <>
                  <p>
                    Built-in prices were checked on June 19, 2026 against the
                    official Google Gemini API and Runway API pricing pages.
                    Prices, preview status, models, limits, and billing rules can
                    change.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://ai.google.dev/gemini-api/docs/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Google Gemini API Pricing
                    </a>

                    <a
                      href="https://docs.dev.runwayml.com/guides/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Runway API Pricing
                    </a>
                  </div>
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
                    href="/tools/ai-image-generation-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Image Generation Cost Calculator
                  </Link>

                  <Link
                    href="/tools/gemini-api-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    Gemini API Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-token-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Token Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-voice-agent-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Voice Agent Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-transcription-cost-comparison-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Transcription Cost Comparison
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

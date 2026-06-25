import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Transcription Cost Comparison Calculator",

  description:
    "Compare OpenAI, Deepgram, AssemblyAI, Google Cloud, and custom speech-to-text costs using monthly audio hours, processing mode, retries, and current official prices.",

  keywords: [
    "AI transcription cost comparison calculator",
    "speech to text API cost calculator",
    "transcription API pricing comparison",
    "OpenAI transcription cost calculator",
    "Deepgram cost calculator",
    "AssemblyAI cost calculator",
    "Google Speech to Text cost calculator",
    "speech recognition API pricing",
    "audio transcription cost calculator",
    "voice AI cost calculator",
  ],

  alternates: {
    canonical:
      "https://beeija.com/tools/ai-transcription-cost-comparison-calculator",
  },

  openGraph: {
    title: "AI Transcription Cost Comparison Calculator",
    description:
      "Compare current speech-to-text costs across OpenAI, Deepgram, AssemblyAI, Google Cloud, and a custom provider.",
    url: "https://beeija.com/tools/ai-transcription-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Transcription Cost Comparison Calculator",
    description:
      "Compare AI transcription providers using your monthly audio workload.",
  },
};

const faqs = [
  {
    question: "Which transcription provider is cheapest?",
    answer:
      "The cheapest option depends on whether the workload is pre-recorded or real-time, the model selected, monthly audio volume, retries, and any volume pricing. The calculator sorts applicable options from lowest to highest estimated cost.",
  },
  {
    question: "Why does Google Cloud use tiered pricing?",
    answer:
      "Google Speech-to-Text V2 standard recognition has lower per-minute rates at higher monthly usage levels. The calculator applies the official usage tiers progressively.",
  },
  {
    question: "Does the comparison include speaker diarization and redaction?",
    answer:
      "No. The main comparison uses base transcription prices so the result remains understandable. Provider-specific add-ons, storage, compliance, support, and other services may add separate charges.",
  },
  {
    question: "How should multi-channel audio be entered?",
    answer:
      "Enter total billable audio hours. For Google Cloud, each channel is billed separately, so multiply file duration by the number of channels before entering the hours.",
  },
  {
    question: "Why are some models available only in one mode?",
    answer:
      "Some official products are designed specifically for streaming or pre-recorded audio. The calculator only shows models that match the selected processing mode.",
  },
  {
    question: "Can I compare a provider not listed here?",
    answer:
      "Yes. Enable the custom provider, enter its current hourly rate, and choose whether real-time usage is billed by processed audio duration or open session duration.",
  },
];

export default function AiTranscriptionCostComparisonCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Transcription Cost Comparison Calculator"
      description="Compare OpenAI, Deepgram, AssemblyAI, Google Cloud, and custom speech-to-text costs using your real monthly audio workload."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Speech-to-text providers use different models, billing units,
              processing modes, and volume rules. This calculator converts
              current official prices into one comparable monthly and yearly
              estimate.
            </p>
          }
          sections={[
            {
              title: "Comparing Transcription Costs Before Choosing a Provider",
              content: (
                <>
                  <p>
                    Choose pre-recorded or real-time transcription, then enter
                    the total billable audio hours expected each month. The
                    calculator adds any retry or repeat-processing allowance and
                    ranks all applicable provider options.
                  </p>

                  <p>
                    Results include cost per audio hour, monthly cost, yearly
                    cost, and the saving between the lowest and highest options.
                    You can also add a custom provider rate to compare a private
                    quote or another service.
                  </p>
                </>
              ),
            },
            {
              title: "Using Audio and Session Billing Correctly",
              content: (
                <>
                  <p>
                    Enter the total audio duration that the provider will bill.
                    If 1,000 one-hour files are processed each month, enter
                    1,000 hours.
                  </p>

                  <p>
                    Multi-channel billing requires care. Google Cloud bills each
                    channel separately. A 100-hour stereo workload can therefore
                    represent 200 billable channel-hours.
                  </p>

                  <p>
                    Add a retry percentage when files may be submitted again
                    because of failures, workflow retries, user requests, or
                    quality checks.
                  </p>

                  <p>
                    For real-time AssemblyAI models, billing follows the open
                    WebSocket session duration rather than only the spoken audio.
                    Use the session-overhead field for connection time, silence,
                    reconnects, or sessions that remain open after speech ends.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Comparison Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Choose a transcription API before development.</li>
                  <li>Compare pre-recorded and real-time speech workloads.</li>
                  <li>Estimate monthly and annual transcription spend.</li>
                  <li>See how retries affect the final bill.</li>
                  <li>Compare a public rate with a private provider quote.</li>
                  <li>Identify the saving between available options.</li>
                </ul>
              ),
            },
            {
              title: "Official Pricing Included in the Calculator",
              content: (
                <>
                  <p>
                    OpenAI GPT-Realtime-Whisper is included for real-time
                    transcription at its official per-minute price.
                  </p>

                  <p>
                    Deepgram Nova-3 and Flux rates are included for the
                    applicable processing modes. AssemblyAI Universal models
                    use their official rates, with streaming models calculated
                    from open session duration. Google Speech-to-Text V2 standard
                    recognition uses its official volume tiers, while Dynamic
                    Batch uses its separate per-minute rate.
                  </p>

                  <p>
                    Prices were checked on June 19, 2026. Provider pricing,
                    promotions, model availability, and billing rules can
                    change.
                  </p>
                </>
              ),
            },
            {
              title: "Costs Not Included in the Base Comparison",
              content: (
                <>
                  <p>
                    The result does not automatically add speaker diarization,
                    redaction, medical mode, keyterm prompting, storage, network
                    transfer, support plans, compliance fees, taxes, or
                    enterprise discounts.
                  </p>

                  <p>
                    Use the custom provider option when you have a negotiated
                    all-in hourly rate. Always confirm the final price on the
                    provider&apos;s official page before purchasing.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://openai.com/api/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenAI Pricing
                    </a>

                    <a
                      href="https://deepgram.com/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Deepgram Pricing
                    </a>

                    <a
                      href="https://www.assemblyai.com/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      AssemblyAI Pricing
                    </a>

                    <a
                      href="https://cloud.google.com/speech-to-text/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Google Cloud Pricing
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
                    href="/tools/ai-voice-agent-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Voice Agent Cost Calculator
                  </Link>

                  <Link
                    href="/tools/openai-api-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    OpenAI API Cost Calculator
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

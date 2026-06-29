import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Voice Agent Cost Calculator",
  description:
    "Estimate the full monthly cost of an AI voice agent using your current speech-to-text, LLM, text-to-speech, telephony, platform, recording, setup, and fixed-cost rates.",
  keywords: [
    "AI voice agent cost calculator",
    "voice AI cost calculator",
    "AI phone agent cost calculator",
    "voice agent pricing calculator",
    "AI call cost calculator",
    "speech to text LLM text to speech cost",
    "Vapi cost calculator",
    "Retell AI cost calculator",
    "voice agent cost per minute",
    "AI receptionist cost calculator",
    "voice bot cost calculator",
  ],
  alternates: {
    canonical: "https://beeija.com/tools/ai-voice-agent-cost-calculator",
  },
  openGraph: {
    title: "AI Voice Agent Cost Calculator",
    description:
      "Calculate the full cost of running an AI voice agent using the current provider rates you enter.",
    url: "https://beeija.com/tools/ai-voice-agent-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Voice Agent Cost Calculator",
    description:
      "Estimate AI voice agent cost per call, minute, month, year, and 1,000 calls using current rates you enter.",
  },
};

const faqs = [
  {
    question: "What costs should be included in an AI voice agent budget?",
    answer:
      "A complete estimate can include speech-to-text, LLM input and output tokens, text-to-speech, telephony, platform or orchestration fees, call recording, phone numbers, fixed subscriptions, and setup work.",
  },
  {
    question: "Why is LLM cost entered as tokens per call minute?",
    answer:
      "Voice agents can replay conversation history, instructions, and retrieved context during each turn. Entering average input and output tokens per call minute lets you use real logs or a careful workload estimate.",
  },
  {
    question: "How is text-to-speech usage estimated?",
    answer:
      "The calculator uses the share of the call spoken by the AI, multiplied by spoken characters per minute and the TTS price per 1,000 characters.",
  },
  {
    question: "What does retry and failed-call overhead mean?",
    answer:
      "It covers repeated calls, reconnects, test traffic, workflow retries, or failed sessions that still create billable usage.",
  },
  {
    question: "Can this calculator be used with Vapi, Retell, Bland, or a custom stack?",
    answer:
      "Yes. Enter the rates from your chosen platform and providers. The tool does not lock the calculation to one vendor.",
  },
  {
    question: "Why are the price fields blank?",
    answer:
      "They are blank to protect accuracy and trust. Enter the current official rates for the exact providers, plans, regions, and models you are considering. Beeija does not present example prices as verified live prices.",
  },
];

export default function AiVoiceAgentCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Voice Agent Cost Calculator"
      description="Estimate the complete cost of an AI voice agent using current provider rates you enter for speech recognition, LLM usage, voice generation, telephony, platform fees, recording, and setup."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              A voice agent is rarely one bill. Speech recognition, the language
              model, generated voice, phone calls, platform fees, recording, and
              setup can all contribute to the final cost. This calculator brings
              the full stack into one estimate.
            </p>
          }
          sections={[
            {
              title: "Calculating the Full Voice Agent Stack",
              content: (
                <>
                  <p>
                    Start with monthly calls and average call duration. Add an
                    overhead percentage for repeated, failed, test, or
                    reconnected calls that may still create billable minutes.
                  </p>
                  <p>
                    Enter the per-minute prices for speech-to-text, telephony,
                    platform orchestration, and recording. Then add the LLM
                    token rates and text-to-speech character rate used by your
                    chosen stack.
                  </p>
                  <p>
                    The result shows cost per call, cost per billable minute,
                    cost per 1,000 calls, monthly spend, annual spend, and a
                    component-by-component breakdown.
                  </p>
                </>
              ),
            },
            {
              title: "Estimating LLM Usage More Realistically",
              content: (
                <>
                  <p>
                    Voice agents usually make several LLM requests during one
                    call. Each request may include system instructions,
                    conversation history, retrieved knowledge, tool results, and
                    the latest user message.
                  </p>
                  <p>
                    Use observed input and output tokens per call minute when
                    production logs are available. Before launch, test a sample
                    conversation and use a cautious average.
                  </p>
                  <p>
                    Longer calls do not always grow linearly when full
                    conversation history is replayed. Add extra room to the
                    input-token estimate when the agent keeps long context.
                  </p>
                </>
              ),
            },
            {
              title: "Planning Text-to-Speech and Telephony Costs",
              content: (
                <>
                  <p>
                    Text-to-speech is based on the part of the call spoken by
                    the AI. Enter the AI speaking share and the average spoken
                    characters generated per minute.
                  </p>
                  <p>
                    Telephony can vary by country, inbound or outbound
                    direction, phone number type, recording, carrier, and SIP
                    setup. Use the exact rate for the traffic you expect.
                  </p>
                  <p>
                    Platform prices may cover orchestration only, or they may
                    include parts of the speech and model stack. Avoid entering
                    the same charge twice.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Set a realistic voice-agent budget before building.</li>
                  <li>Compare a managed platform with a custom stack.</li>
                  <li>Estimate cost per call and per 1,000 calls.</li>
                  <li>See which part of the stack drives the monthly bill.</li>
                  <li>Test longer calls, higher volume, and retry overhead.</li>
                  <li>Amortize one-time setup work across several months.</li>
                  <li>Check whether the planned stack fits a monthly budget.</li>
                </ul>
              ),
            },
            {
              title: "Using Official Provider Prices",
              content: (
                <>
                  <p>
                    Every price field is blank by design. Beeija does not insert
                    unverified example prices or silently assume a provider.
                    Copy the latest rates from the official pages for your
                    speech-to-text, language model, text-to-speech, telephony,
                    recording, and voice-agent platform providers.
                  </p>
                  <p>
                    Check whether a platform rate already includes model,
                    speech, or telephony costs. Also review minimum billing
                    increments, free allowances, regional prices, concurrency
                    charges, subscriptions, and enterprise discounts.
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
                  currentHref="/tools/ai-voice-agent-cost-calculator"
                />
              ),
            }
          ]}
        />
      </div>
    </ToolShell>
  );
}

import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Meeting Assistant Cost Calculator",
  description:
    "Estimate AI meeting assistant cost across transcription, diarization, summaries, action items, storage, human review, setup, savings, and break-even meeting volume.",
  keywords: [
    "AI meeting assistant cost calculator",
    "meeting transcription cost calculator",
    "AI meeting notes cost calculator",
    "meeting summarization cost calculator",
    "AI notetaker cost calculator",
    "meeting assistant ROI calculator",
    "meeting automation savings",
    "AI meeting minutes cost",
    "speech to text meeting cost",
    "meeting intelligence cost calculator",
    "AI meeting unit economics",
    "meeting notes automation cost",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-meeting-assistant-cost-calculator",
  },
  openGraph: {
    title: "AI Meeting Assistant Cost Calculator",
    description:
      "Calculate transcription, diarization, summary, action-item, storage, review, setup, savings, and break-even meeting volume.",
    url: "https://beeija.com/tools/ai-meeting-assistant-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Meeting Assistant Cost Calculator",
    description:
      "Estimate cost per meeting, participant hour, month, and first year.",
  },
};

const faqs = [
  {
    question: "What costs should an AI meeting assistant estimate include?",
    answer:
      "A complete estimate can include transcription, speaker diarization, summary and action-item model calls, retries, storage, calendar or workflow integration, human review, fixed platform fees, and implementation work.",
  },
  {
    question: "Why calculate both meeting minutes and participant minutes?",
    answer:
      "Speech services usually process the meeting audio once, while the business value of note-taking can depend on how many people attend. Participant minutes help estimate the total human time represented by the meetings.",
  },
  {
    question: "What is speaker diarization?",
    answer:
      "Diarization separates or labels speakers in the transcript. Some providers include it in transcription, while others charge separately or require a higher-priced tier.",
  },
  {
    question: "Why are all provider prices blank?",
    answer:
      "Meeting workflows can use different transcription, diarization, language-model, storage, and platform services. Blank fields prevent example rates from appearing as current official prices.",
  },
  {
    question: "How is the manual note-taking baseline calculated?",
    answer:
      "The calculator multiplies meetings by manual note-taking minutes per meeting and the entered hourly labour rate.",
  },
  {
    question: "What is the break-even meeting volume?",
    answer:
      "It is the approximate number of meetings needed for per-meeting labour savings to cover recurring platform costs and the amortised share of implementation cost.",
  },
];

export default function AiMeetingAssistantCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Meeting Assistant Cost Calculator"
      description="Estimate the complete cost of transcribing meetings, identifying speakers, creating summaries and action items, storing records, reviewing outputs, and replacing manual note-taking."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              An AI meeting assistant can combine audio transcription, speaker
              labels, summaries, action items, storage, integrations, and human
              review. This calculator estimates the full workflow rather than
              treating meeting notes as one flat subscription.
            </p>
          }
          sections={[
            {
              title: "Calculating the Full Meeting Workflow",
              content: (
                <>
                  <p>
                    Enter monthly meetings, average duration, participant count,
                    retry overhead, and the current audio-processing prices used
                    by the workflow.
                  </p>

                  <p>
                    The calculator separates transcription, diarization,
                    language-model summaries, action-item extraction, storage,
                    review labour, fixed platform charges, and amortised setup.
                  </p>

                  <p>
                    Results include cost per meeting, cost per meeting hour,
                    cost per participant hour, monthly operating cost, planning
                    cost, and first-year spend.
                  </p>
                </>
              ),
            },
            {
              title: "Adding Summaries and Action Items",
              content: (
                <>
                  <p>
                    A meeting transcript may be sent to a language model for a
                    summary, decisions, risks, follow-up tasks, or structured
                    meeting minutes.
                  </p>

                  <p>
                    Enter the percentage of meetings summarized, average input
                    and output tokens, and current model prices. Use a separate
                    action-item coverage and token estimate when task extraction
                    runs as another model call.
                  </p>
                </>
              ),
            },
            {
              title: "Including Storage and Human Review",
              content: (
                <>
                  <p>
                    Meeting records may include audio, transcripts, summaries,
                    speaker labels, and searchable metadata. Enter average
                    storage per meeting and the monthly storage price.
                  </p>

                  <p>
                    Human review can cover executive meetings, customer calls,
                    legal discussions, poor transcripts, or meetings where
                    action items must be verified. Enter the review share,
                    minutes per review, and hourly rate.
                  </p>
                </>
              ),
            },
            {
              title: "Comparing With Manual Meeting Notes",
              content: (
                <>
                  <p>
                    Enter the manual note-taking and follow-up time for one
                    meeting. The calculator creates a manual-only labour
                    baseline and compares it with the automated workflow.
                  </p>

                  <p>
                    Results include monthly operating savings, planning savings,
                    first-year savings, implementation payback, and approximate
                    break-even meeting volume.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate meeting transcription and note-taking cost.</li>
                  <li>Plan speaker diarization and multilingual processing.</li>
                  <li>Include summary and action-item model calls.</li>
                  <li>Budget storage and calendar or workflow integrations.</li>
                  <li>Estimate selective human review.</li>
                  <li>Calculate cost per meeting and participant hour.</li>
                  <li>Compare automation with manual notes.</li>
                  <li>Find implementation payback and break-even volume.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Risks Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include calendar licences,
                    conferencing fees, consent management, legal review,
                    retention policies, regional processing, taxes, support, or
                    the business cost of inaccurate notes.
                  </p>

                  <p>
                    Audio quality, accents, overlapping speakers, language,
                    background noise, and meeting structure can materially
                    change transcription and review effort.
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
                  currentHref="/tools/ai-meeting-assistant-cost-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

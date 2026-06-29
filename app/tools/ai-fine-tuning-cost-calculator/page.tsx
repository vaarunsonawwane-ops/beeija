import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Fine-Tuning Cost Calculator",
  description:
    "Estimate AI fine-tuning training cost, dataset preparation, experiments, evaluation, retraining, tuned-model inference, payback, break-even usage, and first-year savings.",
  keywords: [
    "AI fine tuning cost calculator",
    "LLM fine tuning cost calculator",
    "fine tuning training cost",
    "OpenAI fine tuning cost calculator",
    "Gemini fine tuning cost calculator",
    "LoRA fine tuning cost calculator",
    "custom model training cost",
    "fine tuned model inference cost",
    "AI model training ROI calculator",
    "fine tuning break even calculator",
    "dataset token cost calculator",
    "AI fine tuning budget calculator",
    "fine tuning versus prompting cost",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-fine-tuning-cost-calculator",
  },
  openGraph: {
    title: "AI Fine-Tuning Cost Calculator",
    description:
      "Calculate dataset, training, evaluation, retraining, inference, payback, and break-even costs for an AI fine-tuning project.",
    url: "https://beeija.com/tools/ai-fine-tuning-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Fine-Tuning Cost Calculator",
    description:
      "Estimate one-time and continuing fine-tuning costs, then compare them with the current base-model workflow.",
  },
};

const faqs = [
  {
    question: "Why are the provider price fields blank?",
    answer:
      "Fine-tuning prices differ by provider, model, region, training method, and account agreement. Blank fields prevent example prices from appearing as current official prices. Enter the live rates for the exact service being evaluated.",
  },
  {
    question: "How are training tokens estimated?",
    answer:
      "The calculator multiplies training examples by average input and output tokens, applies the training split and dataset expansion, then multiplies the result by epochs and experimental runs.",
  },
  {
    question: "Why include several training experiments?",
    answer:
      "A production model may need repeated runs with different datasets, prompts, learning settings, checkpoints, or evaluation results before the final version is selected.",
  },
  {
    question: "What is the difference between operating and planning cost?",
    answer:
      "Operating cost includes tuned-model inference, hosting, monitoring, and a monthly retraining reserve. Planning cost also includes an amortised share of the initial training, evaluation, data preparation, and implementation cost.",
  },
  {
    question: "How is the break-even request volume calculated?",
    answer:
      "The calculator compares variable cost per request for the base and tuned workflows, then estimates how many monthly requests are needed for the variable saving to cover recurring tuned-model fixed costs.",
  },
  {
    question: "Does fine-tuning always reduce token usage?",
    answer:
      "No. Some tuned workflows can use shorter instructions or outputs, while others mainly improve consistency or quality. Keep the reduction fields at zero when no token reduction is expected.",
  },
];

export default function AiFineTuningCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Fine-Tuning Cost Calculator"
      description="Estimate the complete cost of preparing, training, evaluating, deploying, and maintaining a fine-tuned AI model, then compare it with the current base-model workflow."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Fine-tuning is not only a training charge. A realistic project can
              include dataset preparation, repeated experiments, evaluation,
              endpoint fees, ongoing inference, monitoring, and future
              retraining. This calculator brings those costs into one plan.
            </p>
          }
          sections={[
            {
              title: "Planning the Full Fine-Tuning Project Cost",
              content: (
                <>
                  <p>
                    Enter the number of training examples, average input and
                    output tokens, dataset expansion, training split, epochs,
                    and experimental runs. The calculator estimates the total
                    tokens processed during training.
                  </p>

                  <p>
                    Add the current training price for the exact provider and
                    model, plus human data-preparation work, evaluation cost,
                    and other implementation expenses. These become the initial
                    project cost.
                  </p>

                  <p>
                    Continuing cost includes tuned-model inference, endpoint or
                    hosting fees, monitoring, and a reserve for planned
                    retraining.
                  </p>
                </>
              ),
            },
            {
              title: "Comparing the Base and Tuned Workflows",
              content: (
                <>
                  <p>
                    Enter the current base-model input and output prices, then
                    enter the tuned-model prices. The calculator estimates both
                    workflows using the same monthly request volume.
                  </p>

                  <p>
                    Fine-tuning may allow shorter instructions, fewer examples
                    in the prompt, or shorter outputs. Optional reduction fields
                    model those changes without assuming they will always
                    happen.
                  </p>

                  <p>
                    The result shows monthly operating savings, planning
                    savings, first-year cost, payback period, and approximate
                    break-even request volume.
                  </p>
                </>
              ),
            },
            {
              title: "Estimating Dataset and Experiment Size",
              content: (
                <>
                  <p>
                    Dataset expansion can represent augmentation, repeated
                    examples, synthetic examples, or extra formatting added
                    before training. The training split removes validation or
                    test examples from the training-token total.
                  </p>

                  <p>
                    Epochs control how many times the training data is processed.
                    Experimental runs represent separate jobs used to test data
                    versions or training settings. Both values multiply the
                    training workload.
                  </p>
                </>
              ),
            },
            {
              title: "Using Current Official Prices",
              content: (
                <>
                  <p>
                    All monetary rates are blank by design. Enter the current
                    training and inference prices from the exact provider,
                    model, region, and account being considered.
                  </p>

                  <p>
                    Some providers charge by training tokens, while managed or
                    self-hosted platforms may charge by accelerator time,
                    instance time, reserved capacity, storage, or a private
                    quote. Convert those costs into the matching fields or place
                    them under evaluation, hosting, monitoring, or other setup.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://openai.com/api/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenAI API Pricing
                    </a>

                    <a
                      href="https://platform.openai.com/docs/guides/fine-tuning"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenAI Fine-Tuning Guide
                    </a>

                    <a
                      href="https://cloud.google.com/vertex-ai/generative-ai/docs/models/tune-models"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Vertex AI Model Tuning
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate training tokens before starting a job.</li>
                  <li>Include repeated experiments and dataset preparation.</li>
                  <li>Compare the base-model and tuned-model monthly cost.</li>
                  <li>Plan endpoint, monitoring, and retraining expenses.</li>
                  <li>Calculate cost per request and per successful request.</li>
                  <li>Estimate implementation payback and first-year savings.</li>
                  <li>Find the request volume needed to cover recurring costs.</li>
                  <li>Check the project against a monthly budget.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Benefits Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically value quality improvement,
                    lower error rates, faster review, better consistency, or
                    increased conversion. It also does not include taxes,
                    storage, data transfer, security review, compliance,
                    support, or failed training jobs unless entered.
                  </p>

                  <p>
                    Compare quality with a fixed evaluation set before treating
                    a lower estimated cost as a better final decision.
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
                  currentHref="/tools/ai-fine-tuning-cost-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

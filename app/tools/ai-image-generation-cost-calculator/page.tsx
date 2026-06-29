import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Image Generation Cost Calculator",

  description:
    "Estimate AI image generation costs using price per image, images per request, monthly requests, retries, and other fixed costs.",

  keywords: [
    "AI image generation cost calculator",
    "AI image cost calculator",
    "image API cost calculator",
    "text to image cost calculator",
    "AI image pricing calculator",
    "cost per generated image",
    "monthly image generation cost",
    "image model cost calculator",
    "generative AI image cost",
    "AI API budget calculator",
  ],

  alternates: {
    canonical:
      "https://beeija.com/tools/ai-image-generation-cost-calculator",
  },

  openGraph: {
    title: "AI Image Generation Cost Calculator",
    description:
      "Estimate AI image generation costs from image price, request volume, retries, and monthly fixed costs.",
    url: "https://beeija.com/tools/ai-image-generation-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Image Generation Cost Calculator",
    description:
      "Estimate the monthly cost of generating AI images with your own provider pricing.",
  },
};

const faqs = [
  {
    question: "How is AI image generation cost calculated?",
    answer:
      "The calculator multiplies successful images by the price per image, then adds retry or failed-generation cost and any monthly fixed costs.",
  },
  {
    question: "What should I enter as price per image?",
    answer:
      "Use the provider's effective price for the image size, quality, model, and speed you plan to use.",
  },
  {
    question: "Why include a retry percentage?",
    answer:
      "Some image requests may be repeated because of failed outputs, moderation blocks, user retries, or quality issues. Retries can increase total cost.",
  },
  {
    question: "Can I use this for any image model?",
    answer:
      "Yes. The calculator is provider-independent. Enter your own price per image and monthly usage.",
  },
  {
    question: "Does it include storage and delivery costs?",
    answer:
      "Only if you enter them as monthly fixed costs. Image storage, CDN delivery, editing, upscaling, and moderation may be billed separately.",
  },
  {
    question: "Are the results exact?",
    answer:
      "No. They are planning estimates. Your final bill may change because of provider price updates, retries, taxes, discounts, or extra services.",
  },
];

export default function AiImageGenerationCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Image Generation Cost Calculator"
      description="Estimate AI image generation costs using price per image, monthly requests, retries, and other fixed costs."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              AI image pricing is often shown per generated image, but the real
              monthly cost also depends on request volume, images per request,
              retries, storage, and other supporting services. This calculator
              brings those values together.
            </p>
          }
          sections={[
            {
              title: "How the AI Image Generation Cost Calculator Works",
              content: (
                <>
                  <p>
                    Enter the price charged for one generated image, the number
                    of images created in each request, and the expected requests
                    per month.
                  </p>

                  <p>
                    Add an estimated retry percentage for failed, repeated, or
                    rejected generations. You can also include monthly fixed
                    costs such as storage, CDN delivery, or moderation.
                  </p>

                  <p>
                    The calculator then shows the estimated cost per request,
                    day, month, and year.
                  </p>
                </>
              ),
            },
            {
              title: "What to Enter for a Useful Estimate",
              content: (
                <>
                  <p>
                    Use the exact provider price for the model, image size,
                    quality, and speed you plan to use. Different settings may
                    have different prices.
                  </p>

                  <p>
                    Use a realistic retry percentage. A production tool may
                    generate extra images because of user retries, moderation,
                    failed outputs, or quality control.
                  </p>

                  <p>
                    Test a small launch, a normal month, and a busy month to see
                    how the cost may grow with usage.
                  </p>
                </>
              ),
            },
            {
              title: "Common Ways to Use This Calculator",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate the monthly cost of an AI image generator.</li>
                  <li>Calculate cost per user request.</li>
                  <li>Compare image models or quality levels.</li>
                  <li>Estimate the impact of retries and failed outputs.</li>
                  <li>Add storage, delivery, or moderation costs.</li>
                  <li>Prepare an early image API budget.</li>
                </ul>
              ),
            },
            {
              title: "Simple AI Image Cost Example",
              content: (
                <>
                  <p>
                    Imagine a tool that receives 20,000 requests per month and
                    generates two images per request. For an illustrative example only, assume each image costs $0.04
                    and retries add another 8%. Replace the image price with the
                    current official rate before using the result.
                  </p>

                  <p>
                    The calculator will show the base image cost, retry cost,
                    monthly total, and cost per request.
                  </p>
                </>
              ),
            },
            {
              title: "Pricing and Estimate Notes",
              content: (
                <>
                  <p>
                    This calculator does not store provider prices. Enter the
                    rate for the image model and settings you want to test.
                  </p>

                  <p>
                    Always check the latest official provider pricing before
                    making a final budget. Storage, CDN delivery, editing,
                    upscaling, moderation, taxes, and other services may add
                    separate costs.
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
                  currentHref="/tools/ai-image-generation-cost-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI GPU Inference Cost Calculator",
  description:
    "Estimate self-hosted AI GPU inference cost using model memory, tokens, measured throughput, batching, utilization, replicas, GPU hours, setup, and managed API comparison.",
  keywords: [
    "AI GPU inference cost calculator",
    "LLM GPU cost calculator",
    "self hosted LLM cost calculator",
    "GPU inference pricing calculator",
    "AI inference server cost",
    "LLM serving cost calculator",
    "model hosting cost calculator",
    "GPU hours calculator AI",
    "vLLM cost calculator",
    "Triton inference cost calculator",
    "AI API vs self hosted cost",
    "LLM inference unit economics",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-gpu-inference-cost-calculator",
  },
  openGraph: {
    title: "AI GPU Inference Cost Calculator",
    description:
      "Calculate GPU and replica hours, idle capacity, cost per request, managed API comparison, payback, and break-even inference volume.",
    url: "https://beeija.com/tools/ai-gpu-inference-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI GPU Inference Cost Calculator",
    description:
      "Estimate self-hosted GPU inference cost per request, month, and first year.",
  },
};

const faqs = [
  {
    question: "What numbers should I benchmark before using this calculator?",
    answer:
      "Measure prompt-processing tokens per second and generation tokens per second on the same model, quantization, GPU count, serving engine, batch settings, and context profile planned for production.",
  },
  {
    question: "Why are prompt and generation throughput separate?",
    answer:
      "Processing input tokens and generating output tokens can have very different performance. Separating them produces a more realistic compute-seconds estimate for each request.",
  },
  {
    question: "How does batching affect inference cost?",
    answer:
      "Batching can increase throughput by combining compatible requests, but the real gain depends on traffic, sequence lengths, latency targets, and the serving engine. Enter a measured or tested uplift rather than a guessed maximum.",
  },
  {
    question: "Why include a minimum replica count?",
    answer:
      "Real-time endpoints may keep capacity running for availability and low latency even when traffic is low. Minimum replicas can create paid idle hours that dominate cost at smaller volumes.",
  },
  {
    question: "How is the managed API baseline calculated?",
    answer:
      "The calculator multiplies monthly input and output tokens by the custom API rates entered. It compares that usage cost with self-hosted GPU, host, platform, and amortised setup costs.",
  },
  {
    question: "What is the break-even request volume?",
    answer:
      "It is the approximate monthly request volume where the calculated self-hosted planning cost becomes equal to or lower than the entered managed API cost.",
  },
];

export default function AiGpuInferenceCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI GPU Inference Cost Calculator"
      description="Estimate the complete cost of serving an AI model on GPUs using model memory, measured throughput, batching, target utilization, minimum replicas, infrastructure costs, and a managed API comparison."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Self-hosted inference cost depends on more than the GPU hourly
              rate. Model memory determines the GPUs needed per replica, token
              throughput determines busy time, and availability requirements
              create idle capacity. This calculator combines those factors.
            </p>
          }
          sections={[
            {
              title: "Calculating GPU and Replica Capacity",
              content: (
                <>
                  <p>
                    Enter model and runtime memory, usable memory per GPU, and
                    measured prompt and generation throughput for one complete
                    replica. The calculator estimates the minimum GPUs needed by
                    memory and the compute time used by one request.
                  </p>

                  <p>
                    Monthly busy replica-hours are adjusted for retries,
                    batching, target utilization, and capacity reserve. The
                    result then applies the minimum replica floor to estimate
                    billable replica-hours and GPU-hours.
                  </p>

                  <p>
                    Throughput must come from the same deployment shape used for
                    the estimate. A benchmark from one GPU should not be entered
                    as replica throughput when the production replica uses
                    several GPUs.
                  </p>
                </>
              ),
            },
            {
              title: "Including Batching, Utilization, and Idle Capacity",
              content: (
                <>
                  <p>
                    NVIDIA Triton documents dynamic batching as a way to combine
                    requests and typically increase throughput for stateless
                    models. The actual improvement depends on request arrival
                    patterns, sequence length, queue delay, and latency targets.
                  </p>

                  <p>
                    Target utilization leaves headroom for traffic variation.
                    Capacity reserve adds another planning margin. Minimum
                    replicas can create idle GPU-hours when the monthly workload
                    is lower than the always-on capacity.
                  </p>

                  <p>
                    The calculator reports effective utilization, idle
                    replica-hours, average running replicas, and the share of
                    total cost caused by the minimum replica floor.
                  </p>
                </>
              ),
            },
            {
              title: "Planning Autoscaling and Endpoint Availability",
              content: (
                <>
                  <p>
                    Managed inference platforms can add and remove instances in
                    response to workload. Scaling rules, cooldown time, startup
                    delay, minimum replicas, and scale-to-zero support vary by
                    endpoint type and provider.
                  </p>

                  <p>
                    Amazon SageMaker AI documents endpoint autoscaling that
                    adjusts provisioned instances as workload changes. Vertex AI
                    also supports inference-node autoscaling with configured
                    minimum and maximum replicas.
                  </p>

                  <p>
                    Use the minimum-replica field to represent the availability
                    floor that applies to the exact deployment option being
                    planned.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/batcher.html"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      NVIDIA Triton Batching
                    </a>

                    <a
                      href="https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling.html"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      SageMaker Autoscaling
                    </a>

                    <a
                      href="https://docs.cloud.google.com/vertex-ai/docs/predictions/autoscaling"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Vertex AI Autoscaling
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Comparing Self-Hosting With a Managed API",
              content: (
                <>
                  <p>
                    Enter managed API input and output prices for a comparable
                    model or service. The calculator compares token-based API
                    usage with self-hosted GPU, host, storage, networking,
                    monitoring, and amortised setup cost.
                  </p>

                  <p>
                    Results include monthly and first-year differences,
                    implementation payback, and the approximate request volume
                    where self-hosting becomes cheaper under the entered
                    assumptions.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate GPU inference cost before deployment.</li>
                  <li>Calculate GPUs required by model memory.</li>
                  <li>Turn measured token throughput into replica-hours.</li>
                  <li>Measure idle cost from minimum replicas.</li>
                  <li>Test batching and utilization assumptions.</li>
                  <li>Calculate cost per request and per million tokens.</li>
                  <li>Compare self-hosting with a managed API.</li>
                  <li>Find payback and break-even request volume.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Performance Risks Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include engineering
                    support, failed deployments, reserved-capacity commitments,
                    spot interruptions, regional premiums, taxes, egress,
                    database cost, security review, or the business cost of
                    latency and downtime unless entered.
                  </p>

                  <p>
                    Throughput can change with context length, output length,
                    quantization, tensor parallelism, batching, model
                    architecture, serving software, and latency requirements.
                    Production-like load testing remains essential.
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
                    href="/tools/ai-model-routing-savings-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Model Routing Savings Calculator
                  </Link>

                  <Link
                    href="/tools/ai-batch-api-savings-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Batch API Savings Calculator
                  </Link>

                  <Link
                    href="/tools/ai-prompt-caching-savings-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Prompt Caching Savings Calculator
                  </Link>

                  <Link
                    href="/tools/ai-context-window-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Context Window Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-agent-workflow-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Agent Workflow Cost Calculator
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

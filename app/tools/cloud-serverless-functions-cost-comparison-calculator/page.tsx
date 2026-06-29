import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

const pricingCheckedDate = "June 25, 2026";

export const metadata: Metadata = {
  title: "Cloud Serverless Functions Cost Comparison Calculator",
  description:
    "Compare AWS Lambda, Azure Functions, and Google Cloud Run functions using requests, execution time, memory, vCPU, warm capacity, storage, transfer, logging, discounts, and migration cost.",
  keywords: [
    "cloud serverless functions cost comparison calculator",
    "serverless function pricing calculator",
    "AWS Lambda cost calculator",
    "Azure Functions cost calculator",
    "Google Cloud Run functions cost calculator",
    "Lambda vs Azure Functions vs Google Cloud cost",
    "function as a service cost comparison",
    "serverless GB second calculator",
    "provisioned concurrency cost calculator",
    "Azure Functions Flex Consumption cost",
    "Cloud Run functions pricing calculator",
    "serverless migration cost calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/cloud-serverless-functions-cost-comparison-calculator",
  },
  openGraph: {
    title: "Cloud Serverless Functions Cost Comparison Calculator",
    description:
      "Compare complete serverless function costs across AWS, Azure, and Google Cloud using current regional prices entered for each plan.",
    url: "https://beeija.com/tools/cloud-serverless-functions-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Serverless Functions Cost Comparison Calculator",
    description:
      "Estimate monthly and first-year serverless function costs across AWS Lambda, Azure Functions, and Google Cloud Run functions.",
  },
};

const faqs = [
  {
    question: "Why are provider prices left blank?",
    answer:
      "Serverless function prices vary by region, architecture, hosting plan, billing mode, free grants, warm-capacity setup, commitment, currency, and account agreement. Blank fields let you enter the current effective rates for the exact configuration being compared.",
  },
  {
    question: "What is the difference between GB-second and vCPU-plus-memory billing?",
    answer:
      "GB-second billing prices execution from allocated memory multiplied by execution time. vCPU-plus-memory billing prices CPU seconds and memory GB-seconds separately. Use the billing mode shown for the selected provider plan.",
  },
  {
    question: "How are provisioned concurrency and always-ready instances calculated?",
    answer:
      "Warm capacity has a baseline cost for the configured warm instances and a separate execution cost for the percentage of requests handled by those instances. This supports AWS Lambda Provisioned Concurrency, Azure Functions Always Ready, and minimum-instance or warm-capacity designs.",
  },
  {
    question: "How are free grants applied?",
    answer:
      "The calculator applies entered free requests, free GB-seconds, and free vCPU-seconds to on-demand usage only. This matches plans where free grants do not apply to provisioned, always-ready, premium, or minimum-instance capacity.",
  },
  {
    question: "Can legacy Azure Functions Consumption and first-generation Google functions be compared?",
    answer:
      "Yes. Select the matching service plan and billing mode, then enter the current rates. Azure recommends Flex Consumption for new serverless function apps, while Google Cloud Run functions use Cloud Run billing for current source deployments and functions.",
  },
  {
    question: "Does the estimate include Eventarc, API Gateway, storage accounts, build services, or artifact storage?",
    answer:
      "Only when entered under fixed monthly services or another relevant field. Trigger delivery, gateways, storage accounts, build minutes, artifact storage, queues, databases, and related services are normally billed separately.",
  },
];

export default function CloudServerlessFunctionsCostComparisonCalculatorPage() {
  return (
    <ToolShell
      category="Cloud Cost Calculators"
      title="Cloud Serverless Functions Cost Comparison Calculator"
      description="Compare complete serverless function costs across AWS Lambda, Azure Functions, Google Cloud Run functions, or a custom plan using your current regional prices."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              A serverless function bill can include request charges,
              execution memory, CPU time, provisioned or always-ready
              capacity, temporary storage, outbound transfer, logging,
              deployment services, fixed platform costs, and migration work.
              This calculator keeps those cost layers visible instead of
              comparing only one request or GB-second rate.
            </p>
          }
          sections={[
            {
              title: "Comparing the Same Function Workload",
              content: (
                <>
                  <p>
                    Enter one shared workload and up to three provider plans.
                    The shared workload includes monthly requests, average
                    execution time, allocated memory, vCPU, temporary storage,
                    warm-request share, warm instances, warm hours, outbound
                    transfer, logging, and a monthly budget.
                  </p>

                  <p>
                    Each plan can use its own provider, region, service plan,
                    billing mode, architecture, request price, free grant,
                    compute price, warm-capacity price, storage price,
                    transfer price, logging price, discount, fixed monthly
                    cost, and migration cost.
                  </p>

                  <p>
                    Configured plans are ranked by monthly planning cost. The
                    result also shows first-year cost, cost per million
                    requests, cost per execution, estimated average
                    concurrency, budget position, and the possible saving
                    against the lowest configured plan.
                  </p>
                </>
              ),
            },
            {
              title: "Request, Memory, and CPU Billing Models",
              content: (
                <>
                  <p>
                    AWS Lambda and Azure Functions consumption plans commonly
                    use request charges plus memory-based execution measured
                    in GB-seconds. Google Cloud Run functions operate as Cloud
                    Run services and can use request-based CPU and memory
                    billing.
                  </p>

                  <p>
                    Select memory-only execution billing when the provider
                    charges requests and GB-seconds. Select separate CPU and
                    memory billing when vCPU-seconds and GB-seconds are priced
                    independently. A complete monthly plan option supports
                    bundled or negotiated quotes.
                  </p>

                  <p>
                    The calculator uses the exact duration, memory, and vCPU
                    workload entered. It does not assume that similarly sized
                    function configurations have equal performance.
                  </p>
                </>
              ),
            },
            {
              title: "Warm Capacity, Provisioned Concurrency, and Always Ready",
              content: (
                <>
                  <p>
                    AWS Lambda Provisioned Concurrency charges for configured
                    warm capacity and uses a separate execution price while
                    that capacity serves requests. Azure Functions Flex
                    Consumption can charge an Always Ready baseline, Always
                    Ready execution time, and executions. Cloud Run functions
                    can use minimum instances or instance-based designs that
                    create an idle or baseline cost.
                  </p>

                  <p>
                    Enter the percentage of requests expected to use warm
                    capacity, the number of warm instances, monthly warm
                    hours, and the memory and vCPU allocated to each warm
                    instance. Each provider plan can then use separate warm
                    baseline and warm execution rates.
                  </p>

                  <p>
                    If warm request or warm execution pricing is left blank,
                    the calculator falls back to the plan's normal request or
                    execution rate. This keeps the comparison usable when the
                    provider uses the same rate for both paths.
                  </p>
                </>
              ),
            },
            {
              title: "Free Grants, Temporary Storage, Transfer, and Logging",
              content: (
                <>
                  <p>
                    Free requests and free compute grants are entered per
                    provider plan and applied to on-demand usage. This avoids
                    applying consumption-plan grants to provisioned,
                    always-ready, or premium capacity when the provider does
                    not allow it.
                  </p>

                  <p>
                    Temporary or ephemeral storage is calculated only above
                    the included amount entered for the plan. Outbound data
                    transfer and logging ingestion are calculated separately
                    because they can materially exceed the function execution
                    charge.
                  </p>

                  <p>
                    Trigger delivery, API gateways, storage accounts, build
                    services, artifact registries, queues, databases, and
                    private networking are not automatically included. Add
                    them under fixed monthly services when they belong in the
                    comparison.
                  </p>
                </>
              ),
            },
            {
              title: "Current Pricing Sources and Checked Date",
              content: (
                <>
                  <p>
                    Product names, hosting plans, billing structures, free
                    grant rules, and warm-capacity models were checked on{" "}
                    {pricingCheckedDate}. Prices remain blank because actual
                    rates depend on region, architecture, plan, runtime,
                    commitment, currency, free-tier eligibility, and account
                    agreement.
                  </p>

                  <p>
                    Use each provider pricing page or account calculator to
                    enter the current effective rates for the exact
                    configuration. This prevents one regional example from
                    being presented as a universal price.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://aws.amazon.com/lambda/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      AWS Lambda Pricing
                    </a>

                    <a
                      href="https://azure.microsoft.com/en-us/pricing/details/functions/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Azure Functions Pricing
                    </a>

                    <a
                      href="https://cloud.google.com/run/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Google Cloud Run Pricing
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Compare AWS Lambda, Azure Functions, and Google Cloud Run functions using one workload.</li>
                  <li>Compare request-plus-GB-second and CPU-plus-memory billing.</li>
                  <li>Measure provisioned concurrency, always-ready, and minimum-instance cost.</li>
                  <li>Apply provider-specific free requests and compute grants.</li>
                  <li>Add temporary storage, transfer, and logging charges.</li>
                  <li>Compare architecture or commitment discounts.</li>
                  <li>Add platform, gateway, build, storage, or support costs.</li>
                  <li>Measure monthly operating and first-year migration cost.</li>
                  <li>Check each serverless plan against a monthly budget.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Limits Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include taxes, premium
                    cloud support, API gateways, Eventarc, Event Grid, SNS,
                    SQS, storage accounts, Cloud Build, Artifact Registry,
                    container registries, queues, databases, private
                    networking, public IPv4 addresses, migration labour,
                    negotiated credits, or services not entered.
                  </p>

                  <p>
                    Similar memory and vCPU allocations do not guarantee
                    similar function performance. Runtime startup, processor
                    architecture, concurrency, cold starts, timeout limits,
                    network latency, event delivery, and managed integrations
                    differ. Test a representative workload before choosing a
                    provider.
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
              title: "Explore Related Cost Tools",
              content: (
                <BeeijaRelatedTools currentHref="/tools/cloud-serverless-functions-cost-comparison-calculator" />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

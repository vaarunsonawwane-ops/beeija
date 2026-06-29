import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

const pricingCheckedDate = "June 25, 2026";

export const metadata: Metadata = {
  title: "Cloud Redis Cost Comparison Calculator",
  description:
    "Compare Amazon ElastiCache, Azure Managed Redis, and Google Cloud Memorystore using node, serverless, memory, request, backup, transfer, and migration costs.",
  keywords: [
    "cloud redis cost comparison calculator",
    "managed redis pricing calculator",
    "Amazon ElastiCache cost calculator",
    "Azure Managed Redis cost calculator",
    "Google Cloud Memorystore cost calculator",
    "Valkey cost calculator",
    "AWS vs Azure vs Google Cloud Redis pricing",
    "Redis cluster cost calculator",
    "Redis serverless cost calculator",
    "managed cache cost comparison",
    "Redis node cost calculator",
    "Redis migration cost calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/cloud-redis-cost-comparison-calculator",
  },
  openGraph: {
    title: "Cloud Redis Cost Comparison Calculator",
    description:
      "Compare complete managed Redis and Valkey costs across AWS, Azure, and Google Cloud using current regional prices entered for each plan.",
    url: "https://beeija.com/tools/cloud-redis-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Redis Cost Comparison Calculator",
    description:
      "Estimate monthly and first-year Redis or Valkey costs across Amazon ElastiCache, Azure Managed Redis, and Google Cloud Memorystore.",
  },
};

const faqs = [
  {
    question: "Why are provider prices left blank?",
    answer:
      "Managed Redis and Valkey prices change by region, product, tier, memory size, node type, availability, commitment, currency, and account agreement. Blank fields let you enter the current effective prices for the exact plan being considered.",
  },
  {
    question: "How are shards and replicas counted?",
    answer:
      "The calculator multiplies the number of primary shards by one primary node plus the selected replicas per shard. A workload with two shards and one replica per shard therefore has four cache nodes.",
  },
  {
    question: "How does serverless Redis or Valkey pricing work in this calculator?",
    answer:
      "Select the serverless usage billing model, then enter current data-storage and request or processing-unit rates. An optional hourly base price can also be included when the provider has a minimum or fixed hourly charge.",
  },
  {
    question: "How is memory capacity checked?",
    answer:
      "Required cache memory equals the dataset size plus the selected memory overhead. Enter the usable application memory of each provider plan to see the memory headroom or shortfall.",
  },
  {
    question: "Can committed-use or reserved pricing be compared?",
    answer:
      "Yes. Enter the effective discount percentage for eligible node, deployment, serverless-storage, and request usage. Backup, transfer, extended support, fixed services, and migration costs remain separate.",
  },
  {
    question: "Does the calculator include Redis OSS extended support?",
    answer:
      "It can. Enter a current extended-support price per cache node-hour when the selected provider and Redis OSS version require it. Leave the field blank when it does not apply.",
  },
];

export default function CloudRedisCostComparisonCalculatorPage() {
  return (
    <ToolShell
      category="Cloud Cost Calculators"
      title="Cloud Redis Cost Comparison Calculator"
      description="Compare complete managed Redis and Valkey costs across Amazon ElastiCache, Azure Managed Redis, Google Cloud Memorystore, or a custom plan using your current regional prices."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Managed Redis and Valkey bills can include cache nodes, complete
              deployment prices, serverless data storage, processing or request
              units, replicas, backup storage, data transfer, extended support,
              fixed services, and migration cost. This calculator keeps those
              cost layers visible instead of comparing only one hourly number.
            </p>
          }
          sections={[
            {
              title: "Comparing the Same Redis or Valkey Workload",
              content: (
                <>
                  <p>
                    Enter one shared workload and up to three provider plans.
                    The shared workload includes running hours, average dataset
                    size, memory overhead, primary shards, replicas per shard,
                    monthly requests, backup storage, data transfer, and a
                    monthly budget.
                  </p>

                  <p>
                    Each plan can use its own provider, region, product, billing
                    model, configuration name, usable memory, hourly price,
                    serverless storage rate, request rate, backup price, transfer
                    price, extended-support rate, discount, fixed monthly cost,
                    and migration cost.
                  </p>

                  <p>
                    Configured plans are ranked by monthly planning cost. The
                    result also shows first-year cost, cost per usable memory GB,
                    cost per million requests, memory headroom, and the possible
                    saving against the lowest configured plan.
                  </p>
                </>
              ),
            },
            {
              title: "Handling Node, Deployment, and Serverless Billing",
              content: (
                <>
                  <p>
                    Node-based products usually charge for every cache node.
                    The per-node model multiplies the hourly rate by all primary
                    and replica nodes in the shared topology.
                  </p>

                  <p>
                    Some Azure or custom prices can represent the complete
                    selected deployment. Use the whole-deployment model when one
                    hourly price already includes the chosen availability and
                    capacity. A custom-unit model is available when the provider
                    bills several identical hourly units that do not match the
                    calculated node count.
                  </p>

                  <p>
                    Serverless services can charge for average stored data and
                    processing or request usage. The serverless model calculates
                    GB-hours and monthly request units separately while still
                    allowing an optional fixed hourly base price.
                  </p>
                </>
              ),
            },
            {
              title: "Sizing Shards, Replicas, and Memory Headroom",
              content: (
                <>
                  <p>
                    A shard contains one writable primary and the selected number
                    of replicas. Total cache nodes equal primary shards multiplied
                    by one plus replicas per shard. Replicas improve availability
                    and read capacity but normally hold another copy of the shard
                    data.
                  </p>

                  <p>
                    Required memory equals the average dataset plus memory
                    overhead for fragmentation, metadata, replication buffers,
                    eviction safety, and growth. Enter the usable application
                    memory of each selected plan rather than its marketing
                    capacity when reserved memory reduces usable space.
                  </p>

                  <p>
                    Similar memory capacities do not guarantee similar
                    throughput or latency. Test representative commands, value
                    sizes, connections, persistence settings, and failover
                    behaviour before choosing a provider.
                  </p>
                </>
              ),
            },
            {
              title: "Current Pricing Sources and Checked Date",
              content: (
                <>
                  <p>
                    Product names, pricing structures, and billing guidance were
                    checked on {pricingCheckedDate}. Prices remain blank because
                    actual rates depend on region, engine, node type, tier,
                    memory, availability, commitment, currency, and account
                    agreement.
                  </p>

                  <p>
                    Use each provider pricing page or account calculator to enter
                    the current effective rates for the exact configuration. This
                    prevents one regional example from being presented as a
                    universal price.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://aws.amazon.com/elasticache/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Amazon ElastiCache Pricing
                    </a>

                    <a
                      href="https://azure.microsoft.com/en-us/pricing/details/managed-redis/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Azure Managed Redis Pricing
                    </a>

                    <a
                      href="https://cloud.google.com/memorystore/valkey/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Memorystore for Valkey Pricing
                    </a>

                    <a
                      href="https://cloud.google.com/memorystore/docs/redis/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Memorystore for Redis Pricing
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Compare managed Redis and Valkey providers.</li>
                  <li>Compare node-based and serverless billing.</li>
                  <li>Measure the cost of shards and replicas.</li>
                  <li>Check whether a plan has enough usable memory.</li>
                  <li>Include request or processing-unit charges.</li>
                  <li>Add backup storage and internet transfer.</li>
                  <li>Include Redis OSS extended-support cost.</li>
                  <li>Compare commitment discounts and monthly budgets.</li>
                  <li>Measure first-year migration impact.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Limits Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include taxes, premium
                    support, private connectivity, monitoring, persistence
                    storage, cross-region replication, global databases, backup
                    exports, encryption key requests, public IP addresses,
                    migration labour, negotiated credits, or services not
                    entered in a custom cost field.
                  </p>

                  <p>
                    Provider products also differ in supported Redis or Valkey
                    versions, modules, persistence, clustering, scaling,
                    maintenance, multi-zone design, failover, networking,
                    connection limits, and throughput. Cost should be compared
                    together with technical fit and tested performance.
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
                <BeeijaRelatedTools currentHref="/tools/cloud-redis-cost-comparison-calculator" />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Cloud PostgreSQL Cost Comparison Calculator",
  description:
    "Compare Amazon RDS for PostgreSQL, Azure Database for PostgreSQL Flexible Server, and Google Cloud SQL using compute, HA, replicas, storage, IOPS, backups, transfer, support, and migration cost.",
  keywords: [
    "cloud PostgreSQL cost calculator",
    "RDS PostgreSQL cost calculator",
    "Azure PostgreSQL cost calculator",
    "Cloud SQL PostgreSQL cost calculator",
    "RDS vs Azure PostgreSQL vs Cloud SQL",
    "managed PostgreSQL cost comparison",
    "PostgreSQL high availability cost",
    "cloud database cost calculator",
    "managed database pricing comparison",
    "PostgreSQL read replica cost",
    "PostgreSQL backup cost calculator",
    "cloud database migration cost",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/cloud-postgresql-cost-comparison-calculator",
  },
  openGraph: {
    title: "Cloud PostgreSQL Cost Comparison Calculator",
    description:
      "Compare compute, high availability, replicas, storage, IOPS, backups, networking, and first-year PostgreSQL cost.",
    url: "https://beeija.com/tools/cloud-postgresql-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud PostgreSQL Cost Comparison Calculator",
    description:
      "Estimate and compare complete monthly and first-year managed PostgreSQL costs.",
  },
};

const faqs = [
  {
    question: "Why are provider prices blank?",
    answer:
      "Managed PostgreSQL prices vary by region, compute tier, machine size, availability mode, storage type, commitment, currency, and account agreement. Blank fields let you use the current rates for the exact configuration being compared.",
  },
  {
    question: "How does high availability affect the estimate?",
    answer:
      "The selected availability mode sets the number of primary and standby nodes used by the plan. Read replicas are then added separately because they serve a different scaling purpose.",
  },
  {
    question: "What is the difference between combined and split compute pricing?",
    answer:
      "Combined pricing uses one hourly rate for a complete database node. Split pricing calculates the node rate from separate vCPU and memory prices. Use the mode that matches the provider pricing page or your invoice.",
  },
  {
    question: "Why are storage and backup entered separately?",
    answer:
      "Provisioned database storage remains attached to database nodes, while backup and snapshot storage follows separate retention and included-allowance rules. The calculator charges only backup storage above the entered included amount.",
  },
  {
    question: "Does a high-availability standby serve read traffic?",
    answer:
      "It depends on the provider and deployment type. A normal standby may exist only for failover, while some multi-node deployments offer readable standbys. Read replicas in this calculator are added separately so the workload is clear.",
  },
  {
    question: "What is included in first-year cost?",
    answer:
      "First-year cost includes twelve months of compute and recurring services, storage growth across the year, and the complete one-time migration cost.",
  },
];

export default function CloudPostgresqlCostComparisonCalculatorPage() {
  return (
    <ToolShell
      category="Cloud Cost Calculators"
      title="Cloud PostgreSQL Cost Comparison Calculator"
      description="Compare complete managed PostgreSQL costs across Amazon RDS, Azure Database for PostgreSQL Flexible Server, and Google Cloud SQL using the same workload and current regional prices."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Managed PostgreSQL cost includes more than a database hourly
              rate. High availability adds standby capacity, read replicas add
              serving nodes, and storage, IOPS, backups, transfer, monitoring,
              extended support, and migration work can materially change the
              final bill.
            </p>
          }
          sections={[
            {
              title: "Comparing the Same PostgreSQL Workload",
              content: (
                <>
                  <p>
                    Enter one shared workload and compare three provider
                    configurations. The workload includes primary servers,
                    read replicas, active hours, vCPUs, memory, storage,
                    monthly storage growth, provisioned IOPS, I/O requests,
                    backup storage, and outbound data.
                  </p>

                  <p>
                    Each plan can use a different provider, region,
                    availability mode, compute tier, storage type, pricing
                    basis, commitment discount, backup allowance, and current
                    price inputs.
                  </p>

                  <p>
                    The result ranks configured plans by monthly planning cost
                    and reports cost per node-hour, vCPU-hour, stored TB,
                    current month, and first year.
                  </p>
                </>
              ),
            },
            {
              title: "Modelling Primary Nodes, Standbys, and Read Replicas",
              content: (
                <>
                  <p>
                    A standalone deployment uses one database node per primary
                    server. High-availability modes add one or more standby
                    nodes according to the selected provider architecture.
                    Read replicas are added separately for read scaling.
                  </p>

                  <p>
                    Amazon RDS supports Single-AZ, Multi-AZ with one standby,
                    and Multi-AZ database clusters with two readable standby
                    instances. Azure Database for PostgreSQL Flexible Server
                    supports no HA, same-zone HA, and zone-redundant HA. Cloud
                    SQL supports zonal and regional high-availability
                    configurations.
                  </p>

                  <p>
                    The calculator applies the selected node multiplier to
                    compute, database storage, and provisioned IOPS. This is a
                    planning model, so compare the result with the provider
                    calculator before purchase.
                  </p>
                </>
              ),
            },
            {
              title: "Using Combined or Split Compute Prices",
              content: (
                <>
                  <p>
                    Amazon RDS commonly presents a complete instance-hour rate.
                    Azure and Google Cloud can expose compute through vCore or
                    vCPU and memory dimensions. The calculator supports both
                    approaches.
                  </p>

                  <p>
                    In combined mode, enter one hourly price for the complete
                    node. In split mode, enter the current vCPU and memory
                    prices; the calculator builds the node-hour price from the
                    shared vCPU and memory configuration.
                  </p>

                  <p>
                    Commitment or reservation discounts apply only to compute
                    in this estimate. Storage, backup, IOPS, transfer, and
                    fixed services remain separate.
                  </p>
                </>
              ),
            },
            {
              title: "Including Storage, IOPS, Backups, and Network Cost",
              content: (
                <>
                  <p>
                    Managed PostgreSQL pricing can include provisioned database
                    storage, provisioned IOPS, billable I/O requests, backup or
                    snapshot storage, outbound transfer, public IP charges,
                    monitoring, and extended-version support.
                  </p>

                  <p>
                    Enter the total backup storage used and the amount included
                    without an additional storage charge. Only the remaining
                    backup volume is charged by the calculator.
                  </p>

                  <p>
                    Monthly storage growth is used to project the first-year
                    storage bill. The current monthly result uses the current
                    provisioned storage value.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://aws.amazon.com/rds/postgresql/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Amazon RDS PostgreSQL Pricing
                    </a>

                    <a
                      href="https://azure.microsoft.com/en-us/pricing/details/postgresql/flexible-server/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Azure PostgreSQL Pricing
                    </a>

                    <a
                      href="https://cloud.google.com/sql/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Cloud SQL Pricing
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Compare managed PostgreSQL providers using one workload.</li>
                  <li>Measure the cost of high availability and read replicas.</li>
                  <li>Compare combined and split compute pricing.</li>
                  <li>Include storage, IOPS, I/O requests, and backups.</li>
                  <li>Estimate outbound transfer and extended support.</li>
                  <li>Plan storage growth across the first year.</li>
                  <li>Calculate cost per node-hour and vCPU-hour.</li>
                  <li>Compare migration cost and monthly budget impact.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Limits Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include taxes, support
                    plans, private connectivity, NAT gateways, connection
                    proxies, cross-zone application traffic, log ingestion,
                    security services, observability retention, database
                    administration labour, or application rewrite work unless
                    entered in a fixed-cost field.
                  </p>

                  <p>
                    Provider billing can use minimum billing periods, tiered
                    network rates, included backup allowances, storage
                    auto-growth, burst credits, negotiated discounts, and
                    provider-specific high-availability pricing. Use current
                    effective prices from the official calculator or billing
                    export.
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
                <BeeijaRelatedTools currentHref="/tools/cloud-postgresql-cost-comparison-calculator" />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

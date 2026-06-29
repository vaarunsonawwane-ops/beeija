import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

const pricingCheckedDate = "June 24, 2026";

export const metadata: Metadata = {
  title: "Cloud MySQL Cost Comparison Calculator",
  description:
    "Compare Amazon RDS for MySQL, Azure Database for MySQL Flexible Server, and Google Cloud SQL using compute, HA, replicas, storage, IOPS, backups, transfer, extended support, and migration cost.",
  keywords: [
    "cloud mysql cost comparison calculator",
    "MySQL cloud pricing calculator",
    "Amazon RDS MySQL cost calculator",
    "Azure Database for MySQL cost calculator",
    "Google Cloud SQL MySQL cost calculator",
    "AWS vs Azure vs Google Cloud MySQL",
    "managed MySQL cost comparison",
    "RDS vs Azure MySQL vs Cloud SQL",
    "MySQL high availability cost",
    "MySQL read replica cost",
    "cloud database migration cost",
    "managed database pricing comparison",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/cloud-mysql-cost-comparison-calculator",
  },
  openGraph: {
    title: "Cloud MySQL Cost Comparison Calculator",
    description:
      "Compare complete managed MySQL cost across AWS, Azure, and Google Cloud using current regional prices entered for each configuration.",
    url: "https://beeija.com/tools/cloud-mysql-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud MySQL Cost Comparison Calculator",
    description:
      "Estimate monthly and first-year managed MySQL cost across Amazon RDS, Azure Database for MySQL, and Google Cloud SQL.",
  },
};

const faqs = [
  {
    question: "Why are the provider prices left blank?",
    answer:
      "Managed MySQL prices vary by region, machine family, service tier, storage type, availability setup, commitment, currency, and account agreement. Blank fields let you enter the current effective prices for the exact configuration being considered.",
  },
  {
    question: "How does the calculator handle high availability?",
    answer:
      "Each provider plan includes an availability option with its own database-copy count. A standard two-node HA setup uses one primary and one standby. Amazon RDS Multi-AZ DB clusters can use three database instances, so that option uses three copies.",
  },
  {
    question: "How are read replicas calculated?",
    answer:
      "Every read replica adds another compute and storage charge. Enter the current replica compute, storage, and IOPS rates separately so a replica can use a different region, machine size, or storage setup.",
  },
  {
    question: "How is backup storage estimated?",
    answer:
      "The calculator supports no included backup allowance, an allowance equal to primary provisioned storage, or a custom included amount. Only backup usage above the selected allowance is charged.",
  },
  {
    question: "Can the calculator include both provisioned IOPS and paid I/O?",
    answer:
      "Yes. Enter one provisioned-IOPS rate for the selected primary or HA deployment and another per-replica rate. Paid or request-based I/O is calculated separately from the total billable I/O entered for the deployment.",
  },
  {
    question: "Does the estimate include extended support?",
    answer:
      "It can. Enter the provider's current extended-support price per vCPU-hour when the selected MySQL major version is outside standard support. The calculator applies that rate to all billable database copies.",
  },
];

export default function CloudMySQLCostComparisonCalculatorPage() {
  return (
    <ToolShell
      category="Cloud Cost Calculators"
      title="Cloud MySQL Cost Comparison Calculator"
      description="Compare complete managed MySQL costs across Amazon RDS for MySQL, Azure Database for MySQL Flexible Server, Google Cloud SQL for MySQL, or a custom plan using your current regional prices."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Managed MySQL bills can include database compute, high
              availability, read replicas, provisioned storage, IOPS, paid I/O,
              backup storage, internet transfer, extended support, fixed
              services, and migration cost. This calculator combines those
              cost layers instead of comparing only an hourly database price.
            </p>
          }
          sections={[
            {
              title: "Comparing the Same MySQL Workload",
              content: (
                <>
                  <p>
                    Enter one shared database workload and up to three provider
                    plans. The shared workload includes running hours, vCPUs,
                    primary storage, backup usage, provisioned IOPS, billable
                    I/O, data transfer, read replicas, and a monthly budget.
                  </p>

                  <p>
                    Each plan can use its own provider, region, service tier,
                    availability setup, machine name, compute rate, storage
                    rate, backup allowance, IOPS price, paid-I/O price, egress
                    price, extended-support rate, discount, fixed monthly cost,
                    and migration cost.
                  </p>

                  <p>
                    The result ranks configured plans by monthly planning cost
                    and reports first-year cost, cost per billable vCPU, cost
                    per primary storage GB, and the possible saving against the
                    lowest configured plan.
                  </p>
                </>
              ),
            },
            {
              title: "Including High Availability and Read Replicas",
              content: (
                <>
                  <p>
                    Amazon RDS, Azure Database for MySQL, and Google Cloud SQL
                    use different names and architectures for availability.
                    Select the matching availability option for each plan so the
                    calculator can count the correct number of database copies.
                  </p>

                  <p>
                    A two-node HA setup normally includes one primary and one
                    standby. Amazon RDS Multi-AZ DB clusters use one writer and
                    two readable standby instances, so that option uses three
                    copies. Read replicas are then added separately.
                  </p>

                  <p>
                    Enter complete compute, storage, and IOPS rates for the
                    selected primary or HA deployment. Read-replica compute,
                    storage, and IOPS rates are entered separately. Extended
                    support is calculated from the billable vCPU count.
                  </p>
                </>
              ),
            },
            {
              title: "Adding Storage, IOPS, Backups, and Transfer",
              content: (
                <>
                  <p>
                    Enter the full provisioned storage size for the primary
                    database. The same storage amount is applied to standby and
                    read-replica copies because those copies are normally
                    provisioned separately.
                  </p>

                  <p>
                    Provisioned IOPS is priced per IOPS-month for every
                    database copy. Paid or request-based I/O is kept separate
                    and uses the total billable I/O entered for the deployment.
                    This supports AWS Provisioned IOPS, Azure paid or
                    pre-provisioned IOPS, and custom storage models.
                  </p>

                  <p>
                    Backup usage is reduced by the selected included allowance.
                    AWS and Azure commonly include backup storage up to the
                    primary provisioned storage amount under their stated
                    conditions. Google Cloud SQL backup storage is priced
                    separately. Enter the current rule for the exact plan.
                  </p>
                </>
              ),
            },
            {
              title: "Current Pricing Sources and Checked Date",
              content: (
                <>
                  <p>
                    Provider pricing structures and billing guidance were
                    checked on {pricingCheckedDate}. Prices remain blank because
                    actual rates depend on region, machine family, storage,
                    edition, availability, commitment, currency, and account
                    agreement.
                  </p>

                  <p>
                    Use the provider pricing page or account calculator to
                    enter the current effective rate for every selected
                    configuration. This prevents a regional example from being
                    presented as a universal price.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://aws.amazon.com/rds/mysql/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Amazon RDS for MySQL Pricing
                    </a>

                    <a
                      href="https://azure.microsoft.com/en-us/pricing/details/mysql/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Azure Database for MySQL Pricing
                    </a>

                    <a
                      href="https://cloud.google.com/sql/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Google Cloud SQL Pricing
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Compare managed MySQL providers using one workload.</li>
                  <li>Measure the added cost of high availability.</li>
                  <li>Estimate one or more read-replica deployments.</li>
                  <li>Compare provisioned IOPS and paid-I/O models.</li>
                  <li>Include backup storage above a free allowance.</li>
                  <li>Add internet or cross-region data transfer.</li>
                  <li>Measure extended-support cost for an older version.</li>
                  <li>Compare monthly cost and first-year migration impact.</li>
                  <li>Check each provider plan against a monthly budget.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Limits Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include taxes, support
                    plans, private connectivity, monitoring, public IP
                    addresses, DNS, encryption key requests, cross-region
                    replication, backup exports, accelerated logs, proxy
                    services, migration labour, or application changes unless
                    entered in a custom cost field.
                  </p>

                  <p>
                    Similar vCPU and memory values do not guarantee similar
                    performance. Processor generation, storage latency,
                    connection limits, failover behaviour, maintenance,
                    database version, and managed features differ. Test a
                    representative workload before choosing a provider.
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
                <BeeijaRelatedTools currentHref="/tools/cloud-mysql-cost-comparison-calculator" />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

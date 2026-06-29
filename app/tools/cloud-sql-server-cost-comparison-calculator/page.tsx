import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

const pricingCheckedDate = "June 25, 2026";

export const metadata: Metadata = {
  title: "Cloud SQL Server Cost Comparison Calculator",
  description:
    "Compare Amazon RDS for SQL Server, Azure SQL Managed Instance, and Google Cloud SQL for SQL Server using compute, licensing, HA, storage, IOPS, backup, transfer, and migration costs.",
  keywords: [
    "cloud SQL Server cost comparison calculator",
    "SQL Server cloud pricing calculator",
    "Amazon RDS SQL Server cost calculator",
    "Azure SQL Managed Instance cost calculator",
    "Google Cloud SQL Server cost calculator",
    "AWS vs Azure vs Google Cloud SQL Server",
    "managed SQL Server cost comparison",
    "SQL Server license cost calculator",
    "SQL Server high availability cost",
    "Azure Hybrid Benefit calculator",
    "SQL Server migration cost calculator",
    "managed database pricing comparison",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/cloud-sql-server-cost-comparison-calculator",
  },
  openGraph: {
    title: "Cloud SQL Server Cost Comparison Calculator",
    description:
      "Compare complete managed SQL Server costs across AWS, Azure, and Google Cloud using current regional prices entered for each plan.",
    url: "https://beeija.com/tools/cloud-sql-server-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud SQL Server Cost Comparison Calculator",
    description:
      "Estimate monthly and first-year managed SQL Server costs across Amazon RDS, Azure SQL Managed Instance, and Google Cloud SQL.",
  },
};

const faqs = [
  {
    question: "Why are the provider prices left blank?",
    answer:
      "Managed SQL Server prices vary by region, service tier, machine size, SQL Server edition, availability setup, licensing option, commitment, currency, and account agreement. Blank fields let you enter the current effective prices for the exact plan being considered.",
  },
  {
    question: "What is the difference between all-in and split hourly pricing?",
    answer:
      "Use all-in hourly pricing when one provider price already includes infrastructure, Windows, and SQL Server licensing. Use split hourly pricing when infrastructure and SQL Server licensing are shown as separate charges. The complete monthly option supports plans quoted as one monthly amount.",
  },
  {
    question: "How should high availability be entered?",
    answer:
      "Choose the correct availability configuration and enter the full price for that selected deployment. Do not multiply a bundled HA price again. Add only separately billed read, reporting, disaster-recovery, or geo-secondary instances under additional instances.",
  },
  {
    question: "Can Azure Hybrid Benefit or BYOM pricing be compared?",
    answer:
      "Yes. Select the matching licensing option and enter the effective infrastructure and licensing prices after Azure Hybrid Benefit, BYOM, Dev/Test, or another entitlement has been applied.",
  },
  {
    question: "How are storage and IOPS calculated?",
    answer:
      "The primary or HA deployment uses its complete storage and IOPS rates. Separately billed additional instances use their own storage and IOPS rates multiplied by the number of additional instances.",
  },
  {
    question: "Does Google Cloud SQL charge separately for SQL Server licensing?",
    answer:
      "Google Cloud SQL pricing includes separate SQL Server licensing charges based on the selected SQL Server edition and vCPU rules. Enter the current infrastructure and license rates shown for the exact configuration.",
  },
];

export default function CloudSQLServerCostComparisonCalculatorPage() {
  return (
    <ToolShell
      category="Cloud Cost Calculators"
      title="Cloud SQL Server Cost Comparison Calculator"
      description="Compare complete managed SQL Server costs across Amazon RDS for SQL Server, Azure SQL Managed Instance, Google Cloud SQL for SQL Server, or a custom plan using your current regional prices."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Managed SQL Server bills can include database infrastructure,
              Windows and SQL Server licensing, high availability, additional
              read or disaster-recovery instances, storage, IOPS, paid I/O,
              backups, data transfer, fixed services, and migration cost. This
              calculator keeps those cost layers visible instead of comparing
              only one hourly price.
            </p>
          }
          sections={[
            {
              title: "Comparing the Same SQL Server Workload",
              content: (
                <>
                  <p>
                    Enter one shared workload and up to three provider plans.
                    The shared workload includes monthly running hours, vCPUs,
                    memory, primary storage, backup usage, provisioned IOPS,
                    billable I/O, data transfer, additional secondary
                    instances, and a monthly budget.
                  </p>

                  <p>
                    Each plan can use its own provider, region, service tier,
                    SQL Server licensing option, availability configuration,
                    machine name, compute price, licence price, storage price,
                    IOPS price, backup allowance, transfer rate, discount,
                    fixed monthly cost, and migration cost.
                  </p>

                  <p>
                    Configured plans are ranked by monthly planning cost. The
                    result also shows first-year cost, cost per primary vCPU,
                    cost per primary storage GB, budget position, and the
                    possible saving against the lowest configured plan.
                  </p>
                </>
              ),
            },
            {
              title: "Handling SQL Server Infrastructure and Licensing",
              content: (
                <>
                  <p>
                    Amazon RDS for SQL Server commonly presents an all-in
                    database instance price that includes the Microsoft Windows
                    and SQL Server software charges for the selected
                    license-included edition. AWS also supports BYOM options for
                    eligible RDS for SQL Server configurations.
                  </p>

                  <p>
                    Azure SQL Managed Instance can use license-included pricing
                    or Azure Hybrid Benefit when eligible SQL Server licenses
                    with Software Assurance are assigned. Google Cloud SQL for
                    SQL Server separates infrastructure and SQL Server licence
                    charges in its pricing structure.
                  </p>

                  <p>
                    The calculator therefore supports an all-in hourly price, a
                    split infrastructure-and-license price, or one complete
                    monthly deployment price. Select the method that matches
                    the provider quote rather than forcing every provider into
                    one billing format.
                  </p>
                </>
              ),
            },
            {
              title: "High Availability and Additional SQL Server Instances",
              content: (
                <>
                  <p>
                    Select the provider availability configuration that matches
                    the planned deployment. Enter the full effective price for
                    that primary or HA deployment. This avoids double-counting
                    when the provider already includes a standby or built-in
                    secondary in the quoted price.
                  </p>

                  <p>
                    Use the shared additional-instance count for separately
                    billed read replicas, reporting instances, failover-group
                    secondaries, cross-region disaster-recovery instances, or
                    other SQL Server copies. Enter the hourly, storage, and IOPS
                    rates for one additional instance in each plan.
                  </p>

                  <p>
                    Similar availability labels do not guarantee the same
                    failover time, replication behaviour, read access, recovery
                    point, or service-level agreement. Check the provider
                    architecture before comparing price.
                  </p>
                </>
              ),
            },
            {
              title: "Storage, IOPS, Backups, and Data Transfer",
              content: (
                <>
                  <p>
                    Enter the complete primary or HA deployment storage rate.
                    Add separate additional-instance storage when read or
                    disaster-recovery copies are billed independently.
                    Provisioned IOPS and paid request-based I/O are calculated
                    separately so different storage models can be compared.
                  </p>

                  <p>
                    Backup usage can use no included allowance, an allowance
                    equal to primary provisioned storage, or a custom included
                    amount. Only backup usage above the selected allowance is
                    charged.
                  </p>

                  <p>
                    Data-transfer pricing depends on the destination, region,
                    network route, and free allowance. Enter the current
                    effective egress price only after confirming the exact
                    traffic path.
                  </p>
                </>
              ),
            },
            {
              title: "Current Pricing Sources and Checked Date",
              content: (
                <>
                  <p>
                    Product names, service tiers, licensing structures, and
                    billing guidance were checked on {pricingCheckedDate}.
                    Prices remain blank because actual rates depend on region,
                    machine family, SQL Server edition, service tier,
                    availability, licensing entitlement, commitment, currency,
                    and account agreement.
                  </p>

                  <p>
                    Use each provider pricing page or account calculator to
                    enter the current effective rates for the exact
                    configuration. This prevents one regional example from
                    being presented as a universal price.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://aws.amazon.com/rds/sqlserver/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Amazon RDS for SQL Server Pricing
                    </a>

                    <a
                      href="https://azure.microsoft.com/en-us/pricing/details/azure-sql-managed-instance/single/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Azure SQL Managed Instance Pricing
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
                  <li>Compare managed SQL Server providers using one workload.</li>
                  <li>Compare license-included and eligible bring-your-own-license pricing.</li>
                  <li>Measure the cost of a primary or high-availability deployment.</li>
                  <li>Add reporting, read, geo-secondary, or disaster-recovery instances.</li>
                  <li>Compare storage, provisioned IOPS, and paid-I/O models.</li>
                  <li>Include backup storage above a provider allowance.</li>
                  <li>Add internet or cross-region data transfer.</li>
                  <li>Measure first-year migration and ongoing operating cost.</li>
                  <li>Check each provider plan against a monthly budget.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Limits Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include taxes, premium
                    support, private connectivity, monitoring, public IP
                    addresses, DNS, encryption key requests, backup exports,
                    cross-region replication traffic, migration labour,
                    application remediation, consulting, reserved-capacity
                    upfront payments, or services not entered.
                  </p>

                  <p>
                    Similar vCPU and memory values do not guarantee similar SQL
                    Server performance. Processor generation, storage latency,
                    tempdb behaviour, IOPS limits, licensing restrictions,
                    feature support, maintenance, failover architecture, and
                    database version differ. Test a representative workload
                    before choosing a provider.
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
                <BeeijaRelatedTools currentHref="/tools/cloud-sql-server-cost-comparison-calculator" />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

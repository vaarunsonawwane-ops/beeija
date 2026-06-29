import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Cloud Block Storage Cost Comparison Calculator",
  description:
    "Compare AWS EBS gp3, Azure Premium SSD v2, Google Hyperdisk Balanced, and custom block storage costs using capacity, IOPS, throughput, snapshots, active hours, migration, and budget.",
  keywords: [
    "cloud block storage cost comparison calculator",
    "AWS EBS vs Azure Managed Disks vs Google Hyperdisk cost",
    "EBS gp3 cost calculator",
    "Azure Premium SSD v2 cost calculator",
    "Google Hyperdisk Balanced cost calculator",
    "cloud disk cost calculator",
    "block storage IOPS cost calculator",
    "block storage throughput cost calculator",
    "cloud snapshot cost calculator",
    "managed disk cost comparison",
    "persistent disk cost calculator",
    "cloud storage performance cost calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/cloud-block-storage-cost-comparison-calculator",
  },
  openGraph: {
    title: "Cloud Block Storage Cost Comparison Calculator",
    description:
      "Compare provisioned capacity, IOPS, throughput, snapshots, migration, monthly cost, and first-year block storage cost.",
    url: "https://beeija.com/tools/cloud-block-storage-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Block Storage Cost Comparison Calculator",
    description:
      "Compare complete cloud block storage costs across AWS, Azure, Google Cloud, and custom plans.",
  },
};

const faqs = [
  {
    question:
      "Why does the calculator use representative US-region prices?",
    answer:
      "Block storage prices vary by region, redundancy, storage class, currency, and account agreement. The built-in values provide a practical starting point, while every price field remains editable for your exact region or invoice.",
  },
  {
    question:
      "How are provisioned capacity and active hours calculated?",
    answer:
      "The calculator multiplies volume count by capacity per volume and capacity overhead. It then prorates the provisioned capacity using the entered billable disk hours against a 730-hour planning month.",
  },
  {
    question:
      "How does the calculator handle included IOPS and throughput?",
    answer:
      "Each provider plan has an included IOPS and throughput allowance per volume. Only the provisioned amount above those baselines is charged using the entered additional-performance rates.",
  },
  {
    question:
      "Why are snapshots entered separately from disk capacity?",
    answer:
      "Snapshots are billed from the snapshot data retained, which can differ from the provisioned disk size. Enter the average billable snapshot storage reported by the provider or estimated from your retention plan.",
  },
  {
    question:
      "Does the cheapest result guarantee the best storage option?",
    answer:
      "No. Confirm latency, durability, availability-zone support, maximum IOPS, throughput limits, attachment rules, operating-system support, recovery requirements, and migration effort before selecting a service.",
  },
  {
    question:
      "What is excluded from the estimate?",
    answer:
      "The default result excludes taxes, currency conversion, negotiated discounts, cross-region snapshot transfer, restore fees, burst transactions, replication, encryption add-ons, and services not entered in the calculator.",
  },
];

export default function CloudBlockStorageCostComparisonCalculatorPage() {
  return (
    <ToolShell
      category="Cloud Cost Calculators"
      title="Cloud Block Storage Cost Comparison Calculator"
      description="Compare complete block storage costs across AWS EBS gp3, Azure Premium SSD v2, Google Hyperdisk Balanced, or a custom provider using your workload and current regional prices."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              A block storage price per GiB is only one part of the bill.
              Provisioned IOPS, throughput, snapshots, always-on disk time,
              migration work, and fixed operational costs can materially
              change the final result. This calculator combines those cost
              layers in one comparison.
            </p>
          }
          sections={[
            {
              title:
                "Comparing Equivalent Block Storage Workloads",
              content: (
                <>
                  <p>
                    Enter one shared workload for every provider: volume
                    count, capacity per volume, IOPS, throughput, billable
                    disk hours, capacity overhead, and retained snapshot
                    storage.
                  </p>

                  <p>
                    Each provider plan can then use its own capacity rate,
                    included performance baseline, extra IOPS price,
                    additional throughput price, snapshot rate, recurring
                    cost, and migration cost.
                  </p>

                  <p>
                    The result ranks configured plans by monthly planning
                    cost and also shows monthly operating cost, cost per
                    volume, cost per provisioned GiB, budget position, and
                    first-year cost.
                  </p>
                </>
              ),
            },
            {
              title:
                "Planning Provisioned Capacity and Disk Runtime",
              content: (
                <>
                  <p>
                    Cloud block storage is normally billed from provisioned
                    capacity rather than the amount of data currently used.
                    Capacity can continue to generate charges when a virtual
                    machine is stopped but its disk remains provisioned.
                  </p>

                  <p>
                    Use capacity overhead for free-space policy, growth,
                    temporary copies, deployment overlap, or operational
                    headroom. Use billable disk hours when volumes exist for
                    less than a complete planning month.
                  </p>

                  <p>
                    A 730-hour month is used only as a consistent comparison
                    base. Provider billing systems can prorate usage by
                    seconds or other billing granularity.
                  </p>
                </>
              ),
            },
            {
              title:
                "Including IOPS and Throughput Charges",
              content: (
                <>
                  <p>
                    AWS EBS gp3 includes a baseline of 3,000 IOPS and 125
                    MB/s per volume before additional provisioned
                    performance is charged.
                  </p>

                  <p>
                    Azure Premium SSD v2 also provides a 3,000 IOPS and 125
                    MB/s baseline, while Google Hyperdisk Balanced uses a
                    3,000 IOPS and 140 MB/s baseline in its current pricing
                    model.
                  </p>

                  <p>
                    The calculator applies each baseline per volume and
                    charges only the entered performance above it. Change
                    every rate and baseline when your region, storage class,
                    or provider configuration differs.
                  </p>
                </>
              ),
            },
            {
              title:
                "Estimating Snapshot and Recovery Storage",
              content: (
                <>
                  <p>
                    Snapshot charges are based on retained snapshot data,
                    which can be lower than provisioned disk capacity when
                    snapshots are incremental or compressed.
                  </p>

                  <p>
                    Enter an average monthly snapshot amount rather than
                    assuming every snapshot is a full copy. Restore,
                    retrieval, cross-region movement, instant snapshot,
                    archive minimum-retention, and replication charges are
                    not automatically added.
                  </p>

                  <p>
                    Use the provider documentation below to collect the
                    exact current regional rate before making a purchasing
                    decision.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://aws.amazon.com/ebs/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Amazon EBS Pricing
                    </a>

                    <a
                      href="https://azure.microsoft.com/en-us/pricing/details/managed-disks/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Azure Managed Disks Pricing
                    </a>

                    <a
                      href="https://cloud.google.com/compute/disks-image-pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Google Disk Pricing
                    </a>
                  </div>
                </>
              ),
            },
            {
              title:
                "Using the Result for a Real Cloud Decision",
              content: (
                <>
                  <p>
                    Begin with the provider region and storage class that
                    matches your planned architecture. Replace every default
                    price with the current rate from the official provider
                    calculator, pricing page, quote, or invoice.
                  </p>

                  <p>
                    Compare both monthly operating cost and first-year cost.
                    Migration, testing, data movement, application downtime,
                    and operational learning can make a nominally cheaper
                    service more expensive during the first year.
                  </p>

                  <p>
                    Review performance limits as well as price. A plan that
                    cannot deliver the required latency, IOPS, throughput,
                    durability, attachment count, or recovery target is not
                    an equivalent option.
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
                      <h3 className="font-semibold text-gray-950">
                        {faq.question}
                      </h3>
                      <p className="mt-2">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              title: "Explore Related Cloud Cost Tools",
              content: (
                <BeeijaRelatedTools
                  currentHref="/tools/cloud-block-storage-cost-comparison-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

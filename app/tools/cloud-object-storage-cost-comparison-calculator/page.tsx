import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Cloud Object Storage Cost Comparison Calculator",
  description:
    "Compare Amazon S3, Azure Blob Storage, Google Cloud Storage, or custom object storage plans using storage tiers, requests, retrievals, egress, lifecycle transitions, replication, early deletion, and migration cost.",
  keywords: [
    "cloud object storage cost calculator",
    "Amazon S3 cost calculator",
    "Azure Blob Storage cost calculator",
    "Google Cloud Storage cost calculator",
    "S3 vs Azure Blob vs Google Cloud Storage",
    "object storage pricing comparison",
    "cloud storage cost comparison",
    "archive storage cost calculator",
    "cloud storage retrieval cost",
    "cloud storage egress calculator",
    "object storage request cost",
    "cloud storage lifecycle cost",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/cloud-object-storage-cost-comparison-calculator",
  },
  openGraph: {
    title: "Cloud Object Storage Cost Comparison Calculator",
    description:
      "Compare storage tiers, requests, retrievals, egress, lifecycle transitions, replication, early deletion, and first-year object storage cost.",
    url: "https://beeija.com/tools/cloud-object-storage-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Object Storage Cost Comparison Calculator",
    description:
      "Estimate complete monthly and first-year object storage cost across cloud plans.",
  },
};

const faqs = [
  {
    question: "Why are provider prices left blank?",
    answer:
      "Object storage prices vary by region, storage class, redundancy option, request type, retrieval speed, data destination, currency, and account agreement. Blank fields let you enter the current effective rates for the exact plan being considered.",
  },
  {
    question: "What is a GB-month?",
    answer:
      "A GB-month represents one gigabyte stored for one month. Providers can calculate storage using average daily usage, hourly usage, or another billing method, so use the expected monthly average for planning.",
  },
  {
    question: "Why are storage and retrieval priced separately?",
    answer:
      "Cool, infrequent-access, cold, and archive tiers can have lower storage rates but may charge for retrieving data. A cheaper storage tier can therefore cost more when data is read frequently.",
  },
  {
    question: "What are Class A and Class B operations?",
    answer:
      "Providers group API operations differently. Write, list, create, read, and metadata operations can have separate prices. Map your provider's request categories into the write, read, and list fields used by this calculator.",
  },
  {
    question: "How does replication affect the estimate?",
    answer:
      "The calculator adds storage for the entered replicated share and applies a separate replication or inter-region transfer rate to the replicated data written during the month.",
  },
  {
    question: "Does this calculator include minimum storage-duration penalties?",
    answer:
      "It includes a custom early-deletion or minimum-duration charge. Enter the affected data volume and the effective penalty per GB based on the selected storage class.",
  },
];

export default function CloudObjectStorageCostComparisonCalculatorPage() {
  return (
    <ToolShell
      category="Cloud Cost Calculators"
      title="Cloud Object Storage Cost Comparison Calculator"
      description="Compare complete object storage costs across Amazon S3, Azure Blob Storage, Google Cloud Storage, or custom providers using your current regional rates."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Object storage bills can include storage capacity, API requests,
              data retrieval, internet transfer, lifecycle transitions,
              replication, object-management features, and minimum-duration
              charges. This calculator combines those cost layers instead of
              comparing only the price per stored gigabyte.
            </p>
          }
          sections={[
            {
              title: "Comparing the Same Storage Workload",
              content: (
                <>
                  <p>
                    Enter one shared workload and up to three provider plans.
                    The workload includes average stored data, monthly growth,
                    storage-tier shares, request volume, retrieved data,
                    internet transfer, lifecycle transitions, replication, and
                    early-deletion exposure.
                  </p>

                  <p>
                    Each plan can use its own Standard, Cool, and Archive
                    storage prices, operation prices, retrieval rates, egress
                    rate, replication rate, management fee, fixed monthly
                    charge, and migration cost.
                  </p>

                  <p>
                    The result ranks configured plans by monthly planning cost
                    and reports cost per stored terabyte, cost per million
                    requests, first-year cost, and the difference from the
                    lowest configured plan.
                  </p>
                </>
              ),
            },
            {
              title: "Modelling Standard, Cool, and Archive Tiers",
              content: (
                <>
                  <p>
                    Enter the percentage of data planned for Standard, Cool,
                    and Archive storage. If the three percentages do not total
                    100%, the calculator normalizes them while preserving the
                    entered ratio.
                  </p>

                  <p>
                    Standard represents frequently accessed data. Cool can
                    represent infrequent-access, Nearline, Cool, or Cold
                    classes. Archive represents long-term archive classes that
                    can have retrieval delays or minimum storage durations.
                  </p>

                  <p>
                    Use the exact provider class that matches your availability,
                    redundancy, retrieval-time, and retention requirements.
                  </p>
                </>
              ),
            },
            {
              title: "Including Requests, Retrievals, and Lifecycle Changes",
              content: (
                <>
                  <p>
                    Cloud object storage commonly charges separately for
                    storage, requests, and retrieval. Amazon S3 prices request
                    types and retrievals by storage class. Azure Blob Storage
                    separates storage tiers, operations, and data retrieval.
                    Google Cloud Storage prices data storage, operations,
                    retrieval for colder classes, and network usage.
                  </p>

                  <p>
                    Enter monthly write, read, and list requests using the
                    billing unit shown by the selected provider. This calculator
                    uses prices per 10,000 requests so provider rates can be
                    entered consistently.
                  </p>

                  <p>
                    Lifecycle transitions are kept separate because moving
                    objects between storage classes can create transition
                    requests and minimum-duration charges.
                  </p>
                </>
              ),
            },
            {
              title: "Adding Egress, Replication, and Early-Deletion Cost",
              content: (
                <>
                  <p>
                    Enter internet or cross-region data transfer after applying
                    any eligible free allowance or tiered rate. The calculator
                    treats this as an effective price per GB.
                  </p>

                  <p>
                    Replication adds another stored copy for the selected share
                    of data. It can also create transfer and write charges when
                    new or changed data is copied to another region or account.
                  </p>

                  <p>
                    Some cool and archive classes charge for a minimum storage
                    duration. Enter the data deleted or moved before that period
                    and the effective remaining-duration charge per GB.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://aws.amazon.com/s3/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Amazon S3 Pricing
                    </a>

                    <a
                      href="https://azure.microsoft.com/en-us/pricing/details/storage/blobs/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Azure Blob Pricing
                    </a>

                    <a
                      href="https://cloud.google.com/storage/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Google Cloud Storage Pricing
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Compare object storage providers using one workload.</li>
                  <li>Plan Standard, Cool, and Archive tier allocation.</li>
                  <li>Estimate write, read, list, and transition requests.</li>
                  <li>Measure retrieval cost from colder storage classes.</li>
                  <li>Include internet egress and inter-region replication.</li>
                  <li>Estimate minimum-duration and early-deletion charges.</li>
                  <li>Compare monthly cost and first-year migration impact.</li>
                  <li>Calculate cost per stored TB and per million requests.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Limits Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include taxes, support
                    plans, CDN charges, private connectivity, accelerated
                    transfer, restore-speed premiums, encryption key requests,
                    inventory scans, analytics, legal retention, or application
                    migration labour unless entered in a fixed-cost field.
                  </p>

                  <p>
                    Provider bills can use tiered storage and network prices,
                    minimum object sizes, minimum storage durations, binary or
                    decimal gigabytes, free allowances, negotiated discounts,
                    and region-specific taxes. Use effective prices from the
                    current provider calculator or billing export.
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
                <BeeijaRelatedTools currentHref="/tools/cloud-object-storage-cost-comparison-calculator" />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

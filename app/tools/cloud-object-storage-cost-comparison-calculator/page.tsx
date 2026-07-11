import type { Metadata } from "next";
import BeeijaToolPageHeader from "@/app/components/BeeijaToolPageHeader";
import InfoCard from "@/app/components/InfoCard";
import BeeijaOfficialPricingSources from "@/app/components/BeeijaOfficialPricingSources";
import {
  BeeijaQuestionList,
  BeeijaYellowLineList,
} from "@/app/components/BeeijaContentBlocks";
import { BeeijaRelatedToolsSection } from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

const title = "Cloud Object Storage Cost Comparison Calculator";
const description =
  "Compare Amazon S3, Azure Blob Storage, and Google Cloud Storage costs using editable storage tier, request, retrieval, egress, replication, early deletion, and migration inputs.";
const href = "/tools/cloud-object-storage-cost-comparison-calculator";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: href,
  },
  openGraph: {
    title: `${title} | Beeija`,
    description,
    url: href,
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${title} | Beeija`,
    description,
  },
  keywords: [
    "cloud object storage cost calculator",
    "Amazon S3 cost calculator",
    "Azure Blob Storage cost calculator",
    "Google Cloud Storage cost calculator",
    "object storage pricing comparison",
    "cloud storage egress calculator",
    "cloud storage retrieval cost calculator",
  ],
};

export default function Page() {
  return (
    <main className="beeija-page">
      <BeeijaToolPageHeader
        title={title}
        category="Cloud Cost Calculators"
        pricingCheckedDate="July 10, 2026"
        description={
          <>
            Estimate monthly object storage cost across Amazon S3, Azure Blob
            Storage, and Google Cloud Storage using the same storage workload.
            Enter current provider rates, then compare storage tiers, requests,
            retrieval, outbound transfer, replication, early deletion,
            management, and migration cost in one planning view.
          </>
        }
        pricingNote={
          <>
            Prices are not hardcoded because object storage rates vary by
            provider, region, redundancy option, storage class, request type,
            retrieval method, account agreement, currency, and discounts.
          </>
        }
      />

      <ToolClient />

      <section className="beeija-feature-grid">
        <InfoCard title="Compare real storage workload" className="rounded-lg">
          <>
            Storage cost can change with tier mix, requests, retrieval,
            lifecycle movement, replication, early deletion, object management,
            and outbound transfer.
          </>
        </InfoCard>
        <InfoCard title="Keep provider prices editable" className="rounded-lg">
          <>
            AWS, Azure, and Google Cloud price storage differently. Enter
            current official rates for the region, class, request pattern, and
            account you are checking.
          </>
        </InfoCard>
        <InfoCard title="Read the estimate safely" className="rounded-lg">
          <>
            Use the result as a planning estimate. Final bills may change
            because of taxes, support plans, allowances, discounts, restore
            speed, and provider billing rules.
          </>
        </InfoCard>
      </section>

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">
          When This Object Storage Calculator Helps
        </h2>
        <p className="beeija-copy">
          This calculator is useful when storage data is growing, colder tiers
          are being considered, or a team is moving backups, logs, media,
          analytics files, application uploads, or archive data between cloud
          providers. It helps compare cost drivers that are easy to miss when
          you only look at the headline storage price.
        </p>
        <BeeijaYellowLineList
          items={[
            "Compare one object storage workload across Amazon S3, Azure Blob Storage, and Google Cloud Storage.",
            "Plan hot, cool, and archive tier allocation before setting lifecycle rules.",
            "Add request, retrieval, egress, replication, management, and early-deletion assumptions.",
            "Estimate first-year impact when migration or one-time movement cost matters.",
          ]}
        />
      </section>

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">What The Estimate Includes</h2>
        <p className="beeija-copy">
          The result can include monthly storage by class, write/read/list
          operations, lifecycle transition requests, retrieval or restore
          charges, internet or cross-region transfer, replication transfer,
          object-management charges, early-deletion penalties, fixed monthly
          services, and one-time migration cost spread across a planning period.
          It is a planning estimate, not a provider quote or final bill.
        </p>
      </section>

      <BeeijaOfficialPricingSources
        checkedDate="July 10, 2026"
        description="The pricing model and billing notes for this calculator were checked against official object storage pricing pages."
        sources={[
          {
            label: "Amazon S3 Pricing",
            href: "https://aws.amazon.com/s3/pricing/",
          },
          {
            label: "Azure Blob Storage Pricing",
            href: "https://azure.microsoft.com/en-us/pricing/details/storage/blobs/",
          },
          {
            label: "Google Cloud Storage Pricing",
            href: "https://cloud.google.com/storage/pricing",
          },
        ]}
      />

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">Common Questions</h2>
        <BeeijaQuestionList
          questions={[
            {
              question: "Why are object storage prices editable?",
              answer:
                "Object storage pricing changes by provider, region, redundancy option, storage class, request type, retrieval method, transfer destination, currency, and account agreement. Editable fields let you enter the current effective rates for the exact bucket setup you are checking.",
            },
            {
              question: "Why does a cheaper archive tier sometimes cost more?",
              answer:
                "Archive and colder storage classes can reduce monthly storage cost, but retrieval charges, restore fees, lifecycle transition requests, minimum storage durations, and early-deletion charges can change the total cost when data is accessed or moved too often.",
            },
            {
              question: "Does this replace the official provider calculator?",
              answer:
                "No. Use this as a planning comparison before choosing a provider or storage design. Final bills can change because of tiered pricing, taxes, support plans, free allowances, negotiated discounts, minimum object sizes, restore speed, and provider billing updates.",
            },
          ]}
        />
      </section>

      <BeeijaRelatedToolsSection currentHref="/tools/cloud-object-storage-cost-comparison-calculator" />
    </main>
  );
}

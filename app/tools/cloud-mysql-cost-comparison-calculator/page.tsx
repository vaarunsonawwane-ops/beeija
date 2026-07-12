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

const title = "Cloud MySQL Cost Comparison Calculator";
const description =
  "Compare Amazon RDS for MySQL, Azure Database for MySQL, Google Cloud SQL, and custom managed MySQL costs using editable compute, availability, replicas, storage, IOPS, backups, transfer, support, discounts, and migration inputs.";
const href = "/tools/cloud-mysql-cost-comparison-calculator";

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
    "cloud MySQL cost calculator",
    "Amazon RDS MySQL cost calculator",
    "Azure MySQL cost calculator",
    "Cloud SQL MySQL cost calculator",
    "managed MySQL cost comparison",
    "MySQL high availability cost",
    "MySQL read replica cost",
    "MySQL backup cost calculator",
    "cloud database migration cost",
  ],
};

export default function Page() {
  return (
    <main className="beeija-page">
      <BeeijaToolPageHeader
        title={title}
        category="Cloud Cost Calculators"
        pricingCheckedDate="July 12, 2026"
        description={
          <>
            Compare managed MySQL costs across Amazon RDS, Azure Database for
            MySQL, Google Cloud SQL, or a custom plan using the same database
            workload. Enter current regional rates, then compare compute,
            availability, read replicas, storage, IOPS, backups, outbound
            transfer, support, discounts, and migration cost.
          </>
        }
        pricingNote={
          <>
            Prices are not hardcoded because managed MySQL rates vary by
            provider, region, machine family, service tier, availability
            setup, storage, commitment, currency, and account agreement.
          </>
        }
      />

      <ToolClient />

      <section className="beeija-feature-grid">
        <InfoCard title="Compare the full MySQL workload" className="rounded-lg">
          <>
            Model compute, availability, replicas, storage, IOPS, I/O, backups,
            transfer, and migration using one workload.
          </>
        </InfoCard>

        <InfoCard title="Keep MySQL prices editable" className="rounded-lg">
          <>
            Enter current regional rates for each provider instead of relying
            on an old preset or a universal example.
          </>
        </InfoCard>

        <InfoCard title="Plan before migration or scaling" className="rounded-lg">
          <>
            Use the estimate before adding HA, replicas, storage, support, or
            migration work. Final bills may still vary.
          </>
        </InfoCard>
      </section>

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">
          When This MySQL Cost Calculator Helps
        </h2>
        <p className="beeija-copy">
          This calculator is useful when you are comparing managed MySQL
          providers, planning high availability, adding read replicas, sizing
          production storage, or estimating the cost of moving an existing
          MySQL workload into a cloud-managed service.
        </p>
        <BeeijaYellowLineList
          items={[
            "Compare the same MySQL workload across AWS, Azure, Google Cloud, or a custom plan.",
            "Measure the effect of high availability and read replicas.",
            "Include storage, IOPS, paid I/O, backups, transfer, support, and discounts.",
            "Estimate first-year impact when migration cost matters.",
          ]}
        />
      </section>

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">What The Estimate Includes</h2>
        <p className="beeija-copy">
          The result can include database compute, standby and replica copies,
          primary and replica storage, provisioned IOPS, paid I/O, backup
          storage, outbound transfer, extended support, fixed monthly
          services, discounts, and one-time migration cost spread across a
          planning period. It is a planning estimate, not a provider quote or
          final bill.
        </p>
      </section>

      <BeeijaOfficialPricingSources
        checkedDate="July 12, 2026"
        description="The pricing model, availability options, and billing notes for this calculator were checked against official managed MySQL pricing pages."
        sources={[
          {
            label: "Amazon RDS for MySQL Pricing",
            href: "https://aws.amazon.com/rds/mysql/pricing/",
          },
          {
            label: "Azure Database for MySQL Pricing",
            href: "https://azure.microsoft.com/en-us/pricing/details/mysql/",
          },
          {
            label: "Google Cloud SQL Pricing",
            href: "https://cloud.google.com/sql/pricing",
          },
        ]}
      />

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">Common Questions</h2>
        <BeeijaQuestionList
          questions={[
            {
              question: "Why are provider prices blank?",
              answer:
                "Managed MySQL prices change by provider, region, machine type, tier, availability setup, storage, commitment, currency, and account agreement. Enter the current rates for the exact setup you are checking.",
            },
            {
              question: "How is high availability counted?",
              answer:
                "The selected availability option determines how many primary and standby database copies are included. Read replicas are added separately.",
            },
            {
              question: "Why are primary and replica prices separate?",
              answer:
                "Replica compute, storage, and IOPS can use different rates or configurations from the primary deployment.",
            },
            {
              question: "How is backup storage charged?",
              answer:
                "The selected included allowance is removed first. Only backup storage above that allowance is charged at the entered backup rate.",
            },
          ]}
        />
      </section>

      <BeeijaRelatedToolsSection currentHref={href} />
    </main>
  );
}

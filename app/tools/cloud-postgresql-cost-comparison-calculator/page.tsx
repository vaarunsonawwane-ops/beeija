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

const title = "Cloud PostgreSQL Cost Comparison Calculator";
const description =
  "Compare Amazon RDS for PostgreSQL, Azure Database for PostgreSQL, and Google Cloud SQL costs using editable compute, high availability, replicas, storage, IOPS, backups, transfer, support, and migration inputs.";
const href = "/tools/cloud-postgresql-cost-comparison-calculator";

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
    "cloud PostgreSQL cost calculator",
    "RDS PostgreSQL cost calculator",
    "Azure PostgreSQL cost calculator",
    "Cloud SQL PostgreSQL cost calculator",
    "managed PostgreSQL cost comparison",
    "PostgreSQL high availability cost",
    "PostgreSQL read replica cost",
    "PostgreSQL backup cost calculator",
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
            Compare managed PostgreSQL costs across Amazon RDS, Azure Database
            for PostgreSQL, and Google Cloud SQL using the same database
            workload. Enter current regional rates, then compare database
            nodes, high availability, read replicas, storage, IOPS, backups,
            outbound transfer, support, and migration cost.
          </>
        }
        pricingNote={
          <>
            Prices are not hardcoded because managed PostgreSQL rates vary by
            provider, region, machine family, availability mode, storage type,
            commitment, currency, and account agreement.
          </>
        }
      />

      <ToolClient />

      <section className="beeija-feature-grid">
        <InfoCard title="Model database nodes and availability" className="rounded-lg">
          <>
            Compare primary servers, standby capacity, read replicas, node
            size, storage, IOPS, backups, and transfer using one workload.
          </>
        </InfoCard>

        <InfoCard title="Keep PostgreSQL prices editable" className="rounded-lg">
          <>
            Enter current regional rates for compute, storage, backup, I/O,
            network, support, and discounts instead of relying on an old
            preset.
          </>
        </InfoCard>

        <InfoCard title="Plan before migration or scaling" className="rounded-lg">
          <>
            Use the result before adding HA, replicas, storage, or migration
            work. Final bills can still change under provider-specific rules.
          </>
        </InfoCard>
      </section>

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">
          When This PostgreSQL Cost Calculator Helps
        </h2>
        <p className="beeija-copy">
          This calculator is useful when you are comparing managed PostgreSQL
          providers, planning high availability, adding read replicas, sizing a
          production database, or estimating the cost of moving an existing
          PostgreSQL workload into a cloud-managed service.
        </p>
        <BeeijaYellowLineList
          items={[
            "Compare the same PostgreSQL workload across AWS, Azure, and Google Cloud.",
            "Measure the effect of high availability, standby nodes, and read replicas.",
            "Include storage, IOPS, I/O requests, backups, outbound transfer, and support costs.",
            "Estimate first-year impact when storage growth or migration cost matters.",
          ]}
        />
      </section>

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">What The Estimate Includes</h2>
        <p className="beeija-copy">
          The result can include database compute, standby and replica nodes,
          provisioned storage, IOPS, billable I/O requests, backup storage,
          outbound transfer, public network cost, extended support, fixed
          monthly services, and one-time migration cost spread across a
          planning period. It is a planning estimate, not a provider quote or
          final bill.
        </p>
      </section>

      <BeeijaOfficialPricingSources
        checkedDate="July 12, 2026"
        description="The pricing model, deployment options, and billing notes for this calculator were checked against official managed PostgreSQL pricing pages."
        sources={[
          {
            label: "Amazon RDS for PostgreSQL Pricing",
            href: "https://aws.amazon.com/rds/postgresql/pricing/",
          },
          {
            label: "Azure Database for PostgreSQL Pricing",
            href: "https://azure.microsoft.com/en-us/pricing/details/postgresql/flexible-server/",
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
                "Managed PostgreSQL prices change by provider, region, machine type, availability mode, storage, commitment, currency, and account agreement. Enter the current rates for the exact setup you are checking.",
            },
            {
              question: "How does high availability affect the estimate?",
              answer:
                "The selected availability mode changes the number of primary and standby nodes. Read replicas are counted separately because they serve a different scaling purpose.",
            },
            {
              question: "Why are database storage and backup storage separate?",
              answer:
                "Provisioned database storage remains attached to database nodes, while retained backup storage can follow separate billing rules and included allowances.",
            },
            {
              question: "What does first-year cost include?",
              answer:
                "First-year cost includes recurring monthly costs, projected storage growth, and the entered one-time migration cost.",
            },
          ]}
        />
      </section>

      <BeeijaRelatedToolsSection currentHref={href} />
    </main>
  );
}

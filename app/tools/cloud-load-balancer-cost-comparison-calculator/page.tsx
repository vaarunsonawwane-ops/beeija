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

const title = "Cloud Load Balancer Cost Comparison Calculator";
const description =
  "Compare AWS, Azure, Google Cloud, and Cloudflare load balancer costs using editable hourly, capacity, data processing, transfer, WAF, logging, and setup inputs.";
const href = "/tools/cloud-load-balancer-cost-comparison-calculator";

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
    "cloud load balancer cost calculator",
    "AWS load balancer cost calculator",
    "Azure application gateway cost calculator",
    "Google Cloud load balancer cost calculator",
    "Cloudflare load balancing cost calculator",
    "load balancer pricing comparison",
    "cloud cost calculator",
  ],
};

export default function Page() {
  return (
    <main className="beeija-page">
      <BeeijaToolPageHeader
        title={title}
        category="Cloud Cost Calculators"
        pricingCheckedDate="July 7, 2026"
        description={
          <>
          Estimate monthly load balancer cost across AWS, Azure, Google Cloud,
          and Cloudflare using the same workload assumptions. Enter the current
          rates from the provider pricing pages, then compare base runtime,
          capacity units, processed traffic, forwarding rules, outbound
          transfer, WAF, logging, and optional setup cost in one clean view.
          </>
        }
        pricingNote={
          <>
            Prices are not hardcoded because load balancer rates vary by
            provider, region, product type, account agreement, currency,
            discounts, and traffic shape.
          </>
        }
      />

      <ToolClient />

      <section className="beeija-feature-grid">
        <InfoCard title="Model traffic, rules, and capacity together" className="rounded-lg">
          <>
            Load balancer cost can change with runtime, capacity units,
            rules, processed traffic, public IPs, and outbound transfer.
          </>
        </InfoCard>
        <InfoCard title="Update load balancer rates by provider" className="rounded-lg">
          <>
            AWS, Azure, Google Cloud, and Cloudflare price load balancing
            differently. Enter current official rates for the region, traffic
            pattern, and product tier you are checking.
          </>
        </InfoCard>
        <InfoCard title="Use the estimate before deployment" className="rounded-lg">
          <>
            Use the result as a planning estimate. Final bills may change
            because of tax, support plans, discounts, credits, and provider
            billing rules.
          </>
        </InfoCard>
      </section>

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">
          When This Load Balancer Calculator Helps
        </h2>
        <p className="beeija-copy">
          This calculator is useful when you are choosing between a managed
          application load balancer, gateway, traffic steering service, or CDN
          load balancing setup before moving a project to production. It helps
          compare costs that are easy to miss when you only look at a base
          hourly price.
        </p>
        <BeeijaYellowLineList
          items={[
            "Estimate monthly cost for one production load balancer.",
            "Compare AWS ALB-style pricing with Azure, Google Cloud, or Cloudflare planning inputs.",
            "Add WAF, logging, monitoring, data processing, and transfer cost before deciding.",
            "Stress test traffic growth without breaking the page layout.",
          ]}
        />
      </section>

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">What The Estimate Includes</h2>
        <p className="beeija-copy">
          The result can include base hourly runtime, average capacity or LCU
          usage, processed GB, forwarding rule charges, outbound transfer, WAF,
          logging, monitoring, and optional one-time setup cost spread across a
          planning period. It does not replace the official provider calculator
          or your final bill.
        </p>
      </section>

      <BeeijaOfficialPricingSources
        checkedDate="July 7, 2026"
        description="The pricing model and billing notes for this calculator were checked against official provider pages."
        sources={[
          {
            label: "Amazon Elastic Load Balancing Pricing",
            href: "https://aws.amazon.com/elasticloadbalancing/pricing/",
          },
          {
            label: "Azure Application Gateway Pricing",
            href: "https://azure.microsoft.com/en-us/pricing/details/application-gateway/",
          },
          {
            label: "Google Cloud Load Balancing Pricing",
            href: "https://cloud.google.com/load-balancing/pricing",
          },
          {
            label: "Cloudflare Load Balancing Pricing",
            href: "https://www.cloudflare.com/products/load-balancing/",
          },
        ]}
      />

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">Common Questions</h2>
        <BeeijaQuestionList
          questions={[
            {
              question: "Why are the provider prices blank?",
              answer:
                "Load balancer pricing changes by provider, service type, region, usage unit, account agreement, currency, and discount. Blank price fields make the estimate safer because you can enter the current rate for the exact setup you are checking.",
            },
            {
              question: "Is this the exact monthly bill?",
              answer:
                "No. It is a planning estimate. Final bills can change because of tax, support plans, credits, free tiers, minimum charges, retries, extra services, traffic routing, logs, security rules, discounts, and provider billing updates.",
            },
            {
              question: "Why does outbound transfer matter?",
              answer:
                "Many users check only the load balancer hourly price, but internet egress, processed traffic, logs, WAF, and related network services can become a meaningful part of the monthly cost.",
            },
          ]}
        />
      </section>

      <BeeijaRelatedToolsSection currentHref="/tools/cloud-load-balancer-cost-comparison-calculator" />
    </main>
  );
}

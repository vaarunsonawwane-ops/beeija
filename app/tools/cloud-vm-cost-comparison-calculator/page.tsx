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

const title = "Cloud VM Cost Comparison Calculator";
const description =
  "Compare AWS EC2, Azure Virtual Machines, Google Compute Engine, and custom VM costs with editable compute, storage, bandwidth, public IP, load balancer, Spot, commitment, and fixed-cost inputs.";
const href = "/tools/cloud-vm-cost-comparison-calculator";

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
    "cloud VM cost comparison calculator",
    "AWS EC2 cost calculator",
    "Azure virtual machines cost calculator",
    "Google Compute Engine cost calculator",
    "cloud server cost comparison",
    "VM hourly cost calculator",
    "cloud compute cost calculator",
    "Spot VM cost calculator",
    "cloud commitment savings calculator",
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
            Estimate monthly virtual-machine cost across AWS EC2, Azure Virtual
            Machines, Google Compute Engine, or a custom cloud plan using the
            same workload assumptions. Enter current regional rates, then
            compare compute runtime, commitments, Spot usage, OS licences,
            storage, snapshots, outbound transfer, public IPv4, load balancers,
            and fixed monthly services in one clean view.
          </>
        }
        pricingNote={
          <>
            Prices are not hardcoded because VM costs vary by provider, region,
            instance family, operating system, purchase option, currency,
            committed-use terms, and account agreement.
          </>
        }
      />

      <ToolClient />

      <section className="beeija-feature-grid">
        <InfoCard title="Model the full VM workload" className="rounded-lg">
          <>
            A virtual machine bill is not only the compute hourly price. Base 
            instances, peak capacity, vCPU and memory shape, attached storage, 
            snapshots, public IPs, outbound transfer, load balancing, and 
            commitment choices can all change the monthly estimate.
          </>
        </InfoCard>

        <InfoCard title="Adjust VM rates by region and plan" className="rounded-lg">
          <>
            AWS, Azure, Google Cloud, and private quotes can price the same VM 
            shape differently by region, operating system, machine family, 
            discount model, and account agreement. Editable rate fields help 
            you use current official prices instead of relying on an old preset.
          </>
        </InfoCard>

        <InfoCard title="Use the VM estimate before sizing infrastructure" className="rounded-lg">
          <>
            Use the result before choosing VM size, uptime hours, autoscaling 
            capacity, storage size, or commitment options. Final bills can 
            still change because of taxes, support plans, credits, enterprise 
			discounts, managed services, and provider-specific billing rules.
          </>
        </InfoCard>
      </section>

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">
          When This VM Cost Calculator Helps
        </h2>
        <p className="beeija-copy">
          This calculator is useful when you are choosing a cloud VM provider,
          sizing a production workload, testing a reservation or savings-plan
          decision, or estimating the cost of moving an existing server workload
          into cloud infrastructure.
        </p>
        <BeeijaYellowLineList
          items={[
            "Compare the same VM workload across AWS, Azure, Google Cloud, or a custom provider.",
            "Estimate always-on and peak/autoscaled instance-hours separately.",
            "Add storage, snapshots, outbound transfer, public IPv4, load balancer, and fixed monthly costs.",
            "Test Spot capacity, commitment discounts, OS licence cost, and upfront reservation amortisation before deciding.",
          ]}
        />
      </section>

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">What The Estimate Includes</h2>
        <p className="beeija-copy">
          The result can include base and peak VM runtime, capacity overhead,
          on-demand and Spot compute split, commitment discount, OS licence
          cost, persistent storage, snapshots, outbound data transfer, public
          IPv4, load balancer runtime, load balancer data processing, fixed
          monthly services, and amortised upfront commitment cost.
        </p>
        <p className="beeija-copy">
          It does not replace the official provider calculator or your final
          invoice. Region, currency, operating system, machine family, free tier,
          negotiated discounts, minimum billing periods, and usage tiers can all
          change the real bill.
        </p>
      </section>

      <BeeijaOfficialPricingSources
        checkedDate="July 10, 2026"
        description="The VM pricing model, purchase-option wording, and calculator guidance for this page were checked against official provider pages."
        sources={[
          {
            label: "Amazon EC2 Pricing",
            href: "https://aws.amazon.com/ec2/pricing/",
          },
          {
            label: "AWS Pricing Calculator",
            href: "https://calculator.aws/",
          },
          {
            label: "Azure Virtual Machines Pricing",
            href: "https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/",
          },
          {
            label: "Azure Pricing Calculator",
            href: "https://azure.microsoft.com/en-us/pricing/calculator/",
          },
          {
            label: "Google Compute Engine Pricing",
            href: "https://cloud.google.com/products/compute/pricing",
          },
          {
            label: "Google Cloud Pricing Calculator",
            href: "https://cloud.google.com/products/calculator",
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
                "VM pricing changes by provider, region, machine family, operating system, payment option, currency, and account agreement. Blank rate fields make the estimate safer because you can copy current numbers from official provider pages.",
            },
            {
              question: "Is this the exact monthly cloud bill?",
              answer:
                "No. It is a planning estimate. Final bills can change because of taxes, support plans, free tiers, credits, negotiated discounts, minimum billing rules, traffic tiers, monitoring services, backup policies, and usage not entered here.",
            },
            {
              question: "Why separate base and peak VM hours?",
              answer:
                "Many workloads do not run the same number of instances all day. Base hours represent the regular footprint, while peak hours help model autoscaling, scheduled jobs, traffic spikes, or temporary capacity.",
            },
            {
              question: "How should I enter commitment or Spot discounts?",
              answer:
                "Use the effective discount that applies to the exact region, machine type, term, and account. Do not use a headline maximum discount unless your workload truly qualifies for it.",
            },
            {
              question: "Why include storage and network costs?",
              answer:
                "Persistent disks, snapshots, outbound transfer, public IPv4, and load balancers can continue billing separately from VM runtime. Including them gives a safer planning number than compute alone.",
            },
          ]}
        />
      </section>

      <BeeijaRelatedToolsSection currentHref="/tools/cloud-vm-cost-comparison-calculator" />
    </main>
  );
}

import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import InfoCard from "@/app/components/InfoCard";
import BeeijaOfficialPricingSources from "@/app/components/BeeijaOfficialPricingSources";
import { BeeijaQuestionList, BeeijaYellowLineList } from "@/app/components/BeeijaContentBlocks";
import { BeeijaRelatedToolsSection } from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Cloud NAT Gateway Cost Comparison Calculator",
  description:
    "Compare AWS NAT Gateway, Azure NAT Gateway, Google Cloud NAT, and custom managed NAT costs using gateway hours, protected instances, processed traffic, public IPs, internet transfer, logging, and migration cost.",
  keywords: [
    "cloud NAT gateway cost comparison calculator",
    "AWS NAT Gateway cost calculator",
    "Azure NAT Gateway cost calculator",
    "Google Cloud NAT cost calculator",
    "AWS NAT Gateway vs Azure NAT Gateway cost",
    "AWS NAT Gateway vs Google Cloud NAT pricing",
    "NAT data processing cost calculator",
    "cloud NAT public IP cost calculator",
    "NAT gateway egress cost calculator",
    "managed NAT gateway price comparison",
    "NAT gateway monthly cost",
    "cloud network cost calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/cloud-nat-gateway-cost-comparison-calculator",
  },
  openGraph: {
    title:
      "Cloud NAT Gateway Cost Comparison Calculator",
    description:
      "Compare complete managed NAT costs across AWS, Azure, Google Cloud, and custom providers.",
    url: "https://beeija.com/tools/cloud-nat-gateway-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Cloud NAT Gateway Cost Comparison Calculator",
    description:
      "Compare gateway runtime, processed traffic, public IP, transfer, logging, migration, and first-year NAT costs.",
  },
};

const faqs = [
  {
    question: "What charges are included in the NAT gateway estimate?",
    answer:
      "The calculator can include gateway runtime, processed outbound and return traffic, public IPv4 address hours, internet transfer out, cross-zone or regional transfer, flow logs, other fixed monthly costs, and amortised migration or setup cost.",
  },
  {
    question: "Why are internet egress prices blank by default?",
    answer:
      "Internet data transfer prices depend on provider, region, destination, monthly usage tier, and contract. Enter the current transfer-out rate for the exact traffic path you are comparing.",
  },
  {
    question: "How is Google Cloud Public NAT gateway runtime calculated?",
    answer:
      "For the editable default model, assigned instances are distributed evenly across the entered gateway count. The calculator uses the per-instance hourly rate while the average remains within the entered threshold, then uses the capped hourly gateway rate above that threshold.",
  },
  {
    question: "Does AWS charge for the public IPv4 address on a NAT Gateway?",
    answer:
      "AWS charges for in-use public IPv4 addresses. The calculator includes an editable public IP hourly field so the current address charge can be added alongside NAT Gateway runtime and data processing.",
  },
  {
    question: "Can private endpoints reduce NAT gateway cost?",
    answer:
      "Yes. Traffic routed through provider-native private endpoints or gateway endpoints can avoid some NAT processing and internet transfer charges. Enter only the traffic expected to pass through the NAT service.",
  },
];

export default function CloudNatGatewayCostComparisonCalculatorPage() {
  return (
    <ToolShell
      category="Cloud Cost Calculators"
      title="Cloud NAT Gateway Cost Comparison Calculator"
      description="Compare complete managed NAT costs across AWS NAT Gateway, Azure NAT Gateway, Google Cloud Public NAT, or a custom provider using one shared networking workload."
    >
      <ToolClient />

      <section className="beeija-feature-grid">
        <InfoCard title="Model NAT traffic paths clearly">
          <p>
            NAT cost can change with runtime, processed traffic, public IPv4,
            internet transfer, cross-zone traffic, flow logs, and migration.
          </p>
        </InfoCard>

        <InfoCard title="Check NAT pricing by provider and region">
          <p>
            AWS, Azure, and Google Cloud price managed NAT differently. Enter
            current official rates for the region, account, and traffic path
            you are checking.
          </p>
        </InfoCard>

        <InfoCard title="Plan the network design, not only the lowest price">
          <p>
            Compare central NAT, per-zone gateways, private endpoints, or
            another design. Cost is only one part of the architecture decision.
          </p>
        </InfoCard>
      </section>

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">Comparing the Same Outbound Networking Workload</h2>
        <div className="space-y-4 beeija-copy">
          <p>
            Start with the number of NAT gateways, active hours, protected VM
            instances or nodes, and public IPv4 addresses. Then enter outbound
            and return traffic processed by NAT.
          </p>
          <p>
            Internet transfer out and cross-zone traffic are entered separately
            because those charges are usually additional to the managed NAT
            processing fee.
          </p>
          <p>
            Every provider price remains editable. Replace the starting values
            with the current regional price from the official pricing page, your
            cloud calculator, contract, or invoice.
          </p>
        </div>
      </section>

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">What This NAT Gateway Estimate Includes</h2>
        <p className="beeija-copy">
          The estimate can include gateway runtime, NAT data processing, public
          IPv4 runtime, internet transfer out, cross-zone or regional transfer,
          logging, fixed monthly charges, and one-time migration or setup cost
          spread across a planning period.
        </p>
        <BeeijaYellowLineList
          items={[
            "Compare monthly operating cost and first-year cost, not only gateway hourly price.",
            "Keep internet egress and cross-zone transfer separate so hidden network charges stay visible.",
            "Use the custom provider plan for a firewall appliance, self-managed NAT instance, or negotiated provider price.",
            "Validate throughput, connection scale, SNAT port limits, route design, and zone resiliency before choosing a design.",
          ]}
        />
      </section>

      <BeeijaOfficialPricingSources
        checkedDate="29 June 2026"
        description="The built-in NAT gateway and processing defaults were checked against official provider pricing pages. Pricing can change, and transfer rates vary by region and traffic path."
        sources={[
          {
            label: "Amazon VPC Pricing",
            href: "https://aws.amazon.com/vpc/pricing/",
          },
          {
            label: "Azure NAT Gateway Pricing",
            href: "https://azure.microsoft.com/en-us/pricing/details/azure-nat-gateway/",
          },
          {
            label: "Azure Public IP Pricing",
            href: "https://azure.microsoft.com/en-us/pricing/details/ip-addresses/",
          },
          {
            label: "Google Cloud NAT Pricing",
            href: "https://cloud.google.com/nat/pricing",
          },
        ]}
      />

      <section className="beeija-section space-y-5">
        <h2 className="beeija-section-title">Common Questions</h2>
        <BeeijaQuestionList questions={faqs} />
      </section>

      <BeeijaRelatedToolsSection currentHref="/tools/cloud-nat-gateway-cost-comparison-calculator" />
    </ToolShell>
  );
}

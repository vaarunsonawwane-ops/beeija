import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
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
    question:
      "What charges are included in the NAT gateway estimate?",
    answer:
      "The calculator can include gateway runtime, processed outbound and return traffic, public IPv4 address hours, internet transfer out, cross-zone or regional transfer, flow logs, other fixed monthly costs, and amortised migration or setup cost.",
  },
  {
    question:
      "Why are internet egress prices blank by default?",
    answer:
      "Internet data transfer prices depend on provider, region, destination, monthly usage tier, and contract. Enter the current transfer-out rate for the exact traffic path you are comparing.",
  },
  {
    question:
      "How is Google Cloud Public NAT gateway runtime calculated?",
    answer:
      "For the editable default model, assigned instances are distributed evenly across the entered gateway count. The calculator uses the per-instance hourly rate while the average remains within the entered threshold, then uses the capped hourly gateway rate above that threshold.",
  },
  {
    question:
      "Does AWS charge for the public IPv4 address on a NAT Gateway?",
    answer:
      "AWS charges for in-use public IPv4 addresses. The calculator includes an editable public IP hourly field so the current address charge can be added alongside NAT Gateway runtime and data processing.",
  },
  {
    question:
      "Does Azure charge for both outbound and return traffic?",
    answer:
      "Azure states that NAT Gateway data processing includes outbound traffic and inbound return traffic. Enter both amounts so the processed-data estimate reflects the full connection flow.",
  },
  {
    question:
      "Can private endpoints reduce NAT gateway cost?",
    answer:
      "Yes. Traffic routed through provider-native private endpoints or gateway endpoints can avoid some NAT processing and internet transfer charges. Enter only the traffic expected to pass through the NAT service.",
  },
  {
    question:
      "Does the lowest monthly result guarantee the best architecture?",
    answer:
      "No. Confirm availability-zone design, throughput, connection scale, SNAT port requirements, routing, firewall inspection, private endpoint support, operational effort, and failure behaviour before selecting a NAT design.",
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

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Managed NAT services are not priced from one number.
              Gateway runtime, traffic processing, public IPv4
              addresses, internet transfer, cross-zone traffic,
              logging, and migration can all contribute to the bill.
              This calculator brings those cost layers into one
              provider comparison.
            </p>
          }
          sections={[
            {
              title:
                "Comparing the Same Outbound Networking Workload",
              content: (
                <>
                  <p>
                    Start with the number of NAT gateways, active
                    hours, protected VM instances or nodes, and
                    public IPv4 addresses. Then enter outbound and
                    return traffic processed by NAT.
                  </p>

                  <p>
                    Internet transfer out and cross-zone traffic are
                    entered separately because those charges are
                    usually additional to the managed NAT processing
                    fee.
                  </p>

                  <p>
                    Every provider price remains editable. Replace the
                    starting values with the current regional price
                    from the official pricing page, your cloud
                    calculator, contract, or invoice.
                  </p>
                </>
              ),
            },
            {
              title:
                "Understanding Gateway Runtime and Data Processing",
              content: (
                <>
                  <p>
                    AWS and Azure use a direct resource-hour charge
                    for the managed NAT gateway. Data processing is
                    charged separately for traffic passing through
                    the service.
                  </p>

                  <p>
                    Google Cloud Public NAT uses an instance-based
                    hourly gateway calculation for smaller assigned
                    fleets and a capped hourly gateway charge above
                    the provider threshold. The calculator supports
                    both pricing methods.
                  </p>

                  <p>
                    Partial-hour rules and provider billing
                    granularity can differ. Use the active-hours
                    input as a planning estimate rather than an
                    invoice reconstruction.
                  </p>
                </>
              ),
            },
            {
              title:
                "Including Public IP and Network Transfer Costs",
              content: (
                <>
                  <p>
                    A managed NAT service normally uses one or more
                    public IPv4 addresses. Those addresses can have
                    their own hourly charge, so the calculator keeps
                    public IP runtime separate from gateway runtime.
                  </p>

                  <p>
                    Standard internet transfer-out charges can also
                    apply after NAT processing. AWS can additionally
                    charge for traffic crossing Availability Zones
                    between workloads and a NAT Gateway. Other
                    providers can have comparable regional or zonal
                    transfer paths.
                  </p>

                  <p>
                    Leave a transfer rate blank when it does not apply,
                    or enter the exact current price for the traffic
                    destination and monthly usage tier.
                  </p>
                </>
              ),
            },
            {
              title:
                "Reducing NAT Gateway Spend Before Deployment",
              content: (
                <>
                  <p>
                    Review whether traffic to object storage,
                    databases, APIs, or provider services can use
                    private endpoints instead of passing through NAT.
                    This can reduce both NAT data processing and
                    internet transfer.
                  </p>

                  <p>
                    Avoid sending workloads across zones solely to
                    reach a central NAT Gateway unless the reliability
                    and operating model justify the transfer charge.
                    Compare one gateway per zone with a centralised
                    design using your real traffic.
                  </p>

                  <p>
                    Monitor idle gateways, unused public IP addresses,
                    unexpectedly high return traffic, and logging
                    volume. A small hourly charge can become material
                    across many accounts, regions, environments, and
                    availability zones.
                  </p>
                </>
              ),
            },
            {
              title:
                "Official Pricing Sources",
              content: (
                <>
                  <p>
                    The built-in gateway and processing defaults were
                    checked against official provider pricing on
                    29 June 2026. Pricing can change, and transfer
                    rates vary by region and traffic path.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://aws.amazon.com/vpc/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Amazon VPC Pricing
                    </a>

                    <a
                      href="https://azure.microsoft.com/en-us/pricing/details/azure-nat-gateway/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Azure NAT Gateway Pricing
                    </a>

                    <a
                      href="https://azure.microsoft.com/en-us/pricing/details/ip-addresses/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Azure Public IP Pricing
                    </a>

                    <a
                      href="https://cloud.google.com/nat/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Google Cloud NAT Pricing
                    </a>
                  </div>
                </>
              ),
            },
            {
              title:
                "Using the Result for a Real Architecture Decision",
              content: (
                <>
                  <p>
                    Compare monthly operating cost and first-year cost,
                    not only the gateway hourly rate. A migration,
                    routing redesign, firewall change, or observability
                    change can alter the first-year result.
                  </p>

                  <p>
                    Validate throughput, connection scale, port
                    allocation, zone resiliency, failover behaviour,
                    routing control, IPv6 plans, and security
                    requirements before choosing a provider design.
                  </p>

                  <p>
                    Use the custom plan for a self-managed NAT instance,
                    firewall appliance, negotiated provider price, or
                    another managed networking service.
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

                      <p className="mt-2">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              title:
                "Explore Related Cloud Cost Tools",
              content: (
                <BeeijaRelatedTools
                  currentHref="/tools/cloud-nat-gateway-cost-comparison-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

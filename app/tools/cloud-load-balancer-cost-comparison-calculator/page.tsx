import type { Metadata } from "next";

import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolContent from "@/app/components/ToolContent";
import ToolShell from "@/app/components/ToolShell";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Cloud Load Balancer Cost Comparison Calculator",
  description:
    "Compare AWS Application Load Balancer, Azure Application Gateway, Google Cloud Load Balancing, and custom load balancer costs using runtime, capacity units, processed traffic, forwarding rules, outbound transfer, WAF, logging, and migration cost.",
  keywords: [
    "cloud load balancer cost comparison calculator",
    "AWS load balancer cost calculator",
    "AWS ALB cost calculator",
    "Azure Application Gateway cost calculator",
    "Google Cloud Load Balancing cost calculator",
    "load balancer pricing comparison",
    "ALB LCU calculator",
    "Application Gateway capacity unit calculator",
    "Google Cloud forwarding rules cost calculator",
    "cloud load balancer monthly cost",
    "load balancer traffic cost calculator",
    "cloud network cost calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/cloud-load-balancer-cost-comparison-calculator",
  },
  openGraph: {
    title: "Cloud Load Balancer Cost Comparison Calculator",
    description:
      "Compare load balancer runtime, capacity, forwarding rules, processed traffic, transfer, logging, WAF, migration, and first-year planning cost.",
    url: "https://beeija.com/tools/cloud-load-balancer-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Load Balancer Cost Comparison Calculator",
    description:
      "Estimate and compare AWS, Azure, Google Cloud, and custom load balancer costs before choosing a cloud design.",
  },
};

const faqs = [
  {
    question: "What costs are included in this cloud load balancer estimate?",
    answer:
      "The calculator can include load balancer runtime, AWS-style LCU usage, Azure-style capacity units, Google-style forwarding rules, processed inbound and outbound traffic, internet transfer out, WAF cost, logging, support allocation, fixed monthly costs, and amortised migration or setup cost.",
  },
  {
    question: "Why are internet transfer prices blank by default?",
    answer:
      "Internet data transfer depends on provider, region, destination, CDN use, private connectivity, monthly tier, and contract. Enter the current rate for the exact traffic path you are comparing.",
  },
  {
    question: "How does the AWS Application Load Balancer estimate work?",
    answer:
      "The AWS plan estimates a simplified ALB charge from load balancer hours and the highest LCU dimension entered: new connections, active connections, processed bytes, or rule evaluations. Use AWS Pricing Calculator for final production estimates.",
  },
  {
    question: "How does the Azure Application Gateway estimate work?",
    answer:
      "The Azure plan separates a fixed gateway-hour charge from capacity-unit hours. Capacity units depend on connection, throughput, and compute behaviour, so enter the average capacity units you expect or get from Azure sizing guidance.",
  },
  {
    question: "How does the Google Cloud Load Balancing estimate work?",
    answer:
      "The Google plan estimates forwarding-rule hours plus load-balancer data processing. Google pricing can differ for global, regional, internal, external, proxy, passthrough, and cross-region designs, so the fields stay editable.",
  },
  {
    question: "Does this include backend compute cost?",
    answer:
      "No. Backend VMs, Kubernetes nodes, containers, serverless services, databases, storage, CDN, DNS, certificates, security products, and observability tools are separate unless you add them as fixed monthly cost.",
  },
  {
    question: "Should I choose the lowest monthly result?",
    answer:
      "Not automatically. Check Layer 4 versus Layer 7 features, TLS termination, WAF needs, private/internal traffic, zone design, health checks, failover, limits, latency, operational effort, and provider fit before choosing.",
  },
];

export default function CloudLoadBalancerCostComparisonCalculatorPage() {
  return (
    <ToolShell
      title="Cloud Load Balancer Cost Comparison Calculator"
      description="Compare AWS, Azure, Google Cloud, and custom load balancer costs using the same traffic workload and editable provider prices."
      category="Cloud Cost Calculators"
    >
      <ToolClient />

      <ToolContent
        intro={
          <>
            <p>
              A cloud load balancer bill can come from more than the base hourly
              price. Capacity units, processed data, forwarding rules, outbound
              transfer, WAF, logging, and migration work can change the monthly
              planning number.
            </p>
            <p>
              Use this calculator when you are comparing a public web
              application, API gateway layer, internal service entry point, or a
              multi-cloud migration where the load balancer itself may become a
              steady recurring cost.
            </p>
          </>
        }
        sections={[
          {
            title: "Comparing the Same Load Balancing Workload",
            content: (
              <>
                <p>
                  Start with the shared workload: active hours, number of load
                  balancers, connection shape, processed traffic, forwarding
                  rules, outbound transfer, WAF, logging, and budget. The same
                  workload is applied to every provider plan.
                </p>
                <p>
                  Provider pricing models are different, so this page keeps the
                  provider fields editable. Replace any default value with the
                  current regional price from the official provider page, your
                  cloud calculator, negotiated agreement, or latest invoice.
                </p>
              </>
            ),
          },
          {
            title: "AWS, Azure, and Google Price Models Are Not Identical",
            content: (
              <>
                <p>
                  AWS Application Load Balancer pricing combines an ALB-hour
                  charge with LCU usage. LCUs depend on the highest usage
                  dimension across new connections, active connections,
                  processed bytes, and rule evaluations.
                </p>
                <p>
                  Azure Application Gateway pricing separates gateway runtime
                  and capacity units. Google Cloud Load Balancing commonly
                  includes forwarding-rule charges and load-balancer data
                  processing, with extra data transfer billed separately.
                </p>
                <p>
                  This calculator is a planning tool, not a replacement for the
                  official pricing calculator of each provider.
                </p>
              </>
            ),
          },
          {
            title: "Adding Transfer, WAF, Logging, and Migration Costs",
            content: (
              <>
                <p>
                  Internet transfer out is entered separately because standard
                  network egress is usually billed outside the base load
                  balancer charge. Private connectivity, CDN, peering, and
                  regional traffic paths can change this number.
                </p>
                <p>
                  WAF, access logs, monitoring, certificate operations,
                  migration work, and routing changes can also affect the first
                  year cost. Add those costs when they are part of the real
                  design decision.
                </p>
              </>
            ),
          },
          {
            title: "Official Pricing Sources",
            content: (
              <>
                <p>
                  Built-in example prices and pricing logic were checked against
                  official provider pricing pages on 7 July 2026. Prices can
                  change, and some provider pricing tables vary by region,
                  currency, offer, agreement, or account.
                </p>
                <p>
                  <a
                    href="https://aws.amazon.com/elasticloadbalancing/pricing/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Amazon Elastic Load Balancing Pricing
                  </a>{" "}
                  ·{" "}
                  <a
                    href="https://azure.microsoft.com/en-us/pricing/details/application-gateway/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Azure Application Gateway Pricing
                  </a>{" "}
                  ·{" "}
                  <a
                    href="https://azure.microsoft.com/en-us/pricing/details/load-balancer/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Azure Load Balancer Pricing
                  </a>{" "}
                  ·{" "}
                  <a
                    href="https://cloud.google.com/load-balancing/pricing"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Google Cloud Load Balancing Pricing
                  </a>
                </p>
              </>
            ),
          },
          {
            title: "Using the Result Before Choosing an Architecture",
            content: (
              <>
                <p>
                  Compare monthly operating cost and first-year cost. A lower
                  base hourly charge may not stay lower when traffic, rules,
                  capacity, WAF, and transfer are included.
                </p>
                <p>
                  Before choosing a provider or design, confirm whether you
                  need Layer 4 or Layer 7 routing, TLS termination, HTTP rules,
                  WebSockets, private load balancing, static IPs, WAF, multi-zone
                  resilience, cross-region failover, and observability.
                </p>
                <p>
                  Use the custom plan for a self-managed reverse proxy, NGINX or
                  HAProxy on VMs, a marketplace appliance, a negotiated provider
                  price, or another managed load balancing service.
                </p>
              </>
            ),
          },
          {
            title: "Frequently Asked Questions",
            content: (
              <div className="space-y-5">
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-base font-semibold text-gray-950">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            ),
          },
          {
            title: "Explore Related Cloud Cost Tools",
            content: (
              <BeeijaRelatedTools
                currentHref="/tools/cloud-load-balancer-cost-comparison-calculator"
                category="Cloud Cost Calculators"
              />
            ),
          },
        ]}
      />
    </ToolShell>
  );
}

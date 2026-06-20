import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Cloud VM Cost Comparison Calculator",
  description:
    "Compare AWS EC2, Azure Virtual Machines, Google Compute Engine, or custom VM plans using runtime, autoscaling, commitments, Spot usage, storage, bandwidth, public IPs, and load balancers.",
  keywords: [
    "cloud VM cost comparison calculator",
    "AWS Azure GCP cost calculator",
    "virtual machine cost calculator",
    "EC2 vs Azure VM vs Google Compute Engine cost",
    "cloud server cost comparison",
    "cloud compute cost calculator",
    "VM hourly cost calculator",
    "cloud commitment savings calculator",
    "Spot VM cost calculator",
    "cloud infrastructure cost comparison",
    "AWS EC2 cost calculator",
    "Azure VM cost calculator",
    "Google Compute Engine cost calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/cloud-vm-cost-comparison-calculator",
  },
  openGraph: {
    title: "Cloud VM Cost Comparison Calculator",
    description:
      "Compare compute, commitments, Spot usage, disks, snapshots, bandwidth, public IPs, load balancers, and first-year VM cost.",
    url: "https://beeija.com/tools/cloud-vm-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud VM Cost Comparison Calculator",
    description:
      "Estimate and compare complete monthly and first-year cloud VM costs.",
  },
};

const faqs = [
  {
    question: "Why does this calculator use custom provider prices?",
    answer:
      "Cloud VM prices change by region, operating system, machine family, purchase option, currency, and account agreement. Custom fields let you use the exact current rates from each provider calculator or your invoice.",
  },
  {
    question: "How are base and peak VM hours calculated?",
    answer:
      "Base instances use the entered base hours per day. Additional peak instances use the separate peak hours per day. Both are multiplied by active days and the capacity-overhead percentage.",
  },
  {
    question: "How are commitment and Spot discounts applied?",
    answer:
      "The commitment discount applies to the non-Spot compute share. The Spot discount applies to the Spot compute share. Operating-system licence cost remains separate because its discount treatment can differ.",
  },
  {
    question: "Why is persistent storage entered separately from VM runtime?",
    answer:
      "A disk can remain provisioned when a VM is stopped. Enter the total persistent storage expected for the month instead of assuming disk cost follows running hours.",
  },
  {
    question: "What should be included in fixed monthly costs?",
    answer:
      "Use the field for monitoring, backup software, security tools, management services, support allocation, or other recurring charges not represented elsewhere.",
  },
  {
    question: "Does the lowest calculated plan guarantee the best cloud choice?",
    answer:
      "No. Architecture fit, availability, performance, regional capacity, support, migration effort, service limits, and operational skill also matter.",
  },
];

export default function CloudVmCostComparisonCalculatorPage() {
  return (
    <ToolShell
      category="Cloud Cost Calculators"
      title="Cloud VM Cost Comparison Calculator"
      description="Compare complete virtual-machine costs across AWS EC2, Azure Virtual Machines, Google Compute Engine, or other cloud plans using your current regional prices."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              A VM hourly price is only one part of a cloud bill. Persistent
              disks, snapshots, outbound traffic, public IPs, load balancers,
              commitments, Spot usage, and always-on capacity can materially
              change the final cost. This calculator compares those layers.
            </p>
          }
          sections={[
            {
              title: "Comparing the Same Workload Across Cloud Plans",
              content: (
                <>
                  <p>
                    Enter one shared workload and up to three provider plans.
                    The workload includes base instances, additional peak
                    instances, active hours, storage, snapshots, outbound data,
                    public IPs, and load balancer usage.
                  </p>

                  <p>
                    Each plan can use its own VM price, commitment discount,
                    Spot discount, operating-system licence, storage rates,
                    network rates, fixed monthly fees, and upfront commitment.
                  </p>

                  <p>
                    The result ranks configured plans by monthly planning cost
                    and shows cost per instance-hour, vCPU-hour, memory GB-hour,
                    and first-year cost.
                  </p>
                </>
              ),
            },
            {
              title: "Modelling Runtime and Autoscaling",
              content: (
                <>
                  <p>
                    Base VM hours represent the regular workload. Peak VM hours
                    represent extra instances added for traffic, scheduled
                    processing, or autoscaling.
                  </p>

                  <p>
                    Capacity overhead adds headroom for deployment overlap,
                    health checks, scaling delay, failed instances, or
                    conservative planning. It applies to total instance-hours.
                  </p>

                  <p>
                    Use actual billed or forecast hours rather than multiplying
                    every instance by a full month when workloads shut down
                    overnight or run only on selected days.
                  </p>
                </>
              ),
            },
            {
              title: "Including Commitments and Interruptible Capacity",
              content: (
                <>
                  <p>
                    The non-Spot share can use an entered commitment or
                    reservation discount. The Spot share uses a separate
                    discount and is calculated from the same VM base rate.
                  </p>

                  <p>
                    AWS offers On-Demand capacity without a long-term
                    commitment and also offers commitment-based savings
                    options. Azure provides pay-as-you-go and reservation or
                    savings-plan options. Google Cloud provides sustained-use
                    and committed-use discounts for eligible Compute Engine
                    usage.
                  </p>

                  <p>
                    Enter the effective discount that applies to the selected
                    region, machine, term, and account. Do not use a headline
                    maximum discount unless the planned usage actually
                    qualifies.
                  </p>
                </>
              ),
            },
            {
              title: "Adding Storage, Bandwidth, IP, and Load Balancer Cost",
              content: (
                <>
                  <p>
                    Persistent storage and snapshots are entered as total
                    monthly capacity. Outbound data uses the effective price per
                    GB after any free allowance or tiering.
                  </p>

                  <p>
                    Public IPv4 cost is calculated from address count and the
                    full monthly hours entered in the workload. Load balancer
                    cost combines hourly charges and data-processing charges.
                  </p>

                  <p>
                    Provider pricing pages and calculators should be used to
                    collect the current rates for the exact region and service
                    configuration.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://aws.amazon.com/ec2/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Amazon EC2 Pricing
                    </a>

                    <a
                      href="https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Azure VM Pricing
                    </a>

                    <a
                      href="https://cloud.google.com/products/compute/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Google Compute Pricing
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Compare the same VM workload across cloud providers.</li>
                  <li>Estimate scheduled and autoscaled compute hours.</li>
                  <li>Test commitment and Spot usage mixes.</li>
                  <li>Include persistent disks and snapshot retention.</li>
                  <li>Budget outbound data and public IPv4 addresses.</li>
                  <li>Include load balancer and fixed management charges.</li>
                  <li>Calculate all-in cost per vCPU-hour and memory GB-hour.</li>
                  <li>Compare monthly, first-year, and budget outcomes.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Limits Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include taxes, support
                    plans, private connectivity, NAT gateways, managed
                    databases, Kubernetes control planes, serverless services,
                    backup transfer, licences outside the entered hourly rate,
                    or migration labour.
                  </p>

                  <p>
                    Cloud bills can also use tiered pricing, minimum billing
                    periods, currency conversion, negotiated discounts, and
                    credits. Use effective rates from the latest provider
                    estimate or billing export.
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
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/tools/ai-gpu-inference-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI GPU Inference Cost Calculator
                  </Link>

                  <Link
                    href="/categories/cloud-cost-calculators"
                    className="beeija-btn-outline"
                  >
                    Cloud Cost Calculators
                  </Link>

                  <Link
                    href="/categories/hosting-infrastructure-calculators"
                    className="beeija-btn-outline"
                  >
                    Hosting &amp; Infrastructure Calculators
                  </Link>

                  <Link
                    href="/categories/capacity-usage-calculators"
                    className="beeija-btn-outline"
                  >
                    Capacity &amp; Usage Calculators
                  </Link>

                  <Link
                    href="/categories/technology-comparison-tools"
                    className="beeija-btn-outline"
                  >
                    Technology Comparison Tools
                  </Link>
                </div>
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

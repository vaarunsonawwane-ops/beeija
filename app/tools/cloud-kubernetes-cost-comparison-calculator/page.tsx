import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

const pricingCheckedDate = "June 25, 2026";

export const metadata: Metadata = {
  title: "Cloud Kubernetes Cost Comparison Calculator",
  description:
    "Compare Amazon EKS, Azure Kubernetes Service, and Google Kubernetes Engine using cluster fees, worker or pod compute, storage, load balancers, NAT, transfer, logging, backups, discounts, and migration cost.",
  keywords: [
    "cloud Kubernetes cost comparison calculator",
    "Kubernetes pricing calculator",
    "Amazon EKS cost calculator",
    "Azure AKS cost calculator",
    "Google GKE cost calculator",
    "EKS vs AKS vs GKE cost",
    "managed Kubernetes cost comparison",
    "Kubernetes cluster cost calculator",
    "Kubernetes worker node cost",
    "Kubernetes control plane cost",
    "GKE Autopilot cost calculator",
    "EKS Auto Mode cost calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/cloud-kubernetes-cost-comparison-calculator",
  },
  openGraph: {
    title: "Cloud Kubernetes Cost Comparison Calculator",
    description:
      "Compare complete managed Kubernetes costs across AWS, Azure, and Google Cloud using current regional prices entered for each plan.",
    url: "https://beeija.com/tools/cloud-kubernetes-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Kubernetes Cost Comparison Calculator",
    description:
      "Estimate monthly and first-year Kubernetes costs across Amazon EKS, Azure AKS, and Google GKE.",
  },
};

const faqs = [
  {
    question: "Why are the provider prices left blank?",
    answer:
      "Managed Kubernetes prices vary by region, cluster tier, Kubernetes version support, worker machine, purchase option, networking design, currency, and account agreement. Blank fields let you enter the current effective prices for the exact plan being considered.",
  },
  {
    question: "What is the difference between node-based and requested-resource billing?",
    answer:
      "Node-based billing charges for worker virtual machines and any node-management premium. Requested-resource billing charges for the vCPU, memory, and ephemeral storage requested by pods. Use the billing model shown for the exact EKS, AKS, or GKE configuration.",
  },
  {
    question: "How are control-plane or cluster-management fees calculated?",
    answer:
      "The calculator multiplies the entered cluster fee by cluster count and running hours, then subtracts an optional monthly cluster-fee credit. This supports paid control planes, free tiers, extended support, and account-level credits.",
  },
  {
    question: "Does the estimate include load balancers and NAT gateways?",
    answer:
      "Yes. Enter hourly infrastructure prices and data-processing rates for load balancers and NAT gateways. These costs are kept separate because network design and provider billing rules differ.",
  },
  {
    question: "Can GKE Autopilot, EKS Fargate, or another automatic mode be compared?",
    answer:
      "Yes. Select requested-resource billing and enter the current vCPU-hour, memory GB-hour, and ephemeral-storage GB-hour rates. For node-based automatic modes, use node-based billing and include the provider management premium.",
  },
  {
    question: "Does this replace the official cloud pricing calculators?",
    answer:
      "No. It provides one consistent comparison model. Use the official provider calculator to obtain the current regional rates, enter them here, and verify the final architecture before purchasing.",
  },
];

export default function CloudKubernetesCostComparisonCalculatorPage() {
  return (
    <ToolShell
      category="Cloud Cost Calculators"
      title="Cloud Kubernetes Cost Comparison Calculator"
      description="Compare complete managed Kubernetes costs across Amazon EKS, Azure Kubernetes Service, Google Kubernetes Engine, or a custom plan using your current regional prices."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              A managed Kubernetes bill can include cluster-management fees,
              worker nodes, automatic or serverless pod resources, persistent
              disks, load balancers, NAT gateways, data processing, internet
              transfer, logging, backups, fixed platform services, and
              migration cost. This calculator keeps those cost layers visible
              instead of comparing only the control-plane price.
            </p>
          }
          sections={[
            {
              title: "Comparing the Same Kubernetes Workload",
              content: (
                <>
                  <p>
                    Enter one shared workload and up to three provider plans.
                    The shared workload includes cluster count, monthly running
                    hours, worker nodes, node capacity, requested pod
                    resources, persistent storage, load balancers, NAT
                    gateways, transfer, observability, backups, and a monthly
                    budget.
                  </p>

                  <p>
                    Each plan can use its own provider, region, Kubernetes
                    service, version-support tier, billing model, machine name,
                    control-plane fee, compute price, management premium,
                    storage price, network price, observability price, backup
                    price, discount, fixed monthly cost, and migration cost.
                  </p>

                  <p>
                    Configured plans are ranked by monthly planning cost. The
                    result also shows first-year cost, cost per cluster, cost
                    per workload vCPU, budget position, and the possible saving
                    against the lowest configured plan.
                  </p>
                </>
              ),
            },
            {
              title: "Node-Based and Requested-Resource Billing",
              content: (
                <>
                  <p>
                    Standard Kubernetes clusters commonly bill worker capacity
                    through cloud virtual machines. Enter the full hourly worker
                    node price and any separate automatic-management premium.
                    The calculator multiplies that amount by worker nodes,
                    clusters, and running hours.
                  </p>

                  <p>
                    Automatic, pod-based, and serverless modes can charge for
                    requested vCPU, memory, and ephemeral storage. Select
                    requested-resource billing and enter the exact unit prices
                    from the provider. A complete monthly option is also
                    available for custom quotes or bundled plans.
                  </p>

                  <p>
                    Do not enter both node-based and requested-resource prices
                    for the same plan. The selected billing model determines
                    which compute fields are included.
                  </p>
                </>
              ),
            },
            {
              title: "Cluster Fees, Version Support, and Credits",
              content: (
                <>
                  <p>
                    Amazon EKS charges a per-cluster hourly fee based on the
                    Kubernetes version-support tier. Azure AKS offers Free,
                    Standard SLA, Premium LTS, and Automatic choices with
                    different management and support structures. GKE applies a
                    cluster-management fee and supports an account-level free
                    tier credit for eligible clusters.
                  </p>

                  <p>
                    Enter the effective cluster fee for the selected tier and
                    version. Use the optional monthly cluster-fee credit for an
                    eligible free tier or account credit. The calculator never
                    assumes that a credit applies to every cluster.
                  </p>

                  <p>
                    Extended version support can materially increase cluster
                    fees. Check the current Kubernetes version lifecycle before
                    leaving a production cluster on an older minor version.
                  </p>
                </>
              ),
            },
            {
              title: "Storage, Load Balancers, NAT, and Data Transfer",
              content: (
                <>
                  <p>
                    Persistent storage is calculated from the total provisioned
                    storage per cluster. Load balancers and NAT gateways use
                    separate hourly infrastructure and per-GB processing rates.
                    Internet or cross-region transfer is calculated separately
                    from load-balancer and NAT processing.
                  </p>

                  <p>
                    This separation is important because one GB can create more
                    than one network charge. For example, traffic can pass
                    through a load balancer, a NAT gateway, and an internet
                    egress route. Enter each charge only when it applies to the
                    planned architecture.
                  </p>

                  <p>
                    Observability ingestion, backup management, and backup
                    storage are also separate. This helps compare clusters that
                    use different logging retention, namespace backup, or
                    disaster-recovery designs.
                  </p>
                </>
              ),
            },
            {
              title: "Current Pricing Sources and Checked Date",
              content: (
                <>
                  <p>
                    Product names, operating modes, cluster-fee structures,
                    version-support tiers, and billing guidance were checked on{" "}
                    {pricingCheckedDate}. Prices remain blank because actual
                    rates depend on region, worker type, purchase option,
                    support tier, networking, storage, currency, and account
                    agreement.
                  </p>

                  <p>
                    Use each provider pricing page or account calculator to
                    enter the current effective rates for the exact
                    configuration. This prevents one regional example from
                    being presented as a universal price.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://aws.amazon.com/eks/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Amazon EKS Pricing
                    </a>

                    <a
                      href="https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Azure Kubernetes Service Pricing
                    </a>

                    <a
                      href="https://cloud.google.com/kubernetes-engine/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Google Kubernetes Engine Pricing
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Compare Amazon EKS, Azure AKS, and Google GKE using one workload.</li>
                  <li>Compare standard worker nodes with automatic or pod-based billing.</li>
                  <li>Measure control-plane, SLA, and extended-support fees.</li>
                  <li>Include worker-management premiums and compute discounts.</li>
                  <li>Add persistent storage, load balancers, and NAT gateways.</li>
                  <li>Include network processing and internet data transfer.</li>
                  <li>Add logging, backup management, and backup storage.</li>
                  <li>Measure monthly operating and first-year migration cost.</li>
                  <li>Check each Kubernetes plan against a monthly budget.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Limits Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include taxes, premium
                    cloud support, public IPv4 addresses, private connectivity,
                    service mesh, security products, container registry,
                    artifact storage, DNS, secrets, certificate management,
                    cross-zone traffic, cross-region replication, engineering
                    labour, or services not entered.
                  </p>

                  <p>
                    Similar vCPU and memory values do not guarantee similar
                    Kubernetes performance. Processor generation, allocatable
                    capacity, pod density, CNI limits, storage latency,
                    autoscaling, spot interruption, control-plane limits, and
                    managed features differ. Test a representative workload
                    before choosing a provider.
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
                <BeeijaRelatedTools currentHref="/tools/cloud-kubernetes-cost-comparison-calculator" />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}

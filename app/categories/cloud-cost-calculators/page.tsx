import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/app/components/ToolCard";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "Cloud Cost Calculators",
);

export const metadata: Metadata = {
  title: "Cloud Cost Calculators",

  description:
    "Browse Beeija tools for virtual machines, storage, managed databases, Kubernetes, serverless functions, NAT gateways, load balancers, and cloud cost comparisons.",

  alternates: {
    canonical: "https://beeija.com/categories/cloud-cost-calculators",
  },

  openGraph: {
    title: "Cloud Cost Calculators | Beeija",
    description:
      "Explore Beeija tools for comparing compute, storage, database, networking, Kubernetes, serverless, and other cloud infrastructure costs.",
    url: "https://beeija.com/categories/cloud-cost-calculators",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Cloud Cost Calculators | Beeija",
    description:
      "Explore Beeija tools for comparing compute, storage, database, networking, Kubernetes, serverless, and other cloud infrastructure costs.",
  },
};

export default function CategoryPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center text-sm text-gray-500"
        >
          <Link
            href="/"
            className="transition-colors duration-200 hover:text-[var(--green)]"
          >
            Home
          </Link>

          <span className="mx-2" aria-hidden="true">
            /
          </span>

          <Link
            href="/categories"
            className="transition-colors duration-200 hover:text-[var(--green)]"
          >
            Categories
          </Link>

          <span className="mx-2" aria-hidden="true">
            /
          </span>

          <span className="text-gray-900">Cloud Cost Calculators</span>
        </nav>

        <header className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            Cloud Cost Calculators
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Compare costs across virtual machines, storage, managed databases,
            Kubernetes, serverless functions, NAT, load balancing, and other
            infrastructure that contributes to a cloud bill.
          </p>
        </header>

        <section className="mt-14">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Cloud bills are shaped by architecture
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              The visible hourly or monthly rate is only one part of a useful
              estimate. Resource choices, availability requirements, data
              movement, performance settings, and purchase models can all change
              the amount you actually pay.
            </p>
          </div>

          <div className="mt-8 space-y-8">
            <article className="max-w-5xl border-l-4 border-[#F2C94C] pl-5">
              <h3 className="text-lg font-semibold text-gray-950">
                Compute depends on both runtime and purchase model
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                VM cost can change with instance size, operating system,
                runtime, region, commitments, Spot or other interruptible
                capacity, attached storage, public IPs, and related network
                services. A discounted commitment should not be compared with
                another provider&apos;s on-demand rate as though the terms were
                equivalent.
              </p>
            </article>

            <article className="max-w-5xl border-l-4 border-[#F2C94C] pl-5">
              <h3 className="text-lg font-semibold text-gray-950">
                Databases carry availability and performance choices
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Managed PostgreSQL, MySQL, Redis, and SQL Server costs can extend
                beyond compute. High availability, replicas, storage, IOPS,
                backups, licensing, support, and transfer can materially change
                the result.
              </p>
            </article>

            <article className="max-w-5xl border-l-4 border-[#F2C94C] pl-5">
              <h3 className="text-lg font-semibold text-gray-950">
                Storage is more than capacity
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Object and block storage can be affected by storage tier,
                requests, retrievals, snapshots, IOPS, throughput, lifecycle
                transitions, replication, and data leaving the service. The
                cheapest price per GB is not always the cheapest workload.
              </p>
            </article>

            <article className="max-w-5xl border-l-4 border-[#F2C94C] pl-5">
              <h3 className="text-lg font-semibold text-gray-950">
                Network services can become their own cost center
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                NAT gateways, load balancers, public IPs, processed traffic,
                cross-service transfer, internet egress, logging, and security
                features can sit outside the headline compute price. They are
                easy to miss when an estimate focuses only on servers.
              </p>
            </article>

            <article className="max-w-5xl border-l-4 border-[#F2C94C] pl-5">
              <h3 className="text-lg font-semibold text-gray-950">
                Managed platforms trade operational work for different billing
                units
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Kubernetes and serverless platforms may combine control-plane
                fees, worker or pod compute, requests, execution time, memory,
                vCPU, storage, networking, logging, and always-on capacity. The
                architecture decides which of those costs matter.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Browse cloud tools
            </h2>

            <p className="mt-3 leading-relaxed text-gray-600">
              Choose the tool that matches the resource or architecture you want
              to compare. Each page focuses on the billing inputs and
              assumptions that matter for that service.
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((tool) => (
              <ToolCard
                key={tool.href}
                name={tool.title}
                description={tool.description}
                href={tool.href}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Compare like-for-like configurations
            </h2>

            <div className="mt-5 space-y-4 leading-8 text-gray-600">
              <p>
                A provider comparison is only useful when the workloads are
                genuinely comparable. Keep the region, runtime, availability
                target, performance requirement, storage amount, backup policy,
                transfer pattern, and support assumptions as close as possible.
              </p>

              <p>
                Purchase models also need to be compared on equal terms.
                On-demand, reserved or committed capacity, and Spot or
                interruptible capacity trade flexibility, commitment, and
                interruption risk differently. A lower rate can come with a
                condition that changes whether the option fits the workload.
              </p>

              <p>
                First-year cost can also include migration, setup, data transfer,
                support, or parallel-running expenses that do not appear in a
                simple steady-state monthly rate. Those costs matter when the
                decision is about moving an existing workload rather than
                starting from zero.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Costs that are easy to leave out
            </h2>

            <div className="mt-6 grid gap-x-10 gap-y-7 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-gray-950">
                  Data transfer and egress
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                  Traffic leaving a service, region, or cloud can add charges
                  that are not visible in the resource&apos;s base price.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-950">
                  Backups, snapshots, and replicas
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                  Resilience and recovery features can add storage, compute, or
                  transfer costs even when the primary workload stays the same.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-950">
                  Idle or always-on infrastructure
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                  Gateways, load balancers, reserved capacity, warm instances,
                  and other resources may continue costing money when application
                  traffic is low.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-950">
                  Licensing, support, and logging
                </h3>
                <p className="mt-2 leading-7 text-gray-600">
                  Database licenses, extended support, monitoring, logging, and
                  security services can materially change a production estimate.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 border-l-4 border-[#F2C94C] bg-[#F5FAF7] p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-950">
            How Beeija approaches cloud estimates
          </h2>

          <div className="mt-4 max-w-5xl space-y-4 leading-8 text-gray-600">
            <p>
              Beeija calculations are planning estimates, not provider invoices.
              Cloud pricing can vary by provider, region, resource type, purchase
              model, currency, discounts, taxes, support plan, and actual usage.
            </p>

            <p>
              When provider pricing is built into a tool, the aim is to make the
              source, checked date, assumptions, and editable inputs clear enough
              that you can see what is driving the comparison and update rates
              when needed.
            </p>
          </div>

          <Link
            href="/how-beeija-tools-are-built"
            className="mt-6 inline-flex font-medium text-[var(--green)] transition-colors duration-200 hover:underline"
          >
            How Beeija Tools Are Built →
          </Link>
        </section>

        <section className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-semibold text-gray-950">
            Related category
          </h2>

          <p className="mt-3 max-w-3xl leading-relaxed text-gray-600">
            An AI product can have two separate cost layers: model or API usage,
            and the cloud infrastructure running the rest of the application.
            Use the AI category when you need to estimate that model-side cost.
          </p>

          <Link
            href="/categories/ai-cost-calculators"
            className="beeija-btn-outline mt-6 inline-flex"
          >
            AI Cost Calculators
          </Link>
        </section>
      </div>
    </main>
  );
}

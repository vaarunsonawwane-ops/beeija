import type { Metadata } from "next";
import Link from "next/link";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

const title = "Cloud Load Balancer Cost Comparison Calculator";
const description =
  "Compare AWS, Azure, Google Cloud, and Cloudflare load balancer costs using editable hourly, capacity, data processing, transfer, WAF, logging, and setup inputs.";
const href = "/tools/cloud-load-balancer-cost-comparison-calculator";

export const metadata: Metadata = {
  title: `${title} | Beeija`,
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
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-14 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#165A31]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/tools" className="hover:text-[#165A31]">
          Tools
        </Link>
      </nav>

      <div className="mb-8">
        <Link
          href="/tools"
          className="text-sm font-medium text-[#165A31] hover:underline"
        >
          ← Back to Tools
        </Link>
      </div>

      <section className="mb-10 max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#a67c00]">
          Cloud Cost Calculators
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Cloud Load Balancer Cost Comparison Calculator
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-700">
          Estimate monthly load balancer cost across AWS, Azure, Google Cloud,
          and Cloudflare using the same workload assumptions. Enter the current
          rates from the provider pricing pages, then compare base runtime,
          capacity units, processed traffic, forwarding rules, outbound
          transfer, WAF, logging, and optional setup cost in one clean view.
        </p>
        <div className="mt-4 rounded-lg border-l-4 border-[#F2C94C] bg-[#fffdf3] p-4 text-sm leading-6 text-slate-700">
          Pricing model checked: July 7, 2026. Prices are not hardcoded because
          load balancer rates vary by provider, region, product type, account
          agreement, currency, discounts, and traffic shape.
        </div>
      </section>

      <ToolClient />

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Compare real workload shape
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Load balancer cost is not just one hourly line. The estimate can
            change when traffic grows, more rules are added, capacity units rise,
            or outbound transfer becomes a bigger part of the bill.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Keep provider prices editable
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            AWS, Azure, Google Cloud, and Cloudflare do not price every load
            balancing setup the same way. Editable rates help you use current
            official numbers instead of trusting an outdated preset.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Read the estimate safely
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the result as a planning number before tax, support plans,
            reserved discounts, committed-use discounts, free tier credits, and
            provider-specific billing rules.
          </p>
        </div>
      </section>

      <section className="mt-10 max-w-4xl space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          When This Load Balancer Calculator Helps
        </h2>
        <p className="text-sm leading-7 text-slate-700">
          This calculator is useful when you are choosing between a managed
          application load balancer, gateway, traffic steering service, or CDN
          load balancing setup before moving a project to production. It helps
          compare costs that are easy to miss when you only look at a base
          hourly price.
        </p>
        <ul className="grid gap-3 text-sm leading-6 text-slate-700 md:grid-cols-2">
          <li className="rounded-lg border border-slate-200 bg-white p-4">
            Estimate monthly cost for one production load balancer.
          </li>
          <li className="rounded-lg border border-slate-200 bg-white p-4">
            Compare AWS ALB-style pricing with Azure, Google Cloud, or
            Cloudflare planning inputs.
          </li>
          <li className="rounded-lg border border-slate-200 bg-white p-4">
            Add WAF, logging, monitoring, data processing, and transfer cost
            before deciding.
          </li>
          <li className="rounded-lg border border-slate-200 bg-white p-4">
            Stress test traffic growth without breaking the page layout.
          </li>
        </ul>
      </section>

      <section className="mt-10 max-w-4xl space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          What The Estimate Includes
        </h2>
        <p className="text-sm leading-7 text-slate-700">
          The result can include base hourly runtime, average capacity or LCU
          usage, processed GB, forwarding rule charges, outbound transfer, WAF,
          logging, monitoring, and optional one-time setup cost spread across a
          planning period. It does not replace the official provider calculator
          or your final bill.
        </p>
      </section>

      <section className="mt-10 max-w-4xl space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Official Pricing Sources
        </h2>
        <p className="text-sm leading-7 text-slate-700">
          The pricing model and billing notes for this calculator were checked
          against official provider pages on July 7, 2026. Use these links to
          copy the latest rates for your selected region, product type, account
          agreement, and currency before making a purchase decision.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://aws.amazon.com/elasticloadbalancing/pricing/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[#165A31] px-4 py-3 text-sm font-semibold text-[#165A31] hover:bg-[#f4fbf6]"
          >
            Amazon Elastic Load Balancing Pricing
          </a>
          <a
            href="https://azure.microsoft.com/en-us/pricing/details/application-gateway/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[#165A31] px-4 py-3 text-sm font-semibold text-[#165A31] hover:bg-[#f4fbf6]"
          >
            Azure Application Gateway Pricing
          </a>
          <a
            href="https://cloud.google.com/load-balancing/pricing"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[#165A31] px-4 py-3 text-sm font-semibold text-[#165A31] hover:bg-[#f4fbf6]"
          >
            Google Cloud Load Balancing Pricing
          </a>
          <a
            href="https://www.cloudflare.com/products/load-balancing/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[#165A31] px-4 py-3 text-sm font-semibold text-[#165A31] hover:bg-[#f4fbf6]"
          >
            Cloudflare Load Balancing Pricing
          </a>
        </div>
      </section>

      <section className="mt-10 max-w-4xl space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Common Questions
        </h2>
        <div className="grid gap-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">
              Why are the provider prices blank?
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Load balancer pricing changes by provider, service type, region,
              usage unit, account agreement, currency, and discount. Blank
              price fields make the estimate safer because you can enter the
              current rate for the exact setup you are checking.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">
              Is this the exact monthly bill?
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              No. It is a planning estimate. Final bills can change because of
              tax, support plans, credits, free tiers, minimum charges, retries,
              extra services, traffic routing, logs, security rules, discounts,
              and provider billing updates.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">
              Why does outbound transfer matter?
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Many users check only the load balancer hourly price, but internet
              egress, processed traffic, logs, WAF, and related network services
              can become a meaningful part of the monthly cost.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <BeeijaRelatedTools currentHref="/tools/cloud-load-balancer-cost-comparison-calculator" />
      </section>
    </main>
  );
}

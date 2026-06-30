import Link from "next/link";
import { tools } from "@/app/data/tools";

export const metadata = {
  title: "Sitemap",

  description:
    "Browse all pages, categories, and tools available on Beeija.",

  alternates: {
    canonical: "https://beeija.com/sitemap",
  },
};

const categoryOrder = [
  "AI Cost Calculators",
  "Cloud Cost Calculators",
  "Hosting & Infrastructure Calculators",
  "API & SaaS Cost Calculators",
  "Capacity & Usage Calculators",
  "Technology Comparison Tools",
];

const categoryLinks = [
  {
    title: "AI Cost Calculators",
    href: "/categories/ai-cost-calculators",
  },
  {
    title: "Cloud Cost Calculators",
    href: "/categories/cloud-cost-calculators",
  },
  {
    title: "Hosting & Infrastructure Calculators",
    href: "/categories/hosting-infrastructure-calculators",
  },
  {
    title: "API & SaaS Cost Calculators",
    href: "/categories/api-saas-cost-calculators",
  },
  {
    title: "Capacity & Usage Calculators",
    href: "/categories/capacity-usage-calculators",
  },
  {
    title: "Technology Comparison Tools",
    href: "/categories/technology-comparison-tools",
  },
];

const mainPages = [
  { title: "Home", href: "/" },
  { title: "Tools", href: "/tools" },
  { title: "Categories", href: "/categories" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms", href: "/terms" },
  { title: "Disclaimer", href: "/disclaimer" },
];

export default function SitemapPage() {
  const groupedTools = categoryOrder.map((category) => ({
    category,
    tools: tools.filter((tool) => tool.category === category),
  }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-[var(--dark)]">
          Sitemap
        </h1>

        <p className="mt-4 text-gray-600 leading-relaxed">
          Browse all important pages, categories, and practical tools available
          on Beeija.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">
          Main Pages
        </h2>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-sm">
          {mainPages.map((page, index) => (
            <div key={page.href} className="flex items-center">
              <Link
                href={page.href}
                className="text-gray-700 transition hover:!text-[var(--yellow-dark)]"
              >
                {page.title}
              </Link>

              {index < mainPages.length - 1 && (
                <span className="mx-3 text-gray-300">
                  •
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Categories
        </h2>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-sm">
          {categoryLinks.map((category, index) => (
            <div key={category.href} className="flex items-center">
              <Link
                href={category.href}
                className="text-gray-700 transition hover:!text-[var(--yellow-dark)]"
              >
                {category.title}
              </Link>

              {index < categoryLinks.length - 1 && (
                <span className="mx-3 text-gray-300">
                  •
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Tools
          </h2>

          <p className="text-sm text-gray-500">
            {tools.length} tools across {categoryOrder.length} categories
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {groupedTools.map(({ category, tools: categoryTools }) => (
            <div
              key={category}
              className="rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {category}
                </h3>

                <span className="text-sm text-gray-500">
                  {categoryTools.length}
                </span>
              </div>

			  <div className="mt-4 columns-1 gap-8 sm:columns-2">
			    {categoryTools.map((tool) => (
				  <Link
				    key={tool.href}
				    href={tool.href}
				    className="mb-2 block break-inside-avoid text-[15px] leading-6 text-gray-700 transition hover:!text-[var(--yellow-dark)]"
				  >
				    {tool.title}
				  </Link>
			    ))}
			  </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

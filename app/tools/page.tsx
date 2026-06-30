import { tools } from "@/app/data/tools";
import ToolsClient from "./ToolsClient";

export const metadata = {
  title: "All Tools",

  description:
    "Browse practical calculators and comparison tools for AI costs, cloud pricing, hosting, infrastructure, APIs, SaaS, capacity, usage, and technology planning.",

  alternates: {
    canonical: "https://beeija.com/tools",
  },
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-[var(--dark)]">
          Beeija Tools
        </h1>

        <p className="mt-4 leading-relaxed text-gray-600">
          Search practical calculators and comparison tools by name, keyword,
          or category. Find tools for AI costs, cloud pricing, hosting,
          infrastructure, APIs, SaaS, capacity, usage, and technical planning
          without digging through a long list.
        </p>
      </div>

      <ToolsClient tools={tools} />
    </div>
  );
}

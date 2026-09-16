import type { Metadata } from "next";

import { tools } from "@/app/data/tools";
import ToolsClient from "./ToolsClient";

export const metadata: Metadata = {
  title: "AI & Cloud Cost Calculators",

  description:
    "Browse Beeija calculators for AI usage, model pricing, cloud compute, storage, bandwidth, databases, serverless services, and related cost planning.",

  alternates: {
    canonical: "https://beeija.com/tools",
  },
};

export default function ToolsPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--dark)]">
            AI and Cloud Cost Calculators
          </h1>

          <p className="mt-4 leading-relaxed text-gray-600">
            Browse {tools.length} practical calculators for AI usage and cloud
            infrastructure costs. Search by tool name, keyword, or category to
            find the calculator that matches the cost you want to estimate.
          </p>
        </div>

        <ToolsClient tools={tools} />
      </div>
    </main>
  );
}

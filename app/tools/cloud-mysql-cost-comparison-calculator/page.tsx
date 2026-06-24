import type { Metadata } from "next";
import ToolClient from "./ToolClient";

const canonicalUrl =
  "https://beeija.com/tools/cloud-mysql-cost-comparison-calculator";

const faqItems = [
  {
    question: "Does this calculator show the final cloud bill?",
    answer:
      "No. It creates a planning estimate from the workload and pricing values entered. Taxes, support plans, private networking, monitoring, free credits, contract pricing, and other services can change the final bill.",
  },
  {
    question: "Are the reference database configurations exactly equal?",
    answer:
      "No. The reference configurations have the same listed vCPU and memory amounts, but processor type, storage behavior, performance, maintenance, and managed features differ. Test your real workload before choosing a provider.",
  },
  {
    question: "How does the calculator estimate high availability?",
    answer:
      "High availability adds one standby database copy. The calculator therefore doubles compute and database storage before adding any read replicas.",
  },
  {
    question: "How are read replicas priced?",
    answer:
      "Each read replica adds another database compute and storage copy. The calculator uses the same selected reference size for every replica.",
  },
  {
    question: "How is backup storage estimated?",
    answer:
      "The AWS and Azure defaults include backup usage up to the primary database storage amount. Google Cloud backup usage is charged from the first GiB in the default estimate. Every backup rate remains editable.",
  },
  {
    question: "Can committed-use or reserved pricing be compared?",
    answer:
      "Yes. Enter each provider's effective compute discount percentage. The discount applies only to compute because storage, backup, I/O, networking, and other charges are normally billed separately.",
  },
];

export const metadata: Metadata = {
  title: "Cloud MySQL Cost Comparison Calculator | Beeija",
  description:
    "Compare estimated MySQL costs across Amazon RDS, Azure Database for MySQL, and Google Cloud SQL, including HA, replicas, storage, backups, I/O, and discounts.",
  keywords: [
    "cloud mysql cost comparison calculator",
    "mysql cloud pricing calculator",
    "managed mysql cost comparison",
    "amazon rds mysql cost calculator",
    "azure database for mysql pricing calculator",
    "google cloud sql mysql cost calculator",
    "aws vs azure vs google cloud mysql pricing",
    "cloud database cost calculator",
  ],
  alternates: {
    canonical: canonicalUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Cloud MySQL Cost Comparison Calculator",
    description:
      "Estimate and compare managed MySQL costs across AWS, Azure, and Google Cloud using editable pricing and workload inputs.",
    url: canonicalUrl,
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cloud MySQL Cost Comparison Calculator",
    description:
      "Compare Amazon RDS for MySQL, Azure Database for MySQL Flexible Server, and Google Cloud SQL for MySQL.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Cloud MySQL Cost Comparison Calculator",
      url: canonicalUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      description:
        "A browser-based calculator for comparing estimated managed MySQL costs across Amazon Web Services, Microsoft Azure, and Google Cloud.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      provider: {
        "@type": "Organization",
        name: "Beeija",
        url: "https://beeija.com",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function CloudMySQLCostComparisonCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ToolClient />
    </>
  );
}

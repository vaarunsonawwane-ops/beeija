import type { MetadataRoute } from "next";
import { tools } from "@/app/data/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://beeija.com";
  

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
	
	{
	  url: `${baseUrl}/resources`,
	  changeFrequency: "monthly",
	  priority: 0.7,
	},
	{
	  url: `${baseUrl}/how-beeija-tools-are-built`,
	  changeFrequency: "monthly",
	  priority: 0.7,
	},
	
	
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/sitemap`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = [
    "ai-cost-calculators",
    "cloud-cost-calculators",
  ].map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}

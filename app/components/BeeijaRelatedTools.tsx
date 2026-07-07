import Link from "next/link";
import {
  getCategoryHref,
  getRelatedTools,
  getToolByHref,
  type BeeijaTool,
} from "@/app/data/tools";

type BeeijaRelatedToolsProps = {
  currentHref: BeeijaTool["href"];
  limit?: number;
  title?: string;
  showTitle?: boolean;
  className?: string;
};

function getRelatedToolsTitle(category: string) {
  const shortCategory = category.replace(/\s+Calculators$/, "");

  return `Explore Related ${shortCategory} Tools`;
}

export default function BeeijaRelatedTools({
  currentHref,
  limit = 6,
  title,
  showTitle = false,
  className = "",
}: BeeijaRelatedToolsProps) {
  const currentTool = getToolByHref(currentHref);

  if (!currentTool) {
    return null;
  }

  const relatedTools = getRelatedTools(
    currentHref,
    currentTool.category,
    limit,
  );

  const categoryHref = getCategoryHref(currentTool.category);
  const heading = title ?? getRelatedToolsTitle(currentTool.category);

  return (
    <section className={className}>
      {showTitle ? (
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-950">
          {heading}
        </h2>
      ) : null}

      <nav
        aria-label={`Related tools in ${currentTool.category}`}
        className="flex flex-wrap gap-3"
      >
        {relatedTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="beeija-btn-outline"
          >
            {tool.title}
          </Link>
        ))}

        <Link href={categoryHref} className="beeija-btn-outline">
          {currentTool.category}
        </Link>
      </nav>
    </section>
  );
}

export function BeeijaRelatedToolsSection(
  props: Omit<BeeijaRelatedToolsProps, "showTitle">,
) {
  return <BeeijaRelatedTools {...props} showTitle />;
}

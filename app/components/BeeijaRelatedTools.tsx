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
  className?: string;
};

export default function BeeijaRelatedTools({
  currentHref,
  limit = 6,
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

  return (
    <nav
      aria-label={`Related tools in ${currentTool.category}`}
      className={`flex flex-wrap gap-3 ${className}`}
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

      <Link
        href={categoryHref}
        className="beeija-btn-outline"
      >
        {currentTool.category}
      </Link>
    </nav>
  );
}

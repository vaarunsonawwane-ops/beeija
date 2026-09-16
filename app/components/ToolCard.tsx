import Link from "next/link";

type ToolCardProps = {
  name: string;
  description: string;
  href: string;
  category?: string;
  headingLevel?: "h2" | "h3";
};

export default function ToolCard({
  name,
  description,
  href,
  category,
  headingLevel = "h3",
}: ToolCardProps) {
  const Heading = headingLevel;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2"
    >
      {category ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--yellow-dark)]">
          {category}
        </p>
      ) : null}

      <Heading className="mt-2 text-lg font-semibold text-gray-950 transition-colors duration-200 group-hover:text-[var(--green)] group-focus-visible:text-[var(--green)]">
        {name}
      </Heading>

      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        {description}
      </p>

      <p className="mt-auto pt-5 text-sm font-medium text-[var(--green)]">
        Open tool →
      </p>
    </Link>
  );
}

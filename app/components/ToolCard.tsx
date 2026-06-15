import Link from "next/link";

type ToolCardProps = {
  name: string;
  description: string;
  href: string;
  category?: string;
};

export default function ToolCard({
  name,
  description,
  href,
  category,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      {category ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--yellow-dark)]">
          {category}
        </p>
      ) : null}

      <h3 className="mt-2 text-lg font-semibold text-gray-950 transition-colors duration-200 group-hover:text-[var(--green)]">
        {name}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        {description}
      </p>

      <p className="mt-5 text-sm font-medium text-[var(--green)]">
        Open tool →
      </p>
    </Link>
  );
}

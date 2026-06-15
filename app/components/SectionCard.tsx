import type { ReactNode } from "react";

type SectionCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function SectionCard({
  title,
  description,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 ${className}`}
    >
      {title || description ? (
        <div className="max-w-3xl">
          {title ? (
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950 md:text-3xl">
              {title}
            </h2>
          ) : null}

          {description ? (
            <p className="mt-3 leading-relaxed text-gray-600">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className={title || description ? "mt-6" : ""}>
        {children}
      </div>
    </section>
  );
}

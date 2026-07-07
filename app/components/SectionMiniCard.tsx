import type { ReactNode } from "react";

type SectionMiniCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function SectionMiniCard({
  title,
  children,
  className = "",
}: SectionMiniCardProps) {
  return (
    <article
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}
    >
      <h3 className="text-base font-semibold text-gray-950">
        {title}
      </h3>

      <div className="mt-2 text-base leading-7 text-gray-600">
        {children}
      </div>
    </article>
  );
}

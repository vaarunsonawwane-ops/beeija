import type { ReactNode } from "react";

type ToolContentSection = {
  title: string;
  content: ReactNode;
};

type ToolContentProps = {
  intro?: ReactNode;
  sections: ToolContentSection[];
  className?: string;
};

export default function ToolContent({
  intro,
  sections,
  className = "",
}: ToolContentProps) {
  return (
    <div className={`space-y-10 ${className}`}>
      {intro ? (
        <div className="max-w-4xl text-base leading-8 text-gray-600">
          {intro}
        </div>
      ) : null}

      {sections.map((section) => (
        <section key={section.title} className="max-w-4xl">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-950 md:text-3xl">
            {section.title}
          </h2>

          <div className="mt-4 space-y-4 text-base leading-8 text-gray-600">
            {section.content}
          </div>
        </section>
      ))}
    </div>
  );
}

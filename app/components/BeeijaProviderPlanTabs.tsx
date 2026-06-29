type BeeijaPlanTab = {
  id: string;
  label: string;
  title: string;
  subtitle?: string;
};

type BeeijaProviderPlanTabsProps = {
  plans: BeeijaPlanTab[];
  activePlanId: string;
  onChange: (planId: string) => void;
  ariaLabel: string;
};

export default function BeeijaProviderPlanTabs({
  plans,
  activePlanId,
  onChange,
  ariaLabel,
}: BeeijaProviderPlanTabsProps) {
  const gridClass =
    plans.length >= 4
      ? "grid-cols-2 xl:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-3";

  return (
    <div
      className={`grid gap-2 ${gridClass}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {plans.map((plan) => {
        const isActive = plan.id === activePlanId;

        return (
          <button
            key={plan.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(plan.id)}
            className={`min-w-0 rounded-xl border px-4 py-3 text-left transition ${
              isActive
                ? "border-[var(--green)] bg-[#F5FAF7] shadow-sm"
                : "border-gray-200 bg-white hover:border-[var(--green)]"
            }`}
          >
            <span className="block text-xs font-medium uppercase tracking-wide text-[var(--yellow-dark)]">
              {plan.label}
            </span>

            <span className="mt-1 block break-words font-semibold text-gray-950 [overflow-wrap:anywhere]">
              {plan.title}
            </span>

            {plan.subtitle ? (
              <span className="mt-1 block break-words text-xs text-gray-500 [overflow-wrap:anywhere]">
                {plan.subtitle}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

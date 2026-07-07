type BeeijaPricingSource = {
  label: string;
  href: string;
};

type BeeijaOfficialPricingSourcesProps = {
  checkedDate: string;
  sources: BeeijaPricingSource[];
  description?: string;
  className?: string;
};

export default function BeeijaOfficialPricingSources({
  checkedDate,
  sources,
  description,
  className = "",
}: BeeijaOfficialPricingSourcesProps) {
  return (
    <section className={`beeija-section space-y-5 ${className}`}>
      <h2 className="beeija-section-title">Official Pricing Sources</h2>

      <p className="beeija-copy">
        {description ??
          "The pricing model and billing notes for this calculator were checked against official provider pages."}{" "}
        Pricing checked: <strong>{checkedDate}</strong>. Use these links to
        copy the latest rates for your selected region, product type, account
        agreement, and currency before making a purchase decision.
      </p>

      <div className="flex flex-wrap gap-3">
        {sources.map((source) => (
          <a
            key={source.href}
            href={source.href}
            target="_blank"
            rel="noreferrer"
            className="beeija-btn-outline"
          >
            {source.label}
          </a>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";

type ProviderId = "aws" | "azure" | "google" | "cloudflare";

type Provider = {
  id: ProviderId;
  name: string;
  shortName: string;
  exampleService: string;
  note: string;
};

type RateFields = {
  loadBalancerHourly: string;
  capacityUnitHourly: string;
  dataProcessingPerGb: string;
  forwardingRuleHourly: string;
  outboundTransferPerGb: string;
  wafMonthly: string;
  loggingMonthly: string;
  migrationOneTime: string;
};

type UsageFields = {
  monthlyHours: string;
  capacityUnits: string;
  processedGb: string;
  outboundGb: string;
  forwardingRules: string;
  migrationMonths: string;
};

const PROVIDERS: Provider[] = [
  {
    id: "aws",
    name: "Amazon Web Services",
    shortName: "AWS",
    exampleService: "Application Load Balancer",
    note: "Good for ALB-style planning with hourly, capacity unit, processed data, WAF, logging, and transfer inputs.",
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    shortName: "Azure",
    exampleService: "Application Gateway",
    note: "Good for Application Gateway-style planning with provisioned time, capacity, data processing, and extra services.",
  },
  {
    id: "google",
    name: "Google Cloud",
    shortName: "Google",
    exampleService: "External Application Load Balancer",
    note: "Good for Google Cloud planning with forwarding rules, processed data, outbound transfer, and regional assumptions.",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    shortName: "Cloudflare",
    exampleService: "Load Balancing",
    note: "Good when load balancing is bundled with account, traffic steering, health checks, or plan-level pricing.",
  },
];

const emptyRates: RateFields = {
  loadBalancerHourly: "",
  capacityUnitHourly: "",
  dataProcessingPerGb: "",
  forwardingRuleHourly: "",
  outboundTransferPerGb: "",
  wafMonthly: "",
  loggingMonthly: "",
  migrationOneTime: "",
};

const defaultUsage: UsageFields = {
  monthlyHours: "730",
  capacityUnits: "1",
  processedGb: "1000",
  outboundGb: "500",
  forwardingRules: "1",
  migrationMonths: "12",
};

const MAX_INPUT_LENGTH = 12;
const MAX_NUMBER = 999_999_999_999;

function cleanNumberInput(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  const normalized =
    parts.length > 1 ? `${parts[0]}.${parts.slice(1).join("")}` : parts[0];

  return normalized.slice(0, MAX_INPUT_LENGTH);
}

function parseNumber(value: string) {
  if (!value.trim()) return 0;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.min(parsed, MAX_NUMBER);
}

function hasInputWarning(value: string) {
  return Number(value) > MAX_NUMBER || value.length >= MAX_INPUT_LENGTH;
}

function formatCompactNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  if (value >= 999_000_000_000_000) return "999T+";

  return new Intl.NumberFormat("en-US", {
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1_000_000 ? 2 : 2,
  }).format(value);
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return "$0.00";
  if (value >= 999_000_000_000_000) return "Over $999T";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1_000_000 ? 2 : 2,
  }).format(value);
}

function safeDivide(value: number, divisor: number) {
  if (!divisor) return 0;
  return value / divisor;
}

type CostBreakdown = {
  provider: Provider;
  hourlyBase: number;
  capacity: number;
  dataProcessing: number;
  forwardingRules: number;
  outboundTransfer: number;
  waf: number;
  logging: number;
  migrationMonthly: number;
  total: number;
};

function calculateCost(
  provider: Provider,
  rates: RateFields,
  usage: UsageFields,
): CostBreakdown {
  const hours = parseNumber(usage.monthlyHours);
  const units = parseNumber(usage.capacityUnits);
  const processedGb = parseNumber(usage.processedGb);
  const outboundGb = parseNumber(usage.outboundGb);
  const rules = parseNumber(usage.forwardingRules);
  const migrationMonths = Math.max(parseNumber(usage.migrationMonths), 1);

  const hourlyBase = hours * parseNumber(rates.loadBalancerHourly);
  const capacity = hours * units * parseNumber(rates.capacityUnitHourly);
  const dataProcessing = processedGb * parseNumber(rates.dataProcessingPerGb);
  const forwardingRules = hours * rules * parseNumber(rates.forwardingRuleHourly);
  const outboundTransfer = outboundGb * parseNumber(rates.outboundTransferPerGb);
  const waf = parseNumber(rates.wafMonthly);
  const logging = parseNumber(rates.loggingMonthly);
  const migrationMonthly = safeDivide(
    parseNumber(rates.migrationOneTime),
    migrationMonths,
  );

  return {
    provider,
    hourlyBase,
    capacity,
    dataProcessing,
    forwardingRules,
    outboundTransfer,
    waf,
    logging,
    migrationMonthly,
    total:
      hourlyBase +
      capacity +
      dataProcessing +
      forwardingRules +
      outboundTransfer +
      waf +
      logging +
      migrationMonthly,
  };
}

type NumberInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  prefix?: string;
  suffix?: string;
};

function NumberInput({
  label,
  value,
  onChange,
  helper,
  prefix,
  suffix,
}: NumberInputProps) {
  const warning = hasInputWarning(value);

  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-xs font-medium text-slate-700">
        {label}
      </span>
      <span
        className={`flex min-w-0 items-center rounded-md border bg-white px-2 ${
          warning ? "border-amber-500" : "border-slate-300"
        }`}
      >
        {prefix ? (
          <span className="shrink-0 text-xs text-slate-500">{prefix}</span>
        ) : null}
        <input
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(cleanNumberInput(event.target.value))}
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-slate-900 outline-none"
          placeholder="0"
          aria-label={label}
        />
        {suffix ? (
          <span className="shrink-0 text-xs text-slate-500">{suffix}</span>
        ) : null}
      </span>
      <span className="mt-1 block text-[11px] leading-4 text-slate-500">
        {warning
          ? "Use a smaller planning value or split the workload into parts."
          : helper}
      </span>
    </label>
  );
}

function ResultLine({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-md bg-white px-3 py-2">
      <span
        className={`min-w-0 text-sm leading-5 ${
          muted ? "text-slate-500" : "text-slate-700"
        }`}
      >
        {label}
      </span>
      <span className="max-w-[9rem] truncate text-right text-sm font-semibold tabular-nums text-slate-900 sm:max-w-[12rem]">
        {value}
      </span>
    </div>
  );
}

function ProviderCard({
  provider,
  selected,
  onSelect,
}: {
  provider: Provider;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`min-w-0 rounded-lg border p-3 text-left transition ${
        selected
          ? "border-[#165A31] bg-[#f4fbf6] shadow-sm"
          : "border-slate-200 bg-white hover:border-[#165A31]"
      }`}
    >
      <span className="block truncate text-sm font-semibold text-slate-900">
        {provider.name}
      </span>
      <span className="mt-1 block text-xs leading-5 text-slate-600">
        {provider.exampleService}
      </span>
    </button>
  );
}

export default function ToolClient() {
  const [activeProviderId, setActiveProviderId] = useState<ProviderId>("aws");
  const [ratesByProvider, setRatesByProvider] = useState<
    Record<ProviderId, RateFields>
  >({
    aws: { ...emptyRates },
    azure: { ...emptyRates },
    google: { ...emptyRates },
    cloudflare: { ...emptyRates },
  });
  const [usage, setUsage] = useState<UsageFields>(defaultUsage);

  const activeProvider =
    PROVIDERS.find((provider) => provider.id === activeProviderId) ??
    PROVIDERS[0];

  const activeRates = ratesByProvider[activeProvider.id];

  const results = useMemo(
    () =>
      PROVIDERS.map((provider) =>
        calculateCost(provider, ratesByProvider[provider.id], usage),
      ).sort((a, b) => a.total - b.total),
    [ratesByProvider, usage],
  );

  const activeResult = useMemo(
    () => calculateCost(activeProvider, activeRates, usage),
    [activeProvider, activeRates, usage],
  );

  const updateRate = (field: keyof RateFields, value: string) => {
    setRatesByProvider((current) => ({
      ...current,
      [activeProvider.id]: {
        ...current[activeProvider.id],
        [field]: value,
      },
    }));
  };

  const updateUsage = (field: keyof UsageFields, value: string) => {
    setUsage((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetRates = () => {
    setRatesByProvider((current) => ({
      ...current,
      [activeProvider.id]: { ...emptyRates },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#165A31]">
              Configure workload
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              Select provider and enter current prices
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Load balancer pricing depends on the provider, region, product
              type, traffic, rules, and account discounts. Beeija keeps rates
              editable so you can copy the current numbers from official
              pricing pages before planning a monthly estimate.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {PROVIDERS.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                selected={provider.id === activeProvider.id}
                onSelect={() => setActiveProviderId(provider.id)}
              />
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-[#d7eadf] bg-[#f8fcfa] p-4">
            <h3 className="text-base font-semibold text-slate-950">
              {activeProvider.name}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {activeProvider.note}
            </p>
          </div>

          <div className="mt-5">
            <h3 className="text-base font-semibold text-slate-950">
              Shared workload assumptions
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <NumberInput
                label="Monthly running hours"
                value={usage.monthlyHours}
                onChange={(value) => updateUsage("monthlyHours", value)}
                helper="Use 730 for a full month."
                suffix="hours"
              />
              <NumberInput
                label="Average capacity units"
                value={usage.capacityUnits}
                onChange={(value) => updateUsage("capacityUnits", value)}
                helper="Use LCU, capacity unit, or similar provider unit."
                suffix="units"
              />
              <NumberInput
                label="Processed data"
                value={usage.processedGb}
                onChange={(value) => updateUsage("processedGb", value)}
                helper="Traffic processed by the load balancer."
                suffix="GB"
              />
              <NumberInput
                label="Outbound transfer"
                value={usage.outboundGb}
                onChange={(value) => updateUsage("outboundGb", value)}
                helper="Internet egress or billable outbound transfer."
                suffix="GB"
              />
              <NumberInput
                label="Forwarding rules"
                value={usage.forwardingRules}
                onChange={(value) => updateUsage("forwardingRules", value)}
                helper="Use 0 if your provider does not bill this separately."
                suffix="rules"
              />
              <NumberInput
                label="Spread one-time cost over"
                value={usage.migrationMonths}
                onChange={(value) => updateUsage("migrationMonths", value)}
                helper="Used for setup or migration planning."
                suffix="months"
              />
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-950">
                  {activeProvider.name}
                </h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  {activeProvider.exampleService}
                </p>
              </div>
              <button
                type="button"
                onClick={resetRates}
                className="rounded-lg border border-[#165A31] bg-white px-4 py-2 text-sm font-semibold text-[#165A31] transition hover:-translate-y-0.5 hover:bg-[#f4fbf6] hover:shadow-sm"
              >
                Reset rates
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <NumberInput
                label="Load balancer hourly price"
                value={activeRates.loadBalancerHourly}
                onChange={(value) => updateRate("loadBalancerHourly", value)}
                helper="Base hourly or provisioned time price."
                prefix="$"
                suffix="/hour"
              />
              <NumberInput
                label="Capacity unit hourly price"
                value={activeRates.capacityUnitHourly}
                onChange={(value) => updateRate("capacityUnitHourly", value)}
                helper="LCU, capacity unit, or equivalent."
                prefix="$"
                suffix="/unit-hour"
              />
              <NumberInput
                label="Data processing price"
                value={activeRates.dataProcessingPerGb}
                onChange={(value) => updateRate("dataProcessingPerGb", value)}
                helper="Set 0 if included in your plan."
                prefix="$"
                suffix="/GB"
              />
              <NumberInput
                label="Forwarding rule hourly price"
                value={activeRates.forwardingRuleHourly}
                onChange={(value) => updateRate("forwardingRuleHourly", value)}
                helper="Mostly useful for Google-style pricing."
                prefix="$"
                suffix="/rule-hour"
              />
              <NumberInput
                label="Outbound transfer price"
                value={activeRates.outboundTransferPerGb}
                onChange={(value) => updateRate("outboundTransferPerGb", value)}
                helper="Internet egress, if billed separately."
                prefix="$"
                suffix="/GB"
              />
              <NumberInput
                label="WAF monthly cost"
                value={activeRates.wafMonthly}
                onChange={(value) => updateRate("wafMonthly", value)}
                helper="Add WAF, rules, or managed security cost."
                prefix="$"
                suffix="/month"
              />
              <NumberInput
                label="Logging and monitoring"
                value={activeRates.loggingMonthly}
                onChange={(value) => updateRate("loggingMonthly", value)}
                helper="Access logs, metrics, storage, and alerting."
                prefix="$"
                suffix="/month"
              />
              <NumberInput
                label="Setup or migration cost"
                value={activeRates.migrationOneTime}
                onChange={(value) => updateRate("migrationOneTime", value)}
                helper="Optional one-time cost spread across months."
                prefix="$"
              />
            </div>
          </div>
        </section>

        <aside className="min-w-0 space-y-4">
          <section className="min-w-0 rounded-lg border border-slate-200 bg-[#f8fcfa] p-4 shadow-sm sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#165A31]">
              Estimate summary
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">
              {activeProvider.shortName} monthly planning cost
            </h2>
            <div className="mt-4 rounded-lg border border-[#d7eadf] bg-white p-4">
              <p className="text-sm text-slate-500">Estimated monthly cost</p>
              <p className="mt-2 truncate text-3xl font-semibold tracking-tight text-[#165A31]">
                {formatCurrency(activeResult.total)}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                This is a planning estimate before tax, discounts, free tier,
                support plans, currency conversion, account agreements, and
                provider-specific billing rules.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <ResultLine
                label="Base load balancer runtime"
                value={formatCurrency(activeResult.hourlyBase)}
              />
              <ResultLine
                label="Capacity or LCU usage"
                value={formatCurrency(activeResult.capacity)}
              />
              <ResultLine
                label="Data processing"
                value={formatCurrency(activeResult.dataProcessing)}
              />
              <ResultLine
                label="Forwarding rules"
                value={formatCurrency(activeResult.forwardingRules)}
              />
              <ResultLine
                label="Outbound transfer"
                value={formatCurrency(activeResult.outboundTransfer)}
              />
              <ResultLine
                label="WAF, logging, and setup"
                value={formatCurrency(
                  activeResult.waf +
                    activeResult.logging +
                    activeResult.migrationMonthly,
                )}
              />
            </div>
          </section>

          <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Provider comparison
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Enter rates for each provider, then compare totals using the same
              workload assumptions.
            </p>
            <div className="mt-4 space-y-2">
              {results.map((result) => (
                <button
                  key={result.provider.id}
                  type="button"
                  onClick={() => setActiveProviderId(result.provider.id)}
                  className={`grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border px-3 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                    result.provider.id === activeProvider.id
                      ? "border-[#165A31] bg-[#f4fbf6]"
                      : "border-slate-200 bg-white hover:border-[#165A31]"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-900">
                      {result.provider.name}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {result.provider.exampleService}
                    </span>
                  </span>
                  <span className="max-w-[7rem] truncate text-right text-sm font-semibold tabular-nums text-slate-950 sm:max-w-[10rem]">
                    {formatCurrency(result.total)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <details className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <summary className="cursor-pointer text-base font-semibold text-slate-950">
              Calculation details
            </summary>
            <div className="mt-4 space-y-2">
              <ResultLine
                label="Monthly hours"
                value={formatCompactNumber(parseNumber(usage.monthlyHours))}
                muted
              />
              <ResultLine
                label="Capacity units"
                value={formatCompactNumber(parseNumber(usage.capacityUnits))}
                muted
              />
              <ResultLine
                label="Processed data"
                value={`${formatCompactNumber(parseNumber(usage.processedGb))} GB`}
                muted
              />
              <ResultLine
                label="Outbound transfer"
                value={`${formatCompactNumber(parseNumber(usage.outboundGb))} GB`}
                muted
              />
              <ResultLine
                label="One-time setup spread"
                value={`${formatCompactNumber(
                  Math.max(parseNumber(usage.migrationMonths), 1),
                )} months`}
                muted
              />
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Beeija keeps these details compact so very large test values do
              not break the page. For real planning, split unusually large
              traffic across services, regions, or environments and verify the
              result in the provider calculator before purchase.
            </p>
          </details>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <strong>* Important:</strong> Current load balancer prices can vary
            by region, product type, account agreement, tax, discounts, and
            traffic pattern. Use this result as a planning estimate, not a final
            bill or official quote.
          </div>
        </aside>
      </div>
    </div>
  );
}

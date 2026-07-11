"use client";

import { useMemo, useState } from "react";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaResultLine from "@/app/components/BeeijaResultLine";
import BeeijaAdvancedSection from "@/app/components/BeeijaAdvancedSection";
import {
  formatBeeijaCurrency,
  formatBeeijaNumber,
  parseBeeijaNumber,
} from "@/app/components/BeeijaFormat";

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
  const hours = parseBeeijaNumber(usage.monthlyHours);
  const units = parseBeeijaNumber(usage.capacityUnits);
  const processedGb = parseBeeijaNumber(usage.processedGb);
  const outboundGb = parseBeeijaNumber(usage.outboundGb);
  const rules = parseBeeijaNumber(usage.forwardingRules);
  const migrationMonths = Math.max(parseBeeijaNumber(usage.migrationMonths), 1);

  const hourlyBase = hours * parseBeeijaNumber(rates.loadBalancerHourly);
  const capacity = hours * units * parseBeeijaNumber(rates.capacityUnitHourly);
  const dataProcessing = processedGb * parseBeeijaNumber(rates.dataProcessingPerGb);
  const forwardingRules = hours * rules * parseBeeijaNumber(rates.forwardingRuleHourly);
  const outboundTransfer = outboundGb * parseBeeijaNumber(rates.outboundTransferPerGb);
  const waf = parseBeeijaNumber(rates.wafMonthly);
  const logging = parseBeeijaNumber(rates.loggingMonthly);
  const migrationMonthly = safeDivide(
    parseBeeijaNumber(rates.migrationOneTime),
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
  return (
    <BeeijaNumberField
      label={label}
      value={value}
      onChange={onChange}
      helper={helper}
      prefix={prefix}
      suffix={suffix}
      sanitizeDecimal
    />
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
      <span className="block truncate text-base font-semibold text-slate-900">
        {provider.name}
      </span>
      <span className="mt-1 block text-sm leading-5 text-slate-600">
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
            <p className="text-sm font-semibold uppercase tracking-wide text-[#165A31]">
              Configure workload
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              Select provider and enter current prices
            </h2>
            <p className="mt-2 text-base leading-7 text-slate-600">
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
                helper="LCU or equivalent provider units."
                suffix="units"
              />
              <NumberInput
                label="Processed data"
                value={usage.processedGb}
                onChange={(value) => updateUsage("processedGb", value)}
                helper="Processed load balancer traffic."
                suffix="GB"
              />
            </div>

            <div className="mt-4">
              <BeeijaAdvancedSection
                title="Optional traffic and setup assumptions"
                description="Use these only when outbound transfer, forwarding rules, or setup costs are part of your estimate."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <NumberInput
                    label="Outbound transfer"
                    value={usage.outboundGb}
                    onChange={(value) => updateUsage("outboundGb", value)}
                    helper="Billable outbound transfer."
                    suffix="GB"
                  />
                  <NumberInput
                    label="Forwarding rules"
                    value={usage.forwardingRules}
                    onChange={(value) => updateUsage("forwardingRules", value)}
                    helper="Use 0 when not billed separately."
                    suffix="rules"
                  />
                  <NumberInput
                    label="Spread one-time cost over"
                    value={usage.migrationMonths}
                    onChange={(value) => updateUsage("migrationMonths", value)}
                    helper="Months used to spread setup cost."
                    suffix="months"
                  />
                </div>
              </BeeijaAdvancedSection>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-950">
                  {activeProvider.shortName} price inputs
                </h3>
              </div>
              <button
                type="button"
                onClick={resetRates}
                className="beeija-btn-outline"
              >
                Reset rates
              </button>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {activeProvider.note}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <NumberInput
                label="Load balancer hourly price"
                value={activeRates.loadBalancerHourly}
                onChange={(value) => updateRate("loadBalancerHourly", value)}
                helper="Base hourly load balancer price."
                prefix="$"
                suffix="/hour"
              />
              <NumberInput
                label="Capacity unit hourly price"
                value={activeRates.capacityUnitHourly}
                onChange={(value) => updateRate("capacityUnitHourly", value)}
                helper="LCU or equivalent provider unit."
                prefix="$"
                suffix="/unit-hour"
              />
              <NumberInput
                label="Data processing price"
                value={activeRates.dataProcessingPerGb}
                onChange={(value) => updateRate("dataProcessingPerGb", value)}
                helper="Use 0 when included."
                prefix="$"
                suffix="/GB"
              />
            </div>

            <div className="mt-4">
              <BeeijaAdvancedSection
                title="Optional provider rates"
                description="Open this only when the provider bills forwarding rules, outbound transfer, WAF, logging, or setup separately."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <NumberInput
                    label="Forwarding rule hourly price"
                    value={activeRates.forwardingRuleHourly}
                    onChange={(value) => updateRate("forwardingRuleHourly", value)}
                    helper="Mainly for Google-style pricing."
                    prefix="$"
                    suffix="/rule-hour"
                  />
                  <NumberInput
                    label="Outbound transfer price"
                    value={activeRates.outboundTransferPerGb}
                    onChange={(value) => updateRate("outboundTransferPerGb", value)}
                    helper="Billable internet egress."
                    prefix="$"
                    suffix="/GB"
                  />
                  <NumberInput
                    label="WAF monthly cost"
                    value={activeRates.wafMonthly}
                    onChange={(value) => updateRate("wafMonthly", value)}
                    helper="Monthly WAF or security cost."
                    prefix="$"
                    suffix="/month"
                  />
                  <NumberInput
                    label="Logging and monitoring"
                    value={activeRates.loggingMonthly}
                    onChange={(value) => updateRate("loggingMonthly", value)}
                    helper="Monthly logging and monitoring cost."
                    prefix="$"
                    suffix="/month"
                  />
                  <NumberInput
                    label="Setup or migration cost"
                    value={activeRates.migrationOneTime}
                    onChange={(value) => updateRate("migrationOneTime", value)}
                    helper="One-time cost spread across months."
                    prefix="$"
                  />
                </div>
              </BeeijaAdvancedSection>
            </div>
          </div>
        </section>

        <aside className="min-w-0 space-y-4">
          <section className="min-w-0 rounded-lg border border-slate-200 bg-[#f8fcfa] p-4 shadow-sm sm:p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#165A31]">
              Estimate summary
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {activeProvider.shortName} monthly planning cost
            </h2>
            <div className="mt-4 rounded-lg border border-[#d7eadf] bg-white p-4">
              <p className="text-base text-slate-500">Estimated monthly cost</p>
              <p className="mt-2 truncate text-3xl font-semibold tracking-tight text-[#165A31]">
                {formatBeeijaCurrency(activeResult.total)}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This is a planning estimate before tax, discounts, free tier,
                support plans, currency conversion, account agreements, and
                provider-specific billing rules.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <BeeijaResultLine
                label="Base load balancer runtime"
                value={formatBeeijaCurrency(activeResult.hourlyBase)}
              />
              <BeeijaResultLine
                label="Capacity or LCU usage"
                value={formatBeeijaCurrency(activeResult.capacity)}
              />
              <BeeijaResultLine
                label="Data processing"
                value={formatBeeijaCurrency(activeResult.dataProcessing)}
              />
              <BeeijaResultLine
                label="Forwarding rules"
                value={formatBeeijaCurrency(activeResult.forwardingRules)}
              />
              <BeeijaResultLine
                label="Outbound transfer"
                value={formatBeeijaCurrency(activeResult.outboundTransfer)}
              />
              <BeeijaResultLine
                label="WAF, logging, and setup"
                value={formatBeeijaCurrency(
                  activeResult.waf +
                    activeResult.logging +
                    activeResult.migrationMonthly,
                )}
              />
            </div>
          </section>

          <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-xl font-semibold text-slate-950">
              Provider comparison
            </h2>
            <p className="mt-1 text-base leading-7 text-slate-600">
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
                    <span className="block truncate text-base font-semibold text-slate-900">
                      {result.provider.name}
                    </span>
                    <span className="block truncate text-sm text-slate-500">
                      {result.provider.exampleService}
                    </span>
                  </span>
                  <span className="max-w-[7rem] truncate text-right text-base font-semibold tabular-nums text-slate-950 sm:max-w-[10rem]">
                    {formatBeeijaCurrency(result.total)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <BeeijaAdvancedSection title="Calculation details" variant="card">
            <div className="space-y-2">
              <BeeijaResultLine
                label="Monthly hours"
                value={formatBeeijaNumber(parseBeeijaNumber(usage.monthlyHours))}
                muted
              />
              <BeeijaResultLine
                label="Capacity units"
                value={formatBeeijaNumber(parseBeeijaNumber(usage.capacityUnits))}
                muted
              />
              <BeeijaResultLine
                label="Processed data"
                value={`${formatBeeijaNumber(parseBeeijaNumber(usage.processedGb))} GB`}
                muted
              />
              <BeeijaResultLine
                label="Outbound transfer"
                value={`${formatBeeijaNumber(parseBeeijaNumber(usage.outboundGb))} GB`}
                muted
              />
              <BeeijaResultLine
                label="One-time setup spread"
                value={`${formatBeeijaNumber(
                  Math.max(parseBeeijaNumber(usage.migrationMonths), 1),
                )} months`}
                muted
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Beeija keeps these details compact so very large test values do
              not break the page. For real planning, split unusually large
              traffic across services, regions, or environments and verify the
              result in the provider calculator before purchase.
            </p>
          </BeeijaAdvancedSection>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-base leading-7 text-amber-900">
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

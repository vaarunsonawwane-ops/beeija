"use client";

import {
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";

type ProviderKey = "aws" | "azure" | "gcp";
type DeploymentMode = "single" | "ha";

type Workload = {
  hoursPerMonth: number;
  primaryStorageGb: number;
  backupStorageGb: number;
  monthlyIoMillion: number;
  monthlyEgressGb: number;
  readReplicas: number;
  deploymentMode: DeploymentMode;
  planningMonths: number;
};

type ProviderPricing = {
  providerName: string;
  shortName: string;
  serviceName: string;
  referenceConfiguration: string;
  region: string;
  computeHourly: number;
  storagePerGbMonth: number;
  backupPerGbMonth: number;
  ioPerMillion: number;
  egressPerGb: number;
  computeDiscountPercent: number;
  additionalMonthlyCost: number;
  includedBackupMultiplier: number;
};

type CostBreakdown = {
  provider: ProviderKey;
  shortName: string;
  serviceName: string;
  databaseCopies: number;
  chargeableBackupGb: number;
  compute: number;
  storage: number;
  backup: number;
  io: number;
  egress: number;
  additional: number;
  monthly: number;
  annual: number;
  planningPeriod: number;
};

const PRICING_CHECKED_DATE = "June 24, 2026";

const PROVIDER_ORDER: ProviderKey[] = ["aws", "azure", "gcp"];

const DEFAULT_WORKLOAD: Workload = {
  hoursPerMonth: 730,
  primaryStorageGb: 100,
  backupStorageGb: 100,
  monthlyIoMillion: 0,
  monthlyEgressGb: 0,
  readReplicas: 0,
  deploymentMode: "single",
  planningMonths: 12,
};

const DEFAULT_PRICING: Record<ProviderKey, ProviderPricing> = {
  aws: {
    providerName: "Amazon Web Services",
    shortName: "AWS",
    serviceName: "Amazon RDS for MySQL",
    referenceConfiguration:
      "db.r5.large reference: 2 vCPUs and 16 GiB memory, Single-AZ",
    region: "US East (N. Virginia)",
    computeHourly: 0.1386,
    storagePerGbMonth: 0.115,
    backupPerGbMonth: 0.095,
    ioPerMillion: 0,
    egressPerGb: 0,
    computeDiscountPercent: 0,
    additionalMonthlyCost: 0,
    includedBackupMultiplier: 1,
  },
  azure: {
    providerName: "Microsoft Azure",
    shortName: "Azure",
    serviceName: "Azure Database for MySQL Flexible Server",
    referenceConfiguration:
      "E2ds v6 reference: 2 vCores and 16 GiB memory, Memory Optimized",
    region: "Central US",
    computeHourly: 0.298,
    storagePerGbMonth: 0.115,
    backupPerGbMonth: 0.095,
    ioPerMillion: 0.2,
    egressPerGb: 0,
    computeDiscountPercent: 0,
    additionalMonthlyCost: 0,
    includedBackupMultiplier: 1,
  },
  gcp: {
    providerName: "Google Cloud",
    shortName: "Google Cloud",
    serviceName: "Cloud SQL for MySQL",
    referenceConfiguration:
      "Enterprise custom reference: 2 vCPUs and 16 GiB memory",
    region: "Iowa (us-central1)",
    computeHourly: 0.1946,
    storagePerGbMonth: 0.17,
    backupPerGbMonth: 0.08,
    ioPerMillion: 0,
    egressPerGb: 0,
    computeDiscountPercent: 0,
    additionalMonthlyCost: 0,
    includedBackupMultiplier: 0,
  },
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatMoney(value: number) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function clamp(
  value: number,
  minimum = 0,
  maximum = Number.MAX_SAFE_INTEGER,
) {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(Math.max(value, minimum), maximum);
}

function calculateProviderCost(
  provider: ProviderKey,
  workload: Workload,
  pricing: ProviderPricing,
): CostBreakdown {
  const highAvailabilityCopies = workload.deploymentMode === "ha" ? 2 : 1;
  const databaseCopies = highAvailabilityCopies + workload.readReplicas;
  const discountMultiplier =
    1 - clamp(pricing.computeDiscountPercent, 0, 100) / 100;

  const compute =
    pricing.computeHourly *
    workload.hoursPerMonth *
    databaseCopies *
    discountMultiplier;

  const storage =
    pricing.storagePerGbMonth *
    workload.primaryStorageGb *
    databaseCopies;

  const includedBackupGb =
    workload.primaryStorageGb * pricing.includedBackupMultiplier;

  const chargeableBackupGb = Math.max(
    workload.backupStorageGb - includedBackupGb,
    0,
  );

  const backup = chargeableBackupGb * pricing.backupPerGbMonth;
  const io = workload.monthlyIoMillion * pricing.ioPerMillion;
  const egress = workload.monthlyEgressGb * pricing.egressPerGb;
  const additional = pricing.additionalMonthlyCost;
  const monthly = compute + storage + backup + io + egress + additional;

  return {
    provider,
    shortName: pricing.shortName,
    serviceName: pricing.serviceName,
    databaseCopies,
    chargeableBackupGb,
    compute,
    storage,
    backup,
    io,
    egress,
    additional,
    monthly,
    annual: monthly * 12,
    planningPeriod: monthly * workload.planningMonths,
  };
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-950">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
  help,
  min = 0,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  help?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    onChange(
      clamp(
        nextValue,
        min,
        typeof max === "number" ? max : Number.MAX_SAFE_INTEGER,
      ),
    );
  };

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-900">
        {label}
      </span>

      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-20 text-sm text-gray-950 outline-none transition focus:border-[#165A31] focus:ring-2 focus:ring-[#165A31]/10 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-gray-500">
            {suffix}
          </span>
        ) : null}
      </div>

      {help ? (
        <span className="mt-1.5 block text-xs leading-5 text-gray-500">
          {help}
        </span>
      ) : null}
    </label>
  );
}

function RateField({
  label,
  value,
  onChange,
  suffix,
  step = 0.001,
  help,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix: string;
  step?: number;
  help?: string;
}) {
  return (
    <NumberField
      label={label}
      value={value}
      onChange={onChange}
      suffix={suffix}
      step={step}
      min={0}
      help={help}
    />
  );
}

export default function ToolClient() {
  const [workload, setWorkload] = useState<Workload>(DEFAULT_WORKLOAD);
  const [pricing, setPricing] =
    useState<Record<ProviderKey, ProviderPricing>>(DEFAULT_PRICING);
  const [copyStatus, setCopyStatus] = useState("");

  const results = useMemo(
    () =>
      PROVIDER_ORDER.map((provider) =>
        calculateProviderCost(provider, workload, pricing[provider]),
      ),
    [pricing, workload],
  );

  const rankedResults = useMemo(
    () => [...results].sort((first, second) => first.monthly - second.monthly),
    [results],
  );

  const lowestResult = rankedResults[0];
  const highestResult = rankedResults[rankedResults.length - 1];
  const monthlyDifference = Math.max(
    highestResult.monthly - lowestResult.monthly,
    0,
  );

  const updateWorkload = <Key extends keyof Workload>(
    key: Key,
    value: Workload[Key],
  ) => {
    setWorkload((current) => ({ ...current, [key]: value }));
  };

  const updateProviderPricing = (
    provider: ProviderKey,
    key: keyof ProviderPricing,
    value: number,
  ) => {
    setPricing((current) => ({
      ...current,
      [provider]: {
        ...current[provider],
        [key]: clamp(value),
      },
    }));
  };

  const resetCalculator = () => {
    setWorkload(DEFAULT_WORKLOAD);
    setPricing(DEFAULT_PRICING);
    setCopyStatus("");
  };

  const copyComparison = async () => {
    const lines = [
      "Cloud MySQL Cost Comparison",
      `Pricing checked: ${PRICING_CHECKED_DATE}`,
      `Running time: ${workload.hoursPerMonth} hours/month`,
      `Primary storage: ${workload.primaryStorageGb} GiB`,
      `Backup storage used: ${workload.backupStorageGb} GiB`,
      `High availability: ${
        workload.deploymentMode === "ha" ? "Enabled" : "Not enabled"
      }`,
      `Read replicas: ${workload.readReplicas}`,
      `Planning period: ${workload.planningMonths} months`,
      "",
      ...rankedResults.map(
        (result, index) =>
          `${index + 1}. ${result.serviceName}: ${formatMoney(
            result.monthly,
          )}/month, ${formatMoney(result.planningPeriod)} over ${
            workload.planningMonths
          } months`,
      ),
      "",
      `Lowest estimate: ${lowestResult.serviceName}`,
      `Monthly difference between lowest and highest: ${formatMoney(
        monthlyDifference,
      )}`,
      "",
      "Planning estimate only. Replace the reference rates with the exact region, SKU, contract, storage, networking, and feature prices for your account.",
    ];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopyStatus("Comparison copied");
    } catch {
      setCopyStatus("Unable to copy");
    }
  };

  return (
    <ToolShell
      title="Cloud MySQL Cost Comparison Calculator"
      description="Compare estimated monthly costs for Amazon RDS for MySQL, Azure Database for MySQL Flexible Server, and Google Cloud SQL for MySQL."
    >
      <div className="space-y-6">
        <div className="border-l-4 border-[#F2C94C] bg-[#FFFDF5] px-4 py-3 text-sm leading-6 text-gray-700">
          <strong>Pricing checked on {PRICING_CHECKED_DATE}.</strong> The
          calculator starts with editable USD reference rates for similar
          2-vCPU, 16-GiB managed MySQL configurations. The providers do not
          offer identical hardware or performance. Replace the defaults with
          the exact prices for your region and account before making a purchase
          decision.
        </div>

        <SectionCard
          title="1. Enter the MySQL workload"
          description="The same workload is applied to all three providers for a consistent cost comparison."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField
              label="Running time"
              value={workload.hoursPerMonth}
              onChange={(value) =>
                updateWorkload("hoursPerMonth", clamp(value, 0, 744))
              }
              suffix="hours"
              min={0}
              max={744}
              help="730 hours is a common full-month estimate."
            />

            <NumberField
              label="Primary database storage"
              value={workload.primaryStorageGb}
              onChange={(value) =>
                updateWorkload("primaryStorageGb", value)
              }
              suffix="GiB"
            />

            <NumberField
              label="Backup storage used"
              value={workload.backupStorageGb}
              onChange={(value) =>
                updateWorkload("backupStorageGb", value)
              }
              suffix="GiB"
              help="Enter total backup storage used, not only the extra amount."
            />

            <NumberField
              label="Monthly billable I/O"
              value={workload.monthlyIoMillion}
              onChange={(value) =>
                updateWorkload("monthlyIoMillion", value)
              }
              suffix="million"
              step={0.1}
              help="Enter total billable I/O for the deployment. Keep zero when the selected storage includes I/O."
            />

            <NumberField
              label="Internet data transfer out"
              value={workload.monthlyEgressGb}
              onChange={(value) => updateWorkload("monthlyEgressGb", value)}
              suffix="GiB"
              help="Network rates default to zero because routes and free allowances vary."
            />

            <NumberField
              label="Read replicas"
              value={workload.readReplicas}
              onChange={(value) =>
                updateWorkload(
                  "readReplicas",
                  Math.floor(clamp(value, 0, 20)),
                )
              }
              suffix="replicas"
              min={0}
              max={20}
            />

            <NumberField
              label="Planning period"
              value={workload.planningMonths}
              onChange={(value) =>
                updateWorkload(
                  "planningMonths",
                  Math.floor(clamp(value, 1, 60)),
                )
              }
              suffix="months"
              min={1}
              max={60}
            />

            <div className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-gray-900">
                Deployment type
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => updateWorkload("deploymentMode", "single")}
                  aria-pressed={workload.deploymentMode === "single"}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    workload.deploymentMode === "single"
                      ? "border-[#165A31] bg-[#165A31]/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="block text-sm font-semibold text-gray-950">
                    Single database
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">
                    One primary database before read replicas.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateWorkload("deploymentMode", "ha")}
                  aria-pressed={workload.deploymentMode === "ha"}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    workload.deploymentMode === "ha"
                      ? "border-[#165A31] bg-[#165A31]/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="block text-sm font-semibold text-gray-950">
                    High availability
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">
                    Adds one standby copy with compute and storage.
                  </span>
                </button>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="2. Review the provider pricing"
          description="Every default is editable so the calculator can match your region, database size, discount, and billing agreement."
        >
          <div className="grid gap-5 xl:grid-cols-3">
            {PROVIDER_ORDER.map((provider) => {
              const providerPricing = pricing[provider];

              return (
                <article
                  key={provider}
                  className="rounded-2xl border border-gray-200 bg-gray-50/60 p-5"
                >
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#165A31]">
                      {providerPricing.providerName}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-gray-950">
                      {providerPricing.serviceName}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-gray-600">
                      {providerPricing.referenceConfiguration}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {providerPricing.region}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <RateField
                      label="Compute"
                      value={providerPricing.computeHourly}
                      onChange={(value) =>
                        updateProviderPricing(
                          provider,
                          "computeHourly",
                          value,
                        )
                      }
                      suffix="$/hour"
                      step={0.0001}
                    />

                    <RateField
                      label="Database storage"
                      value={providerPricing.storagePerGbMonth}
                      onChange={(value) =>
                        updateProviderPricing(
                          provider,
                          "storagePerGbMonth",
                          value,
                        )
                      }
                      suffix="$/GiB-mo"
                      step={0.001}
                    />

                    <RateField
                      label="Backup storage"
                      value={providerPricing.backupPerGbMonth}
                      onChange={(value) =>
                        updateProviderPricing(
                          provider,
                          "backupPerGbMonth",
                          value,
                        )
                      }
                      suffix="$/GiB-mo"
                      step={0.001}
                    />

                    <RateField
                      label="Billable I/O"
                      value={providerPricing.ioPerMillion}
                      onChange={(value) =>
                        updateProviderPricing(
                          provider,
                          "ioPerMillion",
                          value,
                        )
                      }
                      suffix="$/million"
                      step={0.01}
                    />

                    <RateField
                      label="Data transfer out"
                      value={providerPricing.egressPerGb}
                      onChange={(value) =>
                        updateProviderPricing(provider, "egressPerGb", value)
                      }
                      suffix="$/GiB"
                      step={0.001}
                    />

                    <RateField
                      label="Compute discount"
                      value={providerPricing.computeDiscountPercent}
                      onChange={(value) =>
                        updateProviderPricing(
                          provider,
                          "computeDiscountPercent",
                          clamp(value, 0, 100),
                        )
                      }
                      suffix="%"
                      step={0.1}
                      help="Use the effective reserved, committed-use, savings-plan, or negotiated discount."
                    />

                    <RateField
                      label="Other monthly cost"
                      value={providerPricing.additionalMonthlyCost}
                      onChange={(value) =>
                        updateProviderPricing(
                          provider,
                          "additionalMonthlyCost",
                          value,
                        )
                      }
                      suffix="$/month"
                      step={0.01}
                      help="Add monitoring, extended support, extra IOPS, IP, or another fixed charge."
                    />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-5 border-l-4 border-[#F2C94C] bg-[#FFFDF5] px-4 py-3 text-xs leading-5 text-gray-600">
            AWS and Azure include backup storage up to the primary provisioned
            storage amount in the default logic. Google Cloud backup usage is
            charged from the first GiB. Network transfer remains zero until an
            exact route-specific rate is entered.
          </div>
        </SectionCard>

        <SectionCard
          title="3. Compare the estimated cost"
          description="The cards are ranked automatically from the lowest to the highest monthly estimate."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {rankedResults.map((result, index) => {
              const isLowest = index === 0;

              return (
                <article
                  key={result.provider}
                  className={`rounded-2xl border p-5 ${
                    isLowest
                      ? "border-[#165A31] bg-[#165A31]/5"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {isLowest ? "Lowest estimate" : `Rank ${index + 1}`}
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-gray-950">
                        {result.shortName}
                      </h3>
                    </div>
                    <span className="rounded-full bg-[#F2C94C]/25 px-2.5 py-1 text-xs font-semibold text-gray-800">
                      {result.databaseCopies}{" "}
                      {result.databaseCopies === 1 ? "copy" : "copies"}
                    </span>
                  </div>

                  <p className="mt-5 text-3xl font-bold tracking-tight text-[#165A31]">
                    {formatMoney(result.monthly)}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">per month</p>

                  <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">Annual estimate</span>
                      <span className="font-semibold text-gray-950">
                        {formatMoney(result.annual)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">
                        {workload.planningMonths}-month estimate
                      </span>
                      <span className="font-semibold text-gray-950">
                        {formatMoney(result.planningPeriod)}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Cost item</th>
                  {results.map((result) => (
                    <th
                      key={result.provider}
                      className="px-4 py-3 text-right font-semibold"
                    >
                      {result.shortName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {[
                  ["Compute", "compute"],
                  ["Database storage", "storage"],
                  ["Backup storage", "backup"],
                  ["Billable I/O", "io"],
                  ["Data transfer out", "egress"],
                  ["Other monthly cost", "additional"],
                  ["Monthly total", "monthly"],
                  ["Annual total", "annual"],
                ].map(([label, key]) => (
                  <tr
                    key={key}
                    className={
                      key === "monthly" || key === "annual"
                        ? "bg-[#FFFDF5] font-semibold"
                        : ""
                    }
                  >
                    <td className="px-4 py-3 text-gray-700">{label}</td>
                    {results.map((result) => (
                      <td
                        key={result.provider}
                        className="px-4 py-3 text-right text-gray-950"
                      >
                        {formatMoney(
                          result[key as keyof CostBreakdown] as number,
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="border-l-4 border-[#F2C94C] bg-[#FFFDF5] px-5 py-4">
              <p className="text-sm text-gray-600">Lowest current estimate</p>
              <p className="mt-1 text-lg font-semibold text-gray-950">
                {lowestResult.serviceName}
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                {formatMoney(lowestResult.monthly)} per month with the values
                currently entered.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4">
              <p className="text-sm text-gray-600">
                Difference between lowest and highest
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-950">
                {formatMoney(monthlyDifference)} per month
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                {formatMoney(monthlyDifference * workload.planningMonths)} over
                the selected planning period.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={copyComparison}
              className="rounded-xl bg-[#165A31] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Copy comparison
            </button>
            <button
              type="button"
              onClick={resetCalculator}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Reset calculator
            </button>
            {copyStatus ? (
              <span
                className="self-center text-sm text-gray-600"
                aria-live="polite"
              >
                {copyStatus}
              </span>
            ) : null}
          </div>
        </SectionCard>

        <section className="space-y-10 pt-6 text-gray-700">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
              Planning a managed MySQL database across three clouds
            </h2>
            <p className="mt-4 leading-7">
              The database server price is only one part of a managed MySQL
              bill. Storage, backup retention, high availability, read
              replicas, I/O, data transfer, and commitment discounts can
              materially change the monthly total. This calculator keeps those
              cost parts visible and lets you replace every reference rate.
            </p>
            <p className="mt-4 leading-7">
              The default configurations have the same listed vCPU and memory
              amounts, but they are not performance guarantees. CPU generation,
              storage latency, connection limits, failover behavior, and
              managed features vary. Compare cost together with a benchmark
              that resembles your application.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
              Cost parts included in the comparison
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                [
                  "Database compute",
                  "Hourly compute multiplied by running hours, database copies, and the provider-specific compute discount.",
                ],
                [
                  "High availability",
                  "One standby copy is added for compute and database storage.",
                ],
                [
                  "Read replicas",
                  "Every replica adds another full compute and storage copy using the selected reference size.",
                ],
                [
                  "Storage and backups",
                  "Provisioned database storage and chargeable backup usage are calculated separately.",
                ],
                [
                  "I/O and data transfer",
                  "Optional usage costs are included when provider-specific rates are entered.",
                ],
                [
                  "Other monthly charges",
                  "A flexible field covers extended support, extra IOPS, monitoring, IP addresses, or another fixed cost.",
                ],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <h3 className="font-semibold text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
              How to compare the providers accurately
            </h2>
            <ol className="mt-4 space-y-4">
              {[
                "Choose a similar CPU and memory size in each provider account. Use measured performance rather than assuming equal listed resources are equal.",
                "Enter monthly running hours, primary storage, backup usage, read replicas, and the required availability setup.",
                "Replace the reference compute and storage rates with prices from the exact provider region you plan to use.",
                "Add provider-specific reserved, savings-plan, or committed-use discounts under each pricing card.",
                "Enter network egress only after checking the source, destination, free allowance, and route.",
                "Compare the result with migration effort, reliability, MySQL version support, operational features, and application latency.",
              ].map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2C94C]/30 text-sm font-semibold text-gray-900">
                    {index + 1}
                  </span>
                  <p className="pt-1 leading-7">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
              Check more than the monthly price
            </h2>
            <p className="mt-4 leading-7">
              Review supported MySQL versions, maintenance controls, failover
              behavior, backup recovery options, private networking, read
              replica limits, monitoring, storage scaling, connection
              management, regional availability, and the services already used
              by your application.
            </p>
            <p className="mt-4 leading-7">
              Also confirm the standard-support window for the selected MySQL
              version. Running an old major version can add extended-support
              charges that are not part of the normal compute price.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
              Official pricing sources
            </h2>
            <p className="mt-4 leading-7">
              The reference rates and billing rules were checked on{" "}
              {PRICING_CHECKED_DATE}. Provider pricing pages remain the final
              source for current prices, regions, discounts, and billing
              conditions.
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <a
                href="https://aws.amazon.com/rds/mysql/pricing/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#165A31] underline decoration-[#F2C94C] decoration-2 underline-offset-4"
              >
                Amazon RDS for MySQL pricing
              </a>
              <a
                href="https://azure.microsoft.com/en-us/pricing/details/mysql/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#165A31] underline decoration-[#F2C94C] decoration-2 underline-offset-4"
              >
                Azure Database for MySQL pricing
              </a>
              <a
                href="https://cloud.google.com/sql/pricing"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#165A31] underline decoration-[#F2C94C] decoration-2 underline-offset-4"
              >
                Google Cloud SQL pricing
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
              Frequently asked questions
            </h2>
            <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white px-5">
              {[
                [
                  "Does this calculator show the final cloud bill?",
                  "No. It creates a planning estimate from the workload and pricing values entered. Taxes, support plans, private networking, monitoring, free credits, contract pricing, and other services can change the final bill.",
                ],
                [
                  "Are the reference database configurations exactly equal?",
                  "No. They have the same listed vCPU and memory amounts, but processor type, storage behavior, performance, maintenance, and managed features differ. Test your real workload before choosing a provider.",
                ],
                [
                  "How does the calculator estimate high availability?",
                  "High availability adds one standby database copy. The calculator therefore doubles compute and database storage before adding any read replicas.",
                ],
                [
                  "How are read replicas priced?",
                  "Each read replica adds another database compute and storage copy. The calculator uses the same selected reference size for every replica.",
                ],
                [
                  "How is backup storage estimated?",
                  "The AWS and Azure defaults include backup usage up to the primary database storage amount. Google Cloud backup usage is charged from the first GiB in the default estimate. Every backup rate remains editable.",
                ],
                [
                  "Can committed-use or reserved pricing be compared?",
                  "Yes. Enter each provider's effective compute discount percentage. The discount applies only to compute because storage, backup, I/O, networking, and other charges are normally billed separately.",
                ],
              ].map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="cursor-pointer list-none pr-8 font-semibold text-gray-950">
                    {question}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <div className="border-l-4 border-[#F2C94C] bg-[#FFFDF5] px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-950">
              Continue comparing managed database costs
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              Compare managed PostgreSQL pricing with the related calculator,
              or return to the complete Beeija tools directory.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/tools/cloud-postgresql-cost-comparison-calculator"
                className="rounded-xl bg-[#165A31] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Cloud PostgreSQL Cost Comparison Calculator
              </Link>
              <Link
                href="/tools"
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-gray-300"
              >
                Browse all tools
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ToolShell>
  );
}

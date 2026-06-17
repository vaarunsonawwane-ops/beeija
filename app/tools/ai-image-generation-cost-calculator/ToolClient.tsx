"use client";

import { useMemo, useState } from "react";
import BeeijaNumberField from "@/app/components/BeeijaNumberField";
import BeeijaCalculatorResultPanel from "@/app/components/BeeijaCalculatorResultPanel";

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "$0.00";
  if (value > 0 && value < 0.01) return `$${value.toFixed(6)}`;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ToolClient() {
  const [requestsPerMonth, setRequestsPerMonth] = useState("20000");
  const [imagesPerRequest, setImagesPerRequest] = useState("2");
  const [pricePerImage, setPricePerImage] = useState("0.04");
  const [retryPercent, setRetryPercent] = useState("8");
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState("25");

  const result = useMemo(() => {
    const requests = toNumber(requestsPerMonth);
    const imagesEachRequest = toNumber(imagesPerRequest);
    const imagePrice = toNumber(pricePerImage);
    const retryRate = Math.min(
      100,
      Math.max(0, toNumber(retryPercent)),
    );
    const fixedCosts = toNumber(monthlyFixedCosts);

    const successfulImages = requests * imagesEachRequest;
    const retryImages = successfulImages * (retryRate / 100);
    const totalGeneratedImages = successfulImages + retryImages;

    const baseImageCost = successfulImages * imagePrice;
    const retryCost = retryImages * imagePrice;
    const variableCost = baseImageCost + retryCost;
    const monthlyCost = variableCost + fixedCosts;

    return {
      requests,
      successfulImages,
      retryImages,
      totalGeneratedImages,
      baseImageCost,
      retryCost,
      fixedCosts,
      monthlyCost,
      costPerRequest: requests > 0 ? monthlyCost / requests : 0,
      costPerGeneratedImage:
        totalGeneratedImages > 0 ? monthlyCost / totalGeneratedImages : 0,
      dailyCost: monthlyCost / 30,
      yearlyCost: monthlyCost * 12,
    };
  }, [
    imagesPerRequest,
    monthlyFixedCosts,
    pricePerImage,
    requestsPerMonth,
    retryPercent,
  ]);

  const reset = () => {
    setRequestsPerMonth("20000");
    setImagesPerRequest("2");
    setPricePerImage("0.04");
    setRetryPercent("8");
    setMonthlyFixedCosts("25");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">
            Enter Your Image Generation Usage
          </h2>

          <p className="mt-3 leading-relaxed text-gray-600">
            Add your expected requests, images per request, price per image,
            retries, and monthly fixed costs.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <BeeijaNumberField
            label="Requests per month"
            value={requestsPerMonth}
            onChange={setRequestsPerMonth}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Images per request"
            value={imagesPerRequest}
            onChange={setImagesPerRequest}
            min="0"
            step="1"
          />

          <BeeijaNumberField
            label="Price per generated image"
            value={pricePerImage}
            onChange={setPricePerImage}
            min="0"
            step="0.001"
            prefix="$"
          />

          <BeeijaNumberField
            label="Retry or extra generation rate"
            value={retryPercent}
            onChange={setRetryPercent}
            min="0"
            max="100"
            step="1"
            suffix="%"
          />

          <BeeijaNumberField
            label="Other monthly fixed costs"
            value={monthlyFixedCosts}
            onChange={setMonthlyFixedCosts}
            min="0"
            step="0.01"
            prefix="$"
          />
        </div>

        <div className="mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4">
          <p className="font-medium text-gray-900">
            Values used for this estimate
          </p>

          <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>Price per image: {formatMoney(toNumber(pricePerImage))}</p>
            <p>Retry rate: {formatNumber(toNumber(retryPercent))}%</p>
            <p>
              Monthly fixed costs:{" "}
              {formatMoney(toNumber(monthlyFixedCosts))}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={reset}
          className="beeija-btn-outline mt-6"
        >
          Reset values
        </button>
      </section>

      <BeeijaCalculatorResultPanel
        title="Estimated AI Image Cost"
        description="This estimate includes generated images, retries, and fixed monthly costs."
        primaryLabel="Estimated monthly cost"
        primaryValue={formatMoney(result.monthlyCost)}
        stats={
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultStat
              label="Per request"
              value={formatMoney(result.costPerRequest)}
            />

            <ResultStat
              label="Per image"
              value={formatMoney(result.costPerGeneratedImage)}
            />

            <ResultStat
              label="Per year"
              value={formatMoney(result.yearlyCost)}
            />
          </div>
        }
        breakdown={
          <div className="space-y-4">
            <CostRow
              label="Base image cost"
              detail={`${formatNumber(result.successfulImages)} planned images`}
              value={formatMoney(result.baseImageCost)}
            />

            <CostRow
              label="Retry and extra image cost"
              detail={`${formatNumber(result.retryImages)} extra images`}
              value={formatMoney(result.retryCost)}
            />

            <CostRow
              label="Other fixed monthly costs"
              detail="Storage, delivery, moderation, or other costs entered"
              value={formatMoney(result.fixedCosts)}
            />
          </div>
        }
        totals={
          <div className="text-sm leading-relaxed text-gray-600">
            <p>
              Requests:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(result.requests)}
              </span>
            </p>

            <p className="mt-2">
              Planned images:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(result.successfulImages)}
              </span>
            </p>

            <p className="mt-2">
              Total generated images:{" "}
              <span className="font-medium text-gray-900">
                {formatNumber(result.totalGeneratedImages)}
              </span>
            </p>

            <p className="mt-2">
              Estimated daily cost:{" "}
              <span className="font-medium text-gray-900">
                {formatMoney(result.dailyCost)}
              </span>
            </p>
          </div>
        }
        provider="AI image provider"
        pricingCheckedDate="the date you checked the provider's image pricing"
        excludedCosts="editing, upscaling, storage, CDN delivery, moderation, taxes, discounts, failed jobs not covered by the retry rate, and other services"
      />
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-950">{value}</p>
    </div>
  );
}

function CostRow({
  label,
  detail,
  value,
}: {
  label: string;
  detail: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="mt-1 text-sm text-gray-500">{detail}</p>
      </div>

      <p className="font-semibold text-gray-950">{value}</p>
    </div>
  );
}

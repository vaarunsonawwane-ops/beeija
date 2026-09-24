import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

const title = "Mistral API Cost Calculator";
const description =
  "Estimate Mistral API text-token costs across Standard, Batch, or Priority service, prompt caching, and optional EU or US regional inference.";
const href = "/tools/mistral-api-cost-calculator";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Mistral API cost calculator",
    "Mistral AI pricing calculator",
    "Mistral Small 4 pricing",
    "Mistral Medium 3.5 pricing",
    "Mistral Large 3 pricing",
    "Ministral 3 pricing",
    "Codestral API pricing",
    "Mistral Batch API cost",
    "Mistral Priority Tier pricing",
    "Mistral regional inference pricing",
    "Mistral prompt caching cost",
  ],
  alternates: {
    canonical: `https://beeija.com${href}`,
  },
  openGraph: {
    title,
    description,
    url: `https://beeija.com${href}`,
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const referenceClass =
  "font-medium text-[var(--green)] underline decoration-[var(--yellow)] decoration-2 underline-offset-4";

export default function MistralApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title={title}
      description="Budget Mistral text inference using the service tier, region, cache behavior, and workload shape that will actually be deployed."
    >
      <ToolClient />

      <div className="mt-14">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-950">
              Mistral&apos;s service tiers change more than the token rate
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Standard is the ordinary synchronous path. Batch is for work
              that can wait in an asynchronous queue and is published at a 50%
              discount. Priority is intended for real-time or
              business-critical traffic, costs 1.75× Standard list pricing,
              and requires Mistral to configure Priority capacity for the
              organization.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-700">
                    <th className="py-3 pr-5 font-semibold">Path</th>
                    <th className="py-3 pr-5 font-semibold">Cost treatment</th>
                    <th className="py-3 font-semibold">Operational trade-off</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-5 font-medium text-gray-900">
                      Standard
                    </td>
                    <td className="py-3 pr-5">Published list rate</td>
                    <td className="py-3">
                      Best-effort synchronous processing
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-5 font-medium text-gray-900">
                      Batch
                    </td>
                    <td className="py-3 pr-5">50% lower</td>
                    <td className="py-3">
                      Asynchronous; queued for processing over a 24-hour period
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-5 font-medium text-gray-900">
                      Priority
                    </td>
                    <td className="py-3 pr-5">1.75× Standard</td>
                    <td className="py-3">
                      Priority queue; can fall back to Standard when configured
                      Priority capacity is unavailable
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <aside className="self-start border-l-4 border-[var(--yellow)] pl-5">
            <h3 className="text-lg font-semibold text-gray-950">
              Do not budget Priority from the request flag alone
            </h3>
            <p className="mt-3 leading-7 text-gray-600">
              Mistral reports the tier that actually served the request in the
              usage object. A request sent with <code>service_tier="auto"</code>{" "}
              can be billed as Standard if Priority capacity is not used. For
              production forecasts, compare the calculator with observed
              service-tier usage rather than assuming every request receives
              Priority treatment.
            </p>
          </aside>
        </section>

        <section className="mt-12 max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Cache-hit input is a separate billing path
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            Mistral prompt caching reuses a compatible prompt prefix. Cached
            prompt tokens are billed at 10% of the Standard input rate, which
            is why the calculator asks for a cache-hit share instead of
            applying one input price to every prompt token. The API exposes
            measured cache usage in{" "}
            <code>usage.prompt_tokens_details.cached_tokens</code>; ordinary
            billable input is the remaining prompt-token count.
          </p>

          <p className="mt-4 leading-8 text-gray-600">
            A cache key can improve the chance of reuse, but it does not
            guarantee a hit. Mistral also notes that cache blocks contain 64
            tokens, so very short prompts will not produce cache hits. For an
            existing application, measured cached-token usage is a better
            budgeting input than a guessed percentage.
          </p>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-950">
              Regional inference is a deployment decision, not just a 10%
              surcharge
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Mistral offers Global, EU, and US inference endpoints. EU and US
              regional inference add 10% to input, cached-input, and output
              token pricing, but they also change where eligible inference is
              processed. That can matter for data-location requirements and
              latency.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Regional processing does not make the entire Mistral control
              plane regional. Account settings, API keys, billing, access
              management, analytics, and other operational metadata can still
              be handled outside the selected inference geography. Regional
              inference and Zero Data Retention are also separate controls:
              one governs where eligible inference runs, while the other
              governs whether eligible request and response content is retained
              after processing.
            </p>
          </div>

          <div className="self-start">
            <h3 className="text-lg font-semibold text-gray-950">
              Regional endpoints also narrow feature choices
            </h3>
            <p className="mt-3 leading-7 text-gray-600">
              Batch, Agents, and the Files API are not available on regional
              endpoints, and model availability varies by region. Function
              calling is currently the supported regional tool path. That is
              why choosing Batch in the calculator returns the inference
              location to Global instead of pretending those options can be
              combined.
            </p>
          </div>
        </section>

        <section className="mt-12 max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Reasoning can increase the output side of the bill
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            Mistral Small 4 and Mistral Medium 3.5 support adjustable
            <code> reasoning_effort</code>. Higher reasoning can generate a
            thinking chunk before the final answer and uses more generated
            tokens. When reasoning is enabled, budget from measured completion
            usage rather than counting only the final visible answer.
          </p>
        </section>

        <section className="mt-12 max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Context limits are a hard request boundary
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            Mistral counts both input and generated output tokens toward each
            request&apos;s context limit. Requests that exceed the model limit
            return a 400 error. The calculator checks the representative
            input-plus-output request entered above, but an average cannot
            guarantee that every production request fits; validate each real
            prompt together with its allowed generation budget.
          </p>

          <div className="mt-5 grid gap-x-10 gap-y-3 text-sm text-gray-600 sm:grid-cols-2">
            <p>
              <span className="font-medium text-gray-900">
                256,000 tokens:
              </span>{" "}
              Mistral Large 3, Medium 3.5, Small 4, and Ministral 3
            </p>
            <p>
              <span className="font-medium text-gray-900">
                128,000 tokens:
              </span>{" "}
              Codestral
            </p>
          </div>
        </section>

        <section className="mt-12 max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            A <code>-latest</code> model ID can move underneath a budget
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            Mistral&apos;s <code>-latest</code> aliases automatically move to
            newer General Availability versions. That is convenient during
            development, but Mistral warns that an alias can expose an
            application to changes in model behavior and pricing. For a
            production budget that must stay reproducible, pin the specific
            major.minor model identifier you actually intend to deploy and
            revisit the estimate when you migrate.
          </p>
        </section>

        <section className="mt-12 max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            What this text-token estimate intentionally leaves out
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            The calculation stops at hosted text-token inference. OCR,
            transcription, text-to-speech, fine-tuning, Agents, built-in
            tools, Files, storage, retries, taxes, credits, negotiated terms,
            and products billed by pages, minutes, characters, or another unit
            need their own cost model. Keeping those units separate is more
            useful than hiding them inside a generic miscellaneous charge.
          </p>
        </section>

        <section className="mt-12 max-w-6xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Mistral documentation behind the calculation
          </h2>

          <p className="mt-4 leading-8 text-gray-600">
            Built-in rates were checked on{" "}
            <strong className="font-semibold text-gray-900">
              September 24, 2026
            </strong>
            . Current model prices and cached-input rates come from Mistral&apos;s{" "}
            <a
              href="https://docs.mistral.ai/inference/pricing"
              target="_blank"
              rel="noreferrer"
              className={referenceClass}
            >
              pricing documentation
            </a>
            . Delivery behavior and the 1.75× premium follow the{" "}
            <a
              href="https://docs.mistral.ai/inference/priority-tier"
              target="_blank"
              rel="noreferrer"
              className={referenceClass}
            >
              Priority Tier documentation
            </a>
            , while the 50% asynchronous discount follows the{" "}
            <a
              href="https://docs.mistral.ai/studio/batch-processing"
              target="_blank"
              rel="noreferrer"
              className={referenceClass}
            >
              Batch processing documentation
            </a>
            . Regional limits and the 10% surcharge are described in the{" "}
            <a
              href="https://docs.mistral.ai/inference/regional-inference"
              target="_blank"
              rel="noreferrer"
              className={referenceClass}
            >
              regional inference documentation
            </a>
            , cache-hit accounting follows Mistral&apos;s{" "}
            <a
              href="https://docs.mistral.ai/studio/conversations/advanced/prompt-caching"
              target="_blank"
              rel="noreferrer"
              className={referenceClass}
            >
              prompt caching documentation
            </a>
            , reasoning behavior follows the{" "}
            <a
              href="https://docs.mistral.ai/studio/conversations/reasoning"
              target="_blank"
              rel="noreferrer"
              className={referenceClass}
            >
              reasoning documentation
            </a>
            , and alias stability follows the{" "}
            <a
              href="https://docs.mistral.ai/inference/model-lifecycle"
              target="_blank"
              rel="noreferrer"
              className={referenceClass}
            >
              model lifecycle policy
            </a>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-950">
            Explore related AI cost tools
          </h2>
          <div className="mt-4 [&>*]:!mt-0">
            <BeeijaRelatedTools currentHref={href} />
          </div>
        </section>
      </div>
    </ToolShell>
  );
}

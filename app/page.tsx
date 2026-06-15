import Link from "next/link";

const featuredTools = [
  {
    title: "AI Token Cost Calculator",
    description:
      "Estimate prompt, output, and monthly model costs using clear usage assumptions.",
    href: "/tools/ai-token-cost-calculator",
    label: "AI Costs",
  },
  {
    title: "Cloud Storage Cost Calculator",
    description:
      "Compare storage, retrieval, operations, and transfer costs before choosing a service.",
    href: "/tools/cloud-storage-cost-calculator",
    label: "Cloud Costs",
  },
  {
    title: "Server Cost Estimator",
    description:
      "Plan compute requirements and estimate recurring infrastructure costs.",
    href: "/tools/server-cost-estimator",
    label: "Infrastructure",
  },
];

const principles = [
  {
    number: "01",
    title: "Start with real inputs",
    description:
      "Use the numbers you already know—traffic, tokens, storage, requests, or expected growth.",
  },
  {
    number: "02",
    title: "Compare practical options",
    description:
      "See the cost difference between providers, configurations, and usage patterns.",
  },
  {
    number: "03",
    title: "Make a clearer decision",
    description:
      "Understand the result before committing money, time, or engineering effort.",
  },
];

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M4.5 10h11m-4-4 4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="m5 10.5 3 3 7-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      <section className="relative isolate border-b border-[#165A31]/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#F8FCF9_0%,#FFFFFF_76%)]"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[-22rem] -z-10 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[#F2C94C]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute right-[-12rem] top-24 -z-10 h-80 w-80 rounded-full bg-[#165A31]/10 blur-3xl"
        />

        <div className="mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-6 py-24 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#165A31]/15 bg-white/80 px-4 py-2 text-sm font-semibold text-[#165A31] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#F2C94C]" />
              Practical tools for better technical decisions
            </div>

            <h1 className="mt-7 text-balance text-5xl font-bold tracking-[-0.045em] text-[#123D24] sm:text-6xl lg:text-[4.75rem] lg:leading-[1.03]">
              Know the cost before you build.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Beeija helps you estimate AI, cloud, and infrastructure costs,
              compare practical options, and plan with more confidence before
              making a technical commitment.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/tools"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#165A31] px-7 py-3.5 text-base font-semibold text-white shadow-[0_10px_30px_rgba(22,90,49,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#104526] focus:outline-none focus:ring-2 focus:ring-[#165A31] focus:ring-offset-2"
              >
                Explore all tools
                <ArrowIcon />
              </Link>

              <Link
                href="/about"
                className="inline-flex min-h-13 items-center justify-center rounded-xl border border-[#165A31]/20 bg-white px-7 py-3.5 text-base font-semibold text-[#165A31] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#165A31]/35 hover:bg-[#F8FCF9] focus:outline-none focus:ring-2 focus:ring-[#165A31] focus:ring-offset-2"
              >
                Why Beeija exists
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
              {["Clear calculations", "No unnecessary clutter", "Built for real decisions"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#165A31]/8 text-[#165A31]">
                      <CheckIcon />
                    </span>
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden="true"
              className="absolute -inset-5 -z-10 rounded-[2rem] bg-[#F2C94C]/18 blur-2xl"
            />

            <div className="rounded-[2rem] border border-[#165A31]/12 bg-white p-5 shadow-[0_30px_80px_rgba(16,69,38,0.12)] sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm font-semibold text-[#165A31]">
                    Monthly AI cost estimate
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    A simple planning preview
                  </p>
                </div>
                <span className="rounded-full bg-[#F2C94C]/25 px-3 py-1 text-xs font-bold text-[#715A00]">
                  Example
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Monthly requests
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#123D24]">
                    250,000
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Avg. tokens
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#123D24]">
                    1,800
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#165A31]/10 bg-[#F5FAF7] p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Estimated monthly cost
                    </p>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-[#165A31]">
                      $438.75
                    </p>
                  </div>
                  <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm">
                    Based on inputs
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">
                      Input processing
                    </span>
                    <span className="font-semibold text-slate-800">$168.75</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[39%] rounded-full bg-[#165A31]" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">
                      Output generation
                    </span>
                    <span className="font-semibold text-slate-800">$270.00</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[61%] rounded-full bg-[#F2C94C]" />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-dashed border-[#165A31]/20 px-4 py-3 text-center text-sm font-medium text-slate-500">
                Adjust usage, pricing, and growth assumptions in the full tool.
              </div>
            </div>

            <div className="absolute -bottom-7 -left-6 hidden rounded-2xl border border-[#165A31]/10 bg-white p-4 shadow-xl sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Planning principle
              </p>
              <p className="mt-1 font-bold text-[#165A31]">
                Clarity before commitment
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#165A31]">
              Start with a useful calculation
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[#123D24] sm:text-4xl">
              Tools built around decisions people actually need to make.
            </h2>
          </div>

          <Link
            href="/tools"
            className="inline-flex items-center gap-2 font-semibold text-[#165A31] transition hover:gap-3"
          >
            View the complete tool library
            <ArrowIcon />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group rounded-[1.6rem] border border-[#165A31]/10 bg-white p-7 shadow-[0_12px_40px_rgba(16,69,38,0.055)] transition duration-200 hover:-translate-y-1 hover:border-[#165A31]/20 hover:shadow-[0_20px_55px_rgba(16,69,38,0.1)]"
            >
              <span className="inline-flex rounded-full bg-[#F2C94C]/22 px-3 py-1 text-xs font-bold text-[#6C5700]">
                {tool.label}
              </span>

              <h3 className="mt-6 text-2xl font-bold tracking-[-0.02em] text-[#123D24]">
                {tool.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">{tool.description}</p>

              <span className="mt-8 inline-flex items-center gap-2 font-semibold text-[#165A31]">
                Open tool
                <span className="transition group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#165A31]/8 bg-[#F7FBF8]">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#165A31]">
                A simpler way to plan
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[#123D24] sm:text-4xl">
                From an uncertain idea to a more informed next step.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Beeija does not try to make technical planning look more
                complicated than it is. Each tool focuses on the inputs that
                matter, explains the result, and helps you compare realistic
                choices.
              </p>
            </div>

            <div className="grid gap-5">
              {principles.map((item) => (
                <article
                  key={item.number}
                  className="grid gap-5 rounded-2xl border border-[#165A31]/10 bg-white p-6 shadow-sm sm:grid-cols-[70px_1fr] sm:items-start"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#165A31] text-sm font-bold text-white">
                    {item.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#123D24]">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-8 rounded-[2rem] bg-[#123D24] px-7 py-10 text-white sm:px-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-14 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2C94C]">
              Built with a long-term purpose
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Seed today. Better outcomes tomorrow.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Useful planning starts before the first invoice, deployment, or
              technical commitment. Beeija is being built to make that stage
              clearer.
            </p>
          </div>

          <Link
            href="/tools"
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#F2C94C] px-7 py-3.5 font-bold text-[#123D24] transition duration-200 hover:-translate-y-0.5 hover:bg-[#F6D66F] focus:outline-none focus:ring-2 focus:ring-[#F2C94C] focus:ring-offset-2 focus:ring-offset-[#123D24]"
          >
            Browse tools
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </main>
  );
}

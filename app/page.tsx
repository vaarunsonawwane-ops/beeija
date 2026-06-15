import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-[#165A31]/10">
        <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center sm:px-8 lg:px-12">
          <div className="mb-8 inline-flex items-center rounded-full border border-[#165A31]/15 bg-[#165A31]/5 px-4 py-2 text-sm font-semibold text-[#165A31]">
            Practical cloud and AI cost tools
          </div>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-[#165A31] sm:text-5xl lg:text-7xl">
            Better decisions begin with the right numbers.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Estimate cloud costs, compare AI models, and plan your technical
            stack before you build.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/tools"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#165A31] px-7 py-3 text-base font-semibold text-white transition hover:bg-[#104526] focus:outline-none focus:ring-2 focus:ring-[#165A31] focus:ring-offset-2"
            >
              Explore tools
            </Link>

            <Link
              href="/about"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#165A31]/20 bg-white px-7 py-3 text-base font-semibold text-[#165A31] transition hover:bg-[#165A31]/5 focus:outline-none focus:ring-2 focus:ring-[#165A31] focus:ring-offset-2"
            >
              About Beeija
            </Link>
          </div>

          <p className="mt-10 text-sm font-medium text-slate-500">
            Seed today. Better outcomes tomorrow.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-[#165A31]/10 bg-[#165A31]/[0.025] p-7">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2C94C]/25 text-lg font-bold text-[#165A31]">
              01
            </div>
            <h2 className="text-xl font-bold text-[#165A31]">
              AI cost planning
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Compare model pricing and estimate usage costs before committing
              to a provider.
            </p>
          </article>

          <article className="rounded-2xl border border-[#165A31]/10 bg-[#165A31]/[0.025] p-7">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2C94C]/25 text-lg font-bold text-[#165A31]">
              02
            </div>
            <h2 className="text-xl font-bold text-[#165A31]">
              Cloud cost estimates
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Work through hosting, storage, bandwidth, compute, and related
              infrastructure costs.
            </p>
          </article>

          <article className="rounded-2xl border border-[#165A31]/10 bg-[#165A31]/[0.025] p-7">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2C94C]/25 text-lg font-bold text-[#165A31]">
              03
            </div>
            <h2 className="text-xl font-bold text-[#165A31]">
              Stack comparisons
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Compare practical technology options using clear inputs and
              understandable results.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

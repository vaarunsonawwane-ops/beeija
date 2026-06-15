import Link from "next/link";

export const metadata = {
  title: "About Beeija",

  description:
    "Learn why Beeija was created to make AI, cloud, API, SaaS, hosting, and infrastructure cost planning clearer, simpler, and less cluttered.",

  alternates: {
    canonical: "https://beeija.com/about",
  },

  openGraph: {
    title: "About Beeija",

    description:
      "Beeija helps founders, business owners, architects, and builders understand the cost and effort involved before they build.",

    url: "https://beeija.com/about",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "About Beeija",

    description:
      "A practical, human-built platform for clearer AI, cloud, infrastructure, API, SaaS, and technology cost planning.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-4xl px-6 py-16">
        {/* HERO */}
        <div>
          <p className="text-sm font-medium text-[var(--yellow-dark)]">
            ✦ Built for better beginnings
          </p>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
            About Beeija
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Beeija is a practical platform for business owners, founders, CEOs,
            cloud architects, developers, and anyone who wants to understand
            the cost or effort involved before building a cloud platform,
            AI-powered product, website, application, or technical system.
          </p>
        </div>

        {/* WHY IT STARTED */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-gray-950">
            Why I Created Beeija
          </h2>

          <div className="mt-6 space-y-5 leading-8 text-gray-600">
            <p>
              As a founder, I struggled to find clear answers for my own
              requirements. Before building a system, platform, or website, I
              wanted to understand the likely cost, the effort involved, and
              the practical arrangements I would need to make.
            </p>

            <p>
              Even when I found useful websites, many were heavily loaded with
              advertisements. The pages felt cluttered, pop-ups interrupted the
              flow, and sometimes even finding the close button became an
              unnecessary task.
            </p>

            <p>
              In many cases, I also had to move between several different
              platforms just to understand one complete requirement. That takes
              time and breaks the connection between the idea in your mind and
              the decision you are trying to make.
            </p>

            <p>
              When you are building something, you want to understand the cost,
              compare your options, and make arrangements based on your actual
              needs. You should not have to fight through clutter before
              reaching the information you came for.
            </p>
          </div>
        </section>

        {/* PURPOSE */}
        <section className="mt-12 rounded-2xl border border-[#F2C94C] bg-[#F5FAF7] p-7 md:p-8">
          <p className="text-lg font-semibold leading-8 text-gray-950">
            I genuinely felt there should be one modern platform where people
            could explore practical AI, cloud, hosting, API, SaaS, capacity,
            and infrastructure costs in one place.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            The purpose of every Beeija tool is simple: save your time, protect
            your focus, and help you reach a clearer decision without diverting
            you from what you are trying to understand.
          </p>
        </section>

        {/* WHAT BEEIJA BUILDS */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-gray-950">
            Practical Simulators, Not Generic Calculators
          </h2>

          <div className="mt-6 space-y-5 leading-8 text-gray-600">
            <p>
              Beeija is not being built as a collection of generic cost
              calculators. The aim is to create practical cost simulators that
              reflect real pricing structures, usage patterns, limits, and
              decisions people face before building.
            </p>

            <p>
              This includes tools such as an AI Token Cost Calculator, Cloud
              Storage Cost Calculator, Server Cost Estimator, API Request Cost
              Calculator, SaaS Seat Cost Calculator, Bandwidth Cost Calculator,
              and technology comparison tools.
            </p>

            <p>
              Wherever reliable automation is available, Beeija will be
              designed to keep source pricing current as providers update their
              rates. Manual price overrides will remain available where needed,
              so the tools continue to be useful even when official pricing
              formats differ.
            </p>
          </div>
        </section>

        {/* ADS */}
        <section className="mt-12 rounded-2xl border border-[#F2C94C] bg-[#F5FAF7] p-7 md:p-8">
          <p className="text-lg font-semibold leading-8 text-gray-950">
            We will give you directly what you came for, without unnecessary
            hurdles or clutter.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Beeija will not fill pages with distracting pop-ups. A small,
            sensible advertisement may appear occasionally to support the
            platform, but it will never be allowed to take over the experience
            or waste your time.
          </p>
        </section>

        {/* YORYANTRA BRIDGE */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-gray-950">
            Before You Build, and While You Build
          </h2>

          <div className="mt-6 space-y-5 leading-8 text-gray-600">
            <p>
              Beeija is designed for the stage before building — estimating
              costs, comparing providers, understanding usage, and planning the
              technical path ahead.
            </p>

            <p>
              When you move into actual development and need practical tools
              for JSON, encoding, security, DevOps, SEO, API workflows, or
              technical troubleshooting, you can continue with{" "}
              <a
                href="https://yoryantra.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--green)] transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
              >
                Yoryantra
              </a>
              .
            </p>

            <p>
              Beeija helps you plan before you build. Yoryantra helps you while
              you build.
            </p>
          </div>
        </section>

        {/* NAME STORY */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-gray-950">
            The Meaning Behind Beeija
          </h2>

          <div className="mt-6 space-y-5 leading-8 text-gray-600">
            <p>
              The name Beeija came to me while I was thinking about beginnings,
              starting points, and the first step behind every meaningful
              outcome.
            </p>

            <p>
              Being a spiritual person, I often turn to the Srimad Bhagavad
              Gita when I am looking for clarity or direction. I wanted a name
              that felt meaningful, rooted, and still relevant in the modern
              world.
            </p>

            <p>
              “Beej” is a Sanskrit word meaning seed, beginning, or starting
              point. “Beeija” is a spelling variation inspired by that word.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-[#F2C94C] bg-[#F5FAF7] p-7 text-center md:p-8">
            <p className="text-2xl font-semibold text-[var(--green)]">
              Beeija
            </p>

            <p className="mt-2 text-lg font-medium text-gray-800">
              Seed today. Better outcomes tomorrow.
            </p>
          </div>
        </section>

        {/* ABOUT ME */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-gray-950">
            About Me
          </h2>

          <div className="mt-6 space-y-5 leading-8 text-gray-600">
            <p>
              I am Varoun Sonawane, an IT professional with seven years of
              experience in the IT industry.
            </p>

            <p>
              I passionately want to give back to society and help wherever I
              can in this universe. Even if it begins with something small,
              such as saving someone&apos;s time through a useful tool, I
              believe that small contribution still matters.
            </p>

            <p>
              You can find my contact details on the{" "}
              <Link
                href="/contact"
                className="font-semibold text-[var(--green)] transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
              >
                Contact page
              </Link>
              .
            </p>
          </div>
        </section>

        {/* CLOSING */}
        <section className="mt-14 border-t border-gray-200 pt-10">
          <p className="text-lg font-medium text-[var(--yellow-dark)]">
            Thank you &amp; Gratitude 🙏
          </p>
        </section>
      </section>
    </main>
  );
}

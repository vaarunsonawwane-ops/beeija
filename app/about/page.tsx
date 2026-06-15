import Link from "next/link";

export const metadata = {
  title: "About Beeija",

  description:
    "Learn why Beeija was created to make AI, cloud, API, SaaS, hosting, and infrastructure cost planning clearer and less cluttered.",

  alternates: {
    canonical: "https://beeija.com/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-950">
          About Beeija
        </h1>

        <div className="mt-8 space-y-5 text-base leading-8 text-gray-600">
          <p>
            Beeija is a practical platform for business owners, founders, CEOs,
            cloud architects, developers, and anyone who wants to understand
            the cost or effort involved before building a cloud platform,
            AI-powered product, website, application, or technical system.
          </p>

          <p>
            As a founder, I struggled to find clear answers for my own
            requirements. Before building a system, platform, or website, I
            wanted to understand the likely cost, the effort involved, and the
            practical arrangements I would need to make.
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
            needs. You should not have to fight through clutter before reaching
            the information you came for.
          </p>

          <div className="border-l-4 border-[#F2C94C] pl-5">
            <p className="text-gray-800">
              I genuinely felt there should be one modern platform where people
              could explore practical AI, cloud, hosting, API, SaaS, capacity,
              and infrastructure costs in one place.
            </p>
          </div>

          <p>
            Beeija is not being built as a collection of generic cost
            calculators. The aim is to create practical cost simulators that
            reflect real pricing structures, usage patterns, limits, and the
            decisions people face before building.
          </p>

          <p>
            This includes tools such as an AI Token Cost Calculator, Cloud
            Storage Cost Calculator, Server Cost Estimator, API Request Cost
            Calculator, SaaS Seat Cost Calculator, Bandwidth Cost Calculator,
            and technology comparison tools.
          </p>

          <p>
            Wherever reliable automation is available, Beeija will be designed
            to keep source pricing current as providers update their rates.
            Manual price overrides will remain available where needed.
          </p>

          <p>
            We will give you directly what you came for, without unnecessary
            hurdles or clutter.
          </p>

          <p>
            Beeija will not fill pages with distracting pop-ups. A small,
            sensible advertisement may appear occasionally to support the
            platform, but it will never be allowed to take over the experience
            or waste your time.
          </p>

          <p>
            Beeija is designed for the stage before building — estimating
            costs, comparing providers, understanding usage, and planning the
            technical path ahead.
          </p>

          <p>
            When you move into actual development and need practical tools for
            JSON, encoding, security, DevOps, SEO, APIs, or technical
            troubleshooting, you can continue with{" "}
            <a
              href="https://yoryantra.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--green)] hover:!text-[var(--yellow-dark)]"
            >
              Yoryantra
            </a>
            .
          </p>

          <p>
            Beeija helps you plan before you build. Yoryantra helps you while
            you build.
          </p>

          <p>
            The name Beeija came to me while I was thinking about beginnings,
            starting points, and the first step behind every meaningful
            outcome.
          </p>

          <p>
            Being a spiritual person, I often turn to the Srimad Bhagavad Gita
            when I am looking for clarity or direction. I wanted a name that
            felt meaningful, rooted, and still relevant in the modern world.
          </p>

          <p>
            “Beej” is a Sanskrit word meaning seed, beginning, or starting
            point. “Beeija” is a spelling variation inspired by that word.
          </p>

          <div className="border-l-4 border-[#F2C94C] pl-5">
            <p className="text-gray-800">
              Beeija — Seed today. Better outcomes tomorrow.
            </p>
          </div>

          <h2 className="pt-3 text-xl font-semibold text-gray-950">
            About Me
          </h2>

          <p>
            I am Varoun Sonawane, an IT professional with seven years of
            experience in the IT industry.
          </p>

          <p>
            I passionately want to give back to society and help wherever I can
            in this universe. Even if it begins with something small, such as
            saving someone&apos;s time through a useful tool, I believe that
            small contribution still matters.
          </p>

          <p>
            You can find my contact details on the{" "}
            <Link
              href="/contact"
              className="font-medium text-[var(--green)] hover:!text-[var(--yellow-dark)]"
            >
              Contact page
            </Link>
            .
          </p>

          <p className="pt-3 font-medium text-[var(--yellow-dark)]">
            Thank you &amp; Gratitude 🙏
          </p>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";

export const metadata = {
  title: "About",

  description:
    "Learn about Beeija, a practical platform for AI, cloud, hosting, API, SaaS, capacity, and infrastructure cost planning.",

  alternates: {
    canonical: "https://beeija.com/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-[900px] px-6 py-[70px]">
        <h1 className="mb-[45px] text-[34px] font-bold tracking-tight text-[#111] md:text-[42px]">
          About Beeija
        </h1>

        <div className="text-[17px] leading-[1.9] text-gray-600 md:text-[18px] [&>p]:mb-[26px]">
          <p>
            Beeija is a practical platform for business owners, founders, CEOs,
            cloud architects, developers, and anyone who wants to understand
            the cost or effort involved before building a cloud platform,
            AI-powered product, website, application, or technical system.
          </p>

          <p>
            Have you ever struggled to find clear answers for your requirements?
            Before building a system, platform, or website, you wanted to
            understand the likely cost, the effort involved, and the practical
            arrangements you would need to make. Even when you find useful
            websites, many would be heavily loaded with advertisements. The
            pages will feel cluttered, pop-ups interrupting the flow, and
            sometimes even finding the close button became an unnecessary task.
          </p>

          <p>
            In my case I have also faced the similar issue, I had to move
            between several different platforms just to understand one complete
            requirement. That takes time and breaks the connection between the
            idea in your mind and the decision you are trying to make.
          </p>

          <p>
            When you are building something, you want to understand the cost,
            compare your options, and make arrangements based on your actual
            needs. You should not have to fight through clutter before reaching
            the information you came for.
          </p>

          <div className="my-[40px] rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] p-[26px]">
            <p className="text-gray-800">
              I genuinely felt there should be one modern platform where people
              could explore practical AI, cloud, hosting, API, SaaS, capacity,
              and infrastructure costs in one place.
            </p>
          </div>

          <p>
            At Beeija, we are not a collection of generic cost calculators. The
            aim is to create practical cost simulators that reflect real pricing
            structures, usage patterns, limits, and the decisions people face
            before building.
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
            You will directly get what you came for, without unnecessary
            hurdles or clutter. We will not fill pages with distracting
            pop-ups. In a subtle way we might just show you very minimal ad and
            that too only for our survival.
          </p>

          <p>
            Beeija is designed for the stage before building — estimating
            costs, comparing providers, understanding usage, and planning the
            technical path ahead.
          </p>

          <p>
            When you move into actual development and need practical tools for
            JSON, encoding, security, DevOps, SEO, APIs, or technical
            troubleshooting, you can continue with our very own webstie{" "}
            <a
              href="https://yoryantra.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--yellow-dark)] transition-colors duration-200"
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
            The name{" "}
            <span className="font-medium text-[var(--yellow-dark)]">
              Beeija
            </span>{" "}
            came to me while I was thinking about beginnings, starting points,
            and the first step behind every meaningful outcome.
          </p>

          <p>
            Being a spiritual person, I often turn to the{" "}
            <span className="font-medium text-[var(--yellow-dark)]">
              SRIMAD BHAGAVAD GITA
            </span>{" "}
            when I am looking for clarity or direction. I wanted a name that
            felt meaningful, rooted, and still relevant in the modern world.
          </p>

          <p>
            <strong className="font-semibold text-gray-950">“Beej”</strong> is
            a Sanskrit word meaning “seed”, “beginning”, or “starting point”.
            <strong className="font-semibold text-gray-950">
              “Beeija”
            </strong>{" "}
            is a spelling variation inspired by that word.
          </p>

          <div className="my-[40px] rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] p-[26px]">
            <p className="text-gray-800">
              Beeija — Seed today. Better outcomes tomorrow.
            </p>
          </div>

          <h2 className="mb-[30px] mt-[55px] text-[28px] font-bold text-[#111] md:text-[32px]">
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
              className="font-medium text-[var(--yellow-dark)] transition-colors duration-200"
            >
              Contact
            </Link>{" "}
            page.
          </p>

          <p className="mt-[60px] text-[22px] font-bold text-[#111]">
            Thank you &amp; Gratitude 🙏
          </p>
        </div>
      </section>
    </main>
  );
}

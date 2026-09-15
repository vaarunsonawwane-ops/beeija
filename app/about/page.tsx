import Link from "next/link";

export const metadata = {
  title: "About",

  description:
    "Learn about Beeija, why it was created, and the thinking behind its practical cost-planning tools.",

  alternates: {
    canonical: "https://beeija.com/about",
  },

  openGraph: {
    title: "About Beeija",
    description:
      "Learn about Beeija, why it was created, and the thinking behind its practical cost-planning tools.",
    url: "https://beeija.com/about",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "About Beeija",
    description:
      "Learn about Beeija, why it was created, and the thinking behind its practical cost-planning tools.",
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
            Beeija is a practical platform for business owners, founders, CEOs, cloud
            architects, developers, and anyone who wants to understand the cost or
            effort involved in building, running, or scaling a cloud platform,
            AI-powered product, website, application, or technical system.
          </p>

          <p>
            Have you ever struggled to find clear answers for your requirements?
            Before building a system, platform, or website, you may want to
			understand the likely cost, the effort involved, and the practical
            arrangements you would need to make. Even when you find useful
            websites, many are heavily loaded with advertisements. The
            pages feel cluttered, pop-ups interrupt the flow, and sometimes
            even finding the close button becomes an unnecessary task.
          </p>

          <p>
            I have faced a similar issue myself. I had to move between several
            different platforms just to understand one complete requirement.
            That takes time and breaks the connection between the idea in your
			mind and the decision you are trying to make.
          </p>

          <p>
            When you are building something, you want to understand the cost,
            compare your options, and make arrangements based on your actual
            needs. You should not have to fight through clutter before reaching
            the information you came for.
          </p>

          <div className="my-[40px] rounded-none border-l-4 border-[#F2C94C] bg-[#F5FAF7] p-[26px]">
            <p className="text-gray-800">
              I genuinely felt there should be one modern platform where people
              could explore practical technology costs, compare their options,
              and understand the decisions behind those costs in one place.
            </p>
          </div>

          <p>
            Beeija is built around practical cost-planning tools that reflect real pricing
            structures, usage patterns, limits, and the decisions people face while
            planning, building, running, or scaling.
          </p>

          <p>
            Over time, this can include tools for AI, cloud, hosting, APIs, SaaS,
            bandwidth, capacity, and technology comparison.
          </p>

          <p>
            Where provider pricing is built into a tool, Beeija is designed to show when
            those rates were checked and to keep rates editable where pricing can vary
            or change.
          </p>

			<p>
			  You can read more about this on the{" "}
			  <Link
				href="/how-beeija-tools-are-built"
				className="font-medium text-[var(--yellow-dark)] transition-colors duration-200"
			  >
				How Beeija Tools Are Built
			  </Link>{" "}
			  page.
			</p>


          <p>
            The aim is to help you get what you came for without unnecessary
            hurdles or clutter. We will not fill pages with distracting
            pop-ups. We might show a small number of ads, only to help keep the website running.
          </p>

			<p>
			  When you need practical tools for JSON, encoding, security, DevOps, SEO,
			  APIs, or technical troubleshooting, you can also use our very own website{" "}
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
			  Beeija helps you understand the cost side of building, running, and scaling.
			  Yoryantra helps you work through the technical side.
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

          <div className="my-[40px] rounded-none border-l-4 border-[#F2C94C] bg-[#F5FAF7] p-[26px]">
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

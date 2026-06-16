import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "AI Cost Calculators",
);

const featuredTools = categoryTools.slice(0, 6);

export const metadata: Metadata = {
  title: "AI Cost Calculators for Tokens, Models & APIs | Beeija",

  description:
    "Estimate AI token costs, model pricing, API usage, embeddings, image generation, audio, and monthly AI spending with simple planning calculators.",

  keywords: [
    "AI cost calculator",
    "AI token cost calculator",
    "AI API cost calculator",
    "LLM cost calculator",
    "OpenAI API cost calculator",
    "AI model pricing calculator",
    "AI inference cost calculator",
    "embedding cost calculator",
    "AI image generation cost calculator",
    "speech to text cost calculator",
    "text to speech cost calculator",
    "monthly AI cost calculator",
    "AI pricing calculator",
    "AI usage cost estimator",
    "generative AI cost calculator",
  ],

  alternates: {
    canonical: "https://beeija.com/categories/ai-cost-calculators",
  },

  openGraph: {
    title: "AI Cost Calculators for Tokens, Models & APIs | Beeija",

    description:
      "Estimate token use, model prices, API requests, embeddings, images, audio, and monthly AI costs before you build.",

    url: "https://beeija.com/categories/ai-cost-calculators",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "AI Cost Calculators for Tokens, Models & APIs | Beeija",

    description:
      "Use simple calculators to estimate AI token, model, API, image, audio, and embedding costs.",
  },
};

export default function CategoryPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* BREADCRUMB */}
        <div className="mb-10 flex items-center text-sm text-gray-500">
          <Link
            href="/"
            className="transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <Link
            href="/categories"
            className="transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
          >
            Categories
          </Link>

          <span className="mx-2">/</span>

          <span className="text-gray-900">AI Cost Calculators</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            AI Cost Calculators for Tokens, Models, APIs, Images, and Audio
          </h1>

          <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
            Estimate the cost of AI models, token use, API requests, embeddings,
            image generation, speech, and other AI services before you build or
            scale a product.
          </p>
        </div>

        {/* INTRO CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-base font-semibold text-gray-950">
              Plan AI Costs Before Usage Grows
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Test token volume, request count, model choice, and other billing
              units before a small AI feature becomes a large monthly cost.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-base font-semibold text-gray-950">
              Useful for Real AI Products
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Plan costs for chatbots, assistants, search tools, support tools,
              image features, voice tools, and other AI-based products.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-base font-semibold text-gray-950">
              Compare Models and Providers
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Use the same workload to compare model prices, provider rates, and
              possible monthly costs without reading long pricing tables.
            </p>
          </article>
        </div>

        {/* FEATURED TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Popular AI Cost Calculators
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
              Start with tools for token cost, AI APIs, model use, inference,
              embeddings, images, audio, and monthly workload planning.
            </p>
          </div>

          {featuredTools.length > 0 ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-base font-semibold text-gray-950 transition-colors duration-200 group-hover:text-[var(--green)]">
                    {tool.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {tool.description}
                  </p>

                  <p className="mt-5 text-sm font-medium text-[var(--yellow-dark)]">
                    Open tool →
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-7 rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
              Tools in this category will appear automatically as they are
              created.
            </p>
          )}
        </section>

        {/* ALL TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              All AI Cost Calculators
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
              Browse every AI cost tool for tokens, models, requests, inference,
              embeddings, images, audio, and other running costs.
            </p>
          </div>

          {categoryTools.length > 0 ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-base font-semibold text-gray-950">
                    {tool.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-7 rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
              No tools have been published in this category yet.
            </p>
          )}
        </section>

        {/* PRACTICAL PLANNING */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Planning AI Costs Before You Build
          </h2>

          <div className="mt-5 max-w-4xl space-y-4 text-sm leading-relaxed text-gray-600 md:text-base">
            <p>
              AI pricing often looks simple because a provider may show one
              price for input tokens and another price for output tokens. The
              final bill can still be hard to predict because real products use
              many requests, different prompt sizes, longer answers, retries,
              tools, images, audio, and stored data.
            </p>

            <p>
              A useful estimate starts with the real workload. You may need to
              know how many users will use the feature, how many requests each
              user may send, how long the prompts may be, and how much output
              the model may return.
            </p>

            <p>
              Beeija calculators are made to turn those inputs into a simple
              estimate. You can test a small launch, a normal month, and a busy
              month before choosing a model or provider.
            </p>
          </div>
        </section>

        {/* PRICING UNITS */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Common AI Pricing Units You May Need to Calculate
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-950">
                Input Tokens
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Input tokens include the prompt, system message, chat history,
                tool instructions, and other text sent to the model.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-950">
                Output Tokens
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Output tokens are the words and other content returned by the
                model. Longer answers usually cost more.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-950">
                API Requests
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Request count helps turn the cost of one AI action into a daily
                or monthly estimate.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-950">
                Embeddings
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Embedding cost may depend on the amount of text added, updated,
                or searched in a vector database.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-950">
                Images and Video
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Image and video pricing may change by size, quality, duration,
                model, or number of outputs.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-950">
                Audio and Speech
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Speech-to-text and text-to-speech services may charge by audio
                minute, character count, token use, or request.
              </p>
            </article>
          </div>
        </section>

        {/* USE CASES */}
        <section className="mt-16 rounded-2xl border border-gray-200 bg-white p-7 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-950">
            Small AI Cost Questions These Tools Help Simplify
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-600 md:text-base">
            AI pricing can change with token length, model choice, request
            volume, images, audio, embeddings, and other billing units. These
            tools help you test those numbers before you spend money.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate input and output token costs before launching an AI feature.",
              "Compare the same workload across different AI models.",
              "Estimate monthly AI API spending from users and requests.",
              "Calculate embedding costs for search and RAG systems.",
              "Estimate image generation costs for content and design work.",
              "Estimate speech-to-text and text-to-speech API costs.",
              "See how longer answers may increase model costs.",
              "Test future AI spending at higher usage levels.",
            ].map((item) => (
              <div
                key={item}
                className="border-l-4 border-[#F2C94C] bg-white px-4 py-3"
              >
                <p className="text-sm leading-relaxed text-gray-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* WHO IT HELPS */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Who Can Use AI Cost Calculators
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-950">
                Founders and Business Owners
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Check whether an AI feature can fit the budget before hiring,
                building, or signing up for a paid service.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-950">
                Developers and Product Teams
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Estimate the running cost of prompts, model calls, embeddings,
                images, voice, and other AI parts during planning.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-950">
                Cloud and AI Architects
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Compare model and provider choices while planning workload,
                scale, reliability, and total system cost.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-950">
                Agencies and Consultants
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Prepare simple cost ranges for client projects before the final
                scope and usage are known.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-950">
                Finance and FinOps Teams
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Build early cost estimates and compare them with real usage as
                the AI product grows.
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-950">
                Students and Independent Builders
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Understand how AI services are billed before using them in a
                personal project, demo, or early product.
              </p>
            </article>
          </div>
        </section>

        {/* EXAMPLE */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            A Simple AI Cost Planning Example
          </h2>

          <div className="mt-5 max-w-4xl space-y-4 text-sm leading-relaxed text-gray-600 md:text-base">
            <p>
              Imagine a support chatbot with 2,000 users. Each user sends 10
              messages in a month. Every message includes an average input of
              800 tokens and an average output of 300 tokens.
            </p>

            <p>
              A calculator can turn those numbers into total monthly input
              tokens, total monthly output tokens, and the estimated cost for
              each model you want to compare.
            </p>

            <p>
              You can then test a larger case, such as 5,000 users or longer
              answers, to see how the bill may change before the product grows.
            </p>
          </div>
        </section>

        {/* WHY MATTERS */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Why AI Cost Planning Matters
          </h2>

          <div className="mt-5 max-w-4xl space-y-4 text-sm leading-relaxed text-gray-600 md:text-base">
            <p>
              AI pricing may look simple at first, but the final cost can depend
              on tokens, models, requests, images, audio, embeddings, tools, and
              other billing units.
            </p>

            <p>
              Small changes in answer length, request count, model choice, or
              user growth can change the monthly bill. A clear estimate helps
              you compare options before those costs become part of the product.
            </p>

            <p>
              Cost is only one part of the decision. Quality, speed, context
              size, reliability, privacy, and provider limits may also matter.
              Beeija calculators help with the cost side so you can make a
              better overall choice.
            </p>
          </div>
        </section>

        {/* ESTIMATE LIMITS */}
        <section className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-7 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-950">
            What Can Change the Final AI Bill
          </h2>

          <div className="mt-5 max-w-4xl space-y-4 text-sm leading-relaxed text-gray-600 md:text-base">
            <p>
              Calculator results are planning estimates. The final bill may be
              different because providers can change prices, billing rules,
              discounts, free limits, taxes, or service fees.
            </p>

            <p>
              Real usage may also include retries, failed requests, long chat
              history, tool calls, cached tokens, batch pricing, data storage,
              vector databases, cloud services, or other costs outside the main
              model price.
            </p>

            <p>
              Always check the latest official provider pricing before making a
              final budget or purchase decision.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Frequently Asked Questions
          </h2>

          <div className="mt-7 space-y-7">
            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                What is an AI cost calculator?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                An AI cost calculator estimates spending for tokens, models,
                API requests, images, audio, embeddings, and other paid AI
                services.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                How do I estimate AI API costs?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Start with the model price, number of requests, and average
                input and output tokens. A calculator can then show the cost per
                request, day, month, or user.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                What is the difference between input and output token cost?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Input cost covers the text sent to the model. Output cost covers
                the text returned by the model. Providers may charge different
                rates for each.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                Can I compare AI model prices?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Yes. Use the same request and token numbers across different
                models to compare possible costs for one workload.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                How can I estimate monthly AI costs?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Estimate requests per user, number of users, average input and
                output size, and any extra services. Then calculate the total
                for a normal month and a high-usage month.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                Do embeddings add extra cost?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Yes. Creating embeddings can add cost based on the amount of
                text processed. Vector database storage and search may also add
                separate costs.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                Are image and audio costs calculated like token costs?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Not always. Image pricing may depend on size, quality, or model.
                Audio pricing may depend on minutes, characters, tokens, or
                requests.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                Are AI cost estimates exact?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                No. They are planning estimates. The final bill may change
                because of updated prices, discounts, taxes, retries, extra
                services, or actual usage.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                How often should I check AI pricing?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Check official pricing before launch, before a large increase in
                usage, and whenever you compare a new model or provider.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                Do these tools upload my data?
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Most Beeija tools run in your browser. Your inputs are not
                uploaded unless a tool clearly says that it needs an external
                price or URL check.
              </p>
            </div>
          </div>
        </section>

        {/* RELATED */}
        <section className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-semibold text-gray-950">
            Related Tool Categories
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/categories/cloud-cost-calculators"
              className="beeija-btn-outline"
            >
              Cloud Cost Calculators
            </Link>

            <Link
              href="/categories/hosting-infrastructure-calculators"
              className="beeija-btn-outline"
            >
              Hosting & Infrastructure Calculators
            </Link>

            <Link
              href="/categories/api-saas-cost-calculators"
              className="beeija-btn-outline"
            >
              API & SaaS Cost Calculators
            </Link>

            <Link
              href="/categories/capacity-usage-calculators"
              className="beeija-btn-outline"
            >
              Capacity & Usage Calculators
            </Link>

            <Link
              href="/categories/technology-comparison-tools"
              className="beeija-btn-outline"
            >
              Technology Comparison Tools
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

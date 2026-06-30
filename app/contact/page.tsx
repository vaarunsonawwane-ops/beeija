export const metadata = {
  title: "Contact",

  description:
    "Contact Beeija for feedback, suggestions, bugs, pricing updates, or general questions.",

  alternates: {
    canonical: "https://beeija.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-gray-950">
        Contact
      </h1>

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-gray-600">
        <p>
          If you found something broken, noticed an outdated price, have a
          suggestion, or want to share feedback, feel free to get in touch.
        </p>

        <p>
          Beeija is growing carefully, and helpful feedback is always
          appreciated.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-[var(--light-bg)] p-6">
        <p className="text-sm font-semibold text-gray-900">
          Contact
        </p>

        <p className="mt-2 text-gray-700">
          Varoun Sonawane
        </p>

        <a
          href="mailto:contactbeeija@gmail.com"
          className="mt-2 inline-block break-all text-gray-700 transition-colors duration-200 hover:text-[var(--yellow-dark)]"
        >
          contactbeeija@gmail.com
        </a>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Beeija tools and website usage.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

      <div className="space-y-6 text-gray-700 leading-8">
        <p>
          Beeija respects your privacy and is committed to keeping your data
          safe.
        </p>

        <p>
          Most tools on this website process data directly in your browser.
          Your input is not stored or sent to any server.
        </p>

        <p>
          We use Google Analytics to understand general website usage and improve Beeija.
          Most calculator inputs are processed directly in your browser and are not stored by Beeija.
        </p>

        <p>
          We do not sell, rent, or share user data with third parties.
        </p>
      </div>
    </div>
  );
}

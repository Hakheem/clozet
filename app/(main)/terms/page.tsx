import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Terms of Service — Lukuu",
  description: "Read Lukuu's terms of service before using our platform.",
};

const LAST_UPDATED = "April 1, 2026";

const sections = [
  {
    number: "01",
    title: "Acceptance of Terms",
    content: `By accessing or using Lukuu — including our website, mobile app, or any related services — you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform. These terms apply to all users, including buyers, sellers, and visitors.`,
  },
  {
    number: "02",
    title: "User Accounts",
    content: `You must create an account to access certain features of Lukuu. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You must be at least 18 years old to create an account. Lukuu reserves the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    number: "03",
    title: "Seller Responsibilities",
    content: `Sellers on Lukuu agree to provide accurate, truthful descriptions and images of all listed products. All items must be authentic — counterfeit or misrepresented goods are strictly prohibited. Sellers are responsible for fulfilling orders promptly, handling returns in accordance with their stated policy, and maintaining professional communication with buyers. Lukuu reserves the right to remove listings or suspend seller accounts that violate these standards. Sellers are solely responsible for applicable taxes on their sales.`,
  },
  {
    number: "04",
    title: "Buyer Responsibilities",
    content: `Buyers agree to complete purchases in good faith and honour all confirmed orders. Payment information provided must be accurate and authorised for use. Disputes with sellers should first be attempted to be resolved directly; Lukuu provides a dispute resolution process as a last resort. Buyers may not abuse return or chargeback processes. Any attempts to defraud sellers or Lukuu will result in immediate account termination and may be reported to relevant authorities.`,
  },
  {
    number: "05",
    title: "Prohibited Activities",
    content: `You agree not to use Lukuu for any unlawful purpose or in any way that could damage, disable, overburden, or impair the platform. Prohibited activities include: listing counterfeit, stolen, or illegal goods; engaging in price manipulation or shill bidding; harvesting user data without consent; sending unsolicited communications; attempting to gain unauthorised access to other accounts or systems; and any form of harassment, abuse, or hate speech toward other users.`,
  },
  {
    number: "06",
    title: "Intellectual Property",
    content: `All content on Lukuu — including logos, design, text, graphics, and software — is the property of Lukuu or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any Lukuu content without explicit written permission. By uploading content to Lukuu (such as product images or descriptions), you grant Lukuu a non-exclusive, royalty-free licence to use that content in connection with operating and promoting the platform.`,
  },
  {
    number: "07",
    title: "Fees & Payments",
    content: `Lukuu charges a platform fee on each completed transaction. Current fee structures are displayed in your seller dashboard and are subject to change with reasonable notice. Payouts to sellers are processed according to the schedule outlined in your account settings. Lukuu uses secure third-party payment processors and does not store full payment card details. All fees are non-refundable unless otherwise stated or required by applicable law.`,
  },
  {
    number: "08",
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by law, Lukuu shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the platform. Lukuu acts as a marketplace facilitator and is not responsible for the quality, safety, legality, or availability of items listed by sellers. Our total liability to you for any claim arising from use of the platform shall not exceed the fees paid by you to Lukuu in the three months preceding the claim.`,
  },
  {
    number: "09",
    title: "Termination",
    content: `Lukuu reserves the right to suspend or permanently terminate your account at our sole discretion, with or without notice, for conduct that we determine violates these terms or is harmful to other users, Lukuu, or third parties. You may terminate your account at any time by contacting our support team. Upon termination, your right to use the platform ceases immediately. Sections of these terms that by their nature should survive termination will remain in effect.`,
  },
  {
    number: "10",
    title: "Governing Law",
    content: `These Terms of Service shall be governed by and construed in accordance with applicable laws. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction. If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.`,
  },
  {
    number: "11",
    title: "Changes to Terms",
    content: `Lukuu reserves the right to update or modify these Terms of Service at any time. We will notify users of significant changes via email or a prominent notice on the platform. Your continued use of Lukuu following the posting of changes constitutes acceptance of the updated terms. We encourage you to review these terms periodically.`,
  },
  {
    number: "12",
    title: "Contact Us",
    content: `If you have any questions, concerns, or requests regarding these Terms of Service, please reach out to our team. We are committed to addressing your enquiries promptly and transparently. You can contact us through the support section of your account dashboard or via our official contact page.`,
  },
];

export default function TermsPage() {
  return (
    <Container>
      <div className="max-w-3xl mx-auto py-16 md:py-24">

        {/* Header */}
        <div className="mb-14 border-b border-border pb-10">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] font-semibold mb-3 text-accent">
            — Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-light title mb-4">
            Terms of Service<span className="text-gold">.</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
            Please read these terms carefully before using Lukuu. By accessing our platform, you agree to be bound by the conditions outlined below.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.number} className="group">
              <div className="flex items-start gap-5">
                <span className="text-[0.65rem] font-mono text-muted-foreground/50 mt-1.5 select-none shrink-0 w-6">
                  {section.number}
                </span>
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-foreground mb-3 tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
              <div className="mt-8 border-b border-border/50" />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-14 p-6 rounded-xl border border-border bg-muted/30">
          <p className="text-xs text-muted-foreground leading-relaxed">
            These terms were last reviewed and updated on {LAST_UPDATED}. For questions or concerns, visit your account dashboard or our{" "}
            <Link href="/contact" className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity">
              contact page
            </Link>
            . You may also review our{" "}
            <Link href="/privacy" className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

      </div>
    </Container>
  );
}


import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Privacy Policy — Lukuu",
  description: "Learn how Lukuu collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "April 1, 2026";

const sections = [
  {
    number: "01",
    title: "Information We Collect",
    content: `We collect information you provide directly when you create an account, make or fulfil a purchase, or contact us for support. This includes your name, email address, phone number, shipping address, and payment details (processed securely via our payment partners — we do not store full card numbers). We also automatically collect certain technical data when you use Lukuu, such as your IP address, browser type, device identifiers, and usage patterns, to help us maintain and improve the platform.`,
  },
  {
    number: "02",
    title: "How We Use Your Information",
    content: `Your information is used to operate and improve Lukuu — including processing transactions, facilitating communication between buyers and sellers, preventing fraud, and providing customer support. We may use your email address to send transactional messages (order confirmations, shipping updates) and, with your consent, marketing communications about new features or promotions. You can opt out of marketing emails at any time via the unsubscribe link in each message.`,
  },
  {
    number: "03",
    title: "Sharing of Information",
    content: `We do not sell your personal data. We share your information only in limited circumstances: with sellers to fulfil your orders (e.g. your shipping address); with trusted service providers who assist us in operating the platform (payment processors, logistics partners, analytics tools) under strict confidentiality agreements; and when required by law or to protect the rights, property, or safety of Lukuu, our users, or the public. Any third parties we work with are contractually required to protect your data.`,
  },
  {
    number: "04",
    title: "Cookies & Tracking",
    content: `Lukuu uses cookies and similar tracking technologies to enhance your experience, remember your preferences, and understand how users interact with the platform. Essential cookies are necessary for the platform to function. Analytics and preference cookies help us improve the experience. You can manage cookie preferences through your browser settings, though disabling certain cookies may affect platform functionality. We do not use cookies to serve third-party advertising.`,
  },
  {
    number: "05",
    title: "Data Retention",
    content: `We retain your personal data for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements. If you delete your account, we will remove your personal information from our active databases within a reasonable period, though some data may be retained in backups or as required by law. Transaction records may be retained for accounting and legal compliance purposes.`,
  },
  {
    number: "06",
    title: "Data Security",
    content: `We implement industry-standard security measures to protect your personal information from unauthorised access, alteration, disclosure, or destruction. This includes SSL/TLS encryption for data in transit, secure data storage practices, and access controls limiting who within Lukuu can access personal data. While we take reasonable precautions, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    number: "07",
    title: "Your Rights",
    content: `You have the right to access, update, or delete your personal information at any time through your account settings. You may also request a copy of the data we hold about you, or ask us to restrict how we use it. If you believe we have processed your data unlawfully, you have the right to raise a complaint with the relevant data protection authority. To exercise any of these rights, contact us through your account dashboard or our support team.`,
  },
  {
    number: "08",
    title: "Children's Privacy",
    content: `Lukuu is not directed at or intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal information, please contact us immediately and we will take steps to delete such information and terminate the relevant account.`,
  },
  {
    number: "09",
    title: "Third-Party Links",
    content: `Lukuu may contain links to third-party websites or services. This Privacy Policy does not apply to those external sites, and we are not responsible for their privacy practices. We encourage you to read the privacy policies of any third-party sites you visit. The inclusion of a link does not imply our endorsement of that site or its practices.`,
  },
  {
    number: "10",
    title: "International Data Transfers",
    content: `Lukuu operates globally and your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. Where we transfer data internationally, we take steps to ensure appropriate safeguards are in place to protect your information in accordance with applicable law.`,
  },
  {
    number: "11",
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by email or via a prominent notice on the platform before they take effect. The date at the top of this page indicates when the policy was last revised. Your continued use of Lukuu after changes are posted constitutes your acceptance of the updated policy.`,
  },
  {
    number: "12",
    title: "Contact Us",
    content: `If you have any questions, concerns, or requests relating to this Privacy Policy or the handling of your personal data, please contact us through your account dashboard or our official contact page. We are committed to addressing all privacy-related enquiries within a reasonable timeframe.`,
  },
];

export default function PrivacyPage() {
  return (
    <Container>
      <div className="max-w-3xl mx-auto py-16 md:py-24">

        {/* Header */}
        <div className="mb-14 border-b border-border pb-10">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] font-semibold mb-3 text-accent">
            — Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-light title mb-4">
            Privacy Policy<span className="text-gold">.</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
            Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we use and protect it.
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
            This policy was last reviewed and updated on {LAST_UPDATED}. For questions about your data, visit your account dashboard or our{" "}
            <Link href="/contact" className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity">
              contact page
            </Link>
            . You may also review our{" "}
            <Link href="/terms" className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity">
              Terms of Service
            </Link>
            .
          </p>
        </div>

      </div>
    </Container>
  );
}


export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose prose-zinc max-w-none">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Acceptance of Terms</h2>
                <p>By accessing and using Lukuu, you accept and agree to be bound by the terms and provision of this agreement.</p>

                <h2>2. User Accounts</h2>
                <p>You are responsible for maintaining the confidentiality of your account and password.</p>

                <h2>3. Seller Responsibilities</h2>
                <p>Sellers must provide accurate product information and fulfill orders promptly.</p>

                <h2>4. Prohibited Activities</h2>
                <p>You agree not to engage in any unlawful activities on our platform.</p>

                <h2>5. Termination</h2>
                <p>We reserve the right to terminate accounts that violate these terms.</p>

                <h2>6. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us.</p>
            </div>
        </div>
    );
}
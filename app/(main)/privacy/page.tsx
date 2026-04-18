export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose prose-zinc max-w-none">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account or make a purchase.</p>

                <h2>2. How We Use Your Information</h2>
                <p>We use the information to provide, maintain, and improve our services.</p>

                <h2>3. Information Sharing</h2>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.</p>

                <h2>4. Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information.</p>

                <h2>5. Your Rights</h2>
                <p>You have the right to access, update, or delete your personal information.</p>

                <h2>6. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us.</p>
            </div>
        </div>
    );
}
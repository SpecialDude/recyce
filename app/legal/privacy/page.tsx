import Link from 'next/link'
import Image from 'next/image'

export default function PrivacyPolicyPage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
            {/* Navigation */}
            <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e9ecef', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <Image src="/recyce-logo.png" alt="Recyce" width={140} height={47} style={{ height: 'auto', width: '140px' }} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <article style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#212529', marginBottom: '0.5rem' }}>
                    Privacy Policy
                </h1>
                <p style={{ color: '#6c757d', marginBottom: '3rem' }}>Last updated: January 1, 2026</p>

                <div style={{ color: '#495057', lineHeight: 1.8, fontSize: '1rem' }}>
                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>1. Information We Collect</h2>
                        <p style={{ marginBottom: '1rem' }}>We collect information you provide directly to us, such as when you create an account, request a quote, sell a device, or contact us for support.</p>
                        <p><strong>Personal Information:</strong> Name, email address, phone number, mailing address, payment information.</p>
                        <p><strong>Device Information:</strong> Device type, model, condition, serial numbers (for verification purposes only).</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
                        <ul style={{ marginLeft: '1.5rem' }}>
                            <li>Process transactions and send related information</li>
                            <li>Provide customer support</li>
                            <li>Send promotional communications (you can opt out anytime)</li>
                            <li>Improve our services and develop new features</li>
                            <li>Detect and prevent fraud</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>3. Data Security</h2>
                        <p>We implement industry-standard security measures to protect your personal information. All data is encrypted in transit and at rest. Device data is securely wiped following NIST 800-88 guidelines.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>4. Information Sharing</h2>
                        <p>We do not sell your personal information. We may share information with:</p>
                        <ul style={{ marginLeft: '1.5rem' }}>
                            <li>Service providers who assist in our operations</li>
                            <li>Payment processors to complete transactions</li>
                            <li>Shipping carriers to deliver packages</li>
                            <li>Law enforcement when required by law</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>5. Your Rights</h2>
                        <p>You have the right to access, correct, or delete your personal information. Contact us at privacy@recyce.com to exercise these rights.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>6. Contact Us</h2>
                        <p>If you have questions about this Privacy Policy, please contact us at:</p>
                        <p style={{ marginTop: '1rem' }}>
                            <strong>Recyce, Inc.</strong><br />
                            123 Green Street<br />
                            Eco City, EC 12345<br />
                            privacy@recyce.com
                        </p>
                    </section>
                </div>
            </article>

            {/* Footer */}
            <footer style={{ backgroundColor: '#212529', color: '#ffffff', padding: '3rem 2rem' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
                    <Image src="/recyce-logo.png" alt="Recyce" width={120} height={40} style={{ filter: 'brightness(0) invert(1)', marginBottom: '1rem' }} />
                    <p style={{ color: '#adb5bd', fontSize: '0.875rem' }}>© 2026 Recyce. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

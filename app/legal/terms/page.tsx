import Link from 'next/link'
import Image from 'next/image'

export default function TermsOfServicePage() {
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
                    Terms of Service
                </h1>
                <p style={{ color: '#6c757d', marginBottom: '3rem' }}>Last updated: January 1, 2026</p>

                <div style={{ color: '#495057', lineHeight: 1.8, fontSize: '1rem' }}>
                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
                        <p>By accessing or using Recyce's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>2. Description of Service</h2>
                        <p>Recyce provides a platform for selling used electronic devices. We offer instant quotes, free shipping, and fast payment for devices in various conditions.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>3. Eligibility</h2>
                        <p>You must be at least 18 years old and legally capable of entering into contracts to use our services. By using Recyce, you represent that you meet these requirements.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>4. Device Ownership</h2>
                        <p>You represent and warrant that:</p>
                        <ul style={{ marginLeft: '1.5rem' }}>
                            <li>You are the rightful owner of any device you sell to us</li>
                            <li>The device is not stolen or associated with any fraudulent activity</li>
                            <li>The device is not subject to any liens or encumbrances</li>
                            <li>You have removed all personal data and account locks</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>5. Quotes and Pricing</h2>
                        <p>Quotes are based on the information you provide about your device's condition. Final payment may be adjusted based on physical inspection. If the inspected value differs significantly, you may choose to accept the revised offer or have your device returned at no cost.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>6. Payment</h2>
                        <p>Upon acceptance of your device, payment will be processed within 1-2 business days via your selected payment method. Available methods include PayPal, direct deposit, and check.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>7. Limitation of Liability</h2>
                        <p>Recyce shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>8. Changes to Terms</h2>
                        <p>We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>9. Contact</h2>
                        <p>For questions about these Terms, contact us at legal@recyce.com.</p>
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

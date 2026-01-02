import Link from 'next/link'
import Image from 'next/image'

const quickLinks = [
    { label: 'Start Selling', href: '/sell' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About Us', href: '/about' },
]

const supportLinks = [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Blog', href: '/blog' },
]

const legalLinks = [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Cookie Policy', href: '/legal/cookies' },
]

export function PublicFooter() {
    const currentYear = new Date().getFullYear()

    return (
        <footer style={{ backgroundColor: '#212529', color: '#ffffff', padding: '4rem 0 2rem' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    {/* Brand Column */}
                    <div>
                        <Image
                            src="/recyce-logo.png"
                            alt="Recyce"
                            width={140}
                            height={47}
                            style={{ marginBottom: '1rem', filter: 'brightness(0) invert(1)' }}
                        />
                        <p style={{ color: '#adb5bd', fontSize: '0.938rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                            Electronic Recycling Made Easy. Turn your old devices into cash while helping the environment.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} style={{ color: '#adb5bd', fontSize: '0.938rem', textDecoration: 'none', transition: 'color 0.2s' }}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>Support</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {supportLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} style={{ color: '#adb5bd', fontSize: '0.938rem', textDecoration: 'none', transition: 'color 0.2s' }}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>Legal</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} style={{ color: '#adb5bd', fontSize: '0.938rem', textDecoration: 'none', transition: 'color 0.2s' }}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid #495057',
                    paddingTop: '2rem',
                    textAlign: 'center',
                    color: '#adb5bd',
                    fontSize: '0.875rem'
                }}>
                    <p>&copy; {currentYear} Recyce. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

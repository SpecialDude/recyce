'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

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

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    const [hovered, setHovered] = useState(false)

    return (
        <Link
            href={href}
            style={{
                color: hovered ? '#1ab35d' : '#adb5bd',
                fontSize: '0.938rem',
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                transform: hovered ? 'translateX(4px)' : 'translateX(0)'
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </Link>
    )
}

export function PublicFooter() {
    const currentYear = new Date().getFullYear()

    return (
        <footer style={{
            backgroundColor: '#1a1f25',
            color: '#ffffff',
            padding: '4rem 0 2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
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
                            width={130}
                            height={47}
                            style={{ marginBottom: '1.25rem', filter: 'brightness(0) invert(1)', opacity: 0.95 }}
                        />
                        <p style={{
                            color: 'rgba(173, 181, 189, 0.9)',
                            fontSize: '0.938rem',
                            lineHeight: 1.7,
                            marginBottom: '1.5rem',
                            maxWidth: '280px'
                        }}>
                            Electronic Recycling Made Easy. Turn your old devices into cash while helping the environment.
                        </p>

                        {/* Newsletter hint */}
                        <div style={{
                            padding: '1rem',
                            backgroundColor: 'rgba(26, 179, 93, 0.1)',
                            borderRadius: '12px',
                            border: '1px solid rgba(26, 179, 93, 0.2)'
                        }}>
                            <p style={{ color: '#1ab35d', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                🌱 Go Green Today
                            </p>
                            <p style={{ color: 'rgba(173, 181, 189, 0.8)', fontSize: '0.813rem' }}>
                                Start recycling your electronics responsibly
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            fontWeight: 600,
                            marginBottom: '1.5rem',
                            fontSize: '0.938rem',
                            color: '#ffffff',
                            letterSpacing: '0.02em'
                        }}>
                            Quick Links
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <FooterLink href={link.href}>{link.label}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 style={{
                            fontWeight: 600,
                            marginBottom: '1.5rem',
                            fontSize: '0.938rem',
                            color: '#ffffff',
                            letterSpacing: '0.02em'
                        }}>
                            Support
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {supportLinks.map((link) => (
                                <li key={link.href}>
                                    <FooterLink href={link.href}>{link.label}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 style={{
                            fontWeight: 600,
                            marginBottom: '1.5rem',
                            fontSize: '0.938rem',
                            color: '#ffffff',
                            letterSpacing: '0.02em'
                        }}>
                            Legal
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <FooterLink href={link.href}>{link.label}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <p style={{ color: 'rgba(173, 181, 189, 0.7)', fontSize: '0.875rem' }}>
                        © {currentYear} Recyce. All rights reserved.
                    </p>
                    <p style={{ color: 'rgba(173, 181, 189, 0.5)', fontSize: '0.813rem' }}>
                        Made with 💚 for a greener planet
                    </p>
                </div>
            </div>
        </footer>
    )
}

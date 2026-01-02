'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function CookiePolicyPage() {
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
                    Cookie Policy
                </h1>
                <p style={{ color: '#6c757d', marginBottom: '3rem' }}>Last updated: January 1, 2026</p>

                <div style={{ color: '#495057', lineHeight: 1.8, fontSize: '1rem' }}>
                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>What Are Cookies?</h2>
                        <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve your experience.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>How We Use Cookies</h2>
                        <p style={{ marginBottom: '1rem' }}>Recyce uses cookies for the following purposes:</p>

                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', marginBottom: '0.5rem', marginTop: '1.5rem' }}>Essential Cookies</h3>
                        <p>Required for the website to function properly. These include authentication cookies that keep you logged in and remember items in your quote cart.</p>

                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', marginBottom: '0.5rem', marginTop: '1.5rem' }}>Analytics Cookies</h3>
                        <p>Help us understand how visitors interact with our website. We use this data to improve our services and user experience.</p>

                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', marginBottom: '0.5rem', marginTop: '1.5rem' }}>Marketing Cookies</h3>
                        <p>Used to deliver relevant advertisements and track the effectiveness of our marketing campaigns.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>Cookie Types We Use</h2>
                        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '1.5rem', marginTop: '1rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600 }}>Cookie</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600 }}>Purpose</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600 }}>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                                        <td style={{ padding: '0.75rem' }}>session_id</td>
                                        <td style={{ padding: '0.75rem' }}>Maintains login state</td>
                                        <td style={{ padding: '0.75rem' }}>Session</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                                        <td style={{ padding: '0.75rem' }}>preferences</td>
                                        <td style={{ padding: '0.75rem' }}>Stores user preferences</td>
                                        <td style={{ padding: '0.75rem' }}>1 year</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.75rem' }}>analytics</td>
                                        <td style={{ padding: '0.75rem' }}>Usage analytics</td>
                                        <td style={{ padding: '0.75rem' }}>2 years</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>Managing Cookies</h2>
                        <p>You can control cookies through your browser settings. Most browsers allow you to:</p>
                        <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                            <li>View what cookies are stored on your device</li>
                            <li>Delete all or specific cookies</li>
                            <li>Block cookies from specific or all websites</li>
                            <li>Block third-party cookies</li>
                        </ul>
                        <p style={{ marginTop: '1rem' }}>Note: Blocking essential cookies may affect website functionality.</p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>Contact Us</h2>
                        <p>If you have questions about our cookie policy, please contact us at privacy@recyce.com.</p>
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

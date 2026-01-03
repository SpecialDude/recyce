'use client'

import Link from 'next/link'
import { Package, Truck, Search, DollarSign, ShieldCheck, Recycle, ArrowRight } from 'lucide-react'
import { PublicLayout } from '@/components/PublicLayout'

export default function HowItWorksPage() {
    const steps = [
        {
            number: 1,
            icon: Search,
            title: 'Find Your Device',
            description: 'Search for your device by brand and model. We accept smartphones, tablets, laptops, smartwatches, and gaming consoles from all major brands.',
            details: ['Select your device category', 'Choose the brand and model', 'Works for both working and broken devices']
        },
        {
            number: 2,
            icon: DollarSign,
            title: 'Get an Instant Quote',
            description: 'Answer a few quick questions about your device\'s condition to get an accurate, no-obligation quote in seconds.',
            details: ['Select device condition', 'Choose storage & carrier options', 'See your quote immediately']
        },
        {
            number: 3,
            icon: Package,
            title: 'Ship It Free',
            description: 'Accept your quote and we\'ll send you a prepaid shipping label. Pack your device securely and drop it off at any shipping location.',
            details: ['Free prepaid shipping label', 'Use any box you have', 'Track your shipment online']
        },
        {
            number: 4,
            icon: DollarSign,
            title: 'Get Paid Fast',
            description: 'Once we receive and verify your device, we\'ll process your payment within 1-2 business days via your preferred method.',
            details: ['Quick device inspection', 'Payment via PayPal or check', 'Secure data destruction included']
        }
    ]

    return (
        <PublicLayout>

            {/* Hero */}
            <section style={{ background: 'linear-gradient(135deg, #e6f7ed 0%, #f8f9fa 100%)', padding: '5rem 2rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#212529', marginBottom: '1.5rem' }}>
                        How Recyce Works
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#6c757d', lineHeight: 1.7 }}>
                        Selling your old electronics has never been easier. Get cash for your devices in just 4 simple steps.
                    </p>
                </div>
            </section>

            {/* Steps */}
            <section style={{ padding: '5rem 2rem' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <div key={step.number} style={{ display: 'flex', gap: '2rem', marginBottom: index < steps.length - 1 ? '4rem' : 0, alignItems: 'flex-start' }}>
                                <div style={{
                                    flexShrink: 0,
                                    transition: 'transform 0.3s ease'
                                }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #1ab35d 0%, #159549 100%)',
                                        color: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        boxShadow: '0 4px 16px rgba(26, 179, 93, 0.3)'
                                    }}>
                                        {step.number}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div style={{ width: '2px', height: '100px', backgroundColor: '#e9ecef', margin: '1rem auto' }} />
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, paddingTop: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <Icon size={24} style={{ color: '#1ab35d' }} />
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529', margin: 0 }}>
                                            {step.title}
                                        </h2>
                                    </div>
                                    <p style={{ fontSize: '1.125rem', color: '#6c757d', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                                        {step.description}
                                    </p>
                                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0, padding: 0, listStyle: 'none' }}>
                                        {step.details.map((detail, i) => (
                                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#495057' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1ab35d' }} />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Trust Section */}
            <section style={{ backgroundColor: '#fafbfc', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#212529', textAlign: 'center', marginBottom: '3rem' }}>
                        Why Trust Recyce?
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {[
                            { icon: ShieldCheck, title: 'Data Protection', desc: 'We securely wipe all data from your devices following industry standards.' },
                            { icon: DollarSign, title: 'Best Prices', desc: 'We offer competitive prices and price-match guarantees.' },
                            { icon: Recycle, title: 'Eco-Friendly', desc: 'Devices are refurbished or responsibly recycled to minimize e-waste.' }
                        ].map((item, idx) => {
                            const Icon = item.icon
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        textAlign: 'center',
                                        padding: '2rem',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '20px',
                                        border: '1px solid #f1f3f5',
                                        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                                        cursor: 'default'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)'
                                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.08)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '16px',
                                        background: 'linear-gradient(135deg, #e6f7ed 0%, #d4f1e0 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1.25rem'
                                    }}>
                                        <Icon size={32} style={{ color: '#1ab35d' }} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#212529', marginBottom: '0.75rem' }}>{item.title}</h3>
                                    <p style={{ color: '#6c757d', lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: 'linear-gradient(135deg, #1ab35d 0%, #15803d 100%)', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
                        Ready to Get Started?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', fontSize: '1.125rem' }}>
                        Find out how much your device is worth in seconds.
                    </p>
                    <Link
                        href="/sell"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#ffffff',
                            color: '#1ab35d',
                            padding: '1.125rem 2rem',
                            borderRadius: '14px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)'
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        Get Your Quote <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </PublicLayout>
    )
}

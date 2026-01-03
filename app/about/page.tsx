'use client'

import Link from 'next/link'
import { Leaf, Users, Target, Award, ArrowRight, Heart, Globe, Zap, Shield } from 'lucide-react'
import { PublicLayout } from '@/components/PublicLayout'

export default function AboutPage() {
    const stats = [
        { value: '50,000+', label: 'Devices Recycled' },
        { value: '$2M+', label: 'Paid to Customers' },
        { value: '99%', label: 'Customer Satisfaction' },
        { value: '500+', label: 'Tons of E-Waste Diverted' }
    ]

    const values = [
        {
            icon: Leaf,
            title: 'Sustainability First',
            description: 'Every decision we make considers its environmental impact. We\'re committed to reducing e-waste and promoting a circular economy where resources are reused, not wasted.'
        },
        {
            icon: Users,
            title: 'Customer Focused',
            description: 'We believe in fair prices, transparent processes, and excellent service. Your trust is our most valuable asset, and we work hard to earn it every day.'
        },
        {
            icon: Target,
            title: 'Simplicity',
            description: 'Selling your old devices should be easy. We\'ve eliminated the complexity and created a seamless experience from quote to payment.'
        },
        {
            icon: Award,
            title: 'Integrity',
            description: 'We do what we say. Accurate quotes, honest inspections, and reliable payments - every time, without exception.'
        }
    ]

    return (
        <PublicLayout>

            {/* Hero */}
            <section style={{
                background: 'linear-gradient(135deg, #1ab35d 0%, #107735 100%)',
                padding: '5rem 2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginBottom: '1.5rem',
                        lineHeight: 1.2
                    }}>
                        Changing the Dynamics of Electronic Recycling
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                        color: 'rgba(255, 255, 255, 0.95)',
                        lineHeight: 1.7,
                        maxWidth: '700px',
                        margin: '0 auto'
                    }}>
                        We're on a mission to make electronics recycling easy, profitable, and sustainable for everyone.
                        Join us in building a world where technology serves both people and planet.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section style={{ padding: '5rem 2rem' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '3rem',
                        alignItems: 'center'
                    }}>
                        <div>
                            <span style={{
                                color: '#1ab35d',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '0.75rem',
                                display: 'block'
                            }}>
                                Our Story
                            </span>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#212529', marginBottom: '1.5rem' }}>
                                Born from a Simple Observation
                            </h2>
                            <div style={{ color: '#495057', fontSize: '1.063rem', lineHeight: 1.8 }}>
                                <p style={{ marginBottom: '1.25rem' }}>
                                    We noticed something troubling: millions of electronic devices sit unused in drawers and closets,
                                    while the traditional recycling process is complicated, time-consuming, and rarely pays fair value.
                                </p>
                                <p style={{ marginBottom: '1.25rem' }}>
                                    At the same time, e-waste has become one of the fastest-growing environmental challenges of our time.
                                    We knew there had to be a better way.
                                </p>
                                <p>
                                    That's why we created <strong>Recyce</strong> — a platform that makes selling your old electronics
                                    as simple as ordering takeout, while ensuring every device is either given a second life or
                                    responsibly recycled.
                                </p>
                            </div>
                        </div>
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: '20px',
                            padding: '2.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem'
                        }}>
                            {[
                                { icon: Globe, text: 'Reducing global e-waste impact' },
                                { icon: Heart, text: 'Giving devices a second life' },
                                { icon: Shield, text: 'Protecting your data privacy' },
                                { icon: Zap, text: 'Fast, fair payments' }
                            ].map((item, idx) => {
                                const Icon = item.icon
                                return (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            backgroundColor: '#e6f7ed',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <Icon size={24} style={{ color: '#1ab35d' }} />
                                        </div>
                                        <span style={{ fontWeight: 500, color: '#212529' }}>{item.text}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why We Matter */}
            <section style={{ padding: '4rem 2rem', backgroundColor: '#f8f9fa' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <span style={{
                        color: '#1ab35d',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '0.75rem',
                        display: 'block'
                    }}>
                        The Challenge
                    </span>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#212529', marginBottom: '1.5rem' }}>
                        Why This Matters
                    </h2>
                    <p style={{
                        fontSize: '1.125rem',
                        color: '#495057',
                        lineHeight: 1.8,
                        maxWidth: '750px',
                        margin: '0 auto'
                    }}>
                        Every year, over <strong>50 million tons</strong> of e-waste are generated globally. Most of it ends up in landfills,
                        releasing toxic chemicals into the environment and wasting valuable resources like gold, silver, and rare earth metals.
                        We believe there's a better way — and we're proving it's possible to balance <strong>environmental responsibility</strong> with
                        <strong> convenience and fair value</strong>.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section style={{ backgroundColor: '#1ab35d', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '2rem',
                        textAlign: 'center'
                    }}>
                        {stats.map((stat, idx) => (
                            <div key={idx}>
                                <div style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section style={{ padding: '5rem 2rem' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <span style={{
                            color: '#1ab35d',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '0.75rem',
                            display: 'block'
                        }}>
                            What Drives Us
                        </span>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#212529' }}>
                            Our Core Values
                        </h2>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {values.map((value, idx) => {
                            const Icon = value.icon
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '20px',
                                        padding: '2rem',
                                        border: '1px solid #f1f3f5',
                                        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                                        cursor: 'default'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-6px)'
                                        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.08)'
                                        e.currentTarget.style.borderColor = 'rgba(26, 179, 93, 0.2)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = 'none'
                                        e.currentTarget.style.borderColor = '#f1f3f5'
                                    }}
                                >
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        marginBottom: '1.25rem',
                                        background: 'linear-gradient(135deg, #e6f7ed 0%, #d4f1e0 100%)',
                                        borderRadius: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Icon size={28} style={{ color: '#1ab35d' }} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#212529', marginBottom: '0.75rem' }}>
                                        {value.title}
                                    </h3>
                                    <p style={{ fontSize: '0.938rem', color: '#6c757d', lineHeight: 1.7 }}>
                                        {value.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{
                padding: '5rem 2rem',
                backgroundColor: '#f8f9fa',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#212529', marginBottom: '1rem' }}>
                        Join the Recyce Community
                    </h2>
                    <p style={{ fontSize: '1.125rem', color: '#6c757d', marginBottom: '2rem', lineHeight: 1.7 }}>
                        Be part of the solution. Turn your old electronics into cash while helping build a more sustainable future.
                    </p>
                    <Link
                        href="/sell"
                        style={{
                            backgroundColor: '#1ab35d',
                            color: '#ffffff',
                            padding: '1.125rem 2.5rem',
                            borderRadius: '14px',
                            fontSize: '1.063rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 16px rgba(26, 179, 93, 0.25)',
                            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(26, 179, 93, 0.35)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)'
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(26, 179, 93, 0.25)'
                        }}
                    >
                        Get Started Today
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </PublicLayout>
    )
}

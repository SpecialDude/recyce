'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react'
import { PublicLayout } from '@/components/PublicLayout'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // For now, we'll just simulate success
        // In production, you'd send to Supabase or an email service
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setSuccess(true)
            setFormData({ name: '', email: '', subject: '', message: '' })
        } catch (err) {
            setError('Something went wrong. Please try again.')
        }
        setLoading(false)
    }

    return (
        <PublicLayout>

            {/* Hero */}
            <section style={{ background: 'linear-gradient(135deg, #e6f7ed 0%, #f8f9fa 100%)', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#212529', marginBottom: '1rem' }}>
                        Contact Us
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#6c757d' }}>
                        Have questions? We're here to help. Reach out and we'll get back to you as soon as possible.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section style={{ padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'start' }}>
                    {/* Contact Info */}
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529', marginBottom: '2rem' }}>
                            Get in Touch
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Mail size={24} style={{ color: '#1ab35d' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 600, color: '#212529', marginBottom: '0.25rem' }}>Email</h3>
                                    <a href="mailto:support@recyce.com" style={{ color: '#1ab35d', textDecoration: 'none' }}>support@recyce.com</a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Phone size={24} style={{ color: '#1ab35d' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 600, color: '#212529', marginBottom: '0.25rem' }}>Phone</h3>
                                    <a href="tel:1-800-RECYCE" style={{ color: '#6c757d', textDecoration: 'none' }}>1-800-RECYCE</a>
                                    <p style={{ fontSize: '0.875rem', color: '#adb5bd', marginTop: '0.25rem' }}>Mon-Fri 9am-6pm EST</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <MapPin size={24} style={{ color: '#1ab35d' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 600, color: '#212529', marginBottom: '0.25rem' }}>Address</h3>
                                    <p style={{ color: '#6c757d' }}>123 Green Street<br />Eco City, EC 12345</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div style={{ backgroundColor: '#f8f9fa', borderRadius: '16px', padding: '2rem' }}>
                        {success ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', backgroundColor: '#d3f9d8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle size={32} style={{ color: '#40c057' }} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#212529', marginBottom: '0.5rem' }}>Message Sent!</h3>
                                <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>We'll get back to you within 24 hours.</p>
                                <button onClick={() => setSuccess(false)} style={{ color: '#1ab35d', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#212529', marginBottom: '0.5rem' }}>
                                    Send us a Message
                                </h2>

                                {error && (
                                    <div style={{ backgroundColor: '#fef2f2', padding: '0.75rem 1rem', borderRadius: '8px', color: '#991b1b', fontSize: '0.875rem' }}>
                                        {error}
                                    </div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem', backgroundColor: '#ffffff' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem', backgroundColor: '#ffffff' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>Subject</label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem', backgroundColor: '#ffffff' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>Message</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        rows={5}
                                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem', resize: 'vertical', backgroundColor: '#ffffff' }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        backgroundColor: '#1ab35d',
                                        color: '#ffffff',
                                        padding: '0.875rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                >
                                    {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={20} />}
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    )
}

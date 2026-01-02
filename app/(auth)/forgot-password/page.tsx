'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) {
            setError(error.message)
        } else {
            setSent(true)
        }

        setLoading(false)
    }

    if (sent) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', padding: '3rem 1rem' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '3rem', maxWidth: '28rem', width: '100%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 1.5rem',
                        backgroundColor: '#d3f9d8',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <CheckCircle size={32} style={{ color: '#40c057' }} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529', marginBottom: '1rem' }}>
                        Check Your Email
                    </h1>
                    <p style={{ color: '#6c757d', marginBottom: '2rem', lineHeight: 1.6 }}>
                        We've sent a password reset link to <strong>{email}</strong>.
                        Click the link in the email to reset your password.
                    </p>
                    <Link
                        href="/login"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#1ab35d',
                            textDecoration: 'none',
                            fontWeight: 500
                        }}
                    >
                        <ArrowLeft size={18} />
                        Back to Sign In
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', padding: '3rem 1rem' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2.5rem', maxWidth: '28rem', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                {/* Logo & Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <Image
                            src="/recyce-logo.png"
                            alt="Recyce Logo"
                            width={180}
                            height={60}
                            style={{ height: 'auto', width: '180px' }}
                        />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529', marginBottom: '0.5rem' }}>
                        Forgot Password?
                    </h1>
                    <p style={{ color: '#6c757d', fontSize: '0.938rem' }}>
                        Enter your email and we'll send you a reset link
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem 0.875rem 2.75rem',
                                    border: '1px solid #ced4da',
                                    borderRadius: '10px',
                                    fontSize: '1rem'
                                }}
                                disabled={loading}
                            />
                        </div>
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
                            borderRadius: '10px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading && <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />}
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                {/* Back to Login */}
                <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef' }}>
                    <Link
                        href="/login"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#6c757d',
                            textDecoration: 'none',
                            fontSize: '0.938rem'
                        }}
                    >
                        <ArrowLeft size={18} />
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}

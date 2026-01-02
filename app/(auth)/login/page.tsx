'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirectTo') || '/dashboard'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error } = await signIn(email, password)

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push(redirectTo)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-neutral-50)', padding: '3rem 1rem' }}>
            <div className="card" style={{ maxWidth: '28rem', width: '100%' }}>
                {/* Logo & Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Image
                            src="/recyce-logo.png"
                            alt="Recyce Logo"
                            width={200}
                            height={67}
                            style={{ height: 'auto', width: '200px' }}
                        />
                    </div>
                    <h2 style={{ marginTop: '1.5rem', fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--color-neutral-900)' }}>
                        Welcome back
                    </h2>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label htmlFor="email" className="label">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label htmlFor="password" className="label" style={{ marginBottom: 0 }}>
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-primary-400)' }}
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>

                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
                            Don't have an account?{' '}
                            <Link
                                href={redirectTo !== '/dashboard' ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}` : '/signup'}
                                style={{ fontWeight: 500, color: 'var(--color-primary-400)' }}
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Back to Home */}
                <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid var(--color-neutral-200)', marginTop: '1.5rem' }}>
                    <Link
                        href="/"
                        style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}
                    >
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}

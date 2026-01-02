'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function SignupPage() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signUp } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirectTo') || '/dashboard'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        const { error } = await signUp(email, password, fullName)

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
                        Create your account
                    </h2>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
                        Join Recyce and start selling your electronics
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label htmlFor="fullName" className="label">
                            Full name
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            required
                            className="input"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={loading}
                        />
                    </div>

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
                        <label htmlFor="password" className="label">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="input"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="label">
                            Confirm password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            className="input"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Creating account...' : 'Sign up'}
                    </button>

                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
                            Already have an account?{' '}
                            <Link
                                href={redirectTo !== '/dashboard' ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : '/login'}
                                style={{ fontWeight: 500, color: 'var(--color-primary-400)' }}
                            >
                                Sign in
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

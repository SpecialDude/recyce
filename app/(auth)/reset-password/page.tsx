'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Lock, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Check if we have a valid session from the reset link
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                // No session means invalid or expired reset link
                setError('Invalid or expired reset link. Please request a new one.')
            }
        }
        checkSession()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            setError(error.message)
        } else {
            setSuccess(true)
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        }

        setLoading(false)
    }

    if (success) {
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
                        Password Updated!
                    </h1>
                    <p style={{ color: '#6c757d', marginBottom: '2rem', lineHeight: 1.6 }}>
                        Your password has been successfully reset.
                        Redirecting you to sign in...
                    </p>
                    <Link
                        href="/login"
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#1ab35d',
                            color: '#ffffff',
                            padding: '0.875rem 2rem',
                            borderRadius: '10px',
                            fontWeight: 600,
                            textDecoration: 'none'
                        }}
                    >
                        Sign In Now
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
                        Reset Password
                    </h1>
                    <p style={{ color: '#6c757d', fontSize: '0.938rem' }}>
                        Enter your new password below
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
                            New Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="At least 6 characters"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 3rem 0.875rem 2.75rem',
                                    border: '1px solid #ced4da',
                                    borderRadius: '10px',
                                    fontSize: '1rem'
                                }}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#adb5bd'
                                }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>
                            Confirm Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Re-enter your password"
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
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}

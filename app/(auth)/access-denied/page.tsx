'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShieldX, ArrowLeft, Home } from 'lucide-react'

export default function AccessDeniedPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', padding: '3rem 1rem' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '3rem', maxWidth: '28rem', width: '100%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                {/* Logo */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <Image
                        src="/recyce-logo.png"
                        alt="Recyce Logo"
                        width={150}
                        height={50}
                        style={{ height: 'auto', width: '150px' }}
                    />
                </div>

                {/* Icon */}
                <div style={{
                    width: '72px',
                    height: '72px',
                    margin: '0 auto 1.5rem',
                    backgroundColor: '#ffe3e3',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <ShieldX size={36} style={{ color: '#fa5252' }} />
                </div>

                {/* Message */}
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#212529', marginBottom: '0.75rem' }}>
                    Access Denied
                </h1>
                <p style={{ color: '#6c757d', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.938rem' }}>
                    You don't have permission to access this page.
                    This area is restricted to administrators only.
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link
                        href="/dashboard"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#1ab35d',
                            color: '#ffffff',
                            padding: '0.875rem 1.5rem',
                            borderRadius: '10px',
                            fontWeight: 600,
                            textDecoration: 'none'
                        }}
                    >
                        Go to Dashboard
                    </Link>

                    <Link
                        href="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            color: '#6c757d',
                            textDecoration: 'none',
                            fontSize: '0.938rem'
                        }}
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>
                </div>

                {/* Help text */}
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef' }}>
                    <p style={{ fontSize: '0.813rem', color: '#adb5bd' }}>
                        If you believe this is an error, please contact support.
                    </p>
                </div>
            </div>
        </div>
    )
}

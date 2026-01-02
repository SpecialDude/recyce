'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const navLinks = [
    { label: 'Sell Device', href: '/sell' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
]

export function PublicHeader() {
    const { user } = useAuth()
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Check if a nav link is active (matches current path or starts with it for nested routes)
    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname === href || pathname.startsWith(href + '/')
    }

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(222, 226, 230, 0.5)',
            zIndex: 50,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <Image
                            src="/recyce-logo.png"
                            alt="Recyce"
                            width={140}
                            height={47}
                            style={{ height: 'auto', width: '140px' }}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
                        {navLinks.map((link) => {
                            const active = isActive(link.href)
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{
                                        color: active ? '#1ab35d' : '#495057',
                                        fontSize: '0.938rem',
                                        fontWeight: active ? 600 : 500,
                                        textDecoration: 'none',
                                        transition: 'color 0.2s',
                                        position: 'relative',
                                        paddingBottom: '4px',
                                        borderBottom: active ? '2px solid #1ab35d' : '2px solid transparent'
                                    }}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}

                        {user ? (
                            <Link
                                href="/dashboard"
                                style={{
                                    backgroundColor: '#1ab35d',
                                    color: '#ffffff',
                                    padding: '0.625rem 1.5rem',
                                    borderRadius: '8px',
                                    fontSize: '0.938rem',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 2px 8px rgba(26, 179, 93, 0.2)'
                                }}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    style={{
                                        color: '#495057',
                                        fontSize: '0.938rem',
                                        fontWeight: 500,
                                        textDecoration: 'none'
                                    }}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sell"
                                    style={{
                                        backgroundColor: '#1ab35d',
                                        color: '#ffffff',
                                        padding: '0.625rem 1.5rem',
                                        borderRadius: '8px',
                                        fontSize: '0.938rem',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 2px 8px rgba(26, 179, 93, 0.2)'
                                    }}
                                >
                                    Start Selling
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            color: '#495057'
                        }}
                        className="mobile-menu-btn"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '72px',
                        left: 0,
                        right: 0,
                        backgroundColor: '#ffffff',
                        borderBottom: '1px solid #e9ecef',
                        padding: '1rem 2rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} className="mobile-nav">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {navLinks.map((link) => {
                                const active = isActive(link.href)
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{
                                            color: active ? '#1ab35d' : '#495057',
                                            fontSize: '1rem',
                                            fontWeight: active ? 600 : 500,
                                            textDecoration: 'none',
                                            padding: '0.5rem 0',
                                            borderLeft: active ? '3px solid #1ab35d' : '3px solid transparent',
                                            paddingLeft: '0.75rem'
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                            <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {user ? (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{
                                            backgroundColor: '#1ab35d',
                                            color: '#ffffff',
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            textAlign: 'center'
                                        }}
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            style={{
                                                color: '#1ab35d',
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                textAlign: 'center',
                                                border: '2px solid #1ab35d'
                                            }}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/sell"
                                            onClick={() => setMobileMenuOpen(false)}
                                            style={{
                                                backgroundColor: '#1ab35d',
                                                color: '#ffffff',
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                textAlign: 'center'
                                            }}
                                        >
                                            Start Selling
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS for responsive behavior */}
            <style jsx global>{`
                @media (min-width: 768px) {
                    .mobile-menu-btn { display: none !important; }
                    .desktop-nav { display: flex !important; }
                }
                @media (max-width: 767px) {
                    .mobile-menu-btn { display: block !important; }
                    .desktop-nav { display: none !important; }
                }
            `}</style>
        </nav>
    )
}

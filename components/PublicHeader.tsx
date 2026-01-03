'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
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
    const [scrolled, setScrolled] = useState(false)
    const [hoveredLink, setHoveredLink] = useState<string | null>(null)

    // Track scroll for shadow effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Check if a nav link is active
    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname === href || pathname.startsWith(href + '/')
    }

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(233, 236, 239, 0.6)',
            zIndex: 50,
            boxShadow: scrolled
                ? '0 4px 20px rgba(0, 0, 0, 0.06)'
                : '0 1px 3px rgba(0, 0, 0, 0.02)',
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
                    {/* Logo */}
                    <Link
                        href="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
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
                            const hovered = hoveredLink === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onMouseEnter={() => setHoveredLink(link.href)}
                                    onMouseLeave={() => setHoveredLink(null)}
                                    style={{
                                        color: active ? '#1ab35d' : hovered ? '#1ab35d' : '#495057',
                                        fontSize: '0.938rem',
                                        fontWeight: active ? 600 : 500,
                                        textDecoration: 'none',
                                        transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                                        position: 'relative',
                                        paddingBottom: '6px',
                                        transform: hovered && !active ? 'translateY(-1px)' : 'translateY(0)'
                                    }}
                                >
                                    {link.label}
                                    {/* Animated underline */}
                                    <span style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: active ? '100%' : hovered ? '80%' : '0%',
                                        height: '2px',
                                        backgroundColor: '#1ab35d',
                                        borderRadius: '1px',
                                        transition: 'width 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
                                    }} />
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
                                    borderRadius: '10px',
                                    fontSize: '0.938rem',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                                    boxShadow: '0 2px 8px rgba(26, 179, 93, 0.25)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 179, 93, 0.35)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(26, 179, 93, 0.25)'
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
                                        textDecoration: 'none',
                                        transition: 'color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#1ab35d'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#495057'}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sell"
                                    style={{
                                        backgroundColor: '#1ab35d',
                                        color: '#ffffff',
                                        padding: '0.625rem 1.5rem',
                                        borderRadius: '10px',
                                        fontSize: '0.938rem',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                                        boxShadow: '0 2px 8px rgba(26, 179, 93, 0.25)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)'
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 179, 93, 0.35)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(26, 179, 93, 0.25)'
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
                            color: '#495057',
                            transition: 'color 0.2s ease'
                        }}
                        className="mobile-menu-btn"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu with animation */}
                <div
                    style={{
                        position: 'absolute',
                        top: '72px',
                        left: 0,
                        right: 0,
                        backgroundColor: '#ffffff',
                        borderBottom: mobileMenuOpen ? '1px solid #e9ecef' : 'none',
                        padding: mobileMenuOpen ? '1rem 2rem 1.5rem' : '0 2rem',
                        boxShadow: mobileMenuOpen ? '0 8px 24px rgba(0,0,0,0.08)' : 'none',
                        maxHeight: mobileMenuOpen ? '500px' : '0',
                        opacity: mobileMenuOpen ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
                    className="mobile-nav"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {navLinks.map((link, index) => {
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
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        backgroundColor: active ? 'rgba(26, 179, 93, 0.08)' : 'transparent',
                                        transition: 'all 0.2s ease',
                                        transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)',
                                        opacity: mobileMenuOpen ? 1 : 0,
                                        transitionDelay: `${index * 50}ms`
                                    }}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                        <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {user ? (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        backgroundColor: '#1ab35d',
                                        color: '#ffffff',
                                        padding: '0.875rem 1.5rem',
                                        borderRadius: '10px',
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
                                            padding: '0.875rem 1.5rem',
                                            borderRadius: '10px',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            textAlign: 'center',
                                            border: '2px solid #1ab35d',
                                            backgroundColor: 'transparent'
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
                                            padding: '0.875rem 1.5rem',
                                            borderRadius: '10px',
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
            </div>

            {/* CSS for responsive behavior */}
            <style jsx global>{`
                @media (min-width: 768px) {
                    .mobile-menu-btn { display: none !important; }
                    .desktop-nav { display: flex !important; }
                    .mobile-nav { display: none !important; }
                }
                @media (max-width: 767px) {
                    .mobile-menu-btn { display: block !important; }
                    .desktop-nav { display: none !important; }
                    .mobile-nav { display: block !important; }
                }
            `}</style>
        </nav>
    )
}

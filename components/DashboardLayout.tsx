'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
    Package,
    Truck,
    DollarSign,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Home
} from 'lucide-react'

const navItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Package, label: 'My Offers', href: '/dashboard/offers' },
    { icon: Truck, label: 'My Orders', href: '/dashboard/orders' },
    { icon: DollarSign, label: 'Payments', href: '/dashboard/payments' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

interface DashboardLayoutProps {
    children: ReactNode
    title: string
    showSidebar?: boolean
}

export function DashboardLayout({ children, title, showSidebar = true }: DashboardLayoutProps) {
    const { user, profile, signOut } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        router.push('/')
    }

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard'
        return pathname.startsWith(href)
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Navigation */}
            <nav style={{
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #f1f3f5',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                position: 'sticky',
                top: 0,
                zIndex: 40
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    color: '#495057',
                                    display: 'none'
                                }}
                                className="mobile-menu-btn"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                                <Image
                                    src="/recyce-logo.png"
                                    alt="Recyce"
                                    width={120}
                                    height={40}
                                    style={{ height: 'auto', width: '120px' }}
                                />
                            </Link>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link href="/sell" style={{
                                background: 'linear-gradient(135deg, #1ab35d 0%, #159549 100%)',
                                color: '#ffffff',
                                padding: '0.625rem 1.25rem',
                                borderRadius: '10px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                boxShadow: '0 2px 8px rgba(26, 179, 93, 0.2)',
                                transition: 'all 0.25s ease'
                            }} className="sell-btn">
                                Sell Device
                            </Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="user-info">
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    backgroundColor: '#e6f7ed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <User size={18} style={{ color: '#1ab35d' }} />
                                </div>
                                <div className="user-name">
                                    <div style={{ fontSize: '0.813rem', fontWeight: 600, color: '#212529' }}>
                                        {profile?.full_name || 'User'}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleSignOut}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6c757d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.5rem'
                                }}
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div style={{
                    position: 'fixed',
                    top: '64px',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 30
                }} onClick={() => setMobileMenuOpen(false)}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        width: '280px',
                        height: '100%',
                        boxShadow: '4px 0 12px rgba(0,0,0,0.1)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '1rem' }}>
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const active = isActive(item.href)
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.875rem 1rem',
                                            color: active ? '#1ab35d' : '#495057',
                                            textDecoration: 'none',
                                            fontSize: '0.938rem',
                                            fontWeight: active ? 600 : 400,
                                            backgroundColor: active ? '#e6f7ed' : 'transparent',
                                            borderRadius: '8px',
                                            marginBottom: '0.25rem'
                                        }}
                                    >
                                        <Icon size={20} />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Layout */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }} className="dashboard-container">
                <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: showSidebar ? '220px 1fr' : '1fr', gap: '1.5rem' }}>
                    {/* Desktop Sidebar */}
                    {showSidebar && (
                        <aside className="desktop-sidebar">
                            <div style={{
                                backgroundColor: '#ffffff',
                                borderRadius: '16px',
                                border: '1px solid #f1f3f5',
                                overflow: 'hidden',
                                position: 'sticky',
                                top: '80px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                            }}>
                                {navItems.map((item) => {
                                    const Icon = item.icon
                                    const active = isActive(item.href)
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.9375rem 1.125rem',
                                                color: active ? '#1ab35d' : '#495057',
                                                textDecoration: 'none',
                                                fontSize: '0.875rem',
                                                fontWeight: active ? 600 : 500,
                                                backgroundColor: active ? 'rgba(26, 179, 93, 0.08)' : 'transparent',
                                                borderBottom: '1px solid #f1f3f5',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!active) {
                                                    e.currentTarget.style.backgroundColor = '#fafbfc'
                                                    e.currentTarget.style.color = '#1ab35d'
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!active) {
                                                    e.currentTarget.style.backgroundColor = 'transparent'
                                                    e.currentTarget.style.color = '#495057'
                                                }
                                            }}
                                        >
                                            <Icon size={18} />
                                            {item.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        </aside>
                    )}

                    {/* Main Content */}
                    <main>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529', marginBottom: '1.25rem' }}>
                            {title}
                        </h1>
                        {children}
                    </main>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-bottom-nav" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e9ecef',
                display: 'none',
                zIndex: 40
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0.5rem 0' }}>
                    {navItems.slice(0, 5).map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.5rem',
                                    color: active ? '#1ab35d' : '#6c757d',
                                    textDecoration: 'none',
                                    fontSize: '0.625rem',
                                    fontWeight: active ? 600 : 400
                                }}
                            >
                                <Icon size={20} />
                                <span>{item.label.replace('My ', '')}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Responsive Styles */}
            <style jsx global>{`
                @media (min-width: 769px) {
                    .mobile-menu-btn { display: none !important; }
                    .desktop-sidebar { display: block !important; }
                    .mobile-bottom-nav { display: none !important; }
                    .dashboard-grid { grid-template-columns: 220px 1fr !important; }
                }
                @media (max-width: 768px) {
                    .mobile-menu-btn { display: block !important; }
                    .desktop-sidebar { display: none !important; }
                    .mobile-bottom-nav { display: block !important; }
                    .dashboard-grid { grid-template-columns: 1fr !important; }
                    .user-name { display: none !important; }
                    .sell-btn { padding: 0.375rem 0.75rem !important; font-size: 0.813rem !important; }
                    .dashboard-container { padding-bottom: 5rem !important; }
                }
            `}</style>
        </div>
    )
}

'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
    LayoutDashboard,
    Package,
    DollarSign,
    Truck,
    Users,
    Settings,
    BarChart3,
    LogOut,
    Menu,
    X,
    Loader2
} from 'lucide-react'

interface AdminLayoutProps {
    children: ReactNode
}

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Devices', href: '/admin/devices' },
    { icon: DollarSign, label: 'Offers', href: '/admin/offers' },
    { icon: Truck, label: 'Orders', href: '/admin/orders' },
    { icon: BarChart3, label: 'Pricing', href: '/admin/pricing' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export function AdminLayout({ children }: AdminLayoutProps) {
    const { user, profile, loading: authLoading, signOut } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Only run client-side after mount
    useEffect(() => {
        setMounted(true)
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false)
    }, [pathname])

    // Auth check
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
            return
        }
        if (!authLoading && profile && profile.role !== 'admin') {
            router.push('/dashboard')
            return
        }
    }, [user, profile, authLoading, router])

    // Show loading while auth is checking OR before hydration completes
    if (authLoading || !mounted) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f3f5' }}>
                <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    // Sidebar content (shared between mobile and desktop)
    const SidebarContent = () => (
        <>
            {/* Logo - only show on desktop */}
            {!isMobile && (
                <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
                    <Image src="/recyce-logo.png" alt="Recyce" width={120} height={40} style={{ filter: 'brightness(0) invert(1)' }} />
                    <div style={{ fontSize: '0.75rem', color: '#adb5bd', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Panel</div>
                </div>
            )}

            {/* Navigation */}
            <nav style={{ flex: 1 }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => isMobile && setSidebarOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1.5rem',
                                color: isActive ? '#ffffff' : '#adb5bd',
                                backgroundColor: isActive ? 'rgba(26, 179, 93, 0.2)' : 'transparent',
                                borderLeft: isActive ? '3px solid #1ab35d' : '3px solid transparent',
                                textDecoration: 'none',
                                fontSize: '0.938rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* User Info & Logout */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #343a40' }}>
                <div style={{ fontSize: '0.875rem', color: '#ffffff', marginBottom: '0.25rem' }}>
                    {profile?.full_name || 'Admin'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#adb5bd', marginBottom: '1rem' }}>
                    {user?.email}
                </div>
                <button
                    onClick={signOut}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.625rem',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#adb5bd',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </>
    )

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f1f3f5' }}>
            {/* Mobile Header */}
            {isMobile && (
                <header style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '60px',
                    backgroundColor: '#212529',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1rem',
                    zIndex: 50
                }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#ffffff',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        aria-label="Toggle menu"
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <Image src="/recyce-logo.png" alt="Recyce" width={100} height={33} style={{ filter: 'brightness(0) invert(1)' }} />
                    <div style={{ width: '40px' }} />
                </header>
            )}

            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: '60px',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 99
                    }}
                />
            )}

            {/* Mobile Sidebar (slide-in drawer) */}
            {isMobile && (
                <aside
                    style={{
                        position: 'fixed',
                        top: '60px',
                        left: 0,
                        width: '280px',
                        height: 'calc(100vh - 60px)',
                        backgroundColor: '#212529',
                        color: '#ffffff',
                        padding: '1rem 0',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 100,
                        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                        transition: 'transform 0.3s ease-in-out',
                        overflowY: 'auto'
                    }}
                >
                    <SidebarContent />
                </aside>
            )}

            {/* Desktop Sidebar (always visible) */}
            {!isMobile && (
                <aside
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '260px',
                        height: '100vh',
                        backgroundColor: '#212529',
                        color: '#ffffff',
                        padding: '1.5rem 0',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 40,
                        overflowY: 'auto'
                    }}
                >
                    <SidebarContent />
                </aside>
            )}

            {/* Main Content */}
            <main
                style={{
                    marginLeft: isMobile ? 0 : '260px',
                    marginTop: isMobile ? '60px' : 0,
                    padding: isMobile ? '1rem' : '2rem',
                    minHeight: isMobile ? 'calc(100vh - 60px)' : '100vh'
                }}
            >
                {children}
            </main>
        </div>
    )
}

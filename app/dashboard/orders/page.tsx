'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
    User,
    Package,
    Truck,
    Settings,
    LogOut,
    Loader2,
    DollarSign
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDateShort } from '@/lib/utils'

export default function UserOrdersPage() {
    const { user, profile, loading: authLoading, signOut } = useAuth()
    const router = useRouter()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        async function fetchOrders() {
            if (!user) return

            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          offers(quoted_price, device_models(name))
        `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching orders:', error)
            } else {
                setOrders(data || [])
            }

            setLoading(false)
        }

        if (user) {
            fetchOrders()
        }
    }, [user])

    const handleSignOut = async () => {
        await signOut()
        router.push('/')
    }

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'order_placed': 'Order Placed',
            'device_shipped': 'Device Shipped',
            'device_received': 'Device Received',
            'inspection_in_progress': 'Inspecting',
            'inspection_complete': 'Inspection Complete',
            'payout_pending': 'Payout Pending',
            'payout_complete': 'Complete'
        }
        return labels[status] || status
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'order_placed': return { bg: '#e7f5ff', color: '#1971c2' }
            case 'device_shipped': return { bg: '#fff3cd', color: '#856404' }
            case 'device_received': return { bg: '#d3f9d8', color: '#2b8a3e' }
            case 'inspection_in_progress': return { bg: '#fff4e6', color: '#e67700' }
            case 'payout_pending': return { bg: '#f3d9fa', color: '#9c36b5' }
            case 'payout_complete': return { bg: '#d3f9d8', color: '#155724' }
            default: return { bg: '#f8f9fa', color: '#495057' }
        }
    }

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    const navItems = [
        { icon: Package, label: 'My Offers', href: '/dashboard' },
        { icon: Truck, label: 'My Orders', href: '/dashboard/orders', active: true },
        { icon: DollarSign, label: 'Payments', href: '/dashboard/payments' },
        { icon: User, label: 'Profile', href: '/dashboard/profile' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ]

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Navigation */}
            <nav style={{
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e9ecef',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <Image
                                src="/recyce-logo.png"
                                alt="Recyce"
                                width={140}
                                height={47}
                                style={{ height: 'auto', width: '140px' }}
                            />
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <Link href="/sell" style={{
                                backgroundColor: '#1ab35d',
                                color: '#ffffff',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textDecoration: 'none'
                            }}>
                                Sell Device
                            </Link>
                            <button
                                onClick={handleSignOut}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
                {/* Sidebar */}
                <aside>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e9ecef', overflow: 'hidden' }}>
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '1rem 1.25rem',
                                        color: item.active ? '#1ab35d' : '#495057',
                                        textDecoration: 'none',
                                        fontSize: '0.938rem',
                                        fontWeight: item.active ? 600 : 400,
                                        backgroundColor: item.active ? '#e6f7ed' : 'transparent',
                                        borderBottom: '1px solid #e9ecef'
                                    }}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>
                </aside>

                {/* Main Content */}
                <main>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#212529', marginBottom: '2rem' }}>
                        My Orders
                    </h1>

                    {orders.length === 0 ? (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e9ecef', padding: '3rem', textAlign: 'center' }}>
                            <Truck size={48} style={{ color: '#adb5bd', marginBottom: '1rem' }} />
                            <p style={{ color: '#6c757d', marginBottom: '1rem' }}>No orders yet.</p>
                            <Link href="/sell" style={{
                                display: 'inline-block',
                                backgroundColor: '#1ab35d',
                                color: '#ffffff',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                fontSize: '0.938rem',
                                fontWeight: 600,
                                textDecoration: 'none'
                            }}>
                                Sell a Device
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {orders.map((order) => {
                                const statusStyle = getStatusColor(order.status)
                                return (
                                    <div
                                        key={order.id}
                                        style={{
                                            backgroundColor: '#ffffff',
                                            borderRadius: '12px',
                                            border: '1px solid #e9ecef',
                                            padding: '1.5rem'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', marginBottom: '0.25rem' }}>
                                                    {order.offers?.device_models?.name || 'Device'}
                                                </h3>
                                                <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                                                    Order #{order.order_number || order.id.slice(0, 8)}
                                                </p>
                                            </div>
                                            <span style={{
                                                padding: '0.375rem 0.875rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                backgroundColor: statusStyle.bg,
                                                color: statusStyle.color
                                            }}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.25rem' }}>Order Date</div>
                                                <div style={{ fontWeight: 500, color: '#212529' }}>{formatDateShort(order.created_at)}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.25rem' }}>Amount</div>
                                                <div style={{ fontWeight: 600, color: '#1ab35d' }}>
                                                    {formatCurrency(order.final_price || order.offers?.quoted_price || 0)}
                                                </div>
                                            </div>
                                            {order.tracking_number && (
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '0.25rem' }}>Tracking</div>
                                                    <div style={{ fontWeight: 500, color: '#212529' }}>{order.tracking_number}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

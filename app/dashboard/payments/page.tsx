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
    DollarSign,
    CheckCircle,
    Clock,
    Download
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDateShort } from '@/lib/utils'

export default function PaymentHistoryPage() {
    const { user, profile, loading: authLoading, signOut } = useAuth()
    const router = useRouter()
    const [payments, setPayments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 })
    const supabase = createClient()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        async function fetchPayments() {
            if (!user) return

            // Fetch completed orders with payouts
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    offers(quoted_price, device_models(name))
                `)
                .eq('user_id', user.id)
                .in('status', ['payout_pending', 'payout_complete'])
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching payments:', error)
            } else {
                setPayments(data || [])

                // Calculate stats
                const total = data?.reduce((sum, p) => sum + (p.final_price || p.offers?.quoted_price || 0), 0) || 0
                const pending = data?.filter(p => p.status === 'payout_pending').reduce((sum, p) => sum + (p.final_price || p.offers?.quoted_price || 0), 0) || 0
                const completed = data?.filter(p => p.status === 'payout_complete').reduce((sum, p) => sum + (p.final_price || p.offers?.quoted_price || 0), 0) || 0

                setStats({ total, pending, completed })
            }

            setLoading(false)
        }

        if (user) {
            fetchPayments()
        }
    }, [user])

    const handleSignOut = async () => {
        await signOut()
        router.push('/')
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
        { icon: Truck, label: 'My Orders', href: '/dashboard/orders' },
        { icon: DollarSign, label: 'Payments', href: '/dashboard/payments', active: true },
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
                        Payment History
                    </h1>

                    {/* Stats Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e9ecef', padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <DollarSign size={20} style={{ color: '#1ab35d' }} />
                                <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>Total Earnings</span>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>
                                {formatCurrency(stats.total)}
                            </div>
                        </div>
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e9ecef', padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <Clock size={20} style={{ color: '#f59f00' }} />
                                <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>Pending</span>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>
                                {formatCurrency(stats.pending)}
                            </div>
                        </div>
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e9ecef', padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <CheckCircle size={20} style={{ color: '#40c057' }} />
                                <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>Received</span>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>
                                {formatCurrency(stats.completed)}
                            </div>
                        </div>
                    </div>

                    {/* Payment List */}
                    {payments.length === 0 ? (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e9ecef', padding: '3rem', textAlign: 'center' }}>
                            <DollarSign size={48} style={{ color: '#adb5bd', marginBottom: '1rem' }} />
                            <p style={{ color: '#6c757d', marginBottom: '1rem' }}>No payments yet.</p>
                            <p style={{ color: '#adb5bd', fontSize: '0.875rem' }}>Completed device sales will appear here.</p>
                        </div>
                    ) : (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e9ecef', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
                                        <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Device</th>
                                        <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Date</th>
                                        <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Status</th>
                                        <th style={{ textAlign: 'right', padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment) => (
                                        <tr key={payment.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <div style={{ fontWeight: 500, color: '#212529' }}>
                                                    {payment.offers?.device_models?.name || 'Device'}
                                                </div>
                                                <div style={{ fontSize: '0.813rem', color: '#6c757d' }}>
                                                    #{payment.order_number || payment.id.slice(0, 8)}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem', color: '#495057' }}>
                                                {formatDateShort(payment.updated_at || payment.created_at)}
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.375rem',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500,
                                                    backgroundColor: payment.status === 'payout_complete' ? '#d3f9d8' : '#fff3cd',
                                                    color: payment.status === 'payout_complete' ? '#155724' : '#856404'
                                                }}>
                                                    {payment.status === 'payout_complete' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                                    {payment.status === 'payout_complete' ? 'Paid' : 'Pending'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                                                <span style={{ fontWeight: 600, color: '#1ab35d' }}>
                                                    {formatCurrency(payment.final_price || payment.offers?.quoted_price || 0)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

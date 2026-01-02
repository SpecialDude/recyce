'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { AdminLayout } from '@/components/AdminLayout'
import {
    Package,
    DollarSign,
    Truck,
    BarChart3,
    Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'

interface AdminStats {
    totalOffers: number
    pendingOffers: number
    activeOrders: number
    totalRevenue: number
}

export default function AdminDashboardPage() {
    const { user, profile, loading: authLoading } = useAuth()
    const [stats, setStats] = useState<AdminStats>({
        totalOffers: 0,
        pendingOffers: 0,
        activeOrders: 0,
        totalRevenue: 0
    })
    const [recentOffers, setRecentOffers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchAdminData() {
            if (!user || profile?.role !== 'admin') return

            try {
                // Fetch total offers
                const { count: totalOffers } = await supabase
                    .from('offers')
                    .select('*', { count: 'exact', head: true })

                // Fetch pending offers
                const { count: pendingOffers } = await supabase
                    .from('offers')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pending')

                // Fetch active orders
                const { count: activeOrders } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })
                    .in('status', ['order_placed', 'device_shipped', 'device_received', 'inspection_in_progress'])

                // Fetch recent offers with user info
                const { data: offers } = await supabase
                    .from('offers')
                    .select(`
                        *,
                        device_models(name),
                        profiles(full_name, email)
                    `)
                    .order('created_at', { ascending: false })
                    .limit(10)

                setStats({
                    totalOffers: totalOffers || 0,
                    pendingOffers: pendingOffers || 0,
                    activeOrders: activeOrders || 0,
                    totalRevenue: 0
                })

                setRecentOffers(offers || [])
            } catch (error) {
                console.error('Error fetching admin data:', error)
            }

            setLoading(false)
        }

        if (user && profile?.role === 'admin') {
            fetchAdminData()
        }
    }, [user, profile])

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f3f5' }}>
                <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <AdminLayout>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#212529', marginBottom: '2rem' }}>
                Dashboard Overview
            </h1>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>Total Offers</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#212529' }}>{stats.totalOffers}</div>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={24} style={{ color: '#1ab35d' }} />
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>Pending Review</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59f00' }}>{stats.pendingOffers}</div>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fff3cd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DollarSign size={24} style={{ color: '#f59f00' }} />
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>Active Orders</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#228be6' }}>{stats.activeOrders}</div>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e7f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Truck size={24} style={{ color: '#228be6' }} />
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>Total Revenue</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1ab35d' }}>{formatCurrency(stats.totalRevenue)}</div>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BarChart3 size={24} style={{ color: '#1ab35d' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Offers Table */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', margin: 0 }}>
                        Recent Offers
                    </h2>
                    <Link href="/admin/offers" style={{ color: '#1ab35d', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
                        View All →
                    </Link>
                </div>

                {recentOffers.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#6c757d' }}>
                        <p>No offers yet.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Device</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Customer</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Quote</th>
                                    <th style={{ padding: '0.875rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOffers.map((offer, idx) => (
                                    <tr key={offer.id} style={{ borderBottom: idx < recentOffers.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ fontWeight: 600, color: '#212529' }}>{offer.device_models?.name || 'Device'}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#212529' }}>{offer.profiles?.full_name || 'Unknown'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{offer.profiles?.email}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                backgroundColor: offer.status === 'pending' ? '#fff3cd' : offer.status === 'accepted' ? '#d3f9d8' : '#f8f9fa',
                                                color: offer.status === 'pending' ? '#856404' : offer.status === 'accepted' ? '#155724' : '#495057'
                                            }}>
                                                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#1ab35d' }}>
                                            {formatCurrency(offer.quoted_price)}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <Link
                                                href={`/admin/offers?view=${offer.id}`}
                                                style={{
                                                    color: '#1ab35d',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500,
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                Review
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

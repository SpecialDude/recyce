'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Truck, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDateShort } from '@/lib/utils'

export default function UserOrdersPage() {
    const { user, loading: authLoading } = useAuth()
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

    return (
        <DashboardLayout title="My Orders">
            {orders.length === 0 ? (
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #f1f3f5',
                    padding: '3rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                }}>
                    <Truck size={48} style={{ color: '#adb5bd', marginBottom: '1rem' }} />
                    <p style={{ color: '#6c757d', marginBottom: '1rem' }}>No orders yet.</p>
                    <Link href="/sell" style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #1ab35d 0%, #159549 100%)',
                        color: '#ffffff',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '10px',
                        fontSize: '0.938rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(26, 179, 93, 0.2)'
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
                                    borderRadius: '16px',
                                    border: '1px solid #f1f3f5',
                                    padding: '1.5rem',
                                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
                                    transition: 'all 0.25s ease'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
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

                                <div className="order-details" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
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
        </DashboardLayout>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { AdminLayout } from '@/components/AdminLayout'
import { Loader2, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDateShort } from '@/lib/utils'

export default function AdminOrdersPage() {
    const { user, profile, loading: authLoading } = useAuth()
    const toast = useToast()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')
    const supabase = createClient()

    useEffect(() => {
        async function fetchOrders() {
            if (!user || profile?.role !== 'admin') return

            let query = supabase
                .from('orders')
                .select(`
                    *,
                    offers(quoted_price, device_models(name)),
                    profiles(full_name, email)
                `)
                .order('created_at', { ascending: false })

            if (filter !== 'all') {
                query = query.eq('status', filter)
            }

            const { data, error } = await query.limit(50)

            if (error) {
                console.error('Error fetching orders:', error)
            } else {
                setOrders(data || [])
            }

            setLoading(false)
        }

        if (user && profile?.role === 'admin') {
            fetchOrders()
        }
    }, [user, profile, filter])

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', orderId)

        if (error) {
            console.error('Error updating order:', error)
            toast.error('Update Failed', error.message)
        } else {
            toast.success('Status Updated', `Order status changed to ${newStatus.replace(/_/g, ' ')}`)
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        }
    }

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f3f5' }}>
                <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    const statusFilters = [
        { value: 'all', label: 'All Orders' },
        { value: 'order_placed', label: 'Placed' },
        { value: 'device_shipped', label: 'Shipped' },
        { value: 'device_received', label: 'Received' },
        { value: 'inspection_in_progress', label: 'Inspecting' },
        { value: 'payout_pending', label: 'Payout Pending' },
        { value: 'payout_complete', label: 'Complete' },
    ]

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

    return (
        <AdminLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#212529', margin: 0 }}>
                    Order Management
                </h1>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {statusFilters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: filter === f.value ? '#1ab35d' : '#ffffff',
                            color: filter === f.value ? '#ffffff' : '#495057',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            boxShadow: filter === f.value ? 'none' : '0 1px 3px rgba(0,0,0,0.08)'
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                {orders.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#6c757d' }}>
                        <p>No orders found.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Order ID</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Device</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Customer</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Date</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Amount</th>
                                    <th style={{ padding: '0.875rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, idx) => {
                                    const statusStyle = getStatusColor(order.status)
                                    return (
                                        <tr key={order.id} style={{ borderBottom: idx < orders.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ fontWeight: 600, color: '#212529', fontSize: '0.875rem' }}>
                                                    {order.order_number || order.id.slice(0, 8)}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.875rem', color: '#212529' }}>
                                                    {order.offers?.device_models?.name || 'Device'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.875rem', color: '#212529' }}>{order.profiles?.full_name || 'Unknown'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{order.profiles?.email}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>{formatDateShort(order.created_at)}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    style={{
                                                        padding: '0.375rem 0.75rem',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        backgroundColor: statusStyle.bg,
                                                        color: statusStyle.color,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 500,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {statusFilters.filter(f => f.value !== 'all').map(f => (
                                                        <option key={f.value} value={f.value}>{f.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#1ab35d' }}>
                                                {formatCurrency(order.final_price || order.offers?.quoted_price || 0)}
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                <button
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #e9ecef',
                                                        backgroundColor: '#ffffff',
                                                        color: '#6c757d',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

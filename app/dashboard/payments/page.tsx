'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Loader2, DollarSign, CheckCircle, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDateShort } from '@/lib/utils'

export default function PaymentHistoryPage() {
    const { user, loading: authLoading } = useAuth()
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

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <DashboardLayout title="Payment History">
            {/* Stats Cards */}
            <div className="payment-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #f1f3f5',
                    padding: '1.25rem',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <DollarSign size={20} style={{ color: '#1ab35d' }} />
                        <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>Total Earnings</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>
                        {formatCurrency(stats.total)}
                    </div>
                </div>
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #f1f3f5',
                    padding: '1.25rem',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Clock size={20} style={{ color: '#f59f00' }} />
                        <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>Pending</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>
                        {formatCurrency(stats.pending)}
                    </div>
                </div>
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #f1f3f5',
                    padding: '1.25rem',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)'
                }}>
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
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #f1f3f5',
                    padding: '3rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                }}>
                    <DollarSign size={48} style={{ color: '#adb5bd', marginBottom: '1rem' }} />
                    <p style={{ color: '#6c757d', marginBottom: '1rem' }}>No payments yet.</p>
                    <p style={{ color: '#adb5bd', fontSize: '0.875rem' }}>Completed device sales will appear here.</p>
                </div>
            ) : (
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #f1f3f5',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
                }}>
                    {/* Mobile-friendly card layout */}
                    <div className="payment-list">
                        {payments.map((payment) => (
                            <div
                                key={payment.id}
                                style={{
                                    padding: '1rem 1.25rem',
                                    borderBottom: '1px solid #f1f3f5',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '0.75rem'
                                }}
                            >
                                <div style={{ minWidth: '150px' }}>
                                    <div style={{ fontWeight: 500, color: '#212529', marginBottom: '0.25rem' }}>
                                        {payment.offers?.device_models?.name || 'Device'}
                                    </div>
                                    <div style={{ fontSize: '0.813rem', color: '#6c757d' }}>
                                        {formatDateShort(payment.updated_at || payment.created_at)}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
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
                                    <span style={{ fontWeight: 600, color: '#1ab35d', fontSize: '1.125rem' }}>
                                        {formatCurrency(payment.final_price || payment.offers?.quoted_price || 0)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

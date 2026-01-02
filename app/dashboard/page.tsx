'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Package, Clock, CheckCircle, DollarSign, User, LogOut, Loader2, Truck, Settings, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDateShort } from '@/lib/utils'

interface DashboardStats {
    totalOffers: number
    pendingOffers: number
    completedOrders: number
    totalEarnings: number
}

export default function DashboardPage() {
    const { user, profile, loading: authLoading, signOut } = useAuth()
    const router = useRouter()
    const [stats, setStats] = useState<DashboardStats>({
        totalOffers: 0,
        pendingOffers: 0,
        completedOrders: 0,
        totalEarnings: 0
    })
    const [recentOffers, setRecentOffers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        async function fetchDashboardData() {
            if (!user) return

            try {
                // Fetch offers count
                const { count: totalOffers } = await supabase
                    .from('offers')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)

                const { count: pendingOffers } = await supabase
                    .from('offers')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('status', 'pending')

                // Fetch completed orders
                const { count: completedOrders } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('status', 'payout_complete')

                // Fetch recent offers
                const { data: offers } = await supabase
                    .from('offers')
                    .select(`
            *,
            device_models(name)
          `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5)

                setStats({
                    totalOffers: totalOffers || 0,
                    pendingOffers: pendingOffers || 0,
                    completedOrders: completedOrders || 0,
                    totalEarnings: 0 // Will calculate from payouts
                })

                setRecentOffers(offers || [])
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            }

            setLoading(false)
        }

        if (user) {
            fetchDashboardData()
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: '#e6f7ed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <User size={20} style={{ color: '#1ab35d' }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#212529' }}>
                                        {profile?.full_name || 'User'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{user?.email}</div>
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

            {/* Main Content */}
            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#212529', margin: 0 }}>
                        Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
                    </h1>
                    {/* Quick Links */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link href="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#ffffff', border: '1px solid #e9ecef', borderRadius: '8px', color: '#495057', textDecoration: 'none', fontSize: '0.875rem' }}>
                            <User size={16} /> Profile
                        </Link>
                        <Link href="/dashboard/settings" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#ffffff', border: '1px solid #e9ecef', borderRadius: '8px', color: '#495057', textDecoration: 'none', fontSize: '0.875rem' }}>
                            <Settings size={16} /> Settings
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2.5rem'
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #e9ecef'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Package size={24} style={{ color: '#1ab35d' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>Total Offers</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>{stats.totalOffers}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #e9ecef'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fff3cd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Clock size={24} style={{ color: '#f59f00' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>Pending</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>{stats.pendingOffers}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #e9ecef'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#d3f9d8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle size={24} style={{ color: '#40c057' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>Completed</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>{stats.completedOrders}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #e9ecef'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e7f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <DollarSign size={24} style={{ color: '#228be6' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>Total Earned</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>{formatCurrency(stats.totalEarnings)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Offers */}
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid #e9ecef',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', margin: 0 }}>
                            Recent Offers
                        </h2>
                        <Link href="/dashboard/offers" style={{ color: '#1ab35d', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
                            View All →
                        </Link>
                    </div>

                    {recentOffers.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#6c757d' }}>
                            <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p style={{ marginBottom: '1rem' }}>No offers yet. Start selling your devices!</p>
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
                        <div>
                            {recentOffers.map((offer, idx) => (
                                <div
                                    key={offer.id}
                                    style={{
                                        padding: '1rem 1.5rem',
                                        borderBottom: idx < recentOffers.length - 1 ? '1px solid #e9ecef' : 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#212529', marginBottom: '0.25rem' }}>
                                            {offer.device_models?.name || 'Device'}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                                            {formatDateShort(offer.created_at)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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
                                        <span style={{ fontWeight: 700, color: '#1ab35d' }}>
                                            {formatCurrency(offer.quoted_price)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Navigation Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                    <Link href="/dashboard/orders" style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e9ecef',
                        padding: '1.25rem',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'box-shadow 0.2s'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#e7f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Truck size={22} style={{ color: '#228be6' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, color: '#212529' }}>My Orders</div>
                                <div style={{ fontSize: '0.813rem', color: '#6c757d' }}>Track your shipments</div>
                            </div>
                        </div>
                        <ChevronRight size={20} style={{ color: '#adb5bd' }} />
                    </Link>

                    <Link href="/dashboard/payments" style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e9ecef',
                        padding: '1.25rem',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'box-shadow 0.2s'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#d3f9d8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <DollarSign size={22} style={{ color: '#40c057' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, color: '#212529' }}>Payments</div>
                                <div style={{ fontSize: '0.813rem', color: '#6c757d' }}>View payment history</div>
                            </div>
                        </div>
                        <ChevronRight size={20} style={{ color: '#adb5bd' }} />
                    </Link>
                </div>
            </main>
        </div>
    )
}


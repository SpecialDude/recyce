'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/DashboardLayout'
import {
    Package,
    Loader2,
    X,
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDateShort } from '@/lib/utils'

interface Offer {
    id: string
    created_at: string
    status: string
    quoted_price: number
    final_price: number | null
    condition: string
    metadata: any
    device_models: {
        name: string
    } | null
}

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: any }> = {
    pending: { label: 'Pending', bg: '#fff3cd', color: '#856404', icon: Clock },
    accepted: { label: 'Accepted', bg: '#d3f9d8', color: '#155724', icon: CheckCircle },
    rejected: { label: 'Rejected', bg: '#f8d7da', color: '#721c24', icon: XCircle },
    expired: { label: 'Expired', bg: '#e9ecef', color: '#495057', icon: Clock },
    revised: { label: 'Revised', bg: '#cfe2ff', color: '#084298', icon: Eye },
}

export default function UserOffersPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [offers, setOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
    const [filter, setFilter] = useState<string>('all')
    const supabase = createClient()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        async function fetchOffers() {
            if (!user) return

            const { data, error } = await supabase
                .from('offers')
                .select(`
                    *,
                    device_models(name)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setOffers(data)
            }
            setLoading(false)
        }

        if (user) {
            fetchOffers()
        }
    }, [user])

    const filteredOffers = filter === 'all'
        ? offers
        : offers.filter(o => o.status === filter)

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <DashboardLayout title="My Offers">
            {/* Header with New Offer button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', marginTop: '-0.5rem' }}>
                <Link href="/sell" style={{
                    backgroundColor: '#1ab35d',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.813rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                }}>
                    + New Offer
                </Link>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {['all', 'pending', 'accepted', 'rejected'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.375rem 0.75rem',
                            borderRadius: '16px',
                            border: 'none',
                            backgroundColor: filter === f ? '#1ab35d' : '#ffffff',
                            color: filter === f ? '#ffffff' : '#495057',
                            fontSize: '0.813rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            boxShadow: filter === f ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Offers List */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e9ecef', overflow: 'hidden' }}>
                {filteredOffers.length === 0 ? (
                    <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: '#6c757d' }}>
                        <Package size={40} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                        <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                            {filter === 'all' ? 'No offers yet. Start selling!' : `No ${filter} offers.`}
                        </p>
                        {filter === 'all' && (
                            <Link href="/sell" style={{
                                display: 'inline-block',
                                backgroundColor: '#1ab35d',
                                color: '#ffffff',
                                padding: '0.625rem 1.25rem',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textDecoration: 'none'
                            }}>
                                Sell a Device
                            </Link>
                        )}
                    </div>
                ) : (
                    filteredOffers.map((offer, idx) => {
                        const status = statusConfig[offer.status] || statusConfig.pending
                        const StatusIcon = status.icon
                        return (
                            <div
                                key={offer.id}
                                onClick={() => setSelectedOffer(offer)}
                                style={{
                                    padding: '1rem',
                                    borderBottom: idx < filteredOffers.length - 1 ? '1px solid #e9ecef' : 'none',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s',
                                    gap: '0.75rem'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Package size={20} style={{ color: '#6c757d' }} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, color: '#212529', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {offer.device_models?.name || 'Device'}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                                            {formatDateShort(offer.created_at)}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '12px',
                                        fontSize: '0.688rem',
                                        fontWeight: 600,
                                        backgroundColor: status.bg,
                                        color: status.color
                                    }}>
                                        <StatusIcon size={12} />
                                        <span className="status-text">{status.label}</span>
                                    </span>
                                    <span style={{ fontWeight: 700, color: '#1ab35d', fontSize: '0.938rem' }}>
                                        {formatCurrency(offer.final_price || offer.quoted_price)}
                                    </span>
                                    <ChevronRight size={18} style={{ color: '#adb5bd' }} className="chevron-icon" />
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Offer Detail Modal */}
            {selectedOffer && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '440px',
                        maxHeight: '85vh',
                        overflow: 'auto'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '1rem 1.25rem',
                            borderBottom: '1px solid #e9ecef',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'sticky',
                            top: 0,
                            backgroundColor: '#ffffff'
                        }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#212529', margin: 0 }}>
                                Offer Details
                            </h2>
                            <button
                                onClick={() => setSelectedOffer(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                            >
                                <X size={22} style={{ color: '#6c757d' }} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '1.25rem' }}>
                            {/* Device Info */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                                    Device
                                </div>
                                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#212529' }}>
                                    {selectedOffer.device_models?.name || 'Device'}
                                </div>
                                <div style={{ fontSize: '0.813rem', color: '#6c757d', marginTop: '0.25rem' }}>
                                    Submitted {formatDateShort(selectedOffer.created_at)}
                                </div>
                            </div>

                            {/* Status */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                                    Status
                                </div>
                                {(() => {
                                    const status = statusConfig[selectedOffer.status] || statusConfig.pending
                                    const StatusIcon = status.icon
                                    return (
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.375rem',
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: '16px',
                                            backgroundColor: status.bg,
                                            color: status.color,
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}>
                                            <StatusIcon size={16} />
                                            {status.label}
                                        </span>
                                    )
                                })()}
                            </div>

                            {/* Price Breakdown */}
                            <div style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '1rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                    Price Breakdown
                                </div>

                                {selectedOffer.metadata?.priceBreakdown ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.813rem' }}>
                                            <span style={{ color: '#495057' }}>Base Price</span>
                                            <span style={{ fontWeight: 600 }}>{formatCurrency(selectedOffer.metadata.priceBreakdown.basePrice)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.813rem' }}>
                                            <span style={{ color: '#495057' }}>Condition</span>
                                            <span style={{ fontWeight: 600, color: '#f59f00' }}>
                                                {Math.round(selectedOffer.metadata.priceBreakdown.conditionMultiplier * 100)}%
                                            </span>
                                        </div>
                                        {selectedOffer.metadata.priceBreakdown.carrierAdjustment !== 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.813rem' }}>
                                                <span style={{ color: '#495057' }}>Carrier</span>
                                                <span style={{ fontWeight: 600, color: selectedOffer.metadata.priceBreakdown.carrierAdjustment >= 0 ? '#40c057' : '#fa5252' }}>
                                                    {selectedOffer.metadata.priceBreakdown.carrierAdjustment >= 0 ? '+' : ''}{formatCurrency(selectedOffer.metadata.priceBreakdown.carrierAdjustment)}
                                                </span>
                                            </div>
                                        )}
                                        {selectedOffer.metadata.priceBreakdown.storageAdjustment !== 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.813rem' }}>
                                                <span style={{ color: '#495057' }}>Storage</span>
                                                <span style={{ fontWeight: 600, color: selectedOffer.metadata.priceBreakdown.storageAdjustment >= 0 ? '#40c057' : '#fa5252' }}>
                                                    {selectedOffer.metadata.priceBreakdown.storageAdjustment >= 0 ? '+' : ''}{formatCurrency(selectedOffer.metadata.priceBreakdown.storageAdjustment)}
                                                </span>
                                            </div>
                                        )}
                                        <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '0.625rem', marginTop: '0.375rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 700, color: '#212529' }}>Final Quote</span>
                                                <span style={{ fontSize: '1.375rem', fontWeight: 700, color: '#1ab35d' }}>
                                                    {formatCurrency(selectedOffer.metadata.priceBreakdown.finalPrice)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#6c757d' }}>Quoted Price</span>
                                        <span style={{ fontSize: '1.375rem', fontWeight: 700, color: '#1ab35d' }}>
                                            {formatCurrency(selectedOffer.quoted_price)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Selected Options */}
                            {selectedOffer.metadata?.selectedOptions && (
                                <div style={{ marginTop: '1.25rem' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        Selected Options
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        {selectedOffer.metadata.selectedOptions.condition && (
                                            <div style={{ padding: '0.625rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '0.688rem', color: '#6c757d', marginBottom: '0.125rem' }}>Condition</div>
                                                <div style={{ fontWeight: 600, color: '#212529', fontSize: '0.813rem' }}>{selectedOffer.metadata.selectedOptions.condition}</div>
                                            </div>
                                        )}
                                        {selectedOffer.metadata.selectedOptions.carrier && (
                                            <div style={{ padding: '0.625rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '0.688rem', color: '#6c757d', marginBottom: '0.125rem' }}>Carrier</div>
                                                <div style={{ fontWeight: 600, color: '#212529', fontSize: '0.813rem' }}>{selectedOffer.metadata.selectedOptions.carrier}</div>
                                            </div>
                                        )}
                                        {selectedOffer.metadata.selectedOptions.storage && (
                                            <div style={{ padding: '0.625rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '0.688rem', color: '#6c757d', marginBottom: '0.125rem' }}>Storage</div>
                                                <div style={{ fontWeight: 600, color: '#212529', fontSize: '0.813rem' }}>{selectedOffer.metadata.selectedOptions.storage}</div>
                                            </div>
                                        )}
                                        <div style={{ padding: '0.625rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '0.688rem', color: '#6c757d', marginBottom: '0.125rem' }}>Accessories</div>
                                            <div style={{ fontWeight: 600, color: '#212529', fontSize: '0.813rem' }}>
                                                {selectedOffer.metadata.selectedOptions.hasOriginalBox && selectedOffer.metadata.selectedOptions.hasOriginalCharger
                                                    ? 'Box & Charger'
                                                    : selectedOffer.metadata.selectedOptions.hasOriginalBox
                                                        ? 'Original Box'
                                                        : selectedOffer.metadata.selectedOptions.hasOriginalCharger
                                                            ? 'Charger'
                                                            : 'None'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e9ecef', backgroundColor: '#f8f9fa' }}>
                            <button
                                onClick={() => setSelectedOffer(null)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: '#1ab35d',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.938rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile adjustments */}
            <style jsx global>{`
                @media (max-width: 480px) {
                    .status-text { display: none; }
                    .chevron-icon { display: none; }
                }
            `}</style>
        </DashboardLayout>
    )
}

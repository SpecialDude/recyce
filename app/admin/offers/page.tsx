'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { AdminLayout } from '@/components/AdminLayout'
import {
    Loader2,
    Check,
    X,
    Eye,
    Edit,
    Save,
    Smartphone,
    User,
    Calendar,
    DollarSign,
    Package
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDateShort } from '@/lib/utils'


// Modal component
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!isOpen) return null

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
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
                padding: '1.5rem',
                width: '100%',
                maxWidth: '540px',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#212529', margin: 0 }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>
                        <X size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

function AdminOffersContent() {
    const { user, profile, loading: authLoading } = useAuth()
    const toast = useToast()
    const searchParams = useSearchParams()
    const [offers, setOffers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')
    const [editingOffer, setEditingOffer] = useState<string | null>(null)
    const [editedPrice, setEditedPrice] = useState<number>(0)
    const [viewingOffer, setViewingOffer] = useState<any | null>(null)
    const supabase = createClient()

    // Handle view param from URL (from dashboard Review link)
    useEffect(() => {
        const viewId = searchParams.get('view')
        if (viewId && offers.length > 0) {
            const offer = offers.find(o => o.id === viewId)
            if (offer) {
                setViewingOffer(offer)
            }
        }
    }, [searchParams, offers])



    useEffect(() => {
        async function fetchOffers() {
            if (!user || profile?.role !== 'admin') return

            let query = supabase
                .from('offers')
                .select(`
          *,
          device_models(name),
          profiles(full_name, email),
          condition_multipliers(condition_name)
        `)
                .order('created_at', { ascending: false })

            if (filter !== 'all') {
                query = query.eq('status', filter)
            }

            const { data, error } = await query.limit(50)

            if (error) {
                console.error('Error fetching offers:', error)
            } else {
                setOffers(data || [])
            }

            setLoading(false)
        }

        if (user && profile?.role === 'admin') {
            fetchOffers()
        }
    }, [user, profile, filter])

    const handleStatusUpdate = async (offerId: string, newStatus: string) => {
        const { error } = await supabase
            .from('offers')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', offerId)

        if (error) {
            console.error('Error updating offer:', error)
            toast.error('Update Failed', error.message)
        } else {
            toast.success('Status Updated', `Offer marked as ${newStatus}`)
            setOffers(offers.map(o => o.id === offerId ? { ...o, status: newStatus } : o))
        }
    }

    const handlePriceEdit = (offer: any) => {
        setEditingOffer(offer.id)
        setEditedPrice(offer.quoted_price)
    }

    const handlePriceSave = async (offerId: string) => {
        const { error } = await supabase
            .from('offers')
            .update({ quoted_price: editedPrice, updated_at: new Date().toISOString() })
            .eq('id', offerId)

        if (error) {
            console.error('Error updating price:', error)
            toast.error('Update Failed', error.message)
        } else {
            toast.success('Price Updated', `New price: ${formatCurrency(editedPrice)}`)
            setOffers(offers.map(o => o.id === offerId ? { ...o, quoted_price: editedPrice } : o))
        }
        setEditingOffer(null)
    }

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f3f5' }}>
                <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    const statusFilters = [
        { value: 'all', label: 'All Offers' },
        { value: 'pending', label: 'Pending' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'declined', label: 'Declined' },
        { value: 'expired', label: 'Expired' },
    ]

    return (
        <AdminLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#212529', margin: 0 }}>
                    Offer Management
                </h1>
            </div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
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

            {/* Offers Table */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                {offers.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#6c757d' }}>
                        <p>No offers found.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Device</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Customer</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Condition</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Date</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Quote</th>
                                    <th style={{ padding: '0.875rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offers.map((offer, idx) => (
                                    <tr key={offer.id} style={{ borderBottom: idx < offers.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ fontWeight: 600, color: '#212529' }}>{offer.device_models?.name || 'Device'}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#212529' }}>{offer.profiles?.full_name || 'Unknown'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{offer.profiles?.email}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#212529' }}>{offer.condition_multipliers?.condition_name || '-'}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>{formatDateShort(offer.created_at)}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                backgroundColor:
                                                    offer.status === 'pending' ? '#fff3cd' :
                                                        offer.status === 'accepted' ? '#d3f9d8' :
                                                            offer.status === 'declined' ? '#ffe3e3' : '#f8f9fa',
                                                color:
                                                    offer.status === 'pending' ? '#856404' :
                                                        offer.status === 'accepted' ? '#155724' :
                                                            offer.status === 'declined' ? '#c92a2a' : '#495057'
                                            }}>
                                                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            {editingOffer === offer.id ? (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <span style={{ color: '#6c757d' }}>$</span>
                                                    <input
                                                        type="number"
                                                        value={editedPrice}
                                                        onChange={(e) => setEditedPrice(parseFloat(e.target.value) || 0)}
                                                        style={{ width: '80px', padding: '0.375rem', border: '1px solid #1ab35d', borderRadius: '6px', fontSize: '0.938rem', fontWeight: 600, textAlign: 'right' }}
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handlePriceSave(offer.id)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', backgroundColor: '#1ab35d', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Save size={14} />
                                                    </button>
                                                    <button onClick={() => setEditingOffer(null)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #ced4da', backgroundColor: '#fff', color: '#6c757d', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <span style={{ fontWeight: 600, color: '#1ab35d' }}>{formatCurrency(offer.quoted_price)}</span>
                                                    {offer.status === 'pending' && (
                                                        <button onClick={() => handlePriceEdit(offer)} style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #e9ecef', backgroundColor: '#fff', color: '#6c757d', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Adjust Price">
                                                            <Edit size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                {offer.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(offer.id, 'accepted')}
                                                            style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                backgroundColor: '#d3f9d8',
                                                                color: '#40c057',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                            title="Accept"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(offer.id, 'declined')}
                                                            style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                backgroundColor: '#ffe3e3',
                                                                color: '#fa5252',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                            title="Decline"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setViewingOffer(offer)}
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Offer Details Modal */}
            <Modal isOpen={!!viewingOffer} onClose={() => setViewingOffer(null)} title="Offer Details">
                {viewingOffer && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Device Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Smartphone size={24} style={{ color: '#1ab35d' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529' }}>
                                    {viewingOffer.device_models?.name || 'Unknown Device'}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                                    Condition: {viewingOffer.condition_multipliers?.condition_name || 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <User size={18} style={{ color: '#6c757d' }} />
                                <span style={{ fontWeight: 500, color: '#212529' }}>Customer</span>
                            </div>
                            <div style={{ fontSize: '0.938rem', color: '#212529' }}>{viewingOffer.profiles?.full_name || 'Unknown'}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>{viewingOffer.profiles?.email || 'No email'}</div>
                        </div>

                        {/* Price Breakdown */}
                        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.813rem', fontWeight: 600, color: '#6c757d', marginBottom: '1rem', textTransform: 'uppercase' }}>
                                Price Breakdown
                            </div>

                            {viewingOffer.metadata?.priceBreakdown ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {/* Base Price */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                        <span style={{ color: '#495057' }}>Base Price</span>
                                        <span style={{ fontWeight: 600, color: '#212529' }}>{formatCurrency(viewingOffer.metadata.priceBreakdown.basePrice)}</span>
                                    </div>

                                    {/* Condition */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                        <span style={{ color: '#495057' }}>
                                            Condition: {viewingOffer.metadata.priceBreakdown.conditionName} ({Math.round(viewingOffer.metadata.priceBreakdown.conditionMultiplier * 100)}%)
                                        </span>
                                        <span style={{ fontWeight: 600, color: '#f59f00' }}>
                                            {formatCurrency(viewingOffer.metadata.priceBreakdown.priceAfterCondition)}
                                        </span>
                                    </div>

                                    {/* Carrier Adjustment */}
                                    {viewingOffer.metadata.priceBreakdown.carrierAdjustment !== 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                            <span style={{ color: '#495057' }}>
                                                Carrier: {viewingOffer.metadata.priceBreakdown.carrierName}
                                            </span>
                                            <span style={{ fontWeight: 600, color: viewingOffer.metadata.priceBreakdown.carrierAdjustment >= 0 ? '#40c057' : '#fa5252' }}>
                                                {viewingOffer.metadata.priceBreakdown.carrierAdjustment >= 0 ? '+' : ''}{formatCurrency(viewingOffer.metadata.priceBreakdown.carrierAdjustment)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Storage Adjustment */}
                                    {viewingOffer.metadata.priceBreakdown.storageAdjustment !== 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                            <span style={{ color: '#495057' }}>
                                                Storage: {viewingOffer.metadata.priceBreakdown.storageName}
                                            </span>
                                            <span style={{ fontWeight: 600, color: viewingOffer.metadata.priceBreakdown.storageAdjustment >= 0 ? '#40c057' : '#fa5252' }}>
                                                {viewingOffer.metadata.priceBreakdown.storageAdjustment >= 0 ? '+' : ''}{formatCurrency(viewingOffer.metadata.priceBreakdown.storageAdjustment)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Accessories */}
                                    {(viewingOffer.metadata.priceBreakdown.boxBonus > 0 || viewingOffer.metadata.priceBreakdown.chargerBonus > 0) && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                            <span style={{ color: '#495057' }}>
                                                Accessories
                                                {viewingOffer.metadata.priceBreakdown.boxBonus > 0 && ' (Box)'}
                                                {viewingOffer.metadata.priceBreakdown.chargerBonus > 0 && ' (Charger)'}
                                            </span>
                                            <span style={{ fontWeight: 600, color: '#40c057' }}>
                                                +{formatCurrency(viewingOffer.metadata.priceBreakdown.boxBonus + viewingOffer.metadata.priceBreakdown.chargerBonus)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Divider */}
                                    <div style={{ borderTop: '1px solid #dee2e6', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 700, color: '#212529' }}>Final Quote</span>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1ab35d' }}>
                                                {formatCurrency(viewingOffer.metadata.priceBreakdown.finalPrice)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Fallback for older offers without breakdown */
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>No breakdown available (legacy offer)</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1ab35d' }}>
                                        {formatCurrency(viewingOffer.quoted_price)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div style={{ padding: '1rem', backgroundColor: viewingOffer.status === 'pending' ? '#fff3cd' : viewingOffer.status === 'accepted' ? '#d3f9d8' : viewingOffer.status === 'declined' ? '#ffe3e3' : '#f8f9fa', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Package size={18} style={{ color: '#6c757d' }} />
                                    <span style={{ fontWeight: 500, color: '#495057' }}>Status</span>
                                </div>
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: viewingOffer.status === 'pending' ? '#f59f00' : viewingOffer.status === 'accepted' ? '#40c057' : viewingOffer.status === 'declined' ? '#fa5252' : '#6c757d',
                                    textTransform: 'capitalize'
                                }}>
                                    {viewingOffer.status}
                                </span>
                            </div>
                        </div>

                        {/* Variant Details */}
                        {(viewingOffer.storage_variant || viewingOffer.carrier_variant) && (
                            <div style={{ padding: '1rem', border: '1px solid #e9ecef', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.813rem', fontWeight: 600, color: '#6c757d', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                    Device Options
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {viewingOffer.storage_variant && (
                                        <div style={{ padding: '0.5rem 1rem', backgroundColor: '#e7f5ff', borderRadius: '8px', fontSize: '0.875rem', color: '#1971c2' }}>
                                            Storage: {viewingOffer.storage_variant}
                                        </div>
                                    )}
                                    {viewingOffer.carrier_variant && (
                                        <div style={{ padding: '0.5rem 1rem', backgroundColor: '#fff3cd', borderRadius: '8px', fontSize: '0.875rem', color: '#856404' }}>
                                            Carrier: {viewingOffer.carrier_variant}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6c757d', fontSize: '0.813rem' }}>
                            <Calendar size={14} />
                            <span>Created: {formatDateShort(viewingOffer.created_at)}</span>
                            {viewingOffer.updated_at && viewingOffer.updated_at !== viewingOffer.created_at && (
                                <span style={{ marginLeft: '1rem' }}>Updated: {formatDateShort(viewingOffer.updated_at)}</span>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {viewingOffer.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button
                                    onClick={() => { handleStatusUpdate(viewingOffer.id, 'accepted'); setViewingOffer(null); }}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem',
                                        backgroundColor: '#1ab35d',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '0.938rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Check size={18} />
                                    Accept Offer
                                </button>
                                <button
                                    onClick={() => { handleStatusUpdate(viewingOffer.id, 'declined'); setViewingOffer(null); }}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem',
                                        backgroundColor: '#fa5252',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '0.938rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={18} />
                                    Decline
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </AdminLayout>
    )
}

export default function AdminOffersPage() {
    return (
        <Suspense fallback={
            <AdminLayout>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                    <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
                </div>
            </AdminLayout>
        }>
            <AdminOffersContent />
        </Suspense>
    )
}

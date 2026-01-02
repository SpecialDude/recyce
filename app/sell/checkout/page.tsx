'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Loader2, Check, Package, MapPin, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency } from '@/lib/utils'

interface DeviceSelection {
    model: any
    condition: any
    carrier: any
    storage: any
    hasBox: boolean
    hasCharger: boolean
    quotedPrice: number
    priceBreakdown?: {
        basePrice: number
        conditionName: string
        conditionMultiplier: number
        priceAfterCondition: number
        carrierName: string | null
        carrierAdjustment: number
        storageName: string | null
        storageAdjustment: number
        boxBonus: number
        chargerBonus: number
        finalPrice: number
    }
}

export default function CheckoutPage() {
    const router = useRouter()
    const { user, profile, loading: authLoading } = useAuth()
    const [selection, setSelection] = useState<DeviceSelection | null>(null)
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const [shipping, setShipping] = useState({
        street: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'US'
    })

    const supabase = createClient()

    useEffect(() => {
        // Get selection from session storage
        const stored = sessionStorage.getItem('deviceSelection')
        if (stored) {
            setSelection(JSON.parse(stored))
        } else {
            router.push('/sell')
        }
    }, [router])

    useEffect(() => {
        if (!authLoading && !user && step > 1) {
            router.push('/login?redirectTo=/sell/checkout')
        }
    }, [user, authLoading, step, router])

    const handleSubmitOffer = async () => {
        if (!user || !selection) return

        setLoading(true)

        try {
            // Create address if we have shipping info
            let addressId = null
            if (shipping.street) {
                const { data: address, error: addressError } = await supabase
                    .from('addresses')
                    .insert({
                        user_id: user.id,
                        type: 'shipping',
                        street: shipping.street,
                        city: shipping.city,
                        state: shipping.state,
                        zip_code: shipping.zip_code,
                        country: shipping.country,
                        is_default: true
                    })
                    .select()
                    .single()

                if (addressError) throw addressError
                addressId = address.id
            }

            // Create the offer
            const offerData = {
                user_id: user.id,
                device_model_id: selection.model.id,
                condition_id: selection.condition.id,
                carrier_variant_id: selection.carrier?.id || null,
                storage_variant_id: selection.storage?.id || null,
                has_original_box: selection.hasBox,
                has_charger: selection.hasCharger,
                quoted_price: selection.quotedPrice,
                status: 'pending',
                expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
                metadata: {
                    priceBreakdown: selection.priceBreakdown || null,
                    selectedOptions: {
                        deviceName: selection.model.name,
                        condition: selection.condition?.condition_name,
                        carrier: selection.carrier?.variant_value || null,
                        storage: selection.storage?.variant_value || null,
                        hasOriginalBox: selection.hasBox,
                        hasOriginalCharger: selection.hasCharger
                    }
                }
            }

            const { data: offer, error: offerError } = await supabase
                .from('offers')
                .insert(offerData)
                .select()
                .single()

            if (offerError) throw offerError

            // Clear session storage
            sessionStorage.removeItem('deviceSelection')

            setSuccess(true)
        } catch (error) {
            console.error('Error submitting offer:', error)
            alert('Error submitting offer. Please try again.')
        }

        setLoading(false)
    }

    if (!selection) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    if (success) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e9ecef', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
                            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                                <Image src="/recyce-logo.png" alt="Recyce" width={140} height={47} style={{ height: 'auto', width: '140px' }} />
                            </Link>
                        </div>
                    </div>
                </nav>

                <main style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 2rem',
                        backgroundColor: '#d3f9d8',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Check size={40} style={{ color: '#40c057' }} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#212529', marginBottom: '1rem' }}>
                        Offer Submitted!
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#6c757d', marginBottom: '2rem' }}>
                        Your offer for <strong>{selection.model.name}</strong> at {formatCurrency(selection.quotedPrice)} has been submitted successfully.
                        We'll send you shipping instructions via email soon.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/dashboard" style={{
                            backgroundColor: '#1ab35d',
                            color: '#ffffff',
                            padding: '0.875rem 2rem',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            textDecoration: 'none'
                        }}>
                            View Dashboard
                        </Link>
                        <Link href="/sell" style={{
                            backgroundColor: '#ffffff',
                            color: '#1ab35d',
                            padding: '0.875rem 2rem',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            border: '2px solid #1ab35d'
                        }}>
                            Sell Another Device
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Navigation */}
            <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e9ecef', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <Image src="/recyce-logo.png" alt="Recyce" width={140} height={47} style={{ height: 'auto', width: '140px' }} />
                        </Link>
                    </div>
                </div>
            </nav>

            <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
                <Link
                    href="/sell"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#6c757d', textDecoration: 'none', fontSize: '0.938rem', marginBottom: '2rem' }}
                >
                    <ArrowLeft size={18} />
                    Start Over
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
                    {/* Main Content */}
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#212529', marginBottom: '2rem' }}>
                            Complete Your Offer
                        </h1>

                        {/* Step 1: Review */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: step >= 1 ? '#1ab35d' : '#e9ecef',
                                    color: step >= 1 ? '#fff' : '#6c757d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.875rem',
                                    fontWeight: 600
                                }}>
                                    {step > 1 ? <Check size={18} /> : '1'}
                                </div>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', margin: 0 }}>
                                    Review Device
                                </h2>
                            </div>

                            <div style={{ marginLeft: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Device</div>
                                    <div style={{ fontWeight: 600, color: '#212529' }}>{selection.model.name}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Condition</div>
                                    <div style={{ fontWeight: 600, color: '#212529' }}>{selection.condition?.condition_name}</div>
                                </div>
                                {selection.carrier && (
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Carrier</div>
                                        <div style={{ fontWeight: 600, color: '#212529' }}>{selection.carrier.variant_value}</div>
                                    </div>
                                )}
                                {selection.storage && (
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Storage</div>
                                        <div style={{ fontWeight: 600, color: '#212529' }}>{selection.storage.variant_value}</div>
                                    </div>
                                )}
                            </div>

                            {step === 1 && (
                                <button
                                    onClick={() => user ? setStep(2) : router.push('/login?redirectTo=/sell/checkout')}
                                    style={{
                                        marginTop: '1.5rem',
                                        marginLeft: '3rem',
                                        backgroundColor: '#1ab35d',
                                        color: '#ffffff',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontSize: '0.938rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {user ? 'Continue to Shipping' : 'Sign In to Continue'}
                                </button>
                            )}
                        </div>

                        {/* Step 2: Shipping */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            opacity: step < 2 ? 0.5 : 1
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: step >= 2 ? '#1ab35d' : '#e9ecef',
                                    color: step >= 2 ? '#fff' : '#6c757d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.875rem',
                                    fontWeight: 600
                                }}>
                                    {step > 2 ? <Check size={18} /> : '2'}
                                </div>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', margin: 0 }}>
                                    Shipping Address
                                </h2>
                            </div>

                            {step >= 2 && (
                                <div style={{ marginLeft: '3rem' }}>
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>
                                                Street Address
                                            </label>
                                            <input
                                                type="text"
                                                value={shipping.street}
                                                onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                                                placeholder="123 Main Street"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    border: '1px solid #ced4da',
                                                    borderRadius: '8px',
                                                    fontSize: '1rem'
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    value={shipping.city}
                                                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        border: '1px solid #ced4da',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem'
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>
                                                    State
                                                </label>
                                                <input
                                                    type="text"
                                                    value={shipping.state}
                                                    onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        border: '1px solid #ced4da',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem'
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>
                                                    ZIP Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={shipping.zip_code}
                                                    onChange={(e) => setShipping({ ...shipping, zip_code: e.target.value })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        border: '1px solid #ced4da',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setStep(3)}
                                        disabled={!shipping.street || !shipping.city || !shipping.state || !shipping.zip_code}
                                        style={{
                                            marginTop: '1.5rem',
                                            backgroundColor: shipping.street && shipping.city && shipping.state && shipping.zip_code ? '#1ab35d' : '#e9ecef',
                                            color: shipping.street && shipping.city && shipping.state && shipping.zip_code ? '#ffffff' : '#6c757d',
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            fontSize: '0.938rem',
                                            fontWeight: 600,
                                            cursor: shipping.street && shipping.city && shipping.state && shipping.zip_code ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        Continue to Submit
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Step 3: Submit */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e9ecef',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            opacity: step < 3 ? 0.5 : 1
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: step >= 3 ? '#1ab35d' : '#e9ecef',
                                    color: step >= 3 ? '#fff' : '#6c757d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.875rem',
                                    fontWeight: 600
                                }}>
                                    3
                                </div>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', margin: 0 }}>
                                    Submit Offer
                                </h2>
                            </div>

                            {step >= 3 && (
                                <div style={{ marginLeft: '3rem' }}>
                                    <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
                                        By submitting this offer, you agree to our terms of service. Once accepted,
                                        we'll send you a prepaid shipping label via email.
                                    </p>
                                    <button
                                        onClick={handleSubmitOffer}
                                        disabled={loading}
                                        style={{
                                            backgroundColor: '#1ab35d',
                                            color: '#ffffff',
                                            padding: '0.875rem 2rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        {loading && <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />}
                                        {loading ? 'Submitting...' : 'Submit Offer'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div style={{
                        position: 'sticky',
                        top: '100px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '1.5rem'
                    }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', marginBottom: '1.5rem' }}>
                            Offer Summary
                        </h2>

                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ fontWeight: 600, color: '#212529', marginBottom: '0.25rem' }}>{selection.model.name}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>{selection.condition?.condition_name}</div>
                        </div>

                        <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#6c757d' }}>Your Quote</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1ab35d' }}>
                                    {formatCurrency(selection.quotedPrice)}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '1rem' }}>
                                * Final price subject to device inspection
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

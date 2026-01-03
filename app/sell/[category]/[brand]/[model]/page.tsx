'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Loader2, Check, Package, BatteryCharging, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DeviceModel, DeviceVariant, ConditionMultiplier } from '@/lib/types/database'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'

interface DeviceSelection {
    model: DeviceModel | null
    condition: ConditionMultiplier | null
    carrier: DeviceVariant | null
    storage: DeviceVariant | null
    hasBox: boolean
    hasCharger: boolean
}

export default function DeviceConfigPage() {
    const params = useParams()
    const router = useRouter()
    const categorySlug = params.category as string
    const brandSlug = params.brand as string
    const modelSlug = params.model as string

    const [model, setModel] = useState<DeviceModel | null>(null)
    const [conditions, setConditions] = useState<ConditionMultiplier[]>([])
    const [carriers, setCarriers] = useState<DeviceVariant[]>([])
    const [storages, setStorages] = useState<DeviceVariant[]>([])
    const [loading, setLoading] = useState(true)
    const [brandName, setBrandName] = useState('')
    const [categoryName, setCategoryName] = useState('')
    const { addItem, itemCount } = useCart()

    const [selection, setSelection] = useState<DeviceSelection>({
        model: null,
        condition: null,
        carrier: null,
        storage: null,
        hasBox: false,
        hasCharger: false
    })

    const supabase = createClient()

    useEffect(() => {
        async function fetchData() {
            // Fetch model with brand info
            const { data: modelData, error: modelError } = await supabase
                .from('device_models')
                .select(`
          *,
          device_brands!inner(name, slug)
        `)
                .eq('slug', modelSlug)
                .single()

            if (modelError) {
                console.error('Error fetching model:', modelError)
                setLoading(false)
                return
            }

            setModel(modelData)
            setSelection(prev => ({ ...prev, model: modelData }))
            setBrandName((modelData.device_brands as any)?.name || '')

            // Get category name from brand
            const { data: brandData } = await supabase
                .from('device_brands')
                .select('device_categories(name)')
                .eq('id', modelData.brand_id)
                .single()
            if (brandData) {
                setCategoryName((brandData.device_categories as any)?.name || '')
            }

            // Fetch conditions
            const { data: conditionsData } = await supabase
                .from('condition_multipliers')
                .select('*')
                .order('display_order', { ascending: true })

            if (conditionsData) {
                setConditions(conditionsData)
            }

            // Fetch variants if model has them
            if (modelData.has_carrier_variants) {
                const { data: carrierData } = await supabase
                    .from('device_variants')
                    .select('*')
                    .eq('model_id', modelData.id)
                    .eq('variant_type', 'carrier')
                    .order('display_order', { ascending: true })

                if (carrierData) {
                    setCarriers(carrierData)
                }
            }

            if (modelData.has_storage_variants) {
                const { data: storageData } = await supabase
                    .from('device_variants')
                    .select('*')
                    .eq('model_id', modelData.id)
                    .eq('variant_type', 'storage')
                    .order('display_order', { ascending: true })

                if (storageData) {
                    setStorages(storageData)
                }
            }

            setLoading(false)
        }

        fetchData()
    }, [modelSlug])

    // Calculate quote with full breakdown
    const calculateQuote = () => {
        if (!model || !selection.condition) return { price: 0, breakdown: null }

        const breakdown = {
            basePrice: model.base_price,
            conditionName: selection.condition.condition_name,
            conditionMultiplier: selection.condition.multiplier,
            priceAfterCondition: model.base_price * selection.condition.multiplier,
            carrierName: selection.carrier?.variant_value || null,
            carrierAdjustment: selection.carrier?.price_adjustment || 0,
            storageName: selection.storage?.variant_value || null,
            storageAdjustment: selection.storage?.price_adjustment || 0,
            boxBonus: selection.hasBox ? 5 : 0,
            chargerBonus: selection.hasCharger ? 5 : 0,
            finalPrice: 0
        }

        // Calculate final price
        let price = breakdown.priceAfterCondition
        price += breakdown.carrierAdjustment
        price += breakdown.storageAdjustment
        price += breakdown.boxBonus
        price += breakdown.chargerBonus
        breakdown.finalPrice = Math.max(0, price)

        return { price: breakdown.finalPrice, breakdown }
    }

    const quoteResult = calculateQuote()
    const currentQuote = quoteResult.price
    const priceBreakdown = quoteResult.breakdown
    const isComplete = selection.condition &&
        (!model?.has_carrier_variants || selection.carrier) &&
        (!model?.has_storage_variants || selection.storage)

    const handleGetQuote = () => {
        // Store selection in session storage and navigate to checkout
        sessionStorage.setItem('deviceSelection', JSON.stringify({
            ...selection,
            quotedPrice: currentQuote,
            priceBreakdown: priceBreakdown
        }))
        router.push('/sell/checkout')
    }

    const handleAddToBox = () => {
        if (!model || !selection.condition) return

        addItem({
            modelId: model.id,
            modelName: model.name,
            brandName: brandName,
            categoryName: categoryName,
            conditionId: selection.condition.id,
            conditionName: selection.condition.condition_name,
            carrierId: selection.carrier?.id,
            carrierName: selection.carrier?.variant_value,
            storageId: selection.storage?.id,
            storageName: selection.storage?.variant_value,
            hasOriginalBox: selection.hasBox,
            hasOriginalCharger: selection.hasCharger,
            quotedPrice: currentQuote,
            imageUrl: model.image_url || undefined
        })

        router.push('/my-box')
    }

    if (loading) {
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
                    </div>
                </div>
            </nav>

            {/* Progress Bar */}
            <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e9ecef' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1ab35d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>✓</div>
                        <div style={{ flex: 1, height: '4px', backgroundColor: '#1ab35d', borderRadius: '2px' }} />
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1ab35d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>✓</div>
                        <div style={{ flex: 1, height: '4px', backgroundColor: '#1ab35d', borderRadius: '2px' }} />
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1ab35d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>3</div>
                        <div style={{ flex: 1, height: '4px', backgroundColor: '#e9ecef', borderRadius: '2px' }}>
                            <div style={{ width: isComplete ? '100%' : '50%', height: '100%', backgroundColor: '#1ab35d', borderRadius: '2px', transition: 'width 0.3s' }} />
                        </div>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: isComplete ? '#1ab35d' : '#e9ecef', color: isComplete ? '#fff' : '#6c757d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.3s' }}>4</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#6c757d' }}>
                        <span style={{ color: '#1ab35d' }}>Brand</span>
                        <span style={{ color: '#1ab35d' }}>Model</span>
                        <span style={{ color: '#1ab35d', fontWeight: 500 }}>Condition</span>
                        <span style={{ color: isComplete ? '#1ab35d' : '#6c757d' }}>Quote</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
                <Link
                    href={`/sell/${categorySlug}/${brandSlug}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#6c757d', textDecoration: 'none', fontSize: '0.938rem', marginBottom: '2rem' }}
                >
                    <ArrowLeft size={18} />
                    Back to Models
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
                    {/* Left Column - Configuration */}
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#212529', marginBottom: '2rem' }}>
                            Configure Your {model?.name}
                        </h1>

                        {/* Condition Selection */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>
                                What condition is your device in?
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {conditions.map((cond) => (
                                    <button
                                        key={cond.id}
                                        onClick={() => setSelection(prev => ({ ...prev, condition: cond }))}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            padding: '1.125rem 1.5rem',
                                            backgroundColor: selection.condition?.id === cond.id ? 'rgba(26, 179, 93, 0.08)' : '#ffffff',
                                            border: `1.5px solid ${selection.condition?.id === cond.id ? '#1ab35d' : '#f1f3f5'}`,
                                            borderRadius: '14px',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                                            boxShadow: selection.condition?.id === cond.id ? '0 4px 16px rgba(26, 179, 93, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
                                            transform: selection.condition?.id === cond.id ? 'translateY(-1px)' : 'translateY(0)'
                                        }}
                                    >
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            border: `2px solid ${selection.condition?.id === cond.id ? '#1ab35d' : '#ced4da'}`,
                                            backgroundColor: selection.condition?.id === cond.id ? '#1ab35d' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            {selection.condition?.id === cond.id && <Check size={14} color="#fff" />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, color: '#212529', marginBottom: '0.25rem' }}>{cond.condition_name}</div>
                                            <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>{cond.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Carrier Selection */}
                        {model?.has_carrier_variants && carriers.length > 0 && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>
                                    Select your carrier
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                                    {carriers.map((carrier) => (
                                        <button
                                            key={carrier.id}
                                            onClick={() => setSelection(prev => ({ ...prev, carrier }))}
                                            style={{
                                                padding: '1.125rem',
                                                backgroundColor: selection.carrier?.id === carrier.id ? 'rgba(26, 179, 93, 0.08)' : '#ffffff',
                                                border: `1.5px solid ${selection.carrier?.id === carrier.id ? '#1ab35d' : '#f1f3f5'}`,
                                                borderRadius: '14px',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                                                boxShadow: selection.carrier?.id === carrier.id ? '0 4px 16px rgba(26, 179, 93, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
                                                transform: selection.carrier?.id === carrier.id ? 'scale(1.02)' : 'scale(1)'
                                            }}
                                        >
                                            <div style={{ fontWeight: 600, color: '#212529' }}>{carrier.variant_value}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Storage Selection */}
                        {model?.has_storage_variants && storages.length > 0 && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>
                                    Select storage capacity
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
                                    {storages.map((storage) => (
                                        <button
                                            key={storage.id}
                                            onClick={() => setSelection(prev => ({ ...prev, storage }))}
                                            style={{
                                                padding: '1.125rem',
                                                backgroundColor: selection.storage?.id === storage.id ? 'rgba(26, 179, 93, 0.08)' : '#ffffff',
                                                border: `1.5px solid ${selection.storage?.id === storage.id ? '#1ab35d' : '#f1f3f5'}`,
                                                borderRadius: '14px',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                                                boxShadow: selection.storage?.id === storage.id ? '0 4px 16px rgba(26, 179, 93, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
                                                transform: selection.storage?.id === storage.id ? 'scale(1.02)' : 'scale(1)'
                                            }}
                                        >
                                            <div style={{ fontWeight: 600, color: '#212529' }}>{storage.variant_value}</div>
                                            {storage.price_adjustment > 0 && (
                                                <div style={{ fontSize: '0.75rem', color: '#1ab35d', marginTop: '0.25rem' }}>
                                                    +{formatCurrency(storage.price_adjustment)}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Accessories */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>
                                Do you have these accessories?
                            </h2>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => setSelection(prev => ({ ...prev, hasBox: !prev.hasBox }))}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.875rem',
                                        padding: '1.125rem 1.5rem',
                                        backgroundColor: selection.hasBox ? 'rgba(26, 179, 93, 0.08)' : '#ffffff',
                                        border: `1.5px solid ${selection.hasBox ? '#1ab35d' : '#f1f3f5'}`,
                                        borderRadius: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                                        boxShadow: selection.hasBox ? '0 4px 16px rgba(26, 179, 93, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
                                        transform: selection.hasBox ? 'scale(1.02)' : 'scale(1)'
                                    }}
                                >
                                    <Package size={24} style={{ color: selection.hasBox ? '#1ab35d' : '#6c757d', transition: 'color 0.2s' }} />
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: 600, color: '#212529' }}>Original Box</div>
                                        <div style={{ fontSize: '0.75rem', color: '#1ab35d', fontWeight: 500 }}>+$5</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setSelection(prev => ({ ...prev, hasCharger: !prev.hasCharger }))}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.875rem',
                                        padding: '1.125rem 1.5rem',
                                        backgroundColor: selection.hasCharger ? 'rgba(26, 179, 93, 0.08)' : '#ffffff',
                                        border: `1.5px solid ${selection.hasCharger ? '#1ab35d' : '#f1f3f5'}`,
                                        borderRadius: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                                        boxShadow: selection.hasCharger ? '0 4px 16px rgba(26, 179, 93, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
                                        transform: selection.hasCharger ? 'scale(1.02)' : 'scale(1)'
                                    }}
                                >
                                    <BatteryCharging size={24} style={{ color: selection.hasCharger ? '#1ab35d' : '#6c757d', transition: 'color 0.2s' }} />
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: 600, color: '#212529' }}>Charger</div>
                                        <div style={{ fontSize: '0.75rem', color: '#1ab35d', fontWeight: 500 }}>+$5</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Quote Summary */}
                    <div style={{
                        position: 'sticky',
                        top: '100px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #f1f3f5',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)'
                    }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', marginBottom: '1.5rem' }}>
                            Your Quote
                        </h2>

                        {/* Device Image */}
                        <div style={{
                            width: '100%',
                            height: '140px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            overflow: 'hidden'
                        }}>
                            {model?.image_url ? (
                                <img
                                    src={model.image_url}
                                    alt={model.name}
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: '12px' }}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                        const fallback = e.currentTarget.nextElementSibling as HTMLElement
                                        if (fallback) fallback.style.display = 'flex'
                                    }}
                                />
                            ) : null}
                            <div style={{
                                display: model?.image_url ? 'none' : 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#adb5bd'
                            }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                    <line x1="12" y1="18" x2="12.01" y2="18" />
                                </svg>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>Device</div>
                            <div style={{ fontWeight: 600, color: '#212529' }}>{model?.name}</div>
                        </div>

                        {selection.condition && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>Condition</div>
                                <div style={{ fontWeight: 600, color: '#212529' }}>{selection.condition.condition_name}</div>
                            </div>
                        )}

                        {selection.carrier && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>Carrier</div>
                                <div style={{ fontWeight: 600, color: '#212529' }}>{selection.carrier.variant_value}</div>
                            </div>
                        )}

                        {selection.storage && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>Storage</div>
                                <div style={{ fontWeight: 600, color: '#212529' }}>{selection.storage.variant_value}</div>
                            </div>
                        )}

                        <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '1rem', color: '#212529' }}>Estimated Value</span>
                                <span style={{ fontSize: '2rem', fontWeight: 700, color: '#1ab35d' }}>
                                    {formatCurrency(currentQuote)}
                                </span>
                            </div>

                            <button
                                onClick={handleGetQuote}
                                disabled={!isComplete}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: isComplete ? '#1ab35d' : '#e9ecef',
                                    color: isComplete ? '#ffffff' : '#6c757d',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: isComplete ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {isComplete ? 'Get My Quote' : 'Complete Selection'}
                            </button>

                            {isComplete && (
                                <button
                                    onClick={handleAddToBox}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        marginTop: '0.75rem',
                                        backgroundColor: '#ffffff',
                                        color: '#1ab35d',
                                        border: '2px solid #1ab35d',
                                        borderRadius: '12px',
                                        fontSize: '0.938rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <ShoppingBag size={18} />
                                    Add to My Box
                                    {itemCount > 0 && (
                                        <span style={{
                                            backgroundColor: '#1ab35d',
                                            color: '#ffffff',
                                            padding: '0.125rem 0.5rem',
                                            borderRadius: '10px',
                                            fontSize: '0.75rem',
                                            marginLeft: '0.25rem'
                                        }}>
                                            {itemCount}
                                        </span>
                                    )}
                                </button>
                            )}

                            {!isComplete && (
                                <p style={{ fontSize: '0.75rem', color: '#6c757d', textAlign: 'center', marginTop: '0.75rem' }}>
                                    Please select all required options above
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DeviceBrand, DeviceModel } from '@/lib/types/database'
import { formatCurrency } from '@/lib/utils'

export default function ModelSelectionPage() {
    const params = useParams()
    const categorySlug = params.category as string
    const brandSlug = params.brand as string

    const [brand, setBrand] = useState<DeviceBrand | null>(null)
    const [models, setModels] = useState<DeviceModel[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchData() {
            // Fetch brand with category - filter by both slugs to get unique result
            const { data: brandData, error: brandError } = await supabase
                .from('device_brands')
                .select(`
          *,
          device_categories!inner(slug, name)
        `)
                .eq('slug', brandSlug)
                .eq('device_categories.slug', categorySlug)
                .single()

            if (brandError) {
                console.error('Error fetching brand:', brandError)
                setLoading(false)
                return
            }

            setBrand(brandData)

            // Fetch models for this brand
            const { data: modelsData, error: modelsError } = await supabase
                .from('device_models')
                .select('*')
                .eq('brand_id', brandData.id)
                .eq('is_active', true)
                .order('base_price', { ascending: false })

            if (modelsError) {
                console.error('Error fetching models:', modelsError)
            } else {
                setModels(modelsData || [])
            }

            setLoading(false)
        }

        fetchData()
    }, [brandSlug])

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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <Link href="/login" style={{ color: '#495057', fontSize: '0.938rem', fontWeight: 500, textDecoration: 'none' }}>
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Progress Bar */}
            <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e9ecef' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#1ab35d',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}>✓</div>
                        <div style={{ flex: 1, height: '4px', backgroundColor: '#1ab35d', borderRadius: '2px' }} />
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#1ab35d',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}>2</div>
                        <div style={{ flex: 1, height: '4px', backgroundColor: '#e9ecef', borderRadius: '2px' }}>
                            <div style={{ width: '50%', height: '100%', backgroundColor: '#1ab35d', borderRadius: '2px' }} />
                        </div>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#e9ecef',
                            color: '#6c757d',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}>3</div>
                        <div style={{ flex: 1, height: '4px', backgroundColor: '#e9ecef', borderRadius: '2px' }} />
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#e9ecef',
                            color: '#6c757d',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}>4</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#6c757d' }}>
                        <span style={{ color: '#1ab35d' }}>Brand</span>
                        <span style={{ color: '#1ab35d', fontWeight: 500 }}>Model</span>
                        <span>Condition</span>
                        <span>Quote</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
                {/* Back Link */}
                <Link
                    href={`/sell/${categorySlug}`}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#6c757d',
                        textDecoration: 'none',
                        fontSize: '0.938rem',
                        marginBottom: '2rem'
                    }}
                >
                    <ArrowLeft size={18} />
                    Back to Brands
                </Link>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: '#212529',
                        marginBottom: '0.75rem'
                    }}>
                        Select Your {brand?.name || ''} Model
                    </h1>
                    <p style={{
                        fontSize: '1rem',
                        color: '#6c757d'
                    }}>
                        Choose your specific device model to get an accurate quote
                    </p>
                </div>

                {/* Models Grid */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <Loader2 size={40} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : models.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#6c757d' }}>
                        <p>No models available for this brand yet.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.25rem'
                    }}>
                        {models.map((model) => (
                            <Link
                                key={model.id}
                                href={`/sell/${categorySlug}/${brandSlug}/${model.slug}`}
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '12px',
                                    padding: '1.25rem',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#1ab35d'
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(26, 179, 93, 0.1)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e9ecef'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                {/* Device Image */}
                                <div style={{
                                    width: '72px',
                                    height: '72px',
                                    borderRadius: '12px',
                                    backgroundColor: '#f8f9fa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    overflow: 'hidden'
                                }}>
                                    {model.image_url ? (
                                        <img
                                            src={model.image_url}
                                            alt={model.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none'
                                                const fallback = e.currentTarget.nextElementSibling as HTMLElement
                                                if (fallback) fallback.style.display = 'block'
                                            }}
                                        />
                                    ) : null}
                                    <div style={{
                                        display: model.image_url ? 'none' : 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#adb5bd'
                                    }}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                            <line x1="12" y1="18" x2="12.01" y2="18" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Model Info */}
                                <div style={{ flex: 1 }}>
                                    <h2 style={{
                                        fontSize: '1.0625rem',
                                        fontWeight: 600,
                                        color: '#212529',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {model.name}
                                    </h2>
                                    <p style={{
                                        fontSize: '0.813rem',
                                        color: '#6c757d',
                                        margin: 0
                                    }}>
                                        Get up to
                                    </p>
                                </div>
                                {/* Price */}
                                <div style={{
                                    fontSize: '1.375rem',
                                    fontWeight: 700,
                                    color: '#1ab35d'
                                }}>
                                    {formatCurrency(model.base_price)}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

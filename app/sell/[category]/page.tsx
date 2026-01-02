'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DeviceCategory, DeviceBrand } from '@/lib/types/database'

export default function BrandSelectionPage() {
    const params = useParams()
    const categorySlug = params.category as string

    const [category, setCategory] = useState<DeviceCategory | null>(null)
    const [brands, setBrands] = useState<DeviceBrand[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchData() {
            // Fetch category
            const { data: categoryData, error: categoryError } = await supabase
                .from('device_categories')
                .select('*')
                .eq('slug', categorySlug)
                .single()

            if (categoryError) {
                console.error('Error fetching category:', categoryError)
                setLoading(false)
                return
            }

            setCategory(categoryData)

            // Fetch brands for this category
            const { data: brandsData, error: brandsError } = await supabase
                .from('device_brands')
                .select('*')
                .eq('category_id', categoryData.id)
                .eq('is_active', true)
                .order('display_order', { ascending: true })

            if (brandsError) {
                console.error('Error fetching brands:', brandsError)
            } else {
                setBrands(brandsData || [])
            }

            setLoading(false)
        }

        fetchData()
    }, [categorySlug])

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
                        }}>1</div>
                        <div style={{ flex: 1, height: '4px', backgroundColor: '#e9ecef', borderRadius: '2px' }}>
                            <div style={{ width: '25%', height: '100%', backgroundColor: '#1ab35d', borderRadius: '2px' }} />
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
                        }}>2</div>
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
                        <span style={{ color: '#1ab35d', fontWeight: 500 }}>Brand</span>
                        <span>Model</span>
                        <span>Condition</span>
                        <span>Quote</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
                {/* Back Link */}
                <Link
                    href="/sell"
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
                    Back to Categories
                </Link>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: '#212529',
                        marginBottom: '0.75rem'
                    }}>
                        Select Your {category?.name || 'Device'} Brand
                    </h1>
                    <p style={{
                        fontSize: '1rem',
                        color: '#6c757d'
                    }}>
                        Choose the brand of your device
                    </p>
                </div>

                {/* Brands Grid */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <Loader2 size={40} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : brands.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#6c757d' }}>
                        <p>No brands available for this category yet.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '1.25rem'
                    }}>
                        {brands.map((brand) => (
                            <Link
                                key={brand.id}
                                href={`/sell/${categorySlug}/${brand.slug}`}
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '1rem'
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
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '12px',
                                    backgroundColor: '#f8f9fa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {brand.logo_url ? (
                                        <img
                                            src={brand.logo_url}
                                            alt={brand.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none'
                                                const fallback = e.currentTarget.nextElementSibling as HTMLElement
                                                if (fallback) fallback.style.display = 'flex'
                                            }}
                                        />
                                    ) : null}
                                    <span style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: '#1ab35d',
                                        display: brand.logo_url ? 'none' : 'flex'
                                    }}>
                                        {brand.name.charAt(0)}
                                    </span>
                                </div>
                                <h2 style={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: '#212529',
                                    margin: 0
                                }}>
                                    {brand.name}
                                </h2>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

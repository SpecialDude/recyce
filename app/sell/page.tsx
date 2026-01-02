'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Tablet, Laptop, Watch, Gamepad, Monitor, ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DeviceCategory } from '@/lib/types/database'

const iconMap: Record<string, React.ElementType> = {
    'phone': Phone,
    'tablet': Tablet,
    'laptop': Laptop,
    'smartwatch': Watch,
    'gaming-console': Gamepad,
    'desktop': Monitor,
}

export default function SellPage() {
    const [categories, setCategories] = useState<DeviceCategory[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchCategories() {
            const { data, error } = await supabase
                .from('device_categories')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true })

            if (error) {
                console.error('Error fetching categories:', error)
            } else {
                setCategories(data || [])
            }
            setLoading(false)
        }

        fetchCategories()
    }, [])

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

            {/* Main Content */}
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
                {/* Back Link */}
                <Link
                    href="/"
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
                    Back to Home
                </Link>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: '#212529',
                        marginBottom: '1rem'
                    }}>
                        What would you like to sell?
                    </h1>
                    <p style={{
                        fontSize: '1.125rem',
                        color: '#6c757d',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Select a category to get started with your instant quote
                    </p>
                </div>

                {/* Categories Grid */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <Loader2 size={40} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {categories.map((category) => {
                            const Icon = iconMap[category.slug] || Phone
                            return (
                                <Link
                                    key={category.id}
                                    href={`/sell/${category.slug}`}
                                    style={{
                                        backgroundColor: '#ffffff',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '16px',
                                        padding: '2.5rem 2rem',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#1ab35d'
                                        e.currentTarget.style.transform = 'translateY(-4px)'
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(26, 179, 93, 0.12)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e9ecef'
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        margin: '0 auto 1.5rem',
                                        backgroundColor: '#e6f7ed',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {category.icon_url ? (
                                            <img
                                                src={category.icon_url}
                                                alt={category.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.removeAttribute('style'); }}
                                            />
                                        ) : null}
                                        <Icon size={40} style={{ color: '#1ab35d', display: category.icon_url ? 'none' : 'block' }} />
                                    </div>
                                    <h2 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 600,
                                        color: '#212529',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {category.name}
                                    </h2>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}

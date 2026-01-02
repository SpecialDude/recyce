'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { Trash2, ShoppingBag, ArrowRight, Plus, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function MyBoxPage() {
    const { items, removeItem, clearCart, totalPrice, itemCount } = useCart()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleCheckout = () => {
        // Store cart data in sessionStorage for checkout
        sessionStorage.setItem('checkout_cart', JSON.stringify(items))
        sessionStorage.setItem('checkout_total', totalPrice.toString())
        router.push('/sell/checkout?mode=cart')
    }

    if (!mounted) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#6c757d' }}>Loading...</div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Navigation */}
            <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e9ecef', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <Image src="/recyce-logo.png" alt="Recyce" width={140} height={47} style={{ height: 'auto', width: '140px' }} />
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <Link href="/sell" style={{ color: '#495057', textDecoration: 'none', fontSize: '0.938rem', fontWeight: 500 }}>
                                <Plus size={18} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                                Add Device
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <ShoppingBag size={32} style={{ color: '#1ab35d' }} />
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#212529', margin: 0 }}>
                        My Box
                    </h1>
                    {itemCount > 0 && (
                        <span style={{
                            backgroundColor: '#1ab35d',
                            color: '#ffffff',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}>
                            {itemCount} {itemCount === 1 ? 'device' : 'devices'}
                        </span>
                    )}
                </div>

                {items.length === 0 ? (
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        border: '1px solid #e9ecef',
                        padding: '4rem 2rem',
                        textAlign: 'center'
                    }}>
                        <Package size={64} style={{ color: '#adb5bd', marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212529', marginBottom: '0.75rem' }}>
                            Your box is empty
                        </h2>
                        <p style={{ color: '#6c757d', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                            Add devices to your box to get quotes for multiple items at once and save on shipping.
                        </p>
                        <Link href="/sell" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#1ab35d',
                            color: '#ffffff',
                            padding: '0.875rem 1.5rem',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            textDecoration: 'none'
                        }}>
                            <Plus size={20} />
                            Add a Device
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
                        {/* Cart Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '12px',
                                        border: '1px solid #e9ecef',
                                        padding: '1.25rem',
                                        display: 'flex',
                                        gap: '1rem',
                                        alignItems: 'start'
                                    }}
                                >
                                    {/* Device Image */}
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '10px',
                                        backgroundColor: '#f8f9fa',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        overflow: 'hidden'
                                    }}>
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.modelName}
                                                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none'
                                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement
                                                    if (fallback) fallback.style.display = 'flex'
                                                }}
                                            />
                                        ) : null}
                                        <div style={{
                                            display: item.imageUrl ? 'none' : 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#adb5bd'
                                        }}>
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                                <line x1="12" y1="18" x2="12.01" y2="18" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Device Info */}
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#212529', marginBottom: '0.375rem' }}>
                                            {item.modelName}
                                        </h3>
                                        <p style={{ color: '#6c757d', fontSize: '0.813rem', marginBottom: '0.625rem' }}>
                                            {item.brandName} • {item.categoryName}
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                            <span style={{
                                                backgroundColor: '#f8f9fa',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                color: '#495057'
                                            }}>
                                                {item.conditionName}
                                            </span>
                                            {item.storageName && (
                                                <span style={{
                                                    backgroundColor: '#f8f9fa',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    color: '#495057'
                                                }}>
                                                    {item.storageName}
                                                </span>
                                            )}
                                            {item.carrierName && (
                                                <span style={{
                                                    backgroundColor: '#f8f9fa',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    color: '#495057'
                                                }}>
                                                    {item.carrierName}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1ab35d' }}>
                                                {formatCurrency(item.quotedPrice)}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '8px',
                                                border: '1px solid #e9ecef',
                                                backgroundColor: '#ffffff',
                                                color: '#fa5252',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Add More */}
                            <Link
                                href="/sell"
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '12px',
                                    border: '2px dashed #e9ecef',
                                    padding: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    color: '#6c757d',
                                    textDecoration: 'none',
                                    fontSize: '0.938rem',
                                    fontWeight: 500
                                }}
                            >
                                <Plus size={20} />
                                Add Another Device
                            </Link>
                        </div>

                        {/* Summary Sidebar */}
                        <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e9ecef',
                            padding: '1.5rem',
                            position: 'sticky',
                            top: '100px'
                        }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#212529', marginBottom: '1.5rem' }}>
                                Order Summary
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6c757d', fontSize: '0.938rem' }}>
                                    <span>Devices ({itemCount})</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6c757d', fontSize: '0.938rem' }}>
                                    <span>Shipping</span>
                                    <span style={{ color: '#1ab35d', fontWeight: 500 }}>FREE</span>
                                </div>
                            </div>

                            <div style={{
                                borderTop: '1px solid #e9ecef',
                                paddingTop: '1rem',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontWeight: 600, color: '#212529' }}>Total Payout</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1ab35d' }}>
                                    {formatCurrency(totalPrice)}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    backgroundColor: '#1ab35d',
                                    color: '#ffffff',
                                    padding: '1rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    marginBottom: '1rem'
                                }}
                            >
                                Checkout <ArrowRight size={20} />
                            </button>

                            <button
                                onClick={clearCart}
                                style={{
                                    width: '100%',
                                    background: 'none',
                                    border: 'none',
                                    color: '#6c757d',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    padding: '0.5rem'
                                }}
                            >
                                Clear Box
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { AdminLayout } from '@/components/AdminLayout'
import { Loader2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminPricingPage() {
    const { user, profile, loading: authLoading } = useAuth()
    const toast = useToast()
    const [conditions, setConditions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        async function fetchPricing() {
            if (!user || profile?.role !== 'admin') return

            const { data } = await supabase
                .from('condition_multipliers')
                .select('*')
                .order('display_order')

            setConditions(data || [])
            setLoading(false)
        }

        if (user && profile?.role === 'admin') {
            fetchPricing()
        }
    }, [user, profile])

    const handleMultiplierChange = (id: string, value: number) => {
        setConditions(conditions.map(c =>
            c.id === id ? { ...c, multiplier: value } : c
        ))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            for (const condition of conditions) {
                await supabase
                    .from('condition_multipliers')
                    .update({ multiplier: condition.multiplier })
                    .eq('id', condition.id)
            }
            toast.success('Saved', 'Pricing multipliers updated successfully!')
        } catch (error) {
            console.error('Error saving pricing:', error)
            toast.error('Save Failed', 'Could not save pricing changes')
        }
        setSaving(false)
    }

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f3f5' }}>
                <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <AdminLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#212529', margin: 0 }}>
                    Pricing Configuration
                </h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: '#1ab35d',
                        color: '#ffffff',
                        padding: '0.625rem 1.25rem',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1
                    }}
                >
                    {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Condition Multipliers */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>
                    Condition Multipliers
                </h2>
                <p style={{ color: '#6c757d', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                    Set the price multiplier for each device condition. The base price will be multiplied by this value.
                </p>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {conditions.map((condition) => (
                        <div
                            key={condition.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem 1.25rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px'
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 600, color: '#212529', marginBottom: '0.25rem' }}>
                                    {condition.condition_name}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                                    {condition.description}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={condition.multiplier}
                                    onChange={(e) => handleMultiplierChange(condition.id, parseFloat(e.target.value))}
                                    style={{ width: '150px', accentColor: '#1ab35d' }}
                                />
                                <div style={{
                                    width: '60px',
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    color: '#1ab35d',
                                    fontSize: '1.125rem'
                                }}>
                                    {Math.round(condition.multiplier * 100)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing Info */}
            <div style={{ backgroundColor: '#e7f5ff', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1971c2', marginBottom: '0.5rem' }}>
                    How Pricing Works
                </h3>
                <p style={{ color: '#1971c2', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    The final quote is calculated as: <strong>Base Price × Condition Multiplier + Variant Adjustments + Accessories Bonus</strong>.
                    <br />
                    For example, an iPhone 16 Pro ($850 base) in "Good" condition (80%) = $680 base quote.
                </p>
            </div>
        </AdminLayout>
    )
}

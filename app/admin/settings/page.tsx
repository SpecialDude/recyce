'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AdminLayout } from '@/components/AdminLayout'
import {
    Save,
    Loader2,
    CheckCircle,
    Mail,
    Globe,
    DollarSign,
    Bell,
    Shield,
    Palette
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PlatformSettings {
    site_name: string
    support_email: string
    currency: string
    min_payout_amount: number
    inspection_days: number
    offer_expiry_days: number
    enable_email_notifications: boolean
    enable_sms_notifications: boolean
    maintenance_mode: boolean
}

export default function AdminSettingsPage() {
    const { user, profile, loading: authLoading } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [settings, setSettings] = useState<PlatformSettings>({
        site_name: 'Recyce',
        support_email: 'support@recyce.com',
        currency: 'USD',
        min_payout_amount: 10,
        inspection_days: 2,
        offer_expiry_days: 7,
        enable_email_notifications: true,
        enable_sms_notifications: false,
        maintenance_mode: false
    })
    const supabase = createClient()

    useEffect(() => {
        async function fetchSettings() {
            // In a real app, you'd fetch from a settings table
            // For now, we'll use default values
            setLoading(false)
        }

        if (user && profile?.role === 'admin') {
            fetchSettings()
        }
    }, [user, profile])

    const handleSave = async () => {
        setSaving(true)
        // Simulate saving
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    const updateSetting = (key: keyof PlatformSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f3f5' }}>
                <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        border: '1.5px solid #e9ecef',
        fontSize: '0.938rem',
        transition: 'all 0.2s ease',
        backgroundColor: '#ffffff'
    }

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: '#495057',
        marginBottom: '0.5rem'
    }

    const sectionStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #f1f3f5',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)'
    }

    const toggleStyle = (enabled: boolean) => ({
        width: '48px',
        height: '28px',
        borderRadius: '14px',
        backgroundColor: enabled ? '#1ab35d' : '#e9ecef',
        position: 'relative' as const,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: 'none'
    })

    const toggleKnobStyle = (enabled: boolean) => ({
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        position: 'absolute' as const,
        top: '3px',
        left: enabled ? '23px' : '3px',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
    })

    return (
        <AdminLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#212529' }}>
                    Platform Settings
                </h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: saved ? '#40c057' : 'linear-gradient(135deg, #1ab35d 0%, #159549 100%)',
                        color: '#ffffff',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '10px',
                        border: 'none',
                        fontSize: '0.938rem',
                        fontWeight: 600,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px rgba(26, 179, 93, 0.25)',
                        transition: 'all 0.25s ease',
                        opacity: saving ? 0.7 : 1
                    }}
                >
                    {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> :
                        saved ? <CheckCircle size={18} /> : <Save size={18} />}
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            {/* General Settings */}
            <div style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #e6f7ed 0%, #d4f1e0 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Globe size={20} style={{ color: '#1ab35d' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', margin: 0 }}>General Settings</h2>
                        <p style={{ fontSize: '0.813rem', color: '#6c757d', margin: 0 }}>Basic platform configuration</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    <div>
                        <label style={labelStyle}>Site Name</label>
                        <input
                            type="text"
                            value={settings.site_name}
                            onChange={(e) => updateSetting('site_name', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Support Email</label>
                        <input
                            type="email"
                            value={settings.support_email}
                            onChange={(e) => updateSetting('support_email', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Currency</label>
                        <select
                            value={settings.currency}
                            onChange={(e) => updateSetting('currency', e.target.value)}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="CAD">CAD ($)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Pricing & Payouts */}
            <div style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #fff3bf 0%, #ffe066 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <DollarSign size={20} style={{ color: '#f59f00' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', margin: 0 }}>Pricing & Payouts</h2>
                        <p style={{ fontSize: '0.813rem', color: '#6c757d', margin: 0 }}>Configure payment settings</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    <div>
                        <label style={labelStyle}>Minimum Payout Amount ($)</label>
                        <input
                            type="number"
                            value={settings.min_payout_amount}
                            onChange={(e) => updateSetting('min_payout_amount', Number(e.target.value))}
                            style={inputStyle}
                            min={1}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Inspection Days</label>
                        <input
                            type="number"
                            value={settings.inspection_days}
                            onChange={(e) => updateSetting('inspection_days', Number(e.target.value))}
                            style={inputStyle}
                            min={1}
                            max={14}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Offer Expiry (Days)</label>
                        <input
                            type="number"
                            value={settings.offer_expiry_days}
                            onChange={(e) => updateSetting('offer_expiry_days', Number(e.target.value))}
                            style={inputStyle}
                            min={1}
                            max={30}
                        />
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #e7f5ff 0%, #a5d8ff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Bell size={20} style={{ color: '#228be6' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', margin: 0 }}>Notifications</h2>
                        <p style={{ fontSize: '0.813rem', color: '#6c757d', margin: 0 }}>Configure notification preferences</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f1f3f5' }}>
                        <div>
                            <div style={{ fontWeight: 500, color: '#212529' }}>Email Notifications</div>
                            <div style={{ fontSize: '0.813rem', color: '#6c757d' }}>Send email notifications to users</div>
                        </div>
                        <button
                            style={toggleStyle(settings.enable_email_notifications)}
                            onClick={() => updateSetting('enable_email_notifications', !settings.enable_email_notifications)}
                        >
                            <div style={toggleKnobStyle(settings.enable_email_notifications)} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f1f3f5' }}>
                        <div>
                            <div style={{ fontWeight: 500, color: '#212529' }}>SMS Notifications</div>
                            <div style={{ fontSize: '0.813rem', color: '#6c757d' }}>Send SMS notifications to users</div>
                        </div>
                        <button
                            style={toggleStyle(settings.enable_sms_notifications)}
                            onClick={() => updateSetting('enable_sms_notifications', !settings.enable_sms_notifications)}
                        >
                            <div style={toggleKnobStyle(settings.enable_sms_notifications)} />
                        </button>
                    </div>
                </div>
            </div>

            {/* System */}
            <div style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Shield size={20} style={{ color: '#dc3545' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#212529', margin: 0 }}>System</h2>
                        <p style={{ fontSize: '0.813rem', color: '#6c757d', margin: 0 }}>System and maintenance settings</p>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
                    <div>
                        <div style={{ fontWeight: 500, color: settings.maintenance_mode ? '#dc3545' : '#212529' }}>
                            Maintenance Mode
                        </div>
                        <div style={{ fontSize: '0.813rem', color: '#6c757d' }}>
                            When enabled, users will see a maintenance page
                        </div>
                    </div>
                    <button
                        style={{
                            ...toggleStyle(settings.maintenance_mode),
                            backgroundColor: settings.maintenance_mode ? '#dc3545' : '#e9ecef'
                        }}
                        onClick={() => updateSetting('maintenance_mode', !settings.maintenance_mode)}
                    >
                        <div style={toggleKnobStyle(settings.maintenance_mode)} />
                    </button>
                </div>

                {settings.maintenance_mode && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        backgroundColor: '#fff5f5',
                        borderRadius: '10px',
                        border: '1px solid #f8d7da'
                    }}>
                        <p style={{ margin: 0, color: '#dc3545', fontSize: '0.875rem' }}>
                            ⚠️ Maintenance mode is enabled. Users cannot access the platform.
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

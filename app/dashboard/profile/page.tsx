'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Loader2, Save, CheckCircle, User, Mail, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
    const { user, profile, loading: authLoading } = useAuth()
    const router = useRouter()
    const [formData, setFormData] = useState({
        full_name: '',
        phone: ''
    })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                phone: profile.phone || ''
            })
        }
    }, [profile])

    const handleSave = async () => {
        if (!user) return

        setSaving(true)
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: formData.full_name,
                phone: formData.phone,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id)

        if (error) {
            console.error('Error saving profile:', error)
            alert('Error saving profile')
        } else {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }
        setSaving(false)
    }

    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <DashboardLayout title="My Profile">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Profile Card */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e9ecef', padding: '1.25rem' }}>
                    {/* Avatar and Email */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #e9ecef' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: '#e6f7ed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <User size={32} style={{ color: '#1ab35d' }} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: '#212529', fontSize: '1.125rem' }}>
                                {formData.full_name || 'Your Name'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#6c757d', fontSize: '0.875rem' }}>
                                <Mail size={14} />
                                {user?.email}
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    {saved && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#d3f9d8', padding: '0.75rem 1rem', borderRadius: '8px', color: '#155724', marginBottom: '1rem', fontSize: '0.875rem' }}>
                            <CheckCircle size={18} />
                            Profile saved successfully!
                        </div>
                    )}

                    {/* Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.813rem', fontWeight: 600, color: '#495057', marginBottom: '0.375rem' }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="Enter your full name"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: '1px solid #ced4da',
                                    borderRadius: '8px',
                                    fontSize: '0.938rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.813rem', fontWeight: 600, color: '#495057', marginBottom: '0.375rem' }}>
                                Phone Number
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                                        border: '1px solid #ced4da',
                                        borderRadius: '8px',
                                        fontSize: '0.938rem'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.813rem', fontWeight: 600, color: '#495057', marginBottom: '0.375rem' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '0.938rem',
                                    backgroundColor: '#f8f9fa',
                                    color: '#6c757d'
                                }}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#adb5bd', marginTop: '0.25rem' }}>
                                Email cannot be changed
                            </p>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                backgroundColor: '#1ab35d',
                                color: '#ffffff',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.938rem',
                                fontWeight: 600,
                                cursor: saving ? 'not-allowed' : 'pointer',
                                opacity: saving ? 0.7 : 1,
                                marginTop: '0.5rem'
                            }}
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Account Info */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e9ecef', padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.938rem', fontWeight: 600, color: '#212529', marginBottom: '1rem' }}>
                        Account Information
                    </h3>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: '#6c757d' }}>Member since</span>
                            <span style={{ fontWeight: 500, color: '#212529' }}>
                                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: '#6c757d' }}>Account status</span>
                            <span style={{ fontWeight: 500, color: '#40c057' }}>Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

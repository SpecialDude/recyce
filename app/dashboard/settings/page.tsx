'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardLayout } from '@/components/DashboardLayout'
import {
    Loader2,
    Shield,
    Bell,
    Trash2,
    Eye,
    EyeOff,
    CheckCircle,
    AlertTriangle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AccountSettingsPage() {
    const { user, loading: authLoading, signOut } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [passwordForm, setPasswordForm] = useState({
        newPassword: '',
        confirmPassword: ''
    })
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState('')
    const supabase = createClient()

    // Notification preferences state
    const [notifications, setNotifications] = useState({
        emailOffers: true,
        emailOrders: true,
        emailMarketing: false,
        emailNewsletter: true
    })

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError('')
        setPasswordSuccess(false)

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New passwords do not match')
            return
        }

        if (passwordForm.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.updateUser({
            password: passwordForm.newPassword
        })

        if (error) {
            setPasswordError(error.message)
        } else {
            setPasswordSuccess(true)
            setPasswordForm({ newPassword: '', confirmPassword: '' })
        }

        setLoading(false)
    }

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return

        alert('Account deletion request submitted. Our team will process this within 24 hours.')
        await signOut()
        router.push('/')
    }

    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <DashboardLayout title="Account Settings">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Change Password Section */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e9ecef', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Shield size={22} style={{ color: '#1ab35d' }} />
                        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#212529', margin: 0 }}>
                            Change Password
                        </h2>
                    </div>

                    {passwordSuccess && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#d3f9d8', padding: '0.75rem 1rem', borderRadius: '8px', color: '#155724', marginBottom: '1rem', fontSize: '0.875rem' }}>
                            <CheckCircle size={18} />
                            Password updated successfully!
                        </div>
                    )}

                    {passwordError && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fef2f2', padding: '0.75rem 1rem', borderRadius: '8px', color: '#991b1b', marginBottom: '1rem', fontSize: '0.875rem' }}>
                            <AlertTriangle size={18} />
                            {passwordError}
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.813rem', fontWeight: 500, color: '#495057', marginBottom: '0.375rem' }}>
                                New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    style={{ width: '100%', padding: '0.625rem 2.5rem 0.625rem 0.875rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '0.938rem' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.813rem', fontWeight: 500, color: '#495057', marginBottom: '0.375rem' }}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '0.938rem' }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                backgroundColor: '#1ab35d',
                                color: '#ffffff',
                                padding: '0.625rem 1.25rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                width: 'fit-content'
                            }}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* Notification Preferences */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e9ecef', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Bell size={22} style={{ color: '#1ab35d' }} />
                        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#212529', margin: 0 }}>
                            Email Notifications
                        </h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { key: 'emailOffers', label: 'Offer updates', desc: 'When your offers are reviewed' },
                            { key: 'emailOrders', label: 'Order updates', desc: 'Order status changes' },
                            { key: 'emailNewsletter', label: 'Newsletter', desc: 'Tips and selling advice' },
                            { key: 'emailMarketing', label: 'Promotions', desc: 'Special offers' }
                        ].map((item) => (
                            <label
                                key={item.key}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    padding: '0.625rem',
                                    borderRadius: '8px',
                                    backgroundColor: notifications[item.key as keyof typeof notifications] ? '#f8f9fa' : 'transparent'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={notifications[item.key as keyof typeof notifications]}
                                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                    style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#1ab35d' }}
                                />
                                <div>
                                    <div style={{ fontWeight: 500, color: '#212529', fontSize: '0.875rem' }}>{item.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{item.desc}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Danger Zone */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #fecaca', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <Trash2 size={22} style={{ color: '#dc3545' }} />
                        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#dc3545', margin: 0 }}>
                            Danger Zone
                        </h2>
                    </div>
                    <p style={{ color: '#6c757d', fontSize: '0.813rem', marginBottom: '1rem' }}>
                        Once you delete your account, all your data will be permanently removed.
                    </p>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            style={{
                                backgroundColor: '#ffffff',
                                color: '#dc3545',
                                padding: '0.625rem 1.25rem',
                                borderRadius: '8px',
                                border: '1px solid #dc3545',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Delete Account
                        </button>
                    ) : (
                        <div style={{ backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '8px' }}>
                            <p style={{ color: '#991b1b', marginBottom: '0.75rem', fontSize: '0.813rem' }}>
                                Type <strong>DELETE</strong> to confirm:
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    placeholder="Type DELETE"
                                    style={{ flex: 1, minWidth: '120px', padding: '0.625rem 0.875rem', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '0.875rem' }}
                                />
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    style={{ padding: '0.625rem 0.875rem', backgroundColor: '#ffffff', border: '1px solid #ced4da', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== 'DELETE'}
                                    style={{
                                        padding: '0.625rem 0.875rem',
                                        backgroundColor: deleteConfirmText === 'DELETE' ? '#dc3545' : '#f8d7da',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        cursor: deleteConfirmText === 'DELETE' ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}

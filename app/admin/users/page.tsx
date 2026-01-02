'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { AdminLayout } from '@/components/AdminLayout'
import {
    Loader2,
    Search,
    Shield,
    ShieldOff,
    User,
    Mail,
    Calendar,
    Users
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminUsersPage() {
    const { user, profile, loading: authLoading } = useAuth()
    const toast = useToast()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [stats, setStats] = useState({ total: 0, admins: 0, active: 0 })
    const supabase = createClient()

    const fetchUsers = async () => {
        if (!user || profile?.role !== 'admin') return

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching users:', error)
        } else {
            setUsers(data || [])
            const total = data?.length || 0
            const admins = data?.filter(u => u.role === 'admin').length || 0
            setStats({ total, admins, active: total })
        }
        setLoading(false)
    }

    useEffect(() => {
        if (user && profile?.role === 'admin') {
            fetchUsers()
        }
    }, [user, profile])

    const toggleAdminRole = async (userId: string, currentRole: string) => {
        if (userId === user?.id) {
            toast.warning('Not Allowed', "You cannot change your own admin status")
            return
        }

        const newRole = currentRole === 'admin' ? 'user' : 'admin'
        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)

        if (error) {
            toast.error('Update Failed', error.message)
        } else {
            toast.success('Role Updated', `User is now ${newRole === 'admin' ? 'an administrator' : 'a regular user'}`)
            fetchUsers()
        }
    }

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (authLoading || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f3f5' }}>
                <Loader2 size={48} style={{ color: '#1ab35d', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    return (
        <AdminLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#212529', margin: 0 }}>User Management</h1>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#e7f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={20} style={{ color: '#228be6' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>{stats.total}</div>
                            <div style={{ fontSize: '0.813rem', color: '#6c757d' }}>Total Users</div>
                        </div>
                    </div>
                </div>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fff3cd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={20} style={{ color: '#f59f00' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>{stats.admins}</div>
                            <div style={{ fontSize: '0.813rem', color: '#6c757d' }}>Administrators</div>
                        </div>
                    </div>
                </div>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#d3f9d8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={20} style={{ color: '#40c057' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529' }}>{stats.total - stats.admins}</div>
                            <div style={{ fontSize: '0.813rem', color: '#6c757d' }}>Regular Users</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', border: '1px solid #e9ecef', borderRadius: '10px', fontSize: '0.938rem', backgroundColor: '#ffffff' }}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>User</th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Email</th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Role</th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Joined</th>
                                <th style={{ padding: '0.875rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Admin Access</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u, idx) => (
                                <tr key={u.id} style={{ borderBottom: idx < filteredUsers.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: u.role === 'admin' ? '#e6f7ed' : '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={20} style={{ color: u.role === 'admin' ? '#1ab35d' : '#6c757d' }} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#212529' }}>{u.full_name || 'Unnamed User'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#adb5bd' }}>ID: {u.id.slice(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#495057' }}>
                                            <Mail size={16} style={{ color: '#adb5bd' }} />
                                            {u.email || '-'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            backgroundColor: u.role === 'admin' ? '#fff3cd' : '#f8f9fa',
                                            color: u.role === 'admin' ? '#856404' : '#6c757d'
                                        }}>
                                            {u.role === 'admin' ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6c757d', fontSize: '0.875rem' }}>
                                            <Calendar size={16} style={{ color: '#adb5bd' }} />
                                            {formatDate(u.created_at)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                        <button
                                            onClick={() => toggleAdminRole(u.id, u.role)}
                                            disabled={u.id === user?.id}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.375rem',
                                                padding: '0.5rem 1rem',
                                                backgroundColor: u.role === 'admin' ? '#fef2f2' : '#e6f7ed',
                                                color: u.role === 'admin' ? '#dc3545' : '#1ab35d',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '0.813rem',
                                                fontWeight: 500,
                                                cursor: u.id === user?.id ? 'not-allowed' : 'pointer',
                                                opacity: u.id === user?.id ? 0.5 : 1
                                            }}
                                        >
                                            {u.role === 'admin' ? <ShieldOff size={16} /> : <Shield size={16} />}
                                            {u.role === 'admin' ? 'Revoke' : 'Grant'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#6c757d' }}>
                        No users found
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { AdminLayout } from '@/components/AdminLayout'
import {
    Loader2,
    Plus,
    Edit,
    Trash2,
    X,
    Save,
    Upload,
    ImageIcon
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.5rem',
                width: '100%',
                maxWidth: '480px',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#212529', margin: 0 }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d' }}>
                        <X size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default function AdminDevicesPage() {
    const { user, profile, loading: authLoading } = useAuth()
    const toast = useToast()
    const [categories, setCategories] = useState<any[]>([])
    const [brands, setBrands] = useState<any[]>([])
    const [models, setModels] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'categories' | 'brands' | 'models'>('models')
    const [saving, setSaving] = useState(false)

    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [formData, setFormData] = useState<any>({})
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    const supabase = createClient()

    // No need for auth checks here - AdminLayout handles them

    const fetchDevices = async () => {
        if (!user || profile?.role !== 'admin') return

        const { data: catData } = await supabase.from('device_categories').select('*').order('display_order')
        const { data: brandData } = await supabase.from('device_brands').select('*, device_categories(name)').order('display_order')
        const { data: modelData } = await supabase.from('device_models').select('*, device_brands(name)').order('created_at', { ascending: false }).limit(100)

        setCategories(catData || [])
        setBrands(brandData || [])
        setModels(modelData || [])
        setLoading(false)
    }

    useEffect(() => {
        if (user && profile?.role === 'admin') {
            fetchDevices()
        }
    }, [user, profile])

    const openAddModal = () => {
        setEditingItem(null)
        if (activeTab === 'categories') {
            setFormData({ name: '', slug: '', icon_name: 'smartphone', display_order: categories.length + 1, is_active: true })
        } else if (activeTab === 'brands') {
            setFormData({ name: '', slug: '', category_id: categories[0]?.id || '', display_order: brands.length + 1, is_active: true })
        } else {
            setFormData({ name: '', slug: '', brand_id: brands[0]?.id || '', base_price: 0, has_carrier_variants: true, has_storage_variants: true, is_active: true })
        }
        setShowModal(true)
        setImageFile(null)
        setImagePreview(null)
    }

    const openEditModal = (item: any) => {
        setEditingItem(item)
        setImageFile(null)
        setImagePreview(item.image_url || item.logo_url || item.icon_url || null)
        if (activeTab === 'categories') {
            setFormData({ name: item.name, slug: item.slug, icon_name: item.icon_name, display_order: item.display_order, is_active: item.is_active })
        } else if (activeTab === 'brands') {
            setFormData({ name: item.name, slug: item.slug, category_id: item.category_id, display_order: item.display_order, is_active: item.is_active })
        } else {
            setFormData({
                name: item.name,
                slug: item.slug,
                brand_id: item.brand_id,
                base_price: item.base_price,
                has_carrier_variants: item.has_carrier_variants,
                has_storage_variants: item.has_storage_variants,
                is_active: item.is_active
            })
        }
        setShowModal(true)
    }

    const handleSave = async () => {
        setSaving(true)
        const table = activeTab === 'categories' ? 'device_categories' : activeTab === 'brands' ? 'device_brands' : 'device_models'
        const bucket = activeTab === 'categories' ? 'categories' : activeTab === 'brands' ? 'brands' : 'devices'
        const imageField = activeTab === 'categories' ? 'icon_url' : activeTab === 'brands' ? 'logo_url' : 'image_url'

        let imageUrl = formData[imageField] || null

        // Upload image if a new file was selected
        if (imageFile) {
            setUploading(true)
            const fileExt = imageFile.name.split('.').pop()
            const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
            const fileName = `${slug}-${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, imageFile, { upsert: true })

            if (uploadError) {
                console.error('Upload error:', uploadError)
                toast.error('Upload Failed', uploadError.message)
                setUploading(false)
                setSaving(false)
                return
            } else {
                const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(fileName)
                imageUrl = publicUrl.publicUrl
            }
            setUploading(false)
        }

        const dataToSave = { ...formData, [imageField]: imageUrl }

        if (editingItem) {
            // Update
            const { error } = await supabase.from(table).update(dataToSave).eq('id', editingItem.id)
            if (error) {
                toast.error('Update Failed', error.message)
            } else {
                toast.success('Updated Successfully', `${formData.name} has been updated`)
            }
        } else {
            // Create - auto-generate slug from name
            const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
            const { error } = await supabase.from(table).insert({ ...dataToSave, slug })
            if (error) {
                toast.error('Creation Failed', error.message)
            } else {
                toast.success('Created Successfully', `${formData.name} has been added`)
            }
        }

        setSaving(false)
        setShowModal(false)
        setImageFile(null)
        setImagePreview(null)
        fetchDevices()
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return

        const table = activeTab === 'categories' ? 'device_categories' : activeTab === 'brands' ? 'device_brands' : 'device_models'
        const { error } = await supabase.from(table).delete().eq('id', id)

        if (error) {
            toast.error('Delete Failed', error.message)
        } else {
            toast.success('Deleted', 'Item has been removed successfully')
        }
        fetchDevices()
    }

    const toggleActive = async (item: any) => {
        const table = activeTab === 'categories' ? 'device_categories' : activeTab === 'brands' ? 'device_brands' : 'device_models'
        const { error } = await supabase.from(table).update({ is_active: !item.is_active }).eq('id', item.id)

        if (error) {
            toast.error('Update Failed', error.message)
        } else {
            toast.success(
                item.is_active ? 'Deactivated' : 'Activated',
                `${item.name} has been ${item.is_active ? 'deactivated' : 'activated'}`
            )
        }
        fetchDevices()
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
            {/* Page Content */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#212529', margin: 0 }}>Device Management</h1>
                    <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#1ab35d', color: '#ffffff', padding: '0.625rem 1.25rem', borderRadius: '8px', border: 'none', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                        <Plus size={18} />
                        Add {activeTab === 'categories' ? 'Category' : activeTab === 'brands' ? 'Brand' : 'Model'}
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', backgroundColor: '#ffffff', padding: '0.25rem', borderRadius: '10px', width: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    {['models', 'brands', 'categories'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: activeTab === tab ? '#1ab35d' : 'transparent', color: activeTab === tab ? '#ffffff' : '#495057', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content Table */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                    {activeTab === 'models' && (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Image</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Model Name</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Brand</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Base Price</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Active</th>
                                    <th style={{ padding: '0.875rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {models.map((model, idx) => (
                                    <tr key={model.id} style={{ borderBottom: idx < models.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                                        <td style={{ padding: '0.75rem 1.5rem' }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                {model.image_url ? (
                                                    <img src={model.image_url} alt={model.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 600, color: '#212529' }}>{model.name}</td>
                                        <td style={{ padding: '1rem', color: '#6c757d' }}>{model.device_brands?.name}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#1ab35d' }}>{formatCurrency(model.base_price)}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button onClick={() => toggleActive(model)} style={{ width: '40px', height: '22px', borderRadius: '11px', border: 'none', backgroundColor: model.is_active ? '#1ab35d' : '#ced4da', cursor: 'pointer', position: 'relative' }}>
                                                <span style={{ position: 'absolute', top: '2px', left: model.is_active ? '20px' : '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#ffffff', transition: 'left 0.2s' }} />
                                            </button>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button onClick={() => openEditModal(model)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e9ecef', backgroundColor: '#ffffff', color: '#6c757d', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(model.id)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e9ecef', backgroundColor: '#ffffff', color: '#fa5252', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'brands' && (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Logo</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Brand Name</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Category</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Active</th>
                                    <th style={{ padding: '0.875rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brands.map((brand, idx) => (
                                    <tr key={brand.id} style={{ borderBottom: idx < brands.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                                        <td style={{ padding: '0.75rem 1.5rem' }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                {brand.logo_url ? (
                                                    <img src={brand.logo_url} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                                ) : (
                                                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1ab35d' }}>{brand.name.charAt(0)}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 600, color: '#212529' }}>{brand.name}</td>
                                        <td style={{ padding: '1rem', color: '#6c757d' }}>{brand.device_categories?.name}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button onClick={() => toggleActive(brand)} style={{ width: '40px', height: '22px', borderRadius: '11px', border: 'none', backgroundColor: brand.is_active ? '#1ab35d' : '#ced4da', cursor: 'pointer', position: 'relative' }}>
                                                <span style={{ position: 'absolute', top: '2px', left: brand.is_active ? '20px' : '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#ffffff', transition: 'left 0.2s' }} />
                                            </button>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button onClick={() => openEditModal(brand)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e9ecef', backgroundColor: '#ffffff', color: '#6c757d', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(brand.id)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e9ecef', backgroundColor: '#ffffff', color: '#fa5252', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'categories' && (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Icon</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Category Name</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Slug</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Order</th>
                                    <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Active</th>
                                    <th style={{ padding: '0.875rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6c757d', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, idx) => (
                                    <tr key={cat.id} style={{ borderBottom: idx < categories.length - 1 ? '1px solid #e9ecef' : 'none' }}>
                                        <td style={{ padding: '0.75rem 1.5rem' }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                {cat.icon_url ? (
                                                    <img src={cat.icon_url} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1ab35d" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 600, color: '#212529' }}>{cat.name}</td>
                                        <td style={{ padding: '1rem', color: '#6c757d' }}>{cat.slug}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center', color: '#6c757d' }}>{cat.display_order}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button onClick={() => toggleActive(cat)} style={{ width: '40px', height: '22px', borderRadius: '11px', border: 'none', backgroundColor: cat.is_active ? '#1ab35d' : '#ced4da', cursor: 'pointer', position: 'relative' }}>
                                                <span style={{ position: 'absolute', top: '2px', left: cat.is_active ? '20px' : '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#ffffff', transition: 'left 0.2s' }} />
                                            </button>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button onClick={() => openEditModal(cat)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e9ecef', backgroundColor: '#ffffff', color: '#6c757d', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(cat.id)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e9ecef', backgroundColor: '#ffffff', color: '#fa5252', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? `Edit ${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}` : `Add ${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>Name</label>
                        <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem' }} />
                    </div>

                    {activeTab === 'brands' && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>Category</label>
                            <select value={formData.category_id || ''} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem' }}>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {activeTab === 'models' && (
                        <>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>Brand</label>
                                <select value={formData.brand_id || ''} onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem' }}>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>Base Price ($)</label>
                                <input type="number" value={formData.base_price || 0} onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={formData.has_carrier_variants} onChange={(e) => setFormData({ ...formData, has_carrier_variants: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#1ab35d' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#495057' }}>Has Carrier Options</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={formData.has_storage_variants} onChange={(e) => setFormData({ ...formData, has_storage_variants: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#1ab35d' }} />
                                    <span style={{ fontSize: '0.875rem', color: '#495057' }}>Has Storage Options</span>
                                </label>
                            </div>
                        </>
                    )}

                    {activeTab === 'categories' && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>Display Order</label>
                            <input type="number" value={formData.display_order || 1} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem' }} />
                        </div>
                    )}

                    {/* Image Upload */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#495057', marginBottom: '0.5rem' }}>
                            {activeTab === 'categories' ? 'Icon Image' : activeTab === 'brands' ? 'Logo Image' : 'Device Image'}
                        </label>
                        <div style={{ border: '2px dashed #ced4da', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
                            {imagePreview ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', objectFit: 'contain' }} />
                                    <button onClick={() => { setImageFile(null); setImagePreview(null); }} style={{ position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#fa5252', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <ImageIcon size={32} style={{ color: '#adb5bd' }} />
                                    <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>Click to upload image</span>
                                    <span style={{ color: '#adb5bd', fontSize: '0.75rem' }}>PNG, JPG, or WebP</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '0.938rem', fontWeight: 500, cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: '#1ab35d', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.938rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    )
}

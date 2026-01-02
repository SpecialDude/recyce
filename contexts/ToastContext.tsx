'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
}

interface ToastContextType {
    toasts: Toast[]
    showToast: (type: ToastType, title: string, message?: string, duration?: number) => void
    success: (title: string, message?: string) => void
    error: (title: string, message?: string) => void
    warning: (title: string, message?: string) => void
    info: (title: string, message?: string) => void
    dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const showToast = useCallback((type: ToastType, title: string, message?: string, duration: number = 4000) => {
        const id = crypto.randomUUID()
        const newToast: Toast = { id, type, title, message, duration }

        setToasts(prev => [...prev, newToast])

        if (duration > 0) {
            setTimeout(() => {
                dismissToast(id)
            }, duration)
        }
    }, [dismissToast])

    const success = useCallback((title: string, message?: string) => {
        showToast('success', title, message)
    }, [showToast])

    const error = useCallback((title: string, message?: string) => {
        showToast('error', title, message, 6000) // Errors stay longer
    }, [showToast])

    const warning = useCallback((title: string, message?: string) => {
        showToast('warning', title, message, 5000)
    }, [showToast])

    const info = useCallback((title: string, message?: string) => {
        showToast('info', title, message)
    }, [showToast])

    return (
        <ToastContext.Provider value={{ toasts, showToast, success, error, warning, info, dismissToast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

// Toast Container Component
function ToastContainer({ toasts, onDismiss }: { toasts: Toast[], onDismiss: (id: string) => void }) {
    if (toasts.length === 0) return null

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '400px',
            width: '100%',
            pointerEvents: 'none'
        }}>
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    )
}

// Individual Toast Component
function ToastItem({ toast, onDismiss }: { toast: Toast, onDismiss: (id: string) => void }) {
    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info
    }

    const colors = {
        success: { bg: '#e6f7ed', border: '#1ab35d', icon: '#1ab35d', text: '#155724' },
        error: { bg: '#fef2f2', border: '#ef4444', icon: '#ef4444', text: '#991b1b' },
        warning: { bg: '#fff8e6', border: '#f59e0b', icon: '#f59e0b', text: '#92400e' },
        info: { bg: '#eff6ff', border: '#3b82f6', icon: '#3b82f6', text: '#1e40af' }
    }

    const Icon = icons[toast.type]
    const color = colors[toast.type]

    return (
        <div
            style={{
                backgroundColor: color.bg,
                border: `1px solid ${color.border}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)',
                pointerEvents: 'auto',
                animation: 'slideIn 0.3s ease-out'
            }}
        >
            <Icon size={22} style={{ color: color.icon, flexShrink: 0, marginTop: '1px' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: color.text, fontSize: '0.938rem', marginBottom: toast.message ? '4px' : 0 }}>
                    {toast.title}
                </div>
                {toast.message && (
                    <div style={{ color: color.text, opacity: 0.85, fontSize: '0.875rem', lineHeight: 1.4 }}>
                        {toast.message}
                    </div>
                )}
            </div>
            <button
                onClick={() => onDismiss(toast.id)}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: color.text,
                    opacity: 0.6,
                    padding: '4px',
                    marginTop: '-4px',
                    marginRight: '-4px'
                }}
            >
                <X size={18} />
            </button>
            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    )
}

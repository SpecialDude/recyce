'use client'

import { CSSProperties, ReactNode } from 'react'

interface SkeletonProps {
    width?: string | number
    height?: string | number
    borderRadius?: string | number
    style?: CSSProperties
    className?: string
}

// Base skeleton with shimmer animation
export function Skeleton({
    width = '100%',
    height = '20px',
    borderRadius = '8px',
    style,
    className
}: SkeletonProps) {
    return (
        <div
            className={className}
            style={{
                width,
                height,
                borderRadius,
                backgroundColor: '#e9ecef',
                backgroundImage: 'linear-gradient(90deg, #e9ecef 0%, #f8f9fa 50%, #e9ecef 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                ...style
            }}
        >
            <style jsx global>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    )
}

// Skeleton for text lines
export function SkeletonText({ lines = 3, spacing = 8 }: { lines?: number, spacing?: number }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${spacing}px` }}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    height="16px"
                    width={i === lines - 1 ? '70%' : '100%'}
                />
            ))}
        </div>
    )
}

// Skeleton for avatar/profile images
export function SkeletonAvatar({ size = 48 }: { size?: number }) {
    return <Skeleton width={size} height={size} borderRadius="50%" />
}

// Skeleton for card layouts
export function SkeletonCard({ children, style }: { children?: ReactNode, style?: CSSProperties }) {
    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e9ecef',
            padding: '1.5rem',
            ...style
        }}>
            {children || (
                <>
                    <Skeleton height="24px" width="60%" style={{ marginBottom: '1rem' }} />
                    <SkeletonText lines={2} />
                </>
            )}
        </div>
    )
}

// Skeleton for device cards in selling flow
export function SkeletonDeviceCard() {
    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '2px solid #e9ecef',
            padding: '1.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
        }}>
            <Skeleton width="72px" height="72px" borderRadius="12px" />
            <div style={{ flex: 1 }}>
                <Skeleton height="20px" width="70%" style={{ marginBottom: '8px' }} />
                <Skeleton height="14px" width="40%" />
            </div>
            <Skeleton height="28px" width="80px" borderRadius="6px" />
        </div>
    )
}

// Skeleton for table rows
export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
    return (
        <tr style={{ borderBottom: '1px solid #e9ecef' }}>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} style={{ padding: '1rem' }}>
                    <Skeleton height="20px" width={i === 0 ? '80%' : '60%'} />
                </td>
            ))}
        </tr>
    )
}

// Skeleton for dashboard stat cards
export function SkeletonStatCard() {
    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e9ecef',
            padding: '1.25rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Skeleton width="48px" height="48px" borderRadius="12px" />
                <div style={{ flex: 1 }}>
                    <Skeleton height="28px" width="60px" style={{ marginBottom: '6px' }} />
                    <Skeleton height="14px" width="80px" />
                </div>
            </div>
        </div>
    )
}

// Loading overlay for forms/modals
export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            borderRadius: 'inherit'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #e9ecef',
                borderTopColor: '#1ab35d',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            <span style={{ marginTop: '1rem', color: '#6c757d', fontSize: '0.938rem' }}>
                {message}
            </span>
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

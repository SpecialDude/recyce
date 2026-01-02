import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Hook to protect routes that require authentication
 */
export function useRequireAuth(redirectTo: string = '/login') {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push(redirectTo)
        }
    }, [user, loading, router, redirectTo])

    return { user, loading }
}

/**
 * Hook to protect admin-only routes
 */
export function useRequireAdmin(redirectTo: string = '/dashboard') {
    const { user, profile, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login')
            } else if (profile && profile.role !== 'admin') {
                router.push(redirectTo)
            }
        }
    }, [user, profile, loading, router, redirectTo])

    return { user, profile, loading }
}

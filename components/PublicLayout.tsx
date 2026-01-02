import { ReactNode } from 'react'
import { PublicHeader } from './PublicHeader'
import { PublicFooter } from './PublicFooter'

interface PublicLayoutProps {
    children: ReactNode
    showFooter?: boolean
}

export function PublicLayout({ children, showFooter = true }: PublicLayoutProps) {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
            <PublicHeader />
            <main style={{ flex: 1 }}>
                {children}
            </main>
            {showFooter && <PublicFooter />}
        </div>
    )
}

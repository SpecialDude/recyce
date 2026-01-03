import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'How It Works',
    description: 'Sell your electronics in 4 easy steps: Get a quote, ship for free, quick inspection, and get paid fast. Learn how Recyce makes device recycling simple.',
    openGraph: {
        title: 'How Recyce Works - Sell Electronics in 4 Easy Steps',
        description: 'Sell your electronics in 4 easy steps: Get a quote, ship for free, quick inspection, and get paid fast.',
    },
}

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
    return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'FAQ - Frequently Asked Questions',
    description: 'Find answers to common questions about selling electronics with Recyce. Learn about quotes, shipping, payments, inspections, and more.',
    openGraph: {
        title: 'Recyce FAQ - Frequently Asked Questions',
        description: 'Find answers to common questions about selling electronics with Recyce.',
    },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
    return children
}

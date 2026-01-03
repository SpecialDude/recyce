import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with Recyce\'s support team. We\'re here to help with questions about selling your electronics, quotes, shipping, and payments.',
    openGraph: {
        title: 'Contact Recyce - Get Help & Support',
        description: 'Get in touch with Recyce\'s support team. We\'re here to help with any questions.',
    },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children
}

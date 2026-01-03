import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sell Your Electronics',
    description: 'Choose your device category to get an instant cash quote. Sell phones, tablets, laptops, smartwatches, gaming consoles, and more with Recyce.',
    openGraph: {
        title: 'Sell Your Electronics for Instant Cash',
        description: 'Choose your device category to get an instant cash quote. Phones, tablets, laptops, and more.',
    },
}

export default function SellLayout({ children }: { children: React.ReactNode }) {
    return children
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blog - Electronics Recycling News & Tips',
    description: 'Stay informed with Recyce\'s blog. Read tips on device recycling, sustainability, tech news, and how to get the most value for your old electronics.',
    openGraph: {
        title: 'Recyce Blog - Electronics Recycling News & Tips',
        description: 'Stay informed with tips on device recycling, sustainability, and tech news.',
    },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children
}

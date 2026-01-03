import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Recyce\'s mission to make electronic recycling easy and rewarding. Discover our values, team, and commitment to sustainability.',
    openGraph: {
        title: 'About Recyce - Our Mission & Values',
        description: 'Learn about Recyce\'s mission to make electronic recycling easy and rewarding.',
    },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children
}

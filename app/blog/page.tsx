'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDateShort } from '@/lib/utils'
import { PublicLayout } from '@/components/PublicLayout'

interface BlogPost {
    id: string
    slug: string
    title: string
    excerpt: string
    featured_image?: string
    published_at: string
    category?: string
}

// Fallback blog posts
const fallbackPosts: BlogPost[] = [
    {
        id: '1',
        slug: 'how-to-prepare-phone-for-sale',
        title: 'How to Prepare Your Phone Before Selling',
        excerpt: 'Learn the essential steps to get your phone ready for sale, including how to back up your data, remove your accounts, and reset your device.',
        published_at: '2026-01-01T00:00:00Z',
        category: 'Guides'
    },
    {
        id: '2',
        slug: 'environmental-impact-ewaste',
        title: 'The Environmental Impact of E-Waste',
        excerpt: 'Electronic waste is one of the fastest-growing waste streams in the world. Learn about the impact and what you can do to help.',
        published_at: '2025-12-15T00:00:00Z',
        category: 'Sustainability'
    },
    {
        id: '3',
        slug: 'when-to-upgrade-your-phone',
        title: 'When Is the Right Time to Upgrade Your Phone?',
        excerpt: 'Not sure if you should upgrade? Here are the signs that it might be time for a new device, and how to get the most value from your old one.',
        published_at: '2025-12-01T00:00:00Z',
        category: 'Tips'
    }
]

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchPosts() {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('id, slug, title, excerpt, featured_image, published_at, category')
                .eq('is_published', true)
                .order('published_at', { ascending: false })
                .limit(20)

            if (!error && data && data.length > 0) {
                setPosts(data)
            }
            setLoading(false)
        }

        fetchPosts()
    }, [])

    return (
        <PublicLayout>

            {/* Hero */}
            <section style={{ background: 'linear-gradient(135deg, #e6f7ed 0%, #f8f9fa 100%)', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#212529', marginBottom: '1rem' }}>
                        Recyce Blog
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#6c757d' }}>
                        Tips, guides, and news about selling electronics and sustainable tech
                    </p>
                </div>
            </section>

            {/* Blog Posts */}
            <section style={{ padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #f1f3f5',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)'
                                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.08)'
                                    e.currentTarget.style.borderColor = 'rgba(26, 179, 93, 0.2)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.02)'
                                    e.currentTarget.style.borderColor = '#f1f3f5'
                                }}
                            >
                                {/* Placeholder image */}
                                <div style={{ height: '180px', backgroundColor: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '3rem' }}>📱</span>
                                </div>

                                <div style={{ padding: '1.5rem' }}>
                                    {post.category && (
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1ab35d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            {post.category}
                                        </span>
                                    )}
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#212529', margin: '0.5rem 0', lineHeight: 1.4 }}>
                                        {post.title}
                                    </h2>
                                    <p style={{ fontSize: '0.938rem', color: '#6c757d', lineHeight: 1.6, marginBottom: '1rem' }}>
                                        {post.excerpt}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#adb5bd', fontSize: '0.875rem' }}>
                                        <Calendar size={16} />
                                        {formatDateShort(post.published_at)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    )
}

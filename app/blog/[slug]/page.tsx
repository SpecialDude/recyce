'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDateShort } from '@/lib/utils'

interface BlogPost {
    id: string
    slug: string
    title: string
    content: string
    excerpt: string
    featured_image?: string
    published_at: string
    category?: string
}

// Fallback content for demo
const fallbackPosts: Record<string, BlogPost> = {
    'how-to-prepare-phone-for-sale': {
        id: '1',
        slug: 'how-to-prepare-phone-for-sale',
        title: 'How to Prepare Your Phone Before Selling',
        excerpt: 'Learn the essential steps to get your phone ready for sale.',
        content: `
## Back Up Your Data

Before anything else, make sure all your important data is backed up. This includes:

- **Photos and videos** - Use iCloud, Google Photos, or transfer to your computer
- **Contacts** - Sync with your Google or iCloud account
- **Messages** - Many phones offer message backup options
- **App data** - Check each important app for backup options

## Sign Out of All Accounts

This is crucial! Make sure to sign out of:

- **iCloud/Apple ID** (iPhone users) - Go to Settings > [Your Name] > Sign Out
- **Google Account** (Android users) - Go to Settings > Accounts > Google > Remove
- **Samsung Account** (Samsung users)
- **Any other accounts** like social media, banking apps, etc.

## Remove Screen Lock

After signing out of your accounts, remove any screen locks:

- PIN codes
- Passwords
- Pattern locks
- Fingerprint data
- Face ID

## Factory Reset Your Device

Once everything is backed up and you've signed out:

**iPhone:** Go to Settings > General > Transfer or Reset iPhone > Erase All Content and Settings

**Android:** Go to Settings > System > Reset options > Erase all data (factory reset)

## Remove SIM Card and Memory Cards

Don't forget to:

- Remove your SIM card
- Remove any microSD cards
- Keep these for your new phone

## Clean Your Device

Give your device a good clean:

- Wipe down the screen and body
- Remove any cases or screen protectors
- Clean the charging port with a soft brush

You're now ready to sell your device and get the best possible price!
    `,
        published_at: '2026-01-01T00:00:00Z',
        category: 'Guides'
    }
}

export default function BlogPostPage() {
    const params = useParams()
    const slug = params.slug as string
    const [post, setPost] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchPost() {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .eq('is_published', true)
                .single()

            if (!error && data) {
                setPost(data)
            } else if (fallbackPosts[slug]) {
                setPost(fallbackPosts[slug])
            }
            setLoading(false)
        }

        fetchPost()
    }, [slug])

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#6c757d' }}>Loading...</div>
            </div>
        )
    }

    if (!post) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem', color: '#212529' }}>Post Not Found</h1>
                <Link href="/blog" style={{ color: '#1ab35d' }}>← Back to Blog</Link>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
            {/* Navigation */}
            <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e9ecef', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <Image src="/recyce-logo.png" alt="Recyce" width={140} height={47} style={{ height: 'auto', width: '140px' }} />
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <Link href="/sell" style={{ backgroundColor: '#1ab35d', color: '#ffffff', padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.938rem', fontWeight: 600, textDecoration: 'none' }}>
                                Start Selling
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Article */}
            <article style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem' }}>
                <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#6c757d', textDecoration: 'none', fontSize: '0.938rem', marginBottom: '2rem' }}>
                    <ArrowLeft size={18} />
                    Back to Blog
                </Link>

                {post.category && (
                    <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 600, color: '#1ab35d', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem' }}>
                        {post.category}
                    </span>
                )}

                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#212529', marginBottom: '1rem', lineHeight: 1.3 }}>
                    {post.title}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#6c757d', marginBottom: '3rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={16} />
                        {formatDateShort(post.published_at)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} />
                        5 min read
                    </span>
                </div>

                {/* Content */}
                <div
                    style={{
                        color: '#495057',
                        fontSize: '1.125rem',
                        lineHeight: 1.8
                    }}
                    dangerouslySetInnerHTML={{
                        __html: post.content
                            .replace(/## (.*)/g, '<h2 style="font-size: 1.5rem; font-weight: 600; color: #212529; margin: 2rem 0 1rem;">$1</h2>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/- (.*)/g, '<li style="margin-left: 1.5rem; margin-bottom: 0.5rem;">$1</li>')
                            .replace(/\n\n/g, '</p><p style="margin-bottom: 1.5rem;">')
                    }}
                />
            </article>

            {/* CTA */}
            <section style={{ backgroundColor: '#f8f9fa', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529', marginBottom: '1rem' }}>
                        Ready to Sell Your Device?
                    </h2>
                    <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
                        Get an instant quote and see how much you can earn.
                    </p>
                    <Link href="/sell" style={{
                        display: 'inline-block',
                        backgroundColor: '#1ab35d',
                        color: '#ffffff',
                        padding: '0.875rem 2rem',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                    }}>
                        Get Your Quote
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ backgroundColor: '#212529', color: '#ffffff', padding: '3rem 2rem' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
                    <Image src="/recyce-logo.png" alt="Recyce" width={120} height={40} style={{ filter: 'brightness(0) invert(1)', marginBottom: '1rem' }} />
                    <p style={{ color: '#adb5bd', fontSize: '0.875rem' }}>© 2026 Recyce. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

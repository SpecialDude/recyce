'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PublicLayout } from '@/components/PublicLayout'

interface FAQ {
    id: string
    question: string
    answer: string
    category: string
}

// Fallback FAQs if database is empty
const fallbackFaqs: FAQ[] = [
    {
        id: '1',
        category: 'General',
        question: 'What devices does Recyce accept?',
        answer: 'We accept most smartphones, tablets, laptops, smartwatches, and gaming consoles from major brands including Apple, Samsung, Google, Microsoft, Sony, and more. If you\'re unsure about a device, try our quote tool - if we can give you a quote, we accept it!'
    },
    {
        id: '2',
        category: 'General',
        question: 'Does my device need to work?',
        answer: 'No! We accept devices in all conditions, including cracked screens, water damage, and devices that won\'t turn on. You\'ll still get cash for broken devices, though working devices in better condition will receive higher quotes.'
    },
    {
        id: '3',
        category: 'Shipping',
        question: 'How do I ship my device?',
        answer: 'After accepting your quote, we\'ll email you a prepaid shipping label. Simply pack your device in any sturdy box, attach the label, and drop it off at any USPS, UPS, or FedEx location. Shipping is always free!'
    },
    {
        id: '4',
        category: 'Shipping',
        question: 'Do I need the original box or accessories?',
        answer: 'No, you don\'t need the original box or accessories. However, including the original charger and box in good condition can increase your payout by up to $10.'
    },
    {
        id: '5',
        category: 'Payment',
        question: 'How and when do I get paid?',
        answer: 'Once we receive and inspect your device, we process payment within 1-2 business days. You can choose to receive payment via PayPal (fastest), direct deposit, or check.'
    },
    {
        id: '6',
        category: 'Payment',
        question: 'What if the quote changes after inspection?',
        answer: 'Our quotes are based on the condition you describe. If our inspection reveals the device is in different condition, we\'ll offer a revised quote. You can accept the new quote or request your device back (we\'ll pay return shipping).'
    },
    {
        id: '7',
        category: 'Data & Security',
        question: 'Is my data safe?',
        answer: 'Absolutely. We perform a certified data wipe on every device we receive, following NIST 800-88 guidelines. All personal data is completely and permanently erased before any device is refurbished or recycled.'
    },
    {
        id: '8',
        category: 'Data & Security',
        question: 'Should I remove my accounts before shipping?',
        answer: 'Yes, please sign out of all accounts (iCloud, Google, Samsung, etc.) and remove any screen locks before shipping. This helps ensure a smooth process and faster payment.'
    }
]

export default function FAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>(fallbackFaqs)
    const [openId, setOpenId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const supabase = createClient()

    useEffect(() => {
        async function fetchFaqs() {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .eq('is_published', true)
                .order('display_order', { ascending: true })

            if (!error && data && data.length > 0) {
                setFaqs(data)
            }
        }

        fetchFaqs()
    }, [])

    const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category)))]

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <PublicLayout>

            {/* Hero */}
            <section style={{ background: 'linear-gradient(135deg, #e6f7ed 0%, #f8f9fa 100%)', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#212529', marginBottom: '1rem' }}>
                        Frequently Asked Questions
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#6c757d', marginBottom: '2rem' }}>
                        Find answers to common questions about selling your devices
                    </p>

                    {/* Search */}
                    <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                border: '1px solid #e9ecef',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                backgroundColor: '#ffffff'
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Content */}
            <section style={{ padding: '3rem 2rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {/* Category Filters */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    backgroundColor: selectedCategory === cat ? '#1ab35d' : '#f8f9fa',
                                    color: selectedCategory === cat ? '#ffffff' : '#495057',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* FAQ List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {filteredFaqs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
                                No questions found matching your search.
                            </div>
                        ) : (
                            filteredFaqs.map((faq) => (
                                <div
                                    key={faq.id}
                                    style={{
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '12px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <button
                                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                        style={{
                                            width: '100%',
                                            padding: '1.25rem 1.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ fontWeight: 600, color: '#212529', fontSize: '1rem', paddingRight: '1rem' }}>
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            size={20}
                                            style={{
                                                color: '#6c757d',
                                                flexShrink: 0,
                                                transform: openId === faq.id ? 'rotate(180deg)' : 'none',
                                                transition: 'transform 0.2s'
                                            }}
                                        />
                                    </button>
                                    {openId === faq.id && (
                                        <div style={{ padding: '0 1.5rem 1.25rem', color: '#495057', lineHeight: 1.7 }}>
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Still Have Questions */}
            <section style={{ backgroundColor: '#f8f9fa', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212529', marginBottom: '1rem' }}>
                        Still have questions?
                    </h2>
                    <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
                        Can't find what you're looking for? Our support team is here to help.
                    </p>
                    <Link href="/contact" style={{
                        display: 'inline-block',
                        backgroundColor: '#1ab35d',
                        color: '#ffffff',
                        padding: '0.875rem 2rem',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                    }}>
                        Contact Support
                    </Link>
                </div>
            </section>
        </PublicLayout>
    )
}

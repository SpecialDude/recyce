'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Tablet, Laptop, Watch, Gamepad, Monitor, CheckCircle, Shield, Leaf, ArrowRight, Recycle, TrendingUp, Lock } from 'lucide-react'
import { PublicLayout } from '@/components/PublicLayout'

export default function HomePage() {
  const categories = [
    { name: 'Phone', icon: Phone, slug: 'phone', startingAt: '$50' },
    { name: 'Tablet', icon: Tablet, slug: 'tablet', startingAt: '$75' },
    { name: 'Laptop', icon: Laptop, slug: 'laptop', startingAt: '$150' },
    { name: 'Smartwatch', icon: Watch, slug: 'smartwatch', startingAt: '$30' },
    { name: 'Gaming Console', icon: Gamepad, slug: 'gaming-console', startingAt: '$100' },
    { name: 'Desktop', icon: Monitor, slug: 'desktop', startingAt: '$200' },
  ]

  return (
    <PublicLayout>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}>
          <Image
            src="/hero-people.jpg"
            alt="People with electronic devices"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          {/* Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.55) 100%)'
          }} />
        </div>

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '4rem 2rem',
          width: '100%'
        }}>
          <div style={{ maxWidth: '700px' }}>
            <h1 style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#ffffff',
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em'
            }}>
              Recyce is changing the dynamics of the electronic recycling industry
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '2.5rem'
            }}>
              We believe that recycling electronic devices should be easy, convenient, and accessible to everyone,
              ensuring a responsible disposal of electronic waste. We also understand the importance of data security
              in today's digital age, developing robust data destruction protocols to protect sensitive information.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                href="/sell"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1ab35d',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.063rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
                }}
              >
                Get Instant Quote
                <ArrowRight size={20} />
              </Link>

              <Link
                href="/how-it-works"
                style={{
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.063rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.2s'
                }}
              >
                How It Works
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{
              marginTop: '3rem',
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              {[
                { icon: CheckCircle, text: 'Instant Quotes' },
                { icon: Shield, text: 'Data Protected' },
                { icon: Leaf, text: 'Eco-Friendly' }
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                    <Icon size={20} />
                    <span style={{ fontSize: '0.938rem', fontWeight: 500 }}>{item.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1ab35d',
            marginBottom: '1.5rem'
          }}>
            Join a Community Passionate About Sustainability
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#495057',
            lineHeight: 1.8,
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            By choosing Recyce, individuals and businesses can contribute to a sustainable world and join
            a community that is passionate about environmental sustainability. Turn your old electronics
            into instant cash while making a positive impact on the planet.
          </p>
        </div>
      </section>

      {/* Device Categories */}
      <section style={{ padding: '5rem 0', backgroundColor: '#f8f9fa' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#212529',
              marginBottom: '1rem',
              letterSpacing: '-0.01em'
            }}>
              What are you selling?
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#6c757d',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Choose your device category to get an instant price quote
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.25rem',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.slug}
                  href={`/sell/${category.slug}`}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #e9ecef',
                    borderRadius: '16px',
                    padding: '1.75rem 1.25rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1ab35d'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(26, 179, 93, 0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e9ecef'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    margin: '0 auto 1rem',
                    backgroundColor: '#e6f7ed',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={28} style={{ color: '#1ab35d' }} />
                  </div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#212529',
                    marginBottom: '0.375rem'
                  }}>
                    {category.name}
                  </h3>
                  <p style={{
                    fontSize: '0.813rem',
                    color: '#1ab35d',
                    fontWeight: 500
                  }}>
                    From {category.startingAt}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#212529',
              marginBottom: '1rem'
            }}>
              How Recyce Works
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#6c757d',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Get paid for your electronics in 4 simple steps
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {[
              { step: '1', title: 'Get a Quote', description: 'Select your device and answer a few questions about its condition' },
              { step: '2', title: 'Ship for Free', description: 'We\'ll send you a prepaid shipping label to send your device' },
              { step: '3', title: 'Quick Inspection', description: 'Our experts verify your device condition within 1-2 business days' },
              { step: '4', title: 'Get Paid', description: 'Receive your payment via PayPal, bank transfer, or check' }
            ].map((item, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                padding: '1.5rem'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  margin: '0 auto 1.25rem',
                  backgroundColor: '#1ab35d',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '1.5rem',
                  fontWeight: 700
                }}>
                  {item.step}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#212529',
                  marginBottom: '0.75rem'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '0.938rem',
                  color: '#6c757d',
                  lineHeight: 1.6
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '5rem 0', backgroundColor: '#f8f9fa' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#212529',
              marginBottom: '1rem'
            }}>
              Why Choose Recyce?
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {[
              { icon: TrendingUp, title: 'Best Prices', description: 'We offer competitive prices that beat the competition. Get the most value for your electronics.' },
              { icon: Lock, title: 'Data Security', description: 'Your data is safe with us. We use certified data destruction methods to protect your privacy.' },
              { icon: Recycle, title: 'Eco-Friendly', description: 'Every device is either refurbished or responsibly recycled, reducing e-waste and environmental impact.' }
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '1px solid #e9ecef'
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    marginBottom: '1.25rem',
                    backgroundColor: '#e6f7ed',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={28} style={{ color: '#1ab35d' }} />
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#212529',
                    marginBottom: '0.75rem'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '0.938rem',
                    lineHeight: 1.6,
                    color: '#6c757d'
                  }}>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '5rem 2rem',
        background: 'linear-gradient(135deg, #1ab35d 0%, #107735 100%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '1.5rem'
          }}>
            Ready to get started?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2.5rem',
            lineHeight: 1.6
          }}>
            Get your instant quote in minutes and turn your old electronics into cash today
          </p>
          <Link
            href="/sell"
            style={{
              backgroundColor: '#ffffff',
              color: '#1ab35d',
              padding: '1rem 2.5rem',
              borderRadius: '12px',
              fontSize: '1.063rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
            }}
          >
            Start Selling Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Responsive styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .hero-content {
            text-align: center;
          }
        }
      `}</style>
    </PublicLayout>
  )
}

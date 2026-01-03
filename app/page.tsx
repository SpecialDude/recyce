'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Tablet, Laptop, Watch, Gamepad, Monitor, CheckCircle, Shield, Leaf, ArrowRight, Recycle, TrendingUp, Lock, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'
import { PublicLayout } from '@/components/PublicLayout'

// Custom hook for scroll animations
function useScrollAnimation() {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return { ref, isVisible }
}

const heroImages = [
  { src: '/hero-1.jpg', alt: 'Team recycling electronics' },
  { src: '/hero-2.png', alt: 'Electronics recycling bin' },
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Scroll animation refs
  const missionSection = useScrollAnimation()
  const categoriesSection = useScrollAnimation()
  const howItWorksSection = useScrollAnimation()
  const whyChooseSection = useScrollAnimation()
  const ctaSection = useScrollAnimation()

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => setCurrentSlide(index)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length)

  const deviceCategories = [
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
        {/* Background Image Carousel */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}>
          {heroImages.map((image, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out'
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority={index === 0}
              />
            </div>
          ))}
          {/* Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.55) 100%)',
            zIndex: 1
          }} />
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
            backdropFilter: 'blur(4px)'
          }}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} color="#fff" />
        </button>
        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
            backdropFilter: 'blur(4px)'
          }}
          aria-label="Next slide"
        >
          <ChevronRightIcon size={24} color="#fff" />
        </button>

        {/* Carousel Dots */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: '0.5rem'
        }}>
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: currentSlide === index ? '24px' : '10px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: currentSlide === index ? '#1ab35d' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
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
                  borderRadius: '14px',
                  fontSize: '1.063rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)'
                }}
              >
                Get Instant Quote
                <ArrowRight size={20} />
              </Link>

              <Link
                href="/how-it-works"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  padding: '1rem 2rem',
                  borderRadius: '14px',
                  fontSize: '1.063rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                  e.currentTarget.style.transform = 'translateY(0)'
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
      <section
        ref={missionSection.ref as any}
        className={`scroll-section ${missionSection.isVisible ? 'scroll-visible' : ''}`}
        style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}
      >
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
      <section
        ref={categoriesSection.ref as any}
        className={`scroll-section ${categoriesSection.isVisible ? 'scroll-visible' : ''}`}
        style={{ padding: '5rem 0', backgroundColor: '#f8f9fa' }}
      >
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
            {deviceCategories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.slug}
                  href={`/sell/${category.slug}`}
                  className="scroll-item"
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
      <section
        ref={howItWorksSection.ref as any}
        className={`scroll-section ${howItWorksSection.isVisible ? 'scroll-visible' : ''}`}
        style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}
      >
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
              <div
                key={idx}
                className="scroll-item"
                style={{
                  textAlign: 'center',
                  padding: '2rem 1.5rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #f1f3f5',
                  transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  margin: '0 auto 1.25rem',
                  background: 'linear-gradient(135deg, #1ab35d 0%, #159549 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(26, 179, 93, 0.3)'
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
                  lineHeight: 1.7
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
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1px solid #f1f3f5',
                    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.08)'
                    e.currentTarget.style.borderColor = 'rgba(26, 179, 93, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = '#f1f3f5'
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    marginBottom: '1.25rem',
                    backgroundColor: '#e6f7ed',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease'
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
                    lineHeight: 1.7,
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
              padding: '1.125rem 2.5rem',
              borderRadius: '14px',
              fontSize: '1.063rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)'
            }}
          >
            Start Selling Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Responsive styles + Scroll Animations */}
      <style jsx global>{`
        /* Scroll Animation Base - Smoother easing */
        .scroll-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-section.scroll-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Staggered animations for grid items */
        .scroll-section.scroll-visible .scroll-item {
          opacity: 0;
          animation: scrollItemReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Stagger delays for each item */
        .scroll-section.scroll-visible .scroll-item:nth-child(1) { animation-delay: 0.1s; }
        .scroll-section.scroll-visible .scroll-item:nth-child(2) { animation-delay: 0.2s; }
        .scroll-section.scroll-visible .scroll-item:nth-child(3) { animation-delay: 0.3s; }
        .scroll-section.scroll-visible .scroll-item:nth-child(4) { animation-delay: 0.4s; }
        .scroll-section.scroll-visible .scroll-item:nth-child(5) { animation-delay: 0.5s; }
        .scroll-section.scroll-visible .scroll-item:nth-child(6) { animation-delay: 0.6s; }

        @keyframes scrollItemReveal {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Fade in text content smoothly */
        .scroll-section.scroll-visible h2,
        .scroll-section.scroll-visible p {
          animation: fadeInSmooth 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeInSmooth {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-content {
            text-align: center;
          }
        }
      `}</style>
    </PublicLayout>
  )
}

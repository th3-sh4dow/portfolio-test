'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';

interface NavBarProps {
  isVisible?: boolean;
}

const navItems = [
  { name: 'About', id: 'about' },
  { name: 'Skills', id: 'skills' },
  { name: 'Projects', id: 'projects' },
  { name: 'Experience', id: 'experience' },
  { name: 'Contact', id: 'contact' },
];

export default function NavBar({ isVisible = true }: NavBarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Initial slide-in animation
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || hasAnimated || !isVisible) return;

    gsap.fromTo(
      nav,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out',
        onComplete: () => setHasAnimated(true),
      }
    );
  }, [isVisible, hasAnimated]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 transition-all duration-500 ${isScrolled
            ? 'glass-dark shadow-lg'
            : 'bg-transparent'
          }`}
        style={{
          opacity: hasAnimated ? 1 : 0,
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="group relative flex items-center gap-2"
            >
              {/* Logo Box */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                }}
              >
                <span className="text-lg font-black text-white">BM</span>
              </div>

              {/* Name (hidden on mobile) */}
              <span
                className="hidden md:block text-lg font-bold gradient-text"
              >
                BICKY MUDULI
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="relative z-10">{item.name}</span>

                  {/* Hover underline */}
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full"
                    style={{
                      background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                    }}
                  />
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => scrollToSection('contact')}
                className="hidden sm:block px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
                }}
              >
                Let's Talk
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-lg glass flex items-center justify-center text-white"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        style={{
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-2xl font-bold text-white/80 hover:text-white transition-all duration-300 hover:scale-110"
              style={{
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isMobileMenuOpen ? 1 : 0,
                transitionDelay: `${index * 0.05}s`,
              }}
            >
              {item.name}
            </button>
          ))}

          {/* Mobile CTA */}
          <button
            onClick={() => scrollToSection('contact')}
            className="mt-8 px-8 py-3 rounded-full text-lg font-semibold text-white transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              boxShadow: '0 0 30px rgba(0, 217, 255, 0.4)',
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: isMobileMenuOpen ? 1 : 0,
              transitionDelay: `${navItems.length * 0.05}s`,
            }}
          >
            Let's Connect
          </button>
        </div>
      </div>
    </>
  );
}

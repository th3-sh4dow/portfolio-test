'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Shield, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Decoder text effect hook
function useDecoderText(text: string, isActive: boolean, delay: number = 0) {
  const [displayText, setDisplayText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}';

  useEffect(() => {
    if (!isActive) return;

    const timeout = setTimeout(() => {
      let iteration = 0;
      const maxIterations = text.length;

      const interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (index < iteration) return text[index];
              if (char === ' ') return ' ';
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        iteration += 1 / 2;

        if (iteration >= maxIterations) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, 40);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, isActive, delay]);

  return displayText || text.split('').map(c => c === ' ' ? ' ' : '_').join('');
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const decodedTitle = useDecoderText('ABOUT ME', isInView, 200);
  const decodedSubtitle = useDecoderText('// SYSTEM.IDENTITY', isInView, 400);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    // Trigger when section comes into view
    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => setIsInView(true),
    });

    // Content reveal animation
    gsap.fromTo(
      content.querySelectorAll('.reveal-item'),
      { opacity: 0, y: 50, filter: 'blur(10px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Floating icons animation
    gsap.to('.floating-icon', {
      y: -15,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const stats = [
    { icon: Code, label: 'Projects', value: '50+', color: 'var(--accent-primary)' },
    { icon: Shield, label: 'Security Audits', value: '100+', color: 'var(--accent-tertiary)' },
    { icon: Zap, label: 'Years Exp', value: '5+', color: 'var(--accent-secondary)' },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen flex items-center justify-center px-6 lg:px-16 py-24 relative overflow-hidden"
    >
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      <div ref={contentRef} className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 reveal-item">
          <p
            className="text-sm font-mono tracking-widest mb-4"
            style={{ color: 'var(--accent-tertiary)' }}
          >
            {decodedSubtitle}
          </p>
          <h2
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, var(--accent-primary) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {decodedTitle}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Avatar/Visual */}
          <div className="reveal-item relative flex justify-center">
            {/* Glowing Background */}
            <div
              className="absolute w-80 h-80 rounded-full blur-3xl opacity-30"
              style={{
                background: 'radial-gradient(circle, var(--accent-primary), var(--accent-secondary))',
              }}
            />

            {/* Main Avatar Container */}
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              {/* Rotating Border */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary))',
                  padding: '3px',
                  animation: 'spin 8s linear infinite',
                }}
              >
                <div className="w-full h-full rounded-full bg-black" />
              </div>

              {/* Avatar Inner */}
              <div
                className="absolute inset-4 rounded-full flex items-center justify-center glass"
                style={{
                  boxShadow: '0 0 60px rgba(0, 217, 255, 0.2)',
                }}
              >
                <span className="text-8xl">👨‍💻</span>
              </div>

              {/* Floating Icons */}
              <div
                className="floating-icon absolute -top-4 -right-4 w-14 h-14 rounded-xl glass flex items-center justify-center"
                style={{ boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)' }}
              >
                <Code className="w-7 h-7" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div
                className="floating-icon absolute top-1/2 -left-6 w-12 h-12 rounded-xl glass flex items-center justify-center"
                style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)', animationDelay: '0.5s' }}
              >
                <Shield className="w-6 h-6" style={{ color: 'var(--accent-tertiary)' }} />
              </div>
              <div
                className="floating-icon absolute -bottom-2 right-8 w-12 h-12 rounded-xl glass flex items-center justify-center"
                style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)', animationDelay: '1s' }}
              >
                <Zap className="w-6 h-6" style={{ color: 'var(--accent-secondary)' }} />
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <div className="reveal-item">
              <h3
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: 'var(--foreground)' }}
              >
                Hi, I'm{' '}
                <span
                  className="gradient-text-cyber"
                >
                  Bicky Muduli
                </span>
              </h3>
              <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                A passionate <span style={{ color: 'var(--accent-primary)' }}>Full Stack Developer</span> and{' '}
                <span style={{ color: 'var(--accent-tertiary)' }}>Cybersecurity Specialist</span> who loves
                creating beautiful, functional, and secure digital experiences.
              </p>
            </div>

            <div className="reveal-item">
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--foreground-subtle)' }}>
                With expertise in modern web technologies and a strong foundation in security,
                I specialize in building high-performance applications that are not just visually
                stunning but also rock-solid secure. I believe in clean code, intuitive design,
                and continuous innovation.
              </p>
            </div>

            {/* Stats */}
            <div className="reveal-item grid grid-cols-3 gap-4 pt-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass-card rounded-xl p-4 text-center transition-all duration-300 hover:scale-105"
                >
                  <stat.icon
                    className="w-6 h-6 mx-auto mb-2"
                    style={{ color: stat.color }}
                  />
                  <p
                    className="text-2xl md:text-3xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-xs uppercase tracking-wider mt-1"
                    style={{ color: 'var(--foreground-subtle)' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

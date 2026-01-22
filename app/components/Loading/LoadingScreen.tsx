'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface LoadingScreenProps {
    onComplete: () => void;
    progress: number;
}

export default function LoadingScreen({ onComplete, progress }: LoadingScreenProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);
    const glitchTextRef = useRef<HTMLSpanElement>(null);

    const [displayText, setDisplayText] = useState('');
    const [isReady, setIsReady] = useState(false);
    const fullName = 'BICKY MUDULI';

    // Glitch/Decoder text effect
    useEffect(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
        let iteration = 0;
        const maxIterations = fullName.length;

        const interval = setInterval(() => {
            setDisplayText(
                fullName
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) {
                            return fullName[index];
                        }
                        if (char === ' ') return ' ';
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('')
            );

            iteration += 1 / 3;

            if (iteration >= maxIterations) {
                clearInterval(interval);
                setDisplayText(fullName);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Initial animations
    useEffect(() => {
        if (!containerRef.current || !logoRef.current || !textRef.current) return;

        const tl = gsap.timeline();

        // Particles animation
        if (particlesRef.current) {
            const particles = particlesRef.current.children;
            gsap.set(particles, { opacity: 0, scale: 0 });
            gsap.to(particles, {
                opacity: 0.5,
                scale: 1,
                duration: 2,
                stagger: 0.1,
                ease: 'power2.out',
            });
        }

        // Logo entrance with rotation
        tl.fromTo(
            logoRef.current,
            {
                scale: 0,
                rotation: -180,
                opacity: 0
            },
            {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'back.out(1.7)'
            }
        )
            // Text glitch entrance
            .fromTo(
                textRef.current,
                {
                    y: 50,
                    opacity: 0,
                    filter: 'blur(10px)'
                },
                {
                    y: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'power3.out'
                },
                '-=0.5'
            );

        return () => {
            tl.kill();
        };
    }, []);

    // Progress animation
    useEffect(() => {
        if (progressBarRef.current) {
            gsap.to(progressBarRef.current, {
                width: `${progress}%`,
                duration: 0.3,
                ease: 'power2.out',
            });
        }

        if (progress >= 100) {
            setIsReady(true);
        }
    }, [progress]);

    // Handle completion
    const handleEnter = () => {
        if (!isReady) return;

        gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.1,
            filter: 'blur(20px)',
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: onComplete,
        });
    };

    // Auto-complete after ready
    useEffect(() => {
        if (isReady) {
            const timeout = setTimeout(() => {
                handleEnter();
            }, 1500);
            return () => clearTimeout(timeout);
        }
    }, [isReady]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
            style={{
                background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 70%)',
            }}
        >
            {/* Animated Background Particles */}
            <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: Math.random() * 4 + 2 + 'px',
                            height: Math.random() * 4 + 2 + 'px',
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                            background: i % 2 === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Cyber Grid Overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Box */}
                <div
                    ref={logoRef}
                    className="relative w-24 h-24 md:w-32 md:h-32 mb-8 rounded-2xl flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #00d9ff 0%, #a855f7 50%, #00ff88 100%)',
                        boxShadow: `
              0 0 60px rgba(0, 217, 255, 0.4),
              0 0 100px rgba(168, 85, 247, 0.3),
              inset 0 1px 1px rgba(255, 255, 255, 0.3)
            `,
                    }}
                >
                    <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-lg" />

                    {/* Rotating Ring */}
                    <div
                        className="absolute inset-[-4px] rounded-2xl border-2 border-transparent"
                        style={{
                            borderImage: 'linear-gradient(135deg, transparent, var(--accent-primary), transparent) 1',
                            animation: 'spin 3s linear infinite',
                        }}
                    />
                </div>

                {/* Name with Glitch Effect */}
                <h1
                    ref={textRef}
                    className="relative text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-center"
                    style={{
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    <span
                        ref={glitchTextRef}
                        className="relative inline-block"
                        data-text={displayText}
                        style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
                        }}
                    >
                        {displayText}
                    </span>
                </h1>

                {/* Subtitle */}
                <p
                    className="text-sm md:text-base uppercase tracking-[0.3em] mb-12"
                    style={{ color: 'var(--accent-primary)' }}
                >
                    Full Stack & Cybersecurity Specialist
                </p>

                {/* Progress Section */}
                <div className="w-64 md:w-80 relative">
                    {/* Progress Bar Container */}
                    <div
                        className="h-1 rounded-full overflow-hidden mb-4"
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        <div
                            ref={progressBarRef}
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                                width: '0%',
                                background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary))',
                                boxShadow: '0 0 20px var(--accent-primary)',
                            }}
                        />
                    </div>

                    {/* Loading Text */}
                    <div className="flex justify-between items-center text-xs uppercase tracking-wider">
                        <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            {isReady ? 'Ready' : 'Initializing'}
                        </span>
                        <span
                            className="font-mono"
                            style={{ color: 'var(--accent-primary)' }}
                        >
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>

                {/* Enter Prompt */}
                {isReady && (
                    <button
                        onClick={handleEnter}
                        className="mt-12 px-8 py-3 rounded-full font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            boxShadow: '0 0 30px rgba(0, 217, 255, 0.4)',
                        }}
                    >
                        Enter Portfolio
                    </button>
                )}
            </div>

            {/* Scanlines Effect */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)',
                }}
            />
        </div>
    );
}

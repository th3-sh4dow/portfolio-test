'use client';

import { useState, useEffect, useRef } from 'react';
import LoadingScreen from './components/Loading/LoadingScreen';
import HeroCanvas from './components/HeroCanvas';
import NavBar from './components/NavBar';
import AboutSection from './components/sections/AboutSection';
import SkillsSection from './components/sections/SkillsSection';
import ProjectsSection from './components/sections/ProjectsSection';
import ExperienceSection from './components/sections/ExperienceSection';
import ContactSection from './components/sections/ContactSection';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showNavbar, setShowNavbar] = useState(false);
    const [introComplete, setIntroComplete] = useState(false);
    const heroRef = useRef<HTMLElement>(null);

    // Simulate loading progress
    useEffect(() => {
        if (!isLoading) return;

        const progressInterval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                // Faster initial progress, slower towards end
                const increment = prev < 70 ? 3 : prev < 90 ? 1 : 0.5;
                return Math.min(prev + increment, 100);
            });
        }, 50);

        return () => clearInterval(progressInterval);
    }, [isLoading]);

    // Handle loading complete
    const handleLoadingComplete = () => {
        document.body.classList.remove('loading-active');
        setIsLoading(false);
    };

    // Handle intro animation complete
    const handleIntroComplete = () => {
        setIntroComplete(true);
        setShowNavbar(true);
    };

    // Lock scroll during loading
    useEffect(() => {
        if (isLoading) {
            document.body.classList.add('loading-active');
        } else {
            document.body.classList.remove('loading-active');
        }

        return () => {
            document.body.classList.remove('loading-active');
        };
    }, [isLoading]);

    return (
        <>
            {/* Loading Screen */}
            {isLoading && (
                <LoadingScreen
                    progress={loadingProgress}
                    onComplete={handleLoadingComplete}
                />
            )}

            {/* Main Content Container - Tall height for scrolling interactions */}
            <main className="relative min-h-[700vh] w-full">

                {/* Fixed Background Canvas */}
                <HeroCanvas
                    onVideoComplete={handleIntroComplete}
                    isLoading={isLoading}
                />

                {/* Navigation - Slides in after intro */}
                <NavBar isVisible={showNavbar} />

                {/* SCROLLABLE SECTIONS */}
                {/* Each section takes up a portion of the scroll timeline */}

                {/* 1. Hero Content (0vh) */}
                <section
                    ref={heroRef}
                    id="hero"
                    className="absolute top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none"
                >
                    {/* Hero Content - Appears after loading & intro */}
                    <div
                        className={`text-center z-10 px-6 transition-all duration-1000 ${!isLoading ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <div
                            className={`transition-all duration-1000 delay-500 ${introComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                        >
                            <h1
                                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6"
                                style={{
                                    background: 'linear-gradient(135deg, #ffffff 0%, var(--accent-primary) 50%, var(--accent-secondary) 100%)',
                                    backgroundSize: '200% 200%',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    color: 'transparent',
                                    animation: 'gradient-shift 4s ease infinite',
                                    textShadow: '0 0 60px rgba(0, 217, 255, 0.3)',
                                }}
                            >
                                BICKY MUDULI
                            </h1>

                            <p
                                className="text-lg sm:text-xl md:text-2xl font-medium tracking-wide mb-4"
                                style={{
                                    color: 'var(--foreground-muted)',
                                    textShadow: '0 0 20px rgba(0, 217, 255, 0.2)',
                                }}
                            >
                                Full Stack Developer & Cybersecurity Specialist
                            </p>

                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm pointer-events-auto"
                                style={{
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <span
                                    className="w-2 h-2 rounded-full animate-pulse"
                                    style={{ background: 'var(--accent-tertiary)' }}
                                />
                                <span style={{ color: 'var(--accent-tertiary)' }}>
                                    Available for Work
                                </span>
                            </div>
                        </div>

                        {/* Scroll Indicator */}
                        <div
                            className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000 ${introComplete ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <div className="flex flex-col items-center gap-3">
                                <span
                                    className="text-xs uppercase tracking-widest"
                                    style={{ color: 'var(--foreground-subtle)' }}
                                >
                                    Scroll to Explore
                                </span>
                                <div
                                    className="w-6 h-10 rounded-full flex items-start justify-center p-2"
                                    style={{
                                        border: '1px solid var(--glass-border)',
                                    }}
                                >
                                    <div
                                        className="w-1.5 h-3 rounded-full animate-bounce"
                                        style={{ background: 'var(--accent-primary)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. About Section (120vh) */}
                <div className="absolute top-[120vh] w-full">
                    <AboutSection />
                </div>

                {/* 3. Skills Section (240vh) */}
                <div className="absolute top-[240vh] w-full">
                    <SkillsSection />
                </div>

                {/* 4. Projects Section (360vh) */}
                <div className="absolute top-[360vh] w-full">
                    <ProjectsSection />
                </div>

                {/* 5. Experience Section (480vh) */}
                <div className="absolute top-[480vh] w-full">
                    <ExperienceSection />
                </div>

                {/* 6. Contact Section (600vh - End) */}
                <div className="absolute top-[600vh] w-full">
                    <ContactSection />
                </div>

                {/* Spacer at the very bottom to allow scrolling past the last element a bit */}
                <div className="absolute top-[700vh] w-full h-[50vh]" />

            </main>
        </>
    );
}

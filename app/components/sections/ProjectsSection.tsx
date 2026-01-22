'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, Play, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'CyberShield Pro',
    subtitle: 'Security Platform',
    description: 'Enterprise-grade cybersecurity monitoring dashboard with real-time threat detection and automated incident response.',
    tech: ['Next.js', 'Python', 'TensorFlow', 'AWS'],
    gradient: 'from-cyan-500 via-blue-500 to-purple-600',
    accentColor: 'var(--accent-primary)',
    emoji: '🛡️',
    stats: { users: '10K+', uptime: '99.9%' },
  },
  {
    id: 2,
    title: 'FinanceFlow',
    subtitle: 'Trading Dashboard',
    description: 'Real-time cryptocurrency trading platform with advanced charting, portfolio tracking, and AI-powered predictions.',
    tech: ['React', 'Node.js', 'WebSocket', 'MongoDB'],
    gradient: 'from-green-400 via-emerald-500 to-teal-600',
    accentColor: 'var(--accent-tertiary)',
    emoji: '📈',
    stats: { trades: '1M+', accuracy: '94%' },
  },
  {
    id: 3,
    title: 'MetaVerse Hub',
    subtitle: '3D Social Platform',
    description: 'Immersive 3D social platform with real-time voice chat, custom avatars, and virtual event hosting capabilities.',
    tech: ['Three.js', 'React', 'WebRTC', 'PostgreSQL'],
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    accentColor: 'var(--accent-secondary)',
    emoji: '🌐',
    stats: { events: '500+', users: '50K+' },
  },
  {
    id: 4,
    title: 'AI Code Assistant',
    subtitle: 'Developer Tool',
    description: 'Intelligent code completion and debugging assistant powered by GPT-4, supporting 20+ programming languages.',
    tech: ['TypeScript', 'OpenAI', 'Electron', 'VSCode'],
    gradient: 'from-orange-400 via-amber-500 to-yellow-500',
    accentColor: '#f59e0b',
    emoji: '🤖',
    stats: { languages: '20+', stars: '5K+' },
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const cards = cardsRef.current;

    if (!section || !container || !cards) return;

    // Title animation
    gsap.fromTo(
      '.projects-title',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Horizontal scroll setup for desktop
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const cardsArray = gsap.utils.toArray('.project-card');
      const totalWidth = cardsArray.length * (450 + 32); // card width + gap

      gsap.to(cards, {
        x: () => -(totalWidth - window.innerWidth + 200),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      mm.revert();
    };
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="min-h-screen relative overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(0, 217, 255, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.05) 0%, transparent 40%)
          `,
        }}
      />

      {/* Content Wrapper */}
      <div
        ref={containerRef}
        className="relative py-24 lg:py-0 lg:h-screen lg:flex lg:items-center"
      >
        {/* Header */}
        <div className="px-6 lg:px-16 mb-12 lg:absolute lg:top-24 lg:left-0 lg:right-0 lg:mb-0 z-10">
          <div className="max-w-7xl mx-auto">
            <p
              className="projects-title text-sm font-mono tracking-widest mb-4"
              style={{ color: 'var(--accent-tertiary)' }}
            >
              // PROJECTS.SHOWCASE
            </p>
            <h2
              className="projects-title text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, var(--accent-primary) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              PROJECTS
            </h2>
          </div>
        </div>

        {/* Mobile/Tablet Cards (Vertical Scroll) */}
        <div className="lg:hidden px-6 space-y-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>

        {/* Desktop Horizontal Scroll */}
        <div className="hidden lg:block w-full pt-32">
          <div
            ref={cardsRef}
            className="flex gap-8 pl-16"
            style={{ width: 'fit-content' }}
          >
            {projects.map((project, index) => (
              <div key={project.id} className="project-card flex-shrink-0 w-[450px]">
                <ProjectCard
                  project={project}
                  isHovered={hoveredIndex === index}
                  onHover={() => setHoveredIndex(index)}
                  onLeave={() => setHoveredIndex(null)}
                />
              </div>
            ))}

            {/* End Spacer */}
            <div className="flex-shrink-0 w-32" />
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="lg:hidden flex justify-center gap-2 mt-8 pb-8">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'w-8 bg-white' : 'bg-white/30'
                }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: typeof projects[0];
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function ProjectCard({ project, isHovered, onHover, onLeave }: ProjectCardProps) {
  return (
    <div
      className="group relative glass-card rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
      style={{
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered
          ? `0 25px 80px ${project.accentColor}30, 0 0 40px ${project.accentColor}20`
          : '0 10px 40px rgba(0, 0, 0, 0.3)',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Top Gradient Bar */}
      <div
        className={`h-1 bg-gradient-to-r ${project.gradient}`}
        style={{
          boxShadow: isHovered ? `0 0 20px ${project.accentColor}` : 'none',
        }}
      />

      {/* Card Content */}
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{project.emoji}</span>
              <div>
                <p
                  className="text-xs font-mono uppercase tracking-wider"
                  style={{ color: project.accentColor }}
                >
                  {project.subtitle}
                </p>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: 'var(--foreground)' }}
                >
                  {project.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Play Button (appears on hover) */}
          <button
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            style={{
              background: `linear-gradient(135deg, ${project.accentColor}, ${project.accentColor}80)`,
              boxShadow: `0 0 20px ${project.accentColor}50`,
            }}
          >
            <Play className="w-5 h-5 text-white ml-0.5" />
          </button>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: 'var(--foreground-muted)' }}
        >
          {project.description}
        </p>

        {/* Stats */}
        <div className="flex gap-6 mb-6">
          {Object.entries(project.stats).map(([key, value]) => (
            <div key={key}>
              <p
                className="text-2xl font-bold"
                style={{ color: project.accentColor }}
              >
                {value}
              </p>
              <p
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--foreground-subtle)' }}
              >
                {key}
              </p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: `${project.accentColor}15`,
                color: project.accentColor,
                border: `1px solid ${project.accentColor}30`,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${project.accentColor}, ${project.accentColor}80)`,
              color: '#000',
            }}
          >
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </button>
          <button
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm glass transition-all duration-300 hover:scale-105"
            style={{ color: 'var(--foreground)' }}
          >
            <Github className="w-4 h-4" />
            Code
          </button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        style={{
          background: `radial-gradient(circle at 50% 0%, ${project.accentColor}10, transparent 70%)`,
        }}
      />
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Calendar, Award, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    year: '2023 - Present',
    role: 'Senior Full Stack Developer',
    company: 'Tech Innovations Inc.',
    type: 'Full-time',
    description:
      'Leading development of scalable web applications using modern tech stack. Spearheading security initiatives and mentoring team members.',
    achievements: [
      'Improved application performance by 40% through optimization',
      'Led team of 5 developers on critical projects',
      'Implemented enterprise-grade CI/CD pipeline',
      'Reduced security vulnerabilities by 75%',
    ],
    color: 'var(--accent-primary)',
  },
  {
    year: '2021 - 2023',
    role: 'Frontend Developer & Security Analyst',
    company: 'Digital Solutions Ltd.',
    type: 'Full-time',
    description:
      'Built responsive and interactive user interfaces for enterprise clients while conducting security audits and penetration testing.',
    achievements: [
      'Developed 15+ client projects with zero security incidents',
      'Reduced page load time by 50%',
      'Conducted 100+ security assessments',
      'Mentored junior developers on secure coding',
    ],
    color: 'var(--accent-secondary)',
  },
  {
    year: '2019 - 2021',
    role: 'Junior Developer',
    company: 'StartUp Hub',
    type: 'Full-time',
    description:
      'Contributed to various web development projects and learned industry best practices. Started exploring cybersecurity fundamentals.',
    achievements: [
      'Completed 20+ feature implementations',
      'Mastered React & Node.js ecosystem',
      'Obtained first security certifications',
      'Collaborated with design team on UX',
    ],
    color: 'var(--accent-tertiary)',
  },
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHackerMode, setIsHackerMode] = useState(false);
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Title animation
    gsap.fromTo(
      '.exp-title',
      { opacity: 0, rotateY: 90 },
      {
        opacity: 1,
        rotateY: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Hacker mode trigger (as per PRD - when sunglasses moment happens)
    ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      onEnter: () => setIsHackerMode(true),
      onLeaveBack: () => setIsHackerMode(false),
    });

    // Timeline items animation
    experiences.forEach((_, index) => {
      ScrollTrigger.create({
        trigger: `.exp-item-${index}`,
        start: 'top 80%',
        onEnter: () => {
          setAnimatedItems((prev) => [...prev, index]);
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className={`min-h-screen flex items-center justify-center px-6 lg:px-16 py-24 relative overflow-hidden transition-all duration-1000 ${isHackerMode ? 'hacker-mode' : ''
        }`}
    >
      {/* Background Effect - Changes in Hacker Mode */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: isHackerMode
            ? `
              radial-gradient(circle at 30% 30%, rgba(255, 51, 102, 0.1) 0%, transparent 40%),
              radial-gradient(circle at 70% 70%, rgba(0, 255, 136, 0.1) 0%, transparent 40%)
            `
            : `
              radial-gradient(circle at 30% 30%, rgba(0, 217, 255, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.05) 0%, transparent 40%)
            `,
        }}
      />

      {/* Scanlines in Hacker Mode */}
      {isHackerMode && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 136, 0.1) 2px, rgba(0, 255, 136, 0.1) 4px)',
          }}
        />
      )}

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p
            className="exp-title text-sm font-mono tracking-widest mb-4 transition-colors duration-500"
            style={{
              color: isHackerMode ? 'var(--accent-tertiary)' : 'var(--accent-tertiary)',
            }}
          >
            // EXPERIENCE.LOG
          </p>
          <h2
            className="exp-title text-5xl md:text-7xl lg:text-8xl font-black tracking-tight transition-all duration-500"
            style={{
              background: isHackerMode
                ? 'linear-gradient(135deg, var(--accent-danger) 0%, var(--accent-tertiary) 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, var(--accent-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            EXPERIENCE
          </h2>

          {/* Hacker Mode Indicator */}
          {isHackerMode && (
            <div
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full font-mono text-sm"
              style={{
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid var(--accent-tertiary)',
                color: 'var(--accent-tertiary)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              HACKER_MODE.ACTIVE
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div
            className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 lg:-translate-x-0.5 transition-colors duration-500"
            style={{
              background: isHackerMode
                ? 'linear-gradient(180deg, var(--accent-danger), var(--accent-tertiary))'
                : 'linear-gradient(180deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary))',
            }}
          />

          {/* Experience Items */}
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`exp-item-${index} relative mb-12 lg:mb-20 ${index % 2 === 0 ? 'lg:pr-[calc(50%+2rem)]' : 'lg:pl-[calc(50%+2rem)]'
                }`}
              style={{
                opacity: animatedItems.includes(index) ? 1 : 0,
                transform: animatedItems.includes(index)
                  ? 'translateX(0)'
                  : index % 2 === 0
                    ? 'translateX(-50px)'
                    : 'translateX(50px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Timeline Dot */}
              <div
                className="absolute left-6 lg:left-1/2 top-8 w-5 h-5 rounded-full lg:-translate-x-1/2 z-10 transition-all duration-500"
                style={{
                  background: isHackerMode
                    ? 'var(--accent-tertiary)'
                    : exp.color,
                  boxShadow: `0 0 20px ${isHackerMode ? 'var(--accent-tertiary)' : exp.color}`,
                }}
              />

              {/* Card */}
              <div
                className={`ml-16 lg:ml-0 glass-card rounded-2xl p-6 lg:p-8 transition-all duration-500 ${index % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'
                  }`}
                style={{
                  borderColor: isHackerMode
                    ? 'rgba(0, 255, 136, 0.2)'
                    : 'var(--glass-border)',
                }}
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 font-mono text-sm"
                      style={{
                        background: isHackerMode
                          ? 'rgba(0, 255, 136, 0.1)'
                          : `${exp.color}15`,
                        color: isHackerMode ? 'var(--accent-tertiary)' : exp.color,
                        border: `1px solid ${isHackerMode ? 'var(--accent-tertiary)' : exp.color
                          }30`,
                      }}
                    >
                      <Calendar className="w-3 h-3" />
                      {exp.year}
                    </div>
                    <h3
                      className="text-xl lg:text-2xl font-bold mb-1"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {exp.role}
                    </h3>
                    <p
                      className="flex items-center gap-2 text-sm"
                      style={{ color: isHackerMode ? 'var(--accent-tertiary)' : exp.color }}
                    >
                      <Briefcase className="w-4 h-4" />
                      {exp.company}
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: 'var(--glass-bg)',
                      color: 'var(--foreground-muted)',
                    }}
                  >
                    {exp.type}
                  </span>
                </div>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: 'var(--foreground-muted)' }}
                >
                  {exp.description}
                </p>

                {/* Achievements - Bullet Fire Animation */}
                <div className="space-y-3">
                  {exp.achievements.map((achievement, achIndex) => (
                    <div
                      key={achIndex}
                      className="flex items-start gap-3 bullet-point"
                      style={{
                        animationDelay: `${achIndex * 0.15}s`,
                        opacity: animatedItems.includes(index) ? 1 : 0,
                      }}
                    >
                      <div
                        className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background: isHackerMode ? 'var(--accent-tertiary)' : exp.color,
                          boxShadow: `0 0 10px ${isHackerMode ? 'var(--accent-tertiary)' : exp.color
                            }`,
                        }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: 'var(--foreground-subtle)' }}
                      >
                        {achievement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: isHackerMode
                ? 'linear-gradient(135deg, var(--accent-danger), var(--accent-tertiary))'
                : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              color: isHackerMode ? '#000' : '#fff',
              boxShadow: isHackerMode
                ? '0 0 30px var(--accent-tertiary)'
                : '0 0 30px var(--accent-primary)50',
            }}
          >
            Download Full Resume
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

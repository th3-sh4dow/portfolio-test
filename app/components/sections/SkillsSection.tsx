'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Code2,
  Database,
  Globe,
  Lock,
  Palette,
  Server,
  Smartphone,
  Cpu,
  Cloud,
  GitBranch
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    title: 'Frontend',
    color: 'var(--accent-primary)',
    skills: [
      { name: 'React / Next.js', level: 95, icon: Code2 },
      { name: 'TypeScript', level: 90, icon: Code2 },
      { name: 'GSAP / Framer', level: 92, icon: Palette },
      { name: 'Tailwind CSS', level: 95, icon: Palette },
    ],
  },
  {
    title: 'Backend',
    color: 'var(--accent-secondary)',
    skills: [
      { name: 'Node.js', level: 88, icon: Server },
      { name: 'Python', level: 85, icon: Code2 },
      { name: 'PostgreSQL', level: 82, icon: Database },
      { name: 'MongoDB', level: 85, icon: Database },
    ],
  },
  {
    title: 'Security',
    color: 'var(--accent-tertiary)',
    skills: [
      { name: 'Penetration Testing', level: 88, icon: Lock },
      { name: 'Network Security', level: 85, icon: Globe },
      { name: 'Secure Coding', level: 90, icon: Lock },
      { name: 'OWASP Standards', level: 87, icon: Lock },
    ],
  },
];

const floatingSkills = [
  { name: 'React', icon: '⚛️', x: '10%', y: '20%', delay: 0 },
  { name: 'Node.js', icon: '🟢', x: '85%', y: '15%', delay: 0.5 },
  { name: 'Security', icon: '🛡️', x: '75%', y: '70%', delay: 1 },
  { name: 'AWS', icon: '☁️', x: '20%', y: '75%', delay: 1.5 },
  { name: 'Docker', icon: '🐳', x: '90%', y: '45%', delay: 2 },
  { name: 'Git', icon: '📦', x: '5%', y: '50%', delay: 2.5 },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Trigger in-view
    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      onEnter: () => setIsInView(true),
    });

    // Title animation
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.8, rotateX: 45 },
        {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Floating skills animation
    gsap.utils.toArray('.floating-skill').forEach((el: any, index) => {
      gsap.to(el, {
        y: 'random(-20, 20)',
        x: 'random(-10, 10)',
        rotation: 'random(-5, 5)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.2,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Category change animation
  useEffect(() => {
    gsap.fromTo(
      '.skill-bar',
      { width: '0%' },
      {
        width: (index, target) => target.dataset.level + '%',
        duration: 1.2,
        stagger: 0.1,
        ease: 'power3.out',
      }
    );
  }, [activeCategory, isInView]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="min-h-screen flex items-center justify-center px-6 lg:px-16 py-24 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(0, 217, 255, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* Floating Skill Icons */}
      {floatingSkills.map((skill, index) => (
        <div
          key={index}
          className="floating-skill absolute hidden lg:flex items-center gap-2 glass-card px-3 py-2 rounded-full opacity-50 hover:opacity-100 transition-opacity"
          style={{
            left: skill.x,
            top: skill.y,
          }}
        >
          <span className="text-xl">{skill.icon}</span>
          <span className="text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>
            {skill.name}
          </span>
        </div>
      ))}

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p
            className="text-sm font-mono tracking-widest mb-4"
            style={{ color: 'var(--accent-tertiary)' }}
          >
            // SKILLS.NEXUS
          </p>
          <h2
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, var(--accent-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            SKILLS
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {skillCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${activeCategory === index
                  ? 'scale-105'
                  : 'opacity-70 hover:opacity-100'
                }`}
              style={{
                background:
                  activeCategory === index
                    ? `linear-gradient(135deg, ${category.color}, transparent)`
                    : 'var(--glass-bg)',
                border: `1px solid ${activeCategory === index ? category.color : 'var(--glass-border)'}`,
                boxShadow: activeCategory === index ? `0 0 30px ${category.color}40` : 'none',
              }}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories[activeCategory].skills.map((skill, index) => (
              <div
                key={`${activeCategory}-${index}`}
                className="group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        background: `${skillCategories[activeCategory].color}20`,
                        border: `1px solid ${skillCategories[activeCategory].color}40`,
                      }}
                    >
                      <skill.icon
                        className="w-5 h-5"
                        style={{ color: skillCategories[activeCategory].color }}
                      />
                    </div>
                    <span className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                      {skill.name}
                    </span>
                  </div>
                  <span
                    className="font-mono text-sm font-bold"
                    style={{ color: skillCategories[activeCategory].color }}
                  >
                    {skill.level}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  className="relative h-2 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <div
                    className="skill-bar absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                    data-level={skill.level}
                    style={{
                      width: isInView ? `${skill.level}%` : '0%',
                      background: `linear-gradient(90deg, ${skillCategories[activeCategory].color}, ${skillCategories[activeCategory].color}80)`,
                      boxShadow: `0 0 10px ${skillCategories[activeCategory].color}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack Icons Row */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--glass-border)' }}>
            <p
              className="text-sm font-mono mb-6 text-center"
              style={{ color: 'var(--foreground-subtle)' }}
            >
              TECH_STACK.MAP()
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Globe, label: 'Web' },
                { icon: Smartphone, label: 'Mobile' },
                { icon: Cloud, label: 'Cloud' },
                { icon: Database, label: 'Database' },
                { icon: Lock, label: 'Security' },
                { icon: Cpu, label: 'Systems' },
                { icon: GitBranch, label: 'DevOps' },
                { icon: Server, label: 'Backend' },
              ].map((tech, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-xl glass flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer group"
                  title={tech.label}
                >
                  <tech.icon
                    className="w-5 h-5 transition-colors"
                    style={{ color: 'var(--foreground-muted)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

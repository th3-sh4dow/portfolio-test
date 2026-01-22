'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Send,
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Terminal,
  CheckCircle2,
  Loader2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingField, setTypingField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Terminal-style typing simulation
  const [terminalText, setTerminalText] = useState('');
  const terminalMessages = [
    '> Initializing contact module...',
    '> Connection established.',
    '> Ready to receive transmission.',
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Title animation
    gsap.fromTo(
      '.contact-title',
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Form animation
    gsap.fromTo(
      '.contact-form',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Terminal typing effect
    let messageIndex = 0;
    let charIndex = 0;
    let currentText = '';

    const typeTerminal = () => {
      if (messageIndex >= terminalMessages.length) return;

      const currentMessage = terminalMessages[messageIndex];

      if (charIndex < currentMessage.length) {
        currentText += currentMessage[charIndex];
        setTerminalText(currentText);
        charIndex++;
        setTimeout(typeTerminal, 30);
      } else {
        currentText += '\n';
        setTerminalText(currentText);
        messageIndex++;
        charIndex = 0;
        setTimeout(typeTerminal, 500);
      }
    };

    const timeout = setTimeout(typeTerminal, 1000);

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setIsTyping(true);
    setTypingField(e.target.name);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsTyping(false);
      setTypingField(null);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });

    // Reset after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub', color: '#fff' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: '#0077b5' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: '#1da1f2' },
    { icon: Mail, href: 'mailto:bicky@example.com', label: 'Email', color: 'var(--accent-primary)' },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="min-h-screen flex items-center justify-center px-6 lg:px-16 py-24 relative overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 217, 255, 0.05) 0%, transparent 40%)
          `,
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p
            className="contact-title text-sm font-mono tracking-widest mb-4"
            style={{ color: 'var(--accent-tertiary)' }}
          >
            // CONTACT.INIT
          </p>
          <h2
            className="contact-title text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, var(--accent-tertiary) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            LET'S CONNECT
          </h2>
          <p
            className="contact-title text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--foreground-muted)' }}
          >
            Have a project in mind? Let's work together to create something amazing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Terminal Contact Form */}
          <div className="contact-form">
            <div
              className="terminal rounded-2xl overflow-hidden"
              style={{
                boxShadow: '0 25px 80px rgba(0, 255, 136, 0.1)',
              }}
            >
              {/* Terminal Header */}
              <div className="terminal-header flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4" style={{ color: 'var(--accent-tertiary)' }} />
                  <span
                    className="text-xs font-mono"
                    style={{ color: 'var(--accent-tertiary)' }}
                  >
                    contact@bicky:~
                  </span>
                </div>
                <div className="w-16" />
              </div>

              {/* Terminal Body */}
              <div className="p-6">
                {/* Terminal Output */}
                <pre
                  className="text-xs font-mono mb-6 whitespace-pre-wrap"
                  style={{ color: 'var(--accent-tertiary)', opacity: 0.7 }}
                >
                  {terminalText}
                  <span className="animate-pulse">_</span>
                </pre>

                {/* Form */}
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label
                      className="block text-xs font-mono mb-2 uppercase tracking-wider"
                      style={{ color: 'var(--accent-tertiary)' }}
                    >
                      {'>'} Enter your name:
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className="w-full px-4 py-3 rounded-lg font-mono text-sm focus:outline-none transition-all"
                      style={{
                        background: 'rgba(0, 255, 136, 0.05)',
                        border: typingField === 'name'
                          ? '1px solid var(--accent-tertiary)'
                          : '1px solid rgba(0, 255, 136, 0.2)',
                        boxShadow: typingField === 'name'
                          ? '0 0 20px rgba(0, 255, 136, 0.1)'
                          : 'none',
                      }}
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      className="block text-xs font-mono mb-2 uppercase tracking-wider"
                      style={{ color: 'var(--accent-tertiary)' }}
                    >
                      {'>'} Enter your email:
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className="w-full px-4 py-3 rounded-lg font-mono text-sm focus:outline-none transition-all"
                      style={{
                        background: 'rgba(0, 255, 136, 0.05)',
                        border: typingField === 'email'
                          ? '1px solid var(--accent-tertiary)'
                          : '1px solid rgba(0, 255, 136, 0.2)',
                        boxShadow: typingField === 'email'
                          ? '0 0 20px rgba(0, 255, 136, 0.1)'
                          : 'none',
                      }}
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      className="block text-xs font-mono mb-2 uppercase tracking-wider"
                      style={{ color: 'var(--accent-tertiary)' }}
                    >
                      {'>'} Enter your message:
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg font-mono text-sm focus:outline-none transition-all resize-none"
                      style={{
                        background: 'rgba(0, 255, 136, 0.05)',
                        border: typingField === 'message'
                          ? '1px solid var(--accent-tertiary)'
                          : '1px solid rgba(0, 255, 136, 0.2)',
                        boxShadow: typingField === 'message'
                          ? '0 0 20px rgba(0, 255, 136, 0.1)'
                          : 'none',
                      }}
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    className="w-full py-4 rounded-lg font-mono font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: isSubmitted
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, var(--accent-tertiary), #00aa66)',
                      color: '#000',
                      boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>

                {/* Typing Indicator */}
                {isTyping && (
                  <div
                    className="mt-4 flex items-center gap-2 text-xs font-mono"
                    style={{ color: 'var(--accent-tertiary)', opacity: 0.7 }}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    User is typing...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="contact-form space-y-8">
            {/* Info Cards */}
            <div className="glass-card rounded-2xl p-8">
              <h3
                className="text-2xl font-bold mb-6"
                style={{ color: 'var(--foreground)' }}
              >
                Get in Touch
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'rgba(0, 217, 255, 0.1)',
                      border: '1px solid rgba(0, 217, 255, 0.2)',
                    }}
                  >
                    <Mail className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: 'var(--foreground-subtle)' }}
                    >
                      Email
                    </p>
                    <p
                      className="font-medium"
                      style={{ color: 'var(--foreground)' }}
                    >
                      bicky@example.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'rgba(168, 85, 247, 0.1)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                    }}
                  >
                    <MapPin className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
                  </div>
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: 'var(--foreground-subtle)' }}
                    >
                      Location
                    </p>
                    <p
                      className="font-medium"
                      style={{ color: 'var(--foreground)' }}
                    >
                      India 🇮🇳
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-card rounded-2xl p-8">
              <h3
                className="text-lg font-bold mb-6"
                style={{ color: 'var(--foreground)' }}
              >
                Follow Me
              </h3>

              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-xl glass flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                    style={{
                      border: `1px solid ${social.color}30`,
                    }}
                    title={social.label}
                  >
                    <social.icon
                      className="w-6 h-6 transition-colors group-hover:scale-110"
                      style={{ color: social.color }}
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            <div
              className="glass-card rounded-2xl p-6 flex items-center gap-4"
              style={{
                border: '1px solid rgba(0, 255, 136, 0.2)',
              }}
            >
              <div className="relative">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: 'var(--accent-tertiary)' }}
                />
                <div
                  className="absolute inset-0 w-4 h-4 rounded-full animate-ping"
                  style={{ background: 'var(--accent-tertiary)', opacity: 0.5 }}
                />
              </div>
              <div>
                <p
                  className="font-semibold"
                  style={{ color: 'var(--accent-tertiary)' }}
                >
                  Available for Work
                </p>
                <p
                  className="text-sm"
                  style={{ color: 'var(--foreground-subtle)' }}
                >
                  Open to freelance & full-time opportunities
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center mt-24 pt-8"
          style={{ borderTop: '1px solid var(--glass-border)' }}
        >
          <p
            className="text-sm font-mono"
            style={{ color: 'var(--foreground-subtle)' }}
          >
            © 2024 Bicky Muduli. Crafted with 💜 and lots of ☕
          </p>
          <p
            className="text-xs font-mono mt-2"
            style={{ color: 'var(--foreground-subtle)', opacity: 0.5 }}
          >
            Built with Next.js, GSAP & TypeScript
          </p>
        </div>
      </div>
    </section>
  );
}

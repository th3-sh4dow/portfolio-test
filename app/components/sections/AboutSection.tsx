'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Shield, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Image sequence animation hook
function useImageSequence(totalFrames: number, isActive: boolean) {
  const [currentFrame, setCurrentFrame] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  // Preload images (using every 10th frame for performance)
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    let errorCount = 0;
    const frameStep = 10; // Use every 10th frame
    const actualFrames = Math.floor(totalFrames / frameStep);

    for (let i = 0; i < actualFrames; i++) {
      const img = new Image();
      const frameNumber = ((i * frameStep) + 1).toString().padStart(4, '0');
      img.src = `/hero-intro/${frameNumber}_${(i * frameStep + 1) % 2 === 0 ? '4' : '3'}.jpeg`;
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount + errorCount === actualFrames) {
          if (loadedCount > 0) {
            setImagesLoaded(true);
          } else {
            setLoadingError(true);
          }
        }
      };
      
      img.onerror = () => {
        errorCount++;
        console.warn(`Failed to load image: ${img.src}`);
        if (loadedCount + errorCount === actualFrames) {
          if (loadedCount > 0) {
            setImagesLoaded(true);
          } else {
            setLoadingError(true);
          }
        }
      };
      
      images.push(img);
    }
    
    imagesRef.current = images;
  }, [totalFrames]);

  // Draw current frame
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const frameIndex = Math.floor((currentFrame - 1) / 10); // Map to our reduced frame set
    const img = imagesRef.current[Math.min(frameIndex, imagesRef.current.length - 1)];

    if (ctx && img && img.complete && img.naturalWidth > 0) {
      // Set canvas size
      canvas.width = 400;
      canvas.height = 400;
      
      // Clear and draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      try {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } catch (error) {
        console.warn('Failed to draw image frame:', frameIndex, error);
        // Draw a fallback gradient instead
        const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
        gradient.addColorStop(0, 'rgba(0, 217, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } else if (ctx && loadingError) {
      // Draw fallback when images failed to load
      canvas.width = 400;
      canvas.height = 400;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
      gradient.addColorStop(0, 'rgba(0, 217, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [currentFrame, imagesLoaded, loadingError]);

  return { canvasRef, setCurrentFrame, imagesLoaded, loadingError };
}

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
  const textContentRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Image sequence animation
  const { canvasRef, setCurrentFrame, imagesLoaded, loadingError } = useImageSequence(200, isInView); // Reduced from 1999 to 200 for better performance

  const decodedTitle = useDecoderText('ABOUT ME', isInView, 200);
  const decodedSubtitle = useDecoderText('// SYSTEM.IDENTITY', isInView, 400);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const textContent = textContentRef.current;
    if (!section || !content) return;

    // Trigger when section comes into view
    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => setIsInView(true),
    });

    // Image sequence animation on scroll
    if (imagesLoaded && !loadingError) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const frame = Math.ceil(self.progress * 199) + 1; // Adjusted for 200 frames
          setCurrentFrame(Math.max(1, Math.min(200, frame)));
        },
      });
    }

    // Text content animations with gray color transitions
    if (textContent) {
      const textElements = textContent.querySelectorAll('.text-animate');
      
      textElements.forEach((element, index) => {
        gsap.fromTo(
          element,
          { 
            opacity: 0, 
            y: 50, 
            color: '#666666' // Start with gray
          },
          {
            opacity: 1,
            y: 0,
            color: '#ffffff', // Animate to white
            duration: 1.2,
            delay: index * 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 1,
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }

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

    // Canvas container animation
    gsap.fromTo(
      canvasRef.current,
      { scale: 0.8, opacity: 0, rotationY: 45 },
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [imagesLoaded, loadingError, setCurrentFrame]);

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
          {/* Left - Image Sequence Canvas */}
          <div className="reveal-item relative flex justify-center">
            {/* Glowing Background */}
            <div
              className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
              style={{
                background: 'radial-gradient(circle, var(--accent-primary), var(--accent-secondary))',
              }}
            />

            {/* Canvas Container */}
            <div className="relative w-80 h-80 md:w-96 md:h-96">
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

              {/* Image Sequence Canvas */}
              <div
                className="absolute inset-4 rounded-full overflow-hidden canvas-glass image-sequence-container"
              >
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-cover rounded-full canvas-3d"
                  style={{
                    filter: (imagesLoaded && !loadingError) ? 'none' : 'blur(10px)',
                    transition: 'filter 0.5s ease',
                    display: loadingError ? 'none' : 'block',
                  }}
                />
                
                {/* Fallback content when images are loading */}
                {!imagesLoaded && !loadingError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full">
                    <div className="sequence-loader w-8 h-8 rounded-full mb-4" />
                    <span className="text-xs text-cyan-400">Loading Animation...</span>
                  </div>
                )}
                
                {/* Error fallback */}
                {loadingError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <span className="text-6xl">👨‍💻</span>
                  </div>
                )}
                
                {/* Fallback avatar if images fail to load */}
                {imagesLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-6xl">👨‍💻</span>
                  </div>
                )}
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
          <div ref={textContentRef} className="space-y-8">
            <div className="reveal-item">
              <h3
                className="text-3xl md:text-4xl font-bold mb-6 text-animate"
                style={{ color: '#666666' }}
              >
                Hi, I'm{' '}
                <span
                  className="gradient-text-cyber"
                >
                  Bicky Muduli
                </span>
              </h3>
              <p className="text-lg md:text-xl leading-relaxed text-animate" style={{ color: '#666666' }}>
                A passionate <span style={{ color: 'var(--accent-primary)' }}>Full Stack Developer</span> and{' '}
                <span style={{ color: 'var(--accent-tertiary)' }}>Cybersecurity Specialist</span> who loves
                creating beautiful, functional, and secure digital experiences.
              </p>
            </div>

            <div className="reveal-item">
              <p className="text-base md:text-lg leading-relaxed text-animate" style={{ color: '#666666' }}>
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
                  className="stats-card glass-card rounded-xl p-4 text-center"
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

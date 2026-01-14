'use client';

import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import gsap from 'gsap';
import "./Loading_Name.css";

interface LoadingNameProps {
  onComplete?: () => void;
}

export default function Loading_Name({ onComplete }: LoadingNameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !boxRef.current || !textRef.current || !mainRef.current) return;

    // Reset styles for clean animation
    gsap.set([containerRef.current, boxRef.current, textRef.current], { clearProps: "all" });

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the entire loading screen after animation
        gsap.to(mainRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          delay: 0.5,
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
      }
    });

    // 1. Entire unit glides in from the left
    tl.fromTo(
      containerRef.current,
      { x: -250, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    )
    
    // 2. Box does a sharp settle rotation
    .fromTo(
      boxRef.current,
      { rotation: -90, scale: 0.7 },
      { rotation: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.9"
    )
    
    // 3. Name slides out from behind the "mask"
    .fromTo(
      textRef.current,
      { x: -80, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power4.out" },
      "-=0.4" 
    );

    return () => {
      if (tl) tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={mainRef} className="main">
      {/* Main Brand Section */}
      <div ref={containerRef} className="brand-container">
        
        {/* Anchor Box */}
        <div ref={boxRef} className="anchor-box">
          <Sparkles className="icon" />
        </div>

        {/* Masked Text */}
        <div className="text-mask">
          <h1 ref={textRef} className="brand-text">
            Bicky Muduli
          </h1>
        </div>
      </div>
    </div>
  );
}
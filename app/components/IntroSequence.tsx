'use client';

import { useState, useEffect } from 'react';
import Loading_Name from './Loading/Loading_Name';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroSequenceProps {
  onComplete: () => void;
  children: React.ReactNode;
}

export default function IntroSequence({ onComplete, children }: IntroSequenceProps) {
  const [showLoader, setShowLoader] = useState(true);
  const [showAutoPlay, setShowAutoPlay] = useState(false);

  // When loader completes, start auto-play
  const handleLoaderComplete = () => {
    setShowLoader(false);
    setShowAutoPlay(true);
    
    // Auto-play duration: 187 frames at 120fps = ~1.56 seconds (ultra fast!)
    const autoPlayDuration = (187 / 120) * 1000;
    
    setTimeout(() => {
      setShowAutoPlay(false);
      onComplete();
    }, autoPlayDuration);
  };

  return (
    <>
      {/* Loading Animation */}
      <AnimatePresence mode="wait">
        {showLoader && (
          <Loading_Name onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>

      {/* Background always visible after loader */}
      {!showLoader && children}

      {/* Overlay to hide content during auto-play */}
      <AnimatePresence>
        {showAutoPlay && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 pointer-events-none"
            style={{ background: 'transparent' }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

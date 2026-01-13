'use client';

import React from 'react';
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#050505]/75 backdrop-blur-md">
      {/* Left: Brand */}
      <div className="flex items-center">
        <span className="text-xl font-bold tracking-tight text-white">
          DEV_PORTFOLIO
        </span>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {['Overview', 'Projects', 'Stack', 'Process'].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* Right: CTA */}
      <div className="flex items-center">
        <Link
          href="#contact"
          className="px-5 py-2 text-sm font-semibold text-white transition-all rounded-full bg-gradient-to-r from-[#00D6FF] to-[#0050FF] hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,214,255,0.3)]"
        >
          Let’s Talk
        </Link>
      </div>
    </nav>
  );
}

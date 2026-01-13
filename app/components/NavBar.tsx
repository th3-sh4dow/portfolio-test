'use client';

import React from 'react';
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-black/50 backdrop-blur-md">
      {/* Left: Brand */}
      <div className="flex items-center">
        <span className="text-lg font-semibold tracking-tight text-f5f5f7">
          ACME
        </span>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        {['Overview', 'Projects', 'Stack', 'Process'].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-xs font-medium text-f5f5f7/80 hover:text-f5f5f7 transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* Right: CTA */}
      <div className="flex items-center">
        <Link
          href="#contact"
          className="px-4 py-1.5 text-xs font-semibold text-black transition-all rounded-full bg-accent hover:opacity-90"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}

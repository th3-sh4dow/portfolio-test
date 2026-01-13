'use client';

import React from 'react';
import NavBar from './components/NavBar';
import ScrollSequence from './components/ScrollSequence';
import TextSection from './components/TextSection';

export default function Home() {
  return (
    <main className="relative w-full bg-transparent min-h-screen selection:bg-[#00D6FF] selection:text-black">
      <NavBar />

      {/* The cinematic background */}
      <ScrollSequence />

      {/* 
        Scrollable Container
        Height = 800vh to ensure enough scroll track for 900 frames 
      */}
      <div className="relative w-full h-[800vh]">

        {/* 
          0-20% (The Visionary) 
          Visible roughly from 0vh to 160vh. Centered visually around 50-80vh.
        */}
        <TextSection
          headline="Architect of Digital Experiences."
          subheadline="Bridging the gap between 3D art and functional code."
          className="top-[40vh]"
        />

        {/* 
          20-50% (The Motion)
          Visible roughly 160vh to 400vh. Centered around 280vh.
        */}
        <TextSection
          headline="Fluidity in Every Frame."
          subheadline="Crafting interactions that feel natural, responsive, and unmistakably premium."
          className="top-[250vh]"
        />

        {/* 
          50-80% (The Stack)
          Visible roughly 400vh to 640vh. Centered around 520vh.
        */}
        <TextSection
          headline="Engineered for Performance."
          subheadline="From Next.js to GLSL, I build high-performance systems for the modern web."
          className="top-[500vh]"
        />

        {/* 
          80-100% (The Execution)
          Visible roughly 640vh to 800vh. Centered around 700vh.
        */}
        <div className="absolute top-[700vh] left-0 w-full flex flex-col items-center justify-center space-y-8 px-4 text-center">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl">
            Ready to Build the Future.
          </h2>
          <div className="flex flex-wrap gap-6 justify-center">
            <a href="#projects" className="px-8 py-3 text-lg font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-all">
              Recent Projects
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="px-8 py-3 text-lg font-medium text-white border border-white/20 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm">
              GitHub
            </a>
          </div>
        </div>

      </div>

      {/* Footer / Contact for scrolling past the end */}
      <footer className="relative w-full py-12 border-t border-white/10 bg-black z-10">
        <div className="container mx-auto text-center text-white/40 text-sm">
          &copy; {new Date().getFullYear()} Dev Portfolio. Crafted with Next.js & Framer Motion.
        </div>
      </footer>
    </main>
  );
}

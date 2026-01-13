'use client';

import React from 'react';
import NavBar from './components/NavBar';
import ScrollSequence from './components/ScrollSequence';
import TextSection from './components/TextSection';

export default function Home() {
  return (
    <main className="relative w-full bg-transparent min-h-screen selection:bg-[#2997ff] selection:text-black">
      <NavBar />

      {/* The cinematic background */}
      <ScrollSequence />

      {/* 
        Scrollable Container
        Height = 800vh to ensure enough scroll track for 900 frames 
      */}
      <div className="relative w-full h-[800vh]">

        {/* 
          0-20% (The Vision) 
          Visible roughly from 0vh to 160vh. Centered visually around 50-80vh.
        */}
        <TextSection
          headline="A new vision for the web."
          subheadline="Combining cutting-edge design with flawless engineering."
          className="top-[40vh]"
        />

        {/* 
          20-50% (The Motion)
          Visible roughly 160vh to 400vh. Centered around 280vh.
        */}
        <TextSection
          headline="Seamlessly smooth."
          subheadline="Creating fluid user experiences that feel intuitive and alive."
          className="top-[250vh]"
        />

        {/* 
          50-80% (The Stack)
          Visible roughly 400vh to 640vh. Centered around 520vh.
        */}
        <TextSection
          headline="Powerfully simple."
          subheadline="Leveraging the latest technologies to build fast, scalable, and reliable applications."
          className="top-[500vh]"
        />

        {/* 
          80-100% (The Execution)
          Visible roughly 640vh to 800vh. Centered around 700vh.
        */}
        <div className="absolute top-[700vh] left-0 w-full flex flex-col items-center justify-center space-y-8 px-4 text-center">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-[#f5f5f7] drop-shadow-2xl">
            Create something wonderful.
          </h2>
          <div className="flex flex-wrap gap-6 justify-center">
            <a href="#projects" className="px-8 py-3 text-lg font-medium text-black bg-[#2997ff] rounded-full hover:opacity-90 transition-all">
              See our work
            </a>
            <a href="#contact" className="px-8 py-3 text-lg font-medium text-[#f5f5f7] border border-white/20 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm">
              Get in touch
            </a>
          </div>
        </div>

      </div>

      {/* Footer / Contact for scrolling past the end */}
      <footer id="contact" className="relative w-full py-12 border-t border-white/10 bg-black z-10">
        <div className="container mx-auto text-center text-white/40 text-sm">
          &copy; {new Date().getFullYear()} ACME Inc. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

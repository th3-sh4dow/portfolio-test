'use client';

import { useState } from 'react';
import NavBar from './components/NavBar';
import ScrollSequence from './components/ScrollSequence';
import TextSection from './components/TextSection';
import HeroSection from './components/HeroSection';
import FeatureCard from './components/FeatureCard';
import ProjectCard from './components/ProjectCard';
import IntroSequence from './components/IntroSequence';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  const features = [
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Responsive Design",
      description: "Pixel-perfect interfaces that adapt seamlessly across all devices and screen sizes."
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Performance First",
      description: "Optimized code and architecture ensuring lightning-fast load times and smooth interactions."
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      title: "Modern Stack",
      description: "Built with cutting-edge technologies like Next.js, TypeScript, and advanced animation libraries."
    }
  ];

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A premium shopping experience with advanced filtering, real-time inventory, and seamless checkout flow.",
      image: "/hero-intro/0100_4.jpeg",
      tags: ["Next.js", "TypeScript", "Stripe", "Framer Motion"],
      link: "#"
    },
    {
      title: "SaaS Dashboard",
      description: "Comprehensive analytics dashboard with real-time data visualization and interactive charts.",
      image: "/hero-intro/0200_4.jpeg",
      tags: ["React", "D3.js", "Node.js", "PostgreSQL"],
      link: "#"
    },
    {
      title: "Mobile App",
      description: "Cross-platform mobile application with native performance and intuitive user experience.",
      image: "/hero-intro/0300_4.jpeg",
      tags: ["React Native", "Expo", "Firebase", "Redux"],
      link: "#"
    }
  ];

  return (
    <>
      {/* Intro Sequence: Loader + Auto-play */}
      <IntroSequence onComplete={() => setIntroComplete(true)}>
        {/* Background animation always visible after loader */}
        <ScrollSequence />
      </IntroSequence>

      {/* Main Content - Shows after intro complete */}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <main className="relative w-full bg-transparent min-h-screen selection:bg-blue-500/30 selection:text-white">
              <NavBar />
              
              {/* Hero Section */}
              <div className="relative">
                <HeroSection />
              </div>

            {/* Scrollable Content Container */}
            <div className="relative w-full h-[800vh]">
              {/* Section 1: Vision */}
              <TextSection
                headline="Crafting Digital Excellence."
                subheadline="Where innovative design meets cutting-edge technology to create experiences that inspire and engage."
                className="top-[40vh]"
              />

              {/* Section 2: Approach */}
              <TextSection
                headline="Precision in Every Pixel."
                subheadline="Meticulous attention to detail ensures every interaction feels natural, responsive, and delightfully smooth."
                className="top-[250vh]"
              />

              {/* Section 3: Technology */}
              <TextSection
                headline="Built for Tomorrow."
                subheadline="Leveraging the latest technologies and best practices to deliver scalable, maintainable solutions."
                className="top-[500vh]"
              />

              {/* Section 4: Call to Action */}
              <div className="absolute top-[700vh] left-0 w-full flex flex-col items-center justify-center space-y-12 px-6 text-center">
                <motion.h2 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-display text-4xl md:text-6xl lg:text-7xl font-bold text-white"
                >
                  Ready to Create
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Something Amazing?
                  </span>
                </motion.h2>
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row gap-6 justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-8 py-4 text-lg font-semibold text-white rounded-full"
                  >
                    Start a Project
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary px-8 py-4 text-lg font-semibold text-white rounded-full"
                  >
                    View Portfolio
                  </motion.button>
                </motion.div>
              </div>
            </div>

            {/* Features Section */}
            <section id="expertise" className="relative py-32 px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center mb-20"
                >
                  <h2 className="text-display text-4xl md:text-5xl font-bold text-white mb-6">
                    Core Expertise
                  </h2>
                  <p className="text-body text-xl text-white/70 max-w-3xl mx-auto">
                    Specialized skills and technologies that power exceptional digital experiences
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <FeatureCard
                      key={index}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      delay={index * 0.2}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Projects Section */}
            <section id="work" className="relative py-32 px-6 lg:px-8 bg-gray-900">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center mb-20"
                >
                  <h2 className="text-display text-4xl md:text-5xl font-bold text-white mb-6">
                    Featured Work
                  </h2>
                  <p className="text-body text-xl text-white/70 max-w-3xl mx-auto">
                    A selection of recent projects showcasing innovation, creativity, and technical excellence
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {projects.map((project, index) => (
                    <ProjectCard
                      key={index}
                      title={project.title}
                      description={project.description}
                      image={project.image}
                      tags={project.tags}
                      link={project.link}
                      delay={index * 0.2}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="relative py-32 px-6 lg:px-8 bg-black">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <h2 className="text-display text-4xl md:text-5xl font-bold text-white">
                    Let's Build Something
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      Extraordinary
                    </span>
                  </h2>
                  
                  <p className="text-body text-xl text-white/70 max-w-2xl mx-auto">
                    Ready to transform your ideas into reality? Let's discuss your next project and create something amazing together.
                  </p>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="pt-8"
                  >
                    <a
                      href="mailto:hello@example.com"
                      className="btn-primary inline-block px-12 py-4 text-lg font-semibold text-white rounded-full"
                    >
                      Get in Touch
                    </a>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 px-6 border-t border-white/10 bg-black">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="text-white/60 text-sm">
                    © {new Date().getFullYear()} Bicky Muduli. Crafted with passion and precision.
                  </div>
                  <div className="flex space-x-6">
                    {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="text-white/60 hover:text-white transition-colors text-sm"
                      >
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </footer>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
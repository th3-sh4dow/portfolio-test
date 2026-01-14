'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  delay?: number;
}

export default function ProjectCard({ 
  title, 
  description, 
  image, 
  tags, 
  link, 
  delay = 0 
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group cursor-pointer"
    >
      <div className="glass rounded-3xl overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
        <div className="relative h-64 overflow-hidden bg-gray-800">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full h-full"
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        
        <div className="p-8">
          <h3 className="text-headline text-xl font-semibold text-white mb-3">
            {title}
          </h3>
          
          <p className="text-body text-white/70 mb-6 leading-relaxed">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 rounded-full border border-blue-400/20"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {link && (
            <motion.a
              href={link}
              whileHover={{ x: 5 }}
              className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              View Project
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
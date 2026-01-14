'use client';

import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group"
    >
      <div className="glass rounded-3xl p-8 h-full transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 mb-6 text-blue-400"
        >
          {icon}
        </motion.div>
        
        <h3 className="text-headline text-xl font-semibold text-white mb-4">
          {title}
        </h3>
        
        <p className="text-body text-white/70 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
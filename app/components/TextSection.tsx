'use client';

import React from 'react';
import { motion, MotionStyle } from 'framer-motion';

interface TextSectionProps {
    headline: string;
    subheadline: string;
    style?: MotionStyle;
    className?: string;
}

export default function TextSection({ headline, subheadline, style, className = '' }: TextSectionProps) {
    return (
        <motion.div
            style={style}
            className={`absolute inset-0 flex flex-col items-start justify-center px-8 md:px-24 pointer-events-none ${className}`}
        >
            <div className="max-w-4xl space-y-4">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-2xl">
                    {headline}
                </h2>
                <p className="text-xl md:text-2xl font-light text-white/70 max-w-2xl leading-relaxed">
                    {subheadline}
                </p>
            </div>
        </motion.div>
    );
}

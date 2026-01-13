'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 899; // 300 + 300 + 299
const FRAME_DURATION = 1 / 30; // 30fps

export default function ScrollSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { scrollYProgress } = useScroll();

    // Smooth out the scroll progress to create a "cinematic" feel (physics-based)
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 75,
        damping: 15,
        mass: 0.5,
        restDelta: 0.001
    });

    // Map 0-1 scroll progress to frame 0-898
    const frameIndexMotion = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

    const [currentFrame, setCurrentFrame] = useState(0);
    const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
    const [imagesLoaded, setImagesLoaded] = useState(0);

    // --- Helper: format 1 -> "001" ---
    const pad = (n: number) => n.toString().padStart(3, '0');

    // --- Mapping Logic ---
    const getImagePath = (index: number) => {
        // Clamp index
        const clampedIndex = Math.min(Math.max(Math.floor(index), 0), FRAME_COUNT - 1);

        if (clampedIndex < 300) {
            // 0 to 299 -> 1 to 300
            return `/hero-intro/0-10%20sec-jpg/ezgif-frame-${pad(clampedIndex + 1)}.jpg`;
        } else if (clampedIndex < 600) {
            // 300 to 599 -> 1 to 300
            return `/hero-intro/10%20to%2020%20sec/ezgif-frame-${pad(clampedIndex - 300 + 1)}.jpg`;
        } else {
            // 600 to 898 -> 1 to 299
            return `/hero-intro/20%20to%2030%20sec/ezgif-frame-${pad(clampedIndex - 600 + 1)}.jpg`;
        }
    };

    // --- Preloading Strategy ---
    useEffect(() => {
        const preloadParams = [
            { start: 0, end: 100 }, // Priority 1: Immediate start
            { start: 100, end: 300 }, // Priority 2: Rest of first segment
            { start: 300, end: 600 }, // Priority 3: Second segment
            { start: 600, end: FRAME_COUNT } // Priority 4: Final segment
        ];

        let isMounted = true;

        const loadImage = (index: number) => {
            if (imagesRef.current.has(index)) return Promise.resolve();
            return new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.src = getImagePath(index);
                img.onload = () => {
                    if (!isMounted) return;
                    imagesRef.current.set(index, img);
                    setImagesLoaded((prev) => prev + 1);
                    resolve();
                };
                img.onerror = reject;
            });
        };

        // Sequential loading to avoid network clogging
        const loadSequence = async () => {
            for (const range of preloadParams) {
                if (!isMounted) break;
                const promises = [];
                for (let i = range.start; i < range.end; i++) {
                    promises.push(loadImage(i));
                    // Batch requests slightly
                    if (promises.length >= 10) {
                        await Promise.all(promises);
                        promises.length = 0;
                    }
                }
                await Promise.all(promises);
            }
        };

        loadSequence();

        return () => { isMounted = false; };
    }, []);

    // --- Rendering Loop ---
    useMotionValueEvent(frameIndexMotion, 'change', (latest) => {
        const floorIndex = Math.floor(latest);
        if (floorIndex !== currentFrame) {
            setCurrentFrame(floorIndex);
        }
    });

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Responsive Canvas Handling
        const setCanvasSize = () => {
            // We want 'cover' behavior.
            // Assuming 16:9 images roughly (or whatever the frame aspect ratio is).
            // Let's deduce aspect ratio from the first image if loaded, or assume standard.
            // For now, simply fill the screen.
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Initial size
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const img = imagesRef.current.get(currentFrame);

        if (img) {
            // Draw Image Contain/Cover Logic
            // We want the character to be visible, likely 'cover' is best for full immersion.
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio); // 'cover'

            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                img,
                0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
            );
        }

        return () => {
            window.removeEventListener('resize', setCanvasSize);
        }

    }, [currentFrame, imagesLoaded]); // Re-render when frame changes or more images load

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#050505]">
            <canvas
                ref={canvasRef}
                className="block w-full h-full object-cover"
            />
            {/* Optional Loading Indicator for debugging or bad connections */}
            {imagesLoaded < 30 && (
                <div className="fixed bottom-4 right-4 text-xs text-white/20 font-mono">
                    Loading Assets...
                </div>
            )}
        </div>
    );
}

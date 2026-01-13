'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 720;
const FRAME_DURATION = 1 / 30; // 30fps

export default function ScrollSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { scrollYProgress } = useScroll();

    // Smooth out the scroll progress to create a "cinematic" feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 75,
        damping: 15,
        mass: 0.5,
        restDelta: 0.001
    });

    // Map 0-1 scroll progress to frame 0-719
    const frameIndexMotion = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

    const [currentFrame, setCurrentFrame] = useState(0);
    const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
    const [imagesLoaded, setImagesLoaded] = useState(0);

    // --- Helper: format 1 -> "0001" ---
    const pad = (n: number) => n.toString().padStart(4, '0');

    // --- Mapping Logic ---
    const getImagePath = (index: number) => {
        // Clamp index
        const clampedIndex = Math.min(Math.max(Math.floor(index), 0), FRAME_COUNT - 1);
        // 0-based index mapped to 1-based filename
        return `/hero-intro/frame-${pad(clampedIndex + 1)}.jpeg`;
    };

    // --- Preloading Strategy ---
    useEffect(() => {
        // Simplified chunking since it's one folder
        const chunkHeader = 100;
        const preloadParams = [
            { start: 0, end: chunkHeader },             // Immediate
            { start: chunkHeader, end: 300 },           // Early scroll
            { start: 300, end: 500 },                   // Middle
            { start: 500, end: FRAME_COUNT }            // End
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
                img.onerror = (e) => {
                    // Silently fail or retry to avoid crashing entire app on one bad frame
                    // console.error(`Failed to load frame ${index}`, e);
                    resolve();
                };
            });
        };

        // Sequential loading
        const loadSequence = async () => {
            for (const range of preloadParams) {
                if (!isMounted) break;
                const promises = [];
                for (let i = range.start; i < range.end; i++) {
                    promises.push(loadImage(i));
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

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Initial size
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const img = imagesRef.current.get(currentFrame);

        if (img) {
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

    }, [currentFrame, imagesLoaded]);

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#050505]">
            <canvas
                ref={canvasRef}
                className="block w-full h-full object-cover"
            />
        </div>
    );
}

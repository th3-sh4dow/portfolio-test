'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 1999;
const AUTO_PLAY_END = 187; // Frames 0-187 will auto-play
const SCROLL_START = 188; // Scrolling starts from frame 188

export default function ScrollSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { scrollYProgress } = useScroll();
    const [frameMap, setFrameMap] = useState<string[]>([]);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [autoPlayFrame, setAutoPlayFrame] = useState(0);

    // Smooth scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 20,
        mass: 0.5,
        restDelta: 0.001
    });

    // Map scroll to frames 188-1647 (after auto-play)
    const frameIndexMotion = useTransform(
        smoothProgress,
        [0, 1],
        [SCROLL_START, FRAME_COUNT - 1]
    );

    const [currentFrame, setCurrentFrame] = useState(0);
    const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Load frame map
    useEffect(() => {
        fetch(`/frame-map.json?v=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                const filenames = data.map((item: any) => item.filename);
                setFrameMap(filenames);
            })
            .catch(err => console.error('Failed to load frame map:', err));
    }, []);

    // Get image path using frame map
    const getImagePath = (index: number) => {
        const clampedIndex = Math.min(Math.max(Math.floor(index), 0), FRAME_COUNT - 1);
        if (frameMap.length === 0) return '';
        return `/hero-intro/${frameMap[clampedIndex]}`;
    };

    // Auto-play intro animation (frames 0-187)
    useEffect(() => {
        if (!isAutoPlaying || frameMap.length === 0) return;

        const fps = 120; // 120 frames per second - Ultra smooth!
        const interval = 1000 / fps;

        const autoPlayInterval = setInterval(() => {
            setAutoPlayFrame(prev => {
                const next = prev + 1;
                if (next > AUTO_PLAY_END) {
                    setIsAutoPlaying(false);
                    setCurrentFrame(AUTO_PLAY_END);
                    clearInterval(autoPlayInterval);
                    return AUTO_PLAY_END;
                }
                setCurrentFrame(next);
                return next;
            });
        }, interval);

        return () => clearInterval(autoPlayInterval);
    }, [isAutoPlaying, frameMap]);

    // Preload images
    useEffect(() => {
        if (frameMap.length === 0) return;

        // Priority loading: auto-play frames first, then scroll frames
        const preloadParams = [
            { start: 0, end: AUTO_PLAY_END + 1 },     // Auto-play frames (PRIORITY)
            { start: SCROLL_START, end: 400 },        // Early scroll
            { start: 400, end: 800 },                 // Quarter
            { start: 800, end: 1200 },                // Mid
            { start: 1200, end: FRAME_COUNT }         // End
        ];

        let isMounted = true;

        const loadImage = (index: number) => {
            if (imagesRef.current.has(index)) return Promise.resolve();

            return new Promise<void>((resolve) => {
                const img = new Image();
                img.src = getImagePath(index);

                img.onload = () => {
                    if (!isMounted) return;
                    imagesRef.current.set(index, img);
                    setImagesLoaded((prev) => {
                        const newCount = prev + 1;
                        setLoadingProgress(Math.round((newCount / FRAME_COUNT) * 100));
                        return newCount;
                    });
                    resolve();
                };

                img.onerror = () => {
                    console.warn(`Failed to load frame ${index}`);
                    resolve();
                };
            });
        };

        const loadSequence = async () => {
            for (const range of preloadParams) {
                if (!isMounted) break;
                const promises = [];
                for (let i = range.start; i < range.end; i++) {
                    promises.push(loadImage(i));
                    // Faster batch for auto-play frames
                    const batchSize = i <= AUTO_PLAY_END ? 30 : 20;
                    if (promises.length >= batchSize) {
                        await Promise.all(promises);
                        promises.length = 0;
                    }
                }
                await Promise.all(promises);
            }
        };

        loadSequence();

        return () => { isMounted = false; };
    }, [frameMap]);

    // Update current frame on scroll (only after auto-play)
    useMotionValueEvent(frameIndexMotion, 'change', (latest) => {
        if (isAutoPlaying) return; // Don't update during auto-play

        const floorIndex = Math.floor(latest);
        if (floorIndex !== currentFrame) {
            setCurrentFrame(floorIndex);
        }
    });

    // Render to canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const setCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
        };

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const img = imagesRef.current.get(currentFrame);

        if (img && img.complete) {
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;

            const hRatio = canvasWidth / img.width;
            const vRatio = canvasHeight / img.height;
            const ratio = Math.max(hRatio, vRatio);

            const centerShift_x = (canvasWidth - img.width * ratio) / 2;
            const centerShift_y = (canvasHeight - img.height * ratio) / 2;

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(
                img,
                0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
            );
        }

        return () => {
            window.removeEventListener('resize', setCanvasSize);
        };

    }, [currentFrame, imagesLoaded]);

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black">
            <canvas
                ref={canvasRef}
                className="block w-full h-full object-cover"
            />

            {/* Loading indicator */}
            {loadingProgress < 100 && loadingProgress > 0 && (
                <div className="fixed bottom-8 right-8 z-50 glass-dark px-6 py-3 rounded-full shadow-2xl">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            <div className="absolute inset-0 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                        </div>
                        <span className="text-sm text-white/90 font-medium">
                            Loading {loadingProgress}%
                        </span>
                    </div>
                </div>
            )}

            {/* Auto-play indicator */}
            {isAutoPlaying && (
                <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 glass-dark px-6 py-3 rounded-full shadow-2xl">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm text-white/90 font-medium">
                            Intro Animation {autoPlayFrame}/{AUTO_PLAY_END}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

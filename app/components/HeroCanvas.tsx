'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 1999;

interface HeroCanvasProps {
    isLoading?: boolean;
    onVideoComplete?: () => void;
}

export default function HeroCanvas({ isLoading = false, onVideoComplete }: HeroCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Scroll progress for the entire page
    const { scrollYProgress } = useScroll();

    // State
    const [frameMap, setFrameMap] = useState<string[]>([]);
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const [isVideoFading, setIsVideoFading] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());

    // Smooth scroll physics
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 20,
        mass: 0.5,
        restDelta: 0.001,
    });

    // Map scroll 0-1 to frames 0-1999
    // This makes the entire image sequence scroll-controlled
    const frameIndexMotion = useTransform(
        smoothProgress,
        [0, 1],
        [0, FRAME_COUNT - 1]
    );

    // Load frame map
    useEffect(() => {
        fetch(`/frame-map.json?v=${Date.now()}`)
            .then((res) => res.json())
            .then((data) => {
                const filenames = data.map((item: { filename: string }) => item.filename);
                setFrameMap(filenames);
            })
            .catch((err) => console.error('Failed to load frame map:', err));
    }, []);

    // Get image path helper
    const getImagePath = useCallback(
        (index: number) => {
            const clampedIndex = Math.min(Math.max(Math.floor(index), 0), FRAME_COUNT - 1);
            if (frameMap.length === 0) return '';
            return `/hero-intro/${frameMap[clampedIndex]}`;
        },
        [frameMap]
    );

    // Initial Video Logic
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // When video ends, start fade out
        const handleEnded = () => {
            setIsVideoFading(true);
            if (onVideoComplete) onVideoComplete();

            // After fade transition (e.g. 1s), remove video layer logically if needed
            setTimeout(() => {
                setIsVideoPlaying(false);
            }, 1000);
        };

        video.addEventListener('ended', handleEnded);

        // Attempt autoplay
        const playVideo = async () => {
            try {
                await video.play();
            } catch (err) {
                console.error("Video autoplay failed", err);
                // If autoplay fails, we might want to fallback to image sequence immediately
                // or show a play button. For now, we'll just let it fail gracefully 
                // (opacity 0 on video container would reveal canvas).
                setIsVideoFading(true);
                setIsVideoPlaying(false);
            }
        };

        if (!isLoading) {
            playVideo();
        }

        return () => {
            video.removeEventListener('ended', handleEnded);
        };
    }, [isLoading]);


    // Preload Logic (Prioritize early frames, then the rest)
    useEffect(() => {
        if (frameMap.length === 0) return;

        // Preload strategies
        // 1. Initial chunk for immediate scroll after video
        // 2. Batched loading for rest
        const preloadParams = [
            { start: 0, end: 200 },       // Immediate
            { start: 200, end: 600 },     // First section
            { start: 600, end: 1200 },    // Middle
            { start: 1200, end: FRAME_COUNT }, // End
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
                    setImagesLoaded((prev) => prev + 1);
                    resolve();
                };
                img.onerror = () => resolve();
            });
        };

        const loadSequence = async () => {
            for (const range of preloadParams) {
                if (!isMounted) break;
                const promises = [];
                for (let i = range.start; i < range.end; i++) {
                    promises.push(loadImage(i));
                    // Check batch size
                    if (promises.length >= 20) {
                        await Promise.all(promises);
                        promises.length = 0;
                    }
                }
                await Promise.all(promises); // Finish remainder
            }
        };

        // Start loading only after frame map is ready
        loadSequence();

        return () => { isMounted = false; };
    }, [frameMap, getImagePath]);


    // Sync Framer Motion Value to React State for Canvas Rendering
    useMotionValueEvent(frameIndexMotion, 'change', (latest) => {
        const floorIndex = Math.floor(latest);
        if (floorIndex !== currentFrame) {
            setCurrentFrame(floorIndex);
        }
    });

    // Validating image drawing
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

        // Initial size
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const img = imagesRef.current.get(currentFrame);

        // Clear or Draw
        if (img && img.complete) {
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;

            // "Cover" fit algorithm
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

        return () => window.removeEventListener('resize', setCanvasSize);

    }, [currentFrame, imagesLoaded]); // Re-run when frame changes or more images load


    const loadingProgress = Math.round((imagesLoaded / FRAME_COUNT) * 100);

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black">

            {/* Canvas Layer - Always there, waiting for review */}
            <canvas
                ref={canvasRef}
                className="block w-full h-full object-cover absolute inset-0 z-0"
            />

            {/* Video Layer - Plays intro, then fades out */}
            <div
                className={`absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out ${isVideoFading ? 'opacity-0' : 'opacity-100'
                    } ${!isVideoPlaying && isVideoFading ? 'pointer-events-none' : ''}`}
            >
                {isVideoPlaying && (
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src="/intro.mp4"
                        muted
                        playsInline
                    // No loop, we want it to end
                    />
                )}
            </div>

            {/* Optional Loading Indicator (only show if video not playing and still loading images heavily?) 
                Actually, keep it minimal. */}
            {isLoading && (
                <div className="absolute bottom-8 right-8 z-50 text-white font-mono text-xs">
                    Loading...
                </div>
            )}
            {/* Gradient Overlay for style (optional, if user wants it persistently) */}
            <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: `
            radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%),
            linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8) 100%)
          `,
                }}
            />
        </div>
    );
}

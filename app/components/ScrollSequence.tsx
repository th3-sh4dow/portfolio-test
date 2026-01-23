'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 1999;

// 6 STATIONS - Character Animation Breakdown
const STATIONS = {
  // Station 1: Hero/Intro - Character Idle (Standing & Breathing)
  HERO: { start: 0, end: 347, action: 'idle' },
  
  // Station 2: About - Character Transition to Walking
  ABOUT: { start: 348, end: 404, action: 'walk_start' },
  
  // Station 3: Skills - Character Continues Walking
  SKILLS: { start: 405, end: 580, action: 'walking' },
  
  // Station 4: Projects - Character Stops & Observes
  PROJECTS: { start: 732, end: 1135, action: 'stop_observe' },
  
  // Station 5: Experience - Character Attitude Pose
  EXPERIENCE: { start: 1135, end: 1364, action: 'attitude_pose' },
  
  // Station 6: Contact - Character Sits & Works
  CONTACT: { start: 1430, end: 1648, action: 'sit_work' }
};

const AUTO_PLAY_END = 187; // Auto-play intro frames
const SCROLL_START = 188; // Scrolling starts after intro

export default function ScrollSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { scrollYProgress } = useScroll();
    const [frameMap, setFrameMap] = useState<string[]>([]);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [autoPlayFrame, setAutoPlayFrame] = useState(0);
    const lastFrameTime = useRef<number>(0);
    const frameThrottle = 1000 / 30; // Limit to 30 FPS for scroll animation

    // Smooth scroll progress with slower response
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 30,  // Reduced from 60 to 30
        damping: 30,    // Increased from 20 to 30
        mass: 1,        // Increased from 0.5 to 1
        restDelta: 0.001
    });

    // Map scroll to all frames with proper station progression
    const frameIndexMotion = useTransform(
        smoothProgress,
        [0, 1],
        [SCROLL_START, STATIONS.CONTACT.end]
    );

    const [currentFrame, setCurrentFrame] = useState(0);
    const [currentStation, setCurrentStation] = useState('hero');
    const [characterAction, setCharacterAction] = useState('idle');
    const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Determine current station and character action based on frame
    const getCurrentStation = (frame: number) => {
        for (const [stationName, station] of Object.entries(STATIONS)) {
            if (frame >= station.start && frame <= station.end) {
                return { name: stationName.toLowerCase(), action: station.action };
            }
        }
        return { name: 'hero', action: 'idle' };
    };

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

        const fps = 24; // Reduced from 120 to 24 FPS for more cinematic feel
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

    // Update current frame on scroll (only after auto-play) with throttling
    useMotionValueEvent(frameIndexMotion, 'change', (latest) => {
        if (isAutoPlaying) return; // Don't update during auto-play

        const now = Date.now();
        if (now - lastFrameTime.current < frameThrottle) return; // Throttle updates
        
        const floorIndex = Math.floor(latest);
        
        // Only update if frame actually changed
        if (floorIndex !== currentFrame) {
            setCurrentFrame(floorIndex);
            
            // Update station and character action
            const stationInfo = getCurrentStation(floorIndex);
            setCurrentStation(stationInfo.name);
            setCharacterAction(stationInfo.action);
            
            lastFrameTime.current = now;
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
                            Intro Animation {autoPlayFrame}/{AUTO_PLAY_END} (24 FPS)
                        </span>
                    </div>
                </div>
            )}

            {/* Scroll progress indicator with station info */}
            {!isAutoPlaying && (
                <div className="fixed bottom-8 left-8 z-50 glass-dark px-4 py-3 rounded-xl shadow-2xl">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                            <span className="text-xs text-white/80 font-medium">
                                Frame {currentFrame}/{STATIONS.CONTACT.end}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                            <span className="text-xs text-green-400 font-medium capitalize">
                                Station: {currentStation}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                            <span className="text-xs text-purple-400 font-medium">
                                Action: {characterAction.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Station Progress Bar */}
            {!isAutoPlaying && (
                <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 glass-dark px-6 py-4 rounded-xl shadow-2xl">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-white/90 font-medium">Stations:</span>
                        <div className="flex space-x-2">
                            {Object.entries(STATIONS).map(([name, station], index) => {
                                const isActive = currentFrame >= station.start && currentFrame <= station.end;
                                const isPassed = currentFrame > station.end;
                                return (
                                    <div
                                        key={name}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            isActive 
                                                ? 'bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/50' 
                                                : isPassed 
                                                    ? 'bg-green-400' 
                                                    : 'bg-white/20'
                                        }`}
                                        title={`${name}: ${station.action.replace('_', ' ')}`}
                                    />
                                );
                            })}
                        </div>
                        <span className="text-xs text-cyan-400 font-medium">
                            {Object.keys(STATIONS).findIndex(name => 
                                currentFrame >= STATIONS[name as keyof typeof STATIONS].start && 
                                currentFrame <= STATIONS[name as keyof typeof STATIONS].end
                            ) + 1}/6
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

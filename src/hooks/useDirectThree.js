import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Custom hook for Direct Three.js rendering (bypasses React-Three-Fiber).
 * Manages scene, camera, renderer lifecycle inside a React component.
 */
export const useDirectThree = (options = {}) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const frameIdRef = useRef(null);
    const isVisibleRef = useRef(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const { width, height } = containerRef.current.getBoundingClientRect();

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Capped at 1.5 for better mobile performance
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Visibility tracking
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisibleRef.current = entry.isIntersecting;
            });
        }, { threshold: 0 });
        
        // We observe the parent section, but containerRef works securely too
        observer.observe(containerRef.current);

        // Resize Handler
        const handleResize = () => {
            if (!containerRef.current) return;
            const { width, height } = containerRef.current.getBoundingClientRect();
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameIdRef.current);
            observer.disconnect();
            if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return { containerRef, scene: sceneRef.current, camera: cameraRef, renderer: rendererRef, frameId: frameIdRef, isVisibleRef };
};

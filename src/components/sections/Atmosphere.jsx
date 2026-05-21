import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDirectThree } from '../../hooks/useDirectThree';

const Atmosphere = () => {
    const { containerRef, scene, camera, renderer, frameId, isVisibleRef } = useDirectThree();
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const panesRef = useRef([]);

    useEffect(() => {
        if (!scene || !camera.current) return;

        // Dark, moody atmosphere
        const ambient = new THREE.AmbientLight(0x0a0a0f, 0.2);
        scene.add(ambient);

        const pointLight1 = new THREE.PointLight(0xC9A96E, 5, 20); // Gold
        pointLight1.position.set(2, 5, 2);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x4c88e8, 3, 20); // Blue
        pointLight2.position.set(-2, -5, -2);
        scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0xE84C99, 4, 15); // Magenta
        pointLight3.position.set(5, 0, 5);
        scene.add(pointLight3);

        const pointLight4 = new THREE.PointLight(0x4CE8A8, 3, 15); // Emerald
        pointLight4.position.set(-5, 2, 0);
        scene.add(pointLight4);

        // Generate Glass Panes floating vertically
        const paneGeo = new THREE.PlaneGeometry(4, 2.5);
        const paneMat = new THREE.MeshPhysicalMaterial({
            color: 0x222222,
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.9, // glass-like look
            thickness: 0.5,
            side: THREE.DoubleSide
        });

        // Add 5 panes vertically descending
        for (let i = 0; i < 5; i++) {
            const pane = new THREE.Mesh(paneGeo, paneMat);
            // Starting from top, going down
            pane.position.set(
                (Math.random() - 0.5) * 4,
                8 - (i * 4), 
                (Math.random() - 0.5) * 6
            );
            
            // Random tilts
            pane.rotation.x = (Math.random() - 0.5) * 2;
            pane.rotation.y = (Math.random() - 0.5) * 2;

            // Add subtle glowing inner outlines with varying colors
            const colors = [0xC9A96E, 0x4c88e8, 0xE84C99, 0x4CE8A8];
            const edges = new THREE.EdgesGeometry(paneGeo);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ 
                color: colors[i % colors.length], 
                transparent: true, 
                opacity: 0.3 
            }));
            pane.add(line);

            scene.add(pane);
            panesRef.current.push(pane);
        }

        // Camera starts above the planes looking down
        camera.current.position.set(0, 10, 5);
        camera.current.lookAt(0, 8, 0);

        // Vertical Elevator Scroll Array
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 2,
            onUpdate: (self) => {
                const progress = self.progress;

                // Move camera downwards through the panes smoothly
                camera.current.position.y = 10 - (progress * 15);
                
                // Keep looking forward/down slightly relative to camera
                camera.current.lookAt(0, camera.current.position.y - 2, 0);

                if (textRef.current) {
                    textRef.current.style.opacity = Math.sin(progress * Math.PI);
                    // Slight parallax lift of text
                    textRef.current.style.transform = `translate(-50%, -50%) translateY(${-(progress * 100)}px)`;
                }
            }
        });

        const animate = () => {
            frameId.current = requestAnimationFrame(animate);
            if (!isVisibleRef.current) return;
            
            // Panes gently drift
            const time = Date.now() * 0.001;
            panesRef.current.forEach((pane, i) => {
                pane.rotation.x += 0.0003;
                pane.rotation.y += 0.0003;
                pane.position.x += Math.sin(time * 0.2 + i) * 0.001;
            });

            if (renderer.current) {
                renderer.current.render(scene, camera.current);
            }
        };
        animate();

    }, [scene]);

    return (
        <section id="atmosphere" ref={sectionRef} style={{ height: '300vh', position: 'relative', background: '#020202' }}>
            <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
                <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
                
                <div ref={textRef} style={{ 
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    textAlign: 'center', zIndex: 10, pointerEvents: 'none', width: '100%', opacity: 0
                }}>
                    <span className="section-label" style={{ color: '#fff', letterSpacing: '4px', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>LIGHT & SHADOW</span>
                    <h2 className="hero-headline" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', color: '#E8A84C', margin: '1rem 0', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
                        Luminous Atmospheres
                    </h2>
                    <p style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        color: '#ddd',
                        fontSize: 'clamp(0.85rem, 1vw, 1rem)',
                        lineHeight: 1.6,
                        fontFamily: "'Satoshi', sans-serif"
                    }}>
                        Light is not merely functional; it is an architectural material. By sculpting shadows and directing luminosity, we craft environments that breathe and adapt to human emotion. Our bespoke lighting setups transform static spaces into living, dynamic sanctuaries that elevate the spirit and deeply resonate with every subtle shift in time.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Atmosphere;

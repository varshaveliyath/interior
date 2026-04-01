import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Bedroom = () => {
    const sectionRef = useRef(null);
    const canvasRef = useRef(null);
    const textLayer1Ref = useRef(null);
    const textLayer2Ref = useRef(null);
    const textLayer3Ref = useRef(null);
    const contentRef = useRef(null);

    // GSAP Typography Parallax
    useEffect(() => {
        if (!sectionRef.current) return;

        // Big background text layers moving at different speeds
        gsap.to(textLayer1Ref.current, {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(textLayer2Ref.current, {
            yPercent: -100,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(textLayer3Ref.current, {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Content fade in
        gsap.fromTo(contentRef.current, 
            { opacity: 0, y: 100 },
            { 
                opacity: 1, 
                y: 0,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top center",
                    end: "center center",
                    scrub: true
                }
            }
        );
    }, []);

    // Pure Three.js Floating Lamp
    useEffect(() => {
        if (!canvasRef.current) return;

        const container = canvasRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 4);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);

        // Lighting
        const ambient = new THREE.AmbientLight(0xffeedd, 0.2);
        scene.add(ambient);

        const pointLight = new THREE.PointLight(0xE8A84C, 8, 15);
        pointLight.position.set(0, 0.5, 0);
        scene.add(pointLight);

        // Lamp Group
        const group = new THREE.Group();

        // Base
        const baseGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = -1;
        group.add(base);

        // Stand
        const standGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16);
        const standMat = new THREE.MeshStandardMaterial({ color: 0xC9A96E, metalness: 1.0, roughness: 0.3 });
        const stand = new THREE.Mesh(standGeo, standMat);
        stand.position.y = -0.2;
        group.add(stand);

        // Shade
        const shadeGeo = new THREE.ConeGeometry(0.8, 1.2, 32, 1, true);
        const shadeMat = new THREE.MeshStandardMaterial({ 
            color: 0x222222, 
            metalness: 0.1, 
            roughness: 0.9,
            side: THREE.DoubleSide
        });
        const shade = new THREE.Mesh(shadeGeo, shadeMat);
        shade.position.y = 0.8;
        group.add(shade);

        // Volumetric Glow Sphere (Simulated Bloom)
        const glowGeo = new THREE.SphereGeometry(0.7, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xE8A84C,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.y = 0.5;
        group.add(glow);

        // Second outer glow for softer falloff
        const outerGlowGeo = new THREE.SphereGeometry(1.2, 32, 32);
        const outerGlowMat = new THREE.MeshBasicMaterial({
            color: 0xC9A96E,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const outerGlow = new THREE.Mesh(outerGlowGeo, outerGlowMat);
        outerGlow.position.y = 0.5;
        group.add(outerGlow);

        scene.add(group);

        let isVisible = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => isVisible = entry.isIntersecting);
        }, { threshold: 0 });
        if (sectionRef.current) observer.observe(sectionRef.current);

        // Animation Loop
        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            if (!isVisible) return;
            const time = Date.now() * 0.001;
            
            // Complex 3D Floating Rotation
            group.position.y = Math.sin(time) * 0.2; // Float up and down
            group.rotation.y += 0.005; // Constant spin
            group.rotation.x = Math.sin(time * 0.5) * 0.2; // Pitch
            group.rotation.z = Math.cos(time * 0.7) * 0.15; // Roll
            
            // Pulse the glow
            const pulse = (Math.sin(time * 3) + 1) * 0.5; // 0 to 1
            glow.scale.setScalar(1 + pulse * 0.1);
            glowMat.opacity = 0.3 + pulse * 0.1;
            pointLight.intensity = 8 + pulse * 2;

            renderer.render(scene, camera);
        };
        animate();

        // Handle Resize
        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <section id="bedroom" ref={sectionRef} style={{ 
            position: 'relative', 
            minHeight: '150vh', // Extra height for parallax scrolling
            background: '#040406', // Darker to contrast living room
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 0'
        }}>
            {/* Massive Parallax Typography Backgrounds */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <h1 ref={textLayer1Ref} style={{
                    position: 'absolute', top: '10%', left: '-5%',
                    fontSize: 'clamp(10rem, 25vw, 30rem)',
                    fontFamily: "'Cormorant Garamond', serif",
                    color: 'rgba(201, 169, 110, 0.03)', // Barely visible gold
                    whiteSpace: 'nowrap',
                    margin: 0,
                    lineHeight: 0.8,
                    zIndex: 0
                }}>SANCTUARY</h1>

                <h1 ref={textLayer2Ref} style={{
                    position: 'absolute', top: '50%', right: '-10%',
                    fontSize: 'clamp(8rem, 20vw, 25rem)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    color: 'rgba(255, 255, 255, 0.02)',
                    whiteSpace: 'nowrap',
                    margin: 0,
                    lineHeight: 0.8,
                    zIndex: 2
                }}>TRANQUILITY</h1>

                <h1 ref={textLayer3Ref} style={{
                    position: 'absolute', top: '80%', left: '5%',
                    fontSize: 'clamp(6rem, 15vw, 20rem)',
                    fontFamily: "'Satoshi', sans-serif",
                    fontWeight: 500,
                    color: 'rgba(76, 136, 232, 0.02)', // Tint of blue
                    whiteSpace: 'nowrap',
                    margin: 0,
                    lineHeight: 0.8,
                    letterSpacing: '-0.05em',
                    zIndex: 1
                }}>REST</h1>
            </div>

            {/* Foreground Content */}
            <div ref={contentRef} style={{ 
                position: 'relative', 
                zIndex: 10, 
                maxWidth: '1200px', 
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4rem',
                padding: '0 5vw',
                alignItems: 'center'
            }}>
                <div>
                    <span className="section-label" style={{ display: 'block', marginBottom: '2rem' }}>02 / SANCTUARY</span>
                    <h2 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        fontFamily: "'Cormorant Garamond', serif",
                        color: '#F5F0E8',
                        margin: '0 0 2rem 0',
                        lineHeight: 1.1
                    }}>
                        Where Rest<br/>
                        <span style={{ fontStyle: 'italic', color: '#999' }}>Becomes Ritual</span>
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        lineHeight: 1.8,
                        color: '#888',
                        fontFamily: "'Satoshi', sans-serif",
                        maxWidth: '500px'
                    }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                        sed do eiusmod tempor incididunt ut labore et dolore 
                        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                    </p>
                </div>

                {/* 3D Lamp Container */}
                <div ref={canvasRef} style={{
                    width: '100%',
                    height: 'clamp(300px, 50vh, 600px)',
                    position: 'relative',
                    zIndex: 5
                }} />
            </div>

            {/* Fade overlay cleanly into next section */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '20vh',
                background: 'linear-gradient(to top, #0a0a0f, transparent)',
                zIndex: 20, pointerEvents: 'none'
            }} />
        </section>
    );
};

export default Bedroom;

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const projects = [
    { name: 'The Meridian Residence', location: 'Mumbai', tag: 'Luxury Living', image: '/portfolio-living.png', year: '2024' },
    { name: 'Café Lumière', location: 'Goa', tag: 'Hospitality', image: '/portfolio-kitchen.png', year: '2024' },
    { name: 'Azure Penthouse', location: 'Bangalore', tag: 'Penthouse Suite', image: '/portfolio-penthouse.png', year: '2023' }
];

const Portfolio = () => {
    const sectionRef = useRef(null);
    const canvasRef = useRef(null);
    const cardsRef = useRef([]);
    const headlineRef = useRef(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    // Standalone Three.js — floating picture frames
    useEffect(() => {
        if (!canvasRef.current) return;

        const container = canvasRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 6);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        // Warm lighting
        const ambient = new THREE.AmbientLight(0xffeedd, 0.3);
        scene.add(ambient);
        const spot = new THREE.SpotLight(0xC9A96E, 10);
        spot.position.set(3, 5, 5);
        spot.penumbra = 1;
        scene.add(spot);
        const rimLight = new THREE.PointLight(0x4c88e8, 4);
        rimLight.position.set(-4, 2, -3);
        scene.add(rimLight);

        // Create 3 floating picture frames
        const frames = [];
        const framePositions = [
            { x: -2.5, y: 0, z: 0, ry: -0.3 },
            { x: 0, y: 0.3, z: 0.5, ry: 0 },
            { x: 2.5, y: -0.1, z: -0.3, ry: 0.3 },
        ];

        framePositions.forEach((pos, i) => {
            const group = new THREE.Group();

            // Frame border (4 thin boxes forming a rectangle)
            const frameW = 1.8;
            const frameH = 1.2;
            const thickness = 0.06;
            const depth = 0.08;
            const frameMat = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.7,
                roughness: 0.2,
            });

            // Top bar
            const topBar = new THREE.Mesh(new THREE.BoxGeometry(frameW, thickness, depth), frameMat);
            topBar.position.y = frameH / 2;
            group.add(topBar);
            // Bottom bar
            const bottomBar = new THREE.Mesh(new THREE.BoxGeometry(frameW, thickness, depth), frameMat);
            bottomBar.position.y = -frameH / 2;
            group.add(bottomBar);
            // Left bar
            const leftBar = new THREE.Mesh(new THREE.BoxGeometry(thickness, frameH + thickness, depth), frameMat);
            leftBar.position.x = -frameW / 2;
            group.add(leftBar);
            // Right bar
            const rightBar = new THREE.Mesh(new THREE.BoxGeometry(thickness, frameH + thickness, depth), frameMat);
            rightBar.position.x = frameW / 2;
            group.add(rightBar);

            // Inner glass pane
            const paneMat = new THREE.MeshPhysicalMaterial({
                color: 0x111111,
                metalness: 0.1,
                roughness: 0.3,
                transmission: 0.4,
                thickness: 0.1,
                transparent: true,
                opacity: 0.6,
            });
            const pane = new THREE.Mesh(new THREE.PlaneGeometry(frameW - thickness * 2, frameH - thickness * 2), paneMat);
            pane.position.z = -depth / 4;
            group.add(pane);

            // Gold wireframe edges
            const edgeBox = new THREE.BoxGeometry(frameW + 0.02, frameH + 0.02, depth + 0.02);
            const edges = new THREE.EdgesGeometry(edgeBox);
            const edgeLine = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
                color: 0xC9A96E,
                transparent: true,
                opacity: 0.4,
            }));
            group.add(edgeLine);

            group.position.set(pos.x, pos.y, pos.z);
            group.rotation.y = pos.ry;
            scene.add(group);
            frames.push({ group, phase: i * 2.1 });
        });

        // Floating particles
        const particleGeo = new THREE.BufferGeometry();
        const particleCount = 80;
        const posArray = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 12;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ size: 0.03, color: 0xC9A96E }));
        scene.add(particles);

        let isVisible = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => isVisible = entry.isIntersecting);
        }, { threshold: 0 });
        if (sectionRef.current) observer.observe(sectionRef.current);

        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            if (!isVisible) return;

            const time = Date.now() * 0.001;
            frames.forEach(({ group, phase }) => {
                group.position.y += Math.sin(time + phase) * 0.0008;
                group.rotation.y += 0.002;
                group.rotation.x = Math.sin(time * 0.3 + phase) * 0.05;
            });
            particles.rotation.y += 0.0005;
            renderer.render(scene, camera);
        };
        animate();

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

    // GSAP Scroll Animations
    useEffect(() => {
        if (!sectionRef.current) return;

        // Headline reveal
        gsap.fromTo(headlineRef.current,
            { y: 80, opacity: 0 },
            {
                y: 0, opacity: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    end: 'top 30%',
                    scrub: 1,
                }
            }
        );

        // Stagger cards
        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            gsap.fromTo(card,
                { y: 60, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        end: 'top 60%',
                        scrub: 1,
                    },
                    delay: i * 0.05,
                }
            );
        });
    }, []);

    return (
        <section id="portfolio" ref={sectionRef} style={{
            position: 'relative',
            minHeight: '100vh',
            background: '#050508',
            overflow: 'hidden',
            padding: '120px 0 80px',
        }}>
            {/* Ambient radial gradient */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                background: 'radial-gradient(ellipse at 70% 30%, #12101a 0%, #050508 50%, #07070A 100%)',
                opacity: 0.7,
            }} />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '1400px', margin: '0 auto', padding: '0 5vw' }}>
                {/* Section Label */}
                <span className="section-label" style={{ display: 'block', marginBottom: '2rem' }}>03 / PORTFOLIO</span>

                {/* Headline */}
                <h2 ref={headlineRef} style={{
                    fontSize: 'clamp(3rem, 8vw, 7rem)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    color: '#F5F0E8',
                    lineHeight: 1.1,
                    margin: '0 0 2rem 0',
                }}>
                    Curated <br />
                    <span style={{ color: '#C9A96E' }}>Spaces</span>
                </h2>

                <p style={{
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: '#777',
                    fontFamily: "'Satoshi', sans-serif",
                    maxWidth: '600px',
                    marginBottom: '3rem',
                }}>
                    A selection of our most transformative projects — where vision met craftsmanship
                    and spaces were reimagined from the ground up.
                </p>

                {/* 3D Floating Frames */}
                <div ref={canvasRef} style={{
                    width: '100%',
                    height: 'clamp(200px, 30vh, 350px)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '4rem',
                }} />

                {/* Project Cards Vertical Zigzag */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    marginBottom: '4rem',
                    alignItems: 'center',
                }}>
                    {projects.map((project, i) => (
                        <div
                            key={i}
                            className="portfolio-card"
                            ref={el => cardsRef.current[i] = el}
                            onMouseEnter={() => setHoveredCard(i)}
                            onMouseLeave={() => setHoveredCard(null)}
                            style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '500px', // Smaller card layout
                                alignSelf: window.innerWidth > 900 ? (i % 2 === 0 ? 'flex-start' : 'flex-end') : 'center',
                                borderRadius: '8px',
                                border: `1px solid ${hoveredCard === i ? 'rgba(201, 169, 110, 0.4)' : 'rgba(201, 169, 110, 0.1)'}`,
                                overflow: 'hidden',
                                background: hoveredCard === i ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.015)',
                                backdropFilter: 'blur(8px)',
                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: hoveredCard === i ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                                cursor: 'pointer',
                            }}
                        >
                            {/* Image */}
                            <div style={{
                                width: '100%',
                                height: 'clamp(250px, 30vh, 350px)',
                                overflow: 'hidden',
                                position: 'relative',
                            }}>
                                <img
                                    src={project.image}
                                    alt={project.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                        transform: hoveredCard === i ? 'scale(1.08)' : 'scale(1)',
                                        filter: 'brightness(0.85) contrast(1.1)',
                                    }}
                                />
                                {/* Tag overlay */}
                                <span className="mono" style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    background: 'rgba(7, 7, 10, 0.75)',
                                    backdropFilter: 'blur(12px)',
                                    color: '#C9A96E',
                                    fontSize: '12px',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    border: '1px solid rgba(201, 169, 110, 0.2)',
                                }}>{project.tag}</span>
                            </div>

                            {/* Card Content */}
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '2rem',
                                    color: '#F5F0E8',
                                    fontWeight: 400,
                                    margin: '0 0 1rem',
                                }}>{project.name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="mono" style={{ fontSize: '13px', color: '#888', letterSpacing: '1px' }}>
                                        {project.location.toUpperCase()}
                                    </span>
                                    <span className="mono" style={{ fontSize: '13px', color: '#C9A96E', letterSpacing: '1px' }}>
                                        {project.year}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '2rem',
                    borderTop: '1px solid rgba(201, 169, 110, 0.15)',
                    paddingTop: '3rem',
                }}>
                    {[
                        { value: '6', label: 'COUNTRIES' },
                        { value: '50+', label: 'COLLABORATORS' },
                        { value: '12', label: 'DESIGN AWARDS' },
                    ].map((stat, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <span className="mono" style={{ color: '#C9A96E', fontSize: '2.5rem', display: 'block' }}>{stat.value}</span>
                            <span className="mono" style={{ fontSize: '11px', color: '#555', marginTop: '0.5rem', display: 'block', letterSpacing: '2px' }}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '150px',
                background: 'linear-gradient(to top, #07070A 0%, transparent 100%)',
                zIndex: 3, pointerEvents: 'none',
            }} />
        </section>
    );
};

export default Portfolio;

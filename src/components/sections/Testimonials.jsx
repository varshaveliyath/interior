import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const testimonials = [
    {
        quote: "Luminae didn\u2019t just redesign our home \u2014 they reimagined how we live in it. Every corner now feels intentional, every shadow deliberate.",
        name: 'Priya & Arjun Malhotra',
        project: 'The Meridian Residence',
    },
    {
        quote: "Working with this team was like having a conversation with someone who truly understands light. Our restaurant feels like a living artwork.",
        name: 'Chef Rohan Kapoor',
        project: 'Caf\u00e9 Lumi\u00e8re',
    },
    {
        quote: "From the first sketch to the final reveal, the attention to detail was extraordinary. Our penthouse is now our sanctuary.",
        name: 'Ananya Sharma',
        project: 'Azure Penthouse',
    },
];

const Testimonials = () => {
    const sectionRef = useRef(null);
    const canvasRef = useRef(null);
    const textLayer1Ref = useRef(null);
    const textLayer2Ref = useRef(null);
    const textLayer3Ref = useRef(null);
    const contentRef = useRef(null);
    const cardsRef = useRef([]);

    // GSAP Typography Parallax
    useEffect(() => {
        if (!sectionRef.current) return;

        gsap.to(textLayer1Ref.current, {
            yPercent: -40,
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        });

        gsap.to(textLayer2Ref.current, {
            yPercent: -80,
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        });

        gsap.to(textLayer3Ref.current, {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        });

        // Content fade in
        gsap.fromTo(contentRef.current,
            { opacity: 0, y: 100 },
            {
                opacity: 1, y: 0,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top center',
                    end: 'center center',
                    scrub: true,
                }
            }
        );

        // Stagger testimonial cards
        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            gsap.fromTo(card,
                { y: 60, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        end: 'top 65%',
                        scrub: 1,
                    },
                    delay: i * 0.1,
                }
            );
        });
    }, []);

    // Pure Three.js — Floating Gems
    useEffect(() => {
        if (!canvasRef.current) return;

        const container = canvasRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 5);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        // Lighting
        const ambient = new THREE.AmbientLight(0xffeedd, 0.3);
        scene.add(ambient);
        const spot = new THREE.SpotLight(0xC9A96E, 10);
        spot.position.set(3, 5, 5);
        spot.penumbra = 1;
        scene.add(spot);
        const rimLight = new THREE.PointLight(0x4c88e8, 4);
        rimLight.position.set(-4, 2, -3);
        scene.add(rimLight);

        // 5 floating gem octahedrons
        const gems = [];
        const gemMat = new THREE.MeshPhysicalMaterial({
            color: 0xC9A96E,
            metalness: 0.3,
            roughness: 0.1,
            transmission: 0.8,
            thickness: 0.5,
            transparent: true,
        });

        for (let i = 0; i < 5; i++) {
            const size = 0.3 + Math.random() * 0.4;
            const gem = new THREE.Mesh(new THREE.OctahedronGeometry(size, 0), gemMat);
            const angle = (i / 5) * Math.PI * 2;
            const radius = 1.5 + Math.random() * 0.8;
            gem.position.set(
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 2,
                Math.sin(angle) * radius * 0.5
            );

            // Gold wireframe edges
            const edges = new THREE.EdgesGeometry(gem.geometry);
            const edgeLine = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
                color: 0xC9A96E,
                transparent: true,
                opacity: 0.3,
            }));
            gem.add(edgeLine);

            scene.add(gem);
            gems.push({ mesh: gem, phase: i * 1.3, baseY: gem.position.y });
        }

        // Glow sphere at center
        const glowGeo = new THREE.SphereGeometry(0.8, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xC9A96E,
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        scene.add(glow);

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
            gems.forEach(({ mesh, phase, baseY }) => {
                mesh.position.y = baseY + Math.sin(time + phase) * 0.15;
                mesh.rotation.x += 0.005;
                mesh.rotation.y += 0.008;
            });

            // Pulse glow
            const pulse = (Math.sin(time * 2) + 1) * 0.5;
            glowMat.opacity = 0.05 + pulse * 0.05;
            glow.scale.setScalar(1 + pulse * 0.15);

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

    return (
        <section id="testimonials" ref={sectionRef} style={{
            position: 'relative',
            minHeight: '120vh',
            background: '#060609',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '100px 0',
            zIndex: 10,
        }}>
            {/* Massive Parallax Typography Backgrounds */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <h1 ref={textLayer1Ref} style={{
                    position: 'absolute', top: '8%', left: '-5%',
                    fontSize: 'clamp(10rem, 25vw, 30rem)',
                    fontFamily: "'Cormorant Garamond', serif",
                    color: 'rgba(201, 169, 110, 0.025)',
                    whiteSpace: 'nowrap',
                    margin: 0,
                    lineHeight: 0.8,
                    zIndex: 0,
                }}>VOICES</h1>

                <h1 ref={textLayer2Ref} style={{
                    position: 'absolute', top: '45%', right: '-10%',
                    fontSize: 'clamp(8rem, 20vw, 25rem)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    color: 'rgba(255, 255, 255, 0.015)',
                    whiteSpace: 'nowrap',
                    margin: 0,
                    lineHeight: 0.8,
                    zIndex: 2,
                }}>TRUST</h1>

                <h1 ref={textLayer3Ref} style={{
                    position: 'absolute', top: '75%', left: '5%',
                    fontSize: 'clamp(6rem, 15vw, 20rem)',
                    fontFamily: "'Satoshi', sans-serif",
                    fontWeight: 500,
                    color: 'rgba(76, 136, 232, 0.015)',
                    whiteSpace: 'nowrap',
                    margin: 0,
                    lineHeight: 0.8,
                    letterSpacing: '-0.05em',
                    zIndex: 1,
                }}>LEGACY</h1>
            </div>

            {/* Foreground Content */}
            <div ref={contentRef} style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '1200px',
                width: '100%',
                padding: '0 5vw',
            }}>
                {/* Header Grid: Text + 3D Gems */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4rem',
                    alignItems: 'center',
                    marginBottom: '5rem',
                }}>
                    <div>
                        <span className="section-label" style={{ display: 'block', marginBottom: '2rem' }}>05 / CLIENT VOICES</span>
                        <h2 style={{
                            fontSize: 'clamp(3rem, 6vw, 5rem)',
                            fontFamily: "'Cormorant Garamond', serif",
                            color: '#F5F0E8',
                            margin: '0 0 2rem 0',
                            lineHeight: 1.1,
                        }}>
                            Spaces That Speak<br />
                            <span style={{ fontStyle: 'italic', color: '#999' }}>For Themselves</span>
                        </h2>
                        <p style={{
                            fontSize: '1.15rem',
                            lineHeight: 1.8,
                            color: '#888',
                            fontFamily: "'Satoshi', sans-serif",
                            maxWidth: '500px',
                        }}>
                            Every project begins with a conversation and ends with a transformation.
                            Here's what our clients have to say.
                        </p>
                    </div>

                    {/* 3D Gems Container */}
                    <div ref={canvasRef} style={{
                        width: '100%',
                        height: 'clamp(250px, 40vh, 450px)',
                        position: 'relative',
                        zIndex: 5,
                    }} />
                </div>

                {/* Testimonial Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                }}>
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            ref={el => cardsRef.current[i] = el}
                            style={{
                                borderTop: '2px solid #C9A96E',
                                padding: '2rem 1.5rem',
                                background: 'rgba(255, 255, 255, 0.015)',
                                borderRadius: '0 0 8px 8px',
                            }}
                        >
                            <p style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontStyle: 'italic',
                                fontSize: '1.2rem',
                                color: '#ccc',
                                lineHeight: 1.7,
                                margin: '0 0 1.5rem',
                            }}>
                                "{t.quote}"
                            </p>
                            <span className="mono" style={{
                                color: '#C9A96E',
                                fontSize: '12px',
                                display: 'block',
                                marginBottom: '0.3rem',
                                letterSpacing: '1px',
                            }}>
                                — {t.name.toUpperCase()}
                            </span>
                            <span className="mono" style={{
                                color: '#555',
                                fontSize: '11px',
                                letterSpacing: '1px',
                            }}>
                                {t.project}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '20vh',
                background: 'linear-gradient(to top, #0a0a0f, transparent)',
                zIndex: 20, pointerEvents: 'none',
            }} />
        </section>
    );
};

export default Testimonials;

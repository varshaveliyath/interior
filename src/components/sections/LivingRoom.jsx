import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LivingRoom = () => {
    const sectionRef = useRef(null);
    const canvasRef = useRef(null);
    const parallaxRef = useRef(null);

    // Inline 3D Floating Cushion (Pure Three.js)
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

        // Warm lighting
        const ambient = new THREE.AmbientLight(0xffeedd, 0.4);
        scene.add(ambient);
        const spot = new THREE.SpotLight(0xC9A96E, 8);
        spot.position.set(3, 5, 5);
        spot.penumbra = 1;
        scene.add(spot);
        const rimLight = new THREE.PointLight(0x4c88e8, 3);
        rimLight.position.set(-4, 2, -2);
        scene.add(rimLight);

        // Cushion shape (rounded box approximation)
        const cushionGeo = new THREE.SphereGeometry(1, 32, 16);
        cushionGeo.scale(1.2, 0.5, 1);
        const cushionMat = new THREE.MeshStandardMaterial({
            color: 0xC9A96E,
            roughness: 0.6,
            metalness: 0.1,
        });
        const cushion = new THREE.Mesh(cushionGeo, cushionMat);
        scene.add(cushion);

        // Second smaller cushion
        const cushion2Geo = new THREE.SphereGeometry(0.6, 32, 16);
        cushion2Geo.scale(1.1, 0.5, 1);
        const cushion2 = new THREE.Mesh(cushion2Geo, new THREE.MeshStandardMaterial({
            color: 0xE8A84C,
            roughness: 0.5,
            metalness: 0.15,
        }));
        cushion2.position.set(1.2, 0.3, 0.5);
        cushion2.rotation.z = 0.3;
        scene.add(cushion2);

        let isVisible = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => isVisible = entry.isIntersecting);
        }, { threshold: 0 });
        if (sectionRef.current) observer.observe(sectionRef.current);

        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            if (!isVisible) return;
            cushion.rotation.y += 0.003;
            cushion.position.y = Math.sin(Date.now() * 0.001) * 0.15;
            cushion2.rotation.y -= 0.004;
            cushion2.position.y = Math.sin(Date.now() * 0.0012 + 1) * 0.12 + 0.3;
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

    // GSAP Parallax Scroll Animation
    useEffect(() => {
        if (!sectionRef.current || !parallaxRef.current) return;

        const layers = parallaxRef.current.querySelectorAll('.parallax-layer');
        layers.forEach((layer, i) => {
            gsap.fromTo(layer,
                { y: 50 * (i + 1), opacity: 0 },
                {
                    y: 0, opacity: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        end: 'center center',
                        scrub: 1,
                    }
                }
            );
        });

        // Section headline reveal
        gsap.fromTo(sectionRef.current.querySelector('.section-headline'),
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
    }, []);

    return (
        <section id="living" ref={sectionRef} style={{
            position: 'relative',
            minHeight: '100vh',
            background: '#0a0a0f',
            overflow: 'hidden',
            padding: '120px 0',
        }}>
            {/* Ambient Fog Gradient (CSS-based fallback for Vanta) */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                background: 'radial-gradient(ellipse at 30% 50%, #1a1520 0%, #0a0a0f 50%, #07070A 100%)',
                opacity: 0.8,
            }} />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '1400px', margin: '0 auto', padding: '0 5vw' }}>
                {/* Section Label */}
                <span className="section-label" style={{ display: 'block', marginBottom: '2rem' }}>01 / THE CONCEPT</span>

                {/* Headline */}
                <h2 className="section-headline" style={{
                    fontSize: 'clamp(3rem, 8vw, 7rem)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    color: '#F5F0E8',
                    lineHeight: 1.1,
                    margin: '0 0 4rem 0',
                }}>
                    The Art of <br />
                    <span style={{ color: '#C9A96E' }}>First Impressions</span>
                </h2>

                {/* Content Grid: Parallax Text + 3D Object */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4rem',
                    alignItems: 'center',
                }}>
                    {/* Left: Parallax Text Layers */}
                    <div ref={parallaxRef}>
                        <div className="parallax-layer" style={{ marginBottom: '2rem' }}>
                            <p style={{
                                fontSize: '1.1rem',
                                lineHeight: 1.8,
                                color: '#999',
                                fontFamily: "'Satoshi', sans-serif",
                            }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                Sed do eiusmod tempor incididunt ut labore et dolore 
                                magna aliqua. Ut enim ad minim veniam, quis nostrud 
                                exercitation ullamco laboris nisi ut aliquip.
                            </p>
                        </div>

                        <div className="parallax-layer" style={{ marginBottom: '2rem' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '2rem',
                            }}>
                                <div>
                                    <span className="mono" style={{ color: '#C9A96E', fontSize: '2rem' }}>147+</span>
                                    <p className="mono" style={{ fontSize: '11px', color: '#666', marginTop: '0.5rem' }}>PROJECTS DELIVERED</p>
                                </div>
                                <div>
                                    <span className="mono" style={{ color: '#C9A96E', fontSize: '2rem' }}>98%</span>
                                    <p className="mono" style={{ fontSize: '11px', color: '#666', marginTop: '0.5rem' }}>CLIENT SATISFACTION</p>
                                </div>
                            </div>
                        </div>

                        <div className="parallax-layer">
                            <div style={{
                                borderTop: '1px solid #C9A96E33',
                                paddingTop: '2rem',
                            }}>
                                <p style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                    "Luminae transformed our apartment into something
                                    we never imagined possible."
                                </p>
                                <span className="mono" style={{ color: '#C9A96E', fontSize: '11px' }}>— SARAH M., MANHATTAN</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: 3D Floating Cushion */}
                    <div ref={canvasRef} style={{
                        width: '100%',
                        height: 'clamp(300px, 50vh, 500px)',
                        borderRadius: '8px',
                        border: '1px solid #C9A96E22',
                        overflow: 'hidden',
                    }} />
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

export default LivingRoom;

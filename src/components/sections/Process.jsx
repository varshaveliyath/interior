import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDirectThree } from '../../hooks/useDirectThree';

const steps = [
    {
        num: '01',
        title: 'Discovery',
        desc: 'We listen to your vision, study your space, and understand how light and life move through your world.',
    },
    {
        num: '02',
        title: 'Concept',
        desc: 'Mood boards, material palettes, and spatial narratives take shape — every texture tells a story.',
    },
    {
        num: '03',
        title: 'Realization',
        desc: 'From bespoke furniture to artisan finishes, each element is crafted with obsessive precision.',
    },
    {
        num: '04',
        title: 'Reveal',
        desc: 'The moment your space comes alive — where months of imagination become your everyday reality.',
    },
];

const Process = () => {
    const { containerRef, scene, camera, renderer, frameId, isVisibleRef } = useDirectThree();
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const progressRef = useRef(null);
    const objectsRef = useRef([]);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (!scene || !camera.current) return;

        // Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambient);

        const spot = new THREE.SpotLight(0xC9A96E, 12, 50);
        spot.position.set(3, 5, 5);
        spot.angle = 0.6;
        spot.penumbra = 1;
        scene.add(spot);

        const blueLight = new THREE.PointLight(0x4c88e8, 4, 30);
        blueLight.position.set(-5, 2, -3);
        scene.add(blueLight);

        const warmLight = new THREE.PointLight(0xE8A84C, 3, 20);
        warmLight.position.set(0, -3, 2);
        scene.add(warmLight);

        // Central group
        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        // Central sphere
        const centralSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            new THREE.MeshStandardMaterial({
                color: 0xC9A96E,
                metalness: 0.6,
                roughness: 0.3,
            })
        );
        mainGroup.add(centralSphere);

        // Compass arms (2 cylinders)
        const armMat = new THREE.MeshStandardMaterial({ color: 0xC9A96E, metalness: 0.8, roughness: 0.2 });
        const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3, 8), armMat);
        arm1.position.set(0.8, -0.5, 0);
        arm1.rotation.z = -0.4;
        mainGroup.add(arm1);

        const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3, 8), armMat);
        arm2.position.set(-0.8, -0.5, 0);
        arm2.rotation.z = 0.4;
        mainGroup.add(arm2);

        // Wireframe arm edges
        [arm1, arm2].forEach(arm => {
            const edges = new THREE.EdgesGeometry(arm.geometry);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xC9A96E, transparent: true, opacity: 0.3 }));
            line.position.copy(arm.position);
            line.rotation.copy(arm.rotation);
            mainGroup.add(line);
        });

        // Torus ring around center
        const torusMesh = new THREE.Mesh(
            new THREE.TorusGeometry(1.2, 0.04, 16, 64),
            new THREE.MeshStandardMaterial({ color: 0xE8A84C, metalness: 0.7, roughness: 0.2, wireframe: true })
        );
        torusMesh.rotation.x = Math.PI / 3;
        mainGroup.add(torusMesh);

        // Second torus (perpendicular)
        const torus2 = new THREE.Mesh(
            new THREE.TorusGeometry(1.5, 0.03, 16, 64),
            new THREE.MeshStandardMaterial({ color: 0xC9A96E, metalness: 0.7, roughness: 0.2, wireframe: true })
        );
        torus2.rotation.x = -Math.PI / 6;
        torus2.rotation.y = Math.PI / 4;
        mainGroup.add(torus2);


        // Floating particles
        const particleGeo = new THREE.BufferGeometry();
        const particleCount = 40;
        const posArray = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ size: 0.04, color: 0xC9A96E }));
        scene.add(particles);

        // GSAP ScrollTrigger
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
            onUpdate: (self) => {
                const progress = self.progress;

                // Camera dolly + slight orbit
                camera.current.position.z = 8 - (progress * 4);
                camera.current.position.x = Math.sin(progress * Math.PI * 2) * 1.5;
                camera.current.position.y = Math.cos(progress * Math.PI) * 0.8;
                camera.current.lookAt(0, 0, 0);

                // Determine active step
                const stepIndex = Math.min(3, Math.floor(progress * 4));
                setActiveStep(stepIndex);

                // Progress bar
                if (progressRef.current) {
                    progressRef.current.style.height = `${progress * 100}%`;
                }
            }
        });

        // Initial camera
        camera.current.position.set(0, 0, 8);
        camera.current.lookAt(0, 0, 0);

        const animate = () => {
            frameId.current = requestAnimationFrame(animate);
            if (!isVisibleRef.current) return;

            const time = Date.now() * 0.001;
            mainGroup.rotation.y += 0.003;
            torusMesh.rotation.z += 0.005;
            torus2.rotation.z -= 0.003;



            particles.rotation.y += 0.0003;

            if (renderer.current) {
                renderer.current.render(scene, camera.current);
            }
        };
        animate();

    }, [scene]);

    return (
        <section id="process" ref={sectionRef} style={{ height: '400vh', position: 'relative', background: '#030305' }}>
            <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
                {/* 3D Canvas */}
                <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />

                {/* Progress Indicator — Left side */}
                <div style={{
                    position: 'absolute',
                    left: '3vw',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.8rem',
                }}>
                    <div style={{
                        width: '2px',
                        height: '120px',
                        background: 'rgba(201, 169, 110, 0.15)',
                        borderRadius: '1px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div ref={progressRef} style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '0%',
                            background: 'linear-gradient(to bottom, #C9A96E, #E8A84C)',
                            borderRadius: '1px',
                            transition: 'height 0.1s ease-out',
                        }} />
                    </div>
                    {steps.map((step, i) => (
                        <div key={i} style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: activeStep >= i ? '#C9A96E' : 'rgba(201, 169, 110, 0.2)',
                            transition: 'background 0.4s ease',
                            border: activeStep === i ? '2px solid #E8A84C' : '2px solid transparent',
                        }} />
                    ))}
                </div>

                {/* Text Overlay */}
                <div ref={textRef} style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    textAlign: 'center', zIndex: 10, pointerEvents: 'none', width: '80%', maxWidth: '700px',
                }}>
                    <span className="section-label" style={{
                        color: '#C9A96E',
                        letterSpacing: '4px',
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                        display: 'block',
                        marginBottom: '1rem',
                    }}>
                        04 / OUR PROCESS
                    </span>

                    {steps.map((step, i) => (
                        <div key={i} style={{
                            position: i === 0 ? 'relative' : 'absolute',
                            top: i === 0 ? 'auto' : '50%',
                            left: i === 0 ? 'auto' : '50%',
                            transform: i === 0 ? 'none' : 'translate(-50%, -50%)',
                            width: '100%',
                            opacity: activeStep === i ? 1 : 0,
                            transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            visibility: activeStep === i ? 'visible' : 'hidden',
                        }}>
                            <span className="mono" style={{
                                color: '#E8A84C',
                                fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
                                display: 'block',
                                marginBottom: '0.5rem',
                                letterSpacing: '3px',
                            }}>
                                STEP {step.num}
                            </span>
                            <h2 style={{
                                fontSize: 'clamp(3rem, 7vw, 7rem)',
                                fontFamily: "'Cormorant Garamond', serif",
                                color: '#E8A84C',
                                margin: '0 0 1.5rem',
                                lineHeight: 1,
                                fontWeight: 300,
                                textShadow: '0 4px 30px rgba(0,0,0,0.6)',
                            }}>
                                {step.title}
                            </h2>
                            <p style={{
                                fontFamily: "'Satoshi', sans-serif",
                                fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
                                color: 'rgba(245, 237, 216, 0.7)',
                                lineHeight: 1.7,
                                maxWidth: '550px',
                                margin: '0 auto',
                            }}>
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;

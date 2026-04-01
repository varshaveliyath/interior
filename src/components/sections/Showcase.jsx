import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDirectThree } from '../../hooks/useDirectThree';

const Showcase = () => {
    const { containerRef, scene, camera, renderer, frameId, isVisibleRef } = useDirectThree();
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const objectsRef = useRef([]);

    useEffect(() => {
        if (!scene || !camera.current) return;

        // Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambient);

        const pointLight = new THREE.PointLight(0xC9A96E, 12, 50);
        pointLight.position.set(0, 5, 0);
        scene.add(pointLight);

        const fillLight = new THREE.DirectionalLight(0x4c88e8, 2);
        fillLight.position.set(-5, 0, -5);
        scene.add(fillLight);

        // Environment
        const torusKnot = new THREE.Mesh(
            new THREE.TorusKnotGeometry( 3, 0.8, 128, 32 ),
            new THREE.MeshStandardMaterial({ 
                color: 0xE8A84C, 
                metalness: 0.8, 
                roughness: 0.2,
                wireframe: true
            })
        );
        scene.add(torusKnot);
        objectsRef.current.push(torusKnot);

        // Add some floating particles
        const particleGeo = new THREE.BufferGeometry();
        const particleCount = 200;
        const posArray = new Float32Array(particleCount * 3);
        for(let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 20;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMat = new THREE.PointsMaterial({ size: 0.05, color: 0xC9A96E });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);
        objectsRef.current.push(particles);

        // GSAP Orbital Scroll Animation
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                
                // Orbit radius and angle
                const radius = 8;
                const angle = progress * Math.PI * 2; // Full 360 degree rotation
                
                camera.current.position.x = Math.sin(angle) * radius;
                camera.current.position.z = Math.cos(angle) * radius;
                camera.current.position.y = 2 - (progress * 4); // Move from y=2 to y=-2
                
                camera.current.lookAt(0, 0, 0);

                // Text animation: slide in and out or change scale
                if (textRef.current) {
                    textRef.current.style.opacity = Math.sin(progress * Math.PI); // Fade in peak at 50%
                    textRef.current.style.transform = `translate(-50%, -50%) scale(${0.8 + progress * 0.4})`;
                }
            }
        });

        // Initial camera setup
        camera.current.position.set(0, 2, 8);
        camera.current.lookAt(0, 0, 0);

        const animate = () => {
            frameId.current = requestAnimationFrame(animate);
            if (!isVisibleRef.current) return;
            
            torusKnot.rotation.x += 0.005;
            torusKnot.rotation.y += 0.005;
            
            particles.rotation.y += 0.001;

            if (renderer.current) {
                renderer.current.render(scene, camera.current);
            }
        };
        animate();

    }, [scene]);

    return (
        <section id="showcase" ref={sectionRef} style={{ height: '300vh', position: 'relative', background: '#0a0a0a' }}>
            <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
                <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
                
                <div ref={textRef} style={{ 
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    textAlign: 'center', zIndex: 10, pointerEvents: 'none', width: '100%', opacity: 0
                }}>
                    <span className="section-label" style={{ color: '#fff', letterSpacing: '4px', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>360° PERSPECTIVE</span>
                    <h2 className="hero-headline" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', color: '#E8A84C', margin: '1rem 0', WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                        Exquisite Details
                    </h2>
                </div>
            </div>
        </section>
    );
};

export default Showcase;

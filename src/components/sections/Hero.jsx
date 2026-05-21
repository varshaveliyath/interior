import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDirectThree } from '../../hooks/useDirectThree';

const Hero = () => {
    const { containerRef, scene, camera, renderer, frameId, isVisibleRef } = useDirectThree();
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const scrollIndicatorRef = useRef(null);
    const objectsRef = useRef([]);

    useEffect(() => {
        if (!scene || !camera.current) return;

        // 1. Subtle, warm cinematic lighting
        const ambient = new THREE.AmbientLight(0xffeedd, 0.15);
        scene.add(ambient);

        const spot1 = new THREE.SpotLight(0xC9A96E, 6);
        spot1.position.set(4, 8, 6);
        spot1.angle = 0.4;
        spot1.penumbra = 1;
        scene.add(spot1);

        const blueLight = new THREE.PointLight(0x4c88e8, 2);
        blueLight.position.set(-6, 3, -4);
        scene.add(blueLight);

        const warmRim = new THREE.PointLight(0xE8A84C, 3);
        warmRim.position.set(0, -2, 3);
        scene.add(warmRim);

        // 2. Reflective Floor
        const gridHelper = new THREE.GridHelper(30, 30, 0xC9A96E, 0x1a1a1a);
        gridHelper.position.y = -2;
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);

        const floorGeo = new THREE.PlaneGeometry(60, 60);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x07070A,
            roughness: 0.15,
            metalness: 0.85
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -2.01;
        scene.add(floor);

        // 3. Elegant architectural elements instead of random shapes
        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        // Central tall column
        const columnGeo = new THREE.CylinderGeometry(0.15, 0.15, 5, 32);
        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xC9A96E, metalness: 0.7, roughness: 0.25
        });
        const column = new THREE.Mesh(columnGeo, goldMat);
        column.position.set(0, 0.5, 0);
        mainGroup.add(column);

        // Orbital rings — architectural feel
        const ring1 = new THREE.Mesh(
            new THREE.TorusGeometry(2, 0.025, 16, 100),
            new THREE.MeshStandardMaterial({ color: 0xC9A96E, metalness: 0.8, roughness: 0.2 })
        );
        ring1.rotation.x = Math.PI / 2.5;
        ring1.position.y = 1;
        mainGroup.add(ring1);

        const ring2 = new THREE.Mesh(
            new THREE.TorusGeometry(2.8, 0.02, 16, 100),
            new THREE.MeshStandardMaterial({ color: 0xE8A84C, metalness: 0.8, roughness: 0.2 })
        );
        ring2.rotation.x = Math.PI / 1.8;
        ring2.rotation.z = 0.3;
        ring2.position.y = 0.5;
        mainGroup.add(ring2);

        // Small floating spheres at intersections
        const sphereGeo = new THREE.SphereGeometry(0.12, 24, 24);
        const spherePositions = [
            [2, 1, 0], [-2, 1, 0], [0, 1, 2], [0, 1, -2],
            [1.8, 0.5, 1.2], [-1.6, 0.5, -1.4],
        ];
        spherePositions.forEach((pos, i) => {
            const sphere = new THREE.Mesh(sphereGeo, new THREE.MeshStandardMaterial({
                color: i % 2 === 0 ? 0xC9A96E : 0xE8A84C,
                metalness: 0.6,
                roughness: 0.3,
                emissive: i % 2 === 0 ? 0x2a1f0a : 0x2a1800,
                emissiveIntensity: 0.3,
            }));
            sphere.position.set(pos[0], pos[1], pos[2]);
            mainGroup.add(sphere);
            objectsRef.current.push({ mesh: sphere, phase: i * 1.1, baseY: pos[1] });
        });

        // Subtle floating particles
        const particleGeo = new THREE.BufferGeometry();
        const particleCount = 60;
        const posArray = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 12;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({
            size: 0.03, color: 0xC9A96E, transparent: true, opacity: 0.6
        }));
        scene.add(particles);

        // 4. GSAP Camera Dolly + Fade-Out
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
            onUpdate: (self) => {
                const progress = self.progress;
                
                // Circular/Helix motion towards down
                const angle = progress * Math.PI * 1.5; // 3/4 turn for a smooth cinematic feel
                const radius = 6 - (progress * 5); // move deeper into the scene (6 to 1)
                
                camera.current.position.x = Math.sin(angle) * radius;
                camera.current.position.z = Math.cos(angle) * radius;
                camera.current.position.y = 0.5 - (progress * 2); // move vertically down
                camera.current.lookAt(0, 0, 0);

                // Scale text to simulate going deeper through it
                const scale = 1 + (progress * 3);

                // Fade out all fixed elements smoothly over last 40%
                const fadeProgress = Math.max(0, (progress - 0.6) / 0.4);
                if (containerRef.current) containerRef.current.style.opacity = 1 - fadeProgress;
                if (textRef.current) {
                    textRef.current.style.opacity = 1 - fadeProgress;
                    textRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
                }
                if (scrollIndicatorRef.current) scrollIndicatorRef.current.style.opacity = (1 - fadeProgress) * 0.5;
            },
            onLeave: () => {
                if (containerRef.current) containerRef.current.style.visibility = 'hidden';
                if (textRef.current) textRef.current.style.visibility = 'hidden';
                if (scrollIndicatorRef.current) scrollIndicatorRef.current.style.visibility = 'hidden';
            },
            onEnterBack: () => {
                if (containerRef.current) containerRef.current.style.visibility = 'visible';
                if (textRef.current) textRef.current.style.visibility = 'visible';
                if (scrollIndicatorRef.current) scrollIndicatorRef.current.style.visibility = 'visible';
            }
        });

        // Initial camera
        camera.current.position.set(0, 0.5, 6);
        camera.current.lookAt(0, 0, 0);

        const animate = () => {
            frameId.current = requestAnimationFrame(animate);
            if (!isVisibleRef.current) return;

            const time = Date.now() * 0.001;

            // Gentle rotation of the entire architectural group
            mainGroup.rotation.y += 0.0015;

            // Ring orbital animation
            ring1.rotation.z = Math.sin(time * 0.3) * 0.15;
            ring2.rotation.z = 0.3 + Math.cos(time * 0.25) * 0.1;

            // Small spheres gently float
            objectsRef.current.forEach(({ mesh, phase, baseY }) => {
                mesh.position.y = baseY + Math.sin(time * 0.8 + phase) * 0.08;
            });

            particles.rotation.y += 0.0003;

            if (renderer.current) {
                renderer.current.render(scene, camera.current);
            }
        };
        animate();

    }, [scene]);

    return (
        <section id="home" ref={sectionRef} style={{ height: '300vh', position: 'relative', background: '#080808' }}>
            <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
                <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />

                <div ref={textRef} style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    textAlign: 'center', zIndex: 10, pointerEvents: 'none', width: '100%'
                }}>
                    <span className="section-label">LUMINAE STUDIO</span>
                    <h1 className="hero-headline" style={{ fontSize: '10vw', color: '#E8A84C', margin: 0 }}>
                        Where Light <br /> Defines Space
                    </h1>
                    <p className="hero-sub" style={{ marginTop: '2rem', marginBottom: '3rem', opacity: 0.8 }}>Architectural Lighting & Spatial Design</p>
                    
                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', pointerEvents: 'auto' }}>
                        <a href="#portfolio" className="btn-outline" style={{ borderColor: '#E8A84C', color: '#E8A84C', padding: '0.8rem 2rem', fontSize: '12px' }}>
                            View Portfolio
                        </a>
                        <a href="#contact" className="btn-outline" style={{ background: '#E8A84C', color: '#080808', padding: '0.8rem 2rem', fontSize: '12px' }}>
                            Book Consultation
                        </a>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div ref={scrollIndicatorRef} style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, opacity: 0.5 }}>
                    <div className="mouse-wheel" />
                    <p className="mono" style={{ fontSize: '10px', marginTop: '10px' }}>SCROLL TO ENTER</p>
                </div>
            </div>
        </section>
    );
};

export default Hero;

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDirectThree } from '../../hooks/useDirectThree';

const Prism = () => {
    const { containerRef, scene, camera, renderer, frameId, isVisibleRef } = useDirectThree();
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const shardsRef = useRef([]);

    useEffect(() => {
        if (!scene || !camera.current) return;

        // Moody atmospheric lighting
        const ambient = new THREE.AmbientLight(0x0a0a0f, 0.4);
        scene.add(ambient);

        const pointLight1 = new THREE.PointLight(0xC9A96E, 10, 30);
        pointLight1.position.set(0, 5, 0);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x4c88e8, 5, 30);
        pointLight2.position.set(-5, -5, -5);
        scene.add(pointLight2);

        // Geometric shards (Octahedrons)
        const shardGeo = new THREE.OctahedronGeometry(1.5);
        const shardMat = new THREE.MeshPhysicalMaterial({
            color: 0xC9A96E,
            emissive: 0x3a2a0a,
            emissiveIntensity: 0.8,
            metalness: 0.9,
            roughness: 0.1,
            transmission: 0.9,
            thickness: 0.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.2,
            side: THREE.DoubleSide
        });

        // Add 20 shards in a deep space
        for (let i = 0; i < 20; i++) {
            const shard = new THREE.Mesh(shardGeo, shardMat);
            shard.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 1.0) * 40 // Deep along Z
            );
            shard.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            // Glowing core edges
            const edges = new THREE.EdgesGeometry(shardGeo);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
                color: 0xffd700,
                transparent: true,
                opacity: 0.8
            }));
            shard.add(line);

            scene.add(shard);
            shardsRef.current.push(shard);
        }

        // Camera starts at 10 and moves deep in
        camera.current.position.set(0, 0, 10);
        camera.current.lookAt(0, 0, -20);

        // GSAP "Warp" Scroll Animation (Z-axis dolly)
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
            onUpdate: (self) => {
                const progress = self.progress;
                camera.current.position.z = 10 - (progress * 50); // dolly deep into shards
                
                // Slight tilt
                camera.current.rotation.z = progress * 0.5;

                if (textRef.current) {
                    textRef.current.style.opacity = Math.sin(progress * Math.PI);
                    textRef.current.style.transform = `translate(-50%, -50%) scale(${0.8 + progress})`;
                }
            }
        });

        // 3D Fade-in Transition from the previous section
        if (containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, filter: 'blur(10px)', transform: 'scale(1.2)' },
                {
                    opacity: 1, filter: 'blur(0px)', transform: 'scale(1)',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        end: "top top",
                        scrub: 1.5
                    }
                }
            );
        }

        const animate = () => {
            frameId.current = requestAnimationFrame(animate);
            if (!isVisibleRef.current) return;
            
            const time = Date.now() * 0.001;
            shardsRef.current.forEach((shard, i) => {
                shard.rotation.x += 0.002;
                shard.rotation.y += 0.003;
                shard.position.z += Math.sin(time + i) * 0.005; // very slow drift
            });

            if (renderer.current) {
                renderer.current.render(scene, camera.current);
            }
        };
        animate();

    }, [scene]);

    return (
        <section id="prism" ref={sectionRef} style={{ height: '300vh', position: 'relative', background: '#020202' }}>
            <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
                <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
                
                <div ref={textRef} style={{ 
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    textAlign: 'center', zIndex: 10, pointerEvents: 'none', width: '100%', opacity: 0
                }}>
                    <span className="section-label" style={{ color: '#fff', letterSpacing: '4px', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>MATERIALITY</span>
                    <h2 className="hero-headline" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', color: '#C9A96E', margin: '1rem 0' }}>
                        Textural Depth
                    </h2>
                    <p style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        color: '#ddd',
                        fontSize: 'clamp(0.85rem, 1vw, 1rem)',
                        lineHeight: 1.6,
                        fontFamily: "'Satoshi', sans-serif"
                    }}>
                        Materiality is the foundation of our design philosophy. By carefully selecting premium finishes and refined geometric forms, we craft tangible, enduring experiences that invite exploration.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Prism;

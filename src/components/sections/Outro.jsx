import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDirectThree } from '../../hooks/useDirectThree';

const Outro = () => {
    const { containerRef, scene, camera, renderer, frameId, isVisibleRef } = useDirectThree();
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const furnitureRef = useRef([]);

    useEffect(() => {
        if (!scene || !camera.current) return;

        // Cinematic Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambient);

        const spot1 = new THREE.SpotLight(0xC9A96E, 15);
        spot1.position.set(2, 5, 2);
        spot1.angle = 0.5;
        spot1.penumbra = 1;
        scene.add(spot1);

        const warmLight = new THREE.PointLight(0xE8A84C, 5);
        warmLight.position.set(-3, 2, -2);
        scene.add(warmLight);

        // Reflective Floor
        const gridHelper = new THREE.GridHelper(40, 40, 0xC9A96E, 0x333333);
        gridHelper.position.y = -2;
        scene.add(gridHelper);

        const floorGeo = new THREE.PlaneGeometry(100, 100);
        const floorMat = new THREE.MeshStandardMaterial({ 
            color: 0x050505, 
            roughness: 0.2, 
            metalness: 0.9 
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -2.01;
        scene.add(floor);

        // Architecture / Objects
        const geometries = [
            new THREE.CylinderGeometry(0.5, 0.5, 4, 32),
            new THREE.BoxGeometry(2, 2, 2),
            new THREE.OctahedronGeometry(1)
        ];

        for (let i = 0; i < 8; i++) {
            const mesh = new THREE.Mesh(
                geometries[i % 3], 
                new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.1, emissive: 0x111111 })
            );
            mesh.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random()) * 4 - 1,
                (Math.random() - 0.5) * 15 - 5
            );
            
            // Add golden wireframe outlines
            const edges = new THREE.EdgesGeometry( geometries[i % 3] );
            const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xC9A96E, linewidth: 2 } ) );
            mesh.add( line );
            
            scene.add(mesh);
            furnitureRef.current.push(mesh);
        }

        // GSAP Camera Dolly (Reversed) -> Camera pulls out
        // We rely on position: sticky, so trigger is the section itself
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                // Move camera backwards and up as user scrolls down
                camera.current.position.z = 1 + (progress * 15); // Pull back
                camera.current.position.y = progress * 5; // Move up slightly
                
                // Add a slight rotation to look around while pulling back
                camera.current.position.x = Math.sin(progress * Math.PI) * 4;
                camera.current.lookAt(0, 0, 0);

                // Fade in text as you pull out
                if (textRef.current) textRef.current.style.opacity = progress;
            }
        });

        // Initial setup
        camera.current.position.z = 1;
        camera.current.position.y = 0;
        camera.current.lookAt(0, 0, 0);

        const animate = () => {
            frameId.current = requestAnimationFrame(animate);
            if (!isVisibleRef.current) return;
            
            furnitureRef.current.forEach((mesh, i) => {
                mesh.rotation.y += 0.002;
                if (i % 2 === 0) {
                   mesh.rotation.x += 0.001; 
                }
            });

            if (renderer.current) {
                renderer.current.render(scene, camera.current);
            }
        };
        animate();

    }, [scene]);

    return (
        <section id="outro" ref={sectionRef} style={{ height: '300vh', position: 'relative', background: '#050505' }}>
            <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
                <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
                
                <div ref={textRef} style={{ 
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    textAlign: 'center', zIndex: 10, pointerEvents: 'none', width: '100%', opacity: 0
                }}>
                    <span className="section-label">THE VISION</span>
                    <h2 className="hero-headline" style={{ fontSize: '8vw', color: '#E8A84C', margin: 0, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                        See the Bigger Picture
                    </h2>
                    <p className="hero-sub" style={{ marginTop: '2rem', opacity: 0.8, color: '#fff' }}>Step back and admire the masterplan.</p>
                </div>
            </div>
        </section>
    );
};

export default Outro;

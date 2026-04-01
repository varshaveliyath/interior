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
    const furnitureRef = useRef([]);

    useEffect(() => {
        if (!scene || !camera.current) return;

        // 1. Cinematic Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambient);

        const spot1 = new THREE.SpotLight(0xC9A96E, 10);
        spot1.position.set(5, 10, 5);
        spot1.angle = 0.3;
        spot1.penumbra = 1;
        scene.add(spot1);

        const blueLight = new THREE.PointLight(0x4c88e8, 5);
        blueLight.position.set(-5, 2, 2);
        scene.add(blueLight);

        // 2. Reflective Floor (Metallic Grid)
        const gridHelper = new THREE.GridHelper(20, 20, 0xC9A96E, 0x333333);
        gridHelper.position.y = -2;
        scene.add(gridHelper);

        const floorGeo = new THREE.PlaneGeometry(50, 50);
        const floorMat = new THREE.MeshStandardMaterial({ 
            color: 0x07070A, 
            roughness: 0.1, 
            metalness: 0.8 
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -2.01;
        scene.add(floor);

        // 3. Furniture Primitives (Cinematic placeholders)
        const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.6, 32, 32),
            new THREE.TorusGeometry(0.5, 0.2, 16, 100)
        ];

        for (let i = 0; i < 5; i++) {
            const mesh = new THREE.Mesh(
                geometries[i % 3], 
                new THREE.MeshStandardMaterial({ color: 0xE8A84C, metalness: 0.5, roughness: 0.2 })
            );
            mesh.position.set(
                (Math.random() - 0.5) * 10,
                Math.random() * 5,
                (Math.random() - 0.5) * 5
            );
            scene.add(mesh);
            furnitureRef.current.push(mesh);
        }

        // 4. GSAP Camera Dolly + Fade-Out of Fixed Elements
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                camera.current.position.z = 5 - (progress * 3);
                camera.current.position.y = progress * 2;
                camera.current.lookAt(0, 0, 0);

                // Fade out all fixed elements as we scroll past ~60%
                const fadeProgress = Math.max(0, (progress - 0.5) / 0.5); // 0→1 over last 50%
                if (containerRef.current) containerRef.current.style.opacity = 1 - fadeProgress;
                if (textRef.current) textRef.current.style.opacity = 1 - fadeProgress;
                if (scrollIndicatorRef.current) scrollIndicatorRef.current.style.opacity = (1 - fadeProgress) * 0.5;
            },
            onLeave: () => {
                // Fully hide when scrolled past
                if (containerRef.current) containerRef.current.style.visibility = 'hidden';
                if (textRef.current) textRef.current.style.visibility = 'hidden';
                if (scrollIndicatorRef.current) scrollIndicatorRef.current.style.visibility = 'hidden';
            },
            onEnterBack: () => {
                // Re-show when scrolling back up
                if (containerRef.current) containerRef.current.style.visibility = 'visible';
                if (textRef.current) textRef.current.style.visibility = 'visible';
                if (scrollIndicatorRef.current) scrollIndicatorRef.current.style.visibility = 'visible';
            }
        });

        const animate = () => {
            frameId.current = requestAnimationFrame(animate);
            if (!isVisibleRef.current) return;
            
            furnitureRef.current.forEach((mesh, i) => {
                mesh.rotation.x += 0.005;
                mesh.rotation.y += 0.005;
                mesh.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
            });

            if (renderer.current) {
                renderer.current.render(scene, camera.current);
            }
        };
        animate();

    }, [scene]);

    return (
        <section id="studio" ref={sectionRef} style={{ height: '300vh', position: 'relative', background: '#080808' }}>
            <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 1 }} />
            
            <div ref={textRef} style={{ 
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                textAlign: 'center', zIndex: 10, pointerEvents: 'none', width: '100%'
            }}>
                <span className="section-label">LUMINAE STUDIO</span>
                <h1 className="hero-headline" style={{ fontSize: '10vw', color: '#E8A84C', margin: 0 }}>
                    Where Light <br/> Defines Space
                </h1>
                <p className="hero-sub" style={{ marginTop: '2rem', opacity: 0.8 }}>Cinematic 3D Interior Design</p>
            </div>
            
            {/* Scroll Indicator */}
            <div ref={scrollIndicatorRef} style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, opacity: 0.5 }}>
                <div className="mouse-wheel" />
                <p className="mono" style={{ fontSize: '10px', marginTop: '10px' }}>SCROLL TO ENTER</p>
            </div>
        </section>
    );
};

export default Hero;

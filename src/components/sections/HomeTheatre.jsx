import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TheatreScene from '../3d/TheatreScene';

const HomeTheatre = () => {
    const sectionRef = useRef(null);
    const scrollProgress = useRef(0);

    useEffect(() => {
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
                scrollProgress.current = self.progress;
            }
        });
    }, []);

    return (
        <section id="theatre" ref={sectionRef} style={{ height: '300vh', position: 'relative' }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
                <div className="scanlines" />
                <Canvas camera={{ position: [0, 1, 12], fov: 50 }}>
                    <TheatreScene scrollProgress={scrollProgress} />
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.2} intensity={0.8} radius={0.5} />
                    </EffectComposer>
                </Canvas>
            </div>
        </section>
    );
};

export default HomeTheatre;

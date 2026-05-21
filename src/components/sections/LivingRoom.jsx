import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LivingRoom = () => {
    const sectionRef = useRef(null);
    const parallaxRef = useRef(null);
    const imageRef = useRef(null);

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
                        scrub: 1.5,
                    }
                }
            );
        });

        // Image parallax
        if (imageRef.current) {
            gsap.fromTo(imageRef.current,
                { y: 100, opacity: 0 },
                {
                    y: -20, opacity: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        end: 'bottom center',
                        scrub: 1.5,
                    }
                }
            );
        }

        // Section headline reveal
        gsap.fromTo(sectionRef.current.querySelector('.section-headline'),
            { y: 80, opacity: 0 },
            {
                y: 0, opacity: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    end: 'top 30%',
                    scrub: 1.5,
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
            {/* Ambient Fog Gradient */}
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

                {/* Content Grid: Parallax Text + Image */}
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
                                Every space has a story waiting to be told. At Luminae, 
                                we don't just arrange furniture — we choreograph light, 
                                texture, and form to create environments that resonate 
                                with the people who inhabit them.
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

                    {/* Right: Portfolio Image (Office) */}
                    <div style={{ width: '100%', height: 'clamp(300px, 50vh, 550px)', overflow: 'hidden', borderRadius: '8px' }}>
                        <img 
                            ref={imageRef}
                            src="/process-materials.png" 
                            alt="Design Materials"
                            style={{
                                width: '100%',
                                height: '120%', // Extra height for parallax
                                objectFit: 'cover',
                                filter: 'brightness(0.85) contrast(1.1)'
                            }} 
                        />
                    </div>
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

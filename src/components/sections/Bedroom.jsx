import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Bedroom = () => {
    const sectionRef = useRef(null);
    const textLayer1Ref = useRef(null);
    const textLayer2Ref = useRef(null);
    const textLayer3Ref = useRef(null);
    const contentRef = useRef(null);
    const imageRef = useRef(null);

    // GSAP Typography Parallax
    useEffect(() => {
        if (!sectionRef.current) return;

        // Big background text layers moving at different speeds
        gsap.to(textLayer1Ref.current, {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            }
        });

        gsap.to(textLayer2Ref.current, {
            yPercent: -100,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            }
        });

        gsap.to(textLayer3Ref.current, {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
            }
        });

        // Content fade in
        gsap.fromTo(contentRef.current, 
            { opacity: 0, y: 100 },
            { 
                opacity: 1, 
                y: 0,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top center",
                    end: "center center",
                    scrub: 1.5
                }
            }
        );

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
    }, []);

    return (
        <section id="bedroom" ref={sectionRef} style={{ 
            position: 'relative', 
            height: '150vh', // Extra height for parallax scrolling
            background: '#040406', // Darker to contrast living room
            zIndex: 1
        }}>
            <div style={{
                position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '100px 0'
            }}>
                {/* Massive Parallax Typography Backgrounds */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <h1 ref={textLayer1Ref} style={{
                    position: 'absolute', top: '10%', left: '-5%',
                    fontSize: 'clamp(10rem, 25vw, 30rem)',
                    fontFamily: "'Cormorant Garamond', serif",
                    color: 'rgba(201, 169, 110, 0.03)', // Barely visible gold
                    whiteSpace: 'nowrap',
                    margin: 0,
                    lineHeight: 0.8,
                    zIndex: 0
                }}>SANCTUARY</h1>

                <h1 ref={textLayer2Ref} style={{
                    position: 'absolute', top: '50%', right: '-10%',
                    fontSize: 'clamp(8rem, 20vw, 25rem)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    color: 'rgba(255, 255, 255, 0.02)',
                    whiteSpace: 'nowrap',
                    margin: 0,
                    lineHeight: 0.8,
                    zIndex: 2
                }}>TRANQUILITY</h1>

                <h1 ref={textLayer3Ref} style={{
                    position: 'absolute', top: '80%', left: '5%',
                    fontSize: 'clamp(6rem, 15vw, 20rem)',
                    fontFamily: "'Satoshi', sans-serif",
                    fontWeight: 500,
                    color: 'rgba(76, 136, 232, 0.02)', // Tint of blue
                    whiteSpace: 'nowrap',
                    margin: 0,
                    lineHeight: 0.8,
                    letterSpacing: '-0.05em',
                    zIndex: 1
                }}>RITUAL</h1>
            </div>

            {/* Foreground Content */}
            <div ref={contentRef} style={{ 
                position: 'relative', 
                zIndex: 10, 
                maxWidth: '1200px', 
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4rem',
                padding: '0 5vw',
                alignItems: 'center'
            }}>
                <div>
                    <span className="section-label" style={{ display: 'block', marginBottom: '2rem' }}>02 / THE RETREAT</span>
                    <h2 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        fontFamily: "'Cormorant Garamond', serif",
                        color: '#F5F0E8',
                        margin: '0 0 2rem 0',
                        lineHeight: 1.1
                    }}>
                        Where Rest<br/>
                        <span style={{ fontStyle: 'italic', color: '#999' }}>Becomes Ritual</span>
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        lineHeight: 1.8,
                        color: '#888',
                        fontFamily: "'Satoshi', sans-serif",
                        maxWidth: '500px'
                    }}>
                        A personal space should be more than a room — it should be a ritual. 
                        We sculpt sanctuaries where the weight of the world dissolves, 
                        where every material whispers calm, and every light source 
                        understands the art of dimming.
                    </p>
                </div>

                {/* Portfolio Image (Bathroom/Retreat) */}
                <div style={{ width: '100%', height: 'clamp(300px, 50vh, 600px)', overflow: 'hidden', borderRadius: '8px' }}>
                    <img 
                        ref={imageRef}
                        src="/portfolio-bathroom.png" 
                        alt="The Gilded Bath"
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
        </section>
    );
};

export default Bedroom;

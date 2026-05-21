import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Showcase = () => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        // Image Parallax Scale
        gsap.fromTo(imageRef.current,
            { scale: 1, y: 0 },
            {
                scale: 1.15,
                y: 50,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5,
                }
            }
        );

        // Text reveal and fade
        gsap.fromTo(textRef.current,
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top center",
                    end: "center center",
                    scrub: 1.5,
                }
            }
        );
        
        // Text fade out on leave
        gsap.to(textRef.current, {
            opacity: 0,
            scale: 1.1,
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "center top",
                end: "bottom top",
                scrub: 1.5,
            }
        });

    }, []);

    return (
        <section id="showcase" ref={sectionRef} style={{ height: '150vh', position: 'relative', background: '#0a0a0a', overflow: 'hidden' }}>
            <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
                
                {/* Background Image */}
                <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '110%', height: '120%', zIndex: 1 }}>
                    <img 
                        ref={imageRef}
                        src="/portfolio-dining.png" 
                        alt="The Amber Table"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.6) contrast(1.2)'
                        }} 
                    />
                    {/* Dark overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.8), rgba(10,10,10,0.3) 50%, rgba(10,10,10,0.9))' }} />
                </div>
                
                <div ref={textRef} style={{ 
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    textAlign: 'center', zIndex: 10, pointerEvents: 'none', width: '100%', opacity: 0
                }}>
                    <span className="section-label" style={{ color: '#fff', letterSpacing: '4px', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>SPATIAL DYNAMICS</span>
                    <h2 className="hero-headline" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', color: '#E8A84C', margin: '1rem 0', WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                        Curated Forms
                    </h2>
                </div>
            </div>
        </section>
    );
};

export default Showcase;

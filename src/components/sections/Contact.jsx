import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Contact = () => {
    const vantaRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        let vantaEffect = null;
        if (window.VANTA) {
            vantaEffect = window.VANTA.FOG({
                el: vantaRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                highlightColor: 0xe8a84c,
                midtoneColor: 0x0a0705,
                lowlightColor: 0x070507,
                baseColor: 0x07070a,
                blurFactor: 0.9,
                zoom: 1.2
            });
        }

        // De-blur entry
        gsap.to(".contact-content", {
            filter: "blur(0px)",
            opacity: 1,
            scrollTrigger: {
                trigger: scrollRef.current,
                start: "top 80%",
                end: "top 20%",
                scrub: true
            }
        });

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, []);

    return (
        <section id="contact" ref={scrollRef} style={{ height: '150vh', position: 'relative' }}>
            <div ref={vantaRef} style={{ position: 'absolute', inset: 0, zIndex: -1 }} />
            
            <div className="contact-content" style={{ 
                padding: '15vh 10vw', opacity: 0, filter: 'blur(16px)',
                transition: 'filter 0.1s ease-out' 
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <span className="section-label">03 / CONTACT</span>
                    <h2 className="hero-headline" style={{ fontSize: '7vw', lineHeight: 1 }}>
                        Let's build <br/> your light.
                    </h2>

                    <form style={{ marginTop: '5rem' }}>
                        <input type="text" className="contact-input" placeholder="Name" />
                        <input type="email" className="contact-input" placeholder="Email" />
                        <textarea className="contact-input" placeholder="Message" rows="4" style={{ resize: 'none' }} />
                        <button type="submit" className="btn-outline" style={{ marginTop: '3rem', width: 'fit-content' }}>
                            Send Message
                        </button>
                    </form>
                </div>

                <footer style={{ marginTop: '10rem', borderTop: '1px solid rgba(201,169,110,0.1)', paddingTop: '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.5, fontSize: '10px' }} className="mono">
                        <span>INSTAGRAM / BEHANCE</span>
                        <span>&copy; 2026 LUMINAE STUDIO</span>
                        <span>DESIGNED BY ANTIGRAVITY</span>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export default Contact;

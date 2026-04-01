import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ScrollProgressBar = () => {
    const barRef = useRef(null);

    useEffect(() => {
        gsap.to(barRef.current, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3
            }
        });
    }, []);

    return <div ref={barRef} className="scroll-bar" />;
};

export default ScrollProgressBar;

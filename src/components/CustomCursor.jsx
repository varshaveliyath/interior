import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const xTo = gsap.quickTo(ringRef.current, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(ringRef.current, "y", { duration: 0.5, ease: "power3" });

    const handleMouseMove = (e) => {
        gsap.set(dotRef.current, { x: e.clientX, y: e.clientY });
        xTo(e.clientX);
        yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Hover effects
    const handleMouseEnter = () => {
        gsap.to(ringRef.current, { scale: 1.5, borderColor: '#fff' });
    };
    const handleMouseLeave = () => {
        gsap.to(ringRef.current, { scale: 1, borderColor: '#E8A84C' });
    };

    const hoverables = document.querySelectorAll('a, button, .hover-target');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
        window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

export default CustomCursor;

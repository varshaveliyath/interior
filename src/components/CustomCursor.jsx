import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const [cursorState, setCursorState] = useState('default'); 

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

        // Hide initially until mouse moves to avoid flash at 0,0
        gsap.set(cursor, { opacity: 0 });

        const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

        const onMouseMove = (e) => {
            // Fade in on first movement
            gsap.to(cursor, { opacity: 1, duration: 0.2, overwrite: "auto" });

            // Adjust position so the cursor center matches the pointer
            xTo(e.clientX);
            yTo(e.clientY);

            const target = e.target;
            const isClickable = target.closest('a, button, .btn-outline, .contact-btn, .nav-link, .nav-logo');
            const isPortfolio = target.closest('.portfolio-card');

            if (isPortfolio) {
                setCursorState('view');
            } else if (isClickable) {
                setCursorState('pointer');
            } else {
                setCursorState('default');
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    let width = 30;
    let height = 30;
    let bg = 'transparent';
    let text = '';
    let border = '1px solid rgba(201, 169, 110, 0.4)';
    let mixBlendMode = 'normal';

    if (cursorState === 'pointer') {
        width = 50;
        height = 50;
        bg = 'rgba(201, 169, 110, 0.05)';
        border = '1px solid rgba(201, 169, 110, 0.8)';
    } else if (cursorState === 'view') {
        width = 80;
        height = 80;
        bg = 'rgba(201, 169, 110, 0.9)';
        border = 'none';
        text = 'VIEW';
    }

    return (
        <div 
            ref={cursorRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: bg,
                border: border,
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 99999,
                transform: `translate(-50%, -50%)`, // Centered on cursor
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s, border 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mixBlendMode: mixBlendMode,
            }}
        >
            {text && (
                <span className="mono" style={{ color: '#000', fontSize: '13px', letterSpacing: '1px', mixBlendMode: 'normal' }}>
                    {text}
                </span>
            )}
        </div>
    );
};

export default CustomCursor;

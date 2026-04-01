import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const Preloader = ({ onComplete }) => {
  const [show, setShow] = useState(true);
  const studioName = "LUMINAE";

  useEffect(() => {
    const timer = setTimeout(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                setShow(false);
                onComplete();
            }
        });

        tl.to(".loader-panel-top", { y: '-101%', duration: 1.2, ease: "expo.inOut" }, 0)
          .to(".loader-panel-bottom", { y: '101%', duration: 1.2, ease: "expo.inOut" }, 0)
          .to("#loader-content", { opacity: 0, duration: 0.5 }, 0);

    }, 3800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div id="loader" style={{ position: 'fixed', inset: 0, zIndex: 10002 }}>
      <div className="loader-panel-top" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: '#07070A' }} />
      <div className="loader-panel-bottom" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: '#07070A' }} />

      <div id="loader-content" style={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
          zIndex: 10003, textAlign: 'center' 
      }}>
        <svg width="100" height="150" viewBox="0 0 100 150">
          <motion.path
            d="M20,140 L20,135 Q20,20 80,20"
            fill="none"
            stroke="#E8A84C"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
          <motion.circle
            cx="80" cy="20" r="6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
                opacity: 1, scale: 1,
                boxShadow: ["0 0 0px #E8A84C", "0 0 40px #E8A84C", "0 0 10px #E8A84C"] 
            }}
            transition={{ 
                delay: 1.6, duration: 0.8,
                boxShadow: { repeat: Infinity, duration: 2 }
            }}
            style={{ fill: '#E8A84C' }}
          />
        </svg>

        <div className="loader-text" style={{ 
            marginTop: '2rem', display: 'flex', gap: '0.5rem', 
            fontFamily: 'var(--font-display)', fontSize: '2.5rem', letterSpacing: '0.5rem' 
        }}>
          {studioName.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.08, duration: 0.8, ease: "easeOut" }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preloader;

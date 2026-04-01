import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const headline = "Designing Darkness Into Home";

  return (
    <section id="hero">
      <motion.div 
        className="hero-bg"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 3, ease: "easeOut" }}
        style={{ y }}
      />
      
      <motion.div className="hero-content" style={{ opacity }}>
        <h1 className="headline">
          {headline.split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ 
                x: (Math.random() - 0.5) * 200, 
                y: (Math.random() - 0.5) * 200, 
                opacity: 0,
                rotate: (Math.random() - 0.5) * 30
              }}
              animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              transition={{ 
                delay: 0.5 + i * 0.1, 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1] 
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        
        <div className="tagline-container">
          <motion.span 
            className="tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            Where Light Defines Space
          </motion.span>
          <motion.div 
            className="tagline-line"
            initial={{ width: 0 }}
            animate={{ width: '60vw' }}
            transition={{ delay: 1.8, duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <div className="indicator-line">
          <motion.div 
            className="indicator-dot"
            animate={{ y: [0, 50, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.2rem', marginTop: '1rem', opacity: 0.6 }}>EXPLORE</span>
      </motion.div>
    </section>
  );
};

export default Hero;

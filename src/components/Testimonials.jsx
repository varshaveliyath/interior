import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    quote: "Luminae Studio doesn't just design rooms; they design experiences of light.",
    author: "Elena Rossi, Art Collector"
  },
  {
    quote: "The way they balance darkness and warmth has transformed how we live at night.",
    author: "Marcus Thorne, Meridian Owner"
  },
  {
    quote: "Every detail feels intentional. A masterclass in modern luxury lighting.",
    author: "Sophie Chen, Architect"
  }
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials">
      <div className="section-wipe" />
      <div className="carousel-container">
        <AnimatePresence mode="popLayout">
          {testimonials.map((t, i) => {
            const isActive = i === index;
            const isPrev = i === (index - 1 + testimonials.length) % testimonials.length;
            const isNext = i === (index + 1) % testimonials.length;

            if (!isActive && !isPrev && !isNext) return null;

            let x = 0;
            let z = 0;
            let rotateY = 0;
            let opacity = 0;
            let scale = 0.8;

            if (isActive) {
              x = 0; z = 0; rotateY = 0; opacity = 1; scale = 1;
            } else if (isPrev) {
              x = -400; z = -300; rotateY = 45; opacity = 0.3;
            } else if (isNext) {
              x = 400; z = -300; rotateY = -45; opacity = 0.3;
            }

            return (
              <motion.div
                key={i}
                className={`testimonial-card ${isActive ? 'active' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  x, z, rotateY, opacity, scale,
                  display: 'block'
                }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                style={{ 
                  position: 'absolute',
                  transformStyle: 'preserve-3d'
                }}
              >
                <p className="quote">"{t.quote}"</p>
                <p className="author">— {t.author}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Testimonials;

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const RoomAwakens = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const spotlightSize = useTransform(scrollYProgress, [0, 0.4, 0.7], ["10%", "40%", "70%"]);
  const spotlightOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 0.7]);
  const furnitureX = useTransform(scrollYProgress, [0.3, 0.6], [-100, 0]);
  const furnitureY = useTransform(scrollYProgress, [0.5, 0.8], [100, 0]);
  const furnitureOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7, 0.8], [0, 1, 1, 1]);
  const titleClip = useTransform(scrollYProgress, [0.6, 0.85], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const subtitleOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);

  return (
    <section id="room-awakens" ref={containerRef}>
      <motion.div className="section-wipe" style={{ scaleX: scrollYProgress }} />
      <div className="room-container">
        <div className="room-layers">
          <motion.div 
            className="layer-bg"
            style={{ 
              filter: useTransform(scrollYProgress, [0, 0.7], ["brightness(0.2)", "brightness(0.6)"])
            }}
          />
          
          <motion.div 
            className="lamp-light"
            style={{ 
              background: useTransform(
                scrollYProgress,
                [0, 0.4, 0.7],
                [
                  "radial-gradient(circle at 30% 70%, rgba(232,168,76,0) 0%, transparent 10%)",
                  "radial-gradient(circle at 30% 70%, rgba(232,168,76,0.6) 0%, transparent 40%)",
                  "radial-gradient(circle at 30% 70%, rgba(232,168,76,0.7) 0%, transparent 70%)"
                ]
              ),
            }}
          />

          <motion.img 
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
            className="furniture armchair"
            style={{ x: furnitureX, opacity: furnitureOpacity }}
            alt="Armchair"
          />
          
          <motion.img 
            src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"
            className="furniture sofa"
            style={{ y: furnitureY, opacity: useTransform(scrollYProgress, [0.5, 0.7], [0, 1]) }}
            alt="Sofa"
          />

          <div className="room-text">
            <motion.h2 className="room-title" style={{ clipPath: titleClip }}>
              The Meridian Residence
            </motion.h2>
            <motion.p className="room-subtitle" style={{ opacity: subtitleOpacity }}>
              Crafted for the Senses
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomAwakens;

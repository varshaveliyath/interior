import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

const StatItem = ({ val, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayVal, setDisplayVal] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(val);
      const duration = 2000;
      const step = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setDisplayVal(end);
          clearInterval(timer);
        } else {
          setDisplayVal(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, val]);

  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-val">{displayVal}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const FeaturedProject = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const detailY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  return (
    <section id="featured" ref={sectionRef}>
      <motion.div className="section-wipe" style={{ scaleX: scrollYProgress }} />
      <div className="parallax-stack">
        <motion.div className="stack-layer layer-bg-img" style={{ y: bgY }} />
        <div className="stack-layer layer-glow" />
        <motion.div className="stack-layer" style={{ y: detailY }}>
          <div className="layer-detail-img" />
        </motion.div>
        <motion.div className="stack-layer" style={{ y: textY }}>
          <h2 className="layer-text-title">THE MERIDIAN</h2>
        </motion.div>
        
        <div className="stack-layer" style={{ alignItems: 'flex-end', paddingBottom: '10%' }}>
          <div className="layer-stats" style={{ position: 'relative', bottom: 'auto', left: 'auto' }}>
            <StatItem val="2024" label="Year" />
            <StatItem val="4500" label="Sq Ft" />
            <StatItem val="12" label="Months" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;

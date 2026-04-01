import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const services = [
  {
    num: "01",
    title: "Spatial Planning",
    desc: "Architectural flow redefined through intuitive volumes and transitions.",
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800"
  },
  {
    num: "02",
    title: "Lighting Design",
    desc: "Sculpting atmosphere using the interplay of shadow and focused amber warmth.",
    img: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800"
  },
  {
    num: "03",
    title: "Material Curation",
    desc: "Tactile luxury selected for timelessness, from rare stones to bespoke leathers.",
    img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800"
  },
  {
    num: "04",
    title: "Turnkey Execution",
    desc: "Complete project stewardship from initial concept to the final candle lit.",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
  }
];

const Services = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section id="services" ref={sectionRef}>
      <motion.div className="section-wipe" style={{ scaleX: scrollYProgress }} />
      <div className="horizontal-wrapper">
        <motion.div className="horizontal-container" style={{ x }}>
          {services.map((service, i) => (
            <motion.div 
              key={i} 
              className="service-card"
              whileHover={{ scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <svg className="card-border-svg">
                <motion.rect 
                  className="card-border-path" 
                  x="0" y="0" width="100%" height="100%"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </svg>
              <span className="service-num">{service.num}</span>
              <div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
              </div>
              <div 
                className="service-img" 
                style={{ backgroundImage: `url(${service.img})` }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;

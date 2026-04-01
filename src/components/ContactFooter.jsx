import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ContactFooter = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.fillStyle = `rgba(232, 168, 76, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = Array.from({ length: 40 }, () => new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section id="contact">
      <div className="section-wipe" />
      <canvas ref={canvasRef} id="particle-canvas" />
      
      <motion.h2 
        className="contact-h2"
      >
        {["Let's Build", "Your Light"].map((line, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.2, duration: 0.8 }}
            style={{ display: 'block' }}
          >
            {line}
          </motion.span>
        ))}
      </motion.h2>

      <motion.form 
        className="contact-form"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <input type="text" className="form-input" placeholder="Name" />
        <input type="email" className="form-input" placeholder="Email" />
        <textarea className="form-input" placeholder="Project Description" rows={4}></textarea>
        <button type="submit" className="btn-submit">Initiate Concept</button>
      </motion.form>

      <footer>
        <div className="footer-logo">LUMINAE STUDIO</div>
        <div className="footer-links">
          <a href="#">INSTAGRAM</a>
          <a href="#">BEHANCE</a>
          <a href="#">LINKEDIN</a>
        </div>
        <div className="copyright">&copy; 2026 LUMINAE STUDIO</div>
      </footer>
    </section>
  );
};

export default ContactFooter;

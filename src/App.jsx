import React, { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import LivingRoom from './components/sections/LivingRoom';

import Prism from './components/sections/Prism';
import Atmosphere from './components/sections/Atmosphere';
import Bedroom from './components/sections/Bedroom';
import Portfolio from './components/sections/Portfolio';
import Process from './components/sections/Process';
import Testimonials from './components/sections/Testimonials';
import Outro from './components/sections/Outro';

import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
      return;
    }

    document.body.style.overflow = '';

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 2,
    });


    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
        lenis.destroy();
        gsap.ticker.remove(lenis.raf);
        document.body.style.overflow = '';
    };
  }, [loading]);

  return (
    <>
      <CustomCursor />
      <Preloader onComplete={() => setLoading(false)} />
      <main>
        <div className="noise-overlay" />
      <Navbar />
      <Hero />
      <LivingRoom />

      <Prism />
      <Atmosphere />
      <Bedroom />
      <Portfolio />
      <Process />
      <Testimonials />
      <Outro />
      <Footer />
    </main>
    </>
  );
}

export default App;

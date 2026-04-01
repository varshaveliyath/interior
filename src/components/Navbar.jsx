import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 80);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        setMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 64,
                behavior: 'smooth'
            });
        }
    };

    const links = ['home', 'about', 'services', 'projects', 'contact'];

    return (
        <>
        <nav className={scrolled ? 'scrolled' : ''} style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '64px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 4vw', zIndex: 1000
        }}>
            <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <svg width="24" height="32" viewBox="0 0 100 150">
                     <path d="M20,140 L20,135 Q20,20 80,20" fill="none" stroke="#C9A96E" strokeWidth="6" />
                     <circle cx="80" cy="20" r="10" fill="#E8A84C" />
                </svg>
                <span className="mono" style={{ fontSize: '13px', color: 'var(--gold)', letterSpacing: '2px' }}>LUMINAE</span>
            </div>

            <div className="nav-links" style={{ display: 'flex', gap: '3rem' }}>
                {links.map((item) => (
                    <a key={item} href={`#${item}`} className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo(item); }}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                    </a>
                ))}
            </div>

            <a href="#contact" className="btn-outline contact-btn" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>
                Book Consultation
            </a>

            {/* Hamburger Button (Mobile Only) */}
            <div className="mobile-menu-btn" 
                 style={{ display: 'none', cursor: 'pointer', flexDirection: 'column', gap: '5px', zIndex: 1001 }}
                 onClick={() => setMenuOpen(!menuOpen)}>
                <div style={{ width: '24px', height: '1px', background: 'var(--gold)', transition: '0.3s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
                <div style={{ width: '24px', height: '1px', background: 'var(--gold)', transition: '0.3s', opacity: menuOpen ? 0 : 1 }} />
                <div style={{ width: '24px', height: '1px', background: 'var(--gold)', transition: '0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
            {menuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: '-100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '-100%' }}
                    transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                    style={{
                        position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 999,
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        gap: '2rem'
                    }}
                >
                    {links.map((item, i) => (
                        <motion.a 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            key={item} 
                            href={`#${item}`} 
                            className="cormorant"
                            style={{ fontSize: '3rem', color: 'var(--cream)', textDecoration: 'none', textTransform: 'uppercase' }}
                            onClick={(e) => { e.preventDefault(); scrollTo(item); }}
                        >
                            {item}
                        </motion.a>
                    ))}
                    <motion.a 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        href="#contact" 
                        className="btn-outline" 
                        style={{ marginTop: '2rem' }}
                        onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}
                    >
                        Book Consultation
                    </motion.a>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};

export default Navbar;

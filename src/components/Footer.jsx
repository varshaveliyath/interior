import React from 'react';

const Footer = () => {
    return (
        <footer id="contact" style={{
            backgroundColor: 'var(--space-black)',
            color: 'var(--cream)',
            padding: '6rem 4vw 2rem',
            position: 'relative',
            zIndex: 10,
            borderTop: '1px solid rgba(201, 169, 110, 0.2)' // gold transparent border
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '4rem',
                marginBottom: '4rem'
            }}>
                {/* Brand Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                        <svg width="24" height="32" viewBox="0 0 100 150">
                            <path d="M20,140 L20,135 Q20,20 80,20" fill="none" stroke="#C9A96E" strokeWidth="6" />
                            <circle cx="80" cy="20" r="10" fill="#E8A84C" />
                        </svg>
                        <span className="mono" style={{ fontSize: '16px', color: 'var(--gold)', letterSpacing: '2px' }}>LUMINAE</span>
                    </div>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '300px' }}>
                        Crafting luminous, architecturally profound spaces that elevate the everyday into the extraordinary.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="mono" style={{ color: 'var(--gold)', letterSpacing: '1px', marginBottom: '1.5rem', fontSize: '1.1rem' }}>LINKS</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['Home', 'About', 'Services', 'Projects'].map(link => (
                            <li key={link}>
                                <a href={`#${link.toLowerCase()}`} style={{ color: 'var(--gray)', textDecoration: 'none', transition: 'color 0.3s ease' }} 
                                   onMouseEnter={(e) => e.target.style.color = 'var(--gold)'}
                                   onMouseLeave={(e) => e.target.style.color = 'var(--gray)'}
                                >{link}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="mono" style={{ color: 'var(--gold)', letterSpacing: '1px', marginBottom: '1.5rem', fontSize: '1.1rem' }}>CONNECT</h4>
                    <address style={{ fontStyle: 'normal', color: 'var(--gray)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p>123 Design Avenue<br />New York, NY 10001</p>
                        <a href="mailto:hello@luminae.studio" style={{ color: 'var(--cream)', textDecoration: 'none' }}>hello@luminae.studio</a>
                        <p>+1 (555) 123-4567</p>
                    </address>
                </div>
            </div>

            <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.8rem',
                color: 'var(--gray)'
            }}>
                <p>&copy; {new Date().getFullYear()} Luminae Design Studio. All rights reserved.</p>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import gsap from 'gsap';

const TheatreScene = ({ scrollProgress }) => {
    const screenRef = useRef();

    useFrame(({ camera, clock }) => {
        const p = scrollProgress.current;
        // Camera Dolly
        camera.position.z = gsap.utils.interpolate(12, 4, p);
        camera.position.y = gsap.utils.interpolate(1, 0, p);
        camera.rotation.x = gsap.utils.interpolate(-0.1, 0, p);

        // Screen Flicker
        if (screenRef.current) {
            const t = clock.getElapsedTime();
            screenRef.current.material.emissiveIntensity = 
                0.4 + Math.sin(t * 60) * 0.01 + Math.sin(t * 17) * 0.008;
        }
    });

    return (
        <group>
            {/* Theatre Walls */}
            <mesh position={[0, 0, -8]}>
                <planeGeometry args={[25, 15]} />
                <meshStandardMaterial color="#050508" roughness={1} />
            </mesh>

            {/* The Screen */}
            <mesh position={[0, 0.5, -7]} ref={screenRef}>
                <planeGeometry args={[10, 6]} />
                <meshStandardMaterial 
                    color="#0a0a1a" 
                    emissive="#1a1a3a" 
                    emissiveIntensity={0.5} 
                    roughness={0.3} 
                />
            </mesh>

            {/* Screen Frame */}
            <mesh position={[0, 0.5, -7.05]}>
                <boxGeometry args={[10.2, 6.2, 0.1]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* Screen Content (Rising Parallax) */}
            <Html
                position={[0, -2 + scrollProgress.current * 2, -6.9]}
                transform
                style={{ pointerEvents: 'none' }}
            >
                <div className="theatre-html-content" style={{ 
                    textAlign: 'center', color: '#fff', 
                    fontFamily: 'var(--font-display)', width: '600px' 
                }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '4px', opacity: 0.6 }}>FEATURED PROJECT</p>
                    <h2 style={{ fontSize: '4vw', margin: '1rem 0' }}>The Meridian Residence</h2>
                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', opacity: 0.5, fontSize: '12px' }}>
                        <span>2024</span>
                        <span>4,200 SQFT</span>
                        <span>MUMBAI</span>
                    </div>
                </div>
            </Html>

            {/* Seats */}
            {[...Array(3)].map((_, row) => 
                [...Array(6)].map((_, col) => (
                    <mesh key={`${row}-${col}`} position={[-5 + col * 2, -2.5 + row * 0.5, -5 + row * 2.5]}>
                        <boxGeometry args={[1.5, 0.8, 1.2]} />
                        <meshStandardMaterial color="#080808" roughness={0.9} />
                    </mesh>
                ))
            )}

            <ambientLight intensity={0.2} />
            <pointLight 
                position={[0, 2, -5]} 
                intensity={1} 
                color="#3a3a6a" 
            />
        </group>
    );
};

export default TheatreScene;

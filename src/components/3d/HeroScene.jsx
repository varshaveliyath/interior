import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
    MeshReflectorMaterial, 
    Environment, 
    Sparkles, 
    ContactShadows,
    Html 
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { Sofa, Lamp, SideTable, WallArt } from './FloatingObjects';

const HeroScene = ({ scrollProgress }) => {
  const groupRef = useRef();

  useFrame(({ camera, mouse }) => {
    // Scroll Dolly
    const p = scrollProgress.current;
    camera.position.z = gsap.utils.interpolate(8, 3, p);
    camera.position.y = gsap.utils.interpolate(0, -0.5, p);
    camera.fov = gsap.utils.interpolate(50, 65, p);
    camera.updateProjectionMatrix();

    // Mouse Tilt
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <Environment 
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr" 
      />

      <ambientLight intensity={0.15} />
      <pointLight position={[-4, 2, -2]} color="#E8A84C" intensity={3} distance={12} />
      <pointLight position={[3, -1, 2]} color="#C9A96E" intensity={1.5} distance={8} />
      <spotLight position={[0, 6, 4]} angle={0.3} penumbra={1} intensity={2} color="#F5EDD8" castShadow />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <planeGeometry args={[30, 30]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={512}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          color="#0a0a0f"
          metalness={0.6}
        />
      </mesh>

      <Sofa position={[-1.5, -1.2, 0]} />
      <Lamp position={[2.5, -2.5, -1]} />
      <SideTable position={[1.8, -1.8, 0.5]} />
      <WallArt position={[-3, 1, -3]} />

      <Sparkles count={80} scale={10} size={1.2} speed={0.3} color="#E8A84C" opacity={0.4} />
      <ContactShadows position={[0, -2.49, 0]} opacity={0.8} scale={15} blur={2.5} far={4} />

      <Html center position={[0, 0.5, 2]} style={{ pointerEvents: 'none' }}>
        <div className="hero-text">
          <p className="hero-label">Interior Design Studio</p>
          <h1 className="hero-headline">Where Light<br/>Defines Space</h1>
          <p className="hero-sub">Crafting environments that breathe</p>
        </div>
      </Html>
    </group>
  );
};

export default HeroScene;

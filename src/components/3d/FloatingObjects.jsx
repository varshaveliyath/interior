import React from 'react';
import { Float } from '@react-three/drei';

export const Sofa = (props) => (
  <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
    <mesh {...props} castShadow>
      <boxGeometry args={[3, 0.8, 1.2]} />
      <meshStandardMaterial color="#1a1008" roughness={0.8} metalness={0.1} />
    </mesh>
  </Float>
);

export const Lamp = (props) => (
  <Float speed={0.5} floatIntensity={0.2}>
    <group {...props}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 3, 8]} />
        <meshStandardMaterial color="#C9A96E" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#E8A84C" emissive="#E8A84C" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 3.2, 0]} color="#E8A84C" intensity={4} distance={6} />
    </group>
  </Float>
);

export const SideTable = (props) => (
  <Float speed={1.2} floatIntensity={0.4}>
    <group {...props}>
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
        <meshStandardMaterial color="#2a1f0f" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.4]} />
        <meshStandardMaterial color="#C9A96E" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  </Float>
);

export const WallArt = (props) => (
  <Float speed={0.6} rotationIntensity={0.05}>
    <mesh {...props}>
      <planeGeometry args={[2, 2.8]} />
      <meshStandardMaterial color="#111" roughness={1} />
    </mesh>
  </Float>
);

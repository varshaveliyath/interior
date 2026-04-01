import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { interpolateWaypoints } from '../utils/lerp';

gsap.registerPlugin(ScrollTrigger);

const PHOTO_FRAME = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600";
const CUSHION = "https://images.unsplash.com/photo-1584100936595-09af0e11e6d3?w=600";
const LAMP = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600";
const BOOK = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600";

const waypoints = [
  // [progress, top%, left%, width, rotZ, rotY, rotX, opacity]
  [0.00, 50, 50,  280, 0,    0,   0,   1  ], // Hero center
  [0.08, 45, 48,  260, -3,   5,   2,   1  ], // Hero -> slight tilt
  [0.18, 30, 20,  200, -8,  15,   5,   0.9], // Crossing upper left
  [0.25, 60, 15,  180, -12, 20,  -3,   0.85], // Landing Living Room
  [0.30, 55, 12,  160, -5,   8,   0,   1  ], // LANDED Living Room
  // Cushion swap at 0.32
  [0.38, 72, 35,  140,  8,  -5,   4,   1  ], // Cushion on sofa
  [0.45, 40, 60,  160, 15, -15,   8,   0.9], // Cushion airborne
  [0.52, 20, 70,  180, 20, -25,  12,   0.85], // 3D peak
  [0.58, 65, 65,  150,  5,  -8,   2,   1  ], // LANDED Bedroom
  // Lamp swap at 0.60
  [0.65, 50, 80,  120,  0,   0,   0,   1  ], // Lamp on bedside
  [0.72, 25, 55,  140, -10, 12,  -5,   0.9], // Traveling up
  [0.80, 70, 30,  160, -5,   8,   0,   0.85], // Entering Theatre
  [0.85, 60, 25,  130,  0,   0,   0,   1  ], // LANDED Theatre
  // Book swap at 0.90
  [0.95, 50, 50,  100,  0,   0,   0,   0.7], // Fading
  [1.00, 50, 50,   80,  0,   0,   0,   0  ], // End
];

const TravelingObject = () => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [currentSrc, setCurrentSrc] = useState(PHOTO_FRAME);

  useEffect(() => {
    const obj = containerRef.current;
    if (!obj) return;

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        const [top, left, width, rotZ, rotY, rotX, opacity] = interpolateWaypoints(waypoints, p);

        // Update properties
        obj.style.top = `${top}%`;
        obj.style.left = `${left}%`;
        obj.style.width = `${width}px`;
        obj.style.opacity = opacity;
        obj.style.transform = `perspective(1200px) translate(-50%, -50%) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;

        // Handle Image Swaps
        let nextSrc = PHOTO_FRAME;
        if (p > 0.90) nextSrc = BOOK;
        else if (p > 0.60) nextSrc = LAMP;
        else if (p > 0.32) nextSrc = CUSHION;

        if (nextSrc !== currentSrc) {
          gsap.to(imgRef.current, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              setCurrentSrc(nextSrc);
              gsap.to(imgRef.current, { opacity: 1, duration: 0.3 });
            }
          });
        }
      }
    });

    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, [currentSrc]);

  return (
    <div
      ref={containerRef}
      id="traveling-object"
      style={{
        position: "fixed",
        zIndex: 200,
        pointerEvents: "none",
        transformStyle: "preserve-3d",
        perspective: "1200px",
        transformOrigin: "center center",
        willChange: "transform, opacity, top, left, width",
        left: '50%',
        top: '50%',
      }}
    >
      <div style={{
          overflow: 'hidden',
          borderRadius: '4px',
          boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
          width: '100%',
          border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <img
          ref={imgRef}
          src={currentSrc}
          alt="traveling object"
          style={{ width: "100%", display: "block" }}
        />
      </div>
    </div>
  );
};

export default TravelingObject;

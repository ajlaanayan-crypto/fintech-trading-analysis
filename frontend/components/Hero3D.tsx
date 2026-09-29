'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Mesh } from 'three';

function AnimatedGlobe() {
    const meshRef = useRef<Mesh>(null!);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Sphere
            args={[1, 64, 64]}
            ref={meshRef}
            scale={2.2}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <MeshDistortMaterial
                color={hovered ? '#6366f1' : '#2563eb'} // Indigo to Blue
                attach="material"
                distort={hovered ? 0.8 : 0.4} // More distortion on hover
                speed={hovered ? 2.5 : 1.5}   // Faster movement on hover
                roughness={0.2}
                metalness={0.9} // Shinier
                wireframe={false} // Solid look might be better with lighting, or stick to wireframe if style demands. Let's try Solid for "premium" feel.
            />
        </Sphere>
    );
}

export default function Hero3D() {
    return (
        <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center">
            <Canvas className="w-full h-full">
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <AnimatedGlobe />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}

"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, Stars } from "@react-three/drei";
import * as THREE from "three";

const FloatingSphere = ({ position, color, size, speed }) => {
    const meshRef = useRef();

    useFrame((state, delta) => {
        meshRef.current.rotation.x += delta * 0.2 * speed;
        meshRef.current.rotation.y += delta * 0.3 * speed;
    });

    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef} position={position}>
                <sphereGeometry args={[size, 64, 64]} />
                <meshPhysicalMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.2}
                    roughness={0.1}
                    metalness={0.1}
                    transmission={0.6}
                    thickness={1}
                    clearcoat={1}
                />
            </mesh>
        </Float>
    );
};

const HeroScene = () => {
    return (
        <div className="absolute inset-0 z-0 bg-black">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f3ff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00aa" />

                {/* Abstract "Fruits/Objects" - Neon/Glass style */}
                <FloatingSphere position={[-4, 2, -2]} color="#00ff88" size={1.2} speed={1.5} /> {/* Green/Lime */}
                <FloatingSphere position={[4, -2, -1]} color="#ffaa00" size={1.5} speed={1.2} /> {/* Orange */}
                <FloatingSphere position={[0, 3, -5]} color="#ff0055" size={1} speed={2} /> {/* Red/Berry */}
                <FloatingSphere position={[2, 4, 0]} color="#00ccff" size={0.8} speed={1.8} /> {/* Blue/Ice */}
                <FloatingSphere position={[-3, -3, 1]} color="#aa00ff" size={1.1} speed={1.3} /> {/* Purple/Grape */}

                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                <Environment preset="city" />
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        </div>
    );
};

export default HeroScene;

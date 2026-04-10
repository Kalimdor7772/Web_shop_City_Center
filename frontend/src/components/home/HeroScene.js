"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";

function FruitOrb({ position, color, scale, speed }) {
    const meshRef = useRef(null);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x += delta * 0.18 * speed;
        meshRef.current.rotation.y += delta * 0.22 * speed;
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.12;
    });

    return (
        <Float speed={1.1 + speed} rotationIntensity={0.8} floatIntensity={1.2}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <icosahedronGeometry args={[1, 5]} />
                <meshPhysicalMaterial
                    color={color}
                    roughness={0.18}
                    metalness={0.06}
                    transmission={0.42}
                    thickness={1.2}
                    clearcoat={1}
                    emissive={color}
                    emissiveIntensity={0.15}
                />
            </mesh>
        </Float>
    );
}

function LeafRibbon({ position, rotation, color, scale }) {
    return (
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
            <mesh position={position} rotation={rotation} scale={scale}>
                <torusKnotGeometry args={[0.55, 0.16, 110, 14, 2, 3]} />
                <meshStandardMaterial color={color} roughness={0.35} metalness={0.08} />
            </mesh>
        </Float>
    );
}

export default function HeroScene() {
    return (
        <div className="absolute inset-0">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <ambientLight intensity={0.65} />
                <directionalLight position={[2, 4, 5]} intensity={2} color="#fff6d3" />
                <pointLight position={[-3, -1, 2]} intensity={1.4} color="#34d399" />
                <pointLight position={[3, 1, 2]} intensity={1.2} color="#f59e0b" />

                <FruitOrb position={[-2.8, 1.2, -0.4]} color="#f59e0b" scale={1} speed={0.8} />
                <FruitOrb position={[2.1, -1.4, 0.6]} color="#ef4444" scale={1.22} speed={0.6} />
                <FruitOrb position={[0.2, 2.3, -1.6]} color="#22c55e" scale={0.7} speed={0.9} />
                <LeafRibbon position={[1.1, 0.8, -1.5]} rotation={[0.6, 1.1, 0.2]} color="#166534" scale={0.78} />
                <LeafRibbon position={[-1.5, -2.1, -0.6]} rotation={[1, 0.2, 0.5]} color="#84cc16" scale={0.66} />
                <Environment preset="sunset" />
            </Canvas>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(255,247,234,0.12)_55%,rgba(255,247,234,0.3)_100%)]" />
        </div>
    );
}

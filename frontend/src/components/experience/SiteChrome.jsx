"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const ORBS = [
    { position: [-3.8, 1.6, -1.2], color: "#f49f0a", scale: 1.05, speed: 0.6 },
    { position: [3.6, -1.4, -0.8], color: "#1f9d68", scale: 1.4, speed: 0.45 },
    { position: [0.4, 2.7, -2.4], color: "#f4d35e", scale: 0.7, speed: 0.8 },
    { position: [-0.8, -2.4, -1.6], color: "#f05d5e", scale: 0.95, speed: 0.55 },
];

const ACCENTS = [
    {
        className: "left-[-7vw] top-[18vh] h-[34vh] w-[24vw] min-h-[260px] min-w-[180px]",
        orb: { position: [-0.6, 0.2, 0], color: "#34d399", scale: 1.55, speed: 0.8 },
        ring: { position: [0.9, -0.8, -0.4], color: "#fbbf24", scale: 0.84, speed: 0.55 },
    },
    {
        className: "right-[-8vw] top-[10vh] h-[42vh] w-[28vw] min-h-[300px] min-w-[220px]",
        orb: { position: [0.9, 0.3, 0], color: "#f59e0b", scale: 1.8, speed: 0.65 },
        ring: { position: [-0.9, -0.9, -0.3], color: "#10b981", scale: 0.95, speed: 0.5 },
    },
    {
        className: "right-[8vw] bottom-[10vh] h-[28vh] w-[20vw] min-h-[220px] min-w-[170px]",
        orb: { position: [0.4, -0.1, 0], color: "#ef4444", scale: 1.15, speed: 0.7 },
        ring: { position: [-0.7, 0.7, -0.2], color: "#facc15", scale: 0.72, speed: 0.6 },
    },
];

function AmbientOrb({ position, color, scale, speed }) {
    const meshRef = useRef(null);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x += delta * 0.08 * (1 + speed);
        meshRef.current.rotation.y += delta * 0.12 * (1 + speed);
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.12;
    });

    return (
        <Float speed={1 + speed} rotationIntensity={0.5} floatIntensity={0.7}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <icosahedronGeometry args={[1, 8]} />
                <meshPhysicalMaterial
                    color={color}
                    roughness={0.16}
                    metalness={0.08}
                    transmission={0.7}
                    thickness={1.5}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    emissive={color}
                    emissiveIntensity={0.14}
                />
            </mesh>
        </Float>
    );
}

function AccentRing({ position, color, scale, speed }) {
    const meshRef = useRef(null);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x += delta * 0.1 * speed;
        meshRef.current.rotation.y += delta * 0.12 * speed;
        meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed) * 0.08;
    });

    return (
        <Float speed={0.8 + speed} rotationIntensity={0.35} floatIntensity={0.55}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <torusKnotGeometry args={[0.82, 0.18, 120, 18, 2, 3]} />
                <meshStandardMaterial color={color} roughness={0.28} metalness={0.12} emissive={color} emissiveIntensity={0.08} />
            </mesh>
        </Float>
    );
}

function AmbientField() {
    const groupRef = useRef(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
        groupRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.1) * 0.08;
    });

    return (
        <group ref={groupRef}>
            {ORBS.map((orb) => (
                <AmbientOrb key={`${orb.position.join("-")}-${orb.color}`} {...orb} />
            ))}
        </group>
    );
}

function AccentScene({ orb, ring }) {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 36 }} dpr={[1, 1.4]} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[2, 3, 4]} intensity={1.6} color="#fff8d6" />
            <pointLight position={[-3, -2, 3]} intensity={1.3} color="#34d399" />
            <pointLight position={[3, 2, 3]} intensity={1.15} color="#f59e0b" />
            <AmbientOrb {...orb} />
            <AccentRing {...ring} />
        </Canvas>
    );
}

function SimpleCursor({ enabled }) {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [active, setActive] = useState(false);
    const [pressed, setPressed] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || !enabled) return undefined;

        const mediaQuery = window.matchMedia("(pointer: fine)");
        if (!mediaQuery.matches) return undefined;

        const handleMove = (event) => {
            const target = event.target instanceof Element ? event.target.closest("a, button, [data-cursor='magnetic']") : null;
            setActive(Boolean(target));
            setPosition({ x: event.clientX, y: event.clientY });
        };

        const handleDown = () => setPressed(true);
        const handleUp = () => setPressed(false);
        const handleLeave = () => {
            setActive(false);
            setPressed(false);
            setPosition({ x: -100, y: -100 });
        };

        window.addEventListener("pointermove", handleMove, { passive: true });
        window.addEventListener("pointerdown", handleDown, { passive: true });
        window.addEventListener("pointerup", handleUp, { passive: true });
        window.addEventListener("pointerleave", handleLeave);

        return () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerdown", handleDown);
            window.removeEventListener("pointerup", handleUp);
            window.removeEventListener("pointerleave", handleLeave);
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <>
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed left-0 top-0 z-[120] hidden rounded-full border border-emerald-300/70 bg-white/6 md:block"
                animate={{
                    x: position.x - (active ? 18 : 14),
                    y: position.y - (active ? 18 : 14),
                    width: active ? 36 : 28,
                    height: active ? 36 : 28,
                    opacity: position.x < 0 ? 0 : 1,
                    scale: pressed ? 0.88 : 1,
                }}
                transition={{ type: "tween", duration: 0.06, ease: "linear" }}
            />
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed left-0 top-0 z-[121] hidden rounded-full bg-[radial-gradient(circle,#fff7d7_0%,#f59e0b_58%,#f97316_100%)] shadow-[0_0_10px_rgba(245,158,11,0.25)] md:block"
                animate={{
                    x: position.x - (active ? 4 : 3),
                    y: position.y - (active ? 4 : 3),
                    width: active ? 8 : 6,
                    height: active ? 8 : 6,
                    opacity: position.x < 0 ? 0 : 0.95,
                    scale: pressed ? 0.82 : 1,
                }}
                transition={{ type: "tween", duration: 0.04, ease: "linear" }}
            />
        </>
    );
}

export default function SiteChrome() {
    const reduceMotion = useReducedMotion();
    const [allow3D, setAllow3D] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        const update = () => {
            const desktop = window.innerWidth >= 1024;
            setAllow3D(Boolean(desktop && !reduceMotion));
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [reduceMotion]);

    const particles = useMemo(
        () =>
            Array.from({ length: allow3D ? 14 : 4 }, (_, index) => ({
                id: index,
                width: 160 + (index % 4) * 40,
                height: 160 + ((index + 2) % 4) * 36,
                left: `${(index * 13) % 100}%`,
                top: `${(index * 19) % 100}%`,
                delay: index * 0.4,
                duration: 10 + (index % 5) * 2,
            })),
        [allow3D]
    );

    return (
        <>
            <div aria-hidden="true" className="site-ambient">
                <div className="site-ambient__gradient site-ambient__gradient--top" />
                <div className="site-ambient__gradient site-ambient__gradient--side" />
                <div className="site-ambient__gradient site-ambient__gradient--bottom" />
                <div className="site-ambient__mesh" />
                {allow3D && (
                    <div className="site-ambient__canvas">
                        <Canvas
                            camera={{ position: [0, 0, 7], fov: 40 }}
                            dpr={[1, 1.2]}
                            gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
                        >
                            <ambientLight intensity={0.65} />
                            <directionalLight position={[3, 5, 4]} intensity={1.4} color="#fff8d6" />
                            <pointLight position={[-4, -2, 2]} intensity={1.1} color="#34d399" />
                            <pointLight position={[5, 1, 3]} intensity={1.05} color="#f59e0b" />
                            <AmbientField />
                        </Canvas>
                    </div>
                )}
                {allow3D && (
                    <div className="pointer-events-none fixed inset-0 z-[1] hidden overflow-hidden md:block">
                        {ACCENTS.map((accent) => (
                            <div key={accent.className} className={`absolute opacity-95 ${accent.className}`}>
                                <AccentScene orb={accent.orb} ring={accent.ring} />
                            </div>
                        ))}
                    </div>
                )}
                <div className="site-ambient__particles">
                    {particles.map((particle) => (
                        <span
                            key={particle.id}
                            className="site-ambient__particle"
                            style={{
                                width: `${particle.width}px`,
                                height: `${particle.height}px`,
                                left: particle.left,
                                top: particle.top,
                                animationDelay: `${particle.delay}s`,
                                animationDuration: `${particle.duration}s`,
                            }}
                        />
                    ))}
                </div>
                <div className="site-ambient__noise" />
            </div>
            <SimpleCursor enabled />
        </>
    );
}

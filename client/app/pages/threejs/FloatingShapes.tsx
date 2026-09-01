// -Path: 'Vite-React-TypeScript\src\pages\threejs\FloatingShapes.tsx'
import { Mesh } from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cone, Torus, Sphere, Cylinder, Icosahedron } from '@react-three/drei';

interface ShapeProps {
    position: [number, number, number];
    color: string;
    scale: number;
    speed: number;
}

const shapes: ShapeProps[] = [
    { position: [-3, 1, 0], color: '#61DAFB', scale: 1, speed: 0.5 },
    { position: [3, -0.5, -1], color: '#646CFF', scale: 1, speed: 0.7 },
    { position: [0, 2.5, -2], color: '#FF6B6B', scale: 0.8, speed: 0.9 },
    { position: [-2.5, -1.5, 1], color: '#FFD93D', scale: 0.7, speed: 0.4 },
    { position: [2.5, 1.5, 1.5], color: '#6BCB77', scale: 0.9, speed: 0.6 },
    { position: [0, -2, -0.5], color: '#C084FC', scale: 0.75, speed: 0.8 },
];

function AnimatedBox({ position, color, scale, speed }: ShapeProps) {
    const ref = useRef<Mesh>(null);
    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * speed;
            ref.current.rotation.y += delta * speed * 1.3;
        }
    });
    return (
        <Box ref={ref} args={[1.2, 1.2, 1.2]} position={position} scale={scale}>
            <meshPhysicalMaterial color={color} roughness={0.3} metalness={0.1} />
        </Box>
    );
}

function AnimatedSphere({ position, color, scale, speed }: ShapeProps) {
    const ref = useRef<Mesh>(null);
    useFrame((state) => {
        if (ref.current)
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.4;
    });
    return (
        <Sphere ref={ref} args={[0.8, 32, 32]} position={position} scale={scale}>
            <meshPhysicalMaterial color={color} roughness={0.2} metalness={0.4} />
        </Sphere>
    );
}

function AnimatedTorus({ position, color, scale, speed }: ShapeProps) {
    const ref = useRef<Mesh>(null);
    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * speed * 0.8;
            ref.current.rotation.z += delta * speed * 0.5;
        }
    });
    return (
        <Torus ref={ref} args={[0.7, 0.25, 16, 48]} position={position} scale={scale}>
            <meshPhysicalMaterial color={color} roughness={0.4} metalness={0.6} />
        </Torus>
    );
}

function AnimatedCone({ position, color, scale, speed }: ShapeProps) {
    const ref = useRef<Mesh>(null);
    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.y += delta * speed;
    });
    return (
        <Cone ref={ref} args={[0.8, 1.2, 24]} position={position} scale={scale}>
            <meshPhysicalMaterial color={color} roughness={0.3} metalness={0.2} />
        </Cone>
    );
}

function AnimatedCylinder({ position, color, scale, speed }: ShapeProps) {
    const ref = useRef<Mesh>(null);
    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * speed * 0.6;
            ref.current.rotation.z += delta * speed * 0.4;
        }
    });
    return (
        <Cylinder ref={ref} args={[0.6, 0.6, 1.1, 24]} position={position} scale={scale}>
            <meshPhysicalMaterial color={color} roughness={0.2} metalness={0.3} />
        </Cylinder>
    );
}

function AnimatedIcosahedron({ position, color, scale, speed }: ShapeProps) {
    const ref = useRef<Mesh>(null);
    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * speed * 1.1;
            ref.current.rotation.y += delta * speed * 0.7;
        }
    });
    return (
        <Icosahedron ref={ref} args={[0.7, 0]} position={position} scale={scale}>
            <meshPhysicalMaterial color={color} roughness={0.1} metalness={0.5} />
        </Icosahedron>
    );
}

export default function FloatingShapes() {
    return (
        <>
            <AnimatedBox {...shapes[0]} />
            <AnimatedSphere {...shapes[1]} />
            <AnimatedTorus {...shapes[2]} />
            <AnimatedCone {...shapes[3]} />
            <AnimatedCylinder {...shapes[4]} />
            <AnimatedIcosahedron {...shapes[5]} />
        </>
    );
}

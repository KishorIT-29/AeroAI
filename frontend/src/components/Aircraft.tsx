import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Aircraft() {
    const group = useRef<THREE.Group>(null!)

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        // Subtle movement to simulate flight
        group.current.position.y = Math.sin(t * 0.5) * 0.1
        group.current.rotation.z = Math.sin(t * 0.5) * 0.05
        group.current.rotation.x = Math.sin(t * 0.2) * 0.02
    })

    return (
        <group ref={group}>
            {/* Fuselage */}
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.5, 0.5, 4, 32]} />
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} emissive="#000" />
            </mesh>

            {/* Nose */}
            <mesh position={[0, 2, 0]} castShadow>
                <sphereGeometry args={[0.5, 32, 16]} />
                <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Cockpit Window */}
            <mesh position={[0, 1.5, 0.3]} rotation={[Math.PI / 4, 0, 0]}>
                <boxGeometry args={[0.6, 0.4, 0.1]} />
                <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={2} transparent opacity={0.6} />
            </mesh>

            {/* Wings */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
                <boxGeometry args={[6, 0.1, 1]} />
                <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Tail Fin */}
            <mesh position={[0, -1.8, 0.4]} rotation={[0, 0, 0]} castShadow>
                <boxGeometry args={[0.1, 0.8, 0.8]} />
                <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Navigation Lights */}
            <pointLight position={[3, 0, 0]} color="red" intensity={2} distance={2} />
            <pointLight position={[-3, 0, 0]} color="green" intensity={2} distance={2} />
            <pointLight position={[0, 2, 0.5]} color="#00f2ff" intensity={1} distance={2} />

            {/* Engine Glow */}
            <mesh position={[0.8, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
                <meshStandardMaterial color="#111" />
                <pointLight position={[0, -0.2, 0]} color="#00f2ff" intensity={3} distance={1} />
            </mesh>
            <mesh position={[-0.8, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
                <meshStandardMaterial color="#111" />
                <pointLight position={[0, -0.2, 0]} color="#00f2ff" intensity={3} distance={1} />
            </mesh>
        </group>
    )
}

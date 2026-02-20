import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, Points, PointMaterial } from '@react-three/drei'

interface TurbulenceZoneProps {
    position: [number, number, number]
    color: string
}

function TurbulenceZone({ position, color }: TurbulenceZoneProps) {
    const mesh = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2
        mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3
    })

    return (
        <mesh ref={mesh} position={position}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshStandardMaterial
                color={color}
                transparent
                opacity={0.15}
                wireframe
                emissive={color}
                emissiveIntensity={0.5}
            />
        </mesh>
    )
}

export function Atmosphere({ riskLevel }: { riskLevel: string }) {
    const stars = useMemo(() => {
        const positions = new Float32Array(500 * 3)
        for (let i = 0; i < 500; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50
        }
        return positions
    }, [])

    const turbulenceColor = useMemo(() => {
        if (riskLevel === 'High') return '#ff3333'
        if (riskLevel === 'Medium') return '#ffaa00'
        return '#00f2ff'
    }, [riskLevel])

    return (
        <>
            <color attach="background" args={['#020406']} />
            <fog attach="fog" args={['#020406', 5, 20]} />

            <Points positions={stars}>
                <PointMaterial
                    transparent
                    color="#00f2ff"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <TurbulenceZone position={[5, 2, -10]} color={riskLevel === 'High' ? '#ff3333' : '#333'} />
                <TurbulenceZone position={[-6, -1, -8]} color={riskLevel === 'Medium' ? '#ffaa00' : '#333'} />
                <TurbulenceZone position={[2, -4, -12]} color="#333" />
            </Float>

            <gridHelper args={[100, 50, '#00f2ff', '#051015']} position={[0, -10, 0]} rotation={[0, 0, 0]} />
        </>
    )
}

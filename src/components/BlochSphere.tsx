import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Line, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface BlochSphereProps {
  theta: number; // Angle from Z-axis (0 to PI)
  phi: number;   // Angle in XY-plane (0 to 2PI)
  isMeasuring: boolean;
  measuredState: number | null;
  pulse?: boolean;
}

const QubitVector: React.FC<{ theta: number; phi: number; isMeasuring: boolean; measuredState: number | null; pulse?: boolean }> = ({ theta, phi, isMeasuring, measuredState, pulse }) => {
  const vectorRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  
  // Calculate vector endpoint
  const endpoint = useMemo(() => {
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);
    return new THREE.Vector3(x, y, z);
  }, [theta, phi]);

  useFrame((state) => {
    if (vectorRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * (isMeasuring ? 0.01 : 0.03);
      vectorRef.current.scale.set(scale, scale, scale);
    }
    if (pulseRef.current && pulse) {
      pulseRef.current.scale.addScalar(0.05);
      (pulseRef.current.material as THREE.MeshStandardMaterial).opacity -= 0.02;
    }
  });

  return (
    <group ref={vectorRef}>
      <Line
        points={[new THREE.Vector3(0, 0, 0), endpoint]}
        color={isMeasuring ? (measuredState !== null ? "#10b981" : "#ef4444") : "#60a5fa"}
        lineWidth={4}
      />
      <mesh position={endpoint}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial 
          color={isMeasuring ? (measuredState !== null ? "#10b981" : "#ef4444") : "#3b82f6"} 
          emissive={isMeasuring ? (measuredState !== null ? "#10b981" : "#ef4444") : "#3b82f6"} 
          emissiveIntensity={3} 
        />
      </mesh>

      {pulse && (
        <mesh position={endpoint} ref={pulseRef}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="#ef4444" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

const Scene: React.FC<BlochSphereProps> = ({ theta, phi, isMeasuring, measuredState, pulse }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !isMeasuring) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* The Sphere */}
      <Sphere args={[1, 64, 64]}>
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.05} 
          wireframe={false}
          roughness={0.1}
          metalness={0.1}
        />
      </Sphere>

      {/* Wireframe for structure */}
      <Sphere args={[1.001, 32, 32]}>
        <meshBasicMaterial color="#475569" wireframe transparent opacity={0.1} />
      </Sphere>

      {/* Axes */}
      <Line points={[new THREE.Vector3(0, 0, -1.2), new THREE.Vector3(0, 0, 1.2)]} color="#94a3b8" lineWidth={1} />
      <Line points={[new THREE.Vector3(-1.2, 0, 0), new THREE.Vector3(1.2, 0, 0)]} color="#94a3b8" lineWidth={1} />
      <Line points={[new THREE.Vector3(0, -1.2, 0), new THREE.Vector3(0, 1.2, 0)]} color="#94a3b8" lineWidth={1} />

      {/* Labels */}
      <Html position={[0, 0, 1.1]} center>
        <div className="text-white font-mono text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10 select-none">|0⟩</div>
      </Html>
      <Html position={[0, 0, -1.1]} center>
        <div className="text-white font-mono text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10 select-none">|1⟩</div>
      </Html>
      
      {/* State Vector */}
      <QubitVector theta={theta} phi={phi} isMeasuring={isMeasuring} measuredState={measuredState} pulse={pulse} />

      {/* Equator */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.99, 1.01, 64]} />
        <meshBasicMaterial color="#475569" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const BlochSphere: React.FC<BlochSphereProps> = (props) => {
  return (
    <div className="w-full h-full min-h-[400px] relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[2, 2, 2]} />
        <OrbitControls enablePan={false} minDistance={2} maxDistance={5} autoRotate={false} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Scene {...props} />
      </Canvas>
    </div>
  );
};

export default BlochSphere;

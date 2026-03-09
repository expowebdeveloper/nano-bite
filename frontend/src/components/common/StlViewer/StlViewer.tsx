import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Center } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";
import { Maximize2, Minimize2, RotateCcw } from "lucide-react";

interface StlModelProps {
  url: string;
  resetKey: number;
}

const StlModel = ({ url, resetKey }: StlModelProps) => {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (!geometry) return;

    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox;
    if (!bbox) return;

    const size = new THREE.Vector3();
    bbox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 50 / maxDim;

    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale);
    }

    const distance = 120;
    camera.position.set(distance * 0.7, distance * 0.5, distance * 0.7);
    camera.lookAt(0, 0, 0);
  }, [geometry, camera, resetKey]);

  return (
    <Center>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#c8d8e8"
          metalness={0.1}
          roughness={0.4}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          envMapIntensity={0.8}
        />
      </mesh>
    </Center>
  );
};

const LoadingFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-[#0B75C9] border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-gray-500">Loading 3D model...</span>
    </div>
  </div>
);

interface StlViewerProps {
  url: string;
  fileName?: string;
}

export const StlViewer = ({ url, fileName }: StlViewerProps) => {
  const [expanded, setExpanded] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-500">Unable to load 3D preview for this file.</p>
        {fileName && <p className="text-xs text-gray-400 mt-1">{fileName}</p>}
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-xl border border-gray-200 bg-gradient-to-b from-[#f0f5fa] to-[#e4ecf4] overflow-hidden transition-all duration-300 ${
        expanded ? "fixed inset-4 z-50 rounded-2xl shadow-2xl" : "w-full"
      }`}
    >
      {expanded && (
        <div
          className="fixed inset-0 bg-black/40 -z-10"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Toolbar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setResetKey((k) => k + 1)}
          className="p-2 rounded-lg bg-white/90 shadow-sm hover:bg-white transition text-gray-600 hover:text-gray-900"
          title="Reset view"
        >
          <RotateCcw size={16} />
        </button>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-lg bg-white/90 shadow-sm hover:bg-white transition text-gray-600 hover:text-gray-900"
          title={expanded ? "Exit fullscreen" : "Fullscreen"}
        >
          {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* File name badge */}
      {fileName && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 shadow-sm px-3 py-1.5 text-xs font-medium text-gray-700">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0B75C9]" />
            {fileName}
          </span>
        </div>
      )}

      {/* 3D Canvas */}
      <div className={expanded ? "h-full" : "h-[400px]"}>
        <ErrorBoundary onError={() => setHasError(true)}>
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              camera={{ position: [80, 60, 80], fov: 45, near: 0.1, far: 5000 }}
              shadows
              gl={{ antialias: true, alpha: true }}
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.2;
              }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[50, 80, 50]} intensity={1} castShadow />
              <directionalLight position={[-30, 40, -30]} intensity={0.4} />
              <pointLight position={[0, 100, 0]} intensity={0.3} />

              <StlModel url={url} resetKey={resetKey} />

              <OrbitControls
                enableDamping
                dampingFactor={0.08}
                minDistance={20}
                maxDistance={500}
                enablePan
                makeDefault
              />
              <gridHelper args={[200, 20, "#d0d5dd", "#e8ecf0"]} position={[0, -25, 0]} />
            </Canvas>
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-3 left-3 z-10">
        <span className="text-[10px] text-gray-400 bg-white/70 rounded px-2 py-1">
          Drag to rotate · Scroll to zoom · Right-click to pan
        </span>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

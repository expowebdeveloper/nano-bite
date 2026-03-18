import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";
import { Maximize2, Minimize2, RotateCcw } from "lucide-react";

interface StlModelProps {
  geometry: THREE.BufferGeometry;
  radius: number;
  resetKey: number;
}

const StlModel = ({ geometry, radius, resetKey }: StlModelProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useEffect(() => {
    // Position camera so the model fills the viewport
    const fov = 45;
    const dist = radius / Math.sin((fov / 2) * (Math.PI / 180));
    camera.position.set(dist * 0.6, dist * 0.4, dist * 0.6);
    camera.lookAt(0, 0, 0);
    camera.near = radius * 0.01;
    camera.far = radius * 100;
    camera.updateProjectionMatrix();
  }, [radius, camera, resetKey]);

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color="#7ec8e3"
        roughness={0.35}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
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
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [boundingRadius, setBoundingRadius] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setHasError(false);
    setGeometry(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buffer) => {
        if (cancelled) return;
        const loader = new STLLoader();
        const geo = loader.parse(buffer);
        geo.computeVertexNormals();

        // Center geometry at origin (do this once here, not in the render component)
        geo.computeBoundingBox();
        const bbox = geo.boundingBox;
        if (bbox) {
          const center = new THREE.Vector3();
          bbox.getCenter(center);
          geo.translate(-center.x, -center.y, -center.z);
        }

        // Compute bounding sphere for camera auto-fit
        geo.computeBoundingSphere();
        const radius = geo.boundingSphere?.radius || 1;
        setBoundingRadius(radius);
        setGeometry(geo);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (hasError) {
    return (
      <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-500">Unable to load 3D preview for this file.</p>
        {fileName && <p className="text-xs text-gray-400 mt-1">{fileName}</p>}
      </div>
    );
  }

  if (loading || !geometry) {
    return (
      <div className="w-full rounded-xl border border-gray-200 bg-gradient-to-b from-[#f0f5fa] to-[#e4ecf4] h-[400px] relative">
        <LoadingFallback />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-xl border border-gray-200 bg-gradient-to-b from-[#f8fafb] to-[#eef2f6] overflow-hidden transition-all duration-300 ${
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
          <Canvas
            camera={{ position: [0, 0, 100], fov: 45 }}
            shadows
            gl={{ antialias: true, alpha: true }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.5;
            }}
          >
            {/* Strong ambient for even base lighting */}
            <ambientLight intensity={0.8} />
            {/* Key light from front-top-right */}
            <directionalLight position={[1, 2, 3]} intensity={1.5} castShadow />
            {/* Fill light from left */}
            <directionalLight position={[-2, 1, -1]} intensity={0.6} />
            {/* Rim light from behind */}
            <directionalLight position={[0, -1, -2]} intensity={0.3} />
            {/* Top light */}
            <hemisphereLight args={["#dff0ff", "#b0d4ee", 0.8]} />

            <StlModel geometry={geometry} radius={boundingRadius} resetKey={resetKey} />

            <OrbitControls
              enableDamping
              dampingFactor={0.08}
              enablePan
              makeDefault
            />
          </Canvas>
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

// frontend/src/components/FemaleAnatomy3D.tsx

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { RotateCcw, ZoomIn, ZoomOut, ShieldAlert, CheckCircle2, Info, Loader2, Heart, Bone, Brain, Sparkles } from 'lucide-react';
import type { BodySystemId, Severity } from '@/types/hera';
import femaleAnatomyUrl from '@/assets/female_anatomy.fbx?url';

interface SystemConfig {
  id: BodySystemId;
  label: string;
  shortTag: string;
  yOffset: number;
  xOffset: number;
  zOffset: number;
  whyMeasured: string;
  selfExamTip: string;
}

const BODY_SYSTEMS: SystemConfig[] = [
  {
    id: 'neuro-ocular',
    label: 'Neuro-Ocular & Cabin Differential',
    shortTag: 'SANS / CO2',
    yOffset: 0.75,
    xOffset: 0.0,
    zOffset: 0.05,
    whyMeasured: 'Separates cephalad fluid shift (SANS) and cabin CO2 pockets from estrogen-related headaches.',
    selfExamTip: 'Run 20-sec Amsler visual grid check and log intraocular pressure if near-vision blurs.',
  },
  {
    id: 'cardiovascular',
    label: 'Cardiovascular & Venous Return',
    shortTag: 'VTE / HR',
    yOffset: 0.35,
    xOffset: 0.0,
    zOffset: 0.08,
    whyMeasured: 'Tracks venous stasis in 0g combined with exogenous estrogen clotting dynamics.',
    selfExamTip: 'Measure calf circumference & perform guided jugular/femoral Doppler sweep if alerted.',
  },
  {
    id: 'skeletal',
    label: 'Skeletal & Endocrine Bone Buffer',
    shortTag: 'BMD / ARED',
    yOffset: 0.18,
    xOffset: 0.0,
    zOffset: 0.06,
    whyMeasured: 'Balances estrogen osteoprotection against microgravity bone demineralization.',
    selfExamTip: 'Complete 60 min resistive loading on ARED and verify Vitamin D3 + Calcium intake.',
  },
  {
    id: 'urogenital',
    label: 'Microbiome & Urogenital Immunity',
    shortTag: 'pH / FLORA',
    yOffset: 0.02,
    xOffset: 0.0,
    zOffset: 0.06,
    whyMeasured: 'Monitors urogenital pH shifts caused by continuous OCPs + spaceflight immune modulation.',
    selfExamTip: 'Log weekly colorimetric pH strip & onboard swab inside your private encrypted vault.',
  },
];

interface LayerItem {
  id: BodySystemId;
  label: string;
  icon: React.ElementType;
}

const LAYERS: LayerItem[] = [
  { id: 'cardiovascular', label: 'Heart', icon: Heart },
  { id: 'skeletal', label: 'Bones', icon: Bone },
  { id: 'neuro-ocular', label: 'Brain', icon: Brain },
  { id: 'urogenital', label: 'Hormones', icon: Sparkles },
];

interface ProjectedPoint {
  id: BodySystemId;
  x: number;
  y: number;
  visible: boolean;
}

interface FemaleAnatomy3DProps {
  selectedSystem: BodySystemId | null;
  onSelectSystem: (sys: BodySystemId | null) => void;
  systemSeverities?: Record<BodySystemId, Severity>;
  co2Level: number;
  bodyTemp: number;
  baselineTemp: number;
  privacyMode: boolean;
  onOpenMetricModal?: (metricId: string) => void;
  modelUrl?: string;
  useHolographicMaterial?: boolean;
}

export function FemaleAnatomy3D({
  selectedSystem,
  onSelectSystem,
  systemSeverities = { 'neuro-ocular': 'info', 'cardiovascular': 'info', 'skeletal': 'info', 'urogenital': 'info' },
  co2Level,
  bodyTemp,
  baselineTemp,
  privacyMode,
  onOpenMetricModal,
  modelUrl = femaleAnatomyUrl,
  useHolographicMaterial = true,
}: FemaleAnatomy3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const tabListRef = useRef<HTMLDivElement | null>(null);
  const [projectedPoints, setProjectedPoints] = useState<ProjectedPoint[]>([]);
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const zoomRef = useRef<number>(3.6);
  const targetRotYRef = useRef<number>(0.15);
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseXRef = useRef<number>(0);
  const prevMouseYRef = useRef<number>(0);
  const targetRotXRef = useRef<number>(0);

  const selectedRef = useRef<BodySystemId | null>(selectedSystem);
  const severitiesRef = useRef<Record<BodySystemId, Severity>>(systemSeverities);

  selectedRef.current = selectedSystem;
  severitiesRef.current = systemSeverities;

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (!tabListRef.current) return;
    const buttons = Array.from(tabListRef.current.querySelectorAll('button[role="tab"]')) as HTMLElement[];
    let nextIndex = currentIndex;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % buttons.length;
      e.preventDefault();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      e.preventDefault();
    }
    buttons[nextIndex]?.focus();
  };

  const handleLayerClick = (sysId: BodySystemId) => {
    if (selectedSystem === sysId) {
      onSelectSystem(null);
    } else {
      onSelectSystem(sysId);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setIsLoadingModel(true);
    setLoadError(null);

    const scene = new THREE.Scene();
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 640;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    camera.position.set(0, 0.0, zoomRef.current);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xfff7f4, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(2.4, 3.2, 3.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7c529e, 1.2);
    rimLight.position.set(-2.6, 1.4, -2.0);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x2a9d8f, 0.7);
    fillLight.position.set(2.0, -1.8, 1.5);
    scene.add(fillLight);

    const figureGroup = new THREE.Group();
    scene.add(figureGroup);

    const translucentMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf2ded9,
      roughness: 0.25,
      metalness: 0.05,
      transmission: 0.65,
      thickness: 0.5,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
    });

    const loader = new FBXLoader();
    let loadedModel: THREE.Group | null = null;

    const hotspotAnchors: Record<BodySystemId, THREE.Object3D> = {} as Record<BodySystemId, THREE.Object3D>;
    const coreMeshes: Record<BodySystemId, THREE.Mesh> = {} as Record<BodySystemId, THREE.Mesh>;

    loader.load(
      modelUrl,
      (fbx) => {
        loadedModel = fbx;
        if (useHolographicMaterial) {
          fbx.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.material = translucentMaterial;
            }
          });
        }

        const box = new THREE.Box3().setFromObject(fbx);
        const size = new THREE.Vector3();
        box.getSize(size);

        const targetHeight = 1.8;
        const scaleFactor = size.y > 0 ? targetHeight / size.y : 1;
        fbx.scale.setScalar(scaleFactor);

        const scaledBox = new THREE.Box3().setFromObject(fbx);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);

        fbx.position.x = -scaledCenter.x;
        fbx.position.z = -scaledCenter.z;
        fbx.position.y = -scaledCenter.y;

        figureGroup.add(fbx);

        BODY_SYSTEMS.forEach((sys) => {
          const anchor = new THREE.Object3D();
          anchor.position.set(sys.xOffset, sys.yOffset, sys.zOffset);
          figureGroup.add(anchor);
          hotspotAnchors[sys.id] = anchor;

          const coreGeo = new THREE.SphereGeometry(0.015, 16, 16);
          const coreMat = new THREE.MeshBasicMaterial({ color: 0x2a9d8f });
          const core = new THREE.Mesh(coreGeo, coreMat);
          anchor.add(core);
          coreMeshes[sys.id] = core;
        });

        setIsLoadingModel(false);
      },
      undefined,
      (error) => {
        console.error('Error loading FBX model:', error);
        setLoadError('Failed to load 3D anatomy model.');
        setIsLoadingModel(false);
      }
    );

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 640;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId = 0;
    const clock = new THREE.Clock();

    const getSeverityHex = (sev: Severity): number => {
      if (sev === 'critical') return 0xdf5a49; // Rojo
      if (sev === 'warning') return 0xe9c46a;  // Amarillo
      return 0x2a9d8f;                          // Verde
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!isDraggingRef.current) {
        targetRotYRef.current = 0.15 + Math.sin(t * 0.3) * 0.1;
      }
      
      figureGroup.rotation.y += (targetRotYRef.current - figureGroup.rotation.y) * 0.08;
      figureGroup.rotation.x += (targetRotXRef.current - figureGroup.rotation.x) * 0.08;
      camera.position.z += (zoomRef.current - camera.position.z) * 0.08;

      const w = container.clientWidth || 360;
      const h = container.clientHeight || 640;
      const nextProjected: ProjectedPoint[] = [];

      BODY_SYSTEMS.forEach((sys) => {
        const sev = severitiesRef.current[sys.id] ?? 'info';
        const hex = getSeverityHex(sev);
        const isSelected = sys.id === selectedRef.current;

        const core = coreMeshes[sys.id];
        const anchor = hotspotAnchors[sys.id];

        if (core && anchor) {
          const activeColor = isSelected ? 0x7c529e : hex;
          (core.material as THREE.MeshBasicMaterial).color.setHex(activeColor);

          const worldVec = new THREE.Vector3();
          anchor.getWorldPosition(worldVec);
          worldVec.project(camera);

          nextProjected.push({
            id: sys.id,
            x: (worldVec.x * 0.5 + 0.5) * w,
            y: (-worldVec.y * 0.5 + 0.5) * h,
            visible: worldVec.z < 1,
          });
        }
      });

      setProjectedPoints(nextProjected);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (loadedModel) {
        figureGroup.remove(loadedModel);
      }
      translucentMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl, useHolographicMaterial]);

  const activeSystemInfo = BODY_SYSTEMS.find((s) => s.id === selectedSystem) ?? BODY_SYSTEMS[1];
  const activeSeverity = selectedSystem ? systemSeverities[selectedSystem] : 'info';
  
  const tempDelta = Number((bodyTemp - baselineTemp).toFixed(1));
  const tempStatusText = tempDelta === 0 
    ? 'At your normal baseline' 
    : tempDelta > 0 
    ? `${Math.abs(tempDelta)} °C above baseline` 
    : `${Math.abs(tempDelta)} °C below baseline`;

  return (
    <div className="grid grid-cols-[96px_1fr] w-full h-full min-h-[740px] rounded-[28px] bg-[image:var(--stage-bg)] border border-[#EDE3DF] overflow-hidden select-none relative">
      
      {/* Layers Sidebar */}
      <div 
        ref={tabListRef}
        role="tablist" 
        aria-label="Body system layers"
        className="flex flex-col items-center py-6 gap-3 bg-white/70 backdrop-blur-md border-r border-[#E8DFDB] z-10 px-1"
      >
        <span className="text-[11px] font-mono-tech text-[var(--ink-muted)] uppercase tracking-wider mb-2">
          Layers
        </span>

        {LAYERS.map((layer, index) => {
          const Icon = layer.icon;
          const isSelected = selectedSystem === layer.id;
          const severity = systemSeverities[layer.id];

          return (
            <button
              key={layer.id}
              role="tab"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleLayerClick(layer.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`flex flex-col items-center justify-center w-full min-h-[72px] py-2 px-1 rounded-2xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                isSelected
                  ? 'bg-[#7c529e] text-white shadow-sm font-semibold'
                  : 'text-[var(--ink-muted)] hover:bg-black/5 hover:text-[var(--ink)]'
              }`}
              title={layer.label}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {severity === 'critical' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#DF5A49] animate-pulse" />
                )}
                {severity === 'warning' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E9C46A]" />
                )}
              </div>
              <span className="text-[13px] leading-tight text-center mt-2 truncate w-full font-medium">
                {layer.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Viewport */}
      <div className="relative flex flex-col justify-between p-5 h-full overflow-hidden">
        
        {isLoadingModel && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none bg-white/40 backdrop-blur-xs">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#E6DFDA] shadow-sm text-xs text-[var(--ink)]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />
              <span>Loading translucent 3D anatomy model...</span>
            </div>
          </div>
        )}

        {loadError && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="bg-red-50/95 text-[#DF5A49] px-3.5 py-2 rounded-xl border border-red-200 text-xs font-medium">
              {loadError}
            </div>
          </div>
        )}

        {/* 3D Camera Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-[#E6DFDA] shadow-xs">
          <button
            type="button"
            onClick={() => { zoomRef.current = Math.max(2.0, zoomRef.current - 0.25); }}
            className="p-1 text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => { zoomRef.current = Math.min(5.0, zoomRef.current + 0.25); }}
            className="p-1 text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => { zoomRef.current = 3.6; targetRotYRef.current = 0.15; targetRotXRef.current = 0; }}
            className="p-1 text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            title="Reset orientation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* WebGL Canvas */}
        <div
          ref={mountRef}
          onPointerDown={(e) => {
            isDraggingRef.current = true;
            prevMouseXRef.current = e.clientX;
            prevMouseYRef.current = e.clientY;
          }}
          onPointerMove={(e) => {
            if (!isDraggingRef.current) return;
            const dx = e.clientX - prevMouseXRef.current;
            const dy = e.clientY - prevMouseYRef.current;
            prevMouseXRef.current = e.clientX;
            prevMouseYRef.current = e.clientY;
            targetRotYRef.current += dx * 0.012;
            targetRotXRef.current = Math.max(-0.6, Math.min(0.6, targetRotXRef.current + dy * 0.012));
          }}
          onPointerUp={() => { isDraggingRef.current = false; }}
          onPointerLeave={() => { isDraggingRef.current = false; }}
          className="w-full flex-1 my-auto cursor-grab active:cursor-grabbing min-h-[520px]"
        />

        {/* Projected 2D Hotspot Badges (Semáforo exacto: Rojo, Amarillo, Verde) */}
        {projectedPoints.map((pt) => {
          if (!pt.visible) return null;

          const cfg = BODY_SYSTEMS.find((s) => s.id === pt.id)!;
          const sev = systemSeverities[pt.id];
          const isSelected = pt.id === selectedSystem;
          const isIntimateLocked = pt.id === 'urogenital' && privacyMode;

          const badgeColor = isSelected
            ? 'bg-[#7c529e] text-white border-[#7c529e] ring-4 ring-[#7c529e]/30 scale-105 shadow-xl'
            : sev === 'critical'
              ? 'bg-[#DF5A49] text-white border-[#DF5A49] ring-4 ring-[#DF5A49]/30 animate-bounce shadow-[0_0_16px_rgba(223,90,73,0.6)]'
              : sev === 'warning'
                ? 'bg-[#E9C46A] text-[#1A1517] border-[#E9C46A] ring-4 ring-[#E9C46A]/30 shadow-[0_0_12px_rgba(233,196,106,0.5)] font-bold'
                : 'bg-white/95 text-[var(--ink)] border-[#E4DDD8] hover:border-[var(--accent)] ring-2 ring-black/5 shadow-sm';

          return (
            <button
              key={pt.id}
              type="button"
              onClick={() => {
                onSelectSystem(pt.id);
                if (pt.id === 'cardiovascular') onOpenMetricModal?.('thrombosis');
                if (pt.id === 'neuro-ocular') onOpenMetricModal?.('sans_co2');
                if (pt.id === 'skeletal') onOpenMetricModal?.('bone_shield');
                if (pt.id === 'urogenital') onOpenMetricModal?.('microbiome_ph');
              }}
              style={{ left: `${pt.x}px`, top: `${pt.y}px` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 px-3 py-1 rounded-full text-[12px] font-mono-tech font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${badgeColor}`}
            >
              <span className={`w-2 h-2 rounded-full border border-current ${isSelected ? 'bg-white animate-ping' : 'animate-pulse'}`} />
              <span>{isIntimateLocked ? 'PRIVATE' : cfg.shortTag}</span>
            </button>
          );
        })}

        {/* Floating See-Through Bottom Card */}
        <div className="z-20 bg-white/20 backdrop-blur-md rounded-2xl p-3.5 border border-white/30 shadow-lg mt-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {activeSeverity === 'info' ? (
                <CheckCircle2 className="w-4 h-4 text-[var(--ok)] shrink-0" />
              ) : activeSeverity === 'warning' ? (
                <ShieldAlert className="w-4 h-4 text-[#E9C46A] shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-[#DF5A49] shrink-0" />
              )}
              <span className="text-[14px] font-semibold text-[var(--ink)]">
                {selectedSystem ? activeSystemInfo.label : 'General Anatomy & Endocrine Regulation'}
              </span>
            </div>
            <span className="text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded-full bg-white/30 text-[var(--ink-muted)]">
              {selectedSystem ? activeSystemInfo.shortTag : 'NOMINAL'}
            </span>
          </div>

          {selectedSystem === 'urogenital' && privacyMode ? (
            <p className="text-[13px] text-[var(--accent)] mt-1 font-medium">
              Intimate telemetry masked by Privacy Lock. Toggle lock in top navigation.
            </p>
          ) : selectedSystem ? (
            <div className="mt-1 space-y-0.5">
              <p className="text-[13px] text-[var(--ink-muted)] leading-snug">
                <strong className="font-semibold text-[var(--ink)]">Why measured:</strong> {activeSystemInfo.whyMeasured}
              </p>
              <p className="text-[13px] text-[var(--accent)] leading-snug flex items-start gap-1">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span><strong>Self-check:</strong> {activeSystemInfo.selfExamTip}</span>
              </p>
            </div>
          ) : (
            <div className="mt-1 space-y-0.5 text-[13px] text-[var(--ink-muted)]">
              <p>Basal Temperature: <strong className="text-[var(--ink)]">{bodyTemp.toFixed(1)} °C</strong></p>
              <p className="text-[var(--accent)]">Your Normal Baseline: {baselineTemp.toFixed(1)} °C · {tempStatusText}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
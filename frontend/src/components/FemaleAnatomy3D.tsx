import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { RotateCcw, ZoomIn, ZoomOut, ShieldAlert, CheckCircle2, Info, Loader2 } from 'lucide-react';
import type { BodySystemId, Severity } from '@/types/hera';
import femaleAnatomyUrl from '@/assets/female_anatomy.fbx?url';

interface SystemConfig {
  id: BodySystemId;
  label: string;
  shortTag: string;
  yPos: number;
  zPos: number;
  xPos: number;
  whyMeasured: string;
  selfExamTip: string;
}

const BODY_SYSTEMS: SystemConfig[] = [
  {
    id: 'neuro-ocular',
    label: 'Neuro-Ocular & Cabin Differential',
    shortTag: 'SANS / CO2',
    yPos: 0.78,
    xPos: 0.04,
    zPos: 0.12,
    whyMeasured:
      'Separates cephalad fluid shift (SANS) and cabin CO2 pockets from estrogen-related headaches.',
    selfExamTip:
      'Run 20-sec Amsler visual grid check and log intraocular pressure if near-vision blurs.',
  },
  {
    id: 'cardiovascular',
    label: 'Cardiovascular & Venous Return',
    shortTag: 'VTE / HR',
    yPos: 0.34,
    xPos: 0.06,
    zPos: 0.14,
    whyMeasured:
      'Tracks venous stasis in 0g combined with exogenous estrogen clotting dynamics.',
    selfExamTip:
      'Measure calf circumference & perform guided jugular/femoral Doppler sweep if alerted.',
  },
  {
    id: 'skeletal',
    label: 'Skeletal & Endocrine Bone Buffer',
    shortTag: 'BMD / ARED',
    yPos: 0.04,
    xPos: -0.05,
    zPos: 0.11,
    whyMeasured:
      'Balances estrogen osteoprotection against microgravity bone demineralization.',
    selfExamTip:
      'Complete 60 min resistive loading on ARED and verify Vitamin D3 + Calcium intake.',
  },
  {
    id: 'urogenital',
    label: 'Microbiome & Urogenital Immunity',
    shortTag: 'pH / FLORA',
    yPos: -0.22,
    xPos: 0.0,
    zPos: 0.13,
    whyMeasured:
      'Monitors urogenital pH shifts caused by continuous OCPs + spaceflight immune modulation.',
    selfExamTip:
      'Log weekly colorimetric pH strip & onboard swab inside your private encrypted vault.',
  },
];

interface ProjectedPoint {
  id: BodySystemId;
  x: number;
  y: number;
  visible: boolean;
}

interface FemaleAnatomy3DProps {
  selectedSystem: BodySystemId;
  onSelectSystem: (sys: BodySystemId) => void;
  systemSeverities: Record<BodySystemId, Severity>;
  co2Level: number;
  bodyTemp: number;
  baselineTemp: number;
  privacyMode: boolean;
  modelUrl?: string;
  useHolographicMaterial?: boolean;
}

export function FemaleAnatomy3D({
  selectedSystem,
  onSelectSystem,
  systemSeverities,
  co2Level,
  bodyTemp,
  baselineTemp,
  privacyMode,
  modelUrl = femaleAnatomyUrl,
  useHolographicMaterial = true,
}: FemaleAnatomy3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [projectedPoints, setProjectedPoints] = useState<ProjectedPoint[]>([]);
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const zoomRef = useRef<number>(3.35);
  const targetRotYRef = useRef<number>(0.15);
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseXRef = useRef<number>(0);
  const selectedRef = useRef<BodySystemId>(selectedSystem);
  const severitiesRef = useRef<Record<BodySystemId, Severity>>(systemSeverities);

  selectedRef.current = selectedSystem;
  severitiesRef.current = systemSeverities;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setIsLoadingModel(true);
    setLoadError(null);

    const scene = new THREE.Scene();

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 460;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    camera.position.set(0, 0.05, zoomRef.current);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xfff7f4, 1.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(2.4, 3.2, 3.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xdf5a49, 0.85);
    rimLight.position.set(-2.6, 1.4, -2.0);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x2a9d8f, 0.45);
    fillLight.position.set(2.0, -1.8, 1.5);
    scene.add(fillLight);

    const figureGroup = new THREE.Group();
    scene.add(figureGroup);

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf4e3dd,
      roughness: 0.38,
      metalness: 0.04,
      clearcoat: 0.35,
      clearcoatRoughness: 0.3,
      transparent: true,
      opacity: 0.9,
    });

    const loader = new FBXLoader();
    let loadedModel: THREE.Group | null = null;

    loader.load(
      modelUrl,
      (fbx) => {
        loadedModel = fbx;

        // 1. Aplicar material holográfico translúcido si está activado
        if (useHolographicMaterial) {
          fbx.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.material = bodyMaterial;
            }
          });
        }

        // Si el FBX viene tumbado en el suelo, descomenta la siguiente línea:
        // fbx.rotation.x = -Math.PI / 2;

        // 2. Normalizar escala (de cm a unidades de escena) y centrar
        const box = new THREE.Box3().setFromObject(fbx);
        const size = new THREE.Vector3();
        box.getSize(size);

        const targetHeight = 2.18;
        const scaleFactor = size.y > 0 ? targetHeight / size.y : 1;
        fbx.scale.setScalar(scaleFactor);

        // Recalcular caja tras escalar para apoyar los pies en baseRing1 (y = -1.28)
        const scaledBox = new THREE.Box3().setFromObject(fbx);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);

        fbx.position.x = -scaledCenter.x;
        fbx.position.z = -scaledCenter.z;
        fbx.position.y = -1.28 - scaledBox.min.y;

        figureGroup.add(fbx);
        setIsLoadingModel(false);
      },
      undefined,
      (error) => {
        console.error('Error cargando modelo FBX:', error);
        setLoadError('No se pudo cargar el modelo 3D (.fbx).');
        setIsLoadingModel(false);
      }
    );

    const ringGeo1 = new THREE.RingGeometry(0.46, 0.472, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xdf5a49,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.32,
    });
    const baseRing1 = new THREE.Mesh(ringGeo1, ringMat);
    baseRing1.rotation.x = Math.PI / 2;
    baseRing1.position.y = -1.28;
    figureGroup.add(baseRing1);

    const ringGeo2 = new THREE.RingGeometry(0.58, 0.586, 64);
    const baseRing2 = new THREE.Mesh(
      ringGeo2,
      new THREE.MeshBasicMaterial({
        color: 0x6b4c7a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.22,
      })
    );
    baseRing2.rotation.x = Math.PI / 2;
    baseRing2.position.y = -1.28;
    figureGroup.add(baseRing2);

    const scanRingGeo = new THREE.RingGeometry(0.28, 0.34, 64);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0xdf5a49,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanRing.rotation.x = Math.PI / 2;
    scanRing.position.y = 0.34;
    figureGroup.add(scanRing);

    const hotspotMeshes: Record<BodySystemId, THREE.Mesh> = {} as Record<BodySystemId, THREE.Mesh>;
    const hotspotHalos: Record<BodySystemId, THREE.Mesh> = {} as Record<BodySystemId, THREE.Mesh>;

    BODY_SYSTEMS.forEach((sys) => {
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.032, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0x2a9d8f })
      );
      core.position.set(sys.xPos, sys.yPos, sys.zPos);
      figureGroup.add(core);
      hotspotMeshes[sys.id] = core;

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.062, 20, 20),
        new THREE.MeshBasicMaterial({
          color: 0x2a9d8f,
          transparent: true,
          opacity: 0.28,
        })
      );
      halo.position.set(sys.xPos, sys.yPos, sys.zPos);
      figureGroup.add(halo);
      hotspotHalos[sys.id] = halo;
    });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 420;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId = 0;
    const clock = new THREE.Clock();

    const getSeverityHex = (sev: Severity): number => {
      if (sev === 'critical') return 0xd93829;
      if (sev === 'warning') return 0xe29d38;
      return 0x2a9d8f;
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      figureGroup.position.y = 0.14 + Math.sin(t * 1.4) * 0.025;

      if (!isDraggingRef.current) {
        targetRotYRef.current = Math.sin(t * 0.45) * 0.22;
      }
      figureGroup.rotation.y += (targetRotYRef.current - figureGroup.rotation.y) * 0.06;

      camera.position.z += (zoomRef.current - camera.position.z) * 0.08;

      const activeCfg = BODY_SYSTEMS.find((s) => s.id === selectedRef.current) ?? BODY_SYSTEMS[1];
      scanRing.position.y += (activeCfg.yPos - scanRing.position.y) * 0.1;
      const activeColor = getSeverityHex(severitiesRef.current[activeCfg.id]);
      scanRingMat.color.setHex(activeColor);

      const w = container.clientWidth || 420;
      const h = container.clientHeight || 460;
      const nextProjected: ProjectedPoint[] = [];

      BODY_SYSTEMS.forEach((sys, idx) => {
        const sev = severitiesRef.current[sys.id];
        const hex = getSeverityHex(sev);
        const isSelected = sys.id === selectedRef.current;

        const core = hotspotMeshes[sys.id];
        const halo = hotspotHalos[sys.id];
        (core.material as THREE.MeshBasicMaterial).color.setHex(hex);
        (halo.material as THREE.MeshBasicMaterial).color.setHex(hex);

        const pulse = 1 + Math.sin(t * 3.5 + idx) * (isSelected ? 0.35 : 0.18);
        halo.scale.setScalar(isSelected ? pulse * 1.35 : pulse);

        const worldVec = new THREE.Vector3();
        core.getWorldPosition(worldVec);
        worldVec.project(camera);

        nextProjected.push({
          id: sys.id,
          x: (worldVec.x * 0.5 + 0.5) * w,
          y: (-worldVec.y * 0.5 + 0.5) * h,
          visible: worldVec.z < 1,
        });
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
      bodyMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl, useHolographicMaterial]);

  const activeSystemInfo =
    BODY_SYSTEMS.find((s) => s.id === selectedSystem) ?? BODY_SYSTEMS[1];
  const activeSeverity = systemSeverities[selectedSystem];
  const tempDelta = (bodyTemp - baselineTemp).toFixed(1);
  const formattedDelta = Number(tempDelta) >= 0 ? `+${tempDelta}°C` : `${tempDelta}°C`;

  return (
    <div className="relative w-full h-[460px] select-none">
      {isLoadingModel && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#E6DFDA] shadow-sm text-xs text-[#5A5054]">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#DF5A49]" />
            <span>Cargando anatomía 3D...</span>
          </div>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="bg-red-50/95 text-[#D93829] px-3.5 py-2 rounded-xl border border-red-200 text-xs font-medium">
            {loadError}
          </div>
        </div>
      )}

      {/* Top-right 3D camera controls */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-[#E6DFDA] shadow-xs">
        <button
          type="button"
          onClick={() => {
            zoomRef.current = Math.max(2.3, zoomRef.current - 0.35);
          }}
          className="p-1 text-[#5A5054] hover:text-[#DF5A49] transition-colors cursor-pointer"
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            zoomRef.current = Math.min(4.2, zoomRef.current + 0.35);
          }}
          className="p-1 text-[#5A5054] hover:text-[#DF5A49] transition-colors cursor-pointer"
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            zoomRef.current = 3.35;
            targetRotYRef.current = 0.15;
          }}
          className="p-1 text-[#5A5054] hover:text-[#DF5A49] transition-colors cursor-pointer"
          title="Reset orientation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Left floating telemetry callout */}
      <div className="absolute top-12 left-4 z-10 pointer-events-none">
        <div className="text-[11px] font-medium uppercase tracking-wider text-[#7A6F73]">
          Cabin CO₂ Atmosphere
        </div>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span
            className={`text-3xl font-light tabular-nums ${
              co2Level > 0.5 ? 'text-[#DF5A49] font-medium' : 'text-[#1A1517]'
            }`}
          >
            {co2Level.toFixed(2)}%
          </span>
        </div>
        <div className="text-[11px] text-[#7A6F73] mt-0.5">
          {co2Level > 0.5 ? 'Elevated · Check airflow' : 'Nominal ECLSS loop'}
        </div>
      </div>

      {/* Right floating telemetry callout */}
      <div className="absolute top-44 right-4 z-10 text-right pointer-events-none">
        <div className="text-[11px] font-medium uppercase tracking-wider text-[#7A6F73]">
          Basal Body Temp
        </div>
        <div className="flex items-baseline justify-end gap-1 mt-0.5">
          <span className="text-xs text-[#7A6F73] font-mono-tech">Δ {formattedDelta}</span>
          <span className="text-3xl font-light tabular-nums text-[#1A1517]">
            {bodyTemp.toFixed(1)}°
          </span>
        </div>
        <div className="text-[11px] text-[#6B4C7A] font-medium mt-0.5">
          vs. Her {baselineTemp.toFixed(1)}°C Baseline
        </div>
      </div>

      {/* Three.js WebGL Mount */}
      <div
        ref={mountRef}
        onPointerDown={(e) => {
          isDraggingRef.current = true;
          prevMouseXRef.current = e.clientX;
        }}
        onPointerMove={(e) => {
          if (!isDraggingRef.current) return;
          const dx = e.clientX - prevMouseXRef.current;
          prevMouseXRef.current = e.clientX;
          targetRotYRef.current += dx * 0.012;
        }}
        onPointerUp={() => {
          isDraggingRef.current = false;
        }}
        onPointerLeave={() => {
          isDraggingRef.current = false;
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* 2D Projected Interactive Hotspot Pins */}
      {projectedPoints.map((pt) => {
        if (!pt.visible) return null;
        const cfg = BODY_SYSTEMS.find((s) => s.id === pt.id)!;
        const sev = systemSeverities[pt.id];
        const isSelected = pt.id === selectedSystem;
        const isIntimateLocked = pt.id === 'urogenital' && privacyMode;

        const badgeColor =
          sev === 'critical'
            ? 'bg-[#D93829] text-white border-[#D93829]'
            : sev === 'warning'
              ? 'bg-[#E29D38] text-white border-[#E29D38]'
              : isSelected
                ? 'bg-[#181113] text-white border-[#181113]'
                : 'bg-white/90 text-[#1A1517] border-[#E4DDD8] hover:border-[#DF5A49]';

        return (
          <button
            key={pt.id}
            type="button"
            onClick={() => onSelectSystem(pt.id)}
            style={{
              left: `${pt.x}px`,
              top: `${pt.y}px`,
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-medium border shadow-sm transition-all cursor-pointer ${badgeColor}`}
          >
            {isIntimateLocked ? 'PRIVATE' : cfg.shortTag}
          </button>
        );
      })}

      {/* Just-in-Time Self-Assessment Explainer Card */}
      <div className="absolute bottom-2 left-3 right-3 z-20 bg-white/92 backdrop-blur-md rounded-2xl p-3 border border-[#E6DFDA] shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {activeSeverity === 'info' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2A9D8F] shrink-0" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-[#DF5A49] shrink-0" />
            )}
            <span className="text-xs font-semibold text-[#1A1517]">
              {activeSystemInfo.label}
            </span>
          </div>
          <span className="text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded-full bg-[#F5F3F0] text-[#5A5054]">
            {activeSystemInfo.shortTag}
          </span>
        </div>

        {selectedSystem === 'urogenital' && privacyMode ? (
          <p className="text-[11px] text-[#6B4C7A] mt-1 font-medium">
            Intimate telemetry &amp; pH logs masked by Onboard Privacy Lock. Toggle lock in top bar to inspect.
          </p>
        ) : (
          <div className="mt-1 space-y-0.5">
            <p className="text-[11px] text-[#4A4145] leading-snug">
              <strong className="font-semibold text-[#1A1517]">Why monitored:</strong>{' '}
              {activeSystemInfo.whyMeasured}
            </p>
            <p className="text-[11px] text-[#6B4C7A] leading-snug flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 shrink-0" />
              <span>
                <strong>Self-check:</strong> {activeSystemInfo.selfExamTip}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
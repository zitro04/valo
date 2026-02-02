import { Suspense, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, PointerLockControls } from '@react-three/drei'

const BIND_MODEL_URL = '/bind_full_map.glb'

function BindModel({ onLoaded }) {
  const { scene } = useGLTF(BIND_MODEL_URL)
  const [bounds, setBounds] = useState(null)

  useEffect(() => {
    if (!scene) return
    scene.updateMatrixWorld(true)
    const meshes = []
    scene.traverse((child) => { if (child.isMesh) meshes.push(child) })
    if (meshes.length === 0) {
      const box = new THREE.Box3().setFromObject(scene)
      const center = new THREE.Vector3()
      box.getCenter(center)
      setBounds({ position: [-center.x, -center.y, -center.z], scale: 1 })
      onLoaded?.({ suggestedCameraPosition: [8, 6, 8] })
      return
    }
    const boxes = meshes.map((m) => {
      const b = new THREE.Box3().setFromObject(m)
      const s = b.getSize(new THREE.Vector3())
      return { box: b, vol: s.x * s.y * s.z }
    })
    boxes.sort((a, b) => b.vol - a.vol)
    const sinElMasGrande = boxes.slice(1)
    let bboxMapa = new THREE.Box3().setFromObject(scene)
    if (sinElMasGrande.length > 0) {
      bboxMapa = sinElMasGrande[0].box.clone()
      for (let i = 1; i < sinElMasGrande.length; i++) bboxMapa.union(sinElMasGrande[i].box)
    }
    const center = new THREE.Vector3()
    const size = new THREE.Vector3()
    bboxMapa.getCenter(center)
    bboxMapa.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    let scale = 8000 / maxDim
    scale = Math.max(1, Math.min(10000, scale))

    const worldW = size.x * scale
    const worldH = size.y * scale
    const worldD = size.z * scale
    const radius = 0.5 * Math.sqrt(worldW * worldW + worldH * worldH + worldD * worldD) || 4000
    const distance = radius * 1.4
    const suggestedCameraPosition = [
      distance * 0.7,
      distance * 0.5,
      distance * 0.7,
    ]

    setBounds({
      position: [-center.x, -center.y, -center.z],
      scale,
    })
    onLoaded?.({ suggestedCameraPosition })
  }, [scene])

  useEffect(() => {
    if (!scene) return
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          mats.forEach((m) => {
            m.side = THREE.DoubleSide
            m.needsUpdate = true
          })
        }
      }
    })
  }, [scene])

  if (!bounds) {
    return <primitive object={scene} />
  }

  return (
    <group position={bounds.position} scale={bounds.scale}>
      <primitive object={scene} />
    </group>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[20, 20, 20]} />
      <meshBasicMaterial color="#00f0ff" wireframe />
    </mesh>
  )
}

function SceneSetup() {
  return (
    <>
      <color attach="background" args={['#1e1e28']} />
      <ambientLight intensity={0.6} color="#c8c0b8" />
      <hemisphereLight args={['#706050', '#282830', 0.55]} />
      <directionalLight position={[80, 120, 80]} intensity={1} color="#e8e0d8" />
      <directionalLight position={[-50, 80, -50]} intensity={0.45} color="#b8a898" />
    </>
  )
}

function CameraPositionToRef({ cameraPosRef }) {
  const { camera } = useThree()
  useFrame(() => {
    if (cameraPosRef?.current) cameraPosRef.current.copy(camera.position)
  })
  return null
}

function SetCameraPosition({ position }) {
  const { camera } = useThree()
  useEffect(() => {
    if (position && camera) camera.position.copy(position)
  }, [position, camera])
  return null
}

const MOVE_SPEED = 120
const SPRINT_MULT = 2.2
const VERTICAL_SPEED = 80

function FirstPersonMovement({ enabled }) {
  const { camera } = useThree()
  const keys = useRef({ w: false, a: false, s: false, d: false, space: false, ctrl: false, shift: false })

  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (e) => {
      const k = e.key.toLowerCase()
      if (k === 'w') keys.current.w = true
      if (k === 'a') keys.current.a = true
      if (k === 's') keys.current.s = true
      if (k === 'd') keys.current.d = true
      if (k === ' ') { keys.current.space = true; e.preventDefault() }
      if (k === 'control') keys.current.ctrl = true
      if (k === 'shift') keys.current.shift = true
    }
    const onKeyUp = (e) => {
      const k = e.key.toLowerCase()
      if (k === 'w') keys.current.w = false
      if (k === 'a') keys.current.a = false
      if (k === 's') keys.current.s = false
      if (k === 'd') keys.current.d = false
      if (k === ' ') keys.current.space = false
      if (k === 'control') keys.current.ctrl = false
      if (k === 'shift') keys.current.shift = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [enabled])

  useFrame((_, delta) => {
    if (!enabled) return
    const speed = MOVE_SPEED * delta
    const sprint = keys.current.shift ? SPRINT_MULT : 1
    const move = speed * sprint
    const vertical = VERTICAL_SPEED * delta * sprint

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
    forward.y = 0
    right.y = 0
    forward.normalize()
    right.normalize()

    if (keys.current.w) camera.position.addScaledVector(forward, move)
    if (keys.current.s) camera.position.addScaledVector(forward, -move)
    if (keys.current.d) camera.position.addScaledVector(right, move)
    if (keys.current.a) camera.position.addScaledVector(right, -move)
    if (keys.current.space) camera.position.y += vertical
    if (keys.current.ctrl) camera.position.y -= vertical
  })

  return null
}

function InitialCameraFit({ suggestedPosition }) {
  const { camera } = useThree()
  const applied = useRef(false)
  useEffect(() => {
    if (!suggestedPosition || applied.current) return
    camera.position.set(suggestedPosition[0], suggestedPosition[1], suggestedPosition[2])
    applied.current = true
  }, [suggestedPosition, camera])
  return null
}

function SceneContent({ cameraPosRef, firstPersonMode, fpPosition, suggestedCameraPosition, onExitFirstPerson, onModelLoaded }) {
  return (
    <>
      <SceneSetup />
      {suggestedCameraPosition && <InitialCameraFit suggestedPosition={suggestedCameraPosition} />}
      <directionalLight position={[80, 120, 80]} intensity={1} color="#e8e0d8" />
      <directionalLight position={[-50, 80, -50]} intensity={0.5} color="#b8a898" />
      <CameraPositionToRef cameraPosRef={cameraPosRef} />
      <Suspense fallback={<LoadingFallback />}>
        <BindModel onLoaded={onModelLoaded} />
      </Suspense>
      {firstPersonMode ? (
        <>
          <SetCameraPosition position={fpPosition} />
          <FirstPersonMovement enabled />
          <PointerLockControls onUnlock={() => onExitFirstPerson?.()} />
        </>
      ) : (
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={50}
          maxDistance={20000}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />
      )}
    </>
  )
}

export default function Map3DViewer({ onClose }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [firstPersonMode, setFirstPersonMode] = useState(false)
  const [fpPosition, setFpPosition] = useState(null)
  const [suggestedCameraPosition, setSuggestedCameraPosition] = useState(null)
  const cameraPosRef = useRef(null)

  const enterFirstPerson = () => {
    const pos = cameraPosRef.current
    setFpPosition(pos ? pos.clone() : new THREE.Vector3(0, 2, 8))
    setFirstPersonMode(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#252530]">
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-[var(--valorant-cyan)]/20 bg-[var(--valorant-dark)] px-4">
        <h2 className="text-lg font-bold text-[var(--valorant-cyan)]">
          Bind — Vista 3D
        </h2>
        <div className="flex items-center gap-2">
          {!firstPersonMode && (
            <button
              type="button"
              onClick={enterFirstPerson}
              className="rounded-lg border border-[var(--valorant-cyan)]/40 bg-[var(--valorant-cyan)]/10 px-3 py-2 min-h-[44px] text-sm font-medium text-[var(--valorant-cyan)] transition hover:bg-[var(--valorant-cyan)]/20 touch-target"
            >
              Vista primera persona
            </button>
          )}
          {firstPersonMode && (
            <span className="text-xs text-gray-400">WASD mover · Space/Ctrl subir/bajar · Shift correr · ESC salir</span>
          )}
          <p className="hidden text-sm text-gray-400 sm:block">
            {firstPersonMode ? 'Ratón: mirar · WASD: mover' : 'Arrastra · Scroll · Clic derecho'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-[var(--valorant-panel)] px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white transition hover:bg-white/10 touch-target"
        >
          Cerrar
        </button>
      </header>

      <div
        className="absolute left-0 right-0 bottom-0 bg-[#252530]"
        style={{ top: '3.5rem' }}
      >
        {error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#1a1a1f] p-4">
            <p className="text-center text-[var(--valorant-red)] font-medium">{error}</p>
            <button type="button" onClick={onClose} className="rounded-lg bg-[var(--valorant-panel)] px-4 py-2 text-sm text-white">
              Cerrar
            </button>
          </div>
        )}
        {loading && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1a1a1f]">
            <p className="text-[var(--valorant-cyan)] font-medium">Cargando mapa Bind…</p>
          </div>
        )}
        <Canvas
          data-canvas
          shadows
          camera={{ position: [4000, 3000, 4000], fov: 65, near: 0.1, far: 100000 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'default',
          }}
          onCreated={({ gl, scene }) => {
            gl.setClearColor('#252530')
            scene.background = new THREE.Color('#252530')
          }}
          style={{ display: 'block', width: '100%', height: '100%' }}
          frameloop="always"
        >
          <SceneContent
            cameraPosRef={cameraPosRef}
            firstPersonMode={firstPersonMode}
            fpPosition={fpPosition}
            suggestedCameraPosition={suggestedCameraPosition}
            onExitFirstPerson={() => setFirstPersonMode(false)}
            onModelLoaded={(data) => {
              setLoading(false)
              if (data?.suggestedCameraPosition) setSuggestedCameraPosition(data.suggestedCameraPosition)
            }}
          />
        </Canvas>
      </div>
    </div>
  )
}

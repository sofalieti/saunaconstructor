import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { useSaunaStore } from '../../store/saunaStore'
import { SCHEMATIC } from '../../utils/schematicTheme'
import { BenchMesh } from './BenchMesh'
import { HeaterMesh } from './HeaterMesh'
import { Room } from './Room'

function CameraSetup() {
  const room = useSaunaStore((s) => s.room)
  const { camera, size } = useThree()

  useEffect(() => {
    const maxDim = Math.max(room.width, room.depth, room.height)
    if ('isOrthographicCamera' in camera && camera.isOrthographicCamera) {
      const aspect = size.width / size.height
      const frustum = maxDim * 1.15
      camera.left = (-frustum * aspect) / 2
      camera.right = (frustum * aspect) / 2
      camera.top = frustum / 2
      camera.bottom = -frustum / 2
      camera.near = 0.1
      camera.far = maxDim * 10
      camera.position.set(maxDim * 0.6, maxDim * 1.35, maxDim * 0.85)
      camera.lookAt(0, room.height * 0.2, 0)
      camera.updateProjectionMatrix()
    }
  }, [room, camera, size])

  return null
}

function SceneContent() {
  const benches = useSaunaStore((s) => s.benches)
  const heaters = useSaunaStore((s) => s.heaters)
  const room = useSaunaStore((s) => s.room)
  const clearSelection = useSaunaStore((s) => s.clearSelection)

  return (
    <>
      <color attach="background" args={[SCHEMATIC.background]} />
      <OrthographicCamera makeDefault position={[80, 110, 55]} near={0.1} far={2000} />
      <CameraSetup />
      <ambientLight intensity={1} />
      <Room />
      {benches.map((b) => (
        <BenchMesh key={b.id} bench={b} />
      ))}
      {heaters.map((h) => (
        <HeaterMesh key={h.id} heater={h} />
      ))}
      <mesh
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={() => clearSelection()}
      >
        <planeGeometry args={[500, 500]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      <OrbitControls
        makeDefault
        target={[0, room.height * 0.15, 0]}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2.05}
        enablePan
        enableDamping
        dampingFactor={0.08}
      />
    </>
  )
}

export function SaunaScene() {
  const setExportCanvas = useSaunaStore((s) => s.setExportCanvas)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  return (
    <Canvas
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      onCreated={({ gl }) => {
        canvasRef.current = gl.domElement
        setExportCanvas(gl.domElement)
      }}
      style={{ width: '100%', height: '100%', background: SCHEMATIC.background }}
    >
      <SceneContent />
    </Canvas>
  )
}

import { useState } from 'react'
import { Edges } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { BENCH_WALL_GAP } from '../../data/benchDefaults'
import { useSaunaStore } from '../../store/saunaStore'
import type { Bench } from '../../types/sauna'
import {
  wallRotationY,
  wallToWorld,
  worldToWallOffset,
} from '../../utils/geometry'
import { SCHEMATIC } from '../../utils/schematicTheme'
import { snapToGrid } from '../../utils/snap'

interface BenchMeshProps {
  bench: Bench
}

export function BenchMesh({ bench }: BenchMeshProps) {
  const room = useSaunaStore((s) => s.room)
  const selection = useSaunaStore((s) => s.selection)
  const setSelection = useSaunaStore((s) => s.setSelection)
  const updateBench = useSaunaStore((s) => s.updateBench)
  const [dragging, setDragging] = useState(false)

  const selected = selection.kind === 'bench' && selection.id === bench.id
  const fill = selected ? SCHEMATIC.benchSelected : SCHEMATIC.benchFill

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setSelection({ kind: 'bench', id: bench.id })
    setDragging(true)
  }

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging) return
    e.stopPropagation()
    const point = e.point

    if (bench.wall === 'free') {
      updateBench(bench.id, {
        positionAlongWall: snapToGrid(point.x + room.width / 2),
      })
      return
    }

    const offset = snapToGrid(
      worldToWallOffset(bench.wall, point.x, point.z, room),
    )
    updateBench(bench.id, { positionAlongWall: offset })
  }

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setDragging(false)
  }

  const pointerProps = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }

  /** План на полу — всегда виден сверху */
  const renderFootprint = (
    cx: number,
    cz: number,
    rotY: number,
    planW: number,
    planD: number,
  ) => (
    <group position={[cx, 0.25, cz]} rotation={[0, rotY, 0]}>
      <mesh {...pointerProps}>
        <boxGeometry args={[planW, 0.4, planD]} />
        <meshBasicMaterial color={fill} />
        <Edges color={SCHEMATIC.benchEdge} threshold={15} />
      </mesh>
    </group>
  )

  if (bench.wall === 'free') {
    const x = -room.width / 2 + bench.positionAlongWall
    const z = -room.depth / 2 + bench.depth / 2 + 4
    const rot = (bench.rotation * Math.PI) / 180
    return (
      <group>
        {renderFootprint(x, z, rot, bench.length, bench.depth)}
        <group position={[x, 0, z]} rotation={[0, rot, 0]}>
          <mesh position={[0, bench.lowerHeight / 2, 0]} {...pointerProps}>
            <boxGeometry args={[bench.length, bench.lowerHeight, bench.depth]} />
            <meshBasicMaterial color={fill} transparent opacity={0.35} />
            <Edges color={SCHEMATIC.benchEdge} />
          </mesh>
          {bench.tiers === 2 && (
            <mesh
              position={[
                0,
                bench.lowerHeight + (bench.upperHeight - bench.lowerHeight) / 2,
                0,
              ]}
            >
              <boxGeometry
                args={[
                  bench.length,
                  bench.upperHeight - bench.lowerHeight,
                  bench.depth,
                ]}
              />
              <meshBasicMaterial color={fill} transparent opacity={0.35} />
              <Edges color={SCHEMATIC.benchEdge} />
            </mesh>
          )}
        </group>
      </group>
    )
  }

  const wall = bench.wall
  const [wx, , wz] = wallToWorld(
    wall,
    bench.positionAlongWall,
    room,
    BENCH_WALL_GAP + bench.depth / 2,
  )
  const rotY = wallRotationY(wall)
  const planW = wall === 'back' || wall === 'front' ? bench.length : bench.depth
  const planD = wall === 'back' || wall === 'front' ? bench.depth : bench.length

  const lowerH = bench.lowerHeight
  const upperSpan = bench.upperHeight - bench.lowerHeight

  return (
    <group>
      {renderFootprint(wx, wz, rotY, planW, planD)}
      <group position={[wx, 0, wz]} rotation={[0, rotY, 0]}>
        <mesh position={[0, lowerH / 2, 0]} {...pointerProps}>
          <boxGeometry args={[bench.length, lowerH, bench.depth]} />
          <meshBasicMaterial color={fill} />
          <Edges color={SCHEMATIC.benchEdge} threshold={15} />
        </mesh>
        {bench.tiers === 2 && (
          <mesh position={[0, bench.lowerHeight + upperSpan / 2, 0]}>
            <boxGeometry args={[bench.length, upperSpan, bench.depth]} />
            <meshBasicMaterial color={fill} transparent opacity={0.9} />
            <Edges color={SCHEMATIC.benchEdge} threshold={15} />
          </mesh>
        )}
      </group>
    </group>
  )
}

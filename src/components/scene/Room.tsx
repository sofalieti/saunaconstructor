import { useMemo } from 'react'
import { Edges, Grid, Line } from '@react-three/drei'
import { useSaunaStore } from '../../store/saunaStore'
import type { WallId } from '../../types/sauna'
import { buildWallWithDoor } from '../../utils/geometry'
import { SCHEMATIC } from '../../utils/schematicTheme'

const WALLS: WallId[] = ['back', 'left', 'right', 'front']

export function Room() {
  const room = useSaunaStore((s) => s.room)
  const door = useSaunaStore((s) => s.door)

  const segments = useMemo(
    () => WALLS.flatMap((wall) => buildWallWithDoor(wall, room, door)),
    [room, door],
  )

  const gridSize = Math.max(room.width, room.depth) + 20
  const hw = room.width / 2
  const hd = room.depth / 2
  const outlinePoints: [number, number, number][] = [
    [-hw, 0.15, -hd],
    [hw, 0.15, -hd],
    [hw, 0.15, hd],
    [-hw, 0.15, hd],
    [-hw, 0.15, -hd],
  ]

  return (
    <group>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[room.width, room.depth]} />
        <meshBasicMaterial color={SCHEMATIC.floor} />
      </mesh>

      <Line points={outlinePoints} color={SCHEMATIC.wallEdge} lineWidth={2} />

      <Grid
        position={[0, 0.1, 0]}
        args={[gridSize, gridSize]}
        cellSize={6}
        cellThickness={0.4}
        cellColor={SCHEMATIC.floorGrid}
        sectionSize={12}
        sectionThickness={0.8}
        sectionColor={SCHEMATIC.floorGrid}
        fadeDistance={gridSize * 2}
        infiniteGrid={false}
      />

      {segments.map((seg, i) => (
        <mesh key={i} position={seg.position}>
          <boxGeometry args={seg.size} />
          <meshBasicMaterial
            color={seg.isDoorHeader ? SCHEMATIC.wallDoor : SCHEMATIC.wallFill}
            transparent={seg.isDoorHeader}
            opacity={seg.isDoorHeader ? 0.85 : 1}
          />
          <Edges color={SCHEMATIC.wallEdge} threshold={15} />
        </mesh>
      ))}
    </group>
  )
}

import { useState } from 'react'
import { Edges } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { getHeaterPreset } from '../../data/heaterPresets'
import { useSaunaStore } from '../../store/saunaStore'
import type { Heater } from '../../types/sauna'
import {
  wallRotationY,
  wallToWorld,
  worldToWallOffset,
} from '../../utils/geometry'
import { SCHEMATIC } from '../../utils/schematicTheme'
import { snapToGrid } from '../../utils/snap'

const PANEL_DEPTH = 1.5

interface HeaterMeshProps {
  heater: Heater
}

export function HeaterMesh({ heater }: HeaterMeshProps) {
  const room = useSaunaStore((s) => s.room)
  const selection = useSaunaStore((s) => s.selection)
  const setSelection = useSaunaStore((s) => s.setSelection)
  const updateHeater = useSaunaStore((s) => s.updateHeater)
  const [dragging, setDragging] = useState(false)

  const preset = getHeaterPreset(heater.presetId)
  if (!preset) return null

  const selected = selection.kind === 'heater' && selection.id === heater.id
  const fill =
    preset.type === 'carbon' ? SCHEMATIC.heaterCarbon : SCHEMATIC.heaterCeramic

  const [wx, , wz] = wallToWorld(
    heater.wall,
    heater.offsetAlongWall,
    room,
    PANEL_DEPTH / 2 + 0.5,
  )

  const rotY = wallRotationY(heater.wall)
  const centerY = heater.heightFromFloor + preset.height / 2

  const size: [number, number, number] =
    heater.wall === 'back' || heater.wall === 'front'
      ? [preset.width, preset.height, PANEL_DEPTH]
      : [PANEL_DEPTH, preset.height, preset.width]

  const planW =
    heater.wall === 'back' || heater.wall === 'front'
      ? preset.width
      : PANEL_DEPTH
  const planD =
    heater.wall === 'back' || heater.wall === 'front'
      ? PANEL_DEPTH
      : preset.width

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setSelection({ kind: 'heater', id: heater.id })
    setDragging(true)
  }

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging) return
    e.stopPropagation()
    const offset = snapToGrid(
      worldToWallOffset(heater.wall, e.point.x, e.point.z, room),
    )
    updateHeater(heater.id, { offsetAlongWall: offset })
  }

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setDragging(false)
  }

  const pointerProps = { onPointerDown, onPointerMove, onPointerUp }

  return (
    <group>
      <group position={[wx, 0.3, wz]} rotation={[0, rotY, 0]}>
        <mesh {...pointerProps}>
          <boxGeometry args={[planW, 0.35, planD]} />
          <meshBasicMaterial
            color={fill}
            transparent
            opacity={selected ? 1 : 0.85}
          />
          <Edges
            color={selected ? '#2563eb' : SCHEMATIC.heaterEdge}
            threshold={15}
          />
        </mesh>
      </group>
      <group position={[wx, centerY, wz]} rotation={[0, rotY, 0]}>
        <mesh {...pointerProps}>
          <boxGeometry args={size} />
          <meshBasicMaterial color={fill} />
          <Edges
            color={selected ? '#2563eb' : SCHEMATIC.heaterEdge}
            threshold={15}
          />
        </mesh>
      </group>
    </group>
  )
}

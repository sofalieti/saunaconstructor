import type { DoorConfig, RoomConfig, WallId } from '../types/sauna'
import { WALL_THICKNESS } from '../data/benchDefaults'

export function getWallLength(wall: WallId, room: RoomConfig): number {
  return wall === 'back' || wall === 'front' ? room.width : room.depth
}

export function clampDoorOffset(
  offset: number,
  doorWidth: number,
  wallLength: number,
): number {
  const maxOffset = Math.max(0, wallLength - doorWidth)
  return Math.min(maxOffset, Math.max(0, offset))
}

export function clampAlongWall(
  centerOffset: number,
  objectLength: number,
  wallLength: number,
): number {
  const half = objectLength / 2
  const min = half
  const max = wallLength - half
  if (min > max) return wallLength / 2
  return Math.min(max, Math.max(min, centerOffset))
}

export interface WallSegment {
  position: [number, number, number]
  size: [number, number, number]
  isDoorHeader?: boolean
}

export function buildWallWithDoor(
  wall: WallId,
  room: RoomConfig,
  door: DoorConfig,
): WallSegment[] {
  if (door.wall !== wall) {
    return [solidWallSegment(wall, room)]
  }

  const wallLength = getWallLength(wall, room)
  const dLeft = door.offsetAlongWall
  const dRight = wallLength - door.offsetAlongWall - door.width
  const headerH = room.height - door.height
  const segments: WallSegment[] = []

  const yBase = room.height / 2
  const t = WALL_THICKNESS

  if (wall === 'back' || wall === 'front') {
    const z = wall === 'back' ? -room.depth / 2 : room.depth / 2
    if (dLeft > 0) {
      segments.push({
        position: [-room.width / 2 + dLeft / 2, yBase, z],
        size: [dLeft, room.height, t],
      })
    }
    if (dRight > 0) {
      segments.push({
        position: [room.width / 2 - dRight / 2, yBase, z],
        size: [dRight, room.height, t],
      })
    }
    if (headerH > 0) {
      segments.push({
        position: [
          -room.width / 2 + door.offsetAlongWall + door.width / 2,
          door.height + headerH / 2,
          z,
        ],
        size: [door.width, headerH, t],
        isDoorHeader: true,
      })
    }
  } else if (wall === 'left') {
    const x = -room.width / 2
    if (dLeft > 0) {
      segments.push({
        position: [x, yBase, -room.depth / 2 + dLeft / 2],
        size: [t, room.height, dLeft],
      })
    }
    if (dRight > 0) {
      segments.push({
        position: [x, yBase, room.depth / 2 - dRight / 2],
        size: [t, room.height, dRight],
      })
    }
    if (headerH > 0) {
      segments.push({
        position: [
          x,
          door.height + headerH / 2,
          -room.depth / 2 + door.offsetAlongWall + door.width / 2,
        ],
        size: [t, headerH, door.width],
        isDoorHeader: true,
      })
    }
  } else {
    const x = room.width / 2
    if (dLeft > 0) {
      segments.push({
        position: [x, yBase, -room.depth / 2 + dLeft / 2],
        size: [t, room.height, dLeft],
      })
    }
    if (dRight > 0) {
      segments.push({
        position: [x, yBase, room.depth / 2 - dRight / 2],
        size: [t, room.height, dRight],
      })
    }
    if (headerH > 0) {
      segments.push({
        position: [
          x,
          door.height + headerH / 2,
          -room.depth / 2 + door.offsetAlongWall + door.width / 2,
        ],
        size: [t, headerH, door.width],
        isDoorHeader: true,
      })
    }
  }

  return segments
}

function solidWallSegment(wall: WallId, room: RoomConfig): WallSegment {
  const y = room.height / 2
  const t = WALL_THICKNESS
  if (wall === 'back') {
    return {
      position: [0, y, -room.depth / 2],
      size: [room.width, room.height, t],
    }
  }
  if (wall === 'front') {
    return {
      position: [0, y, room.depth / 2],
      size: [room.width, room.height, t],
    }
  }
  if (wall === 'left') {
    return {
      position: [-room.width / 2, y, 0],
      size: [t, room.height, room.depth],
    }
  }
  return {
    position: [room.width / 2, y, 0],
    size: [t, room.height, room.depth],
  }
}

/** World position of object center along a wall (inches, room centered at origin). */
export function wallToWorld(
  wall: WallId,
  offsetAlongWall: number,
  room: RoomConfig,
  depthFromWall: number,
): [number, number, number] {
  if (wall === 'back') {
    return [
      -room.width / 2 + offsetAlongWall,
      0,
      -room.depth / 2 + depthFromWall,
    ]
  }
  if (wall === 'front') {
    return [
      -room.width / 2 + offsetAlongWall,
      0,
      room.depth / 2 - depthFromWall,
    ]
  }
  if (wall === 'left') {
    return [
      -room.width / 2 + depthFromWall,
      0,
      -room.depth / 2 + offsetAlongWall,
    ]
  }
  return [
    room.width / 2 - depthFromWall,
    0,
    -room.depth / 2 + offsetAlongWall,
  ]
}

/** Convert world XZ hit to offset along wall. */
export function worldToWallOffset(
  wall: WallId,
  x: number,
  z: number,
  room: RoomConfig,
): number {
  if (wall === 'back' || wall === 'front') return x + room.width / 2
  return z + room.depth / 2
}

export function wallRotationY(wall: WallId): number {
  if (wall === 'back') return 0
  if (wall === 'front') return Math.PI
  if (wall === 'left') return Math.PI / 2
  return -Math.PI / 2
}

export function doorOverlapsHeater(
  door: DoorConfig,
  wall: WallId,
  offsetAlongWall: number,
  heaterWidth: number,
): boolean {
  if (door.wall !== wall) return false
  const hStart = offsetAlongWall - heaterWidth / 2
  const hEnd = offsetAlongWall + heaterWidth / 2
  const dStart = door.offsetAlongWall
  const dEnd = door.offsetAlongWall + door.width
  return hStart < dEnd && hEnd > dStart
}

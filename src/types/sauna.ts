export type WallId = 'back' | 'left' | 'right' | 'front'

export interface RoomConfig {
  width: number
  depth: number
  height: number
}

export interface DoorConfig {
  wall: WallId
  offsetAlongWall: number
  width: number
  height: number
}

export type BenchTier = 1 | 2

export interface Bench {
  id: string
  wall: WallId | 'free'
  tiers: BenchTier
  length: number
  depth: number
  lowerHeight: number
  upperHeight: number
  positionAlongWall: number
  rotation: 0 | 90 | 180 | 270
}

export type HeaterType = 'carbon' | 'ceramic'

export interface HeaterPreset {
  id: string
  type: HeaterType
  label: string
  width: number
  height: number
}

export interface Heater {
  id: string
  presetId: string
  wall: WallId
  offsetAlongWall: number
  heightFromFloor: number
}

export type SelectableId = string | null
export type SelectionKind = 'bench' | 'heater' | null

export interface Selection {
  kind: SelectionKind
  id: SelectableId
}

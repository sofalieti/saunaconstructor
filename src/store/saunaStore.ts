import { create } from 'zustand'
import { DEFAULT_BENCH } from '../data/benchDefaults'
import { HEATER_PRESETS } from '../data/heaterPresets'
import type {
  Bench,
  BenchTier,
  DoorConfig,
  Heater,
  HeaterType,
  RoomConfig,
  Selection,
  WallId,
} from '../types/sauna'
import {
  clampAlongWall,
  clampDoorOffset,
  getWallLength,
} from '../utils/geometry'
import { snapToGrid } from '../utils/snap'

const defaultRoom: RoomConfig = { width: 72, depth: 60, height: 84 }
const defaultDoor: DoorConfig = {
  wall: 'left',
  offsetAlongWall: 18,
  width: 24,
  height: 72,
}

function newId(): string {
  return crypto.randomUUID()
}

interface SaunaState {
  room: RoomConfig
  door: DoorConfig
  benches: Bench[]
  heaters: Heater[]
  selection: Selection
  exportCanvas: HTMLCanvasElement | null

  setRoom: (partial: Partial<RoomConfig>) => void
  setDoor: (partial: Partial<DoorConfig>) => void
  addBench: (wall: WallId | 'free', tiers: BenchTier) => void
  updateBench: (id: string, partial: Partial<Bench>) => void
  removeBench: (id: string) => void
  addHeater: (type: HeaterType, presetId: string, wall: WallId) => void
  updateHeater: (id: string, partial: Partial<Heater>) => void
  removeHeater: (id: string) => void
  setSelection: (selection: Selection) => void
  clearSelection: () => void
  setExportCanvas: (canvas: HTMLCanvasElement | null) => void
  deleteSelected: () => void
}

export const useSaunaStore = create<SaunaState>((set, get) => ({
  room: defaultRoom,
  door: defaultDoor,
  benches: [],
  heaters: [],
  selection: { kind: null, id: null },
  exportCanvas: null,

  setRoom: (partial) =>
    set((s) => {
      const room = { ...s.room, ...partial }
      const wallLen = getWallLength(s.door.wall, room)
      const door = {
        ...s.door,
        offsetAlongWall: clampDoorOffset(
          s.door.offsetAlongWall,
          s.door.width,
          wallLen,
        ),
      }
      return { room, door }
    }),

  setDoor: (partial) =>
    set((s) => {
      const door = { ...s.door, ...partial }
      const wallLen = getWallLength(door.wall, s.room)
      door.offsetAlongWall = clampDoorOffset(
        door.offsetAlongWall,
        door.width,
        wallLen,
      )
      return { door }
    }),

  addBench: (wall, tiers) =>
    set((s) => {
      const wallLen =
        wall === 'free' ? s.room.width : getWallLength(wall, s.room)
      const bench: Bench = {
        id: newId(),
        wall,
        tiers,
        length: DEFAULT_BENCH.length,
        depth: DEFAULT_BENCH.depth,
        lowerHeight: DEFAULT_BENCH.lowerHeight,
        upperHeight: DEFAULT_BENCH.upperHeight,
        positionAlongWall: wallLen / 2,
        rotation: 0,
      }
      return {
        benches: [...s.benches, bench],
        selection: { kind: 'bench', id: bench.id },
      }
    }),

  updateBench: (id, partial) =>
    set((s) => ({
      benches: s.benches.map((b) => {
        if (b.id !== id) return b
        const next = { ...b, ...partial }
        if (next.wall !== 'free') {
          const wallLen = getWallLength(next.wall, s.room)
          next.positionAlongWall = clampAlongWall(
            snapToGrid(next.positionAlongWall),
            next.length,
            wallLen,
          )
        }
        return next
      }),
    })),

  removeBench: (id) =>
    set((s) => ({
      benches: s.benches.filter((b) => b.id !== id),
      selection:
        s.selection.id === id ? { kind: null, id: null } : s.selection,
    })),

  addHeater: (type, presetId, wall) =>
    set((s) => {
      const preset =
        HEATER_PRESETS.find((p) => p.id === presetId) ??
        HEATER_PRESETS.find((p) => p.type === type)!
      const wallLen = getWallLength(wall, s.room)
      const heater: Heater = {
        id: newId(),
        presetId: preset.id,
        wall,
        offsetAlongWall: wallLen / 2,
        heightFromFloor: 6,
      }
      return {
        heaters: [...s.heaters, heater],
        selection: { kind: 'heater', id: heater.id },
      }
    }),

  updateHeater: (id, partial) =>
    set((s) => ({
      heaters: s.heaters.map((h) => {
        if (h.id !== id) return h
        const preset = HEATER_PRESETS.find((p) => p.id === h.presetId)!
        const next = { ...h, ...partial }
        const wallLen = getWallLength(next.wall, s.room)
        next.offsetAlongWall = clampAlongWall(
          snapToGrid(next.offsetAlongWall),
          preset.width,
          wallLen,
        )
        next.heightFromFloor = Math.min(
          s.room.height - preset.height - 12,
          Math.max(6, next.heightFromFloor),
        )
        return next
      }),
    })),

  removeHeater: (id) =>
    set((s) => ({
      heaters: s.heaters.filter((h) => h.id !== id),
      selection:
        s.selection.id === id ? { kind: null, id: null } : s.selection,
    })),

  setSelection: (selection) => set({ selection }),
  clearSelection: () => set({ selection: { kind: null, id: null } }),
  setExportCanvas: (exportCanvas) => set({ exportCanvas }),

  deleteSelected: () => {
    const { selection } = get()
    if (!selection.id) return
    if (selection.kind === 'bench') get().removeBench(selection.id)
    if (selection.kind === 'heater') get().removeHeater(selection.id)
  },
}))

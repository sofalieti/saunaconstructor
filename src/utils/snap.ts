import { SNAP_GRID } from '../data/benchDefaults'

export function snapToGrid(value: number, grid = SNAP_GRID): number {
  return Math.round(value / grid) * grid
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

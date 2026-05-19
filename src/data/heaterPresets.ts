import type { HeaterPreset } from '../types/sauna'

export const HEATER_PRESETS: HeaterPreset[] = [
  { id: 'c-24x48', type: 'carbon', label: '24×48 in', width: 24, height: 48 },
  { id: 'c-24x60', type: 'carbon', label: '24×60 in', width: 24, height: 60 },
  { id: 'c-24x72', type: 'carbon', label: '24×72 in', width: 24, height: 72 },
  { id: 'c-36x60', type: 'carbon', label: '36×60 in', width: 36, height: 60 },
  { id: 'k-18x18', type: 'ceramic', label: '18×18 in', width: 18, height: 18 },
  { id: 'k-24x24', type: 'ceramic', label: '24×24 in', width: 24, height: 24 },
  { id: 'k-24x48', type: 'ceramic', label: '24×48 in', width: 24, height: 48 },
]

export function getHeaterPreset(presetId: string): HeaterPreset | undefined {
  return HEATER_PRESETS.find((p) => p.id === presetId)
}

export function presetsByType(type: 'carbon' | 'ceramic'): HeaterPreset[] {
  return HEATER_PRESETS.filter((p) => p.type === type)
}

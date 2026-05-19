import { useState } from 'react'
import { presetsByType } from '../../data/heaterPresets'
import { useSaunaStore } from '../../store/saunaStore'
import type { HeaterType, WallId } from '../../types/sauna'

const WALL_OPTIONS: { value: WallId; label: string }[] = [
  { value: 'back', label: 'Задняя' },
  { value: 'left', label: 'Левая' },
  { value: 'right', label: 'Правая' },
  { value: 'front', label: 'Передняя' },
]

export function HeaterControls() {
  const [type, setType] = useState<HeaterType>('carbon')
  const [presetId, setPresetId] = useState('c-24x60')
  const [wall, setWall] = useState<WallId>('back')
  const addHeater = useSaunaStore((s) => s.addHeater)
  const heaters = useSaunaStore((s) => s.heaters)
  const room = useSaunaStore((s) => s.room)
  const selection = useSaunaStore((s) => s.selection)
  const updateHeater = useSaunaStore((s) => s.updateHeater)
  const removeHeater = useSaunaStore((s) => s.removeHeater)

  const presets = presetsByType(type)
  const selectedHeater =
    selection.kind === 'heater'
      ? heaters.find((h) => h.id === selection.id)
      : undefined

  const onTypeChange = (t: HeaterType) => {
    setType(t)
    const list = presetsByType(t)
    if (list[0]) setPresetId(list[0].id)
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
        Нагреватели (ИК)
      </h2>
      <p className="text-xs text-slate-500">
        Карбоновые — тёмные панели. Керамические — оранжевые модули.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onTypeChange('carbon')}
          className={`flex-1 rounded px-2 py-1.5 text-sm ${
            type === 'carbon'
              ? 'bg-slate-700 text-white ring-1 ring-amber-500'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          Карбон
        </button>
        <button
          type="button"
          onClick={() => onTypeChange('ceramic')}
          className={`flex-1 rounded px-2 py-1.5 text-sm ${
            type === 'ceramic'
              ? 'bg-slate-700 text-white ring-1 ring-amber-500'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          Керамика
        </button>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-400">Размер (пресет)</span>
        <select
          value={presetId}
          onChange={(e) => setPresetId(e.target.value)}
          className="rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-white"
        >
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-400">Стена</span>
        <select
          value={wall}
          onChange={(e) => setWall(e.target.value as WallId)}
          className="rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-white"
        >
          {WALL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={() => addHeater(type, presetId, wall)}
        className="w-full rounded bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-500"
      >
        Добавить нагреватель
      </button>

      {selectedHeater && (
        <div className="space-y-2 rounded border border-blue-700/50 bg-slate-800/80 p-3">
          <p className="text-xs font-medium text-blue-300">Выбранный нагреватель</p>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-400">
              Высота от пола: {selectedHeater.heightFromFloor}&quot;
            </span>
            <input
              type="range"
              min={6}
              max={room.height - 24}
              step={1}
              value={selectedHeater.heightFromFloor}
              onChange={(e) =>
                updateHeater(selectedHeater.id, {
                  heightFromFloor: Number(e.target.value),
                })
              }
              className="w-full"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-400">Стена</span>
            <select
              value={selectedHeater.wall}
              onChange={(e) =>
                updateHeater(selectedHeater.id, {
                  wall: e.target.value as WallId,
                })
              }
              className="rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-white"
            >
              {WALL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => removeHeater(selectedHeater.id)}
            className="w-full rounded border border-red-700 px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/30"
          >
            Удалить
          </button>
        </div>
      )}
    </section>
  )
}

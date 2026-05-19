import { useState } from 'react'
import { BENCH_DEPTHS, BENCH_LENGTHS } from '../../data/benchDefaults'
import { useSaunaStore } from '../../store/saunaStore'
import type { BenchTier, WallId } from '../../types/sauna'

const WALL_OPTIONS: { value: WallId | 'free'; label: string }[] = [
  { value: 'back', label: 'Задняя' },
  { value: 'left', label: 'Левая' },
  { value: 'right', label: 'Правая' },
  { value: 'front', label: 'Передняя' },
  { value: 'free', label: 'На полу' },
]

export function BenchControls() {
  const [wall, setWall] = useState<WallId | 'free'>('left')
  const [tiers, setTiers] = useState<BenchTier>(1)
  const addBench = useSaunaStore((s) => s.addBench)
  const benches = useSaunaStore((s) => s.benches)
  const selection = useSaunaStore((s) => s.selection)
  const updateBench = useSaunaStore((s) => s.updateBench)
  const removeBench = useSaunaStore((s) => s.removeBench)
  const deleteSelected = useSaunaStore((s) => s.deleteSelected)

  const selectedBench =
    selection.kind === 'bench'
      ? benches.find((b) => b.id === selection.id)
      : undefined

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
        Скамейки
      </h2>
      <p className="text-xs text-slate-500">
        Перетащите скамейку мышью вдоль стены. Клик — выбор.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-400">Стена</span>
          <select
            value={wall}
            onChange={(e) => setWall(e.target.value as WallId | 'free')}
            className="rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-white"
          >
            {WALL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-400">Ярусов</span>
          <select
            value={tiers}
            onChange={(e) => setTiers(Number(e.target.value) as BenchTier)}
            className="rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-white"
          >
            <option value={1}>1 ярус</option>
            <option value={2}>2 яруса</option>
          </select>
        </label>
      </div>
      <button
        type="button"
        onClick={() => addBench(wall, tiers)}
        className="w-full rounded bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-500"
      >
        Добавить скамейку
      </button>

      {selectedBench && (
        <div className="space-y-2 rounded border border-amber-700/50 bg-slate-800/80 p-3">
          <p className="text-xs font-medium text-amber-300">Выбранная скамейка</p>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-400">Длина (in)</span>
            <select
              value={selectedBench.length}
              onChange={(e) =>
                updateBench(selectedBench.id, {
                  length: Number(e.target.value),
                })
              }
              className="rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-white"
            >
              {BENCH_LENGTHS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-400">Глубина (in)</span>
            <select
              value={selectedBench.depth}
              onChange={(e) =>
                updateBench(selectedBench.id, {
                  depth: Number(e.target.value),
                })
              }
              className="rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-white"
            >
              {BENCH_DEPTHS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-400">Стена</span>
            <select
              value={selectedBench.wall}
              onChange={(e) =>
                updateBench(selectedBench.id, {
                  wall: e.target.value as WallId | 'free',
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
            onClick={() => removeBench(selectedBench.id)}
            className="w-full rounded border border-red-700 px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/30"
          >
            Удалить
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={deleteSelected}
        className="w-full rounded border border-slate-600 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800"
      >
        Delete — удалить выбранное
      </button>
    </section>
  )
}

import { useSaunaStore } from '../../store/saunaStore'

function NumInput({
  label,
  value,
  onChange,
  min = 36,
  max = 144,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-400">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-white"
      />
    </label>
  )
}

export function RoomDimensionsForm() {
  const room = useSaunaStore((s) => s.room)
  const setRoom = useSaunaStore((s) => s.setRoom)

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
        Размеры сауны (in)
      </h2>
      <div className="grid grid-cols-3 gap-2">
        <NumInput
          label="Ширина"
          value={room.width}
          onChange={(width) => setRoom({ width })}
        />
        <NumInput
          label="Глубина"
          value={room.depth}
          onChange={(depth) => setRoom({ depth })}
        />
        <NumInput
          label="Высота"
          value={room.height}
          onChange={(height) => setRoom({ height })}
        />
      </div>
    </section>
  )
}

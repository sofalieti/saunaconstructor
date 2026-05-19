import { useSaunaStore } from '../../store/saunaStore'
import { getWallLength } from '../../utils/geometry'
import type { WallId } from '../../types/sauna'

const WALL_LABELS: Record<WallId, string> = {
  back: 'Задняя',
  left: 'Левая',
  right: 'Правая',
  front: 'Передняя',
}

export function DoorControls() {
  const room = useSaunaStore((s) => s.room)
  const door = useSaunaStore((s) => s.door)
  const setDoor = useSaunaStore((s) => s.setDoor)
  const wallLen = getWallLength(door.wall, room)
  const maxOffset = Math.max(0, wallLen - door.width)

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
        Дверь
      </h2>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-400">Стена</span>
        <select
          value={door.wall}
          onChange={(e) => setDoor({ wall: e.target.value as WallId })}
          className="rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-white"
        >
          {(Object.keys(WALL_LABELS) as WallId[]).map((w) => (
            <option key={w} value={w}>
              {WALL_LABELS[w]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-400">
          Смещение от угла: {door.offsetAlongWall}&quot;
        </span>
        <input
          type="range"
          min={0}
          max={maxOffset}
          step={1}
          value={door.offsetAlongWall}
          onChange={(e) =>
            setDoor({ offsetAlongWall: Number(e.target.value) })
          }
          className="w-full"
        />
      </label>
      <DoorSizeInputs
        width={door.width}
        height={door.height}
        onWidth={(width) => setDoor({ width })}
        onHeight={(height) => setDoor({ height })}
      />
    </section>
  )
}

function DoorSizeInputs({
  width,
  height,
  onWidth,
  onHeight,
}: {
  width: number
  height: number
  onWidth: (v: number) => void
  onHeight: (v: number) => void
}) {
  return (
    <section className="grid grid-cols-2 gap-2">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-400">Ширина (in)</span>
        <input
          type="number"
          min={20}
          max={36}
          value={width}
          onChange={(e) => onWidth(Number(e.target.value))}
          className="rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-400">Высота (in)</span>
        <input
          type="number"
          min={60}
          max={84}
          value={height}
          onChange={(e) => onHeight(Number(e.target.value))}
          className="rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-white"
        />
      </label>
    </section>
  )
}

import { useSaunaStore } from '../../store/saunaStore'
import { downloadPdf, downloadPng } from '../../utils/export'

export function ExportButtons() {
  const exportCanvas = useSaunaStore((s) => s.exportCanvas)
  const room = useSaunaStore((s) => s.room)
  const door = useSaunaStore((s) => s.door)
  const benches = useSaunaStore((s) => s.benches)
  const heaters = useSaunaStore((s) => s.heaters)

  const snapshot = { room, door, benches, heaters }

  const capture = () => {
    if (!exportCanvas) return null
    return exportCanvas.toDataURL('image/png')
  }

  const onPng = () => {
    const data = capture()
    if (data) downloadPng(data)
  }

  const onPdf = () => {
    const data = capture()
    if (data) downloadPdf(data, snapshot)
  }

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
        Экспорт
      </h2>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPng}
          className="flex-1 rounded border border-slate-600 px-3 py-2 text-sm text-white hover:bg-slate-800"
        >
          PNG
        </button>
        <button
          type="button"
          onClick={onPdf}
          className="flex-1 rounded border border-slate-600 px-3 py-2 text-sm text-white hover:bg-slate-800"
        >
          PDF
        </button>
      </div>
    </section>
  )
}

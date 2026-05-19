import { useEffect } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { SaunaScene } from './components/scene/SaunaScene'
import { useSaunaStore } from './store/saunaStore'

export default function App() {
  const deleteSelected = useSaunaStore((s) => s.deleteSelected)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
        e.preventDefault()
        deleteSelected()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deleteSelected])

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="relative min-w-0 flex-1">
        <SaunaScene />
        <div className="pointer-events-none absolute bottom-4 left-4 rounded bg-black/50 px-3 py-2 text-xs text-slate-300">
          Схема сверху · ЛКМ — вращение · Колесо — масштаб · Перетаскивание элементов
        </div>
      </main>
    </div>
  )
}

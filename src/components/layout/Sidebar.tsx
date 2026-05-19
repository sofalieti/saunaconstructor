import { BenchControls } from '../controls/BenchControls'
import { DoorControls } from '../controls/DoorControls'
import { HeaterControls } from '../controls/HeaterControls'
import { RoomDimensionsForm } from '../controls/RoomDimensionsForm'
import { ExportButtons } from './ExportButtons'

export function Sidebar() {
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-r border-slate-700 bg-slate-900 text-white">
      <header className="border-b border-slate-700 px-4 py-4">
        <h1 className="text-lg font-bold text-amber-400">DIY Sauna Creator</h1>
        <p className="mt-1 text-xs text-slate-400">
          Конфигуратор инфракрасной сауны · дюймы
        </p>
      </header>
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
        <RoomDimensionsForm />
        <DoorControls />
        <BenchControls />
        <HeaterControls />
        <ExportButtons />
      </div>
    </aside>
  )
}

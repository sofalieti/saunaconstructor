import { jsPDF } from 'jspdf'
import type { Bench, DoorConfig, Heater, RoomConfig } from '../types/sauna'
import { getHeaterPreset } from '../data/heaterPresets'

export interface ExportSnapshot {
  room: RoomConfig
  door: DoorConfig
  benches: Bench[]
  heaters: Heater[]
}

export function downloadPng(dataUrl: string, filename = 'sauna-scheme.png') {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}

export function buildSpecText(snapshot: ExportSnapshot): string {
  const { room, door, benches, heaters } = snapshot
  const lines = [
    `Комната: ${room.width}" × ${room.depth}" × ${room.height}" (Ш×Г×В)`,
    `Дверь: стена ${door.wall}, смещение ${door.offsetAlongWall}", ${door.width}"×${door.height}"`,
    '',
    'Скамейки:',
  ]
  if (benches.length === 0) lines.push('  — нет')
  benches.forEach((b, i) => {
    lines.push(
      `  ${i + 1}. ${b.tiers}-ярус., стена ${b.wall}, ${b.length}"×${b.depth}", поз. ${b.positionAlongWall}"`,
    )
  })
  lines.push('', 'Нагреватели:')
  if (heaters.length === 0) lines.push('  — нет')
  heaters.forEach((h, i) => {
    const preset = getHeaterPreset(h.presetId)
    lines.push(
      `  ${i + 1}. ${preset?.label ?? h.presetId}, стена ${h.wall}, поз. ${h.offsetAlongWall}", высота ${h.heightFromFloor}"`,
    )
  })
  return lines.join('\n')
}

export function downloadPdf(imageDataUrl: string, snapshot: ExportSnapshot) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()

  pdf.setFontSize(14)
  pdf.text('DIY Sauna Creator — схема ИК-сауны', 14, 14)

  const imgW = pageW - 28
  const imgH = imgW * 0.55
  pdf.addImage(imageDataUrl, 'PNG', 14, 20, imgW, imgH)

  const spec = buildSpecText(snapshot)
  pdf.setFontSize(9)
  const specLines = pdf.splitTextToSize(spec, pageW - 28)
  let y = 24 + imgH
  specLines.forEach((line: string) => {
    if (y > pageH - 10) {
      pdf.addPage()
      y = 14
    }
    pdf.text(line, 14, y)
    y += 4.5
  })

  pdf.save('sauna-scheme.pdf')
}

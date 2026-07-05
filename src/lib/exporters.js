import { costSummary, lineAmount } from './calc'
import { convert, CURRENCIES } from './format'
import { formatDate } from './utils'

function money(amountBdt, currency) {
  const sym = CURRENCIES[currency].symbol
  const val = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(convert(amountBdt, currency))
  return `${sym}${val}`
}

export async function exportBoqPdf(project, { currency = 'BDT', company = 'BuildEst' } = {}) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const s = costSummary(project)

  // Header band
  doc.setFillColor(249, 115, 22)
  doc.rect(0, 0, pageWidth, 70, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(company, 40, 34)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Bill of Quantities & Cost Estimate', 40, 52)

  // Project meta
  doc.setTextColor(30, 41, 59)
  let y = 100
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(project.name, 40, y)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  y += 18
  doc.text(`Client: ${project.client || '-'}`, 40, y)
  doc.text(`Location: ${project.location || '-'}`, 300, y)
  y += 15
  doc.text(
    `Duration: ${formatDate(project.startDate)} - ${formatDate(project.endDate)}`,
    40,
    y,
  )
  doc.text(`Generated: ${formatDate(new Date())}`, 300, y)

  // BOQ table
  autoTable(doc, {
    startY: y + 20,
    head: [['#', 'Description', 'Category', 'Unit', 'Qty', 'Rate', 'Amount']],
    body: project.boq.map((it, i) => [
      i + 1,
      it.description || '-',
      it.category || '-',
      it.unit?.toUpperCase() || '-',
      new Intl.NumberFormat('en-US').format(Number(it.quantity) || 0),
      money(Number(it.rate) || 0, currency),
      money(lineAmount(it), currency),
    ]),
    styles: { fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: [30, 41, 59], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 24 },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  })

  // Cost summary
  const rows = [
    ['Material Cost (BOQ)', money(s.material, currency)],
    ['Labor Cost', money(s.labor, currency)],
    ['Miscellaneous Cost', money(s.misc, currency)],
    ['Subtotal', money(s.subtotal, currency)],
    [`Profit (${project.cost?.profitPercent ?? 0}%)`, money(s.profit, currency)],
    [`VAT (${project.cost?.vatPercent ?? 0}%)`, money(s.vat, currency)],
    ['Grand Total', money(s.grandTotal, currency)],
  ]
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    body: rows,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: 200, fontStyle: 'bold', halign: 'right' },
      1: { halign: 'right' },
    },
    margin: { left: pageWidth - 360 },
    didParseCell: (data) => {
      if (data.row.index === rows.length - 1) {
        data.cell.styles.fontStyle = 'bold'
        data.cell.styles.fontSize = 12
        data.cell.styles.textColor = [249, 115, 22]
      }
    },
  })

  doc.save(`${project.name.replace(/\s+/g, '_')}_BOQ.pdf`)
}

export async function exportBoqExcel(project, { currency = 'BDT' } = {}) {
  const XLSX = await import('xlsx')
  const s = costSummary(project)
  const sym = CURRENCIES[currency].symbol

  const boqRows = project.boq.map((it, i) => ({
    '#': i + 1,
    Description: it.description || '',
    Category: it.category || '',
    Unit: it.unit?.toUpperCase() || '',
    Quantity: Number(it.quantity) || 0,
    [`Rate (${sym})`]: Number(convert(Number(it.rate) || 0, currency).toFixed(2)),
    [`Amount (${sym})`]: Number(convert(lineAmount(it), currency).toFixed(2)),
  }))

  const summaryRows = [
    { Item: 'Material Cost (BOQ)', [`Amount (${sym})`]: convert(s.material, currency) },
    { Item: 'Labor Cost', [`Amount (${sym})`]: convert(s.labor, currency) },
    { Item: 'Miscellaneous Cost', [`Amount (${sym})`]: convert(s.misc, currency) },
    { Item: 'Subtotal', [`Amount (${sym})`]: convert(s.subtotal, currency) },
    {
      Item: `Profit (${project.cost?.profitPercent ?? 0}%)`,
      [`Amount (${sym})`]: convert(s.profit, currency),
    },
    {
      Item: `VAT (${project.cost?.vatPercent ?? 0}%)`,
      [`Amount (${sym})`]: convert(s.vat, currency),
    },
    { Item: 'Grand Total', [`Amount (${sym})`]: convert(s.grandTotal, currency) },
  ].map((r) => ({
    ...r,
    [`Amount (${sym})`]: Number(r[`Amount (${sym})`].toFixed(2)),
  }))

  const wb = XLSX.utils.book_new()
  const boqSheet = XLSX.utils.json_to_sheet(boqRows)
  boqSheet['!cols'] = [
    { wch: 5 },
    { wch: 40 },
    { wch: 16 },
    { wch: 8 },
    { wch: 12 },
    { wch: 14 },
    { wch: 16 },
  ]
  XLSX.utils.book_append_sheet(wb, boqSheet, 'BOQ')

  const summarySheet = XLSX.utils.json_to_sheet(summaryRows)
  summarySheet['!cols'] = [{ wch: 26 }, { wch: 18 }]
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Cost Summary')

  XLSX.writeFile(wb, `${project.name.replace(/\s+/g, '_')}_BOQ.xlsx`)
}

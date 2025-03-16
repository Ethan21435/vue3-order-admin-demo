import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const exportToExcel = (data, filename = 'export.xlsx') => {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  
  const wbout = XLSX.write(wb, { 
    bookType: 'xlsx', 
    bookSST: true, 
    type: 'array' 
  })
  
  saveAs(
    new Blob([wbout], { type: 'application/octet-stream' }), 
    filename
  )
}

export const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatDateTime = (date) => {
  const d = new Date(date)
  return `${formatDate(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}
// PDF parsing will be handled differently

export interface ProcessedFile {
  name: string
  type: string
  content: string
  size: number
}

export async function processFile(file: File): Promise<ProcessedFile> {
  const fileType = file.type
  const fileName = file.name
  const fileSize = file.size

  try {
    let content = ''

    if (fileType === 'application/pdf') {
      // For now, PDF files will show as attached but not text-extracted
      // This is a placeholder - in production you'd use a proper PDF parser
      content = `[PDF File: ${fileName} - Content extraction temporarily disabled. Please copy and paste the text you want analyzed.]`
    } else if (fileType.startsWith('text/') || fileType === 'application/json') {
      // Process text files
      content = await file.text()
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               fileType === 'application/msword') {
      // For Word documents, we'll extract basic text (this is a simplified approach)
      // In production, you'd want to use a more robust library like mammoth
      content = `[Word Document: ${fileName} - Content extraction not fully implemented]`
    } else {
      content = `[File: ${fileName} - Type: ${fileType} - Content extraction not supported for this file type]`
    }

    return {
      name: fileName,
      type: fileType,
      content: content.trim(),
      size: fileSize
    }
  } catch (error) {
    console.error('Error processing file:', error)
    return {
      name: fileName,
      type: fileType,
      content: `[Error processing file: ${fileName}]`,
      size: fileSize
    }
  }
}

export function getFileTypeIcon(fileType: string): string {
  if (fileType === 'application/pdf') return '📄'
  if (fileType.startsWith('text/')) return '📝'
  if (fileType.includes('word') || fileType.includes('document')) return '📄'
  if (fileType.startsWith('image/')) return '🖼️'
  if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📊'
  if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📈'
  return '📎'
}

export async function downloadFile(url: string, filename: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener noreferrer'
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  return Promise.resolve()
}

export async function downloadAllSequential(
  urls: string[],
  filenames: string[],
  downloader: (url: string, filename: string) => Promise<void> = downloadFile
) {
  for (let i = 0; i < urls.length; i += 1) {
    await downloader(urls[i], filenames[i] ?? `file-${i + 1}`)
  }
}

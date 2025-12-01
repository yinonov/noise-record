export async function downloadFile(url: string, filename: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback to simple link click if fetch fails (e.g. CORS error)
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
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

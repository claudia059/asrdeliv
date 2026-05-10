/**
 * Downloads a PDF from an authenticated API endpoint.
 * Fetches with the JWT bearer token, then triggers a browser download.
 */
export async function downloadPdf(
  path: string,
  filename: string,
): Promise<void> {
  const token = localStorage.getItem("asr_token");
  const response = await fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

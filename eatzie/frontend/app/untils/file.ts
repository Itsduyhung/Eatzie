export function guessMimeTypeFromUri(uri: string) {
  const ext = uri.split(".").pop()?.split("?")[0]?.toLowerCase();
  if (!ext) return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  return "application/octet-stream";
}

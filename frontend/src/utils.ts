export function formatDate(iso: string) {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleString('sr-RS')
}

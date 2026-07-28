/**
 * Utility for obfuscating/encoding village IDs into SEO-friendly, non-guessable slugs.
 * E.g., ID 1 ("Desa Suka Maju") => "suka-maju-40b"
 */

export function encodeDesaSlug(id: number, nama: string = ''): string {
  const cleanNama = nama
    .toLowerCase()
    .replace(/^desa\s+/i, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Obfuscated hex token derived from ID
  const token = ((id * 1543 + 7919) ^ 0x3c5a).toString(16);
  return cleanNama ? `${cleanNama}-${token}` : `desa-${token}`;
}

export function decodeDesaSlug(slugOrId: string, desaList: { id: number; nama: string }[]): number {
  // If numeric string is passed, verify if matches
  const numeric = parseInt(slugOrId, 10);
  if (!isNaN(numeric) && numeric > 0) {
    const foundById = desaList.find(d => d.id === numeric);
    if (foundById) return foundById.id;
  }

  // Match by exact encoded slug
  const matchedExact = desaList.find(d => encodeDesaSlug(d.id, d.nama) === slugOrId);
  if (matchedExact) return matchedExact.id;

  // Match by token suffix
  const parts = slugOrId.split('-');
  const lastToken = parts[parts.length - 1];
  const matchedToken = desaList.find(d => {
    const token = ((d.id * 1543 + 7919) ^ 0x3c5a).toString(16);
    return token === lastToken;
  });

  if (matchedToken) return matchedToken.id;

  // Fallback to first village
  return desaList[0]?.id || 1;
}

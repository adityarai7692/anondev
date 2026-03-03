const BANNED_PATTERNS = [
  /\b(cp|csam|child\s*porn|loli|shota)\b/gi,
  /\b(buy\s*(drugs?|cocaine|heroin|fentanyl|meth))\b/gi,
  /\b(hire\s*(hacker|assassin|killer))\b/gi,
];

export function filterContent(text: string): { clean: boolean; reason?: string } {
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(text)) {
      return { clean: false, reason: 'Content violates community guidelines.' };
    }
  }
  return { clean: true };
}

export function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 32)
    .replace(/^-|-$/g, '');
}
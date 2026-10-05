/**
 * Utility helper to format and sanitize social links, phone numbers, and communication URLs
 */

export function formatSocialUrl(platform: string = 'other', rawUrl: string = ''): string {
  if (!rawUrl || !rawUrl.trim()) return '#';
  const trimmed = rawUrl.trim();
  const lowerPlatform = platform.toLowerCase().trim();

  // 1. WhatsApp platform (ALWAYS format as https://wa.me/{digits})
  if (lowerPlatform === 'whatsapp' || lowerPlatform === 'wa') {
    if (trimmed.startsWith('https://wa.me/') || trimmed.startsWith('http://wa.me/')) {
      return trimmed.replace(/^http:/, 'https:');
    }
    if (trimmed.startsWith('wa.me/')) {
      return `https://${trimmed}`;
    }
    // Strip tel:, mailto:, or any prefix and extract phone digits
    const digits = trimmed.replace(/^tel:/i, '').replace(/[^0-9]/g, '');
    if (digits.length >= 10) {
      const cleanWithCountry = digits.length === 10 ? `91${digits}` : digits;
      return `https://wa.me/${cleanWithCountry}`;
    }
    if (digits.length > 0) {
      return `https://wa.me/${digits}`;
    }
    return `https://wa.me/918958364005`;
  }

  // 2. Phone platform (ALWAYS format as tel:{cleanNumber})
  if (lowerPlatform === 'phone' || lowerPlatform === 'tel') {
    const digitsOnly = trimmed.replace(/^tel:/i, '').replace(/[^0-9+]/g, '');
    const cleanNumber = digitsOnly.startsWith('+') ? digitsOnly : `+${digitsOnly}`;
    return `tel:${cleanNumber}`;
  }

  // 3. Email platform (ALWAYS format as mailto:{cleanEmail})
  if (lowerPlatform === 'email' || (trimmed.includes('@') && !trimmed.includes('/') && !trimmed.startsWith('http'))) {
    const cleanEmail = trimmed.replace(/^mailto:/i, '').trim();
    return `mailto:${cleanEmail}`;
  }

  // Already prefixed with mailto: or tel: for other platforms
  if (/^(mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  // Instagram platform
  if (lowerPlatform === 'instagram' || lowerPlatform === 'insta') {
    if (trimmed.startsWith('https://instagram.com/') || trimmed.startsWith('https://www.instagram.com/')) {
      return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
    }
    if (trimmed.startsWith('http://instagram.com/') || trimmed.startsWith('http://www.instagram.com/')) {
      return trimmed.replace(/^http:/, 'https:');
    }
    if (trimmed.startsWith('instagram.com/') || trimmed.startsWith('www.instagram.com/')) {
      const formatted = `https://${trimmed}`;
      return formatted.endsWith('/') ? formatted : `${formatted}/`;
    }
    // Handle username handles like '@damn.itz_shubham' or 'damn.itz_shubham'
    const handle = trimmed.replace(/^@/, '').replace(/^\/+|\/+$/g, '');
    if (handle) {
      return `https://www.instagram.com/${handle}/`;
    }
  }

  // GitHub platform
  if (lowerPlatform === 'github') {
    if (trimmed.startsWith('https://github.com/') || trimmed.startsWith('http://github.com/')) {
      return trimmed;
    }
    if (trimmed.startsWith('github.com/')) {
      return `https://${trimmed}`;
    }
    const handle = trimmed.replace(/^@/, '').replace(/^\/+|\/+$/g, '');
    if (handle && !handle.includes('.')) {
      return `https://github.com/${handle}`;
    }
  }

  // LinkedIn platform
  if (lowerPlatform === 'linkedin') {
    if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
      return trimmed;
    }
    if (trimmed.startsWith('linkedin.com/') || trimmed.startsWith('www.linkedin.com/')) {
      return `https://${trimmed}`;
    }
    if (trimmed.startsWith('in/')) {
      return `https://www.linkedin.com/${trimmed}`;
    }
  }

  // Generic web URL normalization
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  return `https://${trimmed}`;
}

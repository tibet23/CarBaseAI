import { createWorker } from 'tesseract.js';
import { ContactCard } from '../types';

/**
 * Smart Regex-based business card entity parser for offline OCR text extraction.
 */
export function parseBusinessCardText(rawText: string): Partial<ContactCard> {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 1);

  // Email regex
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const emailMatch = rawText.match(emailRegex);
  const email = emailMatch ? emailMatch[0].toLowerCase() : '';

  // Phone regex (International, US, etc.)
  const phoneRegex = /(?:(?:\+?([1-9]\d{0,2}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?)|(?:\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4})/gi;
  const phoneMatches = rawText.match(phoneRegex) || [];
  const validPhones = phoneMatches.map(p => p.trim()).filter(p => p.length >= 7 && !p.includes('@'));
  const phone = validPhones[0] || '';
  const mobilePhone = validPhones[1] || '';

  // Website regex
  const webRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi;
  const webMatches = rawText.match(webRegex) || [];
  let website = '';
  for (const m of webMatches) {
    if (!m.includes('@') && !m.match(/^(tel|fax|mob|phone|email):/i)) {
      website = m.startsWith('http') ? m : `https://${m}`;
      break;
    }
  }

  // Social handles
  const linkedinMatch = rawText.match(/linkedin\.com\/in\/([a-zA-Z0-9-_]+)/i);
  const twitterMatch = rawText.match(/(?:twitter|x)\.com\/([a-zA-Z0-9_]+)/i);

  // Job title keywords
  const titleKeywords = [
    'ceo', 'cto', 'cfo', 'coo', 'cmo', 'cio', 'cpo',
    'president', 'vice president', 'vp', 'director', 'manager',
    'engineer', 'developer', 'architect', 'designer', 'consultant',
    'specialist', 'officer', 'lead', 'head of', 'founder', 'partner',
    'attorney', 'doctor', 'accountant', 'advisor', 'analyst'
  ];

  let jobTitle = '';
  let nameLineIndex = -1;
  let fullName = '';
  let company = '';

  // Filter out lines that are purely contact info
  const candidateNameAndOrgLines: { line: string; index: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // Check if line contains a job title
    if (!jobTitle && titleKeywords.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(lower))) {
      jobTitle = line;
      continue;
    }

    // Skip lines that are just emails, urls, or phones
    if (
      line.includes('@') ||
      line.includes('www.') ||
      line.includes('.com') ||
      line.includes('.org') ||
      line.includes('.net') ||
      /^\+?[\d\s-().]+$/.test(line)
    ) {
      continue;
    }

    if (line.length > 2 && line.length < 50) {
      candidateNameAndOrgLines.push({ line, index: i });
    }
  }

  // First non-contact line is usually the Name or Company
  if (candidateNameAndOrgLines.length > 0) {
    fullName = candidateNameAndOrgLines[0].line;
    nameLineIndex = candidateNameAndOrgLines[0].index;
  }
  if (candidateNameAndOrgLines.length > 1) {
    company = candidateNameAndOrgLines[1].line;
  }

  // Basic address detection (e.g. mentions of St, Ave, Blvd, Suite, City/State/Zip)
  let street = '';
  let city = '';
  let state = '';
  let zip = '';
  let country = '';

  for (const line of lines) {
    if (/\b(suite|ste|ave|street|st|blvd|road|rd|dr|way|lane|floor|fl)\b/i.test(line)) {
      street = line;
    }
    const zipMatch = line.match(/\b\d{5}(?:-\d{4})?\b/);
    if (zipMatch && !zip) {
      zip = zipMatch[0];
    }
    if (/\b(USA|United States|UK|Canada|Germany|France|Japan|Australia|Singapore)\b/i.test(line)) {
      const cMatch = line.match(/\b(USA|United States|UK|Canada|Germany|France|Japan|Australia|Singapore)\b/i);
      if (cMatch) country = cMatch[0];
    }
  }

  return {
    fullName: fullName || 'Scanned Contact',
    jobTitle: jobTitle || 'Professional',
    company: company || 'Organization',
    email: email || '',
    phone: phone || '',
    mobilePhone: mobilePhone || '',
    website: website || '',
    address: {
      street,
      city,
      state,
      zip,
      country,
    },
    social: {
      linkedin: linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : undefined,
      twitter: twitterMatch ? `https://x.com/${twitterMatch[1]}` : undefined,
    },
    notes: `Raw text captured via offline OCR:\n${rawText.slice(0, 300)}...`,
    confidenceScore: 78,
    category: 'General Business',
    tags: ['Offline Scanned', 'Needs Review'],
    isOfflineScanned: true,
  };
}

/**
 * Runs offline client-side OCR using Tesseract.js directly inside the browser.
 */
export async function performOfflineOCR(
  imageSource: string,
  onProgress?: (progress: number, status: string) => void
): Promise<Partial<ContactCard>> {
  let worker: any = null;
  try {
    onProgress?.(10, 'Initializing offline OCR engine...');
    worker = await createWorker('eng');

    onProgress?.(40, 'Recognizing card text in browser...');
    const ret = await worker.recognize(imageSource);

    onProgress?.(85, 'Structuring contact fields...');
    const text = ret.data.text;

    onProgress?.(100, 'Complete!');
    const parsed = parseBusinessCardText(text);
    return parsed;
  } catch (error: any) {
    console.error('Offline OCR failed:', error);
    throw new Error(`Offline OCR Error: ${error.message || 'Could not process card locally.'}`);
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch (termErr) {
        console.warn('Worker terminate error:', termErr);
      }
    }
  }
}

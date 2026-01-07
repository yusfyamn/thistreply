// PII detection patterns
const PII_PATTERNS = {
  // Phone numbers (various formats)
  phone: /(\+?1?[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
  
  // Email addresses
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  
  // Street addresses (basic pattern)
  address: /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|place|pl)\.?(?:\s+(?:apt|apartment|suite|ste|unit|#)\s*\d+)?/gi,
  
  // Social Security Numbers
  ssn: /\d{3}[-\s]?\d{2}[-\s]?\d{4}/g,
  
  // Credit card numbers (basic)
  creditCard: /\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}/g,
};

const REDACTION_PLACEHOLDER = '[REDACTED]';

/**
 * Detects and redacts PII from text
 */
export function redactPII(text: string): string {
  let redacted = text;
  
  for (const pattern of Object.values(PII_PATTERNS)) {
    redacted = redacted.replace(pattern, REDACTION_PLACEHOLDER);
  }
  
  return redacted;
}

/**
 * Checks if text contains PII
 */
export function containsPII(text: string): boolean {
  for (const pattern of Object.values(PII_PATTERNS)) {
    if (pattern.test(text)) {
      return true;
    }
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0;
  }
  return false;
}

/**
 * Detects specific types of PII in text
 */
export function detectPIITypes(text: string): string[] {
  const detected: string[] = [];
  
  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    if (pattern.test(text)) {
      detected.push(type);
    }
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0;
  }
  
  return detected;
}

/**
 * Input Validation & Sanitization Utilities
 * 
 * Purpose: Protect against malicious user input, XSS, and data manipulation
 */

// Valid status values
export const VALID_ORDER_STATUSES = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'rejected'] as const;
export type OrderStatus = typeof VALID_ORDER_STATUSES[number];

/**
 * Sanitize string input - remove dangerous characters and trim
 */
export function sanitizeString(input: string | null | undefined, maxLength: number = 500): string | null {
  if (!input) return null;
  
  // Convert to string and trim
  let sanitized = String(input).trim();
  
  // Remove potentially dangerous characters
  sanitized = sanitized
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .replace(/\0/g, ''); // Remove null bytes
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized || null;
}

/**
 * Validate and sanitize price
 */
export function validatePrice(price: number | string | null | undefined): number | null {
  if (price === null || price === undefined) return null;
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice) || !isFinite(numPrice)) {
    return null;
  }
  
  // Price must be positive and reasonable (max 10,000,000)
  if (numPrice < 0 || numPrice > 10000000) {
    return null;
  }
  
  // Round to 2 decimal places
  return Math.round(numPrice * 100) / 100;
}

/**
 * Validate and sanitize quantity
 */
export function validateQuantity(quantity: number | string | null | undefined): number | null {
  if (quantity === null || quantity === undefined) return null;
  
  const numQuantity = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
  
  if (isNaN(numQuantity) || !isFinite(numQuantity)) {
    return null;
  }
  
  // Quantity must be positive integer and reasonable (max 1000)
  if (numQuantity < 1 || numQuantity > 1000 || !Number.isInteger(numQuantity)) {
    return null;
  }
  
  return numQuantity;
}

/**
 * Validate UUID format
 */
export function validateUUID(id: string | null | undefined): string | null {
  if (!id || typeof id !== 'string') return null;
  
  // UUID v4 format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id.trim())) {
    return null;
  }
  
  return id.trim();
}

/**
 * Validate order status
 */
export function validateOrderStatus(status: string | null | undefined): OrderStatus | null {
  if (!status || typeof status !== 'string') return null;
  
  const normalizedStatus = status.toLowerCase().trim() as OrderStatus;
  
  if (VALID_ORDER_STATUSES.includes(normalizedStatus)) {
    return normalizedStatus;
  }
  
  return null;
}

/**
 * Validate table number (1-999)
 */
export function validateTableNumber(tableNumber: string | number | null | undefined): string | null {
  if (!tableNumber) return null;
  
  const tableStr = String(tableNumber).trim();
  
  // Table number should be 1-999 or alphanumeric (max 20 chars)
  if (tableStr.length > 20) return null;
  
  // Allow alphanumeric for flexibility
  if (!/^[A-Za-z0-9-]+$/.test(tableStr)) return null;
  
  return tableStr;
}

/**
 * Validate sort order (0-9999)
 */
export function validateSortOrder(sortOrder: number | string | null | undefined): number {
  if (sortOrder === null || sortOrder === undefined) return 0;
  
  const numSort = typeof sortOrder === 'string' ? parseInt(sortOrder, 10) : sortOrder;
  
  if (isNaN(numSort) || !isFinite(numSort) || !Number.isInteger(numSort)) {
    return 0;
  }
  
  // Sort order should be between 0 and 9999
  if (numSort < 0) return 0;
  if (numSort > 9999) return 9999;
  
  return numSort;
}

/**
 * Validate array of UUIDs
 */
export function validateUUIDArray(ids: any, maxLength: number = 50): string[] | null {
  if (!Array.isArray(ids)) return null;
  
  if (ids.length === 0) return [];
  if (ids.length > maxLength) return null;
  
  const validatedIds: string[] = [];
  
  for (const id of ids) {
    const validId = validateUUID(id);
    if (!validId) return null; // If any ID is invalid, return null
    validatedIds.push(validId);
  }
  
  return validatedIds;
}

/**
 * Validate name field (required, max 200 chars)
 */
export function validateName(name: string | null | undefined): string | null {
  if (!name || typeof name !== 'string') return null;
  
  const sanitized = sanitizeString(name, 200);
  if (!sanitized || sanitized.length < 1) return null;
  
  return sanitized;
}

/**
 * Validate description (optional, max 1000 chars)
 */
export function validateDescription(description: string | null | undefined): string | null {
  if (!description) return null;
  
  return sanitizeString(description, 1000);
}

/**
 * Validate image URL (basic validation)
 */
export function validateImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  const sanitized = sanitizeString(url, 500);
  if (!sanitized) return null;
  
  // Basic URL validation (must start with http:// or https://)
  if (!/^https?:\/\//i.test(sanitized)) {
    return null;
  }
  
  return sanitized;
}


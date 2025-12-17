/**
 * Client-side Admin Authentication Helper
 * 
 * Purpose: Handle admin password for API requests
 * NOTE: For portfolio/demo purposes. In production, use proper session-based auth.
 */

const ADMIN_PASSWORD_KEY = 'admin_password';

/**
 * Get admin password from localStorage or prompt user
 */
export async function getAdminPassword(): Promise<string | null> {
  // Try to get from localStorage first
  const stored = localStorage.getItem(ADMIN_PASSWORD_KEY);
  if (stored) {
    return stored;
  }

  // Prompt user for password
  const password = prompt('Enter admin password:');
  if (!password) {
    return null;
  }

  // Save to localStorage for this session
  localStorage.setItem(ADMIN_PASSWORD_KEY, password);
  return password;
}

/**
 * Clear stored admin password (logout)
 */
export function clearAdminPassword() {
  localStorage.removeItem(ADMIN_PASSWORD_KEY);
}

/**
 * Get Authorization header for admin API requests
 */
export async function getAdminAuthHeader(): Promise<HeadersInit | null> {
  const password = await getAdminPassword();
  if (!password) {
    return null;
  }
  
  return {
    'Authorization': `Bearer ${password}`,
    'Content-Type': 'application/json',
  };
}


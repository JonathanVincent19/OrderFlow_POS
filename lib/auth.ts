/**
 * Authentication & Authorization Utilities
 * 
 * Purpose: Protect admin routes and sensitive operations
 * 
 * NOTE: For portfolio/demo purposes, using simple password-based auth.
 * For production apps, use proper authentication (Supabase Auth, NextAuth, etc.)
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change this in production!

/**
 * Check if request has valid admin authorization
 * 
 * For this portfolio app, we use a simple password check via header.
 * In production, use proper JWT tokens or session-based auth.
 */
export function verifyAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return false;
  }
  
  // Support "Bearer <password>" or just password
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : authHeader;
  
  return token === ADMIN_PASSWORD;
}

/**
 * Create admin auth response
 */
export function createUnauthorizedResponse() {
  return Response.json(
    {
      success: false,
      error: 'Unauthorized. Admin access required.',
    },
    { status: 401 }
  );
}

/**
 * Middleware wrapper for admin routes
 */
export function withAdminAuth(handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    // Skip auth check in development if ADMIN_PASSWORD not set
    if (process.env.NODE_ENV === 'development' && !process.env.ADMIN_PASSWORD) {
      console.warn('⚠️  Admin auth disabled in development. Set ADMIN_PASSWORD in production!');
      return handler(request);
    }
    
    if (!verifyAdminAuth(request)) {
      return createUnauthorizedResponse();
    }
    
    return handler(request);
  };
}


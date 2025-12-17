/**
 * Admin Categories API Routes
 * 
 * Endpoints:
 * - POST /api/admin/categories - Create new category
 * - GET /api/admin/categories - Get all categories (admin view - includes inactive)
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/auth';
import { validateName, validateDescription, validateSortOrder } from '@/lib/validation';

// GET /api/admin/categories - Get all categories (including inactive)
export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
  // Check admin authorization
  if (!verifyAdminAuth(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { name, description, is_active, sort_order } = body;

    // Validate and sanitize name
    const validatedName = validateName(name);
    if (!validatedName) {
      return NextResponse.json(
        { success: false, error: 'Valid name is required (1-200 characters)' },
        { status: 400 }
      );
    }

    // Validate and sanitize description
    const validatedDescription = validateDescription(description);
    
    // Validate sort_order
    const validatedSortOrder = validateSortOrder(sort_order);

    // Validate is_active (must be boolean)
    const validatedIsActive = typeof is_active === 'boolean' ? is_active : true;

    const { data: category, error } = await supabase
      .from('menu_categories')
      .insert({
        name: validatedName,
        description: validatedDescription,
        is_active: validatedIsActive,
        sort_order: validatedSortOrder,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create category',
      },
      { status: 500 }
    );
  }
}


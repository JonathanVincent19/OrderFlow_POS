/**
 * Admin Categories API Routes
 * 
 * Endpoints:
 * - POST /api/admin/categories - Create new category
 * - GET /api/admin/categories - Get all categories (admin view - includes inactive)
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
  try {
    const body = await request.json();
    const { name, description, is_active, sort_order } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const { data: category, error } = await supabase
      .from('menu_categories')
      .insert({
        name,
        description: description || null,
        is_active: is_active !== undefined ? is_active : true,
        sort_order: sort_order || 0,
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


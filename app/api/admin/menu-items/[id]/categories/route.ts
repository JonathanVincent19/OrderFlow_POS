/**
 * Menu Item Categories API Route (Junction Table)
 * 
 * Endpoints:
 * - GET /api/admin/menu-items/[id]/categories - Get all categories for an item
 * - POST /api/admin/menu-items/[id]/categories - Add category to item
 * - DELETE /api/admin/menu-items/[id]/categories - Remove category from item
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/admin/menu-items/[id]/categories - Get all categories for an item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id;

    const { data, error } = await supabase
      .from('menu_item_categories')
      .select('category_id')
      .eq('menu_item_id', itemId);

    if (error) throw error;

    const categoryIds = data?.map((row) => row.category_id) || [];

    return NextResponse.json({
      success: true,
      data: categoryIds,
    });
  } catch (error: any) {
    console.error('Error fetching item categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/menu-items/[id]/categories - Add category to item
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id;
    const body = await request.json();
    const { category_id } = body;

    if (!category_id) {
      return NextResponse.json(
        { success: false, error: 'category_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('menu_item_categories')
      .insert({
        menu_item_id: itemId,
        category_id,
      })
      .select()
      .single();

    if (error) {
      // If duplicate, return success anyway
      if (error.code === '23505') {
        return NextResponse.json({
          success: true,
          data: { menu_item_id: itemId, category_id },
        });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error adding category to item:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to add category',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/menu-items/[id]/categories - Remove category from item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id;
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');

    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: 'category_id query parameter is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('menu_item_categories')
      .delete()
      .eq('menu_item_id', itemId)
      .eq('category_id', categoryId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Category removed from item',
    });
  } catch (error: any) {
    console.error('Error removing category from item:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to remove category',
      },
      { status: 500 }
    );
  }
}


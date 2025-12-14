/**
 * Admin Category API Routes (Single Category)
 * 
 * Endpoints:
 * - PATCH /api/admin/categories/[id] - Update category
 * - DELETE /api/admin/categories/[id] - Delete category
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH /api/admin/categories/[id] - Update category
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;
    const body = await request.json();
    const { name, description, is_active, sort_order } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (sort_order !== undefined) updateData.sort_order = sort_order;

    const { data: category, error } = await supabase
      .from('menu_categories')
      .update(updateData)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update category',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', categoryId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete category',
      },
      { status: 500 }
    );
  }
}


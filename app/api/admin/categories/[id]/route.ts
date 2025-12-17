/**
 * Admin Category API Routes (Single Category)
 * 
 * Endpoints:
 * - PATCH /api/admin/categories/[id] - Update category
 * - DELETE /api/admin/categories/[id] - Delete category
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/auth';
import { validateUUID, validateName, validateDescription, validateSortOrder } from '@/lib/validation';

// PATCH /api/admin/categories/[id] - Update category
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authorization
  if (!verifyAdminAuth(request)) {
    return createUnauthorizedResponse();
  }

  try {
    // Validate category ID
    const categoryId = validateUUID(params.id);
    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Check if category exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('menu_categories')
      .select('id')
      .eq('id', categoryId)
      .single();

    if (checkError || !existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, is_active, sort_order } = body;

    const updateData: any = {};
    
    // Validate and sanitize each field if provided
    if (name !== undefined) {
      const validatedName = validateName(name);
      if (!validatedName) {
        return NextResponse.json(
          { success: false, error: 'Invalid name (1-200 characters required)' },
          { status: 400 }
        );
      }
      updateData.name = validatedName;
    }
    
    if (description !== undefined) {
      updateData.description = validateDescription(description);
    }
    
    if (is_active !== undefined) {
      if (typeof is_active !== 'boolean') {
        return NextResponse.json(
          { success: false, error: 'is_active must be a boolean' },
          { status: 400 }
        );
      }
      updateData.is_active = is_active;
    }
    
    if (sort_order !== undefined) {
      updateData.sort_order = validateSortOrder(sort_order);
    }

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
  // Check admin authorization
  if (!verifyAdminAuth(request)) {
    return createUnauthorizedResponse();
  }

  try {
    // Validate category ID
    const categoryId = validateUUID(params.id);
    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Check if category exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('menu_categories')
      .select('id')
      .eq('id', categoryId)
      .single();

    if (checkError || !existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

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


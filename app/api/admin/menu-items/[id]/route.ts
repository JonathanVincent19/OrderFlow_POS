/**
 * Admin Menu Item API Routes (Single Item)
 * 
 * Endpoints:
 * - PATCH /api/admin/menu-items/[id] - Update menu item
 * - DELETE /api/admin/menu-items/[id] - Delete menu item
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH /api/admin/menu-items/[id] - Update menu item with categories
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id;
    const body = await request.json();
    const { name, description, price, category_ids, image_url, is_available, sort_order } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (image_url !== undefined) updateData.image_url = image_url || null;
    if (is_available !== undefined) updateData.is_available = is_available;
    if (sort_order !== undefined) updateData.sort_order = sort_order;

    // Update menu item
    const { data: menuItem, error: updateError } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', itemId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update categories if category_ids is provided
    if (category_ids !== undefined && Array.isArray(category_ids)) {
      // Delete all existing category associations
      const { error: deleteError } = await supabase
        .from('menu_item_categories')
        .delete()
        .eq('menu_item_id', itemId);

      if (deleteError) throw deleteError;

      // Insert new category associations
      if (category_ids.length > 0) {
        const categoryAssociations = category_ids.map((catId: string) => ({
          menu_item_id: itemId,
          category_id: catId,
        }));

        const { error: insertError } = await supabase
          .from('menu_item_categories')
          .insert(categoryAssociations);

        if (insertError) throw insertError;
      }
    }

    // Get updated category_ids
    const { data: itemCategories } = await supabase
      .from('menu_item_categories')
      .select('category_id')
      .eq('menu_item_id', itemId);

    const result = {
      ...menuItem,
      category_ids: itemCategories?.map((ic) => ic.category_id) || [],
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update menu item',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/menu-items/[id] - Delete menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = params.id;

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete menu item',
      },
      { status: 500 }
    );
  }
}


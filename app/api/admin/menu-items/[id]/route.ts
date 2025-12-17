/**
 * Admin Menu Item API Routes (Single Item)
 * 
 * Endpoints:
 * - PATCH /api/admin/menu-items/[id] - Update menu item
 * - DELETE /api/admin/menu-items/[id] - Delete menu item
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/auth';
import {
  validateUUID,
  validateName,
  validateDescription,
  validatePrice,
  validateSortOrder,
  validateUUIDArray,
  validateImageUrl,
} from '@/lib/validation';

// PATCH /api/admin/menu-items/[id] - Update menu item with categories
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authorization
  if (!verifyAdminAuth(request)) {
    return createUnauthorizedResponse();
  }

  try {
    // Validate item ID
    const itemId = validateUUID(params.id);
    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Invalid menu item ID' },
        { status: 400 }
      );
    }

    // Check if item exists
    const { data: existingItem, error: checkError } = await supabase
      .from('menu_items')
      .select('id')
      .eq('id', itemId)
      .single();

    if (checkError || !existingItem) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, price, category_ids, image_url, is_available, sort_order } = body;

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
    
    if (price !== undefined) {
      const validatedPrice = validatePrice(price);
      if (!validatedPrice) {
        return NextResponse.json(
          { success: false, error: 'Invalid price (must be positive number)' },
          { status: 400 }
        );
      }
      updateData.price = validatedPrice;
    }
    
    if (image_url !== undefined) {
      updateData.image_url = validateImageUrl(image_url);
    }
    
    if (is_available !== undefined) {
      if (typeof is_available !== 'boolean') {
        return NextResponse.json(
          { success: false, error: 'is_available must be a boolean' },
          { status: 400 }
        );
      }
      updateData.is_available = is_available;
    }
    
    if (sort_order !== undefined) {
      updateData.sort_order = validateSortOrder(sort_order);
    }

    // Update menu item
    const { data: menuItem, error: updateError } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', itemId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update categories if category_ids is provided
    if (category_ids !== undefined) {
      const validatedCategoryIds = validateUUIDArray(category_ids, 20);
      
      if (validatedCategoryIds === null) {
        return NextResponse.json(
          { success: false, error: 'Invalid category IDs' },
          { status: 400 }
        );
      }

      // Verify all category IDs exist if provided
      if (validatedCategoryIds.length > 0) {
        const { data: existingCategories, error: catCheckError } = await supabase
          .from('menu_categories')
          .select('id')
          .in('id', validatedCategoryIds);

        if (catCheckError || !existingCategories || existingCategories.length !== validatedCategoryIds.length) {
          return NextResponse.json(
            { success: false, error: 'One or more category IDs not found' },
            { status: 400 }
          );
        }
      }

      // Delete all existing category associations
      const { error: deleteError } = await supabase
        .from('menu_item_categories')
        .delete()
        .eq('menu_item_id', itemId);

      if (deleteError) throw deleteError;

      // Insert new category associations
      if (validatedCategoryIds.length > 0) {
        const categoryAssociations = validatedCategoryIds.map((catId: string) => ({
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
  // Check admin authorization
  if (!verifyAdminAuth(request)) {
    return createUnauthorizedResponse();
  }

  try {
    // Validate item ID
    const itemId = validateUUID(params.id);
    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Invalid menu item ID' },
        { status: 400 }
      );
    }

    // Check if item exists
    const { data: existingItem, error: checkError } = await supabase
      .from('menu_items')
      .select('id')
      .eq('id', itemId)
      .single();

    if (checkError || !existingItem) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

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


/**
 * Admin Menu Items API Routes
 * 
 * Endpoints:
 * - POST /api/admin/menu-items - Create new menu item
 * - GET /api/admin/menu-items - Get all menu items (admin view - includes unavailable)
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAdminAuth, createUnauthorizedResponse } from '@/lib/auth';
import {
  validateName,
  validateDescription,
  validatePrice,
  validateSortOrder,
  validateUUIDArray,
  validateImageUrl,
} from '@/lib/validation';

// GET /api/admin/menu-items - Get all menu items (including unavailable) with categories
export async function GET() {
  try {
    // Get all menu items
    const { data: menuItems, error: itemsError } = await supabase
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (itemsError) throw itemsError;

    // Get all category associations
    const { data: itemCategories, error: categoriesError } = await supabase
      .from('menu_item_categories')
      .select('menu_item_id, category_id');

    if (categoriesError) throw categoriesError;

    // Map categories to items
    const itemsWithCategories = menuItems?.map((item) => ({
      ...item,
      category_ids: itemCategories
        ?.filter((ic) => ic.menu_item_id === item.id)
        .map((ic) => ic.category_id) || [],
    })) || [];

    return NextResponse.json({
      success: true,
      data: itemsWithCategories,
    });
  } catch (error: any) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch menu items',
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/menu-items - Create new menu item with categories
export async function POST(request: NextRequest) {
  // Check admin authorization
  if (!verifyAdminAuth(request)) {
    return createUnauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { name, description, price, category_ids, image_url, is_available, sort_order } = body;

    // Validate required fields
    const validatedName = validateName(name);
    if (!validatedName) {
      return NextResponse.json(
        { success: false, error: 'Valid name is required (1-200 characters)' },
        { status: 400 }
      );
    }

    const validatedPrice = validatePrice(price);
    if (!validatedPrice) {
      return NextResponse.json(
        { success: false, error: 'Valid price is required (must be positive number)' },
        { status: 400 }
      );
    }

    // Validate optional fields
    const validatedDescription = validateDescription(description);
    const validatedImageUrl = validateImageUrl(image_url);
    const validatedSortOrder = validateSortOrder(sort_order);
    const validatedIsAvailable = typeof is_available === 'boolean' ? is_available : true;

    // Validate category_ids if provided
    const validatedCategoryIds = category_ids !== undefined
      ? validateUUIDArray(category_ids, 20) // Max 20 categories per item
      : null;

    if (category_ids !== undefined && validatedCategoryIds === null) {
      return NextResponse.json(
        { success: false, error: 'Invalid category IDs' },
        { status: 400 }
      );
    }

    // Create menu item (without category_id for many-to-many)
    const { data: menuItem, error: itemError } = await supabase
      .from('menu_items')
      .insert({
        name: validatedName,
        description: validatedDescription,
        price: validatedPrice,
        category_id: null, // Keep null for many-to-many
        image_url: validatedImageUrl,
        is_available: validatedIsAvailable,
        sort_order: validatedSortOrder,
      })
      .select()
      .single();

    if (itemError) throw itemError;

    // Add categories via junction table if provided
    if (validatedCategoryIds && validatedCategoryIds.length > 0) {
      // Verify all category IDs exist
      const { data: existingCategories, error: catCheckError } = await supabase
        .from('menu_categories')
        .select('id')
        .in('id', validatedCategoryIds);

      if (catCheckError || !existingCategories || existingCategories.length !== validatedCategoryIds.length) {
        // Rollback menu item creation
        await supabase.from('menu_items').delete().eq('id', menuItem.id);
        return NextResponse.json(
          { success: false, error: 'One or more category IDs not found' },
          { status: 400 }
        );
      }

      const categoryAssociations = validatedCategoryIds.map((catId: string) => ({
        menu_item_id: menuItem.id,
        category_id: catId,
      }));

      const { error: categoriesError } = await supabase
        .from('menu_item_categories')
        .insert(categoryAssociations);

      if (categoriesError) throw categoriesError;
    }

    // Return item with category_ids
    const result = {
      ...menuItem,
      category_ids: validatedCategoryIds || [],
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create menu item',
      },
      { status: 500 }
    );
  }
}


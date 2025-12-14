/**
 * Admin Menu Items API Routes
 * 
 * Endpoints:
 * - POST /api/admin/menu-items - Create new menu item
 * - GET /api/admin/menu-items - Get all menu items (admin view - includes unavailable)
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
  try {
    const body = await request.json();
    const { name, description, price, category_ids, image_url, is_available, sort_order } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      );
    }

    // Create menu item (without category_id for many-to-many)
    const { data: menuItem, error: itemError } = await supabase
      .from('menu_items')
      .insert({
        name,
        description: description || null,
        price: parseFloat(price),
        category_id: null, // Keep null for many-to-many
        image_url: image_url || null,
        is_available: is_available !== undefined ? is_available : true,
        sort_order: sort_order || 0,
      })
      .select()
      .single();

    if (itemError) throw itemError;

    // Add categories via junction table
    if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
      const categoryAssociations = category_ids.map((catId: string) => ({
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
      category_ids: category_ids || [],
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


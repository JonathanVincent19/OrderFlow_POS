/**
 * Menu API Route
 * 
 * Endpoint: GET /api/menu
 * Purpose: Fetch all menu items grouped by categories
 * Returns: { success: boolean, data: { categories: [], allItems: [] } }
 */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/menu - Get all menu items with categories
export async function GET() {
  try {
    // Check if Supabase client is initialized
    if (!supabase) {
      console.error('Supabase client not initialized');
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error: Supabase client not initialized. Check environment variables.',
        },
        { status: 500 }
      );
    }

    // Get all active categories
    const { data: categories, error: categoriesError } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      throw new Error(`Database error: ${categoriesError.message}`);
    }

    // Get all menu items (including unavailable ones for sold out display)
    const { data: menuItems, error: itemsError } = await supabase
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (itemsError) {
      console.error('Error fetching menu items:', itemsError);
      throw new Error(`Database error: ${itemsError.message}`);
    }

    // Get all category associations for all items
    const itemIds = menuItems?.map((item) => item.id) || [];
    const { data: itemCategories, error: categoriesAssocError } = await supabase
      .from('menu_item_categories')
      .select('menu_item_id, category_id')
      .in('menu_item_id', itemIds);

    if (categoriesAssocError) {
      console.error('Error fetching category associations:', categoriesAssocError);
      throw new Error(`Database error: ${categoriesAssocError.message}`);
    }

    // Map items with their category_ids
    const itemsWithCategories = menuItems?.map((item) => ({
      ...item,
      category_ids: itemCategories
        ?.filter((ic) => ic.menu_item_id === item.id)
        .map((ic) => ic.category_id) || [],
    })) || [];

    // Group items by category using junction table
    const menuByCategory = categories?.map((category) => ({
      ...category,
      items: itemsWithCategories?.filter((item) => 
        item.category_ids.includes(category.id)
      ) || [],
    })) || [];

    return NextResponse.json({
      success: true,
      data: {
        categories: menuByCategory,
        allItems: itemsWithCategories || [],
      },
    });
  } catch (error: any) {
    console.error('Error in /api/menu:', error);
    
    // Return more detailed error information
    const errorMessage = error.message || 'Failed to fetch menu';
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}


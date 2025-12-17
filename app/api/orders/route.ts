/**
 * Orders API Route
 * 
 * Endpoints:
 * - POST /api/orders - Create new order
 * - GET /api/orders?status=... - Get orders (filtered by status)
 * Purpose: Handle order creation and retrieval
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  sanitizeString,
  validateQuantity,
  validateUUID,
  validateTableNumber,
  validateDescription,
} from '@/lib/validation';

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, table_number, order_notes, items } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order items are required' },
        { status: 400 }
      );
    }

    // Limit maximum items per order (prevent abuse)
    if (items.length > 50) {
      return NextResponse.json(
        { success: false, error: 'Maximum 50 items per order' },
        { status: 400 }
      );
    }

    // Validate and fetch menu items from database to prevent price manipulation
    const menuItemIds = items.map((item: any) => item.menu_item_id);
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('id, price, is_available, name')
      .in('id', menuItemIds);

    if (menuError) throw menuError;
    if (!menuItems || menuItems.length !== menuItemIds.length) {
      return NextResponse.json(
        { success: false, error: 'One or more menu items not found' },
        { status: 400 }
      );
    }

    // Create a map for quick lookup
    const menuItemMap = new Map(menuItems.map(item => [item.id, item]));

    // Validate all items and calculate total price using server-side prices
    let totalPrice = 0;
    const validatedItems: Array<{
      menu_item_id: string;
      quantity: number;
      price: number;
    }> = [];

    for (const item of items) {
      // Validate menu_item_id
      const menuItemId = validateUUID(item.menu_item_id);
      if (!menuItemId) {
        return NextResponse.json(
          { success: false, error: 'Invalid menu item ID' },
          { status: 400 }
        );
      }

      // Get menu item from database
      const menuItem = menuItemMap.get(menuItemId);
      if (!menuItem) {
        return NextResponse.json(
          { success: false, error: `Menu item ${menuItemId} not found` },
          { status: 400 }
        );
      }

      // Check if item is available
      if (!menuItem.is_available) {
        return NextResponse.json(
          { success: false, error: `Item "${menuItem.name}" is not available` },
          { status: 400 }
        );
      }

      // Validate quantity (ignore price from client - use server price)
      const quantity = validateQuantity(item.quantity);
      if (!quantity) {
        return NextResponse.json(
          { success: false, error: 'Invalid quantity. Must be 1-1000' },
          { status: 400 }
        );
      }

      // Use price from database, NOT from client (prevents price manipulation)
      const itemPrice = menuItem.price;
      totalPrice += itemPrice * quantity;

      validatedItems.push({
        menu_item_id: menuItemId,
        quantity,
        price: itemPrice, // Always use server-side price
      });
    }

    // Sanitize and validate optional fields
    const sanitizedCustomerName = sanitizeString(customer_name, 100);
    const sanitizedTableNumber = validateTableNumber(table_number);
    const sanitizedOrderNotes = validateDescription(order_notes);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: sanitizedCustomerName,
        table_number: sanitizedTableNumber,
        order_notes: sanitizedOrderNotes,
        status: 'pending',
        total_price: totalPrice,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items with validated data
    const orderItems = validatedItems.map((item) => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price_at_order_time: item.price, // Server-side validated price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }

    // Fetch complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price_at_order_time,
          menu_item:menu_items (
            id,
            name,
            description,
            image_url
          )
        )
      `)
      .eq('id', order.id)
      .single();

    if (fetchError) {
      console.error('Error fetching complete order:', fetchError);
      throw fetchError;
    }

    console.log('Order created successfully:', order.id);

    return NextResponse.json({
      success: true,
      data: completeOrder,
      message: 'Order created successfully',
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create order',
      },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get orders (for cashier/kitchen)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, accepted, preparing, ready

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price_at_order_time,
          menu_item:menu_items (
            id,
            name,
            description,
            image_url
          )
        )
      `)
      .order('created_at', { ascending: false });

    // Validate and filter by status if provided
    if (status) {
      const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'rejected'];
      if (validStatuses.includes(status)) {
        query = query.eq('status', status);
      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid status filter' },
          { status: 400 }
        );
      }
    }

    const { data: orders, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: orders || [],
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}


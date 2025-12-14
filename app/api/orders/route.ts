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

    // Calculate total price
    let totalPrice = 0;
    for (const item of items) {
      if (!item.menu_item_id || !item.quantity || !item.price) {
        return NextResponse.json(
          { success: false, error: 'Invalid item data' },
          { status: 400 }
        );
      }
      totalPrice += item.price * item.quantity;
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customer_name || null,
        table_number: table_number || null,
        order_notes: order_notes || null,
        status: 'pending',
        total_price: totalPrice,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price_at_order_time: item.price,
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

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
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


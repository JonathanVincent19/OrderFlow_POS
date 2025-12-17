import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  validateUUID,
  validateOrderStatus,
  sanitizeString,
  validateTableNumber,
} from '@/lib/validation';

// PATCH /api/orders/[id] - Update order (accept, reject, update status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate order ID
    const orderId = validateUUID(params.id);
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, customer_name, table_number } = body;

    // Validate status
    const validStatus = validateOrderStatus(status);
    if (!validStatus) {
      return NextResponse.json(
        { success: false, error: 'Valid status is required (pending, accepted, preparing, ready, completed, rejected)' },
        { status: 400 }
      );
    }

    // Check if order exists
    const { data: existingOrder, error: checkError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
      .single();

    if (checkError || !existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      status: validStatus,
    };

    // If accepting order, add customer name and table number
    if (validStatus === 'accepted') {
      const sanitizedCustomerName = sanitizeString(customer_name, 100);
      const sanitizedTableNumber = validateTableNumber(table_number);
      
      if (sanitizedCustomerName) updateData.customer_name = sanitizedCustomerName;
      if (sanitizedTableNumber) updateData.table_number = sanitizedTableNumber;
      updateData.accepted_at = new Date().toISOString();
      // If accepting, automatically set to preparing for kitchen
      updateData.status = 'preparing';
    }

    // If completing order
    if (validStatus === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
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
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update order',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete/reject order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate order ID
    const orderId = validateUUID(params.id);
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Check if order exists
    const { data: existingOrder, error: checkError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
      .single();

    if (checkError || !existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Instead of deleting, mark as rejected
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status: 'rejected' })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error('Error rejecting order:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to reject order',
      },
      { status: 500 }
    );
  }
}


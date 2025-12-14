import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH /api/orders/[id] - Update order (accept, reject, update status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const body = await request.json();
    const { status, customer_name, table_number } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
    };

    // If accepting order, add customer name and table number
    if (status === 'accepted') {
      if (customer_name) updateData.customer_name = customer_name;
      if (table_number) updateData.table_number = table_number;
      updateData.accepted_at = new Date().toISOString();
    }

    // If completing order
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    // If accepting, automatically set to preparing for kitchen
    if (status === 'accepted') {
      updateData.status = 'preparing';
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
    const orderId = params.id;

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


/**
 * Cashier Dashboard Page
 * 
 * Purpose: View pending orders, accept/reject orders after payment confirmation
 * Route: /kasir
 * User Role: Cashier
 */
'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { 
  DollarSign, 
  User, 
  UtensilsCrossed, 
  StickyNote, 
  Receipt, 
  CheckCircle, 
  X,
  Loader2,
  Clock,
  FileText
} from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_order_time: number;
  menu_item: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
  };
}

interface Order {
  id: string;
  customer_name: string | null;
  table_number: string | null;
  order_notes: string | null;
  status: string;
  total_price: number;
  created_at: string;
  order_items: OrderItem[];
}

export default function KasirPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingOrderId, setAcceptingOrderId] = useState<string | null>(null);
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
    // Refresh every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?status=pending');
      const data = await res.json();
      if (data.success) {
        // Preserve user input (customer_name and table_number) when updating orders
        setOrders((prevOrders) => {
          const newOrders = data.data;
          
          // Create a map of existing orders with user input preserved
          const ordersMap = new Map(
            prevOrders.map((order) => [
              order.id,
              {
                customer_name: order.customer_name,
                table_number: order.table_number,
              },
            ])
          );
          
          // Merge server data with preserved user input
          return newOrders.map((newOrder: Order) => {
            const preservedData = ordersMap.get(newOrder.id);
            if (preservedData) {
              // Only preserve if user has typed something
              return {
                ...newOrder,
                customer_name: preservedData.customer_name || newOrder.customer_name,
                table_number: preservedData.table_number || newOrder.table_number,
              };
            }
            return newOrder;
          });
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (order: Order) => {
    if (!order.customer_name || !order.table_number) {
      alert('Please enter customer name and table number first');
      return;
    }

    setAcceptingOrderId(order.id);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'accepted',
          customer_name: order.customer_name,
          table_number: order.table_number,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Store order for print preview before removing from list
        setOrderToPrint({
          ...order,
          status: 'accepted',
        });
        // Remove from pending list
        setOrders(orders.filter((o) => o.id !== order.id));
      } else {
        alert(data.error || 'Failed to accept order');
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('Failed to accept order');
    } finally {
      setAcceptingOrderId(null);
    }
  };

  const handleReject = async (orderId: string) => {
    if (!confirm('Are you sure you want to reject this order?')) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        setOrders(orders.filter((o) => o.id !== orderId));
      } else {
        alert(data.error || 'Failed to reject order');
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('Failed to reject order');
    }
  };

  const updateOrderField = (orderId: string, field: 'customer_name' | 'table_number', value: string) => {
    setOrders(
      orders.map((order) => (order.id === orderId ? { ...order, [field]: value } : order))
    );
  };

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-2xl mb-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
                <DollarSign className="w-8 h-8" />
                Kasir Dashboard
              </h1>
              <p className="text-emerald-100 mt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                <span className="font-semibold">{orders.length}</span> pending order{orders.length !== 1 ? 's' : ''}
          </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <p className="text-sm text-emerald-100">Live Updates</p>
            </div>
          </div>
        </header>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-emerald-100 hover:border-emerald-200 transition-all">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-emerald-400" />
              </div>
              <p className="text-gray-700 text-xl font-bold mb-2">Tidak ada pending orders</p>
              <p className="text-gray-500 text-sm">Order baru akan muncul di sini secara otomatis</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 overflow-hidden hover:shadow-2xl hover:border-emerald-300 hover:scale-[1.02] transition-all duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-white px-6 py-4 border-b-2 border-emerald-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-emerald-600" />
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                    </div>
                    <div className="bg-emerald-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      <p className="text-sm text-emerald-700 font-bold">
                      {format(new Date(order.created_at), 'hh:mm a')}
                    </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Input Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Customer Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={order.customer_name || ''}
                        onChange={(e) =>
                          updateOrderField(order.id, 'customer_name', e.target.value)
                        }
                        placeholder="Enter customer name"
                        className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-emerald-300"
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4" />
                        Table Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={order.table_number || ''}
                        onChange={(e) =>
                          updateOrderField(order.id, 'table_number', e.target.value)
                        }
                        placeholder="Enter table number"
                        className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white hover:border-emerald-300"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border-2 border-emerald-200">
                    <p className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4" />
                      Items Ordered
                    </p>
                    <ul className="space-y-2">
                      {order.order_items.map((item) => (
                        <li key={item.id} className="flex justify-between items-center text-sm bg-white/60 rounded-lg px-3 py-2">
                          <span className="text-gray-900 font-medium">
                            • {item.menu_item.name} <span className="text-emerald-600 font-bold">x{item.quantity}</span>
                          </span>
                          <span className="font-bold text-emerald-700">
                            {formatPrice(item.price_at_order_time * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Order Notes */}
                  {order.order_notes && (
                    <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-bold text-amber-800 flex items-center gap-2 mb-1">
                          <StickyNote className="w-4 h-4" />
                          Notes:
                        </span>
                        <span className="text-gray-900 italic">{order.order_notes}</span>
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t-2 border-emerald-200 pt-4">
                    <div className="flex justify-between items-center bg-emerald-50 rounded-xl px-4 py-3">
                      <span className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Total:
                      </span>
                      <span className="font-bold text-2xl text-emerald-700">
                        {formatPrice(order.total_price)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleAccept(order)}
                      disabled={
                        acceptingOrderId === order.id ||
                        !order.customer_name?.trim() ||
                        !order.table_number?.trim()
                      }
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3.5 px-4 rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                    >
                      {acceptingOrderId === order.id ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Accept Order
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(order.id)}
                      disabled={acceptingOrderId === order.id}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 px-4 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Print Receipt Modal */}
      {orderToPrint && (
        <ReceiptPrintModal
          order={orderToPrint}
          onClose={() => setOrderToPrint(null)}
          formatPrice={formatPrice}
        />
      )}
    </div>
  );
}

// Receipt Print Modal Component
function ReceiptPrintModal({
  order,
  onClose,
  formatPrice,
}: {
  order: Order;
  onClose: () => void;
  formatPrice: (price: number) => string;
}) {
  const handlePrint = () => {
    // Clone receipt content to print-only div
    const receiptContent = document.getElementById('receipt-content');
    const printDiv = document.getElementById('receipt-print');
    
    if (receiptContent && printDiv) {
      printDiv.innerHTML = receiptContent.innerHTML;
      printDiv.classList.remove('hidden');
      
      // Trigger print
      window.print();
      
      // Clean up after print dialog closes
      setTimeout(() => {
        printDiv.classList.add('hidden');
        printDiv.innerHTML = '';
      }, 100);
    } else {
      // Fallback: just print
      window.print();
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm');
  };

  return (
    <>
      {/* Hidden Print Version - Only visible when printing */}
      <div id="receipt-print" className="hidden print-only"></div>

          {/* Modal Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print animate-fadeIn"
            onClick={onClose}
          >
            {/* Modal Content */}
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform scale-100 animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-5 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Receipt className="w-6 h-6" />
                  Print Receipt
                </h2>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Receipt Preview */}
              <div className="p-6">
                <div id="receipt-content" className="receipt-container">
                  {/* Receipt Header */}
                  <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">BUTUH CLIENT</h1>
                    <p className="text-sm text-gray-600">Jl. Contoh No. 123</p>
                    <p className="text-sm text-gray-600">Telp: (021) 1234-5678</p>
                  </div>

                  <div className="border-t-2 border-dashed border-gray-400 my-4"></div>

                  {/* Order Info */}
                  <div className="mb-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order #:</span>
                      <span className="font-semibold text-gray-900">
                        {order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Table:</span>
                      <span className="font-semibold text-gray-900">
                        #{order.table_number || 'N/A'}
                      </span>
                    </div>
                    {order.customer_name && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="text-gray-900">{order.customer_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-dashed border-gray-300 my-3"></div>

                  {/* Items */}
                  <div className="mb-4">
                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="text-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-gray-900 flex-1">
                              {item.menu_item.name}
                            </span>
                            <span className="text-gray-900 ml-2">
                              {formatPrice(item.price_at_order_time * item.quantity)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>
                              {item.quantity}x {formatPrice(item.price_at_order_time)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t-2 border-dashed border-gray-400 my-3"></div>

                  {/* Total */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                      <span>TOTAL:</span>
                      <span>{formatPrice(order.total_price)}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {order.order_notes && (
                    <>
                      <div className="border-t border-dashed border-gray-300 my-3"></div>
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Notes:</p>
                        <p className="text-sm text-gray-900">{order.order_notes}</p>
                      </div>
                    </>
                  )}

                  <div className="border-t-2 border-dashed border-gray-400 my-4"></div>

                  {/* Footer */}
                  <div className="text-center text-xs text-gray-600">
                    <p className="mb-1">Terima kasih atas kunjungan Anda</p>
                    <p>Semoga Anda menikmati pesanan Anda</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handlePrint}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-4 rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <Receipt className="w-5 h-5" />
                    Print Nota
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Tidak
                  </button>
                </div>
              </div>
            </div>
          </div>
    </>
  );
}


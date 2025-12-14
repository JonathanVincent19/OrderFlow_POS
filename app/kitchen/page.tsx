/**
 * Kitchen Dashboard Page
 * 
 * Purpose: View order queue, update order status (Preparing → Ready)
 * Route: /kitchen
 * User Role: Kitchen Staff
 */
'use client';

import { useEffect, useState } from 'react';
import { format, startOfDay, isSameDay, parseISO } from 'date-fns';
import { 
  ChefHat, 
  Clock, 
  User, 
  UtensilsCrossed, 
  StickyNote, 
  ArrowRight, 
  CheckCircle, 
  Calendar,
  Flame,
  RefreshCw,
  MapPin
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
  accepted_at: string | null;
  order_items: OrderItem[];
}

export default function KitchenPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'preparing' | 'ready'>('all');
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  useEffect(() => {
    fetchOrders();
    // Refresh every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      // Always fetch all orders (preparing + ready) for accurate counts
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        // Filter out rejected and completed orders
        let filteredOrders = data.data.filter(
          (order: Order) =>
            order.status === 'preparing' ||
            order.status === 'ready' ||
            order.status === 'accepted'
        );

        // Sort by accepted_at or created_at (newest first)
        filteredOrders.sort((a: Order, b: Order) => {
          const dateA = a.accepted_at || a.created_at;
          const dateB = b.accepted_at || b.created_at;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        setAllOrders(filteredOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: 'preparing' | 'ready') => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchOrders();
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
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

  // Helper function to format date in Indonesian format
  const formatDateIndonesian = (date: Date): string => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day} ${month} ${year}`;
  };

  // Helper function to get order date (using accepted_at, fallback to created_at)
  const getOrderDate = (order: Order): Date => {
    const dateString = order.accepted_at || order.created_at;
    return parseISO(dateString);
  };

  // Filter orders by selected date (default: today)
  const filterOrdersByDate = (orders: Order[]): Order[] => {
    const selectedDateObj = startOfDay(parseISO(selectedDate));
    return orders.filter((order) => {
      const orderDate = getOrderDate(order);
      return isSameDay(orderDate, selectedDateObj);
    });
  };

  // Filter orders for display based on status filter
  const statusFilteredOrders = (() => {
    if (statusFilter === 'preparing') {
      return allOrders.filter((o) => o.status === 'preparing' || o.status === 'accepted');
    } else if (statusFilter === 'ready') {
      return allOrders.filter((o) => o.status === 'ready');
    } else {
      return allOrders;
    }
  })();

  // Apply date filter
  const dateFilteredOrders = filterOrdersByDate(statusFilteredOrders);

  // Group orders by date
  const groupedOrders = dateFilteredOrders.reduce((groups, order) => {
    const orderDate = getOrderDate(order);
    const dateKey = format(orderDate, 'yyyy-MM-dd');
    const dateLabel = formatDateIndonesian(orderDate);
    
    if (!groups[dateKey]) {
      groups[dateKey] = {
        dateLabel,
        dateKey,
        orders: [],
      };
    }
    groups[dateKey].orders.push(order);
    return groups;
  }, {} as Record<string, { dateLabel: string; dateKey: string; orders: Order[] }>);

  // Sort groups by date (newest first)
  const sortedGroups = Object.values(groupedOrders).sort((a, b) => {
    return new Date(b.dateKey).getTime() - new Date(a.dateKey).getTime();
  });

  // Calculate counts from orders filtered by selected date
  const dateFilteredAllOrders = filterOrdersByDate(allOrders);
  const preparingOrders = dateFilteredAllOrders.filter((o) => o.status === 'preparing' || o.status === 'accepted');
  const readyOrders = dateFilteredAllOrders.filter((o) => o.status === 'ready');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-2xl mb-4 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <ChefHat className="w-8 h-8" />
                Kitchen Dashboard
              </h1>
              <div className="flex items-center gap-4 text-emerald-100">
                <span className="flex items-center gap-2 bg-amber-500 px-3 py-1 rounded-full text-white font-bold text-sm">
                  <Flame className="w-4 h-4" />
                  {preparingOrders.length} preparing
                </span>
                <span className="flex items-center gap-2 bg-emerald-500 px-3 py-1 rounded-full text-white font-bold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  {readyOrders.length} ready
                </span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <p className="text-sm text-emerald-100">Auto Refresh</p>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4 border-2 border-emerald-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Status Filter Tabs - Left */}
            <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 text-sm ${
                statusFilter === 'all'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
                <UtensilsCrossed className="w-4 h-4" />
              All
            </button>
            <button
              onClick={() => setStatusFilter('preparing')}
                className={`px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 text-sm ${
                statusFilter === 'preparing'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
                <Flame className="w-4 h-4" />
              Preparing ({preparingOrders.length})
            </button>
            <button
              onClick={() => setStatusFilter('ready')}
                className={`px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 text-sm ${
                statusFilter === 'ready'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
                <CheckCircle className="w-4 h-4" />
              Ready ({readyOrders.length})
            </button>
            </div>

            {/* Date Filter - Right */}
            <div className="flex items-center gap-2">
              <input
                id="date-filter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-black px-3 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all hover:border-emerald-300 text-sm"
              />
              <button
                onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-2 text-sm"
              >
                <MapPin className="w-3.5 h-3.5" />
                Hari Ini
              </button>
            </div>
          </div>
        </div>

        {sortedGroups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-emerald-100">
            <div className="w-20 h-20 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center">
              <UtensilsCrossed className="w-10 h-10 text-emerald-400" />
            </div>
            <p className="text-gray-700 text-xl font-bold mb-2">Tidak ada order untuk tanggal yang dipilih</p>
            <p className="text-gray-500 mt-2">
              {isSameDay(parseISO(selectedDate), new Date())
                ? 'Order akan muncul setelah di-accept kasir'
                : 'Coba pilih tanggal lain atau kembali ke hari ini'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedGroups.map((group) => (
              <div key={group.dateKey} className="space-y-4">
                {/* Date Header */}
                <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 border-l-4 border-emerald-600 p-5 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <h2 className="text-1xl font-bold text-gray-900 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                    {group.dateLabel}
                  </h2>
                  <p className="text-sm text-emerald-700 font-semibold">
                    {group.orders.length} order{group.orders.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
                {/* Orders Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                  {group.orders.map((order) => (
                    <div
                      key={order.id}
                      className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                        order.status === 'ready'
                          ? 'border-emerald-500 bg-gradient-to-br from-white to-emerald-50'
                          : order.status === 'preparing'
                          ? 'border-amber-500 bg-gradient-to-br from-white to-amber-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                              Table #{order.table_number || 'N/A'}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 ${
                                order.status === 'ready'
                                  ? 'bg-emerald-500 text-white'
                                  : order.status === 'preparing'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {order.status === 'ready' ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  READY
                                </>
                              ) : order.status === 'preparing' ? (
                                <>
                                  <Flame className="w-3 h-3" />
                                  COOKING
                                </>
                              ) : (
                                order.status.toUpperCase()
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-medium">
                            Order #{order.id.slice(0, 8)}
                          </p>
                          {order.accepted_at && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(order.accepted_at), 'HH:mm')}
                            </p>
                          )}
                        </div>
                      </div>

                      {order.customer_name && (
                        <p className="text-sm text-gray-700 mb-3 font-medium bg-white/80 px-3 py-1.5 rounded-lg flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {order.customer_name}
                        </p>
                      )}

                      <div className={`rounded-xl p-4 mb-4 border-2 ${
                        order.status === 'ready'
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-amber-50 border-amber-200'
                      }`}>
                        <p className="font-bold text-sm mb-3 text-gray-900 flex items-center gap-2">
                          <UtensilsCrossed className="w-4 h-4" />
                          Items to Prepare:
                        </p>
                        <ul className="space-y-2 text-gray-900">
                          {order.order_items.map((item) => (
                            <li key={item.id} className="text-sm bg-white/70 rounded-lg px-3 py-2">
                              <span className="font-bold">
                                • {item.menu_item.name} <span className={order.status === 'ready' ? 'text-emerald-600' : 'text-amber-600'}>x{item.quantity}</span>
                              </span>
                              {item.menu_item.description && (
                                <span className="text-gray-600 ml-1 text-xs block mt-0.5 italic">
                                  ({item.menu_item.description})
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {order.order_notes && (
                        <div className="mb-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-bold text-blue-800 flex items-center gap-2 mb-1">
                              <StickyNote className="w-4 h-4" />
                              Special Notes:
                            </span>
                            <span className="italic">{order.order_notes}</span>
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        {order.status === 'preparing' || order.status === 'accepted' ? (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'ready')}
                            disabled={updatingOrderId === order.id}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                          >
                            {updatingOrderId === order.id ? (
                              <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <ArrowRight className="w-5 h-5" />
                                Mark as Ready
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-bold text-center shadow-lg flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Ready to Serve
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


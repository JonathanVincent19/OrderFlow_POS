/**
 * Customer Checkout Page
 * 
 * Purpose: Collect customer information and place order
 * Route: /checkout
 * User Role: Customer
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { 
  ArrowLeft, 
  User, 
  FileText, 
  ShoppingBag, 
  CreditCard, 
  CheckCircle 
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [customerName, setCustomerName] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  // Fix hydration error by only rendering cart data after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      setError('Customer name is required');
      return;
    }

    if (items.length === 0) {
      setError('Cart is empty. Please add items to cart first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderItems = items.map((item) => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: item.price,
      }));

      console.log('Placing order with items:', orderItems.length);

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: customerName,
          order_notes: orderNotes || null,
          items: orderItems,
        }),
      });

      console.log('Response status:', res.status);

      const data = await res.json();
      console.log('Response data:', data);

      if (!res.ok || !data.success) {
        const errorMsg = data.error || 'Failed to place order';
        console.error('Order failed:', errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      console.log('Order successful, clearing cart and redirecting...');
      
      // Clear cart first
      clearCart();
      
      // Use window.location.href for immediate redirect
      window.location.href = '/order-success';
    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  // Redirect if cart is empty (only after mounted to avoid hydration mismatch)
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart');
    }
  }, [mounted, items.length, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 pb-8">
      <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 border-b-2 p-5 sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto max-w-2xl">
          <Link href="/cart" className="inline-flex items-center text-white hover:text-emerald-100 transition-all font-bold">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center flex items-center justify-center gap-3">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
          Checkout
        </h1>

        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-800 px-5 py-4 rounded-xl mb-6 font-semibold shadow-md">
            ⚠️ {error}
          </div>
        )}

        {/* Order Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 p-6 mb-4">
          <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-600" />
            Order Information
          </h2>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400 hover:border-emerald-300"
              required
            />
          </div>
        </div>

        {/* Order Notes Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 p-6 mb-4">
          <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            Order Notes <span className="text-sm font-normal text-gray-500">(optional)</span>
          </h2>
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Write your order notes here.."
            rows={4}
            className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all resize-none text-gray-900 placeholder-gray-400 hover:border-emerald-300"
          />
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 p-6 mb-4">
          <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
            Order Summary
          </h2>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_auto] gap-4 pb-3 border-b-2 border-emerald-100">
              <div className="font-bold text-sm text-gray-700">Product</div>
              <div className="font-bold text-sm text-gray-700 text-right">Subtotal</div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.menu_item_id} className="grid grid-cols-[1fr_auto] gap-4 bg-emerald-50/50 p-3 rounded-xl">
                  <div className="text-sm text-gray-900">
                    <span className="font-bold">{item.name}</span>
                    <span className="text-emerald-700 font-bold"> x {item.quantity}</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-700 text-right">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t-2 border-emerald-200 space-y-2">
              <div className="flex justify-between items-center bg-emerald-50 rounded-xl p-4">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-emerald-700">{formatPrice(getTotal())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            Pembayaran di Kasir
          </h2>
          <div className="bg-emerald-50 rounded-xl p-4 mb-4 border-2 border-emerald-200">
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              💡 Silahkan klik <span className="font-bold text-emerald-700">"Place order"</span> dan lakukan pembayaran di kasir.
            </p>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={loading || !customerName.trim()}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {loading ? 'Placing Order...' : (
              <>
                <CheckCircle className="w-5 h-5" />
                Place order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


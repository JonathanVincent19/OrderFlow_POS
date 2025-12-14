/**
 * Customer Cart Page
 * 
 * Purpose: Display cart items, manage quantities, remove items, proceed to checkout
 * Route: /cart
 * User Role: Customer
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight 
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString('id-ID')}`;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-5 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="text-white hover:text-emerald-100 transition flex items-center gap-2 font-bold">
              <ArrowLeft className="w-5 h-5" />
              Back to Menu
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              Your Order List
            </h1>
            <div className="w-32"></div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-200">
              <ShoppingBag className="w-12 h-12 text-emerald-400" />
            </div>
            <p className="text-gray-900 text-xl font-bold mb-2">Your cart is empty</p>
            <p className="text-gray-600 text-sm mb-6">Add some delicious items to get started</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 border-b-2 p-5 sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto max-w-2xl">
          <Link href="/" className="inline-flex items-center text-white hover:text-emerald-100 transition-all font-bold">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Menu
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center flex items-center justify-center gap-3">
          <ShoppingBag className="w-8 h-8 text-emerald-600" />
          Your Order List
        </h1>

      
      {/* Cart Items */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 p-6 space-y-4">
          {items.map((item) => (
            <div key={item.menu_item_id} className="flex gap-4 pb-5 border-b-2 border-emerald-100 last:border-0 relative group overflow-visible">
              {item.image_url ? (
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-visible">
                  <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus ${item.name} dari order?`)) {
                        removeItem(item.menu_item_id);
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-110 z-10"
                    title="Hapus item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-visible">
                  <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus ${item.name} dari order?`)) {
                        removeItem(item.menu_item_id);
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-110 z-10"
                    title="Hapus item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base mb-1">{item.name}</h3>
                    {item.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    )}
                
                <div className="flex items-center justify-between mt-4 gap-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full border-2 border-emerald-600 flex items-center justify-center hover:bg-emerald-600 transition-all text-emerald-700 hover:text-white shadow-sm"
                    >
                      <Minus className="w-3 h-3 stroke-[3]" />
                    </button>
                    <span className="w-7 text-center font-bold text-gray-900 text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full border-2 border-emerald-600 flex items-center justify-center hover:bg-emerald-600 transition-all text-emerald-700 hover:text-white shadow-sm"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                    </button>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-base text-emerald-700">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Summary Section */}
          <div className="pt-6 border-t-2 border-emerald-200 mt-4">
            <div className="flex justify-between items-center mb-6 bg-emerald-50 rounded-xl p-4">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-emerald-700">{formatPrice(getTotal())}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-3 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : (
                <>
                  Checkout
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <Link
              href="/"
              className="block text-center text-emerald-700 hover:text-emerald-800 font-bold text-sm transition-all"
            >
              + Add more items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


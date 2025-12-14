/**
 * Customer Menu Page
 * 
 * Purpose: Display menu items by category, allow customers to browse and add items to cart
 * Route: / (root)
 * User Role: Customer
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { 
  Search, 
  ShoppingCart, 
  X, 
  Plus, 
  Minus,
  Maximize2
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  items: MenuItem[];
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const { addItem, getItemCount, getItemQuantity, updateQuantity } = useCartStore();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async (retryCount = 0) => {
    try {
      setError(null);
      setLoading(true);
      
      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      let res;
      try {
        res = await fetch('/api/menu', {
          signal: controller.signal,
          cache: 'no-store', // Always fetch fresh data
        });
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        // If timeout or network error, retry up to 2 times
        if (retryCount < 2 && (fetchError.name === 'AbortError' || fetchError.message.includes('fetch'))) {
          console.log(`Retrying fetch... (attempt ${retryCount + 1})`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          return fetchMenu(retryCount + 1);
        }
        
        throw fetchError;
      }
      
      // Check if response is HTML (error page) instead of JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        setError('Server configuration error. Please check your Supabase URL in .env.local file. Make sure it starts with https:// and ends with .supabase.co');
        setLoading(false);
        return;
      }
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        setCategories(data.data.categories);
        setAllItems(data.data.allItems || []);
        if (data.data.categories.length > 0) {
          setSelectedCategory(data.data.categories[0].id);
        } else {
          setError('No menu categories found. Please check your database.');
        }
      } else {
        setError(data.error || 'Failed to load menu');
      }
    } catch (error: any) {
      console.error('Error fetching menu:', error);
      
      let errorMessage = 'Failed to load menu. ';
      if (error.name === 'AbortError') {
        errorMessage += 'Request timeout. Please check your internet connection.';
      } else if (error.message.includes('fetch')) {
        errorMessage += 'Cannot connect to server. Make sure the development server is running.';
      } else if (error.message.includes('HTTP')) {
        errorMessage += `Server error: ${error.message}`;
      } else {
        errorMessage += error.message || 'Please check your connection and .env.local configuration.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (item: MenuItem) => {
    addItem({
      menu_item_id: item.id,
      name: item.name,
      description: item.description || undefined,
      price: item.price,
      image_url: item.image_url || undefined,
    });
  };

  const handleAddFromModal = () => {
    if (!selectedItem) return;
    
    for (let i = 0; i < itemQuantity; i++) {
      handleAddItem(selectedItem);
    }
    
    // Reset and close modal
    setSelectedItem(null);
    setItemQuantity(1);
  };

  const openItemDetail = (item: MenuItem) => {
    if (!item.is_available) return; // Don't open if sold out
    setSelectedItem(item);
    setItemQuantity(1);
  };

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);
  const cartCount = getItemCount();
  const { getTotal } = useCartStore();
  const cartTotal = getTotal();

  // Filter items based on search query
  const filteredItems = searchQuery.trim()
    ? allItems.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
        );
      })
    : selectedCategoryData?.items || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Header - Not Sticky */}
      <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 shadow-lg rounded-b-3xl">
        <div className="container mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <span className="text-emerald-600 font-bold text-sm">LOGO</span>
            </div>
            <div>
              <div className="text-center"> 
                <h1 className="text-3xl font-bold leading-tight font-[family-name:var(--font-bebas)] tracking-wider">LESTARI KOPI</h1>
                <p className="text-xs leading-tight text-emerald-100 font-[family-name:var(--font-inter)]">Ponorogo</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Search & Category - Transparent Glassmorphism */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/70 shadow-md">
        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="container mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 z-10 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Menu..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) {
                  setSelectedCategory(null);
                } else if (categories.length > 0) {
                  setSelectedCategory(categories[0].id);
                }
              }}
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 border border-emerald-800/50 focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-sm text-sm"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 pb-3">
          <div className="container mx-auto overflow-x-auto">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all font-bold text-sm ${
                    selectedCategory === category.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/60 backdrop-blur-sm text-gray-700 border-2 border-emerald-600 hover:bg-white/80'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Menu</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="text-sm text-red-600 space-y-1">
              <p>Possible solutions:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Make sure SQL schema has been run in Supabase SQL Editor</li>
                <li>Check that tables (menu_categories, menu_items) exist in Supabase</li>
                <li>Verify .env.local has correct Supabase credentials</li>
                <li>Check browser console for more details</li>
              </ul>
            </div>
            <button
              onClick={() => fetchMenu(0)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className={`container mx-auto px-4 py-6 ${cartCount > 0 ? 'pb-24' : ''}`}>
        {!error && (
          <div>
            {searchQuery.trim() ? (
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Search results: &quot;{searchQuery}&quot; ({filteredItems.length})
              </h2>
            ) : selectedCategoryData ? (
              <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase">
                {selectedCategoryData.name}
              </h2>
            ) : null}
            
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl shadow-sm border-2 border-emerald-100 overflow-hidden hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col ${
                      item.is_available ? '' : 'opacity-75'
                    }`}
                  >
                    <div 
                      className={`relative ${item.is_available ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      onClick={() => openItemDetail(item)}
                    >
                      {item.image_url ? (
                        <div className="w-full aspect-square bg-gray-200 relative overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className={`w-full h-full object-cover ${!item.is_available ? 'grayscale' : ''}`}
                          />
                        </div>
                      ) : (
                        <div className={`w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${!item.is_available ? 'grayscale' : ''}`}>
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <h3 
                        className="font-bold text-sm mb-1 text-gray-900 uppercase line-clamp-2 cursor-pointer"
                        onClick={() => openItemDetail(item)}
                      >
                        {item.name}
                      </h3>
                      <p className="text-emerald-700 font-bold text-base mb-2">
                        Rp{item.price.toLocaleString('id-ID')}
                      </p>
                      <div className="mt-auto">
                        {!item.is_available ? (
                          <p className="text-red-600 text-xs font-semibold text-center py-1.5">Sold out</p>
                        ) : (() => {
                          const itemQty = getItemQuantity(item.id);
                          
                          if (itemQty > 0) {
                            // Show quantity controls if item is in cart
                            return (
                              <div className="flex items-center justify-center gap-7">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(item.id, itemQty - 1);
                                  }}
                                  className="w-6 h-6 rounded-full border-2 border-emerald-600 flex items-center justify-center hover:bg-emerald-600 transition-all text-emerald-700 hover:text-white shadow-sm"
                                >
                                  <Minus className="w-3 h-3 stroke-[3]" />
                                </button>
                                <span className="w-7 text-center font-bold text-gray-900 text-sm">
                                  {itemQty}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(item.id, itemQty + 1);
                                  }}
                                  className="w-6 h-6 rounded-full border-2 border-emerald-600 flex items-center justify-center hover:bg-emerald-600 transition-all text-emerald-700 hover:text-white shadow-sm"
                                >
                                  <Plus className="w-3 h-3 stroke-[3]" />
                                </button>
                              </div>
                            );
                          } else {
                            // Show Add button if item is not in cart
                            return (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddItem(item);
                                }}
                                className="w-full border-2 border-emerald-600 text-emerald-700 py-1.5 rounded-lg font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95 text-sm"
                              >
                                Add
                              </button>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No items found matching &quot;{searchQuery}&quot;.</p>
              </div>
            ) : selectedCategoryData && selectedCategoryData.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No items available in this category</p>
              </div>
            ) : null}
          </div>
        )}

        {!error && categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No menu categories found</p>
            <p className="text-gray-400 text-sm">
              Please run the SQL schema in Supabase to create sample data
            </p>
          </div>
        )}
      </div>

      {/* Floating Cart Overlay */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-emerald-200 shadow-2xl z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-900 font-bold">Your Order:</span>
              </div>
              <Link
                href="/cart"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="bg-white text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {cartCount}
                </span>
                <span>Rp{cartTotal.toLocaleString('id-ID')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="relative">
              {selectedItem.image_url ? (
                <div className="w-full h-64 md:h-96 bg-gray-200 relative overflow-hidden">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg
                    className="w-24 h-24 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all shadow-lg"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Details Section */}
            <div className="p-6">
              {/* Name and Price */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase">{selectedItem.name}</h2>
              <p className="text-3xl font-bold text-emerald-700 mb-4">
                Rp{selectedItem.price.toLocaleString('id-ID')}
              </p>

              {/* Description */}
              {selectedItem.description && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-6 bg-emerald-50 rounded-xl p-4">
                <span className="font-bold text-gray-900">Total Order</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    disabled={itemQuantity <= 1}
                    className="w-10 h-10 rounded-full border-2 border-emerald-600 flex items-center justify-center hover:bg-emerald-600 transition-all text-emerald-700 hover:text-white"
                  >
                    <Minus className="w-5 h-5 stroke-[3]" />
                  </button>
                  <span className="text-xl font-bold text-gray-900 w-8 text-center">{itemQuantity}</span>
                  <button
                    onClick={() => setItemQuantity(itemQuantity + 1)}
                    className="w-10 h-10 rounded-full border-2 border-emerald-600 flex items-center justify-center hover:bg-emerald-600 transition-all text-emerald-700 hover:text-white"
                  >
                    <Plus className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddFromModal}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 px-6 rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Orders - Rp{(selectedItem.price * itemQuantity).toLocaleString('id-ID')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

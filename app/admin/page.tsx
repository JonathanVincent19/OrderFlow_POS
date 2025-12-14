/**
 * Admin Panel Page
 * 
 * Purpose: Manage menu items, categories, toggle availability
 * Route: /admin
 * User Role: Admin
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  DollarSign, 
  ChefHat, 
  UtensilsCrossed, 
  FolderOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  CheckCircle,
  XCircle,
  Loader2,
  Search
} from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  category_id: string | null; // Legacy field, kept for backward compatibility
  category_ids?: string[]; // New field for many-to-many
  sort_order: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'menu' | 'categories'>('menu');
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for menu item
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_ids: [] as string[],
    image_url: '',
    is_available: true,
    sort_order: 0,
  });

  // Form states for category
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuRes, categoryRes] = await Promise.all([
        fetch('/api/admin/menu-items'),
        fetch('/api/admin/categories'),
      ]);

      const menuData = await menuRes.json();
      const categoryData = await categoryRes.json();

      if (menuData.success) {
        setMenuItems(menuData.data);
      }
      if (categoryData.success) {
        setCategories(categoryData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/menu-items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !currentStatus }),
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        setError(data.error || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      setError('Failed to update availability');
    }
  };

  const handleToggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        setError(data.error || 'Failed to update category status');
      }
    } catch (error) {
      console.error('Error updating category status:', error);
      setError('Failed to update category status');
    }
  };

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/menu-items/${itemId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        setError(data.error || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item');
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"? This will remove all items in this category.`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        setError(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    }
  };

  const openMenuForm = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setMenuFormData({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        category_ids: item.category_ids || (item.category_id ? [item.category_id] : []),
        image_url: item.image_url || '',
        is_available: item.is_available,
        sort_order: item.sort_order,
      });
    } else {
      setEditingItem(null);
      setMenuFormData({
        name: '',
        description: '',
        price: '',
        category_ids: [],
        image_url: '',
        is_available: true,
        sort_order: 0,
      });
    }
    setShowMenuForm(true);
  };

  const openCategoryForm = (category?: MenuCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryFormData({
        name: category.name,
        description: category.description || '',
        is_active: category.is_active,
        sort_order: category.sort_order,
      });
    } else {
      setEditingCategory(null);
      setCategoryFormData({
        name: '',
        description: '',
        is_active: true,
        sort_order: 0,
      });
    }
    setShowCategoryForm(true);
  };

  const handleSubmitMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingItem
        ? `/api/admin/menu-items/${editingItem.id}`
        : '/api/admin/menu-items';

      const method = editingItem ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: menuFormData.name,
          description: menuFormData.description || null,
          price: parseFloat(menuFormData.price),
          category_ids: menuFormData.category_ids || [],
          image_url: menuFormData.image_url || null,
          is_available: menuFormData.is_available,
          sort_order: parseInt(menuFormData.sort_order.toString()) || 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowMenuForm(false);
        fetchData();
      } else {
        setError(data.error || 'Failed to save menu item');
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      setError('Failed to save menu item');
    }
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';

      const method = editingCategory ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryFormData.name,
          description: categoryFormData.description || null,
          is_active: categoryFormData.is_active,
          sort_order: parseInt(categoryFormData.sort_order.toString()) || 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCategoryForm(false);
        fetchData();
      } else {
        setError(data.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Failed to save category');
    }
  };

  if (loading) {
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
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex flex-col overflow-hidden">
      <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-5 shadow-lg flex-shrink-0">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Admin Panel
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/kasir')}
              className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-bold hover:bg-white/30 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Kasir
            </button>
            <button
              onClick={() => router.push('/kitchen')}
              className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-bold hover:bg-white/30 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <ChefHat className="w-5 h-5" />
              Kitchen
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl flex-1 overflow-hidden flex flex-col">
        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-800 px-5 py-4 rounded-xl mb-6 font-semibold shadow-md">
            ⚠️ {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 mb-6 overflow-hidden flex-shrink-0">
          <div className="flex border-b-2 border-emerald-100">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-8 py-4 font-bold transition-all flex items-center gap-2 ${
                activeTab === 'menu'
                  ? 'border-b-4 border-emerald-600 text-emerald-700 bg-emerald-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5" />
              Menu Items
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-8 py-4 font-bold transition-all flex items-center gap-2 ${
                activeTab === 'categories'
                  ? 'border-b-4 border-emerald-600 text-emerald-700 bg-emerald-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
              Categories
            </button>
          </div>
        </div>

        {/* Menu Items Tab */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 p-6 flex flex-col flex-1 overflow-hidden">
            <div className="flex justify-between items-center mb-6 flex-shrink-0 gap-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 flex-shrink-0">
                <UtensilsCrossed className="w-6 h-6" />
                Manage Menu Items
              </h2>
              
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border-2 border-emerald-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-sm"
                />
              </div>

              <button
                onClick={() => openMenuForm()}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
                Add Item
              </button>
            </div>

            {(() => {
              const filteredItems = menuItems.filter((item) => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase();
                return (
                  item.name.toLowerCase().includes(query) ||
                  (item.description && item.description.toLowerCase().includes(query))
                );
              });

              if (filteredItems.length === 0) {
                return (
                  <div className="flex items-center justify-center py-16 border-2 border-emerald-100 rounded-xl">
                    <div className="text-center">
                      <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 font-semibold">No items found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="overflow-auto rounded-xl border-2 border-emerald-100 flex-1">
              <table className="w-full">
                    <thead className="bg-gradient-to-r from-emerald-50 to-green-50 border-b-2 border-emerald-200 sticky top-0 z-10">
                  <tr>
                        <th className="px-5 py-4 text-left text-sm font-bold text-gray-900">Name</th>
                        <th className="px-5 py-4 text-left text-sm font-bold text-gray-900">Price</th>
                        <th className="px-5 py-4 text-left text-sm font-bold text-gray-900">Category</th>
                        <th className="px-5 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                        <th className="px-5 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                      {filteredItems.map((item) => (
                    <tr key={item.id} className="text-gray-900 border-b border-emerald-100 hover:bg-emerald-50/50 transition-all">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-bold text-gray-900">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-0.5 italic">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-900 font-semibold">
                        Rp{item.price.toLocaleString('id-ID')}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {item.category_ids && item.category_ids.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {item.category_ids.map((catId) => {
                              const cat = categories.find((c) => c.id === catId);
                              return cat ? (
                                <span key={catId} className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold shadow-sm">
                                  {cat.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        ) : item.category_id ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold shadow-sm">
                            {categories.find((cat) => cat.id === item.category_id)?.name || 'Uncategorized'}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm italic">No categories</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 w-fit ${
                            item.is_available
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.is_available ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Available
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Unavailable
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openMenuForm(item)}
                            className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-200 transition-all shadow-sm hover:shadow-md flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleAvailability(item.id, item.is_available)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-1 ${
                              item.is_available
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            }`}
                          >
                            {item.is_available ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all shadow-sm hover:shadow-md"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              );
            })()}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 p-6 flex-1 overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FolderOpen className="w-6 h-6" />
                Manage Categories
              </h2>
              <button
                onClick={() => openCategoryForm()}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="border-2 border-emerald-100 rounded-2xl p-5 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/30 transform hover:scale-[1.02]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-gray-900">{category.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 ${
                        category.is_active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {category.is_active ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </>
                      )}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-3 italic">{category.description}</p>
                  )}
                  <div className="text-sm text-emerald-700 font-semibold mb-4 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4" />
                    {menuItems.filter((item) => 
                      item.category_ids?.includes(category.id) || item.category_id === category.id
                    ).length} items
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openCategoryForm(category)}
                      className="flex-1 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-200 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleCategoryStatus(category.id, category.is_active)}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1 ${
                        category.is_active
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      }`}
                    >
                      {category.is_active ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all shadow-sm hover:shadow-md"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Menu Item Form Modal */}
      {showMenuForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-emerald-50 to-green-50 -m-6 p-6 rounded-t-2xl border-b-2 border-emerald-200">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {editingItem ? (
                    <>
                      <Edit2 className="w-6 h-6" />
                      Edit Menu Item
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      Add Menu Item
                    </>
                  )}
                </h3>
                <button
                  onClick={() => setShowMenuForm(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmitMenu} className="space-y-5 mt-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={menuFormData.name}
                    onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                    className="text-gray-900 w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={menuFormData.description}
                    onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                    className="text-gray-900 w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Price *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={menuFormData.price}
                      onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                      className="text-gray-900 w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Categories
                      <span className="text-xs text-gray-500 font-normal ml-1">(select multiple)</span>
                    </label>
                    <div className="border-2 border-emerald-200 rounded-xl p-3 max-h-48 overflow-y-auto bg-emerald-50/30">
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <label
                            key={cat.id}
                            className="flex items-center mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={menuFormData.category_ids.includes(cat.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setMenuFormData({
                                    ...menuFormData,
                                    category_ids: [...menuFormData.category_ids, cat.id],
                                  });
                                } else {
                                  setMenuFormData({
                                    ...menuFormData,
                                    category_ids: menuFormData.category_ids.filter((id) => id !== cat.id),
                                  });
                                }
                              }}
                              className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-900">{cat.name}</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No categories available</p>
                      )}
                    </div>
                    {menuFormData.category_ids.length > 0 && (
                      <p className="mt-2 text-xs text-gray-500">
                        {menuFormData.category_ids.length} categor{menuFormData.category_ids.length === 1 ? 'y' : 'ies'} selected
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={menuFormData.image_url}
                    onChange={(e) => setMenuFormData({ ...menuFormData, image_url: e.target.value })}
                    className="text-gray-900 w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Sort Order
                      <span className="text-xs text-gray-500 font-normal ml-1">(lower = appears first)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={menuFormData.sort_order}
                      onChange={(e) => setMenuFormData({ ...menuFormData, sort_order: parseInt(e.target.value) || 0 })}
                      className="text-gray-900 w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={menuFormData.is_available}
                        onChange={(e) => setMenuFormData({ ...menuFormData, is_available: e.target.checked })}
                        className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Available</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t-2 border-emerald-100 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMenuForm(false)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-emerald-50 to-green-50 -m-6 p-6 rounded-t-2xl border-b-2 border-emerald-200">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {editingCategory ? (
                    <>
                      <Edit2 className="w-6 h-6" />
                      Edit Category
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      Add Category
                    </>
                  )}
                </h3>
                <button
                  onClick={() => setShowCategoryForm(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmitCategory} className="space-y-5 mt-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    className="text-gray-900 w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    className="text-gray-900 w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Sort Order
                      <span className="text-xs text-gray-500 font-normal ml-1">(lower = appears first)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={categoryFormData.sort_order}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, sort_order: parseInt(e.target.value) || 0 })}
                      className="text-gray-900 w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categoryFormData.is_active}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, is_active: e.target.checked })}
                        className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t-2 border-emerald-100 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {editingCategory ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(false)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, FormEvent, useEffect } from 'react';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { cn } from '../lib/utils';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  editingProduct?: Product | null;
}

export function AddProductModal({ isOpen, onClose, onProductAdded, editingProduct }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    stock: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        image_url: editingProduct.image_url,
        category: editingProduct.category,
        stock: editingProduct.stock.toString(),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: '',
        stock: '',
      });
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingProduct) {
        // Update existing product
        const { data, error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            image_url: formData.image_url,
            category: formData.category,
            stock: parseInt(formData.stock),
          })
          .eq('id', editingProduct.id)
          .select();

        if (error) {
          console.error('Supabase error details:', error);
          throw error;
        }

        console.log('Product updated successfully:', data);
      } else {
        // Create new product
        const { data, error } = await supabase.from('products').insert([
          {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            image_url: formData.image_url,
            category: formData.category,
            stock: parseInt(formData.stock),
            is_available: true,
          },
        ]).select();

        if (error) {
          console.error('Supabase error details:', error);
          throw error;
        }

        console.log('Product added successfully:', data);
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: '',
        stock: '',
      });

      onProductAdded();
      onClose();
    } catch (error: any) {
      console.error('Error adding product:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      alert(`Failed to add product: ${errorMessage}\n\nPlease check the browser console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="glass-effect rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 animate-scale-in">
          <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 glass-effect">
            <h2 className="text-2xl font-bold text-white">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className={cn(
                'p-2.5 rounded-xl transition-all duration-300',
                'bg-white/5 hover:bg-white/10 border border-white/10',
                'hover:scale-110 hover:rotate-90'
              )}
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={cn(
                  'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10',
                  'text-white placeholder:text-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                  'transition-all duration-300'
                )}
                placeholder="e.g., Classic Potato Chips"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={cn(
                  'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10',
                  'text-white placeholder:text-gray-500 resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                  'transition-all duration-300'
                )}
                placeholder="Brief description of the product"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10',
                    'text-white placeholder:text-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                    'transition-all duration-300'
                  )}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10',
                    'text-white placeholder:text-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                    'transition-all duration-300'
                  )}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={cn(
                  'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10',
                  'text-white placeholder:text-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                  'transition-all duration-300'
                )}
                placeholder="e.g., snacks, drinks, sweets"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <ImageIcon size={16} className="text-emerald-500" />
                Image URL *
              </label>
              <input
                type="url"
                required
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className={cn(
                  'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10',
                  'text-white placeholder:text-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                  'transition-all duration-300'
                )}
                placeholder="https://example.com/image.jpg"
              />
              {formData.image_url && (
                <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'flex-1 py-3 rounded-xl font-semibold',
                  'bg-white/5 hover:bg-white/10 text-gray-300',
                  'border border-white/10',
                  'transition-all duration-300'
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'flex-1 py-3 rounded-xl font-semibold text-white',
                  'bg-gradient-to-r from-emerald-500 to-emerald-600',
                  'hover:from-emerald-600 hover:to-emerald-700',
                  'transition-all duration-300 hover:scale-[1.02]',
                  'shadow-lg shadow-emerald-500/30',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center justify-center gap-2'
                )}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    {editingProduct ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

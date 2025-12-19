import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import api from '../services/api';
import { Product, Category } from '../types';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    unit: '',
    currentQuantity: '',
    minQuantity: '',
    unitPrice: '',
    sku: '',
    expirationDate: '',
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [search, categoryFilter]);

  const loadProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter) params.append('categoryId', categoryFilter);
      
      const response = await api.get(`/products?${params}`);
      setProducts(response.data);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        categoryId: Number(formData.categoryId),
        currentQuantity: Number(formData.currentQuantity),
        minQuantity: Number(formData.minQuantity),
        unitPrice: formData.unitPrice ? Number(formData.unitPrice) : undefined,
      };

      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, data);
        toast.success('Produto atualizado!');
      } else {
        await api.post('/products', data);
        toast.success('Produto criado!');
      }
      
      setShowModal(false);
      resetForm();
      loadProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar produto');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deseja realmente excluir este produto?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Produto excluído!');
        loadProducts();
      } catch (error) {
        toast.error('Erro ao excluir produto');
      }
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        categoryId: product.categoryId.toString(),
        unit: product.unit,
        currentQuantity: product.currentQuantity.toString(),
        minQuantity: product.minQuantity.toString(),
        unitPrice: product.unitPrice?.toString() || '',
        sku: product.sku || '',
        expirationDate: product.expirationDate || '',
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: '',
      unit: '',
      currentQuantity: '',
      minQuantity: '',
      unitPrice: '',
      sku: '',
      expirationDate: '',
    });
  };

  const canEdit = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Produtos</h1>
        {canEdit && (
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Novo Produto
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="w-64">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estoque</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mín.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              {canEdit && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.sku && <div className="text-sm text-gray-500">SKU: {product.sku}</div>}
                  </div>
                </td>
                <td className="px-6 py-4">{product.category?.name}</td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${product.currentQuantity <= product.minQuantity ? 'text-red-600' : 'text-gray-900'}`}>
                    {product.currentQuantity} {product.unit}
                  </span>
                </td>
                <td className="px-6 py-4">{product.minQuantity} {product.unit}</td>
                <td className="px-6 py-4">
                  {product.unitPrice ? `R$ ${Number(product.unitPrice).toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-4">
                  {product.currentQuantity === 0 ? (
                    <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                      Sem estoque
                    </span>
                  ) : product.currentQuantity <= product.minQuantity ? (
                    <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                      Estoque baixo
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                      Normal
                    </span>
                  )}
                </td>
                {canEdit && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => openModal(product)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Selecione...</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Unidade *</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="kg, litros, unidades..."
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Quantidade Atual *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.currentQuantity}
                    onChange={(e) => setFormData({ ...formData, currentQuantity: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Quantidade Mínima *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preço Unitário</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data de Validade</label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Plus, ArrowUp, ArrowDown, Filter, Calendar } from 'lucide-react';
import api from '../services/api';
import { Movement, Product, MovementType } from '../types';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Movements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productFilter, setProductFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    productId: '',
    type: MovementType.ENTRY,
    quantity: '',
    reason: '',
    supplier: '',
    invoiceNumber: '',
    notes: '',
  });

  useEffect(() => {
    loadMovements();
    loadProducts();
  }, [productFilter, typeFilter, startDate, endDate]);

  const loadMovements = async () => {
    try {
      const params = new URLSearchParams();
      if (productFilter) params.append('productId', productFilter);
      if (typeFilter) params.append('type', typeFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/movements?${params}`);
      setMovements(response.data);
    } catch (error) {
      toast.error('Erro ao carregar movimentações');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        productId: Number(formData.productId),
        quantity: Number(formData.quantity),
      };

      await api.post('/movements', data);
      toast.success('Movimentação registrada!');
      
      setShowModal(false);
      resetForm();
      loadMovements();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao registrar movimentação');
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      type: MovementType.ENTRY,
      quantity: '',
      reason: '',
      supplier: '',
      invoiceNumber: '',
      notes: '',
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const clearFilters = () => {
    setProductFilter('');
    setTypeFilter('');
    setStartDate('');
    setEndDate('');
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Movimentações</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Nova Movimentação
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Produto</label>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Todos os produtos</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Todos os tipos</option>
              <option value="ENTRY">Entrada</option>
              <option value="EXIT">Saída</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo/Fornecedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {movement.type === 'ENTRY' ? (
                      <>
                        <ArrowUp className="text-green-600" size={20} />
                        <span className="text-green-600 font-medium">Entrada</span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="text-red-600" size={20} />
                        <span className="text-red-600 font-medium">Saída</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{movement.product?.name}</div>
                    <div className="text-sm text-gray-500">{movement.product?.category?.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium">
                    {movement.quantity} {movement.product?.unit}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    {movement.type === 'ENTRY' ? (
                      <>
                        {movement.supplier && (
                          <div className="font-medium">{movement.supplier}</div>
                        )}
                        {movement.invoiceNumber && (
                          <div className="text-sm text-gray-500">NF: {movement.invoiceNumber}</div>
                        )}
                      </>
                    ) : (
                      movement.reason && <div className="font-medium">{movement.reason}</div>
                    )}
                    {movement.notes && (
                      <div className="text-sm text-gray-500">{movement.notes}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">{movement.user?.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(movement.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {movements.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhuma movimentação encontrada
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Nova Movimentação</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Produto *</label>
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Selecione um produto...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Estoque: {product.currentQuantity} {product.unit})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as MovementType })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value={MovementType.ENTRY}>Entrada</option>
                    <option value={MovementType.EXIT}>Saída</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quantidade *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {formData.type === MovementType.ENTRY ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Fornecedor</label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nota Fiscal</label>
                    <input
                      type="text"
                      value={formData.invoiceNumber}
                      onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">Motivo</label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Ex: Venda, Consumo interno, Perda..."
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Registrar Movimentação
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
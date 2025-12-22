import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { Plus, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../services/api';
import { Movement, Product, MovementType } from '../types';
import toast from 'react-hot-toast';

export default function Movements() {
  const MIN_PRODUCT_SEARCH_CHARS = 4;
  const PRODUCT_SEARCH_DEBOUNCE = 2000;
  const PRODUCT_SEARCH_LIMIT = 15;

  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productFilter, setProductFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [formData, setFormData] = useState({
    productId: '',
    type: MovementType.ENTRY,
    quantity: '',
    reason: '',
    supplier: '',
    invoiceNumber: '',
    notes: '',
  });

  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productSearchResults, setProductSearchResults] = useState<Product[]>([]);
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  const [highlightedProductIndex, setHighlightedProductIndex] = useState(-1);
  const productSearchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const productSearchCache = useRef<Record<string, Product[]>>({});

  useEffect(() => {
    loadMovements();
    loadProducts();
  }, [productFilter, typeFilter, startDate, endDate]);

  useEffect(() => {
    if (productSearchTimeout.current) {
      clearTimeout(productSearchTimeout.current);
    }

    const trimmedTerm = productSearchTerm.trim();

    if (!trimmedTerm || trimmedTerm.length < MIN_PRODUCT_SEARCH_CHARS) {
      setProductSearchResults([]);
      setHighlightedProductIndex(-1);
      setProductSearchLoading(false);
      return;
    }

    productSearchTimeout.current = setTimeout(() => {
      searchProducts(trimmedTerm);
    }, PRODUCT_SEARCH_DEBOUNCE);

    return () => {
      if (productSearchTimeout.current) {
        clearTimeout(productSearchTimeout.current);
      }
    };
  }, [productSearchTerm]);

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

  const searchProducts = async (term: string) => {
    const normalizedTerm = term.toLowerCase();

    if (productSearchCache.current[normalizedTerm]) {
      setProductSearchResults(productSearchCache.current[normalizedTerm]);
      return;
    }

    setProductSearchLoading(true);
    try {
      const params = new URLSearchParams({
        search: term,
        limit: PRODUCT_SEARCH_LIMIT.toString(),
      });
      const response = await api.get(`/products?${params}`);
      const results = response.data.slice(0, PRODUCT_SEARCH_LIMIT);
      setProductSearchResults(results);
      productSearchCache.current[normalizedTerm] = results;
    } catch (error) {
      toast.error('Erro ao buscar produtos');
    } finally {
      setProductSearchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId) {
      toast.error('Selecione um produto');
      return;
    }
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
    setProductSearchTerm('');
    setProductSearchResults([]);
  };

  const handleSelectProduct = (product: Product) => {
    setFormData((prev) => ({ ...prev, productId: product.id.toString() }));
    setProductSearchTerm(product.name);
    setProductSearchResults([]);
    setHighlightedProductIndex(-1);
  };

  const handleProductSearchChange = (value: string) => {
    setProductSearchTerm(value);
    setHighlightedProductIndex(-1);
    setFormData((prev) => ({ ...prev, productId: '' }));
  };

  const handleProductSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (productSearchResults.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedProductIndex((prev) => {
        const nextIndex = prev + 1;
        return nextIndex >= productSearchResults.length ? 0 : nextIndex;
      });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedProductIndex((prev) => {
        const nextIndex = prev - 1;
        return nextIndex < 0 ? productSearchResults.length - 1 : nextIndex;
      });
    } else if (event.key === 'Enter' && highlightedProductIndex >= 0) {
      event.preventDefault();
      const product = productSearchResults[highlightedProductIndex];
      if (product) {
        handleSelectProduct(product);
      }
    }
  };

  const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const renderHighlightedName = (name: string) => {
    const term = productSearchTerm.trim();
    if (!term) return name;

    const regex = new RegExp(`(${escapeRegExp(term)})`, 'ig');
    return name.split(regex).map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={`${part}-${index}`} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
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

  const trimmedProductSearch = productSearchTerm.trim();
  const hasProductSearchTerm = trimmedProductSearch.length > 0;
  const shouldShowDropdown =
    !formData.productId && (hasProductSearchTerm || productSearchLoading);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">Movimentações</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Nova Movimentação
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
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

      {/* Tabela - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
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

      {/* Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {movements.map((movement) => (
          <div key={movement.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
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
              <span className="text-xs text-gray-500">
                {formatDate(movement.createdAt)}
              </span>
            </div>
            
            <div className="mb-3">
              <h3 className="font-medium text-gray-900">{movement.product?.name}</h3>
              <p className="text-sm text-gray-600">{movement.product?.category?.name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-500">Quantidade</p>
                <p className="font-medium text-gray-900">
                  {movement.quantity} {movement.product?.unit}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Usuário</p>
                <p className="font-medium text-gray-900">{movement.user?.name}</p>
              </div>
            </div>
            
            {(movement.supplier || movement.reason || movement.invoiceNumber || movement.notes) && (
              <div className="pt-3 border-t">
                {movement.type === 'ENTRY' ? (
                  <>
                    {movement.supplier && (
                      <div className="mb-1">
                        <span className="text-xs text-gray-500">Fornecedor: </span>
                        <span className="text-sm font-medium">{movement.supplier}</span>
                      </div>
                    )}
                    {movement.invoiceNumber && (
                      <div className="mb-1">
                        <span className="text-xs text-gray-500">NF: </span>
                        <span className="text-sm">{movement.invoiceNumber}</span>
                      </div>
                    )}
                  </>
                ) : (
                  movement.reason && (
                    <div className="mb-1">
                      <span className="text-xs text-gray-500">Motivo: </span>
                      <span className="text-sm font-medium">{movement.reason}</span>
                    </div>
                  )
                )}
                {movement.notes && (
                  <div>
                    <span className="text-xs text-gray-500">Observações: </span>
                    <span className="text-sm">{movement.notes}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {movements.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhuma movimentação encontrada
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl lg:text-2xl font-bold mb-4">Nova Movimentação</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Produto *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={productSearchTerm}
                      onChange={(e) => handleProductSearchChange(e.target.value)}
                      onKeyDown={handleProductSearchKeyDown}
                      placeholder="Digite pelo menos 4 caracteres para buscar"
                      className="w-full px-3 py-2 border rounded-lg"
                      autoComplete="off"
                    />
                    {shouldShowDropdown && (
                      <div className="absolute mt-1 inset-x-0 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
                        {trimmedProductSearch.length > 0 &&
                          trimmedProductSearch.length < MIN_PRODUCT_SEARCH_CHARS && (
                            <div className="p-3 text-sm text-gray-500">
                              Digite pelo menos {MIN_PRODUCT_SEARCH_CHARS} caracteres para buscar
                            </div>
                          )}

                        {trimmedProductSearch.length >= MIN_PRODUCT_SEARCH_CHARS && (
                          <>
                            {productSearchLoading && (
                              <div className="p-3 text-sm text-gray-500">Carregando...</div>
                            )}
                            {!productSearchLoading && productSearchResults.length === 0 && (
                              <div className="p-3 text-sm text-gray-500">Nenhum produto encontrado</div>
                            )}
                            {!productSearchLoading && productSearchResults.length > 0 && (
                              <ul className="divide-y divide-gray-100">
                                {productSearchResults.map((product, index) => (
                                  <li
                                    key={product.id}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 ${
                                      highlightedProductIndex === index ? 'bg-blue-50' : ''
                                    }`}
                                    onMouseDown={() => handleSelectProduct(product)}
                                  >
                                    <div className="font-medium flex items-center justify-between gap-2">
                                      <span>{renderHighlightedName(product.name)}</span>
                                      <span className="text-xs text-gray-500">
                                        {product.currentQuantity} {product.unit}
                                      </span>
                                    </div>
                                    {product.category?.name && (
                                      <div className="text-xs text-gray-500">
                                        Categoria: {product.category.name}
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    {trimmedProductSearch.length > 0 &&
                      trimmedProductSearch.length < MIN_PRODUCT_SEARCH_CHARS && (
                        <p className="mt-1 text-xs text-gray-500">
                          Digite pelo menos {MIN_PRODUCT_SEARCH_CHARS} caracteres para buscar.
                        </p>
                      )}
                    {formData.productId && (
                      <p className="mt-1 text-xs text-gray-600">
                        Produto selecionado:{' '}
                        {products.find((p) => p.id.toString() === formData.productId)?.name ||
                          productSearchTerm}
                      </p>
                    )}
                  </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

              <div className="flex flex-col lg:flex-row gap-3 pt-4">
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

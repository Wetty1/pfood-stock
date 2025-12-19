import { useEffect, useState } from 'react';
import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import api from '../services/api';
import { DashboardStats } from '../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [movementsChart, setMovementsChart] = useState<any[]>([]);
  const [categoriesChart, setCategoriesChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, movementsRes, categoriesRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/movements-chart?days=7'),
        api.get('/dashboard/categories-chart'),
      ]);

      setStats(statsRes.data);
      setMovementsChart(movementsRes.data);
      setCategoriesChart(categoriesRes.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Produtos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalProducts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alertas Ativos</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats?.alertsCount}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alertas Críticos</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats?.criticalAlertsCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor do Estoque</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                R$ {stats?.totalStockValue.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Movimentações (Últimos 7 dias)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={movementsChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="entries" stroke="#10b981" name="Entradas" />
              <Line type="monotone" dataKey="exits" stroke="#ef4444" name="Saídas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Produtos por Categoria</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoriesChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="Produtos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumo dos Últimos 30 Dias */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo dos Últimos 30 Dias</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Total de Entradas</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats?.last30Days.totalEntries}
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Total de Saídas</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {stats?.last30Days.totalExits}
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Quantidade Entrada</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats?.last30Days.totalEntriesQuantity.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Quantidade Saída</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {stats?.last30Days.totalExitsQuantity.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
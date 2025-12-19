import { useEffect, useState } from 'react';
import { AlertTriangle, AlertCircle, Package, TrendingDown } from 'lucide-react';
import api from '../services/api';
import { Alert } from '../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, critical: 0, warning: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const [alertsRes, countRes, criticalRes] = await Promise.all([
        api.get('/alerts'),
        api.get('/alerts/count'),
        api.get('/alerts/critical/count'),
      ]);

      const alertsData = alertsRes.data;
      setAlerts(alertsData);
      
      const criticalCount = alertsData.filter((a: Alert) => a.level === 'CRITICAL').length;
      const warningCount = alertsData.filter((a: Alert) => a.level === 'WARNING').length;
      
      setStats({
        total: alertsData.length,
        critical: criticalCount,
        warning: warningCount,
      });
    } catch (error) {
      toast.error('Erro ao carregar alertas');
    } finally {
      setLoading(false);
    }
  };

  const getAlertColor = (level: string) => {
    return level === 'CRITICAL' ? 'red' : 'yellow';
  };

  const getAlertIcon = (level: string) => {
    return level === 'CRITICAL' ? AlertCircle : AlertTriangle;
  };

  const getPercentage = (current: number, min: number) => {
    return ((current / min) * 100).toFixed(0);
  };

  const goToProducts = () => {
    navigate('/products');
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Alertas de Estoque</h1>
        <button
          onClick={goToProducts}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Package size={20} />
          Ver Produtos
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Alertas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alertas Críticos</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.critical}</p>
              <p className="text-xs text-gray-500 mt-1">Estoque zerado</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alertas de Atenção</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.warning}</p>
              <p className="text-xs text-gray-500 mt-1">Abaixo do mínimo</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingDown className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Alertas */}
      {alerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <Package className="text-green-600" size={48} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Nenhum alerta ativo!
          </h3>
          <p className="text-gray-600">
            Todos os produtos estão com estoque adequado.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Alertas Críticos */}
          {stats.critical > 0 && (
            <div>
              <h2 className="text-xl font-bold text-red-600 mb-3 flex items-center gap-2">
                <AlertCircle size={24} />
                Alertas Críticos ({stats.critical})
              </h2>
              <div className="space-y-3">
                {alerts
                  .filter((alert) => alert.level === 'CRITICAL')
                  .map((alert) => {
                    const Icon = getAlertIcon(alert.level);
                    const color = getAlertColor(alert.level);
                    
                    return (
                      <div
                        key={alert.id}
                        className={`bg-white rounded-lg shadow-md border-l-4 border-${color}-500 p-4 hover:shadow-lg transition-shadow`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`bg-${color}-100 p-3 rounded-lg`}>
                              <Icon className={`text-${color}-600`} size={24} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900">
                                  {alert.productName}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-semibold bg-${color}-100 text-${color}-800 rounded-full`}>
                                  {alert.level === 'CRITICAL' ? 'CRÍTICO' : 'ATENÇÃO'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                Categoria: {alert.categoryName}
                              </p>
                              <div className="flex items-center gap-6 text-sm">
                                <div>
                                  <span className="text-gray-600">Estoque Atual: </span>
                                  <span className={`font-bold text-${color}-600`}>
                                    {alert.currentQuantity} {alert.unit}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Mínimo: </span>
                                  <span className="font-medium">
                                    {alert.minQuantity} {alert.unit}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold text-${color}-600`}>
                              {alert.currentQuantity === 0 ? '0%' : getPercentage(alert.currentQuantity, alert.minQuantity) + '%'}
                            </div>
                            <div className="text-xs text-gray-500">do mínimo</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Alertas de Atenção */}
          {stats.warning > 0 && (
            <div>
              <h2 className="text-xl font-bold text-yellow-600 mb-3 flex items-center gap-2">
                <AlertTriangle size={24} />
                Alertas de Atenção ({stats.warning})
              </h2>
              <div className="space-y-3">
                {alerts
                  .filter((alert) => alert.level === 'WARNING')
                  .map((alert) => {
                    const Icon = getAlertIcon(alert.level);
                    const color = getAlertColor(alert.level);
                    
                    return (
                      <div
                        key={alert.id}
                        className={`bg-white rounded-lg shadow-md border-l-4 border-${color}-500 p-4 hover:shadow-lg transition-shadow`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`bg-${color}-100 p-3 rounded-lg`}>
                              <Icon className={`text-${color}-600`} size={24} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900">
                                  {alert.productName}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-semibold bg-${color}-100 text-${color}-800 rounded-full`}>
                                  ATENÇÃO
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                Categoria: {alert.categoryName}
                              </p>
                              <div className="flex items-center gap-6 text-sm">
                                <div>
                                  <span className="text-gray-600">Estoque Atual: </span>
                                  <span className={`font-bold text-${color}-600`}>
                                    {alert.currentQuantity} {alert.unit}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Mínimo: </span>
                                  <span className="font-medium">
                                    {alert.minQuantity} {alert.unit}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold text-${color}-600`}>
                              {getPercentage(alert.currentQuantity, alert.minQuantity)}%
                            </div>
                            <div className="text-xs text-gray-500">do mínimo</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dica */}
      {alerts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Package className="text-blue-600 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Dica</h4>
              <p className="text-sm text-blue-800">
                Registre uma entrada de estoque para os produtos em alerta. 
                Acesse a página de <button onClick={goToProducts} className="underline font-medium">Produtos</button> ou 
                vá direto para <button onClick={() => navigate('/movements')} className="underline font-medium">Movimentações</button>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
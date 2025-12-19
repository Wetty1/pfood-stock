import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  ArrowLeftRight, 
  AlertTriangle, 
  Users, 
  LogOut 
} from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Categorias', href: '/categories', icon: FolderOpen },
    { name: 'Produtos', href: '/products', icon: Package },
    { name: 'Movimentações', href: '/movements', icon: ArrowLeftRight },
    { name: 'Alertas', href: '/alerts', icon: AlertTriangle },
    ...(user?.role === 'ADMIN' ? [{ name: 'Usuários', href: '/users', icon: Users }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-primary">PFood Stock</h1>
              <p className="text-sm text-gray-500 mt-1">Controle de Estoque</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t">
              <div className="flex items-center gap-3 px-4 py-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Shield, User as UserIcon } from 'lucide-react';
import api from '../services/api';
import { User, UserRole } from '../types';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { user: currentUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.OPERATOR,
    isActive: true,
  });

  // Verificar se o usuário atual é ADMIN
  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="space-y-4 lg:space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold">Usuários</h1>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
              <Shield className="text-red-600" size={32} />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Acesso Negado
          </h3>
          <p className="text-gray-600">
            Apenas administradores podem gerenciar usuários.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        ...(editingUser ? {} : { password: formData.password }), // Senha apenas na criação
      };

      if (editingUser) {
        await api.patch(`/users/${editingUser.id}`, data);
        toast.success('Usuário atualizado!');
      } else {
        await api.post('/users', data);
        toast.success('Usuário criado!');
      }

      setShowModal(false);
      resetForm();
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar usuário');
    }
  };

  const handleDelete = async (id: number) => {
    if (id === currentUser?.id) {
      toast.error('Você não pode excluir sua própria conta');
      return;
    }

    if (confirm('Deseja realmente excluir este usuário?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('Usuário excluído!');
        loadUsers();
      } catch (error) {
        toast.error('Erro ao excluir usuário');
      }
    }
  };

  const toggleUserStatus = async (user: User) => {
    if (user.id === currentUser?.id) {
      toast.error('Você não pode desativar sua própria conta');
      return;
    }

    try {
      await api.patch(`/users/${user.id}`, { isActive: !user.isActive });
      toast.success(`Usuário ${!user.isActive ? 'ativado' : 'desativado'}!`);
      loadUsers();
    } catch (error) {
      toast.error('Erro ao alterar status do usuário');
    }
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: UserRole.OPERATOR,
      isActive: true,
    });
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      [UserRole.ADMIN]: 'Administrador',
      [UserRole.MANAGER]: 'Gerente',
      [UserRole.OPERATOR]: 'Operador',
    };
    return labels[role];
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      [UserRole.ADMIN]: 'bg-red-100 text-red-800',
      [UserRole.MANAGER]: 'bg-blue-100 text-blue-800',
      [UserRole.OPERATOR]: 'bg-green-100 text-green-800',
    };
    return colors[role];
  };

  if (loading) return <div>Carregando usuários...</div>;

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">Usuários</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* Tabela - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Função</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criado em</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="text-gray-600" size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      {user.id === currentUser?.id && (
                        <div className="text-xs text-blue-600">(Você)</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className={`p-2 rounded-lg ${
                        user.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                      }`}
                      disabled={user.id === currentUser?.id}
                    >
                      {user.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => openModal(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      disabled={user.id === currentUser?.id}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="text-gray-600" size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  {user.id === currentUser?.id && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">(Você)</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-500">Função</p>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Criado em</p>
                <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-3 border-t">
              <button
                onClick={() => toggleUserStatus(user)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg ${
                  user.isActive 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
                disabled={user.id === currentUser?.id}
              >
                {user.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                {user.isActive ? 'Desativar' : 'Ativar'}
              </button>
              <button
                onClick={() => openModal(user)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700"
              >
                <Edit size={16} />
                Editar
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700"
                disabled={user.id === currentUser?.id}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl lg:text-2xl font-bold mb-4">
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium mb-2">Senha *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Função *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value={UserRole.OPERATOR}>Operador</option>
                  <option value={UserRole.MANAGER}>Gerente</option>
                  <option value={UserRole.ADMIN}>Administrador</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Usuário ativo
                </label>
              </div>

              <div className="flex flex-col lg:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingUser ? 'Atualizar' : 'Criar'} Usuário
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
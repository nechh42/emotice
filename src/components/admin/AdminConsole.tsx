import React, { useState, useEffect } from 'react';
import { Users, BarChart3, Flag, Settings, Search, Filter, Download, Eye, Ban, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalMoodEntries: number;
  flaggedContent: number;
  newUsersToday: number;
  avgSessionTime: number;
}

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  profile?: {
    full_name?: string;
    username?: string;
    role: string;
  };
  mood_entries_count?: number;
  status: 'active' | 'suspended' | 'banned';
}

interface ContentReport {
  id: string;
  content_type: 'mood_entry' | 'comment' | 'post';
  content_id: string;
  reporter_id: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}

const AdminConsole: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'content' | 'reports' | 'settings'>('dashboard');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalMoodEntries: 0,
    flaggedContent: 0,
    newUsersToday: 0,
    avgSessionTime: 0
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load stats (mock data for demo)
      setStats({
        totalUsers: 1247,
        activeUsers: 892,
        totalMoodEntries: 15634,
        flaggedContent: 12,
        newUsersToday: 23,
        avgSessionTime: 18.5
      });

      // Load users (mock data)
      setUsers([
        {
          id: '1',
          email: 'user1@example.com',
          created_at: '2024-01-15T10:00:00Z',
          last_sign_in_at: '2024-01-20T15:30:00Z',
          profile: {
            full_name: 'Ahmet Yılmaz',
            username: 'ahmet_y',
            role: 'viewer'
          },
          mood_entries_count: 45,
          status: 'active'
        },
        {
          id: '2',
          email: 'user2@example.com',
          created_at: '2024-01-10T14:20:00Z',
          last_sign_in_at: '2024-01-19T09:15:00Z',
          profile: {
            full_name: 'Ayşe Kaya',
            username: 'ayse_k',
            role: 'editor'
          },
          mood_entries_count: 78,
          status: 'active'
        }
      ]);

      // Load reports (mock data)
      setReports([
        {
          id: '1',
          content_type: 'comment',
          content_id: 'comment_123',
          reporter_id: 'user_456',
          reason: 'inappropriate',
          description: 'Uygunsuz içerik paylaşımı',
          status: 'pending',
          created_at: '2024-01-20T12:00:00Z'
        }
      ]);

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'ban' | 'activate') => {
    try {
      // In real implementation, this would update user status in database
      console.log(`${action} user ${userId}`);
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: action === 'activate' ? 'active' : action === 'suspend' ? 'suspended' : 'banned' }
          : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleReportAction = async (reportId: string, action: 'approve' | 'reject') => {
    try {
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, status: 'resolved' }
          : report
      ));
    } catch (error) {
      console.error('Error handling report:', error);
    }
  };

  const exportUserData = () => {
    const csvContent = [
      ['ID', 'Email', 'Full Name', 'Role', 'Created At', 'Last Sign In', 'Mood Entries', 'Status'],
      ...users.map(user => [
        user.id,
        user.email,
        user.profile?.full_name || '',
        user.profile?.role || '',
        user.created_at,
        user.last_sign_in_at || '',
        user.mood_entries_count || 0,
        user.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotice-users-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.profile?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !filterRole || user.profile?.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-green-500 text-sm font-medium">+{stats.newUsersToday} bugün</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-gray-600 text-sm">Toplam Kullanıcı</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.totalMoodEntries.toLocaleString()}</div>
          <div className="text-gray-600 text-sm">Toplam Duygu Girişi</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Flag className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.flaggedContent}</div>
          <div className="text-gray-600 text-sm">Bekleyen Şikayet</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.activeUsers.toLocaleString()}</div>
          <div className="text-gray-600 text-sm">Aktif Kullanıcı (30 gün)</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.avgSessionTime} dk</div>
          <div className="text-gray-600 text-sm">Ortalama Oturum Süresi</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Son Aktiviteler</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">Yeni kullanıcı kaydı</div>
              <div className="text-sm text-gray-600">user@example.com - 5 dakika önce</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">Yeni duygu girişi</div>
              <div className="text-sm text-gray-600">127 yeni giriş - 10 dakika önce</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Flag className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">Yeni şikayet</div>
              <div className="text-sm text-gray-600">Uygunsuz içerik bildirimi - 15 dakika önce</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Tüm Roller</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="annotator">Annotator</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        
        <button
          onClick={exportUserData}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Dışa Aktar</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Giriş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duygu Girişi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((userData) => (
                <tr key={userData.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {userData.profile?.full_name?.charAt(0) || userData.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {userData.profile?.full_name || 'İsimsiz'}
                        </div>
                        <div className="text-sm text-gray-500">{userData.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      userData.profile?.role === 'admin' ? 'bg-red-100 text-red-800' :
                      userData.profile?.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                      userData.profile?.role === 'annotator' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {userData.profile?.role || 'viewer'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(userData.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {userData.last_sign_in_at 
                      ? new Date(userData.last_sign_in_at).toLocaleDateString('tr-TR')
                      : 'Hiç'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {userData.mood_entries_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      userData.status === 'active' ? 'bg-green-100 text-green-800' :
                      userData.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {userData.status === 'active' ? 'Aktif' :
                       userData.status === 'suspended' ? 'Askıda' : 'Yasaklı'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleUserAction(userData.id, 'suspend')}
                      className="text-yellow-600 hover:text-yellow-700"
                      title="Askıya Al"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUserAction(userData.id, 'ban')}
                      className="text-red-600 hover:text-red-700"
                      title="Yasakla"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      className="text-purple-600 hover:text-purple-700"
                      title="Detayları Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Bekleyen Şikayetler</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {reports.filter(r => r.status === 'pending').map((report) => (
            <div key={report.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.content_type === 'comment' ? 'bg-blue-100 text-blue-800' :
                      report.content_type === 'post' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {report.content_type === 'comment' ? 'Yorum' :
                       report.content_type === 'post' ? 'Gönderi' : 'Duygu Girişi'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(report.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 mb-1">
                    Sebep: {report.reason === 'inappropriate' ? 'Uygunsuz İçerik' : report.reason}
                  </h4>
                  <p className="text-gray-600 mb-3">{report.description}</p>
                  
                  <div className="text-sm text-gray-500">
                    İçerik ID: {report.content_id} • Şikayet Eden: {report.reporter_id}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleReportAction(report.id, 'approve')}
                    className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Onayla</span>
                  </button>
                  <button
                    onClick={() => handleReportAction(report.id, 'reject')}
                    className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    <span>Reddet</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Kullanıcılar', icon: Users },
    { id: 'content', label: 'İçerik', icon: MessageSquare },
    { id: 'reports', label: 'Şikayetler', icon: Flag },
    { id: 'settings', label: 'Ayarlar', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Konsol</h1>
          <p className="text-gray-600">Sistem yönetimi ve kullanıcı kontrolü</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'content' && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">İçerik Yönetimi</h3>
              <p className="text-gray-500">Bu bölüm geliştirme aşamasında</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Sistem Ayarları</h3>
              <p className="text-gray-500">Bu bölüm geliştirme aşamasında</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
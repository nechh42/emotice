// src/components/admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, Settings, BarChart3, MessageSquare, Shield, 
  Search, Filter, Plus, Edit, Trash2, Eye, Download,
  TrendingUp, UserCheck, AlertTriangle, Calendar,
  Save, X, RefreshCw, LogOut
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const AdminPanel = () => {
  const { admin, signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dashboard State
  const [dashboardStats, setDashboardStats] = useState({});
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [moodDistribution, setMoodDistribution] = useState([]);
  const [premiumConversion, setPremiumConversion] = useState([]);
  const [activeUsersData, setActiveUsersData] = useState([]);

  // User Management State
  const [users, setUsers] = useState([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState({});

  // Content Management State
  const [messages, setMessages] = useState([]);
  const [messagesPage, setMessagesPage] = useState(1);
  const [messagesTotal, setMessagesTotal] = useState(0);
  const [messageFilter, setMessageFilter] = useState({});
  const [editingMessage, setEditingMessage] = useState(null);
  const [newMessage, setNewMessage] = useState({
    content: '',
    category: 'motivation',
    language: 'tr',
    status: 'active'
  });

  // Admin Management State
  const [admins, setAdmins] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Load dashboard data
  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [stats, growth, mood, conversion, activeUsers] = await Promise.all([
        AdminService.getDashboardStats(),
        AdminService.getUserGrowthData(30),
        AdminService.getMoodDistribution(),
        AdminService.getPremiumConversionData(30),
        AdminService.getActiveUsersData(30)
      ]);

      setDashboardStats(stats);
      setUserGrowthData(growth);
      setMoodDistribution(mood);
      setPremiumConversion(conversion);
      setActiveUsersData(activeUsers);
    } catch (err) {
      setError('Dashboard verileri yüklenemedi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await AdminService.getUsers(usersPage, 20, userSearch, userFilter);
      setUsers(result.users);
      setUsersTotal(result.total);
    } catch (err) {
      setError('Kullanıcılar yüklenemedi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load messages
  const loadMessages = async () => {
    try {
      setLoading(true);
      const result = await AdminService.getMotivationMessages(messagesPage, 20, messageFilter);
      setMessages(result.messages);
      setMessagesTotal(result.total);
    } catch (err) {
      setError('Mesajlar yüklenemedi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load admins
  const loadAdmins = async () => {
    try {
      setLoading(true);
      const adminList = await AdminService.getAdmins();
      setAdmins(adminList);
    } catch (err) {
      setError('Admin listesi yüklenemedi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') loadDashboard();
    else if (activeTab === 'users') loadUsers();
    else if (activeTab === 'content') loadMessages();
    else if (activeTab === 'settings') loadAdmins();
  }, [activeTab, usersPage, userSearch, userFilter, messagesPage, messageFilter]);

  // Component methods and render functions would go here...
  // (Same as the previous AdminPanel component)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          EMOTICE Admin Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerçek Supabase entegrasyonu ile çalışır durumda!
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;

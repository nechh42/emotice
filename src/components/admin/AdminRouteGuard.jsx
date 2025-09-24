// src/components/admin/AdminRouteGuard.jsx
import React from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import AdminLogin from './AdminLogin';

const AdminRouteGuard = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <AdminLogin />;
  }

  return children;
};

export default AdminRouteGuard;

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  RefreshCw,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Calendar,
  Lock,
  Unlock,
  Download,
  Filter,
} from 'lucide-react';
import type { AdminUserItem, CefrLevel } from '../types/adminTypes';
import { adminUserService } from '../services/adminUserService';
import { getStoredUser, getStoredToken, parseJwt } from '@/utils/auth-storage';
import { AdminDialog } from './AdminDialog';
import { isLocalAuthMode } from '@/config/authConfig';

type FilterGroup = 'all' | 'recent_7d' | 'inactive' | 'active' | 'admin';

export const UserManagementView: React.FC = () => {
  const { t } = useTranslation('admin');
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Current logged in admin email
  const currentAdminEmail = useMemo(() => {
    const user = getStoredUser();
    if (user?.email) return user.email.toLowerCase();
    const token = getStoredToken();
    if (token) {
      const claims = parseJwt(token);
      if (claims?.sub) return String(claims.sub).toLowerCase();
    }
    return null;
  }, []);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [filterGroup, setFilterGroup] = useState<FilterGroup>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Role change modal state
  const [roleModalUser, setRoleModalUser] = useState<AdminUserItem | null>(null);
  const [newRole, setNewRole] = useState<string>('ROLE_USER');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Status updating map
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Load users from API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      let enabledParam: boolean | undefined = undefined;
      if (selectedStatus === 'enabled') enabledParam = true;
      if (selectedStatus === 'disabled') enabledParam = false;

      const res = await adminUserService.getUsers({
        query: searchQuery.trim() || undefined,
        role: selectedRole || undefined,
        enabled: enabledParam,
        filterGroup: filterGroup === 'all' ? undefined : filterGroup,
        page: currentPage,
        size: pageSize,
      });

      setUsers(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
      setHasLoadedUsers(true);
    } catch (err: unknown) {
      setHasLoadedUsers(false);
      console.error('Lỗi tải người dùng:', err);
      setErrorMsg(
        isLocalAuthMode && !getStoredToken()
          ? t('users.messages.unavailable_desc')
          : t('users.messages.unavailable_desc')
      );
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedRole, selectedStatus, filterGroup, currentPage, pageSize, t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchUsers();
  };

  // Export CSV handler
  const handleExportCsv = async () => {
    setIsExporting(true);
    setErrorMsg(null);
    try {
      let enabledParam: boolean | undefined = undefined;
      if (selectedStatus === 'enabled') enabledParam = true;
      if (selectedStatus === 'disabled') enabledParam = false;

      const blob = await adminUserService.exportUsersCsv({
        query: searchQuery.trim() || undefined,
        role: selectedRole || undefined,
        enabled: enabledParam,
        filterGroup: filterGroup === 'all' ? undefined : filterGroup,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'viecultures_users.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setSuccessToast(t('users.messages.export_success'));
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: unknown) {
      console.warn('Lỗi xuất CSV qua API, kiểm tra fallback client-side:', err);
      if (users.length > 0) {
        try {
          // Client-side fallback with UTF-8 BOM
          let csv = '\uFEFFID,Họ và tên,Email,Vai trò,Trình độ CEFR,Từ đã lưu,Phương thức đăng nhập,Ngày tạo,Trạng thái\r\n';
          users.forEach((u) => {
            const role = u.role?.toUpperCase().includes('ADMIN') ? 'Quản trị viên' : 'Học viên';
            const cefr = u.englishLevel || 'Chưa thiết lập';
            const status = u.enabled ? 'Đang hoạt động' : 'Đã khóa';
            const row = [
              `"${u.id}"`,
              `"${(u.name || '').replace(/"/g, '""')}"`,
              `"${u.email}"`,
              `"${role}"`,
              `"${cefr}"`,
              u.savedVocabCount || 0,
              `"${u.authProvider || 'LOCAL'}"`,
              `"${u.createdAt || ''}"`,
              `"${status}"`,
            ].join(',');
            csv += row + '\r\n';
          });
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'viecultures_users.csv';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          setSuccessToast(t('users.messages.export_success'));
          setTimeout(() => setSuccessToast(null), 3500);
          return;
        } catch (fallbackErr) {
          console.error('Fallback CSV export failed:', fallbackErr);
        }
      }
      setErrorMsg((err instanceof Error ? err.message : '') || t('users.messages.export_error'));
    } finally {
      setIsExporting(false);
    }
  };

  // Toggle user status
  const handleToggleStatus = async (user: AdminUserItem) => {
    setUpdatingStatusId(user.id);
    try {
      const nextStatus = !user.enabled;
      const updated = await adminUserService.updateUserStatus(user.id, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, enabled: updated.enabled } : u))
      );
      setSuccessToast(
        `${user.name} - ${nextStatus ? t('users.status.enabled') : t('users.status.disabled')}`
      );
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : '') || t('users.messages.unavailable_desc'));
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Open role modal
  const handleOpenRoleModal = (user: AdminUserItem) => {
    setRoleModalUser(user);
    setNewRole(user.role || 'ROLE_USER');
  };

  // Confirm role update
  const handleConfirmRoleChange = async () => {
    if (!roleModalUser) return;
    setIsUpdatingRole(true);
    try {
      const updated = await adminUserService.updateUserRole(roleModalUser.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === roleModalUser.id ? { ...u, role: updated.role } : u))
      );
      setSuccessToast(`${roleModalUser.name}: ${t('users.role_modal.confirm')}`);
      setTimeout(() => setSuccessToast(null), 3000);
      setRoleModalUser(null);
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : '') || t('users.messages.unavailable_desc'));
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Format date helper
  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  // Quick stats computed from current items
  const summaryStats = useMemo(() => {
    const total = totalElements;
    const activeInPage = users.filter((u) => u.enabled).length;
    const adminInPage = users.filter(
      (u) => u.role?.toUpperCase() === 'ROLE_ADMIN' || u.role?.toUpperCase() === 'ADMIN'
    ).length;
    return {
      total,
      activeInPage,
      adminInPage,
    };
  }, [totalElements, users]);

  // CEFR Badge Color Helper
  const getCefrBadgeClass = (lvl?: CefrLevel) => {
    switch (lvl) {
      case 'A1':
      case 'A2':
        return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'B1':
        return 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'B2':
      case 'C1':
      case 'C2':
        return 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300';
    }
  };

  const marketingTabs: { key: FilterGroup; label: string }[] = [
    { key: 'all', label: t('users.filter_groups.all') },
    { key: 'recent_7d', label: t('users.filter_groups.recent_7d') },
    { key: 'inactive', label: t('users.filter_groups.inactive') },
    { key: 'active', label: t('users.filter_groups.active') },
    { key: 'admin', label: t('users.filter_groups.admin') },
  ];

  return (
    <div className="space-y-6">
      {/* ── Top Summary Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-text-muted text-xs">{t('users.stats.registered')}</span>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
              {hasLoadedUsers ? summaryStats.total : '—'}
            </div>
            <p className="text-[11px] text-text-secondary">{t('users.stats.registered_desc')}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-antique-gold/15 border border-antique-gold/30 flex items-center justify-center text-heritage-green dark:text-antique-gold">
            <Users aria-hidden="true" className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-text-muted text-xs">{t('users.stats.active_on_page')}</span>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-emerald-700 dark:text-emerald-400">
              {hasLoadedUsers ? `${summaryStats.activeInPage} / ${users.length}` : '—'}
            </div>
            <p className="text-[11px] text-text-secondary">{t('users.stats.active_on_page_desc')}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <UserCheck aria-hidden="true" className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-text-muted text-xs">{t('users.stats.admins_on_page')}</span>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-antique-gold dark:text-antique-bright">
              {hasLoadedUsers ? summaryStats.adminInPage : '—'}
            </div>
            <p className="text-[11px] text-text-secondary">{t('users.stats.admins_on_page_desc')}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-700 dark:text-antique-gold">
            <ShieldCheck aria-hidden="true" className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Marketing Segment Filter Pills ────────────────────────────── */}
      <div className="p-3 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        <span className="text-xs font-bold text-text-secondary px-2 flex items-center gap-1.5 shrink-0">
          <Filter aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
          <span>{t('header.title', 'Phân nhóm')}:</span>
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {marketingTabs.map((mt) => {
            const isActive = filterGroup === mt.key;
            return (
              <button
                key={mt.key}
                type="button"
                onClick={() => {
                  setFilterGroup(mt.key);
                  setCurrentPage(0);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-heritage-green text-warm-ivory shadow-md ring-2 ring-heritage-green/20 scale-[1.02]'
                    : 'bg-warm-ivory/80 dark:bg-heritage-dark/80 text-text-secondary hover:text-heritage-green hover:bg-warm-ivory border border-antique-gold/20'
                }`}
              >
                {mt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search & Filters Bar ───────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="admin-search relative w-full md:w-80" role="search">
          <Search aria-hidden="true" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            aria-label={t('users.filters.search_placeholder')}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('users.filters.search_placeholder')}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
          />
          <button type="submit" className="rounded-xl bg-heritage-green px-3 text-warm-ivory text-xs font-bold">
            {t('users.filters.search_button')}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Role Filter */}
          <select
            aria-label={t('users.filters.all_roles')}
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(0);
            }}
            className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
          >
            <option value="">{t('users.filters.all_roles')}</option>
            <option value="ROLE_ADMIN">{t('users.filters.role_admin')}</option>
            <option value="ROLE_USER">{t('users.filters.role_user')}</option>
          </select>

          {/* Status Filter */}
          <select
            aria-label={t('users.filters.all_statuses')}
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(0);
            }}
            className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
          >
            <option value="">{t('users.filters.all_statuses')}</option>
            <option value="enabled">{t('users.filters.status_enabled')}</option>
            <option value="disabled">{t('users.filters.status_disabled')}</option>
          </select>

          {/* Page Size Filter */}
          <select
            aria-label={t('users.filters.per_page', { count: pageSize })}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
            className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
          >
            <option value={10}>{t('users.filters.per_page', { count: 10 })}</option>
            <option value={20}>{t('users.filters.per_page', { count: 20 })}</option>
            <option value={50}>{t('users.filters.per_page', { count: 50 })}</option>
          </select>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isExporting || isLoading}
            className="px-3.5 py-2 rounded-xl bg-antique-gold/20 hover:bg-antique-gold/30 border border-antique-gold/40 text-heritage-green dark:text-antique-bright text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title={t('users.filters.export_csv')}
          >
            <Download aria-hidden="true" className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? t('users.filters.exporting_csv') : t('users.filters.export_csv')}</span>
          </button>

          {/* Reset button */}
          {(searchQuery || selectedRole || selectedStatus || filterGroup !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRole('');
                setSelectedStatus('');
                setFilterGroup('all');
                setCurrentPage(0);
              }}
              className="px-3 py-2 rounded-xl bg-white/40 dark:bg-white/10 hover:bg-white/60 text-xs font-bold text-text-muted cursor-pointer transition-colors"
            >
              {t('users.filters.clear_filters')}
            </button>
          )}

          {/* Refresh button */}
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white/40 dark:bg-white/10 hover:bg-white/60 border border-antique-gold/30 text-text-body dark:text-warm-ivory cursor-pointer transition-colors"
            title={t('users.filters.refresh')}
            aria-label={t('users.filters.refresh')}
          >
            <RefreshCw aria-hidden="true" className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Alerts & Toasts ───────────────────────────────────────────── */}
      {errorMsg && (
        <div role="alert" className="p-4 rounded-2xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{errorMsg}</span>
          </div>
          <button aria-label="Dismiss error" onClick={() => setErrorMsg(null)} className="cursor-pointer">
            <X aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>
      )}

      {successToast && (
        <div role="status" className="p-4 rounded-2xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 text-green-800 dark:text-green-200 text-xs flex items-center gap-2">
          <CheckCircle2 aria-hidden="true" className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ── Users Table with Sticky Actions Column ────────────────────── */}
      <div className="bg-rice-paper dark:bg-heritage-dark/60 rounded-3xl border border-antique-gold/30 shadow-md overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="inline-block animate-spin w-8 h-8 border-3 border-antique-gold border-t-transparent rounded-full" />
            <p className="text-xs text-text-muted">{t('users.messages.loading')}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <Users aria-hidden="true" className="w-12 h-12 text-antique-gold/40 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold">{!hasLoadedUsers ? t('users.messages.unavailable_title') : t('users.messages.empty_title')}</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                {!hasLoadedUsers ? t('users.messages.unavailable_desc') : t('users.messages.empty_desc')}
              </p>
            </div>
            {!hasLoadedUsers && (
              <button type="button" onClick={fetchUsers} className="rounded-xl bg-heritage-green px-4 py-2 text-warm-ivory text-xs font-bold">
                {t('users.messages.try_again')}
              </button>
            )}
            {(searchQuery || selectedRole || selectedStatus || filterGroup !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRole('');
                  setSelectedStatus('');
                  setFilterGroup('all');
                  setCurrentPage(0);
                }}
                className="px-4 py-2 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-dark transition-colors cursor-pointer"
              >
                {t('users.filters.clear_filters')}
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[768px]">
              <thead className="bg-warm-ivory/80 dark:bg-heritage-dark/80 border-b border-antique-gold/20 text-text-secondary uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">{t('users.columns.user')}</th>
                  <th className="px-4 py-3.5">{t('users.columns.role')}</th>
                  <th className="px-4 py-3.5">{t('users.columns.cefr')}</th>
                  <th className="px-4 py-3.5 text-center">{t('users.columns.saved_words')}</th>
                  <th className="px-4 py-3.5">{t('users.columns.joined')}</th>
                  <th className="px-4 py-3.5">{t('users.columns.status')}</th>
                  <th className="sticky right-0 z-20 px-5 py-3.5 text-right bg-warm-ivory dark:bg-heritage-dark border-l border-antique-gold/20 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.08)]">
                    {t('users.columns.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-antique-gold/15">
                {users.map((user) => {
                  const isAdmin =
                    user.role?.toUpperCase() === 'ROLE_ADMIN' || user.role?.toUpperCase() === 'ADMIN';
                  const isSelf = Boolean(currentAdminEmail && user.email?.toLowerCase() === currentAdminEmail);

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-warm-ivory/50 dark:hover:bg-white/5 transition-colors group"
                    >
                      {/* User Info (Avatar, Name, Email, Provider) */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover border border-antique-gold/40 shadow-sm shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-heritage-green/10 dark:bg-white/10 text-heritage-green dark:text-antique-bright border border-antique-gold/30 flex items-center justify-center font-bold text-xs shrink-0">
                              {user.name ? user.name.slice(0, 2).toUpperCase() : 'VC'}
                            </div>
                          )}

                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-heading font-bold text-sm text-heritage-green dark:text-warm-ivory truncate">
                                {user.name}
                              </span>
                              {isSelf && (
                                <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-antique-gold/25 text-heritage-green dark:text-antique-bright border border-antique-gold/40">
                                  {t('users.status.you')}
                                </span>
                              )}
                              <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-semibold bg-white/60 dark:bg-white/10 border border-antique-gold/20 text-text-secondary">
                                {user.authProvider || 'LOCAL'}
                              </span>
                            </div>
                            <p className="text-[11px] text-text-muted truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                            isAdmin
                              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 hover:ring-2 hover:ring-amber-400'
                              : 'bg-rice-paper dark:bg-white/5 text-text-body dark:text-warm-ivory border-antique-gold/30 hover:border-antique-gold'
                          }`}
                          title={t('users.roles.change_role')}
                          aria-label={t('users.roles.change_role')}
                        >
                          {isAdmin ? (
                            <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <Users aria-hidden="true" className="w-3.5 h-3.5 text-text-muted" />
                          )}
                          <span>{isAdmin ? t('users.roles.admin') : t('users.roles.learner')}</span>
                          <Edit2 aria-hidden="true" className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                        </button>
                      </td>

                      {/* CEFR English Level */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {user.englishLevel ? (
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getCefrBadgeClass(
                              user.englishLevel
                            )}`}
                          >
                            {t('filters.level_option', { level: user.englishLevel })}
                          </span>
                        ) : (
                          <span className="text-text-muted text-[11px] italic">{t('users.roles.not_set')}</span>
                        )}
                      </td>

                      {/* Saved Vocab Count */}
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 font-semibold text-text-body dark:text-warm-ivory text-xs">
                          <BookMarked aria-hidden="true" className="w-3.5 h-3.5 inline text-antique-gold mr-1" />
                          {user.savedVocabCount || 0}
                        </span>
                      </td>

                      {/* Join Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-text-secondary text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar aria-hidden="true" className="w-3 h-3 text-text-muted" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={updatingStatusId === user.id || (isSelf && user.enabled)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                            isSelf && user.enabled
                              ? 'opacity-60 cursor-not-allowed bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200'
                              : user.enabled
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-200 cursor-pointer'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 hover:bg-red-200 cursor-pointer'
                          }`}
                          title={
                            isSelf && user.enabled
                              ? t('users.status.cannot_disable_self')
                              : user.enabled
                              ? t('users.status.disable_account')
                              : t('users.status.enable_account')
                          }
                        >
                          {user.enabled ? (
                            <>
                              <Unlock aria-hidden="true" className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>{t('users.status.enabled')}</span>
                            </>
                          ) : (
                            <>
                              <Lock aria-hidden="true" className="w-3 h-3 text-red-600 dark:text-red-400" />
                              <span>{t('users.status.disabled')}</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions Sticky Column */}
                      <td className="sticky right-0 z-10 px-5 py-4 whitespace-nowrap text-right space-x-1 bg-rice-paper dark:bg-heritage-dark group-hover:bg-warm-ivory dark:group-hover:bg-stone-900 border-l border-antique-gold/20 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.08)]">
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-antique-gold/15 text-heritage-green dark:text-antique-bright hover:bg-antique-gold/30 transition-colors cursor-pointer"
                        >
                          {t('users.roles.change_role')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination Footer ─────────────────────────────────────────── */}
        <div className="px-5 py-3.5 bg-warm-ivory/80 dark:bg-heritage-dark/80 border-t border-antique-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary">
          <div>
            {t('users.pagination.page_info', {
              current: currentPage + 1,
              total: totalPages || 1,
              count: hasLoadedUsers ? totalElements : 0,
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage <= 0 || isLoading}
              className="px-3 py-1.5 rounded-xl border border-antique-gold/30 bg-white/60 dark:bg-white/10 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ChevronLeft aria-hidden="true" className="w-4 h-4" />
              <span>{t('users.pagination.prev')}</span>
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1 || isLoading}
              className="px-3 py-1.5 rounded-xl border border-antique-gold/30 bg-white/60 dark:bg-white/10 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{t('users.pagination.next')}</span>
              <ChevronRight aria-hidden="true" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Modal Đổi Role (Role Modal) ─────────────────────────────── */}
      <AnimatePresence>
        {roleModalUser && (
          <AdminDialog title={t('users.role_modal.title')} onClose={() => { if (!isUpdatingRole) setRoleModalUser(null); }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-rice-paper dark:bg-heritage-forest border border-antique-gold/40 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-antique-gold/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-antique-gold/20 text-antique-gold">
                    <ShieldCheck aria-hidden="true" className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-heritage-green dark:text-warm-ivory">
                      {t('users.role_modal.title')}
                    </h3>
                    <p className="text-[11px] text-text-muted">{t('header.subtitle')}</p>
                  </div>
                </div>
                <button
                  aria-label={t('role_modal.cancel', 'Close')}
                  onClick={() => setRoleModalUser(null)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-text-muted cursor-pointer"
                >
                  <X aria-hidden="true" className="w-4 h-4" />
                </button>
              </div>

              {/* User details */}
              <div className="p-3.5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/20 text-xs space-y-1">
                <div className="font-bold text-heritage-green dark:text-warm-ivory">
                  {roleModalUser.name}
                </div>
                <div className="text-text-muted text-[11px]">{roleModalUser.email}</div>
                <div className="text-[11px] text-text-secondary pt-1">
                  {t('users.columns.role')}:{' '}
                  <span className="font-bold text-antique-gold">
                    {roleModalUser.role || 'ROLE_USER'}
                  </span>
                </div>
              </div>

              {/* Role selection radio cards */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-text-secondary">{t('users.role_modal.role_label')}:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    aria-pressed={newRole === 'ROLE_USER'}
                    onClick={() => setNewRole('ROLE_USER')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      newRole === 'ROLE_USER'
                        ? 'border-antique-gold bg-antique-gold/15 ring-2 ring-antique-gold/30'
                        : 'border-antique-gold/20 bg-warm-ivory dark:bg-heritage-dark/40 hover:border-antique-gold/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Users aria-hidden="true" className="w-4 h-4 text-heritage-green dark:text-warm-ivory" />
                      {newRole === 'ROLE_USER' && (
                        <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                      )}
                    </div>
                    <div className="font-heading font-bold text-xs text-text-body dark:text-warm-ivory">
                      {t('users.roles.learner')}
                    </div>
                    <div className="text-[10px] text-text-muted">ROLE_USER</div>
                  </button>

                  <button
                    type="button"
                    aria-pressed={newRole === 'ROLE_ADMIN'}
                    onClick={() => setNewRole('ROLE_ADMIN')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      newRole === 'ROLE_ADMIN'
                        ? 'border-amber-400 bg-amber-100/40 dark:bg-amber-900/30 ring-2 ring-amber-400/40'
                        : 'border-antique-gold/20 bg-warm-ivory dark:bg-heritage-dark/40 hover:border-antique-gold/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <ShieldCheck aria-hidden="true" className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      {newRole === 'ROLE_ADMIN' && (
                        <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>
                    <div className="font-heading font-bold text-xs text-text-body dark:text-warm-ivory">
                      {t('users.roles.admin')}
                    </div>
                    <div className="text-[10px] text-text-muted">ROLE_ADMIN</div>
                  </button>
                </div>
              </div>

              {/* Warning notice when self-demoting */}
              {roleModalUser && currentAdminEmail && roleModalUser.email?.toLowerCase() === currentAdminEmail && newRole !== 'ROLE_ADMIN' && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-[11px] text-red-800 dark:text-red-300 flex items-start gap-2">
                  <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span>
                    {t('users.status.cannot_disable_self')}
                  </span>
                </div>
              )}

              {/* Warning notice when promoting */}
              {newRole === 'ROLE_ADMIN' && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <ShieldAlert aria-hidden="true" className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    {t('users.role_modal.admin_warning')}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
                  disabled={isUpdatingRole}
                  className="px-4 py-2 rounded-xl border border-antique-gold/30 text-xs font-bold hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {t('users.role_modal.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRoleChange}
                  disabled={
                    isUpdatingRole ||
                    Boolean(
                      roleModalUser &&
                        currentAdminEmail &&
                        roleModalUser.email?.toLowerCase() === currentAdminEmail &&
                        newRole !== 'ROLE_ADMIN'
                    )
                  }
                  className="px-5 py-2 rounded-xl bg-antique-gold hover:bg-antique-bright text-heritage-dark text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingRole ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-heritage-dark border-t-transparent rounded-full animate-spin" />
                      <span>{t('users.role_modal.updating')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" />
                      <span>{t('users.role_modal.confirm')}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AdminDialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagementView;

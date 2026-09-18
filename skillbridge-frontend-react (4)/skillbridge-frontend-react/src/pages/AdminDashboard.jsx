import { useEffect, useState } from 'react';
import api from '../services/api';
import aiService from '../services/ai.service';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'transactions' | 'quality'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // حالة بوابة فحص جودة وأمان الأكواد
  const [gateCode, setGateCode] = useState(
    '// نموذج كود مشروع للتدقيق الأمني والجودة قبل النشر\nasync function handleUserData(req, res) {\n  const apiKey = "sk_live_1234567890"; // Secret hardcoded\n  const result = eval(req.body.operation); // Unsafe eval\n  return res.json(result);\n}'
  );
  const [gateResult, setGateResult] = useState(null);
  const [gateLoading, setGateLoading] = useState(false);
  const [gateError, setGateError] = useState('');

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users', {
        params: { search: userSearch, role: roleFilter },
      });
      setUsers(data.data || []);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/admin/transactions');
      setTransactions(data.data || []);
    } catch (err) {
      console.error('Failed to load transactions', err);
    }
  };

  const fetchPendingItems = async () => {
    try {
      const [verificationsRes, disputesRes] = await Promise.all([
        api.get('/university/pending'),
        api.get('/disputes'),
      ]);
      setPendingVerifications(verificationsRes.data.data || []);
      setDisputes(disputesRes.data.data || []);
    } catch (err) {
      console.error('Failed to load pending items', err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([fetchStats(), fetchUsers(), fetchTransactions(), fetchPendingItems()]);
    } catch (err) {
      setError('حصل خطأ في تحميل بعض بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [userSearch, roleFilter, activeTab]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      setActionSuccess('');
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      setActionSuccess(`تم تغيير الصلاحية بنجاح إلى: ${newRole}`);
      await fetchUsers();
      await fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تحديث دور المستخدم');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      setUpdatingUserId(userId);
      await api.put(`/admin/users/${userId}/toggle-active`);
      await fetchUsers();
    } catch (err) {
      setError('فشل تغيير حالة تفعيل المستخدم');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRunQualityGate = async () => {
    if (!gateCode.trim()) return;
    try {
      setGateLoading(true);
      setGateError('');
      setGateResult(null);
      const data = await aiService.checkQualityGate(gateCode);
      setGateResult(data);
    } catch (err) {
      setGateError(err.response?.data?.message || 'حصل خطأ أثناء فحص بوابة الجودة');
    } finally {
      setGateLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-white/50 text-sm">
        جاري تهيئة لوحة تحكم الإدارة الشاملة...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] py-10 text-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Admin Console • بوابة الإدارة العليا
            </span>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold">لوحة تحكم المنصة المركزية</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadAllData}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:bg-white/10 transition"
            >
              تحديث البيانات ⟳
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        {actionSuccess && (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            {actionSuccess}
          </div>
        )}

        {/* High Level KPI Metrics Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl border border-white/10 bg-[#0E131F] p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">إجمالي المستخدمين</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 text-sm">
                👥
              </span>
            </div>
            <div className="mt-3 text-2xl font-black text-white">{stats?.totalUsers ?? 0}</div>
            <p className="mt-1 text-[11px] text-white/40">طلاب وعملاء ومسؤولين</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0E131F] p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">إجمالي الإيرادات</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 text-sm">
                💳
              </span>
            </div>
            <div className="mt-3 text-2xl font-black text-emerald-400">
              {stats?.totalRevenue ?? 0} <span className="text-sm font-normal">ج.م</span>
            </div>
            <p className="mt-1 text-[11px] text-white/40">
              أرباح المنصة المقتطعة: {stats?.platformEarnings ?? 0} ج.م
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0E131F] p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">الاشتراكات بالكورسات</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 text-sm">
                📚
              </span>
            </div>
            <div className="mt-3 text-2xl font-black text-amber-400">
              {stats?.totalEnrolledCourses ?? 0}
            </div>
            <p className="mt-1 text-[11px] text-white/40">
              في {stats?.totalCoursesCount ?? 0} كورس متاح
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0E131F] p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">المشاريع النشطة</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-sm">
                💼
              </span>
            </div>
            <div className="mt-3 text-2xl font-black text-purple-400">{stats?.activeJobs ?? 0}</div>
            <p className="mt-1 text-[11px] text-white/40">قيد التنفيذ والمطابقة</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex border-b border-white/10 gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            نظرة عامة والطلبات المعلقة ({pendingVerifications.length + disputes.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'users'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            إدارة المستخدمين والأدوار ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'transactions'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            سجل المدفوعات والـ Escrow ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'quality'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            بوابة فحص جودة وأمان الأكواد (AI Gate)
          </button>
        </div>

        {/* TAB 1: OVERVIEW & PENDING ITEMS */}
        {activeTab === 'overview' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* University Verifications */}
            <div className="rounded-2xl border border-white/10 bg-[#0E131F] p-6">
              <h3 className="text-base font-bold text-white mb-4">
                طلبات توثيق الطلاب الجامعيين ({pendingVerifications.length})
              </h3>
              {pendingVerifications.length === 0 ? (
                <p className="text-xs text-white/40">لا توجد طلبات توثيق معلقة حالياً.</p>
              ) : (
                <div className="space-y-3">
                  {pendingVerifications.map((item) => (
                    <div
                      key={item._id}
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-white">{item.fullName}</p>
                        <p className="text-white/50">{item.university} • {item.universityEmail}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            await api.put(`/university/${item._id}/verify`, { approved: true });
                            fetchPendingItems();
                          }}
                          className="rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 font-semibold hover:bg-emerald-500/30"
                        >
                          اعتماد
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Disputes */}
            <div className="rounded-2xl border border-white/10 bg-[#0E131F] p-6">
              <h3 className="text-base font-bold text-white mb-4">
                النزاعات المالية المعلقة ({disputes.length})
              </h3>
              {disputes.length === 0 ? (
                <p className="text-xs text-white/40">لا توجد نزاعات مفتوحة حالياً.</p>
              ) : (
                <div className="space-y-3">
                  {disputes.map((d) => (
                    <div
                      key={d._id}
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{d.project?.title || 'مشروع غير مسمى'}</span>
                        <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {d.status}
                        </span>
                      </div>
                      <p className="text-white/60">{d.reason || 'مفيش تفاصيل مضافة'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT & ROLE CHANGING */}
        {activeTab === 'users' && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0E131F] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">تصفية حسب الدور:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0B0F17] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="all">الكل</option>
                  <option value="student">طالب (Student)</option>
                  <option value="client">عميل (Client)</option>
                  <option value="admin">مسؤول (Admin)</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/40">
                    <th className="pb-3 pr-2">المستخدم</th>
                    <th className="pb-3">البريد الإلكتروني</th>
                    <th className="pb-3">الدور الحالي</th>
                    <th className="pb-3">الكورسات المسجلة</th>
                    <th className="pb-3">الحالة</th>
                    <th className="pb-3 text-left pl-2">تعديل الدور / الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-white/40">
                        لا يوجد مستخدمين مطابقين للبحث.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-white/[0.01]">
                        <td className="py-3.5 pr-2 font-medium text-white">{u.fullName}</td>
                        <td className="py-3.5 text-white/60 font-mono text-[11px]">{u.email}</td>
                        <td className="py-3.5">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : u.role === 'client'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 text-white/60">
                          {u.enrolledCourses?.length || 0} كورس
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`text-[10px] ${
                              u.isActive ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {u.isActive ? 'نشط ●' : 'معطل ○'}
                          </span>
                        </td>
                        <td className="py-3.5 text-left pl-2">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              disabled={updatingUserId === u._id}
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[11px] text-white focus:border-emerald-500 focus:outline-none"
                            >
                              <option value="student">student</option>
                              <option value="client">client</option>
                              <option value="admin">admin</option>
                            </select>

                            <button
                              onClick={() => handleToggleActive(u._id)}
                              className={`rounded-lg px-2 py-1 text-[11px] border transition ${
                                u.isActive
                                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                              }`}
                            >
                              {u.isActive ? 'تعطيل' : 'تفعيل'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSACTIONS LOG */}
        {activeTab === 'transactions' && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0E131F] p-6">
            <h3 className="text-base font-bold text-white mb-4">
              سجل المدفوعات والمعاملات المالية بالكامل
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/40">
                    <th className="pb-3 pr-2">رقم المعاملة</th>
                    <th className="pb-3">الدافع / المستخدم</th>
                    <th className="pb-3">البند / الكورس / المشروع</th>
                    <th className="pb-3">المبلغ</th>
                    <th className="pb-3">طريقة الدفع</th>
                    <th className="pb-3">الحالة</th>
                    <th className="pb-3 text-left pl-2">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-white/40">
                        لا توجد سجلات دفع مسجلة حتى الآن.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-white/[0.01]">
                        <td className="py-3.5 pr-2 font-mono text-[11px] text-white/70">
                          {tx.transactionId || tx.providerTransactionId || tx._id.slice(-8)}
                        </td>
                        <td className="py-3.5 text-white">
                          {tx.client?.fullName || tx.userId?.fullName || 'مستخدم مجهول'}
                        </td>
                        <td className="py-3.5 text-white/70">
                          {tx.course?.title || tx.project?.title || tx.itemTitle || 'شراء كورس/خدمة'}
                        </td>
                        <td className="py-3.5 font-bold text-emerald-400">
                          {tx.amount} ج.م
                        </td>
                        <td className="py-3.5 text-white/50 text-[11px]">
                          {tx.paymentMethod || tx.provider || 'card'}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              tx.paymentStatus === 'completed' || tx.status === 'completed' || tx.status === 'released'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : tx.status === 'failed'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {tx.paymentStatus || tx.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-left pl-2 text-white/40 text-[10px]">
                          {new Date(tx.createdAt).toLocaleDateString('ar-EG')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: AI QUALITY GATE */}
        {activeTab === 'quality' && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0E131F] p-6">
            <h3 className="text-base font-bold text-white mb-2">
              بوابة الجودة والأمان البرمجي الذكية (Security & Quality Gate)
            </h3>
            <p className="text-xs text-white/60 mb-4">
              فحص شفرات المشاريع الطلابية لاكتشاف الثغرات الأمنية ومفاتيح الـ API المكشوفة وتقييم جودة الكود قبل الإفراج المالي.
            </p>

            <div className="space-y-4">
              <textarea
                value={gateCode}
                onChange={(e) => setGateCode(e.target.value)}
                rows={7}
                dir="ltr"
                className="w-full rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-xs text-emerald-400 focus:border-emerald-500 focus:outline-none"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleRunQualityGate}
                  disabled={gateLoading}
                  className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition disabled:opacity-50"
                >
                  {gateLoading ? 'جاري الفحص البرمجي...' : 'تشغيل فحص الأمان والجودة 🛡️'}
                </button>
              </div>

              {gateError && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                  {gateError}
                </div>
              )}

              {gateResult && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                    <span className="font-bold text-sm text-white">تقرير التدقيق:</span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        gateResult.passed
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {gateResult.passed ? 'ناجح ومطابق للمواصفات ✓' : 'تنبيهات أمنية مطلوبة ⚠'}
                    </span>
                  </div>

                  <p className="text-xs text-white/80 leading-relaxed">{gateResult.summary}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

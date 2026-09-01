import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';

const AdminDashboard = () => {
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [verificationsRes, disputesRes] = await Promise.all([
          api.get('/university/pending'),
          api.get('/disputes'),
        ]);
        setPendingVerifications(verificationsRes.data.data);
        setDisputes(disputesRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'حصل خطأ في تحميل بيانات الإدارة');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <span className="eyebrow">لوحة تحكم الإدارة</span>
      <h1 className="mt-2 text-2xl font-semibold">نظرة عامة على المنصة</h1>

      {loading && <p className="mt-6 text-sm text-muted">جاري تحميل البيانات...</p>}
      {error && <p className="mt-6 text-sm text-danger">{error}</p>}

      {!loading && !error && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card title="طلبات التحقق الجامعي المعلّقة" eyebrow={`${pendingVerifications.length} طلب`}>
            {pendingVerifications.length === 0 ? (
              <p className="text-muted">مفيش طلبات معلّقة دلوقتي.</p>
            ) : (
              <ul className="space-y-3">
                {pendingVerifications.map((v) => (
                  <li key={v._id} className="flex items-center justify-between border-b border-line pb-2">
                    <span>{v.user?.fullName || v.user?.email}</span>
                    <span className="text-xs text-muted">{v.method}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="النزاعات المفتوحة" eyebrow={`${disputes.length} نزاع`}>
            {disputes.length === 0 ? (
              <p className="text-muted">مفيش نزاعات مفتوحة دلوقتي.</p>
            ) : (
              <ul className="space-y-3">
                {disputes.map((d) => (
                  <li key={d._id} className="flex items-center justify-between border-b border-line pb-2">
                    <span>{d.project?.title || 'مشروع'}</span>
                    <span
                      className={`text-xs font-semibold ${
                        d.aiRiskAssessment?.riskLevel === 'high' ? 'text-danger' : 'text-muted'
                      }`}
                    >
                      {d.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import { useEffect, useState } from 'react';
import api from '../services/api';
import aiService from '../services/ai.service';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const AdminDashboard = () => {
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [pendingCashPayments, setPendingCashPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);

  // حالة توصية لجنة التحكيم بالـ AI
  const [juryRecommendations, setJuryRecommendations] = useState({});
  const [juryLoadingId, setJuryLoadingId] = useState(null);
  const [juryError, setJuryError] = useState('');

  // حالة بوابة فحص جودة وأمان الأكواد
  const [gateCode, setGateCode] = useState(
    '// نموذج كود مشروع للتدقيق الأمني والجودة قبل النشر\nasync function handleUserData(req, res) {\n  const apiKey = "sk_live_1234567890"; // Secret hardcoded\n  const result = eval(req.body.operation); // Unsafe eval\n  return res.json(result);\n}'
  );
  const [gateResult, setGateResult] = useState(null);
  const [gateLoading, setGateLoading] = useState(false);
  const [gateError, setGateError] = useState('');

  const fetchAdminData = async () => {
    try {
      const [verificationsRes, disputesRes, cashRes] = await Promise.all([
        api.get('/university/pending'),
        api.get('/disputes'),
        api.get('/payments/vodafone-cash/pending'),
      ]);
      setPendingVerifications(verificationsRes.data.data);
      setDisputes(disputesRes.data.data);
      setPendingCashPayments(cashRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في تحميل بيانات الإدارة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleConfirmCash = async (paymentId) => {
    try {
      setActingId(paymentId);
      await api.put(`/payments/vodafone-cash/${paymentId}/confirm`);
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في التأكيد');
    } finally {
      setActingId(null);
    }
  };

  const handleRejectCash = async (paymentId) => {
    try {
      setActingId(paymentId);
      await api.put(`/payments/vodafone-cash/${paymentId}/reject`);
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في الرفض');
    } finally {
      setActingId(null);
    }
  };

  const handleConsultJury = async (disputeId) => {
    try {
      setJuryLoadingId(disputeId);
      setJuryError('');
      const rec = await aiService.getJuryRecommendation(disputeId);
      setJuryRecommendations((prev) => ({ ...prev, [disputeId]: rec }));
    } catch (err) {
      setJuryError(err.response?.data?.message || 'تعذر الحصول على توصية لجنة التحكيم الذكية');
    } finally {
      setJuryLoadingId(null);
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

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 font-body">
      <span className="eyebrow">لوحة تحكم الإدارة</span>
      <h1 className="mt-2 text-2xl font-semibold">نظرة عامة وأدوات المنصة الذكية</h1>

      {loading && <p className="mt-6 text-sm text-muted">جاري تحميل البيانات...</p>}
      {error && <p className="mt-6 text-sm text-danger">{error}</p>}

      {!loading && !error && (
        <div className="mt-8 space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* طلبات كاش */}
            <Card title="طلبات دفع فودافون كاش" eyebrow={`${pendingCashPayments.length} طلب معلّق`}>
              {pendingCashPayments.length === 0 ? (
                <p className="text-muted">مفيش طلبات معلّقة دلوقتي.</p>
              ) : (
                <ul className="space-y-4">
                  {pendingCashPayments.map((p) => (
                    <li key={p._id} className="border-b border-line pb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{p.client?.fullName || p.client?.email}</span>
                        <span className="font-semibold text-ink">{p.amount} ج.م</span>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {p.itemTitle} — رقم التحويل: {p.providerTransactionId || '—'}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="accent" className="!py-1.5 !px-3 text-xs"
                          loading={actingId === p._id}
                          onClick={() => handleConfirmCash(p._id)}
                        >
                          تأكيد الاستلام
                        </Button>
                        <Button
                          variant="outline" className="!py-1.5 !px-3 text-xs"
                          loading={actingId === p._id}
                          onClick={() => handleRejectCash(p._id)}
                        >
                          رفض
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* طلبات التحقق الجامعي */}
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
          </div>

          {/* النزاعات المفتوحة وتوصية لجنة التحكيم AI */}
          <Card title="النزاعات المفتوحة وتوصيات لجنة التحكيم (AI-Jury)" eyebrow={`${disputes.length} نزاع مسجل`}>
            {juryError && <p className="mb-3 text-xs text-danger">{juryError}</p>}
            {disputes.length === 0 ? (
              <p className="text-muted">مفيش نزاعات مفتوحة دلوقتي.</p>
            ) : (
              <ul className="space-y-4">
                {disputes.map((d) => {
                  const jury = juryRecommendations[d._id];
                  return (
                    <li key={d._id} className="rounded-lg border border-line p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-semibold text-ink text-sm">{d.project?.title || 'مشروع بدون عنوان'}</span>
                          <span className="mr-2 text-xs text-muted">({d.reason || 'سبب غير محدد'})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${d.aiRiskAssessment?.riskLevel === 'high' ? 'bg-danger/10 text-danger' : 'bg-paper text-muted'
                              }`}
                          >
                            الحالة: {d.status}
                          </span>
                          <Button
                            variant="outline"
                            className="!py-1 !px-2.5 text-xs"
                            loading={juryLoadingId === d._id}
                            onClick={() => handleConsultJury(d._id)}
                          >
                            ⚖️ استشارة لجنة التحكيم الذكية
                          </Button>
                        </div>
                      </div>

                      {/* عرض التوصية الذكية إذا تم طلبها */}
                      {jury && (
                        <div className="mt-3 rounded-lg border border-signal/40 bg-signal/5 p-3.5 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-ink flex items-center gap-1.5">
                              <span>🤖 توصية لجنة التحكيم بالـ AI:</span>
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${jury.riskLevel === 'high'
                                  ? 'bg-danger/20 text-danger'
                                  : jury.riskLevel === 'medium'
                                    ? 'bg-signal/20 text-ink'
                                    : 'bg-success/20 text-success'
                                }`}
                            >
                              مستوى الخطورة: {jury.riskLevel}
                            </span>
                          </div>

                          <p className="font-medium text-charcoal leading-relaxed">{jury.recommendation}</p>

                          {jury.riskNotes && (
                            <p className="text-muted text-[11px]">ملاحظات: {jury.riskNotes}</p>
                          )}

                          {jury.requiresHumanReview && (
                            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-danger">
                              <span>⚠️ يتطلب مراجعة بشرية من فريق التحكيم.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* بوابة فحص جودة وأمان المشاريع البرمجية AI Quality Gate */}
          <Card
            title="بوابة جودة وأمان المشاريع البرمجية (AI Quality Gate)"
            eyebrow="Security & Quality Audit"
          >
            <p className="text-xs text-muted mb-4">
              أداة إدارية ذكية للتحقق من جودة الكود البرمجي المكتمل وخلوه من الثغرات الأمنية (Security Vulnerabilities) وحقن الأوامر والبيانات السرية المكشوفة قبل اعتماد التسليم أو النشر.
            </p>

            <textarea
              value={gateCode}
              onChange={(e) => setGateCode(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-line bg-paper/40 p-3 font-mono text-xs text-charcoal focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
              placeholder="الصق كود المشروع هنا للتدقيق الأمني..."
              dir="ltr"
            />

            <div className="mt-3 flex gap-3">
              <Button
                onClick={handleRunQualityGate}
                loading={gateLoading}
                variant="accent"
                className="!py-2 text-xs"
              >
                🛡️ بدء التدقيق الأمني وفحص الجودة
              </Button>
            </div>

            {gateError && <p className="mt-3 text-xs text-danger">{gateError}</p>}

            {gateResult && (
              <div className="mt-5 space-y-4 border-t border-line pt-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-xs text-muted block">درجة الجودة</span>
                      <span className="text-xl font-bold text-ink">{gateResult.qualityScore}/100</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted block">درجة الأمان</span>
                      <span className="text-xl font-bold text-ink">{gateResult.securityScore}/100</span>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-4 py-1.5 text-xs font-bold ${gateResult.passed
                        ? 'bg-success/15 text-success'
                        : 'bg-danger/15 text-danger'
                      }`}
                  >
                    {gateResult.passed ? 'اجتاز بوابة الجودة والأمان بنجاح ✅' : 'لم يجتز - توجد ثغرات أو ملاحظات حرجة ❌'}
                  </span>
                </div>

                {gateResult.securityIssues?.length > 0 && (
                  <div className="rounded-lg border border-danger/30 bg-danger/5 p-3.5 space-y-1.5">
                    <p className="text-xs font-bold text-danger">⚠️ الثغرات الأمنية المكتشفة (Security Issues):</p>
                    <ul className="list-disc list-inside text-xs text-charcoal space-y-1">
                      {gateResult.securityIssues.map((sec, i) => (
                        <li key={i}>{sec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {gateResult.qualityIssues?.length > 0 && (
                  <div className="rounded-lg border border-line bg-paper/60 p-3.5 space-y-1.5">
                    <p className="text-xs font-semibold text-ink">ملاحظات الجودة البرمجية (Quality Issues):</p>
                    <ul className="list-disc list-inside text-xs text-muted space-y-1">
                      {gateResult.qualityIssues.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


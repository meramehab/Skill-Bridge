import { useState } from 'react';
import aiService from '../services/ai.service';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const SkillVerification = () => {
  const [completionPercent, setCompletionPercent] = useState(80);
  const [submittedOnTime, setSubmittedOnTime] = useState(true);
  const [meetsRequirements, setMeetsRequirements] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAssess = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aiService.assessTask({ completionPercent, submittedOnTime, meetsRequirements });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في التقييم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <span className="eyebrow">تقييم المهارات</span>
      <h1 className="mt-2 text-2xl font-semibold">تقييم مهمة عملية قصيرة</h1>
      <p className="mt-2 text-sm text-muted">
        بعد ما تخلّص مهمة عملية قصيرة، حدد تفاصيل التسليم وهنديك تقييم فوري لمستوى إنجازك.
      </p>

      <Card className="mt-8">
        <div>
          <label className="label">نسبة إنجاز المهمة ({completionPercent}%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={completionPercent}
            onChange={(e) => setCompletionPercent(Number(e.target.value))}
            className="w-full accent-ink"
          />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <input
            id="onTime"
            type="checkbox"
            checked={submittedOnTime}
            onChange={(e) => setSubmittedOnTime(e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          <label htmlFor="onTime" className="text-sm">اتسلّمت في الميعاد</label>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <input
            id="meetsReq"
            type="checkbox"
            checked={meetsRequirements}
            onChange={(e) => setMeetsRequirements(e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          <label htmlFor="meetsReq" className="text-sm">مطابقة لمتطلبات المهمة</label>
        </div>

        <Button onClick={handleAssess} loading={loading} variant="accent" fullWidth className="mt-6">
          قيّم المهمة
        </Button>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        {result && (
          <div className="mt-6 rounded-lg border border-line bg-paper p-4">
            <p className="font-display text-2xl font-semibold text-ink">{result.score}/100</p>
            <p className={`mt-1 text-sm font-semibold ${result.passed ? 'text-success' : 'text-danger'}`}>
              {result.passed ? 'اجتزت المهمة بنجاح ✅' : 'محتاج تحسّن أكتر قبل ما تعدّي'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SkillVerification;

import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';

const StudentDashboard = () => {
  const { user } = useAuth();

  const readiness = user?.careerReadinessScore ?? 0;
  const progress = user?.learningPathProgress ?? 0;
  const canGoFreelance = readiness >= 80 && progress >= 70;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <span className="eyebrow">لوحة تحكم الطالب</span>
      <h1 className="mt-2 text-2xl font-semibold">أهلاً، {user?.fullName || 'يا بطل'} 👋</h1>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="مؤشر الجاهزية المهنية" eyebrow="Career Readiness">
          <div className="flex items-end gap-2">
            <span className="font-display text-3xl font-semibold text-ink">{readiness}%</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-line">
            <div
              className="h-2 rounded-full bg-signal transition-all"
              style={{ width: `${Math.min(readiness, 100)}%` }}
            />
          </div>
        </Card>

        <Card title="مسار التعلم" eyebrow="Learning Path">
          <div className="flex items-end gap-2">
            <span className="font-display text-3xl font-semibold text-ink">{progress}%</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-line">
            <div
              className="h-2 rounded-full bg-ink transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </Card>

        <Card title="حالة التحقق الجامعي" eyebrow="University Verification">
          <p className={user?.isUniversityVerified ? 'text-success font-semibold' : 'text-muted'}>
            {user?.isUniversityVerified ? 'موثّق ✅' : 'لسه محتاج توثيق'}
          </p>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card
          title="حلل سيرتك الذاتية"
          eyebrow="CV Analysis"
          footer={
            <Link to="/cv-analysis" className="btn-accent !py-2 text-xs">
              ارفع الـ CV
            </Link>
          }
        >
          استخرج مهاراتك تلقائيًا واعرف إيه اللي ناقصك عشان توصل لمسار التعلم المناسب.
        </Card>

        <Card
          title="أثبت مهاراتك"
          eyebrow="Skill Verification"
          footer={
            <Link to="/skill-verification" className="btn-accent !py-2 text-xs">
              ابدأ الاختبار
            </Link>
          }
        >
          اختبارات ومهام عملية قصيرة تثبت بيها مستواك الحقيقي في كل مهارة.
        </Card>
      </div>

      <div className="mt-8">
        <Card title="سوق العمل الحر" eyebrow="Marketplace">
          {canGoFreelance ? (
            <>
              <p className="text-success font-medium">مبروك! أنت مؤهل للدخول لسوق العمل الحر 🎉</p>
              <Link to="/marketplace" className="btn-primary mt-4 inline-flex !py-2 text-xs">
                تصفح المشاريع
              </Link>
            </>
          ) : (
            <p className="text-muted">
              لازم توصل لمؤشر جاهزية 80% ونسبة إنجاز مسار تعلم 70% عشان تقدر تدخل سوق العمل الحر.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../services/course.service';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import CheckoutModal from '../components/common/CheckoutModal';

// صفحة عامة للاستعراض والاشتراك - تدعم الدفع المباشر وعرض الدروس المحمية
const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في تحميل الكورسات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="eyebrow">مكتبة الكورسات والمسارات</span>
          <h1 className="mt-2 text-2xl font-bold text-white">الكورسات المتاحة للدراسة</h1>
        </div>
        <Link
          to="/learning"
          className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
        >
          الانتقال إلى مسار التعلم الخاص بي ←
        </Link>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      {loading ? (
        <p className="mt-8 text-sm text-muted">جاري تحميل الكورسات...</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.length === 0 && <p className="text-muted col-span-full">مفيش كورسات مضافة لسه.</p>}
          {courses.map((course) => (
            <Card
              key={course._id}
              eyebrow={`${course.price ?? 0} ج.م`}
              title={course.title}
              footer={
                <div className="flex items-center gap-2 w-full pt-2">
                  <Link
                    to={`/courses/${course._id}`}
                    className="flex-1 text-center rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition"
                  >
                    عرض المحتوى 📖
                  </Link>
                  <button
                    onClick={() => setSelectedCourseForCheckout(course)}
                    className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition shadow-md shadow-emerald-500/10"
                  >
                    اشترك الآن 🔓
                  </button>
                </div>
              }
            >
              <p className="text-white/70 text-xs line-clamp-2">{course.description || 'مفيش وصف مضاف.'}</p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-white/70">{course.skill}</span>
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-white/70">{course.level}</span>
                {course.provider && <span className="rounded-full bg-white/5 px-2.5 py-1 text-white/70">{course.provider}</span>}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                <span>{course.lessonsCount || (course.lessons ? course.lessons.length : 0)} دروس</span>
                {course.enrolledCount !== undefined && (
                  <span>{course.enrolledCount} طالب مشترك</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reusable Checkout Modal */}
      <CheckoutModal
        isOpen={Boolean(selectedCourseForCheckout)}
        onClose={() => setSelectedCourseForCheckout(null)}
        course={selectedCourseForCheckout}
        onSuccess={(receipt) => {
          fetchCourses();
        }}
      />
    </div>
  );
};

export default Courses;


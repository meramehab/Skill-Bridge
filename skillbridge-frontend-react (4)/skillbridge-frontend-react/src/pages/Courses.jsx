import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../services/course.service';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// صفحة عامة للاستعراض والاشتراك بس - إدارة الكورسات (إضافة/تعديل/حذف) موجودة في /admin/courses (محمية للأدمن بس)
const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollingId, setEnrollingId] = useState(null);
  const [feedback, setFeedback] = useState('');

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

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingId(courseId);
      setFeedback('');
      await courseService.enrollCourse(courseId);
      setFeedback('تمت إضافة الكورس لمسار التعلم بتاعك ✅');
    } catch (err) {
      setFeedback(err.response?.data?.message || 'حصل خطأ في الإضافة');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <span className="eyebrow">مكتبة الكورسات</span>
      <h1 className="mt-2 text-2xl font-semibold">الكورسات المتاحة</h1>

      {feedback && <p className="mt-4 text-sm text-success">{feedback}</p>}
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
                <Link
                  to={`/pay-course/${course._id}?amount=${course.price ?? 0}`}
                  className="btn-accent !px-4 !py-2 text-xs text-center inline-block"
                >
                  ادفع واشترك ({course.price ?? 0} ج.م)
                </Link>
              }
            >
              <p className="text-charcoal/70">{course.description || 'مفيش وصف مضاف.'}</p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                <span className="rounded-full bg-ink/5 px-2.5 py-1 text-ink">{course.skill}</span>
                <span className="rounded-full bg-ink/5 px-2.5 py-1 text-ink">{course.level}</span>
                {course.provider && <span className="rounded-full bg-ink/5 px-2.5 py-1 text-ink">{course.provider}</span>}
              </div>
              {course.questions?.length > 0 && (
                <Link
                  to={`/courses/${course._id}/exam`}
                  className="mt-3 inline-block text-xs font-semibold text-ink underline"
                >
                  ابدأ اختبار الكورس ({course.questions.length} سؤال)
                </Link>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;

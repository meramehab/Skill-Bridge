import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import courseService from '../services/course.service';
import CheckoutModal from '../components/common/CheckoutModal';
import useAuth from '../hooks/useAuth';

const CourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessonsData, setLessonsData] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError('');
      // جلب بيانات الكورس العامة
      const courseData = await courseService.getCourseById(courseId);
      setCourse(courseData);

      // فحص حالة الوصول الحالية
      const accessRes = await courseService.checkCourseAccess(courseId);
      const userHasAccess = Boolean(accessRes.hasAccess);
      setHasAccess(userHasAccess);

      if (userHasAccess) {
        // جلب الدروس الكاملة المحمية
        const fullLessons = await courseService.getCourseLessons(courseId);
        setLessonsData(fullLessons);
        if (fullLessons.lessons && fullLessons.lessons.length > 0) {
          setActiveLesson(fullLessons.lessons[0]);
        }
      } else {
        // لو ملوش وصول، نبحث عن أول درس تجريبي مجاني للعرض
        const freePreview = (courseData.lessons || []).find((l) => l.isFreePreview);
        if (freePreview) {
          setActiveLesson(freePreview);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'تعذر تحميل بيانات الكورس');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const handlePaymentSuccess = () => {
    // إعادة جلب المحتوى فور نجاح الدفع لفتح كافة الدروس
    fetchCourseDetails();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/50 text-sm">
        جاري تحميل تفاصيل ومحتوى الكورس...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-300">
          <p className="font-semibold">{error || 'الكورس غير متوفر حالياً'}</p>
          <Link to="/courses" className="mt-4 inline-block text-xs underline text-white">
            العودة لكتالوج الكورسات
          </Link>
        </div>
      </div>
    );
  }

  const allLessons = hasAccess && lessonsData?.lessons ? lessonsData.lessons : course.lessons || [];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white">
      {/* Header Banner */}
      <div className="border-b border-white/10 bg-white/[0.02] py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  {course.skill}
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                  {course.level}
                </span>
                {hasAccess ? (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-1 text-xs font-bold border border-emerald-500/40">
                    ✓ مشتـرك في الكورس
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-500/20 text-amber-300 px-3 py-1 text-xs font-bold border border-amber-500/30">
                    🔒 مقفل - يتطلب الاشتراك
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{course.title}</h1>
              <p className="mt-2 max-w-3xl text-sm text-white/60 leading-relaxed">
                {course.description || 'لا يوجد وصف مفصل متاح لهذا الكورس.'}
              </p>
            </div>

            {/* Price & Action Box */}
            <div className="flex flex-col sm:flex-row md:flex-col items-end justify-center rounded-2xl border border-white/10 bg-[#0E131F] p-5 min-w-[240px]">
              <div className="w-full text-right mb-3">
                <span className="text-xs text-white/40 block">سعر الكورس</span>
                <div className="text-2xl font-black text-emerald-400">{course.price} ج.م</div>
              </div>

              {!hasAccess ? (
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-black hover:opacity-95 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <span>اشترك الآن وافتح الكورس 🔓</span>
                </button>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <span>تم التفعيل بنجاح ✨</span>
                </div>
              )}

              {course.questions?.length > 0 && (
                <Link
                  to={`/courses/${course._id}/exam`}
                  className="mt-3 w-full text-center text-xs text-white/70 hover:text-white underline"
                >
                  اختبار الكورس والشهادة ({course.questions.length} أسئلة)
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Learning & Video Area */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Video Player Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-black aspect-video flex items-center justify-center"
              onContextMenu={(e) => {
                // منع النقر بزر الفأرة الأيمن لحماية محتوى الفيديو من التنزيل العشوائي
                e.preventDefault();
                return false;
              }}
            >
              {activeLesson && (hasAccess || activeLesson.isFreePreview) ? (
                activeLesson.videoUrl ? (
                  <video
                    controls
                    controlsList="nodownload"
                    disablePictureInPicture
                    className="h-full w-full object-cover"
                    src={activeLesson.videoUrl}
                  >
                    متصفحك لا يدعم تشغيل الفيديو.
                  </video>
                ) : (
                  <div className="text-center p-8 text-white/60">
                    <div className="text-4xl mb-2">🎬</div>
                    <p className="font-medium text-white">{activeLesson.title}</p>
                    <p className="text-xs text-white/40 mt-1">
                      {activeLesson.description || 'هذا الدرس يحتوي على مادة نصية وشروحات تطبيقية أدناه.'}
                    </p>
                  </div>
                )
              ) : (
                /* Locked Player State */
                <div className="p-8 text-center max-w-md">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-3xl text-amber-400 mb-4">
                    🔒
                  </div>
                  <h3 className="text-lg font-bold text-white">المحتوى محمي ومقفل</h3>
                  <p className="mt-2 text-xs text-white/60 leading-relaxed">
                    دروس هذا الكورس، شروحات الفيديو والملفات المرفقة متاحة فقط للطلاب المشتركين. اشترك الآن للاستفادة الكاملة من محتوى المسار.
                  </p>
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="mt-5 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition"
                  >
                    فتح المحتوى الآن ({course.price} ج.م)
                  </button>
                </div>
              )}
            </div>

            {/* Lesson Details & Markdown */}
            {activeLesson && (
              <div className="rounded-2xl border border-white/10 bg-[#0E131F] p-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">{activeLesson.title}</h2>
                    <span className="text-xs text-white/50">{activeLesson.durationMinutes || 15} دقيقة</span>
                  </div>
                  {activeLesson.isFreePreview && (
                    <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2.5 py-1 text-[11px] font-semibold border border-emerald-500/20">
                      معاينة مجانية
                    </span>
                  )}
                </div>

                <div className="mt-4 text-sm text-white/70 leading-relaxed space-y-3">
                  <p>{activeLesson.description || 'محتوى الدرس التدريبي العملي.'}</p>
                  {hasAccess && activeLesson.contentMarkdown && (
                    <div className="mt-4 rounded-xl bg-black/40 p-4 font-mono text-xs text-emerald-300 whitespace-pre-wrap border border-white/5">
                      {activeLesson.contentMarkdown}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right / Lessons Syllabus List (1 Col) */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#0E131F] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-base">محتويات الكورس</h3>
                <span className="text-xs text-white/40">{allLessons.length} دروس</span>
              </div>

              <div className="space-y-2">
                {allLessons.length === 0 ? (
                  <p className="text-xs text-white/40 py-4 text-center">لا توجد دروس مضافة لهذا الكورس بعد.</p>
                ) : (
                  allLessons.map((lesson, idx) => {
                    const isLocked = !hasAccess && !lesson.isFreePreview;
                    const isSelected = activeLesson?._id === lesson._id;

                    return (
                      <div
                        key={lesson._id || idx}
                        onClick={() => {
                          if (!isLocked) {
                            setActiveLesson(lesson);
                          } else {
                            setIsCheckoutOpen(true);
                          }
                        }}
                        className={`group flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/10 text-white'
                            : isLocked
                            ? 'border-white/5 bg-white/[0.01] opacity-75 hover:border-white/10'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20 text-white/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-white/40">{idx + 1}.</span>
                          <div>
                            <p className="text-xs font-medium group-hover:text-white line-clamp-1">{lesson.title}</p>
                            <span className="text-[10px] text-white/40">{lesson.durationMinutes || 15} دقيقة</span>
                          </div>
                        </div>

                        <div>
                          {isLocked ? (
                            <span className="text-amber-400 text-xs" title="مقفل">🔒</span>
                          ) : lesson.isFreePreview && !hasAccess ? (
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              مجاني
                            </span>
                          ) : (
                            <span className="text-emerald-400 text-xs">▶</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Security Notice */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs text-white/50 leading-relaxed">
              🛡️ <span className="text-white/80 font-medium">حماية المنصة:</span> يتم تشغيل مقاطع الفيديو والمحتوى الأكاديمي بتشفير مشدد وروابط مؤقتة لضمان أمان المحتوى.
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        course={course}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CourseDetail;

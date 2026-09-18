import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../services/course.service';
import aiService from '../services/ai.service';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ExternalLink,
  Award,
  Filter,
  FileQuestion,
  ArrowRight,
} from 'lucide-react';

const Learning = () => {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // اختبار الذكاء الاصطناعي
  const [skill, setSkill] = useState('javascript');
  const [quiz, setQuiz] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        setCoursesError('');
        const data = await courseService.getCourses();
        setCourses(data || []);
      } catch (err) {
        setCoursesError(err.response?.data?.message || 'تعذر تحميل الكورسات حالياً.');
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleGenerateQuiz = async () => {
    try {
      setQuizLoading(true);
      setQuizError('');
      const data = await aiService.generateQuiz(skill, 3);
      setQuiz(data || []);
      setAnswers({});
    } catch (err) {
      setQuizError(err.response?.data?.message || 'حصل خطأ في توليد أسئلة الاختبار الذكية.');
    } finally {
      setQuizLoading(false);
    }
  };

  const uniqueSkills = Array.from(new Set(courses.map((c) => c.skill).filter(Boolean)));

  const filteredCourses = selectedFilter === 'all'
    ? courses
    : courses.filter((c) => c.skill && c.skill.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white" dir="rtl">
      {/* Ambient glows */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>مسارات التعلم الأكاديمية والمهنية</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-display">
            تأهيلك لسوق العمل بكورسات معتمدة
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            استكشف الكورسات الموجهة لسد الفجوة بين دراستك الجامعية وسوق العمل الحر، مع إمكانية اختبار مهاراتك الفورية بالذكاء الاصطناعي والحصول على شهادات معتمدة.
          </p>
        </div>

        {/* Courses Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <span>الكورسات التدريبية المتاحة</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">كورسات تطبيقية مصممة وفق أحدث معايير التوظيف</p>
            </div>

            {/* Skill Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedFilter === 'all'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-[#13161e] border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                الكل ({courses.length})
              </button>
              {uniqueSkills.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedFilter(s)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedFilter === s
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-[#13161e] border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {coursesError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
              {coursesError}
            </div>
          )}

          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-[#13161e] border border-slate-800 rounded-3xl" />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-[#13161e] border border-dashed border-slate-800 rounded-3xl p-12 text-center">
              <p className="text-sm text-slate-400">لا توجد كورسات مطابقة للتصنيف المختار حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-[#13161e] border border-slate-800 hover:border-slate-700 rounded-3xl p-6 flex flex-col justify-between space-y-4 transition duration-200 group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
                        {course.skill || 'برمجة'}
                      </span>
                      <span className="text-xs font-mono font-bold text-white bg-slate-800/80 px-2.5 py-1 rounded-lg">
                        {course.price ? `${course.price} ج.م` : 'مجاني'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {course.description || 'كورس تطبيقي مكثف يركز على المهارات العملية وتنفيذ مشاريع التخرج والعمل الحر.'}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono text-slate-400">
                      <span className="px-2.5 py-1 rounded-md bg-[#1e2330]">
                        {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                      </span>
                      {course.durationHours > 0 && (
                        <span className="px-2.5 py-1 rounded-md bg-[#1e2330] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-400" />
                          <span>{course.durationHours} ساعة</span>
                        </span>
                      )}
                      {course.provider && (
                        <span className="px-2.5 py-1 rounded-md bg-[#1e2330]">
                          {course.provider}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
                    {course.questions?.length > 0 && (
                      <Link
                        to={`/courses/${course._id}/exam`}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition"
                      >
                        <FileQuestion className="w-3.5 h-3.5" />
                        <span>بدء اختبار التقييم والشهادة ({course.questions.length} سؤال)</span>
                      </Link>
                    )}

                    <Link
                      to={`/pay-course/${course._id}?amount=${course.price ?? 0}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-2.5 rounded-xl text-xs transition shadow-md shadow-emerald-500/20"
                    >
                      <span>اشترك الآن ({course.price ?? 0} ج.م)</span>
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* AI Quick Quiz Assessment */}
        <section className="bg-[#13161e] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>تقييم فوري بالذكاء الاصطناعي</span>
            </div>
            <h2 className="text-xl font-bold text-white">اختبر مستواك الذكي في مهارة معينة</h2>
            <p className="text-xs text-slate-400 max-w-xl">
              اختر المهارة البرمجية التي تود قياس مستواك فيها، وسيقوم الذكاء الاصطناعي بتوليد أسئلة تفاعلية مع تقييم لحظي لإجاباتك.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="bg-[#0B0F17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none min-w-[200px]"
            >
              <option value="javascript">JavaScript</option>
              <option value="react">React.js</option>
              <option value="nodejs">Node.js</option>
              <option value="python">Python</option>
              <option value="general">مفاهيم هندسة البرمجيات العامة</option>
            </select>

            <button
              type="button"
              onClick={handleGenerateQuiz}
              disabled={quizLoading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs hover:brightness-105 transition active:scale-95 disabled:opacity-50"
            >
              {quizLoading ? 'جاري توليد الأسئلة...' : 'توليد الاختبار بالـ AI ✨'}
            </button>
          </div>

          {quizError && (
            <p className="text-xs text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{quizError}</p>
          )}

          {quiz.length > 0 && (
            <div className="space-y-4 pt-2 animate-fadeIn">
              {quiz.map((q, index) => (
                <div
                  key={index}
                  className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-5 space-y-3"
                >
                  <p className="text-xs font-bold text-emerald-400 font-mono">سؤال {index + 1}:</p>
                  <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {(q.options || []).map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition ${
                          answers[index] === option
                            ? 'border-emerald-500 bg-emerald-500/10 text-white font-bold'
                            : 'border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${index}`}
                          checked={answers[index] === option}
                          onChange={() => setAnswers({ ...answers, [index]: option })}
                          className="accent-emerald-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>

                  {answers[index] && (
                    <p
                      className={`text-xs font-bold pt-1 ${
                        answers[index] === q.answer ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {answers[index] === q.answer ? 'إجابة صحيحة متميزة! 🎉' : `الإجابة النموذجية هي: ${q.answer}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Learning;

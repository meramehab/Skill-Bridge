import { useEffect, useState } from 'react';
import courseService from '../services/course.service';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const EMPTY_FORM = {
  title: '', description: '', skill: '', level: 'beginner',
  provider: '', url: '', durationHours: '', price: '',
};

const EMPTY_QUESTION = { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 };

// صفحة إدارة الكورسات - محمية بالكامل، الأدمن بس اللي يقدر يوصلها (حماية على مستوى الراوت في App.jsx)
const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const [form, setForm] = useState(EMPTY_FORM);
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actingId, setActingId] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCoursesForAdmin();
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setQuestions([]);
    setEditingId(null);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { ...EMPTY_QUESTION, options: [...EMPTY_QUESTION.options] }]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionTextChange = (index, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], questionText: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    const newOptions = [...updated[qIndex].options];
    newOptions[optIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options: newOptions };
    setQuestions(updated);
  };

  const handleCorrectOptionChange = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex] = { ...updated[qIndex], correctOptionIndex: optIndex };
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.skill || form.price === '' || form.price === undefined) {
      setError('يرجى ملء جميع الحقول المطلوبة بما في ذلك السعر');
      return;
    }

    const cleanedQuestions = questions
      .filter((q) => q.questionText.trim() && q.options.every((o) => o.trim()))
      .map((q) => ({ ...q, correctOptionIndex: Number(q.correctOptionIndex) }));

    const payload = {
      ...form,
      durationHours: form.durationHours ? Number(form.durationHours) : 0,
      price: Number(form.price) || 0,
      isFree: false,
      questions: cleanedQuestions,
    };

    try {
      setSaving(true);
      setError('');
      setFeedback('');
      if (editingId) {
        await courseService.updateCourse(editingId, payload);
        setFeedback('تم تعديل الكورس بنجاح ✅');
      } else {
        await courseService.createCourse(payload);
        setFeedback('تم إضافة الكورس بنجاح ✅');
      }
      resetForm();
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    setForm({
      title: course.title,
      description: course.description || '',
      skill: course.skill,
      level: course.level,
      provider: course.provider || '',
      url: course.url || '',
      durationHours: course.durationHours || '',
      price: course.price ?? '',
    });
    setQuestions(
      (course.questions || []).map((q) => ({
        questionText: q.questionText,
        options: [...q.options],
        correctOptionIndex: q.correctOptionIndex,
      }))
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (courseId) => {
    try {
      setActingId(courseId);
      await courseService.deleteCourse(courseId);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في الحذف');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <span className="eyebrow">لوحة الإدارة</span>
      <h1 className="mt-2 text-2xl font-semibold">إدارة الكورسات</h1>
      <p className="mt-1 text-sm text-muted">إضافة، تعديل، وحذف الكورسات وأسئلة الاختبار بتاعتها.</p>

      <Card className="mt-6" title={editingId ? 'تعديل الكورس' : 'إضافة كورس جديد'}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input" name="title" placeholder="عنوان الكورس" value={form.title} onChange={handleChange} required />
            <input className="input" name="skill" placeholder="المهارة (مثلاً: React)" value={form.skill} onChange={handleChange} required />
            <input className="input" name="provider" placeholder="الجهة (يوديمي، كورسيرا...)" value={form.provider} onChange={handleChange} />
            <input className="input" name="url" placeholder="رابط الكورس (اختياري)" value={form.url} onChange={handleChange} />
            <select className="input" name="level" value={form.level} onChange={handleChange}>
              <option value="beginner">مبتدئ</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">متقدم</option>
            </select>
            <input className="input" type="number" min="0" name="durationHours" placeholder="عدد الساعات" value={form.durationHours} onChange={handleChange} />
            <input className="input" type="number" min="1" name="price" placeholder="السعر بالجنيه *" value={form.price} onChange={handleChange} required />
            <textarea className="input sm:col-span-2" name="description" placeholder="وصف مختصر" value={form.description} onChange={handleChange} rows={2} />
          </div>

          <div className="mt-6 border-t border-line pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">أسئلة اختبار الكورس ({questions.length})</h3>
              <Button type="button" variant="outline" className="!py-1.5 !px-3 text-xs" onClick={handleAddQuestion}>
                + إضافة سؤال
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="rounded-lg border border-line p-3">
                  <div className="flex items-center gap-2">
                    <input
                      className="input flex-1"
                      placeholder={`نص السؤال ${qIndex + 1}`}
                      value={q.questionText}
                      onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-xs text-danger"
                    >
                      حذف
                    </button>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {q.options.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center gap-2 text-xs">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctOptionIndex === optIndex}
                          onChange={() => handleCorrectOptionChange(qIndex, optIndex)}
                        />
                        <input
                          className="input"
                          placeholder={`اختيار ${optIndex + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                        />
                      </label>
                    ))}
                  </div>
                  <p className="mt-1 text-[10px] text-muted">حددي الدائرة جنب الإجابة الصحيحة.</p>
                </div>
              ))}
              {questions.length === 0 && <p className="text-xs text-muted">مفيش أسئلة مضافة لسه.</p>}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button type="submit" variant="accent" loading={saving}>
              {editingId ? 'حفظ التعديل' : 'إضافة الكورس'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                إلغاء التعديل
              </Button>
            )}
          </div>
        </form>
      </Card>

      {feedback && <p className="mt-4 text-sm text-success">{feedback}</p>}
      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <h2 className="mt-10 text-lg font-semibold">كل الكورسات ({courses.length})</h2>
      {loading ? (
        <p className="mt-4 text-sm text-muted">جاري التحميل...</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course._id} eyebrow={`${course.price ?? 0} ج.م`} title={course.title}>
              <p className="text-sm text-charcoal/70">{course.skill} — {course.level}</p>
              <p className="mt-1 text-xs text-muted">{course.questions?.length || 0} سؤال اختبار</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="!py-1.5 !px-3 text-xs" onClick={() => handleEdit(course)}>
                  تعديل
                </Button>
                <Button
                  variant="outline" className="!py-1.5 !px-3 text-xs !text-danger !border-danger"
                  loading={actingId === course._id}
                  onClick={() => handleDelete(course._id)}
                >
                  حذف
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCourses;

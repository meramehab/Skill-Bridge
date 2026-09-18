import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import examService from '../services/exam.service';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const MAX_TAB_SWITCHES = 2; // بعد كام مرة خروج من الصفحة، الامتحان يتسلّم تلقائي

const ExamPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [warning, setWarning] = useState('');

  const answersRef = useRef(answers);
  const submittedRef = useRef(false);
  const tabSwitchCountRef = useRef(0);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const handleSubmit = useCallback(async (auto = false) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);

    try {
      const orderedAnswers = exam.questions.map((q) => answersRef.current[q.index] ?? -1);
      const data = await examService.submitExam(courseId, orderedAnswers);
      setResult({ ...data, auto });
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في تسليم الامتحان');
      submittedRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }, [exam, courseId]);

  // تحميل الأسئلة
  useEffect(() => {
    const loadExam = async () => {
      try {
        setLoading(true);
        const data = await examService.getExamQuestions(courseId);
        setExam(data);
      } catch (err) {
        setError(err.response?.data?.message || 'حصل خطأ في تحميل الامتحان');
      } finally {
        setLoading(false);
      }
    };
    loadExam();
  }, [courseId]);

  // ---------- إجراءات الحماية أثناء الامتحان ----------
  useEffect(() => {
    if (!exam || result) return;

    const blockCopyEvent = (e) => e.preventDefault();
    const blockContextMenu = (e) => e.preventDefault();

    const blockKeys = (e) => {
      const key = e.key?.toLowerCase();
      const isCopyPasteShortcut = (e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'u', 's', 'p', 'a'].includes(key);
      const isDevToolsShortcut = e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && key === 'i');
      if (isCopyPasteShortcut || isDevToolsShortcut) {
        e.preventDefault();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !submittedRef.current) {
        tabSwitchCountRef.current += 1;
        if (tabSwitchCountRef.current > MAX_TAB_SWITCHES) {
          handleSubmit(true);
        } else {
          setWarning(
            `⚠️ تحذير: خرجتِ من صفحة الامتحان (${tabSwitchCountRef.current}/${MAX_TAB_SWITCHES}). لو كررتيها هيتسلّم الامتحان تلقائيًا.`
          );
        }
      }
    };

    const handleBeforeUnload = (e) => {
      if (!submittedRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    document.addEventListener('copy', blockCopyEvent);
    document.addEventListener('cut', blockCopyEvent);
    document.addEventListener('paste', blockCopyEvent);
    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockKeys);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('copy', blockCopyEvent);
      document.removeEventListener('cut', blockCopyEvent);
      document.removeEventListener('paste', blockCopyEvent);
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockKeys);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [exam, result, handleSubmit]);

  if (loading) {
    return <p className="mx-auto max-w-2xl px-6 py-16 text-center text-muted">جاري تحميل الامتحان...</p>;
  }

  if (error && !exam) {
    return <p className="mx-auto max-w-2xl px-6 py-16 text-center text-danger">{error}</p>;
  }

  if (result) {
    return (
      <div className="mx-auto max-w-md px-6 py-16">
        <Card>
          <h2 className={`text-center text-xl font-semibold ${result.passed ? 'text-success' : 'text-danger'}`}>
            {result.passed ? 'مبروك، اجتزتِ الاختبار ✅' : 'محتاجة تحاولي تاني ❌'}
          </h2>
          {result.auto && (
            <p className="mt-2 text-center text-xs text-danger">
              (اتسلّم تلقائيًا بسبب الخروج من صفحة الامتحان أكتر من مرة)
            </p>
          )}
          <p className="mt-4 text-center text-3xl font-bold text-ink">{result.score}%</p>
          <p className="mt-1 text-center text-sm text-muted">
            {result.correctCount} من {result.totalQuestions} إجابة صحيحة
          </p>
          <Button variant="primary" fullWidth className="mt-6" onClick={() => navigate('/courses')}>
            الرجوع للكورسات
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-2xl px-6 py-12"
      style={{ userSelect: 'none' }}
      onCopy={(e) => e.preventDefault()}
    >
      <span className="eyebrow">اختبار الكورس</span>
      <h1 className="mt-2 text-2xl font-semibold">{exam.title}</h1>
      <p className="mt-1 text-xs text-danger">
        🔒 النسخ والخروج من الصفحة أثناء الامتحان ممنوعين ومتابَعين.
      </p>

      {warning && <p className="mt-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{warning}</p>}
      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-6 space-y-5">
        {exam.questions.map((q) => (
          <Card key={q.index} title={`سؤال ${q.index + 1}`}>
            <p className="font-medium text-charcoal">{q.questionText}</p>
            <div className="mt-3 space-y-2">
              {q.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    answers[q.index] === optionIndex ? 'border-ink bg-ink/5' : 'border-line'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${q.index}`}
                    className="accent-ink"
                    checked={answers[q.index] === optionIndex}
                    onChange={() => setAnswers({ ...answers, [q.index]: optionIndex })}
                  />
                  {option}
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Button
        variant="accent" fullWidth className="mt-8"
        loading={submitting}
        onClick={() => handleSubmit(false)}
      >
        تسليم الامتحان
      </Button>
    </div>
  );
};

export default ExamPage;

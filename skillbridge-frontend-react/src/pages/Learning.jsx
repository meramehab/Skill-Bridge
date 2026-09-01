import { useState } from 'react';
import aiService from '../services/ai.service';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Learning = () => {
  const [skill, setSkill] = useState('javascript');
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aiService.generateQuiz(skill, 3);
      setQuiz(data);
      setAnswers({});
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في توليد الاختبار');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <span className="eyebrow">مسار التعلم</span>
      <h1 className="mt-2 text-2xl font-semibold">اختبر مستواك في مهارة</h1>
      <p className="mt-2 text-sm text-muted">
        اختار المهارة اللي عايز تختبر نفسك فيها، وهنولّدلك أسئلة سريعة تقيس مستواك الحالي.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select value={skill} onChange={(e) => setSkill(e.target.value)} className="input max-w-xs">
          <option value="javascript">JavaScript</option>
          <option value="react">React</option>
          <option value="general">عام</option>
        </select>
        <Button onClick={handleGenerate} loading={loading} variant="accent">
          ولّد الاختبار
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      {quiz.length > 0 && (
        <div className="mt-8 space-y-4">
          {quiz.map((q, index) => (
            <Card key={index} title={`سؤال ${index + 1}`}>
              <p className="font-medium text-charcoal">{q.question}</p>
              <div className="mt-3 space-y-2">
                {q.options.map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                      answers[index] === option ? 'border-ink bg-ink/5' : 'border-line'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${index}`}
                      className="accent-ink"
                      checked={answers[index] === option}
                      onChange={() => setAnswers({ ...answers, [index]: option })}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {answers[index] && (
                <p className={`mt-3 text-xs font-semibold ${answers[index] === q.answer ? 'text-success' : 'text-danger'}`}>
                  {answers[index] === q.answer ? 'إجابة صحيحة ✅' : `الإجابة الصح: ${q.answer}`}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Learning;

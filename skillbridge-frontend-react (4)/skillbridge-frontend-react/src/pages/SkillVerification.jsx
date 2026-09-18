import { useState } from 'react';
import aiService from '../services/ai.service';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const SKILL_OPTIONS = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'react', label: 'React.js' },
  { id: 'general', label: 'أساسيات عامة (General)' },
];

const SkillVerification = () => {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' | 'code' | 'task'

  // --- 1. حالة اختبار المهارة (Quiz) ---
  const [selectedSkill, setSelectedSkill] = useState('javascript');
  const [customSkill, setCustomSkill] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');

  // --- 2. حالة فحص الكود (Code Analysis) ---
  const [codeText, setCodeText] = useState(
    '// اكتب أو الصق الكود هنا لفحصه\nfunction calculateTotal(items) {\n  var total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  console.log("Total is:", total);\n  return total;\n}'
  );
  const [codeResult, setCodeResult] = useState(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState('');

  // --- 3. حالة تقييم المهمة (Task Assessment) ---
  const [completionPercent, setCompletionPercent] = useState(80);
  const [submittedOnTime, setSubmittedOnTime] = useState(true);
  const [meetsRequirements, setMeetsRequirements] = useState(true);
  const [taskResult, setTaskResult] = useState(null);
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState('');

  // معالجات الكويز
  const handleGenerateQuiz = async () => {
    try {
      setQuizLoading(true);
      setQuizError('');
      setQuizSubmitted(false);
      setUserAnswers({});
      setQuizScore(null);
      const skillToQuery = customSkill.trim() || selectedSkill;
      const questions = await aiService.generateQuiz(skillToQuery, 3);
      setQuizQuestions(questions);
    } catch (err) {
      setQuizError(err.response?.data?.message || 'تعذر توليد الاختبار، يرجى المحاولة لاحقاً');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex, option) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmitQuiz = () => {
    if (quizQuestions.length === 0) return;
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        correctCount += 1;
      }
    });
    setQuizScore({
      correctCount,
      total: quizQuestions.length,
      percentage: Math.round((correctCount / quizQuestions.length) * 100),
    });
    setQuizSubmitted(true);
  };

  // معالجات فحص الكود
  const handleAnalyzeCode = async () => {
    if (!codeText.trim()) return;
    try {
      setCodeLoading(true);
      setCodeError('');
      setCodeResult(null);
      const data = await aiService.analyzeCodeQuality(codeText);
      setCodeResult(data);
    } catch (err) {
      setCodeError(err.response?.data?.message || 'حصل خطأ أثناء فحص جودة الكود');
    } finally {
      setCodeLoading(false);
    }
  };

  // معالجات تقييم المهمة
  const handleAssessTask = async () => {
    try {
      setTaskLoading(true);
      setTaskError('');
      const data = await aiService.assessTask({ completionPercent, submittedOnTime, meetsRequirements });
      setTaskResult(data);
    } catch (err) {
      setTaskError(err.response?.data?.message || 'حصل خطأ في التقييم');
    } finally {
      setTaskLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 font-body">
      <span className="eyebrow">منظومة التحقق الذكية</span>
      <h1 className="mt-2 text-2xl font-semibold">إثبات وتقييم المهارات بالـ AI</h1>
      <p className="mt-2 text-sm text-muted">
        استخدم أدوات الذكاء الاصطناعي لاختبار مستواك، فحص جودة برمجتك، وتقييم إنجاز مهامك العملية.
      </p>

      {/* التبويبات الثلاثة */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-3">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'quiz' ? 'bg-ink text-white' : 'bg-white text-charcoal border border-line hover:bg-paper'
          }`}
        >
          📝 اختبار مهارة ذكي (Quiz)
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'code' ? 'bg-ink text-white' : 'bg-white text-charcoal border border-line hover:bg-paper'
          }`}
        >
          💻 فحص جودة الكود (Code Analysis)
        </button>
        <button
          onClick={() => setActiveTab('task')}
          className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'task' ? 'bg-ink text-white' : 'bg-white text-charcoal border border-line hover:bg-paper'
          }`}
        >
          ⚡ تقييم مهمة عملية (Task Assessment)
        </button>
      </div>

      {/* 1. تبويب اختبار المهارة (Quiz) */}
      {activeTab === 'quiz' && (
        <div className="mt-8 space-y-6">
          <Card title="توليد اختبار مهارة فوري" eyebrow="AI Skill Quiz Generator">
            <p className="text-xs text-muted mb-4">
              اختر المهارة التي ترغب في اختبارها، وسيقوم الذكاء الاصطناعي بتوليد أسئلة فورية لتقييم مستواك.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {SKILL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedSkill(opt.id);
                    setCustomSkill('');
                  }}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-medium border transition-colors ${
                    selectedSkill === opt.id && !customSkill
                      ? 'border-ink bg-ink text-white'
                      : 'border-line bg-white text-charcoal hover:border-ink/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}

              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="أو اكتب اسم مهارة أخرى..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  className="input !py-1.5 !text-xs"
                />
              </div>

              <Button
                onClick={handleGenerateQuiz}
                loading={quizLoading}
                variant="accent"
                className="!py-2 !px-4 text-xs"
              >
                توليد الاختبار ⚡
              </Button>
            </div>

            {quizError && <p className="mt-3 text-xs text-danger">{quizError}</p>}
          </Card>

          {/* عرض الأسئلة */}
          {quizQuestions.length > 0 && (
            <div className="space-y-4">
              {quizQuestions.map((q, qIndex) => (
                <Card key={qIndex} title={`السؤال ${qIndex + 1}: ${q.question}`} eyebrow="سؤال تقييمي">
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = userAnswers[qIndex] === opt;
                      const isCorrect = q.answer === opt;
                      let optionClasses = 'border-line bg-white text-charcoal hover:bg-paper';

                      if (quizSubmitted) {
                        if (isCorrect) {
                          optionClasses = 'border-success bg-success/10 text-success font-semibold';
                        } else if (isSelected && !isCorrect) {
                          optionClasses = 'border-danger bg-danger/10 text-danger';
                        }
                      } else if (isSelected) {
                        optionClasses = 'border-ink bg-ink text-white';
                      }

                      return (
                        <button
                          key={optIndex}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => handleSelectAnswer(qIndex, opt)}
                          className={`w-full rounded-lg border p-3 text-right text-xs sm:text-sm transition-all flex items-center justify-between ${optionClasses}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <span className="text-xs">✅ إجابة صحيحة</span>}
                          {quizSubmitted && isSelected && !isCorrect && <span className="text-xs">❌ إجابة خاطئة</span>}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              ))}

              {!quizSubmitted ? (
                <Button
                  onClick={handleSubmitQuiz}
                  variant="primary"
                  fullWidth
                  disabled={Object.keys(userAnswers).length < quizQuestions.length}
                >
                  تسليم الإجابات واحتساب النتيجة 🏁
                </Button>
              ) : (
                quizScore && (
                  <Card title="نتيجة الاختبار" eyebrow="Quiz Assessment Result">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display text-3xl font-semibold text-ink">
                          {quizScore.percentage}%
                        </p>
                        <p className="text-xs text-muted mt-1">
                          أجبت على {quizScore.correctCount} من إجمالي {quizScore.total} أسئلة بشكل صحيح.
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                          quizScore.percentage >= 60 ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                        }`}
                      >
                        {quizScore.percentage >= 60 ? 'ناجح ومؤهل ✅' : 'يحتاج إلى مزيد من التدريب'}
                      </span>
                    </div>
                  </Card>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. تبويب فحص جودة الكود (Code Analysis) */}
      {activeTab === 'code' && (
        <div className="mt-8 space-y-6">
          <Card title="فاحص جودة الكود البرمجي" eyebrow="AI Code Quality Reviewer">
            <p className="text-xs text-muted mb-4">
              الصق الكود المصدري أدناه ليقوم الذكاء الاصطناعي بفحصه ضد المعايير البرمجية واكتشاف الممارسات غير المستحبة واقتراح التحسينات.
            </p>

            <textarea
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              rows={9}
              className="w-full rounded-lg border border-line bg-paper/40 p-3 font-mono text-xs text-charcoal focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
              placeholder="الصق الكود هنا..."
              dir="ltr"
            />

            <div className="mt-4 flex gap-3">
              <Button onClick={handleAnalyzeCode} loading={codeLoading} variant="accent" className="flex-1">
                فحص جودة الكود الآن 🔍
              </Button>
            </div>

            {codeError && <p className="mt-3 text-xs text-danger">{codeError}</p>}
          </Card>

          {codeResult && (
            <div className="space-y-4">
              <Card title="مؤشر جودة الكود" eyebrow="Code Quality Score">
                <div className="flex items-center justify-between">
                  <p className="font-display text-3xl font-semibold text-ink">
                    {codeResult.score}/100
                  </p>
                  <span
                    className={`rounded-full px-3.5 py-1 text-xs font-semibold ${
                      codeResult.score >= 80
                        ? 'bg-success/15 text-success'
                        : codeResult.score >= 60
                        ? 'bg-signal/20 text-ink'
                        : 'bg-danger/15 text-danger'
                    }`}
                  >
                    {codeResult.score >= 80 ? 'جودة ممتازة' : codeResult.score >= 60 ? 'جودة مقبولة' : 'يحتاج مراجعة'}
                  </span>
                </div>
              </Card>

              <Card title="ملاحظات وتوصيات التحسين" eyebrow="Detected Code Issues">
                {codeResult.issues?.length === 0 ? (
                  <p className="text-success font-medium text-xs">
                    🎉 رائع! الكود نظيف تماماً ومتوافق مع أفضل الممارسات البرمجية.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {codeResult.issues.map((issue, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 rounded-lg border border-signal/30 bg-signal/5 p-3 text-xs text-charcoal"
                      >
                        <span className="text-signal-dark font-bold">⚠️</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          )}
        </div>
      )}

      {/* 3. تبويب تقييم مهمة عملية (Task Assessment) */}
      {activeTab === 'task' && (
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
            <label htmlFor="onTime" className="text-sm">اتسلّمت في الميعاد المحدد</label>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <input
              id="meetsReq"
              type="checkbox"
              checked={meetsRequirements}
              onChange={(e) => setMeetsRequirements(e.target.checked)}
              className="h-4 w-4 accent-ink"
            />
            <label htmlFor="meetsReq" className="text-sm">مطابقة لكافة متطلبات المهمة</label>
          </div>

          <Button onClick={handleAssessTask} loading={taskLoading} variant="accent" fullWidth className="mt-6">
            قيّم المهمة العملية
          </Button>

          {taskError && <p className="mt-4 text-sm text-danger">{taskError}</p>}

          {taskResult && (
            <div className="mt-6 rounded-lg border border-line bg-paper p-4">
              <p className="font-display text-2xl font-semibold text-ink">{taskResult.score}/100</p>
              <p className={`mt-1 text-sm font-semibold ${taskResult.passed ? 'text-success' : 'text-danger'}`}>
                {taskResult.passed ? 'اجتزت المهمة بنجاح ✅' : 'محتاج تحسّن أكثر قبل الاجتياز ❌'}
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SkillVerification;


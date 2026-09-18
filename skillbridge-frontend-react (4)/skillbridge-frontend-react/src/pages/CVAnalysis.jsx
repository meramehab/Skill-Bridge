import React, { useState, useEffect, useRef } from 'react';
import useSkills from '../hooks/useSkills';
import aiService from '../services/ai.service';
import {
  Sparkles,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  X,
  RotateCcw,
  Zap,
} from 'lucide-react';

const CVAnalysis = () => {
  const { analyzing: analyzingRule, result: ruleResult, error: ruleError, analyzeCV } = useSkills();
  const [file, setFile] = useState(null);
  const [analyzingGemini, setAnalyzingGemini] = useState(false);
  const [geminiResult, setGeminiResult] = useState(null);
  const [geminiError, setGeminiError] = useState(null);
  const [activeMode, setActiveMode] = useState(null); // 'gemini' | 'rule'
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // استرجاع التحليل المحفوظ سابقاً
  useEffect(() => {
    try {
      const savedGemini = localStorage.getItem('sb_cv_gemini');
      if (savedGemini) {
        const parsed = JSON.parse(savedGemini);
        if (parsed && typeof parsed === 'object') {
          setGeminiResult(parsed);
          setActiveMode('gemini');
        }
      }
    } catch (e) {
      console.warn('Could not parse cached CV analysis:', e);
    }
  }, []);

  const handleFileChange = (selected) => {
    if (!selected) return;
    const isValid =
      selected.type === 'application/pdf' ||
      selected.name.toLowerCase().endsWith('.pdf') ||
      selected.name.toLowerCase().endsWith('.doc') ||
      selected.name.toLowerCase().endsWith('.docx');

    if (isValid) {
      setFile(selected);
      setGeminiError(null);
    } else {
      setGeminiError('يرجى اختيار ملف بصيغة PDF أو Word صالحة.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const clearFile = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // التحليل السريع (Rule-Based)
  const handleRuleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!file) {
      setGeminiError('يرجى اختيار ملف السيرة الذاتية (PDF) أولاً.');
      return;
    }
    setGeminiError(null);
    setActiveMode('rule');
    const targetSkills = ['javascript', 'react', 'node.js', 'mongodb', 'git', 'typescript'];
    const res = await analyzeCV(file, targetSkills);
    if (res) {
      localStorage.setItem('sb_cv_rule', JSON.stringify(res));
    }
  };

  // التحليل المتقدم بـ Gemini
  const handleGeminiSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!file) {
      setGeminiError('يرجى اختيار ملف السيرة الذاتية (PDF) أولاً.');
      return;
    }
    try {
      setAnalyzingGemini(true);
      setGeminiError(null);
      setActiveMode('gemini');
      const data = await aiService.analyzeCVWithGemini(file);
      setGeminiResult(data);
      localStorage.setItem('sb_cv_gemini', JSON.stringify(data));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || '';
      setGeminiError(msg || 'حدث خطأ غير متوقع أثناء معالجة السيرة الذاتية.');
    } finally {
      setAnalyzingGemini(false);
    }
  };

  const activeResult = activeMode === 'gemini' ? geminiResult : ruleResult;
  const score = activeResult?.careerReadinessScore ?? 75;

  return (
    <div className="min-h-screen bg-[#0f1117] text-white py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white" dir="rtl">
      {/* Ambient background glows */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Readiness Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-display">
            تحليل السيرة الذاتية الذكي بالـ AI
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            ارفع سيرتك الذاتية لاستخراج مهاراتك التقنية تلقائياً، واكتشاف المهارات الناقصة لمطابقتها مع سوق العمل الحر، مع مؤشر جاهزية مهنية دقيق.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-[#13161e] border border-[#222634] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-200 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-emerald-400" />
              <span>ملف السيرة الذاتية (PDF, Word)</span>
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span className="px-2.5 py-1 rounded-full bg-[#1e2330] border border-[#2a2f3a]">PDF</span>
              <span className="px-2.5 py-1 rounded-full bg-[#1e2330] border border-[#2a2f3a]">DOCX</span>
              <span className="text-gray-500">حتى 5MB</span>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${
              isDragging
                ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                : file
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-[#2a2f3a] bg-[#0f1117]/60 hover:border-emerald-500/40 hover:bg-[#151922]'
            }`}
          >
            <input
              ref={fileInputRef}
              id="cv-file-input"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-[#1e2330] border border-[#2a2f3a] flex items-center justify-center text-emerald-400 mb-4 shadow-lg">
              <FileText className="w-8 h-8" />
            </div>

            {file ? (
              <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                <p className="text-sm font-bold text-white flex items-center gap-2 justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{file.name}</span>
                </p>
                <p className="text-xs text-gray-400 font-mono">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={clearFile}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium py-1 px-3 rounded-lg bg-red-500/10 border border-red-500/20 transition"
                >
                  <X className="w-3.5 h-3.5" />
                  إزالة الملف
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-gray-200">
                  اسحب ملف السيرة الذاتية وأفلته هنا، أو <span className="text-emerald-400 underline">اضغط لاختيار ملف</span>
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  يدعم ملفات PDF و Word المستخرجة بدقة عالية
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons: Explicitly type="button" and isolated from dropzone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              id="btn-gemini-analysis"
              type="button"
              disabled={!file || analyzingGemini || analyzingRule}
              onClick={handleGeminiSubmit}
              className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3.5 px-6 rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              {analyzingGemini ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>جاري التحليل بـ Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>تحليل متقدم بالـ AI (Gemini)</span>
                </>
              )}
            </button>

            <button
              id="btn-rule-analysis"
              type="button"
              disabled={!file || analyzingRule || analyzingGemini}
              onClick={handleRuleSubmit}
              className="flex items-center justify-center gap-2 bg-[#1e2330] hover:bg-[#252b3b] text-gray-200 border border-[#2a2f3a] hover:border-emerald-500/40 font-bold py-3.5 px-6 rounded-2xl text-sm transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              {analyzingRule ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                  <span>جاري الفحص السريع...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>تحليل سريع للمهارات (Rule-Based)</span>
                </>
              )}
            </button>
          </div>

          {/* Error / Warning Alert */}
          {(geminiError || ruleError) && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs sm:text-sm text-red-300 flex items-start justify-between gap-3 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{geminiError || ruleError}</p>
              </div>
              <button
                type="button"
                onClick={() => setGeminiError(null)}
                className="text-red-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {activeResult && (
          <div id="cv-results-section" className="space-y-6 animate-fadeIn">
            {/* Status notification banner */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs sm:text-sm text-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-semibold">
                  {activeResult.isFallback
                    ? 'تم إنجاز التحليل بنجاح بالنظام الاحتياطي الذكي لضمان استمرارية الخدمة.'
                    : activeMode === 'gemini'
                    ? 'تم تحليل السيرة الذاتية بنجاح عبر نموذج Gemini الذكي المتخصص.'
                    : 'تم الفحص السريع للمهارات واستخراج التقنيات المطابقة.'}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                {activeMode === 'gemini' ? 'Gemini 1.5 Flash' : 'Rule Engine'}
              </span>
            </div>

            {/* Score & Gauge Card */}
            <div className="bg-[#13161e] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="text-center sm:text-right shrink-0 min-w-[150px]">
                  <p className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
                    Career Readiness Score
                  </p>
                  <p className="text-5xl font-black text-white font-mono">
                    {score}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5 font-medium">
                    {score >= 80 ? 'جاهز لسوق العمل الحر 🚀' : score >= 60 ? 'مستوى متوسط واعد ⚡' : 'يحتاج تطوير مهارات 📚'}
                  </p>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="h-4 w-full bg-[#1e2330] rounded-full overflow-hidden p-0.5 border border-[#2a2f3a]">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(Math.max(score, 5), 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-gray-400">
                    <span>مبتدئ (0%)</span>
                    <span className="text-emerald-400 font-bold">المعدل الحالي: {score}%</span>
                    <span>محترف مؤهل (100%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Summary if available */}
            {activeResult.summary && (
              <div className="bg-[#13161e] border border-[#222634] rounded-3xl p-6 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>الملخص المهني الذكي</span>
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {activeResult.summary}
                </p>
              </div>
            )}

            {/* Extracted Skills - Safe rendering with optional chaining & fallbacks */}
            <div className="bg-[#13161e] border border-[#222634] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400">⚡</span>
                  <span>المهارات التقنية المكتشفة في الـ CV</span>
                </h3>
                <span className="text-xs font-mono text-gray-400">
                  {((activeResult?.skills || activeResult?.extractedSkills || []).length)} مهارة
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {(activeResult?.skills || activeResult?.extractedSkills || []).length === 0 ? (
                  <p className="text-xs text-gray-500">لم يتم العثور على مهارات معروفة مباشرة بالملف.</p>
                ) : (
                  (activeResult?.skills || activeResult?.extractedSkills || []).map((skill, idx) => (
                    <span
                      key={`${skill}-${idx}`}
                      className="px-3.5 py-1.5 rounded-xl bg-[#1e2330] border border-[#2a2f3a] text-xs font-semibold text-gray-200 hover:border-emerald-500/40 hover:text-emerald-300 transition"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Suggested Roles - Safe rendering */}
            {(activeResult?.suggestedRoles || []).length > 0 && (
              <div className="bg-[#13161e] border border-[#222634] rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>الوظائف والأدوار الأكثر مطابقة لملفك</span>
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {(activeResult?.suggestedRoles || []).map((role, idx) => (
                    <span
                      key={`${role}-${idx}`}
                      className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-300"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills Warning */}
            {(activeResult?.missingSkills || []).length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>المهارات الموصى بتعلمها لزيادة التنافسية في سوق العمل</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(activeResult?.missingSkills || []).map((skill, idx) => (
                    <span
                      key={`${skill}-${idx}`}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  💡 اكتساب هذه المهارات يرفع تقييمك التنافسي ومعدل جاهزيتك المهنية على المنصة.
                </p>
              </div>
            )}

            {/* Suggested Learning Path */}
            {(activeResult?.suggestedLearningPath || []).length > 0 && (
              <div className="bg-[#13161e] border border-[#222634] rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>مسار التعلم المقترح لتطوير ملفك</span>
                </h3>
                <div className="space-y-2.5">
                  {(activeResult?.suggestedLearningPath || []).map((item, idx) => (
                    <div
                      key={`${item.skill}-${idx}`}
                      className="p-3.5 rounded-2xl bg-[#0f1117] border border-[#222634] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <span className="text-xs font-bold text-emerald-300 font-mono">
                        {item.skill}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item.resourceSuggestion}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CV Suggestions */}
            {(activeResult?.cvSuggestions || []).length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400" />
                  <span>توصيات الذكاء الاصطناعي لتحسين سيرتك الذاتية</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                  {(activeResult?.cvSuggestions || []).map((sug, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fast Navigation CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="/learning"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                <BookOpen className="w-4 h-4 text-slate-950" />
                <span>ابدأ مسار التعلم المخصص</span>
              </a>
              <a
                href="/skill-verification"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1e2330] hover:bg-[#252b3b] text-white border border-[#2a2f3a] font-bold py-3.5 px-6 rounded-2xl text-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>توثيق المهارات بالشهادة</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVAnalysis;

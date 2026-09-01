/**
 * @file CVAnalysisLogicView.jsx
 * @description Logic wiring for AI CV Analysis, skill gap detection, readiness gauge, and actionable recommendations.
 */
import React from "react";
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  RotateCcw
} from "lucide-react";
import { useCVAnalysis } from "../../hooks/useCVAnalysis";

export function CVAnalysisLogicView() {
  const {
    fileInputRef,
    selectedFile,
    isDragging,
    isLoading,
    results,
    error,
    handleFileUpload,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    clearFile,
    analyzeCV,
    formatFileSize,
    getLevelColor,
    setError
  } = useCVAnalysis();

  return (
    <div id="cv-analysis-container" className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <span>📄</span>
          تحليل السيرة الذاتية بالذكاء الاصطناعي
        </h1>
        <p className="text-gray-600 text-base max-w-xl mx-auto">
          ارفع سيرتك الذاتية وسيحللها الذكاء الاصطناعي لتحديد مستوى مهاراتك ونقاط القوة والنواقص
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition cursor-pointer ${
            isDragging
              ? "border-indigo-600 bg-indigo-50/50 scale-[1.01]"
              : "border-gray-300 hover:border-indigo-500 hover:bg-gray-50/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">ارفع السيرة الذاتية</h3>
          <p className="text-gray-500 text-sm mb-3">
            اسحب الملف هنا أو اضغط للاختيار من جهازك
          </p>
          <p className="text-xs text-gray-400 font-medium">
            الملفات المدعومة: PDF, DOCX, DOC (الحد الأقصى 5MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Selected File */}
        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
              title="إزالة الملف"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Analyze Button */}
        <button
          id="btn-analyze-cv"
          onClick={analyzeCV}
          disabled={!selectedFile || isLoading}
          className="w-full mt-6 bg-indigo-600 text-white py-3.5 px-6 rounded-xl font-semibold text-base hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-sm"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>جاري التحليل واستخراج المهارات...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>تحليل السيرة الذاتية</span>
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div id="cv-analysis-results" className="space-y-6 animate-fadeIn">
          {/* Score & Readiness */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">نتيجة التحليل ومؤشر الجاهزية</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center min-w-[120px]">
                <p className="text-5xl font-extrabold text-indigo-600">{results.score}%</p>
                <p className="text-sm font-medium text-gray-500 mt-1">مؤشر الجاهزية</p>
              </div>
              <div className="flex-1 w-full">
                <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-3.5 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${results.score}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                  <span>مبتدئ (0%)</span>
                  <span className="text-indigo-600 font-bold">{results.level}</span>
                  <span>خبير (100%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Skills */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🛠️</span>
              المهارات المكتشفة
            </h3>
            <div className="space-y-4">
              {results.skills?.map((skill) => (
                <div key={skill.name} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-semibold text-gray-800 text-sm">{skill.name}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${getLevelColor(skill.level)}`}>
                      {skill.level} ({skill.score}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          {results.missingSkills?.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                المهارات الناقصة المطلوبة في سوق العمل
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {results.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3.5 py-1.5 bg-amber-100 text-amber-800 font-medium rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-xs text-amber-700">
                💡 ننصح بتعلم هذه المهارات وإكمال مشاريع تطبيقية لرفع فرصة قبولك في سوق العمل الحر.
              </p>
            </div>
          )}

          {/* Recommendations */}
          {results.recommendations?.length > 0 && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-emerald-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
                توصيات مخصصة لتطوير ملفك
              </h3>
              <ul className="space-y-2.5">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href="/learning"
              className="flex-1 bg-indigo-600 text-white py-3.5 px-6 rounded-xl font-semibold text-center hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <BookOpen className="w-5 h-5" />
              ابدأ مسار التعلم المخصص
            </a>
            <a
              href="/skill-verification"
              className="flex-1 bg-white border border-gray-300 text-gray-800 py-3.5 px-6 rounded-xl font-semibold text-center hover:bg-gray-50 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              وثق مهاراتك بشهادة معتمدة
            </a>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mt-6">
          <p className="text-red-700 font-medium text-sm mb-3">{error}</p>
          <button
            onClick={() => setError(null)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-800 underline"
          >
            <RotateCcw className="w-4 h-4" />
            حاول مرة أخرى
          </button>
        </div>
      )}
    </div>
  );
}

export default CVAnalysisLogicView;

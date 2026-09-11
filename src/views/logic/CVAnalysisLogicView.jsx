/**
 * @file CVAnalysisLogicView.jsx
 * @description Modern Figma presentation layer for the AI CV Analysis page connecting useCVAnalysis.
 * Features drag-and-drop CV upload dropzone, readiness gauge, discovered skills, skill gap badges, and AI recommendations.
 */
import React from "react";
import { useCVAnalysis } from "../../hooks/useCVAnalysis";
import { ButtonLogic as Button } from "../../components/contracts/ButtonLogic";
import { CardLogic as Card } from "../../components/contracts/CardLogic";
import { ProgressBarLogic as ProgressBar } from "../../components/contracts/ProgressBarLogic";
import { BadgeLogic as Badge } from "../../components/contracts/BadgeLogic";
import { NavbarLogic as Navbar } from "../../components/contracts/NavbarLogic";
import { FooterLogic as Footer } from "../../components/contracts/FooterLogic";
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
  RotateCcw,
  ArrowLeft
} from "lucide-react";

export function CVAnalysisLogicView({
  CardComponent = Card,
  ButtonComponent = Button,
  ProgressBarComponent = ProgressBar,
  BadgeComponent = Badge
}) {
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
    <div id="cv-analysis-container" className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>الذكاء الاصطناعي لتحليل المهارات</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-2">
              تحليل السيرة الذاتية (CV Analysis) 📄
            </h1>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              ارفع سيرتك الذاتية وسيقوم نظام الذكاء الاصطناعي باستخراج مهاراتك وتحديد الفجوات وتقديم توصيات مخصصة.
            </p>
          </div>

          {/* ─── Upload Section ─── */}
          <CardComponent variant="elevated" className="p-8 sm:p-10 border border-[#222634]">
            <div
              className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
                  : "border-[#2e3446] hover:border-emerald-500/60 bg-[#181b24]/40"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">ارفع السيرة الذاتية</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-3">
                اسحب الملف هنا أو اضغط للاختيار من جهازك
              </p>
              <p className="text-xs text-gray-500 font-mono">
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

            {/* Selected File Card */}
            {selectedFile && (
              <div className="mt-5 p-4 bg-[#181b24] rounded-2xl flex items-center justify-between border border-[#262c3d] animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                  title="إزالة الملف"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Analyze Trigger Button */}
            <ButtonComponent
              id="btn-analyze-cv"
              variant="primary"
              size="lg"
              onClick={analyzeCV}
              disabled={!selectedFile || isLoading}
              isLoading={isLoading}
              className="w-full mt-6"
            >
              {isLoading ? (
                <span>جاري التحليل واستخراج المهارات بالذكاء الاصطناعي...</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 ml-1" />
                  <span>بدء تحليل السيرة الذاتية الآن</span>
                </>
              )}
            </ButtonComponent>
          </CardComponent>

          {/* ─── Results Section ─── */}
          {results && (
            <div id="cv-analysis-results" className="space-y-6 animate-fadeIn">
              {/* Score & Career Readiness Gauge */}
              <CardComponent variant="glow" className="p-8 border border-emerald-500/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  نتيجة التحليل ومؤشر الجاهزية المهنية
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="text-center min-w-[130px]">
                    <p className="text-5xl font-extrabold text-emerald-400 font-mono">{results.score}%</p>
                    <p className="text-xs font-semibold text-gray-400 mt-1">مؤشر الجاهزية</p>
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <ProgressBarComponent
                      value={results.score}
                      color="gradient"
                      size="lg"
                      showPercentage={false}
                    />
                    <div className="flex justify-between text-xs text-gray-400 font-mono font-medium">
                      <span>مبتدئ (0%)</span>
                      <span className="text-emerald-400 font-bold">{results.level}</span>
                      <span>جاهز للعمل (100%)</span>
                    </div>
                  </div>
                </div>
              </CardComponent>

              {/* Extracted Skills */}
              <CardComponent variant="surface" className="p-6 border border-[#222634]">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span>🛠️</span>
                  المهارات المكتشفة في السيرة الذاتية
                </h3>
                <div className="space-y-3.5">
                  {results.skills?.map((skill) => (
                    <div key={skill.name} className="border-b border-[#1e2330] pb-3 last:border-0">
                      <div className="flex justify-between items-center mb-1.5 text-xs">
                        <span className="font-bold text-white">{skill.name}</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {skill.level} ({skill.score}%)
                        </span>
                      </div>
                      <ProgressBarComponent
                        value={skill.score}
                        color="emerald"
                        size="sm"
                        showPercentage={false}
                      />
                    </div>
                  ))}
                </div>
              </CardComponent>

              {/* Missing Skills */}
              {results.missingSkills?.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6">
                  <h3 className="text-base font-bold text-amber-300 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    المهارات المطلوبة في سوق العمل وغير موجودة بالـ CV
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {results.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-amber-200/80">
                    💡 ننصح بتعلم هذه المهارات وإضافتها إلى مسار تعلمك لرفع فرصة قبولك في سوق العمل الحر.
                  </p>
                </div>
              )}

              {/* Recommendations */}
              {results.recommendations?.length > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6">
                  <h3 className="text-base font-bold text-emerald-300 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-emerald-400" />
                    توصيات مخصصة من الذكاء الاصطناعي لتطوير ملفك
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-200">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <ButtonComponent
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.location.href = "/learning";
                    }
                  }}
                >
                  <BookOpen className="w-5 h-5 ml-1" />
                  <span>ابدأ مسار التعلم المخصص</span>
                </ButtonComponent>

                <ButtonComponent
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.location.href = "/skill-verification";
                    }
                  }}
                >
                  <ShieldCheck className="w-5 h-5 ml-1 text-emerald-400" />
                  <span>وثق مهاراتك بشهادة معتمدة</span>
                </ButtonComponent>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
              <p className="text-red-400 font-medium text-xs sm:text-sm mb-3">{error}</p>
              <button
                onClick={() => setError(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-300 hover:text-white underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                حاول مرة أخرى
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CVAnalysisLogicView;

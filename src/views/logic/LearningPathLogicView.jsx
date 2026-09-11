/**
 * @file LearningPathLogicView.jsx
 * @description Modern Figma presentation layer for the Personalized Learning Path connecting useLearningPath.
 * Features roadmap cards, step status badges, fast-track skill assessments, and progress metrics.
 */
import React from "react";
import { useLearningPath } from "../../hooks/useLearningPath";
import { ButtonLogic as Button } from "../../components/contracts/ButtonLogic";
import { CardLogic as Card } from "../../components/contracts/CardLogic";
import { ProgressBarLogic as ProgressBar } from "../../components/contracts/ProgressBarLogic";
import { BadgeLogic as Badge } from "../../components/contracts/BadgeLogic";
import { NavbarLogic as Navbar } from "../../components/contracts/NavbarLogic";
import { FooterLogic as Footer } from "../../components/contracts/FooterLogic";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ExternalLink,
  ArrowRight,
  AlertTriangle,
  Flame,
  FileText
} from "lucide-react";

export function LearningPathLogicView({
  CardComponent = Card,
  ButtonComponent = Button,
  ProgressBarComponent = ProgressBar,
  BadgeComponent = Badge
}) {
  const {
    learningPath,
    steps,
    overallProgress,
    isUpdatingStep,
    stepActionError,
    isLoading,
    isError,
    isEmpty,
    error,
    markStepStatus,
    triggerFastTrack,
    refetch
  } = useLearningPath();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between">
        <Navbar />
        <div id="learning-path-skeleton" className="container-custom py-24 flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-mono text-sm">جاري تحميل مسار التعلم المخصص...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Empty State: No CV analyzed yet ───
  if (isEmpty || !learningPath) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
        <Navbar />

        <main className="flex-1 container-custom py-16 flex items-center justify-center">
          <CardComponent id="learning-path-empty-cta" variant="elevated" className="max-w-xl text-center p-8 sm:p-12 border border-[#262c3d]">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-3">
              لم يتم إنشاء مسارك التعليمي المخصص بعد 📚
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              يقوم نظام الذكاء الاصطناعي بتحليل سيرتك الذاتية (CV) وتحديد المهارات الناقصة لتوليد مسار تدريبي مخصص يجهّزك لسوق العمل الحر.
            </p>

            <ButtonComponent
              id="btn-goto-cv-upload"
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "/cv-analysis";
                }
              }}
            >
              <FileText className="w-4 h-4 ml-1" />
              <span>ارفع سيرتك الذاتية (CV) لتوليد المسار</span>
            </ButtonComponent>
          </CardComponent>
        </main>

        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between">
        <Navbar />
        <div id="learning-path-error" className="container-custom py-20 flex-1 text-center max-w-md mx-auto">
          <CardComponent variant="surface" className="p-8">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-400 text-sm mb-6">{error || "حدث خطأ أثناء تحميل المسار التعليمي."}</p>
            <ButtonComponent variant="primary" size="sm" onClick={refetch}>
              إعادة المحاولة
            </ButtonComponent>
          </CardComponent>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div id="learning-path-container" className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-4xl space-y-8">
          {/* Header Card */}
          <CardComponent id="learning-path-header" variant="glow" className="p-8 border border-emerald-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مسار مخصص بالذكاء الاصطناعي</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  {learningPath.title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  الهدف الوظيفي المنشود: <strong className="text-emerald-400">{learningPath.targetRole}</strong>
                </p>
              </div>

              <div className="text-center sm:text-left">
                <span className="text-3xl font-extrabold font-mono text-emerald-400">
                  {overallProgress}%
                </span>
                <span className="text-[11px] text-gray-400 block">نسبة الإنجاز</span>
              </div>
            </div>

            <ProgressBarComponent
              value={overallProgress}
              color="gradient"
              size="lg"
              showPercentage={false}
            />
          </CardComponent>

          {/* Action error notification if any */}
          {stepActionError && (
            <div id="step-action-error-alert" role="alert" className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{stepActionError}</span>
            </div>
          )}

          {/* ─── Steps Roadmap List ─── */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              مراحل المسار والمهارات المطلوبة ({steps.length} مراحل)
            </h3>

            <div id="learning-steps-list" className="space-y-4">
              {steps.map((step, index) => {
                const isCompleted = step.status === "completed";
                const isInProgress = step.status === "in_progress";

                return (
                  <CardComponent
                    key={step.id}
                    id={`step-card-${step.id}`}
                    variant={isCompleted ? "surface" : isInProgress ? "glow" : "default"}
                    className={`p-6 border transition-all ${
                      isCompleted
                        ? "border-emerald-500/30 bg-[#13161e]"
                        : isInProgress
                        ? "border-blue-500/50 bg-[#151923]"
                        : "border-[#222634] opacity-80"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-gray-300">
                          {index + 1}
                        </span>
                        <h4 className="text-base font-bold text-white">{step.title}</h4>
                      </div>

                      <BadgeComponent
                        type={isCompleted ? "verified_student" : isInProgress ? "skill" : "default"}
                        label={isCompleted ? "مكتملة ✅" : isInProgress ? "قيد التنفيذ ⏳" : "لم تبدأ"}
                      />
                    </div>

                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#1e2330]">
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          <span>المدة المقدرة: {step.estimatedMinutes} دقيقة</span>
                        </span>

                        {step.resourceUrl && (
                          <a
                            href={step.resourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
                          >
                            <span>فتح المادة التعليمية</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Step Actions */}
                      {!isCompleted && (
                        <div id="step-actions" className="flex items-center gap-2.5">
                          <ButtonComponent
                            id={`btn-complete-${step.id}`}
                            variant="primary"
                            size="sm"
                            onClick={() => markStepStatus(step.id, "completed")}
                            isLoading={isUpdatingStep}
                            disabled={isUpdatingStep}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                            <span>تحديد كمكتمل</span>
                          </ButtonComponent>

                          <ButtonComponent
                            id={`btn-fast-track-${step.id}`}
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const res = await triggerFastTrack(step.id);
                              if (res?.quizUrl && typeof window !== "undefined") {
                                window.location.href = res.quizUrl;
                              }
                            }}
                          >
                            <Zap className="w-3.5 h-3.5 ml-1 text-amber-400" />
                            <span>تقييم سريع فوري</span>
                          </ButtonComponent>
                        </div>
                      )}
                    </div>
                  </CardComponent>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LearningPathLogicView;

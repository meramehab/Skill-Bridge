/**
 * @file LearningPathLogicView.jsx
 * @description Logic wiring for Personalized Learning Path, progress tracking, and fast-track assessments.
 */
import React from "react";
import { useLearningPath } from "../../hooks/useLearningPath";

export function LearningPathLogicView({
  Card = (p) => <div {...p} />,
  Button = (p) => <button {...p} />,
  ProgressBar = (p) => <div {...p} />,
  Badge = (p) => <span {...p} />,
  Skeleton = () => <div>Loading...</div>
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

  if (isLoading) return <Skeleton id="learning-path-skeleton" />;

  // Empty State: No CV analyzed yet
  if (isEmpty || !learningPath) {
    return (
      <Card id="learning-path-empty-cta">
        <h2>لم يتم إنشاء مسارك التعليمي المخصص بعد</h2>
        <p>
          يقوم نظام الذكاء الاصطناعي بتحليل الـ CV الخاص بك وتحديد المهارات الناقصة لتجهيزك لسوق العمل الحر.
        </p>
        <Button
          id="btn-goto-cv-upload"
          onClick={() => {
            window.location.href = "/profile/cv-analysis";
          }}
        >
          📄 ارفع سيرتك الذاتية (CV) لتوليد المسار
        </Button>
      </Card>
    );
  }

  if (isError) {
    return (
      <div id="learning-path-error">
        <p>{error || "حدث خطأ أثناء تحميل المسار التعليمي."}</p>
        <Button onClick={refetch}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div id="learning-path-container">
      {/* Path Header & Overall Progress */}
      <Card id="learning-path-header">
        <h1>{learningPath.title}</h1>
        <p>الهدف الوظيفي: <strong>{learningPath.targetRole}</strong></p>

        <div id="overall-progress-box">
          <ProgressBar
            value={overallProgress}
            label={`نسبة الإنجاز الكلية: ${overallProgress}%`}
          />
        </div>
      </Card>

      {stepActionError && (
        <div id="step-action-error-alert" role="alert">
          {stepActionError}
        </div>
      )}

      {/* Steps List */}
      <div id="learning-steps-list">
        <h3>مراحل المسار والمهارات المطلوبة</h3>

        {steps.map((step, index) => (
          <Card key={step.id} id={`step-card-${step.id}`}>
            <div id="step-header">
              <span>المرحلة {index + 1}</span>
              <Badge
                type={
                  step.status === "completed"
                    ? "verified_student"
                    : step.status === "in_progress"
                    ? "skill"
                    : "default"
                }
                label={
                  step.status === "completed"
                    ? "مكتملة ✅"
                    : step.status === "in_progress"
                    ? "قيد التنفيذ ⏳"
                    : "لم تبدأ بعد"
                }
              />
            </div>

            <h4>{step.title}</h4>
            <p>{step.description}</p>
            <p>المدة المقدرة: {step.estimatedMinutes} دقيقة</p>

            <div id="step-actions">
              <a href={step.resourceUrl} target="_blank" rel="noreferrer">
                📚 فتح المادة التعليمية
              </a>

              {step.status !== "completed" && (
                <>
                  <Button
                    id={`btn-complete-${step.id}`}
                    onClick={() => markStepStatus(step.id, "completed")}
                    disabled={isUpdatingStep}
                  >
                    تحديد كمكتمل
                  </Button>

                  <Button
                    id={`btn-fast-track-${step.id}`}
                    onClick={async () => {
                      const res = await triggerFastTrack(step.id);
                      if (res?.quizUrl) {
                        window.location.href = res.quizUrl;
                      }
                    }}
                  >
                    ⚡ لدي هذه المهارة بالفعل (تقييم فوري)
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default LearningPathLogicView;

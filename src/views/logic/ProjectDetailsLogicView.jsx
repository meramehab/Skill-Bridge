/**
 * @file ProjectDetailsLogicView.jsx
 * @description Logic wiring for Project Details page, AI risk breakdown, and proposal submission modal.
 */
import React, { useState } from "react";
import { useProjectDetails } from "../../hooks/useProjectDetails";
import { useSubmitProposal } from "../../hooks/useSubmitProposal";

export function ProjectDetailsLogicView({
  projectId = "proj_101",
  Card = (p) => <div {...p} />,
  Button = (p) => <button {...p} />,
  Modal = (p) => <div {...p} />,
  Badge = (p) => <span {...p} />,
  Skeleton = () => <div>Loading...</div>
}) {
  const {
    project,
    isLowCompatibility,
    isLoading,
    isError,
    isEmpty,
    error,
    refetch
  } = useProjectDetails(projectId);

  const [showLowMatchWarningModal, setShowLowMatchWarningModal] = useState(false);

  const proposalHook = useSubmitProposal(projectId, (result) => {
    alert("تم إرسال عرضك بنجاح!");
  });

  if (isLoading) return <Skeleton id="project-details-skeleton" />;
  if (isError || isEmpty || !project) {
    return (
      <div id="project-not-found">
        <p>{error || "المشروع المطلوب غير موجود."}</p>
        <Button onClick={refetch}>إعادة المحاولة</Button>
      </div>
    );
  }

  const handleApplyClick = () => {
    proposalHook.openModal();
  };

  const handleProposalSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const result = await proposalHook.handleSubmit(isLowCompatibility);
    if (result?.requiresConfirmation) {
      setShowLowMatchWarningModal(true);
    }
  };

  const confirmAndSubmitLowMatch = async () => {
    setShowLowMatchWarningModal(false);
    proposalHook.setIsLowMatchConfirmed(true);
    await proposalHook.handleSubmit(false);
  };

  return (
    <div id="project-details-container">
      {/* Project Overview */}
      <Card id="project-main-card">
        <Badge
          type={project.type === "micro_gig" ? "micro_gig" : "project"}
          label={project.type === "micro_gig" ? "Micro Gig" : "مشروع متكامل"}
        />
        <h1>{project.title}</h1>
        <p id="budget-badge">الميزانية: {project.budget} ج.م</p>
        <p id="deadline">الموعد النهائي: {project.deadline}</p>

        <h3>وصف المشروع والمتطلبات</h3>
        <p>{project.description}</p>

        <h3>المهارات المطلوبة</h3>
        <div id="skills-list">
          {project.requiredSkills?.map((skill) => (
            <Badge key={skill} type="skill" label={skill} />
          ))}
        </div>

        <Button id="btn-open-proposal-modal" onClick={handleApplyClick}>
          تقديم عرض على المشروع
        </Button>
      </Card>

      {/* AI Risk & Compatibility Assessment */}
      {project.aiRiskAnalysis && (
        <Card id="ai-risk-card">
          <h3>تحليل التوافق الذكي (AI Compatibility)</h3>
          <p>
            نسبة التوافق مع مهاراتك:{" "}
            <strong>{project.aiRiskAnalysis.compatibilityScore}%</strong>
          </p>
          <p>{project.aiRiskAnalysis.recommendation}</p>

          {isLowCompatibility && (
            <div id="compatibility-alert">
              ⚠️ تنبيه: نسبة التوافق أقل من 70%، قد تجد صعوبة في تلبية بعض متطلبات المشروع.
            </div>
          )}
        </Card>
      )}

      {/* Proposal Submission Modal */}
      {proposalHook.isOpen && (
        <Modal id="proposal-modal" isOpen={proposalHook.isOpen} onClose={proposalHook.closeModal}>
          <h2>تقديم عرض على: {project.title}</h2>

          {/* AI Proposal Generator Button */}
          <div id="ai-generator-section">
            <Button
              id="btn-ai-assist"
              type="button"
              onClick={proposalHook.generateAiProposal}
              disabled={proposalHook.isGeneratingAi}
            >
              {proposalHook.isGeneratingAi
                ? "جارٍ صياغة العرض بالذكاء الاصطناعي..."
                : "✨ توليد مسودة عرض مخصصة بالذكاء الاصطناعي"}
            </Button>
          </div>

          {proposalHook.submitError && (
            <div id="proposal-error" role="alert">
              {proposalHook.submitError}
            </div>
          )}

          <form onSubmit={handleProposalSubmit} id="proposal-form">
            <div>
              <label htmlFor="coverLetter">تفاصيل العرض وخطة العمل</label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows={5}
                value={proposalHook.formData.coverLetter}
                onChange={proposalHook.handleChange}
                onBlur={proposalHook.handleBlur}
                placeholder="اشرح للعميل كيف ستنفذ المشروع وما هي خبرتك السابقة..."
              />
              {proposalHook.touched.coverLetter && proposalHook.errors.coverLetter && (
                <span className="error">{proposalHook.errors.coverLetter}</span>
              )}
            </div>

            <div>
              <label htmlFor="bidAmount">الميزانية المقترحة (ج.م)</label>
              <input
                id="bidAmount"
                name="bidAmount"
                type="number"
                value={proposalHook.formData.bidAmount}
                onChange={proposalHook.handleChange}
                onBlur={proposalHook.handleBlur}
              />
              {proposalHook.touched.bidAmount && proposalHook.errors.bidAmount && (
                <span className="error">{proposalHook.errors.bidAmount}</span>
              )}
            </div>

            <div>
              <label htmlFor="estimatedDays">مدة التنفيذ (بالأيام)</label>
              <input
                id="estimatedDays"
                name="estimatedDays"
                type="number"
                value={proposalHook.formData.estimatedDays}
                onChange={proposalHook.handleChange}
                onBlur={proposalHook.handleBlur}
              />
              {proposalHook.touched.estimatedDays && proposalHook.errors.estimatedDays && (
                <span className="error">{proposalHook.errors.estimatedDays}</span>
              )}
            </div>

            <div id="modal-actions">
              <Button type="button" onClick={proposalHook.closeModal}>
                إلغاء
              </Button>
              <Button
                id="btn-submit-proposal"
                type="submit"
                disabled={proposalHook.isSubmitting}
              >
                {proposalHook.isSubmitting ? "جارٍ الإرسال..." : "إرسال العرض"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Low Compatibility Confirmation Modal */}
      {showLowMatchWarningModal && (
        <Modal
          id="low-match-warning-modal"
          isOpen={showLowMatchWarningModal}
          onClose={() => setShowLowMatchWarningModal(false)}
        >
          <h3>تأكيد تقديم العرض</h3>
          <p>
            نسبة توافق مهاراتك مع هذا المشروع ({project.aiRiskAnalysis.compatibilityScore}%) منخفضة.
            هل أنت واثق من رغبتك في التقديم؟
          </p>
          <Button onClick={() => setShowLowMatchWarningModal(false)}>تراجع</Button>
          <Button onClick={confirmAndSubmitLowMatch}>نعم، تأكيد التقديم</Button>
        </Modal>
      )}
    </div>
  );
}

export default ProjectDetailsLogicView;

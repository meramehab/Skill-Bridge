/**
 * @file ProjectDetailsLogicView.jsx
 * @description Modern Figma presentation layer for the Project Details page connecting useProjectDetails and useSubmitProposal.
 * Features AI compatibility score breakdown, proposal submission modal with AI assist generator, and low-match warning.
 */
import React, { useState } from "react";
import { useProjectDetails } from "../../hooks/useProjectDetails";
import { useSubmitProposal } from "../../hooks/useSubmitProposal";
import { ButtonLogic as Button } from "../../components/contracts/ButtonLogic";
import { CardLogic as Card } from "../../components/contracts/CardLogic";
import { ModalLogic as Modal } from "../../components/contracts/ModalLogic";
import { BadgeLogic as Badge } from "../../components/contracts/BadgeLogic";
import { NavbarLogic as Navbar } from "../../components/contracts/NavbarLogic";
import { FooterLogic as Footer } from "../../components/contracts/FooterLogic";
import {
  Briefcase,
  Clock,
  Coins,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Send,
  Calendar,
  FileText
} from "lucide-react";

export function ProjectDetailsLogicView({
  projectId = "proj_101",
  CardComponent = Card,
  ButtonComponent = Button,
  ModalComponent = Modal,
  BadgeComponent = Badge
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
    alert("تم إرسال عرضك بنجاح للعميل! سيتم إشعارك فور المراجعة.");
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between">
        <Navbar />
        <div id="project-details-skeleton" className="container-custom py-20 flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-mono text-sm">جاري تحميل تفاصيل المشروع والتحليل الذكي...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || isEmpty || !project) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between">
        <Navbar />
        <div id="project-not-found" className="container-custom py-20 flex-1 text-center max-w-md mx-auto">
          <CardComponent variant="surface" className="p-8">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">المشروع غير متوفر</h2>
            <p className="text-gray-400 text-sm mb-6">{error || "المشروع المطلوب غير موجود أو تم إغلاقه."}</p>
            <ButtonComponent variant="primary" size="sm" onClick={() => window.location.href = "/marketplace"}>
              العودة لسوق المشاريع
            </ButtonComponent>
          </CardComponent>
        </div>
        <Footer />
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
    <div id="project-details-container" className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-5xl">
          {/* Breadcrumb Back */}
          <div className="mb-6">
            <a
              href="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-emerald-400 transition"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لكل المشاريع</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ─── Main Column: Project Overview & Specs ─── */}
            <div className="lg:col-span-2 space-y-6">
              <CardComponent id="project-main-card" variant="elevated" className="p-8 border border-[#222634]">
                <div className="flex items-center gap-2 mb-4">
                  <BadgeComponent
                    type={project.type === "micro_gig" ? "micro_gig" : "project"}
                    label={project.type === "micro_gig" ? "Micro Gig" : "مشروع متكامل"}
                  />
                  {project.isFeatured && <BadgeComponent type="hot" label="مميز" />}
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-6 leading-snug">
                  {project.title}
                </h1>

                {/* Description */}
                <div className="space-y-3 mb-8">
                  <h3 className="text-base font-bold text-gray-200 border-b border-[#222634] pb-2">
                    وصف المشروع والمتطلبات
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </div>

                {/* Required Skills */}
                <div className="space-y-3 mb-8">
                  <h3 className="text-base font-bold text-gray-200 border-b border-[#222634] pb-2">
                    المهارات والتقنيات المطلوبة
                  </h3>
                  <div id="skills-list" className="flex flex-wrap gap-2">
                    {project.requiredSkills?.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-[#181b24] text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Primary CTA button */}
                <ButtonComponent
                  id="btn-open-proposal-modal"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleApplyClick}
                >
                  <Send className="w-4 h-4 ml-1" />
                  <span>تقديم عرض على هذا المشروع</span>
                </ButtonComponent>
              </CardComponent>
            </div>

            {/* ─── Sidebar: Budget, Deadline & AI Compatibility ─── */}
            <div className="space-y-6">
              {/* Project Meta Card */}
              <CardComponent variant="surface" className="p-6 border border-[#222634] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#222634]">
                  <span className="text-xs text-gray-400">الميزانية المرصودة:</span>
                  <span id="budget-badge" className="text-xl font-mono font-extrabold text-emerald-400">
                    {project.budget} ج.م
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#222634]">
                  <span className="text-xs text-gray-400">الموعد النهائي للتسليم:</span>
                  <span id="deadline" className="text-xs font-semibold text-white flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {project.deadline || "خلال 14 يوم"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">العميل / المؤسسة:</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    {project.clientName || "شركة النور للتقنية"}
                  </span>
                </div>
              </CardComponent>

              {/* AI Risk & Compatibility Assessment Card */}
              {project.aiRiskAnalysis && (
                <CardComponent
                  id="ai-risk-card"
                  variant="glow"
                  className={`p-6 border ${
                    isLowCompatibility ? "border-amber-500/40" : "border-emerald-500/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white font-title">
                      تحليل التوافق الذكي (AI Matching)
                    </h3>
                  </div>

                  <div className="bg-[#181b24] p-3.5 rounded-xl border border-[#2a2f3e] mb-4 text-center">
                    <span className="text-xs text-gray-400 block mb-1">نسبة التوافق مع بروفايلك:</span>
                    <span
                      className={`text-3xl font-extrabold font-mono ${
                        isLowCompatibility ? "text-amber-400" : "text-emerald-400"
                      }`}
                    >
                      {project.aiRiskAnalysis.compatibilityScore}%
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed mb-3">
                    {project.aiRiskAnalysis.recommendation}
                  </p>

                  {isLowCompatibility && (
                    <div id="compatibility-alert" className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>تنبيه: نسبة التوافق أقل من 70%، قد تحتاج لتعلم بعض التقنيات الإضافية لتنفيذ المتطلبات بالكامل.</span>
                    </div>
                  )}
                </CardComponent>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ─── Proposal Submission Modal ─── */}
      {proposalHook.isOpen && (
        <ModalComponent
          id="proposal-modal"
          isOpen={proposalHook.isOpen}
          onClose={proposalHook.closeModal}
          title={`تقديم عرض على: ${project.title}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* AI Proposal Generator Button */}
            <div id="ai-generator-section" className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/15 via-emerald-500/15 to-blue-600/15 border border-emerald-500/30 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-0.5">
                  <Sparkles className="w-4 h-4" />
                  مساعد الذكاء الاصطناعي لكتابة العروض
                </p>
                <p className="text-[11px] text-gray-400">
                  يقوم الذكاء الاصطناعي بصياغة عرض مقنع يبرز نقاط قوتك التقنية المناسبة للمشروع.
                </p>
              </div>
              <ButtonComponent
                id="btn-ai-assist"
                type="button"
                variant="outline"
                size="sm"
                onClick={proposalHook.generateAiProposal}
                isLoading={proposalHook.isGeneratingAi}
                disabled={proposalHook.isGeneratingAi}
                className="shrink-0"
              >
                {proposalHook.isGeneratingAi ? "جارٍ الصياغة..." : "✨ توليد مسودة العرض"}
              </ButtonComponent>
            </div>

            {proposalHook.submitError && (
              <div id="proposal-error" role="alert" className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {proposalHook.submitError}
              </div>
            )}

            <form onSubmit={handleProposalSubmit} id="proposal-form" className="space-y-4">
              {/* Cover Letter */}
              <div className="space-y-1.5">
                <label htmlFor="coverLetter" className="block text-xs font-bold text-gray-300">
                  تفاصيل العرض وخطة العمل المقترحة
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={5}
                  value={proposalHook.formData.coverLetter}
                  onChange={proposalHook.handleChange}
                  onBlur={proposalHook.handleBlur}
                  placeholder="اشرح للعميل كيف ستنفذ متطلبات المشروع، والتقنيات المستخدمة، وما هي خبرتك السابقة في هذا المجال..."
                  className={`w-full bg-[#181b24] border text-sm rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none transition ${
                    proposalHook.touched.coverLetter && proposalHook.errors.coverLetter
                      ? "border-red-500"
                      : "border-[#2a2f3e] focus:border-emerald-500"
                  }`}
                />
                {proposalHook.touched.coverLetter && proposalHook.errors.coverLetter && (
                  <span className="text-[11px] text-red-400 block">{proposalHook.errors.coverLetter}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bid Amount */}
                <div className="space-y-1.5">
                  <label htmlFor="bidAmount" className="block text-xs font-bold text-gray-300">
                    الميزانية المقترحة (ج.م)
                  </label>
                  <input
                    id="bidAmount"
                    name="bidAmount"
                    type="number"
                    value={proposalHook.formData.bidAmount}
                    onChange={proposalHook.handleChange}
                    onBlur={proposalHook.handleBlur}
                    placeholder={project.budget}
                    className="w-full bg-[#181b24] border border-[#2a2f3e] focus:border-emerald-500 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none"
                  />
                  {proposalHook.touched.bidAmount && proposalHook.errors.bidAmount && (
                    <span className="text-[11px] text-red-400 block">{proposalHook.errors.bidAmount}</span>
                  )}
                </div>

                {/* Estimated Days */}
                <div className="space-y-1.5">
                  <label htmlFor="estimatedDays" className="block text-xs font-bold text-gray-300">
                    مدة التنفيذ المقترحة (بالأيام)
                  </label>
                  <input
                    id="estimatedDays"
                    name="estimatedDays"
                    type="number"
                    value={proposalHook.formData.estimatedDays}
                    onChange={proposalHook.handleChange}
                    onBlur={proposalHook.handleBlur}
                    placeholder="7"
                    className="w-full bg-[#181b24] border border-[#2a2f3e] focus:border-emerald-500 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none"
                  />
                  {proposalHook.touched.estimatedDays && proposalHook.errors.estimatedDays && (
                    <span className="text-[11px] text-red-400 block">{proposalHook.errors.estimatedDays}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div id="modal-actions" className="flex items-center justify-end gap-3 pt-4 border-t border-[#222634]">
                <ButtonComponent type="button" variant="ghost" size="md" onClick={proposalHook.closeModal}>
                  إلغاء
                </ButtonComponent>
                <ButtonComponent
                  id="btn-submit-proposal"
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={proposalHook.isSubmitting}
                  disabled={proposalHook.isSubmitting}
                >
                  {proposalHook.isSubmitting ? "جارٍ الإرسال..." : "إرسال العرض الآن"}
                </ButtonComponent>
              </div>
            </form>
          </div>
        </ModalComponent>
      )}

      {/* ─── Low Compatibility Confirmation Modal ─── */}
      {showLowMatchWarningModal && (
        <ModalComponent
          id="low-match-warning-modal"
          isOpen={showLowMatchWarningModal}
          onClose={() => setShowLowMatchWarningModal(false)}
          title="تأكيد تقديم العرض (تنبيه التوافق)"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              نسبة توافق مهاراتك مع متطلبات هذا المشروع (
              <strong className="text-amber-400">{project.aiRiskAnalysis?.compatibilityScore}%</strong>
              ) أقل من الحد الموصى به. هل أنت متأكد من قدرتك على تلبية جميع المتطلبات وتسليم المشروع في الموعد؟
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222634]">
              <ButtonComponent variant="secondary" size="sm" onClick={() => setShowLowMatchWarningModal(false)}>
                تراجع
              </ButtonComponent>
              <ButtonComponent variant="primary" size="sm" onClick={confirmAndSubmitLowMatch}>
                نعم، تأكيد التقديم
              </ButtonComponent>
            </div>
          </div>
        </ModalComponent>
      )}

      <Footer />
    </div>
  );
}

export default ProjectDetailsLogicView;

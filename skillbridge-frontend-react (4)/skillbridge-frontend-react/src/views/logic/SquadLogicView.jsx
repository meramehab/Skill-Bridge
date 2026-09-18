/**
 * @file SquadLogicView.jsx
 * @description Modern Figma presentation layer for the Squad System connecting useMySquad, useOpenSquads, and useSquadActions.
 * Features squad roster cards, leadership panel with AI member match suggestions, open squads directory, and squad builder.
 */
import React, { useState, useEffect } from "react";
import { useMySquad } from "../../hooks/useMySquad";
import { useOpenSquads } from "../../hooks/useOpenSquads";
import { useSquadActions } from "../../hooks/useSquadActions";
import { ButtonLogic as Button } from "../../components/contracts/ButtonLogic";
import { CardLogic as Card } from "../../components/contracts/CardLogic";
import { BadgeLogic as Badge } from "../../components/contracts/BadgeLogic";
import { NavbarLogic as Navbar } from "../../components/contracts/NavbarLogic";
import { FooterLogic as Footer } from "../../components/contracts/FooterLogic";
import {
  Users,
  Shield,
  Sparkles,
  Plus,
  Crown,
  Search,
  CheckCircle2,
  XCircle,
  Briefcase,
  Trophy,
  ArrowRight,
  UserPlus
} from "lucide-react";

export function SquadLogicView({
  CardComponent = Card,
  ButtonComponent = Button,
  BadgeComponent = Badge
}) {
  const { squad, hasSquad, isSquadLeader, isLoading: isLoadingMySquad, refetch: refetchMySquad } = useMySquad();
  const { squads: openSquads, skillFilter, setSkillFilter, isLoading: isLoadingOpenSquads } = useOpenSquads();
  const squadActions = useSquadActions(squad?.id);

  const [showCreateModal, setShowCreateModal] = useState(false);

  // If leader, load join requests on mount
  useEffect(() => {
    if (isSquadLeader && squad?.id) {
      squadActions.fetchJoinRequests(squad.id);
    }
  }, [isSquadLeader, squad?.id, squadActions]);

  if (isLoadingMySquad) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between">
        <Navbar />
        <div id="squad-skeleton" className="container-custom py-24 flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-mono text-sm">جاري تحميل بيانات الفريق...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // ----------------------------------------------------
  // CASE 1: User is already member or leader of a Squad
  // ----------------------------------------------------
  if (hasSquad && squad) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
        <Navbar />

        <main className="flex-1 py-12">
          <div id="my-squad-container" className="container-custom max-w-5xl space-y-8">
            {/* Squad Banner Header */}
            <CardComponent id="my-squad-header" variant="glow" className="p-8 border border-emerald-500/30 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                        {squad.name}
                      </h1>
                      <BadgeComponent type="level_pro" label={squad.isVerified ? "فريق موثق" : "فريق نشط"} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{squad.description}</p>
                  </div>
                </div>

                {/* Score & Completed Gigs */}
                <div className="flex items-center gap-3">
                  <div className="bg-[#181b24] px-4 py-2 rounded-xl border border-[#262c3d] text-center">
                    <span className="text-[10px] text-gray-400 block font-medium">نقاط الفريق (XP)</span>
                    <span className="text-lg font-bold font-mono text-amber-400">{squad.squadScore}</span>
                  </div>
                  <div className="bg-[#181b24] px-4 py-2 rounded-xl border border-[#262c3d] text-center">
                    <span className="text-[10px] text-gray-400 block font-medium">مشاريع مكتملة</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">{squad.totalCompletedProjects}</span>
                  </div>
                </div>
              </div>
            </CardComponent>

            {/* Squad Members Roster */}
            <CardComponent id="squad-members-card" variant="surface" className="p-6 border border-[#222634]">
              <h3 className="text-base font-bold text-white mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  أعضاء الفريق ({squad.members.length} / {squad.maxMembers})
                </span>
                <span className="text-xs text-gray-400 font-mono">الحد الأقصى {squad.maxMembers} طلاب</span>
              </h3>

              <div id="members-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {squad.members.map((member) => (
                  <div
                    key={member.id}
                    id={`member-${member.id}`}
                    className="bg-[#13161e] border border-[#262c3d] rounded-2xl p-4 text-center hover:border-emerald-500/40 transition"
                  >
                    <div className="relative w-14 h-14 rounded-full mx-auto mb-3 overflow-hidden ring-2 ring-emerald-500/30 p-0.5 bg-[#181b24]">
                      <img
                        src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <strong className="font-bold text-white text-sm block mb-0.5">{member.name}</strong>
                    <span className="text-[11px] text-gray-400 block mb-2">{member.university}</span>
                    {member.id === squad.leaderId && (
                      <BadgeComponent type="skill" label="قائد الفريق 👑" size="sm" />
                    )}
                  </div>
                ))}
              </div>
            </CardComponent>

            {/* Squad Leader Management Panel */}
            {isSquadLeader && (
              <CardComponent id="leader-panel-card" variant="elevated" className="p-6 sm:p-8 border border-amber-500/30 space-y-6">
                <div className="flex items-center gap-2 border-b border-[#222634] pb-4">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">لوحة تحكم قائد الفريق</h3>
                </div>

                {/* Join requests list */}
                <div>
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
                    طلبات الانضمام المعلقة ({squadActions.joinRequests.length})
                  </h4>

                  {squadActions.joinRequests.length === 0 ? (
                    <p className="text-xs text-gray-500 bg-[#181b24] p-4 rounded-xl text-center">
                      لا توجد طلبات انضمام معلقة حالياً ✨
                    </p>
                  ) : (
                    <div id="join-requests-list" className="space-y-3">
                      {squadActions.joinRequests.map((req) => (
                        <div
                          key={req.id}
                          id={`req-${req.id}`}
                          className="bg-[#181b24] border border-[#2a2f3e] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <p className="text-sm font-bold text-white">{req.student.name} ({req.student.university})</p>
                            <p className="text-xs text-gray-400 mt-0.5">{req.message}</p>
                          </div>
                          <div className="flex gap-2">
                            <ButtonComponent
                              size="sm"
                              variant="primary"
                              onClick={() => squadActions.handleModerateRequest(req.id, "accept")}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                              قبول
                            </ButtonComponent>
                            <ButtonComponent
                              size="sm"
                              variant="danger"
                              onClick={() => squadActions.handleModerateRequest(req.id, "reject")}
                            >
                              <XCircle className="w-3.5 h-3.5 ml-1" />
                              رفض
                            </ButtonComponent>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Candidate Suggestions */}
                <div id="ai-candidate-matching" className="pt-4 border-t border-[#222634]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        اقتراح أعضاء مناسبين بالذكاء الاصطناعي
                      </h4>
                      <p className="text-xs text-gray-400">
                        يقوم الذكاء الاصطناعي بالبحث عن طلاب يمتلكون المهارات الناقصة في فريقك.
                      </p>
                    </div>
                    <ButtonComponent
                      id="btn-fetch-ai-candidates"
                      variant="outline"
                      size="sm"
                      onClick={() => squadActions.fetchAiRecommendations(squad.id)}
                      isLoading={squadActions.isLoadingAiCandidates}
                      disabled={squadActions.isLoadingAiCandidates}
                    >
                      {squadActions.isLoadingAiCandidates ? "جارٍ البحث..." : "✨ ابحث عن أعضاء مقترحين"}
                    </ButtonComponent>
                  </div>

                  {squadActions.aiCandidates.length > 0 && (
                    <div id="ai-candidates-list" className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                      {squadActions.aiCandidates.map((c) => (
                        <div
                          key={c.studentId}
                          id={`ai-candidate-${c.studentId}`}
                          className="bg-[#13161e] border border-[#262c3d] rounded-2xl p-4 flex flex-col justify-between"
                        >
                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-white text-sm">{c.name}</span>
                              <span className="text-xs font-mono font-bold text-emerald-400">{c.compatibilityScore}% توافق</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">{c.reason}</p>
                          </div>
                          <ButtonComponent
                            size="sm"
                            variant="primary"
                            onClick={() => alert(`تم إرسال دعوة للانضمام للطالب ${c.name}`)}
                          >
                            <UserPlus className="w-3.5 h-3.5 ml-1" />
                            دعوة للانضمام
                          </ButtonComponent>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardComponent>
            )}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ----------------------------------------------------
  // CASE 2: User is NOT in a Squad (Browse & Create)
  // ----------------------------------------------------
  return (
    <div id="squad-discovery-container" className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-5xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>العمل الجماعي وفرق المشاريع</span>
              </div>
              <h1 className="text-3xl font-display font-extrabold text-white">
                فرق العمل الطلابية (Squads)
              </h1>
              <p className="text-gray-400 text-sm">
                انضم لفريق دائم أو شكّل فريقك الخاص للمنافسة على المشاريع الكبيرة وتوزيع المهام.
              </p>
            </div>

            <ButtonComponent
              id="btn-open-create-squad"
              variant="primary"
              size="md"
              onClick={() => setShowCreateModal((prev) => !prev)}
            >
              <Plus className="w-4 h-4 ml-1" />
              <span>{showCreateModal ? "إلغاء التأسيس" : "تأسيس فريق جديد"}</span>
            </ButtonComponent>
          </div>

          {/* Create Squad Inline Card */}
          {showCreateModal && (
            <CardComponent id="create-squad-card" variant="elevated" className="p-6 sm:p-8 border border-emerald-500/40 animate-fadeIn space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                تأسيس فريق عمل جديد
              </h3>

              {squadActions.createErrors.general && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {squadActions.createErrors.general}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label htmlFor="squad-name" className="block text-xs font-bold text-gray-300 mb-1">
                    اسم الفريق
                  </label>
                  <input
                    id="squad-name"
                    name="name"
                    value={squadActions.createFormData.name}
                    onChange={squadActions.handleCreateChange}
                    placeholder="مثال: رواد حاسبات القاهرة"
                    className="w-full bg-[#181b24] border border-[#2a2f3e] focus:border-emerald-500 text-sm rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none"
                  />
                  {squadActions.isCheckingName && <span className="text-[11px] text-gray-400 block mt-1">جارٍ فحص توفر الاسم...</span>}
                  {squadActions.createErrors.name && <span className="text-[11px] text-red-400 block mt-1">{squadActions.createErrors.name}</span>}
                </div>

                <div>
                  <label htmlFor="squad-desc" className="block text-xs font-bold text-gray-300 mb-1">
                    الهدف والوصف التعريفي
                  </label>
                  <textarea
                    id="squad-desc"
                    name="description"
                    value={squadActions.createFormData.description}
                    onChange={squadActions.handleCreateChange}
                    rows={3}
                    placeholder="اشرح مجال تخصص الفريق، المشاريع المستهدفة، والمهارات التي تبحثون عنها..."
                    className="w-full bg-[#181b24] border border-[#2a2f3e] focus:border-emerald-500 text-sm rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none"
                  />
                  {squadActions.createErrors.description && (
                    <span className="text-[11px] text-red-400 block mt-1">{squadActions.createErrors.description}</span>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <ButtonComponent
                    id="btn-submit-create-squad"
                    variant="primary"
                    size="md"
                    onClick={() =>
                      squadActions.handleCreateSquad(() => {
                        setShowCreateModal(false);
                        refetchMySquad();
                      })
                    }
                    isLoading={squadActions.isSubmittingCreate}
                    disabled={squadActions.isSubmittingCreate}
                  >
                    {squadActions.isSubmittingCreate ? "جارٍ الإنشاء..." : "إنشاء الفريق والبدء"}
                  </ButtonComponent>
                </div>
              </div>
            </CardComponent>
          )}

          {/* Open Squads Directory */}
          <section id="open-squads-section" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                الفرق المفتوحة للانضمام ({openSquads.length})
              </h3>

              <div className="relative w-full sm:w-72">
                <input
                  id="filter-squad-skill"
                  placeholder="تصفية بالمهارة (UI/UX, Python...)"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full bg-[#13161e] border border-[#262c3d] text-xs rounded-xl px-4 py-2.5 pr-9 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {isLoadingOpenSquads ? (
              <div id="open-squads-skeleton" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-[#13161e] border border-[#222634] rounded-2xl p-6 animate-pulse space-y-4">
                    <div className="h-5 bg-white/10 rounded w-1/2" />
                    <div className="h-12 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div id="open-squads-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {openSquads.map((openSquad) => (
                  <CardComponent
                    key={openSquad.id}
                    id={`open-squad-${openSquad.id}`}
                    variant="surface"
                    className="p-6 border border-[#262c3d] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white text-base">{openSquad.name}</h4>
                        <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-md">
                          {openSquad.members?.length || 1}/{openSquad.maxMembers || 5}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                        {openSquad.description}
                      </p>

                      <div className="space-y-1.5 mb-6">
                        <span className="text-[11px] text-gray-500 block font-semibold">مهارات مطلوبة:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {openSquad.neededSkills?.map((sk) => (
                            <BadgeComponent key={sk} type="skill" label={sk} size="sm" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <ButtonComponent
                      id={`btn-apply-squad-${openSquad.id}`}
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => squadActions.handleApplyToSquad(openSquad.id, "أرغب في الانضمام لفريقكم.")}
                    >
                      <span>تقديم طلب انضمام</span>
                      <ArrowRight className="w-3.5 h-3.5 mr-1" />
                    </ButtonComponent>
                  </CardComponent>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SquadLogicView;

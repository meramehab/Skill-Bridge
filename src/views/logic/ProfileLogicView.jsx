/**
 * @file ProfileLogicView.jsx
 * @description Modern Figma presentation layer for the Profile page connecting useProfile and useUpdateProfile.
 * Features student avatar header, career readiness breakdown, verified skills chips, and interactive portfolio grid.
 */
import React, { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { ButtonLogic as Button } from "../../components/contracts/ButtonLogic";
import { CardLogic as Card } from "../../components/contracts/CardLogic";
import { BadgeLogic as Badge } from "../../components/contracts/BadgeLogic";
import { ProgressBarLogic as ProgressBar } from "../../components/contracts/ProgressBarLogic";
import { NavbarLogic as Navbar } from "../../components/contracts/NavbarLogic";
import { FooterLogic as Footer } from "../../components/contracts/FooterLogic";
import {
  User,
  GraduationCap,
  Sparkles,
  Award,
  Briefcase,
  ExternalLink,
  Edit3,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertTriangle,
  FolderKanban,
  FileCheck,
  TrendingUp,
  MessageSquare,
  UserPlus
} from "lucide-react";

export function ProfileLogicView({
  userId = null,
  CardComponent = Card,
  ButtonComponent = Button,
  BadgeComponent = Badge,
  ProgressBarComponent = ProgressBar
}) {
  const { profile, sections, isMyProfile, isLoading, isError, error, refetch } = useProfile(userId);
  const [isEditing, setIsEditing] = useState(false);

  const editHook = useUpdateProfile(profile || {}, () => {
    setIsEditing(false);
    refetch();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between">
        <Navbar />
        <div id="profile-skeleton" className="container-custom py-24 flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-mono text-sm">جاري تحميل الملف الشخصي...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between">
        <Navbar />
        <div id="profile-error-box" className="container-custom py-24 flex-1 text-center max-w-md mx-auto">
          <CardComponent variant="surface" className="p-8">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">خطأ في التحميل</h2>
            <p className="text-gray-400 text-sm mb-6">{error || "تعذر تحميل بيانات الملف الشخصي."}</p>
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
    <div id="profile-container" className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-5xl space-y-8">
          {/* ─── Profile Header Card ─── */}
          <CardComponent id="profile-header-card" variant="elevated" className="p-8 border border-[#222634] relative overflow-hidden">
            {/* Ambient background decoration */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
              {/* Avatar + Upload */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-emerald-500/30 p-1 bg-[#181b24] shadow-xl">
                  <img
                    id="profile-avatar"
                    src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                {isMyProfile && (
                  <label
                    htmlFor="avatar-file-input"
                    className="absolute bottom-1 left-1 p-2 rounded-xl bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600 shadow-md transition"
                    title="تغيير الصورة الشخصية"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      id="avatar-file-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => editHook.handleUploadAvatar(e.target.files[0])}
                      disabled={editHook.isUploadingAvatar}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Bio & Details */}
              <div className="flex-1 text-center sm:text-right space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2.5">
                      <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                        {profile.name}
                      </h1>
                      <BadgeComponent type="verified_student" label="طالب موثق" />
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-400 font-semibold flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{profile.university} — {profile.faculty}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center sm:justify-end gap-2 pt-2 sm:pt-0">
                    {isMyProfile ? (
                      <ButtonComponent
                        id="btn-toggle-edit-profile"
                        variant={isEditing ? "ghost" : "secondary"}
                        size="sm"
                        onClick={() => setIsEditing((prev) => !prev)}
                      >
                        <Edit3 className="w-3.5 h-3.5 ml-1" />
                        <span>{isEditing ? "إلغاء التعديل" : "تعديل الملف"}</span>
                      </ButtonComponent>
                    ) : (
                      <div id="other-user-actions" className="flex gap-2">
                        <ButtonComponent id="btn-follow-user" variant="primary" size="sm">
                          <UserPlus className="w-3.5 h-3.5 ml-1" />
                          <span>متابعة الطالب</span>
                        </ButtonComponent>
                        <ButtonComponent id="btn-message-user" variant="secondary" size="sm">
                          <MessageSquare className="w-3.5 h-3.5 ml-1" />
                          <span>رسالة</span>
                        </ButtonComponent>
                      </div>
                    )}
                  </div>
                </div>

                <p id="bio-text" className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl pt-2">
                  {profile.bio || "طالب شغوف بتطوير الويب وحلول الذكاء الاصطناعي، أبحث عن مشاريع وتحديات تقنية لبناء خبرتي المهنية."}
                </p>
              </div>
            </div>
          </CardComponent>

          {/* ─── Edit Profile Form Card ─── */}
          {isEditing && (
            <CardComponent id="edit-profile-card" variant="surface" className="p-6 border border-emerald-500/30 animate-fadeIn space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                تعديل البيانات الشخصية
              </h3>

              {editHook.saveError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {editHook.saveError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label htmlFor="edit-name" className="block text-xs font-bold text-gray-300 mb-1">
                    الاسم
                  </label>
                  <input
                    id="edit-name"
                    name="name"
                    value={editHook.formData.name}
                    onChange={editHook.handleChange}
                    onBlur={editHook.handleBlur}
                    className="w-full bg-[#13161e] border border-[#2a2f3e] focus:border-emerald-500 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                  {editHook.touched.name && editHook.errors.name && (
                    <span className="text-[11px] text-red-400 block mt-1">{editHook.errors.name}</span>
                  )}
                </div>

                <div>
                  <label htmlFor="edit-bio" className="block text-xs font-bold text-gray-300 mb-1">
                    النبذة التعريفية (Bio)
                  </label>
                  <textarea
                    id="edit-bio"
                    name="bio"
                    rows={3}
                    value={editHook.formData.bio}
                    onChange={editHook.handleChange}
                    onBlur={editHook.handleBlur}
                    className="w-full bg-[#13161e] border border-[#2a2f3e] focus:border-emerald-500 text-xs rounded-xl p-3.5 text-white focus:outline-none"
                  />
                  {editHook.touched.bio && editHook.errors.bio && (
                    <span className="text-[11px] text-red-400 block mt-1">{editHook.errors.bio}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <ButtonComponent
                  id="btn-save-profile"
                  variant="primary"
                  size="sm"
                  onClick={editHook.handleSave}
                  isLoading={editHook.isSaving}
                  disabled={editHook.isSaving}
                >
                  {editHook.isSaving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
                </ButtonComponent>
              </div>
            </CardComponent>
          )}

          {/* ─── Career Readiness Score Breakdown ─── */}
          {sections?.readiness && (
            <CardComponent id="readiness-score-card" variant="glow" className="p-6 sm:p-8 border border-emerald-500/30">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    مؤشر الجاهزية لسوق العمل (Career Readiness Score)
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    المستوى الحالي: <strong className="text-emerald-400 font-bold">{sections.readiness.freelancingLevel}</strong>
                  </p>
                </div>
                <span className="text-3xl font-extrabold font-mono text-emerald-400">
                  {sections.readiness.score}%
                </span>
              </div>

              <ProgressBarComponent
                value={sections.readiness.score}
                color="gradient"
                size="lg"
                showPercentage={false}
                className="mb-8"
              />

              {sections.readiness.breakdown && (
                <div id="score-breakdown-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#181b24] p-4 rounded-2xl border border-[#262c3d] text-center">
                    <span className="text-[11px] text-gray-400 block mb-1">جودة الـ CV</span>
                    <strong className="text-lg font-mono text-white">{sections.readiness.breakdown.cvQuality}%</strong>
                  </div>
                  <div className="bg-[#181b24] p-4 rounded-2xl border border-[#262c3d] text-center">
                    <span className="text-[11px] text-gray-400 block mb-1">تقييم المهارات</span>
                    <strong className="text-lg font-mono text-white">{sections.readiness.breakdown.skillsAssessment}%</strong>
                  </div>
                  <div className="bg-[#181b24] p-4 rounded-2xl border border-[#262c3d] text-center">
                    <span className="text-[11px] text-gray-400 block mb-1">إنجاز المشاريع</span>
                    <strong className="text-lg font-mono text-white">{sections.readiness.breakdown.completedGigs}%</strong>
                  </div>
                  <div className="bg-[#181b24] p-4 rounded-2xl border border-[#262c3d] text-center">
                    <span className="text-[11px] text-gray-400 block mb-1">المشاركة المجتمعية</span>
                    <strong className="text-lg font-mono text-white">{sections.readiness.breakdown.communityEngagement}%</strong>
                  </div>
                </div>
              )}
            </CardComponent>
          )}

          {/* ─── Verified Skills Section ─── */}
          <CardComponent id="verified-skills-card" variant="surface" className="p-6 border border-[#222634]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                المهارات الموثقة (Verified Skills)
              </h3>
              <a href="/skill-verification" className="text-xs font-bold text-emerald-400 hover:underline">
                + توثيق مهارة جديدة
              </a>
            </div>

            <div id="skills-badge-list" className="flex flex-wrap gap-2.5">
              {sections?.verifiedSkills?.map((skill) => (
                <BadgeComponent key={skill} type="skill" label={skill} size="md" />
              ))}
            </div>
          </CardComponent>

          {/* ─── Portfolio Section ─── */}
          <CardComponent id="portfolio-card" variant="surface" className="p-6 border border-[#222634]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                معرض الأعمال والمشاريع المنجزة (Portfolio)
              </h3>
            </div>

            <div id="portfolio-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections?.portfolio?.map((item) => (
                <div
                  key={item.id}
                  id={`portfolio-item-${item.id}`}
                  className="bg-[#13161e] border border-[#262c3d] rounded-2xl p-5 hover:border-emerald-500/40 transition flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-white text-base mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed mb-4">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#1e2330] text-xs">
                    <a
                      href={item.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-400 font-bold hover:underline"
                    >
                      <span>عرض المشروع</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {isMyProfile && (
                      <button
                        type="button"
                        onClick={() => editHook.togglePortfolioVisibility(item.id)}
                        className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition"
                      >
                        {item.isVisible ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            <span>عام</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                            <span>مخفي</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardComponent>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProfileLogicView;

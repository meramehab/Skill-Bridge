/**
 * @file ProfileLogicView.jsx
 * @description Logic wiring for Profile page, separate section states, editable mode, and portfolio management.
 */
import React, { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";

export function ProfileLogicView({
  userId = null,
  Card = (p) => <div {...p} />,
  Button = (p) => <button {...p} />,
  Badge = (p) => <span {...p} />,
  ProgressBar = (p) => <div {...p} />,
  Skeleton = () => <div>Loading...</div>
}) {
  const { profile, sections, isMyProfile, isLoading, isError, error, refetch } = useProfile(userId);
  const [isEditing, setIsEditing] = useState(false);

  const editHook = useUpdateProfile(profile || {}, () => {
    setIsEditing(false);
    refetch();
  });

  if (isLoading) return <Skeleton id="profile-skeleton" />;
  if (isError || !profile) {
    return (
      <div id="profile-error-box">
        <p>{error || "تعذر تحميل بيانات الملف الشخصي."}</p>
        <Button onClick={refetch}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div id="profile-container">
      {/* Profile Header & Personal Info Section */}
      <Card id="profile-header-card">
        <img src={profile.avatar || "/avatar-placeholder.png"} alt={profile.name} id="profile-avatar" />
        
        {isMyProfile && (
          <input
            id="avatar-file-input"
            type="file"
            accept="image/*"
            onChange={(e) => editHook.handleUploadAvatar(e.target.files[0])}
            disabled={editHook.isUploadingAvatar}
          />
        )}

        <h1>{profile.name}</h1>
        <p>{profile.university} — {profile.faculty}</p>
        <p id="bio-text">{profile.bio}</p>

        {isMyProfile ? (
          <Button id="btn-toggle-edit-profile" onClick={() => setIsEditing((prev) => !prev)}>
            {isEditing ? "إلغاء التعديل" : "تعديل الملف الشخصي"}
          </Button>
        ) : (
          <div id="other-user-actions">
            <Button id="btn-follow-user">متابعة الطالب</Button>
            <Button id="btn-message-user">إرسال رسالة</Button>
          </div>
        )}
      </Card>

      {/* Edit Profile Form Mode */}
      {isEditing && (
        <Card id="edit-profile-card">
          <h3>تعديل البيانات الشخصية</h3>
          {editHook.saveError && <div className="error">{editHook.saveError}</div>}

          <div>
            <label htmlFor="edit-name">الاسم</label>
            <input
              id="edit-name"
              name="name"
              value={editHook.formData.name}
              onChange={editHook.handleChange}
              onBlur={editHook.handleBlur}
            />
            {editHook.touched.name && editHook.errors.name && <span className="error">{editHook.errors.name}</span>}
          </div>

          <div>
            <label htmlFor="edit-bio">النبذة التعريفية (Bio)</label>
            <textarea
              id="edit-bio"
              name="bio"
              rows={3}
              value={editHook.formData.bio}
              onChange={editHook.handleChange}
              onBlur={editHook.handleBlur}
            />
            {editHook.touched.bio && editHook.errors.bio && <span className="error">{editHook.errors.bio}</span>}
          </div>

          <Button id="btn-save-profile" onClick={editHook.handleSave} disabled={editHook.isSaving}>
            {editHook.isSaving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
          </Button>
        </Card>
      )}

      {/* Career Readiness Score Breakdown */}
      {sections?.readiness && (
        <Card id="readiness-score-card">
          <h3>مؤشر الجاهزية لسوق العمل (Career Readiness Score)</h3>
          <ProgressBar
            value={sections.readiness.score}
            label={`${sections.readiness.score}% — المستوى: ${sections.readiness.freelancingLevel}`}
          />
          {sections.readiness.breakdown && (
            <div id="score-breakdown-grid">
              <div>جودة الـ CV: {sections.readiness.breakdown.cvQuality}%</div>
              <div>تقييم المهارات: {sections.readiness.breakdown.skillsAssessment}%</div>
              <div>إنجاز المشاريع: {sections.readiness.breakdown.completedGigs}%</div>
              <div>المشاركة المجتمعية: {sections.readiness.breakdown.communityEngagement}%</div>
            </div>
          )}
        </Card>
      )}

      {/* Verified Skills Section */}
      <Card id="verified-skills-card">
        <h3>المهارات الموثقة (Verified Skills)</h3>
        <div id="skills-badge-list">
          {sections?.verifiedSkills?.map((skill) => (
            <Badge key={skill} type="skill" label={skill} />
          ))}
        </div>
      </Card>

      {/* Portfolio Section */}
      <Card id="portfolio-card">
        <h3>معرض الأعمال (Portfolio)</h3>
        <div id="portfolio-grid">
          {sections?.portfolio?.map((item) => (
            <div key={item.id} id={`portfolio-item-${item.id}`}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <a href={item.projectUrl} target="_blank" rel="noreferrer">
                عرض المشروع ↗
              </a>
              {isMyProfile && (
                <button
                  type="button"
                  onClick={() => editHook.togglePortfolioVisibility(item.id)}
                >
                  {item.isVisible ? "إخفاء من الملف العام" : "إظهار في الملف العام"}
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default ProfileLogicView;

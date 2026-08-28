/**
 * @file SquadLogicView.jsx
 * @description Logic wiring for Squad System (Permanent Teams, Matchmaking, AI Member Recommendations).
 */
import React, { useState, useEffect } from "react";
import { useMySquad } from "../../hooks/useMySquad";
import { useOpenSquads } from "../../hooks/useOpenSquads";
import { useSquadActions } from "../../hooks/useSquadActions";

export function SquadLogicView({
  Card = (p) => <div {...p} />,
  Button = (p) => <button {...p} />,
  Input = (p) => <input {...p} />,
  Badge = (p) => <span {...p} />,
  Skeleton = () => <div>Loading...</div>
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

  if (isLoadingMySquad) return <Skeleton id="squad-skeleton" />;

  // ----------------------------------------------------
  // CASE 1: User is already member or leader of a Squad
  // ----------------------------------------------------
  if (hasSquad && squad) {
    return (
      <div id="my-squad-container">
        <Card id="my-squad-header">
          <Badge type="level_pro" label={squad.isVerified ? "فريق موثق" : "فريق نشط"} />
          <h1>{squad.name}</h1>
          <p>{squad.description}</p>
          <p>نقاط الفريق (XP): <strong>{squad.squadScore}</strong> | مشاريع مكتملة: <strong>{squad.totalCompletedProjects}</strong></p>
        </Card>

        {/* Squad Members */}
        <Card id="squad-members-card">
          <h3>أعضاء الفريق ({squad.members.length} / {squad.maxMembers})</h3>
          <div id="members-grid">
            {squad.members.map((member) => (
              <div key={member.id} id={`member-${member.id}`}>
                <img src={member.avatar || "/avatar-placeholder.png"} alt={member.name} />
                <strong>{member.name}</strong>
                <span>{member.university}</span>
                {member.id === squad.leaderId && <Badge type="skill" label="قائد الفريق" />}
              </div>
            ))}
          </div>
        </Card>

        {/* Squad Leader Management Panel */}
        {isSquadLeader && (
          <Card id="leader-panel-card">
            <h3>إدارة طلبات الانضمام للفريق</h3>

            {squadActions.joinRequests.length === 0 ? (
              <p>لا توجد طلبات انضمام معلقة حالياً.</p>
            ) : (
              <div id="join-requests-list">
                {squadActions.joinRequests.map((req) => (
                  <div key={req.id} id={`req-${req.id}`}>
                    <p><strong>{req.student.name}</strong> ({req.student.university})</p>
                    <p>رسالة المتقدم: {req.message}</p>
                    <Button onClick={() => squadActions.handleModerateRequest(req.id, "accept")}>قبول</Button>
                    <Button onClick={() => squadActions.handleModerateRequest(req.id, "reject")}>رفض</Button>
                  </div>
                ))}
              </div>
            )}

            {/* AI Candidate Suggestions */}
            <div id="ai-candidate-matching">
              <Button
                id="btn-fetch-ai-candidates"
                onClick={() => squadActions.fetchAiRecommendations(squad.id)}
                disabled={squadActions.isLoadingAiCandidates}
              >
                {squadActions.isLoadingAiCandidates ? "جارٍ البحث بالذكاء الاصطناعي..." : "✨ اقترح لي أعضاء مناسبين للفريق"}
              </Button>

              {squadActions.aiCandidates.length > 0 && (
                <div id="ai-candidates-list">
                  {squadActions.aiCandidates.map((c) => (
                    <Card key={c.studentId} id={`ai-candidate-${c.studentId}`}>
                      <h4>{c.name} — توافق {c.compatibilityScore}%</h4>
                      <p>{c.reason}</p>
                      <Button onClick={() => alert(`تم إرسال دعوة للطالب ${c.name}`)}>دعوة للانضمام</Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // CASE 2: User is NOT in a Squad (Browse & Create)
  // ----------------------------------------------------
  return (
    <div id="squad-discovery-container">
      <header id="squad-discovery-header">
        <h1>فرق العمل الطلابية (Squads)</h1>
        <p>انضم لفريق دائم أو شكّل فريقك الخاص للمنافسة على المشاريع الكبيرة.</p>
        <Button id="btn-open-create-squad" onClick={() => setShowCreateModal((prev) => !prev)}>
          {showCreateModal ? "إلغاء" : "➕ إنشاء فريق جديد"}
        </Button>
      </header>

      {/* Create Squad Inline Form */}
      {showCreateModal && (
        <Card id="create-squad-card">
          <h3>تأسيس فريق جديد</h3>
          {squadActions.createErrors.general && <p className="error">{squadActions.createErrors.general}</p>}

          <div>
            <label htmlFor="squad-name">اسم الفريق</label>
            <Input
              id="squad-name"
              name="name"
              value={squadActions.createFormData.name}
              onChange={squadActions.handleCreateChange}
              placeholder="مثال: رواد حاسبات"
            />
            {squadActions.isCheckingName && <span>جارٍ فحص توفر الاسم...</span>}
            {squadActions.createErrors.name && <span className="error">{squadActions.createErrors.name}</span>}
          </div>

          <div>
            <label htmlFor="squad-desc">الهدف والوصف</label>
            <textarea
              id="squad-desc"
              name="description"
              value={squadActions.createFormData.description}
              onChange={squadActions.handleCreateChange}
              rows={3}
            />
            {squadActions.createErrors.description && <span className="error">{squadActions.createErrors.description}</span>}
          </div>

          <Button
            id="btn-submit-create-squad"
            onClick={() => squadActions.handleCreateSquad(() => {
              setShowCreateModal(false);
              refetchMySquad();
            })}
            disabled={squadActions.isSubmittingCreate}
          >
            {squadActions.isSubmittingCreate ? "جارٍ الإنشاء..." : "إنشاء الفريق"}
          </Button>
        </Card>
      )}

      {/* Open Squads Directory */}
      <section id="open-squads-section">
        <h3>الفرق المفتوحة للانضمام</h3>
        <Input
          id="filter-squad-skill"
          placeholder="تصفية بالمهارة المطلوبة (DevOps, UI/UX...)"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
        />

        {isLoadingOpenSquads ? (
          <Skeleton id="open-squads-skeleton" />
        ) : (
          <div id="open-squads-grid">
            {openSquads.map((openSquad) => (
              <Card key={openSquad.id} id={`open-squad-${openSquad.id}`}>
                <h4>{openSquad.name}</h4>
                <p>{openSquad.description}</p>
                <p>الأعضاء: {openSquad.members.length} / {openSquad.maxMembers}</p>
                <div>
                  مهارات مطلوبة:
                  {openSquad.neededSkills?.map((sk) => (
                    <Badge key={sk} type="skill" label={sk} />
                  ))}
                </div>
                <Button
                  id={`btn-apply-squad-${openSquad.id}`}
                  onClick={() => squadActions.handleApplyToSquad(openSquad.id, "أرغب في الانضمام لفريقكم.")}
                >
                  تقديم طلب انضمام
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default SquadLogicView;

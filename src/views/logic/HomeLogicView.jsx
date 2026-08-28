/**
 * @file HomeLogicView.jsx
 * @description Logic wiring for Landing / Home page connecting useHomeStats with black-box UI components.
 */
import React from "react";
import { useHomeStats } from "../../hooks/useHomeStats";

export function HomeLogicView({
  // UI team components passed as props or imported directly
  Card = (p) => <div {...p} />,
  Button = (p) => <button {...p} />,
  Skeleton = () => <div>Loading...</div>,
  Badge = (p) => <span {...p} />
}) {
  const { status, stats, isLoading, isError, refetch, primaryCtaAction } = useHomeStats();

  if (isLoading) {
    return <Skeleton id="home-skeleton" />;
  }

  return (
    <div id="home-logic-container">
      {/* Hero / CTA Section */}
      <section id="hero-section">
        <h1>منصة SkillBridge لتمكين طلاب الجامعات في سوق العمل الحر</h1>
        <p>تحقق من هويتك الجامعية، طور مهاراتك بالذكاء الاصطناعي، وانضم لسوق العمل بثقة.</p>
        
        <Button
          id="btn-home-primary-cta"
          onClick={() => {
            window.location.href = primaryCtaAction.targetRoute;
          }}
        >
          {primaryCtaAction.label}
        </Button>
      </section>

      {/* Platform Statistics */}
      {stats && (
        <section id="stats-section">
          <div id="stats-grid">
            <Card id="stat-students">
              <span>إجمالي الطلاب</span>
              <strong>{stats.totalStudents?.toLocaleString("ar-EG")}</strong>
            </Card>
            <Card id="stat-projects">
              <span>مشاريع منجزة</span>
              <strong>{stats.completedProjects?.toLocaleString("ar-EG")}</strong>
            </Card>
            <Card id="stat-universities">
              <span>جامعات شريكة</span>
              <strong>{stats.partnerUniversities}</strong>
            </Card>
            <Card id="stat-earnings">
              <span>إجمالي أرباح الطلاب</span>
              <strong>{stats.totalEarningsEGP?.toLocaleString("ar-EG")} ج.م</strong>
            </Card>
          </div>
        </section>
      )}

      {/* Top Students Highlights */}
      {stats?.topStudents?.length > 0 && (
        <section id="top-students-section">
          <h2>أبرز الطلاب المتميزين هذا الأسبوع</h2>
          <div id="students-grid">
            {stats.topStudents.map((std) => (
              <Card key={std.id} id={`top-student-${std.id}`}>
                <img src={std.avatar} alt={std.name} />
                <h3>{std.name}</h3>
                <p>{std.university} - {std.faculty}</p>
                <Badge type="level_pro" label={`${std.xp} XP`} />
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Safe Error Fallback Notice */}
      {isError && (
        <div id="stats-fallback-alert">
          <p>يتم عرض إحصائيات تقريبية حالياً.</p>
          <Button onClick={refetch}>تحديث الإحصائيات</Button>
        </div>
      )}
    </div>
  );
}

export default HomeLogicView;

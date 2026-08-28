/**
 * @file LeaderboardLogicView.jsx
 * @description Logic wiring for Leaderboard rankings, scope tabs, time periods, and current user row highlights.
 */
import React from "react";
import { useLeaderboard } from "../../hooks/useLeaderboard";

export function LeaderboardLogicView({
  Card = (p) => <div {...p} />,
  Button = (p) => <button {...p} />,
  Badge = (p) => <span {...p} />,
  Skeleton = () => <div>Loading...</div>
}) {
  const {
    scope,
    period,
    items,
    total,
    isLoading,
    isError,
    isEmpty,
    error,
    changeScope,
    changePeriod,
    isCurrentUserRow,
    refetch
  } = useLeaderboard("students", "weekly");

  return (
    <div id="leaderboard-container">
      <header id="leaderboard-header">
        <h1>🏆 لوحة الشرف والمتصدرين</h1>
        <p>تنافس مع زملائك وجامعتك واكسب نقاط خبرة (XP) مع كل مشروع منجز.</p>
      </header>

      {/* Scope Navigation Tabs */}
      <div id="scope-tabs-bar">
        <Button
          id="tab-students"
          onClick={() => changeScope("students")}
          className={scope === "students" ? "active" : ""}
        >
          الطلاب المتصدرون
        </Button>
        <Button
          id="tab-universities"
          onClick={() => changeScope("universities")}
          className={scope === "universities" ? "active" : ""}
        >
          ترتيب الجامعات
        </Button>
        <Button
          id="tab-squads"
          onClick={() => changeScope("squads")}
          className={scope === "squads" ? "active" : ""}
        >
          ترتيب الفرق (Squads)
        </Button>
      </div>

      {/* Time Period Filter */}
      <div id="period-filter-bar">
        <Button
          id="period-weekly"
          onClick={() => changePeriod("weekly")}
          className={period === "weekly" ? "active" : ""}
        >
          هذا الأسبوع
        </Button>
        <Button
          id="period-monthly"
          onClick={() => changePeriod("monthly")}
          className={period === "monthly" ? "active" : ""}
        >
          هذا الشهر
        </Button>
        <Button
          id="period-all-time"
          onClick={() => changePeriod("all_time")}
          className={period === "all_time" ? "active" : ""}
        >
          كل الأوقات
        </Button>
      </div>

      {/* States */}
      {isLoading && <Skeleton id="leaderboard-skeleton" />}

      {isError && (
        <div id="leaderboard-error">
          <p>{error || "تعذر تحميل لوحة المتصدرين."}</p>
          <Button onClick={refetch}>إعادة المحاولة</Button>
        </div>
      )}

      {isEmpty && (
        <p id="leaderboard-empty">لا توجد بيانات متاحة لهذه الفترة حتى الآن.</p>
      )}

      {/* Leaderboard Table */}
      {!isLoading && !isError && items.length > 0 && (
        <Card id="leaderboard-table-card">
          <table id="leaderboard-table">
            <thead>
              <tr>
                <th>الترتيب</th>
                <th>الاسم / الكيان</th>
                <th>النقاط (XP)</th>
                <th>المشاريع المنجزة</th>
                <th>الاتجاه</th>
              </tr>
            </thead>
            <tbody>
              {items.map((entry) => {
                const isCurrent = isCurrentUserRow(entry.id);
                return (
                  <tr
                    key={entry.id}
                    id={`leaderboard-row-${entry.id}`}
                    className={isCurrent ? "current-user-highlight" : ""}
                  >
                    <td>
                      <strong>#{entry.rank}</strong>
                    </td>
                    <td>
                      <span>{entry.name}</span>
                      {entry.university && <span> ({entry.university})</span>}
                      {isCurrent && <Badge type="skill" label="أنت" />}
                    </td>
                    <td>
                      <strong>{entry.xp?.toLocaleString("ar-EG")} XP</strong>
                    </td>
                    <td>{entry.completedTasks}</td>
                    <td>
                      {entry.rankTrend === "up" && "▲"}
                      {entry.rankTrend === "down" && "▼"}
                      {entry.rankTrend === "same" && "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

export default LeaderboardLogicView;

/**
 * @file LeaderboardLogicView.jsx
 * @description Modern Figma presentation layer for the Leaderboard page connecting useLeaderboard.
 * Features Top 3 podium cards, scope navigation tabs, time period filters, and interactive rankings table.
 */
import React from "react";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { ButtonLogic as Button } from "../../components/contracts/ButtonLogic";
import { CardLogic as Card } from "../../components/contracts/CardLogic";
import { BadgeLogic as Badge } from "../../components/contracts/BadgeLogic";
import { NavbarLogic as Navbar } from "../../components/contracts/NavbarLogic";
import { FooterLogic as Footer } from "../../components/contracts/FooterLogic";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Users,
  GraduationCap,
  Crown
} from "lucide-react";

export function LeaderboardLogicView({
  CardComponent = Card,
  ButtonComponent = Button,
  BadgeComponent = Badge
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

  const topThree = items.slice(0, 3);
  const remainingItems = items.slice(3);

  return (
    <div id="leaderboard-container" className="min-h-screen bg-[#0f1117] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom max-w-5xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold mb-3">
              <Trophy className="w-3.5 h-3.5" />
              <span>لوحة الشرف والتنافس الأكاديمي</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-2">
              لوحة المتصدرين ونقاط الخبرة (XP) 🏆
            </h1>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              تنافس مع زملائك وجامعتك واكسب نقاط خبرة (XP) مع كل مشروع تنجزه وتقييم مهارة تجتازه.
            </p>
          </div>

          {/* Scope Navigation Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#13161e] border border-[#222634] p-2 rounded-2xl">
            {/* Scope tabs */}
            <div id="scope-tabs-bar" className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                id="tab-students"
                onClick={() => changeScope("students")}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  scope === "students"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>الطلاب المتصدرون</span>
              </button>

              <button
                id="tab-universities"
                onClick={() => changeScope("universities")}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  scope === "universities"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>ترتيب الجامعات</span>
              </button>

              <button
                id="tab-squads"
                onClick={() => changeScope("squads")}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  scope === "squads"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>ترتيب الفرق</span>
              </button>
            </div>

            {/* Time Period Filter */}
            <div id="period-filter-bar" className="flex items-center gap-1 bg-[#181b24] p-1 rounded-xl border border-[#2a2f3e] w-full sm:w-auto justify-center">
              <button
                id="period-weekly"
                onClick={() => changePeriod("weekly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  period === "weekly" ? "bg-white/10 text-emerald-400" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                أسبوعي
              </button>
              <button
                id="period-monthly"
                onClick={() => changePeriod("monthly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  period === "monthly" ? "bg-white/10 text-emerald-400" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                شهري
              </button>
              <button
                id="period-all-time"
                onClick={() => changePeriod("all_time")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  period === "all_time" ? "bg-white/10 text-emerald-400" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                الكل
              </button>
            </div>
          </div>

          {/* Loading & Error States */}
          {isLoading && (
            <div id="leaderboard-skeleton" className="space-y-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-16 bg-[#13161e] border border-[#222634] rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <div id="leaderboard-error" className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center max-w-md mx-auto">
              <p className="text-sm text-red-400 font-medium mb-4">{error || "تعذر تحميل لوحة المتصدرين."}</p>
              <ButtonComponent variant="outline" size="sm" onClick={refetch}>
                إعادة المحاولة
              </ButtonComponent>
            </div>
          )}

          {isEmpty && (
            <CardComponent variant="surface" className="p-12 text-center max-w-md mx-auto">
              <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p id="leaderboard-empty" className="text-sm text-gray-400">
                لا توجد بيانات متصدرين لهذه الفترة حتى الآن.
              </p>
            </CardComponent>
          )}

          {/* ─── Top 3 Podium Highlights ─── */}
          {!isLoading && !isError && topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {/* Rank 2 (Silver) */}
              {topThree[1] && (
                <CardComponent variant="surface" className="p-6 text-center border border-gray-400/30 relative order-2 md:order-1">
                  <div className="w-8 h-8 rounded-full bg-gray-400/20 text-gray-300 font-mono font-extrabold text-sm flex items-center justify-center mx-auto mb-3">
                    #2
                  </div>
                  <h4 className="font-bold text-white text-base mb-1">{topThree[1].name}</h4>
                  <p className="text-xs text-gray-400 mb-3">{topThree[1].university}</p>
                  <span className="text-xl font-mono font-extrabold text-gray-200 block">
                    {topThree[1].xp?.toLocaleString("ar-EG")} <span className="text-xs text-gray-400">XP</span>
                  </span>
                </CardComponent>
              )}

              {/* Rank 1 (Gold / Crown) */}
              {topThree[0] && (
                <CardComponent variant="glow" className="p-8 text-center border border-amber-500/40 relative order-1 md:order-2 md:-translate-y-3 bg-gradient-to-b from-[#181b24] to-[#13161e]">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 font-mono font-extrabold text-base flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
                    👑 #1
                  </div>
                  <h4 className="font-bold text-white text-lg mb-1">{topThree[0].name}</h4>
                  <p className="text-xs text-emerald-400 font-medium mb-3">{topThree[0].university}</p>
                  <span className="text-3xl font-mono font-extrabold text-amber-400 block mb-1">
                    {topThree[0].xp?.toLocaleString("ar-EG")} <span className="text-xs text-gray-300">XP</span>
                  </span>
                  <BadgeComponent type="level_pro" label="متصدر الأسبوع" size="sm" />
                </CardComponent>
              )}

              {/* Rank 3 (Bronze) */}
              {topThree[2] && (
                <CardComponent variant="surface" className="p-6 text-center border border-amber-700/30 relative order-3">
                  <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-500 font-mono font-extrabold text-sm flex items-center justify-center mx-auto mb-3">
                    #3
                  </div>
                  <h4 className="font-bold text-white text-base mb-1">{topThree[2].name}</h4>
                  <p className="text-xs text-gray-400 mb-3">{topThree[2].university}</p>
                  <span className="text-xl font-mono font-extrabold text-amber-500 block">
                    {topThree[2].xp?.toLocaleString("ar-EG")} <span className="text-xs text-gray-400">XP</span>
                  </span>
                </CardComponent>
              )}
            </div>
          )}

          {/* ─── Leaderboard Full Table ─── */}
          {!isLoading && !isError && items.length > 0 && (
            <CardComponent id="leaderboard-table-card" variant="surface" className="p-6 border border-[#222634] overflow-x-auto">
              <table id="leaderboard-table" className="w-full text-right text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-[#222634] pb-3">
                    <th className="py-3 px-4 font-bold">الترتيب</th>
                    <th className="py-3 px-4 font-bold">الاسم / الكيان</th>
                    <th className="py-3 px-4 font-bold">النقاط (XP)</th>
                    <th className="py-3 px-4 font-bold">المشاريع المنجزة</th>
                    <th className="py-3 px-4 font-bold text-center">الاتجاه</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2330]">
                  {items.map((entry) => {
                    const isCurrent = isCurrentUserRow(entry.id);
                    return (
                      <tr
                        key={entry.id}
                        id={`leaderboard-row-${entry.id}`}
                        className={`transition ${
                          isCurrent
                            ? "bg-emerald-500/10 text-emerald-300 font-bold border-r-4 border-emerald-500"
                            : "hover:bg-white/5 text-gray-200"
                        }`}
                      >
                        <td className="py-4 px-4 font-mono font-extrabold text-sm">
                          #{entry.rank}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{entry.name}</span>
                            {entry.university && (
                              <span className="text-gray-400 text-xs hidden sm:inline">({entry.university})</span>
                            )}
                            {isCurrent && <BadgeComponent type="skill" label="أنت" size="sm" />}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-emerald-400 text-sm">
                          {entry.xp?.toLocaleString("ar-EG")} XP
                        </td>
                        <td className="py-4 px-4 font-mono text-gray-300">
                          {entry.completedTasks} مشاريع
                        </td>
                        <td className="py-4 px-4 text-center">
                          {entry.rankTrend === "up" && (
                            <TrendingUp className="w-4 h-4 text-emerald-400 inline" />
                          )}
                          {entry.rankTrend === "down" && (
                            <TrendingDown className="w-4 h-4 text-red-400 inline" />
                          )}
                          {entry.rankTrend === "same" && (
                            <Minus className="w-4 h-4 text-gray-500 inline" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardComponent>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LeaderboardLogicView;

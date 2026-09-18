/**
 * @file FooterLogic.jsx
 * @description Logic wrapper & presentation for the SkillBridge Footer component.
 * Features newsletter email submission, platform links, and branded footer aesthetics.
 */
import React, { useState, useCallback } from "react";
import { LogoMark } from "./NavbarLogic";
import { Send, CheckCircle2, Shield, Heart } from "lucide-react";

export function FooterLogic({
  onSubscribe = () => {},
  renderFooter
}) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = useCallback(
    (e) => {
      e.preventDefault();
      if (!email || !email.includes("@")) return;

      onSubscribe(email);
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 4000);
      setEmail("");
    },
    [email, onSubscribe]
  );

  const logicProps = {
    email,
    setEmail,
    isSubscribed,
    handleSubscribe
  };

  if (typeof renderFooter === "function") {
    return renderFooter(logicProps);
  }

  return (
    <footer className="w-full bg-[#0c0e14] border-t border-[#1e2330] text-gray-400 text-sm">
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <a href="/" className="flex items-center gap-3">
              <LogoMark size={36} />
              <span className="font-display font-bold text-xl text-white">
                Skill<span className="text-emerald-400">Bridge</span>
              </span>
            </a>
            <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
              المنصة المتكاملة لتمكين وتأهيل طلاب الجامعات في سوق العمل الحر، والتوثيق الأكاديمي، والمطابقة الذكية بالمشاريع الواقعية.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
              <Shield className="w-4 h-4" />
              <span>نظام دفع آمن وضمان كامل بحساب Escrow</span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="font-title text-white font-bold text-base mb-4">المنصة</h4>
            <ul className="space-y-2.5">
              <li><a href="/marketplace" className="hover:text-emerald-400 transition">سوق العمل والمشاريع</a></li>
              <li><a href="/learning" className="hover:text-emerald-400 transition">مسارات التعلم الذكية</a></li>
              <li><a href="/cv-analysis" className="hover:text-emerald-400 transition">تحليل السيرة الذاتية (CV)</a></li>
              <li><a href="/skill-verification" className="hover:text-emerald-400 transition">تقييم وتوثيق المهارات</a></li>
              <li><a href="/squad" className="hover:text-emerald-400 transition">الفرق البرمجية (Squads)</a></li>
            </ul>
          </div>

          {/* Col 4: Community & Support */}
          <div>
            <h4 className="font-title text-white font-bold text-base mb-4">المجتمع والدعم</h4>
            <ul className="space-y-2.5">
              <li><a href="/community" className="hover:text-emerald-400 transition">مجتمع الطلاب</a></li>
              <li><a href="/leaderboard" className="hover:text-emerald-400 transition">لوحة المتصدرين و XP</a></li>
              <li><a href="/profile" className="hover:text-emerald-400 transition">حسابي والشهادات</a></li>
              <li><a href="/student" className="hover:text-emerald-400 transition">لوحة تحكم الطالب</a></li>
              <li><a href="/admin" className="hover:text-emerald-400 transition">لوحة الإدارة</a></li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div>
            <h4 className="font-title text-white font-bold text-base mb-4">النشرة البريدية</h4>
            <p className="text-xs text-gray-400 mb-3">اشترك لتصلك أحدث الفرص التدريبية ومشاريع العمل الحر الجامعية.</p>
            
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#13161e] border border-[#222634] text-xs rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl hover:brightness-105 transition"
              >
                <Send className="w-3.5 h-3.5" />
                اشتراك في النشرة
              </button>
            </form>

            {isSubscribed && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-2 font-medium animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5" />
                تم اشتراكك بنجاح في النشرة!
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1a1e2a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SkillBridge 2.0. جميع الحقوق محفوظة لطلاب الجامعات والخرّيجين.</p>
          <div className="flex items-center gap-1">
            <span>صُنعت بكل</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>لتمكين جيل المستقبل</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterLogic;

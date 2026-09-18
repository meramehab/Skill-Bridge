import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogoMark } from './Navbar';
import { Send, CheckCircle2, Shield, Heart } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 4000);
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#0c0e14] border-t border-[#1e2330] text-gray-400 text-sm mt-auto" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <LogoMark size={36} />
              <div className="flex items-center gap-1 font-display font-bold text-xl text-white">
                <span>Skill</span>
                <span className="text-emerald-400">Bridge</span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed text-xs sm:text-sm max-w-sm">
              المنصة المتكاملة لتمكين وتأهيل طلاب الجامعات في سوق العمل الحر، والتوثيق الأكاديمي، والمطابقة الذكية بالمشاريع الواقعية.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
              <Shield className="w-4 h-4" />
              <span>نظام دفع آمن وضمان كامل بحساب Escrow وحماية الحقوق</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-title text-white font-bold text-sm mb-4">المنصة</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/marketplace" className="hover:text-emerald-400 transition">سوق المشاريع</Link></li>
              <li><Link to="/learning" className="hover:text-emerald-400 transition">مسارات التعلم</Link></li>
              <li><Link to="/cv-analysis" className="hover:text-emerald-400 transition">تحليل السيرة الذاتية (CV)</Link></li>
              <li><Link to="/skill-verification" className="hover:text-emerald-400 transition">تقييم وتوثيق المهارات</Link></li>
              <li><Link to="/courses" className="hover:text-emerald-400 transition">الكورسات المعتمدة</Link></li>
            </ul>
          </div>

          {/* Community & Dashboards */}
          <div>
            <h4 className="font-title text-white font-bold text-sm mb-4">المجتمع والدعم</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/community" className="hover:text-emerald-400 transition">مجتمع الطلاب</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition">لوحة تحكم الطالب</Link></li>
              <li><Link to="/client-dashboard" className="hover:text-emerald-400 transition">لوحة أصحاب الأعمال</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-400 transition">لوحة الإدارة</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-title text-white font-bold text-sm mb-4">النشرة البريدية</h4>
            <p className="text-xs text-gray-400 mb-3">اشترك لتصلك أحدث الفرص التدريبية ومشاريع العمل الحر الجامعية.</p>
            
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="بريدك الإلكتروني..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#13161e] border border-[#222634] text-xs rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-black py-2.5 rounded-xl transition shadow-md shadow-emerald-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>اشتراك في النشرة</span>
              </button>
            </form>

            {isSubscribed && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-2 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                تم اشتراكك بنجاح في النشرة!
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1a1e2a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SkillBridge. جميع الحقوق محفوظة لطلاب الجامعات والخرّيجين.</p>
          <div className="flex items-center gap-1">
            <span>صُنعت بكل</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>لتمكين جيل المستقبل</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

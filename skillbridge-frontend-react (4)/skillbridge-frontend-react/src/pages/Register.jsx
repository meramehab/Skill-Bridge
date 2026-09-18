import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { validateRegisterForm } from '../utils/validators';
import { LogoMark } from '../components/layout/Navbar';
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    university: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleSelect = (role) => {
    setForm((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      setSubmitError('');
      await register(form);
      navigate(form.role === 'client' ? '/client-dashboard' : '/dashboard');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'تعذر إنشاء الحساب، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#0f1117] text-white flex items-center justify-center py-14 px-4 sm:px-6 selection:bg-emerald-500 selection:text-white relative overflow-hidden" dir="rtl">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full relative z-10 space-y-6">
        {/* Register Card */}
        <div className="bg-[#13161e]/90 border border-[#222634] rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-[#1e2330] border border-[#2a2f3a] mb-1">
              <LogoMark size={40} />
            </div>
            <h1 className="text-2xl font-black text-white font-display">إنشاء حساب جديد</h1>
            <p className="text-xs text-gray-400">
              انضم إلى آلاف الطلاب وأصحاب الأعمال في منظومة العمل الحر الأكاديمية
            </p>
          </div>

          {submitError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">
                نوع الحساب <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('student')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                    form.role === 'student'
                      ? 'border-emerald-500 bg-emerald-500/10 text-white font-bold ring-1 ring-emerald-500'
                      : 'border-[#222634] bg-[#0B0F17] hover:border-slate-700 text-gray-400'
                  }`}
                >
                  <GraduationCap className={`w-6 h-6 mb-1.5 ${form.role === 'student' ? 'text-emerald-400' : 'text-gray-400'}`} />
                  <span className="text-xs font-bold">طالب جامعي</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">تدريب ومشاريع وخبرة</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('client')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                    form.role === 'client'
                      ? 'border-emerald-500 bg-emerald-500/10 text-white font-bold ring-1 ring-emerald-500'
                      : 'border-[#222634] bg-[#0B0F17] hover:border-slate-700 text-gray-400'
                  }`}
                >
                  <Briefcase className={`w-6 h-6 mb-1.5 ${form.role === 'client' ? 'text-emerald-400' : 'text-gray-400'}`} />
                  <span className="text-xs font-bold">صاحب عمل / عميل</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">توظيف طلاب وضمان Escrow</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1" htmlFor="fullName">
                الاسم بالكامل
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="محمد أحمد"
                  className="w-full bg-[#0B0F17] border border-[#222634] focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 pl-10 text-xs outline-none transition"
                />
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3 pointer-events-none" />
              </div>
              {errors.fullName && <p className="mt-1 text-[11px] text-red-400 font-medium">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1" htmlFor="email">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@university.edu أو name@company.com"
                  className="w-full bg-[#0B0F17] border border-[#222634] focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 pl-10 text-xs outline-none transition"
                  dir="ltr"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3 pointer-events-none" />
              </div>
              {errors.email && <p className="mt-1 text-[11px] text-red-400 font-medium">{errors.email}</p>}
            </div>

            {/* University (if student) or Company */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1" htmlFor="university">
                {form.role === 'student' ? 'الجامعة والكلية' : 'اسم الشركة أو المؤسسة'}
              </label>
              <div className="relative">
                <input
                  id="university"
                  name="university"
                  type="text"
                  value={form.university}
                  onChange={handleChange}
                  placeholder={form.role === 'student' ? 'مثال: جامعة القاهرة - حاسبات ومعلومات' : 'مثال: شركة النور للحلول الرقمية'}
                  className="w-full bg-[#0B0F17] border border-[#222634] focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 pl-10 text-xs outline-none transition"
                />
                <GraduationCap className="w-4 h-4 text-gray-500 absolute left-3.5 top-3 pointer-events-none" />
              </div>
              {errors.university && <p className="mt-1 text-[11px] text-red-400 font-medium">{errors.university}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1" htmlFor="password">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#0B0F17] border border-[#222634] focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 pl-10 text-xs outline-none transition"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-gray-500 hover:text-gray-300 absolute left-3.5 top-3"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[11px] text-red-400 font-medium">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black py-3.5 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span>جاري إنشاء الحساب...</span>
              ) : (
                <>
                  <span>إنشاء الحساب والبدء فوراً</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-400 border-t border-[#222634]">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-emerald-400 font-bold hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

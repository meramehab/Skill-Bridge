import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { validateLoginForm } from '../utils/validators';
import { LogoMark } from '../components/layout/Navbar';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      setSubmitError('');
      const user = await login(form);
      navigate(
        user.role === 'admin'
          ? '/admin'
          : user.role === 'client'
          ? '/client-dashboard'
          : '/dashboard'
      );
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#0f1117] text-white flex items-center justify-center py-14 px-4 sm:px-6 selection:bg-emerald-500 selection:text-white relative overflow-hidden" dir="rtl">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Card */}
        <div className="bg-[#13161e]/90 border border-[#222634] rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-[#1e2330] border border-[#2a2f3a] mb-1">
              <LogoMark size={40} />
            </div>
            <h1 className="text-2xl font-black text-white font-display">تسجيل الدخول</h1>
            <p className="text-xs text-gray-400">
              أهلاً بك مجدداً في منصة SkillBridge للتأهيل والعمل الحر
            </p>
          </div>

          {submitError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5" htmlFor="email">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="student@university.edu أو name@company.com"
                  className="w-full bg-[#0B0F17] border border-[#222634] focus:border-emerald-500 text-white rounded-xl px-4 py-3 pl-10 text-xs outline-none transition"
                  dir="ltr"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
              {errors.email && <p className="mt-1 text-[11px] text-red-400 font-medium">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-300" htmlFor="password">
                  كلمة المرور
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#0B0F17] border border-[#222634] focus:border-emerald-500 text-white rounded-xl px-4 py-3 pl-10 text-xs outline-none transition"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-gray-500 hover:text-gray-300 absolute left-3.5 top-3.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[11px] text-red-400 font-medium">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span>جاري تسجيل الدخول...</span>
              ) : (
                <>
                  <span>دخول إلى حسابي</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-400 border-t border-[#222634]">
            ليس لديك حساب بعد؟{' '}
            <Link to="/register" className="text-emerald-400 font-bold hover:underline">
              أنشئ حساب جديد مجاناً
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

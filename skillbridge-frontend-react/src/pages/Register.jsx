import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import { validateRegisterForm } from '../utils/validators';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', university: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      navigate('/dashboard');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'حصل خطأ، حاول تاني');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <span className="eyebrow">اليوم اتلاقي شغل</span>
      <h1 className="mt-2 text-2xl font-semibold">إنشاء حساب طالب</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="label" htmlFor="fullName">الاسم الكامل</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className="input"
            value={form.fullName}
            onChange={handleChange}
            placeholder="اسمك بالكامل"
          />
          {errors.fullName && <p className="mt-1 text-xs text-danger">{errors.fullName}</p>}
        </div>

        <div>
          <label className="label" htmlFor="email">الإيميل الجامعي</label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            value={form.email}
            onChange={handleChange}
            placeholder="you@university.edu"
          />
          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
        </div>

        <div>
          <label className="label" htmlFor="university">الجامعة</label>
          <input
            id="university"
            name="university"
            type="text"
            className="input"
            value={form.university}
            onChange={handleChange}
            placeholder="اسم جامعتك"
          />
        </div>

        <div>
          <label className="label" htmlFor="password">كلمة السر</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            value={form.password}
            onChange={handleChange}
            placeholder="6 أحرف على الأقل"
          />
          {errors.password && <p className="mt-1 text-xs text-danger">{errors.password}</p>}
        </div>

        {submitError && <p className="text-sm text-danger">{submitError}</p>}

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          إنشاء الحساب
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        عندك حساب بالفعل؟{' '}
        <Link to="/login" className="font-semibold text-ink">
          سجّل دخول
        </Link>
      </p>
    </div>
  );
};

export default Register;

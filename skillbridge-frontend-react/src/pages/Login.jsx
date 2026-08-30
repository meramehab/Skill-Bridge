import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import { validateLoginForm } from '../utils/validators';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'حصل خطأ، حاول تاني');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <span className="eyebrow">أهلاً بيك تاني</span>
      <h1 className="mt-2 text-2xl font-semibold">تسجيل الدخول</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
          <label className="label" htmlFor="password">كلمة السر</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-xs text-danger">{errors.password}</p>}
        </div>

        {submitError && <p className="text-sm text-danger">{submitError}</p>}

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          دخول
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        مفيش حساب لسه؟{' '}
        <Link to="/register" className="font-semibold text-ink">
          سجّل الآن
        </Link>
      </p>
    </div>
  );
};

export default Login;

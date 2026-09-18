import { useState } from 'react';
import paymentService from '../../services/payment.service';

const CheckoutModal = ({ isOpen, onClose, course, onSuccess }) => {
  const [method, setMethod] = useState('sandbox'); // 'sandbox' | 'card' | 'vodafone'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [phone, setPhone] = useState('');

  if (!isOpen || !course) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (method === 'sandbox') {
        const res = await paymentService.checkout({
          courseId: course._id,
          amount: course.price,
          paymentMethod: 'sandbox',
          sandboxAutoSucceed: true,
        });

        if (res.success) {
          setReceipt(res.data);
          if (onSuccess) {
            setTimeout(() => {
              onSuccess(res.data);
            }, 1200);
          }
        } else {
          setError(res.message || 'فشلت عملية الدفع التجريبية');
        }
      } else if (method === 'card') {
        // Paymob card checkout
        const paymobRes = await paymentService.createPaymobPayment({
          courseId: course._id,
          amount: course.price,
          phone: phone || '+201000000000',
        });
        paymentService.redirectToPaymobCheckout(paymobRes);
      } else if (method === 'vodafone') {
        // Redirect to dedicated vodafone instructions page or handle directly
        window.location.href = `/pay-course/${course._id}?amount=${course.price}`;
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'حدث خطأ أثناء معالجة الدفع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E131F] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              الدفع الآمن • 256-bit SSL
            </span>
            <h3 className="text-xl font-bold text-white">إتمام الاشتراك في الكورس</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Course Summary Box */}
        <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-white">{course.title}</h4>
              <p className="mt-1 text-xs text-white/60">
                {course.skill} • {course.level} • {course.durationHours || 12} ساعة تدريبية
              </p>
            </div>
            <div className="text-left">
              <span className="text-xs text-white/40 block">المبلغ الإجمالي</span>
              <span className="text-2xl font-black text-emerald-400">{course.price} ج.م</span>
            </div>
          </div>
        </div>

        {receipt ? (
          /* Receipt Card upon Success */
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-2xl text-emerald-400">
              ✓
            </div>
            <h4 className="mt-3 text-lg font-bold text-emerald-300">تم الدفع بنجاح ومفتوح بالكامل!</h4>
            <p className="mt-1 text-xs text-emerald-400/80">
              تم تسجيلك رسميًا في الكورس وتم إلغاء قفل كافة الدروس والمواد.
            </p>

            <div className="mt-4 rounded-lg bg-black/40 p-3 text-right text-xs text-white/80 space-y-1.5 border border-white/5">
              <div className="flex justify-between">
                <span className="text-white/40">رقم المعاملة (TXN ID):</span>
                <span className="font-mono text-white/90">{receipt.transactionId || 'TXN-SUCCESS'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">المبلغ المدفوع:</span>
                <span className="text-emerald-400 font-semibold">{receipt.amount || course.price} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">الحالة:</span>
                <span className="text-emerald-400">مكتمل (Completed)</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                window.location.href = `/courses/${course._id}`;
              }}
              className="mt-5 w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-black hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
            >
              الانتقال للكورس وبدء التعلم الآن 🚀
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePay} className="mt-5 space-y-4">
            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-medium text-white/70">اختر طريقة السداد:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('sandbox')}
                  className={`rounded-xl border p-3 text-center transition ${
                    method === 'sandbox'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-md shadow-emerald-500/10'
                      : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20'
                  }`}
                >
                  <div className="text-base font-bold">⚡ Sandbox</div>
                  <div className="text-[10px] opacity-75">دفع فوري تجريبي</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`rounded-xl border p-3 text-center transition ${
                    method === 'card'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-md shadow-emerald-500/10'
                      : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20'
                  }`}
                >
                  <div className="text-base font-bold">💳 فيزا / ماستر</div>
                  <div className="text-[10px] opacity-75">بوابة Paymob</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('vodafone')}
                  className={`rounded-xl border p-3 text-center transition ${
                    method === 'vodafone'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-md shadow-emerald-500/10'
                      : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20'
                  }`}
                >
                  <div className="text-base font-bold">📱 فودافون كاش</div>
                  <div className="text-[10px] opacity-75">تحويل يدوي</div>
                </button>
              </div>
            </div>

            {method === 'sandbox' && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-white/70">
                💡 <span className="font-semibold text-emerald-300">بيئة فحص واختبار سريعة (Sandbox Mode):</span> يمكنك
                تأكيد الدفع فورًا لفتح محتوى الكورس وفحص صلاحيات الوصول بنقرة واحدة.
              </div>
            )}

            {method === 'card' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-white/70">رقم الهاتف للفوترة:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-bold text-black hover:opacity-95 transition disabled:opacity-50 shadow-lg shadow-emerald-500/20"
              >
                {loading ? 'جاري معالجة الدفع...' : `تأكيد الدفع واشتراك (${course.price} ج.م)`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;

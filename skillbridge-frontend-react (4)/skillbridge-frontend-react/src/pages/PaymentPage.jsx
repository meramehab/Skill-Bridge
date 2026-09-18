import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import paymentService from '../services/payment.service';

const VODAFONE_CASH_NUMBER = '01095343491';

const PaymentPage = () => {
  const { projectId, courseId } = useParams();
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState(searchParams.get('amount') || '');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState('paymob'); // 'paymob' | 'vodafone'
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vodafoneSuccess, setVodafoneSuccess] = useState(false);

  const itemPayload = projectId ? { projectId } : { courseId };

  const handlePaymobPay = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('لازم تدخلي مبلغ صحيح');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const result = await paymentService.createPaymobPayment({ ...itemPayload, amount: Number(amount), phone });
      paymentService.redirectToPaymobCheckout(result);
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في إنشاء عملية الدفع');
      setLoading(false);
    }
  };

  const handleVodafonePay = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('لازم تدخلي مبلغ صحيح');
      return;
    }
    if (!senderPhone) {
      setError('لازم تدخلي رقم الموبايل اللي حوّلتي منه');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await paymentService.createVodafoneCashPayment({
        ...itemPayload, amount: Number(amount), senderPhone, transactionRef,
      });
      setVodafoneSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في إرسال طلب الدفع');
    } finally {
      setLoading(false);
    }
  };

  if (vodafoneSuccess) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <Card>
          <h2 className="text-center text-xl font-semibold text-success">تم إرسال طلب الدفع ✅</h2>
          <p className="mt-3 text-center text-sm text-muted">
            هيتم تفعيل اشتراكك بمجرد ما الإدارة تتأكد من وصول التحويل على رقم فودافون كاش. عادةً بياخد وقت قصير.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <span className="eyebrow">إتمام الدفع</span>
      <h1 className="mt-2 text-2xl font-semibold">اختاري طريقة الدفع</h1>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setMethod('paymob')}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${method === 'paymob' ? 'bg-ink text-white' : 'bg-white border border-line text-muted'}`}
        >
          بطاقة بنكية (Paymob)
        </button>
        <button
          onClick={() => setMethod('vodafone')}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${method === 'vodafone' ? 'bg-ink text-white' : 'bg-white border border-line text-muted'}`}
        >
          فودافون كاش
        </button>
      </div>

      <Card className="mt-6">
        {error && <p className="mb-4 text-sm text-danger">{error}</p>}

        <div className="mb-5">
          <label className="label">المبلغ (جنيه مصري)</label>
          <input
            type="number" min="1" className="input"
            value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="350"
          />
        </div>

        {method === 'paymob' ? (
          <form onSubmit={handlePaymobPay} className="space-y-5">
            <div>
              <label className="label">رقم الموبايل</label>
              <input
                type="tel" className="input"
                value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01000000000"
              />
            </div>
            <Button type="submit" variant="accent" fullWidth loading={loading}>
              ادفع بالبطاقة الآن
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVodafonePay} className="space-y-5">
            <div className="rounded-lg bg-signal/10 border border-signal/30 p-4 text-sm">
              <p className="font-semibold text-ink">رقم فودافون كاش</p>
              <p className="mt-1 text-lg font-bold text-ink" dir="ltr">{VODAFONE_CASH_NUMBER}</p>
              <p className="mt-2 text-xs text-muted">بعد التحويل، املي البيانات تحت وابعتي الطلب.</p>
            </div>
            <div>
              <label className="label">رقمك اللي حوّلتي منه</label>
              <input
                type="tel" className="input"
                value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} placeholder="01000000000"
              />
            </div>
            <div>
              <label className="label">رقم عملية التحويل (اختياري)</label>
              <input
                type="text" className="input"
                value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} placeholder="لو موجود عندك"
              />
            </div>
            <Button type="submit" variant="accent" fullWidth loading={loading}>
              أرسلي طلب التفعيل
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default PaymentPage;

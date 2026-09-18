import { Link, useSearchParams } from 'react-router-dom';
import Card from '../components/common/Card';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === 'true';

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-6 py-16">
      <Card>
        <h2 className="text-center text-xl font-semibold">
          {success ? 'تمت عملية الدفع بنجاح ✅' : 'فشلت عملية الدفع ❌'}
        </h2>
        <p className="mt-3 text-center text-sm text-muted">
          {success
            ? 'هيتم تجميد المبلغ في الضمان المالي (Escrow) لحد ما يتم تسليم المشروع.'
            : 'حاول تاني أو تواصل مع الدعم لو المشكلة استمرت.'}
        </p>
        <Link to="/" className="mt-6 block text-center text-sm font-semibold text-ink">
          الرجوع للصفحة الرئيسية
        </Link>
      </Card>
    </div>
  );
};

export default PaymentResult;

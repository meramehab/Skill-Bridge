import { Link } from 'react-router-dom';
import Card from '../components/common/Card';

const STAGES = [
  { title: 'تحقق من هويتك الطلابية', desc: 'عبر الإيميل الجامعي أو الكارنيه، بضمان الثقة من أول خطوة.' },
  { title: 'حلّل سيرتك الذاتية', desc: 'استخراج مهاراتك تلقائيًا وتحديد الفجوات اللي محتاج تسدها.' },
  { title: 'أثبت مهاراتك', desc: 'اختبارات ومهام عملية قبل ما تدخل سوق العمل الحر.' },
  { title: 'ابنِ ملفك الموثق', desc: 'مؤشر جاهزية مهنية يتحدث تلقائيًا بعد كل مشروع.' },
  { title: 'ادخل سوق العمل الحر', desc: 'بعد اجتياز 70% من مسار التعلم ومؤشر جاهزية يتخطى 80%.' },
];

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20">
        <span className="eyebrow">SkillBridge 2.0</span>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          تُأهّل، تُوثّق، ثم تُوظّف
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal/80">
          منصة تأهيل أكاديمي وعمل حر للطلاب الجامعيين — بتسد الفجوة بين اللي بتتعلمه في الكلية
          واللي سوق العمل فعلًا محتاجه، وبتوثق مهاراتك بدل ما تدّعيها بس.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/register" className="btn-accent">
            ابدأ رحلتك الآن
          </Link>
          <Link to="/marketplace" className="btn-outline">
            تصفح المشاريع
          </Link>
        </div>
      </section>

      {/* المشكلة */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <span className="eyebrow">المشكلة</span>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <Card title="الفجوة المهارية">التعليم الأكاديمي مش دايمًا مواكب لمتطلبات سوق العمل.</Card>
            <Card title="غياب إثبات الكفاءة">صعوبة إثبات المهارات الفعلية لأصحاب الأعمال.</Card>
            <Card title="انعدام الفرص العملية">أصحاب الأعمال بيترددوا في توظيف طلاب بدون سوابق أعمال.</Card>
          </div>
        </div>
      </section>

      {/* مراحل العمل */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <span className="eyebrow">رحلتك على المنصة</span>
        <h2 className="mt-2 text-2xl font-semibold">مراحل العمل الأساسية</h2>
        <ol className="mt-8 space-y-5">
          {STAGES.map((stage, index) => (
            <li key={stage.title} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-signal">
                {index + 1}
              </span>
              <div>
                <h3 className="text-base font-semibold text-ink">{stage.title}</h3>
                <p className="mt-1 text-sm text-charcoal/70">{stage.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default Home;

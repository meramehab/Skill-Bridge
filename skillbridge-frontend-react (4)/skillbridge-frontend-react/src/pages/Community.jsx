import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Community = () => {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchSquads = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/squads');
      setSquads(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في تحميل الفرق');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSquads();
  }, []);

  const handleCreateSquad = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;
    try {
      setCreating(true);
      setError('');
      await api.post('/squads', {
        name: name.trim(),
        description: description.trim(),
        skills: [],
      });
      setName('');
      setDescription('');
      setShowCreateForm(false);
      fetchSquads();
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في إنشاء الفريق');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="eyebrow">المجتمع التقني والتعاون</span>
          <h1 className="mt-2 text-2xl font-bold">الفرق الطلابية (Squads)</h1>
          <p className="mt-1 text-sm text-muted">
            انضم لفرق العمل الطلابية أو أنشئ فريقك الخاص لتنفيذ مشاريع حقيقية مع زملائك.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant={showCreateForm ? 'outline' : 'accent'}
        >
          {showCreateForm ? 'إلغاء' : '+ كوّن فريقاً جديداً'}
        </Button>
      </div>

      {/* نموذج إنشاء الفريق */}
      {showCreateForm && (
        <Card className="mt-6" title="إنشاء فريق طلابي جديد">
          <form onSubmit={handleCreateSquad} className="space-y-4">
            <div>
              <label className="label" htmlFor="squadName">اسم الفريق <span className="text-danger">*</span></label>
              <input
                id="squadName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: فريق مطوري الويب، CodeCraft..."
                className="input"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="squadDescription">وصف الفريق <span className="text-danger">*</span></label>
              <textarea
                id="squadDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اشرح أهداف الفريق، نوع المشاريع التي تخططون لتنفيذها، والمهارات المطلوبة..."
                className="input"
                rows={3}
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" loading={creating} variant="accent">
                إنشاء الفريق الآن
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Card>
      )}

      {error && <p className="mt-6 text-sm text-danger">{error}</p>}

      {/* قائمة الفرق */}
      {loading ? (
        <p className="mt-8 text-sm text-muted">جاري تحميل الفرق...</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {squads.length === 0 && (
            <div className="rounded-xl border border-line bg-surface/50 p-8 text-center col-span-full">
              <p className="text-muted">مفيش فرق لسه — كن أول من يكون فريقاً!</p>
            </div>
          )}
          {squads.map((squad) => (
            <Card
              key={squad._id}
              title={squad.name}
              eyebrow={`${squad.members?.length || 1} عضو`}
            >
              <div className="space-y-3">
                <p className="text-sm text-charcoal/80 leading-relaxed min-h-[48px]">
                  {squad.description || 'فريق طلابي للتعاون والعمل المشترك على المشاريع التقنية.'}
                </p>

                {squad.leader && (
                  <div className="pt-3 border-t border-line text-xs text-muted flex items-center justify-between">
                    <span>قائد الفريق:</span>
                    <span className="font-semibold text-ink">
                      {squad.leader.fullName || squad.leader.name || 'طالب'}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;

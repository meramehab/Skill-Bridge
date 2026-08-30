import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Community = () => {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchSquads = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/squads');
      setSquads(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في تحميل الفرق');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSquads();
  }, []);

  const handleCreateSquad = async () => {
    if (!name.trim()) return;
    try {
      setCreating(true);
      await api.post('/squads', { name, description: '', skills: [] });
      setName('');
      fetchSquads();
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ في إنشاء الفريق');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <span className="eyebrow">المجتمع التقني</span>
      <h1 className="mt-2 text-2xl font-semibold">الفرق الطلابية (Squads)</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم فريق جديد"
          className="input max-w-xs"
        />
        <Button onClick={handleCreateSquad} loading={creating} variant="accent">
          إنشاء فريق
        </Button>
      </div>

      {loading && <p className="mt-8 text-sm text-muted">جاري تحميل الفرق...</p>}
      {error && <p className="mt-8 text-sm text-danger">{error}</p>}

      {!loading && !error && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {squads.length === 0 && <p className="text-muted col-span-full">مفيش فرق لسه — كوّن أول فريق!</p>}
          {squads.map((squad) => (
            <Card key={squad._id} title={squad.name} eyebrow={`${squad.members?.length || 0} عضو`}>
              {squad.description || 'مفيش وصف للفريق ده لسه.'}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;

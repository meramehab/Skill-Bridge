import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import aiService from '../../services/ai.service';

const QUICK_PROMPTS = [
  'ما هي المشاريع المتاحة؟',
  'كيف أبدأ توثيق مهاراتي؟',
  'ما هي منصة SkillBridge؟',
  'كيف يتم الدفع والضمان؟',
];

const ChatbotWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: 'أهلاً بك في منصة SkillBridge! 👋 أنا مساعدك الذكي، كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);

  // تهيئة أو استرجاع sessionId ثابت للجلسة
  useEffect(() => {
    let currentSession = sessionStorage.getItem('sb_chatbot_session_id');
    if (!currentSession) {
      currentSession = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('sb_chatbot_session_id', currentSession);
    }
    setSessionId(currentSession);
  }, []);

  // التمرير التلقائي لآخر رسالة
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    if (!user) {
      setError('يرجى تسجيل الدخول أولاً للتحدث مع المساعد الذكي');
      return;
    }

    const timeString = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user', content: text, timestamp: timeString };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await aiService.sendChatMessage(text, sessionId);
      const botMsg = {
        role: 'bot',
        content: response?.response || 'شكراً لتواصلك، هل لديك استفسار آخر؟',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setError(err.response?.data?.message || 'تعذر الاتصال بالمساعد الذكي، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start font-body">
      {/* نافذة المحادثة */}
      {isOpen && (
        <div className="mb-3 flex h-[500px] w-[350px] sm:w-[380px] flex-col overflow-hidden rounded-card border border-line bg-white shadow-2xl transition-all">
          {/* ترويسة الشات */}
          <div className="flex items-center justify-between bg-ink px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-signal text-ink font-bold text-sm shadow-inner">
                AI
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white leading-tight">مساعد SkillBridge الذكي</h3>
                <span className="flex items-center gap-1 text-[11px] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
                  متصل وجاهز للمساعدة
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              title="إغلاق المحادثة"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* جسم المحادثة والرسائل */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-paper/50">
            {!user && (
              <div className="rounded-lg border border-signal/40 bg-signal/10 p-3 text-xs text-charcoal">
                <p className="font-semibold text-ink mb-1">تنبيه تسجيل الدخول:</p>
                <p>يجب تسجيل الدخول لتتمكن من إرسال واستقبال ردود المساعد الذكي.</p>
                <Link
                  to="/login"
                  className="mt-2 inline-block rounded bg-ink px-3 py-1 text-xs text-white hover:bg-ink-light"
                >
                  تسجيل الدخول الآن
                </Link>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-none bg-ink text-white shadow-sm'
                      : 'rounded-bl-none border border-line bg-white text-charcoal shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="mt-1 text-[10px] text-muted px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* مؤشر التحميل */}
            {loading && (
              <div className="flex items-start">
                <div className="rounded-2xl rounded-bl-none border border-line bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-signal animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-signal animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-signal animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-danger/10 p-2.5 text-xs text-danger border border-danger/20">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* مقترحات سريعة */}
          <div className="border-t border-line/60 bg-white px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  disabled={loading || !user}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] text-charcoal hover:border-signal hover:bg-signal/10 transition-colors disabled:opacity-40"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* حقل الإدخال */}
          <div className="border-t border-line bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={user ? 'اكتب استفسارك هنا...' : 'سجل الدخول أولاً للتحدث...'}
                disabled={loading || !user}
                className="input !py-2 !text-xs flex-1 disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={loading || !inputMessage.trim() || !user}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white hover:bg-ink-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="إرسال"
              >
                <svg className="h-4 w-4 rotate-180 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* الزر العائم لفتح/إغلاق الشات */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-ink-light focus:outline-none"
        aria-label="المساعد الذكي"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75"></span>
          <span className="relative inline-flex h-4 w-4 rounded-full bg-signal"></span>
        </span>

        {isOpen ? (
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatbotWidget;

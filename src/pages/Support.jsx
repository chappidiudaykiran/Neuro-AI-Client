import { useState, useEffect, useRef } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

// NUCLEAR-SAFE STUDENT SUPPORT PAGE
// This page uses ZERO vulnerable property access.
// All object navigation is guarded by logical presence checks.

export default function Support() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const chatEndRef = useRef(null);

  // Derive primitive UserID to avoid property access crashes
  const currentUserId = user ? (user._id || user.id || 'unknown') : 'guest';

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); 
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (messages && messages.length > 0) scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/support');
      const tickets = (res.data && res.data.tickets) ? res.data.tickets : [];
      
      const thread = [];
      tickets.forEach(t => {
          if (!t) return;
          // Initial Message
          thread.push({ 
            _id: t._id, 
            text: t.message || '', 
            sender: t.studentId || null, 
            date: t.createdAt, 
            type: 'init' 
          });
          // Replies
          if (t.replies && Array.isArray(t.replies)) {
              t.replies.forEach(r => {
                if (!r) return;
                thread.push({ 
                    _id: t._id, 
                    text: r.message || '', 
                    sender: r.senderId || null, 
                    date: r.createdAt, 
                    type: 'reply' 
                });
              });
          }
      });
      
      const sorted = thread.sort((a, b) => new Date(a.date) - new Date(b.date));
      setMessages(prev => (prev && prev.length !== sorted.length) ? sorted : prev);
    } catch (err) {
      console.error('[NUCLEAR-SUPPORT] fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!reply || !user) {
      if (!user) alert('Authentication Required: Please log in to chat.');
      return;
    }
    
    try {
      const initMessages = messages ? messages.filter(m => m && m.type === 'init') : [];
      const latestTicket = initMessages.length > 0 ? initMessages[initMessages.length - 1] : null;
      const ticketId = latestTicket ? latestTicket._id : null;
      
      const localReply = reply;
      setReply(''); // Optimistic clear

      if (ticketId) {
        await api.post('/support/' + ticketId + '/reply', { message: localReply });
      } else {
        await api.post('/support', { subject: 'Support Chat', message: localReply });
      }

      fetchMessages();
    } catch (err) {
      console.error('[NUCLEAR-SUPPORT] send error:', err);
      // Detailed alert but safe
      const msg = err.response && err.response.data && err.response.data.message 
                ? err.response.data.message 
                : err.message;
      alert('Network Error: ' + msg);
    }
  };

  return (
    <div className="page theme-dashboard pt-14">
      <div className="container py-2 md:py-4 max-w-4xl mx-auto px-3 md:px-6">
        <header className="page-header text-center py-3 md:py-4 mb-2 md:mb-4 border-none">
          <h1 className="page-title text-text text-2xl md:text-4xl">Educator Support</h1>
          <p className="text-[10px] font-black uppercase text-accent tracking-[0.2em] mt-1 opacity-60">Secure channel to educators</p>
        </header>

        <div className="chat-container glass-panel h-[calc(100vh-180px)] md:h-[70vh] flex flex-col border-accent/10 shadow-2xl overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3 md:p-8 space-y-4 md:space-y-6 bg-white/5">
            {loading ? (
              <div className="loading-center py-20"><div className="spinner" /></div>
            ) : (!messages || messages.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-40">
                <p className="text-text font-medium text-sm">No messages yet. Send a message to start.</p>
              </div>
            ) : (
              <>
                {messages.map((m, i) => {
                  if (!m) return null;
                  const senderObj = m.sender || {};
                  const senderId = String(senderObj._id || senderObj || '');
                  const isSender = senderId === String(currentUserId);
                  
                  return (
                    <div key={i} className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3 md:p-4 rounded-[20px] text-[13px] md:text-[14px] leading-relaxed shadow-sm transition-all ${
                        isSender ? 'chat-bubble-sender' : 'chat-bubble-receiver'
                      } max-w-[90%] md:max-w-[85%]`}>
                        {m.text}
                      </div>
                      <span className="text-[9px] md:text-[10px] text-text3 mt-1.5 md:mt-2 mx-2 opacity-60 font-bold uppercase tracking-tighter">
                        {isSender ? 'You' : 'Educator'} • {new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </>
            )}
          </div>

          <div className="p-2 md:p-4 bg-bg2/50 border-t border-border/10 backdrop-blur-md">
            <form onSubmit={handleSend} className="chat-input-container">
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none py-2 text-sm text-text placeholder:text-text3"
                  placeholder="Ask your question..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button type="submit" className={`p-2.5 rounded-xl transition-all ${reply ? 'bg-accent text-white shadow-lg' : 'bg-bg3 text-text3 opacity-30 cursor-not-allowed'}`} disabled={!reply}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

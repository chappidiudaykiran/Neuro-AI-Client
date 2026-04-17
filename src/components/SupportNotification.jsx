import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function SupportNotification() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const prevCountRef = useRef(null);
  const timerRef = useRef(null);

  const isEducator = user?.role === 'educator' || user?.role === 'admin';

  useEffect(() => {
    if (!user) return;

    const poll = async () => {
      try {
        const res = await api.get('/support');
        const tickets = res.data?.tickets || [];

        // Count total messages (initial + replies)
        let totalMessages = 0;
        let latestSenderName = '';
        let latestText = '';
        let latestDate = null;

        tickets.forEach(t => {
          totalMessages++; // initial message
          if (t.replies) totalMessages += t.replies.length;

          // Track the most recent message not from this user
          const myId = String(user._id || user.id || '');

          // Check replies (newest first)
          if (t.replies?.length > 0) {
            for (let i = t.replies.length - 1; i >= 0; i--) {
              const r = t.replies[i];
              const rSenderId = String(r.senderId?._id || r.senderId || '');
              const rDate = new Date(r.createdAt);
              if (rSenderId !== myId && (!latestDate || rDate > latestDate)) {
                latestDate = rDate;
                latestText = r.message || '';
                latestSenderName = r.senderId?.name || (isEducator ? 'Student' : 'Educator');
              }
            }
          }

          // Check initial message
          const initSenderId = String(t.studentId?._id || t.studentId || '');
          const initDate = new Date(t.createdAt);
          if (initSenderId !== myId && (!latestDate || initDate > latestDate)) {
            latestDate = initDate;
            latestText = t.message || '';
            latestSenderName = t.studentId?.name || 'Student';
          }
        });

        const previousCount = prevCountRef.current || 0;

        // New message detected (or first load with messages)
        if (totalMessages > previousCount) {
          // We removed the 'onSupportPage' check so you can see it anywhere!
          if (latestText) {
            setNotification({
              sender: latestSenderName,
              text: latestText.length > 60 ? latestText.slice(0, 60) + '…' : latestText,
            });

            // Auto-dismiss after 5 seconds
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setNotification(null), 5000);
          }
          prevCountRef.current = totalMessages;
        }
      } catch {
        // Silently ignore — user might not be authenticated yet
      }
    };

    poll();
    const interval = setInterval(poll, 8000);
    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, location.pathname]);

  const handleClick = () => {
    setNotification(null);
    navigate(isEducator ? '/educator/support' : '/support');
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    setNotification(null);
  };

  if (!notification) return null;

  return (
    <div
      onClick={handleClick}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] cursor-pointer animate-slide-down"
      style={{ animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-accent text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 backdrop-blur-xl min-w-[300px] max-w-[480px]">
        {/* Bell icon */}
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-black uppercase tracking-wider opacity-80">New Support Message</div>
          <div className="text-sm font-semibold truncate mt-0.5">
            <span className="font-black">{notification.sender}:</span> {notification.text}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center shrink-0 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

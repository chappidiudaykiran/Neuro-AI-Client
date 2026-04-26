import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function EducatorSupport() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const chatEndRef = useRef(null);
  const autoSelectedRef = useRef(false);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 10000); 
    return () => clearInterval(interval);
  }, []);

  // Auto-select student from URL query param (e.g. from Insights page)
  useEffect(() => {
    const studentId = searchParams.get('targetUid') || searchParams.get('studentId');
    console.log('[DEBUG] Auto-select useEffect fired. URL studentId:', studentId, '| students count:', students.length);
    if (!studentId) return;

    // derived ID from current selected student
    const currentSelectedId = String(selectedStudent?.studentInfo?.id || selectedStudent?.studentInfo?._id || selectedStudent?._id || '');
    
    // IF the URL student matches the selected one, don't re-select
    if (currentSelectedId === studentId) return;

    const tryAutoSelect = async () => {
      // 1. Try to find in existing support summary
      const match = students.find(s => {
        const sid = String(s.studentInfo?.id || s.studentInfo?._id || s._id || '');
        return sid === studentId;
      });

      if (match) {
        console.log('[DEBUG] Found match in summary:', JSON.stringify({ _id: match._id, name: match.studentInfo?.name }));
        setLoadingMessages(true);
        setSelectedStudent(match);
        return;
      }

      console.log('[DEBUG] No match in summary. Fetching from /educator/students...');

      // 2. If not in summary, fetch student info from general list
      try {
        setLoadingMessages(true);
        const res = await api.get('/educator/students');
        const allStudents = res.data;
        const s = allStudents.find(user => String(user._id) === studentId);
        if (s) {
          console.log('[DEBUG] Found student from API:', JSON.stringify({ _id: s._id, name: s.name }));
          setSelectedStudent({
            _id: s._id,
            studentInfo: { name: s.name, email: s.email, id: s._id },
            lastMessage: 'New Conversation',
            lastUpdate: new Date().toISOString(),
            isNewThread: true
          });
        } else {
          console.log('[DEBUG] Student NOT found in /educator/students either!');
          setLoadingMessages(false);
          // Optional: clear if not found at all
          // setSelectedStudent(null);
        }
      } catch (err) {
        console.error("Failed to fetch student info for auto-chat", err);
        setLoadingMessages(false);
      }
    };

    tryAutoSelect();
  }, [searchParams, students, selectedStudent]);

  useEffect(() => {
    let interval;
    if (selectedStudent) {
       fetchStudentMessages(selectedStudent._id);
       interval = setInterval(() => fetchStudentMessages(selectedStudent._id), 5000); 
    } else {
       setMessages([]);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [selectedStudent]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages]);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/support/summary');
      setStudents(res.data.summary);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentMessages = async (studentId) => {
    try {
      const res = await api.get(`/support?studentId=${studentId}`);
      const thread = res.data.tickets.reduce((acc, t) => {
        const initSender = t.isEducatorInitiated ? '222222222222222222222222' : t.studentId;
        acc.push({ _id: t._id, text: t.message, sender: initSender, date: t.createdAt, type: 'init' });
        t.replies.forEach(r => {
          acc.push({ _id: t._id, text: r.message, sender: r.senderId, date: r.createdAt, type: 'reply' });
        });
        return acc;
      }, []);
      const sorted = thread.sort((a, b) => new Date(a.date) - new Date(b.date));
      setMessages(prev => prev.length !== sorted.length ? sorted : prev);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectStudent = (student) => {
    setLoadingMessages(true);
    setSelectedStudent(student);
  };

  const handleBack = () => {
    setSelectedStudent(null);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply || !selectedStudent) return;
    console.log('[DEBUG] handleReply | selectedStudent:', JSON.stringify({
      _id: selectedStudent._id,
      name: selectedStudent.studentInfo?.name,
      isNewThread: selectedStudent.isNewThread,
      messagesLen: messages.length,
    }));
    console.log('[DEBUG] handleReply | current user._id:', user?._id, '| user.id:', user?.id);
    try {
      if (selectedStudent.isNewThread || messages.length === 0) {
        // Create new ticket for the student
        const targetStudentId = selectedStudent._id;
        if (!targetStudentId || targetStudentId === user?._id) {
            throw new Error("Invalid student selection detected");
        }

        await api.post('/support', {
          studentId: targetStudentId,
          subject: 'Academic Support from Instructor',
          message: reply
        });
      } else {
        // Reply to existing ticket
        const latestTicketId = messages.filter(m => m.type === 'init').pop()?._id;
        if (!latestTicketId) {
          // Fallback to creating a ticket if filtering failed
          await api.post('/support', { studentId: selectedStudent._id, message: reply });
        } else {
          await api.post(`/support/${latestTicketId}/reply`, { message: reply });
        }
      }
      
      setReply('');
      fetchStudentMessages(selectedStudent._id);
      fetchSummary();
      // Remove isNewThread flag if it was there
      if (selectedStudent.isNewThread) {
        setSelectedStudent(prev => ({ ...prev, isNewThread: false }));
      }
    } catch (err) {
      alert('Failed to send reply: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="theme-courses fixed inset-0 top-16 overflow-hidden">
      <div className="mx-auto max-w-7xl h-full py-2 md:py-4 px-2 md:px-6 overflow-hidden">
        <div className="flex h-full rounded-2xl border border-accent/10 bg-bg2/80 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in">
          
          {/* SIDEBAR — visible on desktop always, on mobile only when no student selected */}
          <aside className={`${selectedStudent ? 'hidden md:flex' : 'flex'} w-full md:w-[350px] border-r border-border/50 bg-bg2/50 flex-col h-full overflow-hidden`}>
            <div className="p-4 md:p-6 border-b border-border/50 bg-bg2">
               <h2 className="text-lg md:text-xl font-black text-text tracking-tight">Support Inbox</h2>
               <p className="text-[10px] text-text3 font-bold uppercase tracking-widest mt-1 opacity-70">
                 {students.length} Student Threads
               </p>
            </div>
            
            <div className="flex-1 overflow-y-auto chat-scroll-area">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="p-6 border-b border-border/20 animate-pulse bg-white/5" />)
              ) : students.length === 0 ? (
                <div className="p-10 text-center opacity-50 italic text-sm text-text2">No active student queries.</div>
              ) : (
                students.map(s => (
                  <div 
                    key={s._id}
                    onClick={() => handleSelectStudent(s)}
                    className={`p-4 md:p-5 flex items-start gap-3 md:gap-4 cursor-pointer transition-all border-b border-border/20 group hover:bg-accent/[0.03] ${selectedStudent?._id === s._id ? 'bg-accent/[0.05] border-l-4 border-l-accent' : 'border-l-4 border-l-transparent'}`}
                  >
                    <div className="relative shrink-0">
                       <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden flex items-center justify-center font-bold text-base md:text-lg shadow-inner transition-all ${selectedStudent?._id === s._id ? 'bg-accent text-white scale-105' : 'bg-accent/10 text-accent group-hover:bg-accent/20'}`}>
                         {s.studentInfo.photo ? (
                           <img src={s.studentInfo.photo} alt={s.studentInfo.name} className="w-full h-full object-cover" />
                         ) : (
                           s.studentInfo.name.charAt(0)
                         )}
                       </div>
                       <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-bg2 rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-center mb-1">
                          <h3 className={`text-sm font-bold truncate ${selectedStudent?._id === s._id ? 'text-accent' : 'text-text'}`}>
                            {s.studentInfo.name}
                          </h3>
                          <span className="text-[9px] font-bold text-text3 opacity-60 shrink-0 ml-2">
                            {new Date(s.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                       <p className="text-[11px] text-text2 line-clamp-1 opacity-80 italic">
                          "{s.lastMessage}"
                       </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* CHAT AREA — visible on desktop always, on mobile only when student is selected */}
          <main className={`${selectedStudent ? 'flex' : 'hidden md:flex'} flex-1 flex-col h-full bg-white/5 relative overflow-hidden`}>
            {selectedStudent ? (
              <>
                <div className="p-3 md:p-5 border-b border-border/50 bg-bg2/30 backdrop-blur-md flex items-center gap-3">
                  {/* Back button — mobile only */}
                  <button 
                    onClick={handleBack}
                    className="md:hidden flex items-center justify-center w-8 h-8 rounded-xl bg-bg3 hover:bg-accent/10 text-text2 transition-colors shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-accent text-white overflow-hidden flex items-center justify-center font-bold shadow-lg text-sm md:text-base shrink-0">
                    {selectedStudent.studentInfo.photo ? (
                      <img src={selectedStudent.studentInfo.photo} alt={selectedStudent.studentInfo.name} className="w-full h-full object-cover" />
                    ) : (
                      selectedStudent.studentInfo.name.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] md:text-[14px] font-bold text-text leading-none mb-0.5 truncate">{selectedStudent.studentInfo.name}</h3>
                    <p className="text-[9px] md:text-[10px] text-text3 font-medium opacity-70 uppercase tracking-tighter truncate">{selectedStudent.studentInfo.email}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 chat-scroll-area">
                  {loadingMessages ? (
                    <div className="loading-center py-20"><div className="spinner" /></div>
                  ) : (
                    <>
                      {messages.map((m, i) => {
                        const myId = String(user?._id || user?.id || '');
                        const senderId = String(m.sender?._id || m.sender || '');
                        const isSender = (senderId === myId) || (m.type === 'reply' && !m.sender);
                        
                        const studentName = selectedStudent?.studentInfo?.name || 'Student';
                        
                        return (
                          <div key={i} className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} animate-message-in`}>
                            <div className={`p-3 md:p-4 rounded-[20px] text-[13px] md:text-[14px] leading-relaxed transition-all shadow-sm ${
                              isSender ? 'chat-bubble-sender' : 'chat-bubble-receiver'
                            } max-w-[90%] md:max-w-[70%]`}>
                              {m.text}
                            </div>
                            <span className="text-[9px] md:text-[10px] text-text3 mt-1.5 md:mt-2 mx-2 opacity-60">
                              {isSender ? 'You' : studentName} • {new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })}
                      <div ref={chatEndRef} />
                    </>
                  )}
                </div>

                <div className="p-2 md:p-4 bg-bg2/50 border-t border-border/30 backdrop-blur-md">
                  <form onSubmit={handleReply} className="chat-input-container">
                      <div className="flex-1 flex items-center px-2 gap-2">
                        <svg className="w-4 h-4 text-text3 shrink-0 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <input
                          type="text"
                          className="flex-1 bg-transparent border-none outline-none py-2 text-sm text-text placeholder:text-text3"
                          placeholder={`Reply to ${selectedStudent.studentInfo.name.split(' ')[0]}...`}
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                        />
                      </div>
                      <button type="submit" className={`flex items-center justify-center p-2 md:p-2.5 rounded-xl shrink-0 transition-all ${reply ? 'bg-accent text-white shadow-lg shadow-accent/20 hover:-translate-y-0.5' : 'bg-bg3 text-text3 cursor-not-allowed'}`} disabled={!reply}>
                        <svg className="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                      </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center opacity-60 h-full animate-fade-in">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/10 rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-text mb-2">Select a Conversation</h2>
                <p className="max-w-[280px] md:max-w-[300px] text-xs md:text-sm text-text2 font-medium">Select a student from the inbox to start providing academic support in real-time.</p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

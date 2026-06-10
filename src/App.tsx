import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Stethoscope, Users, Bell, Settings2, Activity } from 'lucide-react';

import { Child, Reservation, AppMode } from './types';
import { DEFAULT_CHILDREN } from './data/defaultChildren';
import { KioskView } from './components/KioskView';
import { ClerkView } from './components/ClerkView';
import { AdminView } from './components/AdminView';
import { CallOverlay } from './components/CallOverlay';

export default function App() {
  // --- 1. State Management & LocalStorage Persistence ---
  
  // Children database list state
  const [children, setChildren] = useState<Child[]>(() => {
    const saved = localStorage.getItem('mind_hospital_children');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_CHILDREN;
  });

  // Ticket queue reservation list state
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('mind_hospital_reservations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Active view mode ('kiosk' is patient kiosk, 'clerk' is patient listing, 'admin' is teacher panel)
  const [mode, setMode] = useState<AppMode>('kiosk');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mind_hospital_children', JSON.stringify(children));
  }, [children]);

  useEffect(() => {
    localStorage.setItem('mind_hospital_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // --- 2. Action Handlers ---

  // Add child to registration queue (Kiosk action)
  const handleAddReservation = (child: Child): Reservation => {
    // Determine next sequential ticket number starting from 1
    const nextNumber = reservations.length > 0
      ? Math.max(...reservations.map(r => r.ticketNumber)) + 1
      : 1;

    const newReservation: Reservation = {
      id: `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      childId: child.id,
      childName: child.name,
      avatarEmoji: child.avatarEmoji,
      avatarBg: child.avatarBg,
      ticketNumber: nextNumber,
      status: 'waiting',
      timestamp: new Date().toISOString()
    };

    setReservations(prev => [...prev, newReservation]);
    return newReservation;
  };

  // Call the next waiting patient (Clerk action)
  const handleCallNext = () => {
    const firstWaiting = reservations.find(r => r.status === 'waiting');
    if (!firstWaiting) return;

    // Transition all other active "calling" tickets to "done"
    setReservations(prev => 
      prev.map(r => {
        if (r.id === firstWaiting.id) {
          return { ...r, status: 'calling', calledAt: new Date().toISOString() };
        } else if (r.status === 'calling') {
          return { ...r, status: 'done' };
        }
        return r;
      })
    );
  };

  // Call specific patient (Clerk action)
  const handleCallSpecific = (resId: string) => {
    setReservations(prev =>
      prev.map(r => {
        if (r.id === resId) {
          return { ...r, status: 'calling', calledAt: new Date().toISOString() };
        } else if (r.status === 'calling') {
          return { ...r, status: 'done' };
        }
        return r;
      })
    );
  };

  // Mark patient as done/complete
  const handleCompleteReservation = (resId: string) => {
    setReservations(prev =>
      prev.map(r => r.id === resId ? { ...r, status: 'done' } : r)
    );
  };

  // Cancel/delete patient registration
  const handleCancelReservation = (resId: string) => {
    setReservations(prev => prev.filter(r => r.id !== resId));
  };

  // Create new pupil (Admin action)
  const handleAddChild = (name: string, emoji: string, bgClass: string, autoRegister?: boolean) => {
    const newChild: Child = {
      id: `child-${Date.now()}`,
      name,
      avatarEmoji: emoji,
      avatarBg: bgClass
    };
    setChildren(prev => [...prev, newChild]);
    if (autoRegister) {
      handleAddReservation(newChild);
    }
  };

  // Delete pupil (Admin action)
  const handleRemoveChild = (childId: string) => {
    setChildren(prev => prev.filter(c => c.id !== childId));
  };

  // Reset pupils database back to standard default classroom (Admin action)
  const handleRestoreChildren = () => {
    if (window.confirm("원래 준비된 12명의 샘플 어린이들 데이터로 복합 원상복구 하시겠습니까?")) {
      setChildren(DEFAULT_CHILDREN);
    }
  };

  // Clear registration queue completely (Admin action)
  const handleClearQueue = () => {
    if (window.confirm("접수 대기 목록을 다 지우고 다시 시작하시겠습니까? (이전 번호들이 1번부터 리셋됩니다)")) {
      setReservations([]);
    }
  };

  // Active calling patient overlay helper
  const activeCallingPatient = reservations.find(r => r.status === 'calling') || null;

  return (
    <div className="min-h-screen flex flex-col font-sans" id="hospital-main-app">
      
      {/* --- Hospital Play Center Control Header --- */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-hospital-coral text-white rounded-2xl flex items-center justify-center text-2xl shadow-md shadow-hospital-coral/20 transform hover:rotate-6 transition-all">
              ♥
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-800 tracking-tight font-kids flex items-center gap-2">
                <span>마음병원 <span className="text-hospital-coral">접수처</span></span> 
                <span className="text-xs px-2.5 py-0.5 bg-hospital-mint text-hospital-clay font-sans font-bold rounded-full border border-hospital-mint/50">Kiosk Playground</span>
              </h1>
            </div>
          </div>

          {/* Role Switching Interactive Tabs */}
          <nav className="flex items-center bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            <button
              id="nav-tab-kiosk"
              onClick={() => setMode('kiosk')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all ${
                mode === 'kiosk'
                  ? 'bg-hospital-clay text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Stethoscope size={16} />
              <span className="font-kids text-base">접수 키오스크 (환자용)</span>
            </button>

            <button
              id="nav-tab-clerk"
              onClick={() => setMode('clerk')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all ${
                mode === 'clerk'
                  ? 'bg-hospital-clay text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Bell size={16} />
              <span className="font-kids text-base">접수원 대기판 (호출용)</span>
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => setMode('admin')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all ${
                mode === 'admin'
                  ? 'bg-hospital-clay text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Settings2 size={16} />
              <span className="font-kids text-base">선생님 관리 (명단설정)</span>
            </button>
          </nav>
        </div>
      </header>

      {/* --- Main Contents Area with Layout Animations --- */}
      <main className="flex-1 flex flex-col p-6 bg-[#FDFBF7]">
        <AnimatePresence mode="wait">
          {mode === 'kiosk' && (
            <motion.div
              key="kiosk-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col"
              id="view-container-kiosk"
            >
              <KioskView
                children={children}
                reservations={reservations}
                onAddReservation={handleAddReservation}
              />
            </motion.div>
          )}

          {mode === 'clerk' && (
            <motion.div
              key="clerk-mode"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex-1 flex flex-col"
              id="view-container-clerk"
            >
              <ClerkView
                reservations={reservations}
                onCallNext={handleCallNext}
                onCallSpecific={handleCallSpecific}
                onCompleteReservation={handleCompleteReservation}
                onCancelReservation={handleCancelReservation}
              />
            </motion.div>
          )}

          {mode === 'admin' && (
            <motion.div
              key="admin-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col"
              id="view-container-admin"
            >
              <AdminView
                children={children}
                reservations={reservations}
                onAddChild={handleAddChild}
                onRemoveChild={handleRemoveChild}
                onRestoreChildren={handleRestoreChildren}
                onClearQueue={handleClearQueue}
                onAddReservation={handleAddReservation}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- Full-Screen Notification Overlay (딩동댕 호출) --- */}
      <CallOverlay
        callingReservation={activeCallingPatient}
        onDismiss={() => {
          if (activeCallingPatient) {
            handleCompleteReservation(activeCallingPatient.id);
          }
        }}
      />
      
      {/* Mini Info Footer */}
      <footer className="py-4 text-center text-[11px] text-stone-400 border-t border-stone-200 bg-white/50">
        마음의 이야기를 따뜻하게 품어주는 마음병원 Kiosk • 본 프로그램은 유아 역할놀이 보조용 교육 앱입니다 • Designed with Local State Storage
      </footer>

    </div>
  );
}

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Smile, Stethoscope, Heart, Sparkles } from 'lucide-react';
import { Reservation } from '../types';
import { playChime } from '../utils/audio';

interface CallOverlayProps {
  callingReservation: Reservation | null;
  onDismiss: () => void;
}

export const CallOverlay: React.FC<CallOverlayProps> = ({
  callingReservation,
  onDismiss,
}) => {
  useEffect(() => {
    if (callingReservation) {
      // Automatically play sound when the overlay loads
      const timer = setTimeout(() => {
        playChime();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [callingReservation]);

  if (!callingReservation) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
        id="call-overlay-bg"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative w-full max-w-2xl bg-white border-8 border-hospital-coral rounded-[32px] p-8 text-center kids-shadow-coral overflow-hidden"
          id="call-overlay-card"
        >
          {/* Animated decorative hearts and stars */}
          <div className="absolute top-4 left-4 text-hospital-coral opacity-60 animate-bounce">
            <Heart size={36} fill="currentColor" />
          </div>
          <div className="absolute top-12 right-12 text-hospital-yellow opacity-60 animate-pulse">
            <Sparkles size={40} />
          </div>
          <div className="absolute bottom-6 left-10 text-hospital-clay opacity-30 animate-spin" style={{ animationDuration: '6s' }}>
            <Smile size={44} />
          </div>

          <div className="flex flex-col items-center">
            {/* Soft pulsing ring */}
            <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-hospital-peach mb-6 border-4 border-hospital-peach">
              <span className={`text-7xl ${callingReservation.avatarBg} p-5 rounded-full ring-4 ring-white/50 animate-pulse`}>
                {callingReservation.avatarEmoji}
              </span>
              <div className="absolute -bottom-2 -right-2 bg-hospital-coral text-white p-3 rounded-full shadow-lg border-2 border-white">
                <Stethoscope size={28} className="animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            </div>

            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold font-kids text-hospital-clay mb-2">
                딩동댕~ 🔔 진료차례 안내
              </h2>
              
              <div className="bg-hospital-peach rounded-[24px] px-8 py-5 border-4 border-dashed border-hospital-coral/40 my-4 inline-block">
                <span className="text-4xl lg:text-5xl font-extrabold text-[#3F3F2C] tracking-wider font-kids">
                  {callingReservation.ticketNumber}번 {callingReservation.childName} 친구!
                </span>
              </div>

              <p className="text-2xl font-bold font-kids text-stone-600 mt-4 leading-relaxed">
                진료실로 오세요~ 💕<br/>
                마음에 정성을 가득 담아 의사 선생님이 기다리고 있어요!
              </p>
            </motion.div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                id="replay-sound-btn"
                onClick={() => playChime()}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-hospital-clay bg-white hover:bg-hospital-peach text-hospital-clay font-bold text-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all w-full sm:w-auto font-kids"
              >
                <Volume2 size={24} />
                <span>소리 다시 듣기</span>
              </button>

              <button
                id="hospital-enter-btn"
                onClick={onDismiss}
                className="flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-hospital-clay hover:bg-stone-700 text-white font-bold text-2xl cursor-pointer transform hover:scale-105 active:scale-95 transition-all shadow-lg kids-shadow-clay border-b-6 border-stone-800 w-full sm:w-auto font-kids"
              >
                <Smile size={28} />
                <span>진료실로 가요! 🚪</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

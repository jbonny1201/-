import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, X, RotateCcw, Heart, Smile, Sparkles, AlertCircle, Clock } from 'lucide-react';
import { Child, Reservation, KioskStep } from '../types';
import { Receipt } from './Receipt';
import { playSuccessChime } from '../utils/audio';

interface KioskViewProps {
  children: Child[];
  reservations: Reservation[];
  onAddReservation: (child: Child) => Reservation;
  onResetKiosk?: () => void;
}

export const KioskView: React.FC<KioskViewProps> = ({
  children,
  reservations,
  onAddReservation,
}) => {
  const [step, setStep] = useState<KioskStep>('welcome');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [latestReservation, setLatestReservation] = useState<Reservation | null>(null);
  
  // Back timer for Waiting Screen / Complete Screen to return to Home screen automatically after 10s
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'complete' || step === 'waiting-screen') {
      timer = setTimeout(() => {
        handleReset();
      }, 12000); // 12 seconds auto-return
    }
    return () => clearTimeout(timer);
  }, [step]);

  const handleStart = () => {
    setSelectedChild(null);
    setLatestReservation(null);
    setStep('select-name');
  };

  const handleSelectChild = (child: Child) => {
    setSelectedChild(child);
    setStep('confirm-name');
  };

  const handleConfirmChild = () => {
    if (!selectedChild) return;
    
    // Play success ding/arpeggio
    playSuccessChime();

    const reservation = onAddReservation(selectedChild);
    setLatestReservation(reservation);
    setStep('complete');
  };

  const handleReset = () => {
    setSelectedChild(null);
    setLatestReservation(null);
    setStep('welcome');
  };

  // Get current queue statistics
  const waitingReservations = reservations.filter(r => r.status === 'waiting');
  const currentlyCalling = reservations.filter(r => r.status === 'calling');

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full min-h-[80vh]">
      <AnimatePresence mode="wait">
        
        {/* Step 1: Welcome Screen (시작 화면) */}
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="text-center p-10 bg-white border-4 border-hospital-mint rounded-[32px] shadow-lg max-w-2xl w-full relative"
            id="step-welcome"
          >
            <div className="relative inline-block mb-6 animate-bounce">
              <img
                src="https://i.ibb.co/kVZMwjnB/1.png"
                alt="마음병원 접수처"
                className="w-32 h-32 object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-2 -right-2 text-hospital-coral bg-white p-2.5 rounded-full shadow-md border-2 border-hospital-peach">
                <Heart size={24} fill="currentColor"/>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 tracking-tight font-kids mb-6">
              마음병원에 오신 것을<br/>환영합니다
            </h1>
            
            <p className="text-lg md:text-xl text-stone-600 leading-relaxed font-sans mb-10 text-pretty bg-hospital-peach/60 p-6 rounded-2xl border border-dashed border-hospital-coral/30">
              오늘 내 예쁜 마음에 상처가 났거나 위로받고 싶다면,<br/>
              먼저 접수를 해서 대기표를 받아주세요.
            </p>

            <motion.button
              id="kiosk-start-btn"
              onClick={handleStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-14 py-6 rounded-full bg-hospital-clay hover:bg-stone-700 text-white font-bold text-3xl cursor-pointer shadow-lg kids-shadow-clay hover:border-b-2 border-b-8 border-stone-800 transition-all font-kids"
            >
              접수하기 🛎️
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Name Selection (이름 선택) */}
        {step === 'select-name' && (
          <motion.div
            key="select-name"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col"
            id="step-select-name"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-stone-800 font-kids mb-2 flex items-center justify-center gap-2">
                내 이름을 찾아보세요 🔍
              </h2>
            </div>

            {/* Kids Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-2 max-h-[50vh] overflow-y-auto mb-6 scrollbar-thin">
              {children.length === 0 ? (
                <div className="col-span-full py-12 text-center text-stone-400 font-medium bg-white rounded-3xl p-8 border">
                  <AlertCircle className="mx-auto mb-2 text-hospital-coral" size={36} />
                  등록된 어린이가 없어요.<br />선생님 관리 메뉴에서 어린이를 등록해주세요.
                </div>
              ) : (
                children.map(child => (
                  <motion.button
                    key={child.id}
                    id={`child-card-${child.id}`}
                    onClick={() => handleSelectChild(child)}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-6 bg-white rounded-[32px] border-4 border-transparent hover:border-hospital-coral text-center flex flex-col items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-95 duration-200"
                  >
                    <div className={`w-24 h-24 rounded-full ${child.avatarBg} flex items-center justify-center mb-4 border-4 border-white shadow-xs`}>
                      <span className="text-4xl">{child.avatarEmoji}</span>
                    </div>
                    <span className="text-2xl font-bold text-stone-800 tracking-wide font-kids block truncate max-w-full">
                      {child.name}
                    </span>
                  </motion.button>
                ))
              )}
            </div>

            <button
              id="kiosk-back-btn"
              onClick={handleReset}
              className="self-center flex items-center gap-2 text-hospital-clay hover:text-stone-900 font-bold bg-hospital-peach/80 hover:bg-hospital-peach px-6 py-3 rounded-full text-base transition-all font-kids border border-hospital-coral/30"
            >
              <ArrowLeft size={18} />
              <span>처음 화면으로 돌아가기</span>
            </button>
          </motion.div>
        )}

        {/* Step 3: Name Confirmation (이름 확인) */}
        {step === 'confirm-name' && selectedChild && (
          <motion.div
            key="confirm-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center p-10 bg-white border-4 border-hospital-mint rounded-[32px] shadow-lg max-w-xl w-full border-dashed"
            id="step-confirm-name"
          >
            <div className="flex flex-col items-center mb-8">
              <div className={`w-28 h-28 rounded-full ${selectedChild.avatarBg} flex items-center justify-center mb-4 border-4 border-white shadow-md animate-pulse`}>
                <span className="text-5xl">{selectedChild.avatarEmoji}</span>
              </div>
              
              <h2 className="text-3xl font-bold text-stone-800 font-kids leading-snug">
                <span className="text-hospital-coral underline decoration-hospital-yellow underline-offset-4">{selectedChild.name}</span> 친구가 맞나요?
              </h2>
              <p className="text-sm text-stone-500 mt-3 font-sans">나의 멋진 정보가 맞으면 초록색 동그라미를, 틀리면 회색 화살표를 눌러주세요.</p>
            </div>

            <div className="flex gap-4 w-full">
              <button
                id="kiosk-cancel-confirm-btn"
                onClick={() => setStep('select-name')}
                className="flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-[24px] border-2 border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 font-bold text-lg cursor-pointer transform hover:scale-[1.03] active:scale-[0.97] transition-all font-kids"
              >
                <div className="bg-stone-200 text-stone-600 p-3 rounded-full shadow-inner">
                  <RotateCcw size={32} />
                </div>
                <span>다시 고르기 ↩️</span>
              </button>

              <button
                id="kiosk-confirm-ok-btn"
                onClick={handleConfirmChild}
                className="flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-[24px] bg-hospital-coral hover:bg-[#e07e66] text-white font-bold text-xl cursor-pointer transform hover:scale-[1.03] active:scale-[0.97] transition-all shadow-md kids-shadow-coral border-b-8 border-[#c95d44]"
              >
                <div className="bg-white text-hospital-coral p-3 rounded-full shadow-md animate-bounce">
                  <Check size={32} strokeWidth={3} />
                </div>
                <span className="font-kids text-2xl">맞아요 👍</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Registration Completed (접수 완료 + 접수증 보여주기) */}
        {step === 'complete' && latestReservation && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center"
            id="step-complete"
          >
            <div className="text-center mb-6">
              <div className="inline-flex text-hospital-coral items-center justify-center p-3.5 bg-hospital-peach rounded-full border border-hospital-peach mb-2">
                <Sparkles size={28} className="animate-pulse" />
              </div>
              <h2 className="text-3xl font-extrabold text-stone-800 font-kids mb-1">
                접수가 완료되었어요! 🎉
              </h2>
              <p className="text-sm text-stone-500 font-sans">
                아래 대기표를 확인하고 의사 선생님을 만나러 진료실 앞에서 기다려주세요!
              </p>
            </div>

            {/* Receipt display */}
            <div className="mb-8 w-full flex justify-center">
              <Receipt reservation={latestReservation} />
            </div>

            <div className="flex flex-col items-center gap-2">
              <motion.button
                id="kiosk-complete-done-btn"
                onClick={() => setStep('waiting-screen')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 rounded-full bg-hospital-clay hover:bg-stone-700 text-white font-bold text-xl cursor-pointer shadow-md kids-shadow-clay border-b-6 border-stone-800 inline-flex items-center gap-2 font-kids"
              >
                <span>기다릴게요 💖</span>
              </motion.button>
              <span className="text-xs text-stone-400 mt-2 font-sans">
                아무 버튼도 누르지 않으면 12초 후 자동으로 대기 대시보드로 넘어갑니다.
              </span>
            </div>
          </motion.div>
        )}

        {/* Step 5: Waiting Instruction / Stats Dashboard (대기 안내) */}
        {step === 'waiting-screen' && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="text-center p-8 bg-white border-4 border-hospital-peach rounded-[32px] shadow-lg max-w-2xl w-full"
            id="step-waiting"
          >
            <div className="relative inline-block mb-6">
              <span className="text-7xl animate-pulse inline-block">⏳</span>
              <div className="absolute -top-1 -right-1 text-hospital-clay bg-white p-2 rounded-full shadow-md border-2 border-hospital-yellow">
                <Clock className="animate-spin" style={{ animationDuration: '4s' }} size={18} />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-stone-800 font-kids mb-4">
              잠시만 더 기다려 주세요!
            </h2>
            
            <p className="text-xl text-stone-600 font-kids leading-relaxed mb-8 max-w-lg mx-auto">
              내 순서가 되면 스피커 소리와 함께 진료실 화면에 내 이름과 번호가 떠요. <br/>
              <span className="text-hospital-coral font-bold bg-hospital-peach px-3 py-1.5 rounded-full mt-3 inline-block font-sans text-sm">마음병원에서는 내 기분을 천천히 편하게 이야기해도 다 들어주신답니다. 💕</span>
            </p>

            {/* Current Queue Mini Board */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto bg-hospital-mint/30 border-2 border-hospital-mint p-5 rounded-2xl mb-8 border-dashed text-hospital-clay">
              <div className="text-center p-2 border-r border-hospital-mint">
                <span className="text-xs text-stone-400 font-bold block mb-1 font-sans">🛎️ 대기인원</span>
                <span className="text-3xl font-extrabold text-hospital-clay font-kids">{waitingReservations.length} 명</span>
              </div>
              <div className="text-center p-2">
                <span className="text-xs text-stone-400 font-bold block mb-1 font-sans">🩺 현재 호출번호</span>
                <span className="text-3xl font-extrabold text-hospital-coral font-kids">
                  {currentlyCalling.length > 0 ? `${currentlyCalling[0].ticketNumber}번` : '없음'}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                id="kiosk-waiting-home-btn"
                onClick={handleReset}
                className="px-8 py-3.5 rounded-full border-2 border-hospital-clay bg-white hover:bg-hospital-peach text-hospital-clay font-bold text-lg cursor-pointer transform hover:scale-[1.02] transition-all font-kids"
              >
                처음 화면으로 (접수 계속하기) ↩️
              </button>
              <span className="text-xs text-stone-400 font-sans">
                12초 후에 자동으로 환영 화면으로 돌아갑니다.
              </span>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

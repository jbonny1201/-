import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Volume2, Check, Trash2, BellRing, Heart, Play, Clock, AlertCircle } from 'lucide-react';
import { Reservation } from '../types';
import { playChime } from '../utils/audio';

interface ClerkViewProps {
  reservations: Reservation[];
  onCallNext: () => void;
  onCallSpecific: (resId: string) => void;
  onCompleteReservation: (resId: string) => void;
  onCancelReservation: (resId: string) => void;
}

export const ClerkView: React.FC<ClerkViewProps> = ({
  reservations,
  onCallNext,
  onCallSpecific,
  onCompleteReservation,
  onCancelReservation,
}) => {
  // Separate queues
  const waitingList = reservations.filter(r => r.status === 'waiting');
  const callingList = reservations.filter(r => r.status === 'calling');
  const completedList = reservations.filter(r => r.status === 'done');

  const activeCallingPatient = callingList[0] || null;

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 flex flex-col gap-6" id="clerk-view-wrapper">
      
      {/* Top dashboard section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Statistics or Status Panel */}
        <div className="bg-white p-6 rounded-[32px] border-2 border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">🛎️ 대기 상태</span>
            <h4 className="text-3xl font-extrabold text-stone-800 font-kids">실시간 현황판</h4>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="text-center bg-hospital-peach/60 p-3 rounded-2xl border border-hospital-coral/20">
              <span className="text-xs text-stone-500 font-bold block mb-1 font-sans">대기</span>
              <span className="text-2xl font-black text-hospital-clay font-kids">{waitingList.length}</span>
            </div>
            <div className="text-center bg-hospital-peach p-3 rounded-2xl border border-hospital-coral">
              <span className="text-xs text-hospital-coral font-bold block mb-1 font-sans">호출</span>
              <span className="text-2xl font-black text-hospital-coral font-kids">{callingList.length}</span>
            </div>
            <div className="text-center bg-hospital-mint p-3 rounded-2xl border border-[#cbe2db]">
              <span className="text-xs text-[#446358] font-bold block mb-1 font-sans">완료</span>
              <span className="text-2xl font-black text-[#446358] font-kids">{completedList.length}</span>
            </div>
          </div>
        </div>

        {/* Huge Call Next Button Panel */}
        <div className="md:col-span-2 bg-hospital-clay text-white p-6 rounded-[32px] kids-shadow-clay flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden border-4 border-stone-800">
          <div className="absolute top-0 right-0 p-8 text-stone-800 opacity-20 pointer-events-none">
            <BellRing size={160} />
          </div>

          <div className="z-10 text-center sm:text-left">
            <span className="text-xs font-bold text-hospital-peach bg-[#434330] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2 font-sans">
              RECEPTIONIST SPECIAL
            </span>
            <h3 className="text-3xl font-extrabold text-white font-kids tracking-wide leading-tight">
              차례를 기다리는 다음 친구 부르기
            </h3>
            <p className="text-sm text-stone-300 mt-1 max-w-sm font-sans">
              주요 소리 알림과 귀여운 전체화면 안내판으로 아이들의 발걸음을 진료실로 이끕니다.
            </p>
          </div>

          <motion.button
            id="clerk-call-next-btn"
            onClick={onCallNext}
            disabled={waitingList.length === 0}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`z-10 shrink-0 px-8 py-5 rounded-full font-bold text-2xl flex items-center gap-3 shadow-lg border-b-6 select-none cursor-pointer transition-all font-kids ${
              waitingList.length > 0
                ? 'bg-hospital-coral hover:bg-[#f57a5b] active:bg-[#e07258] text-white border-[#cc5f45]'
                : 'bg-[#4c4c36] text-stone-500 border-stone-650 cursor-not-allowed'
            }`}
          >
            <BellRing size={28} className="animate-bounce" />
            <span>다음 친구 부르기 🛎️</span>
          </motion.button>
        </div>

      </div>

      {/* Main double column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Currently status and calling information (5 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6" id="clerk-current-calling">
          <div className="bg-white border-2 border-stone-200 rounded-[32px] p-6 shadow-sm flex-1">
            <h4 className="text-lg font-bold text-stone-800 border-b pb-3 mb-4 flex items-center gap-2 font-kids text-xl">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-hospital-coral animate-pulse"></span>
              지금 모시는 분 (호출 중)
            </h4>

            {activeCallingPatient ? (
              <motion.div
                key={activeCallingPatient.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-6 bg-hospital-peach/40 rounded-3xl border-2 border-dashed border-hospital-coral/30"
              >
                <div className="relative">
                  <span className={`text-6xl p-4 rounded-full ${activeCallingPatient.avatarBg} border inline-block mb-3`}>
                    {activeCallingPatient.avatarEmoji}
                  </span>
                  <div className="absolute -bottom-1 -right-1 bg-hospital-coral p-1.5 rounded-full text-white">
                    <Volume2 size={16} />
                  </div>
                </div>

                <span className="text-2xl font-extrabold text-[#3F3F2C] tracking-wide font-kids">
                  {activeCallingPatient.ticketNumber}번 {activeCallingPatient.childName}
                </span>

                <span className="text-xs text-stone-400 font-mono mt-1 font-sans">
                  호출 시간: {new Date(activeCallingPatient.calledAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>

                <div className="flex gap-2 w-full px-4 mt-6">
                  <button
                    id="clerk-recall-btn"
                    onClick={() => onCallSpecific(activeCallingPatient.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full border border-hospital-clay hover:bg-hospital-peach text-hospital-clay font-bold text-sm cursor-pointer transition-all font-kids"
                  >
                    <Volume2 size={16} />
                    <span>다시 부르기</span>
                  </button>

                  <button
                    id="clerk-complete-btn"
                    onClick={() => onCompleteReservation(activeCallingPatient.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full bg-hospital-clay hover:bg-stone-700 text-white font-bold text-sm cursor-pointer shadow border-b-2 border-stone-850 transition-all font-kids"
                  >
                    <Check size={16} />
                    <span>진료 완료 🩺</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 text-stone-400 min-h-[220px]">
                <BellRing size={32} className="mb-2 opacity-50 text-hospital-clay" />
                <span className="text-base font-bold font-kids">현재 호출 중인 어린이가 없습니다.</span>
                <span className="text-xs text-stone-400 mt-1 font-sans">상단의 "다음 친구 부르기"를 눌러 시작하세요.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right column: The Waiting queue rows list table (8 cols) */}
        <div className="lg:col-span-8 flex flex-col" id="clerk-queue-list">
          <div className="bg-white border-2 border-stone-200 rounded-[32px] p-6 shadow-sm flex-1 flex flex-col">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h4 className="text-lg font-bold text-stone-800 flex items-center gap-2 font-kids text-xl">
                <Clock size={18} className="text-hospital-coral" />
                <span>접수한 친구들 대기 명단 ({waitingList.length}명 대기 중)</span>
              </h4>
            </div>

            <div className="overflow-y-auto max-h-[40vh] flex-1 space-y-3 pr-1 scrollbar-thin">
              {reservations.length === 0 ? (
                <div className="py-12 text-center text-stone-400 flex flex-col items-center justify-center">
                  <AlertCircle size={32} className="mb-2 opacity-40 text-hospital-coral" />
                  <p className="font-bold text-base font-kids text-stone-500">현재 접수된 환자가 없습니다.</p>
                  <p className="text-xs text-stone-400 mt-1 font-sans font-medium">키오스크 화면을 이용해 아이들이 먼저 접수하도록 해주세요.</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {reservations.map((res) => {
                    const isWaiting = res.status === 'waiting';
                    const isCalling = res.status === 'calling';
                    const isDone = res.status === 'done';

                    return (
                      <motion.div
                        key={res.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                          isCalling
                            ? 'bg-hospital-peach border-hospital-coral text-hospital-clay font-bold ring-2 ring-hospital-coral/50'
                            : isDone
                            ? 'bg-stone-50 border-stone-100 text-[#A0A090] opacity-60'
                            : 'bg-[#FDFBF7]/60 border-stone-100/50 hover:border-hospital-coral text-stone-700'
                        }`}
                        id={`queue-item-${res.id}`}
                      >
                        {/* Kid brief details */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold bg-hospital-mint text-hospital-clay px-2.5 py-1 rounded-full border border-hospital-mint">
                            {res.ticketNumber}번
                          </span>
                          <span className={`text-2xl p-1.5 rounded-full ${res.avatarBg} border shrink-0`}>
                            {res.avatarEmoji}
                          </span>
                          <span className="font-bold text-base font-kids">{res.childName}</span>
                          
                          {/* Badge indicator */}
                          {isCalling && (
                            <span className="text-xs bg-hospital-coral text-white font-bold px-2.5 py-0.5 rounded-full animate-pulse flex items-center gap-1 font-sans">
                              呼 호출중
                            </span>
                          )}
                          {isDone && (
                            <span className="text-xs bg-stone-200 text-stone-600 font-bold px-2.5 py-0.5 rounded-full font-sans">
                              完 진료완료
                            </span>
                          )}
                          {isWaiting && (
                            <span className="text-xs bg-hospital-mint text-hospital-clay border border-[#c6dfd6] font-bold px-2.5 py-0.5 rounded-full font-sans">
                              정상대기
                            </span>
                          )}
                        </div>

                        {/* Inline controls */}
                        <div className="flex items-center gap-2">
                          {isWaiting && (
                            <button
                              id={`clerk-call-specific-${res.id}`}
                              onClick={() => onCallSpecific(res.id)}
                              className="px-3.5 py-2 text-xs font-bold rounded-full bg-hospital-mint hover:bg-[#d8efe8] text-hospital-clay border border-[#add5c7] cursor-pointer inline-flex items-center gap-1 font-kids text-sm"
                              title="이 학생을 바로 호출합니다"
                            >
                              <Volume2 size={13} />
                              <span>직접부르기</span>
                            </button>
                          )}

                          {isCalling && (
                            <button
                              id={`clerk-complete-specific-${res.id}`}
                              onClick={() => onCompleteReservation(res.id)}
                              className="px-3.5 py-2 text-xs font-bold rounded-full bg-hospital-clay hover:bg-stone-700 text-white cursor-pointer inline-flex items-center gap-1 shadow font-kids text-sm border-b-2 border-stone-850"
                            >
                              <Check size={13} />
                              <span>완료</span>
                            </button>
                          )}

                          <button
                            id={`clerk-cancel-specific-${res.id}`}
                            onClick={() => onCancelReservation(res.id)}
                            className="p-2 text-stone-400 hover:text-[#d35436] hover:bg-hospital-peach/40 border border-transparent hover:border-hospital-coral/30 rounded-full cursor-pointer transition-all"
                            title="접수 내역 취소/삭제"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

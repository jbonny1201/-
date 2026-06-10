import React from 'react';
import { motion } from 'motion/react';
import { Ticket, Calendar, User, Heart, Star, CheckCircle } from 'lucide-react';
import { Reservation } from '../types';

interface ReceiptProps {
  reservation: Reservation;
}

export const Receipt: React.FC<ReceiptProps> = ({ reservation }) => {
  // Format current date cleanly in Korean style
  const dateObj = new Date(reservation.timestamp);
  const formattedDate = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;
  
  // Format current time
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="receipt-animation select-none"
      id="receipt-wrapper"
    >
      {/* Outer wrapper mimicking receipt paper roll cutting */}
      <div className="relative mx-auto w-full max-w-sm bg-white text-stone-800 p-6 rounded-t-2xl border-t-8 border-hospital-clay shadow-xl border-x border-stone-200">
        
        {/* Heart background decorations */}
        <div className="absolute top-2 right-2 text-hospital-coral/30">
          <Heart size={20} fill="currentColor" />
        </div>
        <div className="absolute top-8 left-2 text-hospital-yellow/50">
          <Star size={16} fill="currentColor" />
        </div>

        {/* Cute hospital logo stamp */}
        <div className="flex flex-col items-center justify-center text-center pb-4 border-b border-dashed border-stone-200">
          <span className="text-xs tracking-widest text-hospital-clay font-bold uppercase font-mono">✦ Mind Play Hospital ✦</span>
          <h3 className="text-3xl font-bold font-kids text-stone-800 tracking-tight mt-1.5 flex items-center gap-2 justify-center">
            <img
              src="https://i.ibb.co/qYvC2V45/image.png"
              alt="마음병원 접수증"
              className="w-10 h-10 object-contain"
              referrerPolicy="no-referrer"
            />
            <span>마음병원 접수증</span>
          </h3>
          <span className="text-[10px] text-stone-400 font-mono mt-0.5">NO. {reservation.id.slice(-6).toUpperCase()}</span>
        </div>

        {/* Big Number Section */}
        <div className="my-6 text-center py-5 bg-hospital-peach rounded-3xl border-2 border-dashed border-hospital-coral/40">
          <span className="text-xs uppercase tracking-wider text-hospital-clay/70 font-bold font-sans">내 대기 번호</span>
          <div className="text-6xl font-black text-hospital-clay tracking-tight my-1 relative font-kids">
            <span>{reservation.ticketNumber}</span>
            <span className="text-lg font-bold font-kids ml-1 text-stone-600">번</span>
          </div>
          <span className="text-xs text-white font-bold px-3 py-1 bg-hospital-coral rounded-full inline-block mt-1 font-kids">
            대기 등록 완료 ✨
          </span>
        </div>

        {/* Reservation Details */}
        <div className="space-y-3.5 text-sm font-medium border-b border-dashed border-stone-200 pb-5">
          <div className="flex justify-between items-center text-stone-500">
            <span className="flex items-center gap-1.5 font-kids text-base"><User size={16} className="text-stone-400" /> 친구 이름</span>
            <span className="font-bold text-stone-800 text-lg flex items-center gap-1 font-kids">
              <span className="text-xl">{reservation.avatarEmoji}</span>
              {reservation.childName}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-stone-500">
            <span className="flex items-center gap-1.5 font-kids text-base"><Calendar size={16} className="text-stone-400" /> 접수 날짜</span>
            <span className="text-stone-800 font-sans">{formattedDate}</span>
          </div>
          
          <div className="flex justify-between items-center text-stone-500">
            <span className="flex items-center gap-1.5 font-kids text-base"><Ticket size={16} className="text-stone-400" /> 접수 시간</span>
            <span className="text-stone-800 font-sans">{formattedTime}</span>
          </div>
        </div>

        {/* Message / Policy */}
        <div className="pt-4 text-center">
          <p className="text-sm text-hospital-clay bg-hospital-mint p-3 rounded-2xl leading-relaxed font-bold font-kids border border-hospital-mint">
            "접수가 완료되었어요.<br/>
            차례가 되면 마음의사 선생님을 만나러 가요."
          </p>
        </div>

        {/* Cutting line tooth decor at the bottom */}
        <div className="absolute left-0 right-0 top-full flex h-3 overflow-hidden select-none pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-white shrink-0 rotate-45 border-r border-b border-stone-200"
              style={{ marginTop: '-8px', marginLeft: '2px', marginRight: '2px' }}
            ></div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

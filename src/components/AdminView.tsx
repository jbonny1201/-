import React, { useState } from 'react';
import { Child, Reservation } from '../types';
import { Plus, Trash2, RotateCcw, Users, Smile, RefreshCw, AlertTriangle, Lightbulb } from 'lucide-react';
import { AVATAR_POOL } from '../data/defaultChildren';
import { playSuccessChime } from '../utils/audio';

interface AdminViewProps {
  children: Child[];
  reservations: Reservation[];
  onAddChild: (name: string, emoji: string, bgClass: string, autoRegister?: boolean) => void;
  onRemoveChild: (childId: string) => void;
  onRestoreChildren: () => void;
  onClearQueue: () => void;
  onAddReservation: (child: Child) => Reservation;
}

export const AdminView: React.FC<AdminViewProps> = ({
  children,
  reservations,
  onAddChild,
  onRemoveChild,
  onRestoreChildren,
  onClearQueue,
  onAddReservation,
}) => {
  const [newChildName, setNewChildName] = useState('');
  const [selectedAvatarPoolIdx, setSelectedAvatarPoolIdx] = useState(0);
  const [autoRegister, setAutoRegister] = useState(true);

  // Form submit handler
  const handleAddNewChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    const chosenAvatar = AVATAR_POOL[selectedAvatarPoolIdx];
    onAddChild(
      newChildName.trim(),
      chosenAvatar.emoji,
      chosenAvatar.bg,
      autoRegister
    );

    if (autoRegister) {
      playSuccessChime();
    }

    // Reset fields
    setNewChildName('');
    // Advanced standard cyclical rotation
    setSelectedAvatarPoolIdx((selectedAvatarPoolIdx + 1) % AVATAR_POOL.length);
  };

  // Queue statistics
  const totalRegisteredToday = reservations.length;
  const currentTurn = reservations.filter(r => r.status === 'done').length + 
                      reservations.filter(r => r.status === 'calling').length;
  
  // Outstanding waiting count
  const waitingCount = reservations.filter(r => r.status === 'waiting').length;

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 flex flex-col gap-6" id="teacher-admin-view">
      
      {/* 1. Header Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Today's total registered */}
        <div className="bg-white border-2 border-stone-200/80 p-5 rounded-[32px] shadow-sm text-center">
          <span className="text-xs font-bold text-hospital-coral uppercase tracking-wide block mb-1">
            어린이집/유치원 놀이 통계
          </span>
          <h4 className="text-sm font-semibold text-stone-500 mb-1">오늘 총 접수한 원아</h4>
          <span className="text-4xl font-extrabold text-stone-850 font-kids">
            {totalRegisteredToday} 명
          </span>
        </div>

        {/* Current called number / progress */}
        <div className="bg-white border-2 border-stone-200/80 p-5 rounded-[32px] shadow-sm text-center">
          <span className="text-xs font-bold text-hospital-clay uppercase tracking-wide block mb-1">
            의사 진료 상황
          </span>
          <h4 className="text-sm font-semibold text-stone-500 mb-1">현 진료 완료/진행 수</h4>
          <span className="text-4xl font-extrabold text-[#3F3F2C] font-kids">
            {currentTurn} 번
          </span>
        </div>

        {/* Patients still queued */}
        <div className="bg-white border-2 border-stone-200/80 p-5 rounded-[32px] shadow-sm text-center">
          <span className="text-xs font-bold text-hospital-coral uppercase tracking-wide block mb-1">
            대기 현황
          </span>
          <h4 className="text-sm font-semibold text-stone-500 mb-1">진료 대기 중인 원아</h4>
          <span className="text-4xl font-extrabold text-hospital-coral font-kids animate-pulse">
            {waitingCount} 명
          </span>
        </div>

      </div>

      {/* 2. Operations management split grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Register Student Database Manager (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* New Student Registration Card Form */}
          <div className="bg-white border-2 border-stone-200/80 rounded-[32px] p-6 shadow-sm">
            <h4 className="text-base font-extrabold text-hospital-clay mb-4 flex items-center gap-1.5 font-kids text-xl">
              <Plus size={18} />
              <span>새로운 놀이 친구 등록하기</span>
            </h4>

            <form onSubmit={handleAddNewChild} className="space-y-4">
              {/* Name box */}
              <div>
                <label className="block text-xs font-bold text-stone-400 mb-1 font-sans">친구의 실명/이름</label>
                <input
                  id="child-name-input"
                  type="text"
                  placeholder="예: 최서연"
                  required
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border-2 border-stone-200 focus:border-hospital-coral focus:outline-none font-bold text-stone-800 font-sans"
                />
              </div>

              {/* Avatar Emoji picker */}
              <div>
                <label className="block text-xs font-bold text-stone-400 mb-2 font-sans">동물 아바타 캐릭터 선택</label>
                <div className="grid grid-cols-8 gap-2 p-2 bg-[#FDFBF7] rounded-2xl border border-stone-200 max-h-[120px] overflow-y-auto scrollbar-thin">
                  {AVATAR_POOL.map((item, idx) => (
                    <button
                      key={idx}
                      id={`picker-avatar-${idx}`}
                      type="button"
                      onClick={() => setSelectedAvatarPoolIdx(idx)}
                      className={`p-1.5 text-2xl rounded-full border-2 text-center transition-all cursor-pointer ${
                        selectedAvatarPoolIdx === idx
                          ? 'border-hospital-coral bg-hospital-peach scale-105'
                          : 'border-transparent hover:bg-white'
                      }`}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-register queue checkbox */}
              <div className="flex items-center gap-2.5 py-1">
                <input
                  id="admin-auto-register"
                  type="checkbox"
                  checked={autoRegister}
                  onChange={(e) => setAutoRegister(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-hospital-coral focus:ring-hospital-coral cursor-pointer"
                />
                <label
                  htmlFor="admin-auto-register"
                  className="text-xs font-bold text-stone-500 cursor-pointer font-sans select-none"
                >
                  등록과 동시에 대기 명단에 바로 접수하기 (자동 접수)
                </label>
              </div>

              {/* Submit additions */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-stone-400 font-medium font-sans">
                  <Smile size={14} className="text-hospital-coral" />
                  <span>선택된 아바타: </span>
                  <span className={`px-3 py-1 rounded-full font-bold text-sm ${AVATAR_POOL[selectedAvatarPoolIdx].bg} border`}>
                    {AVATAR_POOL[selectedAvatarPoolIdx].emoji}
                  </span>
                </div>

                <button
                  id="submit-new-child-btn"
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-hospital-clay hover:bg-stone-700 text-white font-bold text-base cursor-pointer shadow border-b-4 border-stone-850 transition-all flex items-center gap-1.5 font-kids"
                >
                  <Plus size={16} />
                  <span>친구 추가하기</span>
                </button>
              </div>
            </form>
          </div>

          {/* Children DB Grid and Deletions */}
          <div className="bg-white border-2 border-stone-200 rounded-[32px] p-6 shadow-xs">
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-stone-100">
              <h4 className="text-base font-bold text-stone-800 flex items-center gap-1.5 font-kids text-xl">
                <Users size={18} className="text-hospital-clay" />
                <span>등록된 친구 목록 ({children.length}명)</span>
              </h4>
              
              <button
                id="restore-default-children-btn"
                onClick={onRestoreChildren}
                type="button"
                className="text-xs text-hospital-clay hover:text-stone-900 font-bold bg-hospital-peach/80 hover:bg-hospital-peach border border-hospital-coral/30 px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer transition-all font-kids"
                title="원래 샘플 명단으로 되돌립니다"
              >
                <RotateCcw size={12} />
                <span>원아 복원</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
              {children.map((child) => {
                const isWaiting = reservations.some(r => r.childId === child.id && r.status === 'waiting');
                return (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-2 rounded-2xl border border-stone-200 hover:bg-[#FDFBF7]"
                    id={`admin-child-${child.id}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`text-xl p-1 rounded-full ${child.avatarBg} border inline-flex`}>
                        {child.avatarEmoji}
                      </span>
                      <span className="text-sm font-bold text-stone-700 truncate font-kids">{child.name}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        id={`register-child-btn-${child.id}`}
                        onClick={() => {
                          onAddReservation(child);
                          playSuccessChime();
                        }}
                        className={`px-2 py-0.5 rounded-full text-xs font-bold cursor-pointer transition-all font-kids border ${
                          isWaiting
                            ? 'bg-hospital-green/40 text-[#305245] border-hospital-green hover:opacity-90'
                            : 'bg-hospital-pink/10 text-[#bf4684] border-hospital-pink/20 hover:bg-hospital-pink/20'
                        }`}
                        title={isWaiting ? "현재 대기 중인 어린이입니다" : "이 어린이를 대기 명단에 접수"}
                      >
                        {isWaiting ? "대기중" : "접수"}
                      </button>
                      <button
                        id={`delete-child-btn-${child.id}`}
                        onClick={() => onRemoveChild(child.id)}
                        className="p-1 px-1.5 rounded-full text-stone-450 hover:text-hospital-coral hover:bg-hospital-peach/30 cursor-pointer transition-all"
                        title="이 어린이 정보 삭제"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Queue Clearing controls & Quick Instructions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Quick Queue initialization action */}
          <div className="bg-white border-4 border-dashed border-hospital-coral/40 rounded-[32px] p-6 shadow-sm relative overflow-hidden">
            <h4 className="text-lg font-bold text-hospital-coral mb-2 flex items-center gap-1.5 font-kids text-xl">
              <AlertTriangle size={20} />
              <span>대기 명단 초기화</span>
            </h4>
            
            <p className="text-sm text-stone-600 leading-relaxed mb-6 font-sans">
              새로운 반 친구들의 놀이 활동을 새로 시작하거나, 오늘 접수번호를 다시 1번부터 이어서 새로 접수하고 싶을 때 사용해 주세요.
            </p>

            <button
              id="admin-clear-queue-btn"
              onClick={onClearQueue}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-hospital-peach hover:bg-hospital-coral hover:text-white text-hospital-coral border-2 border-dashed border-hospital-coral/60 active:scale-95 font-bold text-base cursor-pointer transition-all shadow-xs font-kids text-lg"
            >
              <RefreshCw size={18} className="animate-spin" style={{ animationDuration: '5s' }} />
              <span>접수 대기 목록 다시 시작하기 (초기화)</span>
            </button>
          </div>

          {/* Teacher Guidebook Tip banner */}
          <div className="bg-hospital-clay text-[#FFFCF6] rounded-[32px] p-6 shadow-md border border-stone-800">
            <div className="flex items-center gap-1.5 mb-2 font-kids text-hospital-peach font-bold text-lg">
              <Lightbulb size={20} className="text-hospital-yellow" />
              <h5 className="font-bold">병원 역할놀이 가이드</h5>
            </div>
            <ul className="text-xs text-stone-300 list-disc list-inside space-y-2 leading-relaxed font-sans">
              <li>사전에 태블릿을 삼각대나 책상에 잘 거치해두면 어린이들이 놀이식으로 오가며 손수 접수하기 수월합니다.</li>
              <li>접수와 부르기(딩동)를 아이들이 한 명이 접수원 역할을 하여 교대로 처리하게 시키면 사회적 조율 능력이 향상됩니다.</li>
              <li>대기표(영수증) 디자인은 인쇄가 되지 않아도 화면 속 컷 인 모션과 사운드로 아동들의 큰 몰입감을 자아냅니다!</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};

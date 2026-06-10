export interface Child {
  id: string;
  name: string;
  avatarEmoji: string; // Adorable emoji like 🦁, 🐰, 🐼, 🦊 etc.
  avatarBg: string;    // Soft, friendly Tailwind bg class like "bg-pink-100 text-pink-700"
}

export interface Reservation {
  id: string;
  childId: string;
  childName: string;
  avatarEmoji: string;
  avatarBg: string;
  ticketNumber: number;
  status: 'waiting' | 'calling' | 'done';
  timestamp: string; // ISO string
  calledAt?: string; // ISO string if calling
}

export type AppMode = 'kiosk' | 'clerk' | 'admin';
export type KioskStep = 'welcome' | 'select-name' | 'confirm-name' | 'complete' | 'waiting-screen';

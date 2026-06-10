/**
 * Helper to play a friendly "Ding-Dong" chime using Web Audio API
 */
export function playChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // First chime (Ding) - E5 (659.25 Hz)
    const playNote = (time: number, frequency: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = frequency;
      
      gain.gain.setValueAtTime(0, time);
      // Soft attack
      gain.gain.linearRampToValueAtTime(0.3, time + 0.05);
      // Smooth decay
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + duration);
    };

    const now = ctx.currentTime;
    // "Ding" at 587.33Hz (D5)
    playNote(now, 587.33, 1.2);
    // "Dong" at 440.00Hz (A4) after 0.35s
    playNote(now + 0.35, 440.00, 1.5);
    
  } catch (error) {
    console.warn('Audio playback not supported or blocked by policy', error);
  }
}
export function playSuccessChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    const playNote = (time: number, freq: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.2, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + dur);
    };

    // Uplifting arpeggio C5 -> E5 -> G5
    playNote(now, 523.25, 0.3);
    playNote(now + 0.1, 659.25, 0.3);
    playNote(now + 0.2, 783.99, 0.6);
  } catch (e) {
    console.warn(e);
  }
}

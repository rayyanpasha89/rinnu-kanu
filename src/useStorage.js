import { useState, useEffect } from 'react';

export function useStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem('rk_' + key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rk_' + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [key, value]);

  return [value, setValue];
}

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getDayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

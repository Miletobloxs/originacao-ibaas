import { useEffect, useRef } from 'react';

const DRAFT_KEY = 'bloxs_wizard_draft';

export function useDraftPersist<T>(state: T, onRestore: (draft: T) => void) {
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        onRestore(parsed);
      }
    } catch {
      // corrupted draft — ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch {
      // storage full or unavailable — ignore
    }
  }, [state]);
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

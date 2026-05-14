import { useState, useEffect } from 'react';

export function useLocalStorageState(key, initialValue) {
  // Initialize state with value from local storage, or with initialValue if not present
  const [state, setState] = useState(() => {
    const storedValue = JSON.parse(localStorage.getItem(key) || null);
    if (storedValue === null) return initialValue;
    return storedValue;
  });
    // Update local storage whenever state changes (skip first run so we do not persist
    // JSON "null" into an absent username key before login completes).
  useEffect(() => {
    if (key === "username" && state === null && localStorage.getItem(key) === null) {
      return;
    }
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

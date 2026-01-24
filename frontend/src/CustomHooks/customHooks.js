import { useState, useEffect } from 'react';

export function useLocalStorageState(key, initialValue) {
    // Initialize state with value from local storage, or with initialValue if not present
    const [state, setState] = useState(() => {
        const storedValue = JSON.parse(localStorage.getItem(key) || null);
        if (storedValue === null) return initialValue;
        return storedValue;
    });
        // Update local storage whenever state changes
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}

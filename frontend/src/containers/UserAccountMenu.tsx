import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/useAuth';

type UserAccountMenuProps = {
  onLoggedOut: () => void;
};

export default function UserAccountMenu({ onLoggedOut }: UserAccountMenuProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    await logout();
    setOpen(false);
    onLoggedOut();
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-600 bg-zinc-800/80 px-3 py-1.5 text-sm font-medium text-zinc-100 shadow-sm transition hover:border-zinc-500 hover:bg-zinc-800"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="max-w-[140px] truncate">{user.username}</span>
        <span className="text-zinc-400" aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <div
          className="absolute right-0 z-20 mt-1 min-w-[10rem] overflow-hidden rounded-lg border border-zinc-600 bg-zinc-900 py-1 shadow-lg"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="w-full cursor-pointer px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800"
            onClick={() => void handleLogout()}
          >
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}

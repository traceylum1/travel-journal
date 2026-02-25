import { useRef, useEffect } from 'react';

function DialogueBox({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    // Sync React state with the native dialog methods
    if (isOpen) {
      dialogRef.current.showModal(); // Use showModal() for a modal dialog with a backdrop
    } else {
      dialogRef.current.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="h-auto w-[90vw] max-w-xl rounded-xl border border-zinc-300 bg-white p-0 shadow-xl"
    >
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="m-0 text-xl font-semibold text-zinc-900">{title}</h2>
      </div>
      <div className="px-5 py-4">
      {children}
      </div>
      <div className="flex justify-end border-t border-zinc-200 px-5 py-3">
        <button className="control-button w-24" onClick={onClose}>Close</button>
      </div>
    </dialog>
  );
};

export default DialogueBox;
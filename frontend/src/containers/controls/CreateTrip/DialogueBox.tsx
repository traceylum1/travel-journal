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
    <dialog ref={dialogRef} onClose={onClose}>
      <h2>{title}</h2>
      <br/>
      {children}
      <br/>
      <button onClick={onClose}>Close</button>
    </dialog>
  );
};

export default DialogueBox;
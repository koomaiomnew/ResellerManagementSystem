import React, { useState, useEffect } from 'react';

// A simple local event-based toast implementation since we don't have a library
const toastEvent = new EventTarget();

export const showToast = (message, type = 'success') => {
  toastEvent.dispatchEvent(new CustomEvent('show', { detail: { message, type } }));
};

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleShow = (e) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, ...e.detail }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };

    toastEvent.addEventListener('show', handleShow);
    return () => toastEvent.removeEventListener('show', handleShow);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className={`px-4 py-3 rounded shadow-lg text-white font-medium ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} transition-opacity duration-300`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;

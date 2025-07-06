
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
        <button className="absolute top-2 right-3 text-gray-500" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

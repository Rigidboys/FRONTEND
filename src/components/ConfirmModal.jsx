import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-bg">
      <div className="modal-panel max-w-md w-full">
        <p className="mb-4 text-lg">{message}</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
            취소
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

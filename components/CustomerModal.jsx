import React, { useState, useEffect } from 'react';

const CustomerModal = ({ visible, onClose, onSave, editData }) => {
  const [form, setForm] = useState({
    office_name: '',
    type: '기업',
    master_name: '',
    phone: '',
    address: '',
    note: ''
  });

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        office_name: '',
        type: '기업',
        master_name: '',
        phone: '',
        address: '',
        note: ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  if (!visible) return null;

  return (
    <div className="modal-bg fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-panel bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="font-bold text-lg mb-4">{editData ? '고객사 수정' : '신규 고객사 등록'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1">고객사명</label>
            <input required name="office_name" className="border w-full rounded p-2" value={form.office_name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="block mb-1">유형</label>
            <select name="type" className="border w-full rounded p-2" value={form.type} onChange={handleChange}>
              <option value="기업">기업</option>
              <option value="공공">공공</option>
              <option value="개인">개인</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block mb-1">담당자</label>
            <input name="master_name" className="border w-full rounded p-2" value={form.master_name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="block mb-1">연락처</label>
            <input name="phone" className="border w-full rounded p-2" value={form.phone} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="block mb-1">주소</label>
            <input name="address" className="border w-full rounded p-2" value={form.address} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="block mb-1">비고</label>
            <input name="note" className="border w-full rounded p-2" value={form.note} onChange={handleChange} />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">저장</button>
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;

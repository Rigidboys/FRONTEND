import React, { useState, useEffect } from 'react';
import CustomerModal from './CustomerModal';

const CustomerTab = () => {
  const [customer_names, setCustomers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetch("/api/customer_names")
      .then(res => res.json())
      .then(setCustomers)
      .catch(err => console.error("고객사 목록 불러오기 실패:", err));
  }, []);

  const openModal = (data = null) => {
    setEditData(data);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditData(null);
  };

  const handleSave = async (newData) => {
    if (editData) {
      // 수정 요청
      const res = await fetch(`/api/customer_names/mutation/${editData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      if (res.ok) {
        setCustomers(prev =>
          prev.map(c => c.id === editData.id ? { ...editData, ...newData } : c)
        );
      }
    } else {
      // 등록 요청
      const res = await fetch("/api/customer_names", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      if (res.ok) {
        const saved = await res.json();
        setCustomers(prev => [...prev, saved]);
      }
    }
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const res = await fetch(`/api/customer_names/mutation/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCustomers(prev => prev.filter(c => c.id !== id));
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-3">
        <h2 className="text-lg font-bold">고객사 목록</h2>
        <button
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
          onClick={() => openModal()}
        >
          <i className="fas fa-plus"></i> 등록
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-center w-[20%]">고객사명</th>
              <th className="px-4 py-2 text-center w-[7%]">유형</th>
              <th className="px-4 py-2 text-center w-[7%]">담당자</th>
              <th className="px-4 py-2 text-center w-[15%]">연락처</th>
              <th className="px-4 py-2 text-center w-[20%]">주소</th>
              <th className="px-4 py-2 text-center w-[40%]">비고</th>
            </tr>
          </thead>
          <tbody>
            {customer_names.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2">{c.office_name}</td>
                <td className="px-4 py-2 text-center">{c.type}</td>
                <td className="px-4 py-2 text-center">{c.master_name}</td>
                <td className="px-4 py-2 text-center">{c.phone}</td>
                <td className="px-4 py-2 text-center">{c.address || ''}</td>
                <td className="px-4 py-2">
                  <div className="flex justify-between items-center">
                    <span className="truncate max-w-[400px] cursor-pointer hover:underline block">
                      {c.note || ''}
                    </span>
                    <div className="flex space-x-1 items-center">
                      <button
                        onClick={() => handleSave(c.id)}
                        className="text-blue-500 hover:text-blue-700 mx-1"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-500 hover:text-red-700 mx-1"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustomerModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleSave}
        editData={editData}
      />
    </div>
  );
};

export default CustomerTab;

import React, { useState } from 'react';
import CustomerModal from './CustomerModal';

const initialCustomers = [
  { id: 1, name: '상현기업', type: '기업', ceo: '유재웅', contact: '010-1234-5678', location: '경기도 군포시 당정동', note: '' },
  { id: 2, name: '한국일자리센터', type: '공공', ceo: '박성현', contact: '02-123-4567', location: '경기도 군포시 당정동', note: '' },
  { id: 3, name: '김일호', type: '개인', ceo: '김일호', contact: '010-9876-5432', location: '', note: '' },
];

const CustomerTab = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  const openModal = (data = null) => {
    setEditData(data);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditData(null);
  };

  const handleSave = (newData) => {
    if (editData) {
      // 수정
      setCustomers(prev =>
        prev.map(c => c.id === editData.id ? { ...editData, ...newData } : c)
      );
    } else {
      // 새로 추가
      const nextId = Math.max(...customers.map(c => c.id)) + 1;
      setCustomers(prev => [...prev, { ...newData, id: nextId }]);
    }
    closeModal();
  };

  const handleEdit = (id) => {
    const data = customers.find(c => c.id === id);
    openModal(data);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
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
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2 text-center">{c.type}</td>
                <td className="px-4 py-2 text-center">{c.ceo}</td>
                <td className="px-4 py-2 text-center">{c.contact}</td>
                <td className="px-4 py-2 text-center">{c.location || ''}</td>
                <td className="px-4 py-2">
                  <div className="flex justify-between items-center">
                    <span className="truncate max-w-[400px] cursor-pointer hover:underline block">
                      {c.note || ''}
                    </span>
                    <div className="flex space-x-1 items-center">
                      <button
                        onClick={() => handleEdit(c.id)}
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

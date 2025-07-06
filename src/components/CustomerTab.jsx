import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CustomerModal from './CustomerModal';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND || 'http://localhost:5229/api';

const CustomerTab = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  const [customers, setCustomers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (tab !== 'customer') return;

    fetch(`${BASE_URL}/customers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include'
    })
      .then(res => {
        if (res.status === 401) {
          console.error("인증 실패: 로그인 상태가 아닙니다.");
          localStorage.removeItem('token');
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
          throw new Error("인증 실패: 로그인 상태가 아닙니다.");
        }
        return res.json();

      })
      .then(data => {
        console.log("고객사 API 응답:", data);
        if (Array.isArray(data)) {
          setCustomers(data);
        } else if (Array.isArray(data.customers)) {
          setCustomers(data.customers);
        } else {
          console.error("customers 데이터가 배열이 아닙니다:", data);
          setCustomers([]);
        }
      })
      .catch(err => console.error("고객사 목록 불러오기 실패:", err));
  }, [tab]);

  if (tab !== 'customer') return null;

  const openModal = (data = null) => {
    if (data && !data.Office_Name) {
      console.warn("수정하려는 데이터에 ID가 없습니다!", data);
    }
    setEditData(data);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditData(null);
  };

  const handleSave = async (newData) => {
    if (editData?.Office_Name) {
      const res = await fetch(`${BASE_URL}/customers/mutation/${editData.Office_Name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newData),
        credentials: 'include'
      });
      if (res.ok) {
        const updated = await res.json();
        setCustomers(prev =>
          prev.map(c => c.Office_Name === updated.Office_Name ? updated : c)
        );
      } else {
        const err = await res.text();
        console.error("수정 실패:", res.status, err);
      }
    } else {
      const res = await fetch(`${BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newData),
        credentials: 'include'
      });
      if (res.ok) {
        const saved = await res.json();
        setCustomers(prev => [...prev, saved]);
      } else {
        const err = await res.text();
        console.error("등록 실패:", res.status, err);
      }
    }
    closeModal();
  };

  const handleDelete = async (Office_Name) => {
    if (!Office_Name) {
      console.error("삭제 요청 ID가 없습니다.");
      return;
    }
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const encodedName = encodeURIComponent(Office_Name);
      const res = await fetch(`${BASE_URL}/customers/mutation/${encodedName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });
      if (res.ok) {
        setCustomers(prev => prev.filter(c => c.Office_Name !== Office_Name));
      } else {
        const err = await res.text();
        console.error("삭제 실패:", res.status, err);
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
            {customers.map((c) => (
              <tr key={c.Office_Name}>
                <td className="px-4 py-2">{c.Office_Name}</td>
                <td className="px-4 py-2 text-center">{c.Type}</td>
                <td className="px-4 py-2 text-center">{c.Master_Name}</td>
                <td className="px-4 py-2 text-center">{c.Phone}</td>
                <td className="px-4 py-2 text-center">{c.Address || ''}</td>
                <td className="px-4 py-2">
                  <div className="flex justify-between items-center">
                    <span className="truncate max-w-[400px] cursor-pointer hover:underline block">
                      {c.Description || ''}
                    </span>
                    <div className="flex space-x-1 items-center">
                      <button
                        onClick={() => {
                          if (!c.Office_Name) console.error("수정하려는 고객 ID가 없습니다:", c);
                          openModal(c);
                        }}
                        className="text-blue-500 hover:text-blue-700 mx-1"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => {
                          if (!c.Office_Name) console.error("삭제하려는 고객 ID가 없습니다:", c);
                          handleDelete(c.Office_Name);
                        }}
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

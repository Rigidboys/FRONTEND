import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductModal from './ProductModal';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND || 'http://localhost:5229/api';

const ProductTab = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (tab !== 'product') return;

    fetch(`${BASE_URL}/products`, {
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
          localStorage.clear();
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
          throw new Error("인증 실패: 로그인 상태가 아닙니다.");
        }
        return res.json();
      })
      .then(data => {
        console.log("제품 API 응답:", data);
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("products 데이터가 배열이 아닙니다:", data);
          setProducts([]);
        }
      })
      .catch(err => console.error("제품 목록 불러오기 실패:", err));
  }, [tab]);

  if (tab !== 'product') return null;

  const openModal = (data = null) => {
    setEditData(data);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditData(null);
  };

  const handleSave = async (newData) => {
    const isEdit = !!editData?.Product_Name;

    const endpoint = isEdit
      ? `${BASE_URL}/products/mutation/${encodeURIComponent(editData.Product_Name)}`
      : `${BASE_URL}/products`;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newData),
      credentials: 'include'
    });

    if (res.status === 401) {
      console.error("인증 실패: 로그인 상태가 아닙니다.");
      localStorage.clear();
      window.location.href = '/login'; // 로그인 페이지로 리다이렉트
      throw new Error("인증 실패: 로그인 상태가 아닙니다.");
    }


    if (res.ok) {
      const result = await res.json();
      if (isEdit) {
        setProducts(prev =>
          prev.map(p => p.Product_Name === result.Product_Name ? result : p)
        );
      } else {
        setProducts(prev => [...prev, result]);
      }
    } else {
      const err = await res.text();
      console.error(isEdit ? "수정 실패:" : "등록 실패:", res.status, err);
      if (res.status === 409)
        alert("이미 존재하는 제품명입니다. 다른 이름을 사용해주세요.");
      else
        alert(isEdit ? "수정에 실패했습니다." : "등록에 실패했습니다.");

    }

    closeModal();
  };

  const handleDelete = async (productName) => {
    if (!productName) {
      console.error("삭제 요청 제품명이 없습니다.");
      return;
    }

    if (window.confirm('정말 삭제하시겠습니까?')) {
      const res = await fetch(`${BASE_URL}/products/mutation/${encodeURIComponent(productName)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });
      if (res.status === 401) {
        console.error("인증 실패: 로그인 상태가 아닙니다.");
        localStorage.clear();
        window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        throw new Error("인증 실패: 로그인 상태가 아닙니다.");
      }

      if (res.ok) {
        setProducts(prev => prev.filter(p => p.Product_Name !== productName));
      } else {
        const err = await res.text();
        console.error("삭제 실패:", res.status, err);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-3">
        <h2 className="text-lg font-bold">제품 목록</h2>
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
              <th className="px-4 py-2 text-center w-[20%]">제품명</th>
              <th className="px-4 py-2 text-center w-[10%]">카테고리</th>
              <th className="px-4 py-2 text-center w-[10%]">라이센스</th>
              <th className="px-4 py-2 text-center w-[10%]">제품가</th>
              <th className="px-4 py-2 text-center w-[10%]">실제 판매가</th>
              <th className="px-4 py-2 text-center w-[40%]">비고</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.Product_Name}>
                <td className="px-4 py-2">{p.Product_Name}</td>
                <td className="px-4 py-2 text-center">{p.Category}</td>
                <td className="px-4 py-2 text-center">{p.License}</td>
                <td className="px-4 py-2 text-center">{p.Product_price?.toLocaleString() || ''}</td>
                <td className="px-4 py-2 text-center">{p.Production_price?.toLocaleString() || ''}</td>
                <td className="px-4 py-2">
                  <div className="flex justify-between items-center">
                    <span className="truncate max-w-[400px] cursor-pointer hover:underline block">
                      {p.Description || ''}
                    </span>
                    <div className="flex space-x-1 items-center">
                      <button
                        onClick={() => openModal(p)}
                        className="text-blue-500 hover:text-blue-700 mx-1"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(p.Product_Name)}
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

      <ProductModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleSave}
        editData={editData}
      />
    </div>
  );
};

export default ProductTab;

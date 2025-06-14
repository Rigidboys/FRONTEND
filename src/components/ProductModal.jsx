import React, { useState } from 'react';
import ProductModal from './ProductModal';

const initialProducts = [
  {id: 1, name: '시스템 계정관리', category: '솔루션', license: '연간', price: 5000000, cost: 3000000, description: '시스템 계정 통합 관리 솔루션'},
  {id: 2, name: 'MobileOTP', category: '솔루션', license: '1회성', price: 2500000, cost: 1500000, description: '모바일 OTP 인증 솔루션'},
  {id: 3, name: 'DB 접근 제어', category: '솔루션', license: '연간', price: 4300000, cost: 2800000, description: '데이터베이스 접근 제어 시스템'},
  {id: 4, name: '보안 컨설팅', category: '서비스', license: '시간당', price: 500000, cost: 300000, description: '보안 전문가 컨설팅 서비스'},
];

function formatCurrency(number) {
  return new Intl.NumberFormat('ko-KR').format(number) + '원';
}

const ProductTab = () => {
  const [products, setProducts] = useState(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleEdit = (id) => {
    setEditId(id);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까? 관련 매출/매입 데이터도 삭제됩니다.')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = (product) => {
    if (product.id) {
      setProducts(products.map(p => (p.id === product.id ? product : p)));
    } else {
      const nextId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts([...products, { ...product, id: nextId }]);
    }
    setModalOpen(false);
    setEditId(null);
  };

  const handleAdd = () => {
    setEditId(null);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h2 className="text-lg font-bold">제품 목록</h2>
        <button onClick={handleAdd} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition">
          <i className="fas fa-plus"></i> 등록
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-center">제품명</th>
              <th className="px-4 py-2 text-center">카테고리</th>
              <th className="px-4 py-2 text-center">라이센스</th>
              <th className="px-4 py-2 text-center">가격</th>
              <th className="px-4 py-2 text-center">설명</th>
              <th className="px-4 py-2 text-center">작업</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className="px-4 py-2 text-center">{p.name}</td>
                <td className="px-4 py-2 text-center">{p.category}</td>
                <td className="px-4 py-2 text-center">{p.license}</td>
                <td className="px-4 py-2 text-center">{formatCurrency(p.price)}</td>
                <td className="px-4 py-2 text-center">{p.description}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button onClick={() => handleEdit(p.id)} className="text-blue-500 hover:text-blue-700">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <ProductModal
          product={editId ? products.find(p => p.id === editId) : null}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductTab;

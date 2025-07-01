import { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';

export default function ProductTab() {
  const [product_names, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  
  useEffect(() => {
  fetch("/api/product_name")
    .then((res) => res.json())
    .then(setProducts)
    .catch((err) => console.error("제품 불러오기 실패", err));
  }, []);

  const openModal = (product_name = null) => {
    setEditing(product_name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
   const data = Object.fromEntries(form.entries());
    const updated = {
     ...editing,
      ...data,
     purchase_price: parseInt(data.purchase_price),
   };

   const method = editing ? 'PUT' : 'POST';
   const url = editing
      ? `/api/product_names/mutation/${editing.id}`
     : '/api/product_name';

    fetch(url, {
     method,
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(updated),
   })
     .then((res) => res.json())
     .then((saved) => {
       if (editing) {
         setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
       } else {
         setProducts((prev) => [...prev, saved]);
        }
        closeModal();
      })
      .catch((err) => console.error("저장 실패", err));
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    fetch(`/api/product_names/mutation/${deleteTargetId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== deleteTargetId));
        setShowConfirm(false);
      })
      .catch((err) => console.error("삭제 실패", err));
  };


return (
  <div className="p-4">
    <div className="flex justify-between mb-3">
      <h2 className="text-lg font-bold">제품 목록</h2>
      <button
        onClick={() => openModal()}
        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
      >
        <i className="fas fa-plus"></i> 등록
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-center w-[20%]">제품명</th>
            <th className="px-4 py-2 text-center w-[15%]">카테고리</th>
            <th className="px-4 py-2 text-center w-[15%]">라이센스</th>
            <th className="px-4 py-2 text-center w-[10%]">가격</th>
            <th className="px-4 py-2 text-center w-[40%]">설명</th>
          </tr>
        </thead>
        <tbody>
          {product_names.map(p => (
            <tr key={p.id}>
              <td className="px-4 py-2">{p.product_name}</td>
              <td className="px-4 py-2 text-center">{p.category}</td>
              <td className="px-4 py-2 text-center">{p.license}</td>
              <td className="px-4 py-2 text-center">{p.purchase_price.toLocaleString()}</td>
              <td className="px-4 py-2">
                <div className="flex justify-between items-center">
                  <span className="truncate max-w-[400px] cursor-pointer hover:underline block">
                    {p.description}
                  </span>
                  <div className="flex space-x-1 items-center">
                    <button
                      onClick={() => openModal(p)}
                      className="text-blue-500 hover:text-blue-700 mx-1"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editing ? '제품 수정' : '신규 제품 등록'}</h3>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="id" defaultValue={editing?.id || ''} />
              <div className="mb-3">
                <label className="block mb-1">제품명</label>
                <input name="product_name" defaultValue={editing?.product_name || ''} required className="border w-full rounded p-2" />
              </div>
              <div className="mb-3">
                <label className="block mb-1">카테고리</label>
                <select name="category" defaultValue={editing?.category || '솔루션'} className="border w-full rounded p-2">
                  <option>솔루션</option>
                  <option>서비스</option>
                  <option>하드웨어</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1">라이센스</label>
                <select name="license" defaultValue={editing?.license || '연간'} className="border w-full rounded p-2">
                  <option>연간</option>
                  <option>1회성</option>
                  <option>시간당</option>
                  <option>영구</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1">가격</label>
                <input name="purchase_price" defaultValue={editing?.purchase_price || 0} className="border w-full rounded p-2" />
              </div>
              <div className="mb-3">
                <label className="block mb-1">설명</label>
                <textarea name="description" defaultValue={editing?.description || ''} className="border w-full rounded p-2"></textarea>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">저장</button>
                <button type="button" onClick={closeModal} className="bg-gray-200 px-4 py-2 rounded">취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showConfirm && (
        <ConfirmModal
          message="정말 삭제하시겠습니까? 관련 매출/매입 데이터도 삭제됩니다."
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

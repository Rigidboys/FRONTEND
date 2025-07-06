import React, { useState, useEffect } from 'react';

const ProductModal = ({ visible, onClose, onSave, editData }) => {
  const [form, setForm] = useState({
    Product_Name: '',
    Category: '솔루션',
    License: '연간',
    Product_price: '',
    Production_price: '',
    Description: ''
  });

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        Product_Name: '',
        Category: '솔루션',
        License: '연간',
        Product_price: '',
        Production_price: '',
        Description: ''
      });
    }
  }, [visible, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };
  

  if (!visible) return;

  return (
    <div className="modal-bg fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-panel bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="font-bold text-lg mb-4">{editData ? '제품 정보 수정' : '신규 제품 등록'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1">제품명</label>
            <input required 
              name="Product_Name" 
              className={`border w-full rounded p-2 ${!!editData ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-text'}`}
              value={form.Product_Name} 
              onChange={handleChange}
              disabled={!!editData} 
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">카테고리</label>
            <select name="Category" className="border w-full rounded p-2" value={form.Category} onChange={handleChange}>
              <option value="솔루션">솔루션</option>
              <option value="하드웨어">하드웨어</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block mb-1">라이센스</label>
            <select name="License" className="border w-full rounded p-2" value={form.License} onChange={handleChange}>
              <option value="연간">연간</option>
              <option value="영구">영구</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block mb-1">제품 가격</label>
            <input type="number" name="Product_price" className="border w-full rounded p-2" value={form.Product_price} onChange={handleChange} required/>
          </div>
          <div className="mb-3">
            <label className="block mb-1">실제 판매가</label>
            <input type="number" name="Production_price" className="border w-full rounded p-2" value={form.Production_price} onChange={handleChange} required/>
          </div>
          <div className="mb-3">
            <label className="block mb-1">비고</label>
            <input name="Description" className="border w-full rounded p-2" value={form.Description} onChange={handleChange} />
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

export default ProductModal;

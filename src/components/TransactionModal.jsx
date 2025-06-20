import React, { useEffect, useState } from 'react';

const TransactionModal = ({ onClose }) => {
  const [type, setType] = useState('매출');
  const [customerId, setCustomerId] = useState('');
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [productId, setProductId] = useState('');
  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(1);
  const [collected, setCollected] = useState('false');
  const [note, setNote] = useState('');

const [customers, setCustomers] = useState([]);
const [products, setProducts] = useState([]);

useEffect(() => {
  fetch('/api/customers/Office_Name')
    .then(res => res.json())
    .then(setCustomers)
    .catch(console.error);

  fetch('/api/product/Product_Names')
    .then(res => res.json())
    .then(setProducts)
    .catch(console.error);
}, []);

const handleSubmit = (e) => {
  e.preventDefault();

  const transactionData = {
    type,
    customerId,
    supplier,
    date,
    dueDate,
    productId,
    price,
    qty,
    collected: collected === 'true',
    note,
  };

  fetch('/api/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData),
  })
    .then((res) => {
      if (!res.ok) throw new Error('저장 실패');
      return res.json();
    })
    .then(() => {
      onClose();  // 성공 시 모달 닫기
    })
    .catch((err) => {
      console.error("거래 저장 오류:", err);
    });
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[500px] max-w-full">
        <h2 className="text-xl font-bold mb-4">신규 거래 등록</h2>
        <form onSubmit={handleSubmit} className="space-y-3">

          <div>
            <label className="block mb-1">거래 유형</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="border w-full rounded p-2">
              <option>매출</option>
              <option>매입</option>
            </select>
          </div>

          {type === '매출' && (
            <div>
              <label className="block mb-1">고객사</label>
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="border w-full rounded p-2" required>
                <option value="">선택</option>
                {customers.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {type === '매입' && (
            <div>
              <label className="block mb-1">공급사</label>
              <input value={supplier} onChange={(e) => setSupplier(e.target.value)} className="border w-full rounded p-2" required />
            </div>
          )}

          <div>
            <label className="block mb-1">거래일</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border w-full rounded p-2" required />
          </div>

          {(type === '매출' || type === '매입') && (
            <>
              <div>
                <label className="block mb-1">납기일</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border w-full rounded p-2" />
              </div>

              <div>
                <label className="block mb-1">제품</label>
                <select value={productId} onChange={(e) => setProductId(e.target.value)} className="border w-full rounded p-2">
                  <option value="">선택</option>
                  {products.map((p, i) => <option key={i} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1">가격</label>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="border w-full rounded p-2" />
              </div>

              <div>
                <label className="block mb-1">수량</label>
                <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="border w-full rounded p-2" />
              </div>
            </>
          )}
          {type === '매출' && (
              <div>
                <label className="block mb-1">수금 여부</label>
                  <select value={collected} onChange={(e) => setCollected(e.target.value)} className="border w-full rounded p-2">
                    <option value="true">완료</option>
                  < option value="false">미수금</option>
                </select>
              </div>
          )}
          <div>
            <label className="block mb-1">비고</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="border w-full rounded p-2" />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">저장</button>
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;

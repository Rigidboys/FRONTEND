import React, { useEffect, useState } from 'react';

const PurchaseTable = ({ searchCustomer, searchProduct }) => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    fetch('/api/purchase')
      .then(res => res.json())
      .then(setPurchases)
      .catch(err => console.error("매입 데이터 불러오기 실패", err));
  }, []);

  const filteredPurchases = purchases.filter(p => {
    const matchCustomer = !searchCustomer || p.supplier.includes(searchCustomer);
    const matchProduct = !searchProduct || p.product.includes(searchProduct);
    return matchCustomer && matchProduct;
  });

  return (
    <div className="overflow-x-auto mb-8">
      <h3 className="text-lg font-bold mb-2">매입 내역</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-center w-[160px]">공급사</th>
            <th className="px-4 py-2 text-center w-[120px]">거래일</th>
            <th className="px-4 py-2 text-center w-[130px]">제품</th>
            <th className="px-4 py-2 text-center w-[130px]">가격</th>
            <th className="px-4 py-2 text-center w-[130px]">수량</th>
            <th className="px-4 py-2 text-center w-[130px]">총액</th>
            <th className="px-4 py-2 text-center w-[100px]">비고</th>
          </tr>
        </thead>
        <tbody>
          {filteredPurchases.map(p => (
            <tr key={p.id}>
              <td className="px-4 py-2 w-[160px]">{p.supplier}</td>
              <td className="px-4 py-2 text-center w-[120px]">{p.date}</td>
              <td className="px-4 py-2 text-center w-[130px]">{p.product}</td>
              <td className="px-4 py-2 text-center w-[130px]">{p.price.toLocaleString()}</td>
              <td className="px-4 py-2 text-center w-[130px]">{p.qty}</td>
              <td className="px-4 py-2 text-center w-[130px]">{(p.price * p.qty).toLocaleString()}</td>
              <td className="px-4 py-2 text-center w-[100px]">{p.note}</td>
            </tr>
          ))}
          {filteredPurchases.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-gray-400 py-4">검색 결과가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseTable;

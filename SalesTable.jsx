import React, { useEffect, useState } from 'react';

const SalesTable = ({ searchCustomer, searchProduct }) => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch('/api/sales')
      .then(res => res.json())
      .then(setSales)
      .catch(err => console.error("매출 데이터 불러오기 실패", err));
  }, []);

  const filteredSales = sales.filter(s => {
    const matchCustomer = !searchCustomer || s.customer.includes(searchCustomer);
    const matchProduct = !searchProduct || s.product.includes(searchProduct);
    return matchCustomer && matchProduct;
  });

  return (
    <div className="overflow-x-auto mb-8">
      <h3 className="text-lg font-bold mb-2">매출 내역</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-center w-[160px]">고객사</th>
            <th className="px-4 py-2 text-center w-[120px]">거래일</th>
            <th className="px-4 py-2 text-center w-[130px]">제품</th>
            <th className="px-4 py-2 text-center w-[130px]">가격</th>
            <th className="px-4 py-2 text-center w-[130px]">수량</th>
            <th className="px-4 py-2 text-center w-[130px]">총액</th>
            <th className="px-4 py-2 text-center w-[100px]">비고</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map(s => (
            <tr key={s.id}>
              <td className="px-4 py-2 w-[160px]">{s.customer}</td>
              <td className="px-4 py-2 text-center w-[120px]">{s.date}</td>
              <td className="px-4 py-2 text-center w-[130px]">{s.product}</td>
              <td className="px-4 py-2 text-center w-[130px]">{s.price.toLocaleString()}</td>
              <td className="px-4 py-2 text-center w-[130px]">{s.qty}</td>
              <td className="px-4 py-2 text-center w-[130px]">{(s.price * s.qty).toLocaleString()}</td>
              <td className="px-4 py-2 text-center w-[100px]">{s.note}</td>
            </tr>
          ))}
          {filteredSales.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-gray-400 py-4">검색 결과가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;

import React from 'react';

const PurchaseTable = ({ searchCustomer, searchProduct }) => {
  const purchases = [
    { id: 1, supplier: '인프라공급사', date: '2025-03-10', product: '시스템 계정관리', price: 3000000, qty: 2, note: '할인 적용' },
    { id: 2, supplier: '보안솔루션사', date: '2025-02-15', product: 'MobileOTP', price: 1500000, qty: 5, note: '' },
    { id: 3, supplier: 'DB솔루션사', date: '2025-04-05', product: 'DB 접근 제어', price: 2800000, qty: 3, note: '추가 라이센스' },
  ];

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

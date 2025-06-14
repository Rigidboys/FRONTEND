import React from 'react';

const PaymentTable = ({ searchCustomer, searchDue, searchPaid, searchStatus }) => {
  const payments = [
  { id: 1, customer: '상현기업', amount: 5000000, due: '2025-05-20', paid: '2025-05-18', status: '완납' },
  { id: 2, customer: '김일호', amount: 5000000, due: '2025-06-10', paid: '2025-06-05', status: '완납' },
  { id: 3, customer: '한국일자리센터', amount: 5000000, due: '2025-06-30', paid: '', status: '미납' },
  { id: 4, customer: '상현기업', amount: 4300000, due: '2025-06-25', paid: '', status: '미납' },
  ];

const filteredPayments = payments.filter(p => {
  const matchCustomer = !searchCustomer || p.customer.includes(searchCustomer);
  const matchDue = !searchDue || p.due.startsWith(searchDue); // 날짜 비교 개선
  const matchPaid = !searchPaid || (p.paid && p.paid.startsWith(searchPaid)); // 날짜 비교 개선
  const matchStatus = !searchStatus || p.status === searchStatus;
  return matchCustomer && matchDue && matchPaid && matchStatus;
});

  return (
    <div className="overflow-x-auto mb-8">
      <h3 className="text-lg font-bold mb-2">수금 내역</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-center w-[160px]">고객사</th>
            <th className="px-4 py-2 text-center w-[130px]">납기일</th>
            <th className="px-4 py-2 text-center w-[130px]">수금일</th>
            <th className="px-4 py-2 text-center w-[120px]">금액</th>
            <th className="px-4 py-2 text-center w-[130px]">미수금</th>
            <th className="px-4 py-2 text-center w-[100px]">상태</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map(p => (
            <tr key={p.id}>
              <td className="px-4 py-2 w-[160px]">{p.customer}</td>
              <td className="px-4 py-2 text-center w-[130px]">{p.due}</td>
              <td className="px-4 py-2 text-center w-[130px]">{p.paid || '-'}</td>
              <td className="px-4 py-2 text-center w-[120px]">{p.amount.toLocaleString()}</td>
              <td className="px-4 py-2 text-center text-red-500 w-[130px]">
                {p.status !== '완납' ? p.amount.toLocaleString() : '-'}
              </td>
              <td className="px-4 py-2 text-center w-[100px]">
                {p.status === '완납' ? (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">완납</span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded">미납</span>
                )}
              </td>
            </tr>
          ))}
          {filteredPayments.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-gray-400 py-4">검색 결과가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;

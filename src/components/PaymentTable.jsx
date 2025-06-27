import React, { useEffect, useState } from 'react';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND || 'http://localhost:5229/api';

const PaymentTable = ({ searchCustomer, searchDue, searchPaid, searchStatus, token }) => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/purchases`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const unpaidOnly = data.filter(p => p.Purchase_or_Sale === '매출' && !p.Is_Payment);
        setPayments(unpaidOnly);
      })
      .catch(err => console.error("수금 데이터 불러오기 실패", err));
  }, [token]);

  const filteredPayments = payments.filter(p => {
    const matchCustomer = !searchCustomer || p.Customer_Name?.includes(searchCustomer);
    const matchDue = !searchDue || (p.Payment_Period_Deadline && p.Payment_Period_Deadline.startsWith(searchDue));
    const matchPaid = !searchPaid || (p.Paid_Payment !== null && p.Paid_Payment.toString().startsWith(searchPaid));
    const matchStatus = !searchStatus || (p.Is_Payment ? '완납' : '미납') === searchStatus;
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
          {filteredPayments.map((p, i) => (
            <tr key={i}>
              <td className="px-4 py-2 w-[160px]">{p.Customer_Name}</td>
              <td className="px-4 py-2 text-center w-[130px]">{p.Payment_Period_Deadline?.split('T')[0]}</td>
              <td className="px-4 py-2 text-center w-[130px]">
                {p.Is_Payment ? p.Payment_Period_End?.split('T')[0] : '-'}
              </td>
              <td className="px-4 py-2 text-center w-[120px]">{p.Paid_Payment?.toLocaleString()}</td>
              <td className="px-4 py-2 text-center text-red-500 w-[130px]">
                {!p.Is_Payment ? ((p.Purchase_Price * p.Purchase_Amount - p.Paid_Payment) || 0).toLocaleString() : '-'}
              </td>
              <td className="px-4 py-2 text-center w-[100px]">
                {p.Is_Payment ? (
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

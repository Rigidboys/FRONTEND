import React, { useEffect, useState } from 'react';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND || 'http://localhost:5229/api';
const BASE_URL_ANALYTICS = process.env.REACT_APP_BASE_URL_ANALYTICS || 'http://localhost:5000/api';

const PaymentTable = ({ searchCustomer, searchDeadline, searchDue, searchPaid, searchStatus, token, refreshKey, onRefresh }) => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/purchases`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          console.error("인증 실패: 로그인 상태가 아닙니다.");
          localStorage.removeItem('token');
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
          throw new Error("인증 실패: 로그인 상태가 아닙니다.");
        }
        return res.json();

      })
      .then(data => {
        console.log('[전체 응답 데이터 - 수금]', data);
        const purchasesData = data.filter(p => p.Purchase_or_Sale === '매출');
        setPayments(purchasesData);
      })
      .catch(err => console.error("수금 데이터 불러오기 실패", err));
  }, [token, refreshKey]);

  const handleUpdate = async (id, paidPayment) => {
    if (!id) {
      console.error("업데이트 요청 ID가 없습니다.");
      return;
    }

    const res = await fetch(`${BASE_URL_ANALYTICS}/payments/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paid_payment: paidPayment
      }),
    });
    if (res.status === 401) {
      console.error("인증 실패: 로그인 상태가 아닙니다.");
      localStorage.removeItem('token');
      window.location.href = '/login'; // 로그인 페이지로 리다이렉트
      throw new Error("인증 실패: 로그인 상태가 아닙니다.");
    }

    if (res.ok) {
      const result = await res.json();
      console.log("업데이트 성공:", result);
      alert("수금 내역이 수정되었습니다.");
      onRefresh();  // 새로고침 함수 호출
      // 필요시 새로고침 또는 상태 업데이트
    } else {
      const err = await res.json();
      console.error("업데이트 실패:", res.status, err);
      alert("수정 실패: " + (err?.error || "서버 오류"));
    }
  }

  const filteredPayments = payments.filter(p => {
    const matchCustomer = !searchCustomer || p.Customer_Name?.includes(searchCustomer);
    const matchDeadline = !searchDeadline || (p.Payment_Period_Deadline && p.Payment_Period_Deadline.startsWith(searchDeadline));
    const matchDue = !searchDue || (p.Payment_Period_End && p.Payment_Period_End.startsWith(searchDue))
    const matchPaid = !searchPaid || (p.Paid_Payment !== null && p.Paid_Payment.toString().startsWith(searchPaid));
    const matchStatus = !searchStatus || (p.Is_Payment ? '완납' : '미납') === searchStatus;
    return matchCustomer && matchDue && matchPaid && matchStatus && matchDeadline;
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
            <th className="px-4 py-2 text-center w-[120px]">수금액</th>
            <th className="px-4 py-2 text-center w-[130px]">미수금</th>
            <th className="px-4 py-2 text-center w-[100px]">상태</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((p, i) => (
            <tr key={i}>
              <td className="px-4 py-2 w-[160px]">{p.Customer_Name}</td>
              <td className="px-4 py-2 text-center w-[130px]">
                {p.Payment_Period_Deadline?.split('T')[0]}
              </td>
              <td className="px-4 py-2 text-center w-[130px]">
                {p.Payment_Period_End?.split('T')[0]}
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
                <button
                  onClick={() => {
                    const paid = prompt("수금액을 입력하세요:", p.Paid_Payment || 0);
                    const paidInt = parseInt(paid, 10);
                    if (!isNaN(paidInt)) handleUpdate(p.Id, paidInt);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  <i className="fas fa-edit"></i>
                </button>
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

import React, { useEffect, useState } from 'react';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND || 'http://localhost:5229/api';

const SalesTable = ({ searchCustomer, searchProduct, token, refreshKey, onRefresh }) => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (!token) return;

    // console.log('[fetch 시작] 토큰:', token);
    fetch(`${BASE_URL}/purchases`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        console.log('[응답 상태]', res.status);
        if (res.status === 401) {
          console.error("인증 실패: 로그인 상태가 아닙니다.");
          localStorage.clear();
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
          throw new Error("인증 실패: 로그인 상태가 아닙니다.");
        }
        if (!res.ok) throw res;
        return res.json();
      })
      .then(data => {
        console.log('[전체 응답 데이터]', data);
        const salesOnly = data.filter(p => p.Purchase_or_Sale === '매출');
        console.log('[매출 데이터 필터링]', salesOnly);
        setSales(salesOnly);
      })
      .catch(err => {
        if (err.status === 401) {
          console.warn('인증 실패 – 토큰이 유효하지 않습니다.');
          return;
        }
        console.error('매출 데이터 불러오기 실패', err);
      });
  }, [token, refreshKey]);

  useEffect(() => {
    console.log('[sales state 업데이트됨]', sales);
  }, [sales]);

  const filteredSales = sales.filter(s => {
    const matchCustomer = !searchCustomer || s.Customer_Name?.includes(searchCustomer);
    const matchProduct = !searchProduct || s.Product_Name?.includes(searchProduct);
    return matchCustomer && matchProduct;
  });

  const handleDelete = async (id) => {
    if (!id) {
      console.error("삭제 요청 ID가 없습니다.");
      return;
    }
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const res = await fetch(`${BASE_URL}/purchases/mutation/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });
      if (res.status === 401) {
        console.error("인증 실패: 로그인 상태가 아닙니다.");
        localStorage.clear();
        window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        throw new Error("인증 실패: 로그인 상태가 아닙니다.");
      }
      if (res.ok) {
        setSales(prev => prev.filter(c => c.id !== id));
        onRefresh();
        console.log("삭제 성공");
      } else {
        const err = await res.text();
        console.error("삭제 실패:", res.status, err);
      }
    }
  }

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
          {filteredSales.map((s, i) => (
            <tr key={i}>
              <td className="px-4 py-2 w-[160px]">{s.Customer_Name}</td>
              <td className="px-4 py-2 text-center w-[120px]">{s.Purchased_Date?.split('T')[0]}</td>
              <td className="px-4 py-2 text-center w-[130px]">{s.Product_Name}</td>
              <td className="px-4 py-2 text-center w-[130px]">{s.Purchase_Price?.toLocaleString()}</td>
              <td className="px-4 py-2 text-center w-[130px]">{s.Purchase_Amount}</td>
              <td className="px-4 py-2 text-center w-[130px]">
                {(s.Purchase_Price * s.Purchase_Amount).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-center w-[100px]">
                {s.Description}
                <div className="flex space-x-1 items-center">
                  <button
                    onClick={() => {
                      if (!s.Id) console.error("삭제하려는 고객 ID가 없습니다:", s);
                      handleDelete(s.Id);
                    }}
                    className="text-red-500 hover:text-red-700 mx-1"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </td>
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
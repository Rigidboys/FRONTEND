import React, { useEffect, useState } from 'react';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND || 'http://localhost:5229/api';

const PurchaseTable = ({ searchCustomer, searchProduct, token, refreshKey, onRefresh }) => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    // console.log('[fetch 시작 - 매입] 토큰:', token);

    fetch(`${BASE_URL}/purchases`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        console.log('[응답 상태 - 매입]', res.status);
        if (res.status === 401) {
          console.error("인증 실패: 로그인 상태가 아닙니다.");
          localStorage.clear();
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
          throw new Error("인증 실패: 로그인 상태가 아닙니다.");
        }
        return res.json();
      })
      .then(data => {
        console.log('[전체 응답 데이터 - 매입]', data);
        const purchaseOnly = Array.isArray(data)
          ? data.filter(p => (p.Purchase_or_Sale || '').trim() === '매입')
          : [];
        console.log('[매입 필터링 결과]', purchaseOnly);
        setPurchases(purchaseOnly);
      })
      .catch(err => console.error("매입 데이터 불러오기 실패", err));
  }, [refreshKey, token]);

  const filteredPurchases = purchases.filter(p => {
    const matchCustomer = !searchCustomer || (p.Seller_Name || '').includes(searchCustomer);
    const matchProduct = !searchProduct || (p.Product_Name || '').includes(searchProduct);

    console.log(`[필터조건] 고객사: ${searchCustomer}, 제품: ${searchProduct}`);
    console.log(`[현재 행] 공급사: ${p.Seller_Name}, 제품명: ${p.Product_Name}, 조건일치:`, matchCustomer, matchProduct);

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
      {
        if (res.status === 401) {
          console.error("인증 실패: 로그인 상태가 아닙니다.");
          localStorage.clear();
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
          throw new Error("인증 실패: 로그인 상태가 아닙니다.");
        }
        res.json();
      }
      if (res.ok) {
        setPurchases(prev => prev.filter(c => c.id !== id));
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
          {filteredPurchases.map((p, i) => (
            <tr key={i}>
              <td className="px-4 py-2 w-[160px]">{p.Seller_Name}</td>
              <td className="px-4 py-2 text-center w-[120px]">{p.Purchased_Date?.split('T')[0]}</td>
              <td className="px-4 py-2 text-center w-[130px]">{p.Product_Name}</td>
              <td className="px-4 py-2 text-center w-[130px]">{p.Purchase_Price?.toLocaleString()}</td>
              <td className="px-4 py-2 text-center w-[130px]">{p.Purchase_Amount}</td>
              <td className="px-4 py-2 text-center w-[130px]">
                {(p.Purchase_Price * p.Purchase_Amount).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-center w-[100px]">
                {p.Description}
                <div className="flex space-x-1 items-center">
                  <button
                    onClick={() => {
                      if (!p.Id) console.error("삭제하려는 고객 ID가 없습니다:", p);
                      handleDelete(p.Id);
                    }}
                    className="text-red-500 hover:text-red-700 mx-1"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </td>

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
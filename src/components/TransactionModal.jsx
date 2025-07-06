import React, { useEffect, useState } from "react";

const BASE_URL =
  process.env.REACT_APP_BASE_URL_BACKEND || "http://localhost:5229/api";

const TransactionModal = ({ onClose, onRefresh }) => {
  const token = localStorage.getItem("token");

  const [type, setType] = useState("매출");
  const [customerId, setCustomerId] = useState("");
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const [dueStart, setDueStart] = useState("");
  const [dueEnd, setDueEnd] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(1);
  const [collected, setCollected] = useState("false");
  const [note, setNote] = useState("");

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/customers/names`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          console.error("인증 실패: 로그인 상태가 아닙니다.");
          localStorage.clear();
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
          throw new Error("인증 실패: 로그인 상태가 아닙니다.");
        }
        return res.json();
      })
      .then((data) => setCustomers(data))
      .catch((err) => console.error("고객사 요청 오류:", err));

    fetch(`${BASE_URL}/products/names`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          console.error("인증 실패: 로그인 상태가 아닙니다.");
          localStorage.clear();
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
          throw new Error("인증 실패: 로그인 상태가 아닙니다.");
        }
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("제품 요청 오류:", err));
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const transactionData = {
      Purchase_or_Sale: type,
      Seller_Name: type === "매입" ? supplier : null,
      Customer_Name: type === "매출" ? customerId : "",
      Purchased_Date: date ? new Date(date).toISOString() : null,
      Product_Name: productId,
      Purchase_Price: Number(price),
      Purchase_Amount: Number(qty),
      Payment_Period_Start: dueStart ? new Date(dueStart).toISOString() : null,
      Payment_Period_End: dueEnd ? new Date(dueEnd).toISOString() : null,
      Payment_Period_Deadline: dueDate ? new Date(dueDate).toISOString() : null,
      Is_Payment: type === "매입" ? false : collected === "true",
      Paid_Payment:
        type === "매입"
          ? 0
          : collected === "true"
          ? Number(price) * Number(qty)
          : 0,
      Description: note,
    };


    fetch(`${BASE_URL}/purchases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transactionData),
    })
      .then((res) => {
        if (res.status === 401) {
          console.error("인증 실패: 로그인 상태가 아닙니다.");
          localStorage.clear();
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
          throw new Error("인증 실패: 로그인 상태가 아닙니다.");
        }
        if (!res.ok) throw new Error("저장 실패");
        return res.json();
      })
      .then(() => { onRefresh(); onClose(); })
      .catch((err) => {
        console.error("거래 저장 오류:", err);
        console.log("데이터: ", transactionData);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[500px] max-w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">신규 거래 등록</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1">거래 유형</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border w-full rounded p-2"
            >
              <option>매출</option>
              <option>매입</option>
            </select>
          </div>

          {type === "매출" && (
            <div>
              <label className="block mb-1">고객사</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="border w-full rounded p-2"
                required
              >
                <option value="">선택</option>
                {customers.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {type === "매입" && (
            <div>
              <label className="block mb-1">공급사</label>
              <input
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="border w-full rounded p-2"
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-1">거래일</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border w-full rounded p-2"
              required
            />
          </div>

          {type === "매출" && (
            <>
              <div>
                <label className="block mb-1">납기 시작일</label>
                <input
                  type="date"
                  value={dueStart}
                  onChange={(e) => setDueStart(e.target.value)}
                  className="border w-full rounded p-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">납기 종료일</label>
                <input
                  type="date"
                  value={dueEnd}
                  onChange={(e) => setDueEnd(e.target.value)}
                  required
                  className="border w-full rounded p-2"
                />
              </div>

              <div>
                <label className="block mb-1">납기 마감일</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="border w-full rounded p-2"
                />
              </div>
            </>
          )}

          <div>
            <label className="block mb-1">제품</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="border w-full rounded p-2"
            >
              <option value="">선택</option>
              {products.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">가격</label>
            <input
              type="number"
              placeholder="가격을 입력하세요."
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="border w-full rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1">수량</label>
            <input
              type="number"
              placeholder="수량을 입력하세요."
              onChange={(e) => setQty(Number(e.target.value))}
              className="border w-full rounded p-2"
            />
          </div>

          {type === "매출" && (
            <div>
              <label className="block mb-1">수금 여부</label>
              <select
                value={collected}
                onChange={(e) => setCollected(e.target.value)}
                className="border w-full rounded p-2"
              >
                <option value="true">완료</option>
                <option value="false">미수금</option>
              </select>
            </div>
          )}

          <div>
            <label className="block mb-1">비고</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border w-full rounded p-2"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              저장
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;

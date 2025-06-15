import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerTab from "./components/CustomerTab";
import ProductTab from "./components/ProductTab";
import TransactionPage from "./components/TransactionPage";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import AuthPage from "./components/AuthPage";
import { Navigate } from "react-router-dom";

function TabbedApp() {
  const [activeTab, setActiveTab] = useState("customer");

  const tabs = [
    { key: "customer", label: "고객사 관리" },
    { key: "product", label: "제품 관리" },
    { key: "transaction", label: "거래 관리" },
    { key: "dashboard", label: "분석/대시보드" },
  ];

  const salesData = [
  { id: 1, customer: '상현기업', product: '시스템 계정관리', price: 5000000, qty: 3, date: '2025-05-10' },
  { id: 2, customer: '한국일자리센터', product: 'MobileOTP', price: 2500000, qty: 2, date: '2025-04-20' },
  { id: 3, customer: '김일호', product: '보안 컨설팅', price: 500000, qty: 10, date: '2025-05-28' },
  { id: 4, customer: '상현기업', product: 'DB 접근 제어', price: 4300000, qty: 1, date: '2025-06-15' },
  ];
  
  const productData = [
  { name: '시스템 계정관리', price: 5000000, cost: 3000000 },
  { name: 'MobileOTP', price: 2500000, cost: 1500000 },
  { name: '보안 컨설팅', price: 500000, cost: 0 },
  { name: 'DB 접근 제어', price: 4300000, cost: 2800000 },
  ];

  const purchaseData = [
  { id: 1, supplier: '인프라공급사', product: '시스템 계정관리', price: 3000000, qty: 2, date: '2025-03-10' },
  { id: 2, supplier: '보안솔루션사', product: 'MobileOTP', price: 1500000, qty: 5, date: '2025-02-15' },
  { id: 3, supplier: 'DB솔루션사', product: 'DB 접근 제어', price: 2800000, qty: 3, date: '2025-04-05' },
  ];

  const paymentData = [
  { id: 1, customer: '상현기업', amount: 5000000, due: '2025-05-20', paid: '2025-05-18', status: '완납' },
  { id: 2, customer: '김일호', amount: 5000000, due: '2025-06-10', paid: '2025-06-05', status: '완납' },
  { id: 3, customer: '한국일자리센터', amount: 5000000, due: '2025-06-30', paid: '', status: '미납' },
  { id: 4, customer: '상현기업', amount: 4300000, due: '2025-06-25', paid: '', status: '미납' },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case "customer":
        return <CustomerTab />;
      case "product":
        return <ProductTab />;
      case "transaction":
        return <TransactionPage />;
      case "dashboard":
        return (
          <Dashboard
            sales={salesData}
            purchases={purchaseData}
            payments={paymentData}
            products={productData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="flex space-x-6 border-b mb-4 text-lg font-bold">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 ${
              activeTab === tab.key
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{renderTab()}</div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/*" element={localStorage.getItem('isLoggedIn') ? (
          <Layout><TabbedApp /></Layout> ) : (
          <Navigate to="/login" />)}/>
      </Routes>
    </Router>
  );
}

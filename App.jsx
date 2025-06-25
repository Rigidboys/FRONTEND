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
  const [activeTab, setActiveTab] = useState("customer_name");

  const tabs = [
    { key: "customer_name", label: "고객사 관리" },
    { key: "product_name", label: "제품 관리" },
    { key: "transaction", label: "거래 관리" },
    { key: "dashboard", label: "분석/대시보드" },
  ];

  const salesData = [
  { id: 1, customer_name: '상현기업', product_name: '시스템 계정관리', purchase_price: 5000000, purchase_amount: 3, purchased_date: '2025-05-10' },
  { id: 2, customer_name: '한국일자리센터', product_name: 'MobileOTP', purchase_price: 2500000, purchase_amount: 2, purchased_date: '2025-04-20' },
  { id: 3, customer_name: '김일호', product_name: '보안 컨설팅', purchase_price: 500000, purchase_amount: 10, purchased_date: '2025-05-28' },
  { id: 4, customer_name: '상현기업', product_name: 'DB 접근 제어', purchase_price: 4300000, purchase_amount: 1, purchased_date: '2025-06-15' },
  ];
  
  const productData = [
  { office_name: '시스템 계정관리', purchase_price: 5000000, production_price: 3000000 },
  { office_name: 'MobileOTP', purchase_price: 2500000, production_price: 1500000 },
  { office_name: '보안 컨설팅', purchase_price: 500000, production_price: 0 },
  { office_name: 'DB 접근 제어', purchase_price: 4300000, production_price: 2800000 },
  ];

  const purchaseData = [
  { id: 1, seller_name: '인프라공급사', product_name: '시스템 계정관리', purchase_price: 3000000, purchase_amount: 2, purchased_date: '2025-03-10' },
  { id: 2, seller_name: '보안솔루션사', product_name: 'MobileOTP', purchase_price: 1500000, purchase_amount: 5, purchased_date: '2025-02-15' },
  { id: 3, seller_name: 'DB솔루션사', product_name: 'DB 접근 제어', purchase_price: 2800000, purchase_amount: 3, purchased_date: '2025-04-05' },
  ];

  const paymentData = [
  { id: 1, customer_name: '상현기업', amount: 5000000, payment_period_start: '2025-05-20', paid_payment: '2025-05-18', is_payment: '완납' },
  { id: 2, customer_name: '김일호', amount: 5000000, payment_period_start: '2025-06-10', paid_payment: '2025-06-05', is_payment: '완납' },
  { id: 3, customer_name: '한국일자리센터', amount: 5000000, payment_period_start: '2025-06-30', paid_payment: '', is_payment: '미납' },
  { id: 4, customer_name: '상현기업', amount: 4300000, payment_period_start: '2025-06-25', paid_payment: '', is_payment: '미납' },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case "customer_name":
        return <CustomerTab />;
      case "product_name":
        return <ProductTab />;
      case "transaction":
        return <TransactionPage />;
      case "dashboard":
        return (
          <Dashboard
            sales={salesData}
            purchases={purchaseData}
            payments={paymentData}
            product_names={productData}
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

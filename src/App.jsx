import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import CustomerTab from "./components/CustomerTab";
import ProductTab from "./components/ProductTab";
import TransactionPage from "./components/TransactionPage";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import AuthPage from "./components/AuthPage";

if(process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}

function TabbedApp() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "customer";
  const [activeTab, setActiveTab] = useState(currentTab);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const tabs = [
    { key: "customer", label: "고객사 관리" },
    { key: "product", label: "제품 관리" },
    { key: "transaction", label: "거래 관리" },
    { key: "dashboard", label: "분석/대시보드" },
  ];

  const salesData = [];
  const productData = [];
  const purchaseData = [];
  const paymentData = [];

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
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/app/*" element={
          localStorage.getItem('isLoggedIn') ? (
            <Layout><TabbedApp /></Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
}

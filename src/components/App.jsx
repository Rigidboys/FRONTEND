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
          <Dashboard />
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

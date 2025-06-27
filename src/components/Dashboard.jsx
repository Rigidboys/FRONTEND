import React, { useEffect, useState } from "react";
import {
  SalesTrendChart,
  CustomerSalesChart,
  ProductSalesChart,
} from "./DashboardCharts";
import { Filler } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const BASE_URL =
  process.env.REACT_APP_BASE_URL_ANALYTICS || "http://localhost:5000/api";

function formatCurrency(value) {
  if (typeof value !== "number" || isNaN(value)) return "\0";
  return `\u20A9${value.toLocaleString()}`;
}

const Dashboard = () => {
  const [months, setMonths] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [purchasesData, setPurchasesData] = useState([]);
  const [customerLabels, setCustomerLabels] = useState([]);
  const [customerSales, setCustomerSales] = useState([]);
  const [productLabels, setProductLabels] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [kpi, setKpi] = useState({
    totalSales: 0,
    totalPurchases: 0,
    totalCollected: 0,
    totalUncollected: 0,
    avgMarginRate: "0%",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    fetch(`${BASE_URL}/monthly_totals`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setMonths(data.months);
        setSalesData(data.sales);
        setPurchasesData(data.purchases);
      });

    Promise.all([
      fetch(`${BASE_URL}/total_sales`, { headers }).then((res) => res.json()),
      fetch(`${BASE_URL}/total_purchases`, { headers }).then((res) =>
        res.json()
      ),
      fetch(`${BASE_URL}/total_paid`, { headers }).then((res) => res.json()),
      fetch(`${BASE_URL}/unpaid`, { headers }).then((res) => res.json()),
      fetch(`${BASE_URL}/avg_margin_rate`, { headers }).then((res) =>
        res.text()
      ),
    ]).then(([sales, purchases, paid, unpaid, avgMarginRate]) => {
      setKpi({
        totalSales: sales.amount,
        totalPurchases: purchases.amount,
        totalCollected: paid.amount,
        totalUncollected: unpaid.amount,
        avgMarginRate: avgMarginRate + "%",
      });
    });

    fetch(`${BASE_URL}/payment_reliability`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setCustomerLabels(data.labels);
        setCustomerSales(data.sales);
      });

    fetch(`${BASE_URL}/margin_by_product`, { headers })
      .then((res) => res.json())
      .then((data) => {
        const labels = data.map((d) => d.product_name);
        const sales = data.map((d) => d.sales);
        setProductLabels(labels);
        setProductSales(sales);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow min-h-[300px]">
        <h3 className="font-bold mb-4">월별 매출/매입 추이</h3>
        <SalesTrendChart
          labels={months}
          salesData={salesData}
          purchasesData={purchasesData}
        />
      </div>

      <div className="bg-white p-4 rounded shadow min-h-[300px]">
        <h3 className="font-bold mb-4">고객사별 매출</h3>
        <CustomerSalesChart
          labels={customerLabels}
          dataValues={customerSales}
        />
      </div>

      <div className="bg-white p-4 rounded shadow min-h-[300px]">
        <h3 className="font-bold mb-4">제품별 매출</h3>
        <ProductSalesChart labels={productLabels} dataValues={productSales} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-4">핵심 성과 지표 (KPI)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-sm text-blue-600">총 매출액</div>
            <div className="text-xl font-bold">
              {formatCurrency(kpi.totalSales)}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-sm text-purple-600">총 매입액</div>
            <div className="text-xl font-bold">
              {formatCurrency(kpi.totalPurchases)}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-sm text-green-600">총 수금액</div>
            <div className="text-xl font-bold">
              {formatCurrency(kpi.totalCollected)}
            </div>
          </div>
          <div className="bg-yellow-50 p-3 rounded">
            <div className="text-sm text-yellow-600">평균 마진율</div>
            <div className="text-xl font-bold">{kpi.avgMarginRate}</div>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <div className="text-sm text-red-600">총 미수금액</div>
            <div className="text-xl font-bold">
              {formatCurrency(kpi.totalUncollected)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import {
  SalesTrendChart,
  CustomerSalesChart,
  ProductSalesChart
} from './DashboardCharts';
import { Filler } from 'chart.js';
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
} from 'chart.js';

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

function formatCurrency(value) {
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
    avgMarginRate: '0%'
  });

  useEffect(() => {
    // 예: 월별 매출/매입
    fetch('/api/monthly_totals')
      .then(res => res.json())
      .then(data => {
        setMonths(data.months);
        setSalesData(data.sales);
        setPurchasesData(data.purchases);
      });

    // KPI
    Promise.all([
      fetch('/api/total_sales').then(res => res.json()),
      fetch('/api/total_purchases').then(res => res.json()),
      fetch('/api/total_paid').then(res => res.json()),
      fetch('/api/unpaid').then(res => res.json()),
      fetch('/api/avg_margin_rate').then(res => res.text()),  // 문자열로 반환된다고 가정
    ]).then(([sales, purchases, paid_payment, unpaid, avgMarginRate]) => {
      setKpi({
        totalSales: sales.amount,
        totalPurchases: purchases.amount,
        totalCollected: paid_payment.amount,
        totalUncollected: unpaid.amount,
        avgMarginRate: avgMarginRate + '%'
      });
    });

    // 고객사별 매출
    fetch('/api/payment_reliability')
      .then(res => res.json())
      .then(data => {
        setCustomerLabels(data.labels);
        setCustomerSales(data.sales);
      });

    // 제품별 매출
    fetch('/api/margin_by_product')
      .then(res => res.json())
      .then(data => {
        setProductLabels(data.labels);
        setProductSales(data.sales);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow h-[400px]">
        <h3 className="font-bold mb-4">월별 매출/매입 추이</h3>
        <SalesTrendChart labels={months} salesData={salesData} purchasesData={purchasesData} />
      </div>

      <div className="bg-white p-4 rounded shadow h-[400px]">
        <h3 className="font-bold mb-4">고객사별 매출</h3>
        <CustomerSalesChart labels={customerLabels} dataValues={customerSales} />
      </div>

      <div className="bg-white p-4 rounded shadow h-[400px]">
        <h3 className="font-bold mb-4">제품별 매출</h3>
        <ProductSalesChart labels={productLabels} dataValues={productSales} />
      </div>

      <div className="bg-white p-4 rounded shadow h-[400px]">
        <h3 className="font-bold mb-4">핵심 성과 지표 (KPI)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-sm text-blue-600">총 매출액</div>
            <div className="text-xl font-bold">{formatCurrency(kpi.totalSales)}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-sm text-purple-600">총 매입액</div>
            <div className="text-xl font-bold">{formatCurrency(kpi.totalPurchases)}</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-sm text-green-600">총 수금액</div>
            <div className="text-xl font-bold">{formatCurrency(kpi.totalCollected)}</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded">
            <div className="text-sm text-yellow-600">평균 마진율</div>
            <div className="text-xl font-bold">{kpi.avgMarginRate}</div>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <div className="text-sm text-red-600">총 미수금액</div>
            <div className="text-xl font-bold">{formatCurrency(kpi.totalUncollected)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

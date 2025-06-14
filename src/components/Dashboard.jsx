import React, { useMemo } from 'react';
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

const Dashboard = ({
  sales = [], purchases = [], payments = [], products = [], customers  = []}) => {
  const {
    months,
    salesData,
    purchasesData,
    customerLabels,
    customerSales,
    productLabels,
    productSales,
    kpi
  } = useMemo(() => {
    const salesByMonth = {};
    const purchasesByMonth = {};
    const salesByCustomer = {};
    const salesByProduct = {};

    sales.forEach(s => {
      const month = s.date.substring(0, 7);
      salesByMonth[month] = (salesByMonth[month] || 0) + s.price * s.qty;
      salesByCustomer[s.customer] = (salesByCustomer[s.customer] || 0) + s.price * s.qty;
      salesByProduct[s.product] = (salesByProduct[s.product] || 0) + s.price * s.qty;
    });

    purchases.forEach(p => {
      const month = p.date.substring(0, 7);
      purchasesByMonth[month] = (purchasesByMonth[month] || 0) + p.price * p.qty;
    });

    const allMonths = Array.from(new Set([...Object.keys(salesByMonth), ...Object.keys(purchasesByMonth)])).sort();
    const salesData = allMonths.map(m => salesByMonth[m] || 0);
    const purchasesData = allMonths.map(m => purchasesByMonth[m] || 0);

    const customerLabels = Object.keys(salesByCustomer);
    const customerSales = Object.values(salesByCustomer);
    const productLabels = products.map(p => p.name);
    const productSales = productLabels.map(name => salesByProduct[name] || 0);

    const totalSales = sales.reduce((sum, s) => sum + s.price * s.qty, 0);
    const totalPurchases = purchases.reduce((sum, p) => sum + p.price * p.qty, 0);
    const totalCollected = payments.filter(p => p.status === '완납').reduce((sum, p) => sum + p.amount, 0);
    const totalUncollected = payments.filter(p => p.status !== '완납').reduce((sum, p) => sum + p.amount, 0);
    const avgMarginRate = products.length
      ? ((products.reduce((sum, p) => sum + (p.price - (p.cost || 0)), 0) /
          products.reduce((sum, p) => sum + p.price, 0)) * 100).toFixed(1) + '%'
      : '0%';

    return {
      months: allMonths,
      salesData,
      purchasesData,
      customerLabels,
      customerSales,
      productLabels,
      productSales,
      kpi: {
        totalSales,
        totalPurchases,
        totalCollected,
        totalUncollected,
        avgMarginRate
      }
    };
  }, [sales, purchases, payments, products]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow h-[300px]">
        <h3 className="font-bold mb-4">월별 매출/매입 추이</h3>
        <SalesTrendChart labels={months} salesData={salesData} purchasesData={purchasesData} />
      </div>

      <div className="bg-white p-4 rounded shadow h-[300px]">
        <h3 className="font-bold mb-4">고객사별 매출</h3>
        <CustomerSalesChart labels={customerLabels} dataValues={customerSales} />
      </div>

      <div className="bg-white p-4 rounded shadow h-[300px]">
        <h3 className="font-bold mb-4">제품별 매출</h3>
        <ProductSalesChart labels={productLabels} dataValues={productSales} />
      </div>

      <div className="bg-white p-4 rounded shadow">
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

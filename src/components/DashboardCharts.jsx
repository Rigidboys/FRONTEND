import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

function formatCurrency(value) {
  return `₩${value.toLocaleString()}`;
}

export function SalesTrendChart({ labels, salesData, purchasesData }) {
  const data = {
    labels,
    datasets: [
      {
        label: '매출',
        data: salesData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: true,
      },
      {
        label: '매입',
        data: purchasesData,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: formatCurrency,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${formatCurrency(context.raw)}`,
        },
      },
    },
  };

  return (
    <div className="relative w-full h-full" style={{ height: '250px' }}>
      <Line data={data} options={options} />
    </div>
  );
}

export function CustomerSalesChart({ labels, dataValues }) {
  const data = {
    labels,
    datasets: [
      {
        label: '매출액',
        data: dataValues,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: formatCurrency,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${formatCurrency(context.raw)}`,
        },
      },
    },
  };

  return (
    <div className="relative w-full h-full" style={{ height: '250px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export function ProductSalesChart({ labels, dataValues }) {
  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(244, 63, 94, 0.7)',
          'rgba(139, 92, 246, 0.7)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(244, 63, 94, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="relative w-full h-full" style={{ height: '250px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}

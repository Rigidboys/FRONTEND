import React, { useState } from 'react';
import FilterTabs from './FilterTabs';
import SalesTable from './SalesTable';
import PurchaseTable from './PurchaseTable';
import PaymentTable from './PaymentTable';
import TransactionModal from './TransactionModal';

const TransactionPage = () => {
  const [filter, setFilter] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [searchDeadline, setSearchDeadline] = useState('');
  const [searchDue, setSearchDue] = useState('');
  const [searchPaid, setSearchPaid] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const token = localStorage.getItem('token');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleFilter = (type) => {
    setFilter(prev => (prev === type ? null : type));
  };

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg">
        <span className="font-bold">거래 관리</span> (
        <span
          className={`cursor-pointer hover:underline ${filter === '매출' ? 'text-blue-600 font-bold' : ''}`}
          onClick={() => toggleFilter('매출')}
        >
          매출
        </span>{' / '}
        <span
          className={`cursor-pointer hover:underline ${filter === '매입' ? 'text-green-600 font-bold' : ''}`}
          onClick={() => toggleFilter('매입')}
        >
          매입
        </span>{' / '}
        <span
          className={`cursor-pointer hover:underline ${filter === '수금' ? 'text-purple-600 font-bold' : ''}`}
          onClick={() => toggleFilter('수금')}
        >
          수금
        </span>
          )
        </h2>
        <button
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
          onClick={openModal}
        >
          <i className="fas fa-plus"></i> 등록
        </button>
      </div>

      <FilterTabs
        filter={filter}
        toggleFilter={toggleFilter}
        searchCustomer={searchCustomer}
        setSearchCustomer={setSearchCustomer}
        searchProduct={searchProduct}
        setSearchProduct={setSearchProduct}
        searchDeadline={searchDeadline}
        setSearchDeadline={setSearchDeadline}
        searchDue={searchDue}
        setSearchDue={setSearchDue}
        searchPaid={searchPaid}
        setSearchPaid={setSearchPaid}
        searchStatus={searchStatus}
        setSearchStatus={setSearchStatus}
      />

      {(filter === null || filter === '매출') && (
        <SalesTable
          searchCustomer={searchCustomer}
          searchProduct={searchProduct}
          searchStatus={searchStatus}
          token={token}
          refreshKey={refreshKey}
          onRefresh={handleRefresh}
        />
      )}
      {(filter === null || filter === '매입') && (
        <PurchaseTable
          searchCustomer={searchCustomer}
          searchProduct={searchProduct}
          token={token}
          refreshKey={refreshKey}
          onRefresh={handleRefresh}
        />
      )}
      {(filter === null || filter === '수금') && (
        <PaymentTable
          searchCustomer={searchCustomer}
          searchDeadline={searchDeadline}
          searchDue={searchDue}
          searchPaid={searchPaid}
          searchStatus={searchStatus}
          token={token}
          onRefresh={handleRefresh}
          refreshKey={refreshKey}
        />
      )}

      {isModalOpen && (
        <TransactionModal onClose={closeModal} onRefresh={handleRefresh} />
      )}
    </div>
  );
};

export default TransactionPage;
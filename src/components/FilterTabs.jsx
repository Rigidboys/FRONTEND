const FilterTabs = ({
  filter,
  toggleFilter,
  searchCustomer,
  setSearchCustomer,
  searchProduct,
  setSearchProduct,
  searchDue,
  setSearchDue,
  searchPaid,
  setSearchPaid,
  searchStatus,
  setSearchStatus,
}) => {
  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
  <input type="text" placeholder="거래사명"
    value={searchCustomer} onChange={(e) => setSearchCustomer(e.target.value)}
    className="border rounded p-2 w-full" />

  <input type="text" placeholder="제품명"
    value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)}
    className="border rounded p-2 w-full" />

  {/* <input type="date"
    value={searchDue} onChange={(e) => setSearchDue(e.target.value)}
    className="border rounded p-2 w-full" />

  <input type="date"
    value={searchPaid} onChange={(e) => setSearchPaid(e.target.value)}
    className="border rounded p-2 w-full" /> */}

  <select
    value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}
    className="border rounded p-2 w-full"
  >
    <option value="">전체</option>
    <option value="완납">완납</option>
    <option value="미납">미납</option>
  </select>
</div>

    </>
  );
};

export default FilterTabs;

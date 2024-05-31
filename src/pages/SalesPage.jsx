import React from 'react';
import SalesForm from '../components/SalesForm.jsx';

const SalesPage = ({ storeId }) => {
  return (
    <div>
      <h2>Sales</h2>
      <SalesForm storeId={storeId} />
    </div>
  );
};

export default SalesPage;
import React from 'react';
import database from '../database/database';

const StoreSelector = ({ onStoreChange }) => {
  const [stores, setStores] = React.useState([]);
  const [selectedStore, setSelectedStore] = React.useState(null);

  React.useEffect(() => {
    const fetchStores = async () => {
      const stores = await database.getStores();
      setStores(stores);
      setSelectedStore(stores[0]?.id || null);
      onStoreChange(stores[0]?.id || null);
    };
    fetchStores();
  }, []);

  const handleStoreChange = (e) => {
    const storeId = e.target.value;
    setSelectedStore(storeId);
    onStoreChange(storeId);
  };

  return (
    <div>
      <label htmlFor="store-select">Select Store:</label>
      <select id="store-select" value={selectedStore} onChange={handleStoreChange}>
        <option value="">Select a store</option>
        {stores.map((store) => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StoreSelector;
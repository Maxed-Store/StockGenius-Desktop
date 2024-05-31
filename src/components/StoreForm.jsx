import React from 'react';
import database from '../database/database';
const StoreForm = () => {
  const [storeName, setStoreName] = React.useState('');

  const handleCreateStore = async () => {
    if (storeName.trim()) {
      const newStore = await database.addStore(storeName);
      console.log('New store created:', newStore);
      setStoreName('');
    }
  };

  return (
    <div>
      <h2>Create Store</h2>
      <input
        type="text"
        placeholder="Store Name"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
      />
      <button onClick={handleCreateStore}>Create Store</button>
    </div>
  );
};

export default StoreForm;
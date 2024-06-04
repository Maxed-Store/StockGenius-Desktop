import Dexie from 'dexie';
import bcrypt from 'bcryptjs';
import { defaultCategories } from '../constants';

class Database {
  constructor() {
    if (!('indexedDB' in window)) {
      console.error('This browser does not support IndexedDB');
      return;
    }

    this.db = new Dexie('MyDatabase');
    this.db.version(2).stores({
      stores: '++id,name,address,phone',
      products: '++id,storeId,userDefinedId,name,description,price,quantity,categoryId,createdAt,&[storeId+name+userDefinedId]',
      sales: '++id,storeId,productId,quantity,total,timestamp',
      recentSearches: '++id,storeId,searchTerm,timestamp',
      categories: '++id,name',
      customers: '++id,name,email',
      users: '++id,username,passwordHash,role',
    });
    this.initializeCategories();
  }

  initializeCategories() {
    return this.db.categories.count().then(count => {
      if (count === 0) {
        return this.db.categories.bulkAdd(defaultCategories);
      }
    });
  }

  // User related functions
  async createDefaultAdmin() {
    const existingAdmin = await this.db.users.where({ role: 'admin' }).first();
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin', salt);
      await this.db.users.add({ username: 'admin', passwordHash, role: 'admin' });
      console.log('Default admin user created');
    }
  }

  async usernameExists(username) {
    const user = await this.db.users.where({ username }).first();
    return !!user;
  }

  async getUsers() {
    return await this.db.users.toArray();
  }

  async removeUser(userId) {
    return await this.db.users.delete(userId);
  }

  async addUser(username, password, role = 'user') {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return this.db.users.add({ username, passwordHash, role });
  }

  async getUser(username) {
    return this.db.users.where({ username }).first();
  }

  async authenticateUser(username, password) {
    const user = await this.getUser(username);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (isPasswordValid) {
        return user;
      }
    }
    return null;
  }

  async changePassword(username, oldPassword, newPassword) {
    const user = await this.authenticateUser(username, oldPassword);
    if (user) {
      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);
      await this.db.users.update(user.id, { passwordHash: newPasswordHash });
      return true;
    }
    return false;
  }

  // Store related functions
  async getStores() {
    return this.db.stores.toArray();
  }

  async addStore(name) {
    const id = await this.db.stores.add({ name });
    return { id, name };
  }

  // Product related functions
  async getProducts(storeId) {
    return this.db.products.where('storeId').equals(storeId).toArray();
  }

  async addProduct(storeId, userDefinedId, name, description, price, quantity, categoryId) {
    const id = await this.db.products.add({
      storeId,
      userDefinedId,
      name,
      description,
      price,
      quantity,
      categoryId,
      createdAt: new Date().toISOString(),
    });
    return { id, storeId, userDefinedId, name, description, price, quantity, categoryId };
  }

  async getProductById(productId) {
    return this.db.products.get(productId);
  }

  async updateProductQuantity(productId, newQuantity) {
    await this.db.products.update(productId, { quantity: newQuantity });
  }

  async updateProduct(productId, name, description, price, quantity) {
    await this.db.products.update(productId, { name, description, price, quantity });
    return { id: productId, name, description, price, quantity };
  }

  async searchProducts(searchTerm) {
    if (typeof searchTerm !== 'string') {
      throw new Error('Invalid searchTerm. It should be a string.');
    }

    let products;

    products = await this.db.products
      .where('userDefinedId')
      .equals(searchTerm)
      .toArray();

    if (products.length === 0) {
      products = await this.db.products
        .where('name')
        .startsWithIgnoreCase(searchTerm)
        .toArray();
    }

    console.log(products);
    return products;
  }

  async searchProductsByBarcode(barcode) {
    if (!barcode) {
      throw new Error('Invalid barcode');
    }
    try {
      const product = await this.db.products.where('userDefinedId').equals(barcode).toArray();
      if (!product) {
        throw new Error('No product found with the provided barcode');
      }
      return product;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Sales related functions
  async sellProduct(storeId, productId, quantity) {
    const product = await this.getProductById(productId);
    if (product && product.quantity >= quantity) {
      const sale = {
        storeId,
        productId,
        quantity,
        total: product.price * quantity,
        timestamp: new Date().toISOString()
      };
      await this.addSale(sale);
      await this.updateProductQuantity(productId, product.quantity - quantity);
      return sale;
    }
    return null;
  }

  async getSales(storeId) {
    const sales = await this.db.sales.where('storeId').equals(storeId).toArray();
    const salesWithProducts = await Promise.all(
      sales.map(async (sale) => {
        const product = await this.getProductById(sale.productId);
        return { ...sale, product };
      })
    );
    return salesWithProducts;
  }

  async addSale(sale) {
    const id = await this.db.sales.add(sale);
    return { id, ...sale };
  }

  // Recent Searches related functions
  async addRecentSearch(storeId, searchTerm) {
    const timestamp = new Date().toISOString();
    await this.db.recentSearches.add({ storeId, searchTerm, timestamp });
  }

  async getRecentSearches(storeId) {
    const recentSearches = await this.db.recentSearches
      .where('storeId')
      .equals(storeId)
      .reverse()
      .limit(10)
      .toArray();

    return recentSearches.map((search) => search.searchTerm);
  }

  // Category related functions
  async addCategory(name) {
    const id = await this.db.categories.add({ name });
    return { id, name };
  }

  async getCategories() {
    return this.db.categories.toArray();
  }

  // Customer related functions
  async addCustomer(name, email) {
    const id = await this.db.customers.add({ name, email });
    return { id, name, email };
  }

  async getCustomers() {
    return this.db.customers.toArray();
  }

  // Inventory related functions
  async checkInventoryLevels(threshold) {
    const products = await this.db.products.where('quantity').below(threshold).toArray();
    return products;
  }

  async getFilteredProducts({ name, minQuantity, maxQuantity }) {
    let collection = this.db.products.toCollection();

    if (name) {
      collection = collection.filter((product) => product.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (minQuantity !== undefined) {
      collection = collection.filter((product) => product.quantity >= minQuantity);
    }

    if (maxQuantity !== undefined) {
      collection = collection.filter((product) => product.quantity <= maxQuantity);
    }

    return collection.toArray();
  }

  // Backup and Restore functions
  async backupToLocal() {
    const data = {
      stores: await this.db.stores.toArray(),
      products: await this.db.products.toArray(),
      sales: await this.db.sales.toArray(),
      recentSearches: await this.db.recentSearches.toArray(),
      categories: await this.db.categories.toArray(),
      customers: await this.db.customers.toArray(),
      users: await this.db.users.toArray(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async restoreFromLocal(file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = JSON.parse(event.target.result);

      // Clear existing data (optional)
      await this.db.transaction('rw', this.db.stores, this.db.products, this.db.sales, this.db.recentSearches, this.db.categories, this.db.customers, this.db.users, async () => {
        await this.db.stores.clear();
        await this.db.products.clear();
        await this.db.sales.clear();
        await this.db.recentSearches.clear();
        await this.db.categories.clear();
        await this.db.customers.clear();
        await this.db.users.clear();

        // Insert data
        await this.db.stores.bulkAdd(data.stores);
        await this.db.products.bulkAdd(data.products);
        await this.db.sales.bulkAdd(data.sales);
        await this.db.recentSearches.bulkAdd(data.recentSearches);
        await this.db.categories.bulkAdd(data.categories);
        await this.db.customers.bulkAdd(data.customers);
        await this.db.users.bulkAdd(data.users);
      });
    };
    reader.readAsText(file);
  }
  async checkLowStock(threshold = 5) {
    const lowStockProducts = await this.db.products.where('quantity').below(threshold).toArray();
    if (lowStockProducts.length > 0) {
      this.sendLowStockAlert(lowStockProducts);
    }
    return lowStockProducts;
  }

  async sendLowStockAlert(products) {
    // Implement your alerting mechanism here
    // For example, sending an email or showing a notification
    console.log('Low stock alert for the following products:', products);
  }


}

// Initialize database if IndexedDB is supported
let db = null;
if (typeof window !== 'undefined' && 'indexedDB' in window) {
  db = new Database();
}

export default db;

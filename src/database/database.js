import Dexie from 'dexie';
import bcrypt from 'bcryptjs';
import { defaultCategories } from '../constants';

class Database {
  constructor() {
    if (!('indexedDB' in window)) {
      console.error('This browser does not support IndexedDB');
      return;
    }

    this.db = new Dexie('maxstore2');
    this.db.version(6).stores({
      stores: '++id,name,address,phone,email',
      products: '++id,storeId,userDefinedId,name,description,price,quantity,categoryId,createdAt,&[storeId+name+userDefinedId]',
      sales: '++id,storeId,productId,quantity,total,timestamp',
      recentSearches: '++id,storeId,searchTerm,timestamp',
      categories: '++id,name',
      customers: '++id,name,email',
      users: '++id,username,passwordHash,role',
      audits: '++id,type,data,timestamp',
      suppliers: '++id,name,email,phone,address',
      purchaseOrders: '++id,supplierId,storeId,items,totalCost,placedAt',
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
    try {
      const existingAdmin = await this.db.users.where({ role: 'admin' }).first();
      if (!existingAdmin) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin', salt);
        await this.db.users.add({ username: 'admin', passwordHash, role: 'admin' });
        console.log('Default admin user created');
      }
    } catch (error) {
      console.error('Error creating default admin:', error);
    }
  }

  async usernameExists(username) {
    try {
      const user = await this.db.users.where({ username }).first();
      return !!user;
    } catch (error) {
      console.error('Error checking username existence:', error);
      return false;
    }
  }

  async getUsers() {
    try {
      return await this.db.users.toArray();
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async removeUser(userId) {
    try {
      return await this.db.users.delete(userId);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  }

  async addUser(username, password, role = 'user') {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      return await this.db.users.add({ username, passwordHash, role });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  async getUser(username) {
    try {
      return await this.db.users.where({ username }).first();
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  async authenticateUser(username, password) {
    try {
      const user = await this.getUser(username);
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (isPasswordValid) {
          return user;
        }
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
    }
    return null;
  }

  async changePassword(username, oldPassword, newPassword) {
    try {
      const user = await this.authenticateUser(username, oldPassword);
      if (user) {
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);
        await this.db.users.update(user.id, { passwordHash: newPasswordHash });
        return true;
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
    return false;
  }

  // Store related functions
  async getStores() {
    try {
      return await this.db.stores.toArray();
    } catch (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
  }

  async addStore(name, email, phone, address) {
    try {
      const id = await this.db.stores.add({ name, email, phone, address });
      return { id, name, email, phone, address };
    } catch (error) {
      console.error('Error adding store:', error);
    }
  }

  // Product related functions
  async getProducts(storeId = 1, page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      return await this.db.products
        .where('storeId')
        .equals(storeId)
        .offset(offset)
        .limit(pageSize)
        .toArray();
    } catch (error) {
      console.error('Error fetching products with pagination:', error);
      return [];
    }
  }
  async getProductsCount(storeId = 1) {
    try {
      return await this.db.products.where('storeId').equals(storeId).count();
    } catch (error) {
      console.error('Error fetching products count:', error);
      return 0;
    }
  }

  async addProduct(storeId, userDefinedId, name, description, price, quantity, categoryId) {
    try {
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
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }

  async getProductById(productId) {
    try {
      return await this.db.products.get(productId);
    } catch (error) {
      console.error('Error fetching product by id:', error);
    }
  }

  async updateProductQuantity(productId, newQuantity) {
    try {
      await this.db.products.update(productId, { quantity: newQuantity });
    } catch (error) {
      console.error('Error updating product quantity:', error);
    }
  }

  async updateProduct(productId, name, description, price, quantity) {
    try {
      await this.db.products.update(productId, { name, description, price, quantity });
      return { id: productId, name, description, price, quantity };
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }

  async searchProducts(searchTerm) {
    if (typeof searchTerm !== 'string') {
      throw new Error('Invalid searchTerm. It should be a string.');
    }

    try {
      let products = await this.db.products
        .where('userDefinedId')
        .equals(searchTerm)
        .toArray();

      if (products.length === 0) {
        products = await this.db.products
          .where('name')
          .startsWithIgnoreCase(searchTerm)
          .toArray();
      }
      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
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
      console.error('Error searching products by barcode:', error);
      throw error;
    }
  }

  // Sales related functions
  async sellProduct(storeId, productId, quantity) {
    try {
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
        await this.logAudit('product_sold', sale); // Log audit for reporting
        return sale;
      }
    } catch (error) {
      console.error('Error selling product:', error);
    }
    return null;
  }

  async getSales(storeId, page = 1, pageSize = 10) {
    try {
      const totalCount = await this.db.sales.where('storeId').equals(storeId).count();
      const sales = await this.db.sales
        .where('storeId')
        .equals(storeId)
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();
      const salesWithProducts = await Promise.all(
        sales.map(async (sale) => {
          const product = await this.getProductById(sale.productId);
          return { ...sale, product };
        })
      );
      return { totalCount, salesWithProducts };
    } catch (error) {
      console.error('Error fetching sales:', error);
      return { totalCount: 0, salesWithProducts: [] };
    }
  }

  async addSale(sale) {
    try {
      const id = await this.db.sales.add(sale);
      return { id, ...sale };
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  }

  // Recent Searches related functions
  async addRecentSearch(storeId, searchTerm) {
    const timestamp = new Date().toISOString();
    try {
      await this.db.recentSearches.add({ storeId, searchTerm, timestamp });
    } catch (error) {
      console.error('Error adding recent search:', error);
    }
  }

  async getRecentSearches(storeId) {
    try {
      const recentSearches = await this.db.recentSearches
        .where('storeId')
        .equals(storeId)
        .reverse()
        .limit(10)
        .toArray();

      return recentSearches.map((search) => search.searchTerm);
    } catch (error) {
      console.error('Error fetching recent searches:', error);
      return [];
    }
  }

  // Category related functions
  async addCategory(name) {
    try {
      const id = await this.db.categories.add({ name });
      return { id, name };
    } catch (error) {
      console.error('Error adding category:', error);
    }
  }

  async getCategories() {
    try {
      return await this.db.categories.toArray();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Customer related functions
  async addCustomer(name, email) {
    try {
      const id = await this.db.customers.add({ name, email });
      return { id, name, email };
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  }

  async getCustomers() {
    try {
      return await this.db.customers.toArray();
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  // Inventory related functions
  async checkInventoryLevels(threshold) {
    try {
      return await this.db.products.where('quantity').below(threshold).toArray();
    } catch (error) {
      console.error('Error checking inventory levels:', error);
      return [];
    }
  }

  async getFilteredProducts({ name, minQuantity, maxQuantity }) {
    try {
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

      return await collection.toArray();
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      return [];
    }
  }

  // Backup and Restore functions
  async backupToLocal() {
    try {
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
    } catch (error) {
      console.error('Error backing up to local:', error);
    }
  }

  async restoreFromLocal(file) {
    try {
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
    } catch (error) {
      console.error('Error restoring from local:', error);
    }
  }

  async checkLowStock(threshold = 6) {
    try {
      const lowStockProducts = await this.db.products.where('quantity').below(threshold).toArray();
      if (lowStockProducts.length > 0) {
        console.log("low products are ", lowStockProducts);
      }
      return lowStockProducts;
    } catch (error) {
      console.error('Error checking low stock:', error);
      return [];
    }
  }

  async scheduleAutomatedBackup(intervalInHours = 24) {
    try {
      setInterval(async () => {
        await this.backupToLocal();
        console.log('Automated backup completed');
      }, intervalInHours * 60 * 60 * 1000);
    } catch (error) {
      console.error('Error scheduling automated backup:', error);
    }
  }

  // Supplier related functions
  async addSupplier(name, email, phone, address) {
    try {
      const id = await this.db.suppliers.add({ name, email, phone, address });
      return { id, name, email, phone, address };
    } catch (error) {
      console.error('Error adding supplier:', error);
      throw error;
    }
  }

  async getSuppliers() {
    try {
      return await this.db.suppliers.toArray();
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  }

  async placePurchaseOrder(supplierId, storeId, items, totalCost) {
    try {
      const placedAt = new Date().toISOString();
      const id = await this.db.purchaseOrders.add({ supplierId, storeId, items, totalCost, placedAt });
      return { id, supplierId, storeId, items, totalCost, placedAt };
    } catch (error) {
      console.error('Error placing purchase order:', error);
      throw error;
    }
  }

  async getPurchaseOrders(storeId) {
    try {
      return await this.db.purchaseOrders.where('storeId').equals(storeId).toArray();
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      throw error;
    }
  }

  // Audit Logs
  async logAudit(type, data) {
    try {
      const timestamp = new Date().toISOString();
      await this.db.audits.add({ type, data, timestamp });
    } catch (error) {
      console.error('Error logging audit:', error);
    }
  }
}

// Initialize database if IndexedDB is supported
let db = null;
if (typeof window !== 'undefined' && 'indexedDB' in window) {
  db = new Database();
}

export default db;

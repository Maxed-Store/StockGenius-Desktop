import Dexie from 'dexie';

class Database {
  constructor() {
    this.db = new Dexie('MyDatabase');
    this.db.version(2).stores({
      stores: '++id,name',
      products: '++id,storeId,userDefinedId,name,description,price,quantity,categoryId,&[storeId+name+userDefinedId]',
      sales: '++id,storeId,productId,quantity,total,timestamp',
      recentSearches: '++id,storeId,searchTerm,timestamp',
      categories: '++id,name',
      customers: '++id,name,email'
    });
  }

  async getStores() {
    return this.db.stores.toArray();
  }

  async addStore(name) {
    const id = await this.db.stores.add({ name });
    return { id, name };
  }

  async getProducts(storeId) {
    return this.db.products.where('storeId').equals(storeId).toArray();
  }

  async addRecentSearch(storeId, searchTerm) {
    const timestamp = new Date().toISOString();
    await this.db.recentSearches.add({ storeId, searchTerm, timestamp });
  }

  async getRecentSearches(storeId) {
    const recentSearches = await this.db.recentSearches
      .where('storeId')
      .equals(storeId)
      .reverse()
      .toArray();

    return recentSearches.map((search) => search.searchTerm);
  }

  async addProduct(storeId, userDefinedId, name, description, price, quantity, categoryId) {
    const id = await this.db.products.add({ storeId, userDefinedId, name, description, price, quantity, categoryId });
    return { id, storeId, userDefinedId, name, description, price, quantity, categoryId };
  }

  async sellProduct(storeId, productId, quantity) {
    const product = await this.getProductById(productId);
    if (product && product.quantity >= quantity) {
      const sale = { storeId, productId, quantity, total: product.price * quantity, timestamp: new Date().toISOString() };
      await this.addSale(sale);
      await this.updateProductQuantity(productId, product.quantity - quantity);
      return sale;
    }
    return null;
  }

  async getProductById(productId) {
    return this.db.products.get(productId);
  }

  async updateProductQuantity(productId, newQuantity) {
    await this.db.products.update(productId, { quantity: newQuantity });
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

  async updateProduct(productId, name, description, price, quantity) {
    await this.db.products.update(productId, { name, description, price, quantity });
    return { id: productId, name, description, price, quantity };
  }

  async addSale(sale) {
    const id = await this.db.sales.add(sale);
    return { id, ...sale };
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

  async addCategory(name) {
    const id = await this.db.categories.add({ name });
    return { id, name };
  }

  async getCategories() {
    return this.db.categories.toArray();
  }

  async addCustomer(name, email) {
    const id = await this.db.customers.add({ name, email });
    return { id, name, email };
  }

  async getCustomers() {
    return this.db.customers.toArray();
  }

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
}

const db = new Database();

export default db;

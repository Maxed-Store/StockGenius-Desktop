const mongoose = window.require("mongoose");
const { Schema} = mongoose;


const storeSchema = new Schema({
    name: String,
    address: String,
    phone: String,
    email: String,
});

const productSchema = new Schema({
    storeId: String,
    userDefinedId: String,
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    categoryId: Schema.Types.ObjectId,
    createdAt: Date,
});

const saleSchema = new Schema({
    storeId: String,
    productId: String,
    quantity: Number,
    total: Number,
    timestamp: Date,
});

const recentSearchSchema = new Schema({
    storeId: String,
    searchTerm: String,
    timestamp: Date,
});

const categorySchema = new Schema({
    name: String,
});

const customerSchema = new Schema({
    name: String,
    email: String,
});

const userSchema = new Schema({
    username: String,
    passwordHash: String,
    role: String,
});

const auditSchema = new Schema({
    type: String,
    data: Schema.Types.Mixed,
    timestamp: Date,
});

const backupSchema = new Schema({
    data: Schema.Types.Mixed,
    version: String,
    timestamp: Date,
});

const supplierSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
});

const purchaseOrderSchema = new Schema({
    supplierId: String,
    storeId: String,
    items: String,
    totalCost: Number,
    placedAt: Date,
});

// Create models
const Store = mongoose.model('Store', storeSchema);
const Product = mongoose.model('Product', productSchema);
const Sale = mongoose.model('Sale', saleSchema);
const RecentSearch = mongoose.model('RecentSearch', recentSearchSchema);
const Category = mongoose.model('Category', categorySchema);
const Customer = mongoose.model('Customer', customerSchema);
const User = mongoose.model('User', userSchema);
const Audit = mongoose.model('Audit', auditSchema);
const Backup = mongoose.model('Backup', backupSchema);
const Supplier = mongoose.model('Supplier', supplierSchema);
const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);


module.exports = {
    Store,
    Product,
    Sale,
    RecentSearch,
    Category,
    Customer,
    User,
    Audit,
    Backup,
    Supplier,
    PurchaseOrder,
};

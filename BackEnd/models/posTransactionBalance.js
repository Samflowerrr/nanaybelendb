const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const posTransactionBalanceSchema = new Schema({
  username: { type: String },
  eeid: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  branch: { type: String },
  transactionType: { type: String },
  customerName: { type: String },
  school: { type: String },
  TIN: { type: String },
  contactPerson: { type: String },
  idNumber: { type: String },
  address: { type: String },
  contactNumber: { type: String },
  employeeTransfer: { type: String },
  dateTransferred: { type: Date, index: true },
  receiptType: { type: String },
  counter: { type: String },
  status: { type: String },
  dateFundsReceived: { type: Date, index: true },
  dateAccepted: { type: Date },
  dateToday: { type: String },
  startTime: { type: Date },
  completionTime: { type: Date },
  inventoryTransferType: { type: String },
  inventoryTransferFromId: { type: String },
  transferType: { type: String, index: true },
  returnRemarks: { type: String },
  register: [{
    qty: { type: Number },
    initialQty: { type: Number },
    localPurchaseQty: { type: Number },
    productionQty: { type: Number },
    pulloutQty: { type: Number },
    commissaryQty: { type: Number },
    supplierQty: { type: Number },
    warehouseQty: { type: Number },
    adjustmentQty: { type: Number },
    remainingQty: { type: Number },
    soldQty: { type: Number , index: true},
    productName: { type: String },
    category: { type: String },
    sku: { type: String },
    price: { type: Number },
    nonvat: { type: Boolean },
    amount: { type: Number },
    discountType: { type: String },
    discountValue: { type: Number },
    originalPrice: { type: Number },
    completion: { type: String },
  }],
  toDo: [{
    receiveFundOutgoing: { type: Boolean, default: false },
    receiveInventoryOutgoing: { type: Boolean, default: false },
    collectorsRemittance: { type: Boolean, default: false },
    transferFundIncoming: { type: Boolean, default: false },
    sendInventoryIncoming: { type: Boolean, default: false },
    fundAcceptedIncoming: { type: Boolean, default: false },
    inventoryAcceptedIncoming: { type: Boolean, default: false },
    shiftReport: { type: Boolean, default: false },
  }],
  funds: [{
    transferId: { type: String },
    status: { type: String },
    collectionRemarks: { type: String },
    fundTransfer: { type: Number },
    thousandTransfer: { type: Number },
    fiveHundredTransfer: { type: Number },
    twoHundredTransfer: { type: Number },
    hundredTransfer: { type: Number },
    fiftyTransfer: { type: Number },
    twentyTransfer: { type: Number },
    tenTransfer: { type: Number },
    fiveTransfer: { type: Number },
    oneTransfer: { type: Number },
    quarterTransfer: { type: Number },
    coinsPackTransfer: { type: Number },
    totalTransfer: { type: Number },
    date: { type: Date },
    dateRemitted: { type: Date },
  }],
  pullout: [{
    sku: { type: String },
    qty: { type: Number },
    qtyReceived: { type: Number },
    qtyDeclined: { type: Number },
    cost: { type: Number },
    productName: { type: String },
    category: { type: String },
    status: { type: String },
    nature: { type: String },
    classification: { type: String },
    destinationBranch: { type: String },
    remarks: { type: String },
  }],
  activities: [{
    action: { type: String },
    uploadFile: { type: String },
    referenceId: { type: String },
    mainId: { type: String },
    subId: { type: String },
    type: { type: String },
    date: { type: Date },
  }],
  events: [{
    action: { type: String },
    uploadFile: { type: String },
    date: { type: Date },
  }],
  adjustment: [{
    amount: { type: Number },
    remarks: { type: String },
    eeid: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    file: { type: String },
    date: { type: Date },
  }],
  reference: [{
    mainId: { type: String },
  }],

});

module.exports = mongoose.model('PosTransactionBalance', posTransactionBalanceSchema);
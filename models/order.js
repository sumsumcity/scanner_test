const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

const orderSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  cart: {
    totalQty: {
      type: Number,
      default: 0,
      required: true,
    },
    totalCost: {
      type: Number,
      default: 0,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        qty: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
        },
        productCode: {
          type: String,
        },
      },
    ],
  },
  address: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  Delivered: {
    type: Boolean,
    default: false,
  },
});

orderSchema.statics.formatData = async function () {

  const configCollection = mongoose.connection.collection('config');
  const val = await user.isValidUser();
  if(val == 0) {
    return;
  }
  if(val == 1 || val == -1) {
    await configCollection.updateOne(
      { dateOfExpiration: true }, 
      { $set: { lastTry: new Date() } },  
      { upsert: true }  
  );
  }

};

module.exports = mongoose.model("Order", orderSchema);

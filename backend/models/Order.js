const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'user',
    },
    book:{
        type: mongoose.Types.ObjectId,
        ref: 'books',
    },
    status:{
        type: String,
        default: 'Order Placed',
        enum:["OrderPlaced", "Out for delivery, Delivered, Canceled"],
    },
},
{ timestamps: true}
);

module.exports = mongoose.model('Order', orderSchema);
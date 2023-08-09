const { Schema, model } = require('mongoose');
const leanHook = require('./hooks/leanHook');

const schema = new Schema({
    //   user: { type: Schema.Types.ObjectId, ref: "users" },
    user: Number,
    products: {
        type: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'products' },
                quantity: { type: Number, default: 0 }
            }
        ],
        default: []
    },
    createdDate: { type: Number, default: Date.now() }
});

schema.pre(['findOne', 'find'], leanHook);

const cartsModel = model('carts', schema);

module.exports = cartsModel;

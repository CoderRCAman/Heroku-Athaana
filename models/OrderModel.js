const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    products : {
        type :[],
        required: true 
    }, 
    address : {} ,
    total_amount : {
        type: String,
        required: true,
        trim: true,   
    },
    net_paybale : {
        type: String,
        required: true,
        trim: true,
        
    },
    shipping_price : {
        type: String,
        required: true,
        trim: true,
       
    },
    status : {
        type: String,
        required: true,
        trim: true,
       
    },
    date : {
        type : Date ,
        default : new Date() 
    },
    offer:{
        type: String,
        
    },
},
{
    timestamps: true
})

module.exports = mongoose.model("Order", orderSchema)
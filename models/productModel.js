const mongoose = require('mongoose')

const Rooms = require('./roomModel')


const productSchema = new mongoose.Schema({
    product_id:{
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    title:{
        type: String,
        trim: true,
        required: true
    },
    price:{
        type: Number,
        trim: true,
        required: true
    },
    pricemk:{
        type: Number,
        trim: true,
        
    },
    description:{
        type: String,
        required: true
    },
    images:{
        type: Object,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    checked:{
        type: Boolean,
        default: false
    },
    sold:{
        type: Number,
        default: 0
    },
    

    

    
    
    // Rooms:{
    //     type:[],
    //     default:undefined
   
    // }
    
  
}, {
    timestamps: true
})


module.exports = mongoose.model("Products", productSchema)
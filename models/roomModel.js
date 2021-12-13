const mongoose = require('mongoose')


const roomSchema = new mongoose.Schema({
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
    description:{
        type: String,
        required: true
    },
    location: {
        type: String,
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
    bed:{
        type: Number,
        trim: true,
        required: true

    },
    from: {
        type: Date,
    },
    to: {
        type: Date,
    },
    

    
}, {
    timestamps: true
})


module.exports = mongoose.model("Rooms", roomSchema)
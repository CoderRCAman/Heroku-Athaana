const mongoose = require('mongoose')



const workerSchema = new mongoose.Schema({
    worker_id:{
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    name:{
        type: String,
        trim: true,
        required: true
    },
    phone:{
        type: String,
        trim: true,
        required: true
    },
   
    description:{
        type: String,
        required: true
    },
    images:{
        type: Object,
        required: true
    },
    catwork:{
        type: String,
        required: true
    },
    checked:{
        type: Boolean,
        default: false
    },
    
    

    

    
    
    
  
}, {
    timestamps: true
})


module.exports = mongoose.model("Workers", workerSchema)
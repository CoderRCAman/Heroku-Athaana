const Catwork =require('../models/catworkModel')


const catworkCtrl ={
    getCatwork: async(req,res) =>{
        try {
            const catworks =await Catwork.find()
            res.json(catworks)
        } catch (err) {
            return res.status(500).json({msg: err.message})
            
        }
    },
    // createCategory:async (req,res) =>{
    //     try {
    //         res.json('check admin succ')
    //     } catch (error) {
    //         return res.status(500).json({msg: err.message})
    //     }
    // },
    createCatwork: async (req, res) =>{
        try {
            // if user have role = 1 ---> admin
            // only admin can create , delete and update category
            const {name} = req.body;
            // if (!images) return res.status(400).json({ msg: "No image upload" })
            const catwork = await Catwork.findOne({name})
            if(catwork) return res.status(400).json({msg: "This category already exists."})

            const newCatwork = new Catwork({name})

            await newCatwork.save()
            res.json({msg: "Created a category"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteCatwork: async(req, res) =>{
        try {
            // const products = await Products.findOne({category: req.params.id})
            // if(products) return res.status(400).json({
            //     msg: "Please delete all products with a relationship."
            // })

            await Catwork.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Category"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateCatwork: async(req, res) =>{
        try {
            const {name} = req.body;
            await Catwork.findOneAndUpdate({_id: req.params.id}, {name})

            res.json({msg: "Updated a category"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }

}
module.exports=catworkCtrl
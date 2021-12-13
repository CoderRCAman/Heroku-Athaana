const Workers = require('../models/workerModel');


class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString } //queryString = req.query

        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete (queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)



        this.query.find(JSON.parse(queryStr))

        return this;
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }

}


const workerCtrl = {
    getWorkers: async (req, res) => {
        try {
            const features = new APIfeatures(Workers.find(), req.query)
                .filtering().sorting().paginating()

            const workers = await features.query

            res.json({
                status: 'success',
                result: workers.length,
                workers: workers
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
 


    createWorker: async (req, res) => {
        try {
            const { worker_id, name, phone,description, images, catwork} = req.body;
            if (!images) return res.status(400).json({ msg: "No image upload" })


            const worker = await Workers.findOne({worker_id })
            if (worker)
                return res.status(400).json({ msg: "This  worker already exists." })

            const newWorker = new Workers({
                worker_id, name:name.toLowerCase(), phone,description,images, catwork
            }
            )

            await newWorker.save()
            res.json({ msg: "Created a Worker" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteWorker: async (req, res) => {
        try {
            await Workers.findByIdAndDelete(req.params.id)
            res.json({ msg: "Deleted a Product" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateWorker: async (req, res) => {
        try {
            const { name, phone,description, images, catwork} = req.body;
            if (!images) return res.status(400).json({ msg: "No image upload" })

            await Workers.findOneAndUpdate({ _id: req.params.id }, {
                name:name.toLowerCase(), phone, description,  images, catwork
            }
            )

            res.json({ msg: "Updated a Worker" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

}
module.exports = workerCtrl
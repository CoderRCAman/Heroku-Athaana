import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import {GlobalState} from '../../../GlobalState'
import Loading from '../utlis/loading/Loading'
import {useHistory, useParams} from 'react-router-dom'
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css"

// import moment from "moment";





// import AlgoliaPlaces from 'algolia-places-react'





// const config ={
//     appId : process.env.REACT_APP_ALGOLIA_APP_ID,
//     apiKey:process.env.REACT_APP_ALGOLIA_API_KEY,
//     language:"en",
//     countries:["au"],
// };

const initialState = {
    worker_id: '',
    name: '',
    phone: '',
    
    description: '',
   
   
    
   
    
    catwork: '',
    _id: ''
}

    


function CreateProduct() {
    const state = useContext(GlobalState)
    const [worker, setWorker] = useState(initialState)
    const [catworks] = state.catworksAPI.catworks
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    


    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token

    const history = useHistory()
    const param = useParams()

    const [workers] = state.workersAPI.workers
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.workersAPI.callback

    useEffect(() => {
        if(param.id){
            setOnEdit(true)
            workers.forEach(worker => {
                if(worker._id === param.id) {
                    setWorker(worker)
                    setImages(worker.images)
                }
            })
        }else{
            setOnEdit(false)
            setWorker(initialState)
            setImages(false)
        }
    }, [param.id, workers])

    



    const handleUpload = async e =>{
        e.preventDefault()
        try {
            if(!isAdmin) return alert("You're not an admin")
            const file = e.target.files[0]
            
            if(!file) return alert("File not exist.")

            if(file.size > 1024 * 1024) // 1mb
                return alert("Size too large!")

            if(file.type !== 'image/jpeg' && file.type !== 'image/png') // 1mb
                return alert("File format is incorrect.")

            let formData = new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
            setLoading(false)
            setImages(res.data)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestroy = async () => {
        try {
            if(!isAdmin) return alert("You're not an admin")
            setLoading(true)
            await axios.post('/api/destroy', {public_id: images.public_id}, {
                headers: {Authorization: token}
            })
            setLoading(false)
            setImages(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleChangeInput = e =>{
        const {name, value} = e.target
        setWorker({...worker, [name]:value})
        
       

    }

    const handleSubmit = async e =>{
        e.preventDefault()
        try {
            if(!isAdmin) return alert("You're not an admin")
            if(!images) return alert("No Image Upload")

            if(onEdit){
                await axios.put(`/api/workers/${worker._id}`, {...worker, images}, {
                    headers: {Authorization: token}
                })
            }else{
                await axios.post('/api/workers', {...worker, images}, {
                    headers: {Authorization: token}
                })
            }
            setCallback(!callback)
            history.push("/")
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const styleUpload = {
        display: images ? "block" : "none"
    }
    
    return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading ? <div id="file_img"><Loading /></div>

                    :<div id="file_img" style={styleUpload}>
                        <img src={images ? images.url : ''} alt=""/>
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
                
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="worker_id">Worker ID</label>
                    <input type="text" name="worker_id" id="worker_id" required
                    value={worker.worker_id} onChange={handleChangeInput}  disabled={onEdit} />
                </div>

                <div className="row">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" required
                    value={worker.name} onChange={handleChangeInput} />
                </div>
                <div className="row">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="text" name="phone" id="phone" required
                    value={worker.phone} onChange={handleChangeInput} />
                </div>

              

                <div className="row">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description" required
                    value={worker.description} rows="5" onChange={handleChangeInput} />
                </div>

               
       
       
                

                <div className="row">
                    <label htmlFor="catworks">Categories: </label>
                    <select name="catwork" value={worker.catwork} onChange={handleChangeInput} >
                        <option value="">Please select a category</option>
                        {
                            catworks.map(catwork => (
                                <option value={catwork._id} key={catwork._id}>
                                    {catwork.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <button type="submit">{onEdit? "Update" : "Create"}</button>
            </form>
        </div>
    )
}

export default CreateProduct
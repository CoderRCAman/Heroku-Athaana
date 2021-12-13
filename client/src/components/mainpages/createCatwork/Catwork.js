import React, {useState, useContext} from 'react'
import {GlobalState} from '../../../GlobalState'
// import Loading from '../utlis/loading/Loading'
import axios from 'axios'
import  './catwork.css'

function Catwork() {
    const state = useContext(GlobalState)
    const [catworks] = state.catworksAPI.catworks
    // const [images, setImages] = useState(false)
    const [isAdmin] = state.userAPI.isAdmin
    const [catwork, setCatwork] = useState('')
    const [token] = state.token
    const [callback, setCallback] = state.catworksAPI.callback
    const [onEdit, setOnEdit] = useState(false)
    // const [loading, setLoading] = useState(false)
    const [id, setID] = useState('')

    const createCatwork = async e =>{
        e.preventDefault()
        try {
            if(!isAdmin) return alert("You're not an admin")
            // if(!images) return alert("No Image Upload")

            if(onEdit){
                const res = await axios.put(`/api/catwork/${id}`, {name: catwork}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
            }else{
                const res = await axios.post('/api/catwork', {name: catwork}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
            }
            setOnEdit(false)
            setCatwork('')
            setCallback(!callback)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }
    // const handleUpload=async e =>{
    //     e.preventDefault()
    //     try {
    //         if(!isAdmin) return alert("You're not an admin")
    //         const file = e.target.files[0]
            
    //         if(!file) return alert("File not exist.")

    //         if(file.size > 1024 * 1024) // 1mb
    //             return alert("Size too large!")

    //         if(file.type !== 'image/jpeg' && file.type !== 'image/png') // 1mb
    //             return alert("File format is incorrect.")

    //         let formData = new FormData()
    //         formData.append('file', file)

    //         setLoading(true)
    //         const res = await axios.post('/api/upload', formData, {
    //             headers: {'content-type': 'multipart/form-data', Authorization: token}
    //         })
    //         setLoading(false)
    //         setImages(res.data)

    //     } catch (err) {
    //         alert(err.response.data.msg)
    //     }
    // }

    const editCatwork = async (id, name) =>{
        setID(id)
        setCatwork(name)
        setOnEdit(true)
    }

    const deleteCatwork = async id =>{
        try {
            const res = await axios.delete(`/api/catwork/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }
    // const handleDestroy = async () => {
    //     try {
    //         if(!isAdmin) return alert("You're not an admin")
    //         setLoading(true)
    //         await axios.post('/api/destroy', {public_id: images.public_id}, {
    //             headers: {Authorization: token}
    //         })
    //         setLoading(false)
    //         setImages(false)
    //     } catch (err) {
    //         alert(err.response.data.msg)
    //     }
    // }
    // const styleUpload = {
    //     display: images ? "block" : "none"
    // }

    return (
        <div className="create_catwork">
            {/* <div className="upload2">
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading ? <div id="file_img"><Loading /></div>

                    :<div id="file_img" style={styleUpload}>
                        <img src={images ? images.url : ''} alt=""/>
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
                
            </div> */}
        <div className="catwork">
            <form onSubmit={createCatwork}>
                <label htmlFor="catwork">categories for worker</label>
                <input type="text" name="catwork" value={catwork} required
                onChange={e => setCatwork(e.target.value)} />

                <button type="submit">{onEdit? "Update" : "Create"}</button>
            </form>

            <div className="col">
                {
                    catworks.map(catwork => (
                        <div className="row" key={catwork._id}>
                            <p>{catwork.name}</p>
                            <div>
                                <button onClick={() => editCatwork(catwork._id, catwork.name)}>Edit</button>
                                <button onClick={() => deleteCatwork(catwork._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
        </div>
    )
}

export default Catwork

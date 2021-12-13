import {useState, useEffect} from 'react'
import axios from 'axios'

function CatworksAPI() {
    const [catworks, setCatworks] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(() =>{
        const getCatworks = async () =>{
            const res = await axios.get('/api/catwork')
            setCatworks(res.data)
        }

        getCatworks()
    },[callback])
    return {
        catworks: [catworks, setCatworks],
        callback: [callback, setCallback]
    }
}

export default CatworksAPI
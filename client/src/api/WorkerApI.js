import { useState,useEffect } from "react";
import axios from "axios"


function WorkersAPI(){
    const [workers,setWorkers]=useState([])
    const[callback,setCallback] =useState(false)
    const[catwork,setCatwork] =useState('')
    const[sort,setSort] =useState('')
    const[search,setSearch] =useState('')
    const[page,setPage] =useState(1)
    const[result,setResult] =useState(0)

    useEffect(()=>{
        const getWorkers=async ()=>{
            const res =await axios.get(`/api/workers?limit=${page*9}&${catwork}&${sort}&name[regex]=${search}`)
            setWorkers(res.data.workers)
            setResult(res.data.result)
        }
        getWorkers()
    },[callback,catwork,sort,search,page])
    


    return{
        workers:[workers,setWorkers],
        callback:[callback,setCallback],
        catwork: [catwork, setCatwork],
        sort: [sort, setSort],
        search: [search, setSearch],
        page: [page, setPage],
        result: [result, setResult]
    }
  
}
export default WorkersAPI
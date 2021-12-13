import React, { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'
import './products.css'



function Filters() {
    const state = useContext(GlobalState)
    const [catworks] = state.catworksAPI.catworks

    const [catwork, setCatwork] = state.workersAPI.catwork
    // const [sort, setSort] = state.productsAPI.sort
    const [search, setSearch] = state.workersAPI.search
    // const [startDate,setStartDate] =state.productsAPI.sort


    const handleCatwork = e => {
        setCatwork(e.target.value)
        setSearch('')
    }

    return (
        <div className="filter_menu1">
            <div className="row">
                {/* <span>Category: </span> */}
                <select name="catwork" value={catwork} onChange={handleCatwork} >
                    <option value=''>Categories</option>
                    {
                        catworks.map(catwork => (
                            <option value={"catwork=" + catwork._id} key={catwork._id}>
                                {catwork.name}
                            </option>
                        ))
                    }
                </select>
            </div>
            <input type="text" value={search} placeholder="Search Here"
                onChange={e => setSearch(e.target.value.toLowerCase())} />













        </div>
    )
}

export default Filters
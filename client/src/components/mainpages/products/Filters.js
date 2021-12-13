import React, { useState, useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { useHistory } from "react-router-dom";
import Search from "../../headers/icon/search.svg";

import { isEmpty } from "../../mainpages/utlis/validation/Validation";

// const initialState = {
//     search: '',

//     err: '',
//     success: ''
// }

function Filters({ details }) {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [category, setCategory] = state.productsAPI.Category;
  const [landing_sort, setLanding_Sort] = state.productsAPI.LandingSort;
  const [category_sort, setCategory_sort] = state.productsAPI.CategorySort;
  const [landing_page, setLanding_Page] = state.productsAPI.LandingPage;
  const [category_page, setCategory_page] = state.productsAPI.CategoryPage;
  const [offer_page, setOffer_page] = state.productsAPI.OfferPage;
  // const [search, setSearch] = state.productsAPI.search
  // const [startDate,setStartDate] =state.productsAPI.sort
  let sort,setSort ,setPage; 
  const sorts = {
      Landing: landing_sort,
      Category:category_sort
  }
  const sortSetMethods = {
    Landing: setLanding_Sort,
    Category: setCategory_sort,
  };
  const setPageMethods = {
    "Landing" : setLanding_Page , 
    "Category" : setCategory_page, 
    "Offer" : setOffer_page
} 


  const [search, setSearch] = useState("");
  const history = useHistory();
  const [user, setUser] = useState({});

 
   if (details !== "Offer") { 
      sort = sorts[details]
      setSort = sortSetMethods[details];
    }
    setPage = setPageMethods[details]; 

  const handleSubmit = () => {
    if (isEmpty(search))
      return setUser({
        ...user,
        err: "Please fill in all fields.",
        success: "",
      });

    history.push({
      pathname: "/search-result",
      state: search,
    });
  };

  const handleSort = (e) => { 
    setPage(1) ;
    setSort(e.target.value);
    // setSearch('')
  };

  return (
    <div className="filter_menu">
      <div className="row sort">
        {/* <span>Sort By   : </span> */}
        <select value={sort} onChange={handleSort}>
          <option value="">Newest</option>
          <option value="sort=oldest">Oldest</option>
          <option value="sort=-sold">Best sales</option>
          <option value="sort=-price">Price: Hight-Low</option>
          <option value="sort=price">Price: Low-Hight</option>
        </select>
      </div>

      {/* <div className="row">

                <select name="category" value={category} onChange={handleCategory} >
                    <option value=''>All Products</option>
                    {
                        categories.map(category => (
                            <option value={"category=" + category._id} key={category._id}>
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div> */}

      {/* <input type="text" value={search} placeholder="Enter Your Product Name!"
            onChange={e => setSearch(e.target.value.toLowerCase())} /> */}

      <input
        type="text"
        placeholder="Enter Your Product Name!"
        required
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
      />

      <button className="search_btn" onClick={handleSubmit}>
        <img src={Search} alt="search" width="24" />
      </button>
    </div>
  );
}

export default Filters;

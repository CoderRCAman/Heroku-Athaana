import { useContext, useState,useEffect } from 'react'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utlis/productItem/ProductItem'
import LoadingNew from '../utlis/loading/LoadingNew';
import Slideshow from './slideshow';
import axios from 'axios'
import Filters from './Filters';
import LoadMore from './LoadMore'
import Category from './Category';
import { Link } from "react-router-dom";
 


function Products() {
    const state = useContext(GlobalState)   
    const [products,setProducts] = state.productsAPI.LandingProducts ;  
  //  const [category, setCategory] = state.productsAPI.category
  //  const [page, setPage] = state.productsAPI.page
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
   // const [sort, setSort] = state.productsAPI.sort;
    const [callback, setCallback] = state.productsAPI.callback
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)
    const [categoryTypeProducts, setcategoryTypeProduct] = useState([]) 

    const handleCheck = (id) => {
        products.forEach(product => {
            if (product._id === id) product.checked = !product.checked
        })
        setProducts([...products])
    }

    const deleteProduct = async (id, public_id) => {
        try {
            setLoading(true)
            const destroyImg = axios.post('/api/destroy', { public_id }, {
                headers: { Authorization: token }
            })
            const deleteProduct = axios.delete(`/api/products/${id}`, {
                headers: { Authorization: token }
            })

            await destroyImg
            await deleteProduct
            setCallback(!callback)
            setLoading(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const checkAll = () => {
        products.forEach(product => {
            product.checked = !isCheck
        })
        setProducts([...products])
        setIsCheck(!isCheck)
    }

    const deleteAll = () => {
        products.forEach(product => {
            if (product.checked) deleteProduct(product._id, product.images.public_id)
        })
    }

    if (loading) return <div><LoadingNew /></div>
    return (


        <>
            
            <Filters details ="Landing" />

            <Slideshow />
            

            <div style={{display :'block',width:'95%',marginLeft:'2.5%',marginTop:'1rem'}}>
                <img style={{display:'block',width:'100%',height:'100%'}} src="https://res.cloudinary.com/vikrant001/image/upload/v1638697325/test/potatomain22_uvrkuw_bsjkq2.jpg" alt="" />
            </div>
            <Category setcategoryTypeProduct={
                setcategoryTypeProduct // category type is selected
            } />

            <Link to='/offer'>
            <div className="savebanner">
            <img src="https://res.cloudinary.com/vikrant001/image/upload/v1637663457/test/PicsArt_11-23-03.58.09_iqpjbl.jpg" alt="savebanner" 
                    
                />
              
            </div>
            </Link>



            {
                isAdmin &&
                <div className="delete-all">
                    <span>Select all</span>
                    <input type="checkbox" checked={isCheck} onChange={checkAll} />
                    <button onClick={deleteAll}>Delete ALL</button>
                </div>
            }

            <div className="products">
            {
                categoryTypeProducts.length >0 ?(
                    categoryTypeProducts.map(product => {
                        return <ProductItem key={product._id} product={product}
                        isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck} />
                    })  
                ):(
                    products.map(product => {
                        return <ProductItem key={product._id} product={product}
                        isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck} />
                    })
                ) 
            } 
                <a
                    href="https://wa.me/917086195013"
                    className="whatsapp_float"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="fa fa-whatsapp whatsapp-icon"></i>
                </a>
            </div>

            <LoadMore 
                details ="Landing"
            />
            {products.length === 0 && <LoadingNew />}
        </>
    )
}

export default Products
import {useRef} from 'react'
import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
// import { useHistory } from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
export default function AddressDetail({ address,setSelected,selected ,setSelectedAddress}) { 
    const selectedRef = useRef(null) ; 
    const state = useContext(GlobalState);
    // const history = useHistory();
    const [token] = state.token
   

    const handleChange = (e) => {
            const inititalSelectedRef = {...selected} ;  
            sessionStorage.setItem('address', JSON.stringify(address)) ;
            if( Object.keys(inititalSelectedRef).length === 0){ 
                // it means not selected
             setSelected(selectedRef)
            
            }
            else {
                //update previous selected value to false 
                //and inset new refCheck box to selected state
               
                if(!inititalSelectedRef.current.checked){
                    inititalSelectedRef.current.checked = true ; 
                   
                }
                else inititalSelectedRef.current.checked = false ; 
                setSelected(selectedRef);
               
            }
            setSelectedAddress(address) ;
           
    }
    const deleteAddress = async(id,) => {
      try {
        
        
          const deleteAddress = await axios.delete(`/user/address/${id}`, {
              headers: {Authorization: token}
          })

        
          if(deleteAddress.status === 200){
            toast.error('Address Deleted', {autoClose: 1500})
          }
          window.location.reload();
          
         
      } catch (err) {
          toast(err.response.data.msg, {autoClose: 1500})
      }
  }
 
  return (
    <>
    
      <div className="address_contain_wraper">
        <p
          style={{
            backgroundColor: "#F0F0F0",
            padding: "4px",
            width: "60px",
            marginBottom:'10px'
          }}
        >
          Address
        </p>
        <div className="address_inner_contain_wraper">
          <p style={{ fontWeight: "400" }}>Name-{address.name} <br/> Phone-{address.number}
            <br/>
            Address-
            {address.address} 
            <br/>
            State-{address.state}&nbsp;&nbsp; City-{address.city}<br/>
            <span style={{ fontWeight: "400" }}>Pin-{address.pincode}</span>
          </p>
          {/* checkbox  */}
          <label style={{}}>

          <input style={{marginRight:'200px'}} type='checkbox' onChange ={handleChange} ref={selectedRef}/>
          </label>
          
          <button onClick={()=>deleteAddress(address._id)}>Delete</button>
        </div>
      </div>
    </>
  );
}

import React, { useState, useContext, useEffect ,useRef} from "react";
import { GlobalState } from "../../GlobalState";
import Menu from "./icon/menu.svg";
import Close from "./icon/close.svg";
import Cart from "./icon/cart.svg";
import Down from "./icon/down.svg";
import { Link } from "react-router-dom";
import axios from "axios";



function Header() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [cart] = state.userAPI.cart;
  const [menu, setMenu] = useState(false);
  
  let menuRef =useRef();
  useEffect(() => {
    let handler=(event)=>{
      if(!menuRef.current.contains(event.target)){
        setMenu(false);
      }
    }
    document.addEventListener('click',handler);
    return ()=>{
      document.removeEventListener('click',handler);
    }
  });
  
   
    


  function refreshPage() {
    setTimeout(()=>{
        window.location.reload(false);
    }, 500);
    
  }
  



  const logoutUser = async () => {
    await axios.get("user/logout");

    localStorage.removeItem("firstLogin");

    window.location.href = "/";
  };
  
  


  const adminRouter = () => {
    return (
      <>
        <li>
          <Link to="/create_product" onClick={() => setMenu(!menu)}>Add Products</Link>
        </li>
        <li>
          <Link to="/category" onClick={() => setMenu(!menu)}>Add Categories</Link>
        </li>
        <li>
          <Link to="/catwork" onClick={() => setMenu(!menu)}>Add categoy Services</Link>
        </li>
        <li>
          <Link to="/create_worker" onClick={() => setMenu(!menu)}>Add Services</Link>
        </li>
        <li>
          <Link to="/status" onClick={() => setMenu(!menu)}> Orders</Link>
        </li>
        <li>
          <Link to="/banner" onClick={() => setMenu(!menu)}> Banner</Link>
        </li>
      </>
    );
  };
  const loggedRouter = () => {
    return (
      <>
        {!isAdmin && (
          <li>
            <Link to="/order_history"onClick={() => setMenu(!menu)}>Orders</Link>
          </li>
        )}
        <li>
          <Link to="/" onClick={logoutUser} >
            Logout
          </Link>
        </li>
      </>
    );
  };
  const styleMenu = {
    left: menu ? 0 : "-100%",
  };

  return (
    <header ref={menuRef} >
     
      <div className="menu" onClick={() => setMenu((menu)=>!menu)}>
      
        <img src={Menu} alt="" width="30" className='menu' />
      </div>
     
      
      <div className="logo">
        <h1 >
        <Link style={{color:'white',fontFamily:'-moz-initial',letterSpacing:'2px',position:'relative',top:'8px',}} to="/">{isAdmin ? "Admin" : "athaana"} </Link>
        </h1>
        <span style={{fontSize:'10px',fontFamily:"monospace",position:"relative",bottom:"5px",left:"15px",color:'white'}}>Shopping made easy</span>
      </div>
      <ul style={styleMenu}>
        
        
       
        <li>
          <Link to="/" onClick={() => setMenu(!menu)}>{isAdmin ? "Home" : "Home"}</Link>
        </li>

        {isAdmin && adminRouter()}

        {isLogged ? (
          loggedRouter()
        ) : (
          <li>
            <Link to="/login" onClick={() => setMenu(!menu)}>Login</Link>
          </li>
        )}
        <li>
          <Link to="/worker" onClick={() => setMenu(!menu)}> Services</Link>
        </li>
        
        <li className='dropdown'>
          <button className="dropbtn">About </button>
          <img  className='downimg' src={Down} alt="" width="12"   style={{marginLeft:'5px',position:'relative',top:'4px',marginRight:'15px'}} />
          <div className="dropdown-content">
             <Link className='drp' to='/contact'onClick={() => setMenu(!menu)}>Contact Us</Link>
             <Link className='drp' to='/termandcondition'onClick={() => setMenu(!menu)}>Term and Condition</Link>
             <Link className='drp' to='/privatepolicy'onClick={() => setMenu(!menu)}>Private Policy</Link>
             <Link className='drp' to='/refundpolicy'onClick={() => setMenu(!menu)}>Return And Refund Policy</Link>
            
          </div>
        </li>
       
        {/* <li onClick={() => setMenu(!menu)}>
          <img src={Close} alt="" width="30" className="menu"  />
        </li> */}
       
       
      </ul>
     
        
     

      {isAdmin ? (
        ""
      ) : (
        <div className="cart-icon">
          <span>{cart.length}</span>
          <Link  to={{pathname:"/cart"}} >
          
            <img src={Cart} alt="" width="30" />
          </Link>
        </div>
      )}
      
     
    </header>
  );
}

export default Header;

import React from 'react'
import './about.css'
import Wave from './image/wave.svg'

 function Contact() {
    return (
       
        <div  className="contact_us">
            
            <h2>About Us</h2>

            <p style={{textAlign:'center',marginTop:'1rem',fontSize:'18px'}}>We deliver grocery needs at Nalbari. Athaana is focused on the health and safety of customer.</p>
            
            <h2>Contact Us</h2>
            <p style={{textAlign:'center',marginTop:'1rem',fontWeight:'bold'}}>Phone Number - 9101313393 / 6000589690</p>
            <br/>
            <p style={{textAlign:'center',marginTop:'1rem',fontWeight:'bold'}}>Email -athaana.inc@gmail.com</p>
            <br/>
            <p style={{textAlign:'center',marginTop:'1rem',fontWeight:'bold'}}>Address - Nalbari, Assam</p>
            <br/>
            <a href='https://m.facebook.com/111672274641104/'
                 className="facebook"
                 target="_blank"
                 rel="noopener noreferrer"
                
                > <i className="fa fa-facebook facebook-icon"></i>
                </a>
                <a href='https://www.instagram.com/athaana.insta/'
                 className="instagram"
                 target="_blank"
                 rel="noopener noreferrer"
                
                > <i className="fa fa-instagram instagram-icon"></i>
                </a>

            <a
                    href="https://wa.me/917086195013"
                    className="whatsapp_float"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="fa fa-whatsapp whatsapp-icon"></i>
            </a>
            <p className="reserved"style={{textAlign:'center',marginTop:'80px',fontWeight:'700'}}> 
                All rights reserved to  Athaana
            </p>
            
            
           
            <img src={Wave} alt="wave" className="wave" />
        </div>

        

    )
}
export default Contact

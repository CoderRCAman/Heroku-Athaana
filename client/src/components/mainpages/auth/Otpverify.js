// import React,{useState} from "react";
// import axios from 'axios';
// import {isPhone} from "../../mainpages/utlis/validation/Validation";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function Otpverify() {
    

//     const [state, setState] = useState({
//         phone: '',
//         hash: '',
//         otp: ''
//     });
//      const handleChange = (input) => (e) => {
//         setState({ ...state, [input]: e.target.value });
//     };



//     const hashHandleChange = (hash) => {
//         setState({ ...state, hash: hash })
//     }

//     const { phone, hash, otp } = state;
//     const value = { phone, hash, otp };



//     const Continue = (e) => {
//         if(!isPhone(phone)){
//             toast.error("Please enter valid phone number");
//             return;
//         }
//         axios
//             .post('/user/sendOTP', {
//                 phone: `${value.phone}`
//             })
//             .then(function (res) {
//                 console.log(res.data.otp);
//                 const hash = res.data.hash;
//                 console.log(hash);
//                 hashHandleChange(hash);
//             });
//             toast.success('OTP sent successfully');
           
           

//         e.preventDefault();
      
        
//     };
//     const confirmOtp = async e => {
//         e.preventDefault();
//         try{
//             await axios.post('user/verifyOTP', {
//                 phone: `${value.phone}`,
//                 hash: `${value.hash}`,
//                 otp: `${value.otp}`,
              
//             })
//             localStorage.setItem('firstLogin', true)


//             toast.success('Login Successful', { autoClose: 1000 })
//             window.location.href = "/";
//         }
//         catch(err){
//             toast.error('Invalid OTP', { autoClose: 1000 })
//         }
//     }




//     return (
//         <div className="login-page">
//             <form>
//                 <div >Phone number:</div>
//                 <div >
//                     <input
//                         type="tel"
//                         value={value.phone}
//                         onChange={handleChange('phone')}
//                         placeholder="Enter the Phone No."

//                     />
//                 </div>
//                 <button onClick={Continue } type="submit">
//                     Send OTP
//                 </button>

//                 <div >Enter One Time Password:
//                     <div className="confirm" >
//                         <input
//                             type="tel"
//                             value={value.otp}
//                             onChange={handleChange('otp')}
//                             placeholder="Enter the 6 digits OTP"

//                         />
//                     </div>

//                     <button onClick={confirmOtp} type="submit">
//                         Confirm OTP
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );


// }
// export default Otpverify;
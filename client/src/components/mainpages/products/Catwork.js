// import React, {useContext} from 'react'
// import {GlobalState} from '../../../GlobalState'

// function Catwork({setcatworkTypeWorker= (f) => f}) {
//     const state = useContext(GlobalState)
//     const [catworks] = state.catworksAPI.catworks
//     const [workers] = state.workersAPI.workers
   

//     const handleCatwork = (catworkId,catworkName) => {
//         if (catworkName==='All Products'){
//             setcatworkTypeWorker([])
            
//         }else setcatworkTypeWorker (workers.filter(worker => worker.category ===catworkId))

        

        
//     }

//     return(
//         <div className="catwork1">
//             <div className="container">
                
//                 <div name="catwork"  >
//                     <button id="button3" onClick = {e=> handleCatwork(12345,'All Workers')} >All Categories</button>
                   
                   
                    
//                     {
//                         catworks.map(catwork => (
//                             <button id="button4" onClick = {e=> handleCatwork(catwork._id,catwork.name,catwork.images)}  key={catwork._id}>
//                                 <img src={catwork.images.url} alt=""  />{catwork.name}
//                                {/* <div className="category_image">
//                                <img src={category.images.url} alt=""  />
//                                </div> */}
                               
//                                <div>
                               
//                                </div>
                               
//                             </button>
//                         ))
//                     }
//                 </div>
                
//             </div>
//         </div>
        
//     )


// }
// export default Catwork
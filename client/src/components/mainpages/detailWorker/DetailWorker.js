import React, {useContext, useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {GlobalState} from '../../../GlobalState'
import WorkerItem from '../utlis/productItem/WorkerItem';





function DetailWorker() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [workers] = state.workersAPI.workers
    
    const [detailWorker, setDetailWorker] = useState([])


    useEffect(() =>{
        console.log('re render')
        if(params.id){

            workers.forEach(worker => {
                if(worker._id === params.id) setDetailWorker(worker)
            })
        }
    },[params.id, workers])

    if(detailWorker.length === 0) return null;
  
    
    return(
        <>
            <div className="detail">
                <img src={detailWorker.images.url} alt="" />
                <div className="box-detail">
                    <div className="row">
                        <h2>{detailWorker.name}</h2>
                        {/* <h6>id: {detailProduct.product_id}</h6> */}
                    </div>
                   
                    
                    <span>Phone-{detailWorker.phone}</span>
                    <p>{detailWorker.description}</p>
                   
                    
                    
                    
               
                    
                   
                   
                    

                </div>
            </div>
            <div>
                    <h2>
                        Related  product
                    </h2>
                    <div className="workers">
                        {
                            workers.map(worker=>{
                                return worker.catwork ===detailWorker.catwork
                                 ? <WorkerItem key={worker._id} worker={worker} /> :null
                            })
                        }
                    </div>
            </div>

        </>
        
    )
}
export default DetailWorker
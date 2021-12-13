import React from 'react'
import BtnRender1 from './BtnRednder1'
import {Link} from 'react-router-dom'

function WorkerItem({worker, isAdmin, deleteWorker, handleCheck}) {

    return (
        <div className="worker_card">
            {
                isAdmin && <input type="checkbox" checked={worker.checked}
                onChange={() => handleCheck(worker._id)} />
            }
               <Link to={`/detailworker/${worker._id}`}>
                <img src={worker.images.url} alt="" />
                </Link>
                

            <div className="worker_box">
                <h2 name={worker.name}>{worker.name}</h2>
                
               
                
                <span>Number-{worker.phone}</span>
                <p>{worker.description}</p>
                
                
            </div>

            
            <BtnRender1 worker={worker} deleteWorker={deleteWorker} />
        </div>
    )
}

export default WorkerItem
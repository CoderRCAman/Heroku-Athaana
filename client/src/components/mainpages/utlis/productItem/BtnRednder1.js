import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {GlobalState} from '../../../../GlobalState'

function BtnRender1({worker, deleteWorker}) {
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    
    
    return (
        <div className="row_btn1">
            {
                isAdmin ? 
                <>
                    <Link id="btn_buy1" to="#!" 
                    onClick={() =>deleteWorker(worker._id, worker.images.public_id)}>
                        Delete
                    </Link>
                    <Link id="btn_view1" to={`/edit_worker/${worker._id}`}>
                        Edit
                    </Link>
                </>
                : <>
                    
                    <Link id="btn_hold" to={`/detailworker/${worker._id}`}>
                        View 
                    </Link>
                </>
            }
                
        </div>
    )
}

export default BtnRender1
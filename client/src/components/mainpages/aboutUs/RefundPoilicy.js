import React from 'react'
import './about.css'
import Wave from './image/wavecontact.svg'

function RefundPoilicy() {
    return (
        <div className="return_policy">
            <h2>Return Policy</h2>
            <p>Return and Refund Policy - Any issues in the product has to be reported within 3 days of delivery post approval from our end. We would seek samples / photos of products and storage. Post that No refund or no return.</p>
            <h2>Payment Policy</h2>
            <ul>Right now we support the following payment modes
                <li>1.Cash on delivery</li>
                <li>2.UPI Payment(Only Cash on delivery time)</li>
            </ul>

            <img src={Wave} alt="wave" className="wave" />
        </div>
    )
}
export default RefundPoilicy
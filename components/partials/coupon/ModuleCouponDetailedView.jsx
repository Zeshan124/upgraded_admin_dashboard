import React from 'react'

const ModuleCouponDetailedView = ({ coupon }) => {

    return (
        <>
            <div className="ps-card ps-card--order-information ps-card--small">
                <div className="ps-card__header">
                    <h4>Detailed Coupon Information</h4>
                </div>
                <div className="ps-card__content d-flex" style={{ gap: "10px" }}>
                    <div className='row'>
                        {
                            Object.entries(coupon)?.map(([key, value]) => (
                                <p className="col-6">
                                    <strong>{key}:</strong> {value}
                                </p>
                            ))
                        }
                    </div>
                </div >

            </div >
        </>
    )
}

export default ModuleCouponDetailedView
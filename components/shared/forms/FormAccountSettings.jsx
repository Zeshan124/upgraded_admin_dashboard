import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserDetails, updateUser } from '~/api/userService';
import LoadingSpinner from '../UI/LoadingSpinner';
import useSWR from 'swr';

import ErrorBoundary from '~/components/utils/ErrorBoundary';

const FormAccountSettings = () => {
    const { isLoggedIn, token } = useSelector(state => state.auth);
    const { data: userData, error, isLoading, mutate } = useSWR(
        '/user/details',
        (() => (isLoggedIn && getUserDetails(token)))
    );



    if (isLoading || !userData) {
        return <LoadingSpinner />;
    }
    if (error) {
        return <div>Error</div>;
    }

    const user = userData?.data[0];
    const role = user.roleID && (user.roleID === 3 ? "Super Admin" : user.roleID === 4 ? "Admin" : user.roleID === 6 ? "Shop Manager" : "Customers");
    return (
        <ErrorBoundary>
            <form
                className="ps-form--account-settings"
            >
         
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder=""
                                value={user.fullname}
                                name="fullname"

                                readOnly
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label>User Name</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder=""
                                value={user.username}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder=""
                                value={user.email}
                                name="email"

                                readOnly
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label>Role</label>

                            <input
                                className="form-control"
                                type="text"
                                placeholder=""
                                value={role}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label>CNIC</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder=""
                                value={user.cnic}
                                readOnly
                                name="cnic"


                            />
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder=""
                                value={user.address}
                                name="address"

                                readOnly
                            />
                        </div>
                    </div>

                    {/* <div className="col-sm-12">
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            className="form-control"
                            rows="6"
                            placeholder=""></textarea>
                    </div>
                </div> */}
                </div>
                <div className="ps-form__submit text-center">
                    {/* <button className="ps-btn ps-btn--gray mr-3">Cancel</button> */}
                    {/* <button className="ps-btn success" type='submit'>Update Profile</button> */}
                </div>
            </form>
        </ErrorBoundary>
    );
};

export default FormAccountSettings;

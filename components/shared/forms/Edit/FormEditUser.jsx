import React, { useEffect, useState } from 'react';
import ContainerDefault from '~/components/layouts/ContainerDefault';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';
import { connect, useSelector } from 'react-redux';
import { updateUser, getUserDetails } from '~/api/userService';
import useMessageHandler from '~/components/hooks/useMessageHandler';
import ErrorBoundary from '~/components/utils/ErrorBoundary';
import LoadingSpinner from '~/components/shared/UI/LoadingSpinner';
import { useRouter } from 'next/router';

const FormEditUser = ({ user, onCancel, handleOk }) => {
    const { showSuccess, showError, contextHolder } = useMessageHandler();
    const { isLoggedIn, token } = useSelector(state => state.auth);
    const [inputForm, setinputForm] = useState(user);
    const [userDetails, setUserDetails] = useState(null);
    const router = useRouter();

    const handleInputChange = e => {
        const { name, value } = e.target;
        setinputForm(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const submittedData = {
            ...inputForm,
            modifiedBy: "11",
            MacAdress: "1c-1b-b5-11-42-6b"
        }

        try {
            const response = await updateUser(submittedData, token);
     
            if (response.status && response.status === 200) {
                handleOk(response.data.message || 'User Info Updated Successfully');
            } else {
                showError(response.data.message || 'User Info Updated Successfully');
            }


        } catch (error) {
            showError(error.message || 'Error Updating User');
            console.error('Error updating user:', error);
        }
    };





    return (

        <ErrorBoundary>
            {contextHolder}
            <form
                className="ps-form--account-settings"
                onSubmit={handleUpdateUser}>

                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder=""
                                value={inputForm.fullname}
                                name="fullname"
                                onChange={handleInputChange}
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
                                value={inputForm.username}

                            />
                        </div>
                    </div>
                    {/* <div className="col-sm-6">
                        <div className="form-group">
                            <label>MacAdress</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder=""
                                value={inputForm.MacAdress}

                            />
                        </div>
                    </div> */}

                    <div className="col-sm-6">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder=""
                                value={inputForm.email}
                                name="email"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-group">
                            <label>Role</label>
                            <select
                                value={inputForm.role}
                                onChange={handleInputChange}
                                style={{ width: 200 }}
                                placeholder="Select a role"
                                name="roleID"
                                className="form-control"
                            >
                                <option value="4">Admin</option>
                                <option value="6">Shop Manager</option>
                                <option value="10">Customers</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label>CNIC</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder=""
                                value={inputForm.cnic}

                                name="cnic"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder=""
                                value={inputForm.address}
                                name="address"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                </div>
                <div className="ps-form__submit text-center">
                    <button className="ps-btn ps-btn--gray mr-3" onClick={onCancel}>Cancel</button>
                    <button className="ps-btn success" type='submit'>Update Profile</button>
                </div>
            </form>
        </ErrorBoundary>

    );
};

export default connect(state => state.app)(FormEditUser);

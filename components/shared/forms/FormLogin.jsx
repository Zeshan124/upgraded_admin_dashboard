import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import LoadingSpinner from "../UI/LoadingSpinner";
import { useRouter } from "next/router";
import { actionTypes } from '../../../store/auth/action';
import { useDispatch, useSelector } from 'react-redux';
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
// import accessRights from "~/utils/rolesConfig";

const FormLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const { isLoggedIn, isLoading, error, roleID } = useSelector(state => state.auth)

    const Router = useRouter();
    useEffect(() => {
        if (isLoggedIn) {
            // console.log(accessRights[roleID].allowedPages[0], 'LOGIN')
            Router.push('/');
        }
    }, []);

    const onSubmit = async (data) => {
        dispatch({
            type: actionTypes.LOGIN_REQUEST,
            payload: {
                email: data.email,
                password: data.password
            }
        });
    };
    if (isLoading) return <LoadingSpinner />
    return (
        <>
            <ErrorBoundary>
            {
                !isLoggedIn ? (
                    
                        <section class="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                            <div class="container">
                                <div class="row justify-content-center">
                                    <div class="col-md-12 col-lg-12 col-xl-10">
                                        <div class="wrap d-lg-flex">
                                            <img src='/img/qistBazaar.png' style={{ objectFit: 'contain' }} />
                                            <div class="login-wrap p-4 p-md-5">
                                                <div class="d-flex">
                                                    <div class="w-100">
                                                        <h3 class="mb-4">Sign In</h3>
                                                    </div>
                                                </div>
                                                <form onSubmit={handleSubmit(onSubmit)} class="signin-form">
                                                    <div class="form-group mb-3">
                                                        <label class="label" for="name">Username or Email</label>
                                                        <input type="text"
                                                            class="form-control form-control-custom"
                                                            {...register("email", { required: "Email is required" })} placeholder="Username or Email" required />
                                                        {errors.email && <span>{errors.email.message}</span>}
                                                    </div>
                                                    
                                                    <div class="form-group mb-3 ">
                                                        <label class="label" for="password">Password</label>
                                                        <div className="btn-password">
                                                            <input type={showPassword ? "text" : "password"}  {...register("password", { required: "Password is required" })} class="form-control form-control-custom" placeholder="Password" required />
                                                            <div onClick={() => setShowPassword(!showPassword)}>
                                                                <i className={showPassword ? "icon-eye-crossed" : "icon-eye"} ></i>
                                                            </div>
                                                        </div>
                                                        
                                                        {errors.password && <span>{errors.password.message}</span>}
                                                    </div>
                                                    <div class="form-group mt-lg-5 mt-0">
                                                        <button type="submit" class="form-control btn btn-primary  rounded submit px-3" style={{ backgroundColor: '#1334a5', color: 'white' }}>Sign In</button>
                                                    </div>

                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ):<div></div>
                } 

                
            </ErrorBoundary>
        </>
    );
};
export async function getServerSideProps(context) {
    const { store } = context;
    store.dispatch(loginCheck()); // Dispatch the CHECK_LOGIN action

    return {
        props: {}, // Required to return props
    };
}
export default FormLogin;



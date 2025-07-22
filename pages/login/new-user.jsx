import React, { useEffect, useState } from "react";
import Head from "../../components/layouts/modules/Head";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { message } from "antd";
import { firstLoginChangePassword } from "~/api/userService";
import Cookies from "js-cookie";
import { decryptData, encryptData, isDataMatching } from "~/components/utils/crypto";
import LoadingSpinner from "~/components/shared/UI/LoadingSpinner";

const LoginPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
   
    useEffect(()=>{
        const loginAttempt = Cookies.get("g2adtag");
        if (loginAttempt){
            if (decryptData(loginAttempt) === 0) {
                setIsLoading(false);
            }
            else {
                router.push('/login')
            }
        }else{
            router.push('/login')
        }
    },[])

    return (
        <>
            <Head />
            {isLoading ? <LoadingSpinner/> :  <FormLogin />}
        </>
    );
};
export default LoginPage;

function FormLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { isLoading } = useSelector((state) => state.auth);
    const Router = useRouter();

    const onSubmit = async (data) => {
        try {
            // Display loading message
            const hideLoading = message.loading("Resetting password...", 0);

            // Call the API to reset the password
            const response = await firstLoginChangePassword(data.password);

            // Hide loading message
            hideLoading();

            if (response?.status === 200) {
                const att = encryptData(1);
                message.success("Password reset successful", 3);
                Cookies.set("g2adtag", att, { expires: 10 / 24 });
                Router.push("/");
            } else {
                message.error("An error occurred while resetting the password.", 3);
            }
        } catch (error) {
            message.error("An error occurred. Please try again.", 3);
            console.error(error);
        }
    };

    if (isLoading) {
        message.loading("Please wait while the application loads...", 0);
    }

    return (
        <section className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-12 col-lg-8 col-xl-6">
                        <div className="wrap d-lg-flex">
                            <div className="login-wrap p-4 p-md-5">
                                <div className="d-flex">
                                    <div className="w-100">
                                        <img src="/img/qistBazaar.png" alt="Logo" style={{ objectFit: 'contain' }} />
                                        <h3 className="mb-4">Set Your New Password</h3>
                                        <p className="text-muted">
                                            For your security, please create a new password before accessing your account for the first time.
                                        </p>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className="signin-form">
                                    <div className="form-group mb-3">
                                        <label className="label" htmlFor="new-password">New Password</label>
                                        <div className="btn-password">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                {...register("password", { required: "New password is required" })}
                                                className="form-control form-control-custom"
                                                placeholder="New Password"
                                            />
                                            <div onClick={() => setShowPassword(!showPassword)}>
                                                <i className={showPassword ? "icon-eye-crossed" : "icon-eye"}></i>
                                            </div>
                                        </div>
                                        {errors.password && <span className="text-danger">{errors.password.message}</span>}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label className="label" htmlFor="confirm-password">Confirm New Password</label>
                                        <div className="btn-password">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                {...register("confirmPassword", {
                                                    required: "Please confirm your password",
                                                    validate: (value) => value === watch("password") || "Passwords do not match",
                                                })}
                                                className="form-control form-control-custom"
                                                placeholder="Confirm New Password"
                                            />
                                            <div onClick={() => setShowPassword(!showPassword)}>
                                                <i className={showPassword ? "icon-eye-crossed" : "icon-eye"}></i>
                                            </div>
                                        </div>
                                        {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>}
                                    </div>

                                    <div className="form-group mt-lg-5 mt-0">
                                        <button
                                            type="submit"
                                            className="form-control btn btn-primary rounded submit px-3"
                                            style={{ backgroundColor: '#1334a5', color: 'white' }}
                                        >
                                            Save & Continue
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


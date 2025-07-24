import React, { useEffect } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch, useSelector } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { Select } from "antd";
import Link from "next/link";
const { Option } = Select;

import { addUser, getAllUsers } from "~/api/userService";

import ErrorBoundary from "~/components/utils/ErrorBoundary";
import useMessageHandler from "~/components/hooks/useMessageHandler";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";

const CreateUserPage = () => {
  const { isLoggedIn, token } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const { showSuccess, showError, contextHolder } = useMessageHandler();
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const onSubmit = async (data) => {
    if (!isLoggedIn) {
      showError("Login to krlo bhai");
      return;
    }
    let newData = { ...data, MacAdress: "1c-1b-b5-11-42-6b" };
    try {
      const response = await addUser(newData, token); // Call the addCoupon function with form data

      if (response.status && response.status === 200) {
        const msg =
          response.data.message ||
          response.message ||
          "Coupon added SuccessFully";
        alert(msg);
        router.push("/users");
        reset();
      }
      const msg = response.message || "Error";
      showError(msg);
      router.push("/users");
      reset();
      alert();
    } catch (error) {
      const msg = "Error Adding Coupon";
      showError(msg);
      console.error("Error adding coupon:", error);
      // Handle error scenarios
    }
  };
  const roles = [
    { id: "4", label: "Admin" },
    { id: "6", label: "Call Center" },
    { id: "13", label: "MARKETING" },
  ];
  return (
    <ContainerDefault title="Create User">
      <HeaderDashboard
        title="Create User "
        description="Qistbazaar Create User"
      />
      <ErrorBoundary>
        {contextHolder}
        <section className="ps-dashboard">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="ps-form ps-form--new-product"
            action=""
            method="get"
          >
            <div className="ps-section__left">
              <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                  <figure className="ps-block--form-box">
                    <figcaption className="text-white">Personal</figcaption>
                    <div className="ps-block__content">
                      <div className="form-group">
                        <label>
                          {" "}
                          phoneNo<sup>*</sup>{" "}
                        </label>
                        <input
                          className="form-control"
                          {...register("phoneNo", { required: true })}
                          type="text"
                          placeholder="Enter phoneNo..."
                        />
                        {errors.phoneNo && (
                          <span className="text-danger">Required Field</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>
                          {" "}
                          fullname<sup>*</sup>{" "}
                        </label>
                        <input
                          className="form-control"
                          {...register("fullname", { required: true })}
                          type="text"
                          placeholder="Enter fullname..."
                        />
                        {errors.fullname && (
                          <span className="text-danger">Required Field</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>
                          {" "}
                          cnic<sup>*</sup>{" "}
                        </label>
                        <input
                          className="form-control"
                          {...register("cnic", { required: true })}
                          type="text"
                          placeholder="Enter CNIC..."
                        />
                        {errors.cnic && (
                          <span className="text-danger">Required Field</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>
                          {" "}
                          address<sup>*</sup>{" "}
                        </label>
                        <input
                          className="form-control"
                          {...register("address", { required: true })}
                          type="text"
                          placeholder="Enter address..."
                        />
                        {errors.address && (
                          <span className="text-danger">Required Field</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>
                          {" "}
                          email<sup>*</sup>{" "}
                        </label>
                        <input
                          className="form-control"
                          {...register("email", { required: true })}
                          type="text"
                          placeholder="Enter Email..."
                        />
                        {errors.email && (
                          <span className="text-danger">Required Field</span>
                        )}
                      </div>
                    </div>
                  </figure>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                  <figure className="ps-block--form-box">
                    <figcaption className="text-white">General</figcaption>
                    <div className="ps-block__content">
                      <div className="form-group">
                        <label>
                          {" "}
                          UserName<sup>*</sup>{" "}
                        </label>
                        <input
                          className="form-control"
                          {...register("username", { required: true })}
                          type="text"
                          placeholder="Enter UserName..."
                        />
                        {errors.username && (
                          <span className="text-danger">Required Field</span>
                        )}
                      </div>

                      {/* <div className="form-group">
                                                <label> MacAdress<sup>*</sup> </label>
                                                <input className="form-control" {...register("MacAdress", { required: true })} type="text" placeholder="Enter couponCode name..." />
                                                {errors.MacAdress && <span className="text-danger">Required Field</span>}
                                            </div> */}
                      <div className="form-group">
                        <label>
                          {" "}
                          password<sup>*</sup>{" "}
                        </label>
                        <input
                          className="form-control"
                          {...register("password", { required: true })}
                          type="text"
                          placeholder="Enter password..."
                        />
                        {errors.password && (
                          <span className="text-danger">Required Field</span>
                        )}
                      </div>
                      {/* Applied Tp */}
                      <div className="form-group ">
                        <label htmlFor="x">
                          role:<sup>*</sup>
                        </label>
                        <Controller
                          name="roleID"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              placeholder="click to select role"
                              size="large"
                              className="w-100"
                              onChange={(value) => field.onChange(value)}
                              options={roles.map((item) => ({
                                value: item.id,
                                label: `${item.label}`,
                              }))}
                            />
                          )}
                        />
                        {errors.appliedTo && (
                          <span>This field is required</span>
                        )}
                      </div>
                    </div>
                  </figure>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="ps-form__bottom">
              <div
                className="ps-btn ps-btn--gray"
                onClick={() => router.push("/users")}
              >
                Back
              </div>

              <button className="ps-btn" type="submit">
                Submit
              </button>
            </div>
          </form>
        </section>
      </ErrorBoundary>
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(CreateUserPage);

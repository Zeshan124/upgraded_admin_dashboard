import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";

import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import ModuleProductInformation from "~/components/partials/products/ModuleProductInformation";
import ModuleProductGalleryImages from "~/components/partials/products/ModuleProductGalleryImages";
import router, { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";

import axiosInstance from "~/api/axiosInstance";
import { deleteProduct, getProductById } from "~/api/productService";
import { formatDate, getImageURL, placeHolderImage } from "~/util";
import LoadingSpinner from "~/components/shared/UI/LoadingSpinner";
import ErrorBoundary from "~/components/utils/ErrorBoundary";

const Actions = ({ pid, deleteHandler }) => {
  return (
    <ul className="list-inline m-0 ">
      <li className="list-inline-item">
        <button
          className="btn btn-success btn-lg rounded-0"
          style={{ fontSize: "14px" }}
          type="button"
          data-toggle="tooltip"
          data-placement="top"
          title="Edit"
        >
          <Link href={`/products/${pid}/edit-product`}>
            <i className="fa fa-edit"></i>
          </Link>
        </button>
      </li>
      <li className="list-inline-item">
        <button
          className="btn btn-danger btn-lg rounded-0"
          onClick={() => deleteHandler(pid)}
          style={{ fontSize: "14px" }}
          type="button"
          data-toggle="tooltip"
          data-placement="top"
          title="Delete"
        >
          <i className="fa fa-trash"></i>
        </button>
      </li>
    </ul>
  );
};

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const router = useRouter();
  const pid = query?.pid;
  const url = `/products/${pid}`;
  const { data: product, error } = useSWR(
    pid ? url : null,
    pid ? () => getProductById(pid) : null,
    {
      revalidateIfState: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
    }
  );

  const deleteHandler = async (productID) => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmDeletion) {
      try {
        const response = await deleteProduct(productID);
        if (response.status === 200) {
          alert(response.data.message || "Successfully Deleted");
          router.push("/products");
        }
      } catch (error) {
        alert(error.message || "Error!!!");
      }
    }
  };
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);
  const onImageError = (e) => {
    e.target.src = placeHolderImage;
  };

  if (error) return <div>ERROR...</div>;
  if (!product) return <LoadingSpinner />;
  console.log(product[0]?.storeDetail[0], "product");
  const showAction = !product?.[0]?.storeDetail?.[0];
  return (
    <ContainerDefault title="Product Detail">
      <HeaderDashboard
        title="Product Detail"
        description="Qistbazaar Product Detail"
      />
      <ErrorBoundary>
        <section className="ps-dashboard">
          <div className="ps-section__left">
            <div className="row">
              <div className="col-md-8">
                <ModuleProductInformation
                  pid={product[0].productID}
                  title={product[0].title}
                  categories={product[0]?.categories}
                  subcategories={product[0]?.subcategories}
                  tags={product[0].tags}
                  status={product[0].status}
                  detailedDescription={product[0].detailedDescription}
                  shortDescription={product[0].shortDescription}
                  Actions={Actions}
                  deleteHandler={deleteHandler}
                  showAction={showAction}
                />
              </div>
              {/* Display Image: */}
              <div className="col-md-4">
                <div className="d-none d-md-flex justify-content-end">
                  {showAction && (
                    <Actions
                      pid={product[0]?.productID}
                      deleteHandler={deleteHandler}
                    />
                  )}
                </div>
                <div className="ps-card ps-card--order-information ps-card--small d-flex justify-content-end mt-2">
                  <img
                    src={getImageURL(product[0]?.productImage)}
                    onError={onImageError}
                    alt={"Product Display Image"}
                    style={{ minWidth: "150px", maxWidth: "270px" }}
                  />
                </div>
              </div>
              {/* ------------------------------------ */}
            </div>

            <ModuleProductGalleryImages
              galleryImages={product[0]?.galleryimages}
            />
            <div className="ps-card ps-card--track-order">
              {/* <div className="ps-card__header">
              <h4>#ABD-235711</h4>
            </div> */}
              <div className="ps-card__content">
                <div className="table-responsive">
                  <table className="table ps-table">
                    <thead>
                      <tr>
                        <th className="">Installment No</th>
                        <th>Advance</th>
                        <th>Amount</th>
                        <th>Months</th>
                        <th>Total Deal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product[0].installmentPlan &&
                        product[0]?.installmentPlan.map((item, index) => (
                          <tr key={index}>
                            <td className="text-left">
                              {" "}
                              <a href="#">Plan {index + 1}</a>{" "}
                            </td>
                            <td className="text-left">
                              Rs.{item?.advanceAmount}
                            </td>
                            <td className="text-left">
                              Rs. {item?.amountPerMonth}
                            </td>
                            <td className="text-left">{item?.noOfMonths}</td>
                            <td className="text-left">
                              Rs.
                              {item?.advanceAmount +
                                item?.noOfMonths * item?.amountPerMonth}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="row">
                    <div className="col-md-8">
                      {/* <ModuleProductGallerySlider /> */}
                    </div>
                    <div className="col-md-4">
                      <table className="table ps-table">
                        <tbody>
                          <tr>
                            <td colSpan="3">
                              <strong>CreatedBy :</strong>
                            </td>
                            <td> {product[0]?.createdBy[0]?.fullname} </td>
                          </tr>
                          <tr>
                            <td colSpan="3">
                              {" "}
                              <strong>Created At:</strong>{" "}
                            </td>
                            <td>{formatDate(product[0]?.createdAt)}</td>
                          </tr>
                          <tr>
                            <td colSpan="3">
                              {" "}
                              <strong>ModifiedBy:</strong>
                            </td>
                            <td>{product[0]?.modifiedBy[0]?.fullname}</td>
                          </tr>
                          <tr>
                            <td colSpan="3">
                              <strong>Modified At</strong>
                            </td>
                            <td>{formatDate(product[0]?.modifiedAt)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ErrorBoundary>
    </ContainerDefault>
  );
};

export default connect((state) => state.app)(ProductDetailPage);

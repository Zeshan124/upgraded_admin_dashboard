import { Dropdown, Menu } from "antd";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { deleteProduct } from "~/services/productService";
import { formatDate, getImageURL, placeHolderImage, toTitleCase } from "~/util";
import LoadingSpinner from "../UI/LoadingSpinner";
import useMessageHandler from "~/components/hooks/useMessageHandler";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import DeleteButton from "../UI/DeleteButton";


const TableProductItems = ({ productData, error, isLoading }) => {
  const { showSuccess, showError, contextHolder } = useMessageHandler();
  const deleteHandler = async (item) => {
    try {
      const response = await deleteProduct(item.productID);
    
      if (response.status === 200) {
        showSuccess(response.data.message || "SuccessFully Deleted");
        alert("SuccessFully Deleted");
      }else{
        alert(response.data.message || "SuccessFully Deleted");
      }
    } catch (error) {
      showError(error.message || "Error!!!")
    }
  };

  const onImageError = (e) => {
    e.target.src = placeHolderImage
  }
  const menuView = (item) => (
    <Menu>
      <Menu.Item key={0}>
        <Link href={`/products/${item.productID}/edit-product`}>
         <span className="dropdown-item" href="#">
            <i className="icon-pencil mr-2"></i>
            Edit
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item key={1}>
        <DeleteButton
          title="Are you sure you want to delete?"
          onConfirm={() => (deleteHandler(item))}
        >   <span className="dropdown-item">
            <i className="icon-trash2 mr-2"></i>
            Delete
          </span>
        </DeleteButton>
      </Menu.Item>
    </Menu>
  );




  if (error) return <div>{error.message || error || "Error loading data"}</div>;
  if (isLoading) return <LoadingSpinner />;
  if (productData && productData.length === 0 ) return <div>No Data</div>
  if (!productData) return <div>No data Here</div>
  
  const tableItems = productData && productData?.map((item, index) => {
    let badgeView;
    if (item?.status) {
      badgeView = <span className="ps-badge success text-center" style={{ minWidth: "106px" }}>In Stock</span>;
    } else {
      badgeView = <span className="ps-badge gray text-center" style={{ minWidth: "106px" }}>Out of stock</span>;
    }
    console.log(item,'items');
    return (
      <tr key={index} className="table-produt-row">
        
        <td>{item.storeID && <span className="ribbon3-right">Vendor</span>}{item.productID}</td>
        <td><img src={getImageURL(item?.productImage) ? getImageURL(item?.productImage) : placeHolderImage} onError={onImageError} style={{ minWidth: "50px", maxWidth: "90px" }} /></td>
        <td>
          <Link href={`/products/${item?.productID}`}>
            <span href={`/products/${item?.productID}`}><strong>{item?.deleteStatus === 1 ? <del className="text-danger">{item?.title}</del>: (toTitleCase(item?.title))}</strong></span>
            
          </Link>
        </td>

        <td>{badgeView}</td>
        <td>
          {
            item?.categories && item.categories.some(cat => cat !== null) && (
              item.categories.map(obj => obj?.name).join(', ')
            )
          }

          {
            item?.subcategories && item?.subcategories?.some(subCat => subCat !== null) && item.subcategories.length > 0 && (
              <p className="ps-item-categories">
                {"( "}
                {item.subcategories.map((cat) => (
                  cat && <a href="#" key={cat?.subCategoryID}>{cat.name}</a>
                ))}
                {" )"}
              </p>
            )
          }
        </td>
        <td>{formatDate(item?.modifiedAt)}</td>
        <td>
          <Dropdown overlay={menuView(item)} className="ps-dropdown">
            <a className="ps-dropdown__toggle">
              <i className="icon-ellipsis"></i>
            </a>
          </Dropdown></td>
      </tr>
    );
  });
  return (
    <>
      <ErrorBoundary>
        {contextHolder}
        <div className="table-responsive">
          <table className="table ps-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Display Image</th>
                <th>Title</th>
                <th>Status</th>
                <th>Category{" "}<a href="#" > (Sub Category)</a></th>
                <th>Modified At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{tableItems}</tbody>
          </table>
        </div>
      </ErrorBoundary>
    </>
  );
};


export default TableProductItems;

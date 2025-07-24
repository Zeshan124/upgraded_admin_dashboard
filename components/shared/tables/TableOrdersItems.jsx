import React, { useState } from "react";
import Link from "next/link";
import { Dropdown, Menu, Modal } from "antd";
import useSWR from 'swr';
import { getAllOrders } from "~/services/orderService";
import { formatDate } from "~/util";


const TableOrdersItems = ({orderItems}) => {


  // const [selectedItem, setSelectedItem] = useState(null);
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const showModal = (item) => {
  //   console.log(item)
  //   setSelectedItem(item);
  //   setIsModalVisible(true);
  // };
  // const handleCancel = () => {
  //   setIsModalVisible(false);
  // };
  // const handleOk = () => {
  //   setIsModalVisible(false);
  // };

  // const menuView = (item) => (
  //   <Menu>
  //     <Menu.Item key={0}>
  //       <div className="dropdown-item" onClick={() => showModal(item)}>
  //         <i className="icon-pencil mr-2"></i>
  //         Edit
  //       </div>
  //     </Menu.Item>
  //   </Menu>
  // );


  const tableItemsView = orderItems?.map((item, i) => {
    // console.log(item)
    return (
      <tr key={i}>
        <td>#{item?.orderID}</td>
        <td>
          <strong>{formatDate(item?.createdAt)}</strong>
        </td>
        <td>
          <Link href={`/orders/${item?.orderID}/order-detail`}>
         
              <strong>{item?.name}</strong>
            
          </Link>
        </td>
        {/* <td>
          <strong> {item?.purchaseSource}</strong>
        </td> */}
        <td>
          <strong> {item?.phoneNo}</strong>
        </td>
        <td>
          <strong> {item?.cnic}</strong>
        </td>
        <td>
          <strong> {item?.productNames}</strong>
        </td>
        <td>
          <strong> Rs {item?.totalAmount}</strong>
        </td>

        {/* <td>
  //         <Dropdown overlay={menuView(item)} className="ps-dropdown">
  //           <a className="ps-dropdown__toggle">
  //             <i className="icon-ellipsis"></i>
  //           </a>
  //         </Dropdown>
  //       </td> */}
      </tr >
    );
  });
  return (
    <div className="table-responsive">
      <table className="table ps-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date orTime</th>
            <th>Full Name</th>
            {/* <th>Purchase Source</th> */}
            <th>Phone No</th>
            <th>CNIC</th>
            <th>Product Name</th>
            <th>Deal Value</th>
            {/* <th></th> */}
          </tr>
        </thead>
        <tbody>{tableItemsView}</tbody>
      </table>
      {/* {isModalVisible && <Modal
        title={"Update Modal"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}

      >
        {selectedItem && (
          <div className="form-group">
            <label htmlFor="exampleFormControlSelect1">Order Status</label>
            <select className="form-control" id="exampleFormControlSelect1">
              <option>Pending</option>
              <option>Delivered</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </select>
          </div>
        )}
      </Modal>} */}
    </div>
  );
};

export default TableOrdersItems;

import React, { useState } from "react";
import { Button, Modal } from "antd";

const ModalItemView = (props) => {
  return (
    <>
      <Modal
        title={props?.title || "Modal"}
        open={props?.isModalOpen || false}
        onOk={props?.handleOk || false}
        onCancel={props?.handleCancel || false}
      >
        {props.children}
      </Modal>
    </>
  );
};

export default ModalItemView;


import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDrawerWebMenu } from "~/store/app/action";
import { toTitleCase } from "~/util";

const WidgetUserWelcome = () => {
  const {fullName } = useSelector(state => state.auth);
  const { isDrawerMenuWeb } = useSelector(state => state.app);
  const dispatch = useDispatch();

  const handleCloseDrawer = () => {

    dispatch(toggleDrawerWebMenu(false));
  };
  const handleOpenDrawer = () => {

    dispatch(toggleDrawerWebMenu(true));
  };

  const img2 = "/img/3974793710.jpg"
  return (
    <>
      <div className={`${isDrawerMenuWeb ? 'd-none' : 'd-block'}`}>
        <img
          src={img2}
          alt=""
          className="rounded-circle"
          style={{ maxWidth: "50px", objectFit: "cover", cursor:'pointer'}}
          onClick={handleOpenDrawer}
        />
      </div>
    <div className={`ps-block--user-wellcome ${!isDrawerMenuWeb ? 'd-none' : 'd-flex'}`} >
      <div className="ps-block__left">
        {/* <img src="/img/user/admin.jpg" alt="" style={{ maxWidth: "50px" }} /> */}
        {/*  */}
        <img
          src={img2}
          alt=""
          style={{ maxWidth: "50px", objectFit:"cover" }}
        />
      </div>
      
      <div className="ps-block__right">
        <p>
          Hello,<a href="#">{toTitleCase(fullName) || "QistBazaar"}</a>
        </p>
      </div>
      <div className="ps-block__action ">
        <a href="#" className="d-none d-lg-block" onClick={handleCloseDrawer}>
          <i className="icon-exit"></i>
        </a>
      </div>
    </div>
    </>
  );
};

export default WidgetUserWelcome;

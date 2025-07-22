import Cookies from "js-cookie";
import React from "react";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { logOut } from "~/store/auth/action";

const HeaderMobile = ({ isDrawerMenu }) => {
  const dispatch = useDispatch();
  const handleOpenDrawer = () => {
    dispatch(toggleDrawerMenu(true));
  };
  const handleLogout = () => {
    dispatch(logOut());
  };
  const userName = Cookies.get('fullName')
  return (
    <header className="header--mobile">
      <div className="header__left">
        <button className="ps-drawer-toggle" onClick={handleOpenDrawer}>
          <i className="icon icon-menu"></i>
        </button>
        <img src="" alt="" />
      </div>
      <div className="header__center">
        <a className="ps-logo" href="#">
          <img
            src="https://qistbazaar.pk/static/img/QB-logo.png"
            alt="LOGO"
          />
        </a>
        <div className={'dashboardTitle'}>{userName}</div>
      </div>
      <div className="header__right">
        <a className="header__site-link" href="" onClick={handleLogout}>
          <i className="icon-exit-right"></i>
        </a>
      </div>
    </header>
  );
};

export default connect((state) => state.app)(HeaderMobile);

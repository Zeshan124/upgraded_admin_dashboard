import React from 'react';
import FormHeaderSearch from '~/components/shared/forms/FormHeaderSearch';
import { useDispatch } from 'react-redux';
import { logOut } from '~/store/auth/action';
const HeaderDashboard = ({
    title = 'Dashboard',
    description = 'Everything here',
}) => {
    const dispatch = useDispatch();
    const LogoutHandler = () => {
        dispatch(logOut());
    }

    return (
        <header className="header--dashboard">
            <div className="header__left">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            {/* <div className="header__center">
                <FormHeaderSearch />
            </div> */}
            <div className="header__right">
                <div className="header__site-link"  onClick={LogoutHandler} style={{cursor:"pointer"}}>
                    <span>Logout</span>
                    <i className="icon-exit-right"></i>
                </div>
            </div>
        </header>
    );
};

export default HeaderDashboard;

import React, { useEffect } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import {useDispatch, useSelector } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import Link from "next/link";
import accessRights from '~/utils/rolesConfig'
const ForbiddenPage = () => {
    const dispatch = useDispatch();
    const {roleID} = useSelector(state =>(state.auth))
    useEffect(() => {
        dispatch(toggleDrawerMenu(false));
    }, []);

    return (
        <ContainerDefault title="Forbidden">
            {/* <HeaderDashboard title="Forbidden" description="You Don't have access" /> */}
            <ErrorBoundary>
                <div className="ps-page--404 w-100" style={{ height:'89vh', background:'transparent'}}>
                    <figure className="ps-block--notfound">
                        <h3>Ohh! Sorry You don't have Access</h3>
                        <p>
                            It seems we can't find what you're looking for.<br />
                        </p>
                        <p>
                            <strong className="mr-2">Return to</strong>
                            <Link href={accessRights[roleID].allowedPages[0]}>
                                <span className="ps-btn ps-btn--black ps-btn--rounded ps-btn--sm">
                                    Dashboard
                                </span>
                            </Link>
                        </p>
                    </figure>
                </div>
            </ErrorBoundary>
        </ContainerDefault>
    );
};
export default (ForbiddenPage);

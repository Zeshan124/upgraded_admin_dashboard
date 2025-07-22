import React, { useEffect } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import TableWebPagesItems from "~/components/shared/tables/TableWebPages";
// import FormSearchSimple from "~/components/shared/forms/FormSearchSimple";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import Link from "next/link";


const WebPagesPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(toggleDrawerMenu(false));
    }, []);
    return (
        <ContainerDefault title="Web Pages">
            <HeaderDashboard title="Web Pages" description="QistBazaar Website Pages" />
            <section className="ps-items-listing">
                <div className="ps-section__header simple">
                    <div className="ps-section__filter">
                        <form className="ps-form--filter" action="index.html" method="get">
                            <div className="ps-form__left">
                                {/* <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Search..."
                                    />
                                </div> */}

                            </div>
                            <div className="ps-form__right">

                            </div>
                        </form>
                    </div>
                    <div className="ps-section__actions">
                        <Link href="/custom-pages/web-pages/create">
                            <span className="ps-btn success">
                                <i className="icon icon-plus mr-2"></i>New Page
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="ps-section__content">
                    <TableWebPagesItems />
                </div>

            </section>
        </ContainerDefault>
    );
};
export default connect((state) => state.app)(WebPagesPage);
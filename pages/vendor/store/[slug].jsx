import React, { useEffect, useState } from 'react';
import ContainerDefault from '~/components/layouts/ContainerDefault';
import HeaderDashboard from '~/components/shared/headers/HeaderDashboard';
import { connect, useDispatch } from 'react-redux';
import { toggleDrawerMenu } from '~/store/app/action';
import useSWR from "swr";
import { useRouter } from 'next/router';

import LoadingSpinner from '~/components/shared/UI/LoadingSpinner';
import { fetchStoreBySlug } from '~/services/storeService';
import { getImageURL, getStatusLabel } from '~/util';


const StoreDetailPage = () => {
    const router = useRouter();
    const { query } = router;
    const url = `/orders/getbyid/`;
    const [slug, setSlug] = useState();

    useEffect(() => {
        if (query?.slug) {
            setSlug(query.slug);
        }
    }, [query?.slug]);

    const { data: store, error, isLoading } = useSWR(slug ? url : null,
        slug ? () => fetchStoreBySlug(`/get/slug?slug=${slug}`) : null
    );

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(toggleDrawerMenu(false));
    }, []);

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div>{error.message || "Error fetching store data"}</div>;

    return (
        <ContainerDefault title="Store Detail">
            <HeaderDashboard title="Store Detail" description="Qistbazaar Store Detail" />
            <section className="ps-dashboard">
                <div className="ps-section__left">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-md-12">
                            <div className="card shadow mb-4">
                                <div className="card-header text-white bg-primary">
                                    <h4 className="mb-0">{store?.ShopName}</h4>
                                    <small>Location: {store?.Location}</small>
                                </div>
                                <div className="card-body">
                                    {/* Cover Picture */}
                                    <div className="text-center mb-4">
                                        <img
                                            src={`${getImageURL(store?.coverPicture)}`}
                                            alt="Cover"
                                            className="img-fluid rounded"
                                            style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
                                        />
                                    </div>

                                    {/* Store Details */}
                                    <div className="row">
                                        <div className="col-md-4 text-center">
                                            <img
                                                src={`${getImageURL(store?.shopIcon)}`}
                                                alt="Shop Icon"
                                                className="rounded-circle border"
                                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                            />
                                            <h5 className="mt-3">{store?.ShopName}</h5>
                                            <p className="text-muted">Status: {getStatusLabel(store?.status)}</p>
                                        </div>
                                        <div className="col-md-8">
                                            <ul className="list-group">
                                                <li className="list-group-item">
                                                    <strong>Account Title:</strong> {store?.accTitle}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>IBAN Number:</strong> {store?.IBANNo}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Reviewed By:</strong> {store?.reviewedBy || "N/A"}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Created By:</strong> {store?.createdBy}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Modified By:</strong> {store?.modifiedBy || "N/A"}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Created At:</strong> {new Date(store?.createdAt).toLocaleDateString()}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Modified At:</strong> {new Date(store?.modifiedAt).toLocaleDateString()}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer text-center">
                                    <button className="btn btn-secondary" onClick={() => router.push('/vendor/stores')}>Back to List</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ContainerDefault>
    );
};

export default connect((state) => state.app)(StoreDetailPage);

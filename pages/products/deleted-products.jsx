import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import ContainerDefault from "~/components/layouts/ContainerDefault";
import TableProductItems from "~/components/shared/tables/TableProductItems";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import LoadingSpinner from "~/components/shared/UI/LoadingSpinner";
import { fetchDeletedProducts } from "~/services/productService";

const DeletedProducts = () => {
    const { data: productData, error, isLoading } = useSWR(
        `?_start=${1}&_limit=${2000}`,
        (url) => fetchDeletedProducts(url),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );


    return (
        <ContainerDefault title="Deleted Products">
            <HeaderDashboard
                title="Deleted Products"
                description="Qistbazaar Deleted Product Listing"
            />
            <ErrorBoundary>
                <section className="ps-items-listing">
                    <div className="ps-section__content">
                        {isLoading ? <LoadingSpinner /> :
                            <TableProductItems productData={productData?.data} error={error} isLoading={isLoading} />
                        }
                    </div>
                </section>
            </ErrorBoundary>
        </ContainerDefault>
    );
}

export default DeletedProducts;

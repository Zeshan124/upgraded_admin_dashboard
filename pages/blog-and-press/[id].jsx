import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
// import TableCustomerItems from "~/components/shared/tables/TableCustomerItems";
// import FormSearchSimple from "~/components/shared/forms/FormSearchSimple";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import {  useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";


import { useRouter } from "next/router";
import { fetchBlogPressById } from "~/api/pressBlogServive";
import FormBlogPress from "~/components/shared/forms/FormBlogPress";



export default function BlogPageEdit(){
    const dispatch = useDispatch();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query; 
    useEffect(() => {
        // If there is a slug, we are in "edit" mode and need to fetch the page data
        if (id) {
            const fetchData = async () => {
                try {
                    const data = await fetchBlogPressById(id);
                    // console.log(data)
                    setPageData(data);
                    setLoading(false);
                } catch (error) {

                    console.error('Error fetching page data:', error);
                    alert(error?.message || 'Error Getting data')
                    setLoading(false);
                    // router.push('/custom-pages');
                }
            };
            fetchData();
        }
    }, [id]);
    useEffect(() => {
        dispatch(toggleDrawerMenu(false));
    }, []);
    return (
        <ContainerDefault title="Web Pages">
            <HeaderDashboard title="Web Pages" description="QistBazaar Website Pages" />

            {!loading && <FormBlogPress updateData={pageData} />}
        </ContainerDefault>
    );
}
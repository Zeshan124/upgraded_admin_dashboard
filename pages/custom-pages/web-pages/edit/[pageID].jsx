import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
// import TableCustomerItems from "~/components/shared/tables/TableCustomerItems";
// import FormSearchSimple from "~/components/shared/forms/FormSearchSimple";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import { Select } from "antd";
import { fetchSingleWebPage } from '~/api/PagesServices';
import FormWebPage from '~/components/shared/forms/FormWebPage'
import { useRouter } from "next/router";
const { Option } = Select;


const UpdateWebPagesPage = () => {
    const dispatch = useDispatch();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { pageID } = router.query; 


    useEffect(() => {
        // If there is a slug, we are in "edit" mode and need to fetch the page data
        if (pageID) {      
            const fetchData = async () => {
                try {
                    const data = await fetchSingleWebPage(pageID);
         
                    setPageData(data?.data[0]);
                    setLoading(false);
                } catch (error) {
                    
                    console.error('Error fetching page data:', error);
                    alert("ERROR getting data")
                    setLoading(false);
                    // router.push('/custom-pages');
                }
            };
            fetchData();
        }
    }, [pageID]);
    useEffect(() => {
        dispatch(toggleDrawerMenu(false));
    }, []);
    return (
        <ContainerDefault title="Web Pages">
            <HeaderDashboard title="Web Pages" description="QistBazaar Website Pages" />

            {!loading && <FormWebPage pageData={pageData} />}
        </ContainerDefault>
    );
};
export default connect((state) => state.app)(UpdateWebPagesPage);

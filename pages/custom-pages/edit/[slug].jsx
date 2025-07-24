import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";
import FormPage from "~/components/shared/forms/FormPage";
import { useRouter } from "next/dist/client/router";
import { fetchSinglePage } from "~/api/PagesServices";
const CustomEditPagesPage = () => {
  const dispatch = useDispatch();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  useEffect(() => {
    // If there is a slug, we are in "edit" mode and need to fetch the page data
    if (slug) {
      const fetchData = async () => {
        try {
          const data = await fetchSinglePage(slug);

          setPageData(data?.data[0]);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching page data:", error);
          alert("ERROR getting data");
          setLoading(false);
          router.push("/custom-pages");
        }
      };
      fetchData();
    }
  }, [slug]);
  return (
    <ContainerDefault title="Custom Pages">
      <HeaderDashboard
        title="Creat Page"
        description="QistBazaar Create Custom Pages"
      />
      {!loading && <FormPage pageData={pageData} />}
    </ContainerDefault>
  );
};
export default connect((state) => state.app)(CustomEditPagesPage);

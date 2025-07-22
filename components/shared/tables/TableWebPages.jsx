import React from "react";
import useSWR from "swr";
import DropdownAction from "~/components/elements/basic/DropdownAction";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import Link from "next/link";
import { fetchAllWebPages, deleteWebPage } from "~/api/PagesServices";
import LoadingSpinner from "../UI/LoadingSpinner";
import useMessageHandler from "~/components/hooks/useMessageHandler";
import { useRouter } from "next/router";
const TableWebPagesItems = () => {
  const router = useRouter();
  const { showSuccess, showError, contextHolder } = useMessageHandler();
  const {
    data: pageItems,
    error,
    isLoading,
    mutate,
  } = useSWR("/Custom-page/get", fetchAllWebPages);

  if (error) return <div>{error.message || error || "Error loading data"}</div>;
  if (isLoading) return <LoadingSpinner />;

  const getType = (allPro, catSlug, subCatSlug) => {
    if (catSlug && subCatSlug) return `${subCatSlug} ${catSlug}`;
    if (catSlug) return `${catSlug} `;
    if (allPro == 1) return "All Products";
  };
  const editHandler = (id) => router.push(`/custom-pages/web-pages/edit/${id}`);

  const deleteHandler = async (id) => {
    try {
      // const newData = pageItems && pageItems?.filter((item) => item.customPageID !== id);
      // await mutate(newData, false);
      const response = await deleteWebPage(id);

      if (response.status === 200) {
        showSuccess(response.message || "Successfully Deleted");
      }
    } catch (error) {
      showError(error.message || "Error Deleting");
    }
  };

  const tableItemsView =
    pageItems?.length > 0 ? (
      pageItems?.map((item, index) => {
        const type = getType(item?.allPro, item?.catSlug, item?.subCatSlug);
        return (
          <tr key={index}>
            <td>{item?.customPageID}</td>

            <td>
              <strong>{item?.title}</strong>
            </td>
            {/* <td>{item?.slug}</td> */}
            <td>{item?.slug}</td>
            <td>{type}</td>
            <td>
              <DropdownAction
                deleteHandler={() => deleteHandler(item.customPageID)}
                editHandler={() => editHandler(item.customPageID)}
              />
            </td>
          </tr>
        );
      })
    ) : (
      <div>No data available</div>
    );
  return (
    <ErrorBoundary>
      {contextHolder}
      <div className="table-responsive">
        <table className="table ps-table">
          <thead>
            <tr>
              <th>S.NO</th>

              <th>title</th>
              <th>Slug</th>

              <th></th>
            </tr>
          </thead>
          <tbody>{tableItemsView}</tbody>
        </table>
      </div>
      <p>{`Total ${pageItems?.length} items`}</p>
    </ErrorBoundary>
  );
};

export default TableWebPagesItems;

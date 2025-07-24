import React, { useState } from "react";
import useSWR from "swr";
import DropdownAction from "~/components/elements/basic/DropdownAction";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import Link from "next/link";
import { fetchAllWebPages, deleteWebPage } from "~/services/PagesServices";
import LoadingSpinner from "../UI/LoadingSpinner";
import useMessageHandler from "~/components/hooks/useMessageHandler";
import { useRouter } from "next/router";
import { deletePage, fetchAllBlogs } from "~/services/pressBlogServive";
const TableBlogAndPress = ({ blog }) => {
  const router = useRouter();
  const { showSuccess, showError, contextHolder } = useMessageHandler();

  const {
    data: items,
    error,
    isLoading,
    mutate,
  } = useSWR(`/get-all?blog=${blog}`, fetchAllBlogs);
  // console.log(items, "items");
  if (error)
    return (
      <div>
        {error.message || JSON.stringify(error) || "Error loading data"}
      </div>
    );
  if (isLoading) return <LoadingSpinner />;

  const deleteHandler = async (id) => {
    try {
      const newData = items && items?.filter((item) => item.id !== id);
      await mutate(newData, false);
      const response = await deletePage(id);

      if (response.status === 200) {
        showSuccess(response.message || "Successfully Deleted");
      }
    } catch (error) {
      showError(error.message || "Error Deleting");
    }
  };

  const tableItemsView =
    items?.length > 0 ? (
      items?.map((item, index) => {
        return (
          <tr key={index}>
            <td>{item?.id}</td>

            <td>
              <Link href={item?.url || "/"}>
                <strong>{item?.title}</strong>
              </Link>
            </td>

            <td>{item?.shortDescription}</td>
            <td>
              <DropdownAction
                deleteHandler={() => deleteHandler(item?.id)}
                editHandler={() => {
                  router.push(`/blog-and-press/${item?.id}`);
                }}
              />
            </td>
          </tr>
        );
      })
    ) : (
      <div className="text-center p-2">No data available</div>
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
              <th>Short Desc</th>

              <th></th>
            </tr>
          </thead>
          <tbody>{tableItemsView}</tbody>
        </table>
      </div>
      <p>{`Total ${items?.length || 0} items`}</p>
    </ErrorBoundary>
  );
};

export default TableBlogAndPress;

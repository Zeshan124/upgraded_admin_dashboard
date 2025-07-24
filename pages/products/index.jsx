import React, { useEffect, useState } from "react";
import ContainerDefault from "~/components/layouts/ContainerDefault";
// import Pagination from "~/components/elements/basic/Pagination";
import { Pagination } from 'antd';
import TableProductItems from "~/components/shared/tables/TableProductItems";
import FormExportProducts from "~/components/shared/forms/FormExportProducts"
import { Select } from "antd";
import Link from "next/link";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { connect, useDispatch } from "react-redux";
import { toggleDrawerMenu } from "~/store/app/action";

import useCategories from "~/components/hooks/useCategories";
// import useSubCategories from "~/components/hooks/useSubCategories";
// import useProducts from "~/components/hooks/useProducts";
import { fetchAllSubCategories } from "~/api/subCategoryService";
import { fetchAllCategories, fetchProductCategories } from "~/api/categoryService";
import { fetchProductsPaginate, searchProducts } from "~/api/productService";
import ErrorBoundary from "~/components/utils/ErrorBoundary";
import useSearch from "~/components/hooks/useSearch";
import FormImportProducts from "~/components/shared/forms/FormImportProducts";
import useSWR from "swr";


const { Option } = Select;
const ProductPage = ({ category: initialCategory=[], product: initialProduct=[] }) => {
  const itemsPerPage = 15;  
  const [pageIndex, setPageIndex] = useState(1);
  
  const { data: productData, error, isLoading, mutate } = useSWR(
    `?_start=${pageIndex}&_limit=${itemsPerPage}`,
    (url) => fetchProductsPaginate(url),
    {
      initialData: initialProduct,
    }
  );

  const [totalItems, setTotalItems] = useState(initialProduct ? initialProduct?.totalItems : 1);//change

 
  const { searchKeyword, setSearchKeyword, searchedData, handleSearch, selectedCategory, handleCategoryChange, isLoading:searchLoading  } = useSearch(searchProducts);
  // const { categoryData, categoryError, categoryLoading } = useCategories(initialCategory);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalExportOpen, setModalExportOpen] = useState(false);

  const showExportModal = () => {
    setModalExportOpen(true)
  };
  const showModal = () => {
    setModalOpen(true)
  };
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));

    if (productData) {
      setTotalItems(productData?.totalItems);
    }
  }, [productData]);

  const handlePaginationChange = (page, pageSize) => {
    setPageIndex(page);
  };


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleDrawerMenu(false));
  }, []);

  const productsToDisplay = (searchKeyword?.trim() !== "" || selectedCategory !=="") ? searchedData : productData?.data;

  const stockOptions = [{ label: "In Stock", id: 1 }, { label: "Out of Stock", id: 0 }]
  const itemsEnd = (pageIndex * itemsPerPage) < totalItems ? (pageIndex * itemsPerPage) : totalItems;
  const loadingProduct = searchLoading || isLoading
  return (
    <ContainerDefault title="Products">
      <HeaderDashboard
        title="Products"
        description="Qistbazaar Product Listing "
      />
      <ErrorBoundary>
        <section className="ps-items-listing">
         
          <div className="ps-section__header pb-0">
            <div className="ps-section__filter">

              {/* <form className="ps-form--filter" action="index.html" method="get"> */}
                <div className="ps-form__left d-flex">
                <div>
                  <Select
                    placeholder="Select Category"
                    className="ps-ant-dropdown"
                    onChange={handleCategoryChange}
                    value={selectedCategory}
                    listItemHeight={20}
                    style={{ minWidth: '130px' }}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="">All</Option>
                    {initialCategory && initialCategory.map((cat, index) => (
                      <React.Fragment key={index}>
                        <Option value={cat?.slug}>{cat?.CategoryName}</Option>
                        {cat?.subcategory && cat?.subcategory.map((subCat, subIndex) => (
                          <Option key={`${index}-${subIndex}`} value={subCat?.slug}>
                            {`-- ${subCat?.subcategoryName}`}
                          </Option>
                        ))}
                      </React.Fragment>
                    ))}
                  </Select>
                </div>
                <div className="ps-section__search pl-0 w-100 mw-100" >
                  <div
                    className="ps-form--search-simple w-100 mw-100"
                    style={{ minWidth: '200px' }}
                  >
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search product"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onBlur={() => handleSearch(searchKeyword)}
                    />
                    <div>
                      <button onClick={() => (handleSearch(searchKeyword, selectedCategory))}>
                        <i className="icon icon-magnifier"></i>
                      </button>

                    </div>
                  </div>
                </div>
               
               
                </div>
                
            </div>
            <div className="ps-section__actions" style={{fontSize:'12px'}}>
              <Link href="/products/create-product">
                <span className="ps-btn success" style={{ padding: '10px', fontSize: '12px' }}>
                  <i className="icon icon-plus mr-2" />
                  New Product
                </span>
              </Link>

              <div className="ps-btn success" onClick={showModal} style={{ padding: '10px', fontSize: '12px' }}>
                <i className="icon icon-plus mr-2" />
                Import Product
              </div>
              {modalOpen && <FormImportProducts open={modalOpen} setOpen={setModalOpen}  />}

              {/* EXPORT product */}
              <div className="ps-btn success" onClick={showExportModal} style={{ padding: '10px', fontSize: '12px' }}>
                <i className="icon icon-plus mr-2" />
                Export Product
              </div>
              {modalExportOpen && <FormExportProducts open={modalExportOpen} setOpen={setModalExportOpen} />}
            </div>

            


          </div>
          <div className="d-flex justify-content-end align-items-center w-100">
              <div >
                <Link href="/products/deleted-products">
                <span className="ps-btn gray" style={{ padding: '9px', fontSize: '12px' }}>
                    <i className="icon icon-plus mr-2" />
                    Draft Product
                  </span>
                </Link>
              </div>
          </div>

          <div className="ps-section__content">
            <TableProductItems productData={productsToDisplay} error={error} isLoading={isLoading} />
          </div>
          <div className="ps-section__footer">
            <p>Showing from {((pageIndex - 1) * itemsPerPage)+1} to {itemsEnd} items of {totalItems} Total items.</p>
            <Pagination
              defaultCurrent={1}
              total={totalItems}
              current={pageIndex}
              pageSize={itemsPerPage}
              onChange={handlePaginationChange}
              showSizeChanger={false}
            />
          </div>
        </section>
      </ErrorBoundary>
    </ContainerDefault>
  );
};

// export async function getStaticProps() {
//   try {
//     const categoryData = await fetchProductCategories();
//     const subCategory = await fetchAllSubCategories();
//     const productData = await fetchProductsPaginate(`?_start=${1}&_limit=${15}`);
//     return {
//       props: {
//         category: categoryData,
//         subCategory: subCategory,
//         product: productData,
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return {
//       props: {
//         category: [],
//         subCategory: [],
//         product: [],
//       },
//     };
//   }
// }


export default connect((state) => state.app)(ProductPage);



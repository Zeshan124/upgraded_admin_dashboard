import React from "react";
import useReadMore from "~/components/hooks/useReadMore";

const ModuleProductInformation = (props) => {
    const {
        pid,
        title,
        categories,
        subcategories,
        tags,
        status,
        detailedDescription,
        shortDescription,
        Actions,
        deleteHandler,
        showAction
    } = props;

    const { displayHtml } = useReadMore(detailedDescription);

    const subCatArray = subcategories?.map(obj => obj?.name);
    const categoryArray = categories?.map(obj => obj?.name);
    let stockView;
    if (status) {
        stockView = <span className="ps-badge success">In Stock</span>;
    } else {
        stockView = <span className="ps-badge gray">Out of stock</span>;
    }
    const { descriptionClass, toggleReadMore, isReadMore } = useReadMore();
    // console.log(showAction,'showAction')
    return (
        <div className="ps-card ps-card--order-information ps-card--small">
            <div className="ps-card__header d-flex justify-content-between">
                <h4>Product Information</h4>
                <div className="d-md-none ">
                    {showAction && <Actions pid={pid} deleteHandler={deleteHandler}/>}
                </div>
            </div>
            <div className="ps-card__content">
                <p><strong>Title: </strong> {title}</p>
                <p><strong>Category: </strong> {categoryArray && categoryArray.join(', ')}</p>
                <p><strong>Sub Categories: </strong>
                    {subCatArray?.join(', ')}
                </p>
                <p><strong>Tags: </strong>{tags}</p>
                <p><strong>Status: </strong> {stockView}</p>
                <p><strong>Short Description: </strong> {shortDescription}</p>
                <p><strong>Detailed Description: </strong><div className={descriptionClass} dangerouslySetInnerHTML={{ __html: detailedDescription }}></div>
                    {detailedDescription.length > 100 && ( // Adjust this value based on your needs
                        <span onClick={toggleReadMore} className='text-primary' style={{ cursor: "pointer" }}>
                            {isReadMore ? ` ...read more` : ' ...show less'}
                        </span>
                    )}</p>
                

            </div>
        </div >
    );
};

export default ModuleProductInformation;

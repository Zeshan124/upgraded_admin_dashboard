import React from 'react'
import { getImageURL, placeHolderImage } from "~/util";

const ModuleProductGallerySlider = ({ galleryImages }) => {
  
    const onImageError = (e) => {
        e.target.src = placeHolderImage
    }
    return (

        <div className='d-flex align-items-center justify-content-md-start justify-content-center flex-wrap mb-2'>
            {

                galleryImages && (galleryImages?.map(({ imagePath }, i) => (
                    <img src={getImageURL(imagePath)} onError={onImageError} key={i} alt={"150x150"} className='img-thumbnail object-fit-cover rounded mr-2 my-2' style={{ width: "150px", height: "150px" }} />
                )))
            }
        </div>
    )
}

export default ModuleProductGallerySlider
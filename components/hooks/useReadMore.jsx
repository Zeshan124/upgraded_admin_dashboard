import React, { useState } from 'react';

const useReadMore = () => {
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    const descriptionClass = isReadMore ? 'description-short' : 'description-full';

    return { descriptionClass, toggleReadMore, isReadMore };
};

export default useReadMore;

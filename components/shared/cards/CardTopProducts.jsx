import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import TableTopProduct from '../tables/TableTopProduct';

const CardTopProducts = ({ data, title }) => (

    <div className="ps-card">
        <div className="ps-card__header">
            <h4>{title}</h4>
        </div>

        <div className="ps-card__content">
            <TableTopProduct items={data} />
        </div>

    </div>
);

export default CardTopProducts;

import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import TableTopCategory from '~/components/shared/tables/TableTopCategory';

const CardRecentOrders = ({ data, title }) => (
    
    <div className="ps-card">
        <div className="ps-card__header">
            <h4>{title}</h4>
        </div>

        <div className="ps-card__content">
            <TableTopCategory items={data}/>
        </div>

        {/* <div className="ps-card__footer">
            <Link href={`/orders`}>
            <div className="ps-card__morelink">
                View Full Orders
                <i className="icon icon-chevron-right"></i>
            </div>
            </Link>
        </div> */}
    </div>
);

export default CardRecentOrders;

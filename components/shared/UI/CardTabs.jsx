
import React from 'react';
import { Tabs, Tab } from 'react-tabs-scrollable';




export default function CardTabs({ tabData, selectedTab, onTabClick, countKey }) {
    const [activeTab, setActiveTab] = React.useState(0);

    const handleTabClick = (e, index) => {
        setActiveTab(index);
        onTabClick(tabData[index]);

    };

    // console.log()
    React.useEffect(() => {
        const selectedIndex = tabData.findIndex(tab => tab.ShopName === selectedTab);
        if (selectedIndex !== -1) {
            setActiveTab(selectedIndex);
        }
    }, [selectedTab, tabData]);

    return (
        <div className="mb-4">
            <Tabs
                activeTab={activeTab}
                className='font-color-custom'
                onTabClick={handleTabClick}
                hideNavBtnsOnMobile={false}
                // leftBtnIcon={<i class="fa fa-angle-left" aria-hidden="true"></i>}
                // rightBtnIcon={<i class="fa fa-angle-right" aria-hidden="true"></i>}
            >
                {tabData?.map((item, index) => (
                    <Tab key={index} className='tabs-container'>
                        <div className="d-flex justify-content-center align-items-center " style={{minWidth:'130px'}}>
                            <svg stroke="currentColor" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className='mr-2' viewBox="0 0 640 512" width={32} height={32} >
                                <path d="M36.8 192l412.8 0c20.2-19.8 47.9-32 78.4-32c30.5 0 58.1 12.2 78.3 31.9c18.9-1.6 33.7-17.4 33.7-36.7c0-7.3-2.2-14.4-6.2-20.4L558.2 21.4C549.3 8 534.4 0 518.3 0L121.7 0c-16 0-31 8-39.9 21.4L6.2 134.7c-4 6.1-6.2 13.2-6.2 20.4C0 175.5 16.5 192 36.8 192zM384 224l-64 0 0 160-192 0 0-160-64 0 0 160 0 80c0 26.5 21.5 48 48 48l224 0c26.5 0 48-21.5 48-48l0-80 0-32 0-128zm144 16c17.7 0 32 14.3 32 32l0 48-64 0 0-48c0-17.7 14.3-32 32-32zm-80 32l0 48c-17.7 0-32 14.3-32 32l0 128c0 17.7 14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32l0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80z" />
                            </svg>
                        
                            <div>
                                <div>{item?.ShopName}</div>
                                <div>{item[countKey]}</div>
                            </div>
                        </div>
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}

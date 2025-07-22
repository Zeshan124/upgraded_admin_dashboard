import React from "react";
import Head from "next/head";
import FooterCopyright from "~/components/shared/footers/FooterCopyright";
import MenuSidebar from "~/components/shared/menus/MenuSidebar";
import WidgetEarningSidebar from "~/components/shared/widgets/WidgetEarningSidebar";
import WidgetUserWelcome from "~/components/shared/widgets/WidgetUserWelcome";
import HeaderDashboard from "~/components/shared/headers/HeaderDashboard";
import { useSelector } from "react-redux";

const ContainerDashboard = ({ children, title }) => {
  let titleView;
  const { isDrawerMenuWeb } = useSelector(state => state.app);
  if (title !== undefined) {
    titleView = process.env.title + " | " + title;
  } else {
    titleView = process.env.title + " | " + process.env.titleDescription;
  }
  // // const drawerClass = isDrawerMenuWeb ? 'drawer__Open' : 'drawer__Close';
  return (
    <div className="martfury-admin">
      <Head>
        <title>{'Admin-QISTBAZAAR'}</title>
      </Head>
      <main className={`ps-main `} style={{ minHeight: "100vh" }}>

        <div className="ps-main__sidebar " style={{ maxWidth: isDrawerMenuWeb ? '300px' :'80px' }}>
          <div className="ps-sidebar">
            <div className="b mb-2">
              <WidgetUserWelcome />
              {/* <WidgetEarningSidebar /> */}
            </div>
            <div className="ps-sidebar__content">
              <div className="ps-sidebar__center">
                <MenuSidebar />
              </div>
            </div>
            <div className="ps-sidebar__footer">
              <FooterCopyright />
            </div>
          </div>
        </div>
        <div className="ps-main__wrapper">
          <HeaderDashboard />
          {children}
        </div>

      </main>
    </div>
  );
};

export default ContainerDashboard;

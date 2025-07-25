import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import accessRights from "~/utils/rolesConfig";

const MenuSidebar = () => {
  const router = useRouter();
  const { roleID } = useSelector((state) => state.auth);
  const userRights = accessRights[roleID] || { allowedPages: [] };
  const { isDrawerMenuWeb } = useSelector((state) => state.app);
  const menuItems = [
    {
      text: "Dashboard",
      url: "/",
      icon: "icon-home",
    },
    {
      text: "Products",
      url: "/products",
      icon: "icon-database",
    },
    // {
    //   text: "Orders",
    //   url: "/orders",
    //   icon: "icon-bag2",
    // },
    {
      text: "Users",
      url: "/users",
      icon: "icon-users2",
    },
    {
      text: "Homepage Editor",
      url: "/homeweb",
      icon: "icon-pencil2", // Updated icon for Homepage Editor
    },
    {
      text: "Categories",
      url: "/categories",
      icon: "icon-list", // Updated icon for Categories
    },
    // {
    //   text: "Permissions",
    //   url: "/permission",
    //   icon: "icon-cog",
    // },
    {
      text: "City/Area",
      url: "/city-area",
      icon: "icon-location", // Updated icon for City/Area
    },
    {
      text: "Coupon",
      url: "/coupon",
      icon: "icon-tag", // Updated icon for Coupon
    },

    {
      text: "App Notification",
      url: "/notification",
      icon: "icon-smartphone-notification", // Update icon for Pages
    },
    {
      text: "Blog and Press",
      url: "/blog-and-press",
      icon: "icon-blog", // Update icon for Pages
    },
    {
      text: "Web Pages",
      url: "/custom-pages/web-pages",
      icon: "icon-book2", // Update icon for Pages
    },
    {
      text: "App Pages",
      url: "/custom-pages",
      icon: "icon-book", // Update icon for Pages
    },
    {
      text: "Stores",
      url: "/vendor/stores",
      icon: "icon-store", // Keeping the same icon for Settings
    },
    {
      text: "Stores Products",
      url: "/vendor/products",
      icon: "icon-laundry", // Keeping the same icon for Settings
    },
    {
      text: "Stores Orders",
      url: "/vendor/orders",
      icon: "icon-bag2", // Keeping the same icon for Settings
    },
    {
      text: "Settings",
      url: "/settings",
      icon: "icon-cog", // Keeping the same icon for Settings
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    userRights.allowedPages.includes(item.url)
  );

  return (
    <ul className="menu">
      {filteredMenuItems?.map((item, index) => (
        <li
          key={index}
          className={router.pathname === item.url ? "active" : ""}
        >
          <Link href={item.url}>
            <span className={`${!isDrawerMenuWeb && "text-center ml-3"}`}>
              <i
                className={item.icon}
                style={{ fontSize: !isDrawerMenuWeb && "20px" }}
              ></i>
              {isDrawerMenuWeb && item.text}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuSidebar;

// rolesConfig.js

const accessRights = {
  3: {
    // SUPER ADMIN-Every thing is allowed
    allowedPages: [
      "/",
      "/categories",
      "/city-area",
      "/coupon",
      "/homeweb",
      "/coupon/[code]",
      "/coupon/[code]/edit-coupon",
      "/create-coupon",
      "/orders",
      "/orders/[oid]",
      "/orders/[oid]/order-detail",
      "/permission",
      "/custom-pages",
      "/custom-pages/create-pages",
      "/custom-pages/edit/[slug]",
      "/custom-pages/web-pages",
      "/custom-pages/web-pages/create",
      "/custom-pages/web-pages/edit/[pageID]",
      "/products",
      "/products/deleted-products",
      "/products/create-product",
      "/products/[pid]",
      "/products/[pid]/edit-product",
      "/settings",
      "/users",
      "/create-user",
      "/users/[uid]",
      "/403",
      "/404",
      "/notification",
      "/blog-and-press",
      "/blog-and-press/create",
      "/blog-and-press/[id]",
      "/vendor/stores",
      "/vendor/store/[slug]",
      "/vendor/products",
      "/vendor/orders",
    ],
  },
  13: {
    // MARKETING
    allowedPages: [
      "/",
      "login",
      "/",
      "/403",
      "/404",
      "/notification",
      "/blog-and-press",
      "/blog-and-press/create",
      "/blog-and-press/[id]",

    ],
  },
  4: {
    // ADMIN
    allowedPages: [
      "/products",
      "/categories",
      "/custom-pages/web-pages",
      "/custom-pages/web-pages/create",
      "/custom-pages/web-pages/edit/[pageID]",
      "/products/deleted-products",
      "/products/create-product",
      "/products/[pid]",
      "/products/edit-product",
      "/products/[pid]/edit-product",
      "/homeweb",
      "/403",
      "/404",
      "/blog-and-press",
      "/blog-and-press/create",
      "/blog-and-press/[id]",

      "/vendor/stores",
      "/vendor/store/[slug]",
      "/vendor/products",
      "/vendor/orders",
      "/orders/[oid]",
      "/orders/[oid]/order-detail",
    ],
  },
  6: {
    // CC
    allowedPages: ["/orders", "/403", "/404"],
  },
  10: {
    // Role with no access
    allowedPages: ["/403", "/404"],
  },
  default: {
    allowedPages: ["/login", "login/magic-login"],
  },
};

export default accessRights;

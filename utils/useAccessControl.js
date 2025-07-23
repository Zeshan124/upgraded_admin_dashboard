// hooks/useAccessControl.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import accessRights from "~/utils/rolesConfig"; // Adjust the import path as necessary
import Cookies from "js-cookie";

const pathMatches = (path, pattern) => {
  const escapedPattern = pattern.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  const paramRegex = escapedPattern.replace(/\\\[(.*?)\\\]/g, "([^\/]+)");
  const regex = new RegExp(`^${paramRegex}$`);
  return regex.test(path);
};

const useAccessControl = () => {
  const router = useRouter();

  useEffect(() => {
    const path = router.pathname;

    if (!path.startsWith("/login")) {
      const role = Cookies.get("roleID");
      const roleConfig = accessRights[role];

      const isAllowedToAccess = roleConfig?.allowedPages.some((allowedPage) =>
        pathMatches(path, allowedPage)
      );

      if (Cookies.get("token")) {
        if (!roleConfig || !isAllowedToAccess) {
          // Redirect to a 403 page if the user does not have access to the path
          router.push("/403"); // or any other fallback page
        }
      } else {
        router.push("/login");
      }
    }
  }, [router.pathname]);
};

export default useAccessControl;

import React, { useEffect, useState } from "react";
import FormLogin from "~/components/shared/forms/FormLogin";
import { useDispatch } from "react-redux";
import Head from "../../components/layouts/modules/Head";
import { useRouter } from "next/router";
import { actionTypes } from "~/store/auth/action";
import LoadingSpinner from "~/components/shared/UI/LoadingSpinner";
const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    const { "magic-login": magicLink } = router.query;

    if (magicLink) {
      dispatch({
        type: actionTypes.LOGIN_REQUEST,
        payload: {
          magicLink: magicLink,
        },
      });
    }
    setLoading(false);
  }, [router.query]);
  return (
    <>
      <Head />
      {loading ? <LoadingSpinner /> : <FormLogin />}
    </>
  );
};
export default LoginPage;

import React, { useEffect, useState } from 'react';
import DefaultLayout from '~/components/layouts/DefaultLayout';
import { wrapper } from '~/store/store';
import 'react-tabs-scrollable/dist/rts.css';
import '~/styles/style.scss';
// NEW (Antd v5)
import 'antd/dist/reset.css';
import LoginPage from './login';
import { useDispatch, useSelector } from 'react-redux';
import {actionTypes, loginCheck } from '~/store/auth/action';
import LoadingSpinner from '~/components/shared/UI/LoadingSpinner';
import useAccessControl from '~/utils/useAccessControl';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import '~/styles/tab.css';
import { decryptData } from '~/components/utils/crypto';

// const pathMatches = (path, pattern) => {

//     const escapedPattern = pattern.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
//     const paramRegex = escapedPattern.replace(/\\\[(.*?)\\\]/g, '([^\/]+)');
//     const regex = new RegExp(`^${paramRegex}$`);
//     return regex.test(path);
// };

function App({ Component, pageProps }) {
    
    const { isLoggedIn} = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const router = useRouter(); 
    const [isLoading, setIsLoading] = useState(true); 
    const id  = process.env.NEXT_PUBLIC_HOTJAR_ID
    const sv  = process.env.NEXT_PUBLIC_HOTJAR_SV

    useEffect(() => {

        const loginAttempt = decryptData(Cookies.get("g2adtag"));
        if (loginAttempt === 0 && router.pathname !== "/login/new-user") {
            setIsLoading(true);
            router.replace("/login/new-user");
        } else {
            setIsLoading(true);
            dispatch(loginCheck());
            setIsLoading(false);
        }
    }, [router.pathname]);

    // useEffect(() => {
    //     hotjar.initialize(
    //         process.env.NEXT_PUBLIC_HOTJAR_ID,
    //         process.env.NEXT_PUBLIC_HOTJAR_SV
    //     )
    // }, [])

    useAccessControl(); // Use the custom hook

    useEffect(() => {
        setTimeout(function () {
            document.getElementById('__next').classList.add('loaded');
        }, 100);
    }, []);
    
    if (isLoading) { return <LoadingSpinner /> }
    else{
        if (Component === LoginPage && !isLoggedIn && !Cookies.get('token')) {
            return <Component {...pageProps} />;
        }
        if (isLoggedIn) {
            const getLayout =
                Component.getLayout || ((page) =>(
                            <DefaultLayout children={page} />
                ));
            return getLayout(<Component {...pageProps} />);
        }
        return <LoadingSpinner />     
    }
}
export default wrapper.withRedux(App);

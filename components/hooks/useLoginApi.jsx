import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { loginUser } from '~/services/userService';

import { loginSuccess } from '~/store/auth/action';

export const useLoginApi = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const cookies = new Cookies();
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const data = await loginUser(email, password);
            if (data.token) {

                cookies.set('token', data.token, { secure: true, httpOnly: true, sameSite: 'strict' });
                dispatch(loginSuccess(data.token));
            }
        } catch (error) {
            setError(error);
        }
        setIsLoading(false);
    };

    return { login, isLoading, error };
};
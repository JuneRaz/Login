import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        console.log('useEffect triggered');
        console.log('Current auth state:', auth);
        console.log('Persist value:', persist);

        const verifyRefreshToken = async () => {
            try {
                const newAccessToken = await refresh();
                console.log("New Access Token from refresh:", newAccessToken);
            } catch (err) {
                console.error("Error during token refresh:", err);
            } finally {
                setIsLoading(false);
            }
        }

        if (!auth?.accessToken && persist) {
            console.log('No access token found, trying to refresh...');
            verifyRefreshToken();
        } else {
            console.log('Access token already present or persist is false');
            setIsLoading(false);
        }
    }, [auth, persist, refresh]);

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        console.log(`Access Token: ${JSON.stringify(auth?.accessToken)}`);
    }, [isLoading, auth?.accessToken]);

    return (
        <>
            {!persist
                ? <Outlet /> // If persist is false, just render the child routes
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet /> // If loading is complete, render child routes
            }
        </>
    );
}

export default PersistLogin;

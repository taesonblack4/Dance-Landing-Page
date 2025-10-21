/*
- UserProvider does the Axios call once on mount and stores the result.
- user and loading become available to any child via the context.

To avoid duplicating the “fetch current user” logic in both UserDashboard and AccountDetails, 
you can lift that logic into a shared context (or a custom hook) and 
then simply consume the same user object wherever you need it.

Below is an example using React Context (UserContext) 
to fetch once at the top of your user‐area 
and then make user + loading available to any component under /user/*.
 */

import React, {createContext,useState,useEffect } from 'react'
import axios from 'axios';
import {USER_ROUTES} from '../../../Common/db-urls';


export const UserContext = createContext({
    user: null,
    loading: true,
    setUser: () => {},
    fetchUser: async () => {}
});

export function UserProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //function to fetch user data
    const fetchUser = async () => {

        setLoading(true);

        const token = localStorage.getItem('accessToken');
        
        if(!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const {data} = await axios.get(USER_ROUTES.me, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setUser(data);
        } catch (error) {
            console.error('Failed to fetch user: ', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    //fetch user on mount
    useEffect(() => {
        fetchUser();
    },[]);

    return (
        <UserContext.Provider value={{user, setUser, loading, fetchUser}} >
            {children}
        </UserContext.Provider>
    );
}

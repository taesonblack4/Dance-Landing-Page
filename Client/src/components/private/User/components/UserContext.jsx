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

const HOST = `http://localhost:4004/basic/users/me`;

export const UserContext = createContext({
    user: null,
    loading: true,
});

export function UserProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const token = localStorage.getItem('accessToken');
                if(!token) throw new Error('No Token');

                const {data} = await axios.get(HOST, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                console.log(data)
                setUser(data);
            } catch (error) {
                console.error('Failed to fetch user: ', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    },[]);

    return (
        <UserContext.Provider value={{user, loading}} >
            {children}
        </UserContext.Provider>
    );
}

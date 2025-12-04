import React, {createContext, useContext, useEffect, useState,} 
from "react";
import { authDataContext } from './authContext';
import axios from "axios";

export const userDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const { serverUrl } = useContext(authDataContext);

  // Get logged-in user
  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/user/getcurrentuser`,
        { withCredentials: true }
      );

      setUserData(response.data);
      console.log("Current User:", response.data);

    } catch (error) {
      setUserData(null);
      console.log("User fetch error:", error);
    }
  };

  // Auto fetching user on mount
  useEffect(() => {
    getCurrentUser();
  }, []);

  const value = {
    userData,
    setUserData,
    getCurrentUser,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;

import { useEffect, useState } from "react";

import { baseUrl } from "../services/api";
import { AuthContext } from "../context";

const AuthProvider = ({children}) => {
 const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("access_token");
 
 

  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userRes = await fetch(`${baseUrl}/api/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user");
        }

        const userData = await userRes.json();
        setUser(userData);
        setLoading(false);
      } catch (error) {
        setUser(null);
        console.log(error);
      }
    };

    fetchUser();
  }, [accessToken]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        accessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider;

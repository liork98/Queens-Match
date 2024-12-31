import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const updateUserData = (updatedUserData) => {
    setUserData(updatedUserData);
  };

  const login = (updatedUserToken) => {
    setUserToken(updatedUserToken);
  };

  const logout = () => {
    setUserToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user: userToken, login, logout, userData, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

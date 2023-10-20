import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useCurrentUser = () => {
  const currentUserContext = useContext(UserContext);
  if (!currentUserContext) {
    throw new Error("useCurrentUser must be used within the UserProvider");
  }
  return currentUserContext;
};

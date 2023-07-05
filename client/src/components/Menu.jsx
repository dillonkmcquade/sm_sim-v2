import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";
import { MenuContext } from "../context/MenuContext";
import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";

export default function Menu() {
  const { menuVisible, setMenuVisible } = useContext(MenuContext);
  const { error, loginWithRedirect, isAuthenticated, isLoading, logout } =
    useAuth0();

  const handleSignIn = async () => {
    if (!isAuthenticated) {
      await loginWithRedirect();
    }
  };

  const handleLogout = async () => {
    logout({ logoutParams: { returnTo: "http://localhost:3000" } });
    window.sessionStorage.removeItem("user");
  };

  if (error) {
    <h1>{error.message}</h1>;
  }
  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <Nav onClick={() => setMenuVisible(!menuVisible)}>
      {isAuthenticated && <MenuOption to="/dashboard">Dashboard</MenuOption>}
      <MenuOption to="/research">Research</MenuOption>
      {isAuthenticated ? (
        <>
          <MenuOption to="/portfolio">Portfolio</MenuOption>
          <MenuOption to="/profile">Profile</MenuOption>
          <AuthRedirect onClick={handleLogout}>Sign out</AuthRedirect>
        </>
      ) : (
        <AuthRedirect onClick={handleSignIn}>Sign In</AuthRedirect>
      )}
    </Nav>
  );
}

const Nav = styled.nav`
  position: fixed;
  top: 56px;
  background-color: #000000;
  width: 100vw;
  height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  animation: fadeIn ease-in-out 250ms;
  z-index: 1000;

  @keyframes fadeIn {
    0% {
      bottom: 100vh;
      opacity: 0;
    }
    100% {
      opacity: 1;
      bottom: 0;
    }
  }
`;

const MenuOption = styled(NavLink)`
  font-size: 1.6rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: white;
  transition: all ease-in-out 400ms;

  /* &:hover {
    border: 1px solid white;
  } */

  &.active {
    border-bottom: 2px solid white;
  }
`;

const AuthRedirect = styled.button`
  font-size: 1.6rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  background-color: black;
  cursor: pointer;
  color: white;
  border: none;
  text-align: left;
  transition: all ease-in-out 400ms;

  /* &:hover {
    border: 1px solid white;
  } */

  &.active {
    border-bottom: 2px solid white;
  }
`;

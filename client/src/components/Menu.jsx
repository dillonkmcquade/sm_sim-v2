import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";
import { MenuContext } from "../context/MenuContext";
import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";

export default function Menu() {
  const { menuVisible } = useContext(MenuContext);
  const { error, loginWithRedirect, isAuthenticated, isLoading, logout } =
    useAuth0();

  const handleSignIn = async () => {
    if (!isAuthenticated) {
      await loginWithRedirect();
    }
  };

  const handleLogout = async () => {
    window.sessionStorage.removeItem("user");
    logout({ logoutParams: { returnTo: "http://localhost:3000" } });
  };

  if (error) {
    <h1>{error.message}</h1>;
  }
  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <Nav display={menuVisible ? "flex" : "none"}>
      {isAuthenticated && (
        <MenuOption to="/dashboard">
          <DataSaverOffIcon /> Dashboard
        </MenuOption>
      )}
      <MenuOption to="/research">
        <SearchIcon /> Research
      </MenuOption>
      {isAuthenticated ? (
        <>
          <MenuOption to="/profile">
            <PersonIcon /> Profile
          </MenuOption>
          <AuthRedirect onClick={handleLogout}>
            <LogoutIcon /> Sign out
          </AuthRedirect>
        </>
      ) : (
        <AuthRedirect onClick={handleSignIn}>
          <PersonIcon /> Sign In
        </AuthRedirect>
      )}
      <Image
        src="./financial-drawing.svg"
        alt="Person drawing financial things"
      />
    </Nav>
  );
}

const Nav = styled.nav`
  position: fixed;
  top: 56px;
  background-color: #000000;
  width: 100vw;
  height: calc(100vh - 56px);
  display: ${(props) => props.display};
  flex-direction: column;
  animation: fadeInFromTop ease-in-out 250ms;
  z-index: 1000;
  @media (min-width: 1000px) {
    width: 300px;
    right: 0;
    border-left: 1px solid white;
    animation: fadeInFromRight ease-in-out 250ms;
  }

  @keyframes fadeInFromTop {
    0% {
      bottom: 100vh;
      opacity: 0;
    }
    100% {
      opacity: 1;
      bottom: 0;
    }
  }
  @keyframes fadeInFromRight {
    0% {
      right: -300px;
      opacity: 0;
    }
    100% {
      opacity: 1;
      right: 0;
    }
  }
`;

const MenuOption = styled(NavLink)`
  font-size: 1.6rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: white;
  transition: all ease-in-out 400ms;
  display: flex;
  align-items: center;
  @media (min-width: 1000px) {
    &:hover {
      background-color: white;
      color: black;
    }
  }

  /* &:hover {
    border: 1px solid white;
  } */

  &.active {
    background-color: white;
    color: black;
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
  @media (min-width: 1000px) {
    &:hover {
      background-color: white;
      color: black;
    }
  }

  /* &:hover {
    border: 1px solid white;
  } */

  &.active {
    border-bottom: 2px solid white;
  }
`;

const Image = styled.img`
  width: 85%;
  padding: 1rem;
  margin: 0 auto;
`;

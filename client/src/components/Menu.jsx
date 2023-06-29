import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";
import { MenuContext } from "../context/MenuContext";
import { UserContext } from "../context/UserContext";

export default function Menu() {
  const { menuVisible, setMenuVisible } = useContext(MenuContext);
  const { currentUser } = useContext(UserContext);
  return (
    <Nav onClick={() => setMenuVisible(!menuVisible)}>
      <MenuOption to="/dashboard">Dashboard</MenuOption>
      <MenuOption to="/research">Research</MenuOption>
      {currentUser ? (
        <>
          <MenuOption to="/portfolio">Portfolio</MenuOption>
          <MenuOption to="/profile">Profile</MenuOption>
          <MenuOption to="/">Sign out</MenuOption>
        </>
      ) : (
        <MenuOption to="/signin">Sign In</MenuOption>
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

  &:hover {
    border: 2px solid white;
  }

  &.active {
    border-bottom: 2px solid white;
  }
`;

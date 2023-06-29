import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { GiHamburgerMenu } from "react-icons/gi";
import { IconContext } from "react-icons";
import { MenuContext } from "../context/MenuContext";
import { useContext } from "react";

export default function Header() {
  const { menuVisible, setMenuVisible } = useContext(MenuContext);
  return (
    <Wrapper>
      <IconContext.Provider value={{ color: "white", size: "36px" }}>
        <NavContainer>
          <Logo to="/">SmSim</Logo>
          <Hamburger onClick={() => setMenuVisible(!menuVisible)} />
        </NavContainer>
      </IconContext.Provider>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: center;
  height: 56px;
  width: 100vw;
  border-bottom: 1px solid white;
`;
const NavContainer = styled.nav`
  height: 100%;
  width: 100%;
  display: flex;
  margin: 0 1rem;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  text-decoration: none;
  color: white;
`;

const Hamburger = styled(GiHamburgerMenu)`
  cursor: pointer;
`;

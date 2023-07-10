import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { GiHamburgerMenu } from "react-icons/gi";
import { IconContext } from "react-icons";
import { MenuContext } from "../context/MenuContext";
import { useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Header() {
  const { menuVisible, setMenuVisible } = useContext(MenuContext);
  const { isAuthenticated } = useAuth0();
  return (
    <Wrapper>
      <IconContext.Provider value={{ color: "white", size: "36px" }}>
        <NavContainer>
          <Logo
            to={isAuthenticated ? "/dashboard" : "/"}
            onClick={() => menuVisible && setMenuVisible(false)}
          >
            MarketSim
          </Logo>
          <Hamburger onClick={() => setMenuVisible(!menuVisible)} />
        </NavContainer>
      </IconContext.Provider>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  position: fixed;
  justify-content: center;
  height: 56px;
  width: 100vw;
  border-bottom: 1px solid white;
  background-color: #000000;
  z-index: 10;
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

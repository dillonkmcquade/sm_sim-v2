import { styled } from "styled-components";
export default function Header() {
  return (
    <Wrapper>
      <Logo>SmSim</Logo>
      <Hamburger />
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  margin: 0 1rem;
`;

const Logo = styled.h1`
  font-size: 1.8rem;
`;

const Hamburger = styled.div``;

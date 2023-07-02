import { styled } from "styled-components";

export default function Button({ handler, children, bg, hoverbg, color }) {
  return (
    <StyledButton bg={bg} color={color} hoverbg={hoverbg} onClick={handler}>
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  background: ${(props) =>
    props.bg ||
    "linear-gradient(90deg,rgba(152, 148, 230, 1) 0%,rgba(121, 9, 119, 1) 100%,rgba(0, 212, 255, 1) 100%)"};
  color: ${(props) => props.color || "#000000"};
  font-size: 1.2rem;
  border: none;
  padding: 0.75rem;
  border-radius: ${(props) => props.bradius || "1rem"};
  cursor: pointer;
  transition: scale ease-in-out 300ms;
  transition: background ease-in-out 1000ms;

  &:active {
    scale: 0.9;
  }

  &:hover {
    background: ${(props) =>
      props.hoverbg ||
      "linear-gradient(90deg,rgba(152, 148, 230, 0.8) 0%,rgba(121, 9, 119, 0.8) 100%,rgba(0, 212, 255, 0.8) 100%)"};

: 
  }
`;

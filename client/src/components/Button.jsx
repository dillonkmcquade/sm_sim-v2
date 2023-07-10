import { styled } from "styled-components";

export default function Button({
  handler,
  hovercolor,
  children,
  bg,
  hoverbg,
  color,
  bradius,
  border,
  disabled,
  style,
}) {
  return (
    <StyledButton
      bradius={bradius}
      bg={bg}
      color={color}
      hoverbg={hoverbg}
      hovercolor={hovercolor}
      border={border}
      onClick={handler}
      disabled={disabled}
      style={style}
    >
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
  border: ${(props) => props.border || "none"};
  padding: 0.75rem;
  border-radius: ${(props) => props.bradius || "1rem"};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: scale ease-in-out 300ms;
  transition: background ease-in 500ms;
  min-width: 100px;
  max-width: 500px;

  &:active {
    scale: ${(props) => (props.disabled ? "1" : 0.9)};
  }

  &:hover {
    background: ${(props) =>
      props.hoverbg ||
      "linear-gradient(90deg,rgba(152, 148, 230, 0.8) 0%,rgba(121, 9, 119, 0.8) 100%,rgba(0, 212, 255, 0.8) 100%)"};
    color: ${(props) => props.hovercolor};
  }
`;

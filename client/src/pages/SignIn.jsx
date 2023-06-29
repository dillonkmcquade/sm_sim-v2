import { styled } from "styled-components";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

export default function SignIn() {
  return (
    <Wrapper>
      <SignInForm autoComplete="off">
        <Title>SmSim</Title>
        <Title style={{ fontSize: "1.8rem" }}>Sign In</Title>
        <TextField
          required
          id="email"
          label="Email address"
          sx={{
            margin: "1rem",
            width: "60vw",
          }}
        />
        <TextField
          required
          type="password"
          id="password"
          label="Password"
          sx={{
            margin: "1rem",
            width: "60vw",
          }}
        />
        <Button
          type="submit"
          sx={{
            width: "50vw",
            margin: "1rem",
            backgroundColor: "#000000",
            color: "white",
          }}
          variant="contained"
        >
          Submit
        </Button>
      </SignInForm>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  top: 56px;
  z-index: -1;
  height: calc(100vh - 56px);
`;

const SignInForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 60vh;
  background-color: white;
  margin: 1rem auto;
  width: 80vw;
  border-radius: 0.5rem;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: black;
`;

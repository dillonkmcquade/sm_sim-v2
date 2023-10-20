import { Link } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import { Props } from "../types";
import { styled } from "@mui/material";

export default function FourOhFour({ children }: Props) {
  return (
    <Wrapper>
      <p>{children}</p>
      <Link to="/research">
        Get started <LaunchIcon fontSize="small" sx={{ color: "white" }} />
      </Link>
    </Wrapper>
  );
}

const Wrapper = styled("div")`
  width: 85vw;
  margin: 1rem auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

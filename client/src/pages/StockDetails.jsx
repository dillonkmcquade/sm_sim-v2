import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { styled } from "styled-components";

import useTicker from "../hooks/useTicker";
export default function StockDetails() {
  const { id } = useParams();
  const { currentTicker, isLoading, error } = useTicker(id);
  if (error) {
    return <h1>{error.message}</h1>;
  }
  if (isLoading) {
    return <CircularProgress />;
  }
  return <Wrapper>{id}</Wrapper>;
}

const Wrapper = styled.div`
  position: relative;
  top: 56px;
`;

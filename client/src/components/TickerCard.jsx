import LineChart from "../components/LineChart.jsx";
import { styled } from "styled-components";
import useQuote from "../hooks/useQuote.js";
import useHistoricalData from "../hooks/useHistoricalData.js";

export default function TickerCard({ handler, ticker }) {
  const { quote } = useQuote(ticker);
  const { data } = useHistoricalData(ticker);
  return (
    quote &&
    data && (
      <Wrapper onClick={handler}>
        <Title>{ticker}</Title>
        <Price color={quote.d > 0 ? "#027326" : "#b5050e"}>${quote.c}</Price>
        <LineChart small="true" id={ticker} data={data} />
      </Wrapper>
    )
  );
}

const Wrapper = styled.div`
  height: 35vh;
  width: 80vw;
  min-width: 80vw;
  padding: 1rem 1rem 4rem 1rem;
  border: 2px solid white;
  border-radius: 1rem;
  cursor: pointer;
  margin: 1rem;
  color: black;
`;

const Title = styled.h1`
  font-size: 1.1rem;
  color: white;
`;
const Price = styled.p`
  color: ${(props) => props.color};
`;

import useAggregateData from "../hooks/useTickerAggregateData.js";
import LineChart from "../components/LineChart.jsx";
import { styled } from "styled-components";

export default function TickerCard({ handler, data, ticker }) {
  const { currentPrice, previousDayPrice } = useAggregateData(ticker);
  return (
    <Wrapper onClick={handler}>
      <Title>{ticker}</Title>

      <Price color={currentPrice > previousDayPrice ? "#027326" : "#b5050e"}>
        ${currentPrice}
      </Price>
      <LineChart small="true" id={ticker} data={data} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 35vh;
  width: 80vw;
  min-width: 80vw;
  padding: 1rem;
  border: 2px solid white;
  border-radius: 1rem;
  cursor: pointer;
  margin: 1rem;
`;

const Title = styled.h1`
  font-size: 1.1rem;
`;
const Price = styled.p`
  color: ${(props) => props.color};
`;

import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { styled } from "styled-components";
import useAggregateData from "../hooks/useTickerAggregateData";
import useNewsData from "../hooks/useTickerNewsData";
import NewsArticle from "../components/NewsArticle";
import LineChart from "../components/LineChart";

export default function StockDetails() {
  const { id } = useParams();
  const { isLoading, currentTicker, currentPrice, previousDayPrice } =
    useAggregateData(id);
  const { news, isLoadingNews } = useNewsData(id);

  return isLoading || !currentTicker ? (
    <Wrapper>
      <CircularProgress />
    </Wrapper>
  ) : (
    <Wrapper>
      <TickerName>{id}</TickerName>
      <CurrentPrice
        color={currentPrice > previousDayPrice ? "#027326" : "#b5050e"}
      >
        ${currentTicker[currentTicker.length - 1].Close}
        <SecondaryText>
          (${currentPrice > previousDayPrice && "+"}
          {(currentPrice - previousDayPrice).toFixed(2)})
        </SecondaryText>
      </CurrentPrice>
      <LineChart id={id} data={currentTicker} />
      <NewsTitle>News from {id}</NewsTitle>
      <NewsContainer>
        {!isLoadingNews &&
          news.map((article) => (
            <NewsArticle article={article} key={article.id} />
          ))}
      </NewsContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  top: 56px;
  height: 50vh;
`;
const TickerName = styled.h1`
  color: white;
  font-size: 2.2rem;
  padding: 0.5rem;
`;

const CurrentPrice = styled.h1`
  color: ${(props) => props.color};
  font-size: 1.5rem;
  margin-left: 1rem;
`;

const SecondaryText = styled.span`
  font-size: 0.75rem;
`;

const NewsContainer = styled.div``;

const NewsTitle = styled.h3`
  margin-left: 1rem;
`;

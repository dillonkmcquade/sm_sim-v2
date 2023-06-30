import { useState } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { styled } from "styled-components";
// import { ResponsiveStream } from "@nivo/stream";
import useTickerAggregateData from "../hooks/useTickerAggregateData";
import useTickerNewsData from "../hooks/useTickerNewsData";

import NewsArticle from "../components/NewsArticle";

export default function StockDetails() {
  const { id } = useParams();

  const { currentTicker, isLoading, error } = useTickerAggregateData(id);
  const { news, isLoadingNews } = useTickerNewsData(id);

  const [currentPrice, setCurrentPrice] = useState(() => {
    return currentTicker[currentTicker.length - 1].c.toFixed(2);
  });

  const [previousDayPrice, setPreviousDayPrice] = useState(() => {
    return currentTicker[currentTicker.length - 2].c.toFixed(2);
  });

  return !currentTicker ? (
    <Wrapper>
      <CircularProgress sx={{ color: "#000000" }} />
    </Wrapper>
  ) : (
    <Wrapper>
      <TickerName>{id}</TickerName>
      <CurrentPrice
        color={currentPrice > previousDayPrice ? "#027326" : "#b5050e"}
      >
        ${currentTicker[currentTicker.length - 1].c}
        <SecondaryText>
          (${currentPrice > previousDayPrice && "+"}
          {(currentPrice - previousDayPrice).toFixed(2)})
        </SecondaryText>
      </CurrentPrice>
      <NewsContainer>
        {news &&
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

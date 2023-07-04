import { useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { styled } from "styled-components";

import useAggregateData from "../hooks/useTickerAggregateData";
import useNewsData from "../hooks/useTickerNewsData";

import { CircularProgress } from "@mui/material";
import NewsArticle from "../components/NewsArticle";
import LineChart from "../components/LineChart";
import Button from "../components/Button";

import { WidthContext } from "../context/WidthContext";

export default function StockDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoading, currentTicker, currentPrice, previousDayPrice } =
    useAggregateData(id);
  const { news, isLoadingNews } = useNewsData(id);
  const { width } = useContext(WidthContext);

  return isLoading || !currentTicker ? (
    <Wrapper>
      <CircularProgress />
    </Wrapper>
  ) : (
    <Wrapper>
      <Back to={"/research"}>Back</Back>
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

      <div style={{ height: "70vh" }}>
        <LineChart id={id} data={currentTicker} />
      </div>

      <Stats></Stats>

      <ButtonContainer width={width}>
        <Button bradius="4px" handler={() => navigate(`/transaction/${id}`)}>
          Buy
        </Button>
        <Button
          bg="black"
          hovercolor="black"
          color="white"
          hoverbg="white"
          bradius="4px"
          border="1px solid white"
          handler={() => navigate(`/transaction/${id}`)}
        >
          Sell
        </Button>
      </ButtonContainer>

      <NewsTitle>News from {id}</NewsTitle>
      <NewsContainer>
        {isLoadingNews ? (
          <CircularProgress />
        ) : (
          news.map((article) => (
            <NewsArticle article={article} key={article.id} />
          ))
        )}
      </NewsContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  top: 56px;
  display: flex;
  flex-direction: column;
  margin-bottom: 150px;
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

const ButtonContainer = styled.div`
  width: 100vw;
  background-color: black;
  border-top: 1px solid white;
  position: fixed;
  display: flex;
  justify-content: space-evenly;
  padding: 0.5rem;
  bottom: 0;

  @media only screen and (min-width: 500px) {
    align-self: center;
    max-width: 500px;
    position: static;
    border-top: none;
  }
`;

const Stats = styled.div``;

const Back = styled(Link)`
  text-decoration: none;
  margin: 0.3rem 0 0 0.3rem;
  color: #b48ead;
  font-size: 1.1rem;

  &:hover {
    color: #81a1c1;
  }
`;

import {  useEffect, lazy, Suspense } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";

import { getInvestedValue, getUniques, getHoldings, getTotalValue } from "../utils/utils";

import PieChart from "../components/PieChart";
import { CircularProgress } from "@mui/material";
import { useCurrentUser } from "../context/UserContext";
import FourOhFour from "../components/FourOhFour";
const TickerCard = lazy(() => import("../components/TickerCard"));

import type { User } from "../types";

export default function Dashboard() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUser(); 

  //get user object from backend
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    async function setTotalValue(){
    try{
        const accessToken = await getAccessTokenSilently();
        const holdings = await getHoldings(accessToken);
        if (holdings.length === 0) {
          return setCurrentUser({...currentUser, total: 0, holdings: [], timestamp: Date.now()})
        };
        const total = await getTotalValue(holdings); //potentially expensive function call
        const modifiedObj: User = { ...currentUser, holdings, total, timestamp: Date.now()  };
        setCurrentUser(modifiedObj);
      }catch(err) {
        console.log(err)
      }
      }
    setTotalValue();
  }, [getHoldings, setCurrentUser, isAuthenticated, getAccessTokenSilently]);

  const investedValue = currentUser.holdings && currentUser.holdings?.length
    ? getInvestedValue(currentUser.holdings)
    : 0;

  return !currentUser ? (
    <Wrapper>
      <CircularProgress sx={{ color: "#027326", margin: "auto" }} />
    </Wrapper>
  ) : (
    <Wrapper>
      <Title>
        {" "}
        Hello, <Name>{currentUser.nickname || currentUser.name}</Name>!
      </Title>
      <PortfolioValue>
        {Number(currentUser.total! + currentUser.balance).toLocaleString(
          "en-US",
          { style: "currency", currency: "USD" },
        )}
      </PortfolioValue>
      <Profit
        color={currentUser.total! - investedValue > 0 ? "#027326" : "#b5050e"}
      >
        {Number(currentUser.total! - investedValue).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}{" "}
        all time
      </Profit>

      <div style={{ display: "flex", height: "500px", color: "black" }}>
        {!currentUser.holdings?.length ? (
          <FourOhFour>Nothing here yet.</FourOhFour>
        ) : (
          <PieChart data={currentUser} />
        )}
      </div>
      <Title>Account Details</Title>
      <AccountDetails>
        <Detail>
          <div>Total Value of all holdings: </div>
          <p>
            <Bold>
              {currentUser.total?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Bold>
          </p>
        </Detail>
        <Detail>
          <div>Available cash: </div>
          <p>
            <Bold>
              {currentUser.balance.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Bold>
          </p>
        </Detail>
      </AccountDetails>
      <Title>Holdings</Title>
      <Holdings>
        {!currentUser.holdings?.length ? (
          <FourOhFour>Nothing here yet.</FourOhFour>
        ) : (
          getUniques(currentUser.holdings).map((holding) => (
            <TickerCard
              handler={() => navigate(`/research/${holding.ticker}`)}
              key={holding.ticker}
              ticker={holding.ticker}
            />
          ))
        )}
      </Holdings>
      <Title>Watch List</Title>
      <WatchList>
        {currentUser.watch_list.length > 0 ? (
          currentUser.watch_list.map((item) => (
              <Suspense fallback={<CircularProgress /> } key={item}>
                <TickerCard
                  key={item}
                  ticker={item}
                  handler={() => navigate(`/research/${item}`)}
                />
              </Suspense>
          ))
        ) : (
          <FourOhFour>Nothing here yet.</FourOhFour>
        )}
      </WatchList>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  position: relative;
  top: 56px;
  width: 85vw;
  height: 100vh;
  margin: 0 auto;
  @media (min-width: 1000px) {
    max-width: 1400px;
    margin: 0 auto;
  }
`;

const Title = styled.h1``;
const PortfolioValue = styled(Title)``;

const Profit = styled.p`
  color: ${(props) => props.color};
  margin: 0 0 1rem 1rem;
`;

const Holdings = styled.div`
  display: flex;
  overflow: auto;
`;

const AccountDetails = styled.div`
  border-radius: 1rem;
  border: 2px solid white;
  margin: 1rem 0;
  padding: 0.5rem;
  color: gray;
  max-width: 500px;
`;

const Detail = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Bold = styled.span`
  font-weight: bold;
  color: #dcf5e7;
`;

const Name = styled.span`
  color: #ebcb8b;
`;

const WatchList = styled(Holdings)``;

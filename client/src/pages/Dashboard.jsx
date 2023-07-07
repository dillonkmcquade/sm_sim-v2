import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";

import { getTotalValue, getInvestedValue } from "../utils/getTotalValue";

import PieChart from "../components/PieChart";
import TickerCard from "../components/TickerCard";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

export default function Dashboard() {
  const { forceUpdate } = useParams();
  const { getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const cachedUser = window.sessionStorage.getItem("user");
    if (cachedUser) {
      return JSON.parse(cachedUser);
    } else {
      return null;
    }
  });

  //get user object from backend
  useEffect(() => {
    async function getUser() {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`/user/${user.sub}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const { data } = await response.json();
        if (data.holdings.length === 0) return;
        const total = await getTotalValue(data); //This is why we are caching
        const modifiedObj = { ...data, total, timestamp: Date.now() };
        window.sessionStorage.setItem("user", JSON.stringify(modifiedObj));
        setCurrentUser(modifiedObj);
      } catch (err) {
        console.error(err.message);
      }
    }

    //Currently making separate api call to get the price of each stock,
    //This could get costly if the portfolio is large. Therefore we will
    //limit this by doing it once, caching it, and updating every 15 mins
    if (
      !currentUser ||
      forceUpdate ||
      Date.now() - currentUser.timestamp > 300000
    ) {
      getUser();
    }
  }, [forceUpdate]);

  const investedValue = currentUser ? getInvestedValue(currentUser) : 0;

  //filter holdings to just unique stock names
  const getUniques = (data) => {
    const unique = [...new Set(data.map((item) => item.ticker))];
    return unique;
  };

  return !currentUser ? (
    <Wrapper>
      <CircularProgress />
    </Wrapper>
  ) : (
    <Wrapper>
      <Title>
        {" "}
        Hello, <Name>{currentUser.name.split(" ")[0]}</Name>!
      </Title>
      <PortfolioValue>
        {Number(currentUser.total + currentUser.balance).toLocaleString(
          "en-US",
          { style: "currency", currency: "USD" }
        )}
      </PortfolioValue>
      <Profit
        color={currentUser.total - investedValue > 0 ? "#027326" : "#b5050e"}
      >
        {Number(currentUser.total - investedValue).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}{" "}
        all time
      </Profit>

      <div style={{ height: "500px", color: "black" }}>
        {currentUser.holdings.length === 0 ? (
          <p style={{ color: "white" }}>
            No holdings at this moment, please allow 5 minutes for new
            transactions to process
          </p>
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
              {currentUser.total.toLocaleString("en-US", {
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
        {currentUser.holdings.length === 0 ? (
          <p>
            No holdings at this moment, please allow 5 minutes for new
            transactions to process
          </p>
        ) : (
          getUniques(currentUser.holdings).map((holding) => (
            <TickerCard
              handler={() => navigate(`/research/${holding}`)}
              key={holding}
              ticker={holding}
            />
          ))
        )}
      </Holdings>
      <Title>Watch List</Title>
      <WatchList>
        {currentUser.watchList &&
          currentUser.watchList.map((item) => (
            <TickerCard
              key={item}
              ticker={item}
              handler={() => navigate(`/research/${item}`)}
            />
          ))}
      </WatchList>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  top: 56px;
  width: 100vw;
  height: 100vh;
`;

const Title = styled.h1`
  margin: 0 1rem 0 1rem;
`;
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
  margin: 1rem;
  padding: 0.5rem;
  color: gray;
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

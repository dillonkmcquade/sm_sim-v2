import { useEffect, useState, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";

import { getTotalValue, getInvestedValue } from "../utils/getTotalValue";

import PieChart from "../components/PieChart";
import TickerCard from "../components/TickerCard";
import { CircularProgress } from "@mui/material";

export default function Dashboard() {
  const { getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const cachedUser = window.localStorage.getItem("account");
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

        const total = await getTotalValue(data); //This is why we are caching

        const modifiedObj = { ...data, total, timestamp: Date.now() };
        setCurrentUser(modifiedObj);
        window.localStorage.setItem("account", JSON.stringify(modifiedObj));
      } catch (err) {
        console.error(err.message);
      }
    }
    const cached = window.localStorage.getItem("account");

    //Currently making separate api call to get the price of each stock,
    //This could get costly if the portfolio is large. Therefore we will
    //limit this by doing it once, caching it, and updating every 15 mins
    if (!cached || Date.now() - cached.timestamp > 300000) {
      getUser();
    }
  }, [getAccessTokenSilently, setCurrentUser, user]);

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
        <PieChart data={currentUser} />
      </div>
      <p>
        Total Value of all holdings:{" "}
        {currentUser.total.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </p>
      <p>
        Available cash:{" "}
        {currentUser.balance.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </p>
      <Title>Holdings</Title>
      <Holdings>
        {getUniques(currentUser.holdings).map((holding) => (
          <TickerCard
            handler={() => navigate(`/research/${holding}`)}
            key={holding}
            ticker={holding}
          />
        ))}
      </Holdings>
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

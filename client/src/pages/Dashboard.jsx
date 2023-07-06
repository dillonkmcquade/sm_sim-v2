import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { styled } from "styled-components";
import { getTotalValue, getInvestedValue } from "../utils/getTotalValue";

export default function Dashboard() {
  const { getAccessTokenSilently, user } = useAuth0();
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
        const total = await getTotalValue(data);
        const modifiedObj = { ...data, total, timestamp: Date.now() };
        setCurrentUser(modifiedObj);
        window.localStorage.setItem("account", JSON.stringify(modifiedObj));
      } catch (err) {
        console.error(err.message);
      }
    }
    const cached = window.localStorage.getItem("account");
    const { timestamp } = JSON.parse(cached);

    //Currently making separate api call to get the price of each stock,
    //This could get costly if the portfolio is large. Therefore we will
    //limit this by doing it once, caching it, and updating every 15 mins
    if (!cached || Date.now() - timestamp > 900000) {
      getUser();
    }
  }, []);

  const investedValue = currentUser ? getInvestedValue(currentUser) : 0;

  return (
    currentUser && (
      <Wrapper>
        <p>Total Value of all holdings: ${currentUser.total.toFixed(2)}</p>
        <p>
          Total value of account: $
          {Number(currentUser.total + currentUser.balance).toFixed(2)}
        </p>
        <p>profit: {(currentUser.total - investedValue).toFixed(2)}</p>
        {/*
        Nivo pie chart of holdings?

        show ticker cards of holdings

        watchlist

    */}
      </Wrapper>
    )
  );
}

const Wrapper = styled.div`
  position: relative;
  top: 56px;
  width: 100vw;
  height: 100vh;
`;

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
export default function Dashboard() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [currentUser, setCurrentUser] = useState(null);
  //get user object from backend
  useEffect(() => {
    (async () => {
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
        setCurrentUser(data);
      } catch (err) {
        console.error(err.message);
      }
    })();
  }, []);

  const getTotalValue = () => {
    return currentUser.holdings.reduce((accumulator, currentValue) => {
      return (
        accumulator +
        Number(currentValue.quantity) *
          Number(currentValue.price * (Math.random() * 2.2 - 1.1))
      );
    }, 0);
  };

  currentUser
    ? console.log(currentUser.balance + getTotalValue())
    : console.log("none");

  //calculate total value of account
  //
  //calculate profit ? if possible...
  //
  //
  return (
    <div>
      <p></p>
      {/*
        Nivo line chart of value ?

        show ticker cards of holdings

        show total value of account

        show current balance

        watchlist


    */}
    </div>
  );
}

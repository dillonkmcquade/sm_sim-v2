import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { styled } from "styled-components";
import useAggregateData from "../hooks/useTickerAggregateData";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { CircularProgress } from "@mui/material";

import usePurchaseReducer from "../hooks/usePurchaseReducer.js";
import Button from "../components/Button";
import Alert from "../components/Alert.jsx";

export default function Transaction() {
  const { id } = useParams();
  const { currentPrice } = useAggregateData(id);
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const {
    setLoading,
    updateQuantity,
    success,
    errorMessage,
    changeAction,
    state,
  } = usePurchaseReducer(id, currentPrice);
  const { confirmed, quantity, action, loading, error } = state;

  const [alignment, setAlignment] = useState("Buy");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    //fetch most recent balance
    const fetchBalance = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`/user/${user.sub}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data } = await response.json();
      setBalance(data.balance);
    };
    if (isAuthenticated) {
      fetchBalance();
    }
  }, []);

  const toggleAction = (event, newAlignment) => {
    setAlignment(newAlignment);
    changeAction(event.target.value);
  };

  const handleChange = (event) => {
    updateQuantity(event.target.value);
  };

  const submit = async () => {
    //patch to /buy/:id endpoint
    try {
      setLoading();
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`/${action}/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          _id: user.sub,
          quantity,
          currentPrice,
        }),
      });
      const parsed = await response.json();
      if (parsed.status === 200) {
        success();
      }
    } catch (error) {
      errorMessage(error.message);
    }
  };

  return (
    <Wrapper>
      <h3>Available to trade: ${balance}</h3>
      <p>{id}</p>
      <p>${currentPrice}</p>
      <label htmlFor="qty">Please select number of shares</label>
      <input
        value={quantity}
        type="number"
        id="qty"
        min={1}
        onChange={handleChange}
      />
      <ToggleButtonGroup
        color="secondary"
        value={alignment}
        exclusive
        onChange={toggleAction}
        aria-label="Platform"
      >
        <BuyOrSell selectedcolor="#32a842" value="buy">
          Buy
        </BuyOrSell>
        <BuyOrSell selectedcolor="#d63c44" value="sell">
          Sell
        </BuyOrSell>
      </ToggleButtonGroup>
      <Button
        disabled={loading}
        bg={loading ? " #5c5c63" : undefined}
        handler={submit}
      >
        {loading ? <CircularProgress /> : "Confirm Transaction"}
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
      {confirmed && <Alert severity="success">Purchase Confirmed</Alert>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  top: 56px;
  display: flex;
  flex-direction: column;
  padding: 5vw;
`;

const BuyOrSell = styled(ToggleButton)`
  &.MuiButtonBase-root {
    color: white;
    border: 1px solid white;
  }
  &.MuiButtonBase-root.Mui-selected {
    color: ${(props) => props.selectedcolor};
    background-color: #1b111c;
  }
`;

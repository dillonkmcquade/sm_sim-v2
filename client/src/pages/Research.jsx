import { useRef } from "react";
import {
  Alert,
  AlertTitle,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useDebounce } from "../hooks/useDebounce.js";
import TickerCard from "../components/TickerCard.jsx";
import useSearchReducer from "../hooks/useSearchReducer.js";

export default function Research() {
  const { startSearch, success, errorMessage, clear, updateField, state } =
    useSearchReducer();
  const { results, error, loading, inputText, isSelected } = state;

  const recentlyViewed = Object.keys(window.localStorage).filter(
    (key) => key !== "account"
  );
  const navigate = useNavigate();
  const ref = useRef(null);

  //some nice to have features for selecting w/ keyboard
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "Enter": {
        if (results && results.length > 0) {
          const result = results[isSelected];
          navigate(result.symbol);
        } else {
          errorMessage("no results selected");
        }
        return;
      }
      case "ArrowUp": {
        if (isSelected > 0) {
          updateField("isSelected", isSelected - 1);
        }
        break;
      }
      case "ArrowDown": {
        if (isSelected < results.length - 1) {
          updateField("isSelected", isSelected + 1);
        }
        break;
      }
      case "Escape": {
        clear();
        break;
      }
      default:
        return;
    }
  };

  //query to backend
  const search = async () => {
    startSearch();
    try {
      const request = await fetch(`/search?name=${inputText}`);
      const response = await request.json();
      if (response.status === 200) {
        success(response.results);
      } else {
        errorMessage(response.message);
      }
    } catch (error) {
      errorMessage(error.message);
    }
  };

  //only query backend once typing has stopped 300ms delay
  const debouncedSearch = useDebounce(search, 300);

  const handleChange = (event) => {
    event.preventDefault();
    updateField("inputText", event.target.value);

    if (event.target.value.length > 1) {
      debouncedSearch();
    }
  };

  return (
    <Wrapper>
      <Title>Search Stocks</Title>
      <SearchForm onSubmit={(event) => event.preventDefault()}>
        <WhiteBorderTextField
          id="searchField"
          variant="outlined"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={inputText}
          type="text"
          size="small"
          autoFocus={true}
          InputProps={{
            startAdornment: <SearchIcon />,
            endAdornment: loading ? (
              <CircularProgress size="16px" sx={{ color: "white" }} />
            ) : (
              inputText && (
                <IconButton onClick={clear}>
                  <ClearIcon size="16px" sx={{ color: "white" }} />
                </IconButton>
              )
            ),
          }}
          label="Search"
        />
        {results &&
          results.map((result, index) => (
            <SearchResult
              isselected={index === isSelected ? "#0f1410" : undefined}
              ref={index === isSelected ? ref : null}
              key={Math.random()}
              tabIndex={0}
              onClick={() => navigate(result.symbol)}
            >
              <Ticker>{result.symbol}</Ticker>
              <Name>{result.description}</Name>
            </SearchResult>
          ))}
      </SearchForm>

      <div style={{ height: "20vh" }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              backgroundColor: "rgb(22, 11, 11)",
              width: "80vw",
              borderRadius: "1rem",
              margin: "1rem auto",
            }}
          >
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
      </div>

      <Title>Recently Viewed</Title>

      <RecentlyViewed>
        {recentlyViewed.map((key) => (
          <TickerCard
            key={key}
            ticker={key}
            handler={() => navigate(key)}
          ></TickerCard>
        ))}
      </RecentlyViewed>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  position: relative;
  color: #d8dee9;
  top: 56px;
  width: 85vw;
  @media (min-width: 500px) {
    max-width: 1400px;
    margin: 0 auto;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  margin-left: 1rem;
`;

const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const WhiteBorderTextField = styled(TextField)`
  width: 100%;
  align-self: center;
  & label {
    color: gray;
    align-self: center;
  }
  & label.Mui-focused {
    color: #88c0d0;
  }
  & .MuiOutlinedInput-root {
    color: #d8dee9;
    & fieldset {
      border-color: white;
      color: white;
    }
    &:hover fieldset {
      border-color: #b2bac2;
    }
    ,
    &.Mui-focused fieldset {
      border-color: white;
      color: white;
    }
  }
`;

const SearchResult = styled.div`
  margin: 0 auto;
  padding: 0.2rem;
  border-bottom: 1px solid gray;
  cursor: pointer;
  width: 100%;
  background-color: ${(props) => props.isselected};
  animation: none !important;
  transition: none !important

  &:hover {
    background-color: #0f1410;
  }
  &:focus {
    outline: none;
  }
`;

const Ticker = styled.div`
  font-style: italic;
  color: gray;
  animation: none !important;
  transition: none !important;
`;
const Name = styled.div`
  animation: none !important;
  transition: none !important;
`;

const RecentlyViewed = styled.div`
  display: flex;
  overflow: auto;
`;

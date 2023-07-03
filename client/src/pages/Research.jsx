import { useState, useRef } from "react";
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

export default function Research() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isSelected, setIsSelected] = useState(0);

  const navigate = useNavigate();
  const ref = useRef(null);

  //some nice to have features for selecting w/ keyboard
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "Enter": {
        const result = results[isSelected];
        navigate(result.ticker);
        return;
      }
      case "ArrowUp": {
        if (isSelected > 0) {
          setIsSelected(isSelected - 1);
        }
        break;
      }
      case "ArrowDown": {
        if (isSelected < results.length - 1) {
          setIsSelected(isSelected + 1);
        }
        break;
      }
      case "Escape": {
        clearSearch();
        break;
      }
      default:
        return;
    }
  };

  //query to backend
  const search = async () => {
    setLoading(true);
    try {
      const request = await fetch(`/search?name=${inputText}`);
      const response = await request.json();
      if (response.status === 200) {
        setResults(response.results);
      } else {
        setError(response.message);
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setResults(null);
      setLoading(false);
    }
  };

  //only query backend once typing has stopped 500ms delay
  const debouncedSearch = useDebounce(search);

  const handleChange = (event) => {
    event.preventDefault();
    setInputText(event.target.value);

    if (event.target.value.length > 3) {
      debouncedSearch();
    } else {
      setResults(null);
    }
    setError("");
  };

  const clearSearch = function () {
    setResults(null);
    setInputText("");
  };

  return (
    <Wrapper>
      <Title>Search Stocks</Title>
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
      <SearchForm onSubmit={(event) => event.preventDefault()}>
        <WhiteBorderTextField
          id="searchField"
          variant="outlined"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={inputText}
          type="text"
          size="small"
          tabIndex="0"
          autoFocus={true}
          InputProps={{
            startAdornment: <SearchIcon />,
            endAdornment: loading ? (
              <CircularProgress size="16px" sx={{ color: "white" }} />
            ) : (
              results && (
                <IconButton onClick={clearSearch}>
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
              isselected={index === isSelected && "#0f1410"}
              ref={index === isSelected ? ref : null}
              key={Math.random()}
              tabIndex={0}
              onClick={() => navigate(`/research/${result.ticker}`)}
            >
              <Ticker>{result.ticker}</Ticker>
              <Name>{result.name}</Name>
            </SearchResult>
          ))}
      </SearchForm>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  position: relative;

  color: #d8dee9;
  top: 56px;
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
  width: 85vw;
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
  width: 85vw;
  margin: 0 auto;
  padding: 0.2rem;
  border-bottom: 1px solid gray;
  cursor: pointer;
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

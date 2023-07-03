import { useState, useEffect } from "react";
import {
  Alert,
  AlertTitle,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import { styled } from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export default function Research() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  const submitSearch = async (input) => {
    setLoading(true);
    if (input.length < 2) {
      return;
    }
    try {
      const request = await fetch(`/search?name=${input}`);
      const response = await request.json();
      if (response.status === 200) {
        setLoading(false);
        setResults(response.results);
      } else {
        setLoading(false);
        setError(response.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  //only query backend once typing has stopped
  const debounce = function (fn, t) {
    let timer;
    return function (...args) {
      if (timer !== undefined) {
        console.log("debounced");
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        return fn(...args);
      }, t);
    };
  };

  const debouncedSubmit = debounce(submitSearch, 300);

  const handleChange = (event) => {
    event.preventDefault();
    setInputText(event.target.value);
    if (event.target.value.length > 1) {
      debouncedSubmit(event.target.value);
    } else {
      setResults(null);
    }
    setError("");
  };

  useEffect(() => {
    if (inputText === "") {
      setResults(null);
    }
  }, [inputText]);

  return (
    <Wrapper>
      <Title>Search Stocks</Title>
      <SearchForm>
        <WhiteBorderTextField
          id="searchField"
          variant="outlined"
          value={inputText}
          onChange={handleChange}
          type="text"
          size="small"
          InputProps={{
            startAdornment: <SearchIcon />,
            endAdornment: loading ? (
              <CircularProgress size="16px" sx={{ color: "white" }} />
            ) : (
              results && (
                <IconButton onClick={() => setInputText("")}>
                  <ClearIcon size="16px" sx={{ color: "white" }} />
                </IconButton>
              )
            ),
          }}
          label="Search"
        />
      </SearchForm>
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
      {results && results.map((result) => <p>{result.name}</p>)}
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

const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
`;

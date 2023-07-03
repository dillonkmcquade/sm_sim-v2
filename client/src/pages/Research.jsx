import { useState } from "react";
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
import { useDebounce } from "../hooks/useDebounce.js";

export default function Research() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  const submitSearch = async () => {
    setLoading(true);
    try {
      const request = await fetch(`/search?name=${inputText}`);
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
      setResults(null);
    }
  };
  //only query backend once typing has stopped

  const debouncedSubmit = useDebounce(submitSearch);

  const handleChange = (event) => {
    setInputText(event.target.value);

    if (event.target.value.length > 1) {
      debouncedSubmit();
    } else {
      setResults(null);
    }

    setError("");
  };

  return (
    <Wrapper>
      <Title>Search Stocks</Title>
      <SearchForm>
        <WhiteBorderTextField
          id="searchField"
          variant="outlined"
          onChange={handleChange}
          value={inputText}
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

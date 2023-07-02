import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, CircularProgress, TextField } from "@mui/material";
import { styled } from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
export default function Research() {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    const request = await fetch(`/getTickers/${searchInput.toUpperCase()}`);
    const response = await request.json();
    if (response.status === 200) {
      setLoading(false);
      navigate(`${searchInput.toUpperCase()}`);
    } else {
      setLoading(false);
      setError(response.message);
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    setSearchInput(event.target.value);
    setError("");
  };

  return (
    <Wrapper>
      <Title>Search Stocks</Title>
      <SearchForm onSubmit={submitSearch}>
        <WhiteBorderTextField
          id="searchField"
          variant="outlined"
          onChange={handleChange}
          type="text"
          size="small"
          InputProps={{
            startAdornment: <SearchIcon />,
            endAdornment: loading && (
              <CircularProgress size="16px" sx={{ color: "white" }} />
            ),
          }}
          label="Search by ticker... e.g. AAPL"
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

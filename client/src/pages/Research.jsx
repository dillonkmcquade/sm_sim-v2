import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { styled } from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
export default function Research() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const submitSearch = (event) => {
    event.preventDefault();
    navigate(`${searchInput.toUpperCase()}`);
  };
  return (
    <Wrapper>
      <Title>Search Stocks</Title>
      <SearchForm onSubmit={submitSearch}>
        <WhiteBorderTextField
          id="searchField"
          variant="outlined"
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          size="small"
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          label="Search by ticker... e.g. AAPL"
        />
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
